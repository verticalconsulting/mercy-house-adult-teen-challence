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
