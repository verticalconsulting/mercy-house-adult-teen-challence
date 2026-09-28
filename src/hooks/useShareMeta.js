import { useEffect } from 'react';

/**
 * Dynamically sets Open Graph + Twitter card meta tags so that when a post,
 * event or testimony URL is shared, its photo appears in the link preview on
 * social media and in text messages. Also updates the document title while
 * the record is open and restores the previous title on unmount.
 *
 * Base44 serves index.html as-is (no SSR), so tags are injected client-side.
 * Most modern social crawlers and iMessage execute JS and pick these up, and
 * the Hado prerender layer snapshots the result for those that do not.
 */

// Same origin as useDocumentMeta — override both together via VITE_SITE_URL.
const SITE_ORIGIN = import.meta.env.VITE_SITE_URL || 'https://mercyhouseatc.com';

function upsertMeta(key, value, attr = 'property') {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function upsertLink(rel, href) {
  if (!href) return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Work out the one URL that goes in canonical, og:url and twitter:url.
 *
 * `path` wins over `url`. Callers used to pass `window.location.href`, which
 * makes the canonical whatever the visitor happened to be looking at —
 * carrying utm/gclid parameters into the canonical, and pointing preview
 * deploys at their own hostname. A path plus the configured origin is the
 * only form that survives both.
 */
export function resolveShareUrl({ path, url } = {}) {
  if (path) return `${SITE_ORIGIN}${path}`;
  if (url) return url.split('?')[0].split('#')[0];
  return '';
}

/**
 * The tags a dynamic detail page should emit. Pure, so the indexability
 * decision can be asserted without a DOM — that decision is the difference
 * between a withdrawn testimony leaving the index and staying in it.
 */
export function buildShareTags({ title, description, image, path, url, noindex = false }) {
  const resolvedUrl = resolveShareUrl({ path, url });
  return {
    documentTitle: `${title} | Mercy House Adult Teen Challenge`,
    canonical: resolvedUrl,
    meta: {
      description,
      robots: noindex ? 'noindex, nofollow' : 'index, follow',
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': resolvedUrl,
      'og:type': 'article',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:url': resolvedUrl,
    },
  };
}

const PROPERTY_TAGS = new Set(['og:title', 'og:description', 'og:image', 'og:url', 'og:type']);

export function useShareMeta(options) {
  const { title, description, image, path, url, noindex = false } = options || {};
  const resolvedUrl = resolveShareUrl({ path, url });

  useEffect(() => {
    if (!title) return;
    const previousTitle = document.title;
    const tags = buildShareTags({ title, description, image, path, url, noindex });
    document.title = tags.documentTitle;

    for (const [key, value] of Object.entries(tags.meta)) {
      upsertMeta(key, value, PROPERTY_TAGS.has(key) ? 'property' : 'name');
    }
    if (tags.canonical) upsertLink('canonical', tags.canonical);

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, image, path, url, resolvedUrl, noindex]);
}
