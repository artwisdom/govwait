# GovWait — Codex Handoff Package

_Prepared 2026-08-21/22 by Claude (Fable 5) for transfer of day-to-day development to
Codex. The owner (Michael) manages his web projects there; this package is written so
a coding agent with zero context can operate this project safely and grow it. Operational
status refreshed 2026-08-25 after the Phase 1 trust/growth deployment._

## What GovWait is, in one paragraph

GovWait (repo: `github.com/artwisdom/govwait`, domain `govwait.com` — registered and live on Cloudflare)
tracks **officially published government processing times** (visas, permits,
sponsorships) with provenance and append-only history. Governments overwrite these
numbers weekly and keep no archive; our recorded history is the compounding,
non-backfillable asset. One dataset, three skins: a static Astro site (2,070 HTML pages),
a free static JSON API (2,515 files + OpenAPI 3.1), and an MCP server for AI
agents. A GitHub Actions cron refreshes data Tue+Fri; a failed validation publishes
nothing. Revenue plan: display ads (engine), machine access (optionality), dataset
licensing (lottery ticket). Honest base rates live in `RISK_REGISTER.md` — most
projects like this earn ~$0; maintained base case $500–$3K/mo at months 12–18.

## The files in this package

| File | What it contains | Read when |
|---|---|---|
| `HANDOFF_01_PROJECT_STATE.md` | Complete technical deep dive: every directory, the data model, pipeline internals, the politeness/compliance rules that MUST survive any refactor, CI, deployment state, known constraints and traps | First, fully, before touching code |
| `HANDOFF_02_RESEARCH_SEO.md` | Aug-2026 research: indexing a 2K-page site, the 2026 core/spam updates, information-gain requirements, AI Overviews/ChatGPT/Perplexity citation mechanics, E-E-A-T, link acquisition — each item marked done/roadmap | Before any growth work |
| `HANDOFF_03_RESEARCH_MONETIZATION.md` | Aug-2026 research: the real ad-network ladder (Journey on-ramp; Ezoic dead), vertical RPM economics, pay-per-crawl reality check, licensing, affiliate trust filter, revenue table | Before any monetization work |
| `HANDOFF_04_RESEARCH_COMPETITORS.md` | Competitor deep-dive (6 free trackers!), live autocomplete demand mapping, SERP reality, top-20 priority routes, the wedge (history/alerts/API) | Before any product decision |
| `HANDOFF_05_RESEARCH_SOURCES.md` | Source research and implementation status: NZ API now live; IRCC flpt (history to 2016!), NO/FI/SE/DK/NL next; USCIS correction (no times API exists) | Before adding any source |
| `HANDOFF_06_ROADMAP.md` | The ordered 12-month plan (R0–R9) with acceptance criteria and standing policies | To decide what to do next, always |

Also read in the repo root (they remain the operating manuals): `EXECUTION_REPORT.md`
(what was built and why), `DEPLOYMENT_GUIDE.md` (remaining owner steps),
`MAINTENANCE_RUNBOOK.md` (weekly ops + failure playbooks + how to add a source),
`RISK_REGISTER.md` (honest risks + pivot thresholds), `DECISIONS.md` (every judgment
call, numbered), `docs/ARCHITECTURE.md`, `docs/QA_REPORT.md`, `STATE.md`.

## Non-negotiables that must survive the transfer

These protect the owner legally and protect the asset's trustworthiness. They are not
style preferences.

1. **Politeness discipline**: honest bot User-Agent with contact email; robots.txt
   obeyed with FAIL-CLOSED semantics (403/blocked robots ⇒ source is dead); ≥3s
   between same-host requests; cache everything; never re-fetch what you have.
2. **Never spoof a browser UA to get around a WAF.** travel.state.gov, egov.uscis.gov,
   ireland.ie, immi.homeaffairs.gov.au block bots — they stay excluded until an
   official API/dataset route exists (verified Aug 2026: USCIS's developer portal has
   NO processing-times API — only Case Status and FOIA — so the US has no sanctioned
   automated route today).
3. **Official primary sources only. Values, never prose.** Every record carries
   `source_url`, the agency's own `effective_date`, and our `retrieved_at`.
4. **History is append-only.** Never rewrite or backfill `observations`; a corrected
   parse gets a new row, not an edit.
5. **Validation fails loudly and publication stops.** Never lower a coverage floor or
   widen a sanity range just to make CI green — fix the parser or investigate the
   source (see runbook playbooks).
6. **Honesty in owner-facing claims.** No revenue hype beyond the documented base
   rates. Every projection carries its probability context.
7. **No personal data, ever.** Facts, figures, official values only.

## Suggested first prompt for Codex

> Read `handoff/HANDOFF_00_README.md`, then `handoff/HANDOFF_01_PROJECT_STATE.md`
> fully. Confirm you can run the pipeline locally (`node pipeline/run.js` — uses
> cache, no network needed) and build the site (`cd site && npm ci && npx astro
> build`). Then read `handoff/HANDOFF_06_ROADMAP.md` and propose one bounded slice
> of the next unfinished phase (R2–R5), citing the relevant research file. Do not modify the
> politeness layer, validation floors, or history semantics described in the
> handoff non-negotiables.

## Current status snapshot (as of this handoff)

- Repo public and live; Cloudflare Pages project `govwait` serves `govwait.com` and
  redirects `www.govwait.com` permanently to the canonical apex over HTTPS.
  GitHub Pages is disabled; Phase 1 commit `2a1729c` is live from green deployment
  run `32921188032` (`dfb3a5be.govwait.pages.dev`).
- refresh-data cron ACTIVE (Tue+Fri 14:00 UTC); first autonomous data commit already
  landed (`data: refresh 2026-08-22`).
- `contact@govwait.com` is active through Cloudflare Email Routing and published on
  the About page. The `CONTACT_EMAIL` repository variable is set, so unattended
  refreshes carry the accountable contact in the crawler User-Agent.
- Dataset: **2,271 metric routes / 7 sources / 3 governments** (Canada, UK and
  New Zealand; INZ contributes 133 visas × two official percentiles). The
  2026-08-25 refresh verified the baseline without a differing second value, so
  reports correctly say “baseline” rather than inventing a trend; checks continue
  twice weekly.
- Site: design system, speed chips, related-route interlinking, 13 source-backed
  guides, 3 jurisdiction reports plus a report hub, editorial/research-desk identity,
  and trust/policy pages. Consent-gated GA4 and a verified Grow script are live;
  GA4 is linked to the `govwait.com` Search Console property. All release gates are green.
- Discoverability hardening is production green: 603 data-backed pages are
  indexable and exactly match the four child sitemaps; 1,462 official
  unavailable/insufficient country pages remain live with `noindex, follow`
  until an official numeric value appears. Search/AI crawler access, dynamic
  `llms.txt`, canonical redirects, honest per-child lastmod, and a blocking SEO
  CI audit are documented in `docs/DISCOVERABILITY_AUDIT.md`.
- The root sitemap accepted by Google and Bing advertises four child sitemaps. The
  full 603-URL eligible set received an IndexNow HTTP 200 receipt after Phase 1
  production deployment. Google also accepted owner-approved priority-crawl
  requests for three earlier gaps and three representative New Zealand URLs.
  These are discovery receipts, not proof of indexing, traffic, or revenue.
