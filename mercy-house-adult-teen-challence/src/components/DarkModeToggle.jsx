import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Light/Dark theme switch.
 *
 * The site defaults to LIGHT. The initial class is set by the inline script in
 * index.html (before React mounts) to avoid a flash of the wrong theme; this
 * component reads/writes the same `theme` localStorage key and keeps every
 * mounted instance (desktop + mobile header) in sync via a custom event.
 */
const THEME_KEY = 'theme';

const isDarkNow = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('dark');

const applyTheme = (dark) => {
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  } catch {
    /* storage unavailable (private mode) — class change still applies */
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
};

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(isDarkNow);

  useEffect(() => {
    const sync = () => setIsDark(isDarkNow());
    sync();
    window.addEventListener('themechange', sync);
    window.addEventListener('storage', sync); // sync across tabs
    return () => {
      window.removeEventListener('themechange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback(() => applyTheme(!isDarkNow()), []);

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      className="relative inline-flex items-center justify-center w-11 h-11 rounded-full text-slate-700 dark:text-slate-200 hover:text-navy dark:hover:text-gold hover:bg-navy/5 dark:hover:bg-gold/10 transition-colors"
    >
      <Sun
        className={`w-6 h-6 transition-all duration-300 ${
          isDark
            ? 'absolute opacity-0 scale-50 -rotate-90'
            : 'opacity-100 scale-100 rotate-0'
        }`}
      />
      <Moon
        className={`w-6 h-6 transition-all duration-300 ${
          isDark
            ? 'opacity-100 scale-100 rotate-0'
            : 'absolute opacity-0 scale-50 rotate-90'
        }`}
      />
    </button>
  );
}
