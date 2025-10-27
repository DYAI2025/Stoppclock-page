/**
 * Cooking Timer preset configurations
 * Provides default times and labels for common cooking tasks
 */

import type { CookingPresetId } from '../types/timer-types';

export interface PresetConfig {
  id: CookingPresetId;
  label: string;
  defaultMinutes: number;
  emoji: string;
}

// Preset configurations with suggested default times
export const COOKING_PRESETS: PresetConfig[] = [
  { id: 'stove', label: 'Stove', defaultMinutes: 20, emoji: '🔥' },
  { id: 'oven', label: 'Oven', defaultMinutes: 25, emoji: '♨️' },
  { id: 'pasta', label: 'Pasta', defaultMinutes: 10, emoji: '🍝' },
  { id: 'rice', label: 'Rice', defaultMinutes: 15, emoji: '🍚' },
  { id: 'eggs', label: 'Eggs', defaultMinutes: 7, emoji: '🥚' },
  { id: 'tea', label: 'Tea', defaultMinutes: 3, emoji: '🍵' },
];

// Soft color palette (10 colors) for auto-rotation
// Pastel colors that work well on dark ocean background
export const SOFT_COLORS = [
  '#FFB3BA', // Soft pink
  '#FFDFBA', // Soft peach
  '#FFFFBA', // Soft yellow
  '#BAFFC9', // Soft mint
  '#BAE1FF', // Soft blue
  '#E0BBE4', // Soft lavender
  '#FFD6A5', // Soft orange
  '#CAFFBF', // Soft green
  '#A0C4FF', // Soft periwinkle
  '#FFC6FF'  // Soft rose
];

// Helper function to get preset by ID
export function getPreset(id: CookingPresetId): PresetConfig | undefined {
  return COOKING_PRESETS.find(p => p.id === id);
}

// Helper function to get default duration in milliseconds
export function getPresetDurationMs(id: CookingPresetId, customMinutes?: number): number {
  if (id === 'custom' && customMinutes !== undefined) {
    return customMinutes * 60 * 1000;
  }
  const preset = getPreset(id);
  return preset ? preset.defaultMinutes * 60 * 1000 : 10 * 60 * 1000; // fallback 10min
}

// Helper function to get next color from palette
export function getNextColor(currentIndex: number): { color: string; nextIndex: number } {
  const color = SOFT_COLORS[currentIndex % SOFT_COLORS.length];
  const nextIndex = (currentIndex + 1) % SOFT_COLORS.length;
  return { color, nextIndex };
}
