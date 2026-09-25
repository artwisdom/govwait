import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVE_SOURCES } from '../sources/index.js';
import { UNAVAILABLE_SOURCE_POLICIES } from '../source-policy.js';

test('UDI is retained explicitly but never invoked as an active collector', () => {
  const activeIds = ACTIVE_SOURCES.map(mod => mod.source.id);
  assert.deepEqual(activeIds, [
    'ircc-ptime',
    'ircc-forward-looking',
    'ircc-noncountry',
    'ircc-passport',
    'govuk-visa-times',
    'govuk-inuk-times',
    'govuk-passport',
    'inz-processing-times',
  ]);
  assert.equal(activeIds.includes('udi-waiting-times'), false);

  assert.deepEqual(UNAVAILABLE_SOURCE_POLICIES.map(policy => policy.id), ['udi-waiting-times']);
  const udi = UNAVAILABLE_SOURCE_POLICIES[0];
  assert.equal(udi.collectionStatus, 'source_unavailable');
  assert.match(udi.statusSince, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(udi.statusNote, /does not bypass access controls/i);
  assert.equal(udi.expectedActiveEntities, 19);
  assert.equal(udi.expectedObservations, 19);
});
