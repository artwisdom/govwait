# HANDOFF 01 — Project State & Technical Deep Dive

_Everything a coding agent needs to operate GovWait. Current as of 2026-08-22._

## 1. The one-sentence architecture

Official government pages → polite fetcher → SQLite (append-only history) → JSON
exports → three disposable skins (Astro site, static JSON API, MCP server), all
rebuilt by GitHub Actions on a Tue+Fri cron; validation failures stop publication.

```
pipeline/run.js ──▶ data/db.sqlite ──▶ data/exports/{latest,history,stats}.json
                                            │
                    pipeline/build-api.js ──▶ site/public/api/v1/** (≈2,000 files)
                                            │
                    site/ (Astro 4) ───────▶ site/dist (2,024 HTML pages + API + sitemaps)
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
| `pipeline/validate.js` | 11 checks: shapes, ISO codes, range (0 < days ≤ 3000 — "58 months" refugee value is REAL), coverage floors (ircc ≥1200, govuk ≥10, total ≥300), staleness (45d/120d), 10× jump flags, provenance | ⚠️ Never loosen to force green |
| `pipeline/export.js` | Emits `latest.json` (entities + latest obs), `history.json` (all obs grouped), `stats.json` | |
| `pipeline/build-api.js` | exports → `site/public/api/v1/**` static endpoints | Run before astro build |
| `pipeline/indexnow.js` | Posts exact changed, indexable URLs to IndexNow; full-current-set and dry-run modes are available. Key file lives at `site/public/<32hex>.txt`; key constant inside the script | Receipt is not proof of indexing |
| `data/db.sqlite` | Source of truth, **committed to git** so CI accumulates history. WAL files gitignored | ⚠️ Never rewrite history rows |
| `data/cache/http/`, `data/cache/robots/` | Fetch caches (gitignored) | |
| `site/` | Astro 4 (Node 20 pin — Astro 5 needs Node ≥22). `site.config.json` = brand + SITE_URL; CI overrides via `SITE_URL` repo var | |
| `site/src/lib/data.js` | Build-time model: slugs, services map, medians, speed classes (vs service median: ≤0.6 fast / ≤1.4 typical / ≤2.5 slow / else very slow), deltas from history, `relatedRoutes()`, `dataLastmod`. Throws on URL collisions | The brain of the site |
| `site/src/lib/sitemap.js` + `pages/sitemap*.xml.js` | Sitemap index → hubs + numeric CA applicant pages + UK services. **lastmod = official effective_date for that exact child, never build time** | ⚠️ Keep lastmod honest |
| `site/src/pages/` | `index`, `[country]/index`, `[country]/[service]/index` (hub for CA; entity page for GB), `[country]/[service]/[applicant]` (CA entity pages), `guides/*` (3 data-generated analyses), `about`, `api-docs`, `404` | |
| `machine/openapi.yaml` | OpenAPI 3.1, copied into the API at build | Keep in sync with build-api.js |
| `machine/api-conformance.mjs` | Checks every built API file against the spec's shapes | Run in QA |
| `machine/mcp-server/` | TypeScript stdio MCP server, 4 tools, reads exports. `npm run build && npm run smoke` (8 assertions) | |
| `.github/workflows/refresh.yml` | Cron Tue+Fri 14:00 UTC: pipeline → build-api → commit data diff. Failure diagnosis into job summary | |
| `.github/workflows/deploy.yml` | On push (site/data/openapi paths): build → SEO audit → Cloudflare Pages → IndexNow notification after successful production deploy | Requires scoped Cloudflare token in GitHub |
| `site/scripts/seo-audit.mjs` | CI gate for unique metadata, canonicals, H1, JSON-LD, internal links, intentional noindex, exact sitemap membership, honest child lastmod, robots and llms.txt | Run after every site build |
| `handoff/` | This package | |

Root docs: `EXECUTION_REPORT.md`, `DEPLOYMENT_GUIDE.md` (owner steps; monetization
section updated Aug 2026), `MAINTENANCE_RUNBOOK.md` (failure playbooks + add-a-source
recipe), `RISK_REGISTER.md`, `DECISIONS.md` (21 numbered judgment calls), `STATE.md`.

## 3. Data model (SQLite, `pipeline/schema.sql`)

- `sources(id, name, jurisdiction, agency, url, license_note, robots_status, robots_checked_at)`
- `entities(id, source_id, jurisdiction, service_category, service_key, service_name, applicant_country, applicant_country_name)` — id example: `ca-visitor-visa--in`; UNIQUE(jurisdiction, service_key, applicant_country)
- `observations(entity_id, value_raw, value_days, unit_original, status, effective_date, retrieved_at, source_url, confidence)` — UNIQUE(entity_id, effective_date); INSERT OR IGNORE ⇒ **idempotent re-runs; history grows only when the agency republishes**

Normalization: days×1, weeks×7, months×30.44; `value_raw` always preserved verbatim.
Statuses: `ok` (numeric), `unavailable` ("No processing time available"),
`insufficient_data` ("Not enough data") — nulls are displayed honestly as official facts.
Current stats: 2,005 entities; ~540 numeric; sources: ircc-ptime (1,907), ircc-noncountry (19), ircc-passport (2), govuk-visa-times (39), govuk-inuk-times (37), govuk-passport (1). Unstamped-source change-detection semantics: see resolveUnstamped() in run.js.

## 4. Commands (all verified working)

```bash
node pipeline/run.js              # uses cache — safe offline
node pipeline/run.js --refresh    # live fetch (polite; ~4 requests total)
node pipeline/build-api.js        # exports -> static API files
cd site && npm ci && npm run build && npm run audit:seo  # ~3s, 2,024 HTML pages
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
  `CONTACT_EMAIL=contact@govwait.com`, and `CLOUDFLARE_ACCOUNT_ID`. The encrypted
  `CLOUDFLARE_API_TOKEN` secret has Pages write permission only.
- refresh-data cron ACTIVE and proven (first autonomous commit: `data: refresh
  2026-08-22`). deploy-site green. ~60 min/month total of the 2,000 free.
- Cloudflare migration: production cutover, explicit allow-crawler policy, and
  GitHub-driven deployment are complete. GitHub Pages is disabled, the unused
  original token is deleted, and discoverability release run `32659297157`
  deployed commit `bc3eb1f` successfully.
- Search ownership: Google Search Console domain property `govwait.com` and Bing
  Webmaster Tools site `https://govwait.com/` are DNS-verified. Google's live test
  says the homepage can be indexed, and three representative pages passed the live
  Rich Results Test with valid Breadcrumb markup.
- Sitemap onboarding: `https://govwait.com/sitemap.xml` was submitted to both search
  engines on 2026-08-23. Google reports **Sitemap index / Success**; Bing accepted it
  and reports **Submitted / Processing**.
- The 2026-08-23 discoverability audit intentionally limits requested indexing
  to 561 useful/data-backed URLs (39 hubs/guides, 445 numeric CA applicant
  pages, 77 UK services). The other 1,462 applicant pages stay live and
  crawlable with `noindex, follow` until a numeric official value appears.
  See `docs/DISCOVERABILITY_AUDIT.md` for crawler, sitemap, canonical, CI, and
  point-in-time Cloudflare evidence.
- After that release, Google accepted the updated sitemap again, Bing accepted
  it for processing, and the full 561-URL set received an IndexNow HTTP 200
  receipt. These are submission receipts, not indexing guarantees.
- After explicit owner confirmation, Google accepted priority-crawl requests
  for `/uk/standard-visitor/`,
  `/guides/canada-visitor-visa-by-country/`, and
  `/canada/study-permit/from-pakistan/`. Do not submit those URLs again merely
  to try to change priority.

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
8. **1,960 pages launched at once** is a known SEO risk profile (see HANDOFF_02 §SEO);
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
