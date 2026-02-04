/**
 * Types for the Timer Facts system
 * Facts are educational content about time, clocks, and productivity
 */

export type FactCategory =
  | 'history'      // History of timekeeping
  | 'technology'   // Technology and innovation
  | 'culture'      // Culture and society
  | 'science'      // Science and physics
  | 'productivity' // Productivity techniques
  | 'psychology';  // Psychology of time

export interface TimerFact {
  id: string;
  title: string;
  content: string;
  category: FactCategory;
  source: string; // Original filename
  tags: string[];
  wordCount: number;
}

export interface FactSection {
  id: string;
  heading: string;
  level: number; // 1, 2, 3 for h1, h2, h3
  content: string;
  category: FactCategory;
  facts: TimerFact[];
}

export interface FactDocument {
  id: string;
  title: string;
  source: string;
  sections: FactSection[];
  totalFacts: number;
  language: 'de' | 'en';
}
