// Norway immigration waiting times — official Norwegian Directorate of
// Immigration (UDI) server-rendered tables. UDI also offers personalised guide
// forms; this collector deliberately reads only the complete, non-personalised
// tables linked from the waiting-time hub and never guesses query combinations.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { normalizeDuration } from '../lib/normalize.js';

const HUB_URL = 'https://www.udi.no/en/waiting-time/';

export const source = {
  id: 'udi-waiting-times',
  name: 'Norway immigration waiting times',
  jurisdiction: 'NO',
  agency: 'Norwegian Directorate of Immigration (UDI)',
  url: HUB_URL,
  license_note: 'Official public information; no explicit page-reuse license was identified as of 2026-08-30. GovWait stores only extracted factual values with attribution and source links, not UDI page copy.',
};

export const PAGE_SPECS = Object.freeze([
  {
    slug: 'permanent-residence',
    url: 'https://www.udi.no/en/waiting-time/permanent-residence-permit/',
    tableCount: 1,
    rows: [
      ['Family immigration', 'no-permanent-residence-family-immigration', 'Permanent residence after family immigration', 'settlement'],
      ['Protection (asylum) or humanitarian grounds', 'no-permanent-residence-protection-humanitarian', 'Permanent residence after protection or humanitarian grounds', 'settlement'],
      ['Work immigration', 'no-permanent-residence-work-immigration', 'Permanent residence after work immigration', 'settlement'],
      ['Other', 'no-permanent-residence-other', 'Permanent residence after another permit type', 'settlement'],
    ],
  },
  {
    slug: 'visitor-visa',
    url: 'https://www.udi.no/en/waiting-time/visitor-visa/',
    tableCount: 1,
    rows: [
      ['Embassy in your country of residence', 'no-visitor-visa-embassy-country-of-residence', 'Visitor visa processed by the embassy in your country of residence', 'visa'],
      ['Embassy in another country', 'no-visitor-visa-embassy-another-country', 'Visitor visa processed by an embassy in another country', 'visa'],
      ['Norwegian Directorate of Immigration (UDI)', 'no-visitor-visa-udi', 'Visitor visa processed by UDI', 'visa'],
    ],
  },
  {
    slug: 'eea-brexit-residence',
    url: 'https://www.udi.no/en/waiting-time/residency-according-to-the-eueea-and-brexit-regulations/',
    tableCount: 1,
    rows: [
      ['Residence card for family members of EEA nationals', 'no-eea-family-residence-card', 'Residence card for family members of EEA nationals', 'permit'],
      ['Permanent right of residence and residence card', 'no-eea-permanent-residence-card', 'Permanent EEA right of residence and residence card', 'settlement'],
      ['Residence permit according to the Brexit regulations', 'no-brexit-residence-permit', 'Residence permit under the Brexit regulations', 'permit'],
    ],
  },
  {
    slug: 'expulsion-entry-ban',
    url: 'https://www.udi.no/en/waiting-time/expulsion-and-lifting-a-prohibition-of-entry/',
    tableCount: 2,
    rows: [
      ['Decision on expulsion', 'no-expulsion-decision', 'Decision on expulsion', 'settlement'],
      ['EU/EEA citizens', 'no-revoke-entry-ban-eea-citizen', 'Revoking an entry ban for an EU/EEA citizen', 'settlement'],
      ['Citizens of countries outside the EU/EEA', 'no-revoke-entry-ban-non-eea-citizen', 'Revoking an entry ban for a citizen outside the EU/EEA', 'settlement'],
      ['Citizens of countries outside the EU/EEA who are covered by the EEA regulations', 'no-revoke-entry-ban-eea-covered-non-eea-citizen', 'Revoking an entry ban for a non-EU/EEA citizen covered by EEA regulations', 'settlement'],
    ],
  },
  {
    slug: 'other-cases',
    url: 'https://www.udi.no/en/waiting-time/other-types-of-cases/',
    tableCount: 1,
    rows: [
      ['Residence permit for victims of abuse from a spouse/cohabitant', 'no-residence-permit-abuse-victim', 'Residence permit for victims of abuse by a spouse or cohabitant', 'permit'],
      ['Residence permit for medical treatment (citizens of countries outside the EU/EEA)', 'no-residence-permit-medical-treatment', 'Residence permit for medical treatment outside the EU/EEA', 'permit'],
      ['Residence permit for persons with a Norwegian parent at birth', 'no-residence-permit-norwegian-parent-at-birth', 'Residence permit for a person with a Norwegian parent at birth', 'permit'],
      ['Residence permit on strong humanitarian grounds or particular connection to Norway', 'no-residence-permit-humanitarian-grounds', 'Residence permit on humanitarian grounds or a particular connection to Norway', 'permit'],
      ['Coverage of lawyer fees or other expenses related to an appeal', 'no-appeal-legal-cost-coverage', 'Coverage of lawyer fees or other appeal expenses', 'settlement'],
    ],
  },
]);

const HTML_ENTITIES = {
  amp: '&', apos: "'", quot: '"', nbsp: ' ', ndash: '–', mdash: '—',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};

function decodeHtml(value) {
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (full, entity) => {
    if (entity[0] === '#') {
      const n = entity[1].toLowerCase() === 'x'
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : full;
    }
    return HTML_ENTITIES[entity.toLowerCase()] ?? full;
  });
}

function plainText(html) {
  return decodeHtml(String(html).replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function parseUdiDate(text) {
  const months = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
  };
  const match = text.match(/\bLast updated:\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/i);
  if (!match) return null;
  const month = months[match[2].toLowerCase()];
  if (!month) return null;
  const day = match[1].padStart(2, '0');
  const iso = `${match[3]}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== iso ? null : iso;
}

function extractTableRows(html) {
  const tables = String(html).match(/<table\b[\s\S]*?<\/table>/gi) || [];
  const rows = [];
  for (const table of tables) {
    for (const row of table.match(/<tr\b[\s\S]*?<\/tr>/gi) || []) {
      const cells = [...row.matchAll(/<t([dh])\b[^>]*>([\s\S]*?)<\/t\1>/gi)]
        .map(match => ({ kind: match[1].toLowerCase(), text: plainText(match[2]) }));
      if (cells.length < 2 || cells.every(cell => cell.kind === 'h')) continue;
      const label = cells[0].text;
      const value = cells[1].text;
      if (label && value) rows.push([label, value]);
    }
  }
  return { tables: tables.length, rows };
}

export function parseUdiPage(spec, html, retrieved_at) {
  const entities = [];
  const observations = [];
  const errors = [];
  const effective = parseUdiDate(plainText(html));
  if (!effective) errors.push(`${spec.slug}: missing or invalid Last updated date`);

  const extracted = extractTableRows(html);
  if (extracted.tables !== spec.tableCount) {
    errors.push(`${spec.slug}: found ${extracted.tables} tables (expected ${spec.tableCount})`);
  }

  const actual = new Map();
  for (const [label, value] of extracted.rows) {
    if (actual.has(label)) errors.push(`${spec.slug}: duplicate row "${label}"`);
    actual.set(label, value);
  }
  const expected = new Map(spec.rows.map(row => [row[0], row]));
  for (const label of actual.keys()) {
    if (!expected.has(label)) errors.push(`${spec.slug}: unknown row "${label}"`);
  }

  for (const [label, key, name, category] of spec.rows) {
    const raw = actual.get(label);
    if (!raw) {
      errors.push(`${spec.slug}: missing row "${label}"`);
      continue;
    }
    const norm = normalizeDuration(raw);
    if (norm.error) {
      errors.push(`${spec.slug}: row "${label}": ${norm.error}`);
      continue;
    }
    entities.push({
      id: key,
      source_id: source.id,
      jurisdiction: 'NO',
      service_category: category,
      metric_type: 'published',
      service_key: key,
      service_name: name,
      applicant_country: null,
      applicant_country_name: null,
    });
    observations.push({
      entity_id: key,
      value_raw: raw,
      value_days: norm.value_days,
      unit_original: norm.unit_original,
      status: norm.status,
      effective_date: effective,
      retrieved_at,
      source_url: spec.url,
    });
  }

  return { entities, observations, errors };
}

export async function collect({ forceRefresh = false } = {}) {
  const entities = [];
  const observations = [];
  const errors = [];

  for (const spec of PAGE_SPECS) {
    try {
      const { body } = await politeFetch(spec.url, { forceRefresh });
      const parsed = parseUdiPage(spec, body, cachedRetrievedAt(spec.url));
      entities.push(...parsed.entities);
      observations.push(...parsed.observations);
      errors.push(...parsed.errors);
    } catch (error) {
      errors.push(`${spec.slug}: ${error.message}`);
    }
  }

  return { entities, observations, errors };
}
