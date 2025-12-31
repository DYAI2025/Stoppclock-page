/**
 * Custom Timer Presets - Utility Functions
 * Handles CRUD operations, validation, and localStorage persistence
 */

import type {
  TimerPreset,
  PresetsState,
  TimerType,
  PresetConfig,
  PresetValidationResult
} from '../types/preset-types';
import { PRESET_CONSTRAINTS } from '../types/preset-types';

const STORAGE_KEY = 'sc.v1.presets';
const BACKUP_KEY = 'sc.v1.presets.backup';

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return 'preset-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
}

/**
 * Load presets from localStorage
 */
export function loadPresets(): PresetsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { version: 1, presets: [] };
    }

    const state = JSON.parse(raw) as PresetsState;

    // Validate version
    if (state.version !== 1) {
      console.warn('Preset version mismatch, resetting');
      return { version: 1, presets: [] };
    }

    // Validate structure
    if (!Array.isArray(state.presets)) {
      console.warn('Invalid presets structure');
      return { version: 1, presets: [] };
    }

    return state;
  } catch (error) {
    console.error('Failed to load presets:', error);
    // Try backup
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (backup) {
        console.log('Restoring from backup');
        return JSON.parse(backup) as PresetsState;
      }
    } catch (backupError) {
      console.error('Backup also failed:', backupError);
    }
    return { version: 1, presets: [] };
  }
}

/**
 * Save presets to localStorage with backup
 */
export function savePresets(state: PresetsState): void {
  try {
    const serialized = JSON.stringify(state);

    // Create backup of current state first
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      localStorage.setItem(BACKUP_KEY, current);
    }

    // Save new state
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save presets:', error);
    throw new Error('Failed to save preset. Storage may be full.');
  }
}

/**
 * Validate preset name
 */
export function validatePresetName(name: string): PresetValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name darf nicht leer sein');
  }

  if (name.length > PRESET_CONSTRAINTS.MAX_NAME_LENGTH) {
    errors.push(`Name darf maximal ${PRESET_CONSTRAINTS.MAX_NAME_LENGTH} Zeichen lang sein`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate preset config
 */
export function validatePresetConfig(type: TimerType, config: PresetConfig): PresetValidationResult {
  const errors: string[] = [];

  switch (type) {
    case 'pomodoro':
    case 'cycle':
      if (!config.workDuration || config.workDuration <= 0) {
        errors.push('Arbeitsdauer muss größer als 0 sein');
      }
      if (!config.breakDuration || config.breakDuration <= 0) {
        errors.push('Pausendauer muss größer als 0 sein');
      }
      break;

    case 'countdown':
    case 'analog':
      if (!config.durationMs && !config.hours && !config.minutes && !config.seconds) {
        errors.push('Dauer muss angegeben werden');
      }
      break;

    case 'cooking':
      if (!config.timers || config.timers.length === 0) {
        errors.push('Mindestens ein Timer muss konfiguriert sein');
      }
      break;

    case 'chess':
      if (!config.player1Time || config.player1Time <= 0) {
        errors.push('Spieler 1 Zeit muss größer als 0 sein');
      }
      if (!config.player2Time || config.player2Time <= 0) {
        errors.push('Spieler 2 Zeit muss größer als 0 sein');
      }
      break;

    case 'metronome':
      if (!config.bpm || config.bpm < 40 || config.bpm > 240) {
        errors.push('BPM muss zwischen 40 und 240 liegen');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create a new preset
 */
export function createPreset(
  name: string,
  icon: string,
  type: TimerType,
  config: PresetConfig
): TimerPreset {
  // Validate
  const nameValidation = validatePresetName(name);
  if (!nameValidation.valid) {
    throw new Error(nameValidation.errors.join(', '));
  }

  const configValidation = validatePresetConfig(type, config);
  if (!configValidation.valid) {
    throw new Error(configValidation.errors.join(', '));
  }

  // Create preset
  const preset: TimerPreset = {
    id: generateUUID(),
    name: name.trim(),
    icon: icon || '⏱️',
    type,
    config,
    createdAt: Date.now(),
    usageCount: 0
  };

  return preset;
}

/**
 * Add preset to state
 */
export function addPreset(preset: TimerPreset): void {
  const state = loadPresets();

  // Check limit
  if (state.presets.length >= PRESET_CONSTRAINTS.MAX_PRESETS) {
    throw new Error(`Maximal ${PRESET_CONSTRAINTS.MAX_PRESETS} Presets erlaubt. Lösche alte Presets um neue zu erstellen.`);
  }

  // Check for duplicate names
  const duplicate = state.presets.find(p => p.name.toLowerCase() === preset.name.toLowerCase());
  if (duplicate) {
    throw new Error(`Ein Preset mit dem Namen "${preset.name}" existiert bereits`);
  }

  state.presets.push(preset);
  savePresets(state);
}

/**
 * Delete preset by ID
 */
export function deletePreset(id: string): void {
  const state = loadPresets();
  state.presets = state.presets.filter(p => p.id !== id);
  savePresets(state);
}

/**
 * Update preset
 */
export function updatePreset(id: string, updates: Partial<TimerPreset>): void {
  const state = loadPresets();
  const index = state.presets.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Preset nicht gefunden');
  }

  // Validate name if updated
  if (updates.name !== undefined) {
    const nameValidation = validatePresetName(updates.name);
    if (!nameValidation.valid) {
      throw new Error(nameValidation.errors.join(', '));
    }

    // Check for duplicate (excluding current)
    const duplicate = state.presets.find(
      p => p.id !== id && p.name.toLowerCase() === updates.name!.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`Ein Preset mit dem Namen "${updates.name}" existiert bereits`);
    }
  }

  state.presets[index] = {
    ...state.presets[index],
    ...updates
  };

  savePresets(state);
}

/**
 * Increment usage count
 */
export function incrementUsage(id: string): void {
  const state = loadPresets();
  const preset = state.presets.find(p => p.id === id);

  if (preset) {
    preset.usageCount++;
    preset.lastUsed = Date.now();
    savePresets(state);
  }
}

/**
 * Get preset by ID
 */
export function getPreset(id: string): TimerPreset | null {
  const state = loadPresets();
  return state.presets.find(p => p.id === id) || null;
}

/**
 * Get all presets
 */
export function getAllPresets(): TimerPreset[] {
  const state = loadPresets();
  return state.presets;
}

/**
 * Get presets by type
 */
export function getPresetsByType(type: TimerType): TimerPreset[] {
  const state = loadPresets();
  return state.presets.filter(p => p.type === type);
}

/**
 * Get most used presets (for Popular Timers Widget)
 */
export function getMostUsedPresets(limit: number = 5): TimerPreset[] {
  const state = loadPresets();
  return [...state.presets]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

/**
 * Clear all presets (for testing/debugging)
 */
export function clearAllPresets(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_KEY);
}

/**
 * Export presets as JSON (for backup/sharing)
 */
export function exportPresets(): string {
  const state = loadPresets();
  return JSON.stringify(state, null, 2);
}

/**
 * Import presets from JSON
 */
export function importPresets(json: string): void {
  try {
    const state = JSON.parse(json) as PresetsState;

    // Validate structure
    if (!state.version || !Array.isArray(state.presets)) {
      throw new Error('Ungültiges Format');
    }

    savePresets(state);
  } catch (error) {
    throw new Error('Import fehlgeschlagen: Ungültiges JSON');
  }
}
