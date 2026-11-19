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
