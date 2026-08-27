// Deliberate first-wave publication cohort for New Zealand. The pipeline/API
// track every official visa immediately, while human landing pages expand in
// reviewed batches of at most 30 so search engines receive useful pages rather
// than a sudden wall of near-identical URLs.
export const NZ_ROLLOUT_SERVICE_KEYS = Object.freeze([
  'nz-visitor-visa',
  'nz-accredited-employer-work-visa',
  'nz-business-visitor-visa',
  'nz-parent-resident-visa',
  'nz-partner-of-a-new-zealander-resident-visa',
  'nz-partner-of-a-new-zealander-visitor-visa',
  'nz-partner-of-a-worker-work-visa',
  'nz-fee-paying-student-visa',
  'nz-post-study-work-visa',
  'nz-permanent-resident-visa',
  'nz-skilled-migrant-category-resident-visa',
  'nz-straight-to-residence-visa',
  'nz-work-to-residence-visa',
  'nz-active-investor-plus-visa',
  'nz-child-of-a-new-zealander-visitor-visa',
  'nz-dependent-child-resident-visa',
  'nz-medical-treatment-visitor-visa',
  'nz-parent-and-grandparent-visitor-visa',
  'nz-parent-retirement-resident-visa',
  'nz-partner-of-a-new-zealander-work-visa',
  'nz-partner-of-a-student-work-visa',
  'nz-pathway-student-visa',
  'nz-recognised-seasonal-employer-limited-visa',
  'nz-specific-purpose-work-visa',
  'nz-transit-visa',
]);

const nzPublished = new Set(NZ_ROLLOUT_SERVICE_KEYS);

// IRCC's forward-looking file contains 28 programs immediately in the API, but
// human pages roll out in reviewed cohorts. The first wave focuses on the most
// searched economic and family routes and stays below the 30-page source-release
// ceiling. Remaining programs continue to be machine-readable until reviewed.
export const CA_FORWARD_ROLLOUT_SERVICE_KEYS = Object.freeze([
  'ca-atlantic-immigration-program',
  'ca-canadian-experience-class',
  'ca-federal-skilled-worker',
  'ca-provincial-nominee-non-express-entry',
  'ca-provincial-nominee-express-entry',
  'ca-quebec-skilled-worker',
  'ca-parents-grandparents-sponsorship-quebec',
  'ca-parents-grandparents-sponsorship-outside-quebec',
  'ca-spouse-partner-inside-canada-quebec',
  'ca-spouse-partner-inside-canada-outside-quebec',
  'ca-spouse-partner-outside-canada-quebec',
  'ca-spouse-partner-outside-canada-outside-quebec',
]);

const caForwardPublished = new Set(CA_FORWARD_ROLLOUT_SERVICE_KEYS);
const caForwardAll = new Set([
  ...CA_FORWARD_ROLLOUT_SERVICE_KEYS,
  'ca-caregivers',
  'ca-quebec-business-class',
  'ca-self-employed-persons',
  'ca-start-up-visa',
  'ca-government-assisted-refugees-quebec',
  'ca-government-assisted-refugees-outside-quebec',
  'ca-privately-sponsored-refugees-quebec',
  'ca-privately-sponsored-refugees-outside-quebec',
  'ca-protected-persons-in-canada-quebec',
  'ca-protected-persons-in-canada-outside-quebec',
  'ca-protected-person-dependants-abroad-quebec',
  'ca-protected-person-dependants-abroad-outside-quebec',
  'ca-humanitarian-compassionate-quebec',
  'ca-humanitarian-compassionate-outside-quebec',
  'ca-citizenship-grant',
  'ca-citizenship-certificate',
]);

export function isServicePublished(jurisdiction, serviceKey) {
  if (jurisdiction === 'NZ') return nzPublished.has(serviceKey);
  if (jurisdiction === 'CA' && caForwardAll.has(serviceKey)) return caForwardPublished.has(serviceKey);
  return true;
}
