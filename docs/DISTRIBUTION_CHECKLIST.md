# GovWait authority and distribution checklist

Last reviewed: 2026-09-08 (America/New_York)

This checklist separates a working local package, a public deployment, a
directory submission and actual discovery. None proves the next stage.

## Phase 5A — citable dataset surface

Status: **production-verified on 2026-09-08 at commit `fd7ba67`**.

- [x] Add a canonical `/data/` landing page with Dataset structured data.
- [x] Generate current, history, forward-looking and source-register CSV files
  from the same validated exports as the JSON API.
- [x] Publish `/api/v1/dataset.json` with counts, columns and provenance.
- [x] Document every file in OpenAPI and verify its contract in CI.
- [x] Add a root GitHub README with live data, method and verification links.
- [x] Replace the blanket data-licence claim with source-specific guidance.
- [x] Add blocking SEO checks for the landing page, structured data, downloads,
  sitemap dates and AI-discovery file.
- [x] Obtain owner approval to commit, push and deploy.
- [x] Verify Cloudflare artifact `ca3bad6a.govwait.pages.dev` and the public apex.
- [x] Record the 656-URL IndexNow HTTP 200 response as a discovery receipt only.
- [ ] Request Google priority crawling for `/data/` only after it is public and
  only with owner approval.

Production receipt: GitHub run `34300806761` passed its 2,110-page build and
641/641 SEO-sitemap gate. The production-configured local build matched the
artifact; all four public CSVs, dataset metadata, OpenAPI, crawler files, 641
unique sitemap URLs, canonicals and the path-preserving `www` redirect passed.
This does not establish Google indexing, rankings, traffic, a directory listing
or revenue.

## Phase 5B — self-contained MCP package

Status: **not started; separate publication and account gate**.

1. Decide a repository/software licence. The data notice does not automatically
   license the source code.
2. Make the MCP package self-contained. It currently reads the parent
   repository's `data/exports` files and cannot work as a standalone npm install.
3. Add package allow-listing, provenance metadata, tests and an `npm pack`
   contents audit. Never include the database, caches, logs or credentials.
4. Select an available npm package name and add the official MCP package-name
   linkage (`mcpName`) only after validating the final identity.
5. Owner signs into npm, enables the required publishing security and approves
   the public package publication.
6. After the npm package is publicly retrievable, create and validate
   `server.json`, then owner-authorize publication to the
   [official MCP Registry](https://modelcontextprotocol.io/registry/quickstart).
7. Verify installation from a clean temporary directory before claiming the
   package or registry entry works.

The official registry currently requires a package to be public before its
registry metadata is published. GitHub-authenticated server names must match the
registry's documented namespace rules. Recheck those rules immediately before
publication because the registry is still described as a preview.

## Phase 5C — no-cost discovery and earned links

Status: **research only; every external submission or message needs separate
owner approval**.

Priority order after Phase 5B:

1. Official MCP Registry — canonical machine-tool discovery.
2. [Glama](https://glama.ai/) — public GitHub-based MCP discovery and automated
   checks; confirm the current submission workflow before posting.
3. [PulseMCP](https://www.pulsemcp.com/api) — confirm whether the official
   registry import already discovers GovWait before making a manual submission.
4. Smithery — optional only if its current account/API and packaging requirements
   add useful reach beyond the official registry.
5. A small, hand-reviewed outreach cohort using one original change report or
   dataset example. No mass email, impersonation, paid links or immigration
   advice.

Track accepted listings, earned links and referral visits separately. A form
submission, sent email or IndexNow response is not a listing, backlink, visit,
indexing result or revenue.
