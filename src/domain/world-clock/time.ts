import { WorldClockEntry, DayPeriod } from './types';

export function getLocalTimeParts(timezone: string, date: Date = new Date()): { hours: number; minutes: number; dayOfWeek: string } {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            weekday: 'short',
            hour12: false,
        });

        // Format usually returns "Mon, 14:30" or similar depending on locale, 
        // but parsing parts is safer.
        const parts = formatter.formatToParts(date);
        const hourPart = parts.find(p => p.type === 'hour')?.value;
        const minutePart = parts.find(p => p.type === 'minute')?.value;
        const weekdayPart = parts.find(p => p.type === 'weekday')?.value;

        return {
            hours: parseInt(hourPart || '0', 10),
            minutes: parseInt(minutePart || '0', 10),
            dayOfWeek: weekdayPart || '',
        };
    } catch (e) {
        console.error(`Error formatting time for ${timezone}`, e);
        return { hours: 0, minutes: 0, dayOfWeek: '' };
    }
}

export function getDayPeriod(hours: number): DayPeriod {
    if (hours >= 5 && hours < 8) return 'early';
    if (hours >= 8 && hours < 11) return 'morning';
    if (hours >= 11 && hours < 17) return 'day';
    if (hours >= 17 && hours < 21) return 'evening';
    if (hours >= 21 || hours < 1) return 'night'; // 21-01
    return 'lateNight'; // 01-05
}

export function getOffsetDescription(targetTz: string, referenceTz?: string): string {
    const now = new Date();

    // Get offset in minutes for target
    const getOffsetMinutes = (tz: string) => {
        // Hacky but works without libraries: 
        // Format date in target TZ to ISO string, compare with UTC? 
        // Actually, simple standard way:
        // We can't easily get 'raw' offset from Intl without parsing.

        // Alternative: 
        // Create a date string in that timezone, parse it back as UTC, compare diff.
        const str = now.toLocaleString('en-US', { timeZone: tz });
        const localDate = new Date(str);
        const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' });
        const utcDate = new Date(utcStr);

        // This approach has issues with DST borders but is okay for rough offset display MVP.
        // Better: use the difference in 'hours' of the same instant.
        return (localDate.getTime() - utcDate.getTime()) / 60000;
    };

    try {
        // Default reference is local system time
        const targetOffset = getOffsetMinutes(targetTz);
        const refOffset = referenceTz ? getOffsetMinutes(referenceTz) : -now.getTimezoneOffset();

        const diffMinutes = targetOffset - refOffset;
        const diffHours = Math.round(diffMinutes / 60 * 10) / 10; // 1 decimal place

        if (diffHours === 0) return '±0h';
        const sign = diffHours > 0 ? '+' : '';
        return `${sign}${diffHours}h`;
    } catch (e) {
        return '';
    }
}

export function searchTimezones(query: string): string[] {
    // A limited list of common timezones for the MVP search
    // In a real app, we'd include a full IANA list.
    const commonZones = [
        'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Europe/Kyiv',
        'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Toronto', 'America/Sao_Paulo',
        'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Dubai', 'Asia/Kolkata',
        'Australia/Sydney', 'Pacific/Auckland'
    ];
    if (!query) return [];
    return commonZones.filter(z => z.toLowerCase().includes(query.toLowerCase()));
}
