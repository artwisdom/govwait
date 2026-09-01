import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDuration } from '../lib/normalize.js';
import { PAGE_SPECS, parseUdiPage } from '../sources/udi.js';

const retrieved = '2026-08-30T12:00:00.000Z';

function page(date, tables) {
  return `<html><body><p>Last updated:&nbsp; ${date}</p>${tables.join('')}</body></html>`;
}

function table(rows) {
  return `<table><thead><tr><th>Application</th><th>Waiting time</th></tr></thead><tbody>${rows
    .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`).join('')}</tbody></table>`;
}

test('duration normalization keeps a published range verbatim upstream and compares by its upper end', () => {
  assert.deepEqual(normalizeDuration('15–29 days'), { status: 'ok', value_days: 29, unit_original: 'days' });
  assert.deepEqual(normalizeDuration('15&ndash;29 days'.replace('&ndash;', '–')), { status: 'ok', value_days: 29, unit_original: 'days' });
  assert.match(normalizeDuration('29–15 days').error, /invalid duration range/);
});

test('visitor-visa parser extracts all official rows, date, provenance and range semantics', () => {
  const spec = PAGE_SPECS.find(item => item.slug === 'visitor-visa');
  const html = page('27 August 2026', [table([
    ['Embassy in your country of residence', '15 days'],
    ['Embassy in another country', '15&ndash;29 days'],
    ['Norwegian Directorate of Immigration (UDI)', '45 days'],
  ])]);
  const parsed = parseUdiPage(spec, html, retrieved);
  assert.deepEqual(parsed.errors, []);
  assert.equal(parsed.entities.length, 3);
  assert.ok(parsed.entities.every(entity => entity.jurisdiction === 'NO' && entity.metric_type === 'published'));
  assert.deepEqual(parsed.observations.map(observation => observation.value_raw), ['15 days', '15–29 days', '45 days']);
  assert.deepEqual(parsed.observations.map(observation => observation.value_days), [15, 29, 45]);
  assert.ok(parsed.observations.every(observation => observation.effective_date === '2026-08-27'));
  assert.ok(parsed.observations.every(observation => observation.source_url === spec.url));
});

test('two-table expulsion page preserves four distinct official routes', () => {
  const spec = PAGE_SPECS.find(item => item.slug === 'expulsion-entry-ban');
  const html = page('27 August 2026', [
    table([['Decision on expulsion', '10 months']]),
    table([
      ['EU/EEA citizens', '6 months'],
      ['Citizens of countries outside the EU/EEA', '5 months'],
      ['Citizens of countries outside the EU/EEA who are covered by the EEA regulations', '6 months'],
    ]),
  ]);
  const parsed = parseUdiPage(spec, html, retrieved);
  assert.deepEqual(parsed.errors, []);
  assert.equal(parsed.entities.length, 4);
  assert.equal(new Set(parsed.entities.map(entity => entity.id)).size, 4);
});

test('schema drift fails loudly for missing and unknown rows', () => {
  const spec = PAGE_SPECS.find(item => item.slug === 'visitor-visa');
  const html = page('27 August 2026', [table([
    ['Embassy in your country of residence', '15 days'],
    ['A newly introduced route', '20 days'],
  ])]);
  const parsed = parseUdiPage(spec, html, retrieved);
  assert.ok(parsed.errors.some(error => error.includes('unknown row "A newly introduced route"')));
  assert.ok(parsed.errors.some(error => error.includes('missing row "Embassy in another country"')));
  assert.ok(parsed.errors.some(error => error.includes('missing row "Norwegian Directorate of Immigration (UDI)"')));
});

test('missing official update date fails loudly', () => {
  const spec = PAGE_SPECS.find(item => item.slug === 'visitor-visa');
  const html = table(spec.rows.map(row => [row[0], '15 days']));
  const parsed = parseUdiPage(spec, html, retrieved);
  assert.ok(parsed.errors.some(error => error.includes('missing or invalid Last updated date')));
});
