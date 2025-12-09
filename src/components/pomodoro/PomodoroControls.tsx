import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface PomodoroControlsProps {
    isRunning: boolean;
    onToggle: () => void;
    onSkip: () => void;
    onReset: () => void;
}

export function PomodoroControls({ isRunning, onToggle, onSkip, onReset }: PomodoroControlsProps) {
    return (
        <div className="pomodoro-controls">
            <button
                className="pomodoro-btn secondary"
                onClick={onReset}
                aria-label="Reset Timer"
                title="Reset Session"
            >
                <RotateCcw size={20} />
            </button>

            <button
                className={`pomodoro-btn primary ${isRunning ? 'active' : ''}`}
                onClick={onToggle}
                aria-label={isRunning ? "Pause Timer" : "Start Timer"}
            >
                {isRunning ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}
            </button>

            <button
                className="pomodoro-btn secondary"
                onClick={onSkip}
                aria-label="Skip to next phase"
                title="Skip Phase"
            >
                <SkipForward size={20} />
            </button>
        </div>
    );
}
