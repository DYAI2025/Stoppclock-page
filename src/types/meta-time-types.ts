/**
 * Meta Time Types
 * Types for Time Lab: Since Then / Until Then markers, seasons, calendars
 */

// Time breakdown structure
export interface TimeBreakdown {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
}

// Event type: past (since) or future (until)
export type MetaEventType = 'since' | 'until';

// Event categories
export type MetaEventCategory =
    | 'astronomical'   // Solstice, Equinox, Full Moon
    | 'seasonal'       // Seasons
    | 'cultural'       // New Year, Christmas
    | 'historical'     // Titanic, WWII, Moon Landing
    | 'cosmic'         // Big Bang
    | 'personal';      // User-defined

// Meta event definition
export interface MetaEvent {
    id: string;
    name: string;
    description: string;
    date: Date;
    type: MetaEventType;
    category: MetaEventCategory;
    color: string;
    emoji?: string;
    isSymbolic?: boolean;      // e.g., Big Bang (approximate)
    sourceHint?: string;       // Source attribution
    recurrence?: 'yearly' | 'monthly' | 'none';
}

// Season names
export type SeasonName = 'spring' | 'summer' | 'autumn' | 'winter';

// Season progress information
export interface SeasonProgress {
    current: SeasonName;
    startDate: Date;
    endDate: Date;
    progressPercent: number;
    daysElapsed: number;
    daysRemaining: number;
    emoji: string;
}

// Calendar types for multi-new-year
export type CalendarType = 'gregorian' | 'chinese' | 'thai' | 'islamic' | 'hebrew';

// New Year marker
export interface NewYearMarker {
    id: string;
    name: string;
    calendarType: CalendarType;
    nextDate: Date;
    color: string;
    emoji: string;
}

// Time Lab state (for localStorage persistence)
export interface TimeLabState {
    version: number;
    selectedTab: 'since' | 'until' | 'seasons' | 'newyear';
    favoriteEventIds: string[];
}
