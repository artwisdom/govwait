// UK visa processing times for applications made INSIDE the UK — same Content
// API pattern as the outside-UK source, different slug and key prefix.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { parseGovukTables } from './govuk.js';

const API_URL = 'https://www.gov.uk/api/content/guidance/visa-processing-times-applications-inside-the-uk';
const HUMAN_URL = 'https://www.gov.uk/guidance/visa-processing-times-applications-inside-the-uk';

export const source = {
  id: 'govuk-inuk-times',
  name: 'UK visa processing times (inside UK)',
  jurisdiction: 'GB',
  agency: 'UK Visas and Immigration (Home Office)',
  url: HUMAN_URL,
  license_note: 'Open Government Licence v3.0 — reuse permitted with attribution.',
};

export async function collect({ forceRefresh = false } = {}) {
  const { body } = await politeFetch(API_URL, { forceRefresh });
  const retrieved_at = cachedRetrievedAt(API_URL);
  const out = parseGovukTables({ body, sourceId: source.id, humanUrl: HUMAN_URL, keyPrefix: 'gb-in-uk', retrieved_at });
  // Same category names exist on both pages; suffix the display name to disambiguate.
  out.entities.forEach(e => { e.service_name = e.service_name.replace(/\)$/, ', applying inside the UK)'); });
  return out;
}
