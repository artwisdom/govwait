# Incident record — UDI source closure blocked shared refreshes

**Incident start:** 2026-09-04

**Recovery candidate verified locally:** 2026-09-24
**Production status:** Not yet released; the last verified production snapshot remains live

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

## Containment and recovery

The recovery candidate:

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

## Remaining release boundary

This document records a local candidate only. No commit, push, GitHub Actions run,
Cloudflare deployment, IndexNow request, Google indexing request, npm publication,
MCP Registry update, directory submission, outreach, paid action or account change
is part of the recovery verification.

Before production release, push the exact verified candidate, allow the normal
deployment gates to pass, and run one manual `refresh-data` workflow to prove the
same behavior on GitHub's runner. Publishing MCP `0.1.1` remains a later, separate
approval.
