// SQLite access via the system sqlite3 CLI — zero npm dependencies.
// All writes go through generated SQL text piped to sqlite3; reads use `-json`.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DB_PATH = path.join(ROOT, 'data', 'db.sqlite');

export function sqlQuote(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

export function exec(sql) {
  const res = spawnSync('sqlite3', [DB_PATH], { input: sql, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.status !== 0) {
    throw new Error(`sqlite3 exec failed (exit ${res.status}): ${res.stderr.slice(0, 2000)}`);
  }
  return res.stdout;
}

export function queryJson(sql) {
  const res = spawnSync('sqlite3', ['-json', DB_PATH, sql], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (res.status !== 0) {
    throw new Error(`sqlite3 query failed (exit ${res.status}): ${res.stderr.slice(0, 2000)}`);
  }
  const out = res.stdout.trim();
  return out ? JSON.parse(out) : [];
}

export function initSchema() {
  const schema = readFileSync(path.join(ROOT, 'pipeline', 'schema.sql'), 'utf8');
  exec(schema);
  // Forward-compatible migration for databases created before sources could
  // retire entities. History remains in SQLite; exports include active rows.
  const columns = queryJson(`PRAGMA table_info(entities)`);
  if (!columns.some(column => column.name === 'active')) {
    exec(`ALTER TABLE entities ADD COLUMN active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1));`);
  }
}
