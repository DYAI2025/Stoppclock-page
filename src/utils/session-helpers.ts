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
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Willkommen. Findet einen Sitzkreis. Erklärt die Regeln: Jeder spricht der Reihe nach, keine Unterbrechungen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 6 * 60 * 1000,
            focusText: 'Runde 1 - Vorstellungsrunde: Name, was bringt mich heute hierher, eine Hoffnung für heute.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: 'Kurze Pause. Atmet durch.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 6 * 60 * 1000,
            focusText: 'Runde 2 - Vertiefung: Was beschäftigt mich gerade? Wo stehe ich im Moment?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: 'Letzte Pause vor der Schlussrunde.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 4 * 60 * 1000,
            focusText: 'Runde 3 - Intention: Was nehme ich mir für heute vor? Eine kleine konkrete Handlung.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 3 * 60 * 1000,
            focusText: 'Stille Reflexion. Jeder für sich: Was hat mich berührt?',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Strukturierter Check-In mit stufenweiser Vertiefung (23 min)',
        }
      );

    case 'focus-session':
      return createSession(
        'Deep Work Focus Session',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 3 * 60 * 1000,
            focusText: 'Vorbereitung: Räume den Schreibtisch auf. Definiere EINE Hauptaufgabe für diese Session.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 45 * 60 * 1000,
            focusText: 'Deep Work Block 1: Volle Konzentration auf die Hauptaufgabe. Kein Multitasking.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 10 * 60 * 1000,
            focusText: 'Aktive Pause: Steh auf, geh raus, bewege dich. Kein Handy!',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 45 * 60 * 1000,
            focusText: 'Deep Work Block 2: Weiterarbeiten oder neue Aufgabe starten.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 7 * 60 * 1000,
            focusText: 'Review: Was habe ich geschafft? Was sind die nächsten 3 Schritte? Notiere Erfolge.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: "Cal Newport's Deep Work: 2× 45-min Blöcke (110 min)",
        }
      );

    case 'focus-session-short':
      return createSession(
        'Deep Work Focus Session (Kurz)',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Setup: Eine Aufgabe wählen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 50 * 60 * 1000,
            focusText: 'Ungestörte Arbeitszeit - Deep Work.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 5 * 60 * 1000,
            focusText: 'Review und nächste Schritte.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Schnelle Deep Work Session: 50-min Block (57 min)',
        }
      );

    case 'meditation':
      return createSession(
        'Guided Meditation',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 3 * 60 * 1000,
            focusText: 'Ankommen: Setze dich bequem hin. Schließe die Augen. Keine Leistung erwarten.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Phase 1 - Atem beobachten: Folge deinem natürlichen Atemfluss. Zähle nicht, beobachte nur.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 4 * 60 * 1000,
            focusText: 'Phase 2 - Body Scan: Wandere mit Aufmerksamkeit durch den Körper. Füße → Beine → Rumpf → Arme → Kopf.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 4 * 60 * 1000,
            focusText: 'Phase 3 - Offenes Gewahrsein: Lass den Fokus los. Nimm wahr, was auftaucht - Gedanken, Geräusche, Gefühle.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 3 * 60 * 1000,
            focusText: 'Rückführung: Vertiefe den Atem. Bewege Finger und Zehen. Öffne langsam die Augen.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Vipassana-Struktur: Ankern → Scannen → Öffnen (16 min)',
        }
      );

    case 'standup':
      return createSession(
        'Team Stand-Up Meeting',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: 'Stand-Up Regeln: Nur 3 Fragen - Was gestern? Was heute? Blocker? Lange Diskussionen → Parking Lot.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 90 * 1000,
            focusText: 'Person 1: Gestern | Heute | Blocker',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 90 * 1000,
            focusText: 'Person 2: Gestern | Heute | Blocker',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 90 * 1000,
            focusText: 'Person 3: Gestern | Heute | Blocker',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 90 * 1000,
            focusText: 'Person 4 (optional): Gestern | Heute | Blocker',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 90 * 1000,
            focusText: 'Person 5 (optional): Gestern | Heute | Blocker',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Parking Lot Topics: Wer muss mit wem nach dem Meeting sprechen?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 1 * 60 * 1000,
            focusText: 'Sprint-Ziel Check: Sind wir noch auf Kurs?',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Scrum Stand-Up mit Parking Lot (3-5 Personen, 13 min)',
        }
      );

    case 'presentation':
      return createSession(
        'Presentation Timer (23 min)',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Tech-Check: Slides funktionieren? Mikro ok? Atme tief durch.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 12 * 60 * 1000,
            focusText: 'Hauptteil: Eröffnung → Problem → Lösung → Beispiele',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: '⏰ WARNUNG: Noch 2 Minuten! Übergang zur Schlussfolie.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Schluss: Zusammenfassung + Call-to-Action',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 5 * 60 * 1000,
            focusText: 'Q&A: Fragen aus dem Publikum',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'TED-Talk-Format mit Tech-Check und Q&A (23 min)',
        }
      );

    case 'pitch-deck':
      return createSession(
        'Pitch Deck (13 min)',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: 'Pitch-Setup: Selbstvertrauen aufbauen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 7 * 60 * 1000,
            focusText: 'Pitch: Problem → Lösung → Markt → Team → Ask',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 1 * 60 * 1000,
            focusText: '⏰ WRAP UP!',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 4 * 60 * 1000,
            focusText: 'Investor Q&A',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Startup Pitch mit Investor Q&A (13 min)',
        }
      );

    case 'study-session':
      return createSession(
        'Study Session (50-10)',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Lernziel definieren: Was will ich in 50 min schaffen?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 40 * 60 * 1000,
            focusText: 'Fokus-Lernen: Lesen, Notizen machen, verstehen. Kein passives Konsumieren.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 5 * 60 * 1000,
            focusText: 'Active Recall: Buch zu! Was kann ich aus dem Gedächtnis aufschreiben?',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 5 * 60 * 1000,
            focusText: 'Feynman-Technik: Erkläre das Gelernte laut (als würdest du es jemand anderem beibringen).',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 10 * 60 * 1000,
            focusText: 'Pause: Bewegung, frische Luft, Snack. Kein Social Media!',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Evidenzbasiert: Active Recall + Feynman-Technik (62 min)',
        }
      );

    case 'breathing':
      return createSession(
        'Box Breathing Exercise',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Setup: Aufrecht sitzen. Füße flach auf dem Boden. Hände auf den Knien.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 2 * 60 * 1000,
            focusText: 'Box Breathing (4-4-4-4): Einatmen 4s → Halten 4s → Ausatmen 4s → Halten 4s. 6 Zyklen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: '4-7-8 Atmung (tiefe Entspannung): Einatmen 4s → Halten 7s → Ausatmen 8s. 4 Zyklen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 2 * 60 * 1000,
            focusText: 'Natürlicher Atem: Rückkehr zum normalen Rhythmus. Spüre die Ruhe.',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Huberman-Protokoll: Box → 4-7-8 Atmung (9 min)',
        }
      );

    case 'lightning-talks':
      return createSession(
        'Lightning Talks (5×3 min)',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Moderator: Begrüßung + Regeln erklären. Speaker 1 bereitmachen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 1: Problem → Lösung → Takeaway',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: '⏰ Zeit! Speaker wechselt.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 2: Problem → Lösung → Takeaway',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: '⏰ Zeit! Speaker wechselt.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 3: Problem → Lösung → Takeaway',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: '⏰ Zeit! Speaker wechselt.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 4: Problem → Lösung → Takeaway',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 30 * 1000,
            focusText: '⏰ Zeit! Speaker wechselt.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 3 * 60 * 1000,
            focusText: 'Speaker 5: Problem → Lösung → Takeaway',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 4 * 60 * 1000,
            focusText: 'Speed Feedback: 30 Sekunden pro Speaker - Was war dein Highlight?',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Ignite-Format mit Speed Feedback (23.5 min)',
        }
      );

    case 'creative-brainstorming':
      return createSession(
        'Kreatives Brainstorming',
        [
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Regel: Keine Kritik in Phase 1! Quantität > Qualität.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 10 * 60 * 1000,
            focusText: 'Divergentes Denken: Ideen wild sammeln. Post-its nutzen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'TRANSITION',
            durationMs: 2 * 60 * 1000,
            focusText: 'Pause: Bewegung, um den Kopf freizubekommen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 8 * 60 * 1000,
            focusText: 'Konvergentes Denken: Gruppieren, bewerten, Top 3 auswählen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'SPEAK',
            durationMs: 5 * 60 * 1000,
            focusText: 'Prototyping: Erste Schritte für Top-Idee planen.',
            createdAt: Date.now(),
          },
          {
            id: generateUUID(),
            type: 'COOLDOWN',
            durationMs: 3 * 60 * 1000,
            focusText: 'Action Items: Wer macht was bis wann?',
            createdAt: Date.now(),
          },
        ],
        {
          isTemplate: true,
          description: 'Design Thinking Brainstorming (Stanford d.school, 30 min)',
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
      description: 'Strukturierter Check-In mit stufenweiser Vertiefung',
      duration: '23 min',
    },
    {
      id: 'focus-session',
      name: 'Deep Work Focus Session',
      description: "Cal Newport's Deep Work: 2× 45-min Blöcke",
      duration: '110 min',
    },
    {
      id: 'focus-session-short',
      name: 'Deep Work Focus Session (Kurz)',
      description: 'Schnelle Deep Work Session: 50-min Block',
      duration: '57 min',
    },
    {
      id: 'meditation',
      name: 'Guided Meditation',
      description: 'Vipassana-Struktur: Ankern → Scannen → Öffnen',
      duration: '16 min',
    },
    {
      id: 'standup',
      name: 'Team Stand-Up Meeting',
      description: 'Scrum Stand-Up mit Parking Lot (3-5 Personen)',
      duration: '13 min',
    },
    {
      id: 'presentation',
      name: 'Presentation Timer (20 min)',
      description: 'TED-Talk-Format mit Tech-Check und Q&A',
      duration: '23 min',
    },
    {
      id: 'pitch-deck',
      name: 'Pitch Deck (10 min)',
      description: 'Startup Pitch mit Investor Q&A',
      duration: '13 min',
    },
    {
      id: 'study-session',
      name: 'Study Session (50-10)',
      description: 'Evidenzbasiert: Active Recall + Feynman-Technik',
      duration: '62 min',
    },
    {
      id: 'breathing',
      name: 'Box Breathing Exercise',
      description: 'Huberman-Protokoll: Box → 4-7-8 Atmung',
      duration: '9 min',
    },
    {
      id: 'lightning-talks',
      name: 'Lightning Talks (5×3 min)',
      description: 'Ignite-Format mit Speed Feedback',
      duration: '22 min',
    },
    {
      id: 'creative-brainstorming',
      name: 'Kreatives Brainstorming',
      description: 'Design Thinking Brainstorming (Stanford d.school)',
      duration: '30 min',
    },
  ];
}
