# Discoverability audit

_Implemented and production-verified initially on 2026-08-23, expanded by the
Phase 1 trust/growth release on 2026-08-25, the IRCC forward-looking release on
2026-08-27, Norway UDI on 2026-08-31, and Phase 3 reports/RSS on 2026-09-04.
Current production is commit `d635236`, deployed in GitHub Actions run
`33934940206` to `dbdfa613.govwait.pages.dev`._

## Search-indexing policy

- Production builds 2,107 HTML pages, including the 404 page.
- 638 pages currently have enough distinct, useful content to request indexing:
  74 general/country hubs, guides, policies, reports, and reviewed Canadian
  service pages; 443 Canadian applicant-country pages with a numeric official
  value, 77 UK service pages, the first 25 curated New Zealand visa pages, and
  19 complete Norway UDI table routes. Each New Zealand page combines its official
  50th- and 80th-percentile figures rather than creating two near-duplicate pages.
- 1,464 Canadian applicant-country pages where the agency currently publishes
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
  human entry points, report RSS feed, and public MCP server.
- `/reports/feed.xml` exposes permanent dated report issues and is advertised in
  every page head and footer. Every feed target is also a canonical indexable page.
- The sitemap index separates hubs, Canadian numeric country pages, UK services,
  the first New Zealand cohort, and Norway UDI services. Each child and the index use the newest
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
  current 638-URL indexable set and respects the protocol's 10,000-URL request
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
[seo-audit] 2107 HTML pages; 638 indexable; 638 sitemap URLs
[seo-audit] PASS
[conformance] checked 2611 API files
[conformance] PASS
MCP SMOKE TEST: ALL PASS, including Norway, New Zealand and IRCC semantic checks
IndexNow full-set dry run: 638 indexable URLs
Production deploy: commit d635236; GitHub Actions run 33934940206 succeeded
Cloudflare Pages deployment: https://dbdfa613.govwait.pages.dev
Public edge: all three new Phase 3 pages, RSS, APIs, OpenAPI, robots.txt, llms.txt,
canonical/artifact parity, www redirect, and root/five child sitemaps verified
Live child sitemap counts: hubs 74 + CA 443 + GB 77 + NZ 25 + NO 19 = 638 URLs
IndexNow change submission after deployment: 646 URLs, HTTP 200 receipt
  (638 indexable pages + RSS + llms.txt + six sitemap documents)
Existing Google sitemap index: https://govwait.com/sitemap.xml already registered;
Google reports Sitemap index / Success; Bing reports Submitted / Processing
Google priority crawl requests accepted for all owner-approved URLs, including
  - https://govwait.com/uk/standard-visitor/
  - https://govwait.com/guides/canada-visitor-visa-by-country/
  - https://govwait.com/canada/study-permit/from-pakistan/
  - https://govwait.com/new-zealand/
  - https://govwait.com/new-zealand/visitor-visa/
  - https://govwait.com/guides/how-new-zealand-visa-processing-times-work/
  - https://govwait.com/reports/canada/2026-08-26/
  - https://govwait.com/guides/new-zealand-2021-resident-visa-processing-time/
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

## Norway production expansion

- Adds 19 distinct UDI service pages, one Norway hub, one source-method guide, and
  one honest baseline report: 22 new indexable URLs. A fifth child sitemap contains
  exactly the 19 service URLs; hubs contains the country, guide, and report URLs.
- Production build: 2,104 HTML pages; 635 intentionally indexable pages; exactly 635
  sitemap URLs. Child counts are hubs 71 + CA 443 + GB 77 + NZ 25 + NO 19 = 635.
  The Canadian numeric count changed from the earlier production snapshot because
  the 2026-08-28 official refresh changed current availability; this is data-driven,
  not a sitemap-policy change.
- The Norway titles, descriptions, canonicals, H1s, internal links, structured data,
  source attribution, exact range display, and mobile overflow behavior were checked
  in the built site. `sitemap-no.xml` uses UDI's official 2026-08-27 date, never the
  2026-08-30 retrieval or build date.
- Release gates: 12/12 parser tests, 25 validation checks, SEO audit, 2,611-file API
  conformance, MCP build/smoke, 635-URL full IndexNow dry run, `git diff --check`,
  and desktop/mobile browser checks all pass.
- Commit `a9100bb` deployed in run `33462368754`. All 22 Norway URLs, public APIs,
  five-child sitemap family, crawler files, canonical/artifact parity, and `www`
  redirect passed edge checks. IndexNow accepted 642 URLs with HTTP 200.
- No manual Norway Google indexing request, confirmed indexing, ranking, search
  traffic, ad approval, or revenue is claimed. Those are separate later evidence states.

## Phase 3 growth expansion

- Adds permanent Canada 2026-08-26 and New Zealand 2026-09-01 report issues derived
  from append-only observations, with complete change, unchanged, and availability
  tables rather than selected promotional examples.
- Adds a valid report RSS feed and a source-backed New Zealand 2021 Resident Visa
  guide. The guide states that the route is closed and does not invent a current wait.
- Production build: 2,107 HTML pages; 638 intentionally indexable pages; exactly 638
  sitemap URLs. Child counts are hubs 74 + CA 443 + GB 77 + NZ 25 + NO 19 = 638.
- Release gates: 12/12 parser tests, 25 validation checks, SEO audit, 2,611-file API
  conformance, MCP build/smoke, RSS and sitemap XML validation, 638-URL full IndexNow
  dry run, diff checks, and public-edge checks all pass.
- Commit `d635236` deployed in run `33934940206`. The apex matched the Cloudflare
  artifact; all three new pages, RSS, crawler/discovery files, sitemap membership,
  canonicals, and the `www` redirect passed public checks. IndexNow accepted 646 URLs
  with HTTP 200.
- Google accepted the Canada report and New Zealand guide into its priority crawl
  queue. These are request receipts, not confirmed indexing, rankings, traffic,
  ad approval, or revenue.
