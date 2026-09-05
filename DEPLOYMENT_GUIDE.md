# DEPLOYMENT GUIDE — every manual step, in order

**Status update 2026-09-04:** the repository and refresh cron are active;
`govwait.com` is registered in Cloudflare; the Cloudflare Pages project `govwait`
serves both the apex and `www` over HTTPS; `contact@govwait.com` forwards through
Cloudflare Email Routing; and the public About page contains the address. Google
Search Console and Bing Webmaster Tools ownership are verified. The Phase 1
editorial/trust release, consent-gated GA4, verified Grow script, and GA4-to-Search
Console link are live. The remaining search-engine work is processing and honest
measurement; setup and submission do not prove indexing, traffic, or ad approval.
The Phase 3 growth release is production-verified from commit `d635236`, deployment
run `33934940206`, and Cloudflare artifact `dbdfa613.govwait.pages.dev`. The live
product now has 2,318 routes, 2,107 HTML pages, and 638 indexable/sitemap URLs.

## Go-live core

1. **[DONE] Create a GitHub repository and push.**
   ```bash
   cd data-moat-engine
   git remote add origin git@github.com:<you>/<repo>.git
   git push -u origin main
   ```
   Pushing activates nothing dangerous by itself: `refresh.yml` runs on cron/manual only, `deploy.yml` deploys only after step 2.

2. **[DONE] Deploy to Cloudflare Pages.** Project `govwait` was created by direct upload and is live at `https://govwait.pages.dev`. The production workflow deploys the same validated `site/dist` output to that project.

3. **[DONE] Set repository deployment settings.** Settings → Secrets and variables → Actions:
   - `SITE_URL` = your real site origin (used for canonicals/sitemap/robots).
   - `CONTACT_EMAIL` = `contact@govwait.com` for the crawler User-Agent.
   - `PUBLIC_GA4_MEASUREMENT_ID` = `G-6ZJ7J3526N` for the consent-gated production stream.
   - `CLOUDFLARE_ACCOUNT_ID` = the Cloudflare account that owns the `govwait` Pages project.
   - Encrypted secret `CLOUDFLARE_API_TOKEN` = a least-privilege token with Cloudflare Pages edit access only.

4. **[ACTIVE — LAST RUN FAILED CLOSED] Automated data refresh.** `refresh-data` runs Tue+Fri automatically (about 65 min/month after the bounded INZ source addition, still well inside the 2,000-minute free tier). The 2026-09-04 run stopped before export because UDI's `robots.txt` returned HTTP 403 to the GitHub runner. No unverified data was published; preserve fail-closed behavior and recheck the unchanged official route on the next run.

5. **[DONE, $10.46/yr] Custom domain.** `govwait.com` is registered through Cloudflare Registrar with auto-renew and registrar lock enabled. Proxied CNAME records route the apex and `www` to `govwait.pages.dev`; both custom domains are active with HTTPS.

6. **[DONE — SEARCH-ENGINE PROCESSING CONTINUES] Search consoles.** The Google
   Search Console domain property `govwait.com` and Bing Webmaster Tools site
   `https://govwait.com/` were verified by DNS on 2026-08-22. The full sitemap URL
   `https://govwait.com/sitemap.xml` was submitted to both on 2026-08-23. After
   the discoverability release reduced the requested index set to useful,
   data-backed pages and added separate child sitemaps, Google accepted the root
   again and Bing accepted it for processing. The 2026-09-04 Phase 3 release has
   **638 indexable pages and 638 matching sitemap URLs**; deployment run
   `33934940206` submitted 646 URLs (the 638-page set plus RSS, `llms.txt`, and
   six sitemap documents) to IndexNow and received HTTP 200.
   None of these receipts guarantees indexing.
   The public sitemap returns HTTP 200 as `application/xml`. Google's live URL test
   reports the homepage can be indexed (crawl
   allowed, fetch successful, indexing allowed, declared canonical correct). The
   Canada visitor-visa-from-India, Canada study-permit-from-Pakistan, and UK standard
   visitor pages each passed Google's live Rich Results Test with one valid
   Breadcrumb item. Wait 3–7 days before judging discovered-URL counts or Bing's
   final processing status. After explicit owner confirmation, Google accepted
   priority-crawl requests for the UK Standard Visitor page, Canada Visitor Visa
   by Country guide, Canada Study Permit from Pakistan, the New Zealand hub,
   New Zealand Visitor Visa page, the New Zealand processing-times explainer, the
   Canada 2026-08-26 report, and the New Zealand 2021 Resident Visa guide.
   Do not repeat those requests merely to try to change priority; acceptance still
   does not prove that a URL is indexed.

7. **[DONE] Publish contact details.** The About page links `contact@govwait.com`; Cloudflare Email Routing forwards that alias to the owner's verified destination address.

## Phase 2 release receipt — complete 2026-08-27

1. **[DONE]** Fetched `origin/main`; it matched local base `35204e5`, so no refresh-bot
   rebase or database conflict was necessary.
2. **[DONE]** Reran 7 parser tests, 23 validation checks, API/site builds, 615/615
   SEO-sitemap audit, 2,572-file API conformance, MCP build/smoke, visual checks,
   and the 615-URL full IndexNow dry run.
3. **[DONE]** Owner explicitly approved deployment; commit `5d5f0a9` was pushed to
   `main`. Run `33127083764` passed the production build/SEO gate and deployed the
   exact artifact to `0933a757.govwait.pages.dev`.
4. **[DONE]** All 12 new routes returned HTTP 200. The canonical CEC page matched
   the Pages artifact and exposed the forward warning, cohort table, canonical,
   and GovernmentService schema. The bulk API returned 28 programs and 3,601
   cohorts; the four child sitemaps contained 615 unique URLs; API index, OpenAPI,
   `llms.txt`, robots policy, and the `www` 301 were verified publicly.
5. **[DONE — RECEIPT ONLY]** IndexNow accepted 621 changed URLs with HTTP 200: 615
   indexable pages plus six discovery documents. This does not prove crawling,
   indexing, ranking, traffic, ad approval, or revenue. Do not resubmit manual
   Google indexing requests unless a specific high-value URL has a verified gap.

## Norway release receipt — complete 2026-08-31

1. **[DONE]** Integrated 19 UDI routes from 5 complete, dated official
   tables. The collector uses an honest contact-bearing User-Agent, respects UDI's
   robots policy and request spacing, validates every expected row, and excludes
   personalised questionnaire paths.
2. **[DONE]** Added Norway country/service pages, a source-method guide, a
   baseline-only change report, fifth child sitemap, JSON API/OpenAPI/MCP support,
   `llms.txt`, navigation, and exact IndexNow URL mapping. The release adds 22
   indexable URLs and brings the local sitemap set to 635.
3. **[DONE]** Live collection returned 19/19 records dated 2026-08-27.
   Parser tests 12/12, validation 25 checks, a 2,104-page build, 635/635 SEO-sitemap
   audit, 2,611-file API conformance, MCP smoke, 635-URL IndexNow dry run, diff
   validation, and desktop/mobile rendered checks passed.
4. **[DONE]** The owner approved deployment. Commit `a9100bb` passed run
   `33462368754` and deployed to `74bd35d1.govwait.pages.dev`; the production build
   and 635/635 SEO-sitemap audit were blocking steps before publication.
5. **[DONE]** All 22 Norway URLs returned HTTP 200. The hub rendered 19 rows with
   no browser warnings; the published range, UDI provenance, API, five child
   sitemaps, `llms.txt`, robots policy, canonicals, artifact parity, and the `www`
   redirect passed public checks. IndexNow accepted 642 URLs with HTTP 200. These
   actions still do not prove indexing, traffic, ad approval, or revenue.

## Phase 3 growth release receipt — complete 2026-09-04

1. **[DONE]** Added permanent Canada and New Zealand dated report issues, complete
   change tables, report RSS, and a source-backed New Zealand 2021 Resident Visa
   guide that states the route is closed instead of inventing a current wait.
2. **[DONE]** Parser tests 12/12, validation 25 checks, a 2,107-page build, 638/638
   SEO-sitemap audit, 2,611-file API conformance, MCP build/smoke, RSS/sitemap XML
   validation, 638-URL IndexNow dry run, diff checks, and public checks passed.
3. **[DONE]** Commit `d635236` passed run `33934940206` and deployed to
   `dbdfa613.govwait.pages.dev`. The apex matched the artifact; all three new pages,
   RSS, `llms.txt`, sitemaps, canonicals, and the path-preserving `www` redirect passed.
4. **[DONE — RECEIPTS ONLY]** IndexNow accepted 646 URLs with HTTP 200. Google added
   the Canada report and New Zealand guide to its priority crawl queue. Neither
   submission proves indexing, ranking, traffic, ad approval, or revenue.

## Monetization (CORRECTED Aug 2026 per handoff research — the old Ezoic path is dead)

8. **[DONE] Cloudflare hosting and crawler policy.** Cloudflare Pages is the sole production host; GitHub Pages is disabled. After token cleanup, GitHub-driven deploy run `32571664389` passed on commit `cdcf37b`, proving the retained Pages-only token works. AI Crawl Control was checked deliberately: every listed crawler remains allowed and Cloudflare Managed robots.txt is off, preserving the repository-owned policy. See `docs/CLOUDFLARE_CRAWL_POLICY.md`.

8b. **[DONE 2026-08-25] Measurement and Grow foundation.** GA4 account/property
   `GovWait` uses production stream `15489361827` and measurement ID
   `G-6ZJ7J3526N`; the repository variable is set and the live tag loads only after
   explicit analytics acceptance. Ad storage, ad user data, ad personalization,
   Google Signals, and ad-personalization signals remain disabled. GA4 retention is
   14 months, and the production stream is linked to the `govwait.com` Search
   Console domain property. Grow accepted the owner-approved bundle, verified its
   exact script on production, and is ready to accumulate eligibility history.
   Automailer, Print Pass, the default subscribe form, and automatic inline/mobile
   recommendations are off; the small reader/share widget remains on. No Journey
   application or ad approval is implied.

9. **[FOUNDATION LIVE; APPLICATION LATER] Ads — the 2026 ladder.** Prerequisite for ANY approval: the editorial layer (15 guides, 4 jurisdiction reports, 2 permanent dated issues, methodology, editorial/research-desk identity, and policy pages are live; continue expanding per roadmap) because 2,000 templated pages alone is the exact "Low Value Content" rejection profile.
   - At **~1,000 sessions/mo**: apply to **Mediavine Journey** (the on-ramp; 70% share; Grow.js works on static sites) + AdSense in parallel (fallback + required standing).
   - At **25K pageviews/mo AND ≥50% US/UK/CA/AU/NZ traffic**: apply to **Raptive** (geo gate is the binding constraint, not the pageview count).
   - Full **Mediavine** upgrade happens automatically via Journey at $5K trailing-12-month ad revenue.
   - **Never**: Ezoic (250K monthly-visitor minimum since Feb 2026 + reputation collapse) or Monumetric (requires WordPress/Blogger).
   - Then replace `<!-- AD_SLOT -->` comments in `site/src/components/AdSlot.astro` with the network's code.

9b. **[LATER, ~5–10K PVs] Trust-compatible affiliates** on relevant pages only, always labeled, with a disclosure page: travel/visitor insurance (SafetyWing 10%/364-day cookie; VisitorsCoverage; Insubuy up to $150/sale) and remittance (Wise £10/£50 CPA 365-day; Remitly ~$20 CPA — the correct way to monetize non-tier-1 traffic). **Never**: iVisa-class visa-concierge affiliates (documented 400% fee markups — brand poison for an official-data site) or "dummy ticket" services (misrepresentation gray zone).

## Machine-skin distribution (after the site is live)

10. **[OPTIONAL] MCP directory submissions.** Submit the repo's `machine/mcp-server` (public repo required) to: PulseMCP, mcp.so, Glama, Smithery. Each is a web form: name `govwait`, description from the README, link to repo. 5 min each.
11. **[LATER, demand-triggered] Paid API tier.** Only if real programmatic usage appears (check Pages analytics for `/api/v1/` hits): Stripe usage-based billing or x402. Do not build ahead of demand.
12. **[OPTIONAL] llms.txt live check.** After deploy, confirm `https://<domain>/llms.txt` serves, and that `/api/v1/index.json` returns JSON in a browser.

## Coverage expansion blocked by hard rules (owner decisions)

13. **US data (highest-value gap).** `travel.state.gov` and `egov.uscis.gov` block honest bots (Cloudflare 403). Options (updated Aug 2026: the USCIS developer portal has **no processing-times API** — only Case Status and FOIA — so there is no sanctioned automated route): (a) manual weekly entry of passport/USCIS times from the official pages (2 min/week) — add a `manual` confidence tier first; (b) leave the US out (current state). Never scrape around the WAF.
14. **Australia / Ireland.** Same situation (Akamai/CloudFront blocks). Re-check quarterly by hand; both publish rich data if they ever open up or offer official APIs.
15. **Next automated sources:** Immigration New Zealand and Norway UDI are live.
   The next robots-verified candidates are Finland, Sweden, Netherlands and Denmark;
   NZ passports remain blocked. See MAINTENANCE_RUNBOOK "Adding a source".

## Placeholders inventory (grep-able)
- `<<OWNER_PROVIDES>>` → only in docs and `.env.example`.
- `govwait.example` → placeholder origin in `site.config.json`, `robots.txt`, `openapi.yaml`; replaced by `SITE_URL` at deploy (workflow rewrites robots.txt automatically).
- "GovWait" is a working name — rename by editing `site.config.json` (SITE_NAME) and `machine/mcp-server/src/index.ts` (server name) if you pick something else.
