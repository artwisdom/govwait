// Canada IRCC forward-looking processing times. This source is deliberately
// separate from IRCC's backward-looking country data: its headline values are
// projections for an application received today, and its dated keys describe
// application-month cohorts in the current snapshot (not old publication
// snapshots). Both dimensions remain labeled through the pipeline and API.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { parseUsDate } from '../lib/normalize.js';

export const DATA_URL = 'https://www.canada.ca/content/dam/ircc/documents/json/flpt-en.json';
export const TOOL_PAGE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';

export const source = {
  id: 'ircc-forward-looking',
  name: 'IRCC forward-looking processing times and in-queue estimates',
  jurisdiction: 'CA',
  agency: 'Immigration, Refugees and Citizenship Canada',
  url: TOOL_PAGE,
  license_note: 'Government of Canada factual publication. GovWait stores extracted estimates, queue figures and provenance with attribution; it does not reproduce IRCC page copy.',
};

// Keys are the stable identifiers used in IRCC's official JSON. Names mirror
// the choices in the public IRCC processing-times tool; location qualifiers are
// explicit so Quebec and the rest of Canada never collapse into one route.
export const PROGRAMS = Object.freeze({
  aip: { serviceKey: 'ca-atlantic-immigration-program', name: 'Atlantic Immigration Program', category: 'settlement' },
  caregiver: { serviceKey: 'ca-caregivers', name: 'Caregivers (all programs)', category: 'settlement' },
  cec: { serviceKey: 'ca-canadian-experience-class', name: 'Canadian Experience Class', category: 'settlement' },
  fsw: { serviceKey: 'ca-federal-skilled-worker', name: 'Federal Skilled Worker Program', category: 'settlement' },
  'pnp-base': { serviceKey: 'ca-provincial-nominee-non-express-entry', name: 'Provincial Nominee Program (non-Express Entry)', category: 'settlement' },
  'pnp-ee': { serviceKey: 'ca-provincial-nominee-express-entry', name: 'Provincial Nominee Program (Express Entry)', category: 'settlement' },
  qsw: { serviceKey: 'ca-quebec-skilled-worker', name: 'Quebec Skilled Worker Program', category: 'settlement' },
  'quebec-business': { serviceKey: 'ca-quebec-business-class', name: 'Quebec Business Class', category: 'settlement' },
  'self-employed': { serviceKey: 'ca-self-employed-persons', name: 'Self-employed persons (federal)', category: 'settlement' },
  'startup-visa': { serviceKey: 'ca-start-up-visa', name: 'Start-up Visa', category: 'settlement' },
  'pgp-quebec': { serviceKey: 'ca-parents-grandparents-sponsorship-quebec', name: 'Parents and grandparents sponsorship — Quebec', category: 'sponsorship' },
  'pgp-roc': { serviceKey: 'ca-parents-grandparents-sponsorship-outside-quebec', name: 'Parents and grandparents sponsorship — outside Quebec', category: 'sponsorship' },
  'spousal-canada-quebec': { serviceKey: 'ca-spouse-partner-inside-canada-quebec', name: 'Spouse or partner sponsorship — inside Canada, Quebec', category: 'sponsorship' },
  'spousal-canada-roc': { serviceKey: 'ca-spouse-partner-inside-canada-outside-quebec', name: 'Spouse or partner sponsorship — inside Canada, outside Quebec', category: 'sponsorship' },
  'spousal-abroad-quebec': { serviceKey: 'ca-spouse-partner-outside-canada-quebec', name: 'Spouse, partner or conjugal sponsorship — outside Canada, Quebec', category: 'sponsorship' },
  'spousal-abroad-roc': { serviceKey: 'ca-spouse-partner-outside-canada-outside-quebec', name: 'Spouse, partner or conjugal sponsorship — outside Canada, outside Quebec', category: 'sponsorship' },
  'government-refugees-quebec': { serviceKey: 'ca-government-assisted-refugees-quebec', name: 'Government-assisted refugees — Quebec', category: 'refugee' },
  'government-refugees-roc': { serviceKey: 'ca-government-assisted-refugees-outside-quebec', name: 'Government-assisted refugees — outside Quebec', category: 'refugee' },
  'private-refugees-quebec': { serviceKey: 'ca-privately-sponsored-refugees-quebec', name: 'Privately sponsored refugees — Quebec', category: 'refugee' },
  'private-refugees-roc': { serviceKey: 'ca-privately-sponsored-refugees-outside-quebec', name: 'Privately sponsored refugees — outside Quebec', category: 'refugee' },
  'protected-persons-in-canada-quebec': { serviceKey: 'ca-protected-persons-in-canada-quebec', name: 'Protected persons and Convention refugees in Canada — Quebec', category: 'refugee' },
  'protected-persons-in-canada-roc': { serviceKey: 'ca-protected-persons-in-canada-outside-quebec', name: 'Protected persons and Convention refugees in Canada — outside Quebec', category: 'refugee' },
  'dependants-abroad-quebec': { serviceKey: 'ca-protected-person-dependants-abroad-quebec', name: 'Dependants abroad of protected persons — Quebec', category: 'refugee' },
  'dependants-abroad-roc': { serviceKey: 'ca-protected-person-dependants-abroad-outside-quebec', name: 'Dependants abroad of protected persons — outside Quebec', category: 'refugee' },
  'humanitarian-quebec': { serviceKey: 'ca-humanitarian-compassionate-quebec', name: 'Humanitarian and compassionate cases — Quebec', category: 'settlement' },
  'humanitarian-roc': { serviceKey: 'ca-humanitarian-compassionate-outside-quebec', name: 'Humanitarian and compassionate cases — outside Quebec', category: 'settlement' },
  'citizen-grants': { serviceKey: 'ca-citizenship-grant', name: 'Citizenship grant', category: 'settlement' },
  'citizen-proofs': { serviceKey: 'ca-citizenship-certificate', name: 'Citizenship certificate (proof of citizenship)', category: 'settlement' },
});

const PROGRAM_KEYS = Object.keys(PROGRAMS).sort();
const MIN_COHORTS_PER_PROGRAM = 120;
const DAYS_PER = { day: 1, week: 7, month: 30.44, year: 365.25 };

export function parseForwardDuration(raw) {
  const value = String(raw ?? '').trim();
  if (value === 'No data available') {
    return { status: 'unavailable', value_days: null, unit_original: null };
  }
  if (value === 'We need more time to process your application') {
    return { status: 'insufficient_data', value_days: null, unit_original: null };
  }
  const match = value.match(/^(?:About |More than )?(\d+(?:\.\d+)?)\s+(day|week|month|year)s?(?: left)?$/i);
  if (!match) return { error: `unparseable forward-looking duration: "${value}"` };
  const number = Number.parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  if (!(number > 0)) return { error: `non-positive forward-looking duration: "${value}"` };
  return {
    status: 'ok',
    value_days: Math.round(number * DAYS_PER[unit] * 10000) / 10000,
    unit_original: `${unit}s`,
  };
}

export function parseQueuePeople(raw) {
  const value = String(raw ?? '').trim();
  const match = value.match(/^(?:About|Less than)\s+([0-9,]+)\s+people\s+(?:waiting|ahead of you)$/i);
  if (!match) return { error: `unparseable queue estimate: "${value}"` };
  const people = Number.parseInt(match[1].replace(/,/g, ''), 10);
  if (!(people > 0)) return { error: `non-positive queue estimate: "${value}"` };
  return { people };
}

function compareKeys(block, label, errors) {
  if (!block || typeof block !== 'object' || Array.isArray(block)) {
    errors.push(`missing or invalid ${label} object`);
    return;
  }
  const actual = Object.keys(block).sort();
  const missing = PROGRAM_KEYS.filter(key => !actual.includes(key));
  const extra = actual.filter(key => !PROGRAM_KEYS.includes(key));
  if (missing.length) errors.push(`${label} missing program keys: ${missing.join(', ')}`);
  if (extra.length) errors.push(`${label} has unknown program keys: ${extra.join(', ')}`);
}

export function parseFlpt(data, retrievedAt = new Date().toISOString()) {
  const entities = [];
  const observations = [];
  const forwardEstimates = [];
  const errors = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { entities, observations, forwardEstimates, errors: ['root JSON is not an object'] };
  }
  const expectedTop = ['current-flpt', 'default-update', 'people-ahead', 'total-people', 'wait-times'];
  const topKeys = Object.keys(data).sort();
  const topMissing = expectedTop.filter(key => !topKeys.includes(key));
  const topExtra = topKeys.filter(key => !expectedTop.includes(key));
  if (topMissing.length) errors.push(`missing top-level keys: ${topMissing.join(', ')}`);
  if (topExtra.length) errors.push(`unknown top-level keys: ${topExtra.join(', ')}`);

  const sourceDate = parseUsDate(data['default-update']?.flpt_lastupdated || '');
  if (!sourceDate) errors.push(`bad flpt_lastupdated: "${data['default-update']?.flpt_lastupdated || ''}"`);
  if (data['default-update']?.flpt_interval !== 'monthly') {
    errors.push(`unexpected flpt_interval: "${data['default-update']?.flpt_interval || ''}"`);
  }

  const current = data['current-flpt'];
  const totals = data['total-people'];
  const waits = data['wait-times'];
  const ahead = data['people-ahead'];
  compareKeys(current, 'current-flpt', errors);
  compareKeys(totals, 'total-people', errors);
  if (!waits || typeof waits !== 'object' || Array.isArray(waits)) errors.push('missing or invalid wait-times object');
  if (!ahead || typeof ahead !== 'object' || Array.isArray(ahead)) errors.push('missing or invalid people-ahead object');

  if (!sourceDate || errors.some(error => error.startsWith('missing or invalid'))) {
    return { entities, observations, forwardEstimates, errors };
  }

  for (const programKey of PROGRAM_KEYS) {
    const spec = PROGRAMS[programKey];
    const duration = parseForwardDuration(current?.[programKey]);
    const queue = parseQueuePeople(totals?.[programKey]);
    if (duration.error) errors.push(`${programKey}/current-flpt: ${duration.error}`);
    if (queue.error) errors.push(`${programKey}/total-people: ${queue.error}`);
    if (duration.error || queue.error) continue;

    entities.push({
      id: spec.serviceKey,
      source_id: source.id,
      jurisdiction: 'CA',
      service_category: spec.category,
      metric_type: 'forward',
      service_key: spec.serviceKey,
      service_name: spec.name,
      applicant_country: null,
      applicant_country_name: null,
    });
    observations.push({
      entity_id: spec.serviceKey,
      value_raw: String(current[programKey]),
      value_days: duration.value_days,
      unit_original: duration.unit_original,
      status: duration.status,
      effective_date: sourceDate,
      retrieved_at: retrievedAt,
      source_url: DATA_URL,
    });
    forwardEstimates.push({
      entity_id: spec.serviceKey,
      snapshot_date: sourceDate,
      cohort_month: '',
      wait_raw: String(current[programKey]),
      wait_days: duration.value_days,
      unit_original: duration.unit_original,
      status: duration.status,
      queue_raw: String(totals[programKey]),
      queue_people: queue.people,
      retrieved_at: retrievedAt,
      source_url: DATA_URL,
    });
  }

  const waitEntries = waits && typeof waits === 'object' ? Object.entries(waits) : [];
  const aheadKeys = new Set(ahead && typeof ahead === 'object' ? Object.keys(ahead) : []);
  const waitKeys = new Set(waitEntries.map(([key]) => key));
  const counts = new Map(PROGRAM_KEYS.map(key => [key, 0]));

  for (const [compoundKey, waitRaw] of waitEntries.sort(([a], [b]) => a.localeCompare(b))) {
    const match = compoundKey.match(/^(.+)-(\d{4})\/(\d{2})$/);
    if (!match) { errors.push(`malformed wait-times key: ${compoundKey}`); continue; }
    const [, programKey, year, month] = match;
    const spec = PROGRAMS[programKey];
    if (!spec) { errors.push(`wait-times has unknown program key: ${programKey}`); continue; }
    if (Number(month) < 1 || Number(month) > 12) { errors.push(`invalid cohort month: ${compoundKey}`); continue; }
    if (!aheadKeys.has(compoundKey)) { errors.push(`people-ahead missing matching key: ${compoundKey}`); continue; }

    const duration = parseForwardDuration(waitRaw);
    const queue = parseQueuePeople(ahead[compoundKey]);
    if (duration.error) errors.push(`${compoundKey}/wait-times: ${duration.error}`);
    if (queue.error) errors.push(`${compoundKey}/people-ahead: ${queue.error}`);
    if (duration.error || queue.error) continue;

    counts.set(programKey, (counts.get(programKey) || 0) + 1);
    forwardEstimates.push({
      entity_id: spec.serviceKey,
      snapshot_date: sourceDate,
      cohort_month: `${year}-${month}-01`,
      wait_raw: String(waitRaw),
      wait_days: duration.value_days,
      unit_original: duration.unit_original,
      status: duration.status,
      queue_raw: String(ahead[compoundKey]),
      queue_people: queue.people,
      retrieved_at: retrievedAt,
      source_url: DATA_URL,
    });
  }

  for (const key of aheadKeys) if (!waitKeys.has(key)) errors.push(`people-ahead has unmatched key: ${key}`);
  for (const [programKey, count] of counts) {
    if (count < MIN_COHORTS_PER_PROGRAM) errors.push(`${programKey} has ${count} cohort rows (floor ${MIN_COHORTS_PER_PROGRAM})`);
  }
  if (waitEntries.length < 3500) errors.push(`wait-times has ${waitEntries.length} rows (floor 3500)`);

  return { entities, observations, forwardEstimates, errors };
}

export async function collect({ forceRefresh = false } = {}) {
  const { body } = await politeFetch(DATA_URL, { forceRefresh });
  const retrievedAt = cachedRetrievedAt(DATA_URL);
  let data;
  try { data = JSON.parse(body); }
  catch (error) { return { entities: [], observations: [], forwardEstimates: [], errors: [`invalid JSON: ${error.message}`] }; }
  return parseFlpt(data, retrievedAt);
}
