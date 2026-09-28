import { describe, it, expect, beforeEach, vi } from 'vitest';

// analytics.js gates on hostname, so pretend to be production.
function mockProductionWindow() {
  vi.stubGlobal('window', {
    location: { hostname: 'mercyhouseatc.com', href: 'https://mercyhouseatc.com/donate' },
    dataLayer: [],
    sessionStorage: { getItem: () => null, setItem: () => {} },
  });
  vi.stubGlobal('document', { title: 'x', head: { appendChild: () => {} }, createElement: () => ({}) });
}

describe('conversion events', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_GTM_ID', 'GTM-TEST123');
    mockProductionWindow();
  });

  it('pushes a vehicle donation form submission', async () => {
    const { trackFormSubmit } = await import('../analytics.js');
    trackFormSubmit('vehicle_donation');
    expect(window.dataLayer.at(-1)).toMatchObject({ event: 'vehicle_donation_submit' });
  });

  it('pushes a volunteer form submission', async () => {
    const { trackFormSubmit } = await import('../analytics.js');
    trackFormSubmit('volunteer');
    expect(window.dataLayer.at(-1)).toMatchObject({ event: 'volunteer_submit' });
  });

  it('pushes a contact click with the method used', async () => {
    const { trackContactClick } = await import('../analytics.js');
    trackContactClick('phone');
    expect(window.dataLayer.at(-1)).toMatchObject({ event: 'contact_click', method: 'phone' });
  });

  it('fires donation_complete from the Stripe return parameter', async () => {
    const { trackCheckoutReturn } = await import('../analytics.js');
    trackCheckoutReturn('?donation=success');
    expect(window.dataLayer.at(-1)).toMatchObject({ event: 'donation_complete' });
  });

  it('fires sponsorship_complete from the Stripe return parameter', async () => {
    const { trackCheckoutReturn } = await import('../analytics.js');
    trackCheckoutReturn('?sponsorship=success');
    expect(window.dataLayer.at(-1)).toMatchObject({ event: 'sponsorship_complete' });
  });

  it('does not fire a conversion for a cancelled checkout', async () => {
    const { trackCheckoutReturn } = await import('../analytics.js');
    trackCheckoutReturn('?donation=cancelled');
    expect(window.dataLayer).toHaveLength(0);
  });

  it('pushes nothing at all when the container id is the unset placeholder', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_GTM_ID', 'GTM-XXXXXXX');
    mockProductionWindow();
    const { trackFormSubmit } = await import('../analytics.js');
    trackFormSubmit('volunteer');
    expect(window.dataLayer).toHaveLength(0);
  });

  it('pushes nothing on a non-production hostname', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_GTM_ID', 'GTM-TEST123');
    vi.stubGlobal('window', {
      location: { hostname: 'localhost', href: 'http://localhost:5173/' },
      dataLayer: [],
      sessionStorage: { getItem: () => null, setItem: () => {} },
    });
    const { trackFormSubmit } = await import('../analytics.js');
    trackFormSubmit('volunteer');
    expect(window.dataLayer).toHaveLength(0);
  });
});

// --- Review fix #7: the crisis lifeline must never enter an ad audience ---
import { readFileSync } from 'node:fs';

describe('crisis lifeline is not a conversion', () => {
  const contactSource = readFileSync('src/pages/Contact.jsx', 'utf8');

  it('does not fire a tracking event on the 988 Suicide & Crisis Lifeline link', () => {
    // Line-based, not a tag regex: an onClick arrow function contains ">",
    // so [^>]* stops at the "=>" and never reaches the handler. The first
    // version of this test used a tag regex and passed for exactly that
    // reason, while the handler was still attached.
    const lines = contactSource.split('\n').filter((l) => l.includes('href="tel:988"'));
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line, 'a crisis call must not be tracked or remarketed against').not.toContain('track');
    }
  });

  it('still tracks the ministry phone numbers', () => {
    expect(contactSource).toContain("trackContactClick('phone')");
    expect(contactSource).toContain("trackContactClick('email')");
  });
});
