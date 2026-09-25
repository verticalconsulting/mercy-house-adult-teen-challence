import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Keeps <link rel="canonical"> in sync with the current route so every page
// self-references its own URL instead of the static homepage value baked
// into index.html. Uses window.location.origin so it tracks whichever
// domain is actually serving the app, with no code change needed at
// domain cutover.
export default function useCanonicalUrl() {
  const location = useLocation();

  useEffect(() => {
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) return;
    canonicalTag.setAttribute('href', `${window.location.origin}${location.pathname}`);
  }, [location.pathname]);
}
