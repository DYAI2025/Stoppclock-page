/**
 * Random Fact Generator & Facts Utilities
 * Loads and displays random facts from the knowledge base
 */

import type { TimerFact } from '../types/facts-types';

let cachedFacts: TimerFact[] | null = null;

/**
 * Load all facts from JSON
 */
export async function loadFacts(): Promise<TimerFact[]> {
  if (cachedFacts) return cachedFacts;

  try {
    const response = await fetch('/data/facts.json');
    const data = await response.json();
    cachedFacts = data.facts || [];
    return cachedFacts;
  } catch (error) {
    console.error('Failed to load facts:', error);
    return [];
  }
}

/**
 * Get a random fact
 */
export async function getRandomFact(language?: 'de' | 'en'): Promise<TimerFact | null> {
  const facts = await loadFacts();
  if (facts.length === 0) return null;

  // Filter by language if specified
  const filtered = language
    ? facts.filter(f => f.source.includes(language === 'en' ? 'English' : 'German'))
    : facts;

  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * Get random facts by category
 */
export async function getRandomFactsByCategory(
  category: string,
  count: number = 3
): Promise<TimerFact[]> {
  const facts = await loadFacts();
  const filtered = facts.filter(f => f.category === category);

  // Shuffle and take first N
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get fact of the day (deterministic based on date)
 */
export async function getFactOfTheDay(): Promise<TimerFact | null> {
  const facts = await loadFacts();
  if (facts.length === 0) return null;

  // Use date as seed for consistent daily fact
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  const index = dayOfYear % facts.length;
  return facts[index];
}

/**
 * Search facts by query
 */
export async function searchFacts(query: string): Promise<TimerFact[]> {
  const facts = await loadFacts();
  const lowerQuery = query.toLowerCase();

  return facts.filter(
    f =>
      f.title.toLowerCase().includes(lowerQuery) ||
      f.content.toLowerCase().includes(lowerQuery) ||
      f.tags.some(tag => tag.includes(lowerQuery))
  );
}
