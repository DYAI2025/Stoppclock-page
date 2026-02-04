import React, { useCallback, useEffect, useState } from 'react';
import { usePomodoroLogic } from '../domain/pomodoro/logic';
import { PomodoroDisplay } from '../components/pomodoro/PomodoroDisplay';
import { PomodoroControls } from '../components/pomodoro/PomodoroControls';
import { PomodoroSettings } from '../components/pomodoro/PomodoroSettings';
import { HomeButton } from '../components/HomeButton';
import { ShareButton } from '../components/ShareButton';
import { SavePresetButton } from '../components/SavePresetButton';
import { POMODORO_PRESETS } from '../domain/pomodoro/types';
import { getPresetFromUrl } from '../utils/share';
import '../styles/pomodoro.css';

export default function PomodoroPage() {
  const {
    state,
    toggleTimer,
    skip,
    resetSession,
    setPreset,
    setFocusLabel
  } = usePomodoroLogic();

  const [urlChecked, setUrlChecked] = useState(false);
  const activePreset = POMODORO_PRESETS[state.activePresetId] || POMODORO_PRESETS['classic'];

  // URL Preset Loading
  useEffect(() => {
    if (urlChecked) return;

    const sharedPreset = getPresetFromUrl();
    if (sharedPreset && sharedPreset.type === 'pomodoro') {
      const config = sharedPreset.config;
      if (config.activePresetId && POMODORO_PRESETS[config.activePresetId]) {
        setPreset(config.activePresetId);
      }
      if (config.focusLabel) {
        setFocusLabel(config.focusLabel);
      }
    }
    setUrlChecked(true);
  }, [urlChecked, setPreset, setFocusLabel]);

  // Get current config for sharing/saving
  const getCurrentConfig = useCallback(() => {
    return {
      activePresetId: state.activePresetId,
      focusLabel: state.focusLabel || '',
      workDuration: activePreset.focusDuration,
      breakDuration: activePreset.shortBreakDuration,
      longBreakDuration: activePreset.longBreakDuration,
      cyclesBeforeLongBreak: activePreset.cyclesBeforeLongBreak
    };
  }, [state.activePresetId, state.focusLabel, activePreset]);

  return (
    <div className="pomodoro-page">
      <div className="pomodoro-home-btn">
        <HomeButton />
      </div>

      <div className="pomodoro-container">
        <PomodoroDisplay
          remainingSeconds={state.remainingSeconds}
          currentPhase={state.currentPhase}
          focusLabel={state.focusLabel}
          completedCycles={state.totalSessionsCompleted} // Using sessions as cycle indicator
          totalCyclesInPreset={activePreset.cyclesBeforeLongBreak}
        />

        <PomodoroControls
          isRunning={state.isRunning}
          onToggle={toggleTimer}
          onSkip={skip}
          onReset={resetSession}
        />

        <PomodoroSettings
          activePresetId={state.activePresetId}
          onSelectPreset={setPreset}
          onFocusLabelChange={setFocusLabel}
          focusLabel={state.focusLabel}
        />

        <div className="pomodoro-action-row">
          <SavePresetButton
            timerType="pomodoro"
            getCurrentConfig={getCurrentConfig}
          />
          <ShareButton
            timerType="pomodoro"
            presetName={state.focusLabel || 'Mein Pomodoro'}
            getCurrentConfig={getCurrentConfig}
          />
        </div>
      </div>
    </div>
  );
}
