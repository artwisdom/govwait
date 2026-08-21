// Validation suite — every check is recorded; any FAIL means the pipeline
// exits non-zero and nothing downstream rebuilds.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { queryJson } from './lib/db.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTS = path.join(ROOT, 'data', 'exports');

const COVERAGE_FLOORS = { 'ircc-ptime': 1200, 'govuk-visa-times': 10 };
const STALENESS_DAYS = { 'ircc-ptime': 45, 'govuk-visa-times': 120 };
const TOTAL_FLOOR = 300;
// Refugee-resettlement categories legitimately reach ~5 years ("58 months",
// gov-assisted from TZ, observed 2026-08). 3000d is the absurdity bound.
const MAX_DAYS = 3000;

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
    WHERE id = '' OR jurisdiction NOT GLOB '[A-Z][A-Z]'
       OR (applicant_country IS NOT NULL AND applicant_country NOT GLOB '[A-Z][A-Z]')`)[0].n;
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

  // 2. Range sanity
  const outOfRange = queryJson(`SELECT COUNT(*) n FROM observations WHERE status='ok' AND (value_days <= 0 OR value_days > ${MAX_DAYS})`)[0].n;
  check('value-range', outOfRange === 0, `${outOfRange} observations outside (0, ${MAX_DAYS}] days`);

  // 3. Coverage floors
  const perSource = queryJson(`
    SELECT e.source_id, COUNT(*) n FROM observations o JOIN entities e ON e.id=o.entity_id GROUP BY e.source_id`);
  for (const [sid, floor] of Object.entries(COVERAGE_FLOORS)) {
    const n = perSource.find(r => r.source_id === sid)?.n || 0;
    check(`coverage-${sid}`, n >= floor, `${n} observations (floor ${floor})`);
  }
  const total = perSource.reduce((a, r) => a + r.n, 0);
  check('coverage-total', total >= TOTAL_FLOOR, `${total} total observations (floor ${TOTAL_FLOOR})`);

  // 4. Staleness
  for (const [sid, maxAge] of Object.entries(STALENESS_DAYS)) {
    const row = queryJson(`
      SELECT MAX(o.effective_date) latest FROM observations o JOIN entities e ON e.id=o.entity_id
      WHERE e.source_id='${sid}'`)[0];
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
