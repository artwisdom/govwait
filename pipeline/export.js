// Snapshot exports — the only artifacts the site / API / MCP server consume.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { queryJson } from './lib/db.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTS = path.join(ROOT, 'data', 'exports');

export function exportAll() {
  mkdirSync(EXPORTS, { recursive: true });

  const sources = queryJson(`SELECT * FROM sources ORDER BY id`);
  const latest = queryJson(`
    SELECT e.id, e.source_id, e.jurisdiction, e.service_category, e.service_key, e.service_name,
           e.applicant_country, e.applicant_country_name,
           o.value_raw, o.value_days, o.unit_original, o.status, o.effective_date, o.retrieved_at, o.source_url, o.confidence
    FROM entities e
    JOIN observations o ON o.entity_id = e.id
      AND o.effective_date = (SELECT MAX(o2.effective_date) FROM observations o2 WHERE o2.entity_id = e.id)
    ORDER BY e.id`);

  const historyRows = queryJson(`
    SELECT entity_id, value_raw, value_days, status, effective_date, retrieved_at, source_url
    FROM observations ORDER BY entity_id, effective_date`);
  const history = {};
  for (const r of historyRows) {
    (history[r.entity_id] ||= []).push({
      value_raw: r.value_raw, value_days: r.value_days, status: r.status,
      effective_date: r.effective_date, retrieved_at: r.retrieved_at, source_url: r.source_url,
    });
  }

  const stats = {
    generated_at: new Date().toISOString(),
    entities: latest.length,
    observations: historyRows.length,
    jurisdictions: [...new Set(latest.map(r => r.jurisdiction))].sort(),
    services: [...new Set(latest.map(r => r.service_key))].length,
    per_source: Object.fromEntries(sources.map(s => [s.id, {
      name: s.name,
      observations: historyRows.filter(r => latest.find(l => l.id === r.entity_id)?.source_id === s.id).length,
      latest_effective_date: latest.filter(l => l.source_id === s.id).map(l => l.effective_date).sort().at(-1) ?? null,
    }])),
  };

  writeFileSync(path.join(EXPORTS, 'latest.json'), JSON.stringify({ generated_at: stats.generated_at, sources, records: latest }, null, 1));
  writeFileSync(path.join(EXPORTS, 'history.json'), JSON.stringify({ generated_at: stats.generated_at, entities: history }, null, 1));
  writeFileSync(path.join(EXPORTS, 'stats.json'), JSON.stringify(stats, null, 2));
  return stats;
}
