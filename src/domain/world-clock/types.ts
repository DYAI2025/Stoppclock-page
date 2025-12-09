export type DayPeriod = 'early' | 'morning' | 'day' | 'evening' | 'night' | 'lateNight';

export interface WorldClockEntry {
    id: string;
    city: string;
    timezone: string; // IANA 'Europe/Berlin'
    label?: string;   // Optional custom label ('Grandma')
    sortOrder: number;
}

export interface WorldClockState {
    entries: WorldClockEntry[];
    referenceTime: number | null; // Timestamp (ms). If null, use live 'now'.
    referenceLocationId: string | null; // If null, use local user browser time.
    isAddingCity: boolean; // UI state for adding mode
}
