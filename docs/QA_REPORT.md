# QA REPORT — Phase 7 gauntlet

_Run 2026-08-21. Every gate executed, not assumed._

| # | Gate | Result | Evidence |
|---|---|---|---|
| 1 | Full pipeline from empty HTTP cache | ✅ PASS | `data/cache/http` moved aside; `node pipeline/run.js --refresh` re-fetched both sources live; validation green (11 checks); idempotency confirmed — second run added 0 duplicate observations (UNIQUE(entity_id, effective_date) + INSERT OR IGNORE) |
| 2a | Site build | ✅ PASS | `astro build`: **1,961 pages, zero errors/warnings** |
| 2b | JSON-LD validity | ✅ PASS | Parsed every `ld+json` block on 63 sampled pages (random 60 + home/about/hub): all parse, all carry `@context`+`@type`; title+canonical present on all |
| 2c | Sitemap | ✅ PASS | Valid XML (minidom parse); 1,960 `<loc>` entries == 1,960 indexable pages (404 correctly excluded, noindexed) |
| 2d | Page weight | ✅ PASS | Entity pages ~7.3KB; largest page (212-row comparison hub) 60KB — limit is 200KB |
| 2e | 10-page HTTP spot check | ✅ PASS | `astro preview` served 12 URLs → all 200 (correct sizes), unknown URL → 404; server killed and port verified free |
| 3 | Static API ↔ OpenAPI conformance | ✅ PASS | `machine/api-conformance.mjs` checked **1,997 files** (1,946 entities + 48 services + 2 jurisdictions + index) against required fields, enums, date/ISO patterns, count integrity, filename↔id match: zero violations |
| 4 | MCP smoke test | ✅ PASS | 8/8 assertions: initialize, tools/list (4 tools), `get_latest_value` (right entity, duration shape, provenance), `compare_values` (4 countries, sorted), `search_entities` (finds `ca-study-permit--pk`) |
| 5a | Secret sweep | ✅ PASS | grep for key/secret/token/password/private-key across all code+config: only benign hits (a `tokens` string-split variable; GitHub's standard `id-token: write` permission) |
| 5b | Placeholder sweep | ✅ PASS | `<<OWNER_PROVIDES>>` appears in docs/`.env.example` only; zero occurrences in functional code paths |
| 6a | No git remotes | ✅ PASS | `git remote -v` → empty |
| 6b | No leftover processes | ✅ PASS | All matching listeners predate this session and belong to other project dirs (e.g. port 4341 server: started Aug 17, cwd `whop-vertical-os-factory` — untouched). The one server I started (astro preview :4361) was killed and verified dead |
| 6c | Sandbox containment | ✅ PASS | All writes confined to `./data-moat-engine` + the session scratchpad; no dotfiles, no global installs, no sudo, no cron/launchd |

## Data snapshot at QA time
- 1,946 entities / 1,946 observations (first snapshot), 2 sources, jurisdictions CA+GB
- Status mix: 484 ok (numeric), 670 unavailable, 792 insufficient_data — the null statuses are themselves official publications ("no processing time available"), displayed honestly
- Freshness: IRCC effective 2026-08-19 (2 days old at QA); gov.uk effective 2026-06-26 (within its ~monthly-to-quarterly cadence)

## Known limitations (honest)
- History depth is 1 observation per entity today — the moat starts compounding with the first CI refresh after the owner pushes.
- US/AU/IE sources hard-block honest bots; excluded rather than worked around (see DEPLOYMENT_GUIDE for the owner's options).
- JSON-LD validated structurally (parse + required keys), not against Google's Rich Results tester (needs a live URL — owner step, listed in DEPLOYMENT_GUIDE).

## Phase 5A dataset-authority local gate

_Run September 8, 2026. This is a local candidate only: no commit, push,
Cloudflare deployment, IndexNow submission or Google crawl request has occurred._

| Gate | Result | Evidence |
|---|---|---|
| SQLite history authority | ✅ PASS | `PRAGMA integrity_check` returned `ok`; 2,318 active entities, 4,448 raw append-only observations and 3,629 forward-looking rows. The repaired database contains all 102 valid September 1 INZ change observations. Public export remains 4,346 distinct observations after filtering only consecutive no-change artifacts from undated sources. |
| Parser and history unit tests | ✅ PASS | 14/14 tests passed, including consecutive-no-op filtering, return-to-prior-value retention, INZ percentiles, IRCC forward projections and UDI schema drift. |
| Static production build | ✅ PASS | Astro generated 2,110 pages with zero build errors. |
| Blocking SEO and sitemap audit | ✅ PASS | 2,110 HTML pages; 641 intentionally indexable pages; 641 unique matching sitemap URLs. Existing length findings remain non-blocking warnings, not hidden failures. |
| Dataset distributions | ✅ PASS | Four generated CSVs: 2,318 current rows, 4,346 public history rows, 3,629 forward-looking rows and 9 source rows. Dataset metadata reports the same counts and links every distribution. |
| Static API conformance | ✅ PASS | 2,616 JSON, CSV and OpenAPI files checked; all required fields, shapes, counts and filenames passed. |
| MCP build and smoke test | ✅ PASS | TypeScript build passed; all 15 assertions passed across initialization, four tools, provenance, Canadian, UK, New Zealand and Norway results, sorting and forward-looking labels. |
| XML | ✅ PASS | Sitemap index, all five child sitemaps and the report feed parse as valid XML. |
| Dataset discovery markup | ✅ PASS | `/data/` has one canonical Dataset JSON-LD object with all four `DataDownload` distributions, official-source `isBasedOn` URLs, dates and a source-specific licence URL; the homepage duplicate was removed. |
| Responsive visual QA | ✅ PASS | `/data/` and `/data-license/` reviewed at desktop and 390×844 mobile sizes. No document overflow, trapped tables or browser console warnings/errors were found. |
| IndexNow release set | ✅ DRY RUN | Full-site mode selected 641 public human URLs. No request was sent. Machine endpoints are included by the commit-diff path used after an approved release. |
| Reuse risk gate | 🟡 YELLOW / medium | Severity 3 × likelihood 2 = 6. UK and New Zealand publish explicit open terms; Canada requires resource-specific checking for commercial redistribution, and no explicit UDI waiting-page reuse licence was identified. See `docs/DATA_REUSE_RISK_ASSESSMENT.md`; this is not legal advice. |

### Release decision at the local gate

Phase 5A is locally ready for the owner's explicit deployment approval. A
successful deployment would prove publication and crawlability, not indexing,
rankings, traffic, advertising approval, demand or revenue.

### Production verification

The owner approved the release. Commit `fd7ba67` passed GitHub Actions run
`34300806761` and deployed to `ca3bad6a.govwait.pages.dev`. The
production-configured local build matched the artifact byte-for-byte on the two
new pages and dataset metadata. The apex matched the artifact, after normalizing
Cloudflare's expected email-address obfuscation on `/data-license/`. Public checks
confirmed HTTP 200 and correct content types for the pages, JSON, CSV and OpenAPI;
the four CSV row counts; Dataset markup and canonicals; `llms.txt`, `robots.txt`,
five child sitemaps with 641 unique URLs; the public README; and the
path/query-preserving `www` redirect. IndexNow accepted 656 affected URLs with
HTTP 200. No Google crawl request was made. None of these receipts proves
indexing, ranking, traffic, advertising approval, demand or revenue.
