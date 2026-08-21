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
