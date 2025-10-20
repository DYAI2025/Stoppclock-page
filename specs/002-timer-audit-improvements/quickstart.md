# Developer Quickstart Guide

**Feature**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Created**: 2025-10-20

This guide helps developers get started with the Stoppclock Timer Audit & Improvements feature implementation.

---

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: For version control
- **Browser**: Chrome/Firefox/Safari for testing (webkit also recommended for cross-browser testing)
- **Editor**: VS Code recommended (TypeScript support)

---

## Setup

### 1. Clone and Install

```bash
# Navigate to project root
cd /home/dyai/Dokumente/DYAI_home/Web/stoppclock-page

# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install chromium firefox webkit
```

### 2. Development Server

```bash
# Start Vite dev server with HMR (Hot Module Replacement)
npm run dev

# Server runs at http://localhost:5173
# Open in browser to see live updates
```

### 3. Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
# Preview runs at http://localhost:4173
```

### 4. Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e tests/e2e/02-countdown.spec.ts

# Run tests in UI mode (interactive debugging)
npm run test:e2e -- --ui

# Run tests in headed mode (see browser window)
npm run test:e2e -- --headed
```

---

## Project Architecture

### Routing

Hash-based SPA routing using `useHashRoute` hook in `src/main.tsx`:

```typescript
// Routes
#/                  → Home page (timer grid)
#/stopwatch         → Stopwatch
#/countdown         → Digital Countdown
#/analog            → Analog Countdown
#/cycle             → Cycle Timer
#/world             → World Clock
#/alarm             → Alarm Clock
#/metronome         → Metronome
#/chess             → Chess Clock
#/impressum         → Legal/Impressum
#/datenschutz       → Privacy Policy
```

### File Structure

```
src/
├── main.tsx                         # App entry point, router, Service Worker registration
├── styles.css                       # Global styles, CSS variables, component classes
├── utils.ts                         # Shared utilities (beep, flash functions)
├── pages/                           # Timer components (one per route)
│   ├── Stopwatch.tsx               # /stopwatch
│   ├── Countdown.tsx               # /countdown
│   ├── AnalogCountdown.tsx         # /analog
│   ├── CycleTimer.tsx              # /cycle
│   ├── WorldClock.tsx              # /world (P0: needs implementation)
│   ├── Alarm.tsx                   # /alarm (P0: needs implementation)
│   ├── Metronome.tsx               # /metronome (P0: needs implementation)
│   ├── ChessClock.tsx              # /chess (P0: needs implementation)
│   ├── DigitalClock.tsx            # /digital
│   ├── Impressum.tsx               # /impressum
│   └── Datenschutz.tsx             # /datenschutz
├── hooks/                           # (NEW) Shared React hooks
│   ├── useKeyboardShortcuts.ts     # Keyboard shortcut handler
│   ├── useTheme.ts                 # Theme management hook
│   └── useStorageSync.ts           # Cross-tab state sync hook
├── components/                      # (NEW) Reusable components
│   ├── ThemeToggle.tsx             # Theme toggle button
│   └── UpdateNotification.tsx      # Service Worker update prompt
└── types/
    └── timer-types.ts              # (NEW) Shared TypeScript interfaces

public/
├── sw.js                            # Service Worker (needs update detection fix)
├── manifest.json                    # PWA manifest
└── icons/                           # Timer icons and buttons
    ├── icon-512.png
    ├── STOP_WATCH_ICON.png
    ├── STOP_WATCH_BUTTON.png
    └── ...

tests/e2e/
├── 01-stopwatch.spec.ts            # Stopwatch E2E tests
├── 02-countdown.spec.ts            # Countdown E2E tests (needs keyboard shortcut tests)
├── 03-analog.spec.ts               # Analog Countdown tests
├── 04-cycle.spec.ts                # Cycle Timer tests
├── 05-world-clock.spec.ts          # (NEW) World Clock tests
├── 06-alarm.spec.ts                # (NEW) Alarm tests
├── 07-metronome.spec.ts            # (NEW) Metronome tests
├── 08-chess-clock.spec.ts          # (NEW) Chess Clock tests
├── 09-theme.spec.ts                # (NEW) Theme toggle tests
└── 10-pwa.spec.ts                  # (NEW) PWA offline tests
```

---

## State Management Pattern

### localStorage Persistence

All timers use localStorage with `sc.v1.*` namespace:

```typescript
const LS_KEY = "sc.v1.countdown";

// Load state on mount
function load(): CountdownState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw) as CountdownState;
  } catch {
    return getDefaultState();
  }
}

// Save state (debounced 150ms)
function save(state: CountdownState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    console.error("Failed to save state (quota exceeded?)");
  }
}

// React pattern
const [state, setState] = useState<CountdownState>(load);

useEffect(() => {
  const timer = setTimeout(() => save(state), 150);
  return () => clearTimeout(timer);
}, [state]);
```

### Timer State Pattern (Countdown-Style)

**Key Insight**: Store `endAt` timestamp, not `remainingMs`, for running timers:

```typescript
// BAD: Storing remainingMs (drifts when tab is backgrounded)
{
  running: true,
  remainingMs: 180000, // This gets stale!
}

// GOOD: Storing endAt timestamp (always accurate)
{
  running: true,
  endAt: 1729450823456, // Unix timestamp when timer expires
  remainingMs: 180000,  // Only used when paused
}

// Calculate current remainingMs
const currentRemaining = state.running && state.endAt
  ? Math.max(0, state.endAt - Date.now())
  : state.remainingMs;
```

### requestAnimationFrame Loop

For smooth UI updates (30-60 FPS):

```typescript
function useRaf(enabled: boolean, callback: () => void) {
  const rafId = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    let live = true;
    const loop = () => {
      if (!live) return;
      callback();
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      live = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled, callback]);
}

// Usage
useRaf(state.running, () => {
  // Update UI based on current time
  const remaining = state.endAt ? Math.max(0, state.endAt - Date.now()) : 0;
  if (remaining !== state.remainingMs) {
    setState(s => ({ ...s, remainingMs: remaining }));
  }
});
```

---

## Cross-Tab Synchronization

Pattern for syncing timer state across multiple browser tabs:

```typescript
// src/hooks/useStorageSync.ts
export function useStorageSync<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update local state AND localStorage
  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (err) {
      console.error(`Failed to save ${key}:`, err);
    }
  }, [key]);

  // Listen for changes from other tabs
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === key && event.newValue) {
        try {
          setValue(JSON.parse(event.newValue) as T);
        } catch {
          console.error(`Failed to parse storage event for ${key}`);
        }
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, updateValue] as const;
}

// Usage in timer component
const [state, setState] = useStorageSync<CountdownState>('sc.v1.countdown', defaultState);
```

---

## Adding a New Timer Component

### Step 1: Create Component File

```typescript
// src/pages/NewTimer.tsx
import React, { useState, useEffect } from 'react';

const LS_KEY = 'sc.v1.new-timer';

interface NewTimerState {
  version: 1;
  // ... your state fields
}

function load(): NewTimerState {
  // Load from localStorage
}

function save(state: NewTimerState) {
  // Save to localStorage
}

export default function NewTimer() {
  const [state, setState] = useState<NewTimerState>(load);

  useEffect(() => {
    const timer = setTimeout(() => save(state), 150);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <div className="new-timer-wrap">
      <a href="#/" className="btn-home">Home</a>
      <h2>New Timer</h2>
      {/* Your UI here */}
    </div>
  );
}
```

### Step 2: Add Route in main.tsx

```typescript
import NewTimer from './pages/NewTimer';

function App() {
  const route = useHashRoute();
  // ...
  if (route === '/new-timer') return <NewTimer />;
  // ...
}
```

### Step 3: Add to Home Grid

```typescript
function Home() {
  const items: Array<[string, string, string, string, string]> = [
    // ...
    ['#/new-timer', 'New Timer', '/icons/NEW_TIMER_ICON.png', '/icons/NEW_TIMER_BUTTON.png', '#color'],
  ];
  // ...
}
```

### Step 4: Add E2E Tests

```typescript
// tests/e2e/XX-new-timer.spec.ts
import { test, expect } from '@playwright/test';

test.describe('New Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and function correctly', async ({ page }) => {
    await page.goto('/#/new-timer');
    await expect(page.locator('.new-timer-wrap')).toBeVisible();
    // ... your test assertions
  });
});
```

---

## Debugging Tips

### 1. Inspect localStorage

```javascript
// Open browser console (F12)

// View all Stoppclock keys
Object.keys(localStorage).filter(k => k.startsWith('sc.v1.'))

// Inspect specific timer state
JSON.parse(localStorage.getItem('sc.v1.countdown'))

// Clear specific timer state
localStorage.removeItem('sc.v1.countdown')

// Clear all Stoppclock data
Object.keys(localStorage)
  .filter(k => k.startsWith('sc.v1.'))
  .forEach(k => localStorage.removeItem(k))
```

### 2. Service Worker Debugging

```javascript
// Check Service Worker status
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW state:', reg?.active?.state);
  console.log('SW version:', reg?.active?.scriptURL);
});

// Unregister Service Worker
navigator.serviceWorker.getRegistration().then(reg => reg?.unregister());

// Force Service Worker update
navigator.serviceWorker.getRegistration().then(reg => reg?.update());
```

Chrome DevTools: Application tab → Service Workers → Check "Update on reload"

### 3. Cross-Tab Sync Testing

1. Open timer in Tab A: `http://localhost:5173/#/countdown`
2. Open same timer in Tab B: `http://localhost:5173/#/countdown`
3. Start timer in Tab A → verify Tab B updates within 500ms
4. Monitor `storage` events in console:

```javascript
window.addEventListener('storage', (e) => {
  console.log('Storage event:', e.key, e.newValue);
});
```

### 4. Playwright Test Debugging

```bash
# Run single test in debug mode
npm run test:e2e -- --debug tests/e2e/02-countdown.spec.ts

# Open Playwright Inspector
npm run test:e2e -- --headed --slowMo=1000

# Generate trace for failed tests
npm run test:e2e -- --trace=on
npx playwright show-trace trace.zip
```

---

## Common Patterns

### 1. Keyboard Shortcuts

```typescript
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    // Skip if typing in input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      toggleStartPause();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [/* dependencies */]);
```

### 2. Signal Functions (beep, flash)

```typescript
// Already implemented in src/utils.ts
import { beep, flash } from '../utils';

// Play 200ms beep at 880 Hz
beep(200, 880);

// Flash element for 400ms
flash(elementRef.current, 400);
```

### 3. Time Formatting

```typescript
function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
```

---

## Performance Targets

When implementing features, ensure these metrics are met:

- **Keyboard Response**: <100ms latency (measure with `performance.now()`)
- **Metronome Accuracy**: ±2% BPM over 5 minutes (use Web Audio API scheduling)
- **Analog Clock FPS**: 30+ FPS (use `requestAnimationFrame`, monitor DevTools Performance tab)
- **Theme Toggle**: <200ms to apply (measure with Performance API)
- **Cross-Tab Sync**: <500ms propagation (test with `storage` event timestamps)
- **Bundle Size**: <180kB gzipped (check `npm run build` output)

---

## Resources

- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **React Hooks**: https://react.dev/reference/react
- **Vite Guide**: https://vitejs.dev/guide/
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Intl.DateTimeFormat**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
- **Service Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

## Getting Help

- **GitHub Issues**: https://github.com/DYAI2025/Stoppclock-page/issues
- **Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Data Models**: [data-model.md](./data-model.md)
- **Research**: [research.md](./research.md)
- **JSON Schemas**: [contracts/](./contracts/)

---

## Next Steps

1. Read [spec.md](./spec.md) for feature requirements
2. Review [plan.md](./plan.md) for implementation approach
3. Study [data-model.md](./data-model.md) for state schemas
4. Check [research.md](./research.md) for technical patterns
5. Run `/speckit.tasks` to generate task breakdown
6. Start implementing P0 bugs first (Countdown keyboard shortcuts)
7. Add E2E tests for each completed feature
8. Monitor bundle size and performance metrics

Good luck! 🚀
