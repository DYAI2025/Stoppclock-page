import React from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Theme toggle button component
 * Implements FR-061: Theme toggle functionality
 */
export function ThemeToggle() {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {effectiveTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
