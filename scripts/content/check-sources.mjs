#!/usr/bin/env node
// Checks that every https link written in the new course files (version-note sources and project links) still answers.
// Usage: node scripts/content/check-sources.mjs [course-id ...]   (no ids = every course file)
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dir = join(root, 'src/features/courses/content/catalog/courses');
const wanted = process.argv.slice(2);
const files = readdirSync(dir).filter((file) => file.endsWith('.ts') && (wanted.length === 0 || wanted.includes(file.slice(0, -3))));
const links = new Map();
for (const file of files) {
  for (const match of readFileSync(join(dir, file), 'utf8').matchAll(/https?:\/\/[^\s'"`)\\]+/g)) {
    const url = match[0].replace(/[.,;]+$/, '');
    if (!links.has(url)) links.set(url, new Set());
    links.get(url).add(file.slice(0, -3));
  }
}
const urls = [...links.keys()];
const bad = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    try {
      const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; talino-content-check)' } });
      // 403/429 usually mean a bot wall on a page that exists; only a missing page is a real problem.
      if (response.status === 404 || response.status === 410 || response.status >= 500) bad.push(`${response.status} ${url} (${[...links.get(url)].join(', ')})`);
      else if (!url.startsWith('https://')) bad.push(`not https ${url} (${[...links.get(url)].join(', ')})`);
    } catch (error) {
      bad.push(`failed ${url}: ${error.cause?.code ?? error.message} (${[...links.get(url)].join(', ')})`);
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`${urls.length} links in ${files.length} files checked, ${bad.length} problems.`);
for (const line of bad) console.log(line);
process.exit(bad.length ? 1 : 0);
