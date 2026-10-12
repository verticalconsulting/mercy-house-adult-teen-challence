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

  // Blog posts are created in the employee portal, so their URLs cannot be
  // listed in pageSeo. They must still resolve as a real page rather than as
  // an unknown path — the fallback noindex would tell Google to drop the post.
  it('resolves a portal-created blog post without the unknown-path noindex', () => {
    const seo = resolveSeo('/news/mercy-house-graduation');
    expect(seo.path).toBe('/news/mercy-house-graduation');
    expect(seo.title).toBeTruthy();
    expect(seo.description).toBeTruthy();
    expect(seo.noindex).toBeFalsy();
  });

  it('does not stretch that to deeper or unrelated paths', () => {
    expect(resolveSeo('/news/a/b').noindex).toBe(true);
    expect(resolveSeo('/some-unmapped-page').noindex).toBe(true);
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