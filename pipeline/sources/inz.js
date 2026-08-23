// New Zealand visa processing times — the official public Immigration New
// Zealand processing-time tool. The human page supplies the complete visa-ID
// list, so we never enumerate or guess unpublished IDs. The API publishes 50th
// and 80th percentile working-day counts without an update stamp; observations
// therefore use append-only first-observed/change-detection semantics.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { slugify } from '../lib/normalize.js';

const HUMAN_URL = 'https://www.immigration.govt.nz/process-to-apply/waiting-for-a-visa/processing-a-visa-application/how-long-it-takes-to-process-an-application/check-visa-application-processing-time/';
const API_URL = 'https://www.immigration.govt.nz/processing-time-api/v1/getTimeline/';
const MIN_VISAS = 120;
// One page + one POST per visa + one robots fetch must remain below the
// fetcher's 150-request host cap. A larger official list requires deliberate
// review instead of silently weakening the cap.
const MAX_VISAS = 145;

export const source = {
  id: 'inz-processing-times',
  name: 'New Zealand visa application processing times',
  jurisdiction: 'NZ',
  agency: 'Immigration New Zealand (Ministry of Business, Innovation and Employment)',
  url: HUMAN_URL,
  license_note: 'New Zealand Crown copyright; website content licensed CC BY 3.0 New Zealand with written attribution to the Crown and Ministry.',
};

function decodeAttribute(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

export function parseVisaList(html) {
  const match = String(html).match(/<visa-processing\s+:visas="([^"]+)"/i);
  if (!match) throw new Error('official visa selector not found — page structure changed');
  let visas;
  try { visas = JSON.parse(decodeAttribute(match[1])); }
  catch (error) { throw new Error(`official visa selector is not valid JSON: ${error.message}`); }
  if (!Array.isArray(visas)) throw new Error('official visa selector is not an array');
  if (visas.length < MIN_VISAS) throw new Error(`official visa selector shrank to ${visas.length} entries (minimum ${MIN_VISAS})`);
  if (visas.length > MAX_VISAS) throw new Error(`official visa selector grew to ${visas.length} entries (safe cap ${MAX_VISAS})`);
  const ids = new Set();
  const names = new Set();
  for (const visa of visas) {
    if (!Number.isInteger(visa?.id) || visa.id <= 0 || typeof visa?.name !== 'string' || !visa.name.trim()) {
      throw new Error(`malformed visa selector entry: ${JSON.stringify(visa)}`);
    }
    if (ids.has(visa.id)) throw new Error(`duplicate visa ID ${visa.id}`);
    if (names.has(visa.name.trim())) throw new Error(`duplicate visa name ${visa.name.trim()}`);
    ids.add(visa.id);
    names.add(visa.name.trim());
  }
  return visas.map(visa => ({ id: visa.id, name: visa.name.trim() }));
}

function workingDays(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 3000) throw new Error(`${label} is not a sane positive working-day count: ${value}`);
  return n;
}

export function parseTimeline(visa, body, retrieved_at) {
  let data;
  try { data = JSON.parse(String(body)); }
  catch (error) { throw new Error(`visa ${visa.id} returned invalid JSON: ${error.message}`); }
  if (!data || data.Name !== visa.name) {
    throw new Error(`visa ${visa.id} name mismatch: selector="${visa.name}" API="${data?.Name || ''}"`);
  }
  const p50 = workingDays(data.Percent50, `${visa.name} Percent50`);
  const p80 = workingDays(data.Percent80, `${visa.name} Percent80`);
  if (p80 < p50) throw new Error(`${visa.name} Percent80 (${p80}) is below Percent50 (${p50})`);
  const serviceKey = `nz-${slugify(visa.name)}`;
  const category = /(?:resident visa|permanent residence visa)$/i.test(visa.name) ? 'settlement' : 'visa';
  const metrics = [
    { suffix: 'p50', label: '50% processed', value: p50 },
    { suffix: 'p80', label: '80% processed', value: p80 },
  ];
  return metrics.map(metric => ({
    entity: {
      id: `${serviceKey}--${metric.suffix}`,
      source_id: source.id,
      jurisdiction: 'NZ',
      service_category: category,
      service_key: serviceKey,
      service_name: `${visa.name} — ${metric.label}`,
      applicant_country: null,
      applicant_country_name: null,
    },
    observation: {
      entity_id: `${serviceKey}--${metric.suffix}`,
      value_raw: `${metric.value} working ${metric.value === 1 ? 'day' : 'days'}`,
      value_days: metric.value,
      unit_original: 'working days',
      status: 'ok',
      effective_date: null,
      unstamped: true,
      retrieved_at,
      source_url: HUMAN_URL,
    },
  }));
}

export async function collect({ forceRefresh = false } = {}) {
  const { body: page } = await politeFetch(HUMAN_URL, { forceRefresh });
  const visas = parseVisaList(page);
  const entities = [];
  const observations = [];
  const errors = [];

  for (const visa of visas) {
    const request = { method: 'POST', form: { visaID: visa.id } };
    try {
      const { body } = await politeFetch(API_URL, { ...request, forceRefresh });
      const retrieved_at = cachedRetrievedAt(API_URL, request);
      for (const row of parseTimeline(visa, body, retrieved_at)) {
        entities.push(row.entity);
        observations.push(row.observation);
      }
    } catch (error) {
      errors.push(`visa ${visa.id} (${visa.name}): ${error.message}`);
    }
  }

  return { entities, observations, errors };
}
