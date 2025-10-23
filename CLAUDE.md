# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Stoppclock** is a projector-friendly timer web application designed for classrooms, exams, and seminars. Built as a Progressive Web App (PWA) with 8 specialized timer tools, offline functionality, and privacy-first monetization.

**Tech Stack:**
- React 18 + TypeScript
- Vite (build tool and dev server)
- Playwright (E2E testing)
- Canvas API (60 FPS analog animations)
- Web Audio API (sound generation)
- Service Worker (offline PWA functionality)

## Development Commands

### Core Development
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build (outputs to dist/ + generates sitemap)
npm run preview      # Preview production build locally (http://localhost:4173)
```

**Port Reference:**
- Dev server: `localhost:5173` (Vite default, hot reload enabled)
- Preview server: `localhost:4173` (production build testing, used by Playwright)

### Testing & Quality
```bash
npm run test:e2e     # Run all Playwright E2E tests (44+ tests)
npm run test:e2e:ui  # Run tests with Playwright UI
npm run doctor       # Security/quality check - scans for forbidden tokens
```

**Important Testing Notes:**
- Tests run against the **preview server** (port 4173), not the dev server
- Playwright auto-starts `npm run preview` before running tests
- Tests are configured in `playwright.config.ts` (Chromium + Firefox enabled, Webkit disabled)
- The `doctor` script checks for forbidden tokens like "lovable", "dev-agent", "tagger" in the codebase. Root-level .md files and the doctor script itself are excluded.

## Architecture

### Routing System
Hash-based client-side routing via `useHashRoute()` hook in `src/main.tsx`:
- `#/` → Home page with timer grid
- `#/analog` → Analog Countdown (Canvas-based)
- `#/countdown` → Digital Countdown
- `#/stopwatch` → Stopwatch with lap times
- `#/pomodoro` → Pomodoro Timer with Kanban board
- `#/cooking` → Cooking Timer (multi-timer kitchen assistant)
- `#/chess` → Chess Clock
- `#/metronome` → Metronome
- `#/world` → World Clock
- `#/alarm` → Alarm
- `#/impressum` → Legal imprint
- `#/datenschutz` → Privacy policy

### State Management Pattern
**Cross-tab synchronization** via custom `useStorageSync` hook:
- Uses `localStorage` + `StorageEvent` for <500ms cross-tab sync
- Each timer has its own versioned state schema in `src/types/timer-types.ts`
- State persisted with keys like `sc.v1.analog`, `sc.v1.stopwatch`, etc.
- All state types include `version: 1` field for future migrations

**Example:** Opening the countdown timer in two browser tabs keeps them synchronized.

### Keyboard Shortcuts
Standardized via `useKeyboardShortcuts` hook (src/hooks/useKeyboardShortcuts.ts):
- **Space** → Start/Pause toggle
- **R** → Reset timer
- **F** → Toggle fullscreen
- **L** → Record lap time (Stopwatch only)

Auto-disables when user is typing in input fields.

### Timer Types & State Schemas
All timer state interfaces defined in `src/types/timer-types.ts`:
- `CountdownState` → Digital Countdown, Analog Countdown
- `StopwatchState` → Stopwatch (includes `LapTime[]` array)
- `PomodoroState` → Pomodoro Timer (includes phase cycling and task list)
- `CookingTimerState` → Cooking Timer (multi-timer kitchen assistant, up to 10 timers)
- `ChessClockState` → Chess Clock (dual timers with modes: simple, fischer, bronstein)
- `MetronomeState` → Metronome (BPM, time signature, accent patterns)
- `AlarmState` → Alarm Clock
- `WorldClockState` → World Clock (timezone entries)

### Analog Countdown Implementation
Located in `src/pages/AnalogCountdown.tsx`:
- **Canvas rendering** at 60 FPS via `requestAnimationFrame`
- **Clock physics:** Hour hand uses 12-hour clock logic (`totalHours / 12`) to match standard analog clock behavior
- **Max duration:** 4 hours (for optimal readability on clock face)
- **Progress visualization:** Colored arc (red→green gradient via HSL) shows remaining time
- **Warning system:** Configurable audio beep + visual flash
- **Presets:** Quick-select durations from 5 minutes to 4 hours

**Critical bug fix (commit 6891b6b):** Hour hand must divide by 12, not 4, to follow proper analog clock physics where the hour hand moves 1/12th the speed of the minute hand.

**Note:** While analog clock displays up to 4 hours for readability, other timer types support longer durations (e.g., Stopwatch is unlimited, Digital Countdown supports arbitrary hours).

### Cooking Timer Implementation
Located in `src/pages/CookingTimer.tsx`:
- **Multi-timer support:** Up to 10 simultaneous timers with independent controls
- **Presets:** Stove (20min), Oven (25min), Pasta (10min), Rice (15min), Eggs (7min), Tea (3min), Custom
- **Auto-color rotation:** 10 soft pastel colors (defined in `src/config/cooking-presets.ts`)
- **Smart sorting:** Timers auto-sort by soonest completion time, alarming timers always on top
- **Alarm behavior:** 60-second audio beep (800 Hz), then visual pulsing until manual dismissal
- **Extension controls:** Add +1, +2, or +5 minutes while alarm is ringing (safety feature for cooking)
- **Card-based UI:** Each timer is a colored card with label, countdown, progress bar, and controls
- **localStorage persistence:** State saved to `sc.v1.cooking` with 150ms debounce
- **Responsive design:** Grid layout adapts from multi-column to single column on mobile

**Key features:**
- Manual dismissal required (no auto-dismiss for cooking safety)
- Progress bar shows remaining time visually
- Delete/reset individual timers
- Fullscreen mode support
- Deep Ocean Aurora color theme with soft pastel timer cards

## Monetization Architecture

Privacy-first monetization framework with GDPR-compliant consent management:

### Type Definitions
`src/types/monetization-types.ts` defines all monetization types:
- `ConsentPreference` → User's ad/analytics consent (stored in `localStorage`)
- `AdUnit` → Individual ad placement configuration
- `CustomBranding` → User's seminar/event branding (logo + text overlay)
- `BlogPost` → Blog metadata for SEO content
- `AnalyticsEvent` → Custom GA4 events

### Ad Unit System
`src/config/ad-units.ts` manages all ad placements:
- **5 strategic placements:** Home page (top/middle), setup screens, interstitials, anchor ads
- **Visibility rules:** Control when ads show (timer running, fullscreen, mobile)
- **Helper functions:** `getAdUnit()`, `getAdUnitsByPlacement()`, `shouldShowAd()`

### Components
- `ConsentBanner` → GDPR consent UI (first visit)
- `AdSenseScript` → Loads AdSense only with consent
- `AdUnit` → Renders individual ad units
- `HomeButton` → Reusable navigation component

### Utilities
- `src/utils/consent.ts` → Consent state management
- `src/utils/analytics.ts` → GA4 integration
- `src/utils/branding.ts` → Custom seminar branding logic

## Design System

### Theme: Modern Minimalist with Golden Ratio
- **Color Palette:**
  - Background: Charcoal (#0b1220, #1a2332)
  - Text: White (#FFFFFF)
  - Accents: Crimson Red (#DC143C), Slate Gray (#708090)
- **Golden Ratio (φ = 1.618) spacing:**
  - Grid max-width: 1618px (1000 × φ)
  - Padding/margins: 61.8px, 78.4px (calculated with φ)
  - Grid gap: 47.4px (29.4 × φ)
- **Typography:** Segoe UI (primary), fallback to system fonts

### Home Page Design (commit 5876bf0)
- **STOPPCLOCK header:** Large geometric banner with diagonal gradient
- **Golden ratio accents:** 61.8% overlay, 38.2% red line
- **Corner accents:** Red borders (61.8px × 61.8px)
- **No white rectangles** above timer buttons (removed for cleaner look)

### Analog Clock Design Principles
- **Minimalist markers:** Only 12, 3, 6, 9 numbers displayed
- **Tick marks:** Subtle gray (hours), light gray (minutes)
- **Hands:** Tapered with drop shadows, red second hand (#DC143C)
- **Progress ring:** Single colored arc (not full circle background)
- **Center cap:** White outer ring with charcoal inner dot

## PWA Configuration

- **Service Worker:** `public/sw.js` (offline caching strategy)
- **Manifest:** `public/manifest.webmanifest` (PWA metadata)
- **Icons:** `public/icons/` (multiple sizes for install prompts)
- **Offline-first:** All timers work without network connection

## Testing Strategy

44+ Playwright E2E tests covering:
- All 8 timer tools functionality
- Cross-browser compatibility (Chrome, Firefox, Safari)
- State persistence across page reloads
- Keyboard shortcut validation
- Fullscreen mode behavior

## Build Process

1. `vite build` → Bundles TypeScript/React to `dist/`
2. `node scripts/gen-sitemap.mjs` → Generates sitemap.xml for SEO

## Speckit Framework

The project uses a `.specify/` directory structure for feature planning and specifications:

```
.specify/
├── memory/
│   └── constitution.md        # Non-negotiable project principles
├── features/                  # Feature specifications and plans
│   ├── ads-monetization-growth/
│   └── ui-ux-redesign/
├── scripts/bash/              # Automation scripts for feature creation
└── templates/                 # Templates for specs, plans, checklists
```

**Constitution Principles** (`.specify/memory/constitution.md`):
1. **Privacy First** - No tracking without explicit opt-in consent
2. **Performance & Speed** - Lighthouse score >90, <2s load time
3. **Classroom Optimized** - Fullscreen mode without ad interference
4. **Progressive Enhancement** - Core functionality works without ads
5. **Accessibility** - WCAG 2.1 AA compliance

These principles are **non-negotiable** when implementing new features or making changes.

## File Organization Patterns

```
src/
├── main.tsx              # App entry point, routing, PWA registration
├── styles.css            # Global styles, CSS variables
├── pages/                # Timer page components (one per route)
│   ├── AnalogCountdown.tsx
│   ├── Countdown.tsx
│   ├── Stopwatch.tsx
│   └── ...
├── components/           # Reusable UI components
│   ├── ConsentBanner.tsx
│   ├── AdUnit.tsx
│   └── HomeButton.tsx
├── hooks/                # Custom React hooks
│   ├── useStorageSync.ts       # Cross-tab state sync
│   ├── useKeyboardShortcuts.ts # Keyboard controls
│   └── useTheme.ts
├── types/                # TypeScript type definitions
│   ├── timer-types.ts          # Timer state schemas
│   └── monetization-types.ts   # Ad/analytics types
├── utils/                # Utility functions
│   ├── consent.ts        # GDPR consent management
│   ├── analytics.ts      # GA4 integration
│   └── branding.ts       # Custom branding logic
└── config/               # Configuration files
    └── ad-units.ts       # AdSense ad placement config
```

## Important Constraints

1. **No external dependencies for core timer logic** → All timer calculations use vanilla JS/TypeScript
2. **Max localStorage usage:** ~5MB total (browser limit)
3. **60 FPS target** for analog animations via `requestAnimationFrame`
4. **Privacy-first:** No tracking without explicit user consent (see Constitution)
5. **Offline-capable:** All core features must work without network
6. **No ads during active timers:** Fullscreen timer mode must be ad-free for classroom use
7. **Performance budget:** Lighthouse score must remain >90 (constitution requirement)

## Common Gotchas

### Analog Clock Hour Hand Calculation
Always divide by 12, not by the timer duration:
```typescript
// ✅ CORRECT
const hrs = totalHoursWithMinutes / 12;  // Standard analog clock physics

// ❌ WRONG
const hrs = totalHoursWithMinutes / 4;   // Causes hour hand to move too fast
```

### Timer State Persistence
All timer states must include version field for future migrations:
```typescript
interface MyTimerState {
  version: 1;  // Required for migration strategy
  // ... other fields
}
```

### Cross-Tab Sync
Use `useStorageSync` instead of raw `localStorage` to ensure changes propagate to other tabs:
```typescript
const [state, setState] = useStorageSync('sc.v1.mytimer', initialState);
```

## AdSense Configuration

Publisher ID: `ca-pub-1712273263687132`

Ad slot IDs configured in `src/config/ad-units.ts`:
- Banner01: `2954253435` (home-top)
- Other slots: Placeholder IDs (replace with actual AdSense dashboard IDs)

**Note:** `ads.txt` in `public/` directory must be deployed to verify ownership.

## Development Workflow Best Practices

### Before Making Changes
1. **Check the Constitution** - Ensure changes align with `.specify/memory/constitution.md` principles
2. **Run tests** - `npm run test:e2e` to verify current state
3. **Run doctor** - `npm run doctor` to check for forbidden tokens

### During Development
1. **Use dev server** - `npm run dev` for hot reload during development
2. **Test in preview mode** - `npm run preview` to test production build behavior
3. **Verify cross-tab sync** - Open multiple browser tabs to test `useStorageSync` functionality
4. **Check fullscreen mode** - Press F or click fullscreen button to verify layout

### Before Committing
1. **Build successfully** - `npm run build` must complete without errors
2. **Tests pass** - `npm run test:e2e` must pass (44+ tests)
3. **Doctor check** - `npm run doctor` must report OK
4. **Performance check** - Verify Lighthouse score >90 if making UI changes
5. **Constitution compliance** - Confirm changes don't violate non-negotiable principles

### Feature Development
- Use `.specify/` directory for planning new features
- Follow the existing feature structure (spec.md, plan.md, data-model.md, etc.)
- Reference the Constitution principles in feature specs
