# EXECUTION REPORT — Data Moat Engine, session of 2026-08-21

## What exists now

A complete, verified, locally-committed foundation for a data-asset business named
**GovWait** (working title): the canonical tracked dataset of **officially published
government processing times** — how long visas, permits, and sponsorships are
actually taking, per government, per applicant country, with history.

| Layer | Deliverable | Verified how |
|---|---|---|
| Research | 22 candidates, 10 rubric-scored, incumbent scans with URLs, source audits (11 hosts), AI-failure test | `research/RESEARCH_LOG.md`, `research/NICHE_DECISION.md` |
| Data asset | SQLite (append-only history) + JSON exports: **1,946 routes, 2 sources (IRCC Canada, UKVI United Kingdom), full provenance on every value** | Pipeline run from empty cache; 11 validation checks green; idempotency confirmed |
| Pipeline | Zero-dependency Node 20; politeness layer (honest UA, robots fail-closed, 3s/host, caching, 150/host cap); fails loudly on any anomaly | QA gate 1 |
| Human skin | Astro 4 static site, **1,961 pages, zero build errors**: entity pages (~7KB each), comparison hubs, methodology/E-E-A-T page; freshness stamp + source link on every value; JSON-LD + canonical + sitemap; 2 reserved ad slots/page (empty comments) | QA gates 2a–2e |
| Machine skin | Static JSON API (**1,997 files**) + OpenAPI 3.1 spec + conformance checker; **MCP server (TypeScript, stdio, 4 tools) with 8/8 smoke assertions passing**; `llms.txt` | QA gates 3–4 |
| Automation | `refresh.yml` (Tue+Fri cron, ~35 min/month of 2,000 free) + `deploy.yml` (Pages + Cloudflare alternative), both **INACTIVE until pushed**; failure diagnosis into job summaries | Files reviewed; cannot run until pushed (by design) |
| Docs | DEPLOYMENT_GUIDE (15 numbered owner steps), MAINTENANCE_RUNBOOK (<1 hr/week + playbooks), RISK_REGISTER (with base rates), DECISIONS, STATE, QA_REPORT, ARCHITECTURE | This commit |

## Why this niche (summary; full scoring in NICHE_DECISION.md)

Scored 37/39 on the mission rubric with zero kill flags. The four load-bearing facts,
all verified this session, not assumed:

1. **Weekly volatility**: IRCC's data was stamped Aug 19; retrieved Aug 21.
2. **LLMs fail at it**: blind test — 7 of 10 of my own no-search answers were wrong or stale (e.g. I said ~10 weeks for a Canada work permit from Mexico; official value is 3 weeks).
3. **Real incumbent gap**: per-government official tools show only the current value; third-party trackers are thin US-visa-only dashboards. Nobody offers cross-government + history + API/MCP.
4. **Permitted, machine-readable sources**: IRCC JSON (1,907 values) and the gov.uk Content API, both robots-clean; five more governments verified robots-permitted for expansion.

The compounding moat: every weekly refresh records values the agencies overwrite.
That history cannot be backfilled by any later competitor.

## What is intentionally NOT done (hard-rule blocks → owner steps)

- **Nothing is deployed, no accounts created, no domain bought, $0 spent, no remote added.** → DEPLOYMENT_GUIDE steps 1–7.
- **US/Australia/Ireland sources excluded**: their sites 403 honest bots; we do not spoof browser UAs. Options (incl. the official USCIS developer API) → DEPLOYMENT_GUIDE steps 13–14.
- Ad code, MCP directory submissions, pay-per-crawl: prepared as checklists only → steps 8–12.
- NZ/SE/NL/DK sources: robots-verified but unbuilt (session scope cut, breadth-first per brief §0.5) → MAINTENANCE_RUNBOOK "Adding a source".

## Honest first-90-days plan

1. **Week 1**: DEPLOYMENT_GUIDE steps 1–7 (~45 min total). Site live, cron running, Search Console submitted.
2. **Weeks 2–6**: add the NZ source (first expansion, ~3 hrs via runbook); let history accumulate; expect near-zero traffic — normal.
3. **Weeks 6–12**: add Sweden or Netherlands; write 3–5 editorial comparison guides on top corridors (India→Canada study, etc.) to give Google non-programmatic entry points; apply to Ezoic once ~30 days of any traffic exists.
4. **Throughout**: <1 hr/week maintenance; judge nothing before month 6 (pivot thresholds in RISK_REGISTER).

## Honest revenue expectations

Most projects of this class earn approximately **$0** — usually because they are
abandoned. If maintained: realistic base case **$500–$3,000/month at months 12–18**
(display ads on tier-1-heavy long-tail traffic). Machine-side revenue is currently
**unproven for solos** — it is free optionality here, not the plan. The benchmark
ceiling (TractorData-class, $20K+/month) requires ~1M monthly visits and years.
Nothing in this repo promises more than the base case.

## The single next action

**DEPLOYMENT_GUIDE step 1**: create a GitHub repo and `git push`. Everything else
follows from there, one ≤5-minute step at a time.
