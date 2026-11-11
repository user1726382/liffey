# Privacy operations — controlled draft
Owner: designated GbR partner (TBD) | Version 0.1 | Date: 2026-11-11 | Status: NOT APPROVED

## Scope and legal basis
Applies to website enquiries, B2B client contacts, suppliers and future candidate recruitment. GDPR Arts. 5, 6, 12–22, 24–25, 28, 30, 32–35 and Chapter V. Do not presume consent is the universal basis. Record the specific basis for each purpose; assess Art. 6(1)(b) only where the data subject is party to or requests a contract. Art. 6(1)(f) requires a documented legitimate-interest assessment where used.

## Processing inventory — fill before activating any form
| Activity | Data subjects | Data categories | Purpose | Art. 6 basis | Recipients/processors | Hosting/transfer | Retention trigger | Evidence |
|---|---|---|---|---|---|---|---|---|
| Website access and security logs | Visitors | IP, device, timestamp | Delivery and security | To assess | Cloudflare / host to verify | To verify | To define | vendor contract, log settings |
| Contact enquiries | Business contacts | Name, email, message | Reply to enquiry | To assess | Hosting, Microsoft 365 to verify | To verify | To define | form tests, notice |
| Candidate sourcing | Candidates | CV, work history, contact | Placement | NOT AUTHORISED | To define | To define | To define | licence decision, candidate notice |
| Marketing outreach | Business contacts | Contact details, suppression | Prospecting | To assess alongside ePrivacy/UWG | To define | To define | To define | source and outreach register |

## Rights workflow
Log request date, identity-verification necessity, scope, applicable exemptions, systems/vendors, decision, response date and proof. Normally respond within one month under GDPR Art. 12(3), with permitted extensions when justified. Do not demand excessive identity documents.

## Incident workflow
Contain, preserve evidence, record affected systems/data/people, assess risk, notify the competent supervisory authority within 72 hours of awareness where Art. 33 applies, notify individuals without undue delay where Art. 34 applies, and document all incidents including non-reportable ones. Test restoration and record lessons learned.

## Retention
Do not invent universal CV or email retention periods. Set periods by purpose, German/Irish statutory retention rules and documented necessity; separate candidate pipeline data from financial records. Implement deletion in primary systems, attachments, backups and vendor systems where feasible, with lawful exceptions.

## Processor and transfer controls
List each vendor, controller/processor role, Art. 28 agreement, subprocessors, region, international transfer mechanism and transfer-impact assessment where needed. Verify actual Microsoft 365, Cloudflare, Turnstile and GitHub configuration; names alone do not prove a transfer.

## Go-live gates
No enquiry form until the actual notice, processor agreements, anti-spam handling, retention and security tests are approved. No CV intake until candidate notices, sharing arrangements, recruitment permissions and secure storage are approved.
