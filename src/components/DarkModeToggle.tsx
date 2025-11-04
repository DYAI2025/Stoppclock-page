import React, { useCallback, useEffect, useState } from 'react';

const DarkModeToggle: React.FC = () => {
  // Initialize state from localStorage, defaulting to dark mode
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('sc.theme-mode');
    return saved ? saved === 'dark' : true;
  });

  // Apply theme function
  const applyTheme = useCallback((dark: boolean) => {
    const html = document.documentElement;
    const homePage = document.querySelector('.home-page');

    // Set the dataset attribute for CSS selectors
    html.dataset.theme = dark ? 'dark' : 'light';

    // Apply background to home-page element
    if (homePage) {
      if (dark) {
        homePage.style.background = 'linear-gradient(180deg, #1a2332 0%, #0f1419 100%)';
      } else {
        homePage.style.background = 'linear-gradient(180deg, #f8f9fa 0%, #f0f1f5 100%)';
      }
    }

    // Save preference to localStorage
    localStorage.setItem('sc.theme-mode', dark ? 'dark' : 'light');
  }, []);

  // Apply theme whenever isDark changes
  useEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  // Toggle theme
  const toggle = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="dark-mode-toggle"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        // Sun icon for light mode
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
