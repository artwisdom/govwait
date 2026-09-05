# STATE — Data Moat Engine

_Last updated: 2026-09-04_

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
- [x] Post-launch (owner-directed): go-live executed (repo public, Pages live, cron active); design system v2; SEO upgrades; dataset expanded to **2,318 metric routes / 9 sources / 4 governments**, including all 133 visas in Immigration New Zealand's current tool, 28 IRCC forward-looking programs, and 19 table-backed Norway UDI routes; **/handoff package for Codex transfer (7 files)**
- [x] Phase 1 growth/trust foundation: 9 new source-backed planning guides, 3 jurisdiction reports plus report hub, editorial/research-desk bylines and Article schema, contact/corrections/privacy/terms pages, consent-gated GA4, verified Grow installation, and GA4↔Search Console linking
- [x] Phase 2 production release: official IRCC forward-looking estimates for 28 programs, 3,601 application-cohort rows plus 28 headline rows, a distinct forward/backward/service-standard/percentile metric taxonomy, 12 reviewed human pages, static JSON API/OpenAPI/MCP support, and append-only monthly snapshot storage
- [x] Norway UDI deployment candidate: 19 complete table-backed routes from 5 official pages, strict schema/date checks, range-preserving normalization, country/service pages, one guide, one baseline report, sitemap/API/OpenAPI/MCP/discovery integration, and responsive rendered QA
- [x] Norway production release: commit `a9100bb`, deployment run `33462368754`, Cloudflare artifact `74bd35d1.govwait.pages.dev`, all 22 Norway URLs publicly green, and a 642-URL IndexNow HTTP 200 receipt
- [x] Phase 3 growth release: permanent Canada and New Zealand change issues, complete change tables, report RSS, a demand-proven New Zealand 2021 Resident Visa guide, honest editorial dates, and expanded crawler/IndexNow coverage; commit `d635236`, run `33934940206`, and both approved Google crawl requests are verified

## Deployment status (verified through 2026-09-04)
- Repo LIVE: https://github.com/artwisdom/govwait (public, main)
- Domain: `govwait.com` registered in Cloudflare Registrar; auto-renew and registrar lock enabled
- Cloudflare Pages: project `govwait` live; `govwait.com` and `www.govwait.com` active over HTTPS
- Email: `contact@govwait.com` routing active through Cloudflare Email Routing
- AI crawler policy: listed search/citation crawlers allowed; Managed robots.txt off (see `docs/CLOUDFLARE_CRAWL_POLICY.md`)
- GitHub deployment: Phase 3 commit `d635236` deployed green in `deploy-site` run `33934940206` (`dbdfa613.govwait.pages.dev`); the blocking 2,107-page production build and 638/638 SEO-sitemap audit passed before Cloudflare publication
- GitHub Pages: disabled; Cloudflare Pages is the sole production host
- refresh-data workflow: ACTIVE; cron Tue+Fri 14:00 UTC. The 2026-09-04 run failed
  closed on UDI `robots.txt` HTTP 403 and exported nothing; production still serves
  the last verified committed snapshot.
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
- Discoverability audit: the site now has 638 intentionally indexable pages and
  638 matching sitemap URLs across separate hubs/Canada/UK/New Zealand/Norway children. Another
  1,464 official no-value applicant pages stay live and crawlable with
  `noindex, follow` until they gain a numeric value. A blocking CI audit protects
  metadata, canonicals, internal links, structured data, robots/llms policy,
  sitemap membership, and honest child lastmod. See
  `docs/DISCOVERABILITY_AUDIT.md`.
- Canonical host: a live Cloudflare 301 sends `www` paths and queries to the
  matching apex URL.
- Current discovery notifications: the root sitemap already registered with Google
  and Bing advertises five child sitemaps containing 74 hub/editorial/report/Canada-service
  URLs, 443 Canada applicant-country URLs, 77 UK URLs, 25 New Zealand URLs, and
  19 Norway URLs. Phase 3 production run `33934940206` submitted 646 URLs
  to IndexNow—the complete 638-page indexable set plus RSS, `llms.txt`, the sitemap
  index and five child sitemaps—and received HTTP 200. Google also accepted
  priority-crawl requests for the Canada August 26 issue and New Zealand 2021
  Resident Visa guide. These
  are discovery/submission receipts, not proof of indexing, ranking, traffic,
  or revenue.

## Norway production release (verified 2026-08-31)

Production adds the fourth government, Norway, from UDI's five complete
server-rendered waiting-time tables. It intentionally excludes UDI's personalised
questionnaire routes: the collector does not guess combinations, enumerate hidden
parameters, or transmit applicant information. UDI's exact published ranges are
preserved (for example, `15–29 days`); their upper end is used only for conservative
normalized comparisons. No explicit page-reuse licence was located, so GovWait
stores factual values only, gives agency attribution and source links, and does not
copy UDI page prose.

Production receipt: **2,318 active entities / 9 sources / 4 governments; 4,244
observations; 3,629 forward-estimate rows; 2,104 HTML pages; 635 intentionally
indexable pages and 635 matching sitemap URLs.** The Norway slice adds 19 service
pages, one country hub, one guide, and one baseline report (22 indexable URLs) plus
a fifth child sitemap. Live collection returned all 19 expected UDI records with
UDI's official 2026-08-27 update date. Parser tests 12/12, validation 25 checks,
SEO audit, 2,611-file API conformance, MCP build/smoke, 635-URL IndexNow dry run,
`git diff --check`, and desktop/mobile rendered checks are green.

Commit `a9100bb` passed GitHub Actions run `33462368754` and deployed to
`74bd35d1.govwait.pages.dev`. All 19 sitemap-listed Norway service pages plus the
country hub, guide, and report return HTTP 200. The apex matches the Pages artifact;
the range/API provenance, five-child sitemap family, `llms.txt`, robots policy,
canonical tags, and path-preserving `www` redirect passed public checks. IndexNow
accepted 642 URLs with HTTP 200. These are release/discovery receipts, not proof of
indexing, traffic, ad approval, or revenue.

## Phase 3 growth release (verified 2026-09-04)

The report layer now builds permanent dated issues from consecutive observations
without hiding unchanged or unavailable states. Production contains the Canada
August 26 issue (219 numeric changes, 237 unchanged comparable values, 3 newly
available and 5 newly unavailable) and the New Zealand September 1 issue (102
numeric changes: 97 longer and 5 shorter). A valid RSS feed advertises every issue.
The New Zealand 2021 Resident Visa guide answers a demonstrated search need using
current official INZ pages and explicitly refuses to invent a wait time for the
closed route.

Release receipt: **2,318 active entities / 9 sources / 4 governments; 4,346
observations; 3,629 forward-estimate rows; 2,107 HTML pages; 638 intentionally
indexable pages and 638 matching sitemap URLs; 2,611 API files.** Parser tests
12/12, validation 25 checks, SEO audit, XML validation, API conformance, MCP smoke,
638-URL IndexNow dry run and public-edge checks passed. Commit `d635236` deployed
in run `33934940206` to `dbdfa613.govwait.pages.dev`; IndexNow accepted 646 URLs
with HTTP 200. Google added the two owner-approved URLs to its priority crawl queue.
These receipts do not prove indexing, rankings, traffic, ad approval or revenue.

## Next step

Begin the query-led Phase 4 editorial cohort: strengthen high-impression New Zealand
routes and near-win Canadian pages, then publish the Critical Purpose Visitor Visa
closed-route guide only after a fresh official-source review. Keep collecting GA4
and Search Console evidence and let the registered sitemap process; do not resubmit
URLs merely to manufacture activity. Finland Migri remains the next bounded source
candidate and requires a 5-second crawl delay.

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- The 2026-09-04 scheduled refresh failed closed because `www.udi.no/robots.txt`
  returned HTTP 403 to the GitHub runner. Nothing was exported or published; the
  last verified UDI values remain live. Do not spoof a browser UA or weaken the
  fail-closed rule. Recheck the official robots response on the next scheduled run.
- `npm audit` reports four Astro 4 build-toolchain advisories (1 moderate, 3 high). Production is pre-rendered static HTML/JSON on Cloudflare Pages—no Astro/Vite development or server runtime is exposed. Plan and test the major Astro 7/Node runtime upgrade before adding any dynamic server rendering; do not apply `npm audit fix --force` blindly.
- IRCC forward-looking estimates and Norway UDI are production-verified. Finland/Sweden/Netherlands/Denmark follow. NZ passports remain blocked.
