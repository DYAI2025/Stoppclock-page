/**
 * Time Calculations Utilities
 * Shared functions for Since Then / Until Then calculations
 */

import type { TimeBreakdown, SeasonProgress, SeasonName } from '../types/meta-time-types';

/**
 * Calculate time elapsed since a past date
 */
export function getTimeSince(targetDate: Date, now: Date = new Date()): TimeBreakdown {
    const diff = now.getTime() - targetDate.getTime();

    if (diff < 0) {
        return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Approximate years and months
    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25);
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.max(0, Math.floor(remainingDaysAfterYears - (months * 30.44)));

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { years, months, days, hours, minutes, seconds, totalMs: diff };
}

/**
 * Calculate time remaining until a future date
 */
export function getTimeUntil(targetDate: Date, now: Date = new Date()): TimeBreakdown {
    const diff = targetDate.getTime() - now.getTime();

    if (diff < 0) {
        return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Approximate years and months
    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25);
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.max(0, Math.floor(remainingDaysAfterYears - (months * 30.44)));

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    return { years, months, days, hours, minutes, seconds, totalMs: diff };
}

/**
 * Season dates for Northern Hemisphere (approximate)
 */
const SEASON_DATES_NORTH: Record<SeasonName, { startMonth: number; startDay: number }> = {
    spring: { startMonth: 2, startDay: 20 },  // March 20
    summer: { startMonth: 5, startDay: 21 },  // June 21
    autumn: { startMonth: 8, startDay: 22 },  // September 22
    winter: { startMonth: 11, startDay: 21 }, // December 21
};

const SEASON_ORDER: SeasonName[] = ['spring', 'summer', 'autumn', 'winter'];

const SEASON_EMOJIS: Record<SeasonName, string> = {
    spring: '🌸',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
};

/**
 * Get current season and progress
 */
export function getSeasonProgress(now: Date = new Date(), hemisphere: 'north' | 'south' = 'north'): SeasonProgress {
    const year = now.getFullYear();

    // For southern hemisphere, offset by 2 seasons
    const seasonOffset = hemisphere === 'south' ? 2 : 0;

    // Calculate season start dates for current year
    const seasonDates = SEASON_ORDER.map((season, idx) => {
        const actualSeason = SEASON_ORDER[(idx + seasonOffset) % 4];
        const { startMonth, startDay } = SEASON_DATES_NORTH[season];
        return {
            season: actualSeason,
            date: new Date(year, startMonth, startDay),
        };
    });

    // Add next year's first season for wrap-around
    const firstSeasonNextYear = SEASON_ORDER[(0 + seasonOffset) % 4];
    const { startMonth: firstMonth, startDay: firstDay } = SEASON_DATES_NORTH[SEASON_ORDER[0]];
    seasonDates.push({
        season: firstSeasonNextYear,
        date: new Date(year + 1, firstMonth, firstDay),
    });

    // Also add previous year's winter for early-year dates
    const winterPrevYear = SEASON_ORDER[(3 + seasonOffset) % 4];
    const { startMonth: winterMonth, startDay: winterDay } = SEASON_DATES_NORTH['winter'];
    seasonDates.unshift({
        season: winterPrevYear,
        date: new Date(year - 1, winterMonth, winterDay),
    });

    // Find current season
    let currentIdx = 0;
    for (let i = 0; i < seasonDates.length - 1; i++) {
        if (now >= seasonDates[i].date && now < seasonDates[i + 1].date) {
            currentIdx = i;
            break;
        }
    }

    const currentSeason = seasonDates[currentIdx].season;
    const startDate = seasonDates[currentIdx].date;
    const endDate = seasonDates[currentIdx + 1].date;

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progressPercent = Math.round((elapsed / totalDuration) * 100);

    const msPerDay = 24 * 60 * 60 * 1000;
    const daysElapsed = Math.floor(elapsed / msPerDay);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / msPerDay);

    return {
        current: currentSeason,
        startDate,
        endDate,
        progressPercent: Math.min(100, Math.max(0, progressPercent)),
        daysElapsed,
        daysRemaining: Math.max(0, daysRemaining),
        emoji: SEASON_EMOJIS[currentSeason],
    };
}

/**
 * Format time breakdown as human readable string
 */
export function formatTimeBreakdown(tb: TimeBreakdown, compact = false): string {
    if (compact) {
        if (tb.years > 0) return `${tb.years}y ${tb.months}mo`;
        if (tb.months > 0) return `${tb.months}mo ${tb.days}d`;
        if (tb.days > 0) return `${tb.days}d ${tb.hours}h`;
        if (tb.hours > 0) return `${tb.hours}h ${tb.minutes}m`;
        return `${tb.minutes}m ${tb.seconds}s`;
    }

    const parts: string[] = [];
    if (tb.years > 0) parts.push(`${tb.years} year${tb.years !== 1 ? 's' : ''}`);
    if (tb.months > 0) parts.push(`${tb.months} month${tb.months !== 1 ? 's' : ''}`);
    if (tb.days > 0) parts.push(`${tb.days} day${tb.days !== 1 ? 's' : ''}`);

    return parts.join(', ') || 'Just now';
}
