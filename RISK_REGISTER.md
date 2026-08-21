# RISK REGISTER — honest version

## Base rates first (read before any projection)
- **Most projects of this class earn ~$0.** The modal outcome for a new content/data site is abandonment before meaningful traffic.
- Realistic base case **if maintained**: $500–$3,000/month at months 12–18, ad-monetized, contingent on reaching roughly six-figure monthly pageviews in tier-1-heavy geos.
- **Machine-side revenue (API/MCP/pay-per-crawl) is unproven for solo operators in 2026.** It is free optionality on work already done — never the plan.
- Licensing to AI companies is a lottery ticket. Documented, not built.

## Risks, likelihood, and responses

| # | Risk | Likelihood | Impact | Response |
|---|---|---|---|---|
| 1 | **SEO cold start**: Google ignores a new domain for months; "processing times" SERPs favor official .gov pages for head terms | HIGH | HIGH | The long tail is the strategy (1,900+ specific route pages official sites don't have as standalone URLs, e.g. "canada work permit from mexico"). Freshness stamps + history are content Google can't get from the agencies. Expect ~0 traffic for 3–6 months; that is normal, not failure. |
| 2 | **Source closes its doors** (WAF like the US/AU/IE ones, or robots change) | MEDIUM (it already happened to 4 candidate sources) | HIGH | Fail-closed pipeline turns this into a red X, never bad data. Playbooks in runbook; 5 verified replacement sources queued; runner-up niche shares the entire stack if catastrophic. |
| 3 | **IRCC/gov.uk restructure their data** (new JSON shape, moved page) | MEDIUM/yearly | MEDIUM | Validation catches it (coverage floors, unparseable=fail); fix is a source-module edit, ~30–60 min via runbook playbook. |
| 4 | **AI Overviews / chatbots absorb the queries** | MEDIUM-HIGH | MEDIUM | Double-edged: they absorb head queries but need fresh data — that is the machine skin (MCP, API, llms.txt, eventual pay-per-crawl). Our own test showed 7/10 LLM answers wrong on these values; the moat is being the source they cite/query. |
| 5 | **An incumbent pivots** (a US-visa-wait tracker goes global, or a govtech startup) | MEDIUM | MEDIUM | Our compounding history archive cannot be backfilled by a late entrant; ship weekly, expand sources steadily. |
| 6 | **Platform dependency**: GitHub Actions/Pages free tiers change | LOW | MEDIUM | Entire stack is static + zero-dependency Node; portable to any CI + CDN in an afternoon (Cloudflare alternative already documented). |
| 7 | **Legal/ToS complaint from a government** | LOW | MEDIUM | Factual values with attribution, polite honest crawling, robots obeyed, extracted values only (no content). Canada's non-commercial reproduction terms flagged in source metadata — owner should skim IRCC terms before heavy commercialization (noted in About page methodology and source license_note). Takedown response: remove source, keep history dark. |
| 8 | **Owner time starvation** (the real #1 killer) | HIGH | HIGH | Steady-state is designed <1 hr/week with loud failures only. The pivot thresholds below prevent zombie-project drift. |
| 9 | **Ad approval friction** (Ezoic/Mediavine reject thin-looking programmatic pages) | MEDIUM | MEDIUM | Pages carry unique data + history tables + original prose; add editorial guides (top corridors) before applying if rejected once. |

## Pivot thresholds (decide with numbers, not feelings)
- **<10K monthly sessions by month 6** (with refreshes running and 4+ sources live): change **niche**, not features — the stack transfers to the runner-up (student-visa financial thresholds) nearly unchanged. Do not spend month 7 polishing CSS.
- **Any paying API/agent caller, ever**: invest in the machine skin immediately (paid tier, SLAs, more sources) — it is the stronger moat if real demand shows.
- **A source-closure cascade** (≥2 of CA/UK lost with no replacement inside 90 days): execute the runner-up pivot.
- **Month 12 with <$100/mo revenue but >50K sessions**: monetization problem, not product — switch ad networks / add licensing outreach before touching the niche.
