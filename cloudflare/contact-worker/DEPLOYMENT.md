# Contact form deployment (STAGED — NOT LIVE)
Branch: feature/contact-form-staged. Do not merge until the entire checklist passes.

## Architecture
GitHub Pages serves EN /contact/ and DE /de/kontakt/ forms. Cloudflare Worker receives JSON submissions, validates fields, verifies Cloudflare Turnstile server-side, routes mail via Resend, then attempts a separate acknowledgement. No messages are stored by the Worker. Mail providers may retain content under their own policies.

## Setup
1. In Cloudflare, create a Turnstile widget for www.liffey-consulting.com and liffey-consulting.com. Save site key and secret.
2. In Resend, verify the liffey-consulting.com domain, configure SPF/DKIM/DMARC as directed, and use a verified sender such as notifications@liffey-consulting.com. Ensure domain DNS changes do not disrupt Microsoft 365 mail.
3. In cloudflare/contact-worker run `npx wrangler deploy` after authenticating. Configure custom route e.g. forms.liffey-consulting.com/submit in Cloudflare, or Worker custom domain and path, and confirm route. Add secrets with `npx wrangler secret put TURNSTILE_SECRET`, `npx wrangler secret put RESEND_API_KEY`, `npx wrangler secret put FROM_EMAIL`. Do not commit credentials.
4. Configure Cloudflare WAF/rate limiting for POST /submit (e.g. 5 requests / 10 minutes / IP; tune for legitimate users). Worker validates origin and Turnstile; Origin checks alone are not authentication.
5. Test EN and DE forms, all seven topics, mobile, invalid inputs, bot challenge failure, mail to each inbox, and acknowledgement delivery. Verify sender authentication and that no private data is logged.
6. Only after tests: set FORM_ENABLED="true" in Worker configuration and deploy. Insert production endpoint and public Turnstile site key in both forms' data-endpoint and data-sitekey. Merge staged branch to gh-pages only after confirming both backend and frontend are operational. Until configured, form button remains disabled.
7. Update EN/DE privacy notices before activation: identify Cloudflare and Resend as processors, international transfers where relevant, purpose/legal basis, retention, rights, security and processor agreements. Obtain legal review for consent vs legitimate interests/Art 6(1)(b) and avoid unnecessary consent checkboxes where inappropriate. Current form uses a required checkbox and must be reviewed.
8. Preserve direct mailto links for legal/privacy notices and direct contact addresses. Replace only general enquiry CTAs with links to /contact/#contact-form or /de/kontakt/#contact-form. Keep job application subject/context in the form when migrating job-specific mailto links; do not blindly replace application links.
9. Test the production domain after publishing. Do not claim delivery until verified.

## Routing
general -> info@
recruitment/career -> recruitment@
consulting/marketing -> consulting@
privacy -> privacy@
legal -> legal@
All addresses are at liffey-consulting.com. Automatic replies go to visitor's submitted email.

## Known limits
Worker is disabled by default. No provider account or DNS configuration has been performed. Acknowledgement is best effort after the inbound message succeeds. Resend quotas and anti-abuse policy apply. Do not publish the feature branch directly.
