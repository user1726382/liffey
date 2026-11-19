# Liffey launch — website change proposal and acceptance tests
**Status:** DRAFT / review only. **Date:** 2026-11-19. **Production changes:** NONE.

## Existing material to reuse
- `compliance/LAUNCH-REGISTER.md`: regulatory launch gates.
- `compliance/LEGAL-REVIEW-AND-PUBLICATION-GATE.md`: legal publication approval criteria.
- `compliance/CONTACT-DATA-FLOW-AND-RETENTION.md`: contact data flow baseline.
- `compliance/CLIENT-TERMS-AND-SOW-DRAFT.md` and `compliance/CANDIDATE-DATA-SHARING-DRAFT.md`: unapproved contract and sharing baselines.
- `compliance/ICT-AUDIT-REMEDIATION-REGISTER.md`: security findings.

## Proposed website changes (NOT YET IMPLEMENTED)
| ID | Proposed change | Acceptance test | Gate |
|---|---|---|---|
| WEB-01 | Verify legal identity, address and contact details in EN/DE legal pages | Founder verifies against official records; no fabricated registration or VAT IDs | A |
| WEB-02 | Align EN/DE privacy notices with actual Cloudflare/Turnstile/Resend/M365 data flows | Processor, transfer, retention and rights facts evidenced | A |
| WEB-03 | Verify both contact forms and routing without processing real personal data | Synthetic submission, Turnstile failure, delivery and acknowledgement tests | A |
| WEB-04 | Review recruitment and consulting claims, prices and guarantees | No unapproved SLA, success guarantee or 20% fee represented as binding | B/C |
| WEB-05 | Verify privacy/imprint links from every language route | Automated link test and manual mobile check | A |
| WEB-06 | Check candidate upload/contact flows | No general-form CV collection until candidate notice, controls and lawful sharing are approved | C |
| WEB-07 | Confirm deployment workflow and branch protections | This PR does not trigger a production deployment | A |

## Release controls
1. Do not merge or deploy website changes until founder sign-off.
2. Do not publish draft contracts, internal policies, candidate data or confidential material in the public repository.
3. Review cross-border recruitment licensing and data-sharing arrangements before candidate processing.
4. Record for each release: reviewer, date, evidence, commit SHA, testing outcome and residual risks.
5. Keep launch gates separate: informational website, consulting services, and recruitment/candidate processing.

## Outstanding commercial decisions
- Exact legal identity and representation; trade registration and tax number.
- Permanent recruitment fee (20% proposed), fee trigger, invoice due date, guarantee conditions.
- Recruitment territory (DE/IE), licensing and GDPR controller relationships.
- Consulting pricing, deliverables, acceptance, liability and insurance.
- Retention implementation and provider agreements.

**This file is a proposal, not legal approval or proof that controls have been implemented.**
