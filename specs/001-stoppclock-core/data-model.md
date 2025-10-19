# Data Model: Stoppclock Core Application

**Branch**: `001-stoppclock-core` | **Date**: 2025-10-18
**Phase**: 1 - Data Model & Entity Design

## Purpose

This document defines all data entities, their schemas, validation rules, and state transitions for the Stoppclock application. Since this is a fully client-side application, all entities are stored in browser localStorage and managed via React state.

---

## Entity 1: Timer State

### Description
Represents the complete state of any countdown/stopwatch timer tool. Persisted to localStorage to survive navigation and browser restarts.

### Schema

```typescript
interface TimerState {
  version: 1;                    // Schema version for future migrations
  durationMs: number;            // Configured duration in milliseconds
  remainingMs: number;           // Current remaining time in milliseconds
  running: boolean;              // Is timer actively counting
  endAt: number | null;          // Unix timestamp when timer completes (null if paused)
  warnAtMs: number | null;       // Warning threshold in ms (null = disabled)
  signal: SignalPreferences;     // Alert preferences
}

interface SignalPreferences {
  sound: boolean;                // Enable audio beep
  flash: boolean;                // Enable visual flash
}
```

### Field Constraints

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| `version` | `number` | Must equal `1` | `1` |
| `durationMs` | `number` | `1000 <= x <= 43200000` (1s to 12h) | `1800000` (30 min) |
| `remainingMs` | `number` | `0 <= x <= durationMs` | `durationMs` |
| `running` | `boolean` | `true` or `false` | `false` |
| `endAt` | `number \| null` | Unix timestamp (ms) > `Date.now()` if running, else `null` | `null` |
| `warnAtMs` | `number \| null` | `60000`, `300000`, `600000`, or `null` | `60000` (1 min) |
| `signal.sound` | `boolean` | `true` or `false` | `true` |
| `signal.flash` | `boolean` | `true` or `false` | `true` |

### Validation Rules

```typescript
function validateTimerState(state: TimerState): boolean {
  // Version check
  if (state.version !== 1) return false;

  // Duration bounds
  if (state.durationMs < 1000 || state.durationMs > 43200000) return false;

  // Remaining must not exceed duration
  if (state.remainingMs < 0 || state.remainingMs > state.durationMs) return false;

  // endAt must be future timestamp if running
  if (state.running && state.endAt && state.endAt <= Date.now()) return false;

  // endAt must be null if not running
  if (!state.running && state.endAt !== null) return false;

  // warnAtMs must be valid threshold or null
  const validThresholds = [null, 60000, 300000, 600000];
  if (!validThresholds.includes(state.warnAtMs)) return false;

  return true;
}
```

### State Transitions

```
[Stopped] ──(Start)──> [Running]
    ↑                      │
    │                      │
(Reset/Complete)      (Pause)
    │                      │
    │                      ↓
    └────────────────  [Paused]
                           │
                       (Resume)
                           │
                           ↓
                      [Running]
```

#### Transition: Start (from Stopped)
- **Precondition**: `running === false`, `remainingMs === durationMs`
- **Action**: `running = true`, `endAt = Date.now() + durationMs`
- **Effect**: Timer begins countdown from full duration

#### Transition: Resume (from Paused)
- **Precondition**: `running === false`, `0 < remainingMs < durationMs`
- **Action**: `running = true`, `endAt = Date.now() + remainingMs`
- **Effect**: Timer resumes from paused time

#### Transition: Pause (from Running)
- **Precondition**: `running === true`, `remainingMs > 0`
- **Action**: `running = false`, `endAt = null`, `remainingMs = Math.max(0, endAt - Date.now())`
- **Effect**: Timer freezes at current remaining time

#### Transition: Reset (from any state)
- **Precondition**: Any state
- **Action**: `running = false`, `endAt = null`, `remainingMs = durationMs`
- **Effect**: Timer returns to initial configured duration

#### Transition: Complete (automatic)
- **Precondition**: `running === true`, `remainingMs <= 0`
- **Action**: `running = false`, `endAt = null`, `remainingMs = 0`, trigger signals
- **Effect**: Timer stops at zero, alerts play

### Persistence

- **Storage Key Pattern**: `sc.v1.<tool-name>` (e.g., `sc.v1.analog`, `sc.v1.stopwatch`)
- **Write Trigger**: Debounced write on state change (150ms delay)
- **Read Trigger**: Component mount (initial load)
- **Error Handling**: Graceful degradation - if load fails, use default state

```typescript
const STORAGE_KEY = 'sc.v1.analog';

// Load on mount
const [state, setState] = useState<TimerState>(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as TimerState;
    return validateTimerState(parsed) ? parsed : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
});

// Save on change (debounced)
useEffect(() => {
  const timer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn(`[Persistence] Save failed:`, error);
    }
  }, 150);
  return () => clearTimeout(timer);
}, [state]);
```

### Example Instances

**Initial state (30-minute timer, not started)**:
```json
{
  "version": 1,
  "durationMs": 1800000,
  "remainingMs": 1800000,
  "running": false,
  "endAt": null,
  "warnAtMs": 60000,
  "signal": {"sound": true, "flash": true}
}
```

**Running state (90-minute exam timer, 45 minutes remaining)**:
```json
{
  "version": 1,
  "durationMs": 5400000,
  "remainingMs": 2700000,
  "running": true,
  "endAt": 1729261092847,
  "warnAtMs": 300000,
  "signal": {"sound": true, "flash": false}
}
```

---

## Entity 2: Preset

### Description
Represents a quick-selection duration option for timer configuration. Presets are hardcoded (not user-configurable in initial version).

### Schema

```typescript
interface Preset {
  minutes: number;   // Duration in minutes
  label: string;     // Display label (e.g., "30m", "2h")
}
```

### Field Constraints

| Field | Type | Constraints | Example |
|-------|------|-------------|---------|
| `minutes` | `number` | `minutes > 0` | `90` |
| `label` | `string` | Non-empty, generated from minutes | `"90m"` or `"2h"` |

### Hardcoded List

```typescript
const PRESETS: Preset[] = [
  { minutes: 5,   label: "5m" },
  { minutes: 10,  label: "10m" },
  { minutes: 15,  label: "15m" },
  { minutes: 30,  label: "30m" },
  { minutes: 45,  label: "45m" },
  { minutes: 60,  label: "1h" },
  { minutes: 90,  label: "90m" },
  { minutes: 120, label: "2h" },
  { minutes: 180, label: "3h" },
  { minutes: 240, label: "4h" },
  { minutes: 360, label: "6h" },
  { minutes: 480, label: "8h" },
  { minutes: 720, label: "12h" },
];
```

### Label Generation

```typescript
function formatPresetLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  return hours === Math.floor(hours) ? `${hours}h` : `${minutes}m`;
}
```

### Persistence

- **Not persisted**: Presets are constants in source code
- **Last used duration**: Persisted via `TimerState.durationMs`

---

## Entity 3: User Consent

### Description
Stores user's ad consent preference for privacy-first ad loading.

### Schema

```typescript
type ConsentStatus = "yes" | "no" | null;

interface UserConsent {
  adsConsent: ConsentStatus;
}
```

### Field Constraints

| Field | Type | Constraints | Default |
|-------|------|-------------|---------|
| `adsConsent` | `"yes" \| "no" \| null` | Exactly one of three values | `null` |

### State Transitions

```
[No Preference (null)]
     │
     ├──(Accept)──> [Consented ("yes")]  → AdSense loads
     │
     └──(Decline)──> [Declined ("no")]   → AdSense blocked
```

- **null**: First visit, consent banner shown
- **"yes"**: User clicked "Enable Ads", AdSense loads immediately
- **"no"**: User clicked "Keep Off", AdSense never loads

### Persistence

- **Storage Key**: `sc.adsConsent`
- **Write Trigger**: Immediately on user action (Accept/Decline button click)
- **Read Trigger**: Page load (before React app init, in inline script)
- **Persistence Layer**: Plain string in localStorage (not JSON)

```javascript
// Inline in index.html (before React app loads)
const LS_KEY = "sc.adsConsent";
const consentStatus = localStorage.getItem(LS_KEY); // "yes" | "no" | null

if (consentStatus === "yes") {
  // Load AdSense immediately
  loadAdSense();
  hideConsentBanner();
} else if (consentStatus === "no") {
  // Hide banner, don't load AdSense
  hideConsentBanner();
} else {
  // Show consent banner (null = first visit)
  showConsentBanner();
}

function handleAccept() {
  localStorage.setItem(LS_KEY, "yes");
  loadAdSense();
  hideConsentBanner();
}

function handleDecline() {
  localStorage.setItem(LS_KEY, "no");
  hideConsentBanner();
}
```

---

## Entity 4: Tool Route

### Description
Represents a navigable timer/clock tool in the application. Routes are defined statically in the React router logic.

### Schema

```typescript
interface ToolRoute {
  hash: string;              // URL hash (e.g., "#/analog")
  label: string;             // Display name
  component: React.ComponentType; // React component to render
  implemented: boolean;      // Is component fully implemented?
}
```

### Field Constraints

| Field | Type | Constraints | Example |
|-------|------|-------------|---------|
| `hash` | `string` | Must start with `"#/"` | `"#/analog"` |
| `label` | `string` | Non-empty | `"Analog Countdown"` |
| `component` | `React.ComponentType` | Valid React component | `AnalogCountdown` |
| `implemented` | `boolean` | `true` if feature complete, `false` if placeholder | `true` |

### Hardcoded Routes

```typescript
const ROUTES: ToolRoute[] = [
  { hash: "#/analog",     label: "Analog Countdown", component: AnalogCountdown, implemented: true },
  { hash: "#/stopwatch",  label: "Stopwatch",        component: Placeholder,      implemented: false },
  { hash: "#/countdown",  label: "Countdown",        component: Placeholder,      implemented: false },
  { hash: "#/digital",    label: "Digital Clock",    component: Placeholder,      implemented: false },
  { hash: "#/world",      label: "World Clock",      component: Placeholder,      implemented: false },
  { hash: "#/alarm",      label: "Alarm",            component: Placeholder,      implemented: false },
  { hash: "#/metronome",  label: "Metronome",        component: Placeholder,      implemented: false },
  { hash: "#/chess",      label: "Chess Clock",      component: Placeholder,      implemented: false },
];
```

### Routing Logic

```typescript
function useHashRoute(): string {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const handleHashChange = () => forceUpdate();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (location.hash || "#/").replace(/^#/, "");
}

function App() {
  const route = useHashRoute();

  if (route === "/") return <Home />;

  const tool = ROUTES.find((r) => r.hash === "#" + route);
  return tool ? <tool.component /> : <NotFound />;
}
```

### Persistence

- **Not persisted**: Route state is in URL hash (browser history handles persistence)
- **Initial load**: `location.hash` determines starting route

---

## Entity 5: Structured Data

### Description
SEO and AI-SEO metadata embedded in HTML as JSON-LD. Not stored in localStorage, but included in data model for completeness.

### Schema

#### WebApplication Schema
```typescript
interface WebApplicationSchema {
  "@context": "https://schema.org";
  "@type": "WebApplication";
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  description: string;
  offers: {
    "@type": "Offer";
    price: string;
  };
  featureList: string[];
}
```

#### FAQPage Schema
```typescript
interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FAQItem[];
}

interface FAQItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}
```

### Persistence

- **Storage**: Embedded in `index.html` as `<script type="application/ld+json">`
- **Not dynamic**: Generated at build time, not runtime

### Example Instance (WebApplication)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Stoppclock",
  "applicationCategory": "Utility",
  "operatingSystem": "Web",
  "url": "https://www.stoppclock.com/",
  "description": "Projector-friendly timers and clocks",
  "offers": { "@type": "Offer", "price": "0" },
  "featureList": [
    "Analog countdown up to 12 hours",
    "Stopwatch with laps",
    "Offline PWA"
  ]
}
```

---

## Relationships

```
TimerState (1) ──has──> (1) SignalPreferences
                         ↑
                         │
                     (embedded)

Preset (many) ──generates──> TimerState.durationMs (1)
                               ↑
                               │
                          (on select)

ToolRoute (many) ──loads──> TimerState (1)
                             ↑
                             │
                       (via persistence key)

UserConsent (1) ──controls──> AdSense Loading (boolean)
```

**Key relationships**:
1. Each TimerState embeds one SignalPreferences
2. Preset selection updates TimerState.durationMs
3. Each ToolRoute has its own TimerState (separate localStorage keys)
4. UserConsent globally controls ad loading behavior

---

## Storage Budget Analysis

### Per-Entity Size

| Entity | Storage | Count | Total |
|--------|---------|-------|-------|
| TimerState (JSON) | ~180 bytes | 8 tools | ~1.4 KB |
| UserConsent | ~15 bytes | 1 | ~15 bytes |
| **TOTAL** | | | **~1.5 KB** |

### localStorage Quota

- **Typical quota**: 5-10 MB
- **Usage**: < 2 KB (0.02% of minimum quota)
- **Risk**: Negligible - quota exceeded extremely unlikely

---

## Validation Summary

All entities have:
- ✅ Well-defined TypeScript schemas
- ✅ Explicit field constraints (ranges, allowed values)
- ✅ Validation functions for runtime checks
- ✅ State transition diagrams (where applicable)
- ✅ Error handling strategies (graceful degradation)
- ✅ Persistence mechanisms documented

**Ready for Phase 1 Contracts**: Entity schemas can now be formalized into TypeScript interfaces and JSON schemas.
