#!/usr/bin/env python3
"""Validate local HTML href/src references without fetching external resources.

This is a static check, not a crawler or a substitute for deployed-site tests.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[2]
SKIP_DIRS = {".git", ".github", "dist", "node_modules", "compliance"}
SCHEMES = {"http", "https", "mailto", "tel", "data", "blob", "sms"}
missing = []
checked = 0

def resolve_ref(page: Path, raw: str):
    value = raw.strip()
    if not value or value.startswith(("#", "//", "{{", "${")):
        return None
    try:
        u = urlsplit(value)
    except ValueError:
        return None
    if u.scheme.lower() in SCHEMES or u.netloc:
        return None
    if u.scheme:
        return None
    if not u.path:
        return None
    path = unquote(u.path)
    if any(x in path for x in ("${", "{{", "}}", "<%", "%>")):
        return None
    target = (ROOT / path.lstrip("/")) if path.startswith("/") else (page.parent / path)
    target = target.resolve()
    if not target.is_relative_to(ROOT):
        return "Reference escapes repository root"
    if target.is_file() or (target.is_dir() and (target / "index.html").is_file()):
        return None
    if not target.suffix and (target.with_suffix(".html").is_file() or (target / "index.html").is_file()):
        return None
    return f"Missing local target: {path}"

class Links(HTMLParser):
    def __init__(self, page):
        super().__init__(convert_charrefs=True)
        self.page = page
    def handle_starttag(self, tag, attrs):
        global checked
        attributes = dict(attrs)
        for key in ("href", "src", "poster"):
            if key not in attributes or not attributes[key]:
                continue
            if key == "href" and tag not in ("a", "link", "area"):
                continue
            if key == "src" and tag not in ("script", "img", "source", "iframe", "video", "audio"):
                continue
            checked += 1
            issue = resolve_ref(self.page, attributes[key])
            if issue:
                missing.append((str(self.page.relative_to(ROOT)), key, attributes[key], issue))

pages = sorted(p for p in ROOT.rglob("*.html") if not any(x in SKIP_DIRS for x in p.relative_to(ROOT).parts))
if not pages:
    sys.exit("No HTML pages found")
for page in pages:
    try:
        Links(page).feed(page.read_text(encoding="utf-8"))
    except Exception as exc:
        missing.append((str(page.relative_to(ROOT)), "parse", "", str(exc)))
print(f"Scanned {len(pages)} HTML files and {checked} references")
for page, attr, ref, issue in missing:
    print(f"{page}: {attr}={ref!r}: {issue}")
if missing:
    print(f"FAIL: {len(missing)} broken local references")
    sys.exit(1)
print("PASS: no broken local references found")
