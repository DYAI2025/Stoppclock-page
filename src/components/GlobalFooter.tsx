import { useEffect, useState } from 'react';

/**
 * GlobalFooter — rendered in App() for ALL routes except landing page.
 * LandingPage has its own footer with keyboard shortcuts hint.
 */
export function GlobalFooter() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash || '#/';
    return hash.replace(/^#/, '') || '/';
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash || '#/';
      setRoute(hash.replace(/^#/, '') || '/');
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // LandingPage has its own footer
  if (route === '/') return null;

  return (
    <footer className="global-footer">
      <nav className="global-footer-nav" aria-label="Footer Navigation">
        <a href="#/">Home</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/blog">Blog</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/timers">Timer Worlds</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/about">About</a>
      </nav>
      <nav className="global-footer-legal" aria-label="Legal">
        <a href="#/impressum">Impressum</a>
        <span className="global-footer-sep" aria-hidden="true">·</span>
        <a href="#/datenschutz">Datenschutz</a>
      </nav>
    </footer>
  );
}
