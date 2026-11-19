"""Non-deploying, offline launch checks for the Liffey source tree.

Usage: python scripts/launch_readiness_check.py
This script does NOT establish legal compliance or exercise live endpoints.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
checks = []
def record(name, ok, detail):
    checks.append((name, bool(ok), detail))

app = (ROOT / "app.py").read_text(encoding="utf-8")
content = (ROOT / "content.py").read_text(encoding="utf-8")
readme = (ROOT / "README.md").read_text(encoding="utf-8")
record("Application launch gate", "launch_gate_enabled" in app, "Fail-closed controls must be reviewed manually")
record("Inquiry switch", "ACCEPT_INQUIRIES" in app, "Do not enable before Gate A")
record("Application switch", "ACCEPT_APPLICATIONS" in app, "Do not enable before Gate C")
record("English and German privacy route", "'privacy': ('legal/privacy', 'rechtliches/datenschutz')" in content, "Both routes must resolve in deployed build")
record("English and German imprint route", "'imprint': ('legal/imprint', 'rechtliches/impressum')" in content, "Verify correct legal identity and address")
record("Draft/preview disclosure", "NOT PRODUCTION READY" in readme, "Update only after evidence-based release approval")
record("No obvious hardcoded demo email in source", "hello@example.com" not in content, "Review runtime configuration separately")
for name, ok, detail in checks:
    print(f"{'PASS' if ok else 'REVIEW'}: {name} — {detail}")
print(f"Static checks: {sum(ok for _,ok,_ in checks)}/{len(checks)} passed. No production tests performed.")
sys.exit(0 if all(ok for _,ok,_ in checks) else 1)
