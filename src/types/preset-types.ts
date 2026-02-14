/**
 * Custom Timer Presets System
 * Allows users to save, manage, and share their favorite timer configurations
 */

export type TimerType =
  | 'pomodoro'
  | 'countdown'
  | 'stopwatch'
  | 'cooking'
  | 'chess'
  | 'metronome'
  | 'cycle'
  | 'analog';

/**
 * Configuration for different timer types
 * Each timer type has its own specific config fields
 */
export interface PresetConfig {
  // Pomodoro/Cycle Timer
  workDuration?: number; // minutes
  breakDuration?: number; // minutes
  longBreakDuration?: number; // minutes
  cycles?: number;
  activePresetId?: string; // For Pomodoro preset selection
  focusLabel?: string; // Custom focus label

  // Countdown Timer
  durationMs?: number; // milliseconds
  hours?: number;
  minutes?: number;
  seconds?: number;

  // Stopwatch (no config needed - just tracking)
  // Uses default behavior

  // Cooking Timer
  timers?: Array<{
    id: string;
    label: string;
    minutes: number;
    seconds?: number;
    color?: string;
  }>;

  // Chess Clock
  player1Time?: number; // milliseconds
  player2Time?: number; // milliseconds
  initialTime?: number; // minutes (legacy/alternative)
  mode?: 'simple' | 'fischer' | 'bronstein';
  increment?: number; // seconds for fischer/bronstein

  // Metronome
  bpm?: number; // beats per minute
  timeSignature?: string; // e.g. "4/4", "3/4"
  accentFirst?: boolean;

  // Analog Countdown (similar to countdown but visualized differently)
  analogHours?: number;
  analogMinutes?: number;
  warnAtMs?: number;
}

/**
 * A saved timer preset
 */
export interface TimerPreset {
  id: string; // UUID
  name: string; // 1-30 characters
  icon: string; // Emoji
  type: TimerType;
  config: PresetConfig;
  createdAt: number; // timestamp
  usageCount: number; // incremented each time preset is used
  lastUsed?: number; // timestamp of last usage
}

/**
 * State schema for presets stored in localStorage
 */
export interface PresetsState {
  version: 1;
  presets: TimerPreset[];
}

/**
 * Validation constraints
 */
export const PRESET_CONSTRAINTS = {
  MAX_PRESETS: 10,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 30,
  EMOJI_LIST: [
    '📚', '💼', '🎯', '⚡', '🔥', '💪', '🧘', '🎨',
    '🎵', '⏰', '📝', '💡', '🚀', '⭐', '🌟', '🎓',
    '🏃', '🍅', '☕', '🌙'
  ]
} as const;

/**
 * Preset validation result
 */
export interface PresetValidationResult {
  valid: boolean;
  errors: string[];
}
