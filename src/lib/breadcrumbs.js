/**
 * Breadcrumb trails for the site.
 *
 * A route's crumb label is its own SEO title (`pageSeo`), so a page is named
 * in one place and the trail cannot drift from the <title>. LABELS overrides
 * the handful whose SEO wording reads awkwardly as a crumb, PARENTS records
 * where each page sits in the navigation tree, and detail pages are matched by
 * pattern because staff create them.
 *
 * Consumed once by <Breadcrumbs /> in Layout, so every page gets a trail
 * without each page having to build one.
 */
import { pageSeo } from './seo.js';

/** The first crumb on every trail. */
export const HOME_CRUMB = { label: 'Home', path: '/' };

/**
 * Pages that get no trail at all.
 *
 * The homepage is the trail's own root. The vehicle-donation pages are
 * paid-traffic landing pages: a row of links out of the page is the last
 * thing a visitor who just clicked an ad should be offered.
 */
const NO_TRAIL = new Set([
  '/',
  '/home',
  '/vehicle-donation-program',
  '/vehicle-donation-program/form',
]);

/** path -> parent path. An entry here means the page sits under that section. */
const PARENTS = {
  // About Us
  '/teen-challenge-story': '/what-we-do',
  '/meet-our-team': '/what-we-do',
  '/events': '/what-we-do',
  '/golf-tournament': '/events',
  '/freedom-gala': '/events',
  '/news': '/what-we-do',
  '/media': '/what-we-do',
  '/financials': '/what-we-do',
  '/files': '/what-we-do',
  '/connect': '/what-we-do',
  '/careers': '/what-we-do',
  // Our Approach
  '/workforce-development': '/faith-based-program',
  '/thrift-store': '/workforce-development',
  '/vehicle-donation-program': '/workforce-development',
  '/vehicle-donation-program/form': '/vehicle-donation-program',
  '/get-involved/internship': '/faith-based-program',
  '/testimonies': '/faith-based-program',
  '/faq': '/faith-based-program',
  // Ways to Help
  '/get-involved': '/donate',
  '/donate-sponsor-student': '/donate',
  '/thank-you': '/donate',
  // Locations
  '/programs-locations/mens-campus': '/programs-locations',
  '/programs-locations/womens-campus': '/programs-locations',
  '/programs-locations/womens-campus/gallery': '/programs-locations/womens-campus',
  '/womens-center-calendar': '/programs-locations',
};

/** Crumb wording where the SEO title is written for search, not for a trail. */
const LABELS = {
  '/what-we-do': 'About Us',
  '/faith-based-program': 'Our Approach',
  '/programs-locations': 'Programs & Locations',
  "/programs-locations/mens-campus": "Men's Campus",
  "/programs-locations/womens-campus": "Women's Campus",
  '/programs-locations/womens-campus/gallery': 'Campus Gallery',
  "/womens-center-calendar": "Women's Center Calendar",
  '/meet-our-team': 'Meet the Team',
  '/teen-challenge-story': 'The Teen Challenge Story',
  '/events': 'Events',
  '/golf-tournament': 'Freedom Classic Golf Tournament',
  '/freedom-gala': 'Freedom Gala',
  '/news': 'News & Updates',
  '/media': 'Media Resources',
  '/financials': 'Financials',
  '/files': 'Files & Forms',
  '/connect': 'Connect AI Assistant',
  '/careers': 'Careers',
  '/workforce-development': 'Workforce Development',
  '/thrift-store': 'SuperThrift',
  '/get-involved/internship': 'Internship Program',
  '/testimonies': 'Stories of Hope',
  '/faq': 'FAQs',
  '/donate': 'Donate',
  '/donate-sponsor-student': 'Sponsor a Student',
  '/get-involved': 'Volunteer',
  '/thank-you': 'Thank You',
  '/contact': 'Contact',
  '/get-help-now': 'Apply for Program',
  '/freedom-from-addiction-starts-here': 'Help for Dependency & Abuse',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-use': 'Terms & Conditions',
  '/employee-portal': 'Employee Portal',
};

/** Detail pages: the section they belong to, and the wording used before the record loads. */
const DYNAMIC = [
  { pattern: /^\/news\/[^/]+$/, parent: '/news', fallback: 'News Article' },
  { pattern: /^\/testimonies\/[^/]+$/, parent: '/testimonies', fallback: 'Story' },
  { pattern: /^\/events\/event\/[^/]+$/, parent: '/events', fallback: 'Event' },
];

function normalize(pathname) {
  let path = pathname || '/';
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path;
}

function parentOf(path) {
  if (path in PARENTS) return PARENTS[path];
  const dynamic = DYNAMIC.find((entry) => entry.pattern.test(path));
  return dynamic ? dynamic.parent : null;
}

function labelFor(path) {
  if (LABELS[path]) return LABELS[path];
  const seo = pageSeo[path];
  if (seo?.title) return seo.title.split(' | ')[0];
  const dynamic = DYNAMIC.find((entry) => entry.pattern.test(path));
  return dynamic ? dynamic.fallback : null;
}

/**
 * The trail for a pathname, root first, ending on the page itself — or null
 * when the page should show no trail at all (homepage, landing pages, and any
 * URL we do not recognise, which is how the 404 page stays crumb-free).
 *
 * `currentLabel` is the page's own name once its record has loaded; it replaces
 * the generic final crumb ("News Article") so a blog post or event reads as
 * itself.
 */
export function getBreadcrumbTrail(pathname, currentLabel) {
  const path = normalize(pathname);
  if (!path || NO_TRAIL.has(path)) return null;

  const chain = [];
  const visited = new Set();

  let cursor = path;
  while (cursor && !visited.has(cursor)) {
    visited.add(cursor);
    const label = labelFor(cursor);
    // An unrecognised URL (a 404, say) gets no trail rather than a trail
    // inventing a crumb out of the path.
    if (!label) return null;
    chain.unshift({ path: cursor, label });
    cursor = parentOf(cursor);
  }

  if (!chain.length) return null;

  const own = currentLabel ? String(currentLabel).trim() : '';
  if (own) chain[chain.length - 1].label = own;

  return [HOME_CRUMB, ...chain];
}