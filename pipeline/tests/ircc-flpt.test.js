import test from 'node:test';
import assert from 'node:assert/strict';
import { PROGRAMS, parseFlpt, parseForwardDuration, parseQueuePeople } from '../sources/ircc-flpt.js';

test('forward-looking duration parser preserves qualifiers while normalizing values', () => {
  assert.deepEqual(parseForwardDuration('About 26 months'), { status: 'ok', value_days: 791.44, unit_original: 'months' });
  assert.deepEqual(parseForwardDuration('4 months left'), { status: 'ok', value_days: 121.76, unit_original: 'months' });
  assert.deepEqual(parseForwardDuration('More than 10 years'), { status: 'ok', value_days: 3652.5, unit_original: 'years' });
  assert.equal(parseForwardDuration('No data available').status, 'unavailable');
  assert.equal(parseForwardDuration('We need more time to process your application').status, 'insufficient_data');
  assert.match(parseForwardDuration('soon').error, /unparseable/);
});

test('queue parser accepts official approximate and upper-bound wording', () => {
  assert.deepEqual(parseQueuePeople('About 59,700 people waiting'), { people: 59700 });
  assert.deepEqual(parseQueuePeople('About 4,200 people ahead of you'), { people: 4200 });
  assert.deepEqual(parseQueuePeople('Less than 100 people ahead of you'), { people: 100 });
  assert.match(parseQueuePeople('many people').error, /unparseable/);
});

function fixture() {
  const current = {};
  const totals = {};
  const waits = {};
  const ahead = {};
  for (const key of Object.keys(PROGRAMS)) {
    current[key] = key === 'startup-visa' ? 'More than 10 years' : 'About 6 months';
    totals[key] = 'About 1,200 people waiting';
    for (let index = 0; index < 126; index++) {
      const year = 2016 + Math.floor(index / 12);
      const month = String(index % 12 + 1).padStart(2, '0');
      const compound = `${key}-${year}/${month}`;
      waits[compound] = index < 60 ? 'We need more time to process your application' : '6 months left';
      ahead[compound] = index < 2 ? 'Less than 100 people ahead of you' : 'About 1,200 people ahead of you';
    }
  }
  return {
    'default-update': { flpt_lastupdated: 'August 10, 2026', flpt_interval: 'monthly' },
    'total-people': totals,
    'current-flpt': current,
    'people-ahead': ahead,
    'wait-times': waits,
  };
}

test('full parser keeps headline projections separate from application-month cohorts', () => {
  const result = parseFlpt(fixture(), '2026-08-26T12:00:00.000Z');
  assert.deepEqual(result.errors, []);
  assert.equal(result.entities.length, 28);
  assert.equal(result.observations.length, 28);
  assert.equal(result.forwardEstimates.length, 28 + 28 * 126);
  assert.ok(result.entities.every(entity => entity.metric_type === 'forward'));
  const cec = result.forwardEstimates.filter(row => row.entity_id === 'ca-canadian-experience-class');
  assert.equal(cec[0].cohort_month, '');
  assert.equal(cec.at(-1).cohort_month, '2026-06-01');
  assert.equal(cec.at(-1).snapshot_date, '2026-08-10');
});

test('schema drift fails loudly instead of silently dropping a new program', () => {
  const data = fixture();
  data['current-flpt'].mystery = '4 months';
  data['total-people'].mystery = 'About 100 people waiting';
  const result = parseFlpt(data, '2026-08-26T12:00:00.000Z');
  assert.ok(result.errors.some(error => error.includes('unknown program keys: mystery')));
});
