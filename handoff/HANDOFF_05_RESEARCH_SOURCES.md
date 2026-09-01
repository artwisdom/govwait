# HANDOFF 05 — Research: Verified Next Data Sources (August 2026)

_Every source below was verified by actual fetch on 2026-08-21 with an honest bot UA
unless marked otherwise. Items 1–2 of the original build order were IMPLEMENTED the
same session (IRCC non-country + passports, UK in-UK + HMPO passport). Immigration
New Zealand was implemented and live-verified on 2026-08-23. IRCC's
forward-looking file was implemented on 2026-08-26 and production-verified on
2026-08-27. Norway was implemented and locally validated on 2026-08-30; deployment
was owner-approved on 2026-08-31 and awaits a production receipt. What remains to
build starts at Finland._

## Already implemented (for reference — done in pipeline)

- ✅ IRCC `data-ptime-non-country-en.json` (eTA "5 minutes", visitor-inside "12 days", extensions 64–419 days, IEC, SAWP, citizenship docs, PR cards, VoS). Same weekly stamp as main file.
- ✅ IRCC `data-passport-ptime.json` (BOM-prefixed, bilingual, HTML strings "up to **2 weeks**"; NO update stamp → unstamped/change-detection semantics in run.js).
- ✅ gov.uk `guidance/visa-processing-times-applications-inside-the-uk` (same table parser, footnote markers "12 months*" handled).
- ✅ gov.uk HMPO `about-our-services` ("usually get your passport within 3 weeks", public_updated_at stamp).

## Implemented after handoff

### N1. New Zealand — Immigration NZ JSON API ✅ implemented 2026-08-23
```
POST https://www.immigration.govt.nz/processing-time-api/v1/getTimeline/
Content-Type: multipart/form-data      field: visaID=<int>
→ {"Name":"Visitor Visa","Percent50":7,"Percent80":11,"AverageWait":"1 week","MostWaitTime":"2 weeks"}
```
- The current official page exposes the complete 133-entry ID→name selector. The collector parses that list and follows only listed IDs; it never enumerates numeric ranges.
- Percent50/Percent80 are official **working-day** counts for 50%/80% completion. They are stored as two entities per visa (`--p50`, `--p80`) sharing one human service page.
- robots.txt: API path not disallowed. Imperva/Incapsula present but served honest curl fine — keep fail-closed guard.
- 133 POSTs/run with 3s delay ≈ 6.7 min plus other sources. No update stamp in response → **unstamped/change-detection semantics**.
- Update cadence unknown/rolling (tool launched Mar 2026); weekly polling correct.
- Public release: all 266 entities in API/MCP; 25 reviewed visa pages + country hub + explainer = 27 new indexable pages. Future batches remain capped at 30.

### N2. Canada — IRCC `flpt-en.json` ✅ production-verified 2026-08-27

`https://www.canada.ca/content/dam/ircc/documents/json/flpt-en.json`

- Strictly mapped all 28 official programs, including CEC, FSW, PNP base/EE,
  AIP, caregivers, PGP Quebec/rest-of-Canada, QSW, spouses, refugees, and
  humanitarian categories. The current file contains 28 headline projections
  and 3,601 application-cohort rows.
- Corrected the original research shorthand: `wait-times` keys reaching back to
  2016 (and earlier for some citizenship rows) are **application submission
  cohorts in the current snapshot**, not a publication archive. `snapshot_date`
  and `cohort_month` remain separate everywhere.
- Stored projections in a distinct append-only `forward_estimates` table and
  labeled every entity with `metric_type=forward`. Queue totals and people-ahead
  values remain attached to their exact snapshot; none are silently mixed with
  backward-looking completion times, service standards, or percentiles.
- All 28 programs and 3,629 rows are available in the production API/MCP layer.
  The first public-facing wave is deliberately limited to 12 reviewed,
  high-interest pages, with current-cohort charts and explicit methodology copy.
- Validation floors: 28 headline projections, 3,500 cohort rows, 62-day
  staleness. Strict schema drift fails loudly. `MAX_DAYS=5000` is justified only
  by the official “More than 10 years” lower-bound value.
- Production acceptance: pipeline tests 7/7; validation 23 checks; 2,082-page build;
  615/615 SEO-sitemap gate; 2,572-file API conformance; MCP and visual checks
  green. Commit `5d5f0a9` deployed in run `33127083764`; all 12 pages, the API,
  OpenAPI, `llms.txt`, crawler/canonical behavior, and 615 unique sitemap URLs
  passed live checks. IndexNow accepted 621 changed URLs with HTTP 200.

### N3. Norway — UDI ✅ local deployment candidate 2026-08-30

- Uses five complete server-rendered table pages linked from UDI's waiting-time
  hub: permanent residence, visitor visas, EU/EEA and Brexit residence, expulsion
  and entry-ban lifting, and other cases.
- Strictly maps 19 official rows. Unknown, missing, or duplicate rows, a changed
  table count, or a missing official update date stops publication.
- Current live refresh returned 19/19 rows, all with UDI's `27 August 2026` update
  stamp. UDI states a monthly update pattern; the validation window is 45 days.
- Published ranges are preserved exactly (`15–29 days`) and normalized by their
  upper endpoint only for conservative comparisons. User-facing pages explain the
  range and that UDI's figures are planning guides, not individual guarantees.
- Personalised question-and-answer guides for family, work, study, citizenship,
  and similar routes are intentionally excluded. The collector does not guess
  selections, enumerate hidden parameters, or transmit personal information.
- No explicit UDI page-reuse licence was located. The implementation stores only
  factual values, supplies clear agency attribution and official source links, and
  does not reproduce page prose.
- Candidate acceptance: 2,318 entities / 9 sources / 4 governments; 2,104 HTML;
  635/635 SEO-sitemap; 2,611-file API conformance; parser tests 12/12; validation
  25 checks; MCP, responsive browser QA, and a 635-URL IndexNow dry run green.
  This is local evidence only; Norway is not deployed or submitted for discovery.

## NEXT UP: remaining verified build order

### N4. Finland — Migri (medium HTML-table, ~2h)
`https://migri.fi/en/processing-times` — **127 uniform tables** (most/minority/max-by-law × electronic/paper). Verified: employed person 1/2/2 months; citizenship 35 months. Stated cadence: **every 2 months**. ⚠️ robots has `crawl-delay: 5` — bump the per-host delay to 5s for this host (fetcher currently does 3s globally; make it per-host configurable).

### N5. Sweden — Migrationsverket (medium HTML-table, ~2h)
`https://www.migrationsverket.se/en/contact-us/waiting-times.html` — 12 server-rendered tables (verified: partner 14 months first-time / 6 extension; citizenship adults 54 months — running national scandal = PR hook: 103,146 open cases). Semantics: **75% of last-12-months cases**. Monthly. ⚠️ Anchor parsing on section HEADINGS, not `svid…` ids (volatile). No JSON endpoint exists (legacy tool retired).

### N6. Denmark — nyidanmark.dk (medium HTML, ~2h)
Two pages: SIRI (work/study; researcher 1 month, council referral 3 months) + Immigration Service `us-times` (family 10/12/16 months, asylum 3–8). "Service goals" = expected MAXIMUMS — label distinctly. No robots.txt (default allow). Mild connection flakiness observed; curl fine.

### N7. Netherlands — IND (medium HTML, ~2h)
`https://ind.nl/en/after-your-application/decision-periods` — 20+ accordion types (sponsor recognition 3 months, HSM 90 days, naturalisation 1 year, employer change 45 days new standard May 22 2026). ⚠️ Mostly STATUTORY periods, not live stats — label as such (`confidence` or naming). Page stamps "Last update: 21 August 2026".

## Blocked / dead ends (do not retry politely-blocked hosts)

- **NZ passports**: passports.govt.nz = Cloudflare challenge on everything incl. robots.txt; DIA dashboard = embedded Power BI. Manual/owner only.
- **USCIS Torch API: has NO processing-times API** — only Case Status (per-receipt-number, OAuth) + FOIA. The processing-times numbers live solely behind the WAF'd egov.uscis.gov. **Correct earlier docs: the US gap has no official API route today.** Owner option: manual weekly entry, or skip US entirely.
- Known WAF walls (unchanged): travel.state.gov, egov.uscis.gov, ireland.ie, immi.homeaffairs.gov.au. Re-check quarterly by hand in a browser.

## Enrichment (later, one-liners)

EU Schengen consulate statistics (annual XLSX — volumes/refusal rates, not times); Norway UNE appeals times (une.no); NZ INZ monthly percent-within-target performance stats (QA cross-check for N1); Norway Skatteetaten civil-registry times (adjacent vertical).

## Revised build order for Codex

| # | Source | Effort | Payoff |
|---|---|---|---|
| 1 | Norway UDI | Built; deploy gate | 4th government, monthly cadence |
| 2 | Finland Migri | ~2h | 5th government (respect crawl-delay 5) |
| 3 | Sweden | ~2h | 6th + citizenship-backlog PR hook |
| 4 | Denmark | ~2h | 7th |
| 5 | Netherlands | ~2h | 8th (label statutory semantics) |

Every addition: source module + MAP + coverage floor + staleness window + JURISDICTIONS entry + 25–30 pages/week rollout + runbook playbook entry.
