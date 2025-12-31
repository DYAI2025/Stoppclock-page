import React from 'react';
import type { TimerPreset } from '../types/preset-types';

interface PresetCardProps {
  preset: TimerPreset;
  onStart: (preset: TimerPreset) => void;
  onEdit: (preset: TimerPreset) => void;
  onDelete: (id: string) => void;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  onStart,
  onEdit,
  onDelete
}) => {
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      pomodoro: 'Pomodoro',
      countdown: 'Countdown',
      stopwatch: 'Stopwatch',
      cooking: 'Cooking',
      chess: 'Chess Clock',
      metronome: 'Metronome',
      cycle: 'Cycle Timer',
      analog: 'Analog'
    };
    return labels[type] || type;
  };

  const getConfigSummary = (): string => {
    const { config, type } = preset;

    switch (type) {
      case 'pomodoro':
      case 'cycle':
        return `${config.workDuration}min + ${config.breakDuration}min pause`;

      case 'countdown':
      case 'analog':
        if (config.durationMs) {
          const totalMin = Math.floor(config.durationMs / 60000);
          return `${totalMin} Min`;
        }
        const hours = config.hours || 0;
        const minutes = config.minutes || 0;
        if (hours > 0) {
          return `${hours}h ${minutes}min`;
        }
        return `${minutes} Min`;

      case 'cooking':
        const timerCount = config.timers?.length || 0;
        return `${timerCount} Timer`;

      case 'chess':
        return `${config.player1Time}min vs ${config.player2Time}min`;

      case 'metronome':
        return `${config.bpm} BPM`;

      default:
        return 'Timer';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Preset "${preset.name}" wirklich löschen?`)) {
      onDelete(preset.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(preset);
  };

  return (
    <div className="preset-card" onClick={() => onStart(preset)}>
      <div className="preset-card-header">
        <span className="preset-icon">{preset.icon}</span>
        <div className="preset-info">
          <h3 className="preset-name">{preset.name}</h3>
          <span className="preset-type-badge">{getTypeLabel(preset.type)}</span>
        </div>
      </div>

      <div className="preset-card-body">
        <p className="preset-summary">{getConfigSummary()}</p>
        {preset.usageCount > 0 && (
          <p className="preset-usage">
            Genutzt: {preset.usageCount}x
          </p>
        )}
      </div>

      <div className="preset-card-actions">
        <button
          type="button"
          className="btn btn-small btn-primary"
          onClick={() => onStart(preset)}
        >
          ▶️ Start
        </button>
        <button
          type="button"
          className="btn btn-small btn-secondary"
          onClick={handleEditClick}
          title="Bearbeiten"
        >
          ✏️
        </button>
        <button
          type="button"
          className="btn btn-small btn-danger"
          onClick={handleDeleteClick}
          title="Löschen"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
