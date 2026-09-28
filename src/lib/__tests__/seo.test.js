import { describe, it, expect } from 'vitest';
import { CANONICAL_ROUTES, INDEXABLE_PATHS, isCanonicalPath } from '../canonical-map.js';
import { pageSeo } from '../seo.js';

// Staff dashboards and the /home alias are deliberately absent from the
// canonical map but still need titles, so pageSeo may carry them.
const INTERNAL_ONLY = ['/home', '/employee-portal', '/donation-funnel', '/search-performance'];

describe('canonical map', () => {
  it('has no duplicate paths', () => {
    const paths = CANONICAL_ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('uses lowercase-hyphen paths with a leading and no trailing slash', () => {
    for (const { path } of CANONICAL_ROUTES) {
      if (path === '/') continue;
      expect(path, path).toMatch(/^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/);
    }
  });

  it('routes every legacy path to a real canonical path', () => {
    for (const { legacy = [] } of CANONICAL_ROUTES) {
      for (const from of legacy) expect(from.startsWith('/'), from).toBe(true);
    }
  });

  it('marks the two public form pages noindex', () => {
    const noindexed = CANONICAL_ROUTES.filter((r) => r.noindex).map((r) => r.path);
    expect(noindexed).toContain('/get-help-now');
    expect(noindexed).toContain('/vehicle-donation-program/form');
  });

  it('excludes noindex paths from INDEXABLE_PATHS', () => {
    expect(INDEXABLE_PATHS).not.toContain('/get-help-now');
    expect(INDEXABLE_PATHS).not.toContain('/vehicle-donation-program/form');
  });

  it('recognises a mapped path and rejects an unmapped one', () => {
    expect(isCanonicalPath('/donate')).toBe(true);
    expect(isCanonicalPath('/NotARoute')).toBe(false);
  });
});

describe('pageSeo agrees with the canonical map', () => {
  it('has an entry for every canonical route', () => {
    const missing = CANONICAL_ROUTES.map((r) => r.path).filter((p) => !pageSeo[p]);
    expect(missing).toEqual([]);
  });

  it('has no entry that is neither a canonical route nor a known internal page', () => {
    const extra = Object.keys(pageSeo).filter(
      (p) => !isCanonicalPath(p) && !INTERNAL_ONLY.includes(p)
    );
    expect(extra).toEqual([]);
  });

  // Uniqueness is scoped to indexable entries on purpose. Duplicate titles
  // only cost you among pages Google actually indexes, and /home is a
  // deliberate noindexed alias that canonicalises to / — it is *supposed* to
  // carry the homepage's text.
  const indexableEntries = Object.values(pageSeo).filter((s) => !s.noindex);

  it('gives every indexable route a unique title', () => {
    const titles = indexableEntries.map((s) => s.title);
    expect(titles.filter((t, i) => titles.indexOf(t) !== i)).toEqual([]);
  });

  it('gives every indexable route a unique description', () => {
    const descs = indexableEntries.map((s) => s.description);
    expect(descs.filter((d, i) => descs.indexOf(d) !== i)).toEqual([]);
  });

  it('keeps titles within the SERP display budget', () => {
    for (const [p, seo] of Object.entries(pageSeo)) {
      expect(seo.title.length, `${p} title`).toBeGreaterThanOrEqual(25);
      expect(seo.title.length, `${p} title`).toBeLessThanOrEqual(70);
    }
  });

  it('keeps descriptions within the SERP display budget', () => {
    for (const [p, seo] of Object.entries(pageSeo)) {
      expect(seo.description.length, `${p} description`).toBeGreaterThanOrEqual(70);
      expect(seo.description.length, `${p} description`).toBeLessThanOrEqual(170);
    }
  });

  it('self-canonicalises every indexable route', () => {
    for (const p of INDEXABLE_PATHS) {
      expect(pageSeo[p].path, `${p} must self-canonicalise`).toBe(p);
    }
  });

  it('propagates the noindex flag from the map into pageSeo', () => {
    for (const { path, noindex } of CANONICAL_ROUTES) {
      if (noindex) expect(pageSeo[path].noindex, path).toBe(true);
    }
  });
});
