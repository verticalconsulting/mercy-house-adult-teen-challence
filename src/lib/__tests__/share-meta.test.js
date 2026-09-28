import { describe, it, expect } from 'vitest';
import { resolveShareUrl } from '@/hooks/useShareMeta';

const ORIGIN = 'https://mercyhouseatc.com';

describe('resolveShareUrl', () => {
  it('builds an absolute apex URL from a path', () => {
    expect(resolveShareUrl({ path: '/news/ministry-updates' })).toBe(
      `${ORIGIN}/news/ministry-updates`
    );
  });

  it('prefers path over a supplied url, so a tracked browser URL cannot become the canonical', () => {
    expect(
      resolveShareUrl({
        path: '/news/ministry-updates',
        url: 'https://preview.base44.app/news/ministry-updates?utm_source=facebook',
      })
    ).toBe(`${ORIGIN}/news/ministry-updates`);
  });

  it('strips a query string from a fallback url', () => {
    expect(resolveShareUrl({ url: `${ORIGIN}/news/x?utm_source=fb&gclid=1` })).toBe(
      `${ORIGIN}/news/x`
    );
  });

  it('returns empty string when given neither', () => {
    expect(resolveShareUrl({})).toBe('');
  });
});

// --- Review fix #1/#8: noindex must survive into the emitted tags ---
import { buildShareTags } from '@/hooks/useShareMeta';

describe('buildShareTags', () => {
  it('emits index, follow for a normal record', () => {
    const tags = buildShareTags({ title: 'A Post', path: '/news/a' });
    expect(tags.meta.robots).toBe('index, follow');
  });

  it('honours noindex instead of forcing the page indexable', () => {
    const tags = buildShareTags({ title: 'Story Not Found', path: '/testimonies/x', noindex: true });
    expect(tags.meta.robots).toBe('noindex, nofollow');
  });

  it('points canonical, og:url and twitter:url at the same absolute URL', () => {
    const tags = buildShareTags({ title: 'A Post', path: '/news/a' });
    const url = 'https://mercyhouseatc.com/news/a';
    expect(tags.canonical).toBe(url);
    expect(tags.meta['og:url']).toBe(url);
    expect(tags.meta['twitter:url']).toBe(url);
  });
});
