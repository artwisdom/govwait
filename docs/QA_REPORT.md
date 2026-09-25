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

## Phase 5C Glama build and local readiness gate — 2026-09-22

- Glama build-only test
  [`01a0cc04-a9e8-7f71-9017-f1be4e441241`](https://glama.ai/mcp/servers/artwisdom/govwait/admin/dockerfile/tests/01a0cc04-a9e8-7f71-9017-f1be4e441241)
  succeeded in 57.4 seconds against commit `64db085`. The container started,
  negotiated MCP protocol `2025-11-25`, and exposed the four expected tools.
  Auto-Release remained off and no release was created.
- The public GitHub API still reports `NOASSERTION` for commit `64db085`. The
  local candidate moves the unmodified Apache 2.0 terms to the root `LICENSE`
  and preserves the approved GovWait-code-only boundary and every government
  data exclusion in `SOFTWARE-SCOPE.md`. The published package's scoped
  `LICENSE` and `DATA-NOTICE.md` are unchanged.
- GitHub Licensee 10.1.0 identifies the local repository as `Apache-2.0` by an
  exact matcher at 100% confidence. The expanded release validator passed
  26/26 checks, including canonical-term equality, all data exclusions and the
  separate package/repository licence layouts.
- Minimal `glama.json` contains only Glama's schema URL and maintainer
  `artwisdom`; Python jsonschema 4.25.1 validated it against Glama's live
  Draft-07 schema.
- Complete local ritual passed: 14 parser/history tests; cached pipeline 25/25
  validation checks; 2,318 current routes and 4,346 append-only public history
  observations; 2,110-page Astro build; 641/641 SEO-sitemap gate; 2,616-file API
  conformance; direct and isolated 15-assertion MCP smoke suites; exact nine-file
  package audit with three data hashes; and a 641-URL IndexNow dry run. The 1,584
  existing title/description-length findings remain non-blocking warnings.
- Generated timestamp noise from the cached full-pipeline run was removed; the
  intended candidate contains only licensing, Glama metadata, validation and
  project-record changes. No commit, push, repository sync, Glama build or
  release, npm publication, IndexNow request, deployment or outreach occurred.

## Phase 6A pre-release recovery candidate — 2026-09-24

- Live-source proof: one owner-approved local refresh completed all eight active
  Canada, UK and New Zealand sources. UDI was labeled collection-paused and no
  UDI request was attempted.
- Closed-source integrity: UDI remains exactly 19 active entities and 19
  observations; a database `EXCEPT` comparison against the pre-refresh backup
  found zero additions and zero missing rows. No UDI observation is dated on or
  after the 2026-09-04 closure and its last successful verification remains
  `2026-09-01T17:38:38.623Z`.
- Official removal handling: INZ's complete selector returned 132 visas and no
  Post Study Work Visa. Only that route's two current p50/p80 entities were
  deactivated; their durable history remains in SQLite.
- Pipeline: 35/35 blocking validation checks and 15/15 parser/history/policy tests
  pass. The candidate exports 2,316 retained routes, 6,617 public history
  observations and 7,285 forward-looking estimates.
- Site and machine API: Astro built 2,112 HTML pages; the SEO audit passed with
  exactly 634 indexable pages and 634 sitemap URLs; OpenAPI conformance passed
  for 2,613 static API files. The 1,627 title/description-length findings remain
  non-blocking warnings.
- MCP: unpublished version 0.1.1 passed direct and isolated package smoke suites,
  26/26 metadata checks, the exact nine-file allow-list and all three data hashes.
  The packed candidate measured 162,482 bytes / 6,562,302 unpacked bytes but was
  deleted after audit. Norway returns `current_value: null` and exposes its stored
  45 days only as `last_verified_value` with source state and dates.
- Visual and discovery safety: the Norway warning, active Canada entity and
  homepage rendered correctly; Norway was checked in explicit light and dark
  color schemes. The homepage overclaim found during QA was corrected from
  “current official” to “latest source-backed.” IndexNow selected 634 URLs in
  dry-run mode and sent no request.
- Pre-release boundary at this checkpoint: `git diff --check` is clean; no
  WAL/SHM file or 0.1.1 tarball remains.
  No commit, push, Actions run, deployment, IndexNow/Google submission, npm/MCP
  publication, directory action, outreach, spend or account change occurred.

## Phase 6A production recovery and Phase 6B automation hardening — 2026-09-24 EDT

- Release receipt: recovery commit `d31ee85c667360eb1c3ccc6702723399a951b1c0`
  passed `deploy-site` run `36081326233` and deployed to
  `01dac9d5.govwait.pages.dev`. The build and 634/634 SEO-sitemap gate passed;
  IndexNow accepted 665 changed URLs with HTTP 200.
- GitHub live-source proof: owner-approved `refresh-data` run `36081437732`
  completed all eight active collectors, explicitly logged that UDI collection
  was paused with prior records retained and no fetch attempted, passed 35 checks,
  exported 2,316 routes / 6,617 observations / 7,285 forward estimates and created
  bot commit `5a99df2904c493e79254e8af921ca5bef1980aec`.
- Final release receipt: exact bot commit `5a99df2` passed manually dispatched
  `deploy-site` run `36082052053` and deployed to
  `81c691b0.govwait.pages.dev`. The final SEO audit passed at 2,112 HTML / 634
  indexable / 634 sitemap URLs; IndexNow accepted 603 changed URLs with HTTP 200.
- Public-edge proof: apex and immutable artifact hashes matched for representative
  homepage and JSON files. Required pages returned HTTP 200, the removed Post
  Study Work Visa page/API returned 404, `www` preserved the path in its 301,
  all 634 sitemap URLs were unique, and the removed route was absent.
- Preservation proof: public JSON/CSV exposed eight active sources and UDI as the
  one `source_unavailable` source since 2026-09-04. UDI remained exactly 19 latest
  rows and 19 history rows with zero post-closure rows and its last successful
  verification frozen at `2026-09-01T17:38:38.623Z`. The active Canada example
  showed a fresh 2026-09-25 GovWait verification.
- Workflow root cause: GitHub suppresses push-triggered workflow chaining for
  commits made by its built-in token. Phase 6B makes `deploy-site` reusable and
  calls it only when `refresh` emits `data_changed=true`, passing the exact commit
  SHA. The deploy job verifies both checkout and current `main`, rejects stale
  revisions, ignores a duplicate bot-push event, and propagates deployment failure
  to the parent refresh.
- Workflow QA: actionlint 1.7.12 passed both workflows; YAML parsing and 17/17
  semantic assertions passed; the exact revision script accepted current `main`
  and refused the stale Phase 6A pre-refresh commit; `git diff --check` passed.
- Boundary: no additional government-source refresh, Cloudflare deployment,
  IndexNow/Google request, npm/MCP publication, Registry/directory action,
  outreach, spend or account-setting change was used for Phase 6B validation.

## Phase 6C MCP 0.1.1 final-data preflight — 2026-09-24 EDT

- Data sync: package-owned `latest.json`, `history.json` and
  `forward-looking.json` are byte-identical to the production exports generated
  at `2026-09-25T01:25:45.254Z`. SHA-256 values are respectively
  `840e3e4c21a977fe11699041218d2f63c9f2e2fb7f46ecaaeca317050f1c7bce`,
  `d72cb0c363711e68c7ee3b4989a3273e56ae3cc251c7dec5bf31aead2635ed3a`
  and `17038d17227416defc4b99daccca66f8bbf6f6555077c3ffc2a162a0dd83bbdf`.
- Dataset receipt: 2,316 retained routes, 2,297 active-source routes, 19
  source-unavailable routes, 6,617 history observations and 7,229 forward
  cohorts. UDI remains unavailable from 2026-09-04, last verified on
  `2026-09-01T17:38:38.623Z`, and its retained 45 days cannot be returned as a
  current value.
- Package gate: Node 24.11.1 ran the 20-assertion direct smoke suite, 27/27 local
  release checks, exact nine-file allow-list audit and 21-assertion isolated
  smoke suite. The artifact contains no database, cache, log, source, test,
  credential or parent-repository dependency; all three embedded hashes match.
- Independent install: a new temporary project installed the exact local tarball
  through npm, found zero vulnerabilities, loaded its package-owned data and
  passed all 21 smoke assertions.
- Artifact receipt: `govwait-mcp-0.1.1.tgz` is 162,492 bytes packed and
  6,562,302 bytes unpacked. SHA-256 is
  `2a76788354551b12c50f452b03e39de454cb21119b9baee990863d890ebcbe28`;
  its sidecar matches.
- Licensing: `SEE LICENSE IN LICENSE` points to Apache 2.0 terms restricted to
  GovWait-owned software code. `DATA-NOTICE.md` continues to exclude bundled
  government-source data and grants no additional rights.
- Registry preflight: checksum-verified official `mcp-publisher` 1.8.1 initially
  rejected the draft description for exceeding the current 100-character limit.
  The description was reduced to 94 characters without changing the package,
  the limit was added to the local regression checks, and the live official
  validator then reported `server.json` valid.
- External state at preflight: npm lists only `0.1.0` and `latest=0.1.0`; the
  official MCP Registry returns HTTP 200 for active/latest `0.1.0`, HTTP 404 for `0.1.1`, and
  one exact-name search result. No commit, push, npm publication, Registry or
  Glama update, token/workflow, directory submission, deployment, indexing
  request, outreach, spend or account change occurred.
- GitHub-only handoff: under a later explicit gate, this exact verified source
  candidate and its receipts were committed and pushed to `main`. The release
  tarball stayed ignored and local. The changed paths are outside the
  `deploy-site` push filter; npm, Registry, Glama and production remain separate
  gates.
