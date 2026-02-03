import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAutoFitText } from "../hooks/useAutoFitText";
import { HomeButton } from "../components/HomeButton";
import { ShareButton } from "../components/ShareButton";
import { SavePresetButton } from "../components/SavePresetButton";
import { usePinnedTimers, PinnedTimer } from "../contexts/PinnedTimersContext";
import { trackEvent } from "../utils/stats";
import { getPresetFromUrl } from "../utils/share";
import { DidYouKnowSnippet } from "../components/DidYouKnowSnippet";

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
  const lastSecondRef = useRef<number>(-1);
  const [urlChecked, setUrlChecked] = useState(false);

  const currentTime = st.running && st.startedAt ? st.elapsedMs + (Date.now() - st.startedAt) : st.elapsedMs;
  const [textRef, autoFontSize] = useAutoFitText(fmt(currentTime), 8, 1.5);

  // Get current config for sharing/saving (stopwatch has minimal config)
  const getCurrentConfig = useCallback(() => {
    return {
      elapsedMs: currentTime
    };
  }, [currentTime]);

  // URL Preset Loading (minimal for stopwatch)
  useEffect(() => {
    if (urlChecked) return;

    const sharedPreset = getPresetFromUrl();
    if (sharedPreset && sharedPreset.type === 'stopwatch') {
      // Stopwatch doesn't have much to configure from URL
      // Could potentially set initial elapsed time, but that's unusual
    }
    setUrlChecked(true);
  }, [urlChecked]);

  const sync = useCallback(() => {
    if (!st.running || !st.startedAt) return;

    // Only update on 100ms intervals to reduce flicker (10 FPS)
    const currentMs = st.elapsedMs + (Date.now() - st.startedAt);
    const currentTenth = Math.floor(currentMs / 100);

    if (currentTenth !== lastSecondRef.current) {
      lastSecondRef.current = currentTenth;
      forceUpdate();
    }
  }, [st.running, st.startedAt, st.elapsedMs]);

  useRaf(st.running, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const start = useCallback(() => {
    // Track timer start
    trackEvent('stopwatch', 'start');
    setSt(s => ({ ...s, running: true, startedAt: Date.now() }));
  }, []);

  const pause = useCallback(() => {
    if (!st.startedAt) return;
    const elapsed = st.elapsedMs + (Date.now() - st.startedAt);

    // Track completion with elapsed time
    trackEvent('stopwatch', 'complete', elapsed);

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

  // Pin/Unpin timer
  const { addTimer, removeTimer, isPinned } = usePinnedTimers();
  const pinned = isPinned(LS_KEY);

  const handlePin = useCallback(() => {
    if (pinned) {
      removeTimer(LS_KEY);
    } else {
      const timer: PinnedTimer = {
        id: LS_KEY,
        type: 'Stopwatch',
        name: 'Stopwatch',
      };
      addTimer(timer);
    }
  }, [pinned, addTimer, removeTimer]);

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
        <div ref={textRef} style={{ fontSize: `${autoFontSize}rem` }}>
          {fmt(currentTime)}
        </div>
      </div>

      {/* Controls */}
      <div className="stopwatch-controls">
        {!st.running ? (
          <button type="button" className="stopwatch-btn primary" onClick={start}>
            Start
          </button>
        ) : (
          <button type="button" className="stopwatch-btn primary" onClick={pause}>
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
        <button type="button" className="stopwatch-btn secondary hide-on-mobile" onClick={full}>
          Fullscreen
        </button>
        <button type="button" className="stopwatch-btn secondary" onClick={handlePin}>
          {pinned ? '📌 Unpin' : '📌 Pin'}
        </button>
      </div>

      {/* Share & Save Buttons */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <SavePresetButton
          timerType="stopwatch"
          getCurrentConfig={getCurrentConfig}
        />
        <ShareButton
          timerType="stopwatch"
          getCurrentConfig={getCurrentConfig}
        />
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
      {/* Fun Fact / Traffic Driver */}
      <DidYouKnowSnippet timerSlug="stopwatch" />
    </div>
  );
}
