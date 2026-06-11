import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Home, Users, Calendar, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
  const location = useLocation();
  const [showCampusMenu, setShowCampusMenu] = useState(false);

  const isActive = (path) => location.pathname === createPageUrl(path);

  const handleNavClick = (path, e) => {
    if (isActive(path)) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: 'Home', path: 'Home', icon: Home },
    { name: 'Campus', icon: Users, isMenu: true },
    { name: 'Events', path: 'Events', icon: Calendar }
  ];

  return (
    <>
      {/* Campus submenu overlay */}
      {showCampusMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowCampusMenu(false)}
        >
          <div 
            className="absolute bottom-20 left-0 right-0 bg-white dark:bg-slate-800 rounded-t-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-navy dark:text-gold">Select Campus</h3>
              <button onClick={() => setShowCampusMenu(false)}>
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="space-y-2">
              <Link
                to={createPageUrl('WomensCampus')}
                onClick={() => setShowCampusMenu(false)}
                className="block p-4 bg-navy/5 dark:bg-gold/10 rounded-lg text-lg font-medium text-navy dark:text-gold hover:bg-navy/10 dark:hover:bg-gold/20 transition-colors"
              >
                Women's Campus
              </Link>
              <Link
                to={createPageUrl('MensCampus')}
                onClick={() => setShowCampusMenu(false)}
                className="block p-4 bg-navy/5 dark:bg-gold/10 rounded-lg text-lg font-medium text-navy dark:text-gold hover:bg-navy/10 dark:hover:bg-gold/20 transition-colors"
              >
                Men's Campus
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50 shadow-lg"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-around items-center px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.path ? isActive(item.path) : (isActive('WomensCampus') || isActive('MensCampus'));

            if (item.isMenu) {
              return (
                <button
                  key={item.name}
                  onClick={() => setShowCampusMenu(true)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors",
                    active 
                      ? "text-navy dark:text-gold" 
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  <Icon className="w-7 h-7 mb-1" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                to={createPageUrl(item.path)}
                onClick={(e) => handleNavClick(item.path, e)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors",
                  active 
                    ? "text-navy dark:text-gold" 
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                <Icon className="w-7 h-7 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}