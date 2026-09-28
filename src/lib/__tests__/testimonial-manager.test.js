import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * The consent gate is only real if a staff member can actually set it.
 *
 * TestimonyPage filters on `consent_confirmed`, so a story with no way to
 * tick that box in the portal is a page that can never go live — and, worse,
 * a consent record that can never be *revoked* through the UI either.
 */
const managerSource = readFileSync('src/components/employee/TestimonialManager.jsx', 'utf8');
const entity = JSON.parse(
  readFileSync('base44/entities/Testimonial.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, '')
);

// Written by the Facebook share workflow, never by a human.
const SYSTEM_MANAGED = ['shared_to_facebook', 'facebook_post_id'];

describe('TestimonialManager covers the entity', () => {
  it('has an input for every staff-editable field on the Testimonial entity', () => {
    const editable = Object.keys(entity.properties).filter((k) => !SYSTEM_MANAGED.includes(k));
    const missing = editable.filter((field) => !managerSource.includes(field));
    expect(missing).toEqual([]);
  });

  it('lets staff record consent', () => {
    expect(managerSource).toContain('consent_confirmed');
    expect(managerSource).toContain('consent_date');
  });

  it('lets staff set the slug that gives a story its own URL', () => {
    expect(managerSource).toContain('slug');
  });
});
