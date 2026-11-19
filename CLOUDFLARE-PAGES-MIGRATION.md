# F-013 — Cloudflare Pages migration and production cutover
**Status:** DRAFT RUNBOOK — 19 November 2026. Do not create a production project, switch DNS, enable automatic deployment or change repository visibility without explicit release approval.

## Verified current architecture
- Public site source: GitHub repository `user1726382/liffey`, branch `gh-pages`, GitHub Pages.
- Cloudflare zone `liffey-consulting.com` is active; Cloudflare Pages project list is currently empty.
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

## Staging gate — requires explicit authorization
1. Approve connecting the **specific GitHub repository** to a new Cloudflare Pages project. Limit the Cloudflare GitHub app's repository access to this repo where possible.
2. Choose the `gh-pages` production branch in Pages settings; **disable automatic production builds** until a controlled release is approved. Configure preview branch controls deliberately. Be aware that initial Git integration may create a Pages deployment; do not do this without approval.
3. Run the exact build command and output directory above; confirm the `*.pages.dev` preview renders, with no internal documents publicly accessible.
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
