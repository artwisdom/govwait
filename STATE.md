# STATE — Data Moat Engine

_Last updated: 2026-09-29_

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
- [x] Phase 4 query-led growth release: commit `8a512aa`, deployment run `34073350458`, Cloudflare artifact `51f5121a.govwait.pages.dev`, 639/639 production sitemap audit, IndexNow HTTP 200, and the approved Google crawl request are verified
- [x] Phase 4B Canadian near-win production release: commit `fa73c2f`, deployment run `34176619821`, Cloudflare artifact `2e3649f8.govwait.pages.dev`, four demonstrated Search Console pages with stronger query-matching content, the IRCC visitor-biometrics correction, 639/639 production sitemap audit, public-edge verification, and a 645-URL IndexNow HTTP 200 receipt
- [x] Phase 5A dataset authority release: commit `fd7ba67`, deployment run `34300806761`, Cloudflare artifact `ca3bad6a.govwait.pages.dev`, canonical dataset hub, four generated CSV distributions, dataset metadata, fuller OpenAPI/AI discovery, public-repository README, source-specific reuse guidance, 641/641 public sitemap verification, and a 656-URL IndexNow HTTP 200 receipt
- [x] Phase 5B npm and MCP Registry 0.1.0 release: public-source commit `ec284ef`; self-contained MCP data bundle, deterministic provenance hashes, exact nine-file npm allow-list with a scoped Apache 2.0 code licence and separate data notice; verified public `govwait-mcp@0.1.0`; interactive 2FA required and token publishing disallowed; clean-install smoke verification; active official Registry listing `io.github.artwisdom/govwait` with exact npm ownership linkage
- [x] Phase 5C Glama build preflight: the public GovWait listing is claimed by GitHub owner `artwisdom`; Auto-Release is off; build-only test `01a0cc04-a9e8-7f71-9017-f1be4e441241` succeeded against commit `64db085` and exposed all four MCP tools; no Glama release was created
- [x] Phase 5C Glama repository-readiness candidate: this revision makes the root Apache 2.0 terms machine-detectable, preserves the code-only/data-exclusion boundary in `SOFTWARE-SCOPE.md`, and adds live-schema-valid `glama.json`; remote licence detection must be verified after GitHub publication, while Glama sync/build/release and deployment remain separate owner gates
- [x] Phase 6A production recovery: UDI is retained as `source_unavailable` and excluded from active collection; the GitHub proof refreshed all eight healthy Canada/UK/New Zealand sources without requesting UDI, preserved all 19 UDI records append-only, and deployed final data commit `5a99df2` in run `36082052053` to `81c691b0.govwait.pages.dev` with 603-URL IndexNow HTTP 200 and public-edge parity.
- [x] Phase 6B refresh-to-deploy hardening: a data-changing refresh calls the existing deploy workflow exactly once as a reusable job, pins the exact bot commit, refuses stale-main deployment, skips no-change runs, guards against duplicate bot-push deployment and propagates deployment failure without adding a personal token or secret.
- [x] Phase 6C MCP 0.1.1 release: source commit `32aec30`; exact audited nine-file tarball published publicly as `govwait-mcp@0.1.1` under owner `artwisdom`; `latest=0.1.1` at that checkpoint; registry bytes matched the retained artifact; clean public installation passed all 21 MCP assertions with zero vulnerabilities. The official MCP Registry and Glama both exposed active/latest 0.1.1 at that checkpoint while preserving 0.1.0 history; Glama's verified test was `01a0e42d-b3cd-7f6c-b47e-ba64cf1fc293` and Auto-Release stayed off.
- [x] Phase 6D MCP 0.1.2 documentation-correction release: source commit `efc90490` and npm receipt commit `b36f6c47` are on `main`; npm exposes the exact audited nine-file `govwait-mcp@0.1.2` artifact as `latest`; a clean public installation passed all 21 MCP assertions with zero vulnerabilities; and the official MCP Registry exposes active/latest 0.1.2 while preserving active 0.1.1 and 0.1.0 history. Glama also exposes verified public/latest 0.1.2 from build test `01a0f8a3-fc04-7e06-abb9-7b412f95d5dc`, retains 0.1.1 and 0.1.0 in history, and keeps Auto-Release off.

## Deployment status (verified through 2026-09-24 EDT)
- Repo LIVE: https://github.com/artwisdom/govwait (public, main)
- Domain: `govwait.com` registered in Cloudflare Registrar; auto-renew and registrar lock enabled
- Cloudflare Pages: project `govwait` live; `govwait.com` and `www.govwait.com` active over HTTPS
- Email: `contact@govwait.com` routing active through Cloudflare Email Routing
- AI crawler policy: listed search/citation crawlers allowed; Managed robots.txt off (see `docs/CLOUDFLARE_CRAWL_POLICY.md`)
- GitHub deployment: current production data commit `5a99df2` deployed green in `deploy-site` run `36082052053` (`81c691b0.govwait.pages.dev`); the blocking 2,112-page build and 634/634 SEO-sitemap audit passed before Cloudflare publication, and the apex matched the artifact byte-for-byte on representative HTML/JSON
- GitHub Pages: disabled; Cloudflare Pages is the sole production host
- refresh-data workflow: ACTIVE; cron Tue+Fri 14:00 UTC. Phase 6A proof run
  `36081437732` refreshed all eight active Canada/UK/New Zealand sources, skipped
  UDI without a request, passed 35 checks and created `5a99df2`. Phase 6B directly
  calls the reusable deploy workflow only after a validated data change, with an
  exact-SHA/still-main gate and parent-run failure propagation.
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
- Discoverability audit: the site now has 634 intentionally indexable pages and
  634 matching sitemap URLs across separate hubs/Canada/UK/New Zealand/Norway children. Another
  1,464 official no-value applicant pages stay live and crawlable with
  `noindex, follow` until they gain a numeric value. A blocking CI audit protects
  metadata, canonicals, internal links, structured data, robots/llms policy,
  sitemap membership, and honest child lastmod. See
  `docs/DISCOVERABILITY_AUDIT.md`.
- Canonical host: a live Cloudflare 301 sends `www` paths and queries to the
  matching apex URL.
- Current discovery notifications: the root sitemap already registered with Google
  and Bing advertises five child sitemaps containing 634 unique current URLs. The
  final Phase 6A production run `36082052053` notified IndexNow of 603 changed
  public/discovery URLs and received HTTP 200. No manual Google request was made
  for Phase 6A. Google previously accepted the owner-approved Critical Purpose
  Visitor Visa guide, Canada issue and New Zealand 2021 Resident Visa guide crawl
  requests. These
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

## Phase 4 growth release (production-verified 2026-09-06)

Fresh Search Console evidence for August 21 through September 4 shows 15 clicks
from 5.95K displayed impressions, 0.3% CTR and average position 40.9. Five Critical
Purpose query variants total 429 impressions. The Skilled Migrant and Specific
Purpose service pages have 558 and 548 impressions respectively, while the
Dependent Child Resident page has 89 impressions at average position 31.6.

The bounded first cohort adds one source-backed Critical Purpose Visitor Visa
closed-route guide and route-specific improvements to those three existing New
Zealand pages. It adds the new guide to the home page, guide hub, `llms.txt` and
sitemap; applies September 6 `lastmod` only to pages substantively edited that
day; and adds blocking audit checks for all four pages. Official INZ route,
phase-out and case-status sources were freshly reviewed.

Release receipt: **2,318 active entities / 9 sources / 4 governments; 2,108 HTML
pages; 639 intentionally indexable pages and 639 matching sitemap URLs; 2,611
API files.** Parser tests 12/12, static build, SEO audit, sitemap/RSS XML,
API conformance, MCP build/smoke, 639-URL IndexNow dry run, `git diff --check`,
and desktop/mobile rendered checks are green. The API packaging check also caught
and corrected a missing copied OpenAPI artifact before the final passing build.

Commit `8a512aa` passed GitHub Actions run `34073350458` and deployed to
`51f5121a.govwait.pages.dev`. The apex guide is byte-identical to that artifact;
all four Phase 4 pages, 639 unique sitemap URLs, XML/RSS, `llms.txt`, robots policy,
canonicals and the path-preserving `www` redirect passed public checks. IndexNow
accepted 646 affected public/discovery URLs with HTTP 200. Google added the new
guide to its priority crawl queue. These are deployment and submission receipts,
not proof of indexing, rankings, traffic, ad approval or revenue.

## Phase 4B Canadian near-win release (production-verified 2026-09-07)

Search Console already showed impressions and average positions 4.3–10.7 for
Private Refugee from Pakistan and Visitor Visa from Qatar, Colombia and Nepal.
Those four existing URLs now have query-matching titles, descriptions and H1s,
plus either a transparent same-snapshot comparison or source-backed refugee-stage
context and direct official next-step links. No URL or official value changed.

A fresh IRCC primary-source review also found that the current visitor-visa guide
says the displayed processing time excludes the time needed to give biometrics.
The factual correction applies to all 211 rendered visitor-country pages and the
India and Philippines visitor guides. The 171 indexable visitor-country pages,
the Pakistan near-win page and both guides receive an honest September 7
`lastmod`; unrelated URLs retain their existing dates.

Release receipt: **2,318 active entities / 9 sources / 4 governments; 2,108 HTML
pages; 639 intentionally indexable pages and 639 matching sitemap URLs; 2,611
API files.** Parser tests 12/12, validation, static build, SEO and XML checks, API
conformance, MCP build/smoke, 639-URL IndexNow dry run, `git diff --check`, and
desktop/mobile rendered checks passed.

Commit `fa73c2f` passed GitHub Actions run `34176619821` and deployed to
`2e3649f8.govwait.pages.dev`. The apex and artifact matched byte-for-byte on a
representative visitor page and the refugee page; all four target pages, both
corrected guides, crawler files, five child sitemaps with 639 unique URLs,
canonicals and the path-preserving `www` redirect passed public checks. IndexNow
accepted 645 affected public/discovery URLs with HTTP 200. No manual Google crawl
request was made. These are deployment and discovery receipts, not proof of
indexing, rankings, traffic, ad approval or revenue.

## Phase 5A dataset authority release (production-verified, 2026-09-08)

This bounded release turns the existing machine layer into a citable public
dataset without adding programmatic SEO pages. It generates current, append-only
history, forward-looking and source-register CSVs from the same validated exports
as the JSON API; publishes a metadata endpoint and canonical `/data/` page with
Dataset structured data; adds source-specific reuse terms; and gives the public
repository a complete root README.

Production receipt: **2,318 routes / 4,346 observations / 3,629 projection rows
/ 9 sources; 2,110 HTML pages; 641 intentionally indexable pages and 641 matching
sitemap URLs; 2,616 API/download files checked.** Commit `fd7ba67` passed run
`34300806761` and deployed to `ca3bad6a.govwait.pages.dev`. The production-configured
local build matched the artifact byte-for-byte for `/data/`, `/data-license/` and
dataset metadata; the apex matched the artifact, allowing for Cloudflare's email
address obfuscation on the licensing page. All four CSVs, metadata, OpenAPI,
crawler files, 641 unique sitemap URLs, canonical links and the path-preserving
`www` redirect passed public checks. IndexNow accepted 656 affected URLs with HTTP
200. On 2026-09-13, Google Search Console accepted the owner-approved indexing
request for `https://govwait.com/data/` and reported that the URL was added to a
priority crawl queue. At inspection time it was not indexed; the request does
not establish indexing, rankings, traffic, ad approval or revenue.

## Phase 5B MCP public npm release (verified 2026-09-20)

The MCP server now defaults to package-owned copies of `latest.json`,
`history.json` and `forward-looking.json`, while preserving an explicit local
`GOVWAIT_DATA_DIR` override. The build creates deterministic provenance metadata
with dataset counts, byte sizes and SHA-256 hashes. The packed artifact has an
exact nine-file allow-list, including a scoped Apache 2.0 software licence and a
separate government-data notice, and rejects databases, caches, logs,
credentials, source maps, source files and test files.

Local release verification passed: all 15 protocol assertions ran directly and
from an isolated temporary copy of the tarball; the isolated server loaded
2,318 routes from its own data directory; all three data hashes matched. All 20
release metadata checks passed. The published artifact contains exactly nine
files, measures 118,593 bytes packed and 4,239,563 bytes unpacked, and has local
SHA-256
`e881e02555f3133124262c69f48cf7706259595519f5ad25eb1c67338c15ebda`.
The npm registry reports SHA-1
`412c5b6c4c0ada6c412c5f105b6118b20e6ccfd0` and integrity
`sha512-u0ksXNhTREZI0rvPfCZ27qTDupI4ZpFA2lopo9rhGMy6RgXcjb6ZQZZA6XgJ0OhoIVqBKJA12YRrBwMucrXeVg==`.

Public-source commit `ec284ef64c30afdcf45c1666178c473b86ac7c63` is on
`origin/main`. It removed the npm publication block and updated the transitive
lockfile packages `fast-uri` 3.1.8, `hono` 4.13.8 and `qs` 6.16.0; the release
audit reported zero vulnerabilities. The exact audited tarball was published
under npm owner `artwisdom` as
[`govwait-mcp@0.1.0`](https://www.npmjs.com/package/govwait-mcp/v/0.1.0), and
`latest` resolves to `0.1.0`. The public package's `mcpName` exactly matches
`io.github.artwisdom/govwait`.

A fresh temporary installation from the public npm registry passed the complete
15-assertion smoke suite and loaded 2,318 routes from the installed package's own
data. Immediately before Registry publication, official `mcp-publisher` 1.8.1
validated `server.json` against the live service and the exact identity/version
returned HTTP 404. After explicit owner approval, GitHub-authenticated publication
succeeded for `io.github.artwisdom/govwait` version `0.1.0`.

The exact official Registry API and search endpoint both returned HTTP 200. The
listing is `active`, `isLatest: true`, and the exact-name/version search count is
one; `publishedAt` is `2026-09-21T00:59:17.656115Z`. The temporary Registry login
was logged out and the checksum-verified publisher files were deleted afterward.
Apache 2.0 remains limited to GovWait-owned software code; bundled government
data remains excluded under `DATA-NOTICE.md`. No publishing token, trusted
publisher, workflow, other directory submission, Cloudflare deployment or
IndexNow notification was created or performed.

Post-publication hardening is verified: authenticated npm 11.19.1 command
`npm access set mfa=publish govwait-mcp` exited 0 after security-key approval.
That command sends `publish_requires_tfa=true` and
`automation_token_overrides_tfa=false`, requiring interactive 2FA and preventing
automation/bypass tokens from publishing this package. No trusted publisher is
configured.

## Phase 6A production recovery (verified 2026-09-24 EDT / 2026-09-25 UTC)

The UDI source is closed to automated collection from 2026-09-04 under the
existing no-bypass policy. The release introduces an explicit eight-source
active registry and retains UDI's 19 routes under `source_unavailable`, with its
last successful verification frozen. GitHub proof run `36081437732` completed
Canada, UK and New Zealand without requesting UDI. The production dataset contains 2,316
retained routes, 6,617 public history observations and 7,285 forward estimates.

All 19 UDI entities and observations match the pre-refresh database exactly.
The source's robots check and verification evidence did not advance. The current
INZ selector legitimately removed Post Study Work Visa, so its two current
percentile entities were deactivated while append-only history remained intact.

Acceptance is green: 35 pipeline checks, 15 tests, 2,112 HTML pages,
634/634 SEO-sitemap parity, 2,613 conforming API files, and the unpublished MCP
0.1.1 direct/isolated package suite. Recovery commit `d31ee85` deployed in run
`36081326233`; the proof created data commit `5a99df2`, which deployed in final
run `36082052053` to `81c691b0.govwait.pages.dev`. IndexNow accepted 603 changed
URLs with HTTP 200, and public-edge HTML/JSON, source-state, sitemap, redirect and
removed-route checks passed.

The proof also exposed a GitHub automation gap: a bot push made with
`GITHUB_TOKEN` does not start a second push workflow. Phase 6B makes `deploy-site`
reusable and calls it only when the refresh job reports a data change. The call
passes the exact commit SHA; deployment refuses it if checkout differs or `main`
has advanced, and any deployment failure fails the parent refresh. actionlint
1.7.12, 17/17 workflow assertions and current/stale exact-SHA execution tests pass.
No additional source refresh was used to test this hardening.

## Phase 6C MCP 0.1.1 release candidate (local preflight, 2026-09-24 EDT)

The self-contained package now matches the exact production exports generated at
`2026-09-25T01:25:45.254Z`: 2,316 retained routes (2,297 active-source and 19
source-unavailable), 6,617 history observations and 7,229 forward cohorts. The
three package-owned export hashes exactly match `data/exports/`; UDI remains
frozen at 19 routes with `current_value: null` and its 45-day value exposed only
as a dated `last_verified_value`.

`npm run prepare:rc` passed the 20-assertion direct smoke suite, 27/27 local
metadata/licensing checks and a 21-assertion isolated package smoke suite. A
separate real temporary `npm install` of the retained tarball passed the same 21
assertions and reported zero vulnerabilities. The exact nine-file artifact is
162,492 bytes packed / 6,562,302 bytes unpacked with SHA-256
`2a76788354551b12c50f452b03e39de454cb21119b9baee990863d890ebcbe28`.

The live official Registry validator exposed and then accepted a shortened
94-character description; checksum-pinned `mcp-publisher` 1.8.1 now reports
`server.json` valid, and the live limit is now a local regression check. At that
preflight, npm listed only `0.1.0` and `latest=0.1.0`; the official Registry
returned HTTP 200 for active/latest `0.1.0`, HTTP 404 for `0.1.1`, and one exact
search result. Therefore 0.1.1 was available and entirely unpublished.
At that preflight checkpoint, no commit, push, npm publication,
Registry/Glama/directory update, token/workflow, deployment, indexing request,
outreach, spend or account change had occurred.

The separately approved GitHub-only source gate then committed and pushed this
verified 0.1.1 candidate and its audit records to `main`. The exact tarball and
sidecar remained ignored and local. None of the changed paths match the
`deploy-site` push filter, so this source handoff does not authorize or require a
site deployment. At that GitHub-only checkpoint, npm, the official MCP Registry
and Glama remained unchanged.

### Phase 6C MCP 0.1.1 public npm release (verified 2026-09-25 EDT)

Under a later exact-publication approval, interactive security-key authentication
published only the retained audited tarball as
[`govwait-mcp@0.1.1`](https://www.npmjs.com/package/govwait-mcp/v/0.1.1) under
npm owner `artwisdom`. npm recorded publication at
`2026-09-26T02:06:09.064Z`; both `latest` and the public package version resolve
to `0.1.1`.

The public registry reports the expected nine files, 6,562,302 unpacked bytes,
SHA-1 `10372162f345ed260ba050dc75d5e6b09e4dc7d3` and integrity
`sha512-2hjbVOIYGprfPLiZ3iSxa2Q4lgKZxOFjZbEuFgrKhaoztQ+GlEzJAWviT/hQ1esYyO6a7AhOzSinzTEIwoNnlQ==`.
The downloaded public tarball is byte-for-byte identical to the retained audited
artifact; both have SHA-256
`2a76788354551b12c50f452b03e39de454cb21119b9baee990863d890ebcbe28`.
A fresh temporary public-registry installation added 95 packages, audited 96 with
zero vulnerabilities, loaded all 2,316 routes from its package-owned data and
passed all 21 MCP smoke assertions.

At the npm-only checkpoint, the release had not changed source, created a token
or workflow, triggered a deployment, or updated the official MCP Registry, Glama
or another directory. The official Registry then still returned active/latest
0.1.0 and HTTP 404 for exact 0.1.1.

### Phase 6C official MCP Registry 0.1.1 release (verified 2026-09-27 EDT)

Under a later Registry-only approval, checksum-verified official
`mcp-publisher` 1.8.1 revalidated and published only
`machine/mcp-server/server.json` for `io.github.artwisdom/govwait@0.1.1` through
interactive GitHub authentication. The exact-version and `latest` endpoints now
return HTTP 200 with status `active`, `isLatest: true`, and published timestamp
`2026-09-27T16:37:58.861649Z`. Exact-name/latest search returns one result.
Version history returns both 0.1.1 and 0.1.0, with 0.1.0 retained as active but
no longer latest.

The official publisher session was logged out after verification. No npm
version, long-lived publishing token, workflow, Glama or other directory update,
source change, commit, push, deployment, indexing request, outreach, spending or
account-setting change was included.

### Phase 6C Glama 0.1.1 release (verified 2026-09-27 EDT)

Under a separate Glama-preflight approval, the claimed listing synced from
commit `8a368e6` to GitHub `main` commit `90e2d45223733055931552ebd405aa6e20048896`.
The first build test exposed that `npm run build` re-bundled the newer site
exports rather than preserving the exact audited npm 0.1.1 package data. It was
not released. The Glama-only build step was narrowed to `npm exec -- tsc`, which
compiles the server without rewriting its committed package-owned data. Final
build-only test
[`01a0e41a-3a3b-7107-b30a-e20beadfd22f`](https://glama.ai/mcp/servers/artwisdom/govwait/admin/dockerfile/tests/01a0e41a-3a3b-7107-b30a-e20beadfd22f)
succeeded in 10.1 seconds against that exact commit. The container loaded 2,316
routes from audited dataset `2026-09-25T01:25:45.254Z`, negotiated MCP protocol
`2025-11-25`, identified server version `0.1.1`, and exposed `compare_values`,
`get_entity`, `get_latest_value` and `search_entities`. Local metadata validation
passed 27/27 and the direct smoke suite passed all 20 assertions.

The preflight found that the root README still described 0.1.1 as unpublished.
GitHub-only commits `15224dbc` and `c09342e9` pushed the correction and its
records without creating an Actions run. Glama then re-synced to exact commit
`c09342e9a9b67de24e35217dbdf007008bc51879`. Corrected build-only test
[`01a0e42d-b3cd-7f6c-b47e-ba64cf1fc293`](https://glama.ai/mcp/servers/artwisdom/govwait/admin/dockerfile/tests/01a0e42d-b3cd-7f6c-b47e-ba64cf1fc293)
succeeded in 12.5 seconds with the same audited dataset, version, protocol and
four-tool surface, and the public listing rendered the corrected README.

Under a separate final owner confirmation, Glama created and published release
`0.1.1` at `2026-09-27 15:29` EDT from that exact test. The Releases page marks
0.1.1 `Latest`, retains 0.1.0 in history and shows Auto-Release off. No npm or
official Registry change, other-directory submission, source change, commit,
push, workflow, site deployment, indexing request, outreach, spending or
account-setting change was included in the Glama-only publication.

### Phase 6D MCP 0.1.2 npm and official Registry release (verified 2026-09-29 EDT)

Version 0.1.2 corrects packaged install documentation and release metadata while
preserving the exact public 0.1.1 dataset and four MCP tool behaviors. Source
commit `efc90490438f05de4a802951315a4b828f09ecf5` and npm receipt commit
`b36f6c4790787a83539b010f615cae08401d7459` are on `main`.

Interactive npm security-key authentication published the exact audited
nine-file tarball. npm now resolves `latest` to 0.1.2; a fresh public download is
byte-for-byte identical to the retained candidate at SHA-256
`04837a57cb2d6d804e7e0b323e4ab9888988f5c4fd43c995f29f5def50ee8bf6`.
A new temporary installation loaded all 2,316 package-owned routes, passed all
21 MCP assertions and reported zero vulnerabilities.

Under a later Registry-only approval, checksum-verified official
`mcp-publisher` 1.8.1 revalidated and published only
`machine/mcp-server/server.json` for `io.github.artwisdom/govwait@0.1.2`.
Exact-version, latest and exact-name/latest search endpoints return HTTP 200;
status is `active`, `isLatest` is true, search count is one, and `publishedAt` is
`2026-09-30T02:41:54.111089Z`. Version history retains active 0.1.1 and 0.1.0 as
non-latest. The temporary Registry session was logged out and its credential
file removed. No new GitHub PAT or publishing token was created.

This Registry-only gate did not publish npm, create a GitHub tag, release,
token or workflow, update Glama/another directory, change source on GitHub,
deploy, request indexing, send outreach, spend money or change account settings.
GitHub-only commit `fa8fcbee979d259d41f5927c217106ed6bb6a233`
subsequently preserved the Registry receipt and current-version documentation.

Under later, separately approved Glama gates, the claimed listing synced to
that exact commit while Auto-Release remained off. Build-only test
[`01a0f8a3-fc04-7e06-abb9-7b412f95d5dc`](https://glama.ai/mcp/servers/artwisdom/govwait/admin/dockerfile/tests/01a0f8a3-fc04-7e06-abb9-7b412f95d5dc)
succeeded in 49.8 seconds using Debian Bookworm, Node 22 and the parity-safe
`npm exec -- tsc` compile path. It loaded all 2,316 routes from dataset
`2026-09-25T01:25:45.254Z`, negotiated MCP protocol `2025-11-25`, identified
server version `0.1.2` and exposed all four tools. The public listing rendered
the corrected 0.1.2 README.

After a separate final owner confirmation, Glama published release `0.1.2` from
that exact test at `2026-10-01 22:09` EDT (`2026-10-02 02:09` UTC). The Releases
page marks 0.1.2 `Latest`, retains 0.1.1 and 0.1.0 in history, and shows
Auto-Release off. No npm or official Registry change, other-directory
submission, source change, workflow, site deployment, indexing request,
outreach, spending or account-setting change was included in the Glama-only
publication.

## Next step

Continue the existing read-only directory-propagation and discovery-traffic
checks. Keep any listing correction, directory submission, outreach, package
publication or deployment behind its own owner approval. Do not run another
source refresh merely to exercise the deployment workflow; the next natural
data change will provide that receipt.

## Open threads
- US/AU/IE sources WAF-blocked to honest bots — owner-decision item (documented in DEPLOYMENT_GUIDE).
- UDI remains unavailable to automated collection after its 2026-09-04 robots
  closure. Phase 6A resolved the shared-refresh blockage without bypassing access;
  do not spoof a browser UA, re-add UDI to active sources, weaken the fail-closed
  rule or manually advance Norway's freshness.
- `npm audit` reports four Astro 4 build-toolchain advisories (1 moderate, 3 high). Production is pre-rendered static HTML/JSON on Cloudflare Pages—no Astro/Vite development or server runtime is exposed. Plan and test the major Astro 7/Node runtime upgrade before adding any dynamic server rendering; do not apply `npm audit fix --force` blindly.
- IRCC forward-looking estimates and Norway UDI are production-verified. Finland/Sweden/Netherlands/Denmark follow. NZ passports remain blocked.
