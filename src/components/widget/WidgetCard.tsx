/**
 * WidgetCard Component
 * 
 * Base card container for all widget types.
 * Provides consistent styling, shadows, and hover effects.
 */

import React from 'react';

export interface WidgetCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Remove padding for custom layouts */
  flush?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Grid column span (1-3) */
  span?: 1 | 2 | 3;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  children,
  size = 'md',
  flush = false,
  className = '',
  onClick,
  span
}) => {
  const sizeClass = size === 'sm' ? 'widget-card-sm' : size === 'lg' ? 'widget-card-lg' : '';
  const flushClass = flush ? 'widget-card-flush' : '';
  const spanClass = span ? `widget-grid-span-${span}` : '';
  const clickable = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`widget-card ${sizeClass} ${flushClass} ${spanClass} ${clickable} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};
