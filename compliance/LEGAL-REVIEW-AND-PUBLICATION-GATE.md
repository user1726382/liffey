# Liffey Consulting — Legal publication review and sign-off checklist
**Status:** Internal checklist, not legal certification. Prepared 19 November 2026. A licensed German/Irish lawyer is not automatically required merely to publish a website, but specialist advice is recommended where recruiting across borders, candidate sharing or employment agency licensing is uncertain.

## Gate A — Verify company facts (founder sign-off)
- [ ] Correct legal identity: `Liffey GbR`; confirm partners and who may represent the GbR.
- [x] **Business address supplied by owner (19 November 2026):** Gustav-Adolf-Straße 13, 63069 Offenbach am Main, Germany. Verify this is a serviceable business address before publication.
- [ ] Confirm whether registered as an `eGbR`; publish relevant register and number only if applicable.
- [ ] Verify business contact email, phone and mailbox monitoring. Include tax/VAT identifiers only when actually issued and legally required.
- [ ] Verify `legal/en/imprint.html` and `legal/de/impressum.html` are consistent and reachable from every page.
- [ ] Verify information under §5 DDG and any additional sector-specific obligations.

## Gate B — Verify actual website data flows (technical/privacy sign-off)
- [ ] Inventory Cloudflare DNS/Pages/Workers/Turnstile, Resend, Microsoft 365, GitHub Pages (until cutover), and any embedded scripts or third-party requests.
- [ ] Verify who acts as controller or processor for each operation; obtain/check Art. 28 GDPR agreements where required and document international transfer safeguards.
- [ ] Test both EN and DE contact forms, routing, verification, delivery, acknowledgement and data minimization. Ensure no CVs/sensitive data are solicited by the general form.
- [ ] Verify whether Turnstile, analytics or other tools set/read device information or cookies; assess consent/exemption under §25 TDDDG rather than assuming all technology is exempt.
- [ ] Confirm all privacy contacts work and that data subject rights can be handled in practice.
- [ ] Verify legitimate-interest balancing and appropriate lawful bases (Art. 6 GDPR) for each processing purpose; do not treat a mandatory 'I have read' checkbox as consent to unrelated processing.

## Gate C — Recruitment-specific review (recruitment founder + legal/privacy)
- [ ] Determine actual recruitment model: agency placement vs sourcing vs marketing vs consultancy; whether acting for DE or IE clients; controller/processor/joint-controller arrangements.
- [ ] Candidate notice (GDPR Art. 13/14), indirect sourcing notice, lawful sharing with employers, client agreements and retention implemented **before** collecting/forwarding CVs.
- [ ] Confirm German vs Irish employment/recruitment and licensing obligations, including whether Irish WRC employment agency licensing applies to the chosen activities.
- [ ] No candidate pool until separate legal basis, transparency, withdrawal and expiry controls are implemented.
- [ ] Confirm no automated scoring, profiling or sensitive data processing without a separate assessment.

## Gate D — Retention implementation (operations sign-off)
- [ ] Founder-approved policy schedule exists: `compliance/RETENTION-AND-RIGHTS.md` (19 November 2026).
- [ ] Microsoft 365 mailbox, OneDrive/SharePoint, Worker and Resend actual retention settings verified.
- [ ] Monthly deletion process, legal holds, backups and rights request process implemented and tested using synthetic records.
- [ ] EN/DE privacy pages state the **real** retention practice, including provider-specific limitations. Never claim provider deletion or an automated purge without evidence.

## Gate E — Publication decision
- [ ] Owner reviewed each legal page for factual correctness and consistency.
- [ ] Technical/privacy owner confirmed every external processor and data flow against the deployed system.
- [ ] Recruitment legal owner approved DE/IE recruiting model before candidate collection.
- [ ] Known unknowns and open issues recorded with owner and due date.
- [ ] Release approval documented with date, reviewers, commit SHA and evidence.
- [ ] If any mandatory company identification or processing notice is incomplete, **do not mark the legal review complete**.

## What a lawyer would add
A specialist could provide a formal DE/IE opinion on the GbR identity and disclosure, recruiter/agency licensing, candidate/controller arrangements, Art. 6 bases and international transfers. This is a risk-based recommendation, not an assertion that counsel must approve every routine website change.

Sources:
- §5 DDG: https://www.gesetze-im-internet.de/ddg/__5.html
- EDPB small-business guidance: https://www.edpb.europa.eu/sme/learn-the-basics/data-protection-basics_en
- German retention law: https://www.gesetze-im-internet.de/ao_1977/__147.html
