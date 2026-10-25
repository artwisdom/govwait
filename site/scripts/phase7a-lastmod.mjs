// Audit expectations for the existing Phase 7A routes, independent of rendered XML.
// Keep the editorial baseline frozen; only applicable effective/first-observed data
// dates may advance a dynamic page. Retrieval, verification and build clocks do not.
const editorialOnly = new Set([
  '/guides/',
  '/guides/new-zealand-critical-purpose-visitor-visa-processing-time/',
  '/guides/new-zealand-2021-resident-visa-processing-time/',
  '/new-zealand/post-study-work-visa/',
]);
const datasetGuides = new Set([
  '/guides/canada-visitor-visa-by-country/',
  '/guides/canada-study-permit-from-nigeria/',
  '/guides/new-zealand-student-visa-processing-time/',
]);
const nzServices = new Set([
  'specific-purpose-work-visa', 'skilled-migrant-category-resident-visa',
  'straight-to-residence-visa', 'work-to-residence-visa', 'visitor-visa',
  'permanent-resident-visa', 'pathway-student-visa',
]);
const isDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export function phase7aLastmod(url, records, editorialDate) {
  if (!isDate(editorialDate)) throw new Error('Phase 7A editorial date must be an ISO date');
  if (editorialOnly.has(url)) return editorialDate;
  if (!Array.isArray(records)) throw new Error('Phase 7A source records are missing');

  let applicable;
  if (datasetGuides.has(url)) applicable = records;
  else if (url === '/guides/canada-visitor-visa-from-philippines/') {
    applicable = records.filter(record => record.id === 'ca-visitor-visa--ph');
  } else if (url === '/new-zealand/') {
    applicable = records.filter(record => record.jurisdiction === 'NZ');
  } else {
    const slug = url.match(/^\/new-zealand\/([^/]+)\/$/)?.[1];
    if (!nzServices.has(slug)) throw new Error(`No Phase 7A date policy for ${url}`);
    applicable = records.filter(record => record.service_key === `nz-${slug}`);
  }
  if (!applicable.length || applicable.some(record => !isDate(record.effective_date))) {
    throw new Error(`Missing or invalid applicable source dates for ${url}`);
  }
  return [editorialDate, ...applicable.map(record => record.effective_date)].sort().at(-1);
}
