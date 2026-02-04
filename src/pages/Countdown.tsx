import React, { useState, useEffect, useCallback, useRef } from "react";
import { beep, flash } from "../utils";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useAutoFitText } from "../hooks/useAutoFitText"; // Maybe not needed if we clamp fonts
import { HomeButton } from "../components/HomeButton";
import { SavePresetButton } from "../components/SavePresetButton";
import { ShareButton } from "../components/ShareButton";
import { AppHeader } from "../components/AppHeader";
import { getPresetFromUrl } from "../utils/share";
import { trackEvent } from "../utils/stats";
import { DidYouKnowSnippet } from "../components/DidYouKnowSnippet";
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
        <div className="focus-hero-content">
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

      <div className="focus-footer">
        <p className="focus-footer-tip">
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
  onExit,
  getCurrentConfig
}: any) => {
  // Circle calculation
  const radius = 38; // Smaller to fit stopwatch lugs
  const circumference = 2 * Math.PI * radius;
  const progress = st.durationMs > 0 ? st.remainingMs / st.durationMs : 0;
  const offset = circumference - (progress * circumference);
  const isLastMinute = st.remainingMs > 0 && st.remainingMs <= 60000;
  const isExpired = st.remainingMs === 0;

  // Color logic
  let strokeColor = "#4682B4"; // Steel Blue
  if (isLastMinute) strokeColor = "#E67E22"; // Orange warning
  if (st.remainingMs === 0) strokeColor = "#DC143C"; // Crimson expired

  return (
    <div className={`focus-player ${isLastMinute ? 'last-minute' : ''} ${st.remainingMs === 0 ? 'expired' : ''}`}>
      <AppHeader
        title="Countdown Timer"
        breadcrumbs={[
          { label: 'Home', href: '#/' },
          { label: 'Countdown' }
        ]}
        actions={{
          showShare: true,
          onShare: () => {
            const shareBtn = document.querySelector('.focus-action-row .btn-share') as HTMLButtonElement;
            if (shareBtn) shareBtn.click();
          },
          showFullscreen: true,
          onFullscreen,
          showTheme: true,
          showSettings: true,
          showHome: true
        }}
        variant="timer"
      />

      <div className="focus-display-container">
        <svg className="focus-ring-bg" viewBox="0 0 100 115" style={{ overflow: 'visible' }}>
           <defs>
              <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                 <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000018" />
              </filter>
           </defs>

           {/* Stopwatch Lugs/Buttons */}
           <g transform="translate(50, 56)">
              {/* Top Stem */}
              <rect x="-3" y="-52" width="6" height="8" rx="1" fill="#FFFFFF" stroke="#D1E3F0" strokeWidth="2" />
              {/* Top Pusher */}
              <rect x="-8" y="-56" width="16" height="4" rx="1" fill="#FFFFFF" stroke="#D1E3F0" strokeWidth="2" />
              {/* Angled Button */}
              <g transform="rotate(45)">
                 <rect x="-3" y="-51" width="6" height="6" rx="1" fill="#FFFFFF" stroke="#D1E3F0" strokeWidth="2" />
                 <line x1="0" y1="-51" x2="0" y2="-45" stroke="#D1E3F0" strokeWidth="1" />
              </g>
           </g>

          {/* Base Circle (Background) */}
          <circle
            cx="50" cy="56" r={radius}
            fill="#FFFFFF" 
            stroke="#E6F2FA" 
            strokeWidth="3"
            filter="url(#dropshadow)"
          />

          {/* Tick Marks */}
          {Array.from({ length: 60 }).map((_, i) => {
              const isHour = i % 5 === 0;
              // Tick length
              const len = isHour ? 3 : 1.5;
              // Start distance from center
              const rStart = radius - 6; 
              return (
                 <line 
                   key={i}
                    x1="50" y1={56 - rStart}
                    x2="50" y2={56 - rStart + len}
                    stroke={isHour ? "#94A3B8" : "#CBD5E1"} // Slate-400 : Slate-300
                    strokeWidth={isHour ? 1.5 : 1}
                    transform={`rotate(${i * 6} 50 56)`}
                 />
              );
          })}

          {/* Progress Ring (The Rim) */}
          <circle
            cx="50" cy="56" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 56)"
            className="focus-ring-progress"
            style={{ strokeDashoffset: offset }}
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

      <div className="focus-action-row" style={{ display: 'none' }}>
        <SavePresetButton
          timerType="countdown"
          getCurrentConfig={getCurrentConfig}
          className="focus-btn-secondary"
        />
        <ShareButton
          timerType="countdown"
          getCurrentConfig={getCurrentConfig}
          className="focus-btn-secondary"
        />
      </div>

      <DidYouKnowSnippet timerSlug="countdown" className="mt-8" />
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

    // Check for shared preset
    const sharedPreset = getPresetFromUrl();
    if (sharedPreset && sharedPreset.type === 'countdown') {
      const config = sharedPreset.config;
      const durationMs = config.durationMs || 300000;
      setSt(s => ({
        ...s,
        durationMs,
        remainingMs: durationMs,
        running: false,
        endAt: null,
        warnAtMs: config.warnAtMs || 10000
      }));
      setMode('player');
      setUrlChecked(true);
      return;
    }

    // Legacy URL params support
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

      // Track completion
      trackEvent('countdown', 'complete', st.durationMs);

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

        // Track timer start
        trackEvent('countdown', 'start');

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

  const getCurrentConfig = useCallback(() => {
    // Convert durationMs to hours, minutes, seconds for preset config
    const totalSeconds = Math.floor(st.durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      durationMs: st.durationMs,
      hours,
      minutes,
      seconds,
      warnAtMs: st.warnAtMs
    };
  }, [st.durationMs, st.warnAtMs]);

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
          getCurrentConfig={getCurrentConfig}
        />
      )}
    </div>
  );
}
