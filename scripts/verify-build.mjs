import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const pages = walk('src/content/docs').filter(p => p.endsWith('.mdx'));
const errors = [];
const routes = new Set(pages.map(p => p.replace('src/content/docs/', '').replace(/\.mdx$/, '')));
const navigation = JSON.parse(readFileSync('navigation.json', 'utf8'));
for (const tab of navigation.tabs) for (const group of tab.groups) for (const page of group.pages) {
  if (!routes.has(page)) errors.push(`Navigation page missing: ${page}`);
}
for (const route of routes) {
  const path = route === 'index' ? 'dist/index.html' : `dist/${route}/index.html`;
  if (!existsSync(path)) { errors.push(`Missing output: ${path}`); continue; }
  const html = readFileSync(path, 'utf8');
  if (!html.includes('data-pagefind-body')) errors.push(`Not searchable: ${route}`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    if (match[1].startsWith('//')) continue;
    const target = join('dist', decodeURIComponent(match[1]));
    if (!existsSync(target) && !existsSync(join(target, 'index.html'))) errors.push(`${route}: broken local link ${match[1]}`);
  }
}
for (const path of ['dist/pagefind/pagefind.js', 'dist/404.html']) if (!existsSync(path)) errors.push(`Missing ${path}`);
if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exit(1); }
console.log(`Verified ${pages.length} documentation pages, navigation, local links, search index, and 404 page.`);
