SSoT-Snapshot (build- & release-fertig) 0) Projektziel

Stoppclock: beamer-taugliche Timer/Clocks, extrem einfache Bedienung, state-persistente Tools, PWA-offline, AI-SEO + technisches SEO.

1. Funktionsumfang (fix)

Home (Tool-Kacheln)

Stopwatch (Laps, persist)

Countdown (bis 12h, Warnschwelle, Signal)

Analog-Countdown (NEU, bis 12h auf 12-h-Zifferblatt, fps-smooth, Fullscreen)

Rounds/Interval

Digital Clock

World Clock

Alarm

Metronome

Chess Clock

Imprint/Privacy (statisch)

Persistenz aller Tools (localStorage, sc.v1.\*)

Shortcuts: Space Start/Stop, R Reset, F Fullscreen, ↑/↓ ±10s (kontextabhängig)

2. Architektur & Tech

Vite + React 18 + TypeScript, Tailwind optional, keine Fremd-SDKs

Routing: History (SPA-404 Fallback)

State: useReducer + Context je Tool, Persistenz via localStorage

Zeitantrieb: requestAnimationFrame + diff auf Date.now() (kein Drift)

PWA: manifest.webmanifest, Service Worker (app shell, SPA-fallback, Cache-Key = Commit-SHA)

Entry: index.html → <script type="module" src="/src/main.tsx">

3. SEO & AI-SEO

Technisch: prerenderte Head-Metas je Route (Title/Desc/OG/Twitter), sitemap.xml, robots.txt, Canonical

AI-SEO: JSON-LD WebApplication + FAQPage (FAQ zu Timer-Use-Cases), „About for AI“-Abschnitt (stabile Bullet-Facts)

Konvention: klar benannte Routen (/analog, /countdown, …), semantische Headings

4. A11y & Performance

Kontrast ≥ 4.5:1, Tasten fokussierbar, ARIA-Labels, Reduced-Motion respektieren

Budget: Home cold JS ≤ ~180kB gzip, LCP < 2s Desktop, 60fps Analog-Zeiger

Lazy-Load Tool-Seiten

5. CI/CD (GitHub Actions → Pages)

Workflow: checkout (SHA-pinned) → setup-node → npm ci → doctor-guard → build → CNAME/.nojekyll → upload/deploy → smoke

Guards: keine verbotenen Tokens (lovable|dev-?agent|tagger, „Loading app…“) in Quellen oder dist/

Smoke: 200er auf /, /manifest.webmanifest, /sw.js, /imprint.html; keine Asset-404s; #root hat Kinder; Console-Errors der App ⇒ Fail

6. Domain-Binding (stoppclock.com)

Pages-Quelle: GitHub Actions (nicht „Build from branch“)

Custom Domain: in Repo → Settings → Pages → www.stoppclock.com (CNAME), Enforce HTTPS aktivieren

DNS:

www.stoppclock.com → CNAME auf GitHub-Pages-Host (standard)

stoppclock.com (Apex) → A/AAAA oder ALIAS/ANAME gemäß GitHub-Pages-Dokumentation deines DNS-Providers (IP-Werte nicht hart in dieses SSoT schreiben; nimm die jeweils aktuellen aus den GitHub-Docs)

Canonical: wähle eine Haupt-Domain (empfohlen: https://www.stoppclock.com) → rel="canonical" + 301-Redirect in Pages-Settings aktivieren

7. Definition of Done (DoD)

Build: npm run build grün, npm run preview ohne app-eigene Console-Errors

Guard: npm run doctor OK (keine verbotenen Tokens)

Smoke (CI): beide Basen ok (Pages-URL + Custom-Domain), keine Asset-404

PWA: SW registriert (nicht lokal), Offline-Fallback funktioniert

Persistenz: Wechsel Home ↔ Tool behält Zustand (Countdown/Analog/Stopwatch getestet)

SEO: sitemap.xml listet alle Routen, JSON-LD validierbar (Rich-Results-Test), prerenderte Metas vorhanden

A11y: Tastatur-bedienbar, Kontrast-Check bestanden

Docs: README (EN, knapp), Imprint/Privacy (DE), dieses SSoT im Repo

Letzter Lücken-Check (To-confirm vor Baustart)

Inhalt/Assets

Brand: Favicon/Icons (512/192/180), Primärfarbe, Logo (optional)

Sounds: Signal-WAV/OGG (kurz, neutral), Lizenzfrei

Texte: Imprint/Privacy final, Home-Teaser (sehr kurz, EN)

FAQ: 5–8 Q&A für FAQPage-JSON-LD (z. B. „How to set a 90-minute exam timer?“)

Produktentscheidungen

Canonical-Domain: www.stoppclock.com (empfohlen) oder Apex; Redirect-Regel setzen

Warn-Schwellen (Analog/Countdown) Default: 1 min; weitere Presets?

Theme: Light/Dark/Auto (default: Auto)

Tracking: keins (privacy-friendly); nur anonyme Basic Telemetry? (default: aus)

Tech

CI-Pins: Actions-SHAs hinterlegt

Prerender: Minimaler Static Head je Route (oder Head-Manager im Build-Step)

404-SPA: dist/404.html = index.html

Wenn die vier Kästchen unter „Inhalt/Assets“ bestätigt sind, ist der Agent komplett unblockt.

Agent-Startpaket (Dateien im Repo)

index.html (einziger Entry)

public/manifest.webmanifest, public/sw.js, /public/icons/\*

/src/main.tsx, /src/pages/Analog.tsx (Canvas-Analog-Countdown vorhanden), /src/pages/\* Platzhalter

/ai/spec.json (Ziele, Routen, Akzeptanzkriterien)

/ai/AGENT_README.md (Scope/Do-Don’t)

scripts/doctor.mjs (Forbidden-Guard)

.github/workflows/pages.yml (Build→Deploy→Smoke, pinned)

robots.txt, sitemap.xml (Build-Step generiert)

Build/Deploy-Ablauf (final)
npm ci
npm run doctor
npm run build
npm run preview -- --host # optional local QA
git commit -m "feat: initial clean build"
git push origin main # Actions baut+deployed automatisch

# Settings → Pages → Custom domain: www.stoppclock.com → Enforce HTTPS
