import React from 'react';
import { usePomodoroLogic } from '../domain/pomodoro/logic';
import { PomodoroDisplay } from '../components/pomodoro/PomodoroDisplay';
import { PomodoroControls } from '../components/pomodoro/PomodoroControls';
import { PomodoroSettings } from '../components/pomodoro/PomodoroSettings';
import { HomeButton } from '../components/HomeButton';
import { POMODORO_PRESETS } from '../domain/pomodoro/types';
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

  const activePreset = POMODORO_PRESETS[state.activePresetId] || POMODORO_PRESETS['classic'];

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
      </div>
    </div>
  );
}
