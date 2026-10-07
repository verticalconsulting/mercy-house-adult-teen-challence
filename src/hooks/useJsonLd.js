import { useEffect } from 'react';

/**
 * Injects a JSON-LD structured data script into <head>.
 *
 * `id` must be unique per page so navigating between routes replaces the
 * previous schema rather than stacking duplicates. Pass `data` as a plain
 * object (the hook stringifies it) or `null` to remove the script.
 */
export function useJsonLd(id, data) {
  useEffect(() => {
    if (!data) {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      return;
    }

    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      // Leave the script in place on unmount so prerender snapshots keep it;
      // the next route's useJsonLd call will replace or remove it.
    };
  }, [id, data]);
}