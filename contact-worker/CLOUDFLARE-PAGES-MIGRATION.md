# F-013 — Cloudflare Pages migration (not deployed)

This branch prepares an allowlisted static build. It **does not** create a Cloudflare Pages project, change DNS, modify GitHub Pages or deploy anything.

## Build settings when migration is explicitly approved
- Repository: `user1726382/liffey`
- Production branch: `gh-pages`
- Framework preset: None
- Build command: `node scripts/build-cloudflare-pages.mjs`
- Build output directory: `dist`
- Root directory: repository root
- Do not set output directory to `/`, `.` or the repository root.
- Initially use a separate preview project or disable automatic production deployments until testing is complete.

The build copies public website content and excludes `.github`, `contact-worker`, internal Markdown, `LAUNCH_CHECKLIST.md`, `scripts` and the GitHub Pages `CNAME`. Public directories remain allowlisted; review newly added assets before release. It writes baseline `_headers` security headers, deliberately **without CSP** until Turnstile and external dependencies are inventoried and tested.

## Validation and cutover
1. Confirm the build-check workflow passes and inspect `dist` for secrets, PII, internal documentation and broken links.
2. Connect the GitHub repository to Cloudflare Pages, or upload the generated `dist` artifact for a staging preview. The Cloudflare account currently has no Pages project.
3. Test EN/DE pages, contact form Worker CORS origins, Turnstile, Resend routing, robots/sitemap, HTTP status codes, canonical URL, headers and cache behavior at the preview URL.
4. Before adding the production domain, decide whether to keep `www.liffey-consulting.com` canonical. The existing apex A records and `www` CNAME point to GitHub Pages; switching them is a production DNS change.
5. Verify HTTPS certificates, redirects, mail-related DNS unaffected, and a rollback plan. Only then schedule a DNS cutover with explicit authorization.
6. Keep GitHub Pages active until production validation and rollback window have completed. After cutover, review GitHub Pages publishing settings and repository visibility separately.

Cloudflare WAF rules only protect traffic that is actually proxied through Cloudflare; this migration addresses F-013 only after live cutover and verification.
