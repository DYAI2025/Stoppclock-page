/**
 * ThemeSwitcher Component
 * 
 * Floating panel for switching between widget theme variants.
 * Allows live preview of all 4 color themes.
 */

import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';

export type WidgetTheme = 'arctic-blue' | 'aurora-purple' | 'ocean-teal' | 'sunset-warm';

export interface ThemeSwitcherProps {
  /** Current active theme */
  currentTheme: WidgetTheme;
  /** Theme change callback */
  onThemeChange: (theme: WidgetTheme) => void;
}

const THEMES = [
  {
    id: 'arctic-blue' as WidgetTheme,
    name: 'Arctic Blue',
    description: 'Professional & Modern',
    primaryColor: '#007AFF',
    secondaryColor: '#5AC8FA'
  },
  {
    id: 'aurora-purple' as WidgetTheme,
    name: 'Aurora Purple',
    description: 'Creative & Vibrant',
    primaryColor: '#7B2CBF',
    secondaryColor: '#A78BFA'
  },
  {
    id: 'ocean-teal' as WidgetTheme,
    name: 'Ocean Teal',
    description: 'Calming & Fresh',
    primaryColor: '#14B8A6',
    secondaryColor: '#06B6D4'
  },
  {
    id: 'sunset-warm' as WidgetTheme,
    name: 'Sunset Warm',
    description: 'Energetic & Bold',
    primaryColor: '#F59E0B',
    secondaryColor: '#FB923C'
  }
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: 'var(--widget-radius-full)',
          background: 'var(--widget-bg-card)',
          boxShadow: 'var(--widget-shadow-xl)',
          border: 'none',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--widget-accent-primary)',
          transition: 'all var(--widget-transition-fast)',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label="Toggle theme switcher"
      >
        {isOpen ? <X size={24} /> : <Palette size={24} />}
      </button>

      {/* Theme Switcher Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '320px',
            background: 'var(--widget-bg-card)',
            borderRadius: 'var(--widget-radius-xl)',
            boxShadow: 'var(--widget-shadow-xl)',
            padding: 'var(--widget-space-6)',
            zIndex: 999,
            animation: 'slideIn 0.2s ease'
          }}
        >
          <style>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          <h3
            style={{
              fontSize: 'var(--widget-text-lg)',
              fontWeight: 'var(--widget-font-semibold)',
              color: 'var(--widget-text-primary)',
              margin: '0 0 var(--widget-space-4) 0'
            }}
          >
            Choose Theme
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--widget-space-3)' }}>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--widget-space-3)',
                  padding: 'var(--widget-space-4)',
                  background:
                    currentTheme === theme.id
                      ? 'var(--widget-accent-primary-light)'
                      : 'transparent',
                  border:
                    currentTheme === theme.id
                      ? '2px solid var(--widget-accent-primary)'
                      : '2px solid var(--widget-border-light)',
                  borderRadius: 'var(--widget-radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--widget-transition-fast)',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== theme.id) {
                    e.currentTarget.style.borderColor = 'var(--widget-border-medium)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== theme.id) {
                    e.currentTarget.style.borderColor = 'var(--widget-border-light)';
                  }
                }}
              >
                {/* Color Swatch */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--widget-radius-sm)',
                      background: theme.primaryColor
                    }}
                  />
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--widget-radius-sm)',
                      background: theme.secondaryColor
                    }}
                  />
                </div>

                {/* Theme Info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 'var(--widget-text-base)',
                      fontWeight: 'var(--widget-font-semibold)',
                      color: 'var(--widget-text-primary)',
                      marginBottom: '2px'
                    }}
                  >
                    {theme.name}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--widget-text-xs)',
                      color: 'var(--widget-text-tertiary)'
                    }}
                  >
                    {theme.description}
                  </div>
                </div>

                {/* Active Indicator */}
                {currentTheme === theme.id && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: 'var(--widget-radius-full)',
                      background: 'var(--widget-accent-primary)'
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
