import test from 'node:test';
import assert from 'node:assert/strict';
import { publicHistoryRows } from '../export.js';

const row = (entity_id, source_id, effective_date, value_raw) => ({
  entity_id,
  source_id,
  effective_date,
  value_raw,
});

test('unstamped public history removes only consecutive no-change artifacts', () => {
  const rows = [
    row('nz-example--p50', 'inz-processing-times', '2026-08-23', '22 working days'),
    row('nz-example--p50', 'inz-processing-times', '2026-08-30', '22 working days'),
    row('nz-example--p50', 'inz-processing-times', '2026-09-01', '21 working days'),
    row('nz-example--p50', 'inz-processing-times', '2026-09-08', '22 working days'),
  ];
  assert.deepEqual(
    publicHistoryRows(rows).map(item => item.effective_date),
    ['2026-08-23', '2026-09-01', '2026-09-08'],
  );
});

test('stamped source observations are never collapsed', () => {
  const rows = [
    row('ca-example', 'ircc-ptime', '2026-08-19', '31 days'),
    row('ca-example', 'ircc-ptime', '2026-08-26', '31 days'),
  ];
  assert.equal(publicHistoryRows(rows).length, 2);
});
