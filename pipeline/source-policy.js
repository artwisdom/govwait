// Sources removed from active collection remain explicit, testable states.
// Their entities and observations stay append-only; no failed fetch, rebuild,
// or passage of time is allowed to masquerade as a fresh verification.
export const UNAVAILABLE_SOURCE_POLICIES = Object.freeze([
  Object.freeze({
    id: 'udi-waiting-times',
    collectionStatus: 'source_unavailable',
    statusSince: '2026-09-04',
    statusNote: 'Automated collection paused after UDI robots.txt began returning HTTP 403. GovWait does not bypass access controls; preserved values remain labeled with their last successful verification.',
    expectedActiveEntities: 19,
    expectedObservations: 19,
  }),
]);
