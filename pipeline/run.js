#!/usr/bin/env node
// Orchestrator: fetch → parse → upsert → validate → export.
// Exits non-zero on any source error or validation failure. Never publishes garbage.
import { initSchema, exec, sqlQuote, queryJson } from './lib/db.js';
import { validate } from './validate.js';
import { exportAll } from './export.js';
import * as ircc from './sources/ircc.js';
import * as irccFlpt from './sources/ircc-flpt.js';
import * as govuk from './sources/govuk.js';
import * as irccNonCountry from './sources/ircc-noncountry.js';
import * as irccPassport from './sources/ircc-passport.js';
import * as govukInUk from './sources/govuk-inuk.js';
import * as govukPassport from './sources/govuk-passport.js';
import * as inz from './sources/inz.js';
import * as udi from './sources/udi.js';

const SOURCES = [ircc, irccFlpt, irccNonCountry, irccPassport, govuk, govukInUk, govukPassport, inz, udi];
const forceRefresh = process.argv.includes('--refresh');

// Unstamped observations (source publishes no update date): insert only when
// the value differs from the entity's latest stored observation, with
// effective_date = first-observed date. Otherwise skip (no history spam).
function resolveUnstamped(observations) {
  return observations.filter(o => {
    if (!o.unstamped) return true;
    o.effective_date = o.retrieved_at.slice(0, 10);
    const latest = queryJson(`SELECT value_raw FROM observations WHERE entity_id=${sqlQuote(o.entity_id)} ORDER BY effective_date DESC LIMIT 1`);
    return !(latest.length && latest[0].value_raw === o.value_raw);
  });
}

function upsert(sourceMeta, entities, observations, forwardEstimates = []) {
  const stmts = ['BEGIN;'];
  stmts.push(`INSERT INTO sources (id,name,jurisdiction,agency,url,license_note,robots_status,robots_checked_at) VALUES (${[
    sourceMeta.id, sourceMeta.name, sourceMeta.jurisdiction, sourceMeta.agency, sourceMeta.url, sourceMeta.license_note, 'allowed', new Date().toISOString(),
  ].map(sqlQuote).join(',')}) ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, jurisdiction=excluded.jurisdiction, agency=excluded.agency,
    url=excluded.url, license_note=excluded.license_note,
    robots_status=excluded.robots_status, robots_checked_at=excluded.robots_checked_at;`);
  // A disappearing route must not remain presented as current. Deactivate the
  // source's previous entity set, then reactivate every entity seen now. Old
  // observations remain append-only in SQLite for audit/history purposes.
  stmts.push(`UPDATE entities SET active=0 WHERE source_id=${sqlQuote(sourceMeta.id)};`);
  const seen = new Set();
  for (const e of entities) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    stmts.push(`INSERT INTO entities (id,source_id,jurisdiction,service_category,metric_type,service_key,service_name,applicant_country,applicant_country_name,active) VALUES (${[
      e.id, e.source_id, e.jurisdiction, e.service_category, e.metric_type || 'published', e.service_key, e.service_name, e.applicant_country, e.applicant_country_name, 1,
    ].map(sqlQuote).join(',')}) ON CONFLICT(id) DO UPDATE SET
      source_id=excluded.source_id, jurisdiction=excluded.jurisdiction,
      service_category=excluded.service_category, metric_type=excluded.metric_type, service_key=excluded.service_key,
      service_name=excluded.service_name, applicant_country=excluded.applicant_country,
      applicant_country_name=excluded.applicant_country_name, active=1;`);
  }
  for (const o of observations) {
    stmts.push(`INSERT OR IGNORE INTO observations (entity_id,value_raw,value_days,unit_original,status,effective_date,retrieved_at,source_url,confidence) VALUES (${[
      o.entity_id, o.value_raw, o.value_days, o.unit_original, o.status, o.effective_date, o.retrieved_at, o.source_url, 'official',
    ].map(sqlQuote).join(',')});`);
  }
  for (const row of forwardEstimates) {
    stmts.push(`INSERT OR IGNORE INTO forward_estimates (entity_id,snapshot_date,cohort_month,wait_raw,wait_days,unit_original,status,queue_raw,queue_people,retrieved_at,source_url,confidence) VALUES (${[
      row.entity_id, row.snapshot_date, row.cohort_month, row.wait_raw, row.wait_days, row.unit_original, row.status,
      row.queue_raw, row.queue_people, row.retrieved_at, row.source_url, 'official',
    ].map(sqlQuote).join(',')});`);
  }
  stmts.push('COMMIT;');
  exec(stmts.join('\n'));
}

async function main() {
  console.log(`[pipeline] start ${new Date().toISOString()} (forceRefresh=${forceRefresh})`);
  initSchema();
  let hardFail = false;

  for (const mod of SOURCES) {
    const label = mod.source.id;
    try {
      const { entities, observations, forwardEstimates = [], errors } = await mod.collect({ forceRefresh });
      if (errors.length) {
        console.error(`[${label}] ${errors.length} parse error(s):`);
        for (const e of errors.slice(0, 20)) console.error(`  - ${e}`);
        hardFail = true;
        continue;
      }
      upsert(mod.source, entities, resolveUnstamped(observations), forwardEstimates);
      console.log(`[${label}] OK — ${entities.length} entity rows, ${observations.length} observations${forwardEstimates.length ? `, ${forwardEstimates.length} forward estimates` : ''}`);
    } catch (err) {
      console.error(`[${label}] FETCH/PARSE FAILURE: ${err.message}`);
      hardFail = true;
    }
  }

  if (hardFail) {
    console.error('[pipeline] HARD FAIL — one or more sources errored. Nothing exported.');
    process.exit(1);
  }

  const report = validate();
  if (!report.pass) {
    console.error('[pipeline] VALIDATION FAILED — see data/exports/validation-report.json');
    for (const f of report.failures) console.error(`  FAIL: ${f}`);
    process.exit(1);
  }
  console.log(`[pipeline] validation green — ${report.checks.length} checks`);

  const stats = exportAll();
  console.log(`[pipeline] exported: ${stats.entities} entities, ${stats.observations} observations, ${stats.jurisdictions.join('+')}`);

  const counts = queryJson(`SELECT status, COUNT(*) n FROM observations GROUP BY status ORDER BY n DESC`);
  console.log('[pipeline] observation status mix:', counts.map(c => `${c.status}=${c.n}`).join(', '));
  console.log('[pipeline] done.');
}

main().catch(err => { console.error('[pipeline] UNCAUGHT:', err); process.exit(1); });
