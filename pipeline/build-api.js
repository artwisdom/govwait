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
const stats = JSON.parse(readFileSync(path.join(EXPORTS, 'stats.json'), 'utf8'));

const ATTribution = 'CC BY 4.0 — attribute GovWait and the originating government agency. Underlying figures are official government publications.';

rmSync(API, { recursive: true, force: true });
mkdirSync(path.join(API, 'jurisdictions'), { recursive: true });
mkdirSync(path.join(API, 'services'), { recursive: true });
mkdirSync(path.join(API, 'entities'), { recursive: true });

const j = (o) => JSON.stringify(o, null, 1);
const recPublic = (r) => ({
  entity_id: r.id,
  jurisdiction: r.jurisdiction,
  service_key: r.service_key,
  service_name: r.service_name,
  service_category: r.service_category,
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
    license: ATTribution,
  }));
}

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
    license: ATTribution,
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
    license: ATTribution,
  }));
}

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
    openapi: '/api/v1/openapi.yaml',
  },
  license: ATTribution,
}));

console.log(`[build-api] wrote ${latest.records.length} entity endpoints, ${Object.keys(byService).length} service endpoints, ${Object.keys(byJur).length} jurisdiction endpoints`);
