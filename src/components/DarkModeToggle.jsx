import { useEffect } from 'react';

export default function DarkModeToggle() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }, []);

  return null;
}