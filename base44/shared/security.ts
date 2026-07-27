/**
 * Shared security helpers for backend functions.
 */

/**
 * Strip CR/LF sequences from a value before placing it into an email MIME
 * header (Subject, To, etc.) to prevent CRLF / header injection (CWE-93).
 */
export function sanitizeHeader(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Resolve a safe base app URL for Stripe Checkout success/cancel redirects.
 * The request `Origin` header is attacker-controllable, so it must be validated
 * against an allowlist of trusted hosts before use; otherwise we fall back to
 * the production domain. Prevents open-redirect / post-payment phishing
 * (CWE-601).
 */
const ALLOWED_ORIGIN_HOSTS = ['mercyhouseatc.com', 'www.mercyhouseatc.com'];
const PRODUCTION_URL = 'https://mercyhouseatc.com';

export function getSafeAppUrl(req) {
  const origin = (req.headers.get('origin') || '').trim();
  if (origin) {
    try {
      const host = new URL(origin).hostname;
      if (ALLOWED_ORIGIN_HOSTS.includes(host) || host.endsWith('.base44.app')) {
        return origin;
      }
    } catch {
      // invalid origin — fall through to the production default
    }
  }
  return PRODUCTION_URL;
}