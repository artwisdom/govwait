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

### Phase 6C — 0.1.1 npm publication

Status: **exact candidate verified, source pushed, and public npm package verified;
official MCP Registry and Glama releases both expose 0.1.1 as active/latest**.

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
- [x] At preflight, confirm npm exposed only `0.1.0` with `latest=0.1.0`, Registry
  0.1.0 remained active/latest, and exact Registry 0.1.1 returned HTTP 404.
- [x] Under a separate owner gate, commit and push the verified 0.1.1 source
  candidate and receipts to GitHub only. The tarball remains ignored and local;
  the changed paths do not match the production deployment workflow's push
  filter.
- [x] Under a separate owner gate and interactive security-key approval, publish
  only the exact audited tarball as `govwait-mcp@0.1.1`. npm records
  `latest=0.1.1`, nine files, 6,562,302 unpacked bytes, SHA-1
  `10372162f345ed260ba050dc75d5e6b09e4dc7d3` and integrity
  `sha512-2hjbVOIYGprfPLiZ3iSxa2Q4lgKZxOFjZbEuFgrKhaoztQ+GlEzJAWviT/hQ1esYyO6a7AhOzSinzTEIwoNnlQ==`.
  A new public download matches the retained artifact byte-for-byte at SHA-256
  `2a76788354551b12c50f452b03e39de454cb21119b9baee990863d890ebcbe28`.
- [x] Install `govwait-mcp@0.1.1` from the public registry in a clean temporary
  project. All 21 MCP assertions passed against 2,316 package-owned routes and
  npm audited 96 packages with zero vulnerabilities.
- [x] Under a later separate owner gate, publish only the validated 0.1.1
  `server.json` with checksum-verified official `mcp-publisher` 1.8.1. Exact and
  latest endpoints return active/latest 0.1.1, exact-name/latest search returns
  one result, and version history preserves active 0.1.0 as non-latest.
- [x] Sync Glama to exact GitHub commit `90e2d45` and pass build-only test
  `01a0e41a-3a3b-7107-b30a-e20beadfd22f`: exact audited 0.1.1 data, version
  0.1.1, 2,316 routes, protocol `2025-11-25`, and all four tools verified. The
  Glama-only compile step uses `npm exec -- tsc` so it cannot silently replace
  the published package data with newer site exports.
- [x] Commit and push the root-README accuracy correction, neutral validator
  wording and preflight records as GitHub-only commit `15224dbc`. GitHub
  confirms the commit and no Actions runs were created.
- [x] Re-sync Glama to exact GitHub commit `c09342e9`, confirm it contains the
  README correction, and pass corrected build-only test
  `01a0e42d-b3cd-7f6c-b47e-ba64cf1fc293` in 12.5 seconds with the exact audited
  2,316-route dataset, version 0.1.1, protocol `2025-11-25` and all four tools.
- [x] Under a separate final owner confirmation, create and publish Glama 0.1.1
  from that exact test. Glama marks it latest, retains 0.1.0 in history and
  keeps Auto-Release off.

Registry receipt: official 0.1.1 is active/latest with published timestamp
`2026-09-27T16:37:58.861649Z`; search count is one and 0.1.0 history remains
active/non-latest. The publisher session was logged out after verification. No
npm version, long-lived publishing token, workflow, Glama/other-directory
update, source change, commit, push, deployment, indexing request, outreach,
spend or account-setting change occurred in this Registry-only gate.

### Phase 6D — 0.1.2 packaged-README correction

Status: **documentation-only source pushed and the exact audited candidate
published and independently verified on npm; no 0.1.2 Registry, Glama or other
directory update has been made**.

- [x] Bump package, lockfile, runtime and draft Registry metadata consistently to
  0.1.2 without changing MCP tool logic.
- [x] Put `npx -y govwait-mcp` near the top of the packaged README, preserve the
  verified 0.1.1 publication baseline and remove the stale 0.1.0/latest wording.
- [x] Add a documentation-only release gate that refuses any drift from the
  exact public 0.1.1 bundled-data and provenance hashes.
- [x] Pass 21 direct MCP assertions, 31/31 metadata/licensing/README checks, the
  exact nine-file package audit and 22 isolated-tarball assertions.
- [x] Move only the affected transitive lockfile resolution from
  `ip-address@10.5.0` to patched 10.7.2, then pass a clean install and a
  zero-vulnerability npm audit across 117 dependencies.
- [x] Retain ignored local candidate `govwait-mcp-0.1.2.tgz`, 162,819 bytes
  packed / 6,563,251 bytes unpacked, SHA-256
  `04837a57cb2d6d804e7e0b323e4ab9888988f5c4fd43c995f29f5def50ee8bf6`,
  with a matching sidecar.
- [x] At preflight, confirm npm still had only 0.1.0 and 0.1.1 with
  `latest=0.1.1`, while the official Registry exact 0.1.2 endpoint remained
  HTTP 404.
- [x] Commit and push the verified source candidate as
  `efc90490438f05de4a802951315a4b828f09ecf5`; keep the ignored tarball local.
- [x] Publish the exact audited tarball with interactive npm security-key 2FA.
  npm now exposes 0.1.2 as `latest`, with nine files, 162,819 packed bytes,
  6,563,251 unpacked bytes, SHA-1
  `7d286f793030b97d943ba63c31a05c04ce1aa9ae`, and SHA-512 integrity
  `sha512-/l7/Qk9g8pXSgR8fz9EQ2QviNGnbJyLAsRHPLgw7QrclqPudD8gLMsdhWClEJ3wGTldSl5Hk2/9S03rjRj49KA==`.
- [x] Download npm's public tarball and confirm it is byte-for-byte identical to
  the audited local candidate, then pass all 21 MCP assertions from a fresh
  temporary installation with zero known vulnerabilities.
- [ ] Treat official Registry, Glama and other-directory updates as independent
  later approvals after npm publication is verified.

## Phase 5C — no-cost discovery and earned links

Status: **official Registry 0.1.1 active/latest; Glama 0.1.1 public/latest from
the corrected, byte-parity-safe build; Auto-Release remains off**.

Priority order after Phase 5B:

1. [x] Official MCP Registry — canonical machine-tool discovery is active/latest
   for `io.github.artwisdom/govwait@0.1.1`; version history preserves 0.1.0.
2. [x] [Glama](https://glama.ai/mcp/servers/artwisdom/govwait) — public listing
   claimed by GitHub owner `artwisdom`. The first 0.1.1 test exposed a
   data-parity flaw in `npm run build` and was not released. After narrowing the
   Glama-only step to `npm exec -- tsc`, pushing the README correction and
   re-syncing to exact commit `c09342e9`, build-only test
   `01a0e42d-b3cd-7f6c-b47e-ba64cf1fc293` passed in 12.5 seconds with the exact
   audited 2,316-route data, MCP `2025-11-25` and all four tools. Glama 0.1.1 is
   now public/latest, 0.1.0 remains in history and Auto-Release is off.
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
