# Discoverability audit

_Implemented and production-verified 2026-08-23 in GitHub Actions run
`32659297157`, commit `bc3eb1f`._

## Search-indexing policy

- The site builds 2,024 HTML pages, including the 404 page.
- 561 pages currently have enough distinct, useful content to request indexing:
  39 general/Canada hubs and guides, 445 Canadian applicant-country pages with
  a numeric official value, and 77 UK service pages.
- 1,462 Canadian applicant-country pages where the agency currently publishes
  only `unavailable` or `insufficient_data` remain live, internally linked, and
  crawler-accessible. They carry `noindex, follow` and are excluded from
  sitemaps and IndexNow until an official numeric value appears.
- This graduation is automatic: the next successful data refresh changes a
  route to indexable when its status becomes `ok`.

This preserves the official absence state without asking search engines to
index a large family of low-information query variants.

## Discovery surfaces

- `robots.txt` explicitly allows Googlebot, Bingbot, Applebot, OpenAI search,
  user, and training agents, Anthropic search/user/training agents, Perplexity,
  DuckAssist, Google AI agents, Common Crawl, Amazonbot, and archive.org. The
  wildcard group also allows new agents.
- `llms.txt` is generated from the live dataset so its route/service counts and
  data date cannot become stale. It links the sitemap, JSON API, OpenAPI file,
  human entry points, and public MCP server.
- The sitemap index separates hubs, Canadian numeric country pages, and UK
  services. Each child and the index use the newest official effective date in
  that exact URL set; build time is never used as `lastmod`.
- The homepage publishes WebSite, Organization, and Dataset structured data.
  Content pages retain breadcrumb and government-service markup.
- Every indexable HTML page has an explicit robots directive, unique title and
  description, one H1, a self-canonical, and working internal links. CI blocks a
  deployment if these guarantees, sitemap membership, honest child `lastmod`,
  crawler policy, or JSON-LD validity regress.
- The IndexNow notifier submits the exact changed public pages only after the
  corresponding production deployment succeeds. It can also submit the full
  current 561-URL indexable set and respects the protocol's 10,000-URL request
  limit.

## Cloudflare edge policy

- AI Crawl Control crawler blocks are off and Managed robots.txt is off, so the
  repository policy remains authoritative.
- A Cloudflare Single Redirect permanently sends every `www.govwait.com` path
  and query string to the same canonical path on `govwait.com`.
- Early accented-country slugs that lost letters redirect permanently to their
  corrected canonical URLs.

## Point-in-time crawler evidence

Cloudflare AI Crawl Control showed approximately 2,230 allowed AI-crawler
requests in the previous 24 hours during the 2026-08-23 audit, led by about
2,060 ClaudeBot requests. It also showed allowed traffic from Googlebot,
Bingbot, Applebot, ChatGPT-User, OAI-SearchBot, GPTBot, Claude search/user
agents, and Perplexity agents. This proves access and crawling at that moment;
it does not prove search indexing, citations, rankings, traffic, or revenue.

## Acceptance receipt

```text
[seo-audit] 2024 HTML pages; 561 indexable; 561 sitemap URLs
[seo-audit] PASS
[conformance] checked 2115 API files
[conformance] PASS
MCP SMOKE TEST: ALL PASS (8/8)
IndexNow full-set dry run: 561 URLs
Production deploy: GitHub Actions run 32659297157 succeeded
Public edge: homepage, crawler files, API, all three sitemaps, index/noindex,
www canonical redirect, and legacy-slug redirects verified
IndexNow full-set submission: 561 URLs, HTTP 200 receipt
Google sitemap resubmission: accepted successfully
Bing sitemap resubmission: accepted for processing
```
