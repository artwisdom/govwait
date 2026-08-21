# NICHE DECISION — Phase 2

_Scored 2026-08-21 against the mission rubric (max 39; require ≥27 with zero kill flags). Kill thresholds: Volatility ≤1, Structure ≤2, AI-failure ≤2, Incumbent gap ≤1, Source viability ≤2, Automation = 0._

## Scoring table (10 candidates scored seriously; 12 more killed on sight in RESEARCH_LOG §2)

| Candidate | Volat. /5 | Struct. /5 | Audience /5 | AI-fail /5 | Incumb. gap /5 | Sources /5 | Machine /3 | Monetiz. /3 | Automat. /3 | **Total /39** | Kill flags |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **1. Gov processing & wait times** | 5 | 5 | 5 | 5 | 4 | 4 | 3 | 3 | 3 | **37** | **none** |
| 15. Cloud GPU price index | 4 | 5 | 2 | 4 | 2 | 2 | 3 | 3 | 2 | 27 | ⚠️ Sources=2 (vendor JS pages/ToS) → **KILL** |
| 13. Central-bank & deposit rates | 4 | 5 | 4 | 2 | 1 | 4 | 3 | 2 | 3 | 28 | Incumbent=1, AI-fail=2 → **KILL** |
| 4. Remittance corridor fees | 3 | 5 | 5 | 3 | 1 | 4 | 2 | 2 | 2 | 27 | Incumbent=1 → **KILL** (World Bank RPW) |
| 2. Prepaid mobile data prices | 4 | 5 | 5 | 3 | 1 | 3 | 2 | 2 | 1 | 26 | Incumbent=1 → **KILL** (Cable.co.uk/esimdb) |
| 6. Exam calendars (IN/NG/ID/PK/BD) | 4 | 4 | 5 | 3 | 1 | 3 | 1 | 0 | 1 | 22 | Incumbent=1 → **KILL** |
| 14. Public transit fares by city | 2 | 4 | 5 | 4 | 3 | 2 | 2 | 2 | 1 | 25 | Sources=2 → **KILL** (hundreds of agency sites, no common structure) |
| 3. Electricity tariffs by utility | 2 | 5 | 5 | 4 | 3 | 2 | 2 | 2 | 0 | 25 | Automation=0 → **KILL** |
| 19. Student-visa financial thresholds | 2 | 5 | 4 | 4 | 4 | 4 | 2 | 2 | 2 | 29 | none — but Volatility=2 is weak; annual cadence undermines the "freshness" moat |
| 17. Mobile-money fee schedules | 3 | 4 | 4 | 4 | 3 | 2 | 2 | 1 | 1 | 24 | Sources=2 → **KILL** (operator pages WAF'd/JS-heavy) |

## Winner: Government processing & wait times — 37/39, zero kill flags

**Working name: “GovWait” — canonical dataset of official government processing times (visas, passports, permits, citizenship), tracked with history.**

Plain-English rationale:

1. **It moves weekly, and the movement is the product.** IRCC re-publishes every ~week (verified: data stamped Aug 19, retrieved Aug 21). Official pages show only the current value — the *history* nobody keeps is our proprietary asset from day one, and it compounds: every week of operation creates data that cannot be backfilled by any competitor.
2. **LLMs fail at it measurably.** 7/10 error rate in our own blind test. These are high-stakes queries (people book flights, quit jobs, and schedule weddings around these numbers) where a 2× wrong answer genuinely hurts — exactly the query class that keeps flowing to a trustworthy reference site in the AI era.
3. **The incumbent gap is real and specific.** Per-country official tools exist (they are our sources, not competitors). Thin US-only visa-wait dashboards exist. Nobody offers: cross-government coverage + time-series history + comparison + a documented API/MCP. That layer is the moat.
4. **Sources are official, permitted, and machine-readable.** Two verified this session (IRCC JSON with 1,915 values; gov.uk Content API), five more robots-permitted (NZ ×2, SE, NL, DK). Full refresh is pure HTTP + parsing — no manual entry.
5. **Monetization is credible on the human side** (immigration is a high-CPC vertical with tier-1 traffic) and the machine side is a natural fit (agents planning travel/relocation need current values, and our AI-failure test proves they can't trust their weights).

Honest weaknesses (carried into RISK_REGISTER): the four biggest anglophone demand magnets after CA/UK — US, AU, IE — hard-block honest bots today (403 walls), so v1 launches without them; coverage expansion is an owner-decision item (official USCIS API signup, manual weekly entry, or partnerships). Incumbent-gap score of 4 not 5 because the US-slice dashboards could pivot global, and governments could someday publish histories themselves.

## Runner-up (documented fallback): Student-visa financial-proof thresholds — 29/39, no kills

Same sources, same audience, same pipeline skeleton (official immigration pages → numeric thresholds with effective dates). Survives the rubric but with Volatility=2: values change ~annually, so the freshness moat is thinner and a static incumbent could catch up. If GovWait's sources close their doors (mass WAF adoption), this is the pivot: the crawler, schema, site, and MCP server all transfer nearly unchanged. **Not built this session.**

## Kill summary for the rejects

- **Killed on incumbents**: mobile data (Cable.co.uk canonical), remittances (World Bank RPW, CC-BY, quarterly, active), central-bank rates (global-rates/BIS/UniRateAPI), exam calendars (Careers360/JagranJosh class), fuel (GlobalPetrolPrices), eSIM (esimdb), visa-requirement matrices (Passport Index/Timatic), LLM pricing (OpenRouter), air quality (IQAir/WAQI), FX (everyone).
- **Killed on source viability/automation**: electricity tariffs at utility level (hundreds of unstructured PDFs), transit fares (same shape), mobile-money fees (operator WAFs), cloud GPU (vendor ToS/JS walls + near-kill incumbent gap), toll rates, postal matrices (annual PDFs).
- **Killed on volatility**: government service *fees* (annual), minimum wages (annual, plus WageIndicator), tourist taxes (annual), baggage fees (occasional + airline WAFs).
