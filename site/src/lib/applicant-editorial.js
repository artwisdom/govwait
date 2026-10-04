// Hand-reviewed additions for applicant-country pages with demonstrated Search
// Console demand. Keep this cohort deliberately small: each entry must answer a
// real query with source-backed route context or a transparent calculation from
// the same official snapshot already shown on the page.
const IRCC_PROCESSING_TIMES_URL = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';
const IRCC_STATUS_URL = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-status.html';
const IRCC_VISITOR_VISA_URL = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html';
const IRCC_PRIVATE_REFUGEE_PROCESS_URL = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/sponsor-refugee/private-sponsorship-program/how-we-process-applications.html';

function shortMonthYear(iso) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function longMonthYear(iso) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function fullDate(iso) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function titleDuration(value) {
  return value.replace(/\b(days?|weeks?|months?|years?)\b/gi, unit =>
    `${unit[0].toUpperCase()}${unit.slice(1).toLowerCase()}`);
}

function durationAdjective(value) {
  return value.replace(/^(\d+(?:\.\d+)?)\s+([a-z]+)s$/i, '$1-$2');
}

function visitorComparison(record, service) {
  const median = Math.round(service.medianDays);
  const difference = Math.round(Math.abs(record.value_days - service.medianDays));
  const relation = difference === 0
    ? `matches the current ${median}-day median`
    : `is ${difference} day${difference === 1 ? '' : 's'} ${record.value_days < service.medianDays ? 'shorter' : 'longer'} than the current ${median}-day median`;
  return `The ${durationAdjective(record.value_raw)} ${record.applicant_country_name} value ${relation} across the ${service.okCount} countries for which IRCC publishes a visitor-visa value in this snapshot. GovWait calculates that comparison from the same official data; it is not an IRCC ranking or a forecast for one application.`;
}

function visitorEditorial(country) {
  return {
    modified: '2026-09-07',
    title: record => `Canada Visitor Visa from ${country}: ${record.value_raw} (${shortMonthYear(record.effective_date)})`,
    description: (record, service) => `IRCC’s ${longMonthYear(record.effective_date)} visitor visa processing time from ${country} is ${record.value_raw}. Compare ${country} with ${service.okCount - 1} other published countries and see official history.`,
    h1: `Canada visitor visa processing time from ${country}`,
    heading: `What the ${country} result covers`,
    paragraphs: (record, service) => [
      `This is IRCC’s country-specific result for “Visitor visa (from outside Canada)” when the answer to “Where are you applying from?” is ${country}. It is not an inside-Canada visitor-visa time, a visitor-record extension time or a worldwide average.`,
      visitorComparison(record, service),
      `Use the public processing-time tool for a fresh general figure. Once an application has been submitted, only IRCC’s account or status tools can report that individual file; GovWait cannot infer a personal decision date from the ${durationAdjective(record.value_raw)} country statistic.`,
    ],
    links: [
      { url: IRCC_PROCESSING_TIMES_URL, label: 'IRCC processing-time tool' },
      { url: IRCC_VISITOR_VISA_URL, label: 'IRCC visitor-visa guide' },
      { url: IRCC_STATUS_URL, label: 'IRCC application-status guide' },
    ],
  };
}

function visitorCtrEditorial(country, {
  titleCountry = country,
  descriptionCountry = country,
  h1Country = country,
  countCountries = false,
} = {}) {
  return {
    ...visitorEditorial(country),
    modified: '2026-10-02',
    title: record => `Canada Visitor Visa Processing Time from ${titleCountry}: ${titleDuration(record.value_raw)}`,
    description: (record, service) => `IRCC currently reports ${record.value_raw} for visitor visa applications from ${descriptionCountry}, updated ${fullDate(record.effective_date)}. ${countCountries ? `Compare ${service.okCount} countries` : 'Compare countries'} and view source-backed history.`,
    h1: `Canada visitor visa processing time from ${h1Country}`,
  };
}

const pakistanPrivateRefugee = {
  modified: '2026-09-07',
  title: record => `Canada Private Refugee from Pakistan: ${record.value_raw} (${shortMonthYear(record.effective_date)})`,
  description: record => `IRCC’s ${longMonthYear(record.effective_date)} private refugee processing time from Pakistan is ${record.value_raw}. See the refugee-side stage, official source, comparison and recorded history.`,
  h1: 'Canada private refugee processing time from Pakistan',
  question: 'How long is private refugee processing from Pakistan right now?',
  intro: record => `Immigration, Refugees and Citizenship Canada (IRCC) currently publishes ${record.value_raw} for the refugee-processing part of privately sponsored refugee applications from Pakistan. This is distinct from the sponsor-processing value; both official stages are linked below.`,
  heading: 'Which part of the private-refugee process this measures',
  paragraphs: (record, service) => {
    const medianMonths = Math.round(service.medianDays / 30.44);
    const recordMonths = Math.round(record.value_days / 30.44);
    const difference = Math.abs(recordMonths - medianMonths);
    const comparison = difference === 0
      ? `matches the current ${medianMonths}-month median`
      : `is ${difference} month${difference === 1 ? '' : 's'} ${recordMonths < medianMonths ? 'shorter' : 'longer'} than the current ${medianMonths}-month median`;
    return [
      `A privately sponsored refugee application has a sponsorship part and a refugee part. This page tracks IRCC’s ${durationAdjective(record.value_raw)} refugee-processing value for Pakistan, not the separately published sponsor-processing value.`,
      `IRCC says the sponsorship part is reviewed first at its Resettlement Operations Centre in Ottawa. If that part is approved, the refugee part goes to an overseas migration office for review, including the refugee interview and admissibility steps. The ${durationAdjective(record.value_raw)} figure is not a promised arrival date.`,
      `Pakistan’s refugee-side value ${comparison} across the ${service.okCount} countries for which IRCC publishes a value in this snapshot. GovWait derives that comparison from the official data; it is not an IRCC ranking and does not predict one case.`,
    ];
  },
  links: [
    { url: IRCC_PROCESSING_TIMES_URL, label: 'IRCC processing-time tool' },
    { url: IRCC_PRIVATE_REFUGEE_PROCESS_URL, label: 'IRCC private-sponsorship process' },
    { url: IRCC_STATUS_URL, label: 'IRCC application-status guide' },
  ],
};

// Search Console identified this small set of existing URLs as CTR/relevance
// opportunities. This list improves those URLs; it does not generate duplicate
// or speculative country pages.
export const APPLICANT_EDITORIAL = Object.freeze({
  'ca-refugee-private-refugee-side--pk': pakistanPrivateRefugee,
  'ca-visitor-visa--co': visitorCtrEditorial('Colombia', { countCountries: true }),
  'ca-visitor-visa--gb': visitorCtrEditorial('United Kingdom', {
    titleCountry: 'UK',
    descriptionCountry: 'the UK',
  }),
  'ca-visitor-visa--jm': visitorCtrEditorial('Jamaica'),
  'ca-visitor-visa--np': visitorEditorial('Nepal'),
  'ca-visitor-visa--ph': visitorCtrEditorial('Philippines', {
    descriptionCountry: 'the Philippines',
    h1Country: 'the Philippines',
  }),
  'ca-visitor-visa--qa': visitorCtrEditorial('Qatar', { countCountries: true }),
});

const visitorComparisonGuide = {
  path: '/guides/canada-visitor-visa-by-country/',
  label: 'Compare Canada visitor visa processing times by country',
};

export const APPLICANT_GUIDE_LINKS = Object.freeze({
  'ca-visitor-visa--co': { modified: '2026-10-02', links: [visitorComparisonGuide] },
  'ca-visitor-visa--gb': { modified: '2026-10-02', links: [visitorComparisonGuide] },
  'ca-visitor-visa--jm': { modified: '2026-10-02', links: [visitorComparisonGuide] },
  'ca-visitor-visa--ph': {
    modified: '2026-10-02',
    links: [
      visitorComparisonGuide,
      { path: '/guides/canada-visitor-visa-from-philippines/', label: 'Philippines visitor visa planning guide and regional comparison' },
    ],
  },
  'ca-visitor-visa--qa': { modified: '2026-10-02', links: [visitorComparisonGuide] },
  'ca-study-permit--ng': {
    modified: '2026-10-02',
    links: [
      { path: '/guides/canada-study-permit-from-nigeria/', label: 'Canada study permit processing time from Nigeria — planning guide' },
    ],
  },
});

export function applicantEditorialLastmod(recordId, dataLastmod) {
  const editorialDate = APPLICANT_EDITORIAL[recordId]?.modified;
  const guideLinkDate = APPLICANT_GUIDE_LINKS[recordId]?.modified;
  // IRCC's current visitor-visa page now says the displayed time excludes the
  // time needed to give biometrics. The route-family FAQ was corrected on this
  // date, so every affected indexable visitor-country URL receives that honest
  // editorial lastmod even when it is outside the four-page near-win cohort.
  const visitorGuidanceCorrection = recordId.startsWith('ca-visitor-visa--')
    ? '2026-09-07'
    : null;
  return [dataLastmod, editorialDate, guideLinkDate, visitorGuidanceCorrection].filter(Boolean).sort().at(-1);
}
