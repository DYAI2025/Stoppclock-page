import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

const THEME_KEY = 'sc.v1.theme';

/**
 * Custom hook for dark/light mode management
 * Implements FR-061 to FR-064: Theme management with system preference detection
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return (stored as Theme) || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });

  // Apply theme to document
  useEffect(() => {
    let currentEffectiveTheme = theme;

    if (theme === 'auto') {
      currentEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setEffectiveTheme(currentEffectiveTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', currentEffectiveTheme);
  }, [theme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange(event: MediaQueryListEvent) {
      const newTheme = event.matches ? 'dark' : 'light';
      setEffectiveTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (err) {
      console.error('Failed to save theme preference:', err);
    }
  };

  const toggleTheme = () => {
    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return { theme, effectiveTheme, setTheme, toggleTheme };
}
