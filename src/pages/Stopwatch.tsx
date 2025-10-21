import React, { useState, useEffect, useCallback, useRef } from "react";
import { HomeButton } from "../components/HomeButton";

const LS_KEY = "sc.v1.stopwatch";

type Persist = {
  version: 1;
  elapsedMs: number;
  running: boolean;
  startedAt: number | null;
  laps: number[];
};

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      elapsedMs: p.elapsedMs ?? 0,
      running: !!p.running,
      startedAt: p.startedAt ?? null,
      laps: Array.isArray(p.laps) ? p.laps : []
    };
  } catch {
    return {
      version: 1,
      elapsedMs: 0,
      running: false,
      startedAt: null,
      laps: []
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
  const totalMs = Math.max(0, Math.floor(ms));
  const cs = Math.floor((totalMs % 1000) / 10); // centiseconds
  const total = Math.floor(totalMs / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [st, setSt] = useState<Persist>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const sync = useCallback(() => {
    if (!st.running || !st.startedAt) return;
    // Force re-render for display update, don't update state
    forceUpdate();
  }, [st.running, st.startedAt]);

  useRaf(st.running, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const start = useCallback(() => {
    setSt(s => ({ ...s, running: true, startedAt: Date.now() }));
  }, []);

  const pause = useCallback(() => {
    if (!st.startedAt) return;
    const elapsed = st.elapsedMs + (Date.now() - st.startedAt);
    setSt(s => ({ ...s, running: false, startedAt: null, elapsedMs: elapsed }));
  }, [st.startedAt, st.elapsedMs]);

  const reset = useCallback(() => {
    setSt({ version: 1, elapsedMs: 0, running: false, startedAt: null, laps: [] });
  }, []);

  const addLap = useCallback(() => {
    const currentTime = st.running && st.startedAt
      ? st.elapsedMs + (Date.now() - st.startedAt)
      : st.elapsedMs;
    setSt(s => ({ ...s, laps: [...s.laps, currentTime] }));
  }, [st.running, st.startedAt, st.elapsedMs]);

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
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        st.running ? pause() : start();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        reset();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        full();
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        if (st.running) addLap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [st.running, start, pause, reset, full, addLap]);

  const currentTime = st.running && st.startedAt
    ? st.elapsedMs + (Date.now() - st.startedAt)
    : st.elapsedMs;

  // Calculate lap differences
  const lapDiffs = st.laps.map((lapTime, idx) => {
    const prevTime = idx === 0 ? 0 : st.laps[idx - 1];
    return lapTime - prevTime;
  });

  return (
    <div className="stopwatch-page" ref={wrapRef}>
      {/* Header */}
      <header className="stopwatch-header">
        <h1 className="stopwatch-title">Stopwatch</h1>
        <HomeButton />
      </header>

      {/* Timer Display (inverted colors) */}
      <div className={`stopwatch-display ${st.running ? 'running' : ''}`}>
        {fmt(currentTime)}
      </div>

      {/* Controls */}
      <div className="stopwatch-controls">
        {!st.running ? (
          <button type="button" className="stopwatch-btn" onClick={start}>
            Start
          </button>
        ) : (
          <button type="button" className="stopwatch-btn" onClick={pause}>
            Pause
          </button>
        )}
        <button
          type="button"
          className="stopwatch-btn secondary"
          onClick={addLap}
          disabled={!st.running}
        >
          Lap
        </button>
        <button type="button" className="stopwatch-btn secondary" onClick={reset}>
          Reset
        </button>
        <button type="button" className="stopwatch-btn secondary" onClick={full}>
          Fullscreen
        </button>
      </div>

      {/* Lap Times */}
      {st.laps.length > 0 && (
        <div className="stopwatch-laps">
          <h2 className="stopwatch-laps-title">Lap Times</h2>
          <ul className="stopwatch-laps-list">
            {st.laps.map((lapTime, idx) => (
              <li key={idx} className="stopwatch-lap-item">
                <span className="stopwatch-lap-number">#{idx + 1}</span>
                <span className="stopwatch-lap-time">{fmt(lapDiffs[idx])}</span>
                <span className="stopwatch-lap-total">{fmt(lapTime)}</span>
              </li>
            )).reverse()}
          </ul>
        </div>
      )}
    </div>
  );
}
