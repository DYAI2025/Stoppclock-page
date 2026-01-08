export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroPreset {
    id: string;
    name: string;
    focusDuration: number; // in minutes
    shortBreakDuration: number; // in minutes
    longBreakDuration: number; // in minutes
    cyclesBeforeLongBreak: number;
}

export interface PomodoroState {
    isRunning: boolean;
    currentPhase: PomodoroPhase;
    remainingSeconds: number;
    completedCycles: number; // Total full cycles completed (focus+break pairs)
    totalSessionsCompleted: number; // Total focus sessions completed
    activePresetId: string;
    focusLabel: string;
}

export const POMODORO_PRESETS: Record<string, PomodoroPreset> = {
    classic: {
        id: 'classic',
        name: 'Classic',
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        cyclesBeforeLongBreak: 4,
    },
    soft: {
        id: 'soft',
        name: 'Soft Focus',
        focusDuration: 45,
        shortBreakDuration: 10,
        longBreakDuration: 20,
        cyclesBeforeLongBreak: 3,
    },
    deep: {
        id: 'deep',
        name: 'Deep Work',
        focusDuration: 90,
        shortBreakDuration: 15,
        longBreakDuration: 30,
        cyclesBeforeLongBreak: 2,
    },
};

export const DEFAULT_POMODORO_STATE: PomodoroState = {
    isRunning: false,
    currentPhase: 'focus',
    remainingSeconds: 25 * 60,
    completedCycles: 0,
    totalSessionsCompleted: 0,
    activePresetId: 'classic',
    focusLabel: '',
};
