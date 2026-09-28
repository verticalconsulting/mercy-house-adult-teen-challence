import { INDEXABLE_PATHS } from './canonical-map.js';

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Build sitemap XML for `origin`.
 *
 * Derived from the canonical map rather than from the router, so a page can
 * never be advertised to Google without also having a title, a description
 * and a self-canonical. `lastmod` is deliberately omitted: a build-time
 * timestamp on every URL tells Google every page changed on every deploy,
 * which trains it to ignore the field.
 */
export function buildSitemap(origin, paths = INDEXABLE_PATHS) {
  const urls = paths
    .map((path) => {
      const loc = escapeXml(path === '/' ? `${origin}/` : `${origin}${path}`);
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
