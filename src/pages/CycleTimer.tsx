import React, { useState, useEffect, useCallback, useRef } from "react";
import { beep, flash } from "../utils";

const LS_KEY = "sc.v1.cycle";
const MAX = 12 * 3600_000; // 12 hours max

type Persist = {
  version: 1;
  intervalMs: number;
  remainingMs: number;
  running: boolean;
  endAt: number | null;
  cycleCount: number;
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
      intervalMs: clamp(p.intervalMs ?? 60_000, 1000, MAX),
      remainingMs: clamp(p.remainingMs ?? 60_000, 0, MAX),
      running: !!p.running,
      endAt: p.endAt ?? null,
      cycleCount: p.cycleCount ?? 0,
      signal: { sound: !!p.signal?.sound, flash: !!p.signal?.flash }
    };
  } catch {
    return {
      version: 1,
      intervalMs: 60_000, // 1min default
      remainingMs: 60_000,
      running: false,
      endAt: null,
      cycleCount: 0,
      signal: { sound: true, flash: true }
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
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CycleTimer() {
  const [st, setSt] = useState<Persist>(load);
  const wrapRef = useRef<HTMLDivElement>(null);

  const sync = useCallback(() => {
    if (!st.running || !st.endAt) return;
    const now = Date.now();
    const rem = Math.max(0, st.endAt - now);

    // Auto-restart when cycle completes
    if (rem === 0) {
      if (st.signal.flash) flash(wrapRef.current, 400);
      if (st.signal.sound) beep(200, 880);

      // Immediately restart with new cycle
      setSt(s => ({
        ...s,
        remainingMs: s.intervalMs,
        endAt: Date.now() + s.intervalMs,
        cycleCount: s.cycleCount + 1
      }));
    } else if (rem !== st.remainingMs) {
      setSt(s => ({ ...s, remainingMs: rem }));
    }
  }, [st.running, st.endAt, st.remainingMs, st.signal, st.intervalMs]);

  useRaf(st.running, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const start = useCallback(() => {
    if (st.remainingMs <= 0 || !st.running) {
      setSt(s => ({
        ...s,
        remainingMs: s.intervalMs,
        running: true,
        endAt: Date.now() + s.intervalMs
      }));
    } else {
      setSt(s => ({ ...s, running: true, endAt: Date.now() + s.remainingMs }));
    }
  }, [st.remainingMs, st.running, st.intervalMs]);

  const pause = useCallback(() => setSt(s => ({ ...s, running: false, endAt: null })), []);

  const reset = useCallback(() => setSt(s => ({
    ...s,
    running: false,
    endAt: null,
    remainingMs: s.intervalMs,
    cycleCount: 0
  })), []);

  const setTime = useCallback((h: number, m: number, s: number) => {
    const ms = clamp((h * 3600 + m * 60 + s) * 1000, 1000, MAX);
    setSt(st => ({
      ...st,
      intervalMs: ms,
      remainingMs: ms,
      running: false,
      endAt: null
    }));
  }, []);

  const totalSec = Math.floor(st.remainingMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <div className="countdown-wrap" ref={wrapRef}>
      <a href="#/" className="btn-home">Home</a>

      <h2>Cycle Timer</h2>
      <p style={{color: 'var(--muted)', fontSize: '14px', marginTop: '-8px'}}>
        Automatically restarts after each interval • Cycle #{st.cycleCount}
      </p>

      <div className="countdown-input">
        <label>
          <span>H</span>
          <input
            type="number"
            min="0"
            max="12"
            value={h}
            aria-label="Hours"
            disabled={st.running}
            onChange={e => setTime(Number(e.target.value) || 0, m, s)}
          />
        </label>
        <span className="sep">:</span>
        <label>
          <span>M</span>
          <input
            type="number"
            min="0"
            max="59"
            value={m}
            aria-label="Minutes"
            disabled={st.running}
            onChange={e => setTime(h, Number(e.target.value) || 0, s)}
          />
        </label>
        <span className="sep">:</span>
        <label>
          <span>S</span>
          <input
            type="number"
            min="0"
            max="59"
            value={s}
            aria-label="Seconds"
            disabled={st.running}
            onChange={e => setTime(h, m, Number(e.target.value) || 0)}
          />
        </label>
      </div>

      <div className="countdown-display">{fmt(st.remainingMs)}</div>

      <div className="countdown-controls">
        <button className="btn primary" onClick={st.running ? pause : start}>
          {st.running ? "Pause" : "Start"}
        </button>
        <button className="btn" onClick={reset}>Reset</button>
      </div>

      <div className="countdown-settings">
        <label className="sig">
          <input
            type="checkbox"
            checked={st.signal.sound}
            onChange={e => setSt(s => ({ ...s, signal: { ...s.signal, sound: e.target.checked } }))}
          />
          <span>Sound</span>
        </label>
        <label className="sig">
          <input
            type="checkbox"
            checked={st.signal.flash}
            onChange={e => setSt(s => ({ ...s, signal: { ...s.signal, flash: e.target.checked } }))}
          />
          <span>Flash</span>
        </label>
      </div>
    </div>
  );
}
