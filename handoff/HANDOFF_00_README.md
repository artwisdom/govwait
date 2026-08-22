# GovWait — Codex Handoff Package

_Prepared 2026-08-21/22 by Claude (Fable 5) for transfer of day-to-day development to
Codex. The owner (Michael) manages his web projects there; this package is written so
a coding agent with zero context can operate this project safely and grow it._

## What GovWait is, in one paragraph

GovWait (repo: `github.com/artwisdom/govwait`, domain `govwait.com` — purchase pending)
tracks **officially published government processing times** (visas, permits,
sponsorships) with provenance and append-only history. Governments overwrite these
numbers weekly and keep no archive; our recorded history is the compounding,
non-backfillable asset. One dataset, three skins: a static Astro site (~1,965 pages),
a free static JSON API (~2,000 endpoints + OpenAPI 3.1), and an MCP server for AI
agents. A GitHub Actions cron refreshes data Tue+Fri; a failed validation publishes
nothing. Revenue plan: display ads (engine), machine access (optionality), dataset
licensing (lottery ticket). Honest base rates live in `RISK_REGISTER.md` — most
projects like this earn ~$0; maintained base case $500–$3K/mo at months 12–18.

## The files in this package

| File | What it contains | Read when |
|---|---|---|
| `HANDOFF_01_PROJECT_STATE.md` | Complete technical deep dive: every directory, the data model, pipeline internals, the politeness/compliance rules that MUST survive any refactor, CI, deployment state, known constraints and traps | First, fully, before touching code |
| `HANDOFF_02_RESEARCH.md` | Fresh (Aug 2026) research: SEO/AI-era discoverability for programmatic data sites, monetization specifics with current network requirements, competitor landscape + demand mapping, verified next data sources with URLs and structures | Before planning any growth work |
| `HANDOFF_03_ROADMAP.md` | Prioritized 12-month build-out: ordered tasks with rationale, acceptance criteria, and effort estimates | To decide what to do next, always |

Also read in the repo root (they remain the operating manuals): `EXECUTION_REPORT.md`
(what was built and why), `DEPLOYMENT_GUIDE.md` (remaining owner steps),
`MAINTENANCE_RUNBOOK.md` (weekly ops + failure playbooks + how to add a source),
`RISK_REGISTER.md` (honest risks + pivot thresholds), `DECISIONS.md` (every judgment
call, numbered), `docs/ARCHITECTURE.md`, `docs/QA_REPORT.md`, `STATE.md`.

## Non-negotiables that must survive the transfer

These protect the owner legally and protect the asset's trustworthiness. They are not
style preferences.

1. **Politeness discipline**: honest bot User-Agent with contact email; robots.txt
   obeyed with FAIL-CLOSED semantics (403/blocked robots ⇒ source is dead); ≥3s
   between same-host requests; cache everything; never re-fetch what you have.
2. **Never spoof a browser UA to get around a WAF.** travel.state.gov, egov.uscis.gov,
   ireland.ie, immi.homeaffairs.gov.au block bots — they stay excluded until an
   official API/dataset route exists (USCIS has one: developer.uscis.gov).
3. **Official primary sources only. Values, never prose.** Every record carries
   `source_url`, the agency's own `effective_date`, and our `retrieved_at`.
4. **History is append-only.** Never rewrite or backfill `observations`; a corrected
   parse gets a new row, not an edit.
5. **Validation fails loudly and publication stops.** Never lower a coverage floor or
   widen a sanity range just to make CI green — fix the parser or investigate the
   source (see runbook playbooks).
6. **Honesty in owner-facing claims.** No revenue hype beyond the documented base
   rates. Every projection carries its probability context.
7. **No personal data, ever.** Facts, figures, official values only.

## Suggested first prompt for Codex

> Read `handoff/HANDOFF_00_README.md`, then `handoff/HANDOFF_01_PROJECT_STATE.md`
> fully. Confirm you can run the pipeline locally (`node pipeline/run.js` — uses
> cache, no network needed) and build the site (`cd site && npm ci && npx astro
> build`). Then read `handoff/HANDOFF_03_ROADMAP.md` and propose which of the next
> three roadmap items you'll start with and why. Do not modify the politeness layer,
> validation floors, or history semantics described in the handoff non-negotiables.

## Current status snapshot (as of this handoff)

- Repo public and live; Pages deploy green; custom domain `govwait.com` configured in
  Pages settings, **DNS pending owner's domain purchase** (github.io URL 301s to the
  domain until then).
- refresh-data cron ACTIVE (Tue+Fri 14:00 UTC); first autonomous data commit already
  landed (`data: refresh 2026-08-22`).
- `CONTACT_EMAIL` repo variable NOT yet set (owner to provide; crawler runs as
  "owner-pending" until then) — set it the moment the owner supplies the address.
- Dataset: 1,946 routes / 2 sources (IRCC Canada per-country JSON, gov.uk Content
  API); history depth 1–2 observations per route and compounding.
- Site: redesigned Aug 22 (design system, speed chips, related-route interlinking,
  3 data-generated guides, lastmod sitemap). All QA gates green (`docs/QA_REPORT.md`).
