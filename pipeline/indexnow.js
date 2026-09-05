#!/usr/bin/env node
// IndexNow submission for participating search engines (including Bing).
// Submits every public page affected by the latest data or site commit. Google
// and dedicated AI-search crawlers use their own discovery systems. Failure is
// non-fatal: IndexNow is a change hint, not proof of crawling or indexing.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isServicePublished } from '../site/src/lib/publication.js';
import { hubUrls } from '../site/src/lib/sitemap.js';

const KEY = 'acfaf943552a8fee0a3eee74756ef0b2';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.env.SITE_URL || '').replace(/\/$/, '');
if (!SITE) { console.log('[indexnow] SITE_URL unset — skipped'); process.exit(0); }
const BASE_REVISION = process.env.INDEXNOW_BASE || 'HEAD^';
const GIT_MAX_BUFFER = 64 * 1024 * 1024;

const latest = JSON.parse(readFileSync(path.join(ROOT, 'data', 'exports', 'latest.json'), 'utf8'));
const JUR = { CA: 'canada', GB: 'uk', NZ: 'new-zealand', NO: 'norway' };
const slug = s => String(s)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

function serviceSlug(r) {
  if (r.jurisdiction === 'CA') return r.service_key.replace(/^ca-/, '');
  if (r.jurisdiction === 'NZ') return r.service_key.replace(/^nz-/, '');
  if (r.jurisdiction === 'NO') return r.service_key.replace(/^no-/, '');
  const segment = r.service_key.split('--').pop().replace(/^gb-/, '');
  return r.service_key.startsWith('gb-in-uk-') ? `in-uk-${segment}` : segment;
}

function pathsForRecord(r) {
  if (!isServicePublished(r.jurisdiction, r.service_key)) return [];
  const service = serviceSlug(r);
  const paths = [`/${JUR[r.jurisdiction]}/${service}/`];
  // Country pages without a published value remain useful and crawlable, but
  // are noindex until data appears, so they must not be sent to IndexNow.
  if (r.applicant_country && r.status === 'ok') {
    paths.push(`/${JUR[r.jurisdiction]}/${service}/from-${slug(r.applicant_country_name)}/`);
  }
  return paths;
}

function fullSitePaths(records) {
  // Reuse the sitemap's authoritative hub/editorial/report set so a full
  // IndexNow notification cannot silently omit an indexable human page. Old
  // records are still accepted below to preserve deletion/change hints.
  const paths = new Set(hubUrls().map(({ path: publicPath }) => publicPath));
  for (const r of records) for (const p of pathsForRecord(r)) paths.add(p);
  return paths;
}

function previousExport() {
  if (process.env.INDEXNOW_FULL === '1') return null;
  try {
    return JSON.parse(execFileSync('git', ['show', `${BASE_REVISION}:data/exports/latest.json`], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: GIT_MAX_BUFFER,
    }));
  } catch {
    console.log(`[indexnow] could not read ${BASE_REVISION}; using a full-site submission`);
    return null;
  }
}

function changedRepositoryFiles() {
  try {
    const output = execFileSync('git', ['diff', '--name-only', BASE_REVISION, 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: GIT_MAX_BUFFER,
    });
    return output.split('\n').map(s => s.trim()).filter(Boolean);
  } catch {
    console.log(`[indexnow] could not inspect files changed from ${BASE_REVISION}; including the full public set`);
    return null;
  }
}

const DIRECT_SITE_PATHS = new Map([
  ['site/src/pages/index.astro', ['/']],
  ['site/src/pages/about.astro', ['/about/']],
  ['site/src/pages/api-docs.astro', ['/api-docs/']],
  ['site/src/pages/llms.txt.js', ['/llms.txt']],
  ['site/src/pages/reports/feed.xml.js', ['/reports/feed.xml']],
  ['site/src/pages/sitemap.xml.js', ['/sitemap.xml']],
  ['site/src/pages/sitemap-hubs.xml.js', ['/sitemap-hubs.xml']],
  ['site/src/pages/sitemap-ca.xml.js', ['/sitemap-ca.xml']],
  ['site/src/pages/sitemap-gb.xml.js', ['/sitemap-gb.xml']],
  ['site/src/pages/sitemap-nz.xml.js', ['/sitemap-nz.xml']],
  ['site/src/pages/sitemap-no.xml.js', ['/sitemap-no.xml']],
  ['site/src/lib/sitemap.js', ['/sitemap.xml', '/sitemap-hubs.xml', '/sitemap-ca.xml', '/sitemap-gb.xml', '/sitemap-nz.xml', '/sitemap-no.xml']],
  ['machine/openapi.yaml', ['/api-docs/']],
]);

function addRepositoryChangePaths(urls, files, currentRecords, previousRecords) {
  if (files === null) {
    for (const p of fullSitePaths(currentRecords)) urls.add(p);
    for (const p of fullSitePaths(previousRecords)) urls.add(p);
    return;
  }

  let sharedSiteCodeChanged = false;
  for (const file of files) {
    const direct = DIRECT_SITE_PATHS.get(file);
    if (direct) {
      for (const p of direct) urls.add(p);
      continue;
    }

    if (file === 'site/src/pages/404.astro') continue;
    if (file.startsWith('site/src/pages/guides/') && file.endsWith('.astro')) {
      const name = path.basename(file, '.astro');
      urls.add(name === 'index' ? '/guides/' : `/guides/${name}/`);
      continue;
    }
    if (file === 'site/public/robots.txt') {
      urls.add('/robots.txt');
      continue;
    }

    // Dynamic templates, publication rules, layouts, styles and shared data can
    // change many URLs. The exact safe set is the union of old and new public
    // HTML paths, which also preserves deletion notifications.
    if (
      file.startsWith('site/src/') ||
      file === 'site/astro.config.mjs' ||
      file === 'site/site.config.json' ||
      file === 'site/package.json' ||
      file === 'site/package-lock.json'
    ) sharedSiteCodeChanged = true;
  }

  if (sharedSiteCodeChanged) {
    for (const p of fullSitePaths(currentRecords)) urls.add(p);
    for (const p of fullSitePaths(previousRecords)) urls.add(p);
  }
}

const previous = previousExport();
let urls;
if (!previous) {
  urls = fullSitePaths(latest.records);
} else {
  urls = new Set();
  const oldById = new Map(previous.records.map(r => [r.id, r]));
  const newById = new Map(latest.records.map(r => [r.id, r]));
  const changed = new Set([...oldById.keys(), ...newById.keys()]);
  for (const id of [...changed]) {
    const oldRecord = oldById.get(id);
    const newRecord = newById.get(id);
    if (JSON.stringify(oldRecord) === JSON.stringify(newRecord)) changed.delete(id);
  }

  const oldSources = new Map(previous.sources.map(s => [s.id, s]));
  const newSources = new Map(latest.sources.map(s => [s.id, s]));
  const changedSourceIds = new Set([...oldSources.keys(), ...newSources.keys()]);
  for (const id of [...changedSourceIds]) {
    if (JSON.stringify(oldSources.get(id)) === JSON.stringify(newSources.get(id))) changedSourceIds.delete(id);
  }

  if (changed.size || changedSourceIds.size) {
    for (const p of ['/', '/about/', '/api-docs/', '/guides/', '/reports/', '/reports/feed.xml']) urls.add(p);
    for (const { path: publicPath } of hubUrls()) {
      if (publicPath.startsWith('/reports/')) urls.add(publicPath);
    }
  }
  for (const id of changed) {
    const oldRecord = oldById.get(id);
    const newRecord = newById.get(id);
    for (const r of [oldRecord, newRecord].filter(Boolean)) {
      urls.add(`/${JUR[r.jurisdiction]}/`);
      for (const p of pathsForRecord(r)) urls.add(p);
    }
  }
  for (const r of [...previous.records, ...latest.records]) {
    if (!changedSourceIds.has(r.source_id)) continue;
    urls.add(`/${JUR[r.jurisdiction]}/`);
    for (const p of pathsForRecord(r)) urls.add(p);
  }

  addRepositoryChangePaths(urls, changedRepositoryFiles(), latest.records, previous.records);
}

if (!urls.size) {
  console.log('[indexnow] no changed public URLs — skipped');
  process.exit(0);
}

const urlList = [...urls].sort().map(p => SITE + p);
if (urlList.length > 10_000) throw new Error(`IndexNow limit exceeded: ${urlList.length} URLs`);

if (process.env.INDEXNOW_DRY_RUN === '1') {
  console.log(`[indexnow] dry run: ${urlList.length} URLs`);
  console.log(urlList.slice(0, 20).join('\n'));
  process.exit(0);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`[indexnow] submitted ${urlList.length} URLs — HTTP ${res.status}`);
if (![200, 202].includes(res.status)) process.exitCode = 1;
