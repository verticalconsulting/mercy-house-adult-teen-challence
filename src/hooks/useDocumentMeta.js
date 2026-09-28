import { useEffect } from 'react';

/**
 * Per-route document metadata for SEO.
 *
 * Base44 serves index.html as-is (no SSR), so these tags are injected/updated
 * client-side. Modern crawlers (Google, Bing) execute JS and pick them up, and
 * the Hado prerender layer snapshots the result for crawlers that do not.
 * The index.html defaults act as the initial-paint fallback before this runs.
 */
// Set VITE_SITE_URL to override the canonical origin without a code change
// (defaults to the live .com domain when unset).
const SITE_ORIGIN = import.meta.env.VITE_SITE_URL || 'https://mercyhouseatc.com';

// Fallback social card. Absolute URL: a relative og:image is ignored by most
// scrapers, and the value is read off-site where a relative path is meaningless.
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/images/family-hero.webp`;

export function upsertMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function upsertCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function useDocumentMeta({ title, description, path, noindex = false, ogImage }) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:site_name', 'Mercy House Adult & Teen Challenge', 'property');

    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);

    const image = ogImage || DEFAULT_OG_IMAGE;
    upsertMeta('og:image', image, 'property');
    upsertMeta('twitter:image', image);

    if (path) {
      // One URL, five places. Keeping them in a single assignment is what
      // stops canonical / og:url / twitter:url drifting apart at cutover.
      const url = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
      upsertCanonical(url);
      upsertMeta('og:url', url, 'property');
      upsertMeta('twitter:url', url);
    }
  }, [title, description, path, noindex, ogImage]);
}
