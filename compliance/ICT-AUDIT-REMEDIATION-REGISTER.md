# Liffey Consulting — ICT/InfoSec audit remediation register
**Updated:** 19 November 2026. **Scope:** audit findings F-001–F-014. **Important:** A GitHub merge is not equivalent to an effective Cloudflare, Microsoft 365, Resend or registrar control. "Closed" requires evidence of the live control and a tested outcome.

| Finding | Current status | Implemented evidence | Outstanding closure test/action |
|---|---|---|---|
| F-001 — Email authentication (High) | PARTIAL | SPF/DKIM/DMARC/MX DNS checks passed; GitHub PR #16 merged, scheduled read-only audit; owner enabled M365 DKIM | Verify DKIM-Signature and DMARC alignment on a real M365 outbound message; check Resend alignment; collect DMARC reports, then phase p=none -> quarantine -> reject only after evidence |
| F-002 — Branch protection (High) | PARTIAL | GitHub ruleset 27635968 active and targets only main and gh-pages; PR requirement enabled | Require >=1 independent reviewer and passing static-site check, prevent bypass, test rejection of failing PR; current approving-review count is 0 and no required status checks |
| F-003 — Contact privacy notices (High) | IMPLEMENTED IN GIT / LEGAL VALIDATION OPEN | PR #6 merged into gh-pages with EN/DE contact form, Cloudflare/Resend disclosures, candidate/cookie notices and retention targets | Verify live HTML, processor agreements, international transfers and technical deletion against the statements; legal approval and candidate Art. 13/14 disclosures before active recruitment |
| F-004 — Serviceable address (Medium) | IMPLEMENTED IN GIT / VERIFY LIVE | Owner-confirmed Liffey GbR, Gustav-Adolf-Straße 13, 63069 Offenbach am Main, Germany; EN/DE imprint/privacy/candidate pages merged in PR #6 | Confirm actual serviceability and live site publication; no assumption about tax registration or Irish establishment |
| F-005 — MFA enforcement (Medium) | OPEN | Individual Cloudflare administrator reported MFA enabled | Verify all Cloudflare members and Microsoft 365 admins have phishing-resistant MFA; enforce centrally if supported; retain recovery codes securely |
| F-006 — DNSSEC (Low) | PARTIAL / REGISTRAR PENDING | Cloudflare DNSSEC activated via API; initial response status pending and DS issued | Add/confirm DS at domain registrar, wait for parent delegation, validate DNSSEC externally before marking closed. Avoid changing nameservers. See section below |
| F-007 — Cloudflare admin resilience (Medium) | PARTIAL | Admin recovery policy merged PR #11; second Super Admin invitation pending to alternate founder | Alternate founder accepts invite, enrolls MFA, verifies access and recovery; then reduce any unnecessary privileges |
| F-008 — Contact Worker rate limiting (Low) | DEPLOYED / E2E OPEN | PR #17 merged; Cloudflare Worker active with CONTACT_RATE_LIMITER, namespace 260119, approximate 5 requests/60 s/location; original secret bindings preserved | Test actual contact submission, Turnstile, 429 limit, Resend delivery and rollback. Rate limit is approximate, not globally strict |
| F-009 — GDPR retention (Medium) | POLICY ADOPTED / TECHNICAL OPEN | PR #12 merged; approved German-market schedule and manual rights/deletion procedures | Implement and verify retention/deletion in Microsoft 365, files, backups and Resend; verify Cloudflare log retention; Irish-law review where applicable; document deletion evidence |
| F-010 — Vulnerability disclosure (Medium) | PARTIAL | security@ mailbox created and inbound test reported; SECURITY.md merged PR #8; standard /.well-known/security.txt submitted as PR #19 | Merge PR #19, verify public URL, test outbound reply and responsible mailbox monitoring |
| F-011 — Worker monitoring (Low) | CONFIGURED / ALERT TEST OPEN | PR #17 merged; Cloudflare Worker observability/logs enabled, invocation logs off, query-string redaction; alert policy c5241a27f4724d388feea08813c6a7d3 to security@; API test returned success | Confirm test email arrives, alert actually fires on genuine Worker issue, review provider retention and incident response escalation |
| F-012 — Resend least privilege (Medium) | OPEN | PR #14 merged documenting scope review | ChatGPT Resend OAuth grant remains full_access; owner must explicitly approve revocation/reconnection after confirming replacement scope; API key domain/permissions also need verification. Never revoke a live Worker key without migration |
| F-013 — Cloudflare Pages / WAF (Low) | PARTIAL / STAGING QUEUED | PR #13 merged with public-only allowlisted dist build and tests; isolated Git-connected Pages project liffey-consulting-staging created | Cloudflare staging deployment stuck queued; resolve GitHub integration/build queue, verify pages.dev noindex/disabled form, then plan production project, HTTPS/DNS cutover and proxy; only make GitHub repo private after stable migration |
| F-014 — Release controls (Medium) | PARTIAL | PRs #10 and #15 merged: static-site CI on PRs, security PR template; PR #19 adds post-merge push validation | Merge PR #19, configure required passing GitHub check and independent approval in ruleset; test a blocked failing PR and rollback |
 
## DNSSEC registrar follow-up
Cloudflare generated this DS record on 19 November 2026. This is public cryptographic delegation data, **not a password**:

`liffey-consulting.com. 3600 IN DS 2371 13 2 43048181E46C7E71A0211EFA5BFE6E61A0A97C3FCCB61465700707F202A5A056`

If the registrar does not automatically publish DS records, enter key tag **2371**, algorithm **13**, digest type **2**, and digest **43048181E46C7E71A0211EFA5BFE6E61A0A97C3FCCB61465700707F202A5A056** at the registrar. Before changing registrar records, confirm there are no stale/competing DS records. Validate the parent-zone DS and signed answers from independent resolvers before closure. Cloudflare status was **pending** immediately after activation.

## Worker deployment and rollback
- Worker: `liffey-contact-form`; production version after observability settings: `f5717f49-0295-47c7-aa33-e8956ead03dd` (100% traffic).
- Previously deployed known-good version: `28dcd7ef-6f85-4ba5-a4ee-1e67201d0cc8`. Rollback via Cloudflare Workers deployment API if production submission failures occur; confirm no other intervening changes.
- No credentials, contact content or IPs are included in this register.

## Final closure requirements
No finding is considered fully closed merely because its PR was merged. Require live configuration evidence, functional verification, a named owner and recorded date. The remaining account, registrar and legal controls cannot be fixed solely by committing code.
