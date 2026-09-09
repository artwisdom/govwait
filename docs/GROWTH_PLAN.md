# GovWait growth plan

Last reviewed: 2026-09-08 (America/New_York)

This plan separates technical discovery, crawling, indexing, traffic, audience retention, ad approval and revenue. None proves the next. Growth work must preserve GovWait's official-source boundaries, append-only history, polite collection rules, honest dates and no-hype language.

## Current evidence

### Google Search Console

The latest available 28-day Search Console window (August 21-September 4, 2026,
read on September 6) showed:

- 15 clicks from 5.95K displayed impressions;
- 0.3% click-through rate;
- average position 40.9; and
- the strongest query-led opportunity remains New Zealand.

The Search Console overview read on September 6 showed 570 URLs indexed and 1,079
not indexed, but those totals are not a clean
ratio against GovWait's intended sitemap set because the report can include
discovered noindex URLs, older states and different canonical timing. Production
now has 639 intended indexable URLs after Phase 4. Treat 570 as encouraging early
coverage, not proof that a fixed percentage of the exact intended set is indexed.

Demand signals already visible:

- Five Critical Purpose search variants total 429 impressions, mostly in average
  positions 39-52; no current GovWait page answered that closed-route intent.
- Current New Zealand service pages with substantial impressions include Skilled
  Migrant Category (558, position 34.0), Specific Purpose Work Visa (548, position
  53.5), Work to Residence (526, position 70.5), Visitor Visa (518, position 50.5)
  and Permanent Resident Visa (500, position 58.0).
- The Dependent Child Resident page has 89 impressions at position 31.6, while
  related dependent-child queries appear around position 32.
- Near-win Canadian pages include Private Refugee from Pakistan (93 impressions,
  position 4.3), Visitor Visa from Colombia (62, position 6.9), Visitor Visa from
  Nepal (30, position 5.2), Study Permit from Ghana (26, position 8.8), and Visitor
  Visa from Qatar (75, position 10.7). These are the next editorial cohort, not a
  reason to change source facts or create duplicate URLs.

### Google Analytics 4

The seven-day view showed 7 active users, 7 new users, 38 events and 0 key events. Consent-gated analytics undercounts some visitors, so it should be used for directional behavior rather than as an exact reconciliation to Search Console clicks.

### Competitive reality

Current competitors now publish daily IRCC country tables and some historical trends. Immigration firms also publish dated "what changed" articles. GovWait should not compete only on having a current number or claiming to have history. Its defensible combination is:

- multiple governments under one consistent model;
- append-only, source-dated official history;
- complete change issues that separate changed, unchanged and unavailable states;
- transparent provenance and machine access; and
- honest explanations when an official current answer does not exist.

Reference pages:

- <https://canadavisatracker.com/>
- <https://www.foothillsimmigration.ca/canada-visa-processing-times-august-2026-updates>
- <https://developers.google.com/search/docs/fundamentals/creating-helpful-content>
- <https://support.google.com/adsense/answer/7299563>

## Phase 3 — original reports and demand-proven answers

Status: production-verified on 2026-09-04.

This release:

- generates permanent dated report issues from every pair of consecutive stored observations;
- publishes `/reports/canada/2026-08-26/` with 219 numeric changes, 237 unchanged comparable values, 3 newly available values and 5 newly unavailable values;
- publishes `/reports/new-zealand/2026-09-01/` from the reconciled refresh, with 102 numeric changes (97 longer and 5 shorter);
- lists the complete change set, not only selected examples;
- publishes `/reports/feed.xml` and advertises it in every page head, the footer and `llms.txt`;
- includes dated issues in the sitemap and future IndexNow notifications;
- fixes stale baseline-only copy;
- adds a demand-proven, official-source guide for the closed New Zealand 2021 Resident Visa rather than inventing a current processing time; and
- extends the SEO audit to fail if feed discovery or feed targets break.

Production acceptance:

1. The owner approved deployment and two manual Google requests.
2. Commit `d635236` passed GitHub Actions run `33934940206`, including the 2,107-page build and 638/638 SEO-sitemap audit.
3. Cloudflare deployed the exact artifact to `dbdfa613.govwait.pages.dev`; the apex matched it byte-for-byte for the Canada issue, and all three new pages plus RSS, `llms.txt`, sitemap membership, canonicals and the path-preserving `www` redirect passed public checks.
4. IndexNow accepted 646 URLs with HTTP 200: the 638 indexable URLs plus RSS, `llms.txt`, the sitemap index and five child sitemaps. This is a notification receipt only.
5. Google Search Console added the Canada August 26 issue and the New Zealand 2021 Resident Visa guide to its priority crawl queue. The automatically generated New Zealand September 1 issue remains discoverable through internal links, the registered sitemap and IndexNow. A request is not indexing proof.

## Phase 4 — query-led editorial improvements

Status: first four-page cohort production-verified on 2026-09-06.

The candidate:

1. Adds a Critical Purpose Visitor Visa guide based on fresh INZ phase-out,
   archived-route, current case-status and Specific Purpose sources. It publishes
   no invented current wait for the closed COVID-era route.
2. Deepens the Skilled Migrant Category, Specific Purpose Work Visa and Dependent
   Child Resident Visa pages with unique route boundaries, official links and
   tighter titles/descriptions while preserving the current source-derived figures.
3. Adds the guide to the home page, guide hub, sitemap and `llms.txt`, and gives
   only the four substantively changed URLs an honest September 6 `lastmod`.
4. Adds blocking audit assertions for the cohort's sitemap dates, source-backed
   sections and cross-link between the closed historical route and current
   Specific Purpose route.

Release acceptance: 2,108 HTML pages, 639 indexable pages, 639 matching sitemap
URLs, 2,611 API files, parser tests 12/12, clean static build, SEO and XML checks,
API conformance, MCP smoke, 639-URL IndexNow dry run, and desktop/mobile rendered
checks. Commit `8a512aa` passed deployment run `34073350458` and published to
`51f5121a.govwait.pages.dev`; the apex matched that artifact, all four changed
pages and the complete public discovery surface passed independent checks, and
IndexNow accepted 646 affected URLs with HTTP 200. Google accepted one approved
priority-crawl request for the new guide. These receipts are not indexing proof.

### Phase 4B — Canadian near-win cohort

Status: production-verified on 2026-09-07 at commit `fa73c2f`.

This second bounded cohort improves four existing Canadian pages that already have
Search Console impressions and average positions between 4.3 and 10.7:

- Private Refugee from Pakistan;
- Visitor Visa from Qatar;
- Visitor Visa from Colombia; and
- Visitor Visa from Nepal.

Each page keeps its URL and official value. Titles are now 50–58 characters,
descriptions 145–156 characters, H1s match the demonstrated query, and the body
adds either a transparent same-snapshot median comparison or a source-backed
explanation of the refugee-side stage. Official processing-time, route and case-
status links are visible on the page. Blocking audit checks protect all four.

Fresh source review also found that IRCC's current visitor-visa guide says the
displayed processing time does not include the time needed to give biometrics,
while GovWait's older visitor copy said it did. The candidate corrects that claim
across all visitor-country pages and the India/Philippines visitor guides. This is
a factual correction, not a scaled SEO cohort. The 171 indexable visitor-country
pages, the Pakistan near-win page and two corrected guides receive an honest
September 7 editorial `lastmod`; unrelated URLs do not.

Release acceptance: 2,108 HTML pages, 639 indexable pages, 639 matching sitemap URLs,
2,611 API files, parser tests 12/12, static build, SEO and XML checks, API
conformance, MCP build/smoke, 639-URL conservative IndexNow dry run, `git diff
--check`, and responsive rendered checks are green. Commit `fa73c2f` passed
deployment run `34176619821` and published to `2e3649f8.govwait.pages.dev`. The
apex matched the artifact byte-for-byte on representative visitor and refugee
pages; all four target pages, both corrected guides, crawler files, five child
sitemaps with 639 unique URLs, canonicals and the path-preserving `www` redirect
passed public checks. IndexNow accepted 645 affected public/discovery URLs with
HTTP 200. No manual Google crawl request was made because the four target URLs
were already discovered. These receipts are not indexing or traffic proof.

Recheck the four-page cohort after 28 days. Measurement takes
time even when implementation does not; keep shipping bounded cohorts instead of
waiting idle. Google already knows these URLs from Search Console impressions, so
manual priority-crawl requests would add no useful evidence.

Gate: no mass page generation. Google explicitly recommends people-first, original content and warns against automation mainly intended to attract search traffic.

## Phase 5 — authority and distribution

Status: **Phase 5A production-verified on 2026-09-08 at commit `fd7ba67`**.

The first authority slice makes the existing data easier for researchers, search
engines and AI tools to understand and cite without generating thin pages:

- a canonical `/data/` landing page with complete Dataset structured data and
  source URLs in `isBasedOn`;
- four generated CSVs for current routes, append-only history, IRCC projections
  and the source register, plus a machine-readable dataset metadata endpoint;
- a root GitHub README linking the live dataset, API, reports, RSS, method and MCP
  source package;
- source-specific data reuse guidance that licenses only GovWait-owned
  organization and metadata under CC BY 4.0, rather than incorrectly applying
  one blanket licence to four governments; and
- blocking checks for CSV counts/columns, dataset metadata, structured data,
  sitemap membership, honest September 8 editorial dates and `llms.txt` links.

Release acceptance: the local and GitHub gates passed 14 parser/history tests, a
2,110-page build, 641/641 SEO-to-sitemap audit, 2,616-file API/download
conformance, valid XML, MCP build with all 15 smoke assertions, an IndexNow dry
run and responsive rendered checks. Commit `fd7ba67` passed deployment run
`34300806761` and published to `ca3bad6a.govwait.pages.dev`. The
production-configured build matched the artifact byte-for-byte; the apex passed
checks for the dataset and licence pages, four CSVs, dataset metadata, OpenAPI,
`llms.txt`, `robots.txt`, 641 unique sitemap URLs, canonical links and the
path-preserving `www` redirect. The public GitHub README matched the release, and
IndexNow accepted 656 affected URLs with HTTP 200. No Google crawl request has
been made for `/data/`. These are publication and discovery receipts, not
indexing, traffic or revenue evidence.

Phase 5B remains separate: make the MCP package self-contained, choose a software
licence, publish it to npm with owner account approval, and only then publish
matching metadata to the official MCP Registry. Other no-cost directories and a
small earned-link outreach cohort follow only after fresh workflow checks and
separate owner authorization. See `docs/DISTRIBUTION_CHECKLIST.md`.

Measure accepted listings, earned links, referral visitors and returning users
separately. A submitted URL, directory form or sent message is not indexing, a
backlink, traffic or revenue.

## Phase 6 — retention and monetization readiness

- Use Grow and RSS as the first zero-cost return channels.
- Add route watchlists or email alerts only with explicit consent, unsubscribe support and a low-cost delivery design.
- Define a GA4 key event only after there is a real action worth measuring, such as a voluntary report subscription.
- Apply for AdSense when the production site has a stable body of original reports/guides and all policy checks pass. Google reviews the entire site and emphasizes original content, navigation and user experience; it does not promise approval or revenue.
- Keep ad density low enough that the official answer and provenance remain the page's primary purpose.

## Phase 7 — coverage expansion

Finland remains the next source candidate from the handoff. Add it only after source rights, robots rules, update cadence, parser stability and incremental search value are reverified. New countries should expand a working product, not hide weak engagement behind a larger URL count.

## Weekly scorecard

- Search Console: clicks, impressions, CTR and position by query/page cohort.
- Coverage: intended sitemap URLs, indexed evidence and excluded reasons kept separate.
- Content: dated issues published, source-backed guides published and stale claims corrected.
- Retention: RSS/Grow subscribers and return visits when available.
- Business: AdSense review state and actual revenue, never projected revenue presented as earned.
