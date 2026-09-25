// Validation suite — every check is recorded; any FAIL means the pipeline
// exits non-zero and nothing downstream rebuilds.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { queryJson, sqlQuote } from './lib/db.js';
import { UNAVAILABLE_SOURCE_POLICIES } from './source-policy.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTS = path.join(ROOT, 'data', 'exports');

const COVERAGE_FLOORS = {
  'ircc-ptime': 1200, 'govuk-visa-times': 10,
  'ircc-forward-looking': 28,
  'ircc-noncountry': 15, 'ircc-passport': 2, 'govuk-inuk-times': 8, 'govuk-passport': 1,
  'inz-processing-times': 240,
};
// No staleness entry for ircc-passport (unstamped: effective_date = first
// observed, ages legitimately) or govuk-passport (stable statement, years old).
const STALENESS_DAYS = { 'ircc-ptime': 45, 'ircc-forward-looking': 62, 'govuk-visa-times': 120, 'ircc-noncountry': 45, 'govuk-inuk-times': 500 };
const TOTAL_FLOOR = 300;
// Refugee-resettlement categories legitimately reach ~5 years ("58 months",
// gov-assisted from TZ, observed 2026-08), and IRCC's forward-looking file
// publishes "More than 10 years". 5000d remains an absurdity bound.
const MAX_DAYS = 5000;

export function validate() {
  const checks = [];
  const failures = [];
  const check = (name, pass, detail) => {
    checks.push({ name, pass, detail });
    if (!pass) failures.push(`${name}: ${detail}`);
  };

  // 1. Type/shape checks
  const badEntities = queryJson(`
    SELECT COUNT(*) n FROM entities
    WHERE active=1 AND (
      id = '' OR jurisdiction NOT GLOB '[A-Z][A-Z]'
       OR metric_type NOT IN ('published','backward','forward','service_standard','percentile')
       OR (applicant_country IS NOT NULL AND applicant_country NOT GLOB '[A-Z][A-Z]'))`)[0].n;
  check('entity-shape', badEntities === 0, `${badEntities} malformed entity rows`);

  const badObs = queryJson(`
    SELECT COUNT(*) n FROM observations
    WHERE effective_date NOT GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
       OR (status='ok' AND value_days IS NULL)
       OR (status!='ok' AND value_days IS NOT NULL)
       OR source_url NOT LIKE 'https://%'`)[0].n;
  check('observation-shape', badObs === 0, `${badObs} malformed observations`);

  const orphans = queryJson(`SELECT COUNT(*) n FROM observations o LEFT JOIN entities e ON e.id=o.entity_id WHERE e.id IS NULL`)[0].n;
  check('referential-integrity', orphans === 0, `${orphans} orphaned observations`);

  const badSourceStates = queryJson(`
    SELECT COUNT(*) n FROM sources
    WHERE collection_status NOT IN ('active','source_unavailable')
       OR (collection_status='active' AND (collection_status_since IS NOT NULL OR collection_status_note IS NOT NULL))
       OR (collection_status='source_unavailable' AND (
         collection_status_since NOT GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
         OR collection_status_note IS NULL OR collection_status_note=''
       ))`)[0].n;
  check('source-collection-state', badSourceStates === 0, `${badSourceStates} sources have inconsistent collection-state metadata`);

  const badForward = queryJson(`
    SELECT COUNT(*) n FROM forward_estimates f LEFT JOIN entities e ON e.id=f.entity_id
    WHERE e.id IS NULL
       OR e.metric_type!='forward'
       OR f.snapshot_date NOT GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
       OR (f.cohort_month!='' AND f.cohort_month NOT GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-01')
       OR (f.status='ok' AND f.wait_days IS NULL)
       OR (f.status!='ok' AND f.wait_days IS NOT NULL)
       OR (f.status='ok' AND (f.wait_days<=0 OR f.wait_days>${MAX_DAYS}))
       OR f.queue_people<=0 OR f.source_url NOT LIKE 'https://%'`)[0].n;
  check('forward-estimate-shape', badForward === 0, `${badForward} malformed forward-looking estimates`);

  const forwardCurrent = queryJson(`
    SELECT COUNT(*) n FROM forward_estimates f JOIN entities e ON e.id=f.entity_id
    WHERE e.active=1 AND e.source_id='ircc-forward-looking' AND f.cohort_month=''`)[0].n;
  check('forward-current-coverage', forwardCurrent >= 28, `${forwardCurrent} headline forward-looking estimates (floor 28)`);
  const forwardCohorts = queryJson(`
    SELECT COUNT(*) n FROM forward_estimates f JOIN entities e ON e.id=f.entity_id
    WHERE e.active=1 AND e.source_id='ircc-forward-looking' AND f.cohort_month!=''`)[0].n;
  check('forward-cohort-coverage', forwardCohorts >= 3500, `${forwardCohorts} application-month estimates (floor 3500)`);

  // 2. Range sanity
  const outOfRange = queryJson(`SELECT COUNT(*) n FROM observations WHERE status='ok' AND (value_days <= 0 OR value_days > ${MAX_DAYS})`)[0].n;
  check('value-range', outOfRange === 0, `${outOfRange} observations outside (0, ${MAX_DAYS}] days`);

  // 3. Coverage floors
  const perSource = queryJson(`
    SELECT e.source_id, COUNT(*) n FROM observations o JOIN entities e ON e.id=o.entity_id
    WHERE e.active=1 GROUP BY e.source_id`);
  for (const [sid, floor] of Object.entries(COVERAGE_FLOORS)) {
    const n = perSource.find(r => r.source_id === sid)?.n || 0;
    check(`coverage-${sid}`, n >= floor, `${n} observations (floor ${floor})`);
    const state = queryJson(`SELECT collection_status FROM sources WHERE id=${sqlQuote(sid)} LIMIT 1`)[0]?.collection_status;
    check(`collection-active-${sid}`, state === 'active', `collection_status is ${state ?? 'missing'} (expected active)`);
  }
  for (const policy of UNAVAILABLE_SOURCE_POLICIES) {
    const source = queryJson(`SELECT collection_status, collection_status_since, collection_status_note, robots_checked_at FROM sources WHERE id=${sqlQuote(policy.id)} LIMIT 1`)[0];
    check(`collection-unavailable-${policy.id}`,
      source?.collection_status === policy.collectionStatus
        && source?.collection_status_since === policy.statusSince
        && source?.collection_status_note === policy.statusNote,
      `status=${source?.collection_status ?? 'missing'}, since=${source?.collection_status_since ?? 'missing'}`);
    const retained = queryJson(`
      SELECT COUNT(DISTINCT e.id) entities, COUNT(o.id) observations, MAX(o.retrieved_at) last_retrieved
      FROM entities e JOIN observations o ON o.entity_id=e.id
      WHERE e.source_id=${sqlQuote(policy.id)} AND e.active=1`)[0];
    check(`retained-history-${policy.id}`,
      retained.entities === policy.expectedActiveEntities && retained.observations === policy.expectedObservations,
      `${retained.entities} active entities and ${retained.observations} observations retained (expected exactly ${policy.expectedActiveEntities}/${policy.expectedObservations})`);
    const postClosure = queryJson(`
      SELECT COUNT(*) n FROM observations o JOIN entities e ON e.id=o.entity_id
      WHERE e.source_id=${sqlQuote(policy.id)} AND o.retrieved_at>=${sqlQuote(`${policy.statusSince}T00:00:00Z`)}`)[0].n;
    check(`no-fabricated-freshness-${policy.id}`, postClosure === 0,
      `${postClosure} observations have retrieval timestamps on or after ${policy.statusSince}`);
  }
  const total = perSource.reduce((a, r) => a + r.n, 0);
  check('coverage-total', total >= TOTAL_FLOOR, `${total} total observations (floor ${TOTAL_FLOOR})`);

  // 4. Staleness
  for (const [sid, maxAge] of Object.entries(STALENESS_DAYS)) {
    const row = queryJson(`
      SELECT MAX(o.effective_date) latest FROM observations o JOIN entities e ON e.id=o.entity_id
      WHERE e.source_id='${sid}' AND e.active=1`)[0];
    const latest = row?.latest;
    const age = latest ? Math.floor((Date.now() - new Date(latest + 'T00:00:00Z')) / 86400000) : Infinity;
    check(`staleness-${sid}`, age <= maxAge, `latest effective_date ${latest} is ${age}d old (max ${maxAge})`);
  }

  // 5. Volatility guard (warn-level: flags, does not fail — new data can legitimately jump)
  const jumps = queryJson(`
    SELECT a.entity_id, a.value_days v1, b.value_days v2 FROM observations a
    JOIN observations b ON b.entity_id=a.entity_id
      AND b.effective_date = (SELECT MIN(c.effective_date) FROM observations c WHERE c.entity_id=a.entity_id AND c.effective_date > a.effective_date)
    WHERE a.status='ok' AND b.status='ok' AND (b.value_days > a.value_days*10 OR a.value_days > b.value_days*10)`);
  checks.push({ name: 'volatility-guard', pass: true, detail: `${jumps.length} >10x jumps flagged for review`, flagged: jumps.slice(0, 20) });

  // 6. Freshness of retrieval stamps
  const noProv = queryJson(`SELECT COUNT(*) n FROM observations WHERE retrieved_at='' OR retrieved_at IS NULL`)[0].n;
  check('provenance', noProv === 0, `${noProv} observations missing retrieved_at`);

  const pass = failures.length === 0;
  const report = { generated_at: new Date().toISOString(), pass, checks, failures };
  mkdirSync(EXPORTS, { recursive: true });
  writeFileSync(path.join(EXPORTS, 'validation-report.json'), JSON.stringify(report, null, 2));
  return report;
}
