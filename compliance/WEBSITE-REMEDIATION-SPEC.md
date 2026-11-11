# Website remediation specification — awaiting deployed source mapping
Status: PROPOSED, NOT IMPLEMENTED

1. **Legal pages:** Keep links to Impressum and Datenschutz accessible in EN/DE navigation/footer. Do not insert partner names, addresses, tax IDs, register numbers or regulatory authorities without confirmation. Do not represent an unfinished draft as approved legal text.
2. **Brand:** reconcile repository's provisional "The Link" brand with owner-reported "Liffey Consulting" only after mapping deployed source, trademark review and approved wording.
3. **Forms:** keep inquiry and candidate application feature flags disabled pending documented legal/security approval. Verify that static fallback forms, mailto links and backend endpoints cannot bypass gates.
4. **Privacy:** inventory actual Cloudflare hosting, Workers, Turnstile, Microsoft 365, logs, embeds, fonts, analytics and cookies. Write privacy disclosures from observed processing and executed supplier terms.
5. **Cookies:** block non-essential device storage/access before valid consent; ensure withdrawal and preference controls where applicable. Do not install a banner merely for decoration.
6. **Security:** verify HTTPS redirects, headers, secrets, CORS, CSP, rate limiting, input validation, abuse monitoring and CV upload controls against deployed behaviour.
7. **Accessibility:** test keyboard navigation, labels, contrast, focus, language switching and statutory scope, rather than claiming legal certification.
8. **Acceptance tests:** EN/DE legal navigation; no fabricated identities; disabled forms cannot submit; no tracking before required consent; data flows match notices; security controls and retention tested.

Production website and Cloudflare configuration have not been independently inspected; this file is a change specification, not evidence of deployed remediation.
