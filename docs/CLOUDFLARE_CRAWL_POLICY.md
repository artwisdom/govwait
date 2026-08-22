# Cloudflare crawler policy

Last verified in the Cloudflare dashboard on 2026-08-22.

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

## Why

GovWait's near-term distribution strategy depends on discoverability and
verifiable citations. Blocking search or AI citation crawlers would work against
that goal. If bulk JSON usage becomes material, meter or restrict those routes
separately instead of blocking crawlers from the public HTML pages.

## Re-check trigger

Re-check this page against Cloudflare whenever its crawler defaults change, the
site adopts paid machine access, or API traffic becomes costly enough to require
route-specific controls.
