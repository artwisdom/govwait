// UK passport processing time — HM Passport Office's published service statement
// via the gov.uk Content API. One entity; the statement changes rarely and the
// page's public_updated_at is its honest effective date.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { normalizeDuration } from '../lib/normalize.js';

const API_URL = 'https://www.gov.uk/api/content/government/organisations/hm-passport-office/about/about-our-services';
const HUMAN_URL = 'https://www.gov.uk/government/organisations/hm-passport-office/about/about-our-services';

export const source = {
  id: 'govuk-passport',
  name: 'UK passport processing time (HM Passport Office service statement)',
  jurisdiction: 'GB',
  agency: 'HM Passport Office',
  url: HUMAN_URL,
  license_note: 'Open Government Licence v3.0 — reuse permitted with attribution.',
};

export async function collect({ forceRefresh = false } = {}) {
  const { body } = await politeFetch(API_URL, { forceRefresh });
  const retrieved_at = cachedRetrievedAt(API_URL);
  const doc = JSON.parse(body);
  const effective = (doc.public_updated_at || '').slice(0, 10);
  const text = String(doc.details?.body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const errors = [];
  if (!effective) errors.push('missing public_updated_at');
  const m = text.match(/usually get your passport within ([a-z0-9 ]{3,30}?)(?:\s+of applying)?[.,]/i);
  if (!m) return { entities: [], observations: [], errors: [...errors, 'passport statement phrase not found — page wording changed, update the regex'] };
  const phrase = m[1].trim(); // e.g. "3 weeks"
  const norm = normalizeDuration(phrase);
  if (norm.error) return { entities: [], observations: [], errors: [...errors, norm.error] };
  return {
    entities: [{
      id: 'gb-passport-standard', source_id: source.id, jurisdiction: 'GB',
      service_category: 'passport', service_key: 'gb-passport-standard',
      service_name: 'Passport (standard application)', applicant_country: null, applicant_country_name: null,
    }],
    observations: [{
      entity_id: 'gb-passport-standard', value_raw: `within ${phrase}`, value_days: norm.value_days,
      unit_original: norm.unit_original, status: norm.status,
      effective_date: effective, retrieved_at, source_url: HUMAN_URL,
    }],
    errors,
  };
}
