# Liffey Consulting — ICT/InfoSec audit remediation register
**Updated:** 19 November 2026. **Scope:** audit findings F-001–F-014. **Important:** A GitHub merge is not equivalent to an effective Cloudflare, Microsoft 365, Resend or registrar control. "Closed" requires evidence of the live control and a tested outcome.

| Finding | Current status | Implemented evidence | Outstanding closure test/action |
|---|---|---|---|
| F-001 — Email authentication (High) | PARTIAL | SPF/DKIM/DMARC/MX DNS checks passed; GitHub PR #16 merged, scheduled read-only audit; owner enabled M365 DKIM | Verify DKIM-Signature and DMARC alignment on a real M365 outbound message; check Resend alignment; collect DMARC reports, then phase p=none -> quarantine -> reject only after evidence |
| F-002 — Branch protection (High) | PARTIAL | GitHub ruleset 27635968 active and targets only main and gh-pages; PR requirement enabled | Require >=1 independent reviewer and passing static-site check, prevent bypass, test rejection of failing PR; current approving-review count is 0 and no required status checks |
| F-003 — Contact privacy notices (High) | IMPLEMENTED IN GIT / LEGAL VALIDATION OPEN | PR #6 merged into gh-pages with EN/DE contact form, Cloudflare/Resend disclosures, candidate/cookie notices and retention targets | Verify live HTML, processor agreements, international transfers and technical deletion against the statements; legal approval and candidate Art. 13/14 disclosures before active recruitment |
| F-004 — Serviceable address (Medium) | IMPLEMENTED IN GIT / VERIFY LIVE | Owner-confirmed Liffey GbR, Gustav-Adolf-Straße 13, 63069 Offenbach am Main, Germany; EN/DE imprint/privacy/candidate pages merged in PR #6 | Confirm actual serviceability and live site publication; no assumption about tax registration or Irish establishment |
| F-005 — MFA enforcement (Medium) | OPEN | Individual Cloudflare administrator reported MFA enabled | Verify all Cloudflare members and Microsoft 365 admins have phishing-resistant MFA; enforce centrally if supported; retain recovery codes securely |
| F-006 — DNSSEC (Low) | PARTIAL / AUTOMATIC REGISTRAR DELEGATION | Cloudflare DNSSEC activated; Cloudflare Registrar registration verified, DS provisioning automatic; status pending | Wait for automatic DS publication (Cloudflare documents up to 1–2 days), then independently verify parent DS and signed DNS responses. Do not manually add duplicate DS or change nameservers |
| F-007 — Cloudflare admin resilience (Medium) | PARTIAL | Admin recovery policy merged PR #11; second Super Admin invitation pending to alternate founder | Alternate founder accepts invite, enrolls MFA, verifies access and recovery; then reduce any unnecessary privileges |
| F-008 — Contact Worker rate limiting (Low) | DEPLOYED / E2E OPEN | PR #17 merged; Cloudflare Worker active with CONTACT_RATE_LIMITER, namespace 260119, approximate 5 requests/60 s/location; original secret bindings preserved | Test actual contact submission, Turnstile, 429 limit, Resend delivery and rollback. Rate limit is approximate, not globally strict |
| F-009 — GDPR retention (Medium) | POLICY ADOPTED / TECHNICAL OPEN | PR #12 merged; approved German-market schedule and manual rights/deletion procedures | Implement and verify retention/deletion in Microsoft 365, files, backups and Resend; verify Cloudflare log retention; Irish-law review where applicable; document deletion evidence |
| F-010 — Vulnerability disclosure (Medium) | IMPLEMENTED IN GIT / LIVE HTTP TEST OPEN | security@ mailbox created and inbound test reported; SECURITY.md merged PR #8; standard /.well-known/security.txt merged in PR #19; GitHub Pages deployment workflow succeeded | Verify public security.txt URL via external HTTP, test outbound reply and responsible mailbox monitoring |
| F-011 — Worker monitoring (Low) | CONFIGURED / ALERT TEST OPEN | PR #17 merged; Cloudflare Worker observability/logs enabled, invocation logs off, query-string redaction; alert policy c5241a27f4724d388feea08813c6a7d3 to security@; API test returned success | Confirm test email arrives, alert actually fires on genuine Worker issue, review provider retention and incident response escalation |
| F-012 — Resend least privilege (Medium) | OPEN | PR #14 merged documenting scope review | ChatGPT Resend OAuth grant remains full_access; owner must explicitly approve revocation/reconnection after confirming replacement scope; API key domain/permissions also need verification. Never revoke a live Worker key without migration |
| F-013 — Cloudflare Pages / WAF (Low) | LIVE CUTOVER / APEX CERT PENDING | Git-connected production project `liffey-consulting` deployed 127 public files, Pages deployment `b7cca2f9-bebb-4bd8-9f87-259ff8b4ad5e` successful; `www` custom domain active and proxied, apex proxied CNAME plus canonical 301 redirect configured; browser rendering verified homepage/favicon and contact page | Wait for apex custom domain certificate to become active, verify apex redirect and HTTPS, complete EN/DE and form live checks, then confirm F-013 closed; do not change repository visibility until fully verified |
| F-014 — Release controls (Medium) | CI ACTIVE / ENFORCEMENT OPEN | PRs #10 and #15 merged: static-site CI on PRs, security PR template; PR #19 merged: post-merge push validation passed (GitHub Actions 44545124771) | Configure required passing GitHub check and independent approval in ruleset; test a blocked failing PR and rollback |
 
## DNSSEC registrar follow-up
Cloudflare generated this DS record on 19 November 2026. This is public cryptographic delegation data, **not a password**:

`liffey-consulting.com. 3600 IN DS 2371 13 2 43048181E46C7E71A0211EFA5BFE6E61A0A97C3FCCB61465700707F202A5A056`

The domain is registered with **Cloudflare Registrar** (verified 19 November 2026). Cloudflare automatically publishes the DS record to the registry; **do not manually add a duplicate DS record**. Cloudflare documents that automatic delegation may take 1–2 days. Confirm that Cloudflare DNSSEC moves from pending to active, and independently validate the parent-zone DS and signed answers before closure.

## Worker deployment and rollback
- Worker: `liffey-contact-form`; production version after observability settings: `f5717f49-0295-47c7-aa33-e8956ead03dd` (100% traffic).
- Previously deployed known-good version: `28dcd7ef-6f85-4ba5-a4ee-1e67201d0cc8`. Rollback via Cloudflare Workers deployment API if production submission failures occur; confirm no other intervening changes.
- No credentials, contact content or IPs are included in this register.

## Final closure requirements
No finding is considered fully closed merely because its PR was merged. Require live configuration evidence, functional verification, a named owner and recorded date. The remaining account, registrar and legal controls cannot be fixed solely by committing code.

## Search branding and sitemap — 19 November 2026
- PR #22 merged: 96×96 branded PNG `/favicon.png`, explicit homepage favicon link, Cloudflare Pages build inclusion and CI validation. GitHub Pages deployment succeeded. Google Search may require days or weeks to recrawl; appearance is not guaranteed.
- PR #23 merged: corrected robots.txt sitemap URL and all 75 sitemap entries from obsolete GitHub Pages URL to `https://www.liffey-consulting.com`. GitHub Pages deployment validation is required before marking live verified.

## Production Pages cutover — 19 November 2026
- Production project `liffey-consulting` uses GitHub `user1726382/liffey`, branch `gh-pages`, public-only `dist` build and CI validation. Successful deployment `b7cca2f9-bebb-4bd8-9f87-259ff8b4ad5e` uploaded 127 files.
- DNS changes: `www` CNAME from `user1726382.github.io` (DNS only) to `liffey-consulting.pages.dev` (proxied); four apex GitHub Pages A records removed and replaced with proxied CNAME to `liffey-consulting.pages.dev`. Microsoft 365 and Resend mail records left untouched.
- Cloudflare zone redirect ruleset `2902b198be514ef693c623a4573b2a53`: apex hostname to `https://www.liffey-consulting.com` with 301, preserving path/query.
- `www` custom domain status active; apex verification active but HTTP certificate validation pending at latest check. Do not claim complete until active.
- Cloudflare Browser Rendering verified live www homepage (favicon, index/follow, canonical) and contact page (production Worker URL and Turnstile, form not disabled). No live form submission made.
- Rollback DNS: `www` CNAME `user1726382.github.io`, DNS-only; apex A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, DNS-only. Disable apex-to-www redirect only if necessary during rollback. Preserve mail DNS and Cloudflare DNSSEC state.
- Cloudflare Worker settings independently verified: `liffey-contact-form` has `CONTACT_RATE_LIMITER` binding and observability enabled. Production form end-to-end delivery not yet tested.
- Historical email alert for `checkout-worker` refers to 14 exceptions on 27 October 2022; current Workers list contains `liffey-contact-form` only. Do not infer a present Liffey incident from this historical alert.
