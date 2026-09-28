import { CANONICAL_ROUTES } from './canonical-map.js';

/**
 * Derive a URL slug from a graduate's name.
 *
 * Kept as a pure function so the Employee Portal can pre-fill the slug field
 * and the sitemap can be checked against it, without either duplicating the
 * rules.
 */
export function testimonySlug(graduateName) {
  return String(graduateName)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

/** The graduate stories that have a canonical URL of their own. */
export const TESTIMONY_SLUGS = CANONICAL_ROUTES
  .map((r) => r.path)
  .filter((p) => p.startsWith('/testimonies/'))
  .map((p) => p.replace('/testimonies/', ''));
