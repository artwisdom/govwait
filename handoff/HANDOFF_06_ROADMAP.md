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
  3–7 days. No Request indexing click has been made.
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

## Phase R2 — NZ + IRCC-flpt sources (the moat accelerators)

Per HANDOFF_05 N1–N2. flpt first if choosing one: 10 years of PR history in a day's work.
**Accept:** validation green with new floors; NZ pages rolled out ≤30/week (feature-flag the getStaticPaths slice — publish new jurisdiction's pages in weekly batches); flpt history renders on PR-program pages; metric semantics labeled (forward vs backward); runbook entries added.

## Phase R3 — /reports: the weekly-changes digest (the linkable asset + CIC News displacement)

Auto-generated per-jurisdiction "What changed this week/month" pages: biggest movers (▲/▼ %), newly published routes, methodology note; hand-editable intro paragraph per issue (1 sentence is enough). Permanent URLs (/reports/canada/2026-w35/) + a latest alias. RSS feed of changes (also the alert backbone).
**Why:** SEO research: original-data reports earn 3.2× links; Boundless proved the citation loop in this exact vertical; CIC News's franchise is prose deltas with decaying URLs — ours compound.
**Accept:** builds from history automatically; renders gracefully when few changes; RSS validates; first outreach email drafted (template in repo) for the owner to send to CIC News-adjacent reporters on a real data drop.

## Phase R4 — History visualization + alerts

- Inline SVG sparklines (no JS) on entity pages once a route has ≥4 observations; full history chart at ≥8.
- "Notify me when this route changes" — email capture (Buttondown/Mailerlite free tier — owner account) or RSS-per-route (zero-account start: RSS is prebuilt static files; do RSS first).
**Accept:** sparklines render only where data depth exists; per-route RSS live; email capture documented as owner step.

## Phase R5 — Editorial layer to ad-approval depth (~40–80 real pages over 2–3 months)

Targets from HANDOFF_04's top-20 table: corridor guides (India→CA study, Nigeria→CA study, UK spouse timeline explainer, super-visa-for-parents…), "published vs lived timelines" explainer (the "reddit" distrust bridge), stage-definitions explainer ("after biometrics"), employer/sponsor-side section (the tier-1 RPM fix from HANDOFF_03). All data-fed where possible so they self-update. Write for humans; no AI-boilerplate tells.
**Accept:** 40+ guide pages live; every top-20 route cross-linked to its guide; AdSense + Journey applications submitted once traffic gate hit (owner clicks).

## Phase R6 — Machine-skin distribution

CSV downloads per dataset + per-page Dataset schema → Google Dataset Search; MCP directory submissions (PulseMCP, mcp.so, Glama, Smithery — owner forms); publish the MCP server to npm (public repo requirement met); data-license page (free personal/attribution; commercial licensed — the negotiation hook).
**Accept:** CSVs linked from hubs; Dataset Search shows the site; ≥2 directory listings live.

## Phase R7 — Scale sources (Norway → Finland → Sweden → Denmark → Netherlands)

One per 2–4 weeks per HANDOFF_05 build order, each with the Sweden-citizenship-style PR hook where one exists. Per-host crawl-delay override (Migri needs 5s) — small fetcher change.
**Accept:** 6–8 governments by month 6; each addition followed by its /reports issue and a pitch email.

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
