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
// "Warm Everyday Rituals" palette (Golden Hour + Botanical Garden)
export const SOFT_COLORS = [
  '#E3B505', // Mustard Yellow
  '#CC5803', // Terracotta
  '#4F7942', // Fern Green
  '#EAA221', // Marigold
  '#8A9A5B', // Sage Green
  '#C2B280', // Sand
  '#E6D2B5', // Warm Graphite/Beige
  '#D97D54', // Burnt Orange
  '#556B2F', // Dark Olive
  '#F4A460'  // Sandy Brown
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
