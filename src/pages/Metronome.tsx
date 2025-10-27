import React, { useState, useEffect, useRef } from "react";
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
  const wrapRef = useRef<HTMLDivElement>(null);

  // Web Audio API lookahead scheduling
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const beatCountRef = useRef(0);
  const schedulerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  // Create soft click sound with ADSR envelope (2-5ms attack/release)
  const playClick = (time: number, isAccent: boolean) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = isAccent ? 1200 : 800;
    osc.connect(gain);
    gain.connect(ctx.destination);

    // ADSR envelope: 3ms attack, 40ms total duration, 3ms release
    const attackTime = 0.003; // 3ms attack
    const releaseTime = 0.003; // 3ms release
    const duration = 0.04; // 40ms total

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.3, time + attackTime); // Attack
    gain.gain.linearRampToValueAtTime(0.3, time + duration - releaseTime); // Sustain
    gain.gain.linearRampToValueAtTime(0, time + duration); // Release

    osc.start(time);
    osc.stop(time + duration);
  };

  // Schedule notes using lookahead
  const scheduleNote = (beatNumber: number, time: number) => {
    const isAccent = st.accentFirst && beatNumber === 0;
    playClick(time, isAccent);

    // Update UI - schedule at the right time
    const delay = (time - (audioCtxRef.current?.currentTime ?? 0)) * 1000;
    setTimeout(() => setCurrentBeat(beatNumber), Math.max(0, delay));
  };

  const scheduler = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const scheduleAheadTime = 0.2; // Schedule 200ms ahead

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      scheduleNote(beatCountRef.current, nextNoteTimeRef.current);

      const secondsPerBeat = 60.0 / st.bpm;
      nextNoteTimeRef.current += secondsPerBeat;

      beatCountRef.current = (beatCountRef.current + 1) % 4;
    }
  };

  useEffect(() => {
    if (running) {
      // Initialize AudioContext if needed
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      nextNoteTimeRef.current = ctx.currentTime + 0.005; // Start immediately
      beatCountRef.current = 0;

      // Schedule at 25ms intervals (lookahead scheduling)
      schedulerTimerRef.current = window.setInterval(() => {
        scheduler();
      }, 25);
    } else {
      if (schedulerTimerRef.current) {
        clearInterval(schedulerTimerRef.current);
        schedulerTimerRef.current = null;
      }
      beatCountRef.current = 0;
      setCurrentBeat(0);
    }

    return () => {
      if (schedulerTimerRef.current) {
        clearInterval(schedulerTimerRef.current);
      }
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
