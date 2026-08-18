/**
 * Singleton loader for the Virtuous Giving embed.
 *
 * The embed script (virtuous.embed.min.js) bootstraps exactly once — its top
 * level is guarded by `VirtuousForms.IsLoaded`. As the last step of that
 * bootstrap it loads the forms library (virtuous.forms-*.min.js), and on that
 * script's load it scans the DOM once for every `<script data-vform>` tag and
 * renders a form into each.
 *
 * Two problems arise from that design on a client-routed SPA:
 *  1. The scan only runs once. Navigating to a page whose forms mount after
 *     the scan already ran leaves them unrendered.
 *  2. Loading the embed script once per form (the naive approach) is wasteful
 *     and can race when multiple forms mount together.
 *
 * So we load the embed script exactly once here, wait for the forms library
 * global `virtuousForm` to become available, and hand it back so each form
 * instance can render itself directly — bypassing the one-shot scan entirely.
 */

const VIRTUOUS_EMBED_SRC = 'https://cdn.virtuoussoftware.com/virtuous.embed.min.js';
const DEFAULT_API_URL = 'https://forms.virtuoussoftware.com/api';

let embedPromise = null;

export function loadVirtuousEmbed() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.VirtuousForms && window.VirtuousForms.IsLoaded) return Promise.resolve();
  if (embedPromise) return embedPromise;

  embedPromise = new Promise((resolve) => {
    const finish = () => resolve();
    const existing = document.querySelector(`script[src="${VIRTUOUS_EMBED_SRC}"]`);
    if (existing) {
      if (window.VirtuousForms && window.VirtuousForms.IsLoaded) return finish();
      existing.addEventListener('load', finish);
      return;
    }
    const s = document.createElement('script');
    s.src = VIRTUOUS_EMBED_SRC;
    s.async = true;
    s.addEventListener('load', finish);
    document.head.appendChild(s);
  });
  return embedPromise;
}

/**
 * Resolves once the forms library global `virtuousForm` is available. The
 * embed script loads that library asynchronously as the final step of its
 * bootstrap, so we poll for it.
 */
export function whenVirtuousFormsReady(timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    if (typeof window.virtuousForm === 'function') return resolve();
    const start = Date.now();
    const tick = () => {
      if (typeof window.virtuousForm === 'function') return resolve();
      if (Date.now() - start > timeoutMs) {
        return reject(new Error('Virtuous forms library did not become ready'));
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export async function ensureVirtuousReady() {
  await loadVirtuousEmbed();
  await whenVirtuousFormsReady();
  return {
    virtuousForm: window.virtuousForm,
    apiUrl:
      (window.VirtuousForms && window.VirtuousForms.VirtuousFormsApiUrl) || DEFAULT_API_URL,
  };
}