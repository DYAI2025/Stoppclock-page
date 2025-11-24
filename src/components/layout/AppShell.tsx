import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  /** Optional header content (for timer pages) */
  header?: ReactNode;
}

/**
 * AppShell - Lightweight layout wrapper for timer pages
 * 
 * Features:
 * - Skip-to-content link for keyboard navigation
 * - Main landmark for screen readers
 * - Optional header slot
 * 
 * Note: Home page does NOT use AppShell to preserve custom design
 */
export function AppShell({ children, header }: AppShellProps) {
  return (
    <>
      {/* Skip-to-content link (visible on keyboard focus) */}
      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>

      {/* Optional header (timer controls, etc.) */}
      {header && (
        <header role="banner" className="app-header">
          {header}
        </header>
      )}

      {/* Main content area */}
      <main id="main" className="app-main">
        {children}
      </main>
    </>
  );
}