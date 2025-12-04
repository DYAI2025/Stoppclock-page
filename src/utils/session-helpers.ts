/**
 * Custom Sessions - Helper Utilities
 *
 * Validation, formatting, and utility functions for Custom Sessions.
 */

import type {
  SessionElement,
  CustomSession,
  ValidationResult,
  ValidationError,
  ElementFormState,
} from '../types/custom-session-types';
import {
  ELEMENT_CONSTRAINTS,
  SESSION_CONSTRAINTS,
} from '../types/custom-session-types';

// ============================================================================
// UUID Generation
// ============================================================================

/**
 * Generate a UUID v4
 *
 * Simple implementation using crypto.randomUUID() if available,
 * otherwise falls back to Math.random() based approach.
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// Time Formatting
// ============================================================================

/**
 * Format milliseconds as MM:SS
 *
 * @example
 * formatTime(125000) // "02:05"
 * formatTime(5000)   // "00:05"
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format milliseconds as human-readable duration
 *
 * @example
 * formatDuration(125000) // "2 min 5 sec"
 * formatDuration(5000)   // "5 sec"
 * formatDuration(60000)  // "1 min"
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);

  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate a session element
 *
 * Checks:
 * - type: Required
 * - durationMs: 30s - 30min
 * - focusText: 1-500 characters
 * - name: Max 50 characters (optional)
 */
export function validateElement(element: Partial<SessionElement>): ValidationResult {
  const errors: ValidationError[] = [];

  // Type validation
  if (!element.type) {
    errors.push({
      field: 'type',
      message: 'Element type is required',
    });
  }

  // Duration validation
  if (!element.durationMs) {
    errors.push({
      field: 'durationMs',
      message: 'Duration is required',
    });
  } else {
    if (element.durationMs < ELEMENT_CONSTRAINTS.MIN_DURATION_MS) {
      errors.push({
        field: 'durationMs',
        message: `Minimum duration is 30 seconds (currently: ${Math.floor(element.durationMs / 1000)}s)`,
      });
    }

    if (element.durationMs > ELEMENT_CONSTRAINTS.MAX_DURATION_MS) {
      const minutes = Math.floor(element.durationMs / 60000);
      errors.push({
        field: 'durationMs',
        message: `Maximum duration is 30 minutes (currently: ${minutes} min)`,
      });
    }
  }

  // Focus text validation
  if (!element.focusText || element.focusText.trim().length === 0) {
    errors.push({
      field: 'focusText',
      message: 'Focus text is required',
    });
  } else {
    const length = element.focusText.length;

    if (length > ELEMENT_CONSTRAINTS.MAX_FOCUS_TEXT_LENGTH) {
      errors.push({
        field: 'focusText',
        message: `Focus text too long (${length}/${ELEMENT_CONSTRAINTS.MAX_FOCUS_TEXT_LENGTH} characters)`,
      });
    }
  }

  // Name validation (optional field)
  if (element.name && element.name.length > ELEMENT_CONSTRAINTS.MAX_NAME_LENGTH) {
    errors.push({
      field: 'name',
      message: `Name too long (max ${ELEMENT_CONSTRAINTS.MAX_NAME_LENGTH} characters)`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a custom session
 *
 * Checks:
 * - name: 1-50 characters
 * - elements: At least 1 element, all valid
 * - description: Max 200 characters (if template)
 */
export function validateSession(session: Partial<CustomSession>): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!session.name || session.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Session name is required',
    });
  } else if (session.name.length > SESSION_CONSTRAINTS.MAX_NAME_LENGTH) {
    errors.push({
      field: 'name',
      message: `Name too long (max ${SESSION_CONSTRAINTS.MAX_NAME_LENGTH} characters)`,
    });
  }

  // Elements validation
  if (!session.elements || session.elements.length === 0) {
    errors.push({
      field: 'elements',
      message: 'Session must have at least 1 element',
    });
  } else {
    // Validate each element
    session.elements.forEach((element, index) => {
      const elementValidation = validateElement(element);
      if (!elementValidation.valid) {
        elementValidation.errors.forEach((error) => {
          errors.push({
            field: `elements[${index}].${error.field}`,
            message: `Element ${index + 1}: ${error.message}`,
          });
        });
      }
    });

    // Check element count
    if (session.elements.length > SESSION_CONSTRAINTS.MAX_ELEMENTS) {
      errors.push({
        field: 'elements',
        message: `Too many elements (max ${SESSION_CONSTRAINTS.MAX_ELEMENTS} recommended)`,
      });
    }
  }

  // Description validation (if template)
  if (session.isTemplate && session.description) {
    if (session.description.length > SESSION_CONSTRAINTS.MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: 'description',
        message: `Description too long (max ${SESSION_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters)`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Session Calculations
// ============================================================================

/**
 * Calculate total duration of a session
 *
 * @param elements Array of session elements
 * @returns Total duration in milliseconds
 */
export function calculateTotalDuration(elements: SessionElement[]): number {
  return elements.reduce((total, element) => total + element.durationMs, 0);
}

/**
 * Calculate elapsed time in session (up to current element)
 *
 * @param elements Array of session elements
 * @param currentIndex Current element index
 * @param remainingMs Remaining time in current element
 * @returns Elapsed time in milliseconds
 */
export function calculateElapsedTime(
  elements: SessionElement[],
  currentIndex: number,
  remainingMs: number
): number {
  // Sum of all completed elements
  const completedMs = elements
    .slice(0, currentIndex)
    .reduce((total, element) => total + element.durationMs, 0);

  // Add elapsed time in current element
  const currentElement = elements[currentIndex];
  const currentElapsed = currentElement ? currentElement.durationMs - remainingMs : 0;

  return completedMs + currentElapsed;
}

// ============================================================================
// Element Creation
// ============================================================================

/**
 * Create a new session element from form state
 *
 * @param formState Form state from ElementFormState
 * @returns New SessionElement
 */
export function createElementFromForm(formState: ElementFormState): SessionElement {
  const durationMs = formState.durationMinutes * 60 * 1000 + formState.durationSeconds * 1000;

  return {
    id: generateUUID(),
    type: formState.type || 'SPEAK',
    durationMs,
    focusText: formState.focusText.trim(),
    name: formState.name.trim() || undefined,
    createdAt: Date.now(),
  };
}

/**
 * Create an empty element form state
 *
 * @returns Initial ElementFormState
 */
export function createEmptyElementForm(): ElementFormState {
  return {
    type: null,
    durationMinutes: 5,
    durationSeconds: 0,
    focusText: '',
    name: '',
  };
}

/**
 * Convert element to form state (for editing)
 *
 * @param element SessionElement to edit
 * @returns ElementFormState
 */
export function elementToFormState(element: SessionElement): ElementFormState {
  const totalSeconds = Math.floor(element.durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    type: element.type,
    durationMinutes: minutes,
    durationSeconds: seconds,
    focusText: element.focusText,
    name: element.name || '',
  };
}

// ============================================================================
// Session Creation
// ============================================================================

/**
 * Create a new custom session
 *
 * @param name Session name
 * @param elements Array of session elements
 * @param options Optional fields (isTemplate, description)
 * @returns New CustomSession
 */
export function createSession(
  name: string,
  elements: SessionElement[],
  options: { isTemplate?: boolean; description?: string } = {}
): CustomSession {
  return {
    id: generateUUID(),
    name: name.trim(),
    elements,
    isTemplate: options.isTemplate || false,
    description: options.description?.trim(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
  };
}

/**
 * Clone a session (for templates)
 *
 * @param session Session to clone
 * @param newName Optional new name
 * @returns Cloned CustomSession with new ID
 */
export function cloneSession(session: CustomSession, newName?: string): CustomSession {
  return {
    ...session,
    id: generateUUID(),
    name: newName || `${session.name} (Copy)`,
    isTemplate: false, // Clones are not templates by default
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ============================================================================
// Element Type Helpers
// ============================================================================

/**
 * Get default focus text for element type
 *
 * @param type Element type
 * @returns Suggested focus text
 */
export function getDefaultFocusText(type: SessionElement['type']): string {
  switch (type) {
    case 'SPEAK':
      return 'Share your thoughts on...';
    case 'TRANSITION':
      return 'Pause and reflect. Take deep breaths.';
    case 'COOLDOWN':
      return 'Wind down. No follow-up conversation.';
    case 'CUSTOM':
      return '';
    default:
      return '';
  }
}

// ============================================================================
// Element Templates (Quick Add)
// ============================================================================

/**
 * Create element from template
 *
 * Pre-configured element types for quick creation.
 */
export function createElementTemplate(templateId: string): Partial<SessionElement> {
  const now = Date.now();

  switch (templateId) {
    case 'speak-5min':
      return {
        type: 'SPEAK',
        durationMs: 5 * 60 * 1000,
        focusText: 'Share your thoughts on...',
      };

    case 'speak-10min':
      return {
        type: 'SPEAK',
        durationMs: 10 * 60 * 1000,
        focusText: 'Deep dive into...',
      };

    case 'break-1min':
      return {
        type: 'TRANSITION',
        durationMs: 1 * 60 * 1000,
        focusText: 'Quick pause. Breathe.',
      };

    case 'break-5min':
      return {
        type: 'TRANSITION',
        durationMs: 5 * 60 * 1000,
        focusText: 'Break: Step away from your screen.',
      };

    case 'cooldown-2min':
      return {
        type: 'COOLDOWN',
        durationMs: 2 * 60 * 1000,
        focusText: 'Wind down. Silent reflection.',
      };

    case 'cooldown-5min':
      return {
        type: 'COOLDOWN',
        durationMs: 5 * 60 * 1000,
        focusText: 'Closing thoughts. Review what you learned.',
      };

    default:
      return {
        type: 'SPEAK',
        durationMs: 5 * 60 * 1000,
        focusText: '',
      };
  }
}

/**
 * List all available element templates
 *
 * @returns Array of element template metadata
 */
export function listElementTemplates(): Array<{ id: string; label: string; type: SessionElement['type']; duration: string }> {
  return [
    { id: 'speak-5min', label: 'Speak (5 min)', type: 'SPEAK', duration: '5:00' },
    { id: 'speak-10min', label: 'Speak (10 min)', type: 'SPEAK', duration: '10:00' },
    { id: 'break-1min', label: 'Break (1 min)', type: 'TRANSITION', duration: '1:00' },
    { id: 'break-5min', label: 'Break (5 min)', type: 'TRANSITION', duration: '5:00' },
    { id: 'cooldown-2min', label: 'Cooldown (2 min)', type: 'COOLDOWN', duration: '2:00' },
    { id: 'cooldown-5min', label: 'Cooldown (5 min)', type: 'COOLDOWN', duration: '5:00' },
  ];
}

// ============================================================================
// Preset Sessions (Quick Start)
// ============================================================================

/**
 * Create a preset session template
 *
 * These are pre-built sessions for quick start.
 */
export function createPresetSession(presetId: string): CustomSession | null {
  switch (presetId) {
    case 'workshop-checkin':
      return createSession(
        'Workshop Check-In (3 rounds)',
        [
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 5 * 60 * 1000,
            focusText: 'Round 1: Share your current state and what brought you here today.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: 'Pause. Reflect on what you just heard.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 5 * 60 * 1000,
            focusText: 'Round 2: What are you hoping to get out of this session?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: 'Pause. Reflect on what you just heard.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Round 3: Quick closing thoughts.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 2 * 60 * 1000,
            focusText: 'Silent reflection. No conversation.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Quick check-in for workshops or team meetings (20 minutes total)',
        }
      );

    case 'focus-session':
      return createSession(
        'Deep Work Focus Session',
        [
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 25 * 60 * 1000,
            focusText: 'Deep work block: Focus on your most important task.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 5 * 60 * 1000,
            focusText: 'Break: Step away from your desk. Stretch. Hydrate.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 25 * 60 * 1000,
            focusText: 'Deep work block 2: Continue or start a new task.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 10 * 60 * 1000,
            focusText: 'Review your progress. Plan next steps.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Pomodoro-style focus session (65 minutes total)',
        }
      );

    case 'meditation':
      return createSession(
        'Guided Meditation',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Settle into a comfortable position. Close your eyes. Breathe naturally.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 10 * 60 * 1000,
            focusText: 'Focus on your breath. Notice each inhale and exhale. When your mind wanders, gently return to the breath.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 3 * 60 * 1000,
            focusText: 'Slowly bring awareness back to your body. Wiggle fingers and toes. Open your eyes when ready.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Simple mindfulness meditation (15 minutes)',
        }
      );

    case 'standup':
      return createSession(
        'Team Stand-Up Meeting',
        [
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Person 1: What did you do yesterday? What will you do today? Any blockers?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Person 2: What did you do yesterday? What will you do today? Any blockers?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Person 3: What did you do yesterday? What will you do today? Any blockers?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Person 4: What did you do yesterday? What will you do today? Any blockers?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Person 5: What did you do yesterday? What will you do today? Any blockers?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 2 * 60 * 1000,
            focusText: 'Any quick announcements or follow-up items?',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Daily stand-up for 5-person team (12 minutes)',
        }
      );

    case 'presentation':
      return createSession(
        'Presentation Timer (20 min)',
        [
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 15 * 60 * 1000,
            focusText: 'Main presentation content. Deliver your key points.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 3 * 60 * 1000,
            focusText: '⚠️ 3 minutes remaining! Wrap up your main points.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 2 * 60 * 1000,
            focusText: 'Final thoughts and call to action.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Conference talk timer with 3-minute warning (20 min)',
        }
      );

    case 'study-session':
      return createSession(
        'Study Session (50-10)',
        [
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 50 * 60 * 1000,
            focusText: 'Study block: Focus on learning. No distractions.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 10 * 60 * 1000,
            focusText: 'Break: Move around, get a snack, rest your eyes.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'University study pattern: 50 min focus, 10 min break (60 min)',
        }
      );

    case 'breathing':
      return createSession(
        'Box Breathing Exercise',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: 'Get comfortable. Sit upright with feet flat on the floor.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 4 * 60 * 1000,
            focusText: 'Box breathing: Inhale 4 counts, Hold 4, Exhale 4, Hold 4. Repeat.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 1 * 60 * 1000,
            focusText: 'Return to natural breathing. Notice how you feel.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Quick stress-relief breathing technique (6 min)',
        }
      );

    case 'lightning-talks':
      return createSession(
        'Lightning Talks (5×3 min)',
        [
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 1: Share your idea in 3 minutes.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: 'Transition: Next speaker get ready.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 2: Share your idea in 3 minutes.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: 'Transition: Next speaker get ready.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 3: Share your idea in 3 minutes.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: 'Transition: Next speaker get ready.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 4: Share your idea in 3 minutes.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: 'Transition: Next speaker get ready.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 5: Share your idea in 3 minutes.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 2 * 60 * 1000,
            focusText: 'Wrap-up and final thoughts.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: '5 quick presentations with transitions (19 min)',
        }
      );

    default:
      return null;
  }
}

/**
 * List all available preset sessions
 *
 * @returns Array of preset metadata
 */
export function listPresets(): Array<{ id: string; name: string; description: string; duration: string }> {
  return [
    {
      id: 'workshop-checkin',
      name: 'Workshop Check-In (3 rounds)',
      description: 'Quick check-in for workshops or team meetings',
      duration: '20 min',
    },
    {
      id: 'focus-session',
      name: 'Deep Work Focus Session',
      description: 'Pomodoro-style focus session with breaks',
      duration: '65 min',
    },
    {
      id: 'meditation',
      name: 'Guided Meditation',
      description: 'Simple mindfulness meditation',
      duration: '15 min',
    },
    {
      id: 'standup',
      name: 'Team Stand-Up Meeting',
      description: 'Daily stand-up for 5-person team',
      duration: '12 min',
    },
    {
      id: 'presentation',
      name: 'Presentation Timer (20 min)',
      description: 'Conference talk timer with 3-minute warning',
      duration: '20 min',
    },
    {
      id: 'study-session',
      name: 'Study Session (50-10)',
      description: 'University study pattern: 50 min focus, 10 min break',
      duration: '60 min',
    },
    {
      id: 'breathing',
      name: 'Box Breathing Exercise',
      description: 'Quick stress-relief breathing technique',
      duration: '6 min',
    },
    {
      id: 'lightning-talks',
      name: 'Lightning Talks (5×3 min)',
      description: '5 quick presentations with transitions',
      duration: '19 min',
    },
  ];
}
