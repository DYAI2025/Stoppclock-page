import React, { useState, useEffect, useRef } from "react";
import { HomeButton } from "../components/HomeButton";
import "../styles/worldclock-ocean.css";

const LS_KEY = "sc.v1.worldclock";

type Persist = {
  version: 1;
  timezones: string[];
};

// Comprehensive timezone list
const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/Denver", label: "Denver" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "America/Sao_Paulo", label: "São Paulo" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Europe/Moscow", label: "Moscow" },
  { value: "Africa/Cairo", label: "Cairo" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Kolkata", label: "Mumbai" },
  { value: "Asia/Bangkok", label: "Bangkok" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Pacific/Auckland", label: "Auckland" },
  { value: "Pacific/Honolulu", label: "Honolulu" }
];

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      // Default to user's local + maybe one other if empty? 
      // Or empty list per design
      timezones: Array.isArray(p.timezones) ? p.timezones : []
    };
  } catch {
    // Default start with Berlin/NY just to show something? 
    // Or Follow intent: "Start with where you are now"
    return {
      version: 1,
      timezones: ["Europe/Berlin", "America/New_York"]
    };
  }
}

function save(p: Persist) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch { }
}

function getOffsetLabel(now: Date, tz: string): string {
  // Very rough approximation of offset relative to local time
  try {
    const localHour = now.getHours();
    const tzTimeStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(now);
    const tzHour = parseInt(tzTimeStr);

    let diff = tzHour - localHour;
    if (diff < -12) diff += 24;
    if (diff > 12) diff -= 24;

    if (diff === 0) return "Same time";
    return diff > 0 ? `+${diff}h` : `${diff}h`;
  } catch {
    return "";
  }
}

function getDayNightLabel(now: Date, tz: string): { label: string, cls: string } {
  try {
    const hStr = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(now);
    const h = parseInt(hStr);
    if (h >= 6 && h < 18) return { label: "Day", cls: "tag-day" };
    if (h >= 18 && h < 22) return { label: "Evening", cls: "tag-night" }; // "Night" style for evening
    if (h >= 22 || h < 6) return { label: "Night", cls: "tag-night" };
    return { label: "", cls: "" };
  } catch {
    return { label: "", cls: "" };
  }
}

export default function WorldClock() {
  const [st, setSt] = useState<Persist>(load);
  const [now, setNow] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const addZone = (tz: string) => {
    if (!st.timezones.includes(tz)) {
      setSt(s => ({ ...s, timezones: [...s.timezones, tz] }));
    }
    setIsAdding(false);
  };

  const removeZone = (index: number) => {
    setSt(s => ({
      ...s,
      timezones: s.timezones.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="world-theme-wrapper">
      <header className="world-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="world-title">Time Windows</h1>
            <p className="world-subtitle">“Quiet windows into other people’s time.”</p>
          </div>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <HomeButton />
          </div>
        </div>
      </header>

      <div className="world-list">
        {st.timezones.length === 0 ? (
          <div className="world-empty">
            <h3>No windows open yet.</h3>
            <p>Add a place to see another piece of the world’s time.<br />Start with where you are and one person you miss.</p>
          </div>
        ) : (
          st.timezones.map((tz, index) => {
            const timeStr = new Intl.DateTimeFormat('en-US', {
              timeZone: tz,
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }).format(now);

            const city = TIMEZONE_OPTIONS.find(t => t.value === tz)?.label || tz;
            const { label: dnLabel, cls: dnCls } = getDayNightLabel(now, tz);
            const offset = getOffsetLabel(now, tz);

            return (
              <div key={`${tz}-${index}`} className="world-row">
                <div className="world-city-info">
                  <span className="world-city-name">{city}</span>
                  <div className="world-meta-tags">
                    <span className={`world-tag ${dnCls}`}>{dnLabel}</span>
                    <span className="world-tag tag-offset">{offset}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="world-time">{timeStr}</span>
                  <button className="world-delete" onClick={() => removeZone(index)} title="Remove">✕</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="world-controls">
        {!isAdding ? (
          <button className="world-add-btn" onClick={() => setIsAdding(true)}>
            + Add Place
          </button>
        ) : (
          <select
            className="world-add-select"
            onChange={(e) => {
              if (e.target.value) addZone(e.target.value);
            }}
            defaultValue=""
            autoFocus
            onBlur={() => setTimeout(() => setIsAdding(false), 200)}
          >
            <option value="" disabled>Select a city...</option>
            {TIMEZONE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 40, opacity: 0.5, fontStyle: 'italic', fontSize: '0.9rem', padding: 20 }}>
        Time zones are not just numbers. They are mornings, nights, and people who might be asleep.
      </div>
    </div>
  );
}
