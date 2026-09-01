# HANDOFF 06 — Prioritized Roadmap (12 months)

_Synthesis of HANDOFF_02–05 into an ordered plan. Each item: what, why, acceptance
criteria. Effort assumes a competent coding agent. The strategic frame, in one line:
**the product is the RECORD of the numbers (history/deltas/provenance/alerts/API),
never the numbers themselves — six free competitors already have the numbers.**_

## Phase R0 — Owner unblocks (minutes each; some already in DEPLOYMENT_GUIDE)

- [x] Buy govwait.com; route apex + `www` to Cloudflare Pages; verify HTTPS.
- [x] Contact email: alias, About page, and `CONTACT_EMAIL` repository variable complete.
- [x] Google Search Console domain property + Bing Webmaster Tools site verified;
  Google homepage live test and three representative Rich Results tests passed.
- [x] Submit `https://govwait.com/sitemap.xml` to both (2026-08-23). Google reports
  **Sitemap index / Success**; Bing reports **Submitted / Processing**. Recheck in
  3–7 days.
- [x] Submit the three confirmed priority gaps through Google URL Inspection:
  UK Standard Visitor, Canada Visitor Visa by Country guide, and Canada Study
  Permit from Pakistan. All three were added to Google's priority crawl queue.
- [x] Harden search/AI discovery: canonical `www` 301, explicit search and AI
  crawler allows, generated `llms.txt`, five honest child sitemaps, structured
  data, exact IndexNow notifications, and a blocking SEO CI audit. Indexing is
  requested only for the 635 current data-backed pages; 1,464 official no-value
  pages automatically graduate from `noindex, follow` when data appears.
- [x] Privacy-minimal measurement foundation: consent-gated GA4, 14-month retention,
  ad/personalization signals off, GA4 production stream linked to the `govwait.com`
  Search Console property, and production-verified Grow script with subscribe and
  automatic recommendation overlays disabled. This is not ad-network approval.
- Cloudflare account (needed for R1). Pay Per Crawl beta + Monetization Gateway waitlists while there.
- Defensive trademark check "GovWait" CA/UK/US (~$0 to search).

## Phase R1 — Cloudflare Pages migration ⚠️ complete before Sept 15, 2026

**Why:** GitHub Pages ToS gray-zones ad-monetized commercial sites + 100GB cap; Cloudflare's Sept 15 AI-crawler defaults change; pay-per-crawl and Monetization Gateway both require the domain on Cloudflare. The migration workflow is now active in `deploy.yml`.
**Do:** Cloudflare Pages project `govwait` (or workers-static-assets); move DNS; set AI Crawl Control policy DELIBERATELY: allow search + AI crawlers on HTML pages, note bulk-JSON metering as a later toggle; keep GitHub Actions as CI (wrangler deploy step).
**Accept:** site serves from Cloudflare on govwait.com; refresh cron still commits; deploy green; crawl-control policy screenshot in repo docs; GitHub Pages turned off.

**Status 2026-08-22:** Pages project, DNS, HTTPS, email routing, deliberate
allow-crawler policy, scoped GitHub credential, and the automated deploy are
complete. GitHub Pages is off, the unused token is deleted, and a retained-token
proof deployment is green. The operational migration is complete; if desired,
add a dashboard screenshot alongside the textual policy evidence in
`docs/CLOUDFLARE_CRAWL_POLICY.md`.

**Production proof 2026-08-25:** Phase 1 commit `2a1729c` deployed in run
`32921188032`; public-edge checks passed and IndexNow accepted the 603-URL current
set with HTTP 200.

**Latest production proof 2026-08-31:** Norway commit `a9100bb` deployed in run
`33462368754` to `74bd35d1.govwait.pages.dev`; the public apex, all 22 Norway URLs,
API provenance, crawler files, canonical redirect, and five child sitemaps passed
independent checks. IndexNow accepted 642 URLs with HTTP 200.

## Phase R2 — NZ + IRCC-flpt sources (the moat accelerators)

Per HANDOFF_05 N1–N2. The IRCC file supplies deep application-cohort coverage
inside each current monthly snapshot, not a reconstructed ten-year publication
archive. That distinction is now enforced in storage and presentation.
**Accept:** validation green with new floors; NZ pages rolled out ≤30/week
(feature-flag the getStaticPaths slice — publish new jurisdiction's pages in
weekly batches); forward-looking cohort curves and true monthly snapshot history
render separately on PR-program pages; metric semantics labeled (forward vs
backward/service standard/percentile); runbook entries added.

**Status 2026-08-27 — complete:** NZ is production-verified: 133 visas /
266 p50+p80 working-day entities in API/MCP, with a 27-page first public cohort,
runbook coverage, content deployment run `32667382747`, a 588-URL IndexNow HTTP
200 receipt, and precise-notifier proof run `32667617092`. IRCC is also production-
verified: 28 programs, 3,629 forward-estimate rows, 12 reviewed
human pages, append-only monthly snapshots, explicit `snapshot_date` versus
`cohort_month`, a 2,082-page build, and 615/615 SEO-sitemap acceptance. Pipeline
tests 7/7, validation 23 checks, API conformance, MCP, visual QA, and the 615-URL
IndexNow dry run are green. Commit `5d5f0a9` deployed in run `33127083764`; all
12 pages, the 28-program/3,601-cohort API, OpenAPI, `llms.txt`, crawler/canonical
behavior, and 615 unique sitemap URLs passed public checks. IndexNow accepted 621
changed URLs with HTTP 200. R2 is complete; these receipts do not prove indexing,
traffic, ad approval, or revenue.

## Phase R3 — /reports: the weekly-changes digest (the linkable asset + CIC News displacement)

Auto-generated per-jurisdiction "What changed this week/month" pages: biggest movers (▲/▼ %), newly published routes, methodology note; hand-editable intro paragraph per issue (1 sentence is enough). Permanent URLs (/reports/canada/2026-w35/) + a latest alias. RSS feed of changes (also the alert backbone).
**Why:** SEO research: original-data reports earn 3.2× links; Boundless proved the citation loop in this exact vertical; CIC News's franchise is prose deltas with decaying URLs — ours compound.
**Accept:** builds from history automatically; renders gracefully when few changes; RSS validates; first outreach email drafted (template in repo) for the owner to send to CIC News-adjacent reporters on a real data drop.

**Status 2026-08-25:** the first honest baseline layer is live at `/reports/` with
one source-backed report for Canada, the UK, New Zealand, and Norway. It renders a baseline
without inventing movement when no differing second observation exists. Permanent
weekly issue URLs, RSS, and outreach on a real change remain unfinished R3 work.

## Phase R4 — History visualization + alerts

- Inline SVG sparklines (no JS) on entity pages once a route has ≥4 observations; full history chart at ≥8.
- "Notify me when this route changes" — email capture (Buttondown/Mailerlite free tier — owner account) or RSS-per-route (zero-account start: RSS is prebuilt static files; do RSS first).
**Accept:** sparklines render only where data depth exists; per-route RSS live; email capture documented as owner step.

## Phase R5 — Editorial layer to ad-approval depth (~40–80 real pages over 2–3 months)

Targets from HANDOFF_04's top-20 table: corridor guides (India→CA study, Nigeria→CA study, UK spouse timeline explainer, super-visa-for-parents…), "published vs lived timelines" explainer (the "reddit" distrust bridge), stage-definitions explainer ("after biometrics"), employer/sponsor-side section (the tier-1 RPM fix from HANDOFF_03). All data-fed where possible so they self-update. Write for humans; no AI-boilerplate tells.
**Accept:** 40+ guide pages live; every top-20 route cross-linked to its guide; AdSense + Journey applications submitted once traffic gate hit (owner clicks).

**Status 2026-08-31:** 14 source-backed guides are live (9 added in Phase 1 plus
the Norway method guide), with
organizational bylines, citations, Article/Breadcrumb schema, and policy/correction
paths. The 40-page depth target and traffic-gated ad applications remain unfinished.

## Phase R6 — Machine-skin distribution

CSV downloads per dataset + per-page Dataset schema → Google Dataset Search; MCP directory submissions (PulseMCP, mcp.so, Glama, Smithery — owner forms); publish the MCP server to npm (public repo requirement met); data-license page (free personal/attribution; commercial licensed — the negotiation hook).
**Accept:** CSVs linked from hubs; Dataset Search shows the site; ≥2 directory listings live.

## Phase R7 — Scale sources (Norway → Finland → Sweden → Denmark → Netherlands)

One per 2–4 weeks per HANDOFF_05 build order, each with the Sweden-citizenship-style PR hook where one exists. Per-host crawl-delay override (Migri needs 5s) — small fetcher change.
**Accept:** 6–8 governments by month 6; each addition followed by its /reports issue and a pitch email.

**Status 2026-08-31:** Norway's first bounded slice is production-verified: 19
complete UDI table-backed routes, 22 new indexable pages, a source-method guide,
an honest baseline report, fifth child sitemap, and full API/OpenAPI/MCP/`llms.txt`
integration. Live collection, 12 parser tests, 25 validation checks, 2,104-page
build, 635/635 SEO-sitemap audit, 2,611-file API conformance, MCP smoke, responsive
visual QA, and the 635-URL IndexNow dry run pass. Commit `a9100bb` deployed in run
`33462368754`; all 22 Norway URLs and public machine/discovery surfaces passed edge
checks, and IndexNow accepted 642 URLs with HTTP 200. Finland is next and must use
its documented 5-second crawl delay.

## Phase R8 — Day-90/120 SEO checkpoint (calendar it)

Per-sitemap indexation review in GSC; template families <40% indexed at day 90 = fix template (more info-gain per page), don't resubmit; prune/consolidate zero-impression near-duplicate pages into regional tables (301s). Bing/ChatGPT citation spot-checks (the early signal). Judge the project at day 120–180, not day 30 (HANDOFF_02 hard truth #2).

## Phase R9 (month 6+, evidence-gated)

- Raptive application when 25K PVs AND ≥50% tier-1 (check GSC geo mix first).
- TollBit evaluation at 100K+ PVs; x402/Monetization Gateway experiment when GA.
- Licensing outreach at 3+ governments × 12+ months history ($3K–15K/yr anchor; Docketwise-competitor list in HANDOFF_03).
- Crowdsourced "lived timeline" layer ONLY if traffic exists to seed it (the incumbents' moat — don't build into a void).

## Standing policies (never expire)

1. Non-negotiables in HANDOFF_00 (politeness, no UA spoofing, append-only history, fail-loud validation, honesty).
2. New-page rollout ≤25–30/week. 3. lastmod stays honest. 4. Every projection quotes RISK_REGISTER base rates. 5. Pivot thresholds in RISK_REGISTER (notably: <10K sessions/mo at month 6 → niche pivot conversation, not CSS polish).

## What success looks like (calibrated, not hyped)

Month 3: indexation >60% on CA sitemap, first Bing/ChatGPT citations, /reports earning first external links. Month 6: 6+ governments, 10K+ sessions/mo, Journey ads live, first affiliate dollars. Month 12: 50K+ sessions/mo, $300–800/mo, 12 months of multi-government history nobody can backfill, licensing conversations startable. Anything above this curve is the good case; below it, consult RISK_REGISTER pivot thresholds before investing month 13.
