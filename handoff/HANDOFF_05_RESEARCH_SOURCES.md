# HANDOFF 05 — Research: Verified Next Data Sources (August 2026)

_Every source below was verified by actual fetch on 2026-08-21 with an honest bot UA
unless marked otherwise. Items 1–2 of the original build order were IMPLEMENTED the
same session (IRCC non-country + passports, UK in-UK + HMPO passport). Immigration
New Zealand was implemented and live-verified on 2026-08-23. What remains starts
at IRCC flpt._

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

## NEXT UP: remaining verified build order

### N2. Canada — `flpt-en.json` PR programs WITH HISTORY BACK TO 2016 (easy-JSON but schema thought needed, ~3h)
`https://www.canada.ca/content/dam/ircc/documents/json/flpt-en.json` (504KB, monthly, `flpt_lastupdated` "August 10, 2026")
- Programs: CEC, FSW, PNP (base+EE), AIP, caregivers, PGP (Quebec/RoC), QSW, refugees, humanitarian.
- Keys: `current-flpt` (e.g. cec "6 months" — FORWARD-looking), `total-people` ("About 59,700 people waiting"), `people-ahead`, and **`wait-times` history keyed `program-YYYY/MM` back to 2016**.
- ⚠️ Semantics differ from the ptime files: forward-looking projections + queue sizes, not backward statistics. **Do not mix silently**: either a `metric_type` column ('backward'|'forward'|'queue') or a distinct service naming ("Express Entry CEC (projected wait)"). Importing the history series gives INSTANT multi-year depth for PR programs — the single biggest moat accelerator available. Queue counts ("people waiting") are a second metric worth storing (great chart + PR material).
- Spousal inland/outland PR sponsorship (top-12 demand query) likely lives here or in a sibling file — inspect all keys during implementation.

### N3. Norway — UDI (easy-medium HTML, ~2h)
`https://www.udi.no/en/waiting-time/` hub → 6 server-rendered subpages (citizenship, permanent-residence 24/25/6 months verified, visitor-visa, EU/EEA, expulsion, other). Monthly updates (stated). robots: only /Util/ disallowed. Bonus: query-param "guide" pages server-render answers (`…for-study-permits/?gs=2` → "6 months").

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
| 1 | IRCC flpt (PR + history to 2016) | ~3h | **Instant 10-year history for PR programs — biggest moat accelerator** |
| 2 | Norway UDI | ~2h | 4th government, monthly cadence |
| 3 | Finland Migri | ~2h | 5th government (respect crawl-delay 5) |
| 4 | Sweden | ~2h | 6th + citizenship-backlog PR hook |
| 5 | Denmark | ~2h | 7th |
| 6 | Netherlands | ~2h | 8th (label statutory semantics) |

Every addition: source module + MAP + coverage floor + staleness window + JURISDICTIONS entry + 25–30 pages/week rollout + runbook playbook entry.
