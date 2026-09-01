#!/usr/bin/env node
/**
 * GovWait MCP server — official government processing times over stdio.
 * Reads the pipeline's JSON exports; no network, no database, no keys.
 * Data dir override: GOVWAIT_DATA_DIR (defaults to ../../data/exports).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.GOVWAIT_DATA_DIR || path.resolve(HERE, "..", "..", "..", "data", "exports");

type Obs = {
  value_raw: string; value_days: number | null; unit_original: string | null; status: string;
  effective_date: string; retrieved_at: string; source_url: string;
};
type Rec = {
  id: string; jurisdiction: string; service_key: string; service_name: string;
  service_category: string; metric_type: string; applicant_country: string | null; applicant_country_name: string | null;
  value_raw: string; value_days: number | null; unit_original: string | null; status: string;
  effective_date: string; retrieved_at: string; source_url: string;
};

const latest = JSON.parse(readFileSync(path.join(DATA_DIR, "latest.json"), "utf8"));
const historyDoc = JSON.parse(readFileSync(path.join(DATA_DIR, "history.json"), "utf8"));
const forwardDoc = JSON.parse(readFileSync(path.join(DATA_DIR, "forward-looking.json"), "utf8"));
const records: Rec[] = latest.records;
const history: Record<string, Obs[]> = historyDoc.entities;
const forward: Record<string, unknown> = forwardDoc.entities;

const ATTRIBUTION = "Values are official government publications tracked by GovWait (CC BY 4.0 — attribute GovWait and the originating agency). Not legal advice.";

function present(r: Rec) {
  return {
    entity_id: r.id,
    jurisdiction: r.jurisdiction,
    service: r.service_name,
    service_key: r.service_key,
    metric_type: r.metric_type,
    applicant_country: r.applicant_country_name ?? null,
    current_value: r.status === "ok" ? r.value_raw : `no published time (${r.status})`,
    value_days: r.value_days,
    unit_original: r.unit_original,
    official_last_updated: r.effective_date,
    verified_at: r.retrieved_at,
    source_url: r.source_url,
  };
}

const server = new McpServer({ name: "govwait", version: "0.1.0" });

server.registerTool("search_entities", {
  description: "Search tracked government processing-time routes by free text (service and/or country, e.g. 'canada study permit pakistan'). Returns matching entity_ids with current values.",
  inputSchema: {
    query: z.string().describe("Free-text query; terms are matched against jurisdiction, service name and applicant country"),
    jurisdiction: z.string().length(2).optional().describe("Optional ISO country filter for the government, e.g. CA, GB, NZ or NO"),
    limit: z.number().int().min(1).max(50).default(10),
  },
}, async ({ query, jurisdiction, limit }) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = records
    .filter(r => !jurisdiction || r.jurisdiction === jurisdiction.toUpperCase())
    .map(r => {
      const jurisdictionName = r.jurisdiction === "CA" ? "canada"
        : r.jurisdiction === "NZ" ? "new zealand nz"
        : r.jurisdiction === "NO" ? "norway norwegian udi"
        : "uk united kingdom";
      const hay = `${jurisdictionName} ${r.service_name} ${r.applicant_country_name ?? ""} ${r.applicant_country ?? ""}`.toLowerCase();
      const hits = terms.filter(t => hay.includes(t)).length;
      return { r, hits };
    })
    .filter(x => x.hits === terms.length || (terms.length > 2 && x.hits >= terms.length - 1))
    .sort((a, b) => b.hits - a.hits || (a.r.value_days ?? Infinity) - (b.r.value_days ?? Infinity))
    .slice(0, limit);
  return { content: [{ type: "text" as const, text: JSON.stringify({ matches: scored.map(x => present(x.r)), attribution: ATTRIBUTION }, null, 2) }] };
});

server.registerTool("get_entity", {
  description: "Get one route by entity_id (e.g. 'ca-visitor-visa--in'): current value plus full recorded history. Forward-looking IRCC routes also include application-month cohort estimates.",
  inputSchema: { entity_id: z.string() },
}, async ({ entity_id }) => {
  const r = records.find(x => x.id === entity_id);
  if (!r) return { content: [{ type: "text" as const, text: JSON.stringify({ error: `unknown entity_id '${entity_id}' — use search_entities first` }) }], isError: true };
  return { content: [{ type: "text" as const, text: JSON.stringify({
    ...present(r),
    history: history[r.id] ?? [],
    ...(forward[r.id] ? { forward_looking: forward[r.id] } : {}),
    attribution: ATTRIBUTION,
  }, null, 2) }] };
});

server.registerTool("get_latest_value", {
  description: "Get the current official processing time for a service, optionally for a specific applicant country. New Zealand services return both 50% and 80% records.",
  inputSchema: {
    service_key: z.string().describe("e.g. ca-visitor-visa, nz-visitor-visa, or any key from search results"),
    applicant_country: z.string().length(2).optional().describe("ISO 3166-1 alpha-2 of the applicant's country (omit for global service metrics)"),
  },
}, async ({ service_key, applicant_country }) => {
  const matches = records.filter(x => x.service_key === service_key && (applicant_country ? x.applicant_country === applicant_country.toUpperCase() : !x.applicant_country));
  if (!matches.length) {
    const svc = records.filter(x => x.service_key === service_key);
    const hint = svc.length
      ? `service exists; specify applicant_country (one of ${svc.slice(0, 5).map(x => x.applicant_country).join(", ")}, …)`
      : `unknown service_key; known keys include ${[...new Set(records.map(x => x.service_key))].slice(0, 8).join(", ")}, …`;
    return { content: [{ type: "text" as const, text: JSON.stringify({ error: hint }) }], isError: true };
  }
  const result = matches.length === 1 ? present(matches[0]) : { service_key, metrics: matches.map(present) };
  return { content: [{ type: "text" as const, text: JSON.stringify({ ...result, attribution: ATTRIBUTION }, null, 2) }] };
});

server.registerTool("compare_values", {
  description: "Compare current official processing times for one service across several applicant countries, sorted fastest first.",
  inputSchema: {
    service_key: z.string(),
    applicant_countries: z.array(z.string().length(2)).min(2).max(30).describe("ISO alpha-2 codes, e.g. ['IN','NG','PH']"),
  },
}, async ({ service_key, applicant_countries }) => {
  const wanted = applicant_countries.map(c => c.toUpperCase());
  const rows = records.filter(r => r.service_key === service_key && r.applicant_country && wanted.includes(r.applicant_country));
  if (!rows.length) return { content: [{ type: "text" as const, text: JSON.stringify({ error: `no records for service '${service_key}' and those countries` }) }], isError: true };
  rows.sort((a, b) => (a.value_days ?? Infinity) - (b.value_days ?? Infinity));
  const missing = wanted.filter(c => !rows.some(r => r.applicant_country === c));
  return { content: [{ type: "text" as const, text: JSON.stringify({ service: rows[0].service_name, comparison: rows.map(present), not_tracked: missing, attribution: ATTRIBUTION }, null, 2) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[govwait-mcp] ready — ${records.length} routes loaded from ${DATA_DIR}`);
