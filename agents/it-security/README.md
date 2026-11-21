# Liffey IT & Security Agent — pilot specification
Status: **pilot / not deployed**. Owners: Leo and Josie (joint approval). Last reviewed: 2026-11-19.

## Scope
Read-only: website and contact-form synthetic health, HTTPS/TLS, DNS and email authentication (SPF/DKIM/DMARC), Cloudflare configuration inventory, GitHub repository posture, M365 identity/access and SharePoint sharing *when appropriate permissions exist*. Never infer a control is compliant from lack of evidence.

## Architecture
- Detection: scheduled GitHub Actions HTTPS check; later independent external uptime service to avoid GitHub Actions outages masking downtime.
- Evidence: GitHub Actions run URL and incident issue; do not put tokens, candidate records, mailbox content or customer data in issues.
- Triage: deterministic failure classification first; optional LLM summarisation after sanitisation.
- Notification: GitHub issue initially. Teams delivery requires an approved application/workflow and scoped credentials; no Teams webhook or credentials stored in source.
- Human approval: security policy changes, DNS, production deploys, credential rotation, mailbox changes, external messages and destructive actions.
- Logs: immutable provider audit events where available, plus append-only incident event records. GitHub issues are operational records, not tamper-proof audit logs.

## Least privilege
| Identity | Access | Forbidden |
| --- | --- | --- |
| Uptime workflow | GitHub Actions contents:read, issues:write | Repo admin, secrets, deployments |
| Cloudflare monitor | Zone DNS/analytics read only, scoped to liffey-consulting.com | DNS/WAF/Workers writes |
| M365 auditor | Scoped reports and directory/security read only, subject to admin approval | Mail.ReadWrite, broad Files.ReadWrite, directory writes |
| Teams notifier | Post only to designated IT alerts channel through approved flow | Read all chats, edit membership |
| AI reasoning service | Sanitised incidents and approved runbooks | Secrets, CVs, privileged production credentials |

## Incident lifecycle
Detected → deduplicated → evidence captured → severity assigned → founder notified → diagnosis → proposed remediation → approval (if write) → verification → closure and postmortem.
P1: confirmed outage or suspected compromise; alert immediately. P2: degraded critical service; same-day. P3: hygiene and informational; weekly.
Avoid automated issue storms: deduplicate by incident key; the starter workflow only opens an issue on failed scheduled run and may generate duplicates until a deduplication step is added.

## Approval policy
Two-founder approval for changing production DNS, access permissions, security controls, deleting data, rotating critical secrets, and any public customer communication. One named founder may approve a reversible, pre-authorised low-risk fix after change control is established. Every action logs requester, approver, evidence, timestamp, result and rollback.

## Acceptance tests
1. Known-good HTTPS endpoint succeeds.
2. Intentionally failing test endpoint raises a failure with workflow evidence.
3. No issue/notification on healthy check.
4. No secrets or personal data in logs.
5. A production fix cannot occur without approval.
6. Incident closed only after a second successful check.
7. Independent monitoring and Teams delivery configured before claiming 24/7 alerting.

## Rollout
P0: read-only GitHub workflow and issue triage; P0: independent external monitor; P0: Teams notifications with tested routing; P1: Cloudflare/DNS/SSL posture; P1: M365 identity and sharing audit after permission review; P1: approved runbooks; P2: AI-assisted diagnostics and monthly scorecard.
