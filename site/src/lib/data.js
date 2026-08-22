// Build-time data layer. Reads the pipeline exports (single source of truth)
// and shapes them into the page model. Throws on any inconsistency — a broken
// dataset must fail the build, not ship.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXPORTS = path.join(ROOT, 'data', 'exports');

const latest = JSON.parse(readFileSync(path.join(EXPORTS, 'latest.json'), 'utf8'));
const historyFile = JSON.parse(readFileSync(path.join(EXPORTS, 'history.json'), 'utf8'));
export const stats = JSON.parse(readFileSync(path.join(EXPORTS, 'stats.json'), 'utf8'));
export const sources = latest.sources;
export const generatedAt = latest.generated_at;

export const JURISDICTIONS = {
  CA: { slug: 'canada', name: 'Canada', agency: 'Immigration, Refugees and Citizenship Canada (IRCC)' },
  GB: { slug: 'uk', name: 'United Kingdom', agency: 'UK Visas and Immigration (Home Office)' },
};

const CATEGORY_BLURBS = {
  visa: 'how long the government is currently taking to process this visa category',
  permit: 'how long the government is currently taking to process this permit category',
  sponsorship: 'how long the government is currently taking to process this sponsorship category',
  refugee: 'how long the government is currently taking to process this resettlement category',
};

export function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function serviceSlug(rec) {
  if (rec.jurisdiction === 'CA') return rec.service_key.replace(/^ca-/, '');
  // GB keys look like gb-<section>--<category>; the category segment is the slug.
  const seg = rec.service_key.split('--').pop();
  return seg.replace(/^gb-/, '');
}

// ---- Build the model, with hard collision checks ----
export const records = latest.records.map(r => ({
  ...r,
  serviceSlug: serviceSlug(r),
  jur: JURISDICTIONS[r.jurisdiction],
  applicantSlug: r.applicant_country ? 'from-' + slugify(r.applicant_country_name) : null,
  history: historyFile.entities[r.id] || [],
}));

const slugSeen = new Map();
for (const r of records) {
  const key = `${r.jurisdiction}/${r.serviceSlug}/${r.applicantSlug || ''}`;
  if (slugSeen.has(key)) throw new Error(`URL collision: ${key} (${r.id} vs ${slugSeen.get(key)})`);
  slugSeen.set(key, r.id);
}

// services grouped per jurisdiction
export const services = {};
for (const r of records) {
  const j = r.jurisdiction;
  services[j] ||= new Map();
  if (!services[j].has(r.serviceSlug)) {
    services[j].set(r.serviceSlug, {
      slug: r.serviceSlug,
      key: r.service_key,
      name: r.service_name.replace(/\s*\(.*\)$/, ''),
      fullName: r.service_name,
      category: r.service_category,
      blurb: CATEGORY_BLURBS[r.service_category] || 'current official processing time',
      jurisdiction: j,
      records: [],
    });
  }
  services[j].get(r.serviceSlug).records.push(r);
}
for (const j of Object.keys(services)) {
  for (const svc of services[j].values()) {
    svc.records.sort((a, b) => (a.value_days ?? Infinity) - (b.value_days ?? Infinity) || String(a.applicant_country_name).localeCompare(String(b.applicant_country_name)));
    svc.hasApplicantPages = svc.records.some(r => r.applicant_country);
    svc.okCount = svc.records.filter(r => r.status === 'ok').length;
    svc.latestEffective = svc.records.map(r => r.effective_date).sort().at(-1);
    const ok = svc.records.filter(r => r.status === 'ok');
    svc.medianDays = ok.length ? ok[Math.floor(ok.length / 2)].value_days : null;
  }
}

// Speed classification relative to the service median (only meaningful for
// per-country services with a published value).
for (const r of records) {
  const svc = services[r.jurisdiction].get(r.serviceSlug);
  if (r.status !== 'ok' || !r.applicant_country || !svc.medianDays) { r.speed = null; continue; }
  const ratio = r.value_days / svc.medianDays;
  r.speed = ratio <= 0.6 ? { cls: 'fast', label: 'faster than typical' }
    : ratio <= 1.4 ? { cls: 'typical', label: 'typical' }
    : ratio <= 2.5 ? { cls: 'slow', label: 'slower than typical' }
    : { cls: 'veryslow', label: 'much slower than typical' };
}

/** Other services from the same applicant country (for interlinking). */
export function relatedRoutes(rec, max = 8) {
  if (!rec.applicant_country) return [];
  return records
    .filter(r => r.applicant_country === rec.applicant_country && r.id !== rec.id && r.jurisdiction === rec.jurisdiction)
    .sort((a, b) => (a.value_days ?? Infinity) - (b.value_days ?? Infinity))
    .slice(0, max);
}

export function fmtDate(iso) {
  if (!iso) return 'n/a';
  return new Date(iso.slice(0, 10) + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function humanValue(r) {
  if (r.status === 'ok') return r.value_raw;
  if (r.status === 'unavailable') return 'No official time published';
  return 'Not enough data (official)';
}

export function daysBadge(r) {
  if (r.status !== 'ok') return null;
  const d = Math.round(r.value_days);
  return d === 1 ? '1 day' : `${d} days`;
}
