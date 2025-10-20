import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

function hand(ctx:CanvasRenderingContext2D, len:number, ang:number, w:number, col:string) {
  ctx.save();
  ctx.rotate(ang);
  ctx.beginPath();
  ctx.moveTo(-len*0.15,0);
  ctx.lineTo(len,0);
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

function draw(cnv:HTMLCanvasElement, st:Persist) {
  const ctx = cnv.getContext("2d");
  if (!ctx) return;
  const w = cnv.width;
  const h = cnv.height;
  const cx = w/2;
  const cy = h/2;
  const r = Math.min(w,h) * 0.45;

  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--bg") || "#0b1220";
  ctx.fillRect(0,0,w,h);

  ctx.save();
  ctx.translate(cx, cy);

  // ring
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI*2);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = Math.max(2, r*0.01);
  ctx.stroke();

  // ticks
  for(let i=0; i<60; i++) {
    const a = i/60*Math.PI*2 - Math.PI/2;
    const len = i%5===0 ? r*0.09 : r*0.045;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*(r-len), Math.sin(a)*(r-len));
    ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    ctx.strokeStyle = i%5===0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)";
    ctx.lineWidth = i%5===0 ? Math.max(3, r*0.012) : Math.max(1, r*0.006);
    ctx.stroke();
  }

  // Draw color-coded hour rings (4 hours max, each hour a different color)
  // Colors stacked from inside to outside, visible between 50min mark and 12 o'clock
  const maxMs = 4 * 3600_000; // 4 hours max
  const hourColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]; // green, blue, orange, red

  if (st.remainingMs > 0) {
    const totalMinutes = st.remainingMs / 60_000;
    const currentHour = Math.floor(totalMinutes / 60); // Which hour are we in (0-3)
    const minutesInCurrentHour = totalMinutes % 60; // Minutes within current hour

    // Draw completed hour rings (from inside out)
    const ringWidth = r * 0.06;
    const baseRadius = r * 0.70;

    for (let h = 0; h < currentHour; h++) {
      ctx.beginPath();
      ctx.strokeStyle = hourColors[h];
      ctx.lineWidth = ringWidth;
      ctx.lineCap = "round";
      ctx.arc(0, 0, baseRadius + h * ringWidth, -Math.PI/2, Math.PI * 1.5, false);
      ctx.stroke();
    }

    // Draw current partial hour ring
    if (currentHour < 4) {
      const angleInHour = (minutesInCurrentHour / 60) * Math.PI * 2;
      ctx.beginPath();
      ctx.strokeStyle = hourColors[currentHour];
      ctx.lineWidth = ringWidth;
      ctx.lineCap = "round";
      ctx.arc(0, 0, baseRadius + currentHour * ringWidth, -Math.PI/2, -Math.PI/2 + angleInHour, false);
      ctx.stroke();
    }
  }

  // map remaining to hands (4-hour clock face)
  const totalSeconds = Math.floor(st.remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600); // Full hours (0-4)
  const minutes = Math.floor((totalSeconds % 3600) / 60); // Minutes within the hour (0-59)
  const seconds = totalSeconds % 60; // Seconds within the minute (0-59)

  // Hour hand moves gradually with minutes (like a real clock)
  const totalHoursWithMinutes = hours + (minutes / 60);
  const hrs = (totalHoursWithMinutes % 4) / 4; // Map 0-4 hours to 0-1 for full circle
  const mins = minutes / 60; // Map 0-59 minutes to 0-1
  const secs = seconds / 60; // Map 0-59 seconds to 0-1

  hand(ctx, r*0.5, hrs*Math.PI*2 - Math.PI/2, Math.max(6, r*0.03), "white");
  hand(ctx, r*0.72, mins*Math.PI*2 - Math.PI/2, Math.max(4, r*0.02), "white");
  hand(ctx, r*0.82, secs*Math.PI*2 - Math.PI/2, Math.max(2, r*0.01), "#60a5fa");

  // center
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(0, 0, Math.max(3, r*0.02), 0, Math.PI*2);
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
    if (st.running && st.remainingMs <= 0) {
      setSt(s => ({...s, running: false, endAt: null, remainingMs: 0}));
      if (st.signal.flash) flash(wrapRef.current, 900);
      if (st.signal.sound) beep(600, 660);
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

  const presets = useMemo(() => [5, 10, 15, 30, 45, 60, 90, 120, 180, 240], []); // Max 240min = 4 hours

  return (
    <div ref={wrapRef} className="analog-wrap">
      <div className="analog-topbar">
        <a href="#/" className="btn-home">Home</a>
        <div className="hms">{fmt(st.remainingMs)}</div>
        <div className="controls">
          <button onClick={() => st.running ? pause() : start()} className="btn primary">
            {st.running ? "Pause" : "Start"}
          </button>
          <button onClick={reset} className="btn">Reset</button>
          <button onClick={() => plus(60_000)} className="btn">+1m</button>
          <button onClick={() => plus(-60_000)} className="btn">−1m</button>
          <button onClick={full} className="btn">Fullscreen</button>
        </div>
      </div>
      <div className="analog-canvas"><canvas ref={cnvRef}/></div>
      <div className="analog-presets">
        {presets.map(min => (
          <button
            key={min}
            className="chip"
            onClick={() => setDur(min * 60_000)}
          >
            {min >= 60 ? `${min/60}h` : `${min}m`}
          </button>
        ))}
        <label className="warn">
          Warn at:
          <select
            value={String(st.warnAtMs ?? 0)}
            onChange={(e) => setSt(s => ({...s, warnAtMs: Number(e.target.value) || null}))}
          >
            <option value="0">off</option>
            <option value="60000">1m</option>
            <option value="300000">5m</option>
            <option value="600000">10m</option>
          </select>
        </label>
        <label className="sig">
          <input
            type="checkbox"
            checked={st.signal.sound}
            onChange={e => setSt(s => ({...s, signal: {...s.signal, sound: e.target.checked}}))}
          />
          Sound
        </label>
        <label className="sig">
          <input
            type="checkbox"
            checked={st.signal.flash}
            onChange={e => setSt(s => ({...s, signal: {...s.signal, flash: e.target.checked}}))}
          />
          Flash
        </label>
      </div>
    </div>
  );
}
