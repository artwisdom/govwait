#!/usr/bin/env node
// IndexNow submission (Bing/Yandex — Google does not consume IndexNow, but
// Bing feeds ChatGPT Search citations). Submits the pages whose official data
// just changed. Failure is non-fatal: this is a hint, not a dependency.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = 'acfaf943552a8fee0a3eee74756ef0b2';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.env.SITE_URL || '').replace(/\/$/, '');
if (!SITE) { console.log('[indexnow] SITE_URL unset — skipped'); process.exit(0); }

const latest = JSON.parse(readFileSync(path.join(ROOT, 'data', 'exports', 'latest.json'), 'utf8'));
const JUR = { CA: 'canada', GB: 'uk' };
const newest = latest.records.map(r => r.effective_date).sort().at(-1);
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const urls = new Set(['/', '/canada/', '/uk/', '/guides/']);
for (const r of latest.records.filter(r => r.effective_date === newest && r.applicant_country)) {
  const service = r.jurisdiction === 'CA' ? r.service_key.replace(/^ca-/, '') : r.service_key.split('--').pop();
  urls.add(`/${JUR[r.jurisdiction]}/${service}/from-${slug(r.applicant_country_name)}/`);
}
const urlList = [...urls].slice(0, 2000).map(p => SITE + p);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`[indexnow] submitted ${urlList.length} URLs — HTTP ${res.status}`);
