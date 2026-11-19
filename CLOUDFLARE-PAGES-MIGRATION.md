# F-013 — Cloudflare Pages migration and production cutover
**Status:** DRAFT RUNBOOK — 19 November 2026. Do not create a production project, switch DNS, enable automatic deployment or change repository visibility without explicit release approval.

## Verified current architecture
- Public site source: GitHub repository `user1726382/liffey`, branch `gh-pages`, GitHub Pages.
- Cloudflare zone `liffey-consulting.com` is active. **A separate Git-connected staging Pages project** `liffey-consulting-staging` was created on 19 November 2026 with its own source branch `staging/cloudflare-pages-preview-20261119`. The staging project does not have a custom production domain.
- DNS: four DNS-only root A records for GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`); DNS-only `www` CNAME points to `user1726382.github.io`.
- Mail MX and SPF records are separate. **Do not modify email/DKIM/DMARC/MX/SPF records during website migration.**
- The existing contact form uses `https://liffey-contact-form.leoedwalshe.workers.dev` and Turnstile. Its Worker currently accepts only `https://www.liffey-consulting.com` and `https://liffey-consulting.com` origins; preview domains will not be accepted.

## Public build — mandatory
- Production source branch: `gh-pages` (NOT `main`).
- Build command: `node scripts/build-cloudflare-pages.mjs && node scripts/test-cloudflare-pages-build.mjs`.
- Build output directory: `dist`.
- Build environment: a supported Node.js version, preferably Node 22; no credentials needed for static build.
- The script copies an allowlisted public tree and public root files. **Never set output to repository root**: `gh-pages` contains internal `contact-worker/` code, scripts and other non-website files.
- The output includes `_headers`, `/.well-known/security.txt`, and a canonical `www` sitemap/robots.
- The baseline CSP deliberately enforces only `base-uri`, `object-src`, `frame-ancestors` and `form-action`. Do not add a restrictive `script-src` or `connect-src` without testing inline scripts, Turnstile and the contact Worker.
- Re-run the build test for every site release; verify no private paths or sensitive JSON enter `dist`.

## Staging gate — authorization received for a separate public Pages preview
1. **Completed:** User authorized a public staging preview connected to the specific GitHub repository; Cloudflare accepted project `liffey-consulting-staging`.
2. **Completed for staging:** The Pages project's deployment branch is `staging/cloudflare-pages-preview-20261119`, not `gh-pages`; other preview branches are disabled. Its build sets `LIFFEY_PAGES_STAGING=1`, which enforces `noindex`, disallows robots and disables contact submissions. The future **live production** project, if separately approved, should use `gh-pages` after the public-only build is merged and validated.
3. **CI passed:** The staging branch runs `LIFFEY_PAGES_STAGING=1 node scripts/build-cloudflare-pages.mjs && LIFFEY_PAGES_STAGING=1 node scripts/test-cloudflare-pages-build.mjs`, output `dist`. Cloudflare build/deployment and public HTTP verification must be recorded separately before declaring staging ready.
4. Check HTML, mobile layout, images, navigation, canonical URLs, 404, robots, sitemap, `/.well-known/security.txt`, and response headers.
5. Test form on staging only after creating a **separate staging Worker/Turnstile setup** with an allowed preview hostname and non-production email routing. Do not loosen production Worker origin or Turnstile hostname checks just to make preview work.
6. Check Cloudflare Pages preview access control: preview URLs are public unless specifically protected. Never expose candidate data, internal docs or sensitive information there.

## Production cutover — separate explicit GO approval required
1. Record the current DNS records, GitHub Pages settings, Cloudflare Pages deployment ID, approved rollback decision and on-call contacts.
2. Confirm Pages custom domain validation and certificate readiness for `www.liffey-consulting.com` and apex. Check for any automatic DNS changes proposed by Cloudflare before confirming.
3. During an approved release window, replace the GitHub Pages website records with the Pages-recommended DNS records; keep all MX, SPF, DKIM, DMARC, Worker and other unrelated records untouched.
4. Test HTTPS, apex → `www` canonical behavior, links, CSP, `/.well-known/security.txt`, 404, robots/sitemap and cache behavior from external networks.
5. Send synthetic contact enquiries in EN and DE; verify Turnstile, correct routing, Resend delivery, acknowledgement, privacy notice and no secret exposure. Watch Worker errors.
6. Monitor for DNS/TLS issues. If the cutover fails, restore the captured GitHub Pages DNS records and recheck website and form; DNS propagation may delay recovery.
7. Only after successful cutover, separately approve making the GitHub repository private. Confirm Cloudflare's GitHub integration retains access to the private repo and preview/production deployments still work.

## Release evidence checklist
- [ ] GitHub PRs and successful CI runs recorded
- [ ] Data protection and legal pages reviewed and approved
- [ ] Staging preview and Worker isolation verified
- [ ] Public-only output checked for source/docs leakage
- [ ] DNS record snapshot and rollback plan approved
- [ ] Production cutover authorized, performed and independently tested
- [ ] GitHub repository visibility change separately approved and tested
- [ ] Old GitHub Pages hosting decommissioned only after stability period

**No part of this runbook constitutes authorization to deploy or change production configuration.**

Cloudflare references:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
