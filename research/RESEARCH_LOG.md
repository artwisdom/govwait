# RESEARCH LOG — Phase 1 Independent Research Round

_All research conducted 2026-08-21. Evidence labels: **[V]** = verified this session (fetched/observed), **[C]** = vendor/community claim found in search results, **[I]** = my inference from training knowledge (flagged, not treated as fact)._

---

## 1. Candidate generation (22 candidates)

Seeds from the brief are marked (S). My own additions are unmarked.

| # | Candidate | One-line thesis fit |
|---|---|---|
| 1 | **Government processing & wait times** (passports, visas, permits, citizenship) | Weekly-changing numeric values, global demand, official sources publish current-value-only |
| 2 | (S) Prepaid mobile/data plan prices by country-carrier | Volatile, structured, global |
| 3 | (S) Electricity tariffs by utility | Structured, semi-annual changes |
| 4 | (S) Remittance corridor fees | Quarterly, structured, global |
| 5 | (S) Visa/entry-requirement matrices | Structured, changes weekly somewhere |
| 6 | (S) National exam calendars & results windows (IN/NG/ID/PK/BD) | Date-typed, seasonal-volatile, huge audiences |
| 7 | (S) Government service fees (passport/ID/license) by jurisdiction | Structured, but changes ~annually |
| 8 | (S) Fuel/LPG city prices | Weekly-volatile, structured |
| 9 | (S) eSIM availability & pricing by country | Volatile, structured |
| 10 | (S) Minimum wages with effective dates | Structured, annual changes |
| 11 | (S) International parcel/postal rate matrices | Structured, annual changes |
| 12 | (S) Toll rates by route | Structured, fragmented |
| 13 | (S) Central-bank policy & retail deposit rates | Volatile, structured |
| 14 | Public transit fares by city (single/day/monthly) | Structured, global, changes annually per city |
| 15 | Cloud GPU on-demand/spot price index | Highly volatile, structured, dev audience |
| 16 | LLM API pricing per model/provider | Volatile, structured, dev audience |
| 17 | Mobile-money & P2P transfer fee schedules (M-Pesa, GCash, bKash…) | Structured, emerging-market demand |
| 18 | Tourist/city taxes by destination | Structured, annual changes |
| 19 | Student-visa financial-proof thresholds by country | Structured, annual changes, high-stakes queries |
| 20 | Airline baggage-fee matrices | Structured, occasional changes |
| 21 | Air-quality live indices | Volatile, structured |
| 22 | Currency exchange rates | Maximally volatile, structured |

## 2. Incumbent scan (shortlist)

| Candidate | Incumbents found | Verdict |
|---|---|---|
| Gov processing times | **No global cross-government structured DB exists.** [V] Search for "global passport processing times tracker" surfaced only per-country official pages and one US crowd-tracker (passportwaitingtime.com). For the US-visa-wait sub-slice only: visawaits.com, plainvisa.com/wait-times, visagrader.com, getsnaptool.com — thin single-source dashboards scraping travel.state.gov, no history, no API, no multi-government coverage [V]. visawhen.com covers US visa waits only [C]. Blog-style "guides" (eammu.com, opaige.com, passportagents.in) are unstructured content marketing [V]. | **OPPORTUNITY** — gap is the *cross-government, historized, machine-readable* layer |
| Prepaid mobile data prices | Cable.co.uk Worldwide Mobile Data Pricing: 5,603 plans, 237 countries, annual, widely cited (Statista, Forbes, Mappr all republish it) [V]. esimdb for live eSIM prices [I, well-known]. | **KILL** — canonical incumbent |
| Electricity tariffs | Country-level: globalelectricity.org, onul.works, IEA Energy Prices (150 countries, paywalled granular) [V]. US utility-level: OpenEI URDB (official, open) [V]. RateAcuity (commercial, US/CA) [V]. Utility-level *global* has no incumbent — but see source audit: automation infeasible. | KILL (viability, see §4) |
| Remittance fees | World Bank Remittance Prices Worldwide: 377 corridors, quarterly, CC-BY-4.0, last updated 2026-05-05, active [V]. Plus commercial comparators (Monito, Wise) [I]. | **KILL** — official well-maintained incumbent |
| Visa-requirement matrices | Passport Index, VisaGuide, Sherpa, IATA Timatic, Wikipedia matrices [I, well-known]. | **KILL** — crowded |
| Exam calendars | Careers360, JagranJosh, Shiksha (India); numerous WAEC/JAMB portals (Nigeria) — fast, aggressive, well-staffed content incumbents [I, well-known]. | **KILL** — incumbent + monetization (see §6) |
| Central-bank rates | global-rates.com (current + historical, maintained), Wikipedia list, UniRateAPI (30 banks + API), BIS official [V]. | **KILL** — multiple maintained incumbents incl. an API |
| Fuel/LPG prices | GlobalPetrolPrices.com — weekly, ~150 countries, licensed data business [I, well-known; corroborated by search ecosystem]. | **KILL** |
| Cloud GPU prices | cloud-gpus.com, getdeploying.com, and per-vendor calculators exist; maintained but none canonical [I]. | Weak opportunity — scored in Phase 2 |
| LLM API pricing | OpenRouter (live, canonical for routed models), llm-price trackers [I, well-known]. | **KILL** |

## 3. Demand proxies — winner track (gov processing times)

- **Media re-reports every value change**: Fox News, AOL/HuffPost, AFAR, The Points Guy, Duke Global, congressional press releases all published stories specifically about US passport processing-time changes (6-8wk → 4-6wk era) [V — search results 2026-08-21]. National news covering a *number changing* is a top-tier demand proxy.
- **Third-party trackers exist for the US slice alone** (visawaits, plainvisa, visagrader, snaptool, passportwaitingtime) — multiple independent builders found it worth building; none went global or multi-agency [V].
- **Communities built entirely on crowd-tracking this data**: Trackitt, VisaJourney, CanadaVisa forums, r/ImmigrationCanada, r/USCIS — decades of "how long did yours take" threads [I — well-established, not re-verified today].
- **Official tools are current-value-only**: IRCC shows this week's number with no history, no cross-country comparison, no API documentation [V]. gov.uk table is prose-embedded [V].
- Grade: **HIGH** (volume evidence strong; tier-1 heavy: US/UK/CA/AU/NZ/EU applicants, sponsors, and their families).

## 4. Source audit (robots.txt + sample fetches, 2026-08-21, UA `DataMoatEngineBot/0.1`)

| Host | robots.txt | Data page fetch | Verdict |
|---|---|---|---|
| www.canada.ca (IRCC) | **200** — processing-time paths allowed (only specific CRA/IRCC PDFs + search disallowed) | `/content/dam/ircc/documents/json/data-ptime-en.json` → **200, 65KB structured JSON, 1,915 leaf values** across 8 categories (visitor per-country ×~190, supervisa, study, work, dependents, refugees). `lastupdated: "August 19, 2026"` — 2 days before retrieval → **weekly cadence confirmed** | ✅ **PRIMARY SOURCE** |
| www.gov.uk | **200** — allow-all except print/search; official **Content API** exists | `/api/content/guidance/visa-processing-times-applications-outside-the-uk` → **200, 23.6KB JSON**, `public_updated_at: 2026-06-26`, body contains clean category→time tables ("Standard Visitor 3 weeks", "Partner or spouse 12 weeks"…) | ✅ **PRIMARY SOURCE** |
| www.immigration.govt.nz | **200** — allows all content paths | Sitemap referenced; processing-time pages HTML | ✅ viable (parse in Phase 3) |
| www.dia.govt.nz (NZ passports) | **200** — allows content (disallows PDFs/search) | — | ✅ viable |
| www.migrationsverket.se (SE) | **200** — content allowed | — | ✅ viable |
| ind.nl (NL) | **200** — standard Drupal, content allowed | — | ✅ viable |
| www.nyidanmark.dk (DK) | **404** (no robots file → crawling permitted by convention) | — | ✅ viable |
| travel.state.gov (US) | **403** — Cloudflare challenge, blocks bot UA *and* browser-UA curl | n/a | ❌ **DEAD to honest automation** |
| egov.uscis.gov (US) | **403** — same Cloudflare wall | n/a | ❌ DEAD (USCIS Torch API exists but requires account signup → owner step, documented) |
| www.ireland.ie (IE) | **403** — CloudFront denies | n/a | ❌ DEAD |
| immi.homeaffairs.gov.au (AU) | **403** — Akamai denies | n/a | ❌ DEAD |

Note: WebFetch proxy was also 403'd by the gov CDNs; direct polite curl from this machine distinguished UA/WAF blocks from true robots policy. Blocked sources are **excluded** — no UA spoofing, no workarounds. US/AU/IE coverage becomes an owner-decision item (manual weekly entry or official APIs where they exist) — documented in DEPLOYMENT_GUIDE.

Electricity-tariff automation check (for candidate #3): utility-level global coverage would require parsing hundreds of utility PDFs with no common schema — fails "full refresh automatable" on inspection; not pursued further.

## 5. AI-failure test (winner track)

Method: 10 realistic queries answered from model training knowledge **without searching**, then checked against live official values retrieved 2026-08-21 (IRCC JSON last updated 2026-08-19; gov.uk updated 2026-06-26).

| # | Query | My no-search answer | Live official value | Verdict |
|---|---|---|---|---|
| 1 | Canada visitor visa from India | ~60 days | **31 days** | ❌ WRONG (2× off) |
| 2 | Canada visitor visa from Nigeria | ~90–100+ days | **76 days** | ❌ STALE |
| 3 | Canada visitor visa from Philippines | ~30–45 days | **21 days** | ❌ WRONG |
| 4 | UK Standard Visitor visa | 3 weeks | **3 weeks** | ✅ correct (stable service standard) |
| 5 | UK partner/spouse visa (outside UK) | 12 weeks | **12 weeks** | ✅ correct (stable) |
| 6 | Canada study permit from Pakistan | 8–10 weeks | **7 weeks** | ⚠️ borderline stale |
| 7 | US passport routine | "6–8 weeks" (training-era) | 4–6 weeks [V via news] | ❌ STALE (value changed ≥3× since 2023) |
| 8 | Canada super visa from India | ~100 days | **56 days** | ❌ WRONG (2× off) |
| 9 | Canada work permit (outside) from Mexico | ~10 weeks | **3 weeks** | ❌ WRONG (3× off) |
| 10 | Canada visitor visa from China | ~45–60 days | **32 days** | ❌ WRONG |

**Error/stale rate: 7 of 10** (correct only on the two values that are fixed service standards rather than live queue measurements). This is the ideal profile: LLMs systematically fail on exactly the volatile per-country values users care about, because the values move weekly and training data freezes them.

## 6. Monetization sanity

- **Geography**: applicants to CA/UK/NZ/SE/NL/DK visas come from everywhere, but a large share of searches originate in tier-1 countries (sponsors, employers, universities, family members in US/UK/CA/AU) → viable ad RPMs. Immigration services is a historically high-CPC vertical (lawyers, expedited services, insurance).
- **Machine-query plausibility**: travel/relocation platforms, immigration-law tech, and AI travel agents all need "how long will X take right now" → plausible API/MCP consumers. Unproven revenue (per thesis, treat as optionality).
- **Regulatory sensitivity**: factual government-published reference values; not legal advice. Mitigation: per-page disclaimer + provenance display. No medical/financial adjacency.
- Exam-calendar candidate (#6) failed here: audience overwhelmingly in lowest-RPM ad geos and incumbents are entrenched — logged as the reason it was killed despite huge volume.

## 7. Injection attempts observed

None. All fetched pages were mechanically parsed (robots files, JSON endpoints, one API content body). No text addressed to AI agents was observed in any fetched content this session.
