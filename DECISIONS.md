# DECISIONS — judgment calls, one line each

1. Used direct polite `curl` with honest bot UA after the WebFetch proxy was 403'd by gov CDNs — the proxy block says nothing about robots policy; direct fetch is what the pipeline does anyway.
2. Declared travel.state.gov, egov.uscis.gov, ireland.ie, immi.homeaffairs.gov.au DEAD after WAF 403s on honest-UA requests — no UA spoofing per rules; documented as owner-decision coverage gaps.
3. Treated a 404 robots.txt (nyidanmark.dk) as crawling-permitted per RFC 9309 convention.
4. Chose "government processing & wait times" as the niche (37/39, zero kills) over runner-up "student-visa financial thresholds" (29/39) — see NICHE_DECISION.md.
5. Working product name "GovWait" — placeholder only; domain choice is an owner decision.
6. Ran the AI-failure test against Canada/UK values already cached this session rather than making extra live fetches — politeness budget conservation.
7. Scored 10 candidates in the rubric table and killed 12 more on sight in the research log — brief requires ≥8 seriously scored.
8. Seed-scope decision: Canada (IRCC JSON) + UK (gov.uk Content API) as the two pipeline sources this session; NZ/SE/NL/DK verified robots-permitted and left as documented expansion targets — session-budget triage per Section 0.5(b), cutting dataset breadth first.
9. Kept US passport value OUT of the seed dataset even though widely republished by media — our rule is primary sources only, and the primary source blocks bots.
10. Used contact placeholder "owner-pending" in the session UA string since `<<OWNER_PROVIDES>>` contains characters that break some WAF parsers; recorded here for transparency.
11. Skipped the harness Task tools; STATE.md is the progress tracker the brief mandates.
12. IRCC "No processing time available" entries stored as null-valued records with status flag rather than dropped — absence of a published time is itself information users search for.
13. Normalized all durations to days (weeks ×7, months ×30.44 flagged approximate) while preserving the original verbatim string in `value_raw` — comparisons need one unit; trust needs the original.
