# Incident record — UDI source closure blocked shared refreshes

**Incident start:** 2026-09-04

**Recovery candidate verified locally:** 2026-09-24

**Production recovery released:** 2026-09-24 EDT (2026-09-25 UTC)

**Production status:** Resolved; refresh and final public deployment verified

## Summary

Norway UDI's `robots.txt` endpoint began returning HTTP 403 to GovWait's honest,
contact-bearing collector. The existing fail-closed fetcher correctly refused to
continue, but the all-or-nothing orchestrator then stopped the Canada, United
Kingdom and New Zealand refreshes too. No partial, fabricated or unverified data
was exported or deployed.

## User impact

- Production remained available on its last verified snapshot.
- Canada, UK and New Zealand could not accumulate new observations while every run
  still attempted the closed UDI source.
- Norway's 19 previously verified records remained intact, but the public product
  had no machine-readable way to distinguish a retained snapshot from an actively
  collected source.

## Root cause

The external trigger was UDI returning HTTP 403 for `robots.txt`. GovWait will not
spoof a browser, bypass an access control, rotate infrastructure or probe UDI's
personalised questionnaire.

The internal design problem was source coupling: every configured collector was
treated as actively fetchable, so one permanently closed source prevented all
healthy sources from refreshing. The data model also lacked an explicit retained
source state.

A second internal issue appeared during the production proof. The refresh workflow
committed data with GitHub's built-in `GITHUB_TOKEN` and assumed that push would
start `deploy-site`. GitHub suppresses ordinary workflow chaining from that token,
so the data commit succeeded but no push-triggered deployment began. The Phase 6A
operator noticed the missing run and dispatched the exact commit manually; no
stale data was mislabeled as deployed.

## Containment and recovery

The released recovery:

1. Adds an explicit `ACTIVE_SOURCES` registry containing only the eight currently
   collectable sources.
2. Records UDI as `source_unavailable` from 2026-09-04 in a separate source policy.
3. Preserves all 19 UDI entities and observations append-only and freezes their
   last successful verification time.
4. Rejects any post-closure UDI observation, any missing retained route, and any
   active source carrying a non-active state.
5. Exposes collection status, status date, explanation and last verification in
   JSON, CSV, OpenAPI, pages and the MCP server.
6. Keeps active-source coverage and freshness failures blocking; the change does
   not make healthy sources optional.
7. Calls the existing deployment workflow directly after a data-changing refresh,
   pins it to the exact bot commit, refuses a stale commit if `main` has moved,
   skips deployment on no-change runs, guards against a duplicate bot-push run,
   and propagates deployment failure to the parent refresh. It requires no personal
   token, new secret or broader account permission.

## Local verification evidence

- One approved live local refresh completed all eight active sources and did not
  issue a UDI fetch.
- UDI before/after comparison: 19 entities, 19 observations, zero additions, zero
  deletions, and unchanged `robots_checked_at` / last-verification evidence.
- Pipeline validation: 35/35 checks.
- Parser/history/source-policy tests: 15/15.
- Generated dataset: 2,316 retained routes, 6,617 public history observations and
  7,285 forward-looking estimates.
- Site: 2,112 HTML pages, 634 intentionally indexable pages and exactly 634 sitemap
  URLs.
- Static API/OpenAPI conformance: 2,613 files.
- Unpublished MCP `0.1.1` candidate: direct and clean-package smoke suites passed;
  Norway has no `current_value` and exposes its 45-day value only as a dated
  `last_verified_source_snapshot`.

The live INZ selector now lists 132 visas and no longer lists Post Study Work Visa.
The two corresponding percentile entities were deactivated without deleting their
history or inventing a replacement route.

## Production recovery evidence

- Recovery commit `d31ee85c667360eb1c3ccc6702723399a951b1c0` deployed green in
  `deploy-site` run `36081326233` to `01dac9d5.govwait.pages.dev`; its blocking
  build/SEO gate passed and IndexNow accepted 665 changed URLs with HTTP 200.
- Manual proof run `36081437732` completed all eight active sources, logged
  `COLLECTION PAUSED — prior records retained; no fetch attempted` for UDI, passed
  all 35 checks, exported the verified counts above and created data commit
  `5a99df2904c493e79254e8af921ca5bef1980aec`.
- Because the built-in token suppressed the expected push-triggered run, the exact
  bot commit was deployed manually in run `36082052053` to
  `81c691b0.govwait.pages.dev`. The final SEO audit passed at 2,112 HTML / 634
  indexable / 634 sitemap URLs, and IndexNow accepted 603 changed URLs with HTTP
  200.
- `govwait.com` matched that immutable artifact byte-for-byte for representative
  HTML and JSON. Homepage, Norway, retained UDI, and active Canada pages returned
  HTTP 200; the removed Post Study Work Visa page/API returned 404; the sitemap
  contained 634 unique URLs; and the path-preserving `www` redirect returned 301.
- Public API/CSV verification found eight active sources, one unavailable source,
  exactly 19 retained UDI current/history rows, no post-closure UDI history, and an
  unchanged UDI last-successful-verification timestamp.
- Phase 6B workflow hardening passed actionlint 1.7.12, 17/17 structural assertions,
  and an executable revision-gate test that accepted current `main` and refused the
  stale pre-refresh commit.

## Current boundary

The site/API recovery and refresh-to-deploy hardening are released. Public npm and
MCP Registry consumers remain on the previously verified `govwait-mcp@0.1.0`;
publishing the already-audited `0.1.1` source-state behavior remains a later,
separate approval. No Google indexing request, directory update, outreach, paid
action or account-setting change was part of this recovery.
