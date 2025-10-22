/**
 * Shared TypeScript types for timer applications
 * Based on data-model.md contracts
 */

// Common signal preferences for all timers
export interface SignalPreferences {
  sound: boolean;
  flash: boolean;
}

// Common countdown timer state (Countdown, Analog Countdown)
export interface CountdownState {
  version: 1;
  running: boolean;
  remainingMs: number;
  durationMs: number;
  endAt: number | null;
  signal: SignalPreferences;
  warnAt: number;
}

// Stopwatch state with lap times
export interface LapTime {
  lapNumber: number;
  lapTimeMs: number;
  totalTimeMs: number;
  timestamp: number;
}

export interface StopwatchState {
  version: 1;
  running: boolean;
  elapsedMs: number;
  startedAt: number | null;
  lapTimes: LapTime[];
}

// Cycle Timer state
export interface CycleTimerState {
  version: 1;
  intervalMs: number;
  remainingMs: number;
  running: boolean;
  endAt: number | null;
  cycleCount: number;
  signal: SignalPreferences;
}

// World Clock state
export interface TimeZoneEntry {
  id: string;
  city: string;
  zone: string;
  country: string;
  utcOffset: string;
}

export interface WorldClockState {
  version: 1;
  selectedZones: TimeZoneEntry[];
}

// Alarm state
export interface AlarmState {
  version: 1;
  active: boolean;
  targetTime: {
    hour: number;
    minute: number;
  };
  nextTriggerAt: number | null;
  ringing: boolean;
  signal: SignalPreferences;
}

// Metronome state
export interface MetronomeState {
  version: 1;
  bpm: number;
  running: boolean;
  timeSignature: {
    beatsPerMeasure: number;
    beatValue: number;
  };
  currentBeat: number;
  accentFirstBeat: boolean;
}

// Chess Clock state
export interface ChessClockPlayer {
  remainingMs: number;
  moveCount: number;
}

export type ClockMode = 'simple' | 'fischer' | 'bronstein';

export interface ChessClockState {
  version: 1;
  players: {
    player1: ChessClockPlayer;
    player2: ChessClockPlayer;
  };
  activePlayer: 1 | 2 | null;
  running: boolean;
  endAt: number | null;
  mode: {
    type: ClockMode;
    incrementMs: number;
    delayMs: number;
  };
  timeExpired: 1 | 2 | null;
}

// User preferences
export type Theme = 'light' | 'dark' | 'auto';

export interface UserPreferences {
  version: 1;
  theme: Theme;
  defaultSignals: SignalPreferences;
  keyboardShortcutsEnabled: boolean;
}

// Pomodoro Timer state
export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroTask {
  id: string;
  text: string;
  status: 'todo' | 'inProgress' | 'done';
  createdAt: number;
}

export interface PomodoroState {
  version: 1;
  phase: PomodoroPhase;
  currentSession: number; // 1-4 (which pomodoro in current cycle)
  remainingMs: number;
  running: boolean;
  startedAt: number | null;
  completedPomodoros: number; // Total completed today
  tasks: PomodoroTask[];
}
