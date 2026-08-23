#!/usr/bin/env node
// IndexNow submission for participating search engines (including Bing).
// Submits every page affected by the latest data commit. Google and dedicated
// AI-search crawlers use their own discovery systems. Failure is non-fatal:
// IndexNow is a change hint, not proof of crawling or indexing.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = 'acfaf943552a8fee0a3eee74756ef0b2';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.env.SITE_URL || '').replace(/\/$/, '');
if (!SITE) { console.log('[indexnow] SITE_URL unset — skipped'); process.exit(0); }

const latest = JSON.parse(readFileSync(path.join(ROOT, 'data', 'exports', 'latest.json'), 'utf8'));
const JUR = { CA: 'canada', GB: 'uk' };
const slug = s => String(s)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

function serviceSlug(r) {
  if (r.jurisdiction === 'CA') return r.service_key.replace(/^ca-/, '');
  const segment = r.service_key.split('--').pop().replace(/^gb-/, '');
  return r.service_key.startsWith('gb-in-uk-') ? `in-uk-${segment}` : segment;
}

function pathsForRecord(r) {
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
  const paths = new Set([
    '/', '/about/', '/api-docs/', '/guides/',
    '/guides/how-canada-processing-times-work/',
    '/guides/canada-visitor-visa-by-country/',
    '/guides/uk-visa-processing-standards/',
    '/canada/', '/uk/',
  ]);
  for (const r of records) for (const p of pathsForRecord(r)) paths.add(p);
  return paths;
}

function previousExport() {
  if (process.env.INDEXNOW_FULL === '1') return null;
  const revision = process.env.INDEXNOW_BASE || 'HEAD^';
  try {
    return JSON.parse(execFileSync('git', ['show', `${revision}:data/exports/latest.json`], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }));
  } catch {
    console.log(`[indexnow] could not read ${revision}; using a full-site submission`);
    return null;
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

  const sourcesChanged = JSON.stringify(previous.sources) !== JSON.stringify(latest.sources);
  if (changed.size || sourcesChanged) {
    for (const p of ['/', '/about/', '/api-docs/', '/guides/']) urls.add(p);
  }
  for (const id of changed) {
    const oldRecord = oldById.get(id);
    const newRecord = newById.get(id);
    for (const r of [oldRecord, newRecord].filter(Boolean)) {
      urls.add(`/${JUR[r.jurisdiction]}/`);
      for (const p of pathsForRecord(r)) urls.add(p);
    }
  }
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
