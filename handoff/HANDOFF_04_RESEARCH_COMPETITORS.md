# HANDOFF 04 — Research: Competitors & Demand (August 2026)

_Research pass 2026-08-21/22 (sites fetched directly where possible; autocomplete pulled live; Reddit inferred — it blocks crawlers). Preamble maps findings to repo status._

## The single most important finding

**"Current IRCC numbers on a webpage" is already a free commodity.** At least six competitors serve it, several refreshing every 6 hours with zero monetization pressure (solo devs / open source): the official canada.ca tool, ircctracker.org (170+ countries, IRCC JSON, 6h refresh), ircc-tracker.app (open source), ircctrackerapp.com (40K+ downloads — shows official-data history but APP-ONLY), nextmigrant.com, ircctracker.ca. Plus CIC News (~250–520K visits/mo, owned by a law firm) publishing a prose article on EVERY weekly IRCC drop.

**Nobody on the open, indexable web shows the official time series.** The wedge — the ONLY wedge — is: history charts + provenance + deltas + alerts + API. GovWait is competitor #7 on "the number" and competitor #1 on "the record of the number." Execute only that.

## Competitor table (fetched/assessed Aug 21, 2026)

| Competitor | What they have | What they lack |
|---|---|---|
| canada.ca IRCC tool | The data, weekly, queue-position feature | History, per-country crawlable URLs, comparisons, API |
| ircctracker.org / ircc-tracker.app / nextmigrant | 6h-refresh current values, free | History, provenance display, API, monetization (= no pressure but no moat) |
| ircctrackerapp.com (mobile) | **Official-data history charts** — the only one | Indexable web pages (app-only) |
| cicnews.com | Weekly delta articles, big audience, law-firm funding | Permanent per-corridor URLs (articles decay), charts, archive |
| myimmitracker.com | 21,710-case crowdsourced Express Entry tracker; Similarweb #460K global | Official-data layer; their moat (lived timelines) is unassailable — don't compete there |
| ircc.com (exact-match domain!) | Corridor pages in 13 languages, ranks well | History charts (watch them — if they add history, the window closes) |
| UK: ilrtracker (£29.99/yr, "0 reports"), visamind (thin multi-country), law-firm blog armada | Nothing serious | UK is structurally weak for everyone (no per-country official data) |
| US wait-trackers (visawaits, plainvisa, visagrader, passportwaitingtime) | Saturated niche | Don't enter US consulate waits |
| Sherpa (joinsherpa.com) | B2B travel-requirements API, 2K+ sources, hourly | Proof the B2B-API model monetizes in adjacent bureaucracy-data |

## Demand mapping (live autocomplete, Aug 21 2026)

- **"after biometrics" appears in EVERY query family** → ✅ SHIPPED: biometrics FAQ on all CA pages. Roadmap: expand into stage-definition explainer guide.
- **"reddit" suffixes nearly every query** (distrust of official numbers) → bridge editorially: "published vs lived" framing (roadmap R5); never fake a community layer.
- Top corridors by autocomplete: India→CA (all permits), Nigeria/Ghana→CA (study/visitor), Pakistan→CA, USA→CA (visitor/work), Philippines→CA (work), super visa "for parents" (India), UK spouse (PK/IN/BD).
- Vocabulary: **"processing time"** is the head term (in titles ✅); "how long does X take" is the question form (answer-shaped H2s ✅); year-stamping is live demand (month-token titles ✅).
- Inland vs outland spousal sponsorship is a first-class query split — IRCC's country JSON doesn't carry it; the flpt-en.json PR file does carry PR-program-level data (see HANDOFF_05).

## SERP reality (checked queries, Aug 2026)

- "canada visitor visa processing time from india": top-5 = **contradictory content farms** (26 vs 52 vs 88 days on the same SERP) — no official page, no tracker. **The opening is trust: dated official figure + chart beats them all IF we can rank.**
- "canada study permit processing time pakistan": CIC News prose ×6 — a permanent corridor page with the weekly series as a chart is strictly better; their article decays, our URL compounds.
- "ircc processing time tracker": saturated with free tools — **don't chase tool-name head terms year one.**
- "uk spouse visa processing time 2026": wall-to-wall law-firm blogs quoting the same standards — weak gap; UK earns its keep via history + priority-service angles only.

## Top-20 priority routes (internal linking, guides, Request-Indexing quota)

1. CA visitor–India · 2. CA study–India · 3. CA visitor–USA · 4. CA study–Nigeria · 5. CA visitor–Nigeria · 6. CA visitor–Pakistan · 7. CA study–Pakistan · 8. CA work–India · 9. CA work–USA · 10. CA super visa–India · 11. CA sponsorship (outland)–India · 12. CA sponsorship (inland, all) · 13. CA study–Ghana · 14. CA visitor–Ghana · 15. CA work–Nigeria · 16. CA work–Philippines · 17. UK partner/spouse · 18. UK standard visitor · 19. CA study–UAE · 20. UK student + skilled worker.

Each should cross-link: sibling visa types same country; same visa comparable countries; the weekly-changes digest (once built, roadmap R3).

## Hard truths

1. Canada niche is under-differentiated, not underserved — ship ONLY the wedge (history/alerts/API/provenance).
2. The bare number is being eaten from above (AI Overviews + official tools) — monetize what surrounds it.
3. "After biometrics" demand is for data that doesn't officially exist — answer it honestly (shipped) or lose users to Reddit.
4. UK coverage is structurally window-dressing until decision-wait transparency data is added.
5. SEO hill: aged content-farm domains + exact-match ircc.com + CIC News. Fresh domain ranks in months via long-tail + linkable data assets only.
6. **Consumers won't pay** (ilrtracker: £29.99/yr, zero reports). Ads + affiliates first, B2B API second, consumer subscriptions never.
7. Ceiling check: category leader CIC News does ~250–520K visits/mo — this niche supports a good solo business, not a rocket; multi-country expansion raises the ceiling.
8. **Naming**: "GovWait" is clean (no brand/trademark conflicts found) but the Gov- prefix invites official-affiliation confusion — ✅ SHIPPED: "Independent — not affiliated with any government" in every footer. Defensive trademark check in CA/UK/US = cheap owner errand.
