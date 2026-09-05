// Permanent change issues derived from append-only history. An issue is only
// created after a later observation exists; baseline rows never masquerade as
// movement. Old issues remain reproducible as newer history is appended.
import { JURISDICTIONS, records, services } from './data.js';

const PUBLICATION_DATE_OVERRIDES = new Map([
  ['CA:2026-08-26', '2026-09-04'],
  ['NZ:2026-09-01', '2026-09-04'],
]);

function recordPath(record) {
  if (!services[record.jurisdiction].get(record.serviceSlug).published) return null;
  const base = `/${record.jur.slug}/${record.serviceSlug}/`;
  return record.applicantSlug ? `${base}${record.applicantSlug}/` : base;
}

function recordLabel(record) {
  const service = services[record.jurisdiction].get(record.serviceSlug);
  return record.applicant_country_name
    ? `${service.seoName} from ${record.applicant_country_name}`
    : service.seoName;
}

function comparisonFor(record, previous, current) {
  const bothPublished = previous.status === 'ok' && current.status === 'ok';
  const deltaDays = bothPublished ? current.value_days - previous.value_days : null;
  const direction = !bothPublished ? null : deltaDays > 0 ? 'longer' : deltaDays < 0 ? 'shorter' : 'unchanged';
  const percentage = bothPublished && previous.value_days > 0
    ? Math.round(Math.abs(deltaDays) / previous.value_days * 1000) / 10
    : null;
  return {
    recordId: record.id,
    serviceKey: record.service_key,
    serviceName: services[record.jurisdiction].get(record.serviceSlug).seoName,
    applicantCountryName: record.applicant_country_name,
    label: recordLabel(record),
    path: recordPath(record),
    sourceUrl: current.source_url || record.source_url,
    previousDate: previous.effective_date,
    currentDate: current.effective_date,
    previousStatus: previous.status,
    currentStatus: current.status,
    previousRaw: previous.value_raw,
    currentRaw: current.value_raw,
    previousDays: previous.value_days,
    currentDays: current.value_days,
    deltaDays,
    direction,
    percentage,
    retrievedAt: current.retrieved_at,
  };
}

const grouped = new Map();
for (const record of records) {
  for (let index = 1; index < record.history.length; index += 1) {
    const comparison = comparisonFor(record, record.history[index - 1], record.history[index]);
    const key = `${record.jurisdiction}:${comparison.currentDate}`;
    if (!grouped.has(key)) grouped.set(key, { jurisdiction: record.jurisdiction, date: comparison.currentDate, comparisons: [] });
    grouped.get(key).comparisons.push(comparison);
  }
}

export const reportIssues = [...grouped.entries()].map(([key, group]) => {
  const jur = JURISDICTIONS[group.jurisdiction];
  const comparable = group.comparisons.filter(item => item.direction);
  const changes = comparable
    .filter(item => item.direction !== 'unchanged')
    .sort((a, b) => Math.abs(b.percentage) - Math.abs(a.percentage) || Math.abs(b.deltaDays) - Math.abs(a.deltaDays) || a.label.localeCompare(b.label));
  const longer = changes.filter(item => item.direction === 'longer');
  const shorter = changes.filter(item => item.direction === 'shorter');
  const becameAvailable = group.comparisons.filter(item => item.previousStatus !== 'ok' && item.currentStatus === 'ok');
  const becameUnavailable = group.comparisons.filter(item => item.previousStatus === 'ok' && item.currentStatus !== 'ok');
  const meaningful = changes.length + becameAvailable.length + becameUnavailable.length;
  const serviceMap = new Map();
  for (const item of changes) {
    const row = serviceMap.get(item.serviceKey) || { serviceKey: item.serviceKey, serviceName: item.serviceName, changed: 0, longer: 0, shorter: 0 };
    row.changed += 1;
    row[item.direction] += 1;
    serviceMap.set(item.serviceKey, row);
  }
  const servicesChanged = [...serviceMap.values()].sort((a, b) => b.changed - a.changed || a.serviceName.localeCompare(b.serviceName));
  const retrievedDates = group.comparisons.map(item => item.retrievedAt?.slice(0, 10)).filter(Boolean).sort();
  const previousDates = [...new Set(group.comparisons.map(item => item.previousDate).filter(Boolean))].sort();
  const published = PUBLICATION_DATE_OVERRIDES.get(key) || retrievedDates.at(-1) || group.date;
  const slug = group.date;
  return {
    key,
    jurisdiction: group.jurisdiction,
    jur,
    date: group.date,
    slug,
    path: `/reports/${jur.slug}/${slug}/`,
    published,
    previousDates,
    comparisons: group.comparisons,
    comparable,
    unchanged: comparable.filter(item => item.direction === 'unchanged'),
    changes,
    longer,
    shorter,
    becameAvailable,
    becameUnavailable,
    meaningful,
    servicesChanged,
    sourceUrls: [...new Set(group.comparisons.map(item => item.sourceUrl).filter(Boolean))],
  };
})
  // Skip thin "nothing happened" pages. The append-only comparisons remain in
  // the evergreen jurisdiction report, and a permanent issue appears as soon
  // as at least one published value or availability state actually changes.
  .filter(issue => issue.meaningful > 0)
  .sort((a, b) => b.date.localeCompare(a.date) || a.jurisdiction.localeCompare(b.jurisdiction));

export function latestReportIssue(jurisdiction) {
  return reportIssues.find(issue => issue.jurisdiction === jurisdiction) || null;
}
