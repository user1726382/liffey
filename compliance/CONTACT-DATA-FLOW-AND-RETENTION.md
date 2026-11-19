# Contact form processing inventory and retention implementation register
**Status:** DRAFT — factual flow mapped from `gh-pages/contact-worker/worker.js` as of 19 November 2026. No retention periods are approved or enforced by this document.

## Observed processing flow
1. Visitor submits name, email, topic, free-text message, locale, privacy-notice acknowledgement and a Turnstile token. The hidden `website` field is a honeypot.
2. Cloudflare receives the HTTP request; the Worker checks Origin, field validity, optional IP information and Turnstile. The Worker uses the `CF-Connecting-IP` request header for Turnstile verification and (in draft F-008) rate limiting.
3. The Worker sends the enquiry via the Resend API to one of the configured business mailboxes (`info@`, `recruitment@`, `consulting@`, `privacy@` or `legal@liffey-consulting.com`). The Resend message includes the visitor's name, email address, topic and message.
4. The Worker sends a best-effort automatic acknowledgement to the submitted address using Resend. This is a second processing event and may expose the sender domain to the recipient.
5. The receiving mailbox provider stores the message until deletion/retention controls act. Resend, Cloudflare and Microsoft 365 may hold delivery, security or audit metadata according to their actual terms and settings. These retention periods are **not** verified here.
6. The static GitHub Pages site itself does not store the submitted form body, but this does **not** imply that enquiry data is absent from third-party processors, mailboxes, backups or security logs.

**Do not confuse the GDPR notice's publication date with evidence of operational compliance.** The contact form is active; candidate emails/CVs may also be received independently of the form.

## Decision and evidence register

| ID | System and data | Purpose and legal basis to confirm | Proposed retention trigger and period | Decision owner | Configuration and evidence required | Status |
|---|---|---|---|---|---|---|
| R-01 | Microsoft 365: ordinary B2B enquiries | Reply, business relationship; GDPR Art. 6(1)(b)/(f) as applicable | Proposal: 12 months after last substantive contact, excluding active client/claims records | Business partners | Confirm all actual destination mailboxes, retention policy and deleted-items recovery; run synthetic deletion test | NOT APPROVED |
| R-02 | Microsoft 365: candidate CVs, notes and recruitment correspondence | Candidate handling; confirm legal basis and DE/IE employment rules | Proposal: 3–6 months after rejection; **requires DE/IE legal review** | Business partners / legal | Candidate-specific notice, documented rejection trigger, retention labels and mailbox/ATS deletion evidence | NOT APPROVED |
| R-03 | Resend: message bodies, events and delivery metadata | Transmission and abuse/security | Obtain provider's actual retention and erasure capabilities; no invented number | Service owner | DPA, region/subprocessor review, dashboard/API evidence, support response if needed | NOT VERIFIED |
| R-04 | Cloudflare Worker request/exception logs | Delivery diagnostics and security | Proposal: 30 days for minimal operational logs, subject to actual plan capabilities | Service owner | Review observability settings, data fields, sampling, access and deletion; never log message body or token | NOT APPROVED |
| R-05 | Cloudflare Turnstile | Anti-abuse verification | Provider-defined; verify privacy notice and contract | Service owner | Current Turnstile terms and data processing details | NOT VERIFIED |
| R-06 | GitHub Pages / future Cloudflare Pages access logs | Site delivery and security | Provider-defined; review after hosting migration | Service owner | Current hosting provider logs, access permissions and retention | NOT VERIFIED |
| R-07 | Microsoft 365 mail backups/recovery | Continuity and lawful recovery | Define expiry/restore behavior; reapply erasure requests after recovery | Service owner | Retention/recovery configuration and restore test | NOT VERIFIED |
| R-08 | Clients' contracts, invoices and tax records | Statutory obligations and claims | German/Irish record-specific retention, not general enquiry period | Finance/legal | Applicable tax/legal determination, retention labels, deletion/hold exclusions | NOT APPROVED |
| R-09 | Suppression/objection list | Respect marketing objections | Minimum necessary to honor objection without re-contacting | Marketing/privacy owner | Restricted minimal suppression record and deletion decision | NOT APPROVED |

## Data subject rights operating procedure
- Intake via `privacy@liffey-consulting.com`; confirm the mailbox exists, delivers externally and has an assigned monitor.
- Record only the minimum necessary metadata: request ID, received date, identity verification status, scope, deadline, responsible owner and closure date.
- Normally respond within one month (GDPR Art. 12(3)); extensions, exemptions and controller/processor distinctions require case-specific review.
- Search all relevant mailboxes, sent items, Resend records where accessible, files, candidate systems, backups and processors. Avoid deleting records subject to valid legal holds.
- Provide secure responses; document the decision, processor notifications (if applicable) and minimal closure evidence. Avoid storing full identity documents unnecessarily.
- Run quarterly deletion samples on synthetic test enquiries; annually review the schedule and update the privacy notice when practices change.

## Minimum approval checklist
- [ ] Confirm registered/trading identity and complete business address.
- [ ] Identify actual mailboxes, aliases, owners and where enquiries/CVs land.
- [ ] Approve or revise R-01 and R-02 separately for DE and IE.
- [ ] Obtain Resend, Cloudflare and Microsoft 365 retention and DPA evidence.
- [ ] Confirm whether candidate data is actually being collected and whether a talent pool exists.
- [ ] Configure retention/deletion in each relevant service, with test evidence and rollback/hold handling.
- [ ] Update DE/EN privacy notices to accurately reflect the approved policy.
- [ ] Record approver, effective date, next review date and evidence links.

**Do not merge a privacy notice that claims a specific retention period until that period is approved and implemented.**
