# DEPLOYMENT GUIDE — every manual step, in order

Nothing in this repo is live. Each step below is ≤5 minutes and marked **[REQUIRED]**
or **[OPTIONAL]**. Steps exist because hard rules forbade the agent from doing them
(accounts, deploys, spend).

## Go-live core

1. **[REQUIRED] Create a GitHub repository and push.**
   ```bash
   cd data-moat-engine
   git remote add origin git@github.com:<you>/<repo>.git
   git push -u origin main
   ```
   Pushing activates nothing dangerous by itself: `refresh.yml` runs on cron/manual only, `deploy.yml` deploys only after step 2.

2. **[REQUIRED] Enable GitHub Pages.** Repo → Settings → Pages → Source: **GitHub Actions**. Then Actions tab → run `deploy-site` manually once. Site appears at `https://<you>.github.io/<repo>/`.

3. **[REQUIRED] Set repository variables.** Settings → Secrets and variables → Actions → Variables:
   - `SITE_URL` = your real site origin (used for canonicals/sitemap/robots).
   - `CONTACT_EMAIL` = a real contact address for the crawler User-Agent (politeness/accountability; currently `owner-pending`).

4. **[REQUIRED] First data refresh.** Actions → `refresh-data` → Run workflow. Confirm green; from then on it runs Tue+Fri automatically (~35 min/month of the 2,000 free).

5. **[OPTIONAL, ~$10/yr — recommended] Custom domain.** Buy a domain (any registrar). Why it matters: canonical URLs you own (ad networks and Search Console treat `github.io` subdomains poorly), and it is a prerequisite for Cloudflare pay-per-crawl later. Point it at Pages (Settings → Pages → Custom domain) or move hosting to Cloudflare Pages (commented alternative in `deploy.yml`). Update `SITE_URL`.

6. **[REQUIRED] Google Search Console.** Add the site, submit `/sitemap.xml`. Also run 2–3 entity pages through the Rich Results test (structured data was validated locally but not against Google's tester — needs a live URL).

7. **[REQUIRED, 2 min] Publish contact details.** Edit `site/src/pages/about.astro` — replace the "Contact details will be published when the site goes live" line with a real email; commit.

## Monetization (timing matters — do not rush this)

8. **[LATER] Ads.** Apply to **Ezoic** early (no traffic minimum) once you have ~30 days of traffic data; move to **Mediavine (50K sessions/mo)** or **Raptive (100K pageviews/mo)** when eligible. Then replace the `<!-- AD_SLOT -->` comments in `site/src/components/AdSlot.astro` with the network's code. Realistic path per RISK_REGISTER: months of near-zero first.

9. **[LATER] Cloudflare pay-per-crawl.** Requires the domain proxied through Cloudflare (free plan). Dashboard → toggle pay-per-crawl when available for your account. Free optionality, not the engine.

## Machine-skin distribution (after the site is live)

10. **[OPTIONAL] MCP directory submissions.** Submit the repo's `machine/mcp-server` (public repo required) to: PulseMCP, mcp.so, Glama, Smithery. Each is a web form: name `govwait`, description from the README, link to repo. 5 min each.
11. **[LATER, demand-triggered] Paid API tier.** Only if real programmatic usage appears (check Pages analytics for `/api/v1/` hits): Stripe usage-based billing or x402. Do not build ahead of demand.
12. **[OPTIONAL] llms.txt live check.** After deploy, confirm `https://<domain>/llms.txt` serves, and that `/api/v1/index.json` returns JSON in a browser.

## Coverage expansion blocked by hard rules (owner decisions)

13. **US data (highest-value gap).** `travel.state.gov` and `egov.uscis.gov` block honest bots (Cloudflare 403). Options: (a) **USCIS Torch API** — official developer API, free signup at developer.uscis.gov, then a new source module (the runbook shows how); (b) manual weekly entry of the passport processing time from the official page (2 min/week) — add a `manual` confidence tier first; (c) leave the US out (current state). Never scrape around the WAF.
14. **Australia / Ireland.** Same situation (Akamai/CloudFront blocks). Re-check quarterly by hand; both publish rich data if they ever open up or offer official APIs.
15. **Next automated sources (robots-verified already):** NZ (immigration.govt.nz + dia.govt.nz), Sweden, Netherlands, Denmark — see MAINTENANCE_RUNBOOK "Adding a source".

## Placeholders inventory (grep-able)
- `<<OWNER_PROVIDES>>` → only in docs and `.env.example`.
- `govwait.example` → placeholder origin in `site.config.json`, `robots.txt`, `openapi.yaml`; replaced by `SITE_URL` at deploy (workflow rewrites robots.txt automatically).
- "GovWait" is a working name — rename by editing `site.config.json` (SITE_NAME) and `machine/mcp-server/src/index.ts` (server name) if you pick something else.
