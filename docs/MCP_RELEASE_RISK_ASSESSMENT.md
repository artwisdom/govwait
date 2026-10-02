# GovWait MCP release risk assessment

Last reviewed: 2026-09-20 (America/New_York)

This is a practical release-risk assessment, not legal advice. It does not
replace advice from a qualified lawyer for a specific commercial arrangement.

## Recommendation

The owner approved **Apache License 2.0 for GovWait-owned software code only** on
2026-09-16. It does not apply to the bundled government-source data.

The mixed-content package is now public as `govwait-mcp@0.1.0` and uses npm's
`SEE LICENSE IN LICENSE` form. The packaged `LICENSE` applies Apache 2.0 only to
GovWait-owned code, reproduces the canonical Apache 2.0 text, and expressly
excludes `data/` and other non-code material. `DATA-NOTICE.md` continues to
govern the bundled-data explanation and source-specific terms.

Why Apache 2.0 is the safest practical fit:

- it is permissive, which supports broad MCP client and agent adoption;
- it includes an explicit patent grant and patent-termination provision;
- it includes strong warranty and liability disclaimers; and
- its notice obligations provide a clearer audit trail than a very short licence.

MIT would be simpler, but it does not state the patent position as explicitly.
A copyleft licence such as GPL would add distribution obligations that are not
needed for this adoption-first package. Keeping all code unlicensed permanently
would maximize control but sharply reduce legitimate reuse and directory/client
adoption.

Primary references:

- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [Apache guidance for applying the licence](https://www.apache.org/legal/apply-license)
- [npm package licence field](https://docs.npmjs.com/cli/v7/configuring-npm/package-json/#license)

## Mixed-rights boundary

The central risk is not Apache 2.0 itself. It is a reader interpreting one
software licence as a grant over all packaged government information.

The package therefore keeps four separate controls:

1. `SEE LICENSE IN LICENSE` prevents the package metadata from implying that
   Apache 2.0 covers every packaged file.
2. `DATA-NOTICE.md` says that no GovWait software licence relicenses underlying
   government information.
3. Each data record retains its official `source_url` and source-specific
   `license_note`; the package also links to <https://govwait.com/data-license/>.
4. The package contains extracted factual fields, not government logos, page
   design or copied explanatory prose.

The repository uses the same boundary in a detector-friendly layout: the root
`LICENSE` contains only the unmodified Apache 2.0 terms, while
`SOFTWARE-SCOPE.md` identifies GovWait-owned software as the covered work and
expressly excludes government data and other non-code material. The published
package keeps its self-contained scoped `LICENSE`; the two files intentionally
do not match byte-for-byte because the package must carry its scope with it.

The source positions remain different: covered UK content generally uses OGL
v3.0; covered New Zealand Crown website content uses CC BY 3.0 NZ; Canada.ca
general terms and OGL-Canada are not interchangeable; and no explicit reuse
licence has been identified for the tracked UDI pages. See
`docs/DATA_REUSE_RISK_ASSESSMENT.md` for the source-by-source review.

## Risk rating

| Scenario | Severity | Likelihood | Score | Rating |
|---|---:|---:|---:|---|
| Publish one blanket software licence over code and bundled data | 3 — Moderate | 3 — Possible | 9/25 | YELLOW |
| Apache 2.0 limited to GovWait code, with explicit data exclusion and source notices | 3 — Moderate | 2 — Unlikely | 6/25 | YELLOW |
| Current public package with scoped licence, data notice and provenance | 3 — Moderate | 2 — Unlikely | 6/25 | YELLOW |

The residual 6/25 rating reflects the different source terms, not a known claim
or dispute. Escalate to counsel before selling bulk redistribution rights,
promising exclusivity, materially copying a source database or page, responding
to a rights-holder complaint, or adding a source whose terms are unclear.

## Release identities researched

Published npm package: **[`govwait-mcp@0.1.0`](https://www.npmjs.com/package/govwait-mcp/v/0.1.0)**.

- It is shorter and clearer than `govwait-mcp-server`.
- It does not depend on creating or controlling an npm organization scope.
- npm owner `artwisdom` published the audited `0.1.0` artifact on 2026-09-20.
- The public package exposes `mcpName: io.github.artwisdom/govwait`, and `latest`
  resolves to `0.1.0`.

Recommended official registry name: **`io.github.artwisdom/govwait`**.

- It matches the public GitHub owner/repository identity.
- The package's `mcpName` is an exact match, as required for npm ownership
  verification.
- The official Registry still returned HTTP 404 for that exact identity/version
  after publication on 2026-09-20, so no Registry listing exists yet.
- Metadata pins GitHub repository ID `1342333561` and subfolder
  `machine/mcp-server` to make the source identity more robust.

References:

- [Official MCP Registry quickstart](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx)
- [Official package-type and npm ownership rules](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/package-types.mdx)
- [Official Registry API](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/official-registry-api.md)

## Verified npm and official Registry 0.1.1 release

`machine/mcp-server/server.json` contains official-registry metadata for npm
package version `0.1.1`, `npx`, and local `stdio`. It passed 27/27 cross-file
metadata checks and official `mcp-publisher` 1.8.1 validation against the live
Registry service. The npm tarball has an exact nine-file allow-list and includes
the scoped `LICENSE` while intentionally excluding `server.json`; the publisher
read that local file during the separately authorized Registry submission.

The published audited artifact is `govwait-mcp-0.1.1.tgz`: 162,492 bytes
compressed / 6,562,302 bytes unpacked, with local/public SHA-256
`2a76788354551b12c50f452b03e39de454cb21119b9baee990863d890ebcbe28`.
The npm registry reports SHA-1
`10372162f345ed260ba050dc75d5e6b09e4dc7d3` and integrity
`sha512-2hjbVOIYGprfPLiZ3iSxa2Q4lgKZxOFjZbEuFgrKhaoztQ+GlEzJAWviT/hQ1esYyO6a7AhOzSinzTEIwoNnlQ==`.

Public-release source commit `32aec30` is on the public GitHub repository. A
clean temporary installation from the public npm registry passed all 21 MCP
assertions and loaded 2,316 routes from the installed package's own data. No
long-lived publishing token or trusted-publisher workflow was created. The
package is set to npm's strict `mfa=publish` policy: interactive 2FA is required
and automation/bypass tokens cannot publish.

Under a later explicit Registry-only gate, the official MCP Registry accepted
only `server.json` for version `0.1.1`. At that release checkpoint, exact-version
and latest endpoints returned HTTP 200 with status `active`, `isLatest: true`,
and published timestamp
`2026-09-27T16:37:58.861649Z`; exact-name/latest search returns one result.
Version 0.1.0 remained active in history with `isLatest: false`. The temporary
Registry session was logged out after verification. No Glama/other-directory
update, Cloudflare deployment or IndexNow notification occurred.

## Verified npm and official Registry 0.1.2 release

Version 0.1.2 is a documentation and release-metadata correction that preserves
the exact 0.1.1 bundled data and MCP behavior. npm serves the audited nine-file
artifact as `latest`; its public tarball is byte-for-byte identical to the local
candidate at SHA-256
`04837a57cb2d6d804e7e0b323e4ab9888988f5c4fd43c995f29f5def50ee8bf6`.
A clean installation passed all 21 MCP assertions with zero known
vulnerabilities.

Checksum-verified official `mcp-publisher` 1.8.1 accepted only the matching
0.1.2 `server.json`. Exact-version, latest and exact-name/latest search endpoints
return HTTP 200 with status `active`, `isLatest: true`, one search result and
published timestamp `2026-09-30T02:41:54.111089Z`. Version history preserves
active 0.1.1 and 0.1.0 as non-latest. The temporary Registry session was logged
out and its credential file removed after verification. No new GitHub PAT,
publishing token, trusted-publisher workflow, Glama/other-directory update,
deployment or IndexNow request was created.

## Verified Glama 0.1.2 release

Under later, separately approved Glama gates, the claimed listing synced to
exact GitHub commit `fa8fcbee979d259d41f5927c217106ed6bb6a233` and kept
Auto-Release off. The retained Debian Bookworm and Node 22 build configuration
used the parity-safe `npm exec -- tsc` compile path. Build-only test
[`01a0f8a3-fc04-7e06-abb9-7b412f95d5dc`](https://glama.ai/mcp/servers/artwisdom/govwait/admin/dockerfile/tests/01a0f8a3-fc04-7e06-abb9-7b412f95d5dc)
succeeded in 49.8 seconds with the audited 2,316-route dataset, MCP protocol
`2025-11-25`, server version 0.1.2, all four tools and the corrected public
README.

After a separate final confirmation, Glama published only that exact successful
test as release 0.1.2. Glama marks 0.1.2 latest, retains 0.1.1 and 0.1.0 in
history and keeps Auto-Release off. No npm or official Registry change,
other-directory submission, workflow, deployment, IndexNow request, outreach,
spend or account-setting change occurred in the Glama-only publication.

## Next gate

Continue read-only directory-propagation and discovery-traffic monitoring.
Another npm version, workflow, listing correction, other-directory submission,
outreach message or deployment remains a separate approval because publication
receipts do not prove discovery traffic, demand or revenue.
