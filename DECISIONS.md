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
19. Refresh cron set to Tue+Fri 14:00 UTC — matches observed IRCC republish cadence with margin; the seed scope cost ~35 min/month (the 2026-08-23 INZ addition raises the current estimate to ~65 min/month, still within the 2,000-min free tier).
20. Did not kill the 3 node listeners found during QA — all predate this session and belong to other projects (verified via lsof cwd + start time); killing them would have violated sandbox containment.
21. Validation MAX_DAYS raised 1500→3000 after a legitimate official value ("58 months", refugee resettlement from TZ) tripped the first run — documented in-code with the observed value.
22. Owner authorized go-live (repo artwisdom/govwait public, Pages + custom domain govwait.com, refresh cron active); domain purchase + DNS remain owner steps.
23. Post-launch research round (4 parallel agents) corrected the monetization plan: Ezoic path obsolete (250K min since Feb 2026) → Mediavine Journey at 1K sessions; Raptive 25K PVs but ≥50% tier-1 geo gate; docs updated.
24. USCIS developer portal verified to have NO processing-times API — corrected earlier docs that implied Torch was a US data route.
25. Added 4 sources same session (IRCC non-country + CA passports + UK in-UK + UK passport) after fetch-verifying shapes; 2,005 routes total. NZ JSON API + IRCC flpt (history to 2016) specified for Codex in handoff.
26. Unstamped-source semantics introduced (ircc-passport): insert only on value change, effective_date = first-observed date — keeps history honest when a source publishes no update stamp.
27. Handoff package for Codex written to /handoff (7 files); Codex owns day-to-day from here per owner's tooling preference.
28. Added Immigration New Zealand on 2026-08-23 from the official page's complete 133-entry visa selector plus its public timeline API; never enumerate or guess IDs.
29. Stored INZ's 50% and 80% measures as two append-only entities sharing one human service page; this preserves machine precision without publishing duplicate landing pages.
30. Preserved INZ values as official working-day counts (`unit_original='working days'`) rather than inventing calendar-day conversions; the source supplies no update stamp, so dates use first-observed change semantics.
31. Released 25 reviewed NZ visa pages plus one country hub and one explainer (27 new indexable pages) while exposing all 266 metric entities in the API/MCP layer; future human-page batches remain capped at 30.
32. Added entity activation state: a route removed from a current official source stops appearing as current, while its observations remain append-only in SQLite.
33. Shipped the first post-launch editorial/trust foundation as 9 additional source-backed corridor/route guides, 3 jurisdiction reports plus a report hub, an organizational Research Desk byline, editorial policy, corrections/contact/privacy/terms pages, and Article/Breadcrumb structured data; this improves reviewability but is not evidence of search demand or ad approval.
34. Reports state “baseline only” until history contains a later differing official value; a successful refresh with the same value does not become a fabricated trend, change, or fresh `lastmod`.
35. Added GA4 with the basic consent model: no Google tag request before explicit acceptance, analytics storage only after acceptance, and ad storage/ad user data/ad personalization/Google Signals disabled. The public measurement ID is a repository variable, not a secret.
36. Installed Grow using the exact publisher-issued direct-head script because Grow's verifier requires it sitewide. Kept Automailer, Print Pass, the default subscribe form, and automatic inline/mobile recommendations off; retained only the small reader/share widget. Grow readiness is not Journey approval.
37. Linked the `govwait.com` Search Console domain property to the GA4 production stream after the owner approved the link and its authorized-user email visibility notice.
38. Phase 1 commit `2a1729c` integrated refresh-bot commit `3278afe`, passed the 2,070-page build and 603/603 SEO-sitemap gate, deployed in run `32921188032`, and received an IndexNow HTTP 200 receipt for 603 URLs. These are release/discovery receipts, not indexing, traffic, or revenue proof.
39. Corrected the handoff's “history back to 2016” shorthand for IRCC `flpt-en.json`: `snapshot_date` is IRCC's publication/update date, while each `cohort_month` is when an application was submitted; cohort coverage is not a reconstructed archive of old publications.
40. Added an explicit `metric_type` taxonomy (`published`, `backward`, `forward`, `service_standard`, `percentile`) and a separate append-only `forward_estimates` table/API payload so projections, historical completions, standards, and percentiles can never be silently compared as equivalent measures.
41. Exposed all 28 IRCC forward-looking programs and 3,629 rows to API/MCP immediately, but limited the first human-page release candidate to 12 high-interest, reviewed programs to preserve information gain and staged publishing quality.
42. Raised `MAX_DAYS` from 3,000 to 5,000 only because IRCC officially publishes “More than 10 years,” whose conservative lower bound is 3,652.5 days; the parser preserves the source wording and lower-bound status.
43. At the pre-deployment gate, Phase 2's 2,299-entity / 2,082-page candidate remained local until the owner approved deployment and the public edge passed post-deploy checks; local tests, builds, and dry-run discovery counts were not production receipts.
44. After explicit owner approval, Phase 2 commit `5d5f0a9` passed the 2,082-page production build and 615/615 SEO-sitemap gate, deployed in run `33127083764` to `0933a757.govwait.pages.dev`, and passed public checks for all 12 new pages, the 28-program/3,601-cohort API, canonical redirect, crawler policy, and 615 unique sitemap URLs. IndexNow accepted 621 changed URLs (615 indexable pages plus six discovery documents) with HTTP 200; this remains a submission receipt, not indexing, traffic, ad approval, or revenue evidence.
