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
    SELECT e.id, e.source_id, e.jurisdiction, e.service_category, e.metric_type, e.service_key, e.service_name,
           e.applicant_country, e.applicant_country_name,
           o.value_raw, o.value_days, o.unit_original, o.status, o.effective_date, o.retrieved_at, o.source_url, o.confidence
    FROM entities e
    JOIN observations o ON o.entity_id = e.id
      AND o.effective_date = (SELECT MAX(o2.effective_date) FROM observations o2 WHERE o2.entity_id = e.id)
    WHERE e.active=1
    ORDER BY e.id`);

  const historyRows = queryJson(`
    SELECT o.entity_id, o.value_raw, o.value_days, o.unit_original, o.status, o.effective_date, o.retrieved_at, o.source_url
    FROM observations o JOIN entities e ON e.id=o.entity_id
    WHERE e.active=1 ORDER BY o.entity_id, o.effective_date`);
  const history = {};
  for (const r of historyRows) {
    (history[r.entity_id] ||= []).push({
      value_raw: r.value_raw, value_days: r.value_days, unit_original: r.unit_original, status: r.status,
      effective_date: r.effective_date, retrieved_at: r.retrieved_at, source_url: r.source_url,
    });
  }

  const forwardRows = queryJson(`
    SELECT f.entity_id, f.snapshot_date, f.cohort_month, f.wait_raw, f.wait_days,
           f.unit_original, f.status, f.queue_raw, f.queue_people, f.retrieved_at,
           f.source_url, f.confidence
    FROM forward_estimates f JOIN entities e ON e.id=f.entity_id
    WHERE e.active=1
    ORDER BY f.entity_id, f.snapshot_date, f.cohort_month`);
  const forwardEntities = {};
  const snapshotMaps = new Map();
  for (const row of forwardRows) {
    if (!forwardEntities[row.entity_id]) forwardEntities[row.entity_id] = { snapshots: [] };
    let perEntity = snapshotMaps.get(row.entity_id);
    if (!perEntity) { perEntity = new Map(); snapshotMaps.set(row.entity_id, perEntity); }
    let snapshot = perEntity.get(row.snapshot_date);
    if (!snapshot) {
      snapshot = {
        snapshot_date: row.snapshot_date,
        retrieved_at: row.retrieved_at,
        source_url: row.source_url,
        current: null,
        cohorts: [],
      };
      perEntity.set(row.snapshot_date, snapshot);
      forwardEntities[row.entity_id].snapshots.push(snapshot);
    }
    const value = {
      wait_raw: row.wait_raw,
      wait_days: row.wait_days,
      unit_original: row.unit_original,
      status: row.status,
      queue_raw: row.queue_raw,
      queue_people: row.queue_people,
      confidence: row.confidence,
    };
    if (row.cohort_month === '') snapshot.current = value;
    else snapshot.cohorts.push({ cohort_month: row.cohort_month, ...value });
  }

  const stats = {
    generated_at: new Date().toISOString(),
    entities: latest.length,
    observations: historyRows.length,
    forward_looking_estimates: forwardRows.length,
    forward_looking_snapshots: [...new Set(forwardRows.map(row => row.snapshot_date))].length,
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
  writeFileSync(path.join(EXPORTS, 'forward-looking.json'), JSON.stringify({ generated_at: stats.generated_at, entities: forwardEntities }, null, 1));
  writeFileSync(path.join(EXPORTS, 'stats.json'), JSON.stringify(stats, null, 2));
  return stats;
}
