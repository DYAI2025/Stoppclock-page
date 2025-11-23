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

// Cooking Timer state - multi-timer kitchen assistant
export type CookingPresetId = 'stove' | 'oven' | 'pasta' | 'rice' | 'eggs' | 'tea' | 'custom';

export interface CookingTimer {
  id: string;
  label: string;
  presetId: CookingPresetId;
  durationMs: number;
  remainingMs: number;
  running: boolean;
  startedAt: number | null;
  color: string;
  alarming: boolean; // true when alarm is actively ringing/pulsing
  alarmStartedAt: number | null; // when alarm started (for 60s audio limit)
}

export interface CookingTimerState {
  version: 1;
  timers: CookingTimer[]; // Up to 10 timers
  nextColorIndex: number; // For auto-rotation through color palette
}

// Couples Timer state - Structured dialogue timer based on Moeller's Zwiegespräch
export type SessionPhase =
  | 'SETUP'           // Initial setup before session starts
  | 'PREP'            // Preparation phase (3-5 minutes)
  | 'A_SPEAKS'        // Person A's speaking slot
  | 'TRANSITION'      // Transition between speakers (5 seconds)
  | 'B_SPEAKS'        // Person B's speaking slot
  | 'CLOSING'         // Closing round (1-2 minutes per person)
  | 'A_CLOSING'       // Person A's closing
  | 'B_CLOSING'       // Person B's closing
  | 'COOLDOWN'        // Post-session cooldown (no follow-up conversation)
  | 'COMPLETED';      // Session completed

export type PresetId = 'klassisch-90' | 'einsteiger-60' | 'eltern-kind-60' | 'custom';

export interface SessionSlot {
  speaker: 'A' | 'B';
  durationMs: number;
  type: 'speaking' | 'closing';
}

export interface SessionPreset {
  id: PresetId;
  name: string;
  description: string;
  totalDurationMs: number;
  prepDurationMs: number;
  slotDurationMs: number;      // Duration of each speaking slot
  slotsPerPerson: number;      // Number of slots per person
  transitionDurationMs: number;
  closingDurationMs: number;   // Duration for closing per person
  cooldownDurationMs: number;
}

export interface CoupleProfile {
  id: string;
  nameA: string;
  nameB: string;
  relationshipType: 'couple' | 'parent-child' | 'friends' | 'other';
  preferredPresetId: PresetId;
  createdAt: number;
  lastSessionAt: number | null;
}

export interface SessionSchedule {
  mainDay: number;        // 0-6 (Sunday-Saturday)
  mainTime: string;       // HH:MM
  backupDay: number;      // 0-6 (Sunday-Saturday)
  backupTime: string;     // HH:MM
  crisisMode: boolean;    // If true, schedule 2x per week
}

export interface CouplesTimerState {
  version: 1;
  currentProfile: CoupleProfile | null;
  currentPreset: SessionPreset | null;
  phase: SessionPhase;
  currentSlotIndex: number;      // Index of current slot in session
  remainingMs: number;           // Remaining time in current phase
  running: boolean;
  startedAt: number | null;
  completedSessions: number;     // Total completed sessions for this profile
  schedule: SessionSchedule | null;
}
