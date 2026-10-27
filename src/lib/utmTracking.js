const STORAGE_KEY = 'mh-donation-attribution';
const PARAM_KEYS = ['gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign'];

/**
 * Ad attribution for a donation request.
 *
 * Read from the landing URL first, then remembered for the session — a donor
 * who reads the page and submits later is still credited to the click that
 * brought them. Returns {} when there is nothing to record or storage is
 * unavailable (private mode, blocked cookies).
 */
export function getUtmParams() {
  const fromUrl = {};

  try {
    const params = new URLSearchParams(window.location.search);
    PARAM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) fromUrl[key] = value;
    });

    if (Object.keys(fromUrl).length) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return fromUrl;
  }
}