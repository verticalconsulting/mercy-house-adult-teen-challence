import { useEffect } from 'react';

/**
 * Per-route document metadata for SEO.
 *
 * Base44 serves index.html as-is (no SSR), so these tags are injected/updated
 * client-side. Modern crawlers (Google, Bing) execute JS and pick them up.
 * The index.html defaults act as the initial-paint fallback before this runs.
 */
// TODO: flip to https://mercyhouseatc.com at DNS cutover (still on .org as of writing)
const SITE_ORIGIN = 'https://mercyhouseatc.org';

function upsertMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function useDocumentMeta({ title, description, path, noindex = false }) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', 'website', 'property');
    if (path) {
      const url = `${SITE_ORIGIN}${path}`;
      upsertCanonical(url);
      upsertMeta('og:url', url, 'property');
    }
  }, [title, description, path, noindex]);
}