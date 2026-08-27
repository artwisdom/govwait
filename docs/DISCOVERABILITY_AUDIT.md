# Discoverability audit

_Implemented and production-verified initially on 2026-08-23, expanded by the
Phase 1 trust/growth release on 2026-08-25, and expanded again by the IRCC
forward-looking release on 2026-08-27. Current production is commit `5d5f0a9`,
deployed in GitHub Actions run `33127083764`._

## Search-indexing policy

- Production builds 2,082 HTML pages, including the 404 page.
- 615 pages currently have enough distinct, useful content to request indexing:
  68 general/country hubs, guides, policies, reports, and reviewed Canadian
  service pages; 445 Canadian applicant-country pages with
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
  current 615-URL indexable set and respects the protocol's 10,000-URL request
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
[seo-audit] 2082 HTML pages; 615 indexable; 615 sitemap URLs
[seo-audit] PASS
[conformance] checked 2572 API files
[conformance] PASS
MCP SMOKE TEST: ALL PASS, including New Zealand and IRCC forward/cohort checks
IndexNow full-set dry run: 615 indexable URLs
Production deploy: commit 5d5f0a9; GitHub Actions run 33127083764 succeeded
Cloudflare Pages deployment: https://0933a757.govwait.pages.dev
Public edge: all 12 new pages, bulk/entity APIs, OpenAPI, robots.txt, llms.txt,
canonical redirect, and root/four child sitemaps verified on govwait.com
Live child sitemap counts: hubs 68 + CA 445 + GB 77 + NZ 25 = 615 unique URLs
IndexNow change submission after deployment: 621 URLs, HTTP 200 receipt
  (615 indexable pages + llms.txt + five sitemap documents)
Existing Google sitemap index: https://govwait.com/sitemap.xml already registered;
Google reports Sitemap index / Success; Bing reports Submitted / Processing
Earlier Google priority crawl requests: accepted for all three confirmed gaps
  - https://govwait.com/uk/standard-visitor/
  - https://govwait.com/guides/canada-visitor-visa-by-country/
  - https://govwait.com/canada/study-permit/from-pakistan/
```

## Phase 2 production expansion

- Adds 12 reviewed IRCC forward-looking program pages while making all 28 programs
  and 3,629 projection/cohort rows available to the generated API and MCP server.
- Production build: 2,082 HTML pages; 615 intentionally indexable pages; exactly 615
  sitemap URLs. The 12 new pages contain a source-backed current projection,
  queue information, an accessible cohort chart/table, and an explicit warning
  that cohort months are not historical publication snapshots.
- The full IndexNow implementation now derives its hub/editorial/report paths from
  the same authoritative sitemap helper; a dry run returns exactly 615 URLs.
- Pipeline tests 7/7, validation 23 checks, SEO audit, 2,572-file API conformance,
  MCP smoke, and desktop/mobile light/dark visual checks passed before deployment.
  Public verification then confirmed all 12 pages, 28 programs, 3,601 cohorts,
  615 sitemap URLs, crawler policy, and canonical behavior. These release receipts
  are not evidence of search indexing, traffic, ad approval, or revenue.
