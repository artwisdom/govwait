// IRCC non-country processing times — extensions, eTA, citizenship documents,
// PR cards, IEC, SAWP. Same host/cadence as the main IRCC file.
import { politeFetch, cachedRetrievedAt } from '../lib/fetcher.js';
import { normalizeDuration, parseUsDate } from '../lib/normalize.js';

const URL = 'https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-non-country-en.json';
const TOOL_PAGE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';

export const source = {
  id: 'ircc-noncountry',
  name: 'IRCC processing times (non-country categories)',
  jurisdiction: 'CA',
  agency: 'Immigration, Refugees and Citizenship Canada',
  url: TOOL_PAGE,
  license_note: 'Government of Canada publication; extracted values with attribution (see ircc-ptime).',
};

// group.innerKey -> {key(entity/service), name, category}. Unknown keys FAIL the
// run so IRCC additions surface instead of being silently dropped.
const MAP = {
  'visitor_inside_canada.visitor_inside_canada': { key: 'ca-visitor-visa-inside', name: 'Visitor visa (applying from inside Canada)', category: 'visa' },
  'visitor_extension.visitor_extension': { key: 'ca-visitor-record-extension', name: 'Visitor record (extend your stay in Canada)', category: 'permit' },
  'study_extension.study_extension': { key: 'ca-study-permit-extension', name: 'Study permit extension', category: 'permit' },
  'work_extension.work_extension': { key: 'ca-work-permit-extension', name: 'Work permit extension', category: 'permit' },
  'iec.iec': { key: 'ca-iec', name: 'International Experience Canada (current season)', category: 'permit' },
  'iec.iec_past': { key: 'ca-iec-past-season', name: 'International Experience Canada (previous season)', category: 'permit' },
  'eta.eta': { key: 'ca-eta', name: 'Electronic Travel Authorization (eTA)', category: 'visa' },
  'fed_skilled_trades.skilled_trades_ee': { key: 'ca-federal-skilled-trades', name: 'Federal Skilled Trades (Express Entry)', category: 'settlement' },
  'citizenship.cit_resumption': { key: 'ca-citizenship-resumption', name: 'Citizenship: resumption', category: 'settlement' },
  'citizenship.cit_renunciation': { key: 'ca-citizenship-renunciation', name: 'Citizenship: renunciation', category: 'settlement' },
  'citizenship.cit_search': { key: 'ca-citizenship-record-search', name: 'Citizenship: search of citizenship records', category: 'settlement' },
  'citizenship.cit_adoption_part1': { key: 'ca-citizenship-adoption-part1', name: 'Citizenship for a person adopted abroad (Part 1)', category: 'settlement' },
  'pr_card.new_pr': { key: 'ca-pr-card-new', name: 'PR card (first card)', category: 'settlement' },
  'pr_card.existing_pr': { key: 'ca-pr-card-renewal', name: 'PR card (renewal or replacement)', category: 'settlement' },
  'rep_documents.vos': { key: 'ca-verification-of-status', name: 'Verification of status (VoS)', category: 'settlement' },
  'rep_documents.replacement': { key: 'ca-replace-immigration-document', name: 'Replacement of an immigration document', category: 'settlement' },
  'rep_documents.amend_imm': { key: 'ca-amend-immigration-record', name: 'Amendment of an immigration record', category: 'settlement' },
  'rep_documents.amend_tr': { key: 'ca-amend-tr-record', name: 'Amendment of a temporary resident record', category: 'settlement' },
  'sawp.sawp_current': { key: 'ca-sawp', name: 'Seasonal Agricultural Worker Program', category: 'permit' },
};

export async function collect({ forceRefresh = false } = {}) {
  const { body } = await politeFetch(URL, { forceRefresh });
  const retrieved_at = cachedRetrievedAt(URL);
  const data = JSON.parse(body.replace(/^﻿/, ''));
  const effective = parseUsDate(data['default-update']?.lastupdated || '');
  const entities = [];
  const observations = [];
  const errors = [];
  if (!effective) errors.push(`bad default-update.lastupdated: "${data['default-update']?.lastupdated}"`);

  for (const [group, inner] of Object.entries(data)) {
    if (group === 'default-update') continue;
    if (typeof inner !== 'object') { errors.push(`unexpected scalar group ${group}`); continue; }
    for (const [k, rawVal] of Object.entries(inner)) {
      const spec = MAP[`${group}.${k}`];
      if (!spec) { errors.push(`unmapped key ${group}.${k} = "${rawVal}" — add to MAP`); continue; }
      // "Part 1: 4 months" — strip the label prefix for parsing, keep raw verbatim
      const parseable = String(rawVal).replace(/^Part \d+:\s*/i, '');
      const norm = normalizeDuration(parseable);
      if (norm.error) { errors.push(`${group}.${k}: ${norm.error}`); continue; }
      entities.push({
        id: spec.key, source_id: source.id, jurisdiction: 'CA',
        service_category: spec.category, service_key: spec.key, service_name: spec.name,
        applicant_country: null, applicant_country_name: null,
      });
      observations.push({
        entity_id: spec.key, value_raw: String(rawVal), value_days: norm.value_days,
        unit_original: norm.unit_original, status: norm.status,
        effective_date: effective, retrieved_at, source_url: URL,
      });
    }
  }
  return { entities, observations, errors };
}
