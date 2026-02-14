import React from 'react';
import { POMODORO_PRESETS, PomodoroPreset } from '../../domain/pomodoro/types';

interface PomodoroSettingsProps {
    activePresetId: string;
    onSelectPreset: (id: string) => void;
    onFocusLabelChange: (label: string) => void;
    focusLabel: string;
}

export function PomodoroSettings({
    activePresetId,
    onSelectPreset,
    onFocusLabelChange,
    focusLabel
}: PomodoroSettingsProps) {

    return (
        <div className="pomodoro-settings">
            <div className="pomodoro-presets-row">
                {Object.values(POMODORO_PRESETS).map((preset: PomodoroPreset) => (
                    <button
                        key={preset.id}
                        className={`pomodoro-chip ${activePresetId === preset.id ? 'active' : ''}`}
                        onClick={() => onSelectPreset(preset.id)}
                    >
                        {preset.name}
                    </button>
                ))}
                {/* Helper text for current preset */}
                <div className="pomodoro-preset-info">
                    {(() => {
                        const p = POMODORO_PRESETS[activePresetId] || POMODORO_PRESETS['classic'];
                        return `${p.focusDuration}m Focus • ${p.shortBreakDuration}m Break`;
                    })()}
                </div>
            </div>

            <div className="pomodoro-input-row">
                <input
                    type="text"
                    placeholder="What are you working on?"
                    value={focusLabel}
                    onChange={(e) => onFocusLabelChange(e.target.value)}
                    className="pomodoro-intent-input"
                />
            </div>
        </div>
    );
}
