/**
 * Custom Sessions - Type Definitions
 *
 * Core data structures for Custom Sessions feature.
 * Based on planning docs: custom-session-user-stories.md, CORE_ARCHITECTURE.md
 */

// ============================================================================
// Element Types
// ============================================================================

/**
 * Type of session element
 *
 * - SPEAK: Active speaking/working phase
 * - TRANSITION: Break/pause between activities
 * - COOLDOWN: Winding down, reflection
 * - CUSTOM: User-defined type
 */
export type ElementType = 'SPEAK' | 'TRANSITION' | 'COOLDOWN' | 'CUSTOM';

/**
 * Core building block of a custom session
 *
 * Validation rules:
 * - durationMs: 30000 - 1800000 (30 seconds - 30 minutes)
 * - focusText: 1 - 500 characters
 */
export interface SessionElement {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Type of element */
  type: ElementType;

  /** Duration in milliseconds (30s - 30min) */
  durationMs: number;

  /** Text displayed during this element (1-500 chars) */
  focusText: string;

  /** Optional custom name for this element */
  name?: string;

  /** Creation timestamp */
  createdAt: number;
}

// ============================================================================
// Session Types
// ============================================================================

/**
 * Custom session containing one or more elements
 *
 * Can be saved as a template for reuse.
 */
export interface CustomSession {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Session name (1-50 chars) */
  name: string;

  /** Ordered list of session elements */
  elements: SessionElement[];

  /** If true, appears in templates library */
  isTemplate: boolean;

  /** Optional description (for templates) */
  description?: string;

  /** Creation timestamp */
  createdAt: number;

  /** Last modification timestamp */
  updatedAt: number;

  /** Version for future migrations */
  version: 1;
}

// ============================================================================
// Runtime State
// ============================================================================

/**
 * Phase of session execution
 *
 * - IDLE: Not started yet
 * - RUNNING: Timer active
 * - PAUSED: Timer paused by user
 * - COMPLETED: All elements finished
 */
export type SessionPhase = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

/**
 * Runtime state for actively running session
 *
 * Persisted to localStorage to survive page reloads.
 */
export interface SessionRuntimeState {
  /** ID of the session being run */
  sessionId: string;

  /** Current element index (0-based) */
  currentElementIndex: number;

  /** Remaining milliseconds in current element */
  remainingMs: number;

  /** Timer is actively counting down */
  running: boolean;

  /** When current element started (for drift-resistant timing) */
  startedAt: number | null;

  /** Current phase */
  phase: SessionPhase;

  /** Number of elements completed so far */
  completedElements: number;

  /** Total session duration (sum of all elements) */
  totalDurationMs: number;

  /** Version for future migrations */
  version: 1;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation error for element or session
 */
export interface ValidationError {
  /** Field that failed validation */
  field: string;

  /** Human-readable error message */
  message: string;
}

/**
 * Result of validation
 */
export interface ValidationResult {
  /** True if validation passed */
  valid: boolean;

  /** List of errors (empty if valid) */
  errors: ValidationError[];
}

// ============================================================================
// Form State Types (for UI)
// ============================================================================

/**
 * Form state for adding/editing element
 */
export interface ElementFormState {
  type: ElementType | null;
  durationMinutes: number;
  durationSeconds: number;
  focusText: string;
  name: string;
}

/**
 * Form state for session metadata
 */
export interface SessionFormState {
  name: string;
  description: string;
  isTemplate: boolean;
}

// ============================================================================
// Storage Keys
// ============================================================================

/**
 * localStorage keys for Custom Sessions
 */
export const STORAGE_KEYS = {
  /** All saved sessions: Record<string, CustomSession> */
  SESSIONS: 'sc.v1.custom-sessions',

  /** Current runtime state: SessionRuntimeState | null */
  RUNTIME: 'sc.v1.custom-session-runtime',

  /** Array of session IDs that are templates: string[] */
  TEMPLATES: 'sc.v1.session-templates',
} as const;

// ============================================================================
// Constants
// ============================================================================

/**
 * Validation constraints for elements
 */
export const ELEMENT_CONSTRAINTS = {
  /** Minimum duration (30 seconds) */
  MIN_DURATION_MS: 30 * 1000,

  /** Maximum duration (30 minutes) */
  MAX_DURATION_MS: 30 * 60 * 1000,

  /** Minimum focus text length */
  MIN_FOCUS_TEXT_LENGTH: 1,

  /** Maximum focus text length */
  MAX_FOCUS_TEXT_LENGTH: 500,

  /** Maximum element name length */
  MAX_NAME_LENGTH: 50,
} as const;

/**
 * Validation constraints for sessions
 */
export const SESSION_CONSTRAINTS = {
  /** Minimum session name length */
  MIN_NAME_LENGTH: 1,

  /** Maximum session name length */
  MAX_NAME_LENGTH: 50,

  /** Minimum number of elements */
  MIN_ELEMENTS: 1,

  /** Maximum number of elements (soft limit for UX) */
  MAX_ELEMENTS: 20,

  /** Maximum description length */
  MAX_DESCRIPTION_LENGTH: 200,
} as const;

/**
 * Color palette for element types
 */
export const ELEMENT_COLORS: Record<ElementType, string> = {
  SPEAK: '#4CAF50',      // Green
  TRANSITION: '#FF9800', // Orange
  COOLDOWN: '#9E9E9E',   // Gray
  CUSTOM: '#2196F3',     // Blue
} as const;

/**
 * Element type labels (user-facing)
 * Neutral labels that work for all use cases (speaking, meditation, work, etc.)
 */
export const ELEMENT_TYPE_LABELS: Record<ElementType, string> = {
  SPEAK: 'Focus Phase',
  TRANSITION: 'Transition',
  COOLDOWN: 'Wind Down',
  CUSTOM: 'Custom',
} as const;
