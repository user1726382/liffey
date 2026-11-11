# Existing production Worker integration — verified 2026-11-11

Cloudflare account contains deployed Worker `liffey-contact-form` with secret bindings `RESEND_API_KEY`, `TURNSTILE_SECRET`, `FROM_EMAIL`, and plain-text `FORM_ENABLED=false`. Resend sending domain `liffey-consulting.com` is verified, EU West 1. **Do not expose any secret values.**

## IMPORTANT — deployed Worker differs from contact-form/worker.js
The deployed Worker accepts JSON:
`{name,email,message,topic,locale,consent,token,website}`
where `consent` must be boolean `true`, `token` is a Turnstile token with action `contact`, and topic must be one of `general,recruitment,career,consulting,marketing,privacy,legal`.

The existing Worker routes topics to multiple mailboxes, not exclusively `info@`:
- general -> info@
- recruitment/career -> recruitment@
- consulting/marketing -> consulting@
- privacy -> privacy@
- legal -> legal@

It sends a best-effort acknowledgement email to the submitter. This differs from the earlier standalone proposed Worker, which uses `turnstileToken`, `market-entry`, and `CONTACT_TO`. **Do not integrate the earlier frontend directly with the deployed Worker.** Confirm all destination mailboxes exist before enabling; if all messages must go to info@, change routing in a reviewed Worker version first.

## Release checklist
1. Determine actual production frontend repository/branch and exact Worker URL; inspect deployed contact page.
2. Obtain public Turnstile site key, ensure action=contact and correct allowed hostname.
3. Integrate form using the deployed payload contract; include meaningful EN/DE error states, accessibility and spam honeypot.
4. Confirm the necessity and wording of any privacy acknowledgement; a mandatory `consent` checkbox is not automatically an appropriate GDPR legal basis for answering a contact enquiry.
5. Verify live privacy notice reflects Cloudflare, Turnstile, Resend, Microsoft 365 and actual data flows.
6. Add rate limiting and test form, CORS, failures, destination mailbox delivery, and acknowledgements.
7. Only after approval enable `FORM_ENABLED`; do not change production in this PR.

## Status
Existing backend identified, **FORM_ENABLED=false preserved**, no production deployment or test email sent.
