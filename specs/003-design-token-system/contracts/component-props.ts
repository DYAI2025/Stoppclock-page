/**
 * Component Props Contract
 *
 * Standardized prop interfaces for enhanced components
 *
 * This file defines TypeScript interfaces that components MUST implement
 * to ensure consistency across the design token system.
 */

/**
 * CTA Button Props
 *
 * Standard props for primary Call-to-Action buttons (Start, Stop, Pause, Reset)
 *
 * Requirements:
 * - Primary variant: min 56×56px
 * - Secondary variant: min 36×36px
 * - Touch targets: ≥44×44px
 * - Keyboard support: Space, Enter keys
 * - Focus visible: --focus-glow outline
 *
 * @example
 * ```tsx
 * <CTAButton
 *   actionType="start"
 *   onClick={handleStart}
 *   variant="primary"
 *   icon="▶"
 *   label="Start timer"
 * />
 * ```
 */
export interface CTAButtonProps {
  /**
   * Type of action this button performs
   */
  actionType: 'start' | 'stop' | 'reset' | 'pause';

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Whether button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Button size variant
   * - primary: ≥56×56px (recommended for main actions)
   * - secondary: ≥36×36px (for less important actions)
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';

  /**
   * Icon character to display (emoji or Unicode symbol)
   * @example "▶", "■", "↻", "⏸"
   */
  icon?: string;

  /**
   * Accessible label for screen readers
   * REQUIRED for accessibility
   */
  label: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Design token override for background color
   * @example 'var(--stopwatch-start)'
   */
  colorToken?: string;
}


/**
 * Accessibility Preferences
 *
 * User preferences for accessibility features
 * Persisted to localStorage with key 'sc.v1.accessibility'
 *
 * @example
 * ```typescript
 * const prefs: AccessibilityPreferences = {
 *   motionPreference: 'reduced',
 *   audioWarnings: true,
 *   flashWarnings: false, // Default: opt-in for safety
 *   screenReaderVerbosity: 'low'
 * };
 * localStorage.setItem('sc.v1.accessibility', JSON.stringify(prefs));
 * ```
 */
export interface AccessibilityPreferences {
  /**
   * Version of preferences schema (for future migrations)
   */
  version: 1;

  /**
   * Motion animation preference
   * - 'full': Show all animations
   * - 'reduced': Disable animations (respects OS prefers-reduced-motion)
   * @default 'full'
   */
  motionPreference: 'full' | 'reduced';

  /**
   * Enable audio beeps for countdown warnings
   * @default true
   */
  audioWarnings: boolean;

  /**
   * Enable visual flash warnings (photosensitive epilepsy risk)
   * MUST default to false (opt-in for safety)
   * @default false
   */
  flashWarnings: boolean;

  /**
   * Screen reader announcement frequency
   * - 'high': Announce every timer update
   * - 'low': Announce only major milestones
   * @default 'low'
   */
  screenReaderVerbosity: 'high' | 'low';
}


/**
 * Warning System Props
 *
 * Props for countdown warning system (audio/visual alerts)
 *
 * @example
 * ```tsx
 * <WarningSystem
 *   remainingMs={8000}
 *   warnAt={10000}
 *   preferences={accessibilityPrefs}
 *   onWarning={() => console.log('Warning triggered')}
 * />
 * ```
 */
export interface WarningSystemProps {
  /**
   * Current remaining time in milliseconds
   */
  remainingMs: number;

  /**
   * Threshold to trigger warning (in milliseconds)
   * @example 10000 for 10 seconds
   */
  warnAt: number;

  /**
   * User accessibility preferences
   */
  preferences: AccessibilityPreferences;

  /**
   * Optional callback when warning triggers
   */
  onWarning?: () => void;

  /**
   * Optional callback when warning stops
   */
  onWarningEnd?: () => void;
}


/**
 * Timer Preset
 *
 * Predefined time increment for quick timer setup
 * Used in AnalogCountdown, Countdown components
 *
 * @example
 * ```typescript
 * const preset: TimerPreset = {
 *   label: '+1h',
 *   valueMs: 3600000,
 *   colorToken: 'var(--analog-preset-1h)',
 *   timerType: 'analog'
 * };
 * ```
 */
export interface TimerPreset {
  /**
   * Display text for preset button
   * Keep short (≤8 characters) for UI space
   * @example "+1h", "+15min", "25m"
   */
  label: string;

  /**
   * Time value in milliseconds
   */
  valueMs: number;

  /**
   * Design token for button color
   * @example 'var(--analog-preset-1h)'
   */
  colorToken: string;

  /**
   * Which timer component uses this preset
   */
  timerType: 'analog' | 'countdown' | 'cycle';

  /**
   * Optional description for accessibility
   */
  description?: string;
}


/**
 * Chess Clock Player State
 *
 * State for a single player in Chess Clock
 *
 * @example
 * ```typescript
 * const player: ChessClockPlayer = {
 *   id: 'player1',
 *   name: 'White',
 *   remainingMs: 600000, // 10 minutes
 *   isActive: true,
 *   moveCount: 5
 * };
 * ```
 */
export interface ChessClockPlayer {
  /**
   * Unique player identifier
   */
  id: 'player1' | 'player2';

  /**
   * Player name (e.g., "White", "Black", or custom)
   */
  name: string;

  /**
   * Remaining time in milliseconds
   */
  remainingMs: number;

  /**
   * Whether this player's timer is currently running
   */
  isActive: boolean;

  /**
   * Number of moves made by this player
   */
  moveCount: number;

  /**
   * Design token for player background
   * @example 'var(--chess-white)' or 'var(--chess-black)'
   */
  colorToken: string;
}


/**
 * Design Token
 *
 * Represents a single CSS custom property (design token)
 *
 * NOTE: This is for documentation/tooling purposes.
 * Tokens are actually defined in CSS (:root in src/styles.css).
 *
 * @example
 * ```typescript
 * const token: DesignToken = {
 *   name: '--stopwatch-start',
 *   value: '#28a745',
 *   category: 'color',
 *   description: 'Green color for start/go actions in Stopwatch'
 * };
 * ```
 */
export interface DesignToken {
  /**
   * CSS custom property name (including --)
   * @example '--stopwatch-start'
   */
  name: string;

  /**
   * CSS value
   * @example '#28a745', '56px', '0 0 0 4px rgba(0,123,255,0.15)'
   */
  value: string;

  /**
   * Token category for organization
   */
  category: 'color' | 'spacing' | 'effect' | 'typography';

  /**
   * Purpose and usage context
   */
  description: string;

  /**
   * Optional: Which components use this token
   */
  usedBy?: string[];
}


/**
 * Type Guards
 *
 * Utility functions to validate interface types at runtime
 */

export function isAccessibilityPreferences(obj: unknown): obj is AccessibilityPreferences {
  if (typeof obj !== 'object' || obj === null) return false;
  const p = obj as AccessibilityPreferences;
  return (
    p.version === 1 &&
    (p.motionPreference === 'full' || p.motionPreference === 'reduced') &&
    typeof p.audioWarnings === 'boolean' &&
    typeof p.flashWarnings === 'boolean' &&
    (p.screenReaderVerbosity === 'high' || p.screenReaderVerbosity === 'low')
  );
}


/**
 * Default Values
 *
 * Recommended default values for interfaces
 */

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  version: 1,
  motionPreference: 'full',
  audioWarnings: true,
  flashWarnings: false, // CRITICAL: Opt-in for photosensitive epilepsy safety
  screenReaderVerbosity: 'low'
};


/**
 * Validation Functions
 *
 * Functions to validate prop values
 */

/**
 * Validates touch target size meets WCAG AA requirements
 * @param size - Width or height in pixels
 * @returns true if ≥44px (WCAG AA requirement)
 */
export function isValidTouchTarget(size: number): boolean {
  return size >= 44;
}

/**
 * Validates CTA button size meets minimum requirements
 * @param variant - Button size variant
 * @param size - Actual size in pixels
 * @returns true if meets minimum for variant
 */
export function isValidCTASize(variant: 'primary' | 'secondary', size: number): boolean {
  if (variant === 'primary') {
    return size >= 56; // Primary CTAs: ≥56×56px
  } else {
    return size >= 36; // Secondary CTAs: ≥36×36px
  }
}

/**
 * Validates color contrast ratio meets WCAG AA
 * Note: This is a placeholder - actual contrast calculation requires color parsing
 * Use WebAIM Contrast Checker or similar tool for real validation
 * @param foreground - Foreground color
 * @param background - Background color
 * @returns true if contrast ≥4.5:1 (text) or ≥3:1 (UI components)
 */
export function isValidContrast(foreground: string, background: string): boolean {
  // TODO: Implement contrast calculation or integrate with external library
  // For now, this is a placeholder that always returns true
  // Real implementation would parse colors and calculate luminance
  console.warn('isValidContrast is a placeholder - use WebAIM Contrast Checker for real validation');
  return true;
}


/**
 * Usage Notes
 *
 * 1. All interfaces MUST be implemented consistently across components
 * 2. AccessibilityPreferences MUST be persisted to localStorage (key: sc.v1.accessibility)
 * 3. CTAButton variant 'primary' MUST be ≥56×56px
 * 4. Flash warnings MUST default to false (opt-in for safety)
 * 5. All design tokens MUST be referenced via var(--token-name) in components
 * 6. Touch targets MUST be ≥44×44px for WCAG AA compliance
 * 7. Keyboard focus MUST show --focus-glow outline
 */
