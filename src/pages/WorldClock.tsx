import React, { useState, useEffect, useRef } from "react";

const LS_KEY = "sc.v1.worldclock";

type Persist = {
  version: 1;
  timezones: string[];
};

const DEFAULT_TIMEZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo"
];

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Australia/Sydney",
  "Pacific/Auckland"
];

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      timezones: Array.isArray(p.timezones) ? p.timezones : DEFAULT_TIMEZONES
    };
  } catch {
    return {
      version: 1,
      timezones: DEFAULT_TIMEZONES
    };
  }
}

function save(p: Persist) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    // Silently fail
  }
}

export default function WorldClock() {
  const [st, setSt] = useState<Persist>(load);
  const [now, setNow] = useState(new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTz, setSelectedTz] = useState(COMMON_TIMEZONES[0]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const addTimezone = () => {
    if (!st.timezones.includes(selectedTz)) {
      setSt(s => ({ ...s, timezones: [...s.timezones, selectedTz] }));
    }
    setShowAdd(false);
  };

  const removeTimezone = (tz: string) => {
    setSt(s => ({ ...s, timezones: s.timezones.filter(t => t !== tz) }));
  };

  return (
    <div className="world-wrap" ref={wrapRef}>
      <a href="#/" className="btn-home">Home</a>
      <h2>World Clock</h2>

      <div className="timezone-list">
        {st.timezones.map(tz => {
          const timeStr = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(now);

          const dateStr = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }).format(now);

          const cityName = tz.split('/').pop()?.replace(/_/g, ' ') || tz;

          return (
            <div key={tz} className="timezone-item">
              <div className="tz-info">
                <div className="tz-city">{cityName}</div>
                <div className="tz-name">{tz}</div>
              </div>
              <div className="tz-time">
                <div className="tz-time-display">{timeStr}</div>
                <div className="tz-date">{dateStr}</div>
              </div>
              <button className="btn btn-remove" onClick={() => removeTimezone(tz)}>×</button>
            </div>
          );
        })}
      </div>

      {!showAdd && (
        <button className="btn primary" onClick={() => setShowAdd(true)}>
          Add Timezone
        </button>
      )}

      {showAdd && (
        <div className="add-timezone">
          <select value={selectedTz} onChange={e => setSelectedTz(e.target.value)}>
            {COMMON_TIMEZONES.map(tz => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <button className="btn primary" onClick={addTimezone}>Add</button>
          <button className="btn" onClick={() => setShowAdd(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
