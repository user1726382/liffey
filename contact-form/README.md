# Liffey contact form — deployment candidate (NOT LIVE)
Purpose: bilingual B2B enquiries delivered to info@liffey-consulting.com.

## Setup
1. Confirm the real live website source and legal privacy notices before integrating HTML. This repository's README reports missing backend templates; the actual production stack is not verified.
2. Create a Cloudflare Turnstile widget for the exact website hostname; replace the site-key placeholder in contact.html.
3. Choose/approve an outbound email service. This implementation uses **Resend** and therefore requires a Resend account, verified sending domain, approved data-processing terms and any relevant international-transfer review. Microsoft 365 is the receiving mailbox; it does not itself supply the Resend API key.
4. Configure domain DNS verification for the sender through the provider without disrupting Microsoft 365 MX records. Set CONTACT_TO=info@liffey-consulting.com and MAIL_FROM to a verified address.
5. Deploy Worker using wrangler, set RESEND_API_KEY and TURNSTILE_SECRET_KEY with `wrangler secret put`, set ALLOWED_ORIGIN to the exact site origin and replace REPLACE_WITH_WORKER_ENDPOINT.
6. Update approved EN/DE privacy notices to describe contact processing, email delivery, Cloudflare Turnstile and provider, actual retention and transfers. Review Turnstile's own device-data/cookie behaviour.
7. Test valid enquiry, invalid email, spam token, wrong origin, oversize payload, missing provider secrets, provider failure and inbox delivery; confirm no data in public logs.
8. Add edge-level rate limiting or WAF rules to the Worker endpoint before production. Turnstile alone is not a substitute for rate limits.
9. Review CSP to allow the Worker endpoint and Turnstile. Adapt the HTML to the actual site's accessibility and layout.
10. Obtain documented release approval; do not enable live form until all checks pass.

## Security / limitations
- The Worker uses server-side Turnstile verification, field validation, HTML escaping, a honeypot, origin checking and no database storage.
- Origin checking is not authentication and does not prevent non-browser requests; rate limiting and Turnstile remain essential.
- Do not expose API secrets in frontend code.
- Does not send automatic acknowledgements, avoiding unrequested outbound emails.
- Does not support CV uploads.
- A successful response means the email provider accepted the request, not that the recipient mailbox delivered it.
- This folder is a standalone candidate implementation and is **not wired to the deployed website**.
