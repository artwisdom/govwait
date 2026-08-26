# HANDOFF 03 — Research: Monetization (August 2026)

_Research pass 2026-08-21/22. Verbatim findings below; preamble maps to repo status._

## Implementation status

| Recommendation | Status |
|---|---|
| Correct the ad ladder in owner docs (Ezoic dead; Journey on-ramp) | ✅ DONE (DEPLOYMENT_GUIDE §8–9b rewritten) |
| Editorial layer prerequisite for ad approval | ⚠️ PARTIAL (13 guides + 3 jurisdiction reports + methodology/editorial/trust pages live; target ~40–80 editorial pages → roadmap R5) |
| Cloudflare Pages migration + AI Crawl Control before **Sept 15, 2026** | ✅ DONE (Pages sole host, canonical apex, deliberate crawler allows, GitHub Pages off) |
| Consent-gated analytics + Grow foundation | ✅ DONE 2026-08-25 (GA4 linked to Search Console; Grow script production-verified; no Journey application yet) |
| Pay Per Crawl beta + Monetization Gateway waitlist signups | ❌ OWNER (accounts) — do during R1 |
| Immutable historical archive discipline (the licensable asset) | ✅ DONE by design (append-only observations; db.sqlite committed) |
| Plain-language data-license page (commercial license hook) | ❌ ROADMAP (R7) |
| Affiliate green-list at 5–10K PVs (SafetyWing/VisitorsCoverage/Insubuy/Wise/Remitly) | ❌ LATER — thresholds in DEPLOYMENT_GUIDE §9b |
| Employer/sponsor-side content (tier-1 RPM fix) | ❌ ROADMAP (R5) |
| Model plan on ads table only; milestone on sessions + tier-1 share | Policy — encoded in roadmap |

## The 2026 ad-network ladder (verified requirements)

| Network | Entry (Aug 2026) | GovWait fit |
|---|---|---|
| AdSense | No minimum; quality review | Rejection risk = "Low Value Content" on templated pages; apply only after editorial layer + 2–3 months indexed history |
| **Mediavine Journey** | **1,000 sessions/mo** (since Jan 15, 2026), original content, Grow.js (works on static sites), 70% share | **The on-ramp.** "Premium traffic" clause is the risk given applicant-geo mix |
| Mediavine full | $5K+ trailing-12-mo ad revenue (auto-upgrade via Journey) | Old "50K sessions" gate is obsolete |
| **Raptive** | **25K PVs** (since Oct 16, 2025) BUT 25–99K tier needs **≥50% US/UK/CA/AU/NZ traffic** (100K+: ≥40%) | Geo gate, not PV count, is the binding constraint |
| Ezoic | **250K monthly actives** (since Feb 19, 2026); Trustpilot ~1.8 | **Dead option — never** |
| Monumetric | 10K PVs but **WordPress/Blogger only** | Incompatible with Astro |
| Newor Media | ~10K PVs, English sites | Viable AdSense-upgrade fallback |

## Vertical economics (evidence-based)

- Immigration search CPCs $15–80 belong to lawyers buying search ads; display captures a thin slice. Advertiser mix on our pages: law firms, visitor/travel insurance (often visa-mandatory), remittance (Wise/Remitly bid on diaspora), intl education, newcomer fintech — a better-than-average info vertical.
- **Geo is 5–15× on RPM**: AdSense CPC US $0.61 / UK $0.48 / CA $0.45 vs India $0.07 / Nigeria $0.11 / PH $0.04. India-majority pages ≈ $0.5–3 RPM.
- Real comps: Journey site with 27% US traffic averaged **$12.69 RPM** in first 90 days (danny-cph, Jan 2026); another ~$17 (May 2026); full Raptive travel sites $47–57 in Q4 2025. Q4 runs 40–80% above Q1.
- **GovWait blended estimate: $6–15 RPM on Journey year one; $12–30 at premium scale.** Short repeat sessions ("did my number change?") drag RPM; employer/sponsor-side pages lift it.

## Revenue table (plan on THIS only; everything else modeled at $0)

| Monthly PVs | Network | RPM | Monthly revenue |
|---|---|---|---|
| 10K | AdSense → Journey | $2–6 → $6–15 | $20–150 |
| 50K | Journey | $6–15 | $300–750 |
| 250K | Raptive/Mediavine if geo ≥40–50% tier-1, else Journey/Newor | $12–30 / $8–15 | $2,000–7,500 |
| 1M | Raptive/Mediavine | $12–30 | $12,000–30,000 |

Annualize ≈ 11× average month (Q1 trough ~0.6× Q4 peak).

## Pay-per-crawl / AI licensing reality check

- Cloudflare AI Crawl Control: free, GA. **Pay Per Crawl → "Pay Per Use": still private beta** (demand side: Ceramic.ai, You.com). **Sept 15, 2026**: new-site defaults change — set policy deliberately (recommended: ALLOW AI crawlers on HTML — we want citations; meter bulk JSON later).
- Published small-publisher math: even at 1M PVs, AI crawls ≈ 1–2% of requests → **$20–200/mo**; Cloudflare takes ~30% in marketplace; Open Markets Institute (May 2026) found no disclosed publisher payouts. **Tip-jar money; free leverage, not revenue.**
- Marketplaces: TollBit (3,000+ sites; sub-10K-reader sites explicitly not worth the overhead — revisit at 100K+ PVs); ScalePost (~15% take, rights-holders); ProRata/Gist (50/50, trivial for niche sites today); Microsoft PCM (invite).
- **Monetization Gateway** (waitlist, Jul 2026): x402 stablecoin rails to price pages/datasets/REST/MCP per-call — the first credible mechanism for charging agents for OUR differentiated asset (API + MCP). Zero-maintenance experiment when GA.

## Data licensing

- Marketplace channel (RapidAPI) stagnant post-Nokia; don't build on it. Self-serve comps: $49–99/mo entry tiers; real money in negotiated annual licenses ($3K–15K/yr anchor).
- Buyers: immigration case-management (Docketwise/8am publishes its own USCIS report; Lawfully), relocation/global-mobility platforms, edu-agent CRMs. Pitch = **normalized multi-government historical time-series** — the one thing none build.
- Sober facts: raw inputs are free gov publications; IRCC data already scraped into a public GitHub repo (YOWCT/ircc-processing-times-data); UK open-sourced its own tool; US facts aren't copyrightable (Feist). **The only licensable asset is years of clean multi-government archive + normalization — start outreach at ~3+ governments × 12+ months of history, not before.**

## Affiliate trust filter

- **Green** (add at 5–10K PVs, labeled, with disclosure page): SafetyWing (10%, 364-day cookie), VisitorsCoverage, Insubuy (≤$150/sale) on insurance-requirement pages; Wise (£10/£50 CPA, 365-day), Remitly (~$20) on fee/proof-of-funds pages — the correct monetization for non-tier-1 traffic.
- **Yellow**: law-firm placements — only as clearly-labeled flat-rate sponsorships with published vetting (at ~100K PVs); passport-photo tools (vet refunds); VPNs (weak relevance).
- **Red — never**: iVisa-class visa concierges (documented 400% markups, BBB complaints — direct contradiction of the brand); "dummy ticket" flight-reservation rentals (misrepresentation gray zone). Both would destroy a trust-first official-data brand.

## Hard truths

1. Ezoic-as-on-ramp is factually obsolete; Journey at 1K sessions replaced it (and is better).
2. Applicant-side traffic skews to $0.03–0.11-CPC geos; **Raptive's 50% tier-1 gate may bind even when PVs qualify.** Sponsor/employer-side content is what makes the ad thesis work.
3. 2,000 templated pages with no prose layer = the exact 2026 "Low Value Content" rejection profile everywhere.
4. Pay-per-crawl pays big publishers, not solos: model $0; treat >$50/mo as upside surprise. The Sept 15 deadline is the only urgent monetization task.
5. The dataset has no legal moat and free scrapes exist; licensing is realistically 2+ years away and depends on archive discipline starting now (it has).
6. At near-term traffic (10–50K PVs) total revenue is $100–900/mo — **the next 12 months are a traffic problem, not a monetization problem.**

_(Dated sources retained in research transcript: Ezoic support KB Feb 2026; mediavine.com requirements Aug 2026; ppc.land Oct 2025 Raptive; danny-cph Jan 2026 RPM report; TechCrunch Jul 1 2026 Pay-Per-Use; blog.cloudflare.com Monetization Gateway Jul 2026; Open Markets Institute May 31 2026; worldpopulationreview CPC data; wecantrack Wise terms; BBB/thetraveler.org iVisa complaints; et al.)_
