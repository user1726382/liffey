# Cloudflare Pages staging branch — not for production
This branch is exclusively for the public preview project `liffey-consulting-staging.pages.dev`.
It contains the public-only Pages build and a preview of the EN/DE legal address and privacy changes.
The Cloudflare Pages build command sets `LIFFEY_PAGES_STAGING=1` to:
- serve only allowlisted public static files from `dist`;
- set `X-Robots-Tag: noindex, nofollow` and `robots.txt: Disallow: /`;
- disable both contact forms and remove the live contact Worker endpoint from their rendered HTML;
- verify that internal source and documentation are excluded.

**Do not merge this staging branch into `gh-pages` or `main`.** Its build behavior is staging-specific.
The existing website and DNS are outside the scope of this branch.
