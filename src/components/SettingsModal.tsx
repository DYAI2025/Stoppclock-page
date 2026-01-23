import React from 'react';
import { X, Globe, Moon, Shield } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import { ConsentSettings } from './ConsentBanner';
import '../styles/landingpage.css'; // Reuse existing styles or inline for now as modals are global

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: 'var(--card-bg, white)', color: 'var(--text-primary, #111827)',
        padding: '24px', borderRadius: '16px', maxWidth: '480px', width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex', color: 'inherit' }}>
            <X size={24} />
          </button>
        </div>

        <div className="settings-section" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Moon size={18} /> Appearance
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary, #F3F4F6)', padding: '12px 16px', borderRadius: '12px' }}>
            <span>Theme Mode</span>
            <DarkModeToggle />
          </div>
        </div>

        <div className="settings-section" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} /> Language
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary, #F3F4F6)', padding: '12px 16px', borderRadius: '12px' }}>
            <span>Interface Language</span>
            <LanguageToggle />
          </div>
        </div>

        <div className="settings-section">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} /> Privacy & Cookies
          </h3>
          <div style={{ background: 'var(--bg-secondary, #F3F4F6)', padding: '16px', borderRadius: '12px' }}>
            <ConsentSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
