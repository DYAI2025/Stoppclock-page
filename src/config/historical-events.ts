/**
 * Historical Events Presets for Time Since Timer
 * Curated collection of significant moments in human history
 */

import type { HistoricalEvent } from '../types/timer-types';

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // SPACE & COSMOS
  {
    id: 'big-bang',
    name: 'The Big Bang',
    date: new Date('0001-01-01T00:00:00Z'), // Symbolic - ~13.8 billion years ago
    category: 'space',
    description: 'The birth of our universe',
    color: '#9333EA', // Purple
  },
  {
    id: 'moon-landing',
    name: 'Apollo 11 Moon Landing',
    date: new Date('1969-07-20T20:17:00Z'),
    category: 'space',
    description: 'One small step for man, one giant leap for mankind',
    color: '#6366F1', // Indigo
  },
  {
    id: 'hubble-launch',
    name: 'Hubble Space Telescope Launch',
    date: new Date('1990-04-24T12:33:51Z'),
    category: 'space',
    description: 'Our window to the cosmos',
    color: '#8B5CF6', // Violet
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1 Launch',
    date: new Date('1977-09-05T12:56:00Z'),
    category: 'space',
    description: 'Farthest human-made object from Earth',
    color: '#A855F7', // Purple-light
  },

  // HISTORIC EVENTS
  {
    id: 'pyramids',
    name: 'Great Pyramid of Giza',
    date: new Date('-2560-01-01T00:00:00Z'), // ~2560 BCE
    category: 'history',
    description: 'Construction completed around 2560 BCE',
    color: '#F59E0B', // Amber
  },
  {
    id: 'titanic',
    name: 'Sinking of the Titanic',
    date: new Date('1912-04-15T02:20:00Z'),
    category: 'history',
    description: 'The "unsinkable" ship meets its fate',
    color: '#3B82F6', // Blue
  },
  {
    id: 'berlin-wall',
    name: 'Fall of the Berlin Wall',
    date: new Date('1989-11-09T18:53:00Z'),
    category: 'history',
    description: 'Symbol of division comes down',
    color: '#EF4444', // Red
  },
  {
    id: 'wwii-end',
    name: 'End of World War II',
    date: new Date('1945-09-02T09:00:00Z'),
    category: 'history',
    description: 'Victory over Japan Day',
    color: '#10B981', // Green
  },
  {
    id: 'american-independence',
    name: 'US Declaration of Independence',
    date: new Date('1776-07-04T12:00:00Z'),
    category: 'history',
    description: 'Birth of a nation',
    color: '#DC2626', // Red-dark
  },

  // SCIENCE & TECHNOLOGY
  {
    id: 'first-computer',
    name: 'First Electronic Computer (ENIAC)',
    date: new Date('1946-02-14T00:00:00Z'),
    category: 'science',
    description: 'The digital age begins',
    color: '#06B6D4', // Cyan
  },
  {
    id: 'internet-birth',
    name: 'First ARPANET Message',
    date: new Date('1969-10-29T22:30:00Z'),
    category: 'science',
    description: 'The internet is born',
    color: '#14B8A6', // Teal
  },
  {
    id: 'www-launch',
    name: 'World Wide Web Goes Public',
    date: new Date('1991-08-06T00:00:00Z'),
    category: 'science',
    description: 'The web becomes accessible to all',
    color: '#0EA5E9', // Sky
  },
  {
    id: 'penicillin',
    name: 'Discovery of Penicillin',
    date: new Date('1928-09-28T00:00:00Z'),
    category: 'science',
    description: 'Fleming discovers the first antibiotic',
    color: '#10B981', // Emerald
  },
  {
    id: 'dna-structure',
    name: 'DNA Double Helix Discovered',
    date: new Date('1953-02-28T00:00:00Z'),
    category: 'science',
    description: 'Watson and Crick unlock the code of life',
    color: '#22C55E', // Green-light
  },
  {
    id: 'iphone-launch',
    name: 'First iPhone Released',
    date: new Date('2007-06-29T18:00:00Z'),
    category: 'science',
    description: 'The smartphone revolution begins',
    color: '#64748B', // Slate
  },

  // CULTURE & ARTS
  {
    id: 'gutenberg-bible',
    name: 'Gutenberg Bible Printed',
    date: new Date('1455-01-01T00:00:00Z'),
    category: 'culture',
    description: 'First major book printed with movable type',
    color: '#7C3AED', // Violet-dark
  },
  {
    id: 'woodstock',
    name: 'Woodstock Festival',
    date: new Date('1969-08-15T17:00:00Z'),
    category: 'culture',
    description: '3 days of peace, music, and love',
    color: '#EC4899', // Pink
  },
  {
    id: 'beatles-rooftop',
    name: 'Beatles Final Live Performance',
    date: new Date('1969-01-30T12:30:00Z'),
    category: 'culture',
    description: 'Legendary rooftop concert in London',
    color: '#F472B6', // Pink-light
  },
  {
    id: 'live-aid',
    name: 'Live Aid Concert',
    date: new Date('1985-07-13T12:00:00Z'),
    category: 'culture',
    description: 'Global concert for famine relief',
    color: '#FB923C', // Orange
  },

  // RECENT MILESTONES
  {
    id: 'covid-pandemic',
    name: 'COVID-19 Pandemic Declared',
    date: new Date('2020-03-11T00:00:00Z'),
    category: 'history',
    description: 'WHO declares global pandemic',
    color: '#EF4444', // Red
  },
  {
    id: 'millennium',
    name: 'The New Millennium',
    date: new Date('2000-01-01T00:00:00Z'),
    category: 'history',
    description: 'Y2K - The year 2000',
    color: '#F59E0B', // Amber
  },
  {
    id: 'chatgpt-launch',
    name: 'ChatGPT Launch',
    date: new Date('2022-11-30T00:00:00Z'),
    category: 'science',
    description: 'AI becomes accessible to everyone',
    color: '#10B981', // Green
  },

  // PERSONAL MILESTONES (Templates)
  {
    id: 'today',
    name: 'Right Now',
    date: new Date(),
    category: 'personal',
    description: 'This very moment',
    color: '#EC4899', // Pink
  },
  {
    id: 'this-year',
    name: 'Start of This Year',
    date: new Date(new Date().getFullYear(), 0, 1),
    category: 'personal',
    description: 'January 1st of current year',
    color: '#06B6D4', // Cyan
  },
];

// Helper to get event by ID
export function getEventById(id: string): HistoricalEvent | undefined {
  return HISTORICAL_EVENTS.find(event => event.id === id);
}

// Helper to get events by category
export function getEventsByCategory(category: HistoricalEvent['category']): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(event => event.category === category);
}

// Category display names
export const CATEGORY_NAMES: Record<HistoricalEvent['category'], string> = {
  space: '🚀 Space & Cosmos',
  history: '📜 Historic Events',
  science: '🔬 Science & Technology',
  culture: '🎭 Culture & Arts',
  personal: '⭐ Personal Milestones',
};
