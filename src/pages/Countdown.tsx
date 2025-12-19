import React, { useState, useEffect, useCallback, useRef } from "react";
import { beep, flash } from "../utils";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useAutoFitText } from "../hooks/useAutoFitText"; // Maybe not needed if we clamp fonts
import { HomeButton } from "../components/HomeButton";
// import { CountdownGuide } from '../components/CountdownGuide'; // Removing old guide
import '../styles/countdown-focus.css';

const LS_KEY = "sc.v1.countdown";
const MAX = 12 * 3600_000; // 12 hours max

type Persist = {
  version: 1;
  durationMs: number;
  remainingMs: number;
  running: boolean;
  endAt: number | null;
  warnAtMs: number | null;
  signal: { sound: boolean; flash: boolean };
};

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      durationMs: clamp(p.durationMs ?? 300_000, 1000, MAX),
      remainingMs: clamp(p.remainingMs ?? 300_000, 0, MAX),
      running: !!p.running,
      endAt: p.endAt ?? null,
      warnAtMs: p.warnAtMs ?? 60_000,
      signal: { sound: !!p.signal?.sound, flash: !!p.signal?.flash },
    };
  } catch {
    return {
      version: 1,
      durationMs: 300_000, // 5m default
      remainingMs: 300_000,
      running: false,
      endAt: null,
      warnAtMs: 10_000,
      signal: { sound: true, flash: true }
    };
  }
}

function save(p: Persist) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch { }
}

function useRaf(on: boolean, cb: () => void) {
  const raf = useRef<number | undefined>();
  useEffect(() => {
    if (!on) return;
    let live = true;
    const loop = () => {
      if (!live) return;
      cb();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      live = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [on, cb]);
}

function fmt(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000)); // Ceil to show "5:00" until 4:59.999
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* --- Components --- */

const CountdownWorld = ({ onStart }: { onStart: (minutes: number) => void }) => {
  return (
    <div className="focus-world">
      <header className="focus-hero">
        <HomeButton />
        <div style={{ marginTop: 40 }}>
          <span className="focus-tag">Shared Focus Frame</span>
          <h1 className="focus-title">The Clear Frame</h1>
          <p className="focus-subtitle">
            “I am the frame everyone can see. A clear start and a clear end, so you can focus on the middle.”
          </p>
        </div>
      </header>

      <div className="focus-rituals-grid">
        <div className="focus-ritual-card" onClick={() => onStart(10)}>
          <span className="focus-ritual-time">10:00</span>
          <h3 className="focus-ritual-title">Exercise Block</h3>
          <p className="focus-ritual-desc">
            Perfect for workshops. When the time is up, the group stops asking "How long left?".
          </p>
        </div>

        <div className="focus-ritual-card" onClick={() => onStart(25)}>
          <span className="focus-ritual-time">25:00</span>
          <h3 className="focus-ritual-title">Silent Work Sprint</h3>
          <p className="focus-ritual-desc">
            Pick one outcome. Turn off notifications. Go deep until the bell rings.
          </p>
        </div>

        <div className="focus-ritual-card" onClick={() => onStart(1)}>
          <span className="focus-ritual-time">01:00</span>
          <h3 className="focus-ritual-title">Gentle Closing</h3>
          <p className="focus-ritual-desc">
            Use the last minute solely to wrap up. One sentence, one next step.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 60, opacity: 0.6 }}>
        <p style={{ fontSize: '0.9rem' }}>
          <strong>Tip for Facilitators:</strong> Timeboxing isn't about pressure. It's about safety.
        </p>
      </div>
    </div>
  );
};

const CountdownPlayer = ({
  st,
  onToggle,
  onReset,
  onAdjust,
  onPreset,
  onFullscreen,
  onExit
}: any) => {
  // Circle calculation
  const radius = 45; // viewbox 100x100
  const circumference = 2 * Math.PI * radius;
  const progress = st.durationMs > 0 ? st.remainingMs / st.durationMs : 0;
  const offset = circumference - (progress * circumference);
  const isLastMinute = st.remainingMs > 0 && st.remainingMs <= 60000;
  const isExpired = st.remainingMs <= 0 && !st.running; // wait, if remainingMs=0 it stops running. 
  // Actually we want "expired" style when remainingMs is 0, regardless of running state?
  // In logic below, running sets to false when 0. So check remainingMs === 0.

  // Color logic
  let strokeColor = "#4682B4"; // Steel Blue
  if (isLastMinute) strokeColor = "#E67E22"; // Orange warning
  if (st.remainingMs === 0) strokeColor = "#DC143C"; // Crimson expired

  return (
    <div className={`focus-player ${isLastMinute ? 'last-minute' : ''} ${st.remainingMs === 0 ? 'expired' : ''}`}>
      <div className="focus-header-bar">
        <button className="focus-back-btn" onClick={onExit}>← About this timer</button>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={st.signal.sound} onChange={() => { /* needs handler */ }} disabled />
            Sound (On)
          </label>
          <HomeButton />
        </div>
      </div>

      <div className="focus-display-container">
        <svg className="focus-ring-bg" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke="#E6F2FA" strokeWidth="2"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <div className="focus-time-display">
          {fmt(st.remainingMs)}
        </div>
      </div>

      <div className="focus-controls">
        <button className="focus-btn focus-btn-secondary" onClick={onReset}>Reset</button>
        <button className="focus-btn focus-btn-primary" onClick={onToggle}>
          {st.running ? 'Pause' : 'Start'}
        </button>
        <button className="focus-btn focus-btn-secondary" onClick={onFullscreen}>Focus</button>
      </div>

      <div className="focus-presets">
        <button className="focus-preset-chip" onClick={() => onPreset(5)}>+5m</button>
        <button className="focus-preset-chip" onClick={() => onPreset(10)}>+10m</button>
        <button className="focus-preset-chip" onClick={() => onPreset(25)}>+25m</button>
        <button className="focus-preset-chip" onClick={() => onAdjust(-60000)}>-1m</button>
        <button className="focus-preset-chip" onClick={() => onAdjust(60000)}>+1m</button>
      </div>
    </div>
  );
}

/* --- Main Logic --- */

export default function Countdown() {
  const [st, setSt] = useState<Persist>(load);
  const [mode, setMode] = useState<'world' | 'player'>('player'); // Start directly in player mode
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastSecondRef = useRef<number>(-1);
  const [urlChecked, setUrlChecked] = useState(false);

  // URL Params handling
  useEffect(() => {
    if (urlChecked) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has('duration')) {
      const durationSeconds = parseInt(params.get('duration') || '0', 10);
      const durationMs = clamp(durationSeconds * 1000, 1000, MAX);
      setSt(s => ({
        ...s,
        durationMs,
        remainingMs: durationMs,
        running: false,
        endAt: null,
      }));
      setMode('player');

      if (params.get('autostart') === '1') {
        setTimeout(() => {
          setSt((s) => ({
            ...s,
            running: true,
            endAt: Date.now() + durationMs,
          }));
        }, 100);
      }
    }
    setUrlChecked(true);
  }, [urlChecked]);

  const sync = useCallback(() => {
    if (!st.running || !st.endAt) return;
    const now = Date.now();
    const rem = Math.max(0, st.endAt - now);

    // Sync UI
    // To update circle smoothly, we might want fewer updates? 
    // No, Raf is fine.

    // Only update state if second changes OR if very close to end (for smooth ring)? 
    // Actually for React rendering perf, maybe throttle?
    // But we need smooth ring.
    // Let's just update `remainingMs`.

    setSt(s => ({ ...s, remainingMs: rem }));

  }, [st.running, st.endAt]);

  useRaf(st.running, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  useEffect(() => {
    // Ticks and Alarms
    const secondsRemaining = Math.max(0, Math.ceil(st.remainingMs / 1000));

    if (st.running && st.remainingMs > 0 && st.remainingMs <= 10000) {
      // Last 10 seconds tick
      if (secondsRemaining !== lastSecondRef.current) {
        lastSecondRef.current = secondsRemaining;
        if (st.signal.sound) beep(50, 800 + (11 - secondsRemaining) * 50);
      }
    }

    if (st.running && st.remainingMs <= 0) {
      // Finished
      setSt(s => ({ ...s, running: false, endAt: null, remainingMs: 0 }));
      if (st.signal.sound) {
        // ADSR Alarm
        beep(300, 880);
        setTimeout(() => beep(300, 880), 350);
        setTimeout(() => beep(500, 660), 750);
      }
    }
  }, [st.remainingMs, st.running, st.signal]);

  /* Actions */
  const toggle = useCallback(() => {
    setSt(s => {
      if (s.running) {
        return { ...s, running: false, endAt: null };
      } else {
        const target = s.remainingMs > 0 ? s.remainingMs : s.durationMs;
        return { ...s, running: true, endAt: Date.now() + target, remainingMs: target };
      }
    });
  }, []);

  const reset = useCallback(() => {
    setSt(s => ({ ...s, running: false, endAt: null, remainingMs: s.durationMs }));
  }, []);

  const adjust = useCallback((deltaMs: number) => {
    setSt(s => {
      const base = s.remainingMs; // Always adjust remaining
      const next = clamp(base + deltaMs, 0, MAX);
      if (s.running) {
        return { ...s, remainingMs: next, endAt: Date.now() + next, durationMs: s.durationMs + deltaMs };
      }
      return { ...s, remainingMs: next, durationMs: next }; // If paused, duration tracks remaining (simple mode)
    });
  }, []);

  const setPreset = useCallback((minutes: number) => {
    const ms = minutes * 60000;
    setSt(s => ({ ...s, durationMs: ms, remainingMs: ms, running: false, endAt: null }));
    setMode('player');
  }, []);

  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
    else document.documentElement.requestFullscreen().catch(() => { });
  }, []);

  /* Keyboard */
  useKeyboardShortcuts({
    onSpace: toggle,
    onReset: reset,
    onFullscreen: fullscreen,
  }, mode === 'player');

  return (
    <div className="countdown-theme-wrapper">
      {mode === 'world' ? (
        <CountdownWorld onStart={setPreset} />
      ) : (
        <CountdownPlayer
          st={st}
          onToggle={toggle}
          onReset={reset}
          onAdjust={adjust}
          onPreset={setPreset}
          onFullscreen={fullscreen}
          onExit={() => setMode('world')}
        />
      )}
    </div>
  );
}
