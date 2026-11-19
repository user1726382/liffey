# F-011: Worker monitoring and alerting plan

**DRAFT ONLY — no Cloudflare settings changed or Worker deployed.** The accompanying Worker source change emits JSON warning events for HTTP 403, 429 and 5xx with only `event`, `status` and controlled `code` fields. It never includes form data or IP addresses. Success counts and 4xx validation counts require platform metrics or additional approved instrumentation.

## Event coverage
- Track aggregate request counts by outcome: success, validation failure, Turnstile failure, rate limit, Resend failure, missing configuration, unexpected exception.
- Alert on sustained 5xx responses, delivery failure spikes, abnormal 429 rates and Worker deployment/configuration changes.
- Schedule a controlled synthetic form submission and verify receipt in the expected mailbox.

## Privacy and safety
- Never log form names, emails, messages, Turnstile tokens, Resend authorization headers, full request bodies or raw IP addresses.
- Existing code logs Resend status on delivery failure; the proposed change adds coarse error-classification events only. Cloudflare platform/runtime logging may have its own metadata and retention behavior, which must be reviewed separately.
- Prefer aggregated counters or redacted structured events. Review sampling, access roles, log retention, provider geography, cost and incident escalation before enabling logs.
- Set retention only after F-009 approval; ensure processor/vendor disclosures match actual logging.

## Deployment checklist
1. Inspect current Worker observability, dashboard logs, alerts and plan limits.
2. Confirm owner, monitored notification destination, retention, cost and false-positive thresholds.
3. Enable selected metrics/logging through a separately approved production change.
4. Verify a safe failure event is visible without personal data, and test an alert.
5. Document evidence, alert runbook and rollback.

## Integration warning
F-008 and F-011 both edit `contact-worker/worker.js` in separate draft branches. Reconcile their changes and rerun the F-008 Worker unit tests before any deployment; do not merge either in isolation without verifying the final combined Worker.

## Deployment evidence — 19 November 2026
- Cloudflare Worker version `f5717f49-0295-47c7-aa33-e8956ead03dd` active with `observability.enabled=true`, persisted logs, `invocation_logs=false`, query-string redaction, and no traces.
- Structured application errors log controlled `event`, `status`, `code` only; not enquiry content, tokens or IPs.
- Cloudflare notification policy **Liffey Worker real-time issues** enabled, routed to `security@liffey-consulting.com`. Cloudflare API test returned success; human confirmation of delivery and escalation is outstanding.
- Provider-controlled log retention, alert effectiveness, and live error-rate thresholds remain unverified; do not assert a 30-day Cloudflare retention period without evidence.
