# GovWait — Codex Handoff Package

_Prepared 2026-08-21/22 by Claude (Fable 5) for transfer of day-to-day development to
Codex. The owner (Michael) manages his web projects there; this package is written so
a coding agent with zero context can operate this project safely and grow it. Operational
status refreshed 2026-09-04 after the Phase 3 growth release._

## What GovWait is, in one paragraph

GovWait (repo: `github.com/artwisdom/govwait`, domain `govwait.com` — registered and live on Cloudflare)
tracks **officially published government processing times** (visas, permits,
sponsorships) with provenance and append-only history. Governments overwrite these
numbers over time and often keep no archive; our recorded history is the compounding,
non-backfillable asset. One dataset, three skins: a static Astro site (2,107 HTML pages),
a free static JSON API (2,611 files + OpenAPI 3.1), and an MCP server for AI
agents. A GitHub Actions cron refreshes data Tue+Fri; a failed validation publishes
nothing. Revenue plan: display ads (engine), machine access (optionality), dataset
licensing (lottery ticket). Honest base rates live in `RISK_REGISTER.md` — most
projects like this earn ~$0; maintained base case $500–$3K/mo at months 12–18.
Phase 2 adds IRCC's forward-looking estimates with explicitly separate publication-
snapshot and application-cohort semantics. The 2026-08-31 production release adds
19 complete table-backed Norway UDI routes without probing personalised guides.
The 2026-09-04 Phase 3 release adds permanent dated change reports, RSS discovery,
and a source-backed New Zealand 2021 Resident Visa processing guide.

## The files in this package

| File | What it contains | Read when |
|---|---|---|
| `HANDOFF_01_PROJECT_STATE.md` | Complete technical deep dive: every directory, the data model, pipeline internals, the politeness/compliance rules that MUST survive any refactor, CI, deployment state, known constraints and traps | First, fully, before touching code |
| `HANDOFF_02_RESEARCH_SEO.md` | Aug-2026 research: indexing a 2K-page site, the 2026 core/spam updates, information-gain requirements, AI Overviews/ChatGPT/Perplexity citation mechanics, E-E-A-T, link acquisition — each item marked done/roadmap | Before any growth work |
| `HANDOFF_03_RESEARCH_MONETIZATION.md` | Aug-2026 research: the real ad-network ladder (Journey on-ramp; Ezoic dead), vertical RPM economics, pay-per-crawl reality check, licensing, affiliate trust filter, revenue table | Before any monetization work |
| `HANDOFF_04_RESEARCH_COMPETITORS.md` | Competitor deep-dive (6 free trackers!), live autocomplete demand mapping, SERP reality, top-20 priority routes, the wedge (history/alerts/API) | Before any product decision |
| `HANDOFF_05_RESEARCH_SOURCES.md` | Source research and implementation status: NZ, IRCC forward-looking, and Norway UDI live; FI/SE/DK/NL next; USCIS correction (no times API exists) | Before adding any source |
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
> of the next unfinished phase (R4–R5), citing the relevant research file. Do not modify the
> politeness layer, validation floors, or history semantics described in the
> handoff non-negotiables.

## Current status snapshot (as of this handoff)

- Repo public and live; Cloudflare Pages project `govwait` serves `govwait.com` and
  redirects `www.govwait.com` permanently to the canonical apex over HTTPS.
  GitHub Pages is disabled; Phase 3 commit `d635236` is live from green deployment
  run `33934940206` (`dbdfa613.govwait.pages.dev`).
- refresh-data cron ACTIVE (Tue+Fri 14:00 UTC). The 2026-09-04 run failed closed
  because UDI's `robots.txt` returned HTTP 403 to the GitHub runner; nothing was
  exported, and the last verified committed data remains live.
- `contact@govwait.com` is active through Cloudflare Email Routing and published on
  the About page. The `CONTACT_EMAIL` repository variable is set, so unattended
  refreshes carry the accountable contact in the crawler User-Agent.
- Dataset: **2,318 metric routes / 9 sources / 4 governments** (Canada, UK,
  New Zealand and Norway; INZ contributes 133 visas × two official percentiles,
  IRCC forward-looking contributes 28 programs, and UDI contributes 19 routes).
  Canada and New Zealand now have differing observations exposed through permanent
  dated issues; UK and Norway remain honest baselines until their stored values
  differ. Checks continue twice weekly and publish nothing on a failed run.
- Site: design system, speed chips, related-route interlinking, 15 source-backed
  guides, 4 jurisdiction reports, 2 permanent dated report issues, an RSS feed,
  a report hub, editorial/research-desk identity, and trust/policy pages. Consent-gated
  GA4 and a verified Grow script are live;
  GA4 is linked to the `govwait.com` Search Console property. All release gates are green.
- Discoverability hardening is production green: 638 data-backed pages are
  indexable and exactly match the five child sitemaps; 1,464 official
  unavailable/insufficient country pages remain live with `noindex, follow`
  until an official numeric value appears. Search/AI crawler access, dynamic
  `llms.txt`, canonical redirects, honest per-child lastmod, and a blocking SEO
  CI audit are documented in `docs/DISCOVERABILITY_AUDIT.md`.
- The root sitemap accepted by Google and Bing advertises five child sitemaps. The
  Phase 3 deployment submitted 646 URLs—the 638-page indexable set plus eight
  discovery documents—and received an IndexNow HTTP 200 receipt. Google also
  accepted owner-approved priority-crawl requests for three earlier gaps, three
  representative New Zealand URLs, the Canada 2026-08-26 dated report, and the
  New Zealand 2021 Resident Visa guide.
  These are discovery receipts, not proof of indexing, traffic, or revenue.
- Phase 2 is **production-verified**: 2,299 active entities /
  8 sources / 3 governments; 3,629 IRCC forward-estimate rows (28 current headline
  projections plus 3,601 application-cohort rows); 12 reviewed human pages; 2,082
  HTML pages; and 615 indexable/sitemap URLs. Pipeline tests 7/7, validation 23
  checks, SEO audit, 2,572-file API conformance, MCP smoke tests, visual checks,
  all 12 public pages, API/OpenAPI/`llms.txt`, 615 unique sitemap URLs, canonical
  behavior, and crawler policy pass. These are release receipts, not indexing,
  traffic, ad-approval, or revenue proof.
- Norway is **production-verified**: 19 table-backed UDI routes from 5 official
  pages; 2,318 active entities / 9 sources / 4 governments; 2,104 HTML pages; 635
  indexable/sitemap URLs; and 2,611 generated API files. Twelve parser tests, 25
  validation checks, SEO/API/MCP gates, a 635-URL dry run, and rendered checks
  passed. Commit `a9100bb` deployed in run `33462368754`; all 22 Norway URLs and
  machine/discovery surfaces passed public checks, and IndexNow accepted 642 URLs.
  The implementation excludes personalised questionnaires and preserves exact
  published ranges. No indexing, traffic, ad approval, or revenue is claimed.
- Phase 3 is **production-verified**: 2,107 HTML pages; 638 indexable/sitemap URLs;
  2 permanent dated report issues; an RSS feed; and a source-backed New Zealand
  2021 Resident Visa guide. Commit `d635236` deployed in run `33934940206` to
  `dbdfa613.govwait.pages.dev`; public-edge checks passed, and IndexNow accepted
  646 URLs. Google accepted the two owner-approved priority-crawl requests. These
  are deployment and discovery receipts, not proof of indexing, traffic, ad
  approval, or revenue.
