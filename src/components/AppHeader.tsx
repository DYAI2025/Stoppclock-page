import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { HeaderActions } from './HeaderActions';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppHeaderProps {
  /** Current page/timer name */
  title?: string;
  /** Breadcrumb items for navigation context */
  breadcrumbs?: BreadcrumbItem[];
  /** Show back button instead of logo */
  showBack?: boolean;
  /** Back button click handler */
  onBack?: () => void;
  /** Header action configurations */
  actions?: {
    showShare?: boolean;
    onShare?: () => void;
    showFullscreen?: boolean;
    onFullscreen?: () => void;
    showTheme?: boolean;
    showLanguage?: boolean;
    showSettings?: boolean;
    showHome?: boolean;
  };
  /** Variant: landing (full nav) or timer (minimal) */
  variant?: 'landing' | 'timer';
  /** Custom className */
  className?: string;
}

/**
 * Unified App Header Component
 * 
 * Provides consistent header across all pages with:
 * - Logo with animated clock
 * - Breadcrumb navigation
 * - Page title
 * - Action toolbar (share, fullscreen, theme, settings, home)
 * - Responsive mobile layout
 * - Frosted glass effect
 * - Auto-collapse on scroll (optional)
 * 
 * Usage:
 * ```tsx
 * // Landing page
 * <AppHeader variant="landing" />
 * 
 * // Timer page with breadcrumb
 * <AppHeader 
 *   title="Chess Clock"
 *   breadcrumbs={[{ label: 'Home', href: '#/' }, { label: 'Chess Clock' }]}
 *   actions={{ showShare: true, showFullscreen: true, showHome: true }}
 * />
 * ```
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  breadcrumbs,
  showBack = false,
  onBack,
  actions = {},
  variant = 'timer',
  className = ''
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header className={`app-header app-header-${variant} ${className}`}>
      <div className="app-header-content">
        {/* Left Section: Logo/Back + Title/Breadcrumb */}
        <div className="app-header-left">
          {showBack ? (
            <button
              className="header-back-btn"
              onClick={handleBack}
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <Logo variant={variant === 'landing' ? 'full' : 'icon-only'} />
          )}

          {/* Breadcrumbs or Title */}
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="app-header-breadcrumb" aria-label="Breadcrumb">
              <ol className="breadcrumb-list">
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="breadcrumb-item">
                    {item.href ? (
                      <a href={item.href} className="breadcrumb-link">
                        {item.label}
                      </a>
                    ) : (
                      <span className="breadcrumb-current">{item.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight size={14} className="breadcrumb-separator" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : title ? (
            <h1 className="app-header-title">{title}</h1>
          ) : null}
        </div>

        {/* Right Section: Navigation Links (Landing) or Actions (Timer) */}
        <div className="app-header-right">
          {variant === 'landing' ? (
            <nav className="app-header-nav" aria-label="Main navigation">
              <a href="#/" className="nav-link active">Timers</a>
              <a href="#/timers" className="nav-link">Timer Worlds</a>
              <a href="#/about" className="nav-link">About</a>
            </nav>
          ) : null}

          <HeaderActions
            showShare={actions.showShare}
            onShare={actions.onShare}
            showFullscreen={actions.showFullscreen}
            onFullscreen={actions.onFullscreen}
            showTheme={actions.showTheme !== false}
            showLanguage={actions.showLanguage}
            showSettings={actions.showSettings !== false}
            showHome={actions.showHome !== false}
          />
        </div>
      </div>
    </header>
  );
};
