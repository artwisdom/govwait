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

## Next step
OWNER: DEPLOYMENT_GUIDE.md step 1 (create GitHub repo + push). A future agent session should start by reading EXECUTION_REPORT.md, then STATE.md, then MAINTENANCE_RUNBOOK.md "Adding a source" for the NZ expansion.

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- NZ/SE/NL/DK verified robots-permitted, not yet built (expansion targets in MAINTENANCE_RUNBOOK).
