# Static website release checklist — F-014

**Draft.** This checklist applies to the `gh-pages` public static website and contact Worker source. It does **not** authorize deployment of the separate Python recruitment prototype; see `main/compliance/SECURITY-RELEASE-CHECKLIST.md`.

For each release record: PR link, changed files, owner, reviewer, CI run, legal/privacy review when relevant, security impact, release decision, deploy timestamp, post-deploy checks and rollback reference.

- [ ] Reviewer independent of author confirms scope and no secrets or personal data in diff.
- [ ] CI checks pass; review any false positives/coverage limitations. HTML parser is only a syntax smoke test, not a full validator. Secret regex is not comprehensive; enable GitHub secret scanning where available.
- [ ] Confirm contact form, EN/DE legal links, domain and accessibility smoke tests.
- [ ] For Worker changes: validate bindings, Turnstile, Resend routing, limits, failure handling and staged rollback.
- [ ] Confirm DNS/email changes separately; do not couple to website release.
- [ ] Record explicit GO/NO GO and verify production after merge.

**Enforcement:** require review and successful `validate` check on `gh-pages` via an effective repository ruleset (F-002). Creating this workflow alone does not enforce review or block merges. Pin action dependencies to full commit SHAs before production enforcement if supply-chain policy requires it.
