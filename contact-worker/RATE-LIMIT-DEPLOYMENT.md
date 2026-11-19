# F-008: contact Worker rate-limit deployment plan

**DRAFT — no production change made.** The proposed Worker requires a Cloudflare Workers Rate Limiting binding named `CONTACT_RATE_LIMITER`. It fails closed (HTTP 503) if absent. Do not deploy code until the binding is configured and tested in staging.

Suggested initial binding: 5 requests per 60 seconds per `CF-Connecting-IP`, subject to plan support and real traffic measurement. Rate limiting is an abuse-control supplement, not a global Resend budget limit; also configure provider spending/volume alerts. Cloudflare rate-limit counters can be approximate and may not guarantee strict global enforcement. The limit is evaluated after origin, feature and field checks but before Turnstile verification and Resend sends. Unknown IP uses one shared bucket.

Preflight: verify binding compatibility and cost, test valid submission, 429 response after threshold, 503 on missing binding, Turnstile failure, no credentials in logs, and no false positives behind shared networks. Verify rate-limit response in the frontend and set a user-friendly retry message before production merge. Rollback: redeploy previous Worker version; preserve secret bindings.

## Implementation and automated tests (19 November 2026)
- Worker now rejects actual streamed request bodies exceeding 12,000 bytes, even when Content-Length is missing or inaccurate, and rejects null/array JSON without an exception.
- The public contact-form JavaScript displays localized retry messages for HTTP 429 and HTTP 503.
- `contact-worker/worker.test.mjs` covers successful delivery, rate-limit rejection, missing/erroring binding, invalid origin, malformed JSON, oversized body, Turnstile failure, Resend failure and best-effort acknowledgement.
- GitHub Actions `Contact Worker tests` completed successfully: https://github.com/user1726382/liffey/actions/runs/44535032880

## Rate-limit binding example (configuration only; do not deploy as-is)
For Wrangler, add the following to the **existing** Worker configuration, retaining all current secrets and bindings. Choose an account-unique integer namespace identifier; `1001` below is an example, **not** a verified assigned ID.

```toml
[[ratelimits]]
name = "CONTACT_RATE_LIMITER"
namespace_id = "1001"

  [ratelimits.simple]
  limit = 5
  period = 60
```

Cloudflare documents this binding at https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ . Confirm account plan support and test in staging. The live Worker currently lacks `CONTACT_RATE_LIMITER`; deploying this code before configuring the binding will cause valid form submissions to return HTTP 503. F-011 also edits the Worker; reconcile and rerun tests before deployment.
