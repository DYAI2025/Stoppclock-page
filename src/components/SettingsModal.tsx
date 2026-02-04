import React from 'react';
import { X, Globe, Moon, Shield } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import { ConsentSettings } from './ConsentBanner';
import '../styles/settings-modal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={e => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h2 className="settings-modal-title">Settings</h2>
          <button 
            onClick={onClose} 
            className="settings-close-btn"
            aria-label="Close settings"
            title="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">
            <Moon size={18} /> Appearance
          </h3>
          <div className="settings-row">
            <span>Theme Mode</span>
            <DarkModeToggle />
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">
            <Globe size={18} /> Language
          </h3>
          <div className="settings-row">
            <span>Interface Language</span>
            <LanguageToggle />
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">
            <Shield size={18} /> Privacy & Cookies
          </h3>
          <div className="settings-panel">
            <ConsentSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
