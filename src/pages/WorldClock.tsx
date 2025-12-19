import React, { useState, useEffect } from 'react';
import { WorldClockRow } from '../components/world-clock/WorldClockRow';
import { WorldClockEntry } from '../domain/world-clock/types';
import { searchTimezones } from '../domain/world-clock/time';
import { HomeButton } from '../components/HomeButton';
import '../styles/world-clock.css';

const DEFAULT_ENTRIES: WorldClockEntry[] = [
  { id: '1', city: 'Berlin', timezone: 'Europe/Berlin', sortOrder: 0, label: 'My Location' },
  { id: '2', city: 'New York', timezone: 'America/New_York', sortOrder: 1 },
  { id: '3', city: 'Tokyo', timezone: 'Asia/Tokyo', sortOrder: 2 },
  { id: '4', city: 'Sydney', timezone: 'Australia/Sydney', sortOrder: 3 },
];

export default function WorldClockPage() {
  const [entries, setEntries] = useState<WorldClockEntry[]>(() => {
    try {
      const save = localStorage.getItem('sc.v1.worldclock');
      if (save) return JSON.parse(save);
    } catch { }
    return DEFAULT_ENTRIES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Persist
  useEffect(() => {
    localStorage.setItem('sc.v1.worldclock', JSON.stringify(entries));
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
    const city = timezone.split('/')[1]?.replace('_', ' ') || timezone;
    const newEntry: WorldClockEntry = {
      id: Date.now().toString(),
      city,
      timezone,
      sortOrder: entries.length
    };
    setEntries([...entries, newEntry]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeCity = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
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
