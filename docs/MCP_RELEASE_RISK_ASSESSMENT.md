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

## Verified npm release and unexecuted Registry action

`machine/mcp-server/server.json` contains official-registry metadata for npm
package version `0.1.0`, `npx`, and local `stdio`. It passed the 20-check
cross-file validator and official `mcp-publisher` 1.8.1 validation against the
live Registry service on 2026-09-20. The npm tarball has an exact nine-file
allow-list and includes the scoped `LICENSE` while intentionally excluding
`server.json`; the publisher reads that local file during a later authorized
Registry submission.

The published audited artifact is `govwait-mcp-0.1.0.tgz`: 118,593 bytes
compressed / 4,239,563 bytes unpacked, with local SHA-256
`e881e02555f3133124262c69f48cf7706259595519f5ad25eb1c67338c15ebda`.
The npm registry reports SHA-1
`412c5b6c4c0ada6c412c5f105b6118b20e6ccfd0` and integrity
`sha512-u0ksXNhTREZI0rvPfCZ27qTDupI4ZpFA2lopo9rhGMy6RgXcjb6ZQZZA6XgJ0OhoIVqBKJA12YRrBwMucrXeVg==`.

Public-release source commit `ec284ef` is on the public GitHub repository. A
clean temporary installation from the public npm registry passed all 15 MCP
assertions and loaded 2,318 routes from the installed package's own data. No
publishing token or trusted-publisher workflow was created. The package is set to
npm's strict `mfa=publish` policy: interactive 2FA is required and
automation/bypass tokens cannot publish. No MCP Registry submission, Cloudflare
deployment, IndexNow notification or other directory submission occurred during
the npm release. Under a later explicit gate, the official MCP Registry accepted
only `server.json` for version `0.1.0`; the listing is active and latest. The
temporary Registry login was logged out after verification.

## Next gate

The next release gate is committing the verified Registry receipt. Phase 5C may
then research whether the official listing is imported elsewhere before any
manual directory submission. Another npm version, workflow, directory
submission, outreach message and deployment remain separate approvals because
the Registry remains a preview service.
