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
- [ ] Phase 4 — Human skin (Astro static site) → `/site`
- [ ] Phase 5 — Machine skin (static JSON API + MCP server + llms.txt) → `/machine`
- [ ] Phase 6 — Automation blueprints → `/.github/workflows` (INACTIVE until owner pushes)
- [ ] Phase 7 — QA gauntlet → `/docs/QA_REPORT.md`
- [ ] Phase 8 — Deliverables + final report

## Next step
Phase 4: Astro static site from data/exports/latest.json. URL scheme: /canada/visitor-visa/from-india/ etc. SITE_URL placeholder: https://govwait.example (owner swaps at deploy).

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- NZ/SE/NL/DK verified robots-permitted, not yet built (expansion targets in MAINTENANCE_RUNBOOK).
