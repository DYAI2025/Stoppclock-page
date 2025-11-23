import type { SessionPreset } from '../types/timer-types';

/**
 * Predefined session templates for couples dialogue (Zwiegespräch)
 * Based on Moeller's structured dialogue method
 */
export const SESSION_PRESETS: SessionPreset[] = [
  {
    id: 'klassisch-90',
    name: 'Klassisch 90 Minuten',
    description: 'Standard Zwiegespräch: 3× 15 Minuten pro Person mit Vorbereitung und Abschluss',
    totalDurationMs: 90 * 60 * 1000, // 90 minutes
    prepDurationMs: 5 * 60 * 1000,   // 5 minutes preparation
    slotDurationMs: 15 * 60 * 1000,  // 15 minutes per speaking slot
    slotsPerPerson: 3,                // 3 slots per person (A→B→A→B→A→B)
    transitionDurationMs: 5 * 1000,   // 5 seconds transition
    closingDurationMs: 2 * 60 * 1000, // 2 minutes closing per person
    cooldownDurationMs: 30 * 60 * 1000 // 30 minutes no-follow-up cooldown
  },
  {
    id: 'einsteiger-60',
    name: 'Einsteiger 60 Minuten',
    description: 'Kürzere Variante für Anfänger: 2× 10 Minuten pro Person',
    totalDurationMs: 60 * 60 * 1000, // 60 minutes
    prepDurationMs: 3 * 60 * 1000,   // 3 minutes preparation
    slotDurationMs: 10 * 60 * 1000,  // 10 minutes per speaking slot
    slotsPerPerson: 2,                // 2 slots per person (A→B→A→B)
    transitionDurationMs: 5 * 1000,   // 5 seconds transition
    closingDurationMs: 1 * 60 * 1000, // 1 minute closing per person
    cooldownDurationMs: 20 * 60 * 1000 // 20 minutes no-follow-up cooldown
  },
  {
    id: 'eltern-kind-60',
    name: 'Eltern-Kind 60 Minuten',
    description: 'Angepasst für Eltern-Kind-Gespräche: 2× 10 Minuten',
    totalDurationMs: 60 * 60 * 1000, // 60 minutes
    prepDurationMs: 3 * 60 * 1000,   // 3 minutes preparation
    slotDurationMs: 10 * 60 * 1000,  // 10 minutes per speaking slot
    slotsPerPerson: 2,                // 2 slots per person
    transitionDurationMs: 5 * 1000,   // 5 seconds transition
    closingDurationMs: 1 * 60 * 1000, // 1 minute closing per person
    cooldownDurationMs: 15 * 60 * 1000 // 15 minutes no-follow-up cooldown
  }
];

/**
 * Phase-specific guidance text (microcopy)
 */
export const PHASE_GUIDANCE = {
  SETUP: {
    title: 'Zwiegespräch Setup',
    text: 'Wähle ein Profil und ein Preset, um die Session zu starten.'
  },
  PREP: {
    title: 'Vorbereitung',
    text: 'Findet einen ruhigen Ort. Schaltet Ablenkungen aus. Atmet tief durch. Bereitet euch innerlich vor.'
  },
  A_SPEAKS: {
    title: '{nameA} spricht',
    text: '{nameB}: Höre zu, ohne zu unterbrechen. {nameA}: Bleib bei dir. Sprich über dich, nicht über den anderen.'
  },
  B_SPEAKS: {
    title: '{nameB} spricht',
    text: '{nameA}: Höre zu, ohne zu unterbrechen. {nameB}: Bleib bei dir. Sprich über dich, nicht über den anderen.'
  },
  TRANSITION: {
    title: 'Rollenwechsel',
    text: 'Kurze Pause. Atmet durch. Bereitet euch auf eure Rolle vor.'
  },
  A_CLOSING: {
    title: '{nameA} Abschluss',
    text: 'Zeit für ein kurzes Resümee. Was nimmst du mit?'
  },
  B_CLOSING: {
    title: '{nameB} Abschluss',
    text: 'Zeit für ein kurzes Resümee. Was nimmst du mit?'
  },
  COOLDOWN: {
    title: 'Nachgesprächsverbot',
    text: 'Kein Nachgespräch jetzt. Lasst das Gespräch sacken. Die Gedanken brauchen Zeit zu wirken.'
  },
  COMPLETED: {
    title: 'Session beendet',
    text: 'Gut gemacht! Das Zwiegespräch ist abgeschlossen.'
  }
};

/**
 * Get preset by ID
 */
export function getPresetById(id: string): SessionPreset | undefined {
  return SESSION_PRESETS.find(p => p.id === id);
}
