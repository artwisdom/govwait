# GovWait authority and distribution checklist

Last reviewed: 2026-09-13 (America/New_York)

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
- [x] Request Google priority crawling for `/data/` after publication and owner
  approval. Search Console accepted it on 2026-09-13 and added the URL to a
  priority crawl queue; the URL was not indexed at inspection time.

Production receipt: GitHub run `34300806761` passed its 2,110-page build and
641/641 SEO-sitemap gate. The production-configured local build matched the
artifact; all four public CSVs, dataset metadata, OpenAPI, crawler files, 641
unique sitemap URLs, canonicals and the path-preserving `www` redirect passed.
This does not establish Google indexing, rankings, traffic, a directory listing
or revenue.

## Phase 5B — self-contained MCP package

Status: **private 0.1.0 release candidate verified on 2026-09-16; every external
publication remains a separate owner/account gate**.

1. [x] Research a repository/software licence. Apache 2.0 is recommended for
   GovWait-owned code only.
   The data notice does not license the source code or become covered by the
   software licence.
2. [x] Owner approved the Apache-2.0-for-code boundary. The local `LICENSE`
   reproduces the canonical terms, excludes data and other non-code material,
   and matches the package copy byte-for-byte.
3. [x] Make the MCP package self-contained. The built server defaults to its own
   three bundled exports and needs no parent-repository data at runtime.
4. [x] Add exact package allow-listing, deterministic provenance metadata,
   SHA-256 verification and an isolated `npm pack` smoke test. The verified
   tarball contains nine files, including the scoped licence and data notice,
   and no database, caches, logs, credentials, source files or tests.
5. [x] Prepare the npm identity `govwait-mcp` and exact MCP ownership linkage
   `io.github.artwisdom/govwait`. Both returned not-found responses on
   2026-09-16; neither is reserved, so recheck immediately before publication.
6. [x] Prepare `server.json`, pin GitHub repository ID `1342333561`, and validate
   it against the official `2025-12-11` schema plus local cross-file checks.
7. [x] Build and retain the audited private `0.1.0` release candidate plus its
   SHA-256 sidecar in the git-ignored package `release/` directory.
8. [ ] Owner approves committing and pushing the private release candidate to the
   public GitHub repository.
9. [ ] Owner signs into npm, enables the required publishing security and approves
   the public package publication.
10. [ ] After the npm package is publicly retrievable, revalidate `server.json`
   against the current schema, then owner-authorize publication to the
   [official MCP Registry](https://modelcontextprotocol.io/registry/quickstart).
11. [ ] Verify installation from a clean temporary directory before claiming the
   package or registry entry works.

Private-candidate receipt: `npm run prepare:rc` passed both 15-assertion MCP smoke
runs and all 20 metadata/licensing checks under Node 24.11.1. The exact nine-file
artifact was 118,606 bytes compressed / 4,239,539 bytes unpacked; all three data
hashes matched; the isolated server loaded 2,318 routes from its own package
directory. SHA-256:
`d27d372e8e14a421fe098234a53766049c055eb2e2bc2bc7bdc203d2f979d822`.
The official Registry schema check passed separately. `private: true` remains
active; nothing was published.

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
