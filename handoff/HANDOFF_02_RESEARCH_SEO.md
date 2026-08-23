# HANDOFF 02 — Research: SEO / Indexing / AI-Search (August 2026)

_Produced by a dedicated research pass on 2026-08-21/22. The briefing below is the
research deliverable verbatim; this preamble maps it to what is ALREADY IMPLEMENTED
in the repo versus what remains (→ roadmap)._

## Implementation status of the briefing's "Do this" items

| Recommendation | Status |
|---|---|
| Split sitemaps per template family + honest lastmod | ✅ DONE (`sitemap.xml` index → `sitemap-hubs.xml`, `sitemap-ca.xml`; lastmod = official effective_date only) |
| IndexNow → Bing (feeds ChatGPT Search) | ✅ IMPLEMENTED (`pipeline/indexnow.js` + refresh.yml step + public key file); Bing Webmaster Tools ownership is now verified. Receipt/reporting data may lag, so confirm future refresh submissions appear before calling the dashboard observation complete. |
| Related-pages module on every leaf | ✅ DONE (same-country cross-service chips; sibling-country links in Compare section) |
| Month-token title pattern with number | ✅ DONE ("Canada Visitor Visa Processing Time from India — August 2026: 31 days (Official)") |
| Above-fold: number + updated date + source + MoM change | ✅ DONE (delta line renders once a route has 2 differing published values — history is 1–2 deep today, so deltas appear organically over coming weeks) |
| Answer-shaped H2 + direct-answer sentence | ✅ DONE |
| Attributed official quote (GEO +41% finding) | ✅ DONE (IRCC "most complete applications" quote on CA pages) |
| FAQ targeting "why is mine slower" + "after biometrics" | ✅ DONE (varied by category/status to avoid pure boilerplate) |
| Methodology page + About + independence disclaimer | ✅ DONE (about.astro; footer disclaimer on every page) |
| GSC + Bing WMT accounts, submit sitemaps | ✅ SUBMITTED 2026-08-23; Google reports **Sitemap index / Success**, Bing reports **Submitted / Processing**. Recheck discovered-URL counts and Bing's final state after 3–7 days — DEPLOYMENT_GUIDE step 6. |
| Request-indexing quota on hubs only | ❌ SEPARATE OWNER GATE; none requested. Homepage live test is eligible, but the new property still reports the URL as unknown until discovery/indexing. |
| Downloadable CSV per dataset + Dataset Search submission | ❌ ROADMAP (R6) |
| /reports (or /trends) monthly movers section | ❌ ROADMAP (R3) — needs history depth, framework should ship now |
| History sparklines per route | ❌ ROADMAP (R4) — meaningful at ~6+ observations |
| 25–30 pages/week rollout for new governments | ⚠️ POLICY — encoded in roadmap; do NOT bulk-launch NZ etc. |
| Per-sitemap indexation tracking, prune at day 90 | ❌ ROADMAP (R8) |
| Skip: llms.txt investment, GEO tools/subscriptions | Noted — llms.txt exists (cheap), no further effort |

---

# GovWait SEO/GEO Briefing — Indexing, Ranking, and Citation for a New ~2,000-Page Programmatic Data Site (August 2026)

**Scope note on evidence quality:** Claims below are tagged with source + date. Several frequently-surfaced sources in this space (digitalapplied.com, quickseo.ai, various "2026 guide" blogs) are themselves AI-assisted content marketing; used only where corroborated, and flagged speculation. Google's March 2026 spam update, March 2026 core update, and May 2026 core update are **confirmed real** (Google Search Status Dashboard, via Search Engine Roundtable and Search Engine Journal, May–June 2026).

## 1. Indexing a large new site in 2026

**Crawl budget is not your problem; crawl *demand* is.** Google's official position (Gary Illyes, via Search Engine Land crawl-budget guide, Dec 6 2024) is that crawl budget matters only at 1M+ pages or ~10K+ daily-changing pages. At ~1,960 pages GovWait is far below that. A brand-new zero-backlink domain instead faces minimal crawl demand: new domains get a trickle for the first 2–8 weeks. Full indexation of a new 2K-page site realistically takes **3–6 months**, and only if quality signals hold.

**Google quality-samples your templates.** Consistent 2025 practitioner finding (Onely; SearchX; Digispot): Google crawls a sample of a template family; if it reads thin/near-duplicate, the rest sits in "Discovered – currently not indexed" indefinitely. Best-documented recent pSEO case (TheStacc, May 2026, upd. July 2026 — 512 pages, 18 months): 87% indexed within 90 days when publishing 25–30 pages/week max; a one-time bulk publish of 80 pages dropped indexing to 41%; indexing varied by template quality (glossary 94%, location 89%, thin pages 73%).

GovWait launched ~1,960 pages at once. Expect a long "Discovered – currently not indexed" tail; treat GSC per-sitemap indexing coverage as the primary KPI for 90 days.

**"Discovered – currently not indexed" mitigation** (Ahrefs, Sept 2022 canonical; Onely 2025): (a) internal links from already-indexed pages; (b) even ONE external backlink measurably accelerates a section; (c) never link tens of thousands of URLs from one page; (d) URL Inspection "Request Indexing" ~10–15/day — spend on hubs only; (e) server speed (documented 4x crawl-rate gains from 800ms→180ms) — static 7KB pages are already optimal.

**IndexNow: irrelevant for Google, high-leverage for AI search.** Google does NOT support IndexNow (2026). Bing/Yandex/Naver/Seznam do. Implement anyway: **ChatGPT Search retrieves from Bing's index, and ~87% of ChatGPT citations match Bing top-10 organic** (Yoast; Conbersa, 2026). Bing is far less competitive for a new domain.

**Sitemaps 2026** (Google Search Central; CrawlSense/Spotibo 2025): `lastmod` is the only optional field that matters and only if verifiably accurate (spoofed lastmod ⇒ whole sitemap's lastmod ignored). `changefreq` largely ignored, `priority` fully ignored. Sitemap ping endpoint retired June 2023. Split into child sitemaps per template family for per-section GSC coverage stats.

**Internal linking:** hub-and-spoke PLUS spoke-to-spoke (HashBuilds; marketingagency.sg, 2025). Pure hub-and-spoke bottlenecks crawling; "related entities" modules create crawl paths and distribute PageRank. Target ≤3–4 clicks to every leaf.

## 2. What separates programmatic pages that rank from ones Google ignores

**Enforcement timeline:**
- **March 2024:** Scaled Content Abuse policy + manual action wave. Originality.ai audit of ~79K sites: 1,446 manual actions; 100% had AI content; several sites 1M+ visits → zero.
- **March 2026:** Spam update (Mar 24–25, fastest ever) targeting scaled content + link schemes; core update 2 days later (Mar 27–Apr 8). Mass-produced templated/AI page portfolios reported losing 50–80% of traffic (Coalition Technologies; thepublive; SEJ).
- **May 2026:** Second core update (May 21–Jun 2, confirmed). Directionally: ad-heavy programmatic sites hit again.

**What survives:** pages on **unique, verifiable, non-replicable data refreshed on a real schedule** (job boards w/ live listings, comparison pages w/ live pricing, entity pages on rich primary data). The named failure profile: **"aggregator sites republishing data without added context"** — a gov-data mirror with nicer HTML is in the kill zone; gov-data + history + deltas + comparisons + analysis is the survivor zone.

**Information gain is the operative frame.** Google's "Contextual Estimation of Link Information Gain" patent (US11354342B2 granted June 2022; continuation US12013887B2 June 2024) scores what a page adds BEYOND the SERP. Per-applicant-country breakdowns that IRCC's dropdown tool can't expose as crawlable URLs = real information gain (structural arbitrage). A restyled copy of the same number = zero.

**Thresholds from the case study** (TheStacc, May 2026): ≥3 unique data points/page; 900–2,200 words; bottom 30% of pages → 5% of clicks; refresh cycles needed (12-month max; quarterly sprints recovered 61 decaying pages). The "30–40% uniqueness threshold" claim floating around is speculation — no Google documentation.

**Do this (dataset-specific):** every page must pass "≥3 things not on canada.ca/gov.uk": (1) current number, (2) change vs last update (▲/▼ %), (3) rank/percentile vs other countries, (4) sparkline once history exists. Snapshot EVERYTHING weekly forever, even for unbuilt governments — the archive is the only non-backfillable asset. Add a human-edited "what changed this month" digest per hub. Prune at day 90: zero-impression near-duplicate pages consolidate into regional tables (301).

## 3. AI Overviews, AI search, and GEO

- **AI Overviews:** shown on 6.5% of queries (Jan 2025) → ~25% (Jul 2025) → <16% (Nov 2025) (Search Engine Land, 51K events). YMYL triggers ~34% vs 20.5% baseline; Legal up to 77% (SE Ranking). Immigration is formally YMYL (QRG added "Government, Civics and Society" category in 2025).
- **Citation concentration:** YouTube ~23%, Wikipedia ~18%, google.com ~16% of AIO citations (Surfer, Oct 2025: 36M AIOs). Reddit is #1 most-cited across ChatGPT/AI Mode/Gemini/Perplexity/AIOs. Top 20% of domains capture ~80% of citations.
- **ChatGPT:** Wikipedia-heavy; **~87% of citations match Bing top-10** (Conbersa 2026). Rank on Bing → get cited by ChatGPT. Most actionable GEO fact for a new domain.
- **Perplexity:** own crawler + live retrieval; hard freshness gate (~50% of citations published same year). Fetches ~10 pages/query, cites 3–4. Visible last-updated dates and attributed statistics are pass/fail signals.
- **Volatile-number queries:** citations churn monthly; ~30% of brands persist across back-to-back responses. Content stating a specific number WITH attribution and visible update date, that actually changes when the number changes, is exactly what gets selected. GovWait's natural shape — genuine tailwind.
- **GEO evidence** (Princeton/GT/IIT-D paper, 2024 — the only controlled experiment): +41% visibility from quotations, +32% statistics, +30% citing sources, +28% fluency. Everything else sold as "GEO" is repackaged SEO or unvalidated.
- **llms.txt: keep, expect nothing.** Adoption 8.7% of Tranco top-1K (Rankability, Aug 2026) but consumption evidence damning: Limy.ai's 500M bot-event analysis found only a few hundred /llms.txt requests; GPTBot/ClaudeBot/PerplexityBot skip it. SE Ranking (300K domains, Nov 2025): zero citation lift.
- **Dataset schema:** no ranking influence (Mueller 2025); concrete benefit = Google Dataset Search (researchers + data journalists — the exact citation audience). Add per-page Dataset markup with temporalCoverage/dateModified/distribution CSV.

## 4. E-E-A-T for a solo data site

Trust lives in **data provenance, not personas**: methodology page (source URLs, schedule, per-government definitions incl. IRCC's ~80%-of-cases meaning, limitations, corrections policy) is the single highest-value artifact; primary-source citations with retrieval dates; visibly-changing timestamps; a real About page with a named human and honest motive. Anonymous data sites do rank (VisaGrader) — persona is a multiplier, not a gate. Immigration is YMYL: you will not out-E-E-A-T canada.ca; win on what canada.ca doesn't publish (history, per-country crawlable pages, comparisons).

**Cargo cult (skip):** fake "Reviewed by" labels, stock headshots, author-schema stuffing, E-E-A-T checklists, bought Wikipedia mentions (COI edits get reverted and can blacklist the domain).

## 5. Backlink acquisition for data sites in 2026

- HARO/Connectively **shut down Dec 9, 2024**; Featured.com relaunched the brand as a newsletter. Working successors: **Source of Sources** (free, highest signal), **Qwoted**, SourceBottle, ProfNet. Daily 10-min scan for immigration/visa queries.
- Original data earns ~3.2x more links than opinion content; 68% of journalists prefer data-backed pitches; digital PR displaced guest posting (BuzzStream/Demandsage 2025–26).
- **The proven model in this vertical is Boundless Immigration**: processing-time/fee/backlog data → report-shaped narratives timed to news cycles → cited by WaPo and VoA. Nobody does this for IRCC per-country or UK data — open lane. Reporters need the citable delta ("study permit waits for Nigerian applicants rose 40% in six months") that official tools literally cannot show.
- **Reddit:** 90/10 rule is the floor; AEO enforcement visibly increased. Viable play: answer "how long" threads with data, no links, for a month+; links only when asked. Dual payoff: Reddit is #1 AI-cited domain — top answers referencing your data propagate into AI citations.
- **Do:** /reports section (monthly movers, hand-edited); 5-sentence delta pitches to CIC News/Canadian outlets/immigration-lawyer blogs on every IRCC drop; SOS+Qwoted signups; free embeddable charts/CSV with attribution. **Don't:** buy links, reciprocal schemes, mass "resource page" outreach (half the March 2026 spam update).

## 6. The immigration/visa vertical specifically

**The SERP is not locked up by .gov — verified Aug 2026.** "Canada tourist visa processing time": **Atlys ranks #1 above canada.ca**; CIC News #2; canada.ca #3; GoFarGlobal #4. Officials rank but don't sweep — IRCC's tool is an uncrawlable dropdown; official pages are stale-looking and answer-shaped-for-nobody. Third parties win on freshness signaling, one-page comprehensiveness, answer shape.

**Winner's format blueprint (GoFarGlobal, fetched Aug 2026):** title "IRCC Processing Times Today (August 2026): All Current Canada Wait Times"; H1 repeats month; "Last updated" + "Source: IRCC" at top; summary table then per-program cards with own dates; FAQ "why is my application slower than posted times?"; plain-language 80%-caveat explainer; RCIC license as trust signal; dense cross-links; weekly refresh with month-token title updates.

**Moat hierarchy:** durable incumbents hold crowdsourced actual-case data (VisaJourney 100K+ filers, MyImmiTracker, VisaGrader) — genuine info gain no scraper copies. Restyled-official-data sites are the commodity tier. GovWait's differentiators: (1) per-country static pages (real but copyable), (2) **historical time-series with deltas (uncopyable with time — THE moat)**.

**AI Overview pressure:** YMYL over-triggers AIOs; AIO presence compresses clicks. But volatile-number queries are the best case: users verify current numbers; AIO citations churn; freshness-signaling pages get cited. Long-tail per-country queries frequently have NO AIO and no official page — the entry point.

**Do:** adopt "[Program] Processing Time from [Country] — [Month Year]: [number]" titles (number in title, month token updated only when data changes); above-fold number/date/change/source; FAQ the 80% caveat; target long-tail first, concede head terms year one; ship the historical-trends layer as top product priority (information-gain defense + PR asset + only real moat); later consider a lightweight crowdsourced layer — the incumbents' moat for a reason.

## Hard truths / risks

1. **Launch profile matches Google's 2026 enforcement target** (~2K templated pages at once, zero-history domain, restating another site's data). What keeps it on the right side: per-page information gain (deltas, ranks, history) and an editorial layer. Restyled numbers alone ⇒ realistic outcome is 10–40% indexation and deindexing risk.
2. **Expect ~90 days of near-zero Google traffic regardless of execution.** Judge at day 120–180. Bing/ChatGPT visibility arrives first — treat as the early signal.
3. **"Programmatic SEO is dead" is false; "programmatic SEO on someone else's data is dying" is uncomfortably close to true.** Every documented survivor owns unique data. Yours accrues weekly as the snapshot archive grows — the trends layer is existential, not nice-to-have.
4. **AI search will eat a share of whatever you win.** Plan monetization around being THE source (reports, embeds, licensing, per-route email alerts — the natural product) rather than raw pageviews.
5. **llms.txt and schema are hygiene, not levers.** The real levers: Bing+IndexNow, internal-link modules, honest lastmod, monthly data-driven PR, one excellent methodology page.
6. **Vertical winners have moats you don't** (crowdsourced case data, news operations, RCIC trust signals, venture funding). A solo static site wins the long tail and the "cited data source" position — Boundless proved the playbook — but head terms are not winnable year one.

_(Full dated source list retained in the research transcript; load-bearing items: Search Engine Land crawl-budget guide Dec 2024; TheStacc case study May 2026; Surfer AI Citation Report Oct 2025; Profound citation patterns Aug 2025; Conbersa Bing-ChatGPT 2026; Rankability llms.txt tracker Aug 2026; SE Ranking Nov 2025; GEO paper Aggarwal et al. 2024; Originality.ai Mar 2024; Search Engine Roundtable May-June 2026 core-update confirmations; GoFarGlobal/Atlys SERP observations Aug 2026.)_
