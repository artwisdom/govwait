# STATE — Data Moat Engine

_Last updated: 2026-08-25_

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
- [x] Post-launch (owner-directed): go-live executed (repo public, Pages live, cron active); design system v2; SEO upgrades; dataset expanded to **2,271 metric routes / 7 sources / 3 governments**, including all 133 visas in Immigration New Zealand's current tool; **/handoff package for Codex transfer (7 files)**
- [x] Phase 1 growth/trust foundation: 9 new source-backed planning guides, 3 jurisdiction reports plus report hub, editorial/research-desk bylines and Article schema, contact/corrections/privacy/terms pages, consent-gated GA4, verified Grow installation, and GA4↔Search Console linking

## Deployment status (verified through 2026-08-25)
- Repo LIVE: https://github.com/artwisdom/govwait (public, main)
- Domain: `govwait.com` registered in Cloudflare Registrar; auto-renew and registrar lock enabled
- Cloudflare Pages: project `govwait` live; `govwait.com` and `www.govwait.com` active over HTTPS
- Email: `contact@govwait.com` routing active through Cloudflare Email Routing
- AI crawler policy: listed search/citation crawlers allowed; Managed robots.txt off (see `docs/CLOUDFLARE_CRAWL_POLICY.md`)
- GitHub deployment: Phase 1 commit `2a1729c` deployed green in `deploy-site` run `32921188032` (`dfb3a5be.govwait.pages.dev`) after integrating refresh-bot commit `3278afe`
- GitHub Pages: disabled; Cloudflare Pages is the sole production host
- refresh-data workflow: ACTIVE, first run green (22s); cron Tue+Fri 14:00 UTC
- SITE_URL repo variable = https://govwait.com
- Repository variables: `SITE_URL`, `CONTACT_EMAIL`, `PUBLIC_GA4_MEASUREMENT_ID`, and `CLOUDFLARE_ACCOUNT_ID` set
- Repository secret: scoped `CLOUDFLARE_API_TOKEN` set (Pages write only)
- Token hygiene: unused original account token deleted; working `govwait-github-pages-deploy-v2` retained and re-verified by deployment
- Search ownership: Google Search Console domain property `govwait.com` and Bing
  Webmaster Tools site `https://govwait.com/` verified by DNS on 2026-08-22
- Measurement setup: GA4 account/property `GovWait`, production web stream
  `15489361827`, and public measurement ID `G-6ZJ7J3526N` are active. GA4 loads
  only after an explicit analytics choice; advertising storage, ad user data,
  ad personalization, Google Signals, and ad-personalization signals remain off.
  The GA4 stream is linked to the `govwait.com` Search Console domain property.
- Grow: the owner accepted the Grow bundle and the publisher portal independently
  verified the exact site-specific script on production. Automailer and Print Pass
  are off; the default subscribe form is paused; inline/mobile recommended-content
  overlays are off; the small reader/share widget remains enabled. This is
  infrastructure readiness, not Journey/ad-network approval.
- Search preflight: Google live URL test says the homepage is available to Google,
  crawl/page fetch/indexing are allowed, and the declared canonical is correct; three
  representative pages each passed the live Rich Results Test with one valid
  Breadcrumb item
- Sitemap onboarding: `https://govwait.com/sitemap.xml` submitted to both search
  engines on 2026-08-23. Google re-read it as a **Sitemap index / Success**; Bing
  accepted it and currently reports **Submitted / Processing**. The public sitemap
  independently returns HTTP 200 with `application/xml`.
- Discoverability audit: the site now has 603 intentionally indexable pages and
  603 matching sitemap URLs across separate hubs/Canada/UK/New Zealand children. Another
  1,462 official no-value applicant pages stay live and crawlable with
  `noindex, follow` until they gain a numeric value. A blocking CI audit protects
  metadata, canonicals, internal links, structured data, robots/llms policy,
  sitemap membership, and honest child lastmod. See
  `docs/DISCOVERABILITY_AUDIT.md`.
- Canonical host: a live Cloudflare 301 sends `www` paths and queries to the
  matching apex URL.
- Current discovery notifications: the root sitemap already registered with Google
  and Bing advertises four child sitemaps containing 56 hub/editorial/report URLs,
  445 Canada URLs, 77 UK URLs, and 25 New Zealand URLs. Phase 1 production deploy
  run `32921188032` submitted the complete 603-URL current set to IndexNow and
  received HTTP 200. These
  are discovery/submission receipts, not proof of indexing, ranking, traffic,
  or revenue.

## Next step
Allow the registered root sitemap and successful IndexNow notification to be
processed while GA4 and Search Console collect a real baseline. Do not describe
the integrations as proof of indexing or traffic. Apply to Journey only when the
documented traffic/content gate is actually met and the owner approves the
application at action time; do not enable ad code merely because Grow is present.

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- `npm audit` reports four Astro 4 build-toolchain advisories (1 moderate, 3 high). Production is pre-rendered static HTML/JSON on Cloudflare Pages—no Astro/Vite development or server runtime is exposed. Plan and test the major Astro 7/Node runtime upgrade before adding any dynamic server rendering; do not apply `npm audit fix --force` blindly.
- New Zealand INZ processing times are built. Norway/Finland/Sweden/Netherlands/Denmark remain expansion targets; NZ passports remain blocked.
