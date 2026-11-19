# Retention, erasure and data subject rights procedure
DRAFT — all retention periods require local legal and operational approval.

| Category | Trigger | Approved period |
|---|---|---|
| Technical hosting/security logs | Event date | [VERIFY HOST / APPROVE] |
| Business inquiries | Last relevant contact / case closure | [APPROVE] |
| Rejected candidate CV and notes | End of recruitment / limitation risk | [APPROVE DE AND IE] |
| Talent-pool profiles | Last active verified purpose | [APPROVE] |
| Successful placement documents | Placement / legal claim / invoice | [APPROVE] |
| Client contracts and invoices | Statutory tax/accounting trigger | [APPROVE] |
| Marketing opt-out suppression | Objection / opt-out | [MINIMAL NECESSARY PERIOD] |
| Admin audit logs | Security event | [APPROVE] |
| Encrypted backups | Backup creation | [APPROVE ROTATION] |

## Procedure
Maintain a record owner for every system and processor. Schedule deletion based on approved rules, pause on lawful litigation hold, and securely remove active copies. Account for email, CRM, ATS, CV files, logs and third parties. Restrict backup access; after restoration reapply erasure decisions. Do not promise instantaneous erasure from immutable backups if technically untrue.

For GDPR rights requests: log receipt and deadline; verify identity proportionately; identify controller; search systems; assess applicable rights/exemptions; provide secure response normally within one month; notify of lawful extensions in time; record minimal closure evidence. A processor forwards requests to its controller according to contract.

Quarterly deletion sampling; annual review of the schedule. Do not enable candidate collection before this schedule is approved and implemented.

## Proposed decision schedule — NOT APPROVED

| Data class | Starting proposal | Conditions | Owner |
|---|---|---|---|
| B2B enquiries | 12 months after last substantive interaction | Exclude active contracts, legal holds and statutory records | [APPROVE] |
| Unsuccessful candidates | Consider 3–6 months after final decision | German/Irish legal review, claims and actual recruiting model | [APPROVE] |
| Talent pool | Do not collect until a distinct purpose, lawful basis, notice and deletion mechanism are approved | Periodic necessity review | [APPROVE] |
| Invoices/accounting | Applicable statutory retention period by record type | Tax and commercial law review | [LEGAL REVIEW] |
| Worker operational logs | Consider 30 days of minimal metadata | Actual Cloudflare capabilities, need, cost and privacy review | [APPROVE] |
| Backups | Set explicit rotation/expiry | Reapply deletion decisions after restore | [APPROVE] |
| Opt-out suppression | Minimum needed to respect objection | Do not inadvertently re-contact people | [APPROVE] |

## Implementation register
Record system, processor, data category, legal basis, purpose, retention start event, period, exceptions, deletion mechanism, backup treatment, owner, evidence, privacy-notice location and review date. Test with synthetic records before enabling deletion automation. Do not present proposed periods as operational fact.
