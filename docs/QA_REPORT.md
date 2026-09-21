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
HTTP 200. No Google crawl request was made at deployment time. On 2026-09-13,
Search Console accepted the owner-approved `/data/` indexing request and added
it to a priority crawl queue; the inspected URL was not indexed then. None of
these receipts proves indexing, ranking, traffic, advertising approval, demand
or revenue.

## Phase 5B local MCP package verification — 2026-09-16

- `npm run build`: passed; bundled 2,318 current routes and wrote three dataset
  files plus deterministic provenance.
- Direct MCP smoke: 15/15 assertions passed across initialization, tool listing,
  Canada, New Zealand, Norway, forward-looking cohorts, comparisons and search.
- Package contents: exact seven-file allow-list; 112,470 bytes packed and
  4,224,525 bytes unpacked; no database, caches, logs, credentials, source files,
  test files or source maps.
- Data integrity: SHA-256 and byte-size checks passed for all three exports.
- Isolation: the packed artifact passed the full smoke suite from a temporary
  runtime with no parent-repository data and no `GOVWAIT_DATA_DIR` override.
- Runtime coverage: the full sequence passed under Node 22.22.3 and 24.11.1.
- Publication safety: `private: true` remains active. No npm publish, registry
  submission, deployment, account change or package-name claim occurred.

## Phase 5B private 0.1.0 release candidate — 2026-09-16

- Licence scope: the owner approved Apache 2.0 for GovWait-owned software code
  only. The canonical terms and explicit non-code/data exclusion appear in both
  matching `LICENSE` files; the packaged `DATA-NOTICE.md` remains separate. This
  is an operational risk assessment, not legal advice.
- Publication gate: `private: true` remains active. The npm licence field is
  `SEE LICENSE IN LICENSE`, avoiding a blanket Apache claim over packaged data.
- Identity snapshot: `govwait-mcp` returned npm `E404`, and
  `io.github.artwisdom/govwait` returned official Registry HTTP 404. Neither name
  was reserved.
- Registry metadata: `mcpName`, npm identifier, versions, GitHub repository ID
  `1342333561`, subfolder, `npx`, `stdio`, licence scope and data exclusion passed
  20/20 cross-file checks.
  Draft `server.json` also passed the official `2025-12-11` Registry JSON schema.
- Package verification: both 15-assertion smoke runs passed under Node 24.11.1.
  The exact nine-file tarball measured 118,606 bytes packed / 4,239,539 bytes
  unpacked, and all three data hashes matched. The retained private candidate's
  SHA-256 is
  `d27d372e8e14a421fe098234a53766049c055eb2e2bc2bc7bdc203d2f979d822`.
- GitHub-only release: candidate source commit `ba830db` was pushed to `main`
  after owner approval. No deployment-trigger path changed, and GitHub returned
  no Actions run for the commit.
- External-change boundary: no npm or Registry account change or publication,
  Cloudflare deployment, IndexNow notification or directory listing occurred.

## Phase 5B public npm and official Registry release — 2026-09-20

- Public source: commit `ec284ef64c30afdcf45c1666178c473b86ac7c63` is on
  `origin/main`; it removes the npm publication block while preserving the
  scoped Apache 2.0 code-only licence and separate data notice.
- Security updates: the release lockfile contains `fast-uri` 3.1.8, `hono`
  4.13.8 and `qs` 6.16.0; the release audit reported zero vulnerabilities.
- Published identity: npm serves `govwait-mcp@0.1.0`, `latest` resolves to
  `0.1.0`, and public `mcpName` exactly matches
  `io.github.artwisdom/govwait`.
- Artifact identity: nine files, 118,593 packed bytes, 4,239,563 unpacked bytes,
  local SHA-256
  `e881e02555f3133124262c69f48cf7706259595519f5ad25eb1c67338c15ebda`,
  registry SHA-1 `412c5b6c4c0ada6c412c5f105b6118b20e6ccfd0`, and registry integrity
  `sha512-u0ksXNhTREZI0rvPfCZ27qTDupI4ZpFA2lopo9rhGMy6RgXcjb6ZQZZA6XgJ0OhoIVqBKJA12YRrBwMucrXeVg==`.
- Clean install: a new temporary project installed the public registry artifact,
  ran all 15 MCP assertions, and loaded 2,318 routes from the installed package's
  own data.
- Registry preflight: official `mcp-publisher` 1.8.1 validated `server.json`
  against the live service. The exact Registry identity/version returned HTTP
  404 immediately before publication.
- Registry publication: after separate owner approval and interactive GitHub
  authentication, `mcp-publisher` reported successful publication of
  `io.github.artwisdom/govwait` version `0.1.0`. The exact-version and search
  APIs both returned HTTP 200; status is `active`, `isLatest` is true, exact
  search count is one, and `publishedAt` is
  `2026-09-21T00:59:17.656115Z`.
- Publishing hardening: authenticated npm 11.19.1 command
  `npm access set mfa=publish govwait-mcp` exited 0 after security-key approval.
  The client sends `publish_requires_tfa=true` and
  `automation_token_overrides_tfa=false`, requiring interactive 2FA and blocking
  automation/bypass-token publishing. No trusted publisher is configured.
- Boundary: no publishing token, trusted publisher, workflow, other directory
  submission, deployment or IndexNow notification was created or run. The
  temporary Registry login was logged out and publisher files deleted. Registry
  publication does not establish downstream directory discovery, traffic,
  advertising approval, demand or revenue.
