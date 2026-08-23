# Cloudflare crawler policy

Last verified in the Cloudflare dashboard on 2026-08-23.

## Deliberate policy

- Cloudflare AI Crawl Control is active for observability, but every listed
  **Block Crawler** switch is off. Search and citation crawlers, including
  Googlebot, BingBot, ChatGPT-User, OAI-SearchBot, GPTBot, ClaudeBot,
  Claude-SearchBot, PerplexityBot, and Perplexity-User, are allowed.
- Cloudflare **Managed robots.txt** is off. Cloudflare must not replace the
  repository-owned policy or add an AI-training opt-out on GovWait's behalf.
- The deployed `robots.txt` remains the source of truth and currently allows
  every crawler. It also advertises the production sitemap and points agents to
  `/llms.txt` for machine-oriented context.
- Cloudflare showed approximately 2,230 allowed AI-crawler requests in the
  preceding 24 hours during this check, mostly ClaudeBot, plus traffic from the
  major search/citation agents. This is access evidence, not indexing evidence.
- A live Single Redirect sends `www.govwait.com` to the matching canonical apex
  URL with a permanent 301 while preserving the path and query string.

## Why

GovWait's near-term distribution strategy depends on discoverability and
verifiable citations. Blocking search or AI citation crawlers would work against
that goal. If bulk JSON usage becomes material, meter or restrict those routes
separately instead of blocking crawlers from the public HTML pages.

## Re-check trigger

Re-check this page against Cloudflare whenever its crawler defaults change, the
site adopts paid machine access, or API traffic becomes costly enough to require
route-specific controls.
