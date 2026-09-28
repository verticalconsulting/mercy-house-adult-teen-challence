/**
 * Prebuild step: write public/sitemap.xml from the canonical map.
 *
 * Runs via npm's `prebuild` hook before `vite build`, so Vite copies the
 * result into dist/. The output is committed so sitemap changes show up in
 * code review rather than appearing silently at deploy time.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { buildSitemap } from '../src/lib/sitemap.js';

const ORIGIN = process.env.VITE_SITE_URL || 'https://mercyhouseatc.com';
const outPath = resolve(dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');

writeFileSync(outPath, buildSitemap(ORIGIN), 'utf8');
console.log(`sitemap.xml written for ${ORIGIN}`);
