# HANDOFF 01 — Project State & Technical Deep Dive

_Everything a coding agent needs to operate GovWait. Current as of 2026-08-25._

## 1. The one-sentence architecture

Official government pages → polite fetcher → SQLite (append-only history) → JSON
exports → three disposable skins (Astro site, static JSON API, MCP server), all
rebuilt by GitHub Actions on a Tue+Fri cron; validation failures stop publication.

```
pipeline/run.js ──▶ data/db.sqlite ──▶ data/exports/{latest,history,stats}.json
                                            │
                    pipeline/build-api.js ──▶ site/public/api/v1/** (≈2,000 files)
                                            │
                    site/ (Astro 4) ───────▶ site/dist (2,070 HTML pages + API + sitemaps)
                                            │
                    machine/mcp-server ─────▶ stdio MCP for AI agents (reads exports)
```

## 2. Repository map (what every directory is)

| Path | What | Touch carefully? |
|---|---|---|
| `pipeline/run.js` | Orchestrator: fetch → parse → upsert → validate → export. Exit ≠ 0 on ANY source error | Core |
| `pipeline/lib/fetcher.js` | **The politeness layer** (honest UA, robots fail-closed, 3s/host, disk cache, 150/host cap) | ⚠️ NON-NEGOTIABLE semantics — see HANDOFF_00 |
| `pipeline/lib/db.js` | SQLite via system `sqlite3` CLI (`-json`). Zero npm deps by design | Keep zero-dep |
| `pipeline/lib/normalize.js` | Duration parsing ("31 days"/"7 weeks"/"58 months"/singulars/"No processing time available"/"Not enough data"). Unknown shape ⇒ pipeline fails | Add branches w/ test values |
| `pipeline/sources/ircc.js` | Canada: `data-ptime-en.json` (8 categories × ~212 countries; `refugees_private` is `{sponsor,refugee}` nested → 2 entities) | Template for new sources |
| `pipeline/sources/govuk.js` | UK: gov.uk Content API → HTML tables in `details.body`, `public_updated_at` as effective_date. Redirect docs possible (`schema_name: redirect`) | |
| `pipeline/validate.js` | 18 checks: shapes, ISO codes, range (0 < days ≤ 3000 — "58 months" refugee value is REAL), coverage floors (including INZ ≥240), staleness where the source publishes a date, p50/p80 integrity, 10× jump flags, provenance | ⚠️ Never loosen to force green |
| `pipeline/export.js` | Emits `latest.json` (entities + latest obs), `history.json` (all obs grouped), `stats.json` | |
| `pipeline/build-api.js` | exports → `site/public/api/v1/**` static endpoints | Run before astro build |
| `pipeline/indexnow.js` | Posts exact changed public URLs to IndexNow after deploy. It compares large prior exports safely, maps source-verification and site-template changes, preserves old URLs for deletion hints, and supports full-current-set/dry-run modes. Key file lives at `site/public/<32hex>.txt` | Receipt is not proof of indexing |
| `data/db.sqlite` | Source of truth, **committed to git** so CI accumulates history. WAL files gitignored | ⚠️ Never rewrite history rows |
| `data/cache/http/`, `data/cache/robots/` | Fetch caches (gitignored) | |
| `site/` | Astro 4 (Node 20 pin — Astro 5 needs Node ≥22). `site.config.json` = brand + SITE_URL; CI overrides via `SITE_URL` repo var | |
| `site/src/lib/data.js` | Build-time model: slugs, services map, medians, speed classes (vs service median: ≤0.6 fast / ≤1.4 typical / ≤2.5 slow / else very slow), deltas from history, `relatedRoutes()`, `dataLastmod`. Throws on URL collisions | The brain of the site |
| `site/src/lib/sitemap.js` + `pages/sitemap*.xml.js` | Sitemap index → hubs + numeric CA applicant pages + UK services + curated NZ services. **lastmod = source-backed effective/first-observed date for that exact child, never build time** | ⚠️ Keep lastmod honest |
| `site/src/pages/` | `index`, `[country]/index`, `[country]/[service]/index` (hub for CA; entity page for GB; combined p50/p80 page for NZ), `[country]/[service]/[applicant]` (CA entity pages), `guides/*` (13 source-backed analyses), `reports/*` (3 jurisdiction baselines plus hub), trust/policy pages, `about`, `api-docs`, `404` | |
| `machine/openapi.yaml` | OpenAPI 3.1, copied into the API at build | Keep in sync with build-api.js |
| `machine/api-conformance.mjs` | Checks every built API file against the spec's shapes | Run in QA |
| `machine/mcp-server/` | TypeScript stdio MCP server, 4 tools, reads exports. `npm run build && npm run smoke` (10 assertions, including NZ metric/unit checks) | |
| `.github/workflows/refresh.yml` | Cron Tue+Fri 14:00 UTC: pipeline → build-api → commit data diff. Failure diagnosis into job summary | |
| `.github/workflows/deploy.yml` | On push (site/data/openapi/IndexNow paths): build → SEO audit → Cloudflare Pages → IndexNow notification after successful production deploy | Requires scoped Cloudflare token in GitHub |
| `site/scripts/seo-audit.mjs` | CI gate for unique metadata, canonicals, H1, JSON-LD, internal links, intentional noindex, exact sitemap membership, honest child lastmod, robots and llms.txt | Run after every site build |
| `handoff/` | This package | |

Root docs: `EXECUTION_REPORT.md`, `DEPLOYMENT_GUIDE.md` (owner steps; monetization
section updated Aug 2026), `MAINTENANCE_RUNBOOK.md` (failure playbooks + add-a-source
recipe), `RISK_REGISTER.md`, `DECISIONS.md` (38 numbered judgment calls), `STATE.md`.

## 3. Data model (SQLite, `pipeline/schema.sql`)

- `sources(id, name, jurisdiction, agency, url, license_note, robots_status, robots_checked_at)`
- `entities(id, source_id, jurisdiction, service_category, service_key, service_name, applicant_country, applicant_country_name, active)` — id examples: `ca-visitor-visa--in`, `nz-visitor-visa--p80`; removed source routes become inactive while history remains; UNIQUE(jurisdiction, service_key, applicant_country)
- `observations(entity_id, value_raw, value_days, unit_original, status, effective_date, retrieved_at, source_url, confidence)` — UNIQUE(entity_id, effective_date); INSERT OR IGNORE ⇒ **idempotent re-runs; history grows only when the agency republishes**

Normalization: days×1, weeks×7, months×30.44; INZ working-day counts are preserved as working days and labeled in `unit_original`; `value_raw` is always preserved.
Statuses: `ok` (numeric), `unavailable` ("No processing time available"),
`insufficient_data` ("Not enough data") — nulls are displayed honestly as official facts.
Current stats: 2,271 active entities; 806 numeric; sources: ircc-ptime (1,907), ircc-noncountry (19), ircc-passport (2), govuk-visa-times (39), govuk-inuk-times (37), govuk-passport (1), inz-processing-times (266 = 133 visas × p50/p80). INZ and Canadian passports use unstamped-source change detection; see `resolveUnstamped()` in run.js.

## 4. Commands (all verified working)

```bash
node pipeline/run.js              # uses cache — safe offline
node pipeline/run.js --refresh    # live fetch (polite; INZ makes 133 listed lookups, ~7 min total)
node pipeline/build-api.js        # exports -> static API files
cd site && npm ci && npm run build && npm run audit:seo  # ~3s, 2,070 HTML pages
cd machine/mcp-server && npm ci && npm run build && npm run smoke
node machine/api-conformance.mjs  # after a site build
```

Local Node is 20.19.6 (Astro pinned to v4 for this reason; CI also pins Node 20).
`sqlite3` CLI ≥3.35 required (dev machine has 3.51; ubuntu-latest runners have it).

## 5. Deployment state (live TODAY)

- Repo: `github.com/artwisdom/govwait` (public, main). gh CLI on the owner's Mac is
  authed as `artwisdom` (repo+workflow scopes).
- Cloudflare Registrar: `govwait.com` active with auto-renew and registrar lock.
- Cloudflare Pages: project `govwait`; apex and `www` custom domains active over
  HTTPS; proxied CNAME records target `govwait.pages.dev`.
- Cloudflare Email Routing: `contact@govwait.com` active and forwarded to a verified
  owner destination; the About page publishes the alias.
- Repo variables set: `SITE_URL=https://govwait.com`,
  `CONTACT_EMAIL=contact@govwait.com`, `PUBLIC_GA4_MEASUREMENT_ID=G-6ZJ7J3526N`,
  and `CLOUDFLARE_ACCOUNT_ID`. The encrypted
  `CLOUDFLARE_API_TOKEN` secret has Pages write permission only.
- refresh-data cron ACTIVE and proven (first autonomous commit: `data: refresh
  2026-08-22`). deploy-site green. ~60 min/month total of the 2,000 free.
- Cloudflare migration: production cutover, explicit allow-crawler policy, and
  GitHub-driven deployment are complete. GitHub Pages is disabled and the unused
  original token is deleted. Phase 1 commit `2a1729c` deployed in green run
  `32921188032` to `dfb3a5be.govwait.pages.dev` after integrating the latest
  refresh-bot commit `3278afe`.
- Search ownership: Google Search Console domain property `govwait.com` and Bing
  Webmaster Tools site `https://govwait.com/` are DNS-verified. Google's live test
  says the homepage can be indexed, and three representative pages passed the live
  Rich Results Test with valid Breadcrumb markup.
- GA4 account/property `GovWait` uses production web stream `15489361827` and
  measurement ID `G-6ZJ7J3526N`. It is consent-gated, configured without ad
  personalization/Google Signals, and linked to the `govwait.com` Search Console
  domain property. Grow's publisher portal verified its exact production script;
  the default subscribe form and automatic inline/mobile recommendations are off,
  while the small reader/share widget remains enabled. No Journey application has
  been submitted.
- Sitemap onboarding: `https://govwait.com/sitemap.xml` was submitted to both search
  engines on 2026-08-23. Google reports **Sitemap index / Success**; Bing accepted it
  and reports **Submitted / Processing**.
- The discoverability audit intentionally limits requested indexing
  to 603 useful/data-backed URLs (56 hubs/guides/reports, 445 numeric CA applicant
  pages, 77 UK services, and 25 curated NZ visa pages). The other 1,462 Canadian
  applicant pages stay live and crawlable with `noindex, follow` until a numeric
  official value appears. All 266 NZ metric entities remain immediately available
  through the API and MCP server while human pages roll out at ≤30/week.
  See `docs/DISCOVERABILITY_AUDIT.md` for crawler, sitemap, canonical, CI, and
  point-in-time Cloudflare evidence.
- Google and Bing previously accepted the root sitemap index. It advertises four
  child sitemaps; Phase 1 production run `32921188032` submitted the full
  603-URL current set to IndexNow and received HTTP 200. These are discovery and
  submission receipts, not indexing guarantees.
- After explicit owner confirmation, Google accepted priority-crawl requests
  for `/uk/standard-visitor/`,
  `/guides/canada-visitor-visa-by-country/`, and
  `/canada/study-permit/from-pakistan/`, plus `/new-zealand/`,
  `/new-zealand/visitor-visa/`, and
  `/guides/how-new-zealand-visa-processing-times-work/`. Do not submit those URLs
  again merely to try to change priority.

## 6. Traps and constraints (learned the hard way — do not relearn)

1. **WAF-blocked governments** (403 to honest bots; NEVER UA-spoof): travel.state.gov,
   egov.uscis.gov, ireland.ie, immi.homeaffairs.gov.au. US: verified Aug 2026 — the USCIS
   developer portal has NO processing-times API (Case Status + FOIA only); no
   sanctioned automated route exists. Re-check quarterly by hand.
2. **Astro `<style>` is compile-scoped**: use `<style is:global>` in the layout; a JS
   template expression inside `<style>` silently ships no CSS (bug #1, fixed).
3. **Sticky `thead` inside an `overflow-x` wrapper** pushes the header over the first
   row (bug #2, fixed) — don't reintroduce sticky table headers.
4. **IRCC quirks**: `lastupdated` is a US-format date INSIDE each category dict;
   `refugees_private` values are `{sponsor, refugee}` objects; singular units
   ("1 week", "1 month"); "58 months" is a legitimate value (validation cap 3000d).
5. **gov.uk Content API returns redirect documents** when slugs change — follow
   `redirects[0].destination`, don't treat as failure (playbook in runbook).
6. **lastmod honesty is load-bearing**: entity lastmod = the agency's own
   effective_date. A build that rewrites identical numbers must not bump lastmod —
   currently guaranteed because lastmod never reads the clock.
7. **db.sqlite is committed**; a CI refresh race means `git pull --rebase` before
   pushing local commits (the robot may have committed since your last fetch).
8. **2,070 pages exist at once** is a known SEO risk profile (see HANDOFF_02 §SEO);
   the mitigation is per-page information gain (deltas/ranks/history — partially
   shipped) and NOT bulk-launching future governments (25–30 pages/week rollout).
9. Politeness cap is 150 fetches/host/run — a full IRCC+gov.uk refresh uses ~4.

## 7. What was shipped in the final session (post-launch upgrades)

- Design system v2 (warm-light/dark, brand mark, chips, cards, value-hero), speed
  classification vs service median, related-routes interlinking, 3 data-generated
  guides, split sitemaps w/ honest lastmod, IndexNow pipeline + workflow step,
  research-proven title pattern ("… Processing Time from X — August 2026: 31 days
  (Official)"), delta line (renders when history ≥2 differing values), FAQ blocks
  incl. the "after biometrics" answer (the #1 unmet search modifier), footer
  independence disclaimer, corrected 2026 ad-network guidance in DEPLOYMENT_GUIDE.
- Phase 1 added 9 practical route/corridor guides (13 total), 3 source-backed
  jurisdiction baseline/change reports plus a report hub, editorial/research-desk
  identity, policy/correction/contact pages, consent-gated GA4, a verified Grow
  install with conservative feature defaults, and the GA4↔Search Console link.

## 8. QA ritual before any push that touches pipeline or site

```bash
node pipeline/run.js && node pipeline/build-api.js \
  && cp machine/openapi.yaml site/public/api/v1/openapi.yaml \
  && (cd site && npx astro build) \
  && node machine/api-conformance.mjs \
  && (cd machine/mcp-server && npm run smoke)
```
All green + visual spot-check of one entity page, one hub, home (light AND dark) —
bug #1 shipped precisely because visual rendering wasn't in the automated gates.
