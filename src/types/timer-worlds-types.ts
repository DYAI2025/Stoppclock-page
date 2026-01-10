/**
 * Types for the Timer Worlds system
 * Each timer (Pomodoro, Countdown, etc.) has its own "World" with a story and rituals.
 */

export interface Ritual {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

export interface Effect {
  id: string;
  title: string;
  description: string;
}

export interface FactPlaque {
  id: string;
  title: string;
  content: string;
  category?: string;
  source?: string;
}

export interface TimerWorldData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  heroStory: string; // The "Character" part
  rituals: Ritual[];
  effects: Effect[];
  facts: FactPlaque[];
  updatedAt: string;
  accentColor?: string;
  locale?: 'en' | 'de';
}

export interface TimerWorldsIndex {
  version: number;
  generatedAt: string;
  worlds: Record<string, TimerWorldData>;
}
