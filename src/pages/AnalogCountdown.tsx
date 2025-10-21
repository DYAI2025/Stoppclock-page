import React, { useCallback, useEffect, useRef, useState } from "react";
import { HomeButton } from "../components/HomeButton";

type Persist = {
  version: 1;
  durationMs: number;
  remainingMs: number;
  running: boolean;
  endAt?: number | null;
  warnAtMs: number | null;
  signal: { sound: boolean; flash: boolean };
};

const LS_KEY = "sc.v1.analog";
const MAX = 4 * 3600_000; // 4 hours max for better readability

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${ss.toString().padStart(2,"0")}`;
}

function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw 0;
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      durationMs: clamp(p.durationMs, 1000, MAX),
      remainingMs: clamp(p.remainingMs, 0, MAX),
      running: !!p.running,
      endAt: p.endAt ?? null,
      warnAtMs: p.warnAtMs ?? 60_000,
      signal: { sound: !!p.signal?.sound, flash: !!p.signal?.flash }
    };
  } catch {
    return {
      version:1,
      durationMs: 30*60_000,
      remainingMs: 30*60_000,
      running:false,
      endAt:null,
      warnAtMs:60_000,
      signal:{sound:true, flash:true}
    };
  }
}

function save(p: Persist) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    // Silently fail - app continues to work
  }
}

function beep(ms=300, f=880) {
  try {
    const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.value = f;
    o.type = "sine";
    o.connect(g);
    g.connect(ac.destination);
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, ac.currentTime+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+ms/1000);
    o.start();
    o.stop(ac.currentTime+ms/1000+0.05);
  } catch {
    // Silently fail - audio may not be available
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

function hand(ctx:CanvasRenderingContext2D, len:number, ang:number, w:number, col:string, withShadow = false) {
  ctx.save();
  ctx.rotate(ang);

  // Shadow for depth (only on hour/minute hands)
  if (withShadow) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }

  // Hand shape - elegant taper
  ctx.beginPath();
  ctx.moveTo(-len*0.2, 0); // Back of hand
  ctx.lineTo(-len*0.05, -w*0.8); // Back taper
  ctx.lineTo(len*0.95, -w*0.3); // Front taper
  ctx.lineTo(len, 0); // Tip
  ctx.lineTo(len*0.95, w*0.3); // Front taper
  ctx.lineTo(-len*0.05, w*0.8); // Back taper
  ctx.closePath();

  ctx.fillStyle = col;
  ctx.fill();

  ctx.restore();
}

function draw(cnv:HTMLCanvasElement, st:Persist) {
  const ctx = cnv.getContext("2d");
  if (!ctx) return;
  const w = cnv.width;
  const h = cnv.height;
  const cx = w/2;
  const cy = h/2;
  const r = Math.min(w,h) * 0.42; // Slightly smaller for better proportions

  ctx.clearRect(0,0,w,h);

  // Background circle - clean white
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
  ctx.fill();

  // Outer border - elegant dark grey
  ctx.strokeStyle = "#36454F";
  ctx.lineWidth = Math.max(4, r * 0.025);
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy);

  // Clean minimalist hour markers (only 12, 3, 6, 9)
  const hourNumbers = [12, 3, 6, 9];
  ctx.fillStyle = "#36454F";
  ctx.font = `bold ${Math.floor(r * 0.15)}px 'Segoe UI', Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  hourNumbers.forEach(num => {
    const angle = ((num === 12 ? 0 : num) / 12) * Math.PI * 2 - Math.PI / 2;
    const dist = r * 0.75;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    ctx.fillText(num.toString(), x, y);
  });

  // Minute ticks - subtle and minimal
  for(let i=0; i<60; i++) {
    // Skip hour positions (0, 15, 30, 45)
    if (i % 15 === 0) continue;

    const a = i/60*Math.PI*2 - Math.PI/2;
    const isHourMark = i % 5 === 0;
    const len = isHourMark ? r*0.08 : r*0.04;

    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*(r-len), Math.sin(a)*(r-len));
    ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    ctx.strokeStyle = isHourMark ? "#708090" : "#D3D3D3";
    ctx.lineWidth = isHourMark ? Math.max(2, r*0.01) : Math.max(1, r*0.005);
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // Progress arc - single elegant ring showing remaining time
  if (st.remainingMs > 0) {
    const maxMs = 4 * 3600_000; // 4 hours max
    const progress = Math.min(1, st.remainingMs / maxMs);

    // Gradient from red (low) to green (high)
    const hue = progress * 120; // 0 (red) to 120 (green)
    const progressColor = `hsl(${hue}, 70%, 50%)`;

    // Single progress arc
    const angleProgress = progress * Math.PI * 2;
    ctx.beginPath();
    ctx.strokeStyle = progressColor;
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = "round";
    ctx.arc(0, 0, r * 0.88, -Math.PI/2, -Math.PI/2 + angleProgress, false);
    ctx.stroke();

    // Background arc (remaining portion) - subtle grey
    if (progress < 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(200, 200, 200, 0.2)";
      ctx.lineWidth = r * 0.12;
      ctx.lineCap = "round";
      ctx.arc(0, 0, r * 0.88, -Math.PI/2 + angleProgress, Math.PI * 1.5, false);
      ctx.stroke();
    }
  }

  // Map remaining time to clock hands (4-hour COUNTDOWN clock face)
  const totalSeconds = Math.floor(st.remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600); // Full hours (0-4)
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Minutes within the hour (0-59)
  const seconds = totalSeconds % 60; // Seconds within the minute (0-59)

  // Hour hand "schleicht" (moves gradually with minutes, like a real analog clock)
  // At 3:30, hour hand is halfway between 3 and 4
  const totalHoursWithMinutes = hours + (minutes / 60);

  // Stundenzeiger-Logik für 4-Stunden-Timer auf 12-Stunden-Zifferblatt:
  // Der Stundenzeiger bewegt sich wie bei einer normalen Uhr (12x langsamer als Minutenzeiger)
  // In 1 Stunde (60 Minuten) bewegt er sich um 5 Minuten-Markierungen (60/12 = 5)
  // In 0.5 Stunden (30 Minuten) bewegt er sich um 2.5 Minuten-Markierungen
  //
  // Für 4-Stunden-Timer: 4h = 20 Minuten-Markierungen (4 × 5)
  // Position = verbleibende Stunden × 5 Minuten / 60 Minuten = verbleibende Stunden / 12
  const hrs = totalHoursWithMinutes / 12; // Map to 12-hour clock face
  const mins = minutes / 60; // Map 0-59 minutes to 0-1
  const secs = seconds / 60; // Map 0-59 seconds to 0-1

  // Draw hands - modern elegant style
  hand(ctx, r*0.5, hrs*Math.PI*2 - Math.PI/2, r*0.035, "#36454F", true); // Hour hand - charcoal
  hand(ctx, r*0.72, mins*Math.PI*2 - Math.PI/2, r*0.025, "#36454F", true); // Minute hand - charcoal
  hand(ctx, r*0.82, secs*Math.PI*2 - Math.PI/2, r*0.012, "#DC143C", false); // Second hand - crimson

  // Center cap - elegant white with shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.beginPath();
  ctx.fillStyle = "#FFFFFF";
  ctx.arc(0, 0, Math.max(4, r*0.03), 0, Math.PI*2);
  ctx.fill();

  // Inner circle for center cap
  ctx.shadowColor = "transparent";
  ctx.beginPath();
  ctx.fillStyle = "#36454F";
  ctx.arc(0, 0, Math.max(2, r*0.015), 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

function flash(el:HTMLElement|null, ms=500) {
  if (!el) return;
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), ms);
}

export default function AnalogCountdown() {
  const [st, setSt] = useState<Persist>(() => load());
  const cnvRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const warned = useRef(false);

  const sync = useCallback(() => {
    if (!st.running || !st.endAt) return;
    const now = Date.now();
    const rem = Math.max(0, st.endAt - now);
    if (rem !== st.remainingMs) setSt(s => ({...s, remainingMs: rem}));
  }, [st.running, st.endAt, st.remainingMs]);

  useRaf(st.running, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  const lastSecondRef = useRef<number>(-1);

  useEffect(() => {
    // warn & finish
    const warnAt = st.warnAtMs;
    const isWarn = (warnAt != null) && st.running && st.remainingMs > 0 && st.remainingMs <= warnAt;
    if (isWarn && !warned.current) {
      warned.current = true;
      if (st.signal.flash) flash(wrapRef.current, 250);
      if (st.signal.sound) beep(140, 1200);
    }
    if (!isWarn) warned.current = false;

    // Last 10 seconds: beep every second (10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
    const secondsRemaining = Math.floor(st.remainingMs / 1000);
    if (st.running && secondsRemaining >= 1 && secondsRemaining <= 10) {
      // Only beep when we cross into a new second
      if (secondsRemaining !== lastSecondRef.current) {
        lastSecondRef.current = secondsRemaining;
        if (st.signal.sound) {
          // Higher pitch as we get closer to zero
          const pitch = 800 + (11 - secondsRemaining) * 50; // 850Hz at 10s, 1300Hz at 1s
          beep(150, pitch); // Short, crisp beep
        }
      }
    }

    // Finish: loud bimmeln (multiple beeps like an alarm clock)
    if (st.running && st.remainingMs <= 0) {
      lastSecondRef.current = -1; // Reset for next countdown
      setSt(s => ({...s, running: false, endAt: null, remainingMs: 0}));
      if (st.signal.flash) flash(wrapRef.current, 900);
      if (st.signal.sound) {
        // Alarm bimmeln - multiple beeps like a real alarm clock
        beep(200, 880); // First beep
        setTimeout(() => beep(200, 880), 250);
        setTimeout(() => beep(200, 880), 500);
        setTimeout(() => beep(400, 660), 750); // Final longer lower beep
      }
    }
  }, [st.remainingMs, st.running, st.signal, st.warnAtMs]);

  useEffect(() => {
    // size
    const cnv = cnvRef.current;
    if (!cnv) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const r = cnv.getBoundingClientRect();
      cnv.width = Math.floor(r.width * dpr);
      cnv.height = Math.floor(r.height * dpr);
      draw(cnv, st);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cnv);
    return () => ro.disconnect();
  }, [st.durationMs, st.remainingMs, st.running]);

  useRaf(true, () => {
    const c = cnvRef.current;
    if (c) draw(c, st);
  });

  const start = useCallback(() => {
    if (st.remainingMs <= 0) {
      setSt(s => ({...s, remainingMs: s.durationMs, running: true, endAt: Date.now() + s.durationMs}));
    } else {
      setSt(s => ({...s, running: true, endAt: Date.now() + s.remainingMs}));
    }
  }, [st.remainingMs, st.durationMs]);

  const pause = useCallback(() => setSt(s => ({...s, running: false, endAt: null})), []);
  const reset = useCallback(() => setSt(s => ({...s, running: false, endAt: null, remainingMs: s.durationMs})), []);

  const plus = useCallback((ms: number) => setSt(s => {
    const base = s.running ? Math.max(0, (s.endAt ?? Date.now()) - Date.now()) : s.remainingMs;
    const next = clamp(base + ms, 0, MAX);
    return s.running ? {...s, remainingMs: next, endAt: Date.now() + next} : {...s, remainingMs: next};
  }), []);

  const setDur = useCallback((ms: number) => setSt(s => ({
    ...s,
    durationMs: clamp(ms, 1000, MAX),
    remainingMs: clamp(ms, 1000, MAX),
    running: false,
    endAt: null
  })), []);

  const full = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "Space") {
        e.preventDefault();
        st.running ? pause() : start();
      } else if (e.key.toLowerCase() === "r") {
        reset();
      } else if (e.key.toLowerCase() === "f") {
        full();
      } else if (e.key === "ArrowUp") {
        plus(10_000);
      } else if (e.key === "ArrowDown") {
        plus(-10_000);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [start, pause, reset, plus, full, st.running]);

  return (
    <div className="analog-page" ref={wrapRef}>
      {/* Header */}
      <header className="analog-header">
        <h1 className="analog-title">Analog Countdown</h1>
        <HomeButton />
      </header>

      {/* Canvas (colors preserved in drawing code) */}
      <div className="analog-canvas-container">
        <canvas ref={cnvRef} className="analog-canvas" width={800} height={800} />
      </div>

      {/* Controls */}
      <div className="analog-controls">
        {!st.running ? (
          <button type="button" className="analog-btn" onClick={start}>Start</button>
        ) : (
          <button type="button" className="analog-btn" onClick={pause}>Pause</button>
        )}
        <button type="button" className="analog-btn secondary" onClick={reset}>Reset</button>
        <button type="button" className="analog-btn secondary" onClick={full}>Fullscreen</button>
      </div>

      {/* Presets */}
      <div className="analog-presets">
        <button type="button" className="analog-preset" onClick={() => setDur(5 * 60_000)}>5m</button>
        <button type="button" className="analog-preset" onClick={() => setDur(10 * 60_000)}>10m</button>
        <button type="button" className="analog-preset" onClick={() => setDur(30 * 60_000)}>30m</button>
        <button type="button" className="analog-preset" onClick={() => setDur(60 * 60_000)}>1h</button>
        <button type="button" className="analog-preset" onClick={() => setDur(90 * 60_000)}>1h30m</button>
        <button type="button" className="analog-preset" onClick={() => setDur(2 * 60 * 60_000)}>2h</button>
      </div>

      {/* Settings */}
      <div className="countdown-settings">
        <label>
          <input
            type="checkbox"
            checked={st.signal.sound}
            onChange={(e) => setSt(s => ({ ...s, signal: { ...s.signal, sound: e.target.checked } }))}
          />
          Sound
        </label>
        <label>
          <input
            type="checkbox"
            checked={st.signal.flash}
            onChange={(e) => setSt(s => ({ ...s, signal: { ...s.signal, flash: e.target.checked } }))}
          />
          Flash
        </label>
      </div>
    </div>
  );
}
