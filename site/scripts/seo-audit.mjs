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
  const segment = record.service_key.split('--').pop().replace(/^gb-/, '');
  return record.service_key.startsWith('gb-in-uk-') ? `in-uk-${segment}` : segment;
}

const expectedNoindex = new Set(['/404/', '/contact/', '/corrections/', '/privacy/', '/terms/']);
for (const record of LATEST.records) {
  if (!record.applicant_country || record.status === 'ok') continue;
  const jurisdiction = record.jurisdiction === 'CA' ? 'canada' : record.jurisdiction === 'NZ' ? 'new-zealand' : 'uk';
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
  const robots = capture(html, /<meta name="robots" content="([^"]*)"/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

  if (!title) errors.push(`${url}: missing title`);
  if (!description) errors.push(`${url}: missing meta description`);
  if (!canonical) errors.push(`${url}: missing canonical`);
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
  sitemapUrls.push(...entries.map(entry => entry.loc));
}

const duplicateSitemapUrls = sitemapUrls.filter((url, i) => sitemapUrls.indexOf(url) !== i);
if (duplicateSitemapUrls.length) errors.push(`duplicate sitemap URLs: ${[...new Set(duplicateSitemapUrls)].join(', ')}`);
const canonicalSet = new Set(indexable.map(page => page.canonical));
const sitemapSet = new Set(sitemapUrls);
for (const canonical of canonicalSet) if (!sitemapSet.has(canonical)) errors.push(`indexable URL missing from sitemaps: ${canonical}`);
for (const sitemapUrl of sitemapSet) if (!canonicalSet.has(sitemapUrl)) errors.push(`sitemap URL is not indexable HTML: ${sitemapUrl}`);

const robotsText = readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
if (!robotsText.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) errors.push('robots.txt: canonical sitemap declaration missing');
if (/Disallow:\s*\//i.test(robotsText)) errors.push('robots.txt: whole-site disallow found');
for (const agent of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
  if (!robotsText.includes(`User-agent: ${agent}`)) errors.push(`robots.txt: explicit ${agent} group missing`);
}

const llmsText = readFileSync(path.join(DIST, 'llms.txt'), 'utf8');
for (const required of [`Canonical site: ${canonicalOrigin}/`, `${canonicalOrigin}/sitemap.xml`, `${canonicalOrigin}/api/v1/index.json`]) {
  if (!llmsText.includes(required)) errors.push(`llms.txt: missing ${required}`);
}

console.log(`[seo-audit] ${pages.length} HTML pages; ${indexable.length} indexable; ${sitemapUrls.length} sitemap URLs`);
console.log(`[seo-audit] ${warnings.length} non-blocking length warnings`);
if (warnings.length) console.log(warnings.slice(0, 10).map(w => `WARN ${w}`).join('\n'));
if (errors.length) {
  console.error(errors.map(error => `FAIL ${error}`).join('\n'));
  process.exit(1);
}
console.log('[seo-audit] PASS');
