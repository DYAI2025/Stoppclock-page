import React, { useState, useEffect, useCallback, useRef } from "react";

const LS_KEY = "sc.v1.digitalclock";

type Persist = {
  version: 1;
  format24h: boolean;
};

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      format24h: p.format24h !== false // default true
    };
  } catch {
    return {
      version: 1,
      format24h: true
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

export default function DigitalClock() {
  const [st, setSt] = useState<Persist>(load);
  const [now, setNow] = useState(new Date());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const full = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    } else {
      el.requestFullscreen?.().catch(() => { });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        full();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  const h24 = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  let timeStr: string;
  if (st.format24h) {
    timeStr = `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  } else {
    const h12 = h24 % 12 || 12;
    const ampm = h24 < 12 ? "AM" : "PM";
    timeStr = `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm}`;
  }

  const dateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);

  return (
    <div className="clock-wrap" ref={wrapRef}>
      <a href="#/" className="btn-home">Home</a>
      <div className="clock-time">{timeStr}</div>
      <div className="clock-date">{dateStr}</div>

      <div className="clock-controls">
        <label className="clock-toggle">
          <input
            type="checkbox"
            checked={st.format24h}
            onChange={e => setSt(s => ({ ...s, format24h: e.target.checked }))}
          />
          <span>24h</span>
        </label>
        <button className="btn" onClick={full}>Fullscreen</button>
      </div>
    </div>
  );
}
