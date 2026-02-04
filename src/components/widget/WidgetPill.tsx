/**
 * WidgetPill Component
 * 
 * Rounded pill-shaped element for tags, status indicators, or compact buttons.
 */

import React from 'react';

export interface WidgetPillProps {
  /** Pill content */
  children: React.ReactNode;
  /** Use accent color styling */
  accent?: boolean;
  /** Icon element (optional) */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export const WidgetPill: React.FC<WidgetPillProps> = ({
  children,
  accent = false,
  icon,
  onClick,
  className = ''
}) => {
  const accentClass = accent ? 'widget-pill-accent' : '';
  const clickable = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`widget-pill ${accentClass} ${clickable} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <span className="widget-pill-icon">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
