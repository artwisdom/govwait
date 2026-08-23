import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTimeline, parseVisaList } from '../sources/inz.js';

test('parseVisaList reads the official component attribute without probing IDs', () => {
  const visas = Array.from({ length: 120 }, (_, index) => ({ id: index + 1, name: `Visa ${index + 1}` }));
  const encoded = JSON.stringify(visas).replaceAll('"', '&quot;');
  assert.deepEqual(parseVisaList(`<visa-processing :visas="${encoded}"></visa-processing>`), visas);
});

test('parseTimeline preserves the two official working-day percentile metrics', () => {
  const rows = parseTimeline(
    { id: 1, name: 'Visitor Visa' },
    JSON.stringify({ Name: 'Visitor Visa', Percent50: 7, Percent80: 11, AverageWait: '1 week', MostWaitTime: '2 weeks' }),
    '2026-08-23T12:00:00.000Z',
  );
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map(row => row.entity.id), ['nz-visitor-visa--p50', 'nz-visitor-visa--p80']);
  assert.deepEqual(rows.map(row => row.observation.value_raw), ['7 working days', '11 working days']);
  assert.ok(rows.every(row => row.entity.service_key === 'nz-visitor-visa'));
  assert.ok(rows.every(row => row.observation.unstamped === true));
});

test('parseTimeline rejects inverted percentiles', () => {
  assert.throws(() => parseTimeline(
    { id: 1, name: 'Visitor Visa' },
    JSON.stringify({ Name: 'Visitor Visa', Percent50: 12, Percent80: 10 }),
    '2026-08-23T12:00:00.000Z',
  ), /Percent80.*below Percent50/);
});
