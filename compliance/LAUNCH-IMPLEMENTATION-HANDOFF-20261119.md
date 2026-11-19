# Launch preparation — implementation handoff (19 November 2026)

**Status:** Working drafts uploaded to private SharePoint. No website deployment, contract approval, or launch authorization.

## SharePoint location
[Liffey Consulting Internal / 09 - Launch Readiness](https://liffeyconsulting.sharepoint.com/sites/internal/Freigegebene%20Dokumente/09%20-%20Launch%20Readiness)

Contains 15 numbered draft documents plus the earlier master register. This public GitHub repository intentionally does **not** contain internal contract content or candidate/client data.

## Reused baselines
- SharePoint `04 - Clients & Contracts`: permanent recruitment v0.3, market-entry v0.3, marketing v0.3.
- SharePoint `06 - Legal & GDPR`: candidate/client privacy notices, processing register and policy library.
- SharePoint `03 - Recruitment`: role brief, candidate forms, delivery/guarantee pack.
- GitHub `compliance/LAUNCH-REGISTER.md`, `compliance/LEGAL-REVIEW-AND-PUBLICATION-GATE.md`, `compliance/ICT-AUDIT-REMEDIATION-REGISTER.md`.

## Code controls and proposed changes
- Existing `app.py` launch gates must remain fail-closed.
- `scripts/launch_readiness_check.py` performs offline source checks only.
- `compliance/LAUNCH-WEBSITE-CHANGE-PROPOSAL-20261119.md` records seven proposed changes with acceptance tests.
- Future PR commits may revise bilingual legal pages **only after** factual identity and privacy data flows are verified; no placeholder legal text should be published.
- Do not enable `ACCEPT_INQUIRIES` or `ACCEPT_APPLICATIONS` merely to pass a demo.

## Critical approvals still needed
1. German trade registration and ELSTER tax registration evidence.
2. Exact GbR identity, serviceable address and authorized representatives.
3. German/Irish recruitment activity and licensing assessment.
4. Final commercial agreement on 20% fee, commencement trigger, 14-day payment, 90-day replacement guarantee and remedy.
5. GDPR roles, actual vendor data flows, retention settings, candidate sharing and incident process.
6. Insurance, accounting, security and backup/restore evidence.
7. Founder review and legal/privacy sign-off before external use.

## Release evidence
For each launch gate, record partner approvals, test output, actual environment configuration, legal sign-off where appropriate, commit SHA and rollback procedure. A draft document or static check is not an implemented control.
