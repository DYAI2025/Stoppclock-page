import React from 'react';
import { PomodoroPhase } from '../../domain/pomodoro/types';
import '../../styles/timesince-swiss.css'; // Re-use some typography variables or create new?
// For now, let's use inline styles or new css file. 
// Plan suggests keeping it clean. We'll add a 'pomodoro.css' later or now.
// Let's create `src/styles/pomodoro.css` soon.

interface PomodoroDisplayProps {
    remainingSeconds: number;
    currentPhase: PomodoroPhase;
    focusLabel: string;
    completedCycles: number;
    totalCyclesInPreset: number;
}

function formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getPhaseLabel(phase: PomodoroPhase): string {
    switch (phase) {
        case 'focus': return 'Focus Time';
        case 'shortBreak': return 'Short Break';
        case 'longBreak': return 'Long Break';
    }
}

export function PomodoroDisplay({
    remainingSeconds,
    currentPhase,
    focusLabel,
    completedCycles,
    totalCyclesInPreset
}: PomodoroDisplayProps) {

    // Progress dots logic
    // e.g. 4 cycles in a preset. We show 4 dots. Fill them based on completedCycles.
    // Note: completedCycles is total cycles. We want modulo?
    // If we want "Current Session Progress", we assume `completedCycles % totalCycles`?
    // Let's assume totalCyclesInPreset is e.g. 4.
    const currentProgress = completedCycles % totalCyclesInPreset;

    return (
        <div className="pomodoro-display-container">
            {/* Visual Progress */}
            <div className="pomodoro-progress-dots">
                {Array.from({ length: totalCyclesInPreset }).map((_, i) => (
                    <div
                        key={i}
                        className={`pomodoro-dot ${i < currentProgress ? 'filled' : ''} ${i === currentProgress && currentPhase === 'focus' ? 'active' : ''}`}
                    />
                ))}
            </div>

            {/* Main Timer */}
            <div className={`pomodoro-time-digits phase-${currentPhase}`}>
                {formatTime(remainingSeconds)}
            </div>

            {/* Phase Label */}
            <div className="pomodoro-phase-label">
                {getPhaseLabel(currentPhase)}
            </div>

            {/* Focus Label (Intent) */}
            {focusLabel && (
                <div className="pomodoro-focus-intent">
                    <span className="intent-prefix">Working on:</span> {focusLabel}
                </div>
            )}
        </div>
    );
}
