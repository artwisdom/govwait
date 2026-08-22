# STATE — Data Moat Engine

_Last updated: 2026-08-22_

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
- [x] Phase 8 — All deliverables complete
- [x] Post-launch (owner-directed): go-live executed (repo public, Pages live, cron active); design system v2; SEO upgrades (split sitemaps, IndexNow, month-token titles, FAQ/deltas); dataset expanded to **2,005 routes / 6 sources**; 4-agent research round; **/handoff package for Codex transfer (7 files)**

## Deployment status (2026-08-22, owner-authorized)
- Repo LIVE: https://github.com/artwisdom/govwait (public, main)
- Domain: `govwait.com` registered in Cloudflare Registrar; auto-renew and registrar lock enabled
- Cloudflare Pages: project `govwait` live; `govwait.com` and `www.govwait.com` active over HTTPS
- Email: `contact@govwait.com` routing active through Cloudflare Email Routing
- AI crawler policy: listed search/citation crawlers allowed; Managed robots.txt off (see `docs/CLOUDFLARE_CRAWL_POLICY.md`)
- GitHub Pages: still enabled temporarily as a rollback path until the first GitHub-driven Cloudflare deployment is green
- refresh-data workflow: ACTIVE, first run green (22s); cron Tue+Fri 14:00 UTC
- SITE_URL repo variable = https://govwait.com
- CONTACT_EMAIL and Cloudflare deployment settings: pending GitHub re-authentication

## Next step
Re-authenticate GitHub, set the remaining repository variable/secret, push the Cloudflare workflow and contact-page update, verify one green deployment, then retire GitHub Pages.

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- CONTACT_EMAIL is ready (`contact@govwait.com`) but not yet stored as a GitHub repository variable; unattended refreshes use `owner-pending` until that setting lands.
- Cloudflare production is live from a verified direct upload; GitHub-driven Cloudflare deployment is not complete until the scoped token is stored and the workflow is green.
- NZ/SE/NL/DK verified robots-permitted, not yet built (expansion targets in MAINTENANCE_RUNBOOK).
