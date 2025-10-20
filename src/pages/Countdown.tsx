import React, { useState, useEffect, useCallback, useRef } from "react";
import { beep, flash } from "../utils";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

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
      signal: { sound: !!p.signal?.sound, flash: !!p.signal?.flash }
    };
  } catch {
    return {
      version: 1,
      durationMs: 300_000, // 5m default
      remainingMs: 300_000,
      running: false,
      endAt: null,
      warnAtMs: 10_000, // 10 seconds warning (spec requirement)
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

export default function Countdown() {
  const [st, setSt] = useState<Persist>(load);
  const wrapRef = useRef<HTMLDivElement>(null);
  const warned = useRef(false);

  const sync = useCallback(() => {
    if (!st.running || !st.endAt) return;
    const now = Date.now();
    const rem = Math.max(0, st.endAt - now);
    if (rem !== st.remainingMs) setSt(s => ({ ...s, remainingMs: rem }));
  }, [st.running, st.endAt, st.remainingMs]);

  useRaf(st.running, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  useEffect(() => {
    // warn & finish
    const warnAt = st.warnAtMs;
    const isWarn = (warnAt != null) && st.running && st.remainingMs > 0 && st.remainingMs <= warnAt;

    // Beep/flash every second when in warning zone (last minute)
    let warnInterval: number | undefined;
    if (isWarn) {
      // Trigger immediately
      if (st.signal.flash) flash(wrapRef.current, 250);
      if (st.signal.sound) beep(140, 1200);

      // Then every second
      warnInterval = window.setInterval(() => {
        if (st.signal.flash) flash(wrapRef.current, 250);
        if (st.signal.sound) beep(140, 1200);
      }, 1000);
    }

    if (st.running && st.remainingMs <= 0) {
      setSt(s => ({ ...s, running: false, endAt: null, remainingMs: 0 }));
      if (st.signal.flash) flash(wrapRef.current, 900);
      if (st.signal.sound) beep(600, 660);
    }

    return () => {
      if (warnInterval) clearInterval(warnInterval);
    };
  }, [st.remainingMs, st.running, st.signal, st.warnAtMs]);

  const start = useCallback(() => {
    if (st.remainingMs <= 0) {
      setSt(s => ({ ...s, remainingMs: s.durationMs, running: true, endAt: Date.now() + s.durationMs }));
    } else {
      setSt(s => ({ ...s, running: true, endAt: Date.now() + s.remainingMs }));
    }
  }, [st.remainingMs, st.durationMs]);

  const pause = useCallback(() => setSt(s => ({ ...s, running: false, endAt: null })), []);
  const reset = useCallback(() => setSt(s => ({ ...s, running: false, endAt: null, remainingMs: s.durationMs })), []);

  const plus = useCallback((ms: number) => setSt(s => {
    const base = s.running ? Math.max(0, (s.endAt ?? Date.now()) - Date.now()) : s.remainingMs;
    const next = clamp(base + ms, 0, MAX);
    return s.running ? { ...s, remainingMs: next, endAt: Date.now() + next } : { ...s, durationMs: next, remainingMs: next };
  }), []);

  const setTime = useCallback((h: number, m: number, s: number) => {
    // Clamp inputs to valid ranges
    const clampedH = clamp(h, 0, 12);
    const clampedM = clamp(m, 0, 59);
    const clampedS = clamp(s, 0, 59);

    const ms = clamp((clampedH * 3600 + clampedM * 60 + clampedS) * 1000, 1000, MAX);
    setSt(st => ({
      ...st,
      durationMs: ms,
      remainingMs: ms,
      running: false,
      endAt: null
    }));
  }, []);

  const handleInputChange = useCallback((field: 'h' | 'm' | 's', value: string) => {
    // Parse and clamp value
    const num = parseInt(value) || 0;
    const max = field === 'h' ? 12 : 59;
    const clamped = clamp(num, 0, max);

    // Apply based on field
    if (field === 'h') setTime(clamped, m, s);
    else if (field === 'm') setTime(h, clamped, s);
    else setTime(h, m, clamped);
  }, [h, m, s, setTime]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>, field: 'h' | 'm' | 's') => {
    const pasted = e.clipboardData.getData('text');
    const num = parseInt(pasted);

    if (isNaN(num) || num < 0) {
      e.preventDefault();
      return;
    }

    const max = field === 'h' ? 12 : 59;
    const clamped = clamp(num, 0, max);

    e.preventDefault();
    if (field === 'h') setTime(clamped, m, s);
    else if (field === 'm') setTime(h, clamped, s);
    else setTime(h, m, clamped);
  }, [h, m, s, setTime]);

  const full = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { });
    } else {
      el.requestFullscreen?.().catch(() => { });
    }
  }, []);

  // Use centralized keyboard shortcuts hook
  useKeyboardShortcuts({
    onSpace: () => st.running ? pause() : start(),
    onReset: reset,
    onFullscreen: full,
  }, true);

  // Arrow keys for time adjustment (only when paused)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input fields
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      // Arrow keys only work when timer is NOT running (paused)
      if (e.key === "ArrowUp" && !st.running) {
        e.preventDefault();
        plus(10_000);
      } else if (e.key === "ArrowDown" && !st.running) {
        e.preventDefault();
        plus(-10_000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [st.running, plus]);

  const totalSec = Math.floor(st.remainingMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <div className="countdown-wrap" ref={wrapRef}>
      <a href="#/" className="btn-home">Home</a>
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
            onChange={e => handleInputChange('h', e.target.value)}
            onPaste={e => handlePaste(e, 'h')}
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
            onChange={e => handleInputChange('m', e.target.value)}
            onPaste={e => handlePaste(e, 'm')}
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
            onChange={e => handleInputChange('s', e.target.value)}
            onPaste={e => handlePaste(e, 's')}
          />
        </label>
      </div>

      <div className="countdown-display">{fmt(st.remainingMs)}</div>

      <div className="countdown-controls">
        <button type="button" className="btn primary" onClick={st.running ? pause : start}>
          {st.running ? "Pause" : "Start"}
        </button>
        <button type="button" className="btn" onClick={reset}>Reset</button>
        <button type="button" className="btn" onClick={full}>Fullscreen</button>
      </div>

      <div className="countdown-settings">
        <label className="warn">
          <span>Warn at:</span>
          <select
            value={st.warnAtMs ?? "off"}
            onChange={e => setSt(s => ({ ...s, warnAtMs: e.target.value === "off" ? null : Number(e.target.value) }))}
          >
            <option value="off">Off</option>
            <option value="10000">10sec</option>
            <option value="60000">1min</option>
            <option value="300000">5min</option>
            <option value="600000">10min</option>
          </select>
        </label>
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
