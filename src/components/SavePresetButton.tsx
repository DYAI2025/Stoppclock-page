import React, { useState } from 'react';
import type { TimerType, PresetConfig } from '../types/preset-types';
import { PresetSaveModal } from './PresetSaveModal';
import { addPreset } from '../utils/presets';

interface SavePresetButtonProps {
  timerType: TimerType;
  getCurrentConfig: () => PresetConfig;
  className?: string;
}

export const SavePresetButton: React.FC<SavePresetButtonProps> = ({
  timerType,
  getCurrentConfig,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<PresetConfig>({});

  const handleClick = () => {
    // Capture current config when button is clicked
    setCurrentConfig(getCurrentConfig());
    setIsModalOpen(true);
  };

  const handleSave = (preset: any) => {
    try {
      addPreset(preset);
      setIsModalOpen(false);
      alert(`✅ Preset "${preset.name}" gespeichert!`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Fehler beim Speichern');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`btn btn-save-preset ${className}`}
        onClick={handleClick}
        title="Aktuelle Konfiguration als Preset speichern"
      >
        💾 Als Preset speichern
      </button>

      <PresetSaveModal
        isOpen={isModalOpen}
        mode="create"
        timerType={timerType}
        currentConfig={currentConfig}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
};
