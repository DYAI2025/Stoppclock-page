import React, { useState, useEffect, useRef } from "react";
import { HomeButton } from "../components/HomeButton";
import "../styles/worldclock-swiss.css";

const LS_KEY = "sc.v1.worldclock";

type Persist = {
  version: 1;
  timezones: string[];
};

const DEFAULT_TIMEZONES = [
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland"
];

// Comprehensive timezone list with city/country labels
const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "New York, USA (EST/EDT)" },
  { value: "America/Chicago", label: "Chicago, USA (CST/CDT)" },
  { value: "America/Denver", label: "Denver, USA (MST/MDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles, USA (PST/PDT)" },
  { value: "America/Toronto", label: "Toronto, Canada (EST/EDT)" },
  { value: "America/Mexico_City", label: "Mexico City, Mexico (CST/CDT)" },
  { value: "America/Sao_Paulo", label: "São Paulo, Brazil (BRT)" },
  { value: "America/Buenos_Aires", label: "Buenos Aires, Argentina (ART)" },
  { value: "Europe/London", label: "London, UK (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris, France (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin, Germany (CET/CEST)" },
  { value: "Europe/Rome", label: "Rome, Italy (CET/CEST)" },
  { value: "Europe/Madrid", label: "Madrid, Spain (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "Amsterdam, Netherlands (CET/CEST)" },
  { value: "Europe/Brussels", label: "Brussels, Belgium (CET/CEST)" },
  { value: "Europe/Vienna", label: "Vienna, Austria (CET/CEST)" },
  { value: "Europe/Zurich", label: "Zurich, Switzerland (CET/CEST)" },
  { value: "Europe/Stockholm", label: "Stockholm, Sweden (CET/CEST)" },
  { value: "Europe/Moscow", label: "Moscow, Russia (MSK)" },
  { value: "Africa/Cairo", label: "Cairo, Egypt (EET)" },
  { value: "Africa/Johannesburg", label: "Johannesburg, South Africa (SAST)" },
  { value: "Asia/Dubai", label: "Dubai, UAE (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai, India (IST)" },
  { value: "Asia/Bangkok", label: "Bangkok, Thailand (ICT)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
  { value: "Asia/Shanghai", label: "Shanghai, China (CST)" },
  { value: "Asia/Tokyo", label: "Tokyo, Japan (JST)" },
  { value: "Asia/Seoul", label: "Seoul, South Korea (KST)" },
  { value: "Australia/Sydney", label: "Sydney, Australia (AEDT/AEST)" },
  { value: "Australia/Melbourne", label: "Melbourne, Australia (AEDT/AEST)" },
  { value: "Pacific/Auckland", label: "Auckland, New Zealand (NZDT/NZST)" },
  { value: "Pacific/Fiji", label: "Fiji (FJT)" },
  { value: "Pacific/Honolulu", label: "Honolulu, USA (HST)" }
];

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      timezones: Array.isArray(p.timezones) && p.timezones.length > 0
        ? p.timezones
        : DEFAULT_TIMEZONES
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

// Mini analog clock component (canvas-based)
function MiniAnalogClock({ timezone }: { timezone: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 4;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Get time in timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(now);
    const hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const minutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    const seconds = parseInt(parts.find(p => p.type === 'second')?.value || '0');

    ctx.save();
    ctx.translate(cx, cy);

    // Draw hour markers (minimal)
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const len = i % 3 === 0 ? r * 0.12 : r * 0.06;
      const width = i % 3 === 0 ? 2 : 1;

      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (r - len), Math.sin(angle) * (r - len));
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Hour hand
    const hourAngle = ((hours % 12) + minutes / 60) * (Math.PI / 6) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(hourAngle) * r * 0.5, Math.sin(hourAngle) * r * 0.5);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // Minute hand
    const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(minuteAngle) * r * 0.75, Math.sin(minuteAngle) * r * 0.75);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();

    // Second hand (thin red)
    const secondAngle = seconds * (Math.PI / 30) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(secondAngle) * r * 0.85, Math.sin(secondAngle) * r * 0.85);
    ctx.strokeStyle = "#DC143C";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();

    ctx.restore();
  }, [now, timezone]);

  return <canvas ref={canvasRef} width={160} height={160} className="worldclock-analog" />;
}

export default function WorldClock() {
  const [st, setSt] = useState<Persist>(load);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const updateTimezone = (index: number, newTz: string) => {
    setSt(s => {
      const newTimezones = [...s.timezones];
      newTimezones[index] = newTz;
      return { ...s, timezones: newTimezones };
    });
  };

  const removeTimezone = (index: number) => {
    setSt(s => ({
      ...s,
      timezones: s.timezones.filter((_, i) => i !== index)
    }));
  };

  const addTimezone = () => {
    if (st.timezones.length < 10) {
      setSt(s => ({
        ...s,
        timezones: [...s.timezones, TIMEZONE_OPTIONS[0].value]
      }));
    }
  };

  return (
    <div className="worldclock-page">
      <header className="worldclock-header">
        <h1 className="worldclock-title">World Clock</h1>
        <HomeButton />
      </header>

      <div className="worldclock-grid">
        {st.timezones.map((tz, index) => {
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

          return (
            <div key={`${tz}-${index}`} className="worldclock-card">
              <select
                className="worldclock-selector"
                value={tz}
                onChange={(e) => updateTimezone(index, e.target.value)}
              >
                {TIMEZONE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <MiniAnalogClock timezone={tz} />

              <div className="worldclock-digital">{timeStr}</div>
              <div className="worldclock-date">{dateStr}</div>

              <button
                className="worldclock-remove"
                onClick={() => removeTimezone(index)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {st.timezones.length < 10 && (
        <button className="worldclock-add" onClick={addTimezone}>
          Add Clock
        </button>
      )}
    </div>
  );
}
