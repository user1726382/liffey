# Cloudflare Pages production migration — 19 November 2026

## Project and source
- Production Cloudflare Pages project: `liffey-consulting` (`liffey-consulting.pages.dev`).
- Separate staging project: `liffey-consulting-staging`, using a staging-only build that disables forms and prevents indexing.
- GitHub repository: `user1726382/liffey`; production branch: `gh-pages`.
- Build command: `node scripts/build-cloudflare-pages.mjs && node scripts/test-cloudflare-pages-build.mjs`.
- Output: `dist` only, not repository root. The allowlist excludes internal files, secrets, Worker source and operational documents.
- Canonical domain: `www.liffey-consulting.com`; apex redirects to canonical as appropriate.
- GitHub Pages must remain configured as rollback during validation.

## Pre-cutover checks
1. Confirm latest GitHub Actions validation and Cloudflare production Pages build pass on the same `gh-pages` commit.
2. Verify production `pages.dev` HTML, favicon, robots, sitemap, legal notices, headers, EN/DE navigation, mobile pages, and that contact form has a valid configured endpoint and site key.
3. Check the contact-form Worker still accepts the existing apex and www origins; test Turnstile and Resend via the **custom domain** after cutover.
4. Snapshot current DNS: four GitHub Pages apex A records and DNS-only `www` CNAME; leave MX, SPF, DKIM, DMARC, Resend, and Microsoft verification records untouched.
5. Add custom domains through the Cloudflare Pages **custom domain API**, not by merely pointing DNS CNAME at pages.dev. Check both become active and certificates provisioned.
6. Verify proxied DNS for apex and www, HTTPS, correct canonical URL and redirects, favicon, robots/sitemap, Worker form, and mail delivery.
7. If Pages fails, roll back only website A/CNAME records to their recorded GitHub Pages targets and validate again. Do not change mail DNS or nameservers.

## After stable cutover
- Confirm Cloudflare proxy/WAF protection on both website hostnames.
- Review and, if appropriate, disable GitHub Pages publishing before changing repository visibility; private repositories are supported by Cloudflare Pages Git integration.
- Keep the GitHub repository and Cloudflare GitHub App connected; validate automatic deployment on a subsequent approved change.
- DNSSEC is separate and currently pending automatic DS publication by Cloudflare Registrar; do not manually add DS records.

## Contact form
The form is served from `/contact/` and `/de/kontakt/` and sends requests to the separate `liffey-contact-form` Worker. It is not a Pages Function. Avoid replacing its production endpoint during migration.

## Post-cutover verification — 19 November 2026
- Cloudflare Pages project `liffey-consulting` successfully deployed public-only `dist` from `gh-pages`; both custom domains `www.liffey-consulting.com` and `liffey-consulting.com` report **active** with successful certificate validation.
- Both website DNS CNAMEs are proxied through Cloudflare. The apex redirect is 301 to the www hostname, preserving query strings; the redirect excludes `/.well-known/` to avoid interfering with domain certificate validation.
- A real browser check returned HTTP 200 for the favicon and `/.well-known/security.txt`; the homepage and both EN/DE contact forms load. A request with a deliberately invalid Turnstile token was rejected with HTTP 403 `verification_failed`, as expected.
- **Still required:** a genuine human-verified contact-form submission and confirmation that the routed message and acknowledgement arrive. Never bypass production Turnstile for testing.
- GitHub Actions on the default `main` branch now runs `scripts/live-site-smoke.mjs` daily (PR #27); the first run passed all seven checks, including confirmation that internal audit files are not served from Cloudflare Pages.
- Cloudflare Registrar DNSSEC is still `pending`, and independent public DNS lookup returned no parent DS record. The registrar automatically provisions DS; do not create duplicates. A short-lived monitoring task is active.

## Repository privacy — owner action required
The connected GitHub tool can edit repository files and PRs but cannot modify GitHub repository visibility or GitHub Pages settings. **Do not claim that the repository has been made private until the GitHub settings are changed and verified.**

1. Ensure `https://www.liffey-consulting.com/` and the contact page load correctly; verify the first daily smoke test passes.
2. In the GitHub repository, open **Settings → Pages** and unpublish/disable the legacy GitHub Pages site (or set its branch source to None if that option is shown). The production domain is now on Cloudflare Pages.
3. Confirm `https://www.liffey-consulting.com/` still loads through Cloudflare Pages.
4. Open **Settings → General → Danger Zone → Change repository visibility → Make private** and confirm the change.
5. In Cloudflare Pages, verify the GitHub installation retains access to the now-private repository and `gh-pages` production branch. If access is lost, reauthorize the GitHub app for this repository; do not make production DNS changes.
6. Push a reviewed documentation-only commit to `gh-pages` and verify a new Cloudflare Pages production deployment succeeds. Check the live website and daily smoke workflow again.
7. Keep the `main` and `gh-pages` branches and the GitHub Actions checks; retain a local export/backup of the website. Disabling legacy GitHub Pages removes it as an immediate rollback host; Cloudflare Pages deployment rollback and source control history remain available.

This privacy change is independent of DNSSEC activation; DNSSEC pending does not require leaving the source repository public.
