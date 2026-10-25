import test from 'node:test';
import assert from 'node:assert/strict';
import { phase7aLastmod } from './phase7a-lastmod.mjs';

const editorial = '2026-10-02';
// Synthetic policy fixtures: dates describe source content, not live collections.
const records = [
  { id: 'ca-other', jurisdiction: 'CA', effective_date: '2026-10-20' },
  { id: 'ca-visitor-visa--ph', jurisdiction: 'CA', effective_date: '2026-10-09' },
  { id: 'nz-specific-purpose-work-visa--p50', jurisdiction: 'NZ', service_key: 'nz-specific-purpose-work-visa', effective_date: '2026-10-10' },
  { id: 'nz-specific-purpose-work-visa--p80', jurisdiction: 'NZ', service_key: 'nz-specific-purpose-work-visa', effective_date: '2026-10-13' },
  { id: 'no-retained', jurisdiction: 'NO', effective_date: '2026-09-03', source_collection_status: 'source_unavailable' },
];

for (const url of [
  '/guides/canada-visitor-visa-by-country/',
  '/guides/canada-study-permit-from-nigeria/',
  '/guides/new-zealand-student-visa-processing-time/',
]) {
  test(`${url} follows substantive dataset dates and retains the editorial floor`, () => {
    assert.equal(phase7aLastmod(url, records, editorial), '2026-10-20');
    assert.equal(phase7aLastmod(url, [{ effective_date: '2026-09-30' }], editorial), editorial);
  });
}

test('Philippines guide follows its own record, not unrelated source dates', () => {
  assert.equal(phase7aLastmod('/guides/canada-visitor-visa-from-philippines/', records, editorial), '2026-10-09');
});

test('NZ hub uses NZ source dates and ignores newer Canadian dates', () => {
  assert.equal(phase7aLastmod('/new-zealand/', records, editorial), '2026-10-13');
});

test('every existing Phase 7A NZ service uses its own latest metric date', () => {
  for (const slug of [
    'specific-purpose-work-visa', 'skilled-migrant-category-resident-visa',
    'straight-to-residence-visa', 'work-to-residence-visa', 'visitor-visa',
    'permanent-resident-visa', 'pathway-student-visa',
  ]) {
    const own = [
      { service_key: `nz-${slug}`, effective_date: '2026-09-29' },
      { service_key: `nz-${slug}`, effective_date: '2026-10-17' },
      { service_key: 'nz-unrelated', effective_date: '2026-10-23' },
    ];
    assert.equal(phase7aLastmod(`/new-zealand/${slug}/`, own, editorial), '2026-10-17');
  }
});

test('editorial-only guides, closed-route guides and reviewed post-study page keep their real date', () => {
  for (const url of [
    '/guides/',
    '/guides/new-zealand-critical-purpose-visitor-visa-processing-time/',
    '/guides/new-zealand-2021-resident-visa-processing-time/',
    '/new-zealand/post-study-work-visa/',
  ]) assert.equal(phase7aLastmod(url, [{ effective_date: '2099-01-01' }], editorial), editorial);
});

test('retrieval and verification timestamps never refresh a sitemap date', () => {
  const laterChecks = records.map(record => ({ ...record, retrieved_at: '2099-12-31T12:00:00Z', source_last_verified_at: '2099-12-31T12:00:00Z' }));
  for (const url of ['/new-zealand/', '/guides/canada-visitor-visa-by-country/', '/guides/canada-visitor-visa-from-philippines/']) {
    assert.equal(phase7aLastmod(url, laterChecks, editorial), phase7aLastmod(url, records, editorial));
  }
});

test('missing and malformed applicable dates fail closed', () => {
  assert.throws(() => phase7aLastmod('/new-zealand/', [], editorial), /Missing or invalid/);
  assert.throws(() => phase7aLastmod('/guides/canada-visitor-visa-from-philippines/', [{ id: 'other', effective_date: editorial }], editorial), /Missing or invalid/);
  assert.throws(() => phase7aLastmod('/new-zealand/', [{ jurisdiction: 'NZ', effective_date: null }], editorial), /Missing or invalid/);
  assert.throws(() => phase7aLastmod('/new-zealand/', records, 'today'), /editorial date/);
});

test('an unknown route cannot silently inherit a Phase 7A date policy', () => {
  assert.throws(() => phase7aLastmod('/new-zealand/unapproved-route/', records, editorial), /No Phase 7A/);
  assert.throws(() => phase7aLastmod('/norway/', records, editorial), /No Phase 7A/);
});
