/**
 * Until Events Configuration
 * Future events for "Until Then" countdowns
 */

import type { MetaEvent } from '../types/meta-time-types';

// Helper to get next occurrence of a yearly date
function getNextOccurrence(month: number, day: number, hour = 0): Date {
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), month, day, hour);

    if (thisYear > now) {
        return thisYear;
    }
    return new Date(now.getFullYear() + 1, month, day, hour);
}

export const UNTIL_EVENTS: MetaEvent[] = [
    // ==================
    // ASTRONOMICAL
    // ==================
    {
        id: 'summer-solstice',
        name: 'Summer Solstice',
        description: 'Longest day of the year (Northern Hemisphere)',
        date: getNextOccurrence(5, 21, 4), // June 21, ~4am UTC
        type: 'until',
        category: 'astronomical',
        color: '#F59E0B',
        emoji: '☀️',
        recurrence: 'yearly',
    },
    {
        id: 'winter-solstice',
        name: 'Winter Solstice',
        description: 'Shortest day of the year (Northern Hemisphere)',
        date: getNextOccurrence(11, 21, 15), // December 21, ~3pm UTC
        type: 'until',
        category: 'astronomical',
        color: '#3B82F6',
        emoji: '❄️',
        recurrence: 'yearly',
    },
    {
        id: 'spring-equinox',
        name: 'Spring Equinox',
        description: 'Day and night are equal length',
        date: getNextOccurrence(2, 20, 12), // March 20
        type: 'until',
        category: 'astronomical',
        color: '#22C55E',
        emoji: '🌱',
        recurrence: 'yearly',
    },
    {
        id: 'autumn-equinox',
        name: 'Autumn Equinox',
        description: 'Day and night are equal length',
        date: getNextOccurrence(8, 22, 12), // September 22
        type: 'until',
        category: 'astronomical',
        color: '#EA580C',
        emoji: '🍂',
        recurrence: 'yearly',
    },

    // ==================
    // CULTURAL / HOLIDAYS
    // ==================
    {
        id: 'christmas',
        name: 'Christmas',
        description: 'December 25th',
        date: getNextOccurrence(11, 25, 0), // December 25
        type: 'until',
        category: 'cultural',
        color: '#DC2626',
        emoji: '🎄',
        recurrence: 'yearly',
    },
    {
        id: 'new-year',
        name: 'New Year',
        description: 'Welcome to the new year',
        date: getNextOccurrence(0, 1, 0), // January 1
        type: 'until',
        category: 'cultural',
        color: '#8B5CF6',
        emoji: '🎆',
        recurrence: 'yearly',
    },
    {
        id: 'halloween',
        name: 'Halloween',
        description: 'Spooky season arrives',
        date: getNextOccurrence(9, 31, 18), // October 31
        type: 'until',
        category: 'cultural',
        color: '#F97316',
        emoji: '🎃',
        recurrence: 'yearly',
    },
    {
        id: 'valentines',
        name: "Valentine's Day",
        description: 'Day of love',
        date: getNextOccurrence(1, 14, 0), // February 14
        type: 'until',
        category: 'cultural',
        color: '#EC4899',
        emoji: '💕',
        recurrence: 'yearly',
    },

    // ==================
    // MULTI-CALENDAR NEW YEARS
    // ==================
    {
        id: 'chinese-new-year-2025',
        name: 'Chinese New Year 2025',
        description: 'Year of the Snake',
        date: new Date('2025-01-29T00:00:00'),
        type: 'until',
        category: 'cultural',
        color: '#EF4444',
        emoji: '🐍',
    },
    {
        id: 'thai-new-year-2025',
        name: 'Songkran 2025',
        description: 'Thai New Year Water Festival',
        date: new Date('2025-04-13T00:00:00'),
        type: 'until',
        category: 'cultural',
        color: '#06B6D4',
        emoji: '💦',
    },
];

// Category display names
export const UNTIL_CATEGORY_NAMES: Record<string, string> = {
    astronomical: '🔭 Astronomical Events',
    cultural: '🎉 Holidays & Celebrations',
};

// Get event by ID
export function getUntilEventById(id: string): MetaEvent | undefined {
    return UNTIL_EVENTS.find(e => e.id === id);
}

// Get events by category
export function getUntilEventsByCategory(category: MetaEvent['category']): MetaEvent[] {
    return UNTIL_EVENTS.filter(e => e.category === category);
}
