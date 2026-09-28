/**
 * Google Tag Manager bootstrap + dataLayer helpers.
 *
 * GA4, Google Ads, and Meta are all configured *inside* the GTM container and
 * triggered off the events pushed from here, so adding or retuning a tag is a
 * GTM UI change and needs no deploy.
 *
 * Why a module instead of the canonical inline <head> snippet: this is a
 * client-rendered SPA served from a static index.html. Nothing is painted until
 * React boots, so there is no measurable event for an earlier-loading tag to
 * catch, and the snippet's <noscript> iframe fallback could never do anything
 * here. Bootstrapping from JS also avoids Vite's `%VITE_GTM_ID%` HTML
 * substitution, which bakes the literal placeholder into the markup whenever
 * the variable is unset.
 */

// GTM container IDs ship in client JS and are not secrets, so this is a plain
// default with an env override rather than a build-time injected value (Base44
// does not guarantee build-time Vite env vars).
const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-XXXXXXX';

// Gate on hostname rather than an env flag: this keeps localhost and the
// *.base44.app preview deploys out of production analytics without depending on
// per-environment configuration that could silently go missing.
const TRACKED_HOSTS = ['mercyhouseatc.com', 'www.mercyhouseatc.com'];

let initialized = false;

function shouldTrack() {
  if (typeof window === 'undefined') return false;
  // An unreplaced placeholder means the container was never configured; firing
  // against it would 404 on every page load.
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') return false;
  return TRACKED_HOSTS.includes(window.location.hostname);
}

function dataLayer() {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/** Inject the GTM container. Idempotent — safe to call on every route change. */
export function initAnalytics() {
  if (initialized || !shouldTrack()) return;
  initialized = true;

  dataLayer().push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(script);
}

/**
 * SPA pageview. GA4's built-in page_view only fires on initial document load,
 * so client-side route changes must be reported explicitly.
 */
export function trackPageView(path, title) {
  if (!shouldTrack()) return;
  dataLayer().push({
    event: 'spa_page_view',
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/** Generic event push, used for conversions and any future custom triggers. */
export function trackEvent(name, params = {}) {
  if (!shouldTrack()) return;
  dataLayer().push({ event: name, ...params });
}

/**
 * Stripe Checkout return params → conversion event names.
 *
 * Donations leave the site for Stripe and come back to these URLs (see
 * `success_url` in base44/functions/create*Checkout), so the return param is
 * the only client-side signal that a payment actually completed.
 */
const CONVERSIONS = {
  donation: { success: 'donation_complete' },
  sponsorship: { success: 'sponsorship_complete' },
  intake_payment: { success: 'intake_payment_complete' },
  intake_sponsored: { success: 'intake_sponsored_complete' },
};

/**
 * Fire conversion events for any Stripe success params on the current URL.
 *
 * Deduped via sessionStorage because reloading a thank-you page would otherwise
 * count a second donation and feed a phantom conversion to Ads' bidding model.
 * The params are deliberately left in the URL: Donate.jsx and
 * SponsorStudent.jsx read them to render their thank-you state, and this runs
 * first (NavigationTracker mounts above the routes), so stripping them here
 * would break that UI. Tradeoff: a second *real* donation of the same type in
 * one browser session is not counted twice — far rarer than a page refresh.
 */
export function trackCheckoutReturn(search) {
  if (!shouldTrack()) return;

  const params = new URLSearchParams(search);
  for (const [param, outcomes] of Object.entries(CONVERSIONS)) {
    const eventName = outcomes[params.get(param)];
    if (!eventName) continue;

    const key = `mh_conv:${param}`;
    try {
      if (window.sessionStorage.getItem(key)) continue;
      window.sessionStorage.setItem(key, '1');
    } catch {
      // Private browsing / storage disabled — fire anyway rather than lose the
      // conversion; an occasional duplicate beats systematic undercounting.
    }

    trackEvent(eventName, { checkout_type: param });
  }
}
