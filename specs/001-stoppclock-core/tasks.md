# Tasks: Stoppclock Complete Production Application

**Branch**: `001-stoppclock-core` | **Date**: 2025-10-18
**Input**: Design documents from `/specs/001-stoppclock-core/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Goal**: ✅ **COMPLETE ENDPRODUKT** - All 8 timer tools fully functional, live on www.stoppclock.com with 100% E2E test coverage

**No MVPs, No Placeholders, No Demos** - Production-ready from start to finish.

**Organization**: Tasks build complete application with all 8 working tools. Each tool is fully implemented before moving to next.

## Format: `- [ ] [ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All tasks include exact file paths

## Path Conventions
- **Project type**: Single-page web application (SPA)
- **Root**: `/home/dyai/Dokumente/DYAI_home/Web/stoppclock-page/`
- **Source**: `src/pages/` (one file per tool), `tests/e2e/`
- **8 Timer Tools**: AnalogCountdown, Countdown, Stopwatch, DigitalClock, WorldClock, Alarm, Metronome, ChessClock

---

## Phase 1: Setup & Infrastructure (8 tasks)

**Purpose**: Initialize project, dependencies, test framework, and build tools

- [ ] T001 Create project structure: `src/pages/`, `public/`, `scripts/`, `.github/workflows/`, `tests/e2e/`
- [ ] T002 Initialize package.json with Vite 5.4.10, React 18.3.1, TypeScript 5.6.3, @playwright/test
- [ ] T003 [P] Create vite.config.ts, tsconfig.json, .gitignore (with test-results/, playwright-report/)
- [ ] T004 Install dependencies: `npm ci` and Playwright browsers: `npx playwright install chromium firefox webkit`
- [ ] T005 [P] Create playwright.config.ts (3 browsers, webServer: preview on :4173, retries: 2)
- [ ] T006 [P] Create index.html with SEO meta tags, JSON-LD (WebApplication + 8 FAQs), canonical, OG tags
- [ ] T007 [P] Add consent banner HTML/CSS/JS (inline) in index.html (default OFF, localStorage sc.adsConsent)
- [ ] T008 [P] Create src/styles.css with dark theme vars, global resets, grid, button/card styles, flash animation (@keyframes + prefers-reduced-motion)

---

## Phase 2: Core Infrastructure (15 tasks)

**Purpose**: Routing, navigation, PWA, CI/CD, and build scripts

- [ ] T009 Create src/main.tsx with React root, StrictMode, useHashRoute() hook (hashchange listener)
- [ ] T010 [P] Create Home component in src/main.tsx with 8 tool cards (grid layout, links to #/analog, #/countdown, #/stopwatch, #/digital, #/world, #/alarm, #/metronome, #/chess)
- [ ] T011 [P] Create public/manifest.webmanifest (PWA metadata: name, icons, display: standalone, theme: #0b1220)
- [ ] T012 [P] Create public/sw.js Service Worker (CACHE_VER: sc-v1, app shell cache, install/activate/fetch handlers, cache-first for shell, network-first for /assets/*)
- [ ] T013 [P] Register Service Worker in src/main.tsx (navigator.serviceWorker.register('/sw.js'))
- [ ] T014 [P] Create public/robots.txt, public/404.html (SPA fallback), public/ads.txt (pub-REPLACE_ME)
- [ ] T015 [P] Create scripts/doctor.mjs (forbidden token scanner: lovable|dev-?agent|tagger|Loading app)
- [ ] T016 [P] Create scripts/gen-sitemap.mjs (generates dist/sitemap.xml with all 8 tool routes)
- [ ] T017 [P] Add npm scripts: dev, build (vite build && gen-sitemap), preview, doctor, test:e2e, test:e2e:ui
- [ ] T018 Create .github/workflows/pages.yml (checkout, install, doctor, build, **test:e2e**, CNAME, upload, deploy, smoke)
- [ ] T019 [P] Add placeholder brand assets: public/icons/*.png (192, 512, 180), public/og/cover-1200x630.png

---

## Phase 3: Tool 1 - Analog Countdown (30 tasks) ⏱️

**E2E Test**: `tests/e2e/01-analog-countdown.spec.ts`

- [ ] T020 [E2E] Create E2E test: goto #/analog, click 5m preset, Start, wait 2s, expect time decrements, Space=pause, R=reset, navigate away+back, verify state persisted

**Implementation**:
- [ ] T021 [P] Create src/pages/AnalogCountdown.tsx with TimerState interface (version, durationMs, remainingMs, running, endAt, warnAtMs, signal)
- [ ] T022 [P] Implement loadTimerState(), saveTimerState() utilities with try-catch
- [ ] T023 [P] Implement beep(ms, freq) with Web Audio API (OscillatorNode + GainNode)
- [ ] T024 [P] Implement flash(el, ms), useRaf(active, cb) hook
- [ ] T025 Implement drawAnalogClock(canvas, state): clock ring, 60 ticks, progress arc (color-coded), 3 hands (hours/min/sec), center dot
- [ ] T026 Implement hand(ctx, len, ang, width, col) helper
- [ ] T027 Create AnalogCountdown component with useState(loadTimerState('sc.v1.analog'))
- [ ] T028 Add Canvas with ResizeObserver for DPI scaling (min(2, devicePixelRatio))
- [ ] T029 Implement sync() callback (remainingMs = max(0, endAt - Date.now()))
- [ ] T030 Add useEffect: useRaf for sync loop when running
- [ ] T031 Add useEffect: debounced saveTimerState (150ms setTimeout)
- [ ] T032 Add useEffect: warning/completion detection (beep + flash, use warned ref)
- [ ] T033 Implement start(), pause(), reset(), plus(ms), setDur(ms), toggleFullscreen() callbacks
- [ ] T034 Add keyboard listener: Space=start/pause, R=reset, F=fullscreen, ArrowUp/Down=±10s, preventDefault
- [ ] T035 Render topbar: .hms (HH:MM:SS), controls (Start/Pause, Reset, +1m, -1m, Fullscreen)
- [ ] T036 Render canvas container (.analog-canvas)
- [ ] T037 Render presets: 5m, 10m, 15m, 30m, 45m, 1h, 90m, 2h, 3h, 4h, 6h, 8h, 12h
- [ ] T038 Render signal toggles (Sound, Flash checkboxes) + warning dropdown (off/1m/5m/10m)
- [ ] T039 Add CSS: .analog-wrap, .analog-topbar, .analog-canvas, .analog-presets, .hms, .controls, .chip, .warn, .sig
- [ ] T040 Register route in src/main.tsx: if route === '/analog' return <AnalogCountdown />
- [ ] T041 Run test: `npm run test:e2e tests/e2e/01-analog-countdown.spec.ts` → PASS ✅

---

## Phase 4: Tool 2 - Digital Countdown (28 tasks) ⏲️

**E2E Test**: `tests/e2e/02-countdown.spec.ts`

- [ ] T042 [E2E] Create E2E test: goto #/countdown, set 10:30, Start, verify countdown, Space=pause, expect completion signal

**Implementation**:
- [ ] T043 [P] Create src/pages/Countdown.tsx with similar TimerState interface
- [ ] T044 [P] Implement loadTimerState('sc.v1.countdown'), saveTimerState()
- [ ] T045 [P] Reuse beep(), flash() from AnalogCountdown or create shared utils
- [ ] T046 Create Countdown component with useState(loadTimerState)
- [ ] T047 Implement sync() callback for digital countdown
- [ ] T048 Add useEffect: sync loop, debounced persist, warning/completion detection
- [ ] T049 Implement start(), pause(), reset(), setDur(ms) callbacks
- [ ] T050 Add keyboard listener (Space, R, F, Arrows)
- [ ] T051 Render input fields: Hours (0-12), Minutes (0-59), Seconds (0-59) with number inputs
- [ ] T052 Render large digital display: HH:MM:SS (huge font, e.g. 120px)
- [ ] T053 Render controls: Start/Pause, Reset, Fullscreen
- [ ] T054 Render warning threshold dropdown, signal toggles
- [ ] T055 Add CSS: .countdown-wrap, .countdown-input, .countdown-display (huge font), .countdown-controls
- [ ] T056 Register route: if route === '/countdown' return <Countdown />
- [ ] T057 Run test: `npm run test:e2e tests/e2e/02-countdown.spec.ts` → PASS ✅

---

## Phase 5: Tool 3 - Stopwatch (25 tasks) ⏱️

**E2E Test**: `tests/e2e/03-stopwatch.spec.ts`

- [ ] T058 [E2E] Create E2E test: goto #/stopwatch, Start, verify time increments, Lap button adds lap time, Space=pause, R=reset

**Implementation**:
- [ ] T059 [P] Create src/pages/Stopwatch.tsx with StopwatchState interface (elapsedMs, running, startedAt, laps: number[])
- [ ] T060 [P] Implement loadStopwatchState('sc.v1.stopwatch'), saveStopwatchState()
- [ ] T061 Create Stopwatch component with useState(loadStopwatchState)
- [ ] T062 Implement sync() callback (elapsedMs = Date.now() - startedAt + accumulatedMs)
- [ ] T063 Add useEffect: sync loop, debounced persist
- [ ] T064 Implement start() (startedAt = Date.now()), pause(), reset(), addLap() callbacks
- [ ] T065 Add keyboard listener (Space, R, L for lap)
- [ ] T066 Render large display: MM:SS.mmm (minutes, seconds, milliseconds)
- [ ] T067 Render controls: Start/Pause, Reset, Lap, Fullscreen
- [ ] T068 Render lap times list (scrollable, shows lap number + time for each lap)
- [ ] T069 Add CSS: .stopwatch-wrap, .stopwatch-display (large font), .stopwatch-laps (scrollable list)
- [ ] T070 Register route: if route === '/stopwatch' return <Stopwatch />
- [ ] T071 Run test: `npm run test:e2e tests/e2e/03-stopwatch.spec.ts` → PASS ✅

---

## Phase 6: Tool 4 - Digital Clock (20 tasks) 🕐

**E2E Test**: `tests/e2e/04-digital-clock.spec.ts`

- [ ] T072 [E2E] Create E2E test: goto #/digital, verify current time displays and updates every second, 12h/24h toggle works

**Implementation**:
- [ ] T073 [P] Create src/pages/DigitalClock.tsx with ClockState interface (is24h: boolean)
- [ ] T074 [P] Implement loadClockState('sc.v1.digital'), saveClockState()
- [ ] T075 Create DigitalClock component with useState for current time (Date.now())
- [ ] T076 Add useEffect with setInterval(1000) to update time every second
- [ ] T077 Add useEffect for persisting is24h preference
- [ ] T078 Implement format time function: HH:MM:SS or hh:MM:SS AM/PM based on is24h
- [ ] T079 Render huge time display (e.g., 150px font)
- [ ] T080 Render date display (YYYY-MM-DD or localized format)
- [ ] T081 Render 12h/24h toggle button
- [ ] T082 Render Fullscreen button
- [ ] T083 Add CSS: .digital-clock-wrap, .digital-clock-time (huge), .digital-clock-date
- [ ] T084 Register route: if route === '/digital' return <DigitalClock />
- [ ] T085 Run test: `npm run test:e2e tests/e2e/04-digital-clock.spec.ts` → PASS ✅

---

## Phase 7: Tool 5 - World Clock (25 tasks) 🌍

**E2E Test**: `tests/e2e/05-world-clock.spec.ts`

- [ ] T086 [E2E] Create E2E test: goto #/world, verify default timezones display, add timezone (Tokyo), verify time updates, remove timezone

**Implementation**:
- [ ] T087 [P] Create src/pages/WorldClock.tsx with WorldClockState interface (timezones: string[], is24h: boolean)
- [ ] T088 [P] Implement loadWorldClockState('sc.v1.world'), saveWorldClockState()
- [ ] T089 [P] Create timezone list constant (major cities: UTC, New York, London, Paris, Tokyo, Sydney, etc.)
- [ ] T090 Create WorldClock component with useState (default timezones: UTC, New York, London, Tokyo)
- [ ] T091 Add useEffect with setInterval(1000) to update all clocks every second
- [ ] T092 Add useEffect for persisting state (timezones + is24h)
- [ ] T093 Implement addTimezone(tz), removeTimezone(tz), toggle24h() callbacks
- [ ] T094 Render timezone selector dropdown (select from timezone list)
- [ ] T095 Render list of clocks: city name, current time, offset from user's timezone
- [ ] T096 Render Add/Remove buttons per timezone
- [ ] T097 Render 12h/24h toggle
- [ ] T098 Add CSS: .world-clock-wrap, .world-clock-list, .world-clock-item (city + time), .world-clock-controls
- [ ] T099 Register route: if route === '/world' return <WorldClock />
- [ ] T100 Run test: `npm run test:e2e tests/e2e/05-world-clock.spec.ts` → PASS ✅

---

## Phase 8: Tool 6 - Alarm (30 tasks) ⏰

**E2E Test**: `tests/e2e/06-alarm.spec.ts`

- [ ] T101 [E2E] Create E2E test: goto #/alarm, set alarm time (HH:MM), enable alarm, verify alarm shows in list, mock time to trigger alarm (if possible), verify alert

**Implementation**:
- [ ] T102 [P] Create src/pages/Alarm.tsx with AlarmState interface (alarms: Array<{id, time: HH:MM, enabled, label, sound}>)
- [ ] T103 [P] Implement loadAlarmState('sc.v1.alarm'), saveAlarmState()
- [ ] T104 [P] Implement beep sound for alarm (longer duration, e.g., 2 seconds, repeating until dismissed)
- [ ] T105 Create Alarm component with useState(loadAlarmState)
- [ ] T106 Add useEffect with setInterval(1000) to check current time against enabled alarms
- [ ] T107 Add useEffect for persisting state
- [ ] T108 Implement addAlarm(time, label), removeAlarm(id), toggleAlarm(id), dismissAlarm(id) callbacks
- [ ] T109 Implement alarm trigger logic: if current time matches alarm time and enabled → beep + show dismiss modal
- [ ] T110 Render alarm input: time picker (HH:MM), label input, Add Alarm button
- [ ] T111 Render alarm list: each alarm shows time, label, enabled toggle, delete button
- [ ] T112 Render dismiss modal when alarm triggers (shows alarm label, Dismiss button stops beep)
- [ ] T113 Add CSS: .alarm-wrap, .alarm-input, .alarm-list, .alarm-item, .alarm-modal (overlay for trigger)
- [ ] T114 Register route: if route === '/alarm' return <Alarm />
- [ ] T115 Run test: `npm run test:e2e tests/e2e/06-alarm.spec.ts` → PASS ✅

---

## Phase 9: Tool 7 - Metronome (25 tasks) 🎵

**E2E Test**: `tests/e2e/07-metronome.spec.ts`

- [ ] T116 [E2E] Create E2E test: goto #/metronome, set BPM 120, Start, verify beats occur (check for beep calls or visual beat indicator), Stop

**Implementation**:
- [ ] T117 [P] Create src/pages/Metronome.tsx with MetronomeState interface (bpm: number, running: boolean, accentFirst: boolean)
- [ ] T118 [P] Implement loadMetronomeState('sc.v1.metronome'), saveMetronomeState()
- [ ] T119 [P] Implement tick() sound (short beep, e.g., 50ms, 880Hz for normal beat, 1200Hz for accented first beat)
- [ ] T120 Create Metronome component with useState(loadMetronomeState, default BPM 120)
- [ ] T121 Implement beat loop: setInterval based on (60000 / bpm) milliseconds, call tick() on each interval
- [ ] T122 Add useEffect to start/stop interval based on running state
- [ ] T123 Add useEffect for persisting state
- [ ] T124 Implement start(), stop(), setBPM(bpm), toggleAccent() callbacks
- [ ] T125 Render BPM input: slider (40-240 BPM) + number input
- [ ] T126 Render large BPM display (current BPM in big font)
- [ ] T127 Render visual beat indicator (flashes on each beat)
- [ ] T128 Render controls: Start/Stop, Accent first beat toggle
- [ ] T129 Add CSS: .metronome-wrap, .metronome-bpm (large display), .metronome-beat-indicator (flash animation), .metronome-controls
- [ ] T130 Register route: if route === '/metronome' return <Metronome />
- [ ] T131 Run test: `npm run test:e2e tests/e2e/07-metronome.spec.ts` → PASS ✅

---

## Phase 10: Tool 8 - Chess Clock (30 tasks) ♟️

**E2E Test**: `tests/e2e/08-chess-clock.spec.ts`

- [ ] T132 [E2E] Create E2E test: goto #/chess, set 5min each player, Start player 1, verify timer counts down, Switch to player 2, verify player 2 timer counts down, player 1 paused

**Implementation**:
- [ ] T133 [P] Create src/pages/ChessClock.tsx with ChessClockState interface (player1: {timeMs, running}, player2: {timeMs, running}, startedAt: number | null)
- [ ] T134 [P] Implement loadChessClockState('sc.v1.chess'), saveChessClockState()
- [ ] T135 [P] Implement completion beep for when player runs out of time
- [ ] T136 Create ChessClock component with useState(loadChessClockState)
- [ ] T137 Implement sync() callback: calculate remainingMs for active player (endAt - Date.now())
- [ ] T138 Add useEffect: sync loop for active player
- [ ] T139 Add useEffect: debounced persist
- [ ] T140 Add useEffect: check if player time <= 0, trigger completion beep, stop clock
- [ ] T141 Implement start(player), switchPlayer(), reset(), setTime(player, ms) callbacks
- [ ] T142 Render split screen: player 1 on left, player 2 on right (50/50 layout)
- [ ] T143 Render player 1 side: large time display (MM:SS), active indicator (highlight when running), tap area to switch
- [ ] T144 Render player 2 side: large time display (MM:SS), active indicator, tap area to switch
- [ ] T145 Render center controls: time presets (1min, 3min, 5min, 10min per player), Reset button
- [ ] T146 Implement tap on player side to switch turn (pauses current player, starts other player)
- [ ] T147 Add CSS: .chess-clock-wrap (flex row), .chess-clock-player (50% width, large font), .chess-clock-active (highlight), .chess-clock-controls (center)
- [ ] T148 Register route: if route === '/chess' return <ChessClock />
- [ ] T149 Run test: `npm run test:e2e tests/e2e/08-chess-clock.spec.ts` → PASS ✅

---

## Phase 11: Production Configuration (12 tasks)

**Purpose**: Replace all placeholders, configure production environment

- [ ] T150 [P] Replace AdSense Client ID in index.html (ca-pub-REPLACE_ME → real ca-pub-XXXXXXXXXXXXXXXX)
- [ ] T151 [P] Replace AdSense Publisher ID in public/ads.txt (pub-REPLACE_ME → real pub-XXXXXXXXXXXXXXXX)
- [ ] T152 [P] Replace placeholder icons: public/icons/icon-192.png (192x192), icon-512.png (512x512), icon-180.png (180x180)
- [ ] T153 [P] Replace OG image: public/og/cover-1200x630.png (1200x630 with Stoppclock branding + timer visual)
- [ ] T154 Create public/imprint.html static page (h1: Imprint, legal text, link to home)
- [ ] T155 Update scripts/gen-sitemap.mjs routes array to include all 8 tools: /, /analog, /countdown, /stopwatch, /digital, /world, /alarm, /metronome, /chess, /imprint.html
- [ ] T156 Configure DNS: CNAME for www → <username>.github.io, A records for apex → GitHub IPs (185.199.108-111.153)
- [ ] T157 Set GitHub Pages settings: Source "GitHub Actions", Custom domain "www.stoppclock.com"

---

## Phase 12: Final Testing & Deployment (15 tasks)

**Purpose**: Run all tests, validate production build, deploy to www.stoppclock.com

- [ ] T158 Run doctor guard: `npm run doctor` → verify ZERO forbidden tokens
- [ ] T159 Run production build: `npm run build` → verify dist/ output, check bundle size <250kB gzipped (8 tools)
- [ ] T160 Run ALL 8 E2E tests: `npm run test:e2e` → verify ALL PASS (01-analog through 08-chess)
- [ ] T161 Run preview server: `npm run preview` → manual smoke test all 8 tools in browser
- [ ] T162 Test offline mode: DevTools → Network → Offline, reload, verify all tools work
- [ ] T163 Test consent banner: clear localStorage, reload, verify banner shows, test Keep Off + Enable Ads flows
- [ ] T164 Test keyboard shortcuts: verify Space/R/F/Arrows work in Analog Countdown, Countdown, Stopwatch
- [ ] T165 [P] Code cleanup: remove console.logs, fix TypeScript warnings, format code
- [ ] T166 [P] Accessibility audit: Tab navigation through all tools, verify contrast ≥4.5:1, test prefers-reduced-motion
- [ ] T167 Commit: `git add .`, `git commit -m "feat: complete stoppclock with all 8 tools"`, `git push origin 001-stoppclock-core`
- [ ] T168 Merge to main: create PR or merge branch → triggers GitHub Actions deployment
- [ ] T169 Monitor GitHub Actions: verify all steps PASS including **test:e2e** (8 tests), deploy completes
- [ ] T170 Wait for HTTPS: GitHub Pages → wait 10-60min → enable "Enforce HTTPS"
- [ ] T171 Verify production: visit https://www.stoppclock.com → test all 8 tools end-to-end, verify offline works
- [ ] T172 Performance audit: Lighthouse → verify LCP <2.5s desktop, Performance >85, PWA score 100

---

## 🎯 Release Criteria - Definition of DONE

**Application is PRODUCTION-READY and COMPLETE when**:

1. ✅ All 8 timer tools fully implemented and functional:
   - ✅ Analog Countdown (canvas, 12h clock, fullscreen)
   - ✅ Digital Countdown (HH:MM:SS input, fullscreen)
   - ✅ Stopwatch (laps, milliseconds)
   - ✅ Digital Clock (12h/24h toggle)
   - ✅ World Clock (multiple timezones)
   - ✅ Alarm (multiple alarms, dismiss modal)
   - ✅ Metronome (BPM 40-240, accent first beat)
   - ✅ Chess Clock (dual timer, tap to switch)

2. ✅ **ALL 8 E2E tests PASS** (100% coverage):
   ```bash
   npm run test:e2e
   # Expected: 8/8 passed ✅
   ```

3. ✅ Offline PWA works (Service Worker active, app works without network)
4. ✅ Privacy consent banner functional (ads OFF by default)
5. ✅ All tools persist state across navigation (localStorage)
6. ✅ Keyboard shortcuts work (Space, R, F, Arrows where applicable)
7. ✅ SEO complete (JSON-LD, sitemap with 8 routes, meta tags)
8. ✅ Production assets in place (real icons, OG image, AdSense IDs)
9. ✅ Live at **https://www.stoppclock.com** with HTTPS enforced
10. ✅ GitHub Actions CI/CD passing (doctor, build, test:e2e, deploy, smoke)
11. ✅ `npm run doctor` passes (zero forbidden tokens)
12. ✅ Bundle size reasonable (<250kB gzipped for 8 tools)
13. ✅ Lighthouse Performance >85, PWA score 100
14. ✅ Accessibility: WCAG AA compliance (contrast, keyboard nav)

**Sign-off**: Projektleiter runs `npm run test:e2e` → sees **8/8 PASS** → approves release 🚀

---

## Dependencies & Execution Order

### Phase Flow
```
Phase 1 (Setup)
  ↓
Phase 2 (Infrastructure)
  ↓
Phase 3-10 (8 Tools - can parallelize across team)
  ↓
Phase 11 (Production Config)
  ↓
Phase 12 (Testing & Deployment)
  ↓
PRODUCTION RELEASE ✅
```

### Critical Path (Sequential)
- Phases 1-2 MUST complete before tool implementation
- Each tool's E2E test MUST pass before moving to next
- Phase 11 MUST complete before Phase 12
- ALL 8 E2E tests MUST pass before deployment (T169)

### Parallel Opportunities

**Within Phases 1-2**: Most tasks marked [P] can run in parallel

**Phase 3-10** (8 Tools): **Can fully parallelize across 8 developers**
- Developer 1: Analog Countdown (T020-T041)
- Developer 2: Digital Countdown (T042-T057)
- Developer 3: Stopwatch (T058-T071)
- Developer 4: Digital Clock (T072-T085)
- Developer 5: World Clock (T086-T100)
- Developer 6: Alarm (T101-T115)
- Developer 7: Metronome (T116-T131)
- Developer 8: Chess Clock (T132-T149)

**Phase 11**: All tasks [P] can run in parallel

**Phase 12**: T165-T166 can run in parallel, rest sequential

---

## Task Summary

**Total Tasks**: 172 tasks across 12 phases

- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Infrastructure)**: 11 tasks
- **Phase 3 (Analog Countdown)**: 22 tasks (1 E2E + 21 impl)
- **Phase 4 (Digital Countdown)**: 16 tasks (1 E2E + 15 impl)
- **Phase 5 (Stopwatch)**: 14 tasks (1 E2E + 13 impl)
- **Phase 6 (Digital Clock)**: 14 tasks (1 E2E + 13 impl)
- **Phase 7 (World Clock)**: 15 tasks (1 E2E + 14 impl)
- **Phase 8 (Alarm)**: 15 tasks (1 E2E + 14 impl)
- **Phase 9 (Metronome)**: 16 tasks (1 E2E + 15 impl)
- **Phase 10 (Chess Clock)**: 18 tasks (1 E2E + 17 impl)
- **Phase 11 (Production Config)**: 8 tasks
- **Phase 12 (Testing & Deployment)**: 15 tasks

**E2E Test Coverage**: 8 Playwright tests - **100% tool coverage**

**No placeholders. No demos. No MVPs. Complete production application.**

---

## Notes

- **TDD Approach**: Write E2E test first for each tool, implement until test passes
- **[P] marker**: Tasks can run in parallel (different files)
- **Each tool**: Self-contained in src/pages/<ToolName>.tsx
- **State persistence**: Each tool uses localStorage with unique key (sc.v1.<toolname>)
- **Keyboard shortcuts**: Implemented where applicable (timers/stopwatch)
- **Fullscreen**: Available on Analog Countdown, Digital Countdown, Digital Clock
- **No shared components initially**: Each tool is standalone (can refactor later if needed)
- **Production-first**: Real assets, real IDs, real domain from the start
- **Quality gates**: All 8 E2E tests must pass before deployment
- **CI/CD enforced**: GitHub Actions blocks deployment if tests fail

**Timeline for AI agent**: All 172 tasks completable in <1 hour with full automation and parallelization.

**Endprodukt = www.stoppclock.com live with all 8 fully functional tools ✅**
