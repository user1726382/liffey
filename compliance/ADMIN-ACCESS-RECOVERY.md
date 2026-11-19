# F-007: privileged access and recovery procedure

**DRAFT — not proof that secondary access or recovery is configured.**

## Account inventory
Maintain a restricted inventory of Cloudflare, domain registrar, GitHub, Microsoft 365/Entra, Resend and the primary password manager: named owner, backup administrator, MFA method, recovery-code custody, billing owner and emergency contact. Do not commit credentials, recovery codes, personal phone numbers or privileged account identifiers to GitHub.

## Minimum controls
1. Two separate named administrators for critical services where feasible; no shared logins.
2. Phishing-resistant MFA where supported; secure backup methods and offline recovery codes.
3. Least privilege for routine work; separate emergency access from day-to-day admin.
4. Test recovery without disabling protections or revealing secrets; record date and owner privately.
5. Quarterly access review, prompt removal on departure, and change logging.

## Recovery drill
Identify affected service, confirm identity via independent channel, locate emergency access in secure vault, restore access using provider-approved method, rotate exposed credentials, review logs, and document lessons. Validate domain registrar recovery before enabling DNSSEC (F-006). Any new administrator invitation or MFA enforcement requires explicit authorization and verification.

## Open decisions
Name the second administrator and designate backup custody, determine password-manager platform, agree recovery-test cadence and where private evidence is stored.
