# Liffey Consulting — Retention, deletion and data-subject-rights policy
**Policy decision:** 19 November 2026. The owner authorized German-market standard retention targets for Liffey. **Status: APPROVED AS POLICY TARGETS; NOT YET TECHNICALLY IMPLEMENTED OR VERIFIED.** This is not evidence that Microsoft 365, Cloudflare, Resend or backups currently delete data on these dates.

## 1. Scope and rules
Controller: Liffey GbR (complete business street address still to be verified). Applies to personal data under Liffey's control in Microsoft 365 mail/OneDrive, contact forms, Cloudflare Worker logs, Resend, recruitment records, and any future CRM/ATS. Different providers may have their own retention terms, to be recorded separately.

- GDPR Art. 5(1)(e): keep data only as long as needed for its purpose. Art. 13(2)(a): disclose the period or its criteria. Erase earlier when the purpose ends and no other legal basis requires retention.
- Distinguish operational correspondence from legally required commercial correspondence; **do not** keep every casual enquiry for six years merely because it is an email.
- A legal hold requires a documented actual or reasonably anticipated claim, scope, decision owner, review date and expiry. Never use a generic hold to avoid deletion.
- German defaults below require separate review for processing under Irish law or a different recruitment/controller arrangement. Do not assert they automatically govern Irish candidates.
- Statutory accounting periods generally start at the end of the relevant calendar year. Confirm applicability to the actual records and entity.

## 2. Approved schedule (policy targets)
| Data category | Period and start event | Exceptions / implementation |
|---|---|---|
| Ordinary contact-form and B2B email enquiries that do not become statutory business correspondence | **Up to 12 months after last substantive interaction or case closure**, whichever is later while the purpose remains live | Delete sooner if no longer needed; classify active client/contract records separately; exclude spam immediately where feasible |
| Unsuccessful German recruitment candidates: CVs, application messages and interview notes | **4 months after final rejection or closure** | Documented claims/holds may justify longer; remove unsolicited sensitive data promptly; no reuse for other vacancies without an independent lawful basis |
| Withdrawn recruitment application | Delete without undue delay when no ongoing claim/obligation exists | Do not keep four months automatically after withdrawal |
| Candidate talent pool | **12 months from separate opt-in/valid lawful basis**, with review before renewal | No automatic enrollment; separate notice, opt-out/withdrawal, and evidence of lawful basis; do not operate pool until controls exist |
| Successfully placed candidate CVs and working notes | Review on placement and **delete/minimize no later than 12 months after process closure** | Retain only necessary fee, placement or guarantee evidence if a documented claim/contract purpose remains; separate it from full CVs |
| Liffey-controlled Worker operational/security logs | **30 days from event** | Minimize identifiers; never log enquiry text, tokens or raw CVs; verify actual Cloudflare retention, access, and deletion capabilities |
| Liffey-controlled administrative audit logs | **90 days from event** (security policy target) | Longer only if documented incident, security obligation or active investigation; provider-controlled logs separately verified |
| Routine encrypted backups | **30-day rotation target** from backup creation | Verify actual provider capabilities; maintain deletion ledger and reapply erasures after restore; do not promise immediate removal from immutable copies |
| Business contracts and qualifying commercial correspondence | **6 years from end of relevant calendar year**, where AO/HGB retention law applies | Only qualifying records; retain only necessary personal data |
| Invoices and accounting vouchers | **8 years from end of relevant calendar year**, where applicable | AO §147(3), HGB §257, UStG §14b; tax exceptions may extend retention |
| Accounting books, inventories, annual accounts | **10 years from end of relevant calendar year**, where applicable | AO §147(3); check which documents the GbR actually must keep |
| Legal claim evidence not otherwise subject to statutory retention | Case-specific, usually linked to the **3-year regular BGB limitation period** (BGB §§195, 199) | Preserve only necessary evidence; limitation commonly runs from end of relevant year; assess exceptions, tolling and longer periods |
| Marketing opt-out / suppression | Minimal contact identifier for **as long as necessary to respect the objection** | Restrict use to suppression; do not resume marketing by deleting suppression record |
| Data subject rights request evidence | Up to **3 years after end of closure year**, where proportionate for accountability/claims | Keep minimal audit record, not a duplicate of the full data subject dossier; review earlier deletion |
| Cloudflare/GitHub/Resend/Microsoft provider-generated logs | **Not yet verified** | These are not represented as subject to the Liffey-controlled 30-day target; record DPA, actual defaults and available controls before publishing an unqualified claim |

**Clarification:** The four-month rejected-candidate rule is the German operating default, not a blanket rule for Irish recruitment. A documented dispute or statutory duty can override deletion. No talent pool is approved to go live merely because a retention target has been selected.

## 3. Operational implementation register (NOT COMPLETE)
| System | Data | Owner | Required evidence before marking implemented |
|---|---|---|---|
| Microsoft 365 shared and personal mailboxes | Enquiries, candidates, contracts | Founders / mailbox owners | Labels or folders, retention policy settings, deletion procedure, sample deletion evidence, preservation of statutory records |
| OneDrive / SharePoint | Recruitment and contract documents | Founders | Folder inventory, access review, retention labels, version/restore handling and deletion test |
| Cloudflare contact Worker | Minimal error events | Technical owner | Observability retention and alerts configured; confirm no content/token/IP leakage; log deletion settings |
| Resend | Outbound mail metadata | Technical/privacy owner | Processor retention documentation and access controls; verify provider cannot be forced to match local 30-day target |
| Future ATS/CRM | Candidate and talent pool records | Recruitment owner | Lawful basis, Art. 13/14 notices, deletion automation, opt-in/withdrawal records and quarterly audit |
| Backups | Recoverable copies | Technical owner | Provider rotation evidence, expiry, recovery test and erasure reapplication |

**Blocking condition:** Until deletion controls and provider facts are verified, mark this policy **adopted, not implemented**. Do not publish privacy wording that implies automated deletion is already active.

## 4. Deletion and rights procedure
1. Classify at collection: ordinary enquiry, statutory correspondence, recruitment, consent-based pool, contract/accounting or security event. Record source and last substantive contact/final decision date.
2. Review expiry monthly; delete/anonymize all active copies across mail, files, CRM/ATS and exports, including attachments. Keep only legally necessary evidence separately and restrict access.
3. Preserve a minimal deletion audit record: category, event date, due date, completion date, system and responsible person; no content or CV copies.
4. For legal holds: record justification, authorized owner, start, scope, review/expiry, and resume deletion on release.
5. For backups: restrict access, apply rotation, and reapply deletion instructions after any restore.
6. For GDPR requests: log receipt; verify identity proportionately; determine controller/processor roles; search systems; assess Art. 15–22 rights and exceptions; respond normally within one month or explain a lawful extension; record minimum evidence.
7. Quarterly sample testing and annual policy review; reconcile retention rules with published EN/DE notices and actual processors.

## 5. Legal sources and rationale
- GDPR Art. 5(1)(e), 13(2)(a), 17, 30; EDPB small-business storage limitation guidance: https://www.edpb.europa.eu/sme/learn-the-basics/data-protection-basics_en
- German rejected-candidate 4–6 month discussion, including four-month supervisory view: https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/datenschutzrecht/mitarbeiterdatenschutz-bewerbungen-4863658
- AO §147(3) and start of period: https://www.gesetze-im-internet.de/ao_1977/__147.html
- BGB §§195, 199 limitation: https://www.gesetze-im-internet.de/bgb/__195.html and https://www.gesetze-im-internet.de/bgb/__199.html

**Owner sign-off:** The user selected standard German-market retention targets on 19 November 2026. Independent verification of cross-border recruitment law, processors, deletion implementation and statutory classification remains open.
