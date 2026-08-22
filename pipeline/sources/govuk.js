// UK visa processing times (applications outside the UK) — official gov.uk
// Content API. Structured JSON envelope; the body carries per-category tables.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { normalizeDuration, slugify } from '../lib/normalize.js';

const API_URL = 'https://www.gov.uk/api/content/guidance/visa-processing-times-applications-outside-the-uk';
const HUMAN_URL = 'https://www.gov.uk/guidance/visa-processing-times-applications-outside-the-uk';

export const source = {
  id: 'govuk-visa-times',
  name: 'UK visa processing times (outside UK)',
  jurisdiction: 'GB',
  agency: 'UK Visas and Immigration (Home Office)',
  url: HUMAN_URL,
  license_note: 'Open Government Licence v3.0 — reuse permitted with attribution.',
};

const stripTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/** Shared gov.uk guidance-page table parser (also used by govuk-inuk.js). */
export function parseGovukTables({ body, sourceId, humanUrl, keyPrefix, retrieved_at }) {
  const doc = JSON.parse(body);
  const effective = (doc.public_updated_at || '').slice(0, 10);
  const html = doc.details?.body || '';
  const entities = [];
  const observations = [];
  const errors = [];
  if (!effective) errors.push('missing public_updated_at');
  if (!html) errors.push('missing details.body');

  // Walk h2/h3 section headings and tables in document order.
  let section = '';
  const tokens = html.split(/(<h[23][^>]*>[\s\S]*?<\/h[23]>|<table[\s\S]*?<\/table>)/);
  for (const tok of tokens) {
    if (/^<h[23]/.test(tok)) { section = stripTags(tok); continue; }
    if (!/^<table/.test(tok)) continue;
    const rows = tok.match(/<tr[\s\S]*?<\/tr>/g) || [];
    for (const row of rows) {
      const cells = (row.match(/<t[dh][\s\S]*?<\/t[dh]>/g) || []).map(stripTags);
      if (cells.length < 2) continue;
      const [category, time] = cells;
      if (!category || /^category$/i.test(category)) continue; // header row
      const norm = normalizeDuration(time);
      if (norm.error) {
        // Some rows are prose ("Check with the visa application centre") — record as unavailable rather than fail
        if (/week|month|day/i.test(time)) { errors.push(`row "${category}": ${norm.error}`); continue; }
        continue; // non-duration informational row: skip, logged in coverage counts
      }
      const key = `${keyPrefix}-${slugify(section) || 'visa'}--${slugify(category)}`.slice(0, 80);
      entities.push({
        id: key,
        source_id: sourceId,
        jurisdiction: 'GB',
        service_category: 'visa',
        service_key: key,
        service_name: `${category} (${section || 'UK visa'})`,
        applicant_country: null,
        applicant_country_name: null,
      });
      observations.push({
        entity_id: key,
        value_raw: time,
        value_days: norm.value_days,
        unit_original: norm.unit_original,
        status: norm.status,
        effective_date: effective,
        retrieved_at,
        source_url: humanUrl,
      });
    }
  }
  return { entities, observations, errors };
}

export async function collect({ forceRefresh = false } = {}) {
  const { body } = await politeFetch(API_URL, { forceRefresh });
  const retrieved_at = cachedRetrievedAt(API_URL);
  return parseGovukTables({ body, sourceId: source.id, humanUrl: HUMAN_URL, keyPrefix: 'gb', retrieved_at });
}
