import React, { useState, useEffect, useRef } from "react";
import { beep, flash } from "../utils";
import { HomeButton } from "../components/HomeButton";

const LS_KEY = "sc.v1.metronome";
const MIN_BPM = 40;
const MAX_BPM = 240;

type Persist = {
  version: 1;
  bpm: number;
  accentFirst: boolean;
};

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      bpm: Math.max(MIN_BPM, Math.min(MAX_BPM, p.bpm ?? 120)),
      accentFirst: p.accentFirst !== false
    };
  } catch {
    return {
      version: 1,
      bpm: 120,
      accentFirst: true
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

export default function Metronome() {
  const [st, setSt] = useState<Persist>(load);
  const [running, setRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const beatCount = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  useEffect(() => {
    if (running) {
      const intervalMs = 60000 / st.bpm;
      intervalRef.current = window.setInterval(() => {
        beatCount.current = (beatCount.current + 1) % 4;
        setCurrentBeat(beatCount.current);
        const isAccent = st.accentFirst && beatCount.current === 0;
        beep(50, isAccent ? 1200 : 800);
      }, intervalMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      beatCount.current = 0;
      setCurrentBeat(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, st.bpm, st.accentFirst]);

  const changeBpm = (delta: number) => {
    setSt(s => ({ ...s, bpm: Math.max(MIN_BPM, Math.min(MAX_BPM, s.bpm + delta)) }));
  };

  return (
    <div className="metronome-wrap" ref={wrapRef}>
      <HomeButton />
      <h2>Metronome</h2>

      <div className="bpm-display">{st.bpm} BPM</div>

      {/* Beat indicator dots */}
      <div className="beat-indicators">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`beat-dot ${running && currentBeat === i ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="bpm-controls">
        <button className="btn" onClick={() => changeBpm(-10)}>−10</button>
        <button className="btn" onClick={() => changeBpm(-1)}>−</button>
        <button className="btn" onClick={() => changeBpm(1)}>+</button>
        <button className="btn" onClick={() => changeBpm(10)}>+10</button>
      </div>

      <div className="metronome-controls">
        <button className="btn-primary-action" onClick={() => setRunning(!running)}>
          {running ? "Stop" : "Start"}
        </button>
        <label className="metronome-toggle">
          <input
            type="checkbox"
            checked={st.accentFirst}
            onChange={e => setSt(s => ({ ...s, accentFirst: e.target.checked }))}
          />
          <span>Accent first beat</span>
        </label>
      </div>

      <div className="bpm-slider">
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={st.bpm}
          onChange={e => setSt(s => ({ ...s, bpm: Number(e.target.value) }))}
        />
      </div>
    </div>
  );
}
