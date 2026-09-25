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

Status: **public `govwait-mcp@0.1.0` and official MCP Registry
`io.github.artwisdom/govwait@0.1.0` are verified active**.

1. [x] Research a repository/software licence. Apache 2.0 is recommended for
   GovWait-owned code only.
   The data notice does not license the source code or become covered by the
   software licence.
2. [x] Owner approved the Apache-2.0-for-code boundary. The package's scoped
   `LICENSE` travels with `DATA-NOTICE.md`. The repository keeps the unmodified
   Apache terms in root `LICENSE` for machine detection and the controlling
   code-only/data-exclusion boundary in `SOFTWARE-SCOPE.md`.
3. [x] Make the MCP package self-contained. The built server defaults to its own
   three bundled exports and needs no parent-repository data at runtime.
4. [x] Add exact package allow-listing, deterministic provenance metadata,
   SHA-256 verification and an isolated `npm pack` smoke test. The verified
   tarball contains nine files, including the scoped licence and data notice,
   and no database, caches, logs, credentials, source files or tests.
5. [x] Establish the npm identity `govwait-mcp` and exact MCP ownership linkage
   `io.github.artwisdom/govwait`. The public npm package now exposes the exact
   matching `mcpName` required for ownership verification.
6. [x] Prepare `server.json`, pin GitHub repository ID `1342333561`, and validate
   it against the official `2025-12-11` schema plus local cross-file checks.
7. [x] Build and retain the audited `0.1.0` release artifact plus its SHA-256
   sidecar in the git-ignored package `release/` directory.
8. [x] After owner approvals, push public-release source commit `ec284ef` to
   GitHub `main`. No workflow or deployment was created or run.
9. [x] Publish the exact audited `govwait-mcp@0.1.0` artifact under npm owner
   `artwisdom` using interactive security-key authentication. Harden the package
   with npm's strict `mfa=publish` policy: interactive 2FA is required and
   automation/bypass tokens cannot publish. No publishing token or trusted
   publisher was created.
10. [x] Revalidate `server.json` with official `mcp-publisher` 1.8.1 against the
    live Registry service. It was valid and the exact Registry identity/version
    returned HTTP 404 immediately before publication.
11. [x] Install from the public npm registry in a clean temporary directory and
    run the complete smoke suite before claiming the npm package works.
12. [x] Under separate owner approval, submit to the
    [official MCP Registry](https://modelcontextprotocol.io/registry/quickstart)
    with interactive GitHub authentication, then verify the exact public listing.

Public-release receipt: `npm run prepare:rc` passed both 15-assertion MCP smoke
runs and all 20 metadata/licensing checks under Node 24.11.1. The exact nine-file
artifact was 118,593 bytes compressed / 4,239,563 bytes unpacked; all three data
hashes matched; the isolated server loaded 2,318 routes from its own package
directory. Local SHA-256:
`e881e02555f3133124262c69f48cf7706259595519f5ad25eb1c67338c15ebda`.
The public registry reports SHA-1
`412c5b6c4c0ada6c412c5f105b6118b20e6ccfd0` and integrity
`sha512-u0ksXNhTREZI0rvPfCZ27qTDupI4ZpFA2lopo9rhGMy6RgXcjb6ZQZZA6XgJ0OhoIVqBKJA12YRrBwMucrXeVg==`.
A clean public-registry install repeated all 15 assertions successfully.
Authenticated npm 11.19.1 command
`npm access set mfa=publish govwait-mcp` exited 0 after security-key approval.
The client maps that policy to `publish_requires_tfa=true` and
`automation_token_overrides_tfa=false`.

Official Registry receipt: `mcp-publisher` 1.8.1 reported successful publication
of `io.github.artwisdom/govwait` version `0.1.0`. The
[exact-version API](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.artwisdom%2Fgovwait/versions/0.1.0)
and exact-name/version search both returned HTTP 200. Registry metadata reports
`active`, `isLatest: true`, `publishedAt: 2026-09-21T00:59:17.656115Z`, and one
exact search result. The temporary Registry login was logged out and the
checksum-verified publisher files were deleted.

GitHub-only receipt: commit `ba830db9201b637539e84e57613f76fa45ac2b45`
is present on `artwisdom/govwait` `main`. This published source code and licence
to GitHub only; it did not publish the npm package, submit Registry metadata,
deploy Cloudflare Pages or send IndexNow URLs.

The official Registry currently requires a package to be public before its
metadata is submitted, and npm ownership verification requires the package's
`mcpName` to exactly match the Registry server name. Both conditions are now
satisfied. Official `mcp-publisher` 1.8.1 reports `server.json` valid, and the
Registry now reports the published version active. The Registry remains a
preview, so its status must still be monitored honestly.

### Phase 6C — 0.1.1 local publication preflight

Status: **exact candidate verified and source pushed; package remains unpublished**.

- [x] Synchronize all three bundled files to production export generation
  `2026-09-25T01:25:45.254Z` and verify byte-for-byte SHA-256 equality.
- [x] Rebuild and pass direct, isolated-tarball and independent clean-install MCP
  smoke suites, including active-source and closed-source behavior.
- [x] Enforce the exact nine-file allow-list, scoped code-only Apache terms,
  separate government-data notice and zero-vulnerability dependency audit.
- [x] Retain the exact ignored artifact and matching SHA-256 sidecar:
  `govwait-mcp-0.1.1.tgz`, 162,492 bytes packed / 6,562,302 bytes unpacked,
  SHA-256 `2a76788354551b12c50f452b03e39de454cb21119b9baee990863d890ebcbe28`.
- [x] Correct the Registry description to its live 100-character limit and pass
  checksum-verified official `mcp-publisher` 1.8.1 validation; enforce the limit
  in the local release validator.
- [x] Confirm npm exposes only `0.1.0` with `latest=0.1.0`, Registry 0.1.0 remains
  active/latest, and exact Registry 0.1.1 returns HTTP 404.
- [x] Under a separate owner gate, commit and push the verified 0.1.1 source
  candidate and receipts to GitHub only. The tarball remains ignored and local;
  the changed paths do not match the production deployment workflow's push
  filter.
- [ ] Publish the exact audited tarball to npm only after a separate owner gate
  and interactive 2FA, then verify a new clean public-registry installation.
- [ ] Update the official MCP Registry only after npm 0.1.1 is public and under a
  later separate owner gate; update Glama only after another explicit gate.

Preflight boundary: the subsequent GitHub-only source push is the only external
change. No npm publication, Registry/Glama/directory update, token/workflow,
deployment, indexing request, outreach, spend or account change occurred.

## Phase 5C — no-cost discovery and earned links

Status: **official Registry active; Glama listing claimed and build-tested;
repository-readiness fix remains local only**.

Priority order after Phase 5B:

1. [x] Official MCP Registry — canonical machine-tool discovery is active for
   `io.github.artwisdom/govwait@0.1.0`.
2. [x] [Glama](https://glama.ai/mcp/servers/artwisdom/govwait) — public listing
   claimed by GitHub owner `artwisdom`. Auto-Release is off. Build-only test
   `01a0cc04-a9e8-7f71-9017-f1be4e441241` succeeded in 57.4 seconds against
   commit `64db085`, started the container, negotiated MCP and found all four
   tools. No Glama release exists yet. The local repository-readiness candidate
   adds `glama.json` and changes GitHub Licensee detection from `NOASSERTION` to
   an exact Apache-2.0 match without changing the published package's scoped
   licence. This revision contains that source change; Glama has not synced or
   released it.
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
