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
    date: new Date('0001-01-01T00:00:00Z'), // Placeholder - actual value uses symbolicYearsAgo
    category: 'space',
    description: 'The birth of our universe (~13.8 billion years ago)',
    color: '#9333EA', // Purple
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 30% 20%, rgba(147, 51, 234, 0.2), transparent 60%)',
      particleEffect: 'stars',
      accentGlow: 'rgba(147, 51, 234, 0.4)',
      fontStyle: 'futuristic',
      icon: '🌌',
    },
    timeFact: 'More seconds have passed than there are stars visible to the naked eye (~10,000)',
    symbolicYearsAgo: 13_800_000_000, // 13.8 billion years
    isSymbolic: true,
  },
  {
    id: 'moon-landing',
    name: 'Apollo 11 Moon Landing',
    date: new Date('1969-07-20T20:17:00Z'),
    category: 'space',
    description: 'One small step for man, one giant leap for mankind',
    color: '#6366F1', // Indigo
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 70% 30%, rgba(99, 102, 241, 0.15), transparent 50%)',
      particleEffect: 'stars',
      accentGlow: 'rgba(99, 102, 241, 0.3)',
      fontStyle: 'futuristic',
      icon: '🌙',
    },
    timeFact: 'The journey took 8 days – you could watch Star Wars ~25 times on the way',
  },
  {
    id: 'hubble-launch',
    name: 'Hubble Space Telescope Launch',
    date: new Date('1990-04-24T12:33:51Z'),
    category: 'space',
    description: 'Our window to the cosmos',
    color: '#8B5CF6', // Violet
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.12), transparent 55%)',
      particleEffect: 'stars',
      accentGlow: 'rgba(139, 92, 246, 0.35)',
      fontStyle: 'futuristic',
      icon: '🔭',
    },
    timeFact: 'Hubble orbits Earth at 27,300 km/h – faster than a speeding bullet',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1 Launch',
    date: new Date('1977-09-05T12:56:00Z'),
    category: 'space',
    description: 'Farthest human-made object from Earth',
    color: '#A855F7', // Purple-light
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.18), transparent 55%)',
      particleEffect: 'stars',
      accentGlow: 'rgba(168, 85, 247, 0.3)',
      fontStyle: 'futuristic',
      icon: '🛸',
    },
    timeFact: 'It carries a Golden Record with sounds of Earth – including a kiss and a heartbeat',
  },

  // HISTORIC EVENTS
  {
    id: 'pyramids',
    name: 'Great Pyramid of Giza',
    date: new Date('0001-01-01T00:00:00Z'), // Placeholder - actual value uses symbolicYearsAgo
    category: 'history',
    description: 'Construction completed around 2560 BCE',
    color: '#F59E0B', // Amber
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 80%, rgba(245, 158, 11, 0.15), transparent 55%)',
      particleEffect: 'dust',
      accentGlow: 'rgba(245, 158, 11, 0.25)',
      fontStyle: 'archival',
      icon: '🏛️',
    },
    timeFact: 'The pyramid was the tallest structure on Earth for 3,800 years',
    symbolicYearsAgo: 4584, // ~2560 BCE + 2024 CE
    isSymbolic: true,
  },
  {
    id: 'titanic',
    name: 'Sinking of the Titanic',
    date: new Date('1912-04-15T02:20:00Z'),
    category: 'history',
    description: 'The "unsinkable" ship meets its fate',
    color: '#3B82F6', // Blue
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 90%, rgba(59, 130, 246, 0.2), transparent 60%)',
      particleEffect: 'bubbles',
      accentGlow: 'rgba(59, 130, 246, 0.3)',
      fontStyle: 'archival',
      icon: '🚢',
    },
    timeFact: 'The wreck lies 3.8 km deep – a free fall from there would take ~27 seconds',
  },
  {
    id: 'berlin-wall',
    name: 'Fall of the Berlin Wall',
    date: new Date('1989-11-09T18:53:00Z'),
    category: 'history',
    description: 'Symbol of division comes down',
    color: '#EF4444', // Red
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 40% 60%, rgba(239, 68, 68, 0.12), transparent 50%)',
      particleEffect: 'dust',
      accentGlow: 'rgba(239, 68, 68, 0.25)',
      fontStyle: 'archival',
      icon: '🧱',
    },
    timeFact: 'The wall stood for 10,316 days – roughly 28 years, 2 months, and 27 days',
  },
  {
    id: 'wwii-end',
    name: 'End of World War II',
    date: new Date('1945-09-02T09:00:00Z'),
    category: 'history',
    description: 'Victory over Japan Day',
    color: '#10B981', // Green
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 30% 70%, rgba(16, 185, 129, 0.15), transparent 55%)',
      particleEffect: 'leaves',
      accentGlow: 'rgba(16, 185, 129, 0.25)',
      fontStyle: 'archival',
      icon: '🕊️',
    },
    timeFact: 'The war lasted 2,194 days – longer than 6 years of your life',
  },
  {
    id: 'american-independence',
    name: 'US Declaration of Independence',
    date: new Date('1776-07-04T12:00:00Z'),
    category: 'history',
    description: 'Birth of a nation',
    color: '#DC2626', // Red-dark
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 60% 40%, rgba(220, 38, 38, 0.1), transparent 50%)',
      particleEffect: 'dust',
      accentGlow: 'rgba(220, 38, 38, 0.2)',
      fontStyle: 'archival',
      icon: '📜',
    },
    timeFact: 'Benjamin Franklin was 70 when he signed it – older than some countries today',
  },

  // SCIENCE & TECHNOLOGY
  {
    id: 'first-computer',
    name: 'First Electronic Computer (ENIAC)',
    date: new Date('1946-02-14T00:00:00Z'),
    category: 'science',
    description: 'The digital age begins',
    color: '#06B6D4', // Cyan
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.15), transparent 55%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(6, 182, 212, 0.3)',
      fontStyle: 'modern',
      icon: '🖥️',
    },
    timeFact: 'ENIAC weighed 30 tons – your phone is 100 million times faster',
  },
  {
    id: 'internet-birth',
    name: 'First ARPANET Message',
    date: new Date('1969-10-29T22:30:00Z'),
    category: 'science',
    description: 'The internet is born',
    color: '#14B8A6', // Teal
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 70% 30%, rgba(20, 184, 166, 0.12), transparent 50%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(20, 184, 166, 0.25)',
      fontStyle: 'modern',
      icon: '🌐',
    },
    timeFact: 'The first message was "LO" – they tried to type "LOGIN" but it crashed',
  },
  {
    id: 'www-launch',
    name: 'World Wide Web Goes Public',
    date: new Date('1991-08-06T00:00:00Z'),
    category: 'science',
    description: 'The web becomes accessible to all',
    color: '#0EA5E9', // Sky
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 40% 60%, rgba(14, 165, 233, 0.15), transparent 55%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(14, 165, 233, 0.3)',
      fontStyle: 'modern',
      icon: '🕸️',
    },
    timeFact: 'The first website is still online at info.cern.ch – try visiting it!',
  },
  {
    id: 'penicillin',
    name: 'Discovery of Penicillin',
    date: new Date('1928-09-28T00:00:00Z'),
    category: 'science',
    description: 'Fleming discovers the first antibiotic',
    color: '#10B981', // Emerald
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 60% 70%, rgba(16, 185, 129, 0.12), transparent 50%)',
      particleEffect: 'none',
      accentGlow: 'rgba(16, 185, 129, 0.2)',
      fontStyle: 'organic',
      icon: '🔬',
    },
    timeFact: 'It was discovered by accident – Fleming forgot to clean his petri dishes',
  },
  {
    id: 'dna-structure',
    name: 'DNA Double Helix Discovered',
    date: new Date('1953-02-28T00:00:00Z'),
    category: 'science',
    description: 'Watson and Crick unlock the code of life',
    color: '#22C55E', // Green-light
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 50%, rgba(34, 197, 94, 0.12), transparent 50%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(34, 197, 94, 0.25)',
      fontStyle: 'organic',
      icon: '🧬',
    },
    timeFact: 'Your DNA, if uncoiled, would stretch to the sun and back 600 times',
  },
  {
    id: 'iphone-launch',
    name: 'First iPhone Released',
    date: new Date('2007-06-29T18:00:00Z'),
    category: 'science',
    description: 'The smartphone revolution begins',
    color: '#64748B', // Slate
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 40%, rgba(100, 116, 139, 0.15), transparent 50%)',
      particleEffect: 'none',
      accentGlow: 'rgba(100, 116, 139, 0.2)',
      fontStyle: 'modern',
      icon: '📱',
    },
    timeFact: 'The first iPhone had 128 MB RAM – less than a single photo today',
  },

  // CULTURE & ARTS
  {
    id: 'gutenberg-bible',
    name: 'Gutenberg Bible Printed',
    date: new Date('1455-01-01T00:00:00Z'),
    category: 'culture',
    description: 'First major book printed with movable type',
    color: '#7C3AED', // Violet-dark
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 40% 60%, rgba(124, 58, 237, 0.12), transparent 50%)',
      particleEffect: 'dust',
      accentGlow: 'rgba(124, 58, 237, 0.2)',
      fontStyle: 'archival',
      icon: '📖',
    },
    timeFact: 'Only 49 copies survive today – each worth over 30 million dollars',
  },
  {
    id: 'woodstock',
    name: 'Woodstock Festival',
    date: new Date('1969-08-15T17:00:00Z'),
    category: 'culture',
    description: '3 days of peace, music, and love',
    color: '#EC4899', // Pink
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 30% 30%, rgba(236, 72, 153, 0.15), transparent 55%)',
      particleEffect: 'leaves',
      accentGlow: 'rgba(236, 72, 153, 0.25)',
      fontStyle: 'organic',
      icon: '🎸',
    },
    timeFact: '400,000 people attended – more than the population of Iceland',
  },
  {
    id: 'beatles-rooftop',
    name: 'Beatles Final Live Performance',
    date: new Date('1969-01-30T12:30:00Z'),
    category: 'culture',
    description: 'Legendary rooftop concert in London',
    color: '#F472B6', // Pink-light
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 60% 20%, rgba(244, 114, 182, 0.12), transparent 50%)',
      particleEffect: 'none',
      accentGlow: 'rgba(244, 114, 182, 0.2)',
      fontStyle: 'modern',
      icon: '🎤',
    },
    timeFact: 'The performance lasted 42 minutes before police shut it down',
  },
  {
    id: 'live-aid',
    name: 'Live Aid Concert',
    date: new Date('1985-07-13T12:00:00Z'),
    category: 'culture',
    description: 'Global concert for famine relief',
    color: '#FB923C', // Orange
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 40%, rgba(251, 146, 60, 0.15), transparent 55%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(251, 146, 60, 0.25)',
      fontStyle: 'modern',
      icon: '🎵',
    },
    timeFact: '1.9 billion people watched – 40% of the world\'s population',
  },

  // RECENT MILESTONES
  {
    id: 'covid-pandemic',
    name: 'COVID-19 Pandemic Declared',
    date: new Date('2020-03-11T00:00:00Z'),
    category: 'history',
    description: 'WHO declares global pandemic',
    color: '#EF4444', // Red
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.1), transparent 50%)',
      particleEffect: 'none',
      accentGlow: 'rgba(239, 68, 68, 0.15)',
      fontStyle: 'modern',
      icon: '🦠',
    },
    timeFact: 'People washed their hands more in 2020 than in any other year in history',
  },
  {
    id: 'millennium',
    name: 'The New Millennium',
    date: new Date('2000-01-01T00:00:00Z'),
    category: 'history',
    description: 'Y2K - The year 2000',
    color: '#F59E0B', // Amber
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 30%, rgba(245, 158, 11, 0.15), transparent 55%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(245, 158, 11, 0.25)',
      fontStyle: 'futuristic',
      icon: '🎆',
    },
    timeFact: 'Companies spent $300 billion fixing the Y2K bug – mostly for nothing',
  },
  {
    id: 'chatgpt-launch',
    name: 'ChatGPT Launch',
    date: new Date('2022-11-30T00:00:00Z'),
    category: 'science',
    description: 'AI becomes accessible to everyone',
    color: '#10B981', // Green
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 60% 40%, rgba(16, 185, 129, 0.15), transparent 55%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(16, 185, 129, 0.3)',
      fontStyle: 'futuristic',
      icon: '🤖',
    },
    timeFact: 'It reached 100 million users in 2 months – faster than any app in history',
  },

  // PERSONAL MILESTONES (Templates)
  {
    id: 'today',
    name: 'Right Now',
    date: new Date(),
    category: 'personal',
    description: 'This very moment',
    color: '#EC4899', // Pink
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.12), transparent 50%)',
      particleEffect: 'sparkles',
      accentGlow: 'rgba(236, 72, 153, 0.2)',
      fontStyle: 'modern',
      icon: '✨',
    },
    timeFact: 'Every second, 4 babies are born and 2 people pass away',
  },
  {
    id: 'this-year',
    name: 'Start of This Year',
    date: new Date(new Date().getFullYear(), 0, 1),
    category: 'personal',
    description: 'January 1st of current year',
    color: '#06B6D4', // Cyan
    visualTheme: {
      ambientGradient: 'radial-gradient(ellipse at 50% 30%, rgba(6, 182, 212, 0.12), transparent 50%)',
      particleEffect: 'none',
      accentGlow: 'rgba(6, 182, 212, 0.2)',
      fontStyle: 'modern',
      icon: '📅',
    },
    timeFact: 'The Earth has traveled ~940 million km around the Sun since then',
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
