/**
 * WidgetGrid Component
 * 
 * Responsive grid layout for widget cards.
 * Automatically adapts from 3 columns (desktop) to 1 column (mobile).
 */

import React from 'react';

export interface WidgetGridProps {
  /** Grid items (typically WidgetCard components) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`widget-grid ${className}`.trim()}>
      {children}
    </div>
  );
};
