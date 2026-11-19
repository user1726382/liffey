# F-008: contact Worker rate-limit deployment plan

**DRAFT — no production change made.** The proposed Worker requires a Cloudflare Workers Rate Limiting binding named `CONTACT_RATE_LIMITER`. It fails closed (HTTP 503) if absent. Do not deploy code until the binding is configured and tested in staging.

Suggested initial binding: 5 requests per 60 seconds per `CF-Connecting-IP`, subject to plan support and real traffic measurement. Rate limiting is an abuse-control supplement, not a global Resend budget limit; also configure provider spending/volume alerts. Cloudflare rate-limit counters can be approximate and may not guarantee strict global enforcement. The limit is evaluated after origin, feature and field checks but before Turnstile verification and Resend sends. Unknown IP uses one shared bucket.

Preflight: verify binding compatibility and cost, test valid submission, 429 response after threshold, 503 on missing binding, Turnstile failure, no credentials in logs, and no false positives behind shared networks. Verify rate-limit response in the frontend and set a user-friendly retry message before production merge. Rollback: redeploy previous Worker version; preserve secret bindings.
