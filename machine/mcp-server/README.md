# GovWait MCP Server

Exposes the GovWait dataset (officially published government processing times, with
provenance and history) to AI agents over the Model Context Protocol (stdio).

**Tools**: `search_entities`, `get_entity`, `get_latest_value`, `compare_values`.
Every response carries `source_url`, the agency's own update date when supplied
(otherwise GovWait's first-observed date), our verification timestamp, source
collection status, the source unit, and the attribution requirement. When a source
is unavailable, `current_value` and `value_days` are `null`; its retained value is
returned only as `last_verified_value` with `value_context` set to
`last_verified_source_snapshot`.

## Build and verify locally

```bash
cd machine/mcp-server
npm ci
npm run verify
```

To retain the exact audited release candidate and its SHA-256 sidecar in the
git-ignored `release/` directory, run `npm run prepare:rc`.

`npm run build` copies the three validated pipeline exports into this package's
own `data/` directory, writes deterministic SHA-256 provenance metadata, and
compiles `dist/index.js`. The server defaults to those package-owned files, so it
does not depend on the parent repository at runtime. Advanced local users can
still override the location with `GOVWAIT_DATA_DIR=/path/to/exports`; that
directory must contain the three exports. A matching `provenance.json` is used
when present; the package-owned default always requires it.

`npm run audit:package` creates a tarball in a temporary directory, enforces the
exact nine-file package allow-list, rejects secret/database/cache/log/source/test
artifacts, verifies every bundled data hash, unpacks the tarball into a clean
temporary project with the already-locked `npm ci` dependency tree, and runs the
complete MCP smoke test against that isolated copy. The temporary package is
deleted afterward; no registry access is needed.

The verified public release remains
[`govwait-mcp@0.1.0`](https://www.npmjs.com/package/govwait-mcp/v/0.1.0), and its
`mcpName` exactly matches `io.github.artwisdom/govwait` in the official MCP
Registry metadata. Version `0.1.0` uses a `SEE LICENSE IN LICENSE` field that
points to Apache 2.0 terms limited to GovWait-owned software code.
`DATA-NOTICE.md` and the licence scope expressly exclude the bundled
government-source data. A clean public-registry installation passed the full MCP
smoke suite. npm publishing requires interactive 2FA and disallows
automation/bypass tokens. Official `mcp-publisher` 1.8.1 validates `server.json`,
and the
[official Registry listing](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.artwisdom%2Fgovwait/versions/0.1.0)
is active and latest for version `0.1.0`.

The files in this checkout are an unpublished `0.1.1` recovery candidate. They add
explicit source-collection state and prevent retained Norway snapshots from being
described as current. Building or verifying this candidate does not publish it to
npm or update the MCP Registry.

## Register with Claude Code

```bash
claude mcp add govwait -- node /ABSOLUTE/PATH/TO/govwait/machine/mcp-server/dist/index.js
```

## Register with Claude Desktop

Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "govwait": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/govwait/machine/mcp-server/dist/index.js"]
    }
  }
}
```

## Try it

Ask the connected agent: *"How long is a Canada visitor visa taking from India right
now, and how does that compare to Nigeria and the Philippines?"* — it should call
`compare_values` and answer with dated, sourced figures.

For New Zealand, try *"What are the current Visitor Visa processing times?"* The
`nz-visitor-visa` service returns both INZ's 50% and 80% working-day metrics.

For Norway, try *"What was UDI's last verified visitor-visa waiting time, and is
the source still available to GovWait?"* The server returns the dated,
table-backed snapshot, its official source page, and the `source_unavailable`
state without presenting that snapshot as current.

## Data provenance and reuse

Every response retains the official source URL, source date, verification time,
unit, and GovWait attribution notice. `data/provenance.json` records the exact
dataset generation time, row counts, byte sizes, and SHA-256 hashes. Underlying
government information is not relicensed by GovWait; follow the source-specific
terms at <https://govwait.com/data-license/> and the packaged
[`DATA-NOTICE.md`](DATA-NOTICE.md).

## Distribution

The local
[`server.json`](https://github.com/artwisdom/govwait/blob/main/machine/mcp-server/server.json)
is valid MCP Registry metadata for the public npm package. Registry and other
directory submissions remain separate owner actions in the
[distribution checklist](https://github.com/artwisdom/govwait/blob/main/docs/DISTRIBUTION_CHECKLIST.md).
