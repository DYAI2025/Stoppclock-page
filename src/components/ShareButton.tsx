import React, { useState } from 'react';
import type { TimerType, PresetConfig } from '../types/preset-types';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  timerType: TimerType;
  presetName?: string;
  getCurrentConfig: () => PresetConfig;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  timerType,
  presetName,
  getCurrentConfig,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<PresetConfig>({});
  const [name, setName] = useState('');

  const handleClick = () => {
    // Capture current config when button is clicked
    setCurrentConfig(getCurrentConfig());
    setName(presetName || getDefaultName(timerType));
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`btn btn-share ${className}`}
        onClick={handleClick}
        title="Timer-Konfiguration teilen"
      >
        🔗 Teilen
      </button>

      <ShareModal
        isOpen={isModalOpen}
        timerType={timerType}
        presetName={name}
        config={currentConfig}
        onClose={handleClose}
      />
    </>
  );
};

function getDefaultName(type: TimerType): string {
  const names: Record<TimerType, string> = {
    pomodoro: 'Mein Pomodoro',
    countdown: 'Mein Countdown',
    stopwatch: 'Meine Stoppuhr',
    cooking: 'Mein Koch-Timer',
    chess: 'Meine Schachuhr',
    metronome: 'Mein Metronom',
    cycle: 'Mein Cycle Timer',
    analog: 'Meine Analog-Uhr'
  };
  return names[type] || 'Mein Timer';
}
