# F-001 — Email authentication enforcement plan
**Status:** DRAFT — verified DNS observations, no DNS or Microsoft 365 settings changed.

## Current observed DNS — 19 November 2026
- One root SPF TXT record authorizes Microsoft 365: `v=spf1 include:spf.protection.outlook.com ~all`.
- Microsoft 365 MX record is present.
- Both Microsoft 365 selector CNAMEs resolve to `*.dkim.mail.microsoft`.
- DMARC TXT exists: `v=DMARC1; p=none; pct=100`. This **does not** quarantine or reject spoofed mail, and no aggregate reporting destination (`rua`) is configured.
- Resend sender authentication and any additional sending domains must be independently confirmed.
- **Important:** CNAME presence is not proof Microsoft 365 DKIM signing is enabled; inspect the Microsoft 365 Defender DKIM settings and headers of a delivered external test email.

## Prerequisites before any enforcement
1. Identify every authorized sender: Microsoft 365, Resend and any other service that sends with the organizational domain. Record From domain, return-path domain, SPF pass, DKIM signing domain and DMARC alignment for each.
2. Confirm Microsoft 365 DKIM is **enabled**, not merely that selectors resolve. Send an external message and examine `Authentication-Results` for `dkim=pass` and `dmarc=pass` with the expected aligned domains.
3. Send a real test message through the contact Worker / Resend to an external mailbox. Verify the sender domain, `dkim=pass`, `spf=pass` where applicable and `dmarc=pass`; preserve redacted header evidence.
4. Decide who will monitor DMARC aggregate reports. Create and verify a dedicated mailbox or use a vetted DMARC reporting service; document report data processing, retention, access and cost.
5. Confirm the proposed `rua` address is operational **before** editing DMARC. Do not invent an email destination or point reports to an unmonitored mailbox.

## Controlled rollout (requires separate approval for every DNS change)
- **Stage 0:** Add verified `rua=mailto:<approved-address>` to the existing `p=none` record. Keep exactly one DMARC TXT record. Observe reports for at least 2–4 weeks or until all legitimate sending sources are understood.
- **Stage 1:** Consider `p=quarantine; pct=25` only after legitimate mail is aligned and owner approves; monitor delivery and aggregate reports.
- **Stage 2:** Increase to `p=quarantine; pct=100`, then consider `p=reject` after stable results and a documented rollback plan.
- For each stage, record the DNS before/after, approver, date, aggregate report trend, external delivery tests and rollback condition.
- Evaluate subdomain policy (`sp`), alignment modes (`adkim`, `aspf`) and forwarding/mailing-list behavior before tightening them.
- Do not add another root SPF record. Preserve Microsoft 365 MX, Resend records and any existing sender configuration.

## Closure criteria
- [ ] All legitimate mail sources inventoried and verified
- [ ] Microsoft 365 DKIM enabled and external header test passed
- [ ] Resend external header test passed
- [ ] DMARC aggregate reporting active and monitored
- [ ] DMARC policy enforced after staged validation
- [ ] Owners, incident response, rollback and periodic rechecks documented

The read-only `scripts/check-mail-auth.mjs` and associated GitHub Actions workflow can alert on DNS regressions, but **cannot** verify outbound signing or enforce DNS changes.
