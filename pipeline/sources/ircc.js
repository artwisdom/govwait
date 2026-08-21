// Canada IRCC processing times — official JSON behind the IRCC "Check
// processing times" tool. ~8 categories × ~212 applicant countries, ~weekly.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { normalizeDuration, countryName, parseUsDate } from '../lib/normalize.js';

const URL = 'https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json';
const TOOL_PAGE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';

export const source = {
  id: 'ircc-ptime',
  name: 'IRCC Check Processing Times data',
  jurisdiction: 'CA',
  agency: 'Immigration, Refugees and Citizenship Canada',
  url: TOOL_PAGE,
  license_note: 'Government of Canada publication; facts/values extracted under fair-dealing-style factual reuse. Non-commercial reproduction terms noted; we store extracted values with attribution, not page content. Owner review recommended before commercial launch.',
};

const CATEGORIES = {
  'visitor-outside-canada': { key: 'ca-visitor-visa', name: 'Visitor visa (applying from outside Canada)', category: 'visa' },
  'supervisa':              { key: 'ca-super-visa', name: 'Super visa (parents and grandparents)', category: 'visa' },
  'study':                  { key: 'ca-study-permit', name: 'Study permit (applying from outside Canada)', category: 'permit' },
  'work':                   { key: 'ca-work-permit', name: 'Work permit (applying from outside Canada)', category: 'permit' },
  'child_dependent':        { key: 'ca-sponsor-dependent-child', name: 'Sponsorship: dependent child', category: 'sponsorship' },
  'child_adopted':          { key: 'ca-sponsor-adopted-child', name: 'Sponsorship: adopted child', category: 'sponsorship' },
  'refugees_gov':           { key: 'ca-refugee-gov-assisted', name: 'Government-assisted refugee resettlement', category: 'refugee' },
  'refugees_private':       { key: null, name: null, category: 'refugee' }, // special-cased below (two metrics)
};

export async function collect({ forceRefresh = false } = {}) {
  const { body } = await politeFetch(URL, { forceRefresh });
  const retrieved_at = cachedRetrievedAt(URL);
  const data = JSON.parse(body);
  const entities = [];
  const observations = [];
  const errors = [];

  for (const [cat, spec] of Object.entries(CATEGORIES)) {
    const block = data[cat];
    if (!block || typeof block !== 'object') { errors.push(`missing category ${cat}`); continue; }
    const effective = parseUsDate(block.lastupdated || '');
    if (!effective) { errors.push(`bad lastupdated in ${cat}: "${block.lastupdated}"`); continue; }

    for (const [cc, rawVal] of Object.entries(block)) {
      if (cc === 'lastupdated') continue;
      if (!/^[A-Z]{2}$/i.test(cc)) { errors.push(`unexpected key ${cat}/${cc}`); continue; }

      const variants = cat === 'refugees_private'
        ? [
            { key: 'ca-refugee-private-sponsor-side', name: 'Privately sponsored refugee: sponsor processing', raw: rawVal?.sponsor },
            { key: 'ca-refugee-private-refugee-side', name: 'Privately sponsored refugee: refugee processing', raw: rawVal?.refugee },
          ]
        : [{ key: spec.key, name: spec.name, raw: rawVal }];

      for (const v of variants) {
        if (v.raw === undefined || v.raw === null) { errors.push(`missing value ${cat}/${cc}`); continue; }
        const norm = normalizeDuration(v.raw);
        if (norm.error) { errors.push(`${cat}/${cc}: ${norm.error}`); continue; }
        const entityId = `${v.key}--${cc.toLowerCase()}`;
        entities.push({
          id: entityId,
          source_id: source.id,
          jurisdiction: 'CA',
          service_category: spec.category,
          service_key: v.key,
          service_name: v.name,
          applicant_country: cc.toUpperCase(),
          applicant_country_name: countryName(cc),
        });
        observations.push({
          entity_id: entityId,
          value_raw: String(v.raw),
          value_days: norm.value_days,
          unit_original: norm.unit_original,
          status: norm.status,
          effective_date: effective,
          retrieved_at,
          source_url: URL,
        });
      }
    }
  }
  return { entities, observations, errors };
}
