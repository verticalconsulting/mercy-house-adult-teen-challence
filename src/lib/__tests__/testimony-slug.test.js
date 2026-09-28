import { describe, it, expect } from 'vitest';
import { testimonySlug, TESTIMONY_SLUGS } from '../testimony.js';
import { CANONICAL_ROUTES } from '../canonical-map.js';

describe('testimonySlug', () => {
  it('lowercases and hyphenates a graduate name', () => {
    expect(testimonySlug('Van Pope')).toBe('van-pope');
    expect(testimonySlug('Garrick Crouch')).toBe('garrick-crouch');
  });

  it('strips punctuation and collapses whitespace', () => {
    expect(testimonySlug("Mary-Jo  O'Brien")).toBe('mary-jo-obrien');
  });

  it('handles a name already in slug form', () => {
    expect(testimonySlug('kaye-byrd')).toBe('kaye-byrd');
  });
});

describe('TESTIMONY_SLUGS', () => {
  it('matches the testimony paths in the canonical map exactly', () => {
    const fromMap = CANONICAL_ROUTES
      .map((r) => r.path)
      .filter((p) => p.startsWith('/testimonies/'))
      .map((p) => p.replace('/testimonies/', ''))
      .sort();
    expect([...TESTIMONY_SLUGS].sort()).toEqual(fromMap);
  });

  it('covers all five named graduates', () => {
    expect([...TESTIMONY_SLUGS].sort()).toEqual([
      'chris-gates',
      'garrick-crouch',
      'josh-cook',
      'kaye-byrd',
      'van-pope',
    ]);
  });
});
