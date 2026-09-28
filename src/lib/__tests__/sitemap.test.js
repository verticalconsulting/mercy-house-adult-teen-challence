import { describe, it, expect } from 'vitest';
import { buildSitemap } from '../sitemap.js';
import { CANONICAL_ROUTES, INDEXABLE_PATHS } from '../canonical-map.js';

const ORIGIN = 'https://mercyhouseatc.com';
const xml = buildSitemap(ORIGIN);

describe('buildSitemap', () => {
  it('emits one <loc> per indexable path', () => {
    expect(xml.match(/<loc>/g)).toHaveLength(INDEXABLE_PATHS.length);
  });

  it('emits absolute apex-domain URLs', () => {
    for (const path of INDEXABLE_PATHS) {
      const expected = path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`;
      expect(xml).toContain(`<loc>${expected}</loc>`);
    }
  });

  it('never includes a noindex path', () => {
    for (const { path, noindex } of CANONICAL_ROUTES) {
      if (noindex) expect(xml).not.toContain(`<loc>${ORIGIN}${path}</loc>`);
    }
  });

  it('never references the legacy .org domain', () => {
    expect(xml).not.toContain('mercyhouseatc.org');
  });

  it('never references the www subdomain', () => {
    expect(xml).not.toContain('www.mercyhouseatc.com');
  });

  it('is well-formed XML with the sitemap namespace', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('escapes ampersands so the XML stays parseable', () => {
    expect(buildSitemap(ORIGIN, ['/a&b'])).toContain('<loc>https://mercyhouseatc.com/a&amp;b</loc>');
  });
});

// --- Review fix #2: data-backed URLs must not be advertised before records exist ---
describe('pendingContent routes', () => {
  it('keeps every data-backed route out of the sitemap until its record exists', () => {
    const pending = CANONICAL_ROUTES.filter((r) => r.pendingContent).map((r) => r.path);
    expect(pending).toEqual(
      expect.arrayContaining([
        '/testimonies/van-pope',
        '/testimonies/kaye-byrd',
        '/testimonies/chris-gates',
        '/testimonies/josh-cook',
        '/testimonies/garrick-crouch',
        '/news/ministry-updates',
      ])
    );
    for (const path of pending) {
      expect(xml, `${path} must not be advertised`).not.toContain(`<loc>${ORIGIN}${path}</loc>`);
    }
  });

  it('still keeps them in the canonical map so they get titles and self-canonicals', () => {
    const paths = CANONICAL_ROUTES.map((r) => r.path);
    expect(paths).toContain('/testimonies/van-pope');
    expect(paths).toContain('/news/ministry-updates');
  });
});

// --- Review fix #5: /files is a routed public page and needs its own entry ---
describe('/files', () => {
  it('is in the canonical map', () => {
    expect(CANONICAL_ROUTES.map((r) => r.path)).toContain('/files');
  });

  it('is noindex, so it stays out of the sitemap', () => {
    expect(CANONICAL_ROUTES.find((r) => r.path === '/files')?.noindex).toBe(true);
    expect(xml).not.toContain(`<loc>${ORIGIN}/files</loc>`);
  });
});
