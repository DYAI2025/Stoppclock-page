import React from 'react';
import { Clock } from 'lucide-react';

interface LogoProps {
  /** Show full logo with text or icon only */
  variant?: 'full' | 'icon-only';
  /** Custom className */
  className?: string;
  /** Navigate to home on click */
  clickable?: boolean;
}

/**
 * Enhanced Stoppclock Logo Component
 * 
 * Features:
 * - Animated clock icon with rotating second hand
 * - Gradient wordmark
 * - Responsive - shows icon only on mobile
 * - Clickable to navigate home
 */
export const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  className = '',
  clickable = true 
}) => {
  const content = (
    <>
      <div className="logo-icon">
        <Clock size={20} strokeWidth={2.5} />
        <div className="logo-icon-hand" />
      </div>
      {variant === 'full' && (
        <span className="logo-text">Stoppclock</span>
      )}
    </>
  );

  if (clickable) {
    return (
      <a href="#/" className={`app-logo ${className}`} aria-label="Stoppclock Home">
        {content}
      </a>
    );
  }

  return (
    <div className={`app-logo ${className}`}>
      {content}
    </div>
  );
};
