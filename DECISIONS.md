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
14. Astro 5 requires Node ≥22.12 (this Mac has 20.19); used Astro 4.16 rather than installing a runtime — brief permits the fallback, rules forbid global installs.
15. SQLite via the system sqlite3 CLI (`-json`) instead of better-sqlite3 — zero npm deps in the pipeline, no native-compile risk; MCP server reads JSON exports, never the DB.
16. db.sqlite is committed to git (source of truth must persist across CI runs for history to compound); WAL side files ignored.
17. Ad slots render as HTML comments only — zero layout shift and zero placeholder pixels until a network is approved.
18. Site brand kept as working title "GovWait" with reserved-TLD placeholder origin govwait.example; deploy workflow rewrites it from the SITE_URL repo variable.
19. Refresh cron set to Tue+Fri 14:00 UTC — matches observed IRCC republish cadence with margin, at ~35 min/month of the 2,000-min free tier.
20. Did not kill the 3 node listeners found during QA — all predate this session and belong to other projects (verified via lsof cwd + start time); killing them would have violated sandbox containment.
21. Validation MAX_DAYS raised 1500→3000 after a legitimate official value ("58 months", refugee resettlement from TZ) tripped the first run — documented in-code with the observed value.
22. Owner authorized go-live (repo artwisdom/govwait public, Pages + custom domain govwait.com, refresh cron active); domain purchase + DNS remain owner steps.
23. Post-launch research round (4 parallel agents) corrected the monetization plan: Ezoic path obsolete (250K min since Feb 2026) → Mediavine Journey at 1K sessions; Raptive 25K PVs but ≥50% tier-1 geo gate; docs updated.
24. USCIS developer portal verified to have NO processing-times API — corrected earlier docs that implied Torch was a US data route.
25. Added 4 sources same session (IRCC non-country + CA passports + UK in-UK + UK passport) after fetch-verifying shapes; 2,005 routes total. NZ JSON API + IRCC flpt (history to 2016) specified for Codex in handoff.
26. Unstamped-source semantics introduced (ircc-passport): insert only on value change, effective_date = first-observed date — keeps history honest when a source publishes no update stamp.
27. Handoff package for Codex written to /handoff (7 files); Codex owns day-to-day from here per owner's tooling preference.
