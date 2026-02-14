import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { TimerType, PresetConfig } from '../types/preset-types';
import { generateShareUrl, copyToClipboard, shortenUrl } from '../utils/share';

interface ShareModalProps {
  isOpen: boolean;
  timerType: TimerType;
  presetName: string;
  config: PresetConfig;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  timerType,
  presetName,
  config,
  onClose
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const url = generateShareUrl({
        type: timerType,
        name: presetName,
        config
      });
      setShareUrl(url);
      setCopied(false);
    }
  }, [isOpen, timerType, presetName, config]);

  const handleCopyUrl = async () => {
    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      alert('Fehler beim Kopieren');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Timer teilen</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="share-preset-info">
            <h3>{presetName}</h3>
            <p className="share-preset-type">{getTypeLabel(timerType)}</p>
          </div>

          <div className="share-qr-container">
            <div className="share-qr-wrapper">
              <QRCodeSVG
                value={shareUrl}
                size={200}
                level="M"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#0b1220"
              />
            </div>
            <p className="share-qr-hint">
              Scanne den QR-Code mit deinem Handy
            </p>
          </div>

          <div className="share-url-section">
            <label htmlFor="share-url">Link kopieren</label>
            <div className="share-url-wrapper">
              <input
                id="share-url"
                type="text"
                className="form-input share-url-input"
                value={shareUrl}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                className="btn btn-copy"
                onClick={handleCopyUrl}
              >
                {copied ? '✓ Kopiert!' : '📋 Kopieren'}
              </button>
            </div>
            <small className="share-url-preview">
              {shortenUrl(shareUrl, 60)}
            </small>
          </div>

          <div className="share-info">
            <p>
              💡 <strong>So funktioniert's:</strong>
            </p>
            <ul>
              <li>QR-Code scannen oder Link teilen</li>
              <li>Timer öffnet sich automatisch mit deiner Konfiguration</li>
              <li>Perfekt für Klassenzimmer, Workshops & Teams</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};

function getTypeLabel(type: TimerType): string {
  const labels: Record<TimerType, string> = {
    pomodoro: 'Pomodoro Timer',
    countdown: 'Countdown Timer',
    stopwatch: 'Stopwatch',
    cooking: 'Cooking Timer',
    chess: 'Chess Clock',
    metronome: 'Metronome',
    cycle: 'Cycle Timer',
    analog: 'Analog Timer'
  };
  return labels[type];
}
