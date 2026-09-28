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
 * Verify that a backend-function request was invoked by the platform's
 * automation engine (workflow / entity / connector trigger), not by an
 * anonymous external caller hitting the public function URL directly.
 *
 * Workflows pass `automation_secret` in their `invoke_backend_function` args;
 * this checks it against the AUTOMATION_SECRET env var. Without it, anyone
 * who discovers the function URL could trigger privileged service-role
 * actions (Facebook posts, SMS/email blasts, Drive uploads) on demand
 * (CWE-306).
 *
 * Returns true only when the secret is configured AND matches.
 */
export function verifyAutomationSecret(body) {
  const expected = Deno.env.get('AUTOMATION_SECRET');
  if (!expected) {
    return false;
  }
  return typeof body?.automation_secret === 'string' && body.automation_secret === expected;
}

/**
 * Resolve a safe base app URL for Stripe Checkout success/cancel redirects.
 * The request `Origin` header is attacker-controllable, so it must be validated
 * against an allowlist of trusted hosts before use; otherwise we fall back to
 * the production domain. Prevents open-redirect / post-payment phishing
 * (CWE-601).
 */
// mercyhouseatc.com is the live domain. The legacy .org 301-redirects here, so a
// browser never presents a .org Origin; keeping it allowlisted would only widen
// the redirect surface. Crucially, PRODUCTION_URL must stay on .com: Stripe
// returns to `${appUrl}/?donation=success`, and bouncing that through a
// cross-domain 301 can drop the query string (losing the conversion signal) and
// makes GA4 attribute the session to a self-referral.
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