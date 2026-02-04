# Implementation Plan: Stoppclock Timer Audit & Improvements

**Feature**: [spec.md](./spec.md)
**Branch**: `002-timer-audit-improvements`
**Created**: 2025-10-20

## Summary

This implementation addresses critical bugs and missing functionality across the Stoppclock timer application suite. The audit identified 4 completely non-functional placeholder tools (World Clock, Alarm, Metronome, Chess Clock), 3 P0 keyboard shortcut bugs in Countdown timer, 2 P1 state persistence bugs (Stopwatch, Cycle Timer), and missing P1 visual implementation for Analog Countdown. Additionally, cross-cutting improvements include standardized keyboard shortcuts, dark/light theme toggle, cross-tab state synchronization, and service worker update notifications.

**Scope**: 12 user stories spanning 69 functional requirements across 8 timer tools, home page, and PWA infrastructure.

**Priority Breakdown**:
- **P0 (Blockers)**: 5 stories - Countdown keyboard shortcuts, World Clock implementation, Alarm implementation, Metronome implementation, Chess Clock implementation
- **P1 (Critical)**: 4 stories - Stopwatch persistence, Cycle Timer pause, Analog Countdown visual display, Service Worker caching
- **P2 (High)**: 3 stories - Keyboard shortcut standardization, Dark/Light theme, Home page improvements

**Success Metrics**:
- All 8 timer tools fully functional (no placeholders)
- Countdown keyboard shortcuts work in all states (<100ms response)
- Stopwatch maintains time across page navigation (±100ms accuracy)
- Metronome tempo accuracy ±2% over 5 minutes
- Service worker detects updates within 30 seconds
- Cross-tab state sync within 500ms
- PWA fully offline-capable after installation

---

## Technical Context

### Language and Version
- **TypeScript**: 5.6.3
- **Target**: ES2020 (modern browsers)
- **Module System**: ESM (Vite native)

### Primary Dependencies
- **React**: 18.3.1 (UI framework)
- **React DOM**: 18.3.1 (rendering)
- **Vite**: 5.4.10 (build tool, dev server, HMR)

### Development Dependencies
- **@playwright/test**: 1.48.0 (E2E testing framework)
- **@vitejs/plugin-react-swc**: 3.7.0 (Fast Refresh via SWC)
- **TypeScript**: 5.6.3 (type checking, compilation)

### Storage
- **Primary**: localStorage with `sc.v1.*` namespace prefix
- **Quota**: Assume 5MB minimum (10MB typical in modern browsers)
- **Persistence Pattern**: Debounced writes (150ms delay) on state changes
- **Cross-Tab Sync**: StorageEvent API for real-time synchronization
- **Quota Handling**: Graceful degradation to session-only storage on quota exceeded

### Testing
- **Framework**: Playwright 1.48.0
- **Test Location**: `tests/e2e/*.spec.ts`
- **Browsers**: Chromium, Firefox, WebKit
- **Coverage**: 44 E2E tests currently (36 passing as of last run)
- **CI/CD**: GitHub Actions with deployment gate (allows non-blocking E2E failures with warnings)

### Target Platform
- **Environment**: Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- **Deployment**: GitHub Pages (static hosting, HTTPS required for Service Workers)
- **Runtime**: Client-side only (zero-backend architecture)
- **PWA**: Service Worker for offline capability, manifest.json for installability

### Project Type
**Single-Page Application (SPA)** with hash-based routing (`#/stopwatch`, `#/countdown`, etc.)

### Performance Goals
- **Keyboard Response**: <100ms latency for all keyboard shortcuts
- **Metronome Accuracy**: ±2% BPM over 5-minute duration
- **Analog Clock FPS**: 30+ FPS for smooth hand animation (via requestAnimationFrame)
- **Theme Toggle**: <200ms to apply dark/light mode across entire UI
- **Cross-Tab Sync**: <500ms state propagation between tabs
- **Service Worker Update Detection**: <30 seconds after deployment
- **Bundle Size**: <180kB gzipped JavaScript (constitution requirement)

### Constraints
1. **Offline-Capable PWA**: NON-NEGOTIABLE - All timers must function fully offline after initial load
2. **Zero-Backend**: No server-side logic, all state in localStorage
3. **Privacy-First**: No external telemetry, analytics, or error tracking (console logging only)
4. **No Vendor Lock-In**: No proprietary APIs (AWS, Google, Azure)
5. **Complete Implementations Only**: No MVPs, placeholders, or demos in production
6. **Accessibility**: WCAG AA compliance (keyboard navigation, color contrast, ARIA labels)
7. **Browser Compatibility**: Must support browsers listed in Target Platform (no polyfills for IE11)

### Scale and Scope
- **Timer Tools**: 8 independent components (Stopwatch, Countdown, Analog Countdown, Cycle Timer, World Clock, Alarm, Metronome, Chess Clock)
- **User Stories**: 12 prioritized features
- **Functional Requirements**: 69 testable requirements
- **Success Criteria**: 15 measurable outcomes
- **Pages**: 11 routes (8 timers + home + legal pages)
- **E2E Tests**: 44 existing tests, targeting 60+ after implementation
- **Expected Users**: Single-user per browser profile (no multi-user support)
- **Expected Load**: Client-side only, no server scaling concerns

---

## Constitution Check

Evaluating feature against constitutional principles from [constitution.md](../../stoppclock_speckit/.specify/memory/constitution.md):

###  Principle 1: Privacy-First Design
**Status**: PASS
**Evidence**:
- FR-069 mandates NO telemetry, analytics, or external error reports
- FR-068 restricts logging to browser console only (developer debugging)
- All data persisted in localStorage (zero server communication)
- Ads consent mechanism already implemented (localStorage flag)

**Compliance**: Full compliance. No privacy violations.

---

###  Principle 2: Zero-Backend Architecture
**Status**: PASS
**Evidence**:
- All timer state persisted in localStorage (no database)
- Deployed to GitHub Pages (static hosting)
- No API calls for core functionality (FR-069)
- Timezone data via Intl.DateTimeFormat API (browser-native, no external service)
- Audio via Web Audio API oscillators (no external sound files required)

**Compliance**: Full compliance. No backend dependencies introduced.

---

###  Principle 3: Offline-Capable PWA (NON-NEGOTIABLE)
**Status**: PASS
**Evidence**:
- SC-011 requires "PWA functions fully offline after initial installation"
- FR-055 to FR-060 mandate Service Worker improvements (update detection, offline caching)
- All timer logic runs client-side (no network dependencies)
- Existing Service Worker at `/sw.js` already caches assets
- User Story 11 specifically addresses PWA installability and offline capability

**Compliance**: Full compliance. Feature enhances offline capability via Service Worker improvements.

---

###  Principle 4: Vendor Lock-In Prevention
**Status**: PASS
**Evidence**:
- No proprietary APIs used (Web Audio API, Intl API, Storage API are web standards)
- No third-party libraries required (React/Vite already in stack)
- Deployment platform agnostic (GitHub Pages, but can deploy to any static host)
- Data format: JSON in localStorage (easily exportable)

**Compliance**: Full compliance. No vendor lock-in introduced.

---

###  Principle 5: Complete Implementations Only
**Status**: PASS
**Evidence**:
- User Story 2, 3, 4, 5 replace placeholder tools with fully functional implementations
- Out of Scope section explicitly defers incomplete features (lap time export, multi-alarm, etc.)
- All 69 functional requirements are fully testable and implementable
- Scope boundaries clearly defined (no MVPs or demos)

**Compliance**: Full compliance. All features are complete, no placeholders remain after implementation.

---

###  Principle 6: Accessibility & Performance Standards
**Status**: PASS
**Evidence**:
- FR-050 to FR-054 mandate keyboard shortcuts for accessibility (Space, R, F, L keys)
- FR-053 ensures keyboard shortcuts don't interfere with text input (WCAG compliance)
- SC-008 requires 30+ FPS for analog clock animation (performance)
- SC-009 requires <100ms keyboard response (performance)
- SC-004 requires ±2% metronome accuracy (performance)
- Performance Goals section explicitly lists <180kB gzipped JS bundle (constitution requirement)

**Compliance**: Full compliance. Accessibility and performance requirements integrated into spec.

---

### Gate Evaluation:  APPROVED

**Decision**: Proceed with implementation. All 6 constitutional principles satisfied.

**Risks**: None identified.

**Recommended Actions**:
1. Add E2E tests for offline PWA functionality (verify timers work without network)
2. Monitor bundle size during implementation (target <180kB gzipped)
3. Test keyboard shortcuts across all browsers for consistency
4. Validate WCAG AA color contrast for dark/light themes

---

## Project Structure

### Documentation Structure

```
specs/002-timer-audit-improvements/
   spec.md                          # Feature specification (complete)
   plan.md                          # This implementation plan
   research.md                      # Phase 0: Technical research findings
   data-model.md                    # Phase 1: Data models and state schemas
   contracts/                       # Phase 1: API contracts (localStorage schemas)
      timer-state.json            # Common timer state schema
      world-clock.json            # Timezone data schema
      alarm.json                  # Alarm state schema
      chess-clock.json            # Chess clock state schema
      preferences.json            # User preferences schema
   quickstart.md                    # Phase 1: Developer quickstart guide
   tasks.md                         # Phase 2: Generated task breakdown
   checklists/
       requirements.md              # Specification quality checklist ( complete)
       implementation.md            # Phase 3: Implementation tracking checklist
```

### Source Code Structure

**Existing Architecture** (discovered via codebase analysis):

```
src/
   main.tsx                         # App entry point, hash-based router, Service Worker registration
   styles.css                       # Global styles, theme variables, component classes
   utils.ts                         # Shared utilities (beep, flash functions)
   pages/                           # Timer components (one per route)
       Stopwatch.tsx               # /stopwatch - Needs persistence fix (P1)
       Countdown.tsx               # /countdown - Needs keyboard shortcut fix (P0)
       AnalogCountdown.tsx         # /analog - Needs visual display (P1, currently placeholder)
       CycleTimer.tsx              # /cycle - Needs pause button (P1)
       WorldClock.tsx              # /world - Needs full implementation (P0, currently placeholder)
       Alarm.tsx                   # /alarm - Needs full implementation (P0, currently placeholder)
       Metronome.tsx               # /metronome - Needs full implementation (P0, currently placeholder)
       ChessClock.tsx              # /chess - Needs full implementation (P0, currently placeholder)
       DigitalClock.tsx            # /digital - Working (live clock display)
       Impressum.tsx               # /impressum - Legal page (no changes)
       Datenschutz.tsx             # /datenschutz - Privacy page (no changes)
```

**Patterns in Existing Code**:
1. **State Management**: React hooks (useState, useEffect, useCallback)
2. **Persistence**: localStorage with `sc.v1.<timer>` keys
3. **Timer Logic**: `requestAnimationFrame` loop via custom `useRaf` hook (see CycleTimer.tsx:56-72)
4. **Debounced Saves**: 150ms timeout before localStorage write (see CycleTimer.tsx:110-113)
5. **Signal System**: Shared `beep()` and `flash()` utilities from utils.ts
6. **Keyboard Shortcuts**: Event listeners on `keydown` with input field focus checks

**New Files to Create**:

```
src/
   hooks/
      useKeyboardShortcuts.ts     # Shared keyboard shortcut hook (Space, R, F)
      useTheme.ts                 # Dark/light theme hook
      useStorageSync.ts           # Cross-tab state synchronization hook
   components/
      ThemeToggle.tsx             # Theme toggle button component
      UpdateNotification.tsx      # Service Worker update prompt component
   types/
       timer-types.ts              # Shared TypeScript types for timer state
```

**Files to Modify**:

```
src/
   main.tsx                         # Add theme provider, update notification, route guards
   styles.css                       # Add dark theme CSS variables, theme toggle styles
   utils.ts                         # Add timezone utilities, audio context management
   pages/
       Stopwatch.tsx               # Fix persistence with timestamp-based calculation
       Countdown.tsx               # Fix keyboard shortcuts to work when running
       AnalogCountdown.tsx         # Implement analog clock face rendering
       CycleTimer.tsx              # Add pause button and persist signal settings
       WorldClock.tsx              # Complete implementation (timezone selection, multi-clock display)
       Alarm.tsx                   # Complete implementation (time input, trigger logic)
       Metronome.tsx               # Complete implementation (BPM control, audio click, visual beat)
       ChessClock.tsx              # Complete implementation (dual timers, increment/delay)

public/
   sw.js                            # Service Worker - Add update detection, skipWaiting logic

tests/e2e/
   01-stopwatch.spec.ts            # Add persistence test across navigation
   02-countdown.spec.ts            # Expand keyboard shortcut tests
   05-world-clock.spec.ts          # NEW - World Clock E2E tests
   06-alarm.spec.ts                # NEW - Alarm E2E tests
   07-metronome.spec.ts            # NEW - Metronome E2E tests
   08-chess-clock.spec.ts          # NEW - Chess Clock E2E tests
   09-theme.spec.ts                # NEW - Theme toggle E2E tests
   10-pwa.spec.ts                  # NEW - PWA offline functionality tests
```

---

## Next Steps

### Phase 0: Research
**Output**: `research.md` with technical findings

**Research Topics**:
1. **Web Audio API** - Best practices for metronome timing accuracy (AudioContext, scheduling techniques)
2. **Storage Events API** - Cross-tab synchronization patterns (event listeners, debouncing)
3. **Intl.DateTimeFormat** - Timezone handling, DST transitions, city/offset mapping
4. **Canvas vs SVG** - Analog clock rendering performance comparison (requestAnimationFrame patterns)
5. **Service Worker Updates** - skipWaiting() vs clients.claim() strategies, update notification UX

**Deliverable**: Document with code samples, API references, performance benchmarks

---

### Phase 1: Data Modeling and Contracts
**Outputs**: `data-model.md`, `contracts/*.json`, `quickstart.md`

**Data Models to Define**:
1. **Timer State** - Common schema for running/paused/stopped state, duration, intervals, signals
2. **Timezone** - City name, UTC offset, DST rules, current time calculation
3. **Alarm** - Target time (HH:MM), active status, next occurrence, trigger state
4. **Chess Clock State** - Dual timers, active player, move counts, increment/delay config
5. **User Preferences** - Theme, signal defaults, timezone selections, last-used configs

**localStorage Contracts**:
- Define JSON schemas for each data model
- Document migration strategy (version field in state)
- Define cross-tab sync event payloads

**Quickstart Guide**:
- Setup instructions (npm install, npm run dev)
- Architecture overview (routing, state management, persistence)
- How to add a new timer component
- How to run E2E tests
- Debugging tips (localStorage inspection, Service Worker debugging)

**Agent Context Update**:
- Run `stoppclock_speckit/.specify/scripts/bash/update-agent-context.sh claude`
- Add Web Audio API, Intl.DateTimeFormat API, Storage Events API to technology list

---

### Phase 2: Task Generation
**Output**: `tasks.md`

Run `/speckit.tasks` to generate dependency-ordered task breakdown from spec.md and plan.md.

**Expected Task Structure**:
- P0 bugs first (Countdown keyboard shortcuts)
- Shared infrastructure (keyboard hooks, theme system, storage sync)
- P0 implementations (World Clock, Alarm, Metronome, Chess Clock)
- P1 fixes (Stopwatch persistence, Cycle Timer pause, Analog Countdown visual)
- P2 enhancements (keyboard standardization, theme, home page)
- E2E test expansion
- Documentation updates

---

### Phase 3: Implementation
**Output**: Working code, passing E2E tests

Execute tasks from `tasks.md` in dependency order using `/speckit.implement` or manual task-by-task implementation.

**Implementation Tracking**:
- Use `checklists/implementation.md` to track progress
- Update E2E tests in parallel with feature implementation
- Monitor bundle size (target <180kB gzipped)
- Test cross-browser compatibility (Chromium, Firefox, WebKit)

---

## Complexity Tracking

**Status**: No constitution violations detected.

No complexity tracking table required - all constitutional gates passed.
