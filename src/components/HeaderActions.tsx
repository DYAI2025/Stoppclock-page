import React, { useState } from 'react';
import { Share2, Maximize, Settings, Home } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import SettingsModal from './SettingsModal';

interface HeaderActionsProps {
  /** Show share button */
  showShare?: boolean;
  /** Share button click handler */
  onShare?: () => void;
  /** Show fullscreen button */
  showFullscreen?: boolean;
  /** Fullscreen button click handler */
  onFullscreen?: () => void;
  /** Show theme toggle */
  showTheme?: boolean;
  /** Show language toggle */
  showLanguage?: boolean;
  /** Show settings button */
  showSettings?: boolean;
  /** Show home button */
  showHome?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Header Actions Toolbar Component
 * 
 * Reusable toolbar with common header actions:
 * - Share
 * - Fullscreen
 * - Theme toggle
 * - Language toggle
 * - Settings
 * - Home
 * 
 * All actions are optional and can be configured via props
 */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  showShare = false,
  onShare,
  showFullscreen = false,
  onFullscreen,
  showTheme = true,
  showLanguage = false,
  showSettings = true,
  showHome = false,
  className = ''
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen();
    } else {
      // Default fullscreen behavior
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          // Silently fail if fullscreen not supported
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <>
      <div className={`header-actions ${className}`}>
        {showShare && (
          <button
            className="header-action-btn"
            onClick={onShare}
            title="Share timer configuration"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        )}

        {showFullscreen && (
          <button
            className="header-action-btn"
            onClick={handleFullscreen}
            title="Toggle fullscreen (F)"
            aria-label="Toggle fullscreen"
          >
            <Maximize size={18} />
          </button>
        )}

        {showTheme && (
          <div className="header-action-wrapper">
            <DarkModeToggle />
          </div>
        )}

        {showLanguage && (
          <div className="header-action-wrapper">
            <LanguageToggle />
          </div>
        )}

        {showSettings && (
          <button
            className="header-action-btn"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        )}

        {showHome && (
          <a
            href="#/"
            className="header-action-btn header-home-btn"
            title="Home"
            aria-label="Go to home"
          >
            <Home size={18} />
          </a>
        )}
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};
