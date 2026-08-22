// Canadian passport processing times (domestic channels). The JSON carries no
// update stamp, so observations are UNSTAMPED: run.js inserts a row only when
// the value changes, with effective_date = first-observed date.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { normalizeDuration } from '../lib/normalize.js';

const URL = 'https://www.canada.ca/content/dam/ircc/documents/json/data-passport-ptime.json';
const HUMAN_PAGE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/processing-times.html';

export const source = {
  id: 'ircc-passport',
  name: 'Canadian passport processing times',
  jurisdiction: 'CA',
  agency: 'Immigration, Refugees and Citizenship Canada / Service Canada',
  url: HUMAN_PAGE,
  license_note: 'Government of Canada publication; extracted values with attribution (see ircc-ptime).',
};

const MAP = {
  'passport-offices': { key: 'ca-passport-office', name: 'Passport (in person at a passport office)' },
  'service-canada-centres': { key: 'ca-passport-service-canada', name: 'Passport (Service Canada Centre or by mail)' },
  'check-status-scc-mail': null, // duplicate of service-canada-centres shown in a status widget — skip
};

const stripTags = (h) => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export async function collect({ forceRefresh = false } = {}) {
  const { body } = await politeFetch(URL, { forceRefresh });
  const retrieved_at = cachedRetrievedAt(URL);
  const data = JSON.parse(body.replace(/^﻿/, ''));
  const en = data['passport-processing-times-en'];
  const entities = [];
  const observations = [];
  const errors = [];
  if (!en) return { entities, observations, errors: ['missing passport-processing-times-en block'] };

  for (const [k, rawHtml] of Object.entries(en)) {
    if (!(k in MAP)) { errors.push(`unmapped passport key ${k} — add to MAP`); continue; }
    const spec = MAP[k];
    if (spec === null) continue;
    const text = stripTags(rawHtml);
    const m = text.match(/(up to \d+\s+\w+|\d+\s+weeks?|\d+\s+days?)/i);
    if (!m) { errors.push(`${k}: no duration found in "${text}"`); continue; }
    // value_raw: the verbatim tail from the duration onward ("up to 2 weeks,
    // plus mail time") — concise enough to display as the headline value.
    const raw = text.slice(text.indexOf(m[1])).replace(/\.$/, '');
    const norm = normalizeDuration(m[1].toLowerCase());
    if (norm.error) { errors.push(`${k}: ${norm.error}`); continue; }
    entities.push({
      id: spec.key, source_id: source.id, jurisdiction: 'CA',
      service_category: 'passport', service_key: spec.key, service_name: spec.name,
      applicant_country: null, applicant_country_name: null,
    });
    observations.push({
      entity_id: spec.key, value_raw: raw, value_days: norm.value_days,
      unit_original: norm.unit_original, status: norm.status,
      effective_date: null, unstamped: true, // run.js resolves via change detection
      retrieved_at, source_url: HUMAN_PAGE,
    });
  }
  return { entities, observations, errors };
}
