# GovWait MCP release risk assessment

Last reviewed: 2026-09-16 (America/New_York)

This is a practical release-risk assessment, not legal advice. It does not
replace advice from a qualified lawyer for a specific commercial arrangement.

## Recommendation

The owner approved **Apache License 2.0 for GovWait-owned software code only** on
2026-09-16. It does not apply to the bundled government-source data.

The mixed-content npm package remains `private: true` and now uses npm's
`SEE LICENSE IN LICENSE` form. The local `LICENSE` applies Apache 2.0 only to
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

1. `private: true` remains active, while `SEE LICENSE IN LICENSE` prevents the
   package metadata from implying that Apache 2.0 covers every packaged file.
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
| Current private, scoped-licence release candidate | 3 — Moderate | 1 — Remote | 3/25 | GREEN |

The residual 6/25 rating reflects the different source terms, not a known claim
or dispute. Escalate to counsel before selling bulk redistribution rights,
promising exclusivity, materially copying a source database or page, responding
to a rights-holder complaint, or adding a source whose terms are unclear.

## Release identities researched

Recommended npm package: **`govwait-mcp`**.

- It is shorter and clearer than `govwait-mcp-server`.
- It does not depend on creating or controlling an npm organization scope.
- Live public npm lookups for `govwait-mcp`, `govwait-mcp-server`, and
  `@artwisdom/govwait-mcp` returned `E404` on 2026-09-16. That is an availability
  snapshot, not a reservation or guarantee.

Recommended official registry name: **`io.github.artwisdom/govwait`**.

- It matches the public GitHub owner/repository identity.
- The package's `mcpName` is an exact match, as required for npm ownership
  verification.
- The official registry returned HTTP 404 for that exact identity on
  2026-09-16. That is also an availability snapshot, not a reservation.
- Draft metadata pins GitHub repository ID `1342333561` and subfolder
  `machine/mcp-server` to make the source identity more robust.

References:

- [Official MCP Registry quickstart](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/quickstart.mdx)
- [Official package-type and npm ownership rules](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/package-types.mdx)
- [Official Registry API](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/official-registry-api.md)

## Prepared but not executed

`machine/mcp-server/server.json` contains draft official-registry metadata
for npm package version `0.1.0`, `npx`, and local `stdio`. It passed the official
`2025-12-11` JSON schema. The private release candidate also passed a 20-check
cross-file validator. The npm tarball has an exact nine-file allow-list and
includes the scoped `LICENSE` while intentionally excluding
`server.json`; the publisher reads that local file during a later authorized
registry submission.

The retained private candidate is `govwait-mcp-0.1.0.tgz`: 118,606 bytes
compressed / 4,239,539 bytes unpacked, with SHA-256
`d27d372e8e14a421fe098234a53766049c055eb2e2bc2bc7bdc203d2f979d822`.

No npm account or package was created or changed. No name was reserved. No
external licence distribution, npm publication, MCP Registry submission,
commit, push, deployment or directory submission occurred. The approved licence
and release candidate exist only in the local working tree.

## Next gate

The next gate is a separate approval to commit and push this private release
candidate to the public GitHub repository. Actual npm publication and actual MCP
Registry publication remain later, separate account/publication gates.
Immediately before either publication, recheck both names and the official
registry schema because availability can change and the Registry is still a
preview service.
