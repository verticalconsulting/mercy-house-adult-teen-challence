/**
 * The single source of truth for every URL this site owns.
 *
 * Source: the .org -> .com canonical URL map (04-canonical-map.csv), supplied
 * 2026-09-28. `src/lib/seo.js`, `src/lib/sitemap.js`, the router and the 301
 * table all derive from this file, and `src/lib/__tests__/seo.test.js` fails
 * the build if any of them drift apart.
 *
 * `noindex` pages stay crawlable on purpose: they are excluded from the
 * sitemap and serve a robots directive, but are never disallowed in
 * robots.txt, because a disallowed page can never be crawled to discover
 * that it is noindexed.
 *
 * Relative imports of this module use an explicit .js extension because
 * scripts/generate-sitemap.mjs loads it through bare Node, which — unlike
 * Vite — does not resolve extensionless specifiers.
 */
export const CANONICAL_ROUTES = [
  { path: '/', legacy: ['/index.html'] },
  { path: '/what-we-do', legacy: ['/about', '/about-us'] },
  { path: '/meet-our-team', legacy: ['/team', '/staff'] },
  { path: '/programs-locations', legacy: ['/programs', '/locations'] },
  { path: '/programs-locations/mens-campus', legacy: ['/mens-campus'] },
  { path: '/programs-locations/womens-campus', legacy: ['/womens-campus'] },
  { path: '/programs-locations/womens-campus/gallery', legacy: ['/womens-campus-gallery'] },
  { path: '/faith-based-program', legacy: ['/comprehensive-approach'] },
  {
    path: '/freedom-from-addiction-starts-here',
    legacy: ['/DependancyHelp', '/dependancy-help', '/help-for-dependency-abuse'],
  },
  { path: '/teen-challenge-story', legacy: [] },
  { path: '/testimonies', legacy: ['/testimonials'] },
  { path: '/testimonies/van-pope', legacy: [] },
  { path: '/testimonies/kaye-byrd', legacy: [] },
  { path: '/testimonies/chris-gates', legacy: [] },
  { path: '/testimonies/josh-cook', legacy: [] },
  { path: '/testimonies/garrick-crouch', legacy: [] },
  { path: '/donate', legacy: [] },
  { path: '/donate/monthly', legacy: ['/recurring-donation'] },
  { path: '/donate-sponsor-student', legacy: ['/sponsor-student'] },
  { path: '/vehicle-donation-program', legacy: ['/vehicle-donation', '/donate-a-car'] },
  { path: '/vehicle-donation-program/form', noindex: true, legacy: ['/vehicle-donation-form'] },
  { path: '/events', legacy: [] },
  { path: '/golf-tournament', legacy: ['/freedom-classic'] },
  { path: '/freedom-gala', legacy: [] },
  { path: '/news', legacy: [] },
  { path: '/news/ministry-updates', legacy: [] },
  { path: '/workforce-development', legacy: ['/WorkforceDevelopment', '/micro-businesses'] },
  { path: '/get-involved', legacy: ['/volunteer'] },
  { path: '/get-involved/internship', legacy: ['/internship'] },
  { path: '/careers', legacy: [] },
  { path: '/contact', legacy: [] },
  { path: '/faq', legacy: [] },
  { path: '/financials', legacy: [] },
  { path: '/media', legacy: ['/media-resources'] },
  { path: '/get-help-now', noindex: true, legacy: ['/intake-form', '/apply'] },
  { path: '/privacy-policy', legacy: [] },
  { path: '/terms-of-use', legacy: ['/terms-conditions'] },

  // Live public routes absent from the supplied canonical map. Kept indexable
  // because they are real pages a visitor can reach from the footer; flagged
  // to the site owner to confirm against the original CSV.
  { path: '/thrift-store', legacy: ['/superthrift'] },
  { path: '/womens-center-calendar', legacy: [] },
];

/** Paths eligible for the sitemap and for indexing. */
export const INDEXABLE_PATHS = CANONICAL_ROUTES.filter((r) => !r.noindex).map((r) => r.path);

const PATH_SET = new Set(CANONICAL_ROUTES.map((r) => r.path));

/** True when `path` is a final canonical URL this site owns. */
export function isCanonicalPath(path) {
  return PATH_SET.has(path);
}

/** Legacy path -> final path, for the 301 table. */
export const LEGACY_REDIRECTS = Object.fromEntries(
  CANONICAL_ROUTES.flatMap((r) => (r.legacy || []).map((from) => [from, r.path]))
);
