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
const METRIC = new Set(['published', 'backward', 'forward', 'service_standard', 'percentile']);
const UNITS = new Set(['minutes', 'hours', 'days', 'weeks', 'months', 'years', 'working days', null]);
const ENTITY_ID = /^[a-z0-9-]+(--(?:[a-z]{2}|p(?:50|80)))?$/;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (char !== '\r') field += char;
  }
  if (quoted) throw new Error('unterminated quoted CSV field');
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

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
  for (const k of ['entity_id', 'jurisdiction', 'service_key', 'service_name', 'metric_type', 'latest']) {
    if (r[k] === undefined) err(f, `record.${k} missing`);
  }
  if (!ENTITY_ID.test(r.entity_id)) err(f, `bad entity_id ${r.entity_id}`);
  if (!/^[A-Z]{2}$/.test(r.jurisdiction)) err(f, `bad jurisdiction ${r.jurisdiction}`);
  if (r.service_category && !CATEGORY.has(r.service_category)) err(f, `bad category ${r.service_category}`);
  if (!METRIC.has(r.metric_type)) err(f, `bad metric_type ${r.metric_type}`);
  if (r.applicant_country !== null && !/^[A-Z]{2}$/.test(r.applicant_country)) err(f, `bad applicant_country ${r.applicant_country}`);
  if (r.latest) checkObs(f, r.latest, 'latest');
}
function checkForwardValue(f, value, label, cohort = false) {
  for (const k of ['wait_raw', 'status', 'queue_raw', 'queue_people', 'confidence']) {
    if (value?.[k] === undefined || value?.[k] === null || value?.[k] === '') err(f, `${label}.${k} missing`);
  }
  if (!STATUS.has(value?.status)) err(f, `${label}.status invalid: ${value?.status}`);
  if (value?.status === 'ok' && typeof value?.wait_days !== 'number') err(f, `${label}: status=ok but wait_days not numeric`);
  if (value?.status !== 'ok' && value?.wait_days !== null) err(f, `${label}: status=${value?.status} but wait_days present`);
  if (!UNITS.has(value?.unit_original ?? null)) err(f, `${label}.unit_original invalid: ${value?.unit_original}`);
  if (!Number.isInteger(value?.queue_people) || value.queue_people < 1) err(f, `${label}.queue_people invalid`);
  if (value?.confidence !== 'official') err(f, `${label}.confidence invalid`);
  if (cohort && !/^\d{4}-\d{2}-01$/.test(value?.cohort_month || '')) err(f, `${label}.cohort_month invalid`);
}
function checkForwardDetail(f, detail, label = 'forward_looking') {
  if (!Array.isArray(detail?.snapshots) || detail.snapshots.length < 1) { err(f, `${label}.snapshots missing/empty`); return; }
  for (const [snapshotIndex, snapshot] of detail.snapshots.entries()) {
    const prefix = `${label}.snapshots[${snapshotIndex}]`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.snapshot_date || '')) err(f, `${prefix}.snapshot_date invalid`);
    if (!/^https:\/\//.test(snapshot.source_url || '')) err(f, `${prefix}.source_url invalid`);
    if (!snapshot.retrieved_at) err(f, `${prefix}.retrieved_at missing`);
    checkForwardValue(f, snapshot.current, `${prefix}.current`);
    if (!Array.isArray(snapshot.cohorts) || snapshot.cohorts.length < 1) err(f, `${prefix}.cohorts missing/empty`);
    else snapshot.cohorts.forEach((value, index) => checkForwardValue(f, value, `${prefix}.cohorts[${index}]`, true));
  }
}

// index.json
{
  const f = 'index.json';
  const d = JSON.parse(readFileSync(path.join(API, f), 'utf8')); checked++;
  for (const k of ['name', 'generated_at', 'endpoints', 'sources', 'license']) if (!d[k]) err(f, `${k} missing`);
  for (const ep of [...d.endpoints.jurisdictions, ...d.endpoints.services]) {
    if (!/^\/api\/v1\/(jurisdictions|services)\/[a-z0-9-]+\.json$/.test(ep)) err(f, `malformed endpoint path ${ep}`);
  }
  if (d.endpoints.dataset_metadata !== '/api/v1/dataset.json') err(f, 'dataset_metadata endpoint missing');
  if (!Array.isArray(d.endpoints.downloads) || d.endpoints.downloads.length !== 4) err(f, 'expected four CSV download endpoints');
}
// Dataset metadata and bulk CSV distributions
{
  const f = 'dataset.json';
  const d = JSON.parse(readFileSync(path.join(API, f), 'utf8')); checked++;
  for (const k of ['name', 'description', 'version', 'date_published', 'date_modified', 'generated_at', 'landing_page', 'stats', 'distributions', 'sources', 'reuse']) {
    if (!d[k]) err(f, `${k} missing`);
  }
  if (d.landing_page !== 'https://govwait.com/data/') err(f, `unexpected landing_page ${d.landing_page}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date_published || '')) err(f, 'date_published invalid');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date_modified || '')) err(f, 'date_modified invalid');
  if (!Array.isArray(d.distributions) || d.distributions.length !== 4) err(f, 'expected four distributions');
  if (!Array.isArray(d.sources) || d.sources.length !== d.stats.sources) err(f, 'source count mismatch');
  if (d.reuse?.details !== 'https://govwait.com/data-license/') err(f, 'reuse details URL missing');

  const expected = new Map([
    ['latest.csv', {
      rows: d.stats.current_routes,
      columns: ['entity_id', 'source_id', 'jurisdiction', 'service_category', 'metric_type', 'service_key', 'service_name', 'applicant_country', 'applicant_country_name', 'value_raw', 'value_days', 'unit_original', 'status', 'effective_date', 'retrieved_at', 'source_url', 'confidence'],
    }],
    ['history.csv', {
      rows: d.stats.historical_observations,
      columns: ['entity_id', 'source_id', 'jurisdiction', 'service_category', 'metric_type', 'service_key', 'service_name', 'applicant_country', 'applicant_country_name', 'observation_number', 'value_raw', 'value_days', 'unit_original', 'status', 'effective_date', 'retrieved_at', 'source_url'],
    }],
    ['forward-looking.csv', {
      rows: d.stats.forward_looking_rows,
      columns: ['entity_id', 'source_id', 'jurisdiction', 'service_category', 'metric_type', 'service_key', 'service_name', 'row_type', 'snapshot_date', 'cohort_month', 'wait_raw', 'wait_days', 'unit_original', 'status', 'queue_raw', 'queue_people', 'confidence', 'retrieved_at', 'source_url'],
    }],
    ['sources.csv', {
      rows: d.stats.sources,
      columns: ['source_id', 'name', 'jurisdiction', 'agency', 'source_url', 'license_note', 'robots_status', 'robots_checked_at'],
    }],
  ]);

  for (const distribution of d.distributions || []) {
    const filename = distribution.title;
    const expectation = expected.get(filename);
    if (!expectation) { err(f, `unexpected distribution ${filename}`); continue; }
    const csvFile = `downloads/${filename}`;
    let rows = [];
    try { rows = parseCsv(readFileSync(path.join(API, 'downloads', filename), 'utf8')); checked++; }
    catch (error) { err(csvFile, `could not parse: ${error.message}`); continue; }
    const header = rows.shift() || [];
    if (header.join(',') !== expectation.columns.join(',')) err(csvFile, 'header mismatch');
    if (rows.length !== expectation.rows || distribution.row_count !== expectation.rows) {
      err(csvFile, `row count ${rows.length}/${distribution.row_count} != ${expectation.rows}`);
    }
    rows.forEach((row, index) => {
      if (row.length !== header.length) err(csvFile, `row ${index + 2} has ${row.length} columns; expected ${header.length}`);
    });
    expected.delete(filename);
  }
  for (const filename of expected.keys()) err(f, `missing distribution ${filename}`);
}
// IRCC forward-looking bulk collection
{
  const f = 'ircc-forward-looking.json';
  const d = JSON.parse(readFileSync(path.join(API, f), 'utf8')); checked++;
  if (!Array.isArray(d.programs) || d.count !== d.programs.length || d.programs.length < 28) err(f, 'program count mismatch or below floor 28');
  else d.programs.forEach((program, index) => {
    checkCore(f, program);
    if (program.metric_type !== 'forward') err(f, `programs[${index}] is not metric_type=forward`);
    checkForwardDetail(f, program.forward_looking, `programs[${index}].forward_looking`);
  });
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
  if (d.forward_looking) checkForwardDetail(f, d.forward_looking);
}

console.log(`[conformance] checked ${checked} API files`);
if (errors.length) {
  console.error(`[conformance] ${errors.length} violations:`);
  errors.slice(0, 25).forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('[conformance] PASS — all files match openapi.yaml shapes');
