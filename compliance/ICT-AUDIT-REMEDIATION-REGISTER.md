# Liffey Consulting — ICT/InfoSec audit remediation register
**Updated:** 19 November 2026. **Scope:** audit findings F-001–F-014. **Important:** A GitHub merge is not equivalent to an effective Cloudflare, Microsoft 365, Resend or registrar control. "Closed" requires evidence of the live control and a tested outcome.

| Finding | Current status | Implemented evidence | Outstanding closure test/action |
|---|---|---|---|
| F-001 — Email authentication (High) | PARTIAL | SPF/DKIM/DMARC/MX DNS checks passed; GitHub PR #16 merged, scheduled read-only audit; owner enabled M365 DKIM | Verify DKIM-Signature and DMARC alignment on a real M365 outbound message; check Resend alignment; collect DMARC reports, then phase p=none -> quarantine -> reject only after evidence |
| F-002 — Branch protection (High) | PARTIAL | GitHub ruleset 27635968 active and targets only main and gh-pages; PR requirement enabled | Require >=1 independent reviewer and passing static-site check, prevent bypass, test rejection of failing PR; current approving-review count is 0 and no required status checks |
| F-003 — Contact privacy notices (High) | IMPLEMENTED IN GIT / LEGAL VALIDATION OPEN | PR #6 merged into gh-pages with EN/DE contact form, Cloudflare/Resend disclosures, candidate/cookie notices and retention targets | Verify live HTML, processor agreements, international transfers and technical deletion against the statements; legal approval and candidate Art. 13/14 disclosures before active recruitment |
| F-004 — Serviceable address (Medium) | IMPLEMENTED IN GIT / VERIFY LIVE | Owner-confirmed Liffey GbR, Gustav-Adolf-Straße 13, 63069 Offenbach am Main, Germany; EN/DE imprint/privacy/candidate pages merged in PR #6 | Confirm actual serviceability and live site publication; no assumption about tax registration or Irish establishment |
| F-005 — MFA enforcement (Medium) | OPEN | Individual Cloudflare administrator reported MFA enabled | Verify all Cloudflare members and Microsoft 365 admins have phishing-resistant MFA; enforce centrally if supported; retain recovery codes securely |
| F-006 — DNSSEC (Low) | PENDING / AUTOMATIC REGISTRAR DELEGATION | Cloudflare Registrar owns domain and DNSSEC enabled; API still `pending` on 19 November 2026; independent Google Public DNS DS query returned NOERROR with no DS answer | Cloudflare Registrar should publish DS automatically. A 6-hour condition monitor is scheduled for four days; if not active within 48h, escalate to Cloudflare support. Do not create duplicate DS records or change nameservers |
| F-007 — Cloudflare admin resilience (Medium) | PARTIAL | Admin recovery policy merged PR #11; second Super Admin invitation pending to alternate founder | Alternate founder accepts invite, enrolls MFA, verifies access and recovery; then reduce any unnecessary privileges |
| F-008 — Contact Worker rate limiting (Low) | DEPLOYED / NEGATIVE TEST PASSED / E2E OPEN | PR #17 merged, rate limiter configured; live request with deliberately invalid Turnstile token returned 403 `verification_failed` without sending an enquiry | A human must complete a real Turnstile challenge and submit a harmless test enquiry; verify routed inbox, acknowledgment and a controlled 429 test if needed |
| F-009 — GDPR retention (Medium) | POLICY ADOPTED / TECHNICAL OPEN | PR #12 merged; approved German-market schedule and manual rights/deletion procedures | Implement and verify retention/deletion in Microsoft 365, files, backups and Resend; verify Cloudflare log retention; Irish-law review where applicable; document deletion evidence |
| F-010 — Vulnerability disclosure (Medium) | LIVE HTTP VERIFIED / OUTBOUND REPLY OPEN | SECURITY.md merged PR #8; `.well-known/security.txt` merged PR #19; live HTTPS GET returned 200 and text/plain. Owner reported receiving a Cloudflare notification at security@ | Test security@ outbound response and assign monitoring owner; keep published expiry current |
| F-011 — Worker monitoring (Low) | ENABLED / EMAIL ROUTING OBSERVED | Worker observability enabled, privacy-minimized logs and Cloudflare real-time issue policy enabled. Owner confirmed a Cloudflare notification reached security@ (the alert concerned historical checkout-worker exceptions in 2022, not a new Liffey failure) | Confirm alert fires on a genuine Liffey Worker exception, verify retention and operational incident handling; do not claim historic checkout-worker issue is a current incident |
| F-012 — Resend least privilege (Medium) | OPEN | PR #14 merged documenting scope review | ChatGPT Resend OAuth grant remains full_access; owner must explicitly approve revocation/reconnection after confirming replacement scope; API key domain/permissions also need verification. Never revoke a live Worker key without migration |
| F-013 — Cloudflare Pages / WAF (Low) | LIVE MIGRATION VERIFIED / LEGACY PAGES STILL ENABLED | Production Cloudflare Pages project active; both custom domains and certificates active; proxied DNS and 301 apex-to-www verified with query preservation; live favicon/security.txt HTTP 200; 7/7 daily live smoke checks passed including internal audit file 404 | Disable legacy GitHub Pages publishing, make repository private, and verify new Git-connected Pages production deployment after privacy change. Confirm one genuine contact-form submission separately under F-008 |
| F-014 — Release controls (Medium) | CI ACTIVE / REQUIRED CHECKS NOT ENFORCED | PRs #10/#15/#19 merged, PR #27 adds daily live website smoke workflow to main; first run 44557717554 passed all seven tests | Configure required passing checks and one independent reviewer in GitHub ruleset; test rejection of failing PR and maintain release rollback procedure |
 
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


## Repository visibility follow-up — 19 November 2026
- The source repository remains public and legacy GitHub Pages is still enabled; Cloudflare Pages now serves the production domain. Connected GitHub actions cannot change repository visibility or Pages settings.
- Owner-only steps: GitHub **Settings → Pages → Unpublish site**, verify the production domain remains available; then **Settings → General → Danger Zone → Change repository visibility → Make private**.
- After the visibility change, confirm the Cloudflare Pages GitHub integration retains access to the private repository and a new production build succeeds on `gh-pages`. The daily live smoke workflow is installed in `main` and passed its first run.
- DNSSEC pending is independent of repository privacy. Do not wait for DS propagation to make the source private once the Pages/GitHub integration is confirmed.
