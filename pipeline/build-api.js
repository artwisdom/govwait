#!/usr/bin/env node
// Static JSON API generator: data/exports -> site/public/api/v1/**.
// The "API" is prebuilt files on a CDN — zero runtime cost, infinite scale.
// Run AFTER run.js and BEFORE `astro build` (public/ is copied into dist/).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTS = path.join(ROOT, 'data', 'exports');
const API = path.join(ROOT, 'site', 'public', 'api', 'v1');

const latest = JSON.parse(readFileSync(path.join(EXPORTS, 'latest.json'), 'utf8'));
const history = JSON.parse(readFileSync(path.join(EXPORTS, 'history.json'), 'utf8'));
const forward = JSON.parse(readFileSync(path.join(EXPORTS, 'forward-looking.json'), 'utf8'));
const stats = JSON.parse(readFileSync(path.join(EXPORTS, 'stats.json'), 'utf8'));

const ATTRIBUTION = 'GovWait original organization, field definitions and explanatory metadata: CC BY 4.0 where GovWait owns the rights. Underlying government information is not relicensed by GovWait; attribute the originating agency and follow its source-specific terms. Details: https://govwait.com/data-license/.';
const DATA_PUBLISHED = '2026-08-21';
const dataModified = latest.records.map(record => record.effective_date).filter(Boolean).sort().at(-1);

rmSync(API, { recursive: true, force: true });
mkdirSync(path.join(API, 'jurisdictions'), { recursive: true });
mkdirSync(path.join(API, 'services'), { recursive: true });
mkdirSync(path.join(API, 'entities'), { recursive: true });
mkdirSync(path.join(API, 'downloads'), { recursive: true });

const j = (o) => JSON.stringify(o, null, 1);
const csvCell = (value) => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[\",\r\n]/.test(text) ? `\"${text.replaceAll('\"', '\"\"')}\"` : text;
};
const csv = (columns, rows) => `${columns.join(',')}\n${rows.map(row => columns.map(column => csvCell(row[column])).join(',')).join('\n')}\n`;
const writeCsv = (filename, columns, rows, description) => {
  writeFileSync(path.join(API, 'downloads', filename), csv(columns, rows));
  return {
    title: filename,
    description,
    path: `/api/v1/downloads/${filename}`,
    format: 'CSV',
    media_type: 'text/csv',
    row_count: rows.length,
    columns,
  };
};
const recPublic = (r) => ({
  entity_id: r.id,
  jurisdiction: r.jurisdiction,
  service_key: r.service_key,
  service_name: r.service_name,
  service_category: r.service_category,
  metric_type: r.metric_type,
  applicant_country: r.applicant_country,
  applicant_country_name: r.applicant_country_name,
  latest: {
    value_raw: r.value_raw,
    value_days: r.value_days,
    unit_original: r.unit_original,
    status: r.status,
    effective_date: r.effective_date,
    retrieved_at: r.retrieved_at,
    source_url: r.source_url,
    confidence: r.confidence,
  },
});

// entities/{id}.json — latest + history
for (const r of latest.records) {
  writeFileSync(path.join(API, 'entities', `${r.id}.json`), j({
    ...recPublic(r),
    history: history.entities[r.id] || [],
    ...(forward.entities[r.id] ? { forward_looking: forward.entities[r.id] } : {}),
    license: ATTRIBUTION,
  }));
}

// One bulk machine-readable endpoint for IRCC forward-looking projections.
// Program entity endpoints carry the same detail, while this collection makes
// dataset/AI ingestion possible with a single request.
const forwardRecords = latest.records.filter(record => forward.entities[record.id]);
writeFileSync(path.join(API, 'ircc-forward-looking.json'), j({
  name: 'IRCC forward-looking processing times',
  description: 'Current new-application projections plus application-month cohort estimates. Cohort months are submission dates within each IRCC snapshot, not historical publication dates.',
  generated_at: latest.generated_at,
  count: forwardRecords.length,
  programs: forwardRecords.map(record => ({
    ...recPublic(record),
    forward_looking: forward.entities[record.id],
  })),
  license: ATTRIBUTION,
}));

// services/{service_key}.json
const byService = {};
for (const r of latest.records) (byService[r.service_key] ||= []).push(r);
for (const [key, recs] of Object.entries(byService)) {
  writeFileSync(path.join(API, 'services', `${key}.json`), j({
    service_key: key,
    service_name: recs[0].service_name,
    jurisdiction: recs[0].jurisdiction,
    count: recs.length,
    generated_at: latest.generated_at,
    records: recs.map(recPublic),
    license: ATTRIBUTION,
  }));
}

// jurisdictions/{code}.json
const byJur = {};
for (const r of latest.records) (byJur[r.jurisdiction.toLowerCase()] ||= []).push(r);
for (const [code, recs] of Object.entries(byJur)) {
  writeFileSync(path.join(API, 'jurisdictions', `${code}.json`), j({
    jurisdiction: code.toUpperCase(),
    count: recs.length,
    generated_at: latest.generated_at,
    services: Object.keys(byService).filter(k => byService[k][0].jurisdiction.toLowerCase() === code),
    records: recs.map(recPublic),
    license: ATTRIBUTION,
  }));
}

// Portable bulk downloads. These are rebuilt from the same validated exports
// as the JSON API so the two formats cannot silently drift apart.
const latestColumns = [
  'entity_id', 'source_id', 'jurisdiction', 'service_category', 'metric_type',
  'service_key', 'service_name', 'applicant_country', 'applicant_country_name',
  'value_raw', 'value_days', 'unit_original', 'status', 'effective_date',
  'retrieved_at', 'source_url', 'confidence',
];
const latestRows = latest.records.map(record => ({ ...record, entity_id: record.id }));

const historyColumns = [
  'entity_id', 'source_id', 'jurisdiction', 'service_category', 'metric_type',
  'service_key', 'service_name', 'applicant_country', 'applicant_country_name',
  'observation_number', 'value_raw', 'value_days', 'unit_original', 'status',
  'effective_date', 'retrieved_at', 'source_url',
];
const recordById = new Map(latest.records.map(record => [record.id, record]));
const historyRows = Object.entries(history.entities).flatMap(([entityId, observations]) => {
  const record = recordById.get(entityId);
  if (!record) throw new Error(`[build-api] history entity ${entityId} has no current record`);
  return observations.map((observation, index) => ({
    entity_id: entityId,
    source_id: record.source_id,
    jurisdiction: record.jurisdiction,
    service_category: record.service_category,
    metric_type: record.metric_type,
    service_key: record.service_key,
    service_name: record.service_name,
    applicant_country: record.applicant_country,
    applicant_country_name: record.applicant_country_name,
    observation_number: index + 1,
    ...observation,
  }));
});

const forwardColumns = [
  'entity_id', 'source_id', 'jurisdiction', 'service_category', 'metric_type',
  'service_key', 'service_name', 'row_type', 'snapshot_date', 'cohort_month',
  'wait_raw', 'wait_days', 'unit_original', 'status', 'queue_raw', 'queue_people',
  'confidence', 'retrieved_at', 'source_url',
];
const forwardRows = Object.entries(forward.entities).flatMap(([entityId, detail]) => {
  const record = recordById.get(entityId);
  if (!record) throw new Error(`[build-api] forward-looking entity ${entityId} has no current record`);
  return detail.snapshots.flatMap(snapshot => {
    const shared = {
      entity_id: entityId,
      source_id: record.source_id,
      jurisdiction: record.jurisdiction,
      service_category: record.service_category,
      metric_type: record.metric_type,
      service_key: record.service_key,
      service_name: record.service_name,
      snapshot_date: snapshot.snapshot_date,
      retrieved_at: snapshot.retrieved_at,
      source_url: snapshot.source_url,
    };
    return [
      { ...shared, row_type: 'current', cohort_month: null, ...snapshot.current },
      ...snapshot.cohorts.map(cohort => ({ ...shared, row_type: 'cohort', ...cohort })),
    ];
  });
});

const sourceColumns = [
  'source_id', 'name', 'jurisdiction', 'agency', 'source_url', 'license_note',
  'robots_status', 'robots_checked_at',
];
const sourceRows = latest.sources.map(source => ({
  ...source,
  source_id: source.id,
  source_url: source.url,
}));

const distributions = [
  writeCsv('latest.csv', latestColumns, latestRows, 'One row per currently active metric route.'),
  writeCsv('history.csv', historyColumns, historyRows, 'Append-only distinct public observations with route context.'),
  writeCsv('forward-looking.csv', forwardColumns, forwardRows, 'IRCC current projections and application-month cohort rows.'),
  writeCsv('sources.csv', sourceColumns, sourceRows, 'Primary-source provenance and source-specific reuse notes.'),
];

writeFileSync(path.join(API, 'dataset.json'), j({
  name: 'GovWait government processing-time dataset',
  description: 'Officially published government processing and wait times with source URLs, honest dates and append-only history.',
  version: '1',
  date_published: DATA_PUBLISHED,
  date_modified: dataModified,
  generated_at: latest.generated_at,
  landing_page: 'https://govwait.com/data/',
  stats: {
    current_routes: latestRows.length,
    historical_observations: historyRows.length,
    forward_looking_rows: forwardRows.length,
    sources: sourceRows.length,
    jurisdictions: stats.jurisdictions.length,
    services: stats.services,
  },
  distributions,
  sources: latest.sources.map(source => ({
    id: source.id,
    name: source.name,
    agency: source.agency,
    jurisdiction: source.jurisdiction,
    url: source.url,
    license_note: source.license_note,
  })),
  reuse: {
    notice: ATTRIBUTION,
    details: 'https://govwait.com/data-license/',
  },
}));

// index.json
writeFileSync(path.join(API, 'index.json'), j({
  name: 'GovWait API v1',
  description: 'Officially published government processing times, tracked with provenance and history. Static JSON; no key required.',
  generated_at: latest.generated_at,
  stats,
  sources: latest.sources.map(s => ({ id: s.id, name: s.name, agency: s.agency, jurisdiction: s.jurisdiction, url: s.url, license_note: s.license_note })),
  endpoints: {
    jurisdictions: Object.keys(byJur).map(c => `/api/v1/jurisdictions/${c}.json`),
    services: Object.keys(byService).map(k => `/api/v1/services/${k}.json`),
    entity_pattern: '/api/v1/entities/{entity_id}.json',
    ircc_forward_looking: '/api/v1/ircc-forward-looking.json',
    dataset_metadata: '/api/v1/dataset.json',
    downloads: distributions.map(distribution => distribution.path),
    openapi: '/api/v1/openapi.yaml',
  },
  license: ATTRIBUTION,
}));

console.log(`[build-api] wrote ${latest.records.length} entity endpoints, ${Object.keys(byService).length} service endpoints, ${Object.keys(byJur).length} jurisdiction endpoints, ${forwardRecords.length} forward-looking programs, and ${distributions.length} CSV downloads`);
