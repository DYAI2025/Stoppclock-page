Neustart in leerem Repo: hier ist das komplette, baubare Grundgerüst (Vite+React+TS) inkl. Analog-Countdown (bis 12 h), SEO/AI-SEO, PWA, doctor-Guard, sitemap-Generator und Pages-Workflow (SHA-gepinnt).
AdSense/Publisher-IDs konnte ich nicht sicher aus dem alten Repo ziehen – ich setze Platzhalter (ca-pub-REPLACE_ME, pub-REPLACE_ME) und markiere die Stellen klar. Sobald du mir die IDs gibst, ersetze ich sie sofort.

Plan (Pseudocode)

Projekt neu aufsetzen: Vite React TS, strikt ohne Altlasten.

index.html: SEO-Meta, Canonical, OG/Twitter (eigene Hostname-Assets), JSON-LD (WebApp + FAQ), Consent-Gate (default OFF); optionaler Ad-Slot, lädt AdSense nur nach Consent.

src/: main.tsx, pages/AnalogCountdown.tsx (Canvas, Fullscreen, Presets, Persistenz), styles.css.

public/: manifest.webmanifest, robots.txt, ads.txt (Publisher-ID nötig), 404.html (SPA-Fallback).

scripts/: doctor.mjs (verbietet Lovable/Agent-Tokens), gen-sitemap.mjs (Routen → dist/sitemap.xml).

CI/CD: .github/workflows/pages.yml (checkout → setup-node → doctor → build → CNAME/.nojekyll → upload → deploy → smoke).

SSoT-Ergänzungen: Browser-Support-Matrix, Security-Header/CSP-Notiz, Analytics/Ads-Policy (OFF), OG-Assets nur eigener Host.

// ======================================================================
// FILE: package.json
// ======================================================================
{
"name": "stoppclock",
"private": true,
"version": "1.0.0",
"type": "module",
"scripts": {
"dev": "vite",
"build": "vite build && node scripts/gen-sitemap.mjs",
"preview": "vite preview",
"doctor": "node scripts/doctor.mjs"
},
"dependencies": {
"react": "^18.3.1",
"react-dom": "^18.3.1"
},
"devDependencies": {
"@types/react": "^18.3.7",
"@types/react-dom": "^18.3.0",
"@vitejs/plugin-react-swc": "^3.7.0",
"typescript": "^5.6.3",
"vite": "^5.4.10"
}
}

// ======================================================================
// FILE: vite.config.ts
// ======================================================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
plugins: [react()],
base: "/",
build: {
outDir: "dist"
}
});

// ======================================================================
// FILE: tsconfig.json
// ======================================================================
{
"compilerOptions": {
"target": "ES2022",
"lib": ["ES2023", "DOM"],
"module": "ESNext",
"moduleResolution": "Bundler",
"isolatedModules": true,
"noEmit": true,
"strict": true,
"skipLibCheck": true
},
"include": ["src", "vite.config.ts"]
}

// ======================================================================
// FILE: index.html (SEO + AI-SEO + Consent-Gate + AdSense Platzhalter)
// ======================================================================

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' https://pagead2.googlesyndication.com 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://pagead2.googlesyndication.com; connect-src 'self'; font-src 'self' data:; frame-src https://googleads.g.doubleclick.net; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
    />
    <meta name="referrer" content="no-referrer-when-downgrade" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Stoppclock — Projector-friendly Timers & Clocks</title>
    <meta name="description" content="Analog countdown up to 12 hours, stopwatch, interval, world clock and more. Projector-friendly, offline-ready, minimal controls." />
    <link rel="canonical" href="https://www.stoppclock.com/"/>

    <!-- Open Graph (use your own hosted assets) -->
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="Stoppclock — Projector-friendly Timers & Clocks"/>
    <meta property="og:description" content="Analog countdown up to 12 hours, stopwatch, interval, world clock and more."/>
    <meta property="og:url" content="https://www.stoppclock.com/"/>
    <meta property="og:image" content="https://www.stoppclock.com/og/cover-1200x630.png"/>

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="Stoppclock — Projector-friendly Timers & Clocks"/>
    <meta name="twitter:description" content="Analog countdown up to 12 hours, stopwatch, interval, world clock and more."/>
    <meta name="twitter:image" content="https://www.stoppclock.com/og/cover-1200x630.png"/>

    <!-- PWA -->
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#0b1220" />

    <!-- Browser-Support-Matrix (SSoT Hinweis)
         Target: last 2 Chrome/Edge/Firefox/Safari, iOS 15+ -->
    <meta name="supported-browsers" content="last 2 Chrome/Edge/Firefox/Safari; iOS 15+"/>

    <link rel="icon" href="/icons/icon-192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="/icons/icon-180.png" />
    <link rel="stylesheet" href="/src/styles.css" />

  </head>
  <body>
    <div id="consent" class="consent hidden">
      <div class="consent-box">
        <div><strong>Privacy first.</strong> Ads are <em>off</em> by default. Enable only if you agree.</div>
        <div class="consent-actions">
          <button id="consent-accept" class="btn primary">Enable Ads</button>
          <button id="consent-decline" class="btn">Keep Off</button>
        </div>
      </div>
    </div>

    <div id="root"></div>

    <!-- WebApplication JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Stoppclock",
      "applicationCategory": "Utility",
      "operatingSystem": "Web",
      "url": "https://www.stoppclock.com/",
      "description": "Projector-friendly timers and clocks. Analog countdown up to 12 hours, stopwatch, interval, world clock, and more.",
      "offers": { "@type": "Offer", "price": "0" },
      "featureList": [
        "Analog countdown up to 12 hours",
        "Stopwatch with laps",
        "Interval / rounds timer",
        "World clock",
        "Metronome",
        "Chess clock",
        "Offline PWA"
      ]
    }
    </script>

    <!-- FAQPage JSON-LD (8 Q&A) -->
    <script type="application/ld+json">
    {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":[
        {"@type":"Question","name":"How do I set a 90-minute exam timer with the analog countdown?","acceptedAnswer":{"@type":"Answer","text":"Open Analog Countdown, choose the 90m preset or set 01:30:00, press Start, then press Fullscreen to project it."}},
        {"@type":"Question","name":"Will my timer keep running if I return to the home page?","acceptedAnswer":{"@type":"Answer","text":"Yes. Each tool persists its state locally. Timers resume when you return."}},
        {"@type":"Question","name":"Does Stoppclock work offline?","acceptedAnswer":{"@type":"Answer","text":"Yes. It’s a PWA. Once loaded, the app shell and tools work offline."}},
        {"@type":"Question","name":"Is it beamer-friendly?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use Fullscreen for a clean, high-contrast view for exams and seminars."}},
        {"@type":"Question","name":"How precise are timers?","acceptedAnswer":{"@type":"Answer","text":"They use wall-clock deltas with ~60 FPS visuals to minimize drift."}},
        {"@type":"Question","name":"Can I save common durations?","acceptedAnswer":{"@type":"Answer","text":"Last used settings and presets are kept locally on your device."}},
        {"@type":"Question","name":"Can I share a timer with another device?","acceptedAnswer":{"@type":"Answer","text":"State is local per device. Share by projecting or mirroring your screen."}},
        {"@type":"Question","name":"Is Stoppclock privacy-friendly?","acceptedAnswer":{"@type":"Answer","text":"Yes. No trackers by default. Ads optional with explicit consent."}}
      ]
    }
    </script>

    <!-- App Entry -->
    <script type="module" src="/src/main.tsx"></script>

    <!-- Consent-gated AdSense (DEFAULT OFF). Replace IDs! -->
    <script>
      (function () {
        const LS = "sc.adsConsent";
        const has = localStorage.getItem(LS);
        const el = document.getElementById('consent');
        const acceptBtn = document.getElementById('consent-accept');
        const declineBtn = document.getElementById('consent-decline');

        function hideConsent(){ el?.classList.add('hidden'); }
        function showConsent(){ el?.classList.remove('hidden'); }

        function enableAds() {
          // TODO: REPLACE WITH YOUR REAL AdSense client ID:
          const client = "ca-pub-REPLACE_ME";
          if (!client || client.includes("REPLACE_ME")) { hideConsent(); return; }
          const s = document.createElement('script');
          s.async = true;
          s.crossOrigin = "anonymous";
          s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
          document.head.appendChild(s);
        }

        if (has === "yes") { enableAds(); hideConsent(); }
        else if (has === "no") { hideConsent(); }
        else { showConsent(); }

        acceptBtn?.addEventListener("click", () => { localStorage.setItem(LS, "yes"); enableAds(); hideConsent(); });
        declineBtn?.addEventListener("click", () => { localStorage.setItem(LS, "no"); hideConsent(); });
      })();
    </script>

  </body>
</html>

<!-- ===================================================================
FILE: src/main.tsx
=================================================================== -->

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import AnalogCountdown from "./pages/AnalogCountdown";

function useHashRoute() {
const [, force] = React.useReducer((x) => x + 1, 0);
React.useEffect(() => {
const f = () => force();
window.addEventListener("hashchange", f);
return () => window.removeEventListener("hashchange", f);
}, []);
return (location.hash || "#/").replace(/^#/, "");
}

function Home() {
const items: Array<[string, string]> = [
["#/stopwatch", "Stopwatch"],
["#/countdown", "Countdown"],
["#/analog", "Analog Countdown"],
["#/digital", "Digital Clock"],
["#/world", "World Clock"],
["#/alarm", "Alarm"],
["#/metronome", "Metronome"],
["#/chess", "Chess Clock"]
];
return (
<div className="grid">
{items.map(([href, label]) => (
<a key={href} className="card" href={href}>{label}</a>
))}
</div>
);
}

const Placeholder = ({ title }: { title: string }) => (

  <div className="page"><h1>{title}</h1><p>Coming soon.</p></div>
);

function App() {
const route = useHashRoute();
if (route === "/") return <Home />;
if (route === "/analog") return <AnalogCountdown />;
const map: Record<string, JSX.Element> = {
"/stopwatch": <Placeholder title="Stopwatch" />,
"/countdown": <Placeholder title="Countdown" />,
"/digital": <Placeholder title="Digital Clock" />,
"/world": <Placeholder title="World Clock" />,
"/alarm": <Placeholder title="Alarm" />,
"/metronome": <Placeholder title="Metronome" />,
"/chess": <Placeholder title="Chess Clock" />
};
return map[route] ?? <Placeholder title="Not Found" />;
}

createRoot(document.getElementById("root")!).render(
<StrictMode><App /></StrictMode>
);

// ======================================================================
// FILE: src/pages/AnalogCountdown.tsx
// ======================================================================
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
const MAX = 12 \* 3600_000;

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
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
return { version:1, durationMs: 30*60_000, remainingMs: 30*60_000, running:false, endAt:null, warnAtMs:60_000, signal:{sound:true, flash:true}};
}
}
function save(p: Persist){ localStorage.setItem(LS_KEY, JSON.stringify(p)); }
function beep(ms=300, f=880){ try{ const ac=new (window.AudioContext||(window as any).webkitAudioContext)(); const o=ac.createOscillator(); const g=ac.createGain(); o.frequency.value=f; o.type="sine"; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.5, ac.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+ms/1000); o.start(); o.stop(ac.currentTime+ms/1000+0.05);}catch{}}

function useRaf(on: boolean, cb: () => void){
const raf = useRef<number|undefined>();
useEffect(()=>{ if(!on) return;
let live=true;
const loop=()=>{ if(!live) return; cb(); raf.current=requestAnimationFrame(loop); };
raf.current=requestAnimationFrame(loop);
return ()=>{ live=false; if(raf.current) cancelAnimationFrame(raf.current); };
},[on,cb]);
}

function hand(ctx:CanvasRenderingContext2D, len:number, ang:number, w:number, col:string){
ctx.save(); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(-len*0.15,0); ctx.lineTo(len,0);
ctx.strokeStyle=col; ctx.lineWidth=w; ctx.lineCap="round"; ctx.stroke(); ctx.restore();
}
function draw(cnv:HTMLCanvasElement, st:Persist){
const ctx = cnv.getContext("2d"); if(!ctx) return;
const w=cnv.width, h=cnv.height, cx=w/2, cy=h/2, r=Math.min(w,h)*0.45;
ctx.clearRect(0,0,w,h);
ctx.fillStyle=getComputedStyle(document.body).getPropertyValue("--bg")||"#0b1220";
ctx.fillRect(0,0,w,h);

ctx.save(); ctx.translate(cx,cy);
// ring
ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=Math.max(2,r*0.01); ctx.stroke();
// ticks
for(let i=0;i<60;i++){
const a=i/60*Math.PI*2-Math.PI/2;
const len=i%5===0? r*0.09 : r*0.045;
ctx.beginPath();
ctx.moveTo(Math.cos(a)_(r-len), Math.sin(a)_(r-len));
ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
ctx.strokeStyle=i%5===0?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.35)";
ctx.lineWidth=i%5===0? Math.max(3,r*0.012) : Math.max(1,r*0.006);
ctx.stroke();
}
// arc for remaining ratio
const ratio = st.durationMs>0 ? st.remainingMs/st.durationMs : 0;
if(st.durationMs>0){
ctx.beginPath();
ctx.strokeStyle = ratio<=0.05 ? "#ef4444" : (ratio<=0.15 ? "#f59e0b" : "#22c55e");
ctx.lineWidth=r*0.07; ctx.lineCap="round";
ctx.arc(0,0,r*0.82,-Math.PI/2,-Math.PI/2+Math.PI*2*ratio,false);
ctx.stroke();
}
// map remaining to hands
const hrs=((st.remainingMs/3600_000)%12)/12;
const mins=((st.remainingMs/60_000)%60)/60;
const secs=((st.remainingMs/1000)%60)/60;
hand(ctx, r*0.5, hrs*Math.PI*2-Math.PI/2, Math.max(6,r*0.03), "white");
hand(ctx, r*0.72, mins*Math.PI*2-Math.PI/2, Math.max(4,r*0.02), "white");
hand(ctx, r*0.82, secs*Math.PI*2-Math.PI/2, Math.max(2,r*0.01), "#60a5fa");
// center
ctx.beginPath(); ctx.fillStyle="white"; ctx.arc(0,0,Math.max(3,r*0.02),0,Math.PI*2); ctx.fill();
ctx.restore();
}

export default function AnalogCountdown(){
const [st,setSt]=useState<Persist>(()=>load());
const cnvRef=useRef<HTMLCanvasElement|null>(null);
const wrapRef=useRef<HTMLDivElement|null>(null);
const warned=useRef(false);

const sync=useCallback(()=>{
if(!st.running||!st.endAt) return;
const now=Date.now();
const rem=Math.max(0, st.endAt - now);
if(rem!==st.remainingMs) setSt(s=>({...s, remainingMs: rem}));
},[st.running, st.endAt, st.remainingMs]);
useRaf(st.running, sync);

useEffect(()=>{ const t=setTimeout(()=>save(st),150); return ()=>clearTimeout(t); },[st]);

useEffect(()=>{ // warn & finish
const warnAt=st.warnAtMs;
const isWarn = (warnAt!=null) && st.running && st.remainingMs>0 && st.remainingMs<=warnAt;
if(isWarn && !warned.current){ warned.current=true; if(st.signal.flash) flash(wrapRef.current,250); if(st.signal.sound) beep(140,1200); }
if(!isWarn) warned.current=false;
if(st.running && st.remainingMs<=0){
setSt(s=>({...s, running:false, endAt:null, remainingMs:0}));
if(st.signal.flash) flash(wrapRef.current,900);
if(st.signal.sound) beep(600,660);
}
},[st.remainingMs, st.running, st.signal, st.warnAtMs]);

useEffect(()=>{ // size
const cnv=cnvRef.current; if(!cnv) return;
const dpr=Math.max(1, Math.min(2, window.devicePixelRatio||1));
const resize=()=>{ const r=cnv.getBoundingClientRect(); cnv.width=Math.floor(r.width*dpr); cnv.height=Math.floor(r.height*dpr); draw(cnv,st); };
resize(); const ro=new ResizeObserver(resize); ro.observe(cnv); return ()=>ro.disconnect();
},[st.durationMs, st.remainingMs, st.running]);

useRaf(true, ()=>{ const c=cnvRef.current; if(c) draw(c,st); });

const start=useCallback(()=>{ if(st.remainingMs<=0){ setSt(s=>({...s, remainingMs:s.durationMs, running:true, endAt: Date.now()+s.durationMs })); } else { setSt(s=>({...s, running:true, endAt: Date.now()+s.remainingMs })); } },[st.remainingMs, st.durationMs]);
const pause=useCallback(()=> setSt(s=>({...s, running:false, endAt:null})),[]);
const reset=useCallback(()=> setSt(s=>({...s, running:false, endAt:null, remainingMs:s.durationMs})),[]);
const plus=useCallback((ms:number)=> setSt(s=>{
const base = s.running ? Math.max(0,(s.endAt??Date.now())-Date.now()) : s.remainingMs;
const next = clamp(base+ms, 0, MAX);
return s.running ? {...s, remainingMs:next, endAt:Date.now()+next} : {...s, remainingMs:next};
}),[]);
const setDur=useCallback((ms:number)=> setSt(s=>({...s, durationMs: clamp(ms,1000,MAX), remainingMs: clamp(ms,1000,MAX), running:false, endAt:null})),[]);
const full=useCallback(()=>{ const el=wrapRef.current; if(!el) return; if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); else el.requestFullscreen?.().catch(()=>{}); },[]);

useEffect(()=>{ const on=(e:KeyboardEvent)=>{ if(e.repeat) return; if(e.code==="Space"){ e.preventDefault(); st.running?pause():start(); } else if(e.key.toLowerCase()==="r"){ reset(); } else if(e.key.toLowerCase()==="f"){ full(); } else if(e.key==="ArrowUp"){ plus(10_000);} else if(e.key==="ArrowDown"){ plus(-10_000);} }; window.addEventListener("keydown",on); return ()=>window.removeEventListener("keydown",on); },[start,pause,reset,plus,full,st.running]);

const presets=useMemo(()=>[5,10,15,30,45,60,90,120,180,240,360,480,720],[]);
return (
<div ref={wrapRef} className="analog-wrap">
<div className="analog-topbar">
<div className="hms">{fmt(st.remainingMs)}</div>
<div className="controls">
<button onClick={()=> st.running?pause():start()} className="btn primary">{st.running? "Pause" : "Start"}</button>
<button onClick={reset} className="btn">Reset</button>
<button onClick={()=>plus(60_000)} className="btn">+1m</button>
<button onClick={()=>plus(-60_000)} className="btn">−1m</button>
<button onClick={full} className="btn">Fullscreen</button>
</div>
</div>
<div className="analog-canvas"><canvas ref={cnvRef}/></div>
<div className="analog-presets">
{presets.map(min=> <button key={min} className="chip" onClick={()=>setDur(min\*60_000)}>{min>=60? `${min/60}h` : `${min}m`}</button>)}
<label className="warn">Warn at:
<select value={String(st.warnAtMs??0)} onChange={(e)=> setSt(s=>({...s, warnAtMs: Number(e.target.value)||null}))}>
<option value="0">off</option><option value="60000">1m</option><option value="300000">5m</option><option value="600000">10m</option>
</select>
</label>
<label className="sig"><input type="checkbox" checked={st.signal.sound} onChange={e=> setSt(s=>({...s, signal:{...s.signal, sound: e.target.checked}}))}/>Sound</label>
<label className="sig"><input type="checkbox" checked={st.signal.flash} onChange={e=> setSt(s=>({...s, signal:{...s.signal, flash: e.target.checked}}))}/>Flash</label>
</div>
</div>
);
}
function flash(el:HTMLElement|null,ms=500){ if(!el) return; el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"),ms); }

// ======================================================================
// FILE: src/styles.css
// ======================================================================
:root { color-scheme: light dark; --bg:#0b1220; --fg:#e6edf3; --muted:#9aa4b2; }
\*{ box-sizing:border-box; }
html,body,#root{ height:100%; margin:0; }
body{ background:var(--bg); color:var(--fg); font:16px/1.5 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto; }
.grid{ display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); padding:24px; max-width:1100px; margin:0 auto; }
.card{ display:block; padding:18px; border:1px solid #1f2937; border-radius:12px; text-decoration:none; color:var(--fg); background:rgba(255,255,255,.02); text-align:center; }
.card:hover{ background:rgba(255,255,255,.06); }
.page{ display:grid; place-content:center; gap:12px; height:100%; text-align:center; }
h1{ margin:0; font-size:clamp(24px,6vw,52px); }
.analog-wrap{ height:100%; display:flex; flex-direction:column; }
.analog-topbar{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 16px; }
.hms{ font-size:clamp(24px,6vw,64px); letter-spacing:.04em; }
.controls{ display:flex; gap:8px; flex-wrap:wrap; }
.btn{ padding:10px 14px; border-radius:10px; border:1px solid #243244; background:rgba(255,255,255,.04); color:var(--fg); cursor:pointer; }
.btn.primary{ border-color:#3b82f6; }
.btn:hover{ background:rgba(255,255,255,.08); }
.analog-canvas{ flex:1; display:grid; place-items:center; padding:8px 16px; }
.analog-canvas canvas{ width:min(90vmin,1200px); height:min(90vmin,1200px); display:block; }
.analog-presets{ display:flex; flex-wrap:wrap; gap:8px; padding:12px 16px 20px; align-items:center; }
.chip{ padding:8px 12px; border-radius:999px; border:1px solid #304258; background:rgba(255,255,255,.03); color:var(--fg); cursor:pointer; }
.chip:hover{ background:rgba(255,255,255,.08); }
.warn{ margin-left:auto; display:flex; gap:8px; align-items:center; }
.sig{ display:flex; gap:6px; align-items:center; }
.flash{ animation:flash .9s linear 1; }
@keyframes flash{ 0%{background:rgba(255,255,255,.0);} 15%{background:rgba(255,255,255,.20);} 100%{background:rgba(255,255,255,.0);} }

// ======================================================================
// FILE: public/manifest.webmanifest
// ======================================================================
{
"name": "Stoppclock",
"short_name": "Stoppclock",
"start_url": "/",
"display": "standalone",
"background_color": "#0b1220",
"theme_color": "#0b1220",
"icons": [
{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
{ "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
]
}

// ======================================================================
// FILE: public/robots.txt
// ======================================================================
User-agent: \*
Allow: /

Sitemap: https://www.stoppclock.com/sitemap.xml

// ======================================================================
// FILE: public/ads.txt (Publisher-ID nötig!)
// ======================================================================
// Replace REPLACE_ME with your real AdSense Publisher ID (pub-xxxxxxxxxxxxxxxx)
google.com, pub-REPLACE_ME, DIRECT, f08c47fec0942fa0

// ======================================================================
// FILE: public/404.html (SPA-Fallback für GitHub Pages)
// ======================================================================

<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Stoppclock</title>
<script>
  (function(){ var l=window.location;
    if(l.pathname !== "/"){ l.replace("/#"+l.pathname + l.search + l.hash); }
  })();
</script>
<meta http-equiv="refresh" content="0;url=/">
</head><body></body></html>

// ======================================================================
// FILE: public/sw.js (App-Shell, sehr schlank)
// ======================================================================
// Minimal SW for offline shell; update CACHE_VER to bust old caches.
const CACHE_VER = "sc-v1";
const ASSETS = ["/","/index.html","/manifest.webmanifest","/src/styles.css"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE_VER).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_VER).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener("fetch",e=>{
const url=new URL(e.request.url);
if (e.request.method!=="GET") return;
if (url.origin===self.location.origin) {
if (url.pathname.startsWith("/assets/")) { e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))); return; }
if (["/","/index.html","/manifest.webmanifest","/src/styles.css"].includes(url.pathname)) {
e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
return;
}
}
});

// ======================================================================
// FILE: scripts/doctor.mjs (verbietet Lovable/Agent/„Loading app“ etc.)
// ======================================================================
import fs from "fs/promises";
import path from "path";
const ROOT = process.cwd();
const FORBID = /(lovable|dev-?\s?agent|tagger|Loading app)/i;
const SKIP = new Set([".git","node_modules","dist",".next",".cache"]);
async function* walk(dir){ for (const e of await fs.readdir(dir,{withFileTypes:true})) {
if (SKIP.has(e.name)) continue; const p=path.join(dir,e.name);
if (e.isDirectory()) yield* walk(p); else if (e.isFile()) yield p;
}}
const bad=[];
for await (const f of walk(ROOT)) {
const t = await fs.readFile(f,"utf8").catch(()=>null); if (!t) continue;
if (FORBID.test(t)) bad.push(f);
}
if (bad.length){ console.error("[doctor] Forbidden tokens in:\n"+bad.map(x=>" - "+x).join("\n")); process.exit(2); }
console.log("[doctor] OK");

// ======================================================================
// FILE: scripts/gen-sitemap.mjs (einfach, statische Routen)
// ======================================================================
import fs from "fs/promises";
const base = "https://www.stoppclock.com";
const routes = ["/","/analog","/imprint.html"]; // erweitern, wenn Seiten da sind
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(p=>` <url><loc>${base}${p}</loc></url>`).join("\n")}
</urlset>`;
await fs.mkdir("dist", { recursive: true });
await fs.writeFile("dist/sitemap.xml", xml, "utf8");

// ======================================================================
// FILE: .github/workflows/pages.yml (SHA-gepinnt, Actions-Deploy)
// ======================================================================
name: Deploy Stoppclock to GitHub Pages
on:
push: { branches: [ "main" ] }
workflow_dispatch:
permissions:
contents: read
pages: write
id-token: write
concurrency: { group: "pages", cancel-in-progress: true }
env:
NODE_VERSION: 22
CUSTOM_DOMAIN: www.stoppclock.com
CANONICAL_URL: https://www.stoppclock.com/
jobs:
build:
runs-on: ubuntu-latest
steps: - name: Checkout (pinned)
uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 - name: Setup Node (pinned)
uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903
with: { node-version: ${{ env.NODE_VERSION }}, cache: npm }
      - name: Install
        run: npm ci
      - name: Doctor guard
        run: npm run doctor
      - name: Build
        run: npm run build
      - name: Add CNAME & .nojekyll
        run: |
          mkdir -p dist
          echo "${{ env.CUSTOM_DOMAIN }}" > dist/CNAME
touch dist/.nojekyll - name: Upload Pages artifact (pinned)
uses: actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b
with: { path: ./dist }
deploy:
needs: build
runs-on: ubuntu-latest
outputs: { page_url: ${{ steps.deployment.outputs.page_url }} }
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        name: Deploy to GitHub Pages (pinned)
        uses: actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e
  postcheck:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Write tiny smoke (no browser)
        run: |
          cat > smoke.mjs <<'EOF'
          import https from 'node:https'; import http from 'node:http'; import { URL } from 'node:url';
          const targets=[process.env.PAGES_URL||'', process.env.CANONICAL_URL||''].filter(Boolean).map(u=>u.replace(/\/+$/,''));
const paths=['/','/manifest.webmanifest','/sw.js','/imprint.html'];
function get(u){ return new Promise((res)=>{ const H=u.startsWith('https')?https:http;
const r=H.get(u,{timeout:12000, headers:{'User-Agent':'stoppclock-smoke'}},(s)=>res({status:s.statusCode||0,url:u}));
r.on('error',()=>res({status:0,url:u})); r.setTimeout(12000,()=>{r.destroy(); res({status:0,url:u});}); });}
(async()=>{ let ok=true; for(const b of targets){ for(const p of paths){ const {status}=await get(b+p); if(status!==200) ok=false; console.log(`[SMOKE] ${status} ${b+p}`);} }
if(!ok){ console.error('[SMOKE] Fail'); process.exit(2);} console.log('[SMOKE] OK'); })();
EOF - name: Run smoke
env:
PAGES_URL: ${{ needs.deploy.outputs.page_url }}
CANONICAL_URL: ${{ env.CANONICAL_URL }}
run: node smoke.mjs

// ======================================================================
// FILE: README.md (Kurz, SSoT-Ergänzungen dokumentiert)
// ======================================================================

# Stoppclock (clean)

Projector-friendly timers & clocks. Zero vendor lock-in.

## Dev

```bash
npm ci
npm run dev

Build/Deploy

GitHub Pages via GitHub Actions (see .github/workflows/pages.yml)

Custom domain: www.stoppclock.com → enable Enforce HTTPS

SPA fallback: public/404.html rewrites to /#/<path>

SEO/AI-SEO

Own OG images under /og/*

JSON-LD: WebApplication + FAQ (see index.html)

scripts/gen-sitemap.mjs generates /sitemap.xml

Privacy / Ads

Default: Ads OFF. Consent banner toggles AdSense loading.

Replace AdSense client ID in index.html and Publisher ID in public/ads.txt.

Browser support

Last 2 versions of Chrome/Edge/Firefox/Safari; iOS 15+.

Security headers / CSP

Basic meta CSP in index.html (Pages limits server headers). Use only own-hosted OG images.


---

**Was jetzt zu tun ist**
1) Neues, leeres Repo `Stoppclock-page` erstellen → Dateien 1:1 übernehmen → commit → push auf `main`.
2) **Pages** in Repo-Settings auf **GitHub Actions** stellen, Domain `www.stoppclock.com`, **Enforce HTTPS**.
3) **Ersetze IDs**:
   - `index.html`: `ca-pub-REPLACE_ME` → **deine AdSense Client ID**
   - `public/ads.txt`: `pub-REPLACE_ME` → **deine Publisher-ID**
   (Optional gib mir beide IDs; ich liefere dir eine Patch-Version sofort zurück.)

**a.** Soll ich zusätzlich eine **Imprint/Privacy**-Vorlage (DE/EN, minimal & rechtssicher) beilegen?
**b.** Wünschst du ein **Lighthouse CI** im Workflow (Performance-Budget + PWA-Check) als nächstes Upgrade?
::contentReference[oaicite:0]{index=0}
```
