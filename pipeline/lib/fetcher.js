// Politeness layer: honest UA, robots.txt compliance (fail closed), per-host
// rate limiting, disk cache, hard per-host fetch cap.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CACHE_DIR = path.join(ROOT, 'data', 'cache', 'http');
const ROBOTS_DIR = path.join(ROOT, 'data', 'cache', 'robots');

// Contact placeholder: set CONTACT_EMAIL in the environment for production runs
// (see .env.example / DEPLOYMENT_GUIDE). Never a real value in the repo.
const CONTACT = process.env.CONTACT_EMAIL || 'owner-pending';
export const USER_AGENT = `DataMoatEngineBot/0.1 (contact: ${CONTACT})`;

const MIN_DELAY_MS = 3000;
const MAX_FETCHES_PER_HOST = 150;
const ROBOTS_TTL_MS = 7 * 24 * 3600 * 1000;

const lastHit = new Map();   // host -> timestamp
const hostCount = new Map(); // host -> fetches this run

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function cachePathFor(url, { method = 'GET', form = null } = {}) {
  const upperMethod = String(method).toUpperCase();
  // Preserve the original GET cache keys. POST responses must include their
  // form values in the fingerprint so one endpoint can safely cache many
  // public records (for example, INZ's visaID lookup).
  const fingerprint = upperMethod === 'GET' && !form
    ? url
    : `${upperMethod}\n${url}\n${JSON.stringify(Object.entries(form || {}).sort())}`;
  const h = createHash('sha256').update(fingerprint).digest('hex').slice(0, 24);
  return path.join(CACHE_DIR, `${h}.body`);
}

/** Minimal RFC 9309 matcher for User-agent:* groups. Returns true if path allowed. */
export function robotsAllows(robotsTxt, urlPath) {
  const lines = robotsTxt.split(/\r?\n/);
  let inStar = false, sawAnyGroup = false;
  const rules = []; // {type:'allow'|'disallow', pattern}
  for (const raw of lines) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const field = m[1].toLowerCase(), value = m[2].trim();
    if (field === 'user-agent') {
      if (sawAnyGroup && rules.length && !inStar) { /* keep scanning */ }
      inStar = value === '*';
      sawAnyGroup = true;
    } else if ((field === 'disallow' || field === 'allow') && inStar) {
      if (value === '' && field === 'disallow') continue; // empty disallow = allow all
      rules.push({ type: field, pattern: value });
    }
  }
  // Longest-match wins; allow beats disallow on tie.
  let best = null;
  for (const r of rules) {
    const rx = new RegExp('^' + r.pattern.split(/(\*|\$$)/).map(part => {
      if (part === '*') return '.*';
      if (part === '$') return '$';
      return part.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    }).join(''));
    if (rx.test(urlPath)) {
      if (!best || r.pattern.length > best.pattern.length || (r.pattern.length === best.pattern.length && r.type === 'allow')) {
        best = r;
      }
    }
  }
  return !best || best.type === 'allow';
}

async function rateLimit(host) {
  const n = (hostCount.get(host) || 0) + 1;
  if (n > MAX_FETCHES_PER_HOST) throw new Error(`fetch cap exceeded for ${host} (${MAX_FETCHES_PER_HOST}/run)`);
  hostCount.set(host, n);
  const last = lastHit.get(host) || 0;
  const wait = last + MIN_DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastHit.set(host, Date.now());
}

async function getRobots(host) {
  mkdirSync(ROBOTS_DIR, { recursive: true });
  const p = path.join(ROBOTS_DIR, `${host}.txt`);
  const meta = path.join(ROBOTS_DIR, `${host}.status`);
  if (existsSync(p) && existsSync(meta) && Date.now() - statSync(meta).mtimeMs < ROBOTS_TTL_MS) {
    return { status: parseInt(readFileSync(meta, 'utf8'), 10), body: readFileSync(p, 'utf8') };
  }
  await rateLimit(host);
  const res = await fetch(`https://${host}/robots.txt`, { headers: { 'User-Agent': USER_AGENT }, redirect: 'follow' });
  const body = await res.text();
  writeFileSync(p, body);
  writeFileSync(meta, String(res.status));
  return { status: res.status, body };
}

/**
 * Polite fetch. Throws (loudly) if robots forbids, host caps hit, or non-200.
 * 404 robots = allowed (RFC 9309); 401/403/5xx robots = FAIL CLOSED (source dead).
 */
export async function politeFetch(url, { forceRefresh = false, method = 'GET', form = null } = {}) {
  mkdirSync(CACHE_DIR, { recursive: true });
  const u = new URL(url);
  const upperMethod = String(method).toUpperCase();
  if (!['GET', 'POST'].includes(upperMethod)) throw new Error(`unsupported HTTP method ${upperMethod}`);
  if (upperMethod === 'GET' && form) throw new Error('form data is only supported for POST requests');
  if (upperMethod === 'POST' && (!form || typeof form !== 'object' || Array.isArray(form))) {
    throw new Error('POST requests require a form object');
  }
  const cacheOptions = { method: upperMethod, form };
  const cacheFile = cachePathFor(url, cacheOptions);
  if (!forceRefresh && existsSync(cacheFile)) {
    return { body: readFileSync(cacheFile, 'utf8'), fromCache: true, url };
  }
  const robots = await getRobots(u.host);
  if (robots.status >= 200 && robots.status < 300) {
    if (!robotsAllows(robots.body, u.pathname)) {
      throw new Error(`robots.txt DISALLOWS ${u.pathname} on ${u.host} — source is dead to us`);
    }
  } else if (robots.status !== 404) {
    throw new Error(`robots.txt unreachable on ${u.host} (HTTP ${robots.status}) — failing closed, source is dead to us`);
  }
  await rateLimit(u.host);
  const headers = { 'User-Agent': USER_AGENT, 'Accept': 'application/json, text/html;q=0.9, */*;q=0.5' };
  let body;
  if (form) {
    body = new FormData();
    for (const [key, value] of Object.entries(form)) body.append(key, String(value));
  }
  const res = await fetch(url, { method: upperMethod, headers, body, redirect: 'follow' });
  if (res.status !== 200) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const responseBody = await res.text();
  writeFileSync(cacheFile, responseBody);
  writeFileSync(cacheFile + '.meta', JSON.stringify({
    url, method: upperMethod, retrieved_at: new Date().toISOString(), status: res.status,
  }, null, 2));
  return { body: responseBody, fromCache: false, url };
}

export function cachedRetrievedAt(url, options = {}) {
  const metaFile = cachePathFor(url, options) + '.meta';
  if (existsSync(metaFile)) return JSON.parse(readFileSync(metaFile, 'utf8')).retrieved_at;
  return new Date().toISOString();
}
