import React from 'react';

interface HomeButtonProps {
  className?: string;
  position?: string;
  showLabel?: boolean;
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
export function HomeButton({ className = '', position, showLabel = true }: HomeButtonProps) {
  return (
    <a href="#/" className={`btn-home ${className}`}>
      <span className="home-icon">⌂</span>
      {showLabel && <span className="home-text">Home</span>}
    </a>
  );
}
