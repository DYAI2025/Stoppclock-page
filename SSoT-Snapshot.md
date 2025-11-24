# SSoT Snapshot (Aktueller Stand)

Kurzüberblick über den realen Produktzustand der Stoppclock SPA.

## Funktionsumfang
- Home mit Kachel-Navigation, Dark/Light-Mode und Sprachumschalter.
- Timer-Routen: Analog-Countdown, Countdown, Stopwatch (Laps), Pomodoro, Cooking Timer, Couples Timer, Digital Clock, World Clock, Alarm, Metronome, Chess Clock.
- Content-Routen: Time Philosophy, Timer-Guides (Students/Productivity/Fitness), Blog (Pomodoro Online, Pomodoro vs. Countdown), Wissen/About/Contact sowie Impressum/Datenschutz (DE/EN).
- Tastatur: Space Start/Pause, `R` Reset, `F` Fullscreen, `L` Laps (Stopwatch), Eingabefelder sind ausgenommen.
- Persistenz: Pro Timer lokale State-Schemas unter `sc.v1.*` in `localStorage`.

## Architektur & Technik
- **Entry**: `index.html` lädt `src/main.tsx` (kein React Router, Hash-Routing via `window.location.hash`).
- **Context**: `PinnedTimersProvider` umschließt die App (reserviert für bis zu 3 gepinnte Timer).
- **Shared Komponenten**: Consent-Banner und AdSense-Lader, Sprach- & Theme-Toggle, HomeButton, TimerIcon, TimerQuickInfo.
- **Stile**: Globale Tokens in `src/design-tokens.css`, Layout in `src/styles.css` plus spezifische Page-Styles.
- **Audio/Visual Alerts**: Utilities `beep`/`flash` in `src/utils.ts` und `src/pages/*` nutzen `requestAnimationFrame`-Loops für tickende Updates.
- **PWA**: `public/manifest.webmanifest` + `public/sw.js` (Shell-Caching, network-first Assets, Versionierung über `CACHE_VER`).

## Qualität & Tests
- Playwright-Suite (8 Specs) unter `tests/e2e/` deckt Analog-Countdown, Countdown, Stopwatch, Digital Clock, World Clock, Alarm, Metronome, Chess Clock.
- Standard-Checks: `npm run doctor` (verbotene Tokens), `npm run build`, optional `npm run preview`.

## Deploy-Hinweise
- Vite Build (`npm run build`) erzeugt statischen Output in `dist/` (inkl. Sitemap-Generator aus `scripts/gen-sitemap.mjs`).
- Service Worker wird in `src/main.tsx` beim `load`-Event registriert (silent fail erlaubt).
- Hash-Routen erfordern ein 200er-Fallback auf `index.html` (Pages/Static-Hosting konfigurieren).
