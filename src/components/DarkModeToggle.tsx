import React, { useEffect, useState } from 'react';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sc.theme-mode');
    const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved ? saved === 'dark' : prefersDark;

    setIsDark(shouldBeDark);
    // Apply theme synchronously before render
    setTimeout(() => applyTheme(shouldBeDark), 0);
  }, []);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    const homePage = document.querySelector('.home-page');

    // Always set the dataset
    html.dataset.theme = dark ? 'dark' : 'light';

    // Apply background to home-page element
    if (homePage) {
      if (dark) {
        homePage.style.background = 'linear-gradient(180deg, #1a2332 0%, #0f1419 100%)';
      } else {
        homePage.style.background = 'linear-gradient(180deg, #f8f9fa 0%, #f0f1f5 100%)';
      }
    }

    // Save preference
    localStorage.setItem('sc.theme-mode', dark ? 'dark' : 'light');
  };

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
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
