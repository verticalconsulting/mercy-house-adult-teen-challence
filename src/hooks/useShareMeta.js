import { useEffect } from 'react';

/**
 * Dynamically sets Open Graph + Twitter card meta tags so that when a blog
 * post URL is shared, the post's photo appears in the link preview on social
 * media and in text messages. Also updates the document title while the post
 * is open and restores the previous title on unmount.
 *
 * Base44 serves index.html as-is (no SSR), so tags are injected client-side.
 * Most modern social crawlers and iMessage execute JS and pick these up.
 */
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

export function useShareMeta({ title, description, image, url }) {
  useEffect(() => {
    if (!title) return;
    const previousTitle = document.title;
    document.title = `${title} | Mercy House Adult Teen Challenge`;

    upsertMeta('og:title', title);
    upsertMeta('og:description', description);
    upsertMeta('og:image', image);
    upsertMeta('og:url', url);
    upsertMeta('og:type', 'article');
    upsertMeta('twitter:card', 'summary_large_image', 'name');
    upsertMeta('twitter:title', title, 'name');
    upsertMeta('twitter:description', description, 'name');
    upsertMeta('twitter:image', image, 'name');

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, image, url]);
}