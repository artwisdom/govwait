# STATE — Data Moat Engine

_Last updated: 2026-08-21 (Phase 0)_

## Environment (verified)
| Runtime | Version |
|---|---|
| node | v20.19.6 |
| npm | 10.8.2 |
| python3 | 3.9.6 |
| git | 2.50.1 (Apple Git-155) |
| sqlite3 | 3.51.0 |

All dependencies install locally (`node_modules` inside project). No global installs, no sudo, no cron/launchd. Git is local-only — no remote will ever be added by the agent.

## Phase status
- [x] Phase 0 — Workspace scaffold (this commit)
- [x] Phase 1 — Research round (22 candidates, source audit, AI-failure test 7/10 errors)
- [x] Phase 2 — Niche: **government processing & wait times ("GovWait")** — 37/39, zero kills; runner-up: student-visa financial thresholds
- [x] Phase 3 — Pipeline green: 1,946 records (1,907 IRCC + 39 gov.uk), 484 numeric, validation 11 checks, exports in data/exports/
- [x] Phase 4 — Site: Astro 4, 1,961 pages, zero errors, ~7KB entity pages, full SEO stack
- [x] Phase 5 — Machine skin: 1,997 static API files + OpenAPI 3.1 + MCP server (smoke 8/8) + llms.txt
- [x] Phase 6 — Workflows written (refresh ~35min/mo, deploy), INACTIVE until pushed
- [x] Phase 7 — QA: all 13 gates green (docs/QA_REPORT.md)
- [x] Phase 8 — All deliverables complete; SESSION DONE

## Deployment status (2026-08-21, owner-authorized)
- Repo LIVE: https://github.com/artwisdom/govwait (public, main)
- GitHub Pages: enabled (workflow source), custom domain govwait.com set, deploy green
- refresh-data workflow: ACTIVE, first run green (22s); cron Tue+Fri 14:00 UTC
- SITE_URL repo variable = https://govwait.com

## Next step
OWNER: (1) buy govwait.com and point DNS (A 185.199.108.153/.109/.110/.111 + CNAME www -> artwisdom.github.io); (2) provide contact email -> set CONTACT_EMAIL repo variable + About page. Then: enforce HTTPS, Search Console + sitemap, NZ source expansion per MAINTENANCE_RUNBOOK.

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- CONTACT_EMAIL not yet set (owner chose an alias, address pending) — crawler UA runs as "owner-pending" until then.
- NZ/SE/NL/DK verified robots-permitted, not yet built (expansion targets in MAINTENANCE_RUNBOOK).
