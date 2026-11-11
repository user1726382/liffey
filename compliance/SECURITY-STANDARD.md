# Information security and incident standard — draft
Version 0.1 | Owner: technical partner TBD | Approval: pending

1. Require MFA on GitHub, Cloudflare, Microsoft 365, domain registrar and administrative accounts. Prefer phishing-resistant MFA. Record access owners and recovery methods.
2. Use unique named accounts; least privilege; promptly revoke access on exit; quarterly access reviews.
3. Keep credentials in managed secret storage; never commit .env, tokens, private keys, CVs or real enquiries to Git. Rotate any exposed credentials and assess incident impact.
4. Enforce TLS, secure cookies, CSRF protections where needed, input validation, output encoding, rate limits and secure response headers. Test contact and file-upload endpoints; default disabled until signed release.
5. Log administrative actions without unnecessary personal data; restrict access and define retention.
6. Back up critical data and configuration, encrypt appropriately, define recovery targets and periodically test restoration.
7. Maintain an inventory of services and dependencies; patch supported components; scan dependencies and secrets in CI.
8. Classify candidate records as confidential; prohibit public buckets and public repository uploads; use malware scanning and download authorisation for CVs.
9. Incident response: identify, contain, recover, record, and refer potential personal-data breaches to the privacy owner for GDPR Arts. 33–34 assessment.
10. Evidence: MFA screenshots (without secrets), access review, backup test, dependency scan, security headers, deployment approval and incident exercise.

This is a policy draft, not evidence that the controls are active.
