# F-012 — Resend OAuth least-privilege review
**Status: DRAFT. No access has been changed or revoked.**

## Verified inventory — 19 November 2026
The Resend team has one active OAuth authorization for **ChatGPT**, granted on 11 November 2026, with scope **`full_access`**. This is broader than necessary for occasional read-only audit checks. No evidence establishes that the grant has been abused.

Do not publish OAuth grant IDs, tokens, API keys or account secrets in this repository.

## Decision to be made by account owner
1. **Keep temporarily:** only if the current ChatGPT integration is needed for permitted Resend administration; document the business justification, responsible owner and review date.
2. **Revoke:** if the integration is no longer needed, explicitly approve revocation after confirming no workflows depend on it.
3. **Reauthorize with narrower permissions:** if Resend offers an OAuth scope that covers the actual use case, reauthorize with that scope, test permitted operations and then explicitly approve removal of the old grant. Do not assume scope can be modified in place.
4. **Prefer read-only access** for routine audits where available; use time-limited elevated access only when necessary.

## Additional controls
- Review Resend API keys separately: purpose, creation date, least-privilege send-only scope, domain restrictions, rotation ownership and last use where available.
- Never store an API key in GitHub, static site JavaScript, issue comments or PR descriptions.
- Keep the Worker API key as a Cloudflare secret; ensure no production key is present in public artifacts.
- Review third-party apps and OAuth grants at least quarterly and after a partner leaves.
- Record who approved access and the business justification, then test mail delivery after any approved credential change.

## Closure evidence
- [ ] Owner chooses retain/revoke/reauthorize and documents rationale.
- [ ] Exact effective scopes are verified after the change.
- [ ] Production contact-form delivery and acknowledgements tested if credentials change.
- [ ] Evidence recorded without revealing secret material.
- [ ] Review date and owner assigned.

**No access revocation or reauthorization is authorized by this draft.**
