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

export function isServicePublished(jurisdiction, serviceKey) {
  return jurisdiction !== 'NZ' || nzPublished.has(serviceKey);
}
