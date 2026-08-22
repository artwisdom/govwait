# DEPLOYMENT GUIDE — every manual step, in order

**Status update 2026-08-22:** the repository and refresh cron are active;
`govwait.com` is registered in Cloudflare; the Cloudflare Pages project `govwait`
serves both the apex and `www` over HTTPS; `contact@govwait.com` forwards through
Cloudflare Email Routing; and the public About page contains the address. Google
Search Console and Bing Webmaster Tools ownership are verified. The remaining
search go-live action is the explicitly owner-approved sitemap submission in each
service.

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
   - `CLOUDFLARE_ACCOUNT_ID` = the Cloudflare account that owns the `govwait` Pages project.
   - Encrypted secret `CLOUDFLARE_API_TOKEN` = a least-privilege token with Cloudflare Pages edit access only.

4. **[DONE] First data refresh.** `refresh-data` is green and runs Tue+Fri automatically (~35 min/month of the 2,000 free).

5. **[DONE, $10.46/yr] Custom domain.** `govwait.com` is registered through Cloudflare Registrar with auto-renew and registrar lock enabled. Proxied CNAME records route the apex and `www` to `govwait.pages.dev`; both custom domains are active with HTTPS.

6. **[READY — SUBMIT CLICKS AWAIT OWNER APPROVAL] Search consoles.** The Google
   Search Console domain property `govwait.com` and Bing Webmaster Tools site
   `https://govwait.com/` were verified by DNS on 2026-08-22. The full sitemap URL
   `https://govwait.com/sitemap.xml` is staged in both forms but has **not** been
   submitted. Google's live URL test reports the homepage can be indexed (crawl
   allowed, fetch successful, indexing allowed, declared canonical correct). The
   Canada visitor-visa-from-India, Canada study-permit-from-Pakistan, and UK standard
   visitor pages each passed Google's live Rich Results Test with one valid
   Breadcrumb item. After explicit owner approval, click **Submit** once in each
   service. Treat any Google **Request indexing** click as a separate approval.

7. **[DONE] Publish contact details.** The About page links `contact@govwait.com`; Cloudflare Email Routing forwards that alias to the owner's verified destination address.

## Monetization (CORRECTED Aug 2026 per handoff research — the old Ezoic path is dead)

8. **[DONE] Cloudflare hosting and crawler policy.** Cloudflare Pages is the sole production host; GitHub Pages is disabled. After token cleanup, GitHub-driven deploy run `32571664389` passed on commit `cdcf37b`, proving the retained Pages-only token works. AI Crawl Control was checked deliberately: every listed crawler remains allowed and Cloudflare Managed robots.txt is off, preserving the repository-owned policy. See `docs/CLOUDFLARE_CRAWL_POLICY.md`.

9. **[LATER] Ads — the 2026 ladder.** Prerequisite for ANY approval: the editorial layer (guides, methodology, unique per-page analysis — partially built; expand per roadmap) because 2,000 templated pages alone is the exact "Low Value Content" rejection profile.
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
15. **Next automated sources (robots-verified already):** NZ (immigration.govt.nz + dia.govt.nz), Sweden, Netherlands, Denmark — see MAINTENANCE_RUNBOOK "Adding a source".

## Placeholders inventory (grep-able)
- `<<OWNER_PROVIDES>>` → only in docs and `.env.example`.
- `govwait.example` → placeholder origin in `site.config.json`, `robots.txt`, `openapi.yaml`; replaced by `SITE_URL` at deploy (workflow rewrites robots.txt automatically).
- "GovWait" is a working name — rename by editing `site.config.json` (SITE_NAME) and `machine/mcp-server/src/index.ts` (server name) if you pick something else.
