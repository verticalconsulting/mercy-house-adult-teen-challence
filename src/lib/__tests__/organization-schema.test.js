import { describe, it, expect } from 'vitest';
import { buildOrganizationSchema } from '@/hooks/useOrganizationSchema';

const ORIGIN = 'https://mercyhouseatc.com';
const schema = buildOrganizationSchema(ORIGIN);

describe('organization schema', () => {
  it('is a NonprofitOrganization', () => {
    expect(schema['@type']).toBe('NonprofitOrganization');
  });

  it('anchors url and @id to the apex .com origin', () => {
    expect(schema.url).toBe(ORIGIN);
    expect(schema['@id']).toBe(`${ORIGIN}/#organization`);
  });

  it('carries the Georgetown, MS postal address', () => {
    expect(schema.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: '1110 Mary St',
      addressLocality: 'Georgetown',
      addressRegion: 'MS',
      postalCode: '39078',
      addressCountry: 'US',
    });
  });

  it('carries the public phone number in E.164-ish form', () => {
    expect(schema.telephone).toBe('+1-601-720-3718');
  });

  it('lists Facebook, Instagram, YouTube and the Google Business Profile in sameAs', () => {
    const joined = schema.sameAs.join(' ');
    expect(joined).toMatch(/facebook\.com/);
    expect(joined).toMatch(/instagram\.com/);
    expect(joined).toMatch(/youtube\.com/);
    expect(joined).toMatch(/share\.google|google\.com\/maps/);
  });

  it('serves a first-party logo, not a storage-bucket or base44 URL', () => {
    expect(schema.logo).not.toMatch(/base44\.com/);
    expect(schema.logo).not.toMatch(/supabase\.co|storage\.googleapis\.com|blob\.core\.windows\.net/);
  });

  it('never references a legacy domain', () => {
    const json = JSON.stringify(schema);
    expect(json).not.toContain('mercyhouseatc.org');
    expect(json).not.toContain('mercyhouseworks.org');
  });

  it('keeps both campuses as departments with their own profiles', () => {
    expect(schema.department).toHaveLength(2);
    for (const dept of schema.department) {
      expect(dept.url.startsWith(ORIGIN)).toBe(true);
      expect(dept.sameAs.length).toBeGreaterThan(0);
    }
  });
});
