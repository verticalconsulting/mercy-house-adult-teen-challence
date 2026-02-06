import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = {};

export default function ScrollRestoration() {
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    // Save scroll position before navigating away
    const saveScrollPosition = () => {
      scrollPositions[location.pathname] = window.scrollY;
    };

    // Restore scroll position when navigating back
    const restoreScrollPosition = () => {
      const savedPosition = scrollPositions[location.pathname];
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      } else {
        window.scrollTo(0, 0);
      }
    };

    // Small delay to ensure content is rendered
    const timeoutId = setTimeout(restoreScrollPosition, 50);

    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      saveScrollPosition();
      clearTimeout(timeoutId);
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location.pathname]);

  return null;
}