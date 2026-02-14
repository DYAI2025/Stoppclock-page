# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Stoppclock** is a projector-friendly timer web application designed for classrooms, exams, and seminars. Built as a Progressive Web App (PWA) with 12+ specialized timer tools, offline functionality, and privacy-first monetization.

**Tech Stack:**
- React 18 + TypeScript
- Vite (build tool and dev server)
- Playwright (E2E testing) + Vitest (unit testing)
- Canvas API (60 FPS analog animations)
- Web Audio API (sound generation)
- Service Worker (offline PWA functionality)
- Lucide React (icons)
- React Markdown + remark-gfm (content rendering)

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
npm run test:e2e     # Run all Playwright E2E tests
npm run test:e2e:ui  # Run tests with Playwright UI
npm run test         # Run Vitest unit tests
npm run test:ui      # Run Vitest with UI
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

**Core Timers:**
- `#/` → Landing page with timer grid
- `#/analog` → Analog Countdown (Canvas-based)
- `#/countdown` → Digital Countdown
- `#/stopwatch` → Stopwatch with lap times
- `#/timesince` → Time Since (elapsed time from historic events)
- `#/pomodoro` → Pomodoro Timer with Kanban board
- `#/cooking` → Cooking Timer (multi-timer kitchen assistant)
- `#/couples` → Couples Timer (Zwiegespräch dialogue format)
- `#/chess` → Chess Clock
- `#/metronome` → Metronome
- `#/world` → World Clock
- `#/alarm` → Alarm
- `#/digital` → Digital Clock

**Custom Sessions:**
- `#/custom-sessions` → Custom Sessions landing page
- `#/custom-sessions/builder` → Session builder
- `#/custom-sessions/run/:id` → Session runner
- `#/custom-sessions/preview/:id` → Session preview

**Content & SEO Pages:**
- `#/timers` → Timer Worlds index (SEO content)
- `#/blog` → Blog index
- `#/blog/pomodoro-timer-online` → Blog article
- `#/blog/pomodoro-vs-countdown` → Blog article
- `#/timer-for-students` → Landing page for students
- `#/timer-for-productivity` → Landing page for productivity
- `#/timer-for-fitness` → Landing page for fitness
- `#/timer-for-cooking` → Landing page for cooking
- `#/timer-for-meditation` → Landing page for meditation
- `#/timer-for-focus` → Landing page for focus
- `#/time-philosophy` → Pillar page (Raum für Zeit)
- `#/facts` → Clock facts page

**Legal & Info:**
- `#/about` → About page
- `#/contact` → Contact page
- `#/imprint` → Legal imprint (English)
- `#/privacy` → Privacy policy (English)
- `#/impressum` → Legal imprint (German)
- `#/datenschutz` → Privacy policy (German)

### State Management Pattern
**Cross-tab synchronization** via custom `useStorageSync` hook:
- Uses `localStorage` + `StorageEvent` for <500ms cross-tab sync
- Each timer has its own versioned state schema in `src/types/timer-types.ts`
- State persisted with keys like `sc.v1.analog`, `sc.v1.stopwatch`, etc.
- All state types include `version: 1` field for future migrations

**Context API:**
- `PinnedTimersContext` - Manages user's pinned timers on home page (max 3 pins)

**Example:** Opening the countdown timer in two browser tabs keeps them synchronized.

### Custom Hooks
Located in `src/hooks/`:

| Hook | Purpose |
|------|---------|
| `useStorageSync` | Cross-tab localStorage sync with debouncing |
| `useKeyboardShortcuts` | Standardized keyboard controls for timers |
| `useTheme` | Dark/light/auto theme management |
| `useLang` | Language toggle (en/de) with localStorage persistence |
| `useSEO` | Dynamic meta tags for SEO |
| `useAutoFitText` | Auto-sizing text to fit container |
| `useScrollReveal` | Intersection observer for scroll animations |
| `useActiveTimerTitle` | Dynamic document title based on timer state |
| `useSessionStorage` | Session storage hook |

### Keyboard Shortcuts
Standardized via `useKeyboardShortcuts` hook (src/hooks/useKeyboardShortcuts.ts):
- **Space** → Start/Pause toggle
- **R** → Reset timer
- **F** → Toggle fullscreen
- **L** → Record lap time (Stopwatch only)

Auto-disables when user is typing in input fields.

### Timer Types & State Schemas
All timer state interfaces defined in `src/types/timer-types.ts`:

**Core Timer States:**
- `CountdownState` → Digital Countdown, Analog Countdown
- `StopwatchState` → Stopwatch (includes `LapTime[]` array)
- `PomodoroState` → Pomodoro Timer (includes phase cycling and task list)
- `CookingTimerState` → Cooking Timer (multi-timer, up to 10 timers)
- `ChessClockState` → Chess Clock (dual timers with modes: simple, fischer, bronstein)
- `MetronomeState` → Metronome (BPM, time signature, accent patterns)
- `AlarmState` → Alarm Clock
- `WorldClockState` → World Clock (timezone entries)
- `CouplesTimerState` → Couples Timer (Zwiegespräch dialogue sessions)
- `TimeSinceState` → Time Since (elapsed time from events)
- `CycleTimerState` → Cycle Timer (repeating intervals)

**Supporting Types:**
- `SignalPreferences` → Sound and flash preferences
- `VisualTheme` → Contextual design with gradients, particles, fonts
- `SessionPreset` → Couples Timer session configurations
- `HistoricalEvent` → Time Since event definitions

### Analog Countdown Implementation
Located in `src/pages/AnalogCountdown.tsx`:
- **Canvas rendering** at 60 FPS via `requestAnimationFrame`
- **Clock physics:** Hour hand uses 12-hour clock logic (`totalHours / 12`) to match standard analog clock behavior
- **Max duration:** 4 hours (for optimal readability on clock face)
- **Progress visualization:** Colored arc (red→green gradient via HSL) shows remaining time
- **Warning system:** Configurable audio beep + visual flash
- **Presets:** Quick-select durations from 5 minutes to 4 hours

**Critical bug fix (commit 6891b6b):** Hour hand must divide by 12, not 4, to follow proper analog clock physics where the hour hand moves 1/12th the speed of the minute hand.

### Cooking Timer Implementation
Located in `src/pages/CookingTimer.tsx`:
- **Multi-timer support:** Up to 10 simultaneous timers with independent controls
- **Presets:** Stove (20min), Oven (25min), Pasta (10min), Rice (15min), Eggs (7min), Tea (3min), Custom
- **Auto-color rotation:** 10 soft pastel colors (defined in `src/config/cooking-presets.ts`)
- **Smart sorting:** Timers auto-sort by soonest completion time, alarming timers always on top
- **Alarm behavior:** 60-second audio beep (800 Hz), then visual pulsing until manual dismissal
- **Extension controls:** Add +1, +2, or +5 minutes while alarm is ringing (safety feature)
- **localStorage persistence:** State saved to `sc.v1.cooking` with 150ms debounce

### Couples Timer Implementation
Located in `src/pages/CouplesTimer.tsx`:
- **Based on Moeller's Zwiegespräch:** Structured dialogue format for couples
- **Session phases:** SETUP → PREP → A_SPEAKS → TRANSITION → B_SPEAKS → A_CLOSING → B_CLOSING → COOLDOWN → COMPLETED
- **Presets:** Classic 90min, Beginner 60min, Parent-Child 60min, Tiny Check-in, Conflict Cooldown, Screen-Free Tea
- **Profile system:** Save couple profiles with preferred settings
- **Schedule support:** Main day/time with backup scheduling

### Time Since Implementation
Located in `src/pages/TimeSince.tsx`:
- **Historical events:** Pre-defined events (space, history, science, culture)
- **Custom events:** User can add personal milestones
- **Visual theming:** Each event can have ambient gradients, particle effects, and fonts
- **Symbolic dates:** Support for approximate/symbolic ancient dates

## Component Architecture

### Core Components
Located in `src/components/`:

**Timer UI:**
- `CountdownRing` → Circular progress visualization
- `TimerIcon` → SVG icons for each timer type
- `TimerQuickInfo` → Quick info cards on home page

**Home Page:**
- `ClockFactsBoard` → Digital-style facts display
- `PinnedTimersBoard` → User's pinned timers (max 3)
- `HomeAnalogClock` → Live analog clock in header

**Preset System:**
- `PresetCard` → Individual preset display
- `PresetsSection` → Preset grid container
- `PresetSaveModal` → Modal for saving new presets
- `SavePresetButton` → Trigger for save modal

**Sharing:**
- `ShareButton` → Share action trigger
- `ShareModal` → Share options modal
- `StatsCard` → Usage statistics display

**Settings & UI:**
- `SettingsModal` → Timer settings modal
- `DarkModeToggle` → Theme switcher
- `LanguageToggle` → Language switcher (en/de)
- `HomeButton` → Navigation back to home
- `UpdateNotification` → PWA update prompt

**Monetization:**
- `ConsentBanner` → GDPR consent UI
- `AdSenseScript` → AdSense loader (consent-gated)
- `AdUnit` → Individual ad placement
- `ResponsiveAd` → Responsive ad unit

**Content:**
- `BlogList` → Blog article listing
- `BlogPost` → Blog article renderer
- `CountdownGuide` → Educational content
- `PomodoroGuide` → Pomodoro methodology guide
- `RandomFactWidget` → Random clock fact display

**Timer Worlds (SEO Content):**
- `TimerWorldLayout` → Layout wrapper
- `Breadcrumb` → Navigation breadcrumbs
- `FactPlaque` → Fact display card
- `RitualCard` → Usage ritual suggestions
- `TableOfContents` → Content navigation

**Pomodoro Specific:**
- `PomodoroDisplay` → Timer display
- `PomodoroControls` → Play/pause/reset controls
- `PomodoroSettings` → Duration settings
- `KanbanBoard` → Task management board

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

### Utilities
- `src/utils/consent.ts` → Consent state management
- `src/utils/analytics.ts` → GA4 integration
- `src/utils/branding.ts` → Custom seminar branding logic

## Design System

### Theme: Modern Minimalist with Golden Ratio
- **Color Palette:**
  - Background: Deep Ocean (#0b1220, #0A1628)
  - Text: White (#FFFFFF)
  - Accents: Purple (#7B2CBF), Cyan (#00D9FF), Gold (#D4AF37)
  - Timer-specific accent colors defined per card
- **Golden Ratio (φ = 1.618) spacing:**
  - Grid max-width: 1618px (1000 × φ)
  - Padding/margins: 61.8px, 78.4px (calculated with φ)
  - Grid gap: 47.4px (29.4 × φ)
- **Typography:** Segoe UI (primary), fallback to system fonts

### Home Page Design
- **STOPPCLOCK header:** Integrated analog clock between "Stopp" and "Clock"
- **Timer cards:** Per-card accent colors with CSS custom properties
- **Facts board:** Digital-style rotating clock facts
- **Pinned timers:** User's favorite timers (max 3)
- **Pillar section:** "Explore Further" content links

### Design Tokens
CSS custom properties defined in `src/design-tokens.css` and `src/styles.css`:
- Color scales for each timer type
- Spacing using golden ratio calculations
- Typography scales
- Animation timing

## PWA Configuration

- **Service Worker:** `public/sw.js` (offline caching strategy)
- **Manifest:** `public/manifest.webmanifest` (PWA metadata)
- **Icons:** `public/icons/` (multiple sizes for install prompts)
- **Offline-first:** All timers work without network connection

## Testing Strategy

E2E tests in `tests/e2e/` covering:
- All timer tools functionality
- Cross-browser compatibility (Chromium, Firefox)
- State persistence across page reloads
- Keyboard shortcut validation
- Fullscreen mode behavior
- Landing page and couples timer flows
- Timer Worlds content pages
- Preset, share, and stats features

Test files:
- `01-analog-countdown.spec.ts`
- `02-countdown.spec.ts`
- `03-stopwatch.spec.ts`
- `04-digital-clock.spec.ts`
- `05-world-clock.spec.ts`
- `06-alarm.spec.ts`
- `07-metronome.spec.ts`
- `08-chess-clock.spec.ts`
- `09-landingpage-couples.spec.ts`
- `09-timer-worlds.spec.ts`
- `presets-share-stats.spec.ts`

## Build Process

1. `node scripts/parse-timer-worlds.mjs` → Parses timer world markdown content
2. `vite build` → Bundles TypeScript/React to `dist/`
3. `node scripts/gen-sitemap.mjs` → Generates sitemap.xml for SEO

**Scripts in `scripts/`:**
- `doctor.mjs` → Security/quality checker for forbidden tokens
- `gen-sitemap.mjs` → Sitemap generator
- `parse-facts.mjs` → Facts data parser
- `parse-timer-worlds.mjs` → Timer worlds content parser

## Speckit Framework

The project uses a `.specify/` directory structure for feature planning and specifications:

```
.specify/
├── memory/
│   └── constitution.md        # Non-negotiable project principles
├── features/                  # Feature specifications and plans
│   ├── ads-monetization-growth/
│   └── ui-ux-redesign/
├── seo/                       # SEO strategy documents
├── scripts/bash/              # Automation scripts for feature creation
└── templates/                 # Templates for specs, plans, checklists
```

**Constitution Principles** (`.specify/memory/constitution.md`):
1. **Privacy First** - No tracking without explicit opt-in consent
2. **Performance & Speed** - Lighthouse score >90, <2s load time
3. **Classroom Optimized** - Fullscreen mode without ad interference
4. **Progressive Enhancement** - Core functionality works without ads
5. **Accessibility** - WCAG 2.1 AA compliance
6. **Code Quality** - TypeScript strict mode, comprehensive tests

These principles are **non-negotiable** when implementing new features or making changes.

## File Organization Patterns

```
src/
├── main.tsx              # App entry point, routing, PWA registration
├── design-tokens.css     # CSS custom properties
├── styles.css            # Global styles
├── pages/                # Timer page components (one per route)
│   ├── AnalogCountdown.tsx
│   ├── Countdown.tsx
│   ├── Stopwatch.tsx
│   ├── CouplesTimer.tsx
│   ├── TimeSince.tsx
│   ├── blog/             # Blog article pages
│   └── ...
├── components/           # Reusable UI components
│   ├── ads/              # Ad-related components
│   ├── layout/           # Layout components
│   ├── pomodoro/         # Pomodoro-specific components
│   ├── timer-world/      # Timer Worlds components
│   ├── world-clock/      # World Clock components
│   └── ...
├── hooks/                # Custom React hooks
│   ├── useStorageSync.ts       # Cross-tab state sync
│   ├── useKeyboardShortcuts.ts # Keyboard controls
│   ├── useLang.ts              # Language toggle
│   ├── useSEO.ts               # Dynamic meta tags
│   └── ...
├── contexts/             # React Context providers
│   └── PinnedTimersContext.tsx
├── types/                # TypeScript type definitions
│   ├── timer-types.ts          # Timer state schemas
│   └── monetization-types.ts   # Ad/analytics types
├── utils/                # Utility functions
│   ├── consent.ts        # GDPR consent management
│   ├── analytics.ts      # GA4 integration
│   └── branding.ts       # Custom branding logic
├── config/               # Configuration files
│   ├── ad-units.ts             # AdSense ad placement config
│   ├── cooking-presets.ts      # Cooking timer presets
│   ├── couples-presets.ts      # Couples timer presets
│   ├── historical-events.ts    # Time Since events
│   └── until-events.ts         # Count-until events
├── domain/               # Domain logic
│   ├── pomodoro/         # Pomodoro business logic
│   └── world-clock/      # World clock time calculations
└── data/                 # Static data
    └── blog-registry.ts  # Blog article metadata
```

## Important Constraints

1. **No external dependencies for core timer logic** → All timer calculations use vanilla JS/TypeScript
2. **Max localStorage usage:** ~5MB total (browser limit)
3. **60 FPS target** for analog animations via `requestAnimationFrame`
4. **Privacy-first:** No tracking without explicit user consent (see Constitution)
5. **Offline-capable:** All core features must work without network
6. **No ads during active timers:** Fullscreen timer mode must be ad-free for classroom use
7. **Performance budget:** Lighthouse score must remain >90 (constitution requirement)
8. **Max 3 pinned timers** per user (defined in PinnedTimersContext)

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

### Language Support
Use `useLang` hook for bilingual content:
```typescript
const [lang, setLang] = useLang(); // 'en' | 'de'
```

### Pinned Timers Context
Use the context for pin management:
```typescript
const { isPinned, togglePin, pinnedTimers } = usePinnedTimers();
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
5. **Test both languages** - Toggle between EN/DE to verify translations

### Before Committing
1. **Build successfully** - `npm run build` must complete without errors
2. **Tests pass** - `npm run test:e2e` must pass
3. **Doctor check** - `npm run doctor` must report OK
4. **Performance check** - Verify Lighthouse score >90 if making UI changes
5. **Constitution compliance** - Confirm changes don't violate non-negotiable principles

### Feature Development
- Use `.specify/` directory for planning new features
- Follow the existing feature structure (spec.md, plan.md, data-model.md, etc.)
- Reference the Constitution principles in feature specs
- Add new timer types to `src/types/timer-types.ts`
- Update routing in `src/main.tsx`
- Add E2E tests for new features

### Adding a New Timer
1. Create state interface in `src/types/timer-types.ts`
2. Create page component in `src/pages/`
3. Add route in `src/main.tsx`
4. Add timer card to home page grid
5. Create icon in `TimerIcon` component
6. Add storage key (e.g., `sc.v1.newtimer`)
7. Add E2E tests
8. Update sitemap script if needed
