#!/usr/bin/env node
// Smoke test: spawns the compiled server and exercises the MCP protocol over
// stdio — initialize, tools/list, and two real tool calls with assertions.
// Exit 0 = pass; anything else = fail loudly.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const server = spawn('node', [path.join(HERE, 'dist', 'index.js')], { stdio: ['pipe', 'pipe', 'pipe'] });

let buf = '';
const pending = new Map();
server.stdout.on('data', (d) => {
  buf += d.toString();
  let idx;
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id !== undefined && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});
server.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`));

let nextId = 1;
function rpc(method, params) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, resolve);
    server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    setTimeout(() => { if (pending.has(id)) reject(new Error(`timeout waiting for ${method}`)); }, 10000);
  });
}
function notify(method, params) {
  server.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
}
function assert(cond, label) {
  if (!cond) { console.error(`✗ ASSERT FAILED: ${label}`); server.kill(); process.exit(1); }
  console.log(`✓ ${label}`);
}

try {
  const init = await rpc('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'smoke-test', version: '0.0.1' },
  });
  assert(init.result?.serverInfo?.name === 'govwait', 'initialize returns serverInfo.name=govwait');
  notify('notifications/initialized', {});

  const tools = await rpc('tools/list', {});
  const names = tools.result.tools.map(t => t.name).sort();
  assert(JSON.stringify(names) === JSON.stringify(['compare_values', 'get_entity', 'get_latest_value', 'search_entities']),
    `tools/list exposes the 4 expected tools (got: ${names.join(', ')})`);

  const one = await rpc('tools/call', { name: 'get_latest_value', arguments: { service_key: 'ca-visitor-visa', applicant_country: 'IN' } });
  const oneBody = JSON.parse(one.result.content[0].text);
  assert(oneBody.entity_id === 'ca-visitor-visa--in', 'get_latest_value resolves ca-visitor-visa + IN to the right entity');
  assert(/^\d+ days?$/.test(oneBody.current_value), `get_latest_value returns a duration (got "${oneBody.current_value}")`);
  assert(!!oneBody.source_url && !!oneBody.official_last_updated, 'get_latest_value carries provenance (source_url + official date)');

  const nz = await rpc('tools/call', { name: 'get_latest_value', arguments: { service_key: 'nz-visitor-visa' } });
  const nzBody = JSON.parse(nz.result.content[0].text);
  assert(nzBody.metrics?.length === 2, 'New Zealand service lookup returns both official percentile metrics');
  assert(nzBody.metrics.every(r => r.unit_original === 'working days'), 'New Zealand metrics preserve the official working-day unit');

  const cmp = await rpc('tools/call', { name: 'compare_values', arguments: { service_key: 'ca-visitor-visa', applicant_countries: ['IN', 'NG', 'PH', 'US'] } });
  const cmpBody = JSON.parse(cmp.result.content[0].text);
  assert(cmpBody.comparison.length === 4, 'compare_values returns all 4 requested countries');
  const days = cmpBody.comparison.map(r => r.value_days);
  assert(days.every((v, i) => i === 0 || v >= days[i - 1]), `compare_values is sorted fastest-first (${days.join(' ≤ ')})`);

  const search = await rpc('tools/call', { name: 'search_entities', arguments: { query: 'study permit pakistan' } });
  const searchBody = JSON.parse(search.result.content[0].text);
  assert(searchBody.matches.some(m => m.entity_id === 'ca-study-permit--pk'), 'search_entities finds ca-study-permit--pk for "study permit pakistan"');

  console.log('\nSMOKE TEST: ALL PASS');
  server.kill();
  process.exit(0);
} catch (err) {
  console.error('SMOKE TEST FAILED:', err.message);
  server.kill();
  process.exit(1);
}
