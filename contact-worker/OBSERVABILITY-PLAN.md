# F-011: Worker monitoring and alerting plan

**DRAFT ONLY — no Cloudflare settings changed.**

## Event coverage
- Track aggregate request counts by outcome: success, validation failure, Turnstile failure, rate limit, Resend failure, missing configuration, unexpected exception.
- Alert on sustained 5xx responses, delivery failure spikes, abnormal 429 rates and Worker deployment/configuration changes.
- Schedule a controlled synthetic form submission and verify receipt in the expected mailbox.

## Privacy and safety
- Never log form names, emails, messages, Turnstile tokens, Resend authorization headers, full request bodies or raw IP addresses.
- Existing code logs only Resend status on delivery failure. Maintain this restriction.
- Prefer aggregated counters or redacted structured events. Review sampling, access roles, log retention, provider geography, cost and incident escalation before enabling logs.
- Set retention only after F-009 approval; ensure processor/vendor disclosures match actual logging.

## Deployment checklist
1. Inspect current Worker observability, dashboard logs, alerts and plan limits.
2. Confirm owner, monitored notification destination, retention, cost and false-positive thresholds.
3. Enable selected metrics/logging through a separately approved production change.
4. Verify a safe failure event is visible without personal data, and test an alert.
5. Document evidence, alert runbook and rollback.
