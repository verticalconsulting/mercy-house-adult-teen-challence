/**
 * Fetch every canonical route as Googlebot and assert the page that comes
 * back is actually that page.
 *
 * This is the acceptance test for the prerender layer. Run against the live
 * origin after the Hado DNS change: if Hado is serving snapshots correctly,
 * every route returns its own title, description, H1 and self-canonical with
 * no JavaScript executed. Before the DNS change every route returns the
 * shell's homepage canonical, which is exactly the failure the audit found
 * (its Googlebot column reads https://mercyhouseatc.org/ on every row).
 *
 *   npm run verify:seo
 *   VERIFY_ORIGIN=https://staging.example.com npm run verify:seo
 */
import { CANONICAL_ROUTES, INDEXABLE_PATHS, LEGACY_REDIRECTS } from '../src/lib/canonical-map.js';

const ORIGIN = process.env.VERIFY_ORIGIN || 'https://mercyhouseatc.com';
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
// Below this much rendered text a page is the templated shell, not a page.
const MIN_BODY_WORDS = 120;
// Every request is bounded. A blackholed origin (firewall, bad DNS, dead
// prerenderer) otherwise hangs the whole run instead of reporting a failure,
// which is the one situation where you most want output.
const REQUEST_TIMEOUT_MS = Number(process.env.VERIFY_TIMEOUT_MS || 15000);

function get(url) {
  return fetch(url, {
    headers: { 'User-Agent': UA },
    redirect: 'manual',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

const failures = [];
const titles = new Map();
const bodies = new Map();

function fail(path, message) {
  failures.push(`${path}: ${message}`);
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

for (const { path, noindex } of CANONICAL_ROUTES) {
  const url = path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`;
  let res;
  try {
    res = await get(url);
  } catch (err) {
    fail(path, `request failed: ${err.message}`);
    continue;
  }

  if (res.status !== 200) {
    fail(path, `expected 200, got ${res.status}`);
    continue;
  }

  const html = await res.text();

  const title = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const ogUrl = extract(html, /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i);
  const twUrl = extract(html, /<meta[^>]+name=["']twitter:url["'][^>]+content=["']([^"']*)["']/i);
  const h1 = extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);

  if (!title) fail(path, 'no <title>');
  if (!desc) fail(path, 'no meta description');
  if (!h1 || !h1.replace(/<[^>]*>/g, '').trim()) {
    // An empty H1 means the snapshot was taken before React Query resolved,
    // so the prerenderer cached a loading skeleton.
    fail(path, 'no rendered <h1> — snapshot likely captured before data loaded');
  }

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count > 1) fail(path, `${h1Count} <h1> elements, expected 1`);

  // "Core body copy for every page, not the templated shell." Strip the nav
  // and footer every page shares, then require enough words left over that
  // this page says something of its own. A shell sails past the title and
  // canonical checks but has almost no unique text.
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = body ? body.split(' ').length : 0;
  if (wordCount < MIN_BODY_WORDS) {
    fail(path, `only ${wordCount} words of body copy (min ${MIN_BODY_WORDS}) — likely the shell`);
  }
  const bodyKey = body.slice(0, 600);
  if (bodies.has(bodyKey)) fail(path, `body copy is identical to ${bodies.get(bodyKey)}`);
  else bodies.set(bodyKey, path);

  if (canonical !== url) fail(path, `canonical is ${canonical}, expected ${url}`);
  if (ogUrl && ogUrl !== url) fail(path, `og:url is ${ogUrl}, expected ${url}`);
  if (twUrl && twUrl !== url) fail(path, `twitter:url is ${twUrl}, expected ${url}`);

  if (/mercyhouseatc\.org/.test(html)) fail(path, 'references the legacy .org domain');
  if (/mercyhouseworks\.org/.test(html)) fail(path, 'references mercyhouseworks.org');
  if (/www\.mercyhouseatc\.com/.test(canonical || '')) fail(path, 'canonical uses the www subdomain');

  const robots = extract(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) || '';
  const xRobots = res.headers.get('x-robots-tag') || '';
  const isNoindexed = /noindex/i.test(robots) || /noindex/i.test(xRobots);
  if (noindex && !isNoindexed) fail(path, 'should be noindex but is indexable');
  if (!noindex && isNoindexed) fail(path, 'is noindexed but should be indexable');

  if (title) {
    if (titles.has(title)) fail(path, `duplicate title, shared with ${titles.get(title)}`);
    else titles.set(title, path);
  }
}

// Legacy URLs must 301 to their replacement, not 404 and not chain.
for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
  let res;
  try {
    res = await get(`${ORIGIN}${from}`);
  } catch (err) {
    fail(from, `redirect check failed: ${err.message}`);
    continue;
  }
  if (res.status !== 301) {
    fail(from, `expected 301, got ${res.status}`);
    continue;
  }
  const location = res.headers.get('location') || '';
  const expected = `${ORIGIN}${to}`;
  if (location !== expected && location !== to) {
    fail(from, `301s to ${location}, expected ${expected}`);
  }
}

// The sitemap must advertise exactly the indexable set.
try {
  const sitemap = await (await get(`${ORIGIN}/sitemap.xml`)).text();
  for (const path of INDEXABLE_PATHS) {
    const loc = path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`;
    if (!sitemap.includes(`<loc>${loc}</loc>`)) fail(path, 'missing from sitemap.xml');
  }
  for (const { path, noindex } of CANONICAL_ROUTES) {
    if (noindex && sitemap.includes(`<loc>${ORIGIN}${path}</loc>`)) {
      fail(path, 'noindex page is listed in sitemap.xml');
    }
  }
} catch (err) {
  fail('/sitemap.xml', `could not be fetched: ${err.message}`);
}

if (failures.length) {
  console.error(`\n${failures.length} SEO verification failure(s) against ${ORIGIN}:\n`);
  for (const f of failures) console.error(`  x ${f}`);
  process.exit(1);
}
console.log(`OK - ${CANONICAL_ROUTES.length} routes verified against ${ORIGIN}`);
