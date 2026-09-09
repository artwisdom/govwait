#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(SITE_DIR, 'dist');
const LATEST = JSON.parse(readFileSync(path.join(SITE_DIR, '..', 'data', 'exports', 'latest.json'), 'utf8'));
const errors = [];
const warnings = [];

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function serviceSlug(record) {
  if (record.jurisdiction === 'CA') return record.service_key.replace(/^ca-/, '');
  if (record.jurisdiction === 'NZ') return record.service_key.replace(/^nz-/, '');
  if (record.jurisdiction === 'NO') return record.service_key.replace(/^no-/, '');
  const segment = record.service_key.split('--').pop().replace(/^gb-/, '');
  return record.service_key.startsWith('gb-in-uk-') ? `in-uk-${segment}` : segment;
}

const expectedNoindex = new Set(['/404/', '/contact/', '/corrections/', '/privacy/', '/terms/']);
for (const record of LATEST.records) {
  if (!record.applicant_country || record.status === 'ok') continue;
  const jurisdiction = { CA: 'canada', GB: 'uk', NZ: 'new-zealand', NO: 'norway' }[record.jurisdiction];
  if (!jurisdiction) throw new Error(`unknown jurisdiction ${record.jurisdiction} in SEO audit`);
  expectedNoindex.add(`/${jurisdiction}/${serviceSlug(record)}/from-${slugify(record.applicant_country_name)}/`);
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else files.push(absolute);
  }
  return files;
}

function capture(html, pattern) {
  return (html.match(pattern) || [])[1]?.trim() || '';
}

function pagePath(file) {
  const relative = path.relative(DIST, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  if (relative.endsWith('.html')) return `/${relative.slice(0, -'.html'.length)}`;
  return `/${relative}`;
}

function duplicateGroups(rows, field) {
  const values = new Map();
  for (const row of rows) {
    if (!row[field]) continue;
    if (!values.has(row[field])) values.set(row[field], []);
    values.get(row[field]).push(row.url);
  }
  return [...values].filter(([, urls]) => urls.length > 1);
}

function extractSitemapEntries(xml) {
  return [...xml.matchAll(/<(?:url|sitemap)>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/(?:url|sitemap)>/g)]
    .map(([, loc, lastmod]) => ({ loc, lastmod }));
}

function localTargetExists(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const relative = clean.replace(/^\/+/, '');
  const candidates = clean.endsWith('/')
    ? [path.join(DIST, relative, 'index.html')]
    : [path.join(DIST, relative), path.join(DIST, `${relative}.html`), path.join(DIST, relative, 'index.html')];
  return candidates.some(candidate => {
    try { return statSync(candidate).isFile(); } catch { return false; }
  });
}

const files = walk(DIST);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const pages = [];
const internalLinks = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const url = pagePath(file);
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i);
  const description = capture(html, /<meta name="description" content="([^"]*)"/i);
  const canonical = capture(html, /<link rel="canonical" href="([^"]*)"/i);
  const reportFeed = capture(html, /<link rel="alternate" href="([^"]*)" type="application\/rss\+xml"/i);
  const robots = capture(html, /<meta name="robots" content="([^"]*)"/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

  if (!title) errors.push(`${url}: missing title`);
  if (!description) errors.push(`${url}: missing meta description`);
  if (!canonical) errors.push(`${url}: missing canonical`);
  if (reportFeed !== '/reports/feed.xml') errors.push(`${url}: missing report-feed autodiscovery`);
  if (!robots) errors.push(`${url}: missing robots directive`);
  if (h1Count !== 1) errors.push(`${url}: expected one H1, found ${h1Count}`);
  if (title.length > 180) errors.push(`${url}: runaway title length ${title.length}`);
  if (description.length > 320) errors.push(`${url}: runaway description length ${description.length}`);
  if (title.length > 75) warnings.push(`${url}: long title (${title.length})`);
  if (description.length > 170) warnings.push(`${url}: long description (${description.length})`);
  if (expectedNoindex.has(url) && !robots.includes('noindex')) errors.push(`${url}: expected noindex`);
  if (!expectedNoindex.has(url) && robots.includes('noindex')) errors.push(`${url}: unexpected noindex`);

  for (const match of jsonLd) {
    try { JSON.parse(match[1]); }
    catch (error) { errors.push(`${url}: invalid JSON-LD (${error.message})`); }
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    if (match[1].startsWith('/')) internalLinks.add(match[1]);
  }
  pages.push({ url, title, description, canonical, robots });
}

for (const url of expectedNoindex) {
  if (!pages.some(page => page.url === url)) errors.push(`${url}: expected noindex page was not built`);
}

for (const [value, urls] of duplicateGroups(pages, 'title')) {
  errors.push(`duplicate title on ${urls.join(', ')}: ${value}`);
}
for (const [value, urls] of duplicateGroups(pages, 'description')) {
  errors.push(`duplicate description on ${urls.join(', ')}: ${value}`);
}
for (const link of internalLinks) {
  if (!localTargetExists(link)) errors.push(`broken internal link: ${link}`);
}

const indexable = pages.filter(page => !page.robots.includes('noindex'));
const canonicalOrigin = new URL(indexable[0].canonical).origin;
for (const page of pages) {
  const expected = `${canonicalOrigin}${page.url}`;
  if (page.canonical !== expected) errors.push(`${page.url}: canonical ${page.canonical} != ${expected}`);
}

const sitemapIndexPath = path.join(DIST, 'sitemap.xml');
const sitemapIndex = extractSitemapEntries(readFileSync(sitemapIndexPath, 'utf8'));
if (!sitemapIndex.length) errors.push('sitemap.xml: no child sitemaps');
const sitemapUrls = [];
const sitemapLastmods = new Map();
for (const child of sitemapIndex) {
  const childUrl = new URL(child.loc);
  const childPath = path.join(DIST, childUrl.pathname.replace(/^\//, ''));
  if (!localTargetExists(childUrl.pathname)) {
    errors.push(`sitemap.xml: missing child ${childUrl.pathname}`);
    continue;
  }
  const entries = extractSitemapEntries(readFileSync(childPath, 'utf8'));
  const newest = entries.map(entry => entry.lastmod).sort().at(-1);
  if (child.lastmod !== newest) errors.push(`${childUrl.pathname}: index lastmod ${child.lastmod} != child max ${newest}`);
  for (const entry of entries) {
    sitemapUrls.push(entry.loc);
    sitemapLastmods.set(entry.loc, entry.lastmod);
  }
}

const duplicateSitemapUrls = sitemapUrls.filter((url, i) => sitemapUrls.indexOf(url) !== i);
if (duplicateSitemapUrls.length) errors.push(`duplicate sitemap URLs: ${[...new Set(duplicateSitemapUrls)].join(', ')}`);
const canonicalSet = new Set(indexable.map(page => page.canonical));
const sitemapSet = new Set(sitemapUrls);
for (const canonical of canonicalSet) if (!sitemapSet.has(canonical)) errors.push(`indexable URL missing from sitemaps: ${canonical}`);
for (const sitemapUrl of sitemapSet) if (!canonicalSet.has(sitemapUrl)) errors.push(`sitemap URL is not indexable HTML: ${sitemapUrl}`);

// Phase 5A turns the API into a citable dataset surface. Keep its canonical
// landing page, truthful reuse notice, bulk files and Dataset markup together.
const datasetEditorialModified = '2026-09-08';
for (const url of ['/', '/about/', '/api-docs/', '/data/', '/data-license/']) {
  const absoluteUrl = `${canonicalOrigin}${url}`;
  if (sitemapLastmods.get(absoluteUrl) !== datasetEditorialModified) {
    errors.push(`${url}: expected Phase 5A sitemap lastmod ${datasetEditorialModified}, found ${sitemapLastmods.get(absoluteUrl) || 'missing'}`);
  }
}

let datasetHtml = '';
try { datasetHtml = readFileSync(path.join(DIST, 'data', 'index.html'), 'utf8'); }
catch { errors.push('/data/: Phase 5A dataset landing page missing'); }
if (datasetHtml) {
  for (const snippet of [
    'Government processing-time dataset',
    '/api/v1/downloads/latest.csv',
    '/api/v1/downloads/history.csv',
    '/api/v1/downloads/forward-looking.csv',
    '/api/v1/downloads/sources.csv',
    '/api/v1/dataset.json',
    '/data-license/',
    'History is append-only.',
  ]) {
    if (!datasetHtml.includes(snippet)) errors.push(`/data/: missing Phase 5A content: ${snippet}`);
  }
  const objects = [...datasetHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map(match => { try { return JSON.parse(match[1]); } catch { return null; } })
    .filter(Boolean);
  const dataset = objects.find(object => object['@type'] === 'Dataset');
  if (!dataset) errors.push('/data/: Dataset JSON-LD missing');
  else {
    if (dataset.url !== `${canonicalOrigin}/data/`) errors.push(`/data/: Dataset URL is ${dataset.url}`);
    if (dataset.license !== `${canonicalOrigin}/data-license/`) errors.push('/data/: Dataset license notice URL missing');
    if (!Array.isArray(dataset.distribution) || dataset.distribution.length !== 4) errors.push('/data/: expected four Dataset distributions');
    for (const distribution of dataset.distribution || []) {
      if (distribution['@type'] !== 'DataDownload' || distribution.encodingFormat !== 'text/csv') errors.push('/data/: invalid DataDownload metadata');
      if (!distribution.contentUrl?.startsWith(`${canonicalOrigin}/api/v1/downloads/`)) errors.push(`/data/: invalid distribution URL ${distribution.contentUrl}`);
    }
    if (!Array.isArray(dataset.isBasedOn) || dataset.isBasedOn.length < 4 || dataset.isBasedOn.some(url => !/^https:\/\//.test(url))) {
      errors.push('/data/: source provenance URLs missing from Dataset isBasedOn');
    }
  }
}

let homeHtml = '';
try { homeHtml = readFileSync(path.join(DIST, 'index.html'), 'utf8'); }
catch { errors.push('/: homepage output missing'); }
if (homeHtml.includes('"@type":"Dataset"')) errors.push('/: duplicate Dataset JSON-LD should live only on /data/');

let licenseHtml = '';
try { licenseHtml = readFileSync(path.join(DIST, 'data-license', 'index.html'), 'utf8'); }
catch { errors.push('/data-license/: reuse notice missing'); }
for (const snippet of [
  'does not relicense',
  'Open Government Licence v3.0',
  'CC BY 3.0 New Zealand',
  'Do not assume every IRCC page or file',
  'has not identified an explicit reuse licence',
]) {
  if (licenseHtml && !licenseHtml.includes(snippet)) errors.push(`/data-license/: missing source-specific notice: ${snippet}`);
}

const metadata = JSON.parse(readFileSync(path.join(DIST, 'api', 'v1', 'dataset.json'), 'utf8'));
if (metadata.stats?.current_routes !== LATEST.records.length) errors.push('dataset.json: current route count mismatch');
if (metadata.distributions?.length !== 4) errors.push('dataset.json: expected four CSV distributions');
for (const distribution of metadata.distributions || []) {
  if (!localTargetExists(distribution.path)) errors.push(`dataset.json: missing distribution ${distribution.path}`);
}

// Phase 4's query-led cohort is intentionally small and hand-reviewed. Pin its
// discoverability and content invariants so a later template refactor cannot
// silently erase the source-backed additions or publish a dishonest lastmod.
const phaseFourPages = [
  {
    url: '/guides/new-zealand-critical-purpose-visitor-visa-processing-time/',
    lastmod: '2026-09-06',
    required: ['No current GovWait estimate.', 'July 31, 2022', 'href="/new-zealand/specific-purpose-work-visa/"'],
  },
  {
    url: '/new-zealand/skilled-migrant-category-resident-visa/',
    lastmod: '2026-09-06',
    required: ['Where this wait fits in the Skilled Migrant route', 'https://www.immigration.govt.nz/visas/skilled-migrant-category-resident-visa/'],
  },
  {
    url: '/new-zealand/specific-purpose-work-visa/',
    lastmod: '2026-09-06',
    required: ['What the Specific Purpose Work Visa clock covers', 'href="/guides/new-zealand-critical-purpose-visitor-visa-processing-time/"'],
  },
  {
    url: '/new-zealand/dependent-child-resident-visa/',
    lastmod: '2026-09-06',
    required: ['Which dependent-child route this time describes', 'https://www.immigration.govt.nz/visas/dependent-child-resident-visa/'],
  },
];
for (const page of phaseFourPages) {
  const absoluteUrl = `${canonicalOrigin}${page.url}`;
  if (sitemapLastmods.get(absoluteUrl) !== page.lastmod) {
    errors.push(`${page.url}: expected sitemap lastmod ${page.lastmod}, found ${sitemapLastmods.get(absoluteUrl) || 'missing'}`);
  }
  const outputPath = path.join(DIST, page.url.replace(/^\/+|\/+$/g, ''), 'index.html');
  let html = '';
  try { html = readFileSync(outputPath, 'utf8'); }
  catch { errors.push(`${page.url}: Phase 4 output missing`); }
  for (const snippet of page.required) {
    if (html && !html.includes(snippet)) errors.push(`${page.url}: missing Phase 4 content: ${snippet}`);
  }
}

// Phase 4B improves only four Canadian URLs that already have Search Console
// impressions. Assert their query-matching metadata, source-backed additions
// and honest editorial/data lastmod without freezing a value that should change
// on the next official source update.
const canadianEditorialModified = '2026-09-07';
const canadianNearWinPages = [
  {
    id: 'ca-refugee-private-refugee-side--pk',
    url: '/canada/refugee-private-refugee-side/from-pakistan/',
    titlePrefix: 'Canada Private Refugee from Pakistan',
    h1: 'Canada private refugee processing time from Pakistan',
    required: [
      'data-applicant-editorial="ca-refugee-private-refugee-side--pk"',
      'Which part of the private-refugee process this measures',
      'not the separately published sponsor-processing value',
      'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/sponsor-refugee/private-sponsorship-program/how-we-process-applications.html',
    ],
  },
  ...[
    ['co', 'colombia', 'Colombia'],
    ['np', 'nepal', 'Nepal'],
    ['qa', 'qatar', 'Qatar'],
  ].map(([countryCode, slug, country]) => ({
    id: `ca-visitor-visa--${countryCode}`,
    url: `/canada/visitor-visa/from-${slug}/`,
    titlePrefix: `Canada Visitor Visa from ${country}`,
    h1: `Canada visitor visa processing time from ${country}`,
    required: [
      `data-applicant-editorial="ca-visitor-visa--${countryCode}"`,
      `What the ${country} result covers`,
      'It is not an inside-Canada visitor-visa time',
      'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html',
    ],
  })),
];
for (const page of canadianNearWinPages) {
  const record = LATEST.records.find(item => item.id === page.id);
  if (!record) {
    errors.push(`${page.url}: Phase 4B source record missing`);
    continue;
  }
  const expectedLastmod = [record.effective_date, canadianEditorialModified].sort().at(-1);
  const absoluteUrl = `${canonicalOrigin}${page.url}`;
  if (sitemapLastmods.get(absoluteUrl) !== expectedLastmod) {
    errors.push(`${page.url}: expected sitemap lastmod ${expectedLastmod}, found ${sitemapLastmods.get(absoluteUrl) || 'missing'}`);
  }
  const outputPath = path.join(DIST, page.url.replace(/^\/+|\/+$/g, ''), 'index.html');
  let html = '';
  try { html = readFileSync(outputPath, 'utf8'); }
  catch { errors.push(`${page.url}: Phase 4B output missing`); }
  const expectedMonth = new Date(`${record.effective_date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  });
  const expectedTitle = `${page.titlePrefix}: ${record.value_raw} (${expectedMonth})`;
  const builtPage = pages.find(item => item.url === page.url);
  if (builtPage?.title !== expectedTitle) errors.push(`${page.url}: expected title ${expectedTitle}, found ${builtPage?.title || 'missing'}`);
  if (builtPage && (builtPage.title.length < 50 || builtPage.title.length > 60)) errors.push(`${page.url}: Phase 4B title length ${builtPage.title.length} is outside 50-60`);
  if (builtPage && (builtPage.description.length < 140 || builtPage.description.length > 160)) errors.push(`${page.url}: Phase 4B description length ${builtPage.description.length} is outside 140-160`);
  if (html && !html.includes(`<h1>${page.h1}</h1>`)) errors.push(`${page.url}: missing query-matching H1`);
  for (const snippet of page.required) {
    if (html && !html.includes(snippet)) errors.push(`${page.url}: missing Phase 4B content: ${snippet}`);
  }
}

// IRCC's visitor-specific page changed the biometrics boundary. This is a
// route-family factual correction, not a ranking experiment: all rendered
// visitor-country pages must carry the current wording, and every indexable one
// must advertise the real correction date in the sitemap.
const currentVisitorBiometricsCopy = [
  'does not include the time needed to give biometrics',
  'the time needed to give biometrics is not included',
];
const staleVisitorBiometricsCopy = 'includes the time taken to provide biometrics';
for (const record of LATEST.records.filter(item => item.service_key === 'ca-visitor-visa')) {
  const url = `/canada/visitor-visa/from-${slugify(record.applicant_country_name)}/`;
  const outputPath = path.join(DIST, url.replace(/^\/+|\/+$/g, ''), 'index.html');
  let html = '';
  try { html = readFileSync(outputPath, 'utf8'); }
  catch { errors.push(`${url}: corrected visitor-visa output missing`); }
  if (html && !currentVisitorBiometricsCopy.some(snippet => html.includes(snippet))) errors.push(`${url}: current visitor-visa biometrics boundary missing`);
  if (html && html.includes(staleVisitorBiometricsCopy)) errors.push(`${url}: stale visitor-visa biometrics claim remains`);
  if (record.status === 'ok') {
    const expectedLastmod = [record.effective_date, canadianEditorialModified].sort().at(-1);
    const absoluteUrl = `${canonicalOrigin}${url}`;
    if (sitemapLastmods.get(absoluteUrl) !== expectedLastmod) {
      errors.push(`${url}: expected visitor-guidance lastmod ${expectedLastmod}, found ${sitemapLastmods.get(absoluteUrl) || 'missing'}`);
    }
  }
}

for (const [url, recordId] of [
  ['/guides/canada-visitor-visa-from-india/', 'ca-visitor-visa--in'],
  ['/guides/canada-visitor-visa-from-philippines/', 'ca-visitor-visa--ph'],
]) {
  const record = LATEST.records.find(item => item.id === recordId);
  const expectedLastmod = [record?.effective_date, canadianEditorialModified].filter(Boolean).sort().at(-1);
  const absoluteUrl = `${canonicalOrigin}${url}`;
  if (sitemapLastmods.get(absoluteUrl) !== expectedLastmod) {
    errors.push(`${url}: expected corrected-guide lastmod ${expectedLastmod}, found ${sitemapLastmods.get(absoluteUrl) || 'missing'}`);
  }
  const outputPath = path.join(DIST, url.replace(/^\/+|\/+$/g, ''), 'index.html');
  let html = '';
  try { html = readFileSync(outputPath, 'utf8'); }
  catch { errors.push(`${url}: corrected visitor guide output missing`); }
  if (html && !currentVisitorBiometricsCopy.some(snippet => html.includes(snippet))) errors.push(`${url}: current visitor-guide biometrics boundary missing`);
  if (html && html.includes(staleVisitorBiometricsCopy)) errors.push(`${url}: stale visitor-guide biometrics claim remains`);
  if (html && !html.includes('https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/visitor-visa.html')) {
    errors.push(`${url}: current IRCC visitor-visa source missing`);
  }
}

const robotsText = readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (!robotsText.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) errors.push('robots.txt: canonical sitemap declaration missing');
if (/Disallow:\s*\//i.test(robotsText)) errors.push('robots.txt: whole-site disallow found');
for (const agent of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
  if (!robotsText.includes(`User-agent: ${agent}`)) errors.push(`robots.txt: explicit ${agent} group missing`);
}

const llmsText = readFileSync(path.join(DIST, 'llms.txt'), 'utf8');
for (const required of [
  `Canonical site: ${canonicalOrigin}/`,
  `${canonicalOrigin}/sitemap.xml`,
  `${canonicalOrigin}/api/v1/index.json`,
  `${canonicalOrigin}/api/v1/dataset.json`,
  `${canonicalOrigin}/api/v1/downloads/latest.csv`,
  `${canonicalOrigin}/api/v1/downloads/history.csv`,
  `${canonicalOrigin}/data-license/`,
  `${canonicalOrigin}/reports/feed.xml`,
]) {
  if (!llmsText.includes(required)) errors.push(`llms.txt: missing ${required}`);
}

const reportFeedText = readFileSync(path.join(DIST, 'reports', 'feed.xml'), 'utf8');
for (const required of ['<rss version="2.0"', '<atom:link', `${canonicalOrigin}/reports/feed.xml`, '<item>']) {
  if (!reportFeedText.includes(required)) errors.push(`reports/feed.xml: missing ${required}`);
}
for (const match of reportFeedText.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)) {
  const itemUrl = new URL(match[1]);
  if (itemUrl.origin !== canonicalOrigin) errors.push(`reports/feed.xml: off-site item ${match[1]}`);
  else if (!localTargetExists(itemUrl.pathname)) errors.push(`reports/feed.xml: missing item target ${itemUrl.pathname}`);
}

console.log(`[seo-audit] ${pages.length} HTML pages; ${indexable.length} indexable; ${sitemapUrls.length} sitemap URLs`);
console.log(`[seo-audit] ${warnings.length} non-blocking length warnings`);
if (warnings.length) console.log(warnings.slice(0, 10).map(w => `WARN ${w}`).join('\n'));
if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}
console.log('[seo-audit] PASS');
