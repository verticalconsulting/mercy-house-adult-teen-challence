import { describe, it, expect } from 'vitest';
import { resolveSeo, pageSeo } from '../seo.js';

describe('resolveSeo', () => {
  it('returns the exact entry for a mapped path', () => {
    expect(resolveSeo('/donate').title).toBe(pageSeo['/donate'].title);
  });

  it('ignores a trailing slash', () => {
    expect(resolveSeo('/donate/').title).toBe(pageSeo['/donate'].title);
  });

  it('keeps the root path mapped', () => {
    expect(resolveSeo('/').title).toBe(pageSeo['/'].title);
  });

  it('returns a usable fallback rather than null for an unmapped path', () => {
    const seo = resolveSeo('/some-unmapped-page');
    expect(seo.title).toBeTruthy();
    expect(seo.description).toBeTruthy();
    expect(seo.noindex).toBe(true);
  });

  it('self-canonicalises an unmapped path to itself, not to the previous route', () => {
    expect(resolveSeo('/some-unmapped-page').path).toBe('/some-unmapped-page');
  });

  it('resolves a testimony detail page', () => {
    expect(resolveSeo('/testimonies/van-pope').title).toContain('Van Pope');
  });
});

describe('/news/ministry-updates', () => {
  it('has its own canonical entry, distinct from /news', () => {
    const post = resolveSeo('/news/ministry-updates');
    const index = resolveSeo('/news');
    expect(post.path).toBe('/news/ministry-updates');
    expect(post.title).not.toBe(index.title);
    expect(post.description).not.toBe(index.description);
  });
});
