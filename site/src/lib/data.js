// Build-time data layer. Reads the pipeline exports (single source of truth)
// and shapes them into the page model. Throws on any inconsistency — a broken
// dataset must fail the build, not ship.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isServicePublished } from './publication.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const EXPORTS = path.join(ROOT, 'data', 'exports');

const latest = JSON.parse(readFileSync(path.join(EXPORTS, 'latest.json'), 'utf8'));
const historyFile = JSON.parse(readFileSync(path.join(EXPORTS, 'history.json'), 'utf8'));
export const stats = JSON.parse(readFileSync(path.join(EXPORTS, 'stats.json'), 'utf8'));
export const sources = latest.sources;
export const generatedAt = latest.generated_at;

export const JURISDICTIONS = {
  CA: { slug: 'canada', name: 'Canada', shortName: 'Canada', shortAgency: 'IRCC', agency: 'Immigration, Refugees and Citizenship Canada (IRCC)' },
  GB: { slug: 'uk', name: 'United Kingdom', shortName: 'UK', shortAgency: 'UKVI', agency: 'UK Visas and Immigration (Home Office)' },
  NZ: { slug: 'new-zealand', name: 'New Zealand', shortName: 'NZ', shortAgency: 'INZ', agency: 'Immigration New Zealand (INZ)' },
};

const SOURCE_BY_ID = new Map(sources.map(source => [source.id, source]));
const UNSTAMPED_SOURCES = new Set(['ircc-passport', 'inz-processing-times']);

const CATEGORY_BLURBS = {
  visa: 'how long the government is currently taking to process this visa category',
  permit: 'how long the government is currently taking to process this permit category',
  sponsorship: 'how long the government is currently taking to process this sponsorship category',
  refugee: 'how long the government is currently taking to process this resettlement category',
  settlement: 'how long the government is currently taking to process this application type',
  passport: 'how long the government is currently taking to issue passports through this channel',
};

const SEO_SERVICE_NAMES = {
  'ca-refugee-gov-assisted': 'Government-Assisted Refugee',
  'ca-refugee-private-refugee-side': 'Private Refugee',
  'ca-refugee-private-sponsor-side': 'Private Refugee Sponsor',
  'ca-sponsor-adopted-child': 'Adopted Child Sponsorship',
  'ca-sponsor-dependent-child': 'Dependent Child Sponsorship',
  'ca-study-permit': 'Study Permit',
  'ca-super-visa': 'Super Visa',
  'ca-visitor-visa': 'Visitor Visa',
  'ca-work-permit': 'Work Permit',
};

export function slugify(s) {
  return String(s)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function displayServiceName(rec) {
  if (rec.jurisdiction === 'NZ') return rec.service_name.replace(/\s+—\s+(?:50|80)% processed$/, '');
  if (rec.jurisdiction === 'GB') {
    // gov.uk appends a source-table section in the final parentheses. Remove
    // only that final group so meaningful names such as "British National
    // (Overseas)" and "High Potential Individual (HPI)" remain intact.
    return rec.service_name.replace(/\s*\([^()]*\)\s*$/, '');
  }
  // Keep meaningful Canadian qualifiers such as "parents and grandparents";
  // only remove the repeated application-location phrase used in page copy.
  return rec.service_name.replace(/\s*\(applying from outside Canada\)\s*$/i, '');
}

function serviceScope(rec) {
  if (rec.jurisdiction !== 'GB') return null;
  if (rec.service_key.startsWith('gb-in-uk-')) return 'inside the UK';
  if (rec.source_url.includes('applications-outside-the-uk')) return 'outside the UK';
  return null;
}

function serviceSection(rec) {
  if (rec.jurisdiction !== 'GB') return null;
  const match = rec.service_name.match(/\(([^()]*)\)\s*$/);
  return match ? match[1].replace(/, applying inside the UK$/i, '') : null;
}

function serviceSlug(rec) {
  if (rec.jurisdiction === 'CA') return rec.service_key.replace(/^ca-/, '');
  if (rec.jurisdiction === 'NZ') return rec.service_key.replace(/^nz-/, '');
  // GB keys look like gb-<section>--<category> (or gb-in-uk-<section>--<category>);
  // the category segment is the slug, in-UK variants keep an in-uk- prefix so
  // "student" (outside) and "in-uk-student" (inside) don't collide.
  const seg = rec.service_key.split('--').pop().replace(/^gb-/, '');
  return rec.service_key.startsWith('gb-in-uk-') ? `in-uk-${seg}` : seg;
}

// ---- Build the model, with hard collision checks ----
export const records = latest.records.map(r => ({
  ...r,
  serviceSlug: serviceSlug(r),
  jur: JURISDICTIONS[r.jurisdiction],
  applicantSlug: r.applicant_country ? 'from-' + slugify(r.applicant_country_name) : null,
  history: historyFile.entities[r.id] || [],
  unstamped: UNSTAMPED_SOURCES.has(r.source_id),
  verified_at: SOURCE_BY_ID.get(r.source_id)?.robots_checked_at || r.retrieved_at,
}));

const slugSeen = new Map();
for (const r of records) {
  const key = `${r.jurisdiction}/${r.serviceSlug}/${r.applicantSlug || ''}`;
  const prior = slugSeen.get(key);
  // Multiple non-applicant metrics for one service intentionally share one
  // page (NZ p50 + p80). Any different service colliding remains fatal.
  if (prior && (r.applicant_country || prior.service_key !== r.service_key)) {
    throw new Error(`URL collision: ${key} (${r.id} vs ${prior.id})`);
  }
  slugSeen.set(key, r);
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
      name: displayServiceName(r),
      seoName: SEO_SERVICE_NAMES[r.service_key] || displayServiceName(r),
      fullName: r.service_name,
      scope: serviceScope(r),
      section: serviceSection(r),
      category: r.service_category,
      blurb: CATEGORY_BLURBS[r.service_category] || 'current official processing time',
      jurisdiction: j,
      published: isServicePublished(j, r.service_key),
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
    svc.percent50 = svc.records.find(r => r.id.endsWith('--p50')) || null;
    svc.percent80 = svc.records.find(r => r.id.endsWith('--p80')) || null;
    svc.isPercentileService = Boolean(svc.percent50 && svc.percent80);
  }
}
for (const code of Object.keys(JURISDICTIONS)) services[code] ||= new Map();

export function publishedServices(jurisdiction) {
  return [...services[jurisdiction].values()].filter(service => service.published);
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

export function fmtMonthYear(iso) {
  return new Date(iso.slice(0, 10) + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
}

export function fmtMonthYearShort(iso) {
  return new Date(iso.slice(0, 10) + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
}

// The newest official update date across the dataset — the honest lastmod for
// aggregate pages (only moves when the data actually moved).
export const dataLastmod = latest.records.map(r => r.effective_date).sort().at(-1);

// Month-over-month style delta from recorded history (null until a route has
// two differing published values).
for (const r of records) {
  r.delta = null;
  const h = r.history;
  if (h.length >= 2) {
    const prev = h[h.length - 2];
    const cur = h[h.length - 1];
    if (prev.status === 'ok' && cur.status === 'ok' && prev.value_days !== cur.value_days) {
      r.delta = {
        dir: cur.value_days > prev.value_days ? 'up' : 'down',
        prev_raw: prev.value_raw,
        prev_date: prev.effective_date,
        pct: Math.round(Math.abs(cur.value_days - prev.value_days) / prev.value_days * 100),
      };
    } else if (prev.status === 'ok' && cur.status === 'ok') {
      r.delta = { dir: 'flat', prev_raw: prev.value_raw, prev_date: prev.effective_date, pct: 0 };
    }
  }
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
