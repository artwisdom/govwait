# GovWait growth plan

Last reviewed: 2026-09-04 (America/New_York)

This plan separates technical discovery, crawling, indexing, traffic, audience retention, ad approval and revenue. None proves the next. Growth work must preserve GovWait's official-source boundaries, append-only history, polite collection rules, honest dates and no-hype language.

## Current evidence

### Google Search Console

The first Search Console window (August 21-31, 2026) showed:

- 12 clicks from 3,854 impressions;
- 0.3% click-through rate;
- average position 44.3;
- 476 query rows and 283 pages with impressions; and
- 533 URLs reported indexed and 1,063 not indexed in the page-indexing report.

The page-indexing totals are not a clean ratio against GovWait's intended sitemap set because the report can include discovered noindex URLs, older states and different canonical timing. Production now has 638 intended indexable URLs after the September 1 data refresh produced a second permanent issue. Treat 533 as encouraging early coverage, not proof that 84% of the exact intended set is indexed.

Demand signals already visible:

- New Zealand 2021 Resident Visa and Critical Purpose searches are the largest query cluster, mostly in positions 28-54.
- Several current New Zealand visa pages have 270-309 impressions but average positions in the 36-71 range.
- Near-win Canadian pages include Private Refugee from Pakistan (93 impressions, position 4.3), Visitor Visa from Colombia (35, position 6.5), Visitor Visa from Nepal (30, position 5.2), Study Permit from Ghana (23, position 8.9) and Visitor Visa from Egypt (20, position 4.7).

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

Start immediately after Phase 3 is live; publishing can continue weekly while results accumulate.

1. Publish 2-4 substantive pages per week only where Search Console shows real demand and an official source can answer it.
2. Next candidate: a Critical Purpose Visitor Visa closed-route guide, after a fresh official-source review.
3. Deepen the high-impression New Zealand pages with route-specific definitions, related current routes and clearer intent matching.
4. Improve titles and opening answers on near-win Canadian pages without changing their URLs or source meaning.
5. Recheck each cohort after 28 days. Measurement takes time even when implementation does not; keep shipping bounded cohorts instead of waiting idle.

Gate: no mass page generation. Google explicitly recommends people-first, original content and warns against automation mainly intended to attract search traffic.

## Phase 5 — authority and distribution

Use the permanent change reports as the linkable asset. After a separate owner approval for external posting:

- add the report feed and examples to the GitHub README;
- submit the open dataset/API to suitable no-cost public data and AI-tool directories after source-license review;
- prepare a concise weekly change summary that links to the full evidence page;
- contact a small, relevant set of journalists, immigration researchers and community moderators with the data, not promotional claims; and
- never pose as a user, mass-message communities or offer immigration advice.

Measure earned links, referral visitors and returning users. A sent message is not a backlink or traffic result.

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
