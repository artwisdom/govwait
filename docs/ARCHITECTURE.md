# ARCHITECTURE

## The asset
A provenance-tracked, historized dataset of **official government processing times** (visas, permits, sponsorships; passports as expansion). Interfaces (site, API, MCP) are disposable skins over `data/db.sqlite`.

```
sources (official pages/APIs) ──fetch──▶ data/cache/http/  (raw, never re-fetched within a run)
                                            │ parse + normalize
                                            ▼
                                   data/db.sqlite  (source of truth, append-only history)
                                            │ validate (FAILS LOUDLY)
                                            ▼
                                   data/exports/*.json  (versioned snapshots)
                                      │           │            │
                                      ▼           ▼            ▼
                                 /site (Astro)  /site/public/api/v1 (static JSON API)  /machine/mcp-server
```

## Stack decisions
- **Pipeline: Node 20, zero npm dependencies.** SQLite access via the system `sqlite3` CLI (v3.51, verified) using `-json` output — avoids native-module compile risk entirely. Built-in `fetch` for HTTP.
- **SQLite is the source of truth**; JSON exports are the only thing the three skins read. The MCP server and site never touch the DB directly, so they stay dependency-light and the DB schema can evolve freely.
- **History model**: one `observations` row per (entity, source-stated update date). Re-runs are idempotent (`INSERT OR IGNORE`); history accumulates only when the source republishes. This is the compounding moat — official pages show only current values.

## Schema (schema.sql)
- `sources` — id, name, jurisdiction, agency, url, license_note, robots_status, robots_checked_at.
- `entities` — id (slug, e.g. `ca-visitor-visa--in`), source_id, jurisdiction (ISO-2 of the government), service_category (`visa|permit|sponsorship|refugee|settlement`), service_key, service_name, applicant_country (ISO-2 or NULL for global service standards), applicant_country_name.
- `observations` — entity_id, **value_raw** (verbatim source string), **value_days** (normalized REAL, NULL when unavailable), unit_original, status (`ok|unavailable|insufficient_data`), **effective_date** (source's own update stamp), **retrieved_at**, **source_url**, confidence (`official`). UNIQUE(entity_id, effective_date).

Normalization: days×1, weeks×7, months×30.44 (flagged approximate in docs); original string always preserved. Unparseable value ⇒ validation failure, not a silent skip.

## Politeness layer (pipeline/lib/fetcher.js)
- Honest UA `DataMoatEngineBot/0.1 (contact: contact@govwait.com)` in production; unattended runs receive it through the `CONTACT_EMAIL` repository variable.
- robots.txt fetched, cached 7 days, parsed for `User-agent: *` groups; **fail closed** — a 4xx/blocked robots or a matching Disallow kills the source for the run.
- ≥3s between requests to the same host; every 200 response cached to `data/cache/http/` keyed by URL hash; cache hit ⇒ no network.
- Hard cap 150 fetches/host/run (config constant), far above actual need (~2/run).

## Sources (v1 seed)
| id | What | Format | Cadence | Records/run |
|---|---|---|---|---|
| `ircc-ptime` | Canada IRCC processing times (8 categories × ~212 applicant countries) | JSON (official file behind the IRCC checker tool) | ~weekly | ~1,900 |
| `govuk-visa-times` | UK visa processing times, applications outside UK | gov.uk Content API (JSON + HTML tables in body) | ~monthly | ~20 |

Verified robots-permitted expansion targets (documented, not built): immigration.govt.nz, dia.govt.nz, migrationsverket.se, ind.nl, nyidanmark.dk. Blocked to honest bots (owner-decision items): travel.state.gov, egov.uscis.gov, ireland.ie, immi.homeaffairs.gov.au.

## Validation (pipeline/validate.js) — pipeline fails loudly (exit ≠ 0)
1. Schema/type checks on every row (ids, ISO codes, status enum, ISO dates).
2. Range sanity: 0 < value_days ≤ 1500 when status=ok.
3. Coverage floors: ircc ≥ 1,200 obs, govuk ≥ 10 obs; total ≥ 300.
4. Staleness: newest effective_date per source within 45 days (ircc) / 120 days (govuk).
5. Volatility guard: consecutive observations for one entity differing >10× flagged for review.
6. Unparsed-value count must be 0.
Report written to `data/exports/validation-report.json`; any FAIL ⇒ exit 1 ⇒ CI never publishes garbage.

## Exports (pipeline/export.js → data/exports/)
- `latest.json` — every entity + its most recent observation (the file all skins read).
- `history.json` — all observations grouped by entity.
- `stats.json` — counts, per-source freshness, generated_at.

## Skins
- **Site** (`/site`, Astro, static): one page per entity (`/ca/visitor-visa/from-in/`), service hubs, jurisdiction hubs, About/Methodology. Freshness stamp + provenance on every value. JSON-LD Dataset + per-page structured data. <200KB/page.
- **Static API** (`/site/public/api/v1/`): prebuilt JSON — collection indexes + per-entity endpoints mirroring `openapi.yaml`. Free-CDN "API" with zero runtime cost.
- **MCP server** (`/machine/mcp-server`, TypeScript, stdio): tools `search_entities`, `get_entity`, `get_latest_value`, `compare_values` reading `data/exports/*.json`.

## Refresh and deployment loop
GitHub Actions cron (2×/week) → run pipeline → validate → commit data diff → rebuild site → Cloudflare Pages deploy. Validation failure stops the data commit and therefore stops publication. Estimated usage remains far below the GitHub Actions free-tier allowance.
