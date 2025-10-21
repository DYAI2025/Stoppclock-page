import React from 'react';

interface HomeButtonProps {
  className?: string;
}

/**
 * Unified Home Button Component
 *
 * Provides consistent navigation across all timer pages.
 * Always positioned top-left, fixed position.
 * Responsive: shows icon-only on mobile (<500px).
 *
 * Usage:
 * ```tsx
 * <HomeButton />
 * ```
 */
export function HomeButton({ className = '' }: HomeButtonProps) {
  return (
    <a href="#/" className={`btn-home ${className}`}>
      <span className="home-icon">⌂</span>
      <span className="home-text">Home</span>
    </a>
  );
}
