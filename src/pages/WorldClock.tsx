import React, { useState, useEffect } from 'react';
import { WorldClockRow } from '../components/world-clock/WorldClockRow';
import { WorldClockEntry } from '../domain/world-clock/types';
import { searchTimezones } from '../domain/world-clock/time';
import { HomeButton } from '../components/HomeButton';
import '../styles/world-clock.css';

const STORAGE_KEY = 'sc.v1.worldclock';
const DEFAULT_ENTRIES: WorldClockEntry[] = [
  { id: '1', city: 'Berlin', timezone: 'Europe/Berlin', sortOrder: 0, label: 'My Location' },
  { id: '2', city: 'New York', timezone: 'America/New_York', sortOrder: 1 },
  { id: '3', city: 'Tokyo', timezone: 'Asia/Tokyo', sortOrder: 2 },
  { id: '4', city: 'Sydney', timezone: 'Australia/Sydney', sortOrder: 3 },
];

function isValidTimezone(timezone: string) {
  try {
    // Throws on invalid time zones
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

function normalizeEntries(data: unknown): WorldClockEntry[] {
  if (!Array.isArray(data)) return [];

  return data
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') return null;

      const timezone = typeof (entry as any).timezone === 'string' ? (entry as any).timezone : '';
      if (!timezone || !isValidTimezone(timezone)) return null;

      const id = typeof (entry as any).id === 'string' ? (entry as any).id : `${Date.now()}-${index}`;
      const sortOrder = typeof (entry as any).sortOrder === 'number' ? (entry as any).sortOrder : index;
      const cityFromTz = timezone.split('/')[1]?.replaceAll('_', ' ') || timezone;
      const city = typeof (entry as any).city === 'string' && (entry as any).city ? (entry as any).city : cityFromTz;
      const label = typeof (entry as any).label === 'string' ? (entry as any).label : undefined;

      return { id, city, timezone, sortOrder, ...(label ? { label } : {}) } as WorldClockEntry;
    })
    .filter((entry): entry is WorldClockEntry => entry !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function loadEntries(): WorldClockEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_ENTRIES;

    const parsed = JSON.parse(saved);
    const normalized = normalizeEntries(parsed);
    return normalized.length > 0 ? normalized : DEFAULT_ENTRIES;
  } catch (err) {
    console.error('Failed to load world clock entries', err);
    return DEFAULT_ENTRIES;
  }
}

export default function WorldClockPage() {
  const [entries, setEntries] = useState<WorldClockEntry[]>(loadEntries);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error('Failed to save world clock entries', err);
    }
  }, [entries]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) {
      setSearchResults(searchTimezones(q));
    } else {
      setSearchResults([]);
    }
  };

  const addCity = (timezone: string) => {
    if (!timezone || !isValidTimezone(timezone)) return;
    if (entries.some((entry) => entry.timezone === timezone)) return;

    const city = timezone.split('/')[1]?.replaceAll('_', ' ') || timezone;
    const newEntry: WorldClockEntry = {
      id: Date.now().toString(),
      city,
      timezone,
      sortOrder: entries.length
    };
    setEntries((prev) => [...prev, newEntry]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeCity = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Meeting Time Checker (W2.4 - Simplified MVP)
  // Just a toggle/slider would be cool, but for now let's stick to simple "Live" mode.
  // If I had more time I'd add the slider.

  return (
    <div className="wc-page">
      <div className="wc-home-btn">
        <HomeButton />
      </div>

      <div className="wc-container">
        <div className="wc-controls">
          <h2>World Clock</h2>
          <div className="wc-search-container">
            <input
              className="wc-add-input"
              placeholder="Add city (e.g. London)..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchResults.length > 0 && (
              <div className="wc-search-dropdown">
                {searchResults.map(tz => (
                  <div
                    key={tz}
                    className="wc-search-result"
                    onClick={() => addCity(tz)}
                  >
                    {tz}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="wc-table">
          {entries.map(entry => (
            <WorldClockRow
              key={entry.id}
              entry={entry}
              onDelete={removeCity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
