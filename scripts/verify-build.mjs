import { cpSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const files = walk('content/docs');
const pages = files.filter(p => p.endsWith('.mdx'));
const routeFor = p => '/' + relative('content/docs', p).replace(/\.mdx$/, '').replace(/(^|\/)index$/, '').replace(/\/$/, '');
const routes = new Set(pages.map(routeFor));
const errors = [];
for (const file of files.filter(p => basename(p) === 'meta.json')) {
  const meta = JSON.parse(readFileSync(file, 'utf8'));
  for (const page of meta.pages ?? []) {
    if (page.startsWith('---') || page === '...') continue;
    const path = join(dirname(file), page);
    if (!existsSync(path) && !existsSync(path + '.mdx')) errors.push(`Missing navigation entry: ${path}`);
  }
}
if (!existsSync('.next/standalone/server.js')) throw new Error('Build the standalone server before verification.');
cpSync('public', '.next/standalone/public', { recursive: true });
cpSync('.next/static', '.next/standalone/.next/static', { recursive: true });
const port = await new Promise((resolve, reject) => {
  const socket = createServer();
  socket.on('error', reject);
  socket.listen(0, '127.0.0.1', () => { const value = socket.address().port; socket.close(() => resolve(value)); });
});
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['.next/standalone/server.js'], { env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', NODE_ENV: 'production' }, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '';
server.stdout.on('data', chunk => { logs += chunk; });
server.stderr.on('data', chunk => { logs += chunk; });
const get = path => fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${logs}`);
    try { if ((await get('/')).ok) { ready = true; break; } } catch {}
    await delay(100);
  }
  if (!ready) throw new Error(`Server did not start: ${logs}`);
  const targets = new Set(['/sitemap.xml', '/robots.txt', '/llms.txt', '/index']);
  for (const route of routes) {
    const response = await get(route);
    if (!response.ok) { errors.push(`${route}: HTTP ${response.status}`); continue; }
    const html = await response.text();
    if (!html.includes('id="nd-page"')) errors.push(`${route}: missing documentation article`);
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      if (!match[1].startsWith('//')) targets.add(match[1].replaceAll('&amp;', '&'));
    }
  }
  for (const target of targets) {
    if (routes.has(target)) continue;
    const response = await get(target);
    if (!response.ok) errors.push(`${target}: HTTP ${response.status}`);
  }
  const search = await get('/api/search?query=Loop');
  if (!search.ok || !(await search.json()).some(item => item.url?.includes('/academy/loops'))) errors.push('Search did not return the Loop lesson.');
  if ((await get('/__verify_missing_page__')).status !== 404) errors.push('Unknown route did not return HTTP 404.');
  if (errors.length) throw new Error([...new Set(errors)].join('\n'));
  console.log(`Verified ${pages.length} content pages, navigation, ${targets.size} local targets, search, and 404 on the standalone server.`);
} finally {
  server.kill('SIGTERM');
}
