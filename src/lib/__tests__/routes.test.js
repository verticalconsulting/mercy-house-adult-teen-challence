import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createPageUrl } from '@/utils/index.ts';
import { CANONICAL_ROUTES, isCanonicalPath } from '../canonical-map.js';

const appSource = readFileSync('src/App.jsx', 'utf8');

describe('createPageUrl agrees with the canonical map', () => {
  it('maps FreedomGala to its canonical path', () => {
    expect(createPageUrl('FreedomGala')).toBe('/freedom-gala');
  });

  it('produces a canonical path for every page that has a path override', () => {
    const overrides = [
      'About', 'MeetTheTeam', 'Programs', 'MensCampus', 'WomensCampus',
      'WomensCampusGallery', 'ComprehensiveApproach', 'Testimonials',
      'RecurringDonation', 'SponsorStudent', 'VehicleDonation',
      'VehicleDonationForm', 'FreedomClassic', 'FreedomGala', 'MicroBusinesses',
      'Volunteer', 'Internship', 'MediaResources', 'IntakeForm', 'TermsConditions',
    ];
    const bad = overrides
      .map((name) => [name, createPageUrl(name)])
      .filter(([, path]) => !isCanonicalPath(path));
    expect(bad).toEqual([]);
  });

  it('never emits a PascalCase path — the duplicates the migration removed', () => {
    for (const name of ['MicroBusinesses', 'HelpForDependency', 'VehicleDonation']) {
      expect(createPageUrl(name)).toBe(createPageUrl(name).toLowerCase());
    }
  });
});

describe('App.jsx routing', () => {
  it('declares a route for /freedom-gala', () => {
    expect(appSource).toContain("createPageUrl('FreedomGala')");
  });

  it('declares the testimony detail route before the news catch-all', () => {
    expect(appSource.indexOf('/testimonies/:slug')).toBeGreaterThan(-1);
    expect(appSource.indexOf('/testimonies/:slug')).toBeLessThan(appSource.indexOf('/news/:slug'));
  });

  it('has no route left on the removed duplicate paths', () => {
    expect(appSource).not.toContain('/WorkforceDevelopment');
    expect(appSource).not.toContain('/DependancyHelp');
  });

  it('covers every static canonical path with a real route', () => {
    // Routes come from three places: the auto-generated Pages map (each key
    // run through createPageUrl), hand-declared createPageUrl('Name') routes,
    // and literal path="/..." routes. Build the actual served set rather than
    // grepping for path strings, which never appear literally for Pages entries.
    const pagesSource = readFileSync('src/pages.config.js', 'utf8');
    const pagesBlock = pagesSource.slice(pagesSource.indexOf('export const PAGES'));
    const pageKeys = [...pagesBlock.matchAll(/"([A-Za-z]+)":/g)].map((m) => m[1]);

    const handDeclared = [...appSource.matchAll(/createPageUrl\('([A-Za-z]+)'\)/g)].map((m) => m[1]);
    const literals = [...appSource.matchAll(/path="(\/[^":*]*)"/g)].map((m) => m[1]);

    const served = new Set([
      '/',
      ...pageKeys.map(createPageUrl),
      ...handDeclared.map(createPageUrl),
      ...literals,
    ]);

    // Detail pages are served by a param route, not a literal path.
    const dynamic = new Set([
      '/testimonies/van-pope', '/testimonies/kaye-byrd', '/testimonies/chris-gates',
      '/testimonies/josh-cook', '/testimonies/garrick-crouch', '/news/ministry-updates',
    ]);

    const missing = CANONICAL_ROUTES
      .map((r) => r.path)
      .filter((p) => !dynamic.has(p) && !served.has(p));
    expect(missing).toEqual([]);
  });
});
