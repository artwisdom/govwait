# Discoverability audit

_Implemented and production-verified 2026-08-23. The New Zealand expansion was
deployed in GitHub Actions run `32667066646`, commit `84e7ec4`._

## Search-indexing policy

- The site builds 2,051 HTML pages, including the 404 page.
- 588 pages currently have enough distinct, useful content to request indexing:
  41 general/country hubs and guides, 445 Canadian applicant-country pages with
  a numeric official value, 77 UK service pages, and the first 25 curated New
  Zealand visa pages. Each New Zealand page combines its official 50th- and
  80th-percentile figures rather than creating two near-duplicate pages.
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
- The sitemap index separates hubs, Canadian numeric country pages, UK services,
  and the first New Zealand cohort. Each child and the index use the newest
  source-backed effective or first-observed date in that exact URL set; build
  time is never used as `lastmod`.
- The homepage publishes WebSite, Organization, and Dataset structured data.
  Content pages retain breadcrumb and government-service markup.
- Every indexable HTML page has an explicit robots directive, unique title and
  description, one H1, a self-canonical, and working internal links. CI blocks a
  deployment if these guarantees, sitemap membership, honest child `lastmod`,
  crawler policy, or JSON-LD validity regress.
- The IndexNow notifier submits the exact changed public pages only after the
  corresponding production deployment succeeds. It can also submit the full
  current 588-URL indexable set and respects the protocol's 10,000-URL request
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
[seo-audit] 2051 HTML pages; 588 indexable; 588 sitemap URLs
[seo-audit] PASS
[conformance] checked 2515 API files
[conformance] PASS
MCP SMOKE TEST: ALL PASS, including New Zealand search and value checks
IndexNow full-set dry run: 588 URLs
Production deploy: GitHub Actions run 32667066646 succeeded
Cloudflare Pages deployment: https://eea35d8d.govwait.pages.dev
Public edge: New Zealand hub, Visitor Visa page, explainer, API, robots.txt,
llms.txt, root sitemap, and 25-URL New Zealand child sitemap verified on govwait.com
IndexNow full-set submission after deployment: 588 URLs, HTTP 200 receipt
Existing Google sitemap index: https://govwait.com/sitemap.xml already registered;
it now advertises sitemap-nz.xml without asserting that Google has processed it
Earlier Google priority crawl requests: accepted for all three confirmed gaps
  - https://govwait.com/uk/standard-visitor/
  - https://govwait.com/guides/canada-visitor-visa-by-country/
  - https://govwait.com/canada/study-permit/from-pakistan/
```
