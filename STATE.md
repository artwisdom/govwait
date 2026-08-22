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

All dependencies install locally (`node_modules` inside project). No sudo or machine-level cron/launchd is required. The authorized public remote is `github.com/artwisdom/govwait`.

## Phase status
- [x] Phase 0 — Workspace scaffold (this commit)
- [x] Phase 1 — Research round (22 candidates, source audit, AI-failure test 7/10 errors)
- [x] Phase 2 — Niche: **government processing & wait times ("GovWait")** — 37/39, zero kills; runner-up: student-visa financial thresholds
- [x] Phase 3 — Pipeline green: 1,946 records (1,907 IRCC + 39 gov.uk), 484 numeric, validation 11 checks, exports in data/exports/
- [x] Phase 4 — Site: Astro 4, 1,961 pages, zero errors, ~7KB entity pages, full SEO stack
- [x] Phase 5 — Machine skin: 1,997 static API files + OpenAPI 3.1 + MCP server (smoke 8/8) + llms.txt
- [x] Phase 6 — Workflows active (refresh ~35min/mo; deploy to Cloudflare Pages)
- [x] Phase 7 — QA: all 13 gates green (docs/QA_REPORT.md)
- [x] Phase 8 — All deliverables complete
- [x] Post-launch (owner-directed): go-live executed (repo public, Pages live, cron active); design system v2; SEO upgrades (split sitemaps, IndexNow, month-token titles, FAQ/deltas); dataset expanded to **2,005 routes / 6 sources**; 4-agent research round; **/handoff package for Codex transfer (7 files)**

## Deployment status (2026-08-22, owner-authorized)
- Repo LIVE: https://github.com/artwisdom/govwait (public, main)
- Domain: `govwait.com` registered in Cloudflare Registrar; auto-renew and registrar lock enabled
- Cloudflare Pages: project `govwait` live; `govwait.com` and `www.govwait.com` active over HTTPS
- Email: `contact@govwait.com` routing active through Cloudflare Email Routing
- AI crawler policy: listed search/citation crawlers allowed; Managed robots.txt off (see `docs/CLOUDFLARE_CRAWL_POLICY.md`)
- GitHub deployment: `deploy-site` run `32547912808` green; Cloudflare production deployment is commit `e997494`
- GitHub Pages: still enabled temporarily as a rollback path; eligible for removal after explicit owner confirmation
- refresh-data workflow: ACTIVE, first run green (22s); cron Tue+Fri 14:00 UTC
- SITE_URL repo variable = https://govwait.com
- Repository variables: `SITE_URL`, `CONTACT_EMAIL`, and `CLOUDFLARE_ACCOUNT_ID` set
- Repository secret: scoped `CLOUDFLARE_API_TOKEN` set (Pages write only)

## Next step
With owner confirmation, revoke the unusable first Pages-only token and retire GitHub Pages. Then complete Search Console/Bing onboarding.

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- One unused Pages-only Cloudflare token named `govwait-github-pages-deploy` was created during setup but its value was not retained; revoke it after owner confirmation. The working encrypted token is `govwait-github-pages-deploy-v2`.
- GitHub Pages remains enabled until the owner confirms its retirement; Cloudflare is already the active DNS target and production host.
- NZ/SE/NL/DK verified robots-permitted, not yet built (expansion targets in MAINTENANCE_RUNBOOK).
