#!/usr/bin/env node
// Conformance check: every built static API file matches the shapes promised
// by openapi.yaml (required fields, enums, patterns). Exit 0 = conformant.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = path.join(ROOT, 'site', 'dist', 'api', 'v1');

let checked = 0; const errors = [];
const err = (f, msg) => errors.push(`${f}: ${msg}`);

const STATUS = new Set(['ok', 'unavailable', 'insufficient_data']);
const CATEGORY = new Set(['visa', 'permit', 'sponsorship', 'refugee', 'settlement', 'passport']);
const UNITS = new Set(['minutes', 'hours', 'days', 'weeks', 'months', 'working days', null]);
const ENTITY_ID = /^[a-z0-9-]+(--(?:[a-z]{2}|p(?:50|80)))?$/;

function checkObs(f, o, label) {
  for (const k of ['value_raw', 'status', 'effective_date', 'retrieved_at', 'source_url']) {
    if (o[k] === undefined || o[k] === null || o[k] === '') err(f, `${label}.${k} missing`);
  }
  if (!STATUS.has(o.status)) err(f, `${label}.status invalid: ${o.status}`);
  if (o.status === 'ok' && typeof o.value_days !== 'number') err(f, `${label}: status=ok but value_days not numeric`);
  if (o.status !== 'ok' && o.value_days !== null && o.value_days !== undefined) err(f, `${label}: status=${o.status} but value_days present`);
  if (!UNITS.has(o.unit_original ?? null)) err(f, `${label}.unit_original invalid: ${o.unit_original}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(o.effective_date)) err(f, `${label}.effective_date not a date: ${o.effective_date}`);
  if (!/^https:\/\//.test(o.source_url)) err(f, `${label}.source_url not https`);
}
function checkCore(f, r) {
  for (const k of ['entity_id', 'jurisdiction', 'service_key', 'service_name', 'latest']) {
    if (r[k] === undefined) err(f, `record.${k} missing`);
  }
  if (!ENTITY_ID.test(r.entity_id)) err(f, `bad entity_id ${r.entity_id}`);
  if (!/^[A-Z]{2}$/.test(r.jurisdiction)) err(f, `bad jurisdiction ${r.jurisdiction}`);
  if (r.service_category && !CATEGORY.has(r.service_category)) err(f, `bad category ${r.service_category}`);
  if (r.applicant_country !== null && !/^[A-Z]{2}$/.test(r.applicant_country)) err(f, `bad applicant_country ${r.applicant_country}`);
  if (r.latest) checkObs(f, r.latest, 'latest');
}

// index.json
{
  const f = 'index.json';
  const d = JSON.parse(readFileSync(path.join(API, f), 'utf8')); checked++;
  for (const k of ['name', 'generated_at', 'endpoints', 'sources', 'license']) if (!d[k]) err(f, `${k} missing`);
  for (const ep of [...d.endpoints.jurisdictions, ...d.endpoints.services]) {
    if (!/^\/api\/v1\/(jurisdictions|services)\/[a-z0-9-]+\.json$/.test(ep)) err(f, `malformed endpoint path ${ep}`);
  }
}
// jurisdictions
for (const file of readdirSync(path.join(API, 'jurisdictions'))) {
  const f = `jurisdictions/${file}`;
  const d = JSON.parse(readFileSync(path.join(API, 'jurisdictions', file), 'utf8')); checked++;
  if (!/^[A-Z]{2}$/.test(d.jurisdiction)) err(f, 'bad jurisdiction');
  if (d.count !== d.records.length) err(f, `count ${d.count} != records ${d.records.length}`);
  d.records.forEach(r => checkCore(f, r));
}
// services
for (const file of readdirSync(path.join(API, 'services'))) {
  const f = `services/${file}`;
  const d = JSON.parse(readFileSync(path.join(API, 'services', file), 'utf8')); checked++;
  if (`${d.service_key}.json` !== file) err(f, 'service_key/filename mismatch');
  if (d.count !== d.records.length) err(f, 'count mismatch');
  d.records.forEach(r => checkCore(f, r));
}
// entities (all of them)
for (const file of readdirSync(path.join(API, 'entities'))) {
  const f = `entities/${file}`;
  const d = JSON.parse(readFileSync(path.join(API, 'entities', file), 'utf8')); checked++;
  if (`${d.entity_id}.json` !== file) err(f, 'entity_id/filename mismatch');
  checkCore(f, d);
  if (!Array.isArray(d.history) || d.history.length < 1) err(f, 'history missing/empty');
  else d.history.forEach((h, i) => checkObs(f, h, `history[${i}]`));
}

console.log(`[conformance] checked ${checked} API files`);
if (errors.length) {
  console.error(`[conformance] ${errors.length} violations:`);
  errors.slice(0, 25).forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('[conformance] PASS — all files match openapi.yaml shapes');
