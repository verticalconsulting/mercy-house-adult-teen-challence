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
// .org is the live domain pre-cutover; .com stays allowed for the DNS cutover to mercyhouseatc.com.
const ALLOWED_ORIGIN_HOSTS = ['mercyhouseatc.org', 'www.mercyhouseatc.org', 'mercyhouseatc.com', 'www.mercyhouseatc.com'];
const PRODUCTION_URL = 'https://mercyhouseatc.org';

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