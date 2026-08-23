# GovWait MCP Server

Exposes the GovWait dataset (officially published government processing times, with
provenance and history) to AI agents over the Model Context Protocol (stdio).

**Tools**: `search_entities`, `get_entity`, `get_latest_value`, `compare_values`.
Every response carries `source_url`, the agency's own update date when supplied
(otherwise GovWait's first-observed date), our verification timestamp, the source
unit, and the attribution requirement.

## Build & test

```bash
cd machine/mcp-server
npm install
npm run build     # tsc -> dist/index.js
npm run smoke     # spawns the server, exercises the protocol, asserts outputs
```

Reads `data/exports/{latest,history}.json` produced by the pipeline. Override the
location with `GOVWAIT_DATA_DIR=/path/to/exports`.

## Register with Claude Code

```bash
claude mcp add govwait -- node /ABSOLUTE/PATH/TO/data-moat-engine/machine/mcp-server/dist/index.js
```

## Register with Claude Desktop

Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "govwait": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/data-moat-engine/machine/mcp-server/dist/index.js"]
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

## Distribution (owner steps — see DEPLOYMENT_GUIDE.md)

Directory submissions (PulseMCP, mcp.so, Glama, Smithery) are prepared as a checklist
in the deployment guide. Nothing is published from this repo automatically.
