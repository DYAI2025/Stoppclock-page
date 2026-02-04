import React, { useState, useEffect } from 'react';
import type { TimerPreset, TimerType, PresetConfig } from '../types/preset-types';
import { PRESET_CONSTRAINTS } from '../types/preset-types';
import { createPreset, validatePresetName } from '../utils/presets';

interface PresetSaveModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  timerType: TimerType;
  currentConfig: PresetConfig;
  existingPreset?: TimerPreset;
  onSave: (preset: TimerPreset) => void;
  onCancel: () => void;
}

export const PresetSaveModal: React.FC<PresetSaveModalProps> = ({
  isOpen,
  mode,
  timerType,
  currentConfig,
  existingPreset,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⏱️');
  const [error, setError] = useState<string | null>(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && existingPreset) {
        setName(existingPreset.name);
        setIcon(existingPreset.icon);
      } else {
        setName('');
        setIcon('⏱️');
      }
      setError(null);
    }
  }, [isOpen, mode, existingPreset]);

  const handleSave = () => {
    setError(null);

    // Validate name
    const validation = validatePresetName(name);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      if (mode === 'create') {
        // Create new preset
        const preset = createPreset(name, icon, timerType, currentConfig);
        onSave(preset);
      } else if (mode === 'edit' && existingPreset) {
        // Update existing preset
        const updatedPreset: TimerPreset = {
          ...existingPreset,
          name: name.trim(),
          icon,
          config: currentConfig
        };
        onSave(updatedPreset);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const getTypeLabel = (type: TimerType): string => {
    const labels: Record<TimerType, string> = {
      pomodoro: 'Pomodoro',
      countdown: 'Countdown',
      stopwatch: 'Stopwatch',
      cooking: 'Cooking',
      chess: 'Chess Clock',
      metronome: 'Metronome',
      cycle: 'Cycle Timer',
      analog: 'Analog'
    };
    return labels[type];
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {mode === 'create' ? 'Preset speichern' : 'Preset bearbeiten'}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="preset-name">Name</label>
            <input
              id="preset-name"
              type="text"
              className="form-input"
              placeholder="z.B. Lern-Session, Deep Work..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={PRESET_CONSTRAINTS.MAX_NAME_LENGTH}
              autoFocus
            />
            <small className="form-hint">
              {name.length}/{PRESET_CONSTRAINTS.MAX_NAME_LENGTH} Zeichen
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="preset-icon">Icon</label>
            <div className="icon-picker">
              {PRESET_CONSTRAINTS.EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`icon-option ${icon === emoji ? 'selected' : ''}`}
                  onClick={() => setIcon(emoji)}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Vorschau</label>
            <div className="preset-preview">
              <span className="preview-icon">{icon}</span>
              <div className="preview-info">
                <div className="preview-name">
                  {name || 'Mein Preset'}
                </div>
                <span className="preview-type">{getTypeLabel(timerType)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            {mode === 'create' ? 'Speichern' : 'Aktualisieren'}
          </button>
        </div>
      </div>
    </div>
  );
};
