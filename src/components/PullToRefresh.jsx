import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullStartY = useRef(0);
  const isPulling = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        pullStartY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (isPulling.current && window.scrollY === 0) {
        const pullDistance = e.touches[0].clientY - pullStartY.current;
        if (pullDistance > 80) {
          isPulling.current = false;
          handleRefresh();
        }
      }
    };

    const handleTouchEnd = () => {
      isPulling.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <>
      {isRefreshing && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-navy dark:bg-gold text-white dark:text-navy px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Refreshing...</span>
        </div>
      )}
      {children}
    </>
  );
}