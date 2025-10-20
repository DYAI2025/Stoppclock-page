# Phase 1: Data Models

**Feature**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Created**: 2025-10-20

This document defines the data models and state schemas for all timer components, user preferences, and cross-cutting concerns.

---

## 1. Common Timer State Model

**Purpose**: Shared state structure used by all countdown-style timers (Countdown, Cycle Timer, Analog Countdown).

### TypeScript Interface

```typescript
interface CommonTimerState {
  version: 1;                    // Schema version for migrations
  running: boolean;              // Is timer currently running?
  remainingMs: number;           // Time remaining (ms) when paused
  durationMs: number;            // Total duration (ms) - reset value
  endAt: number | null;          // Unix timestamp when timer expires (null if not running)
  signal: {
    sound: boolean;              // Play sound on completion?
    flash: boolean;              // Flash screen on completion?
  };
  warnAt: number;                // Warning threshold (ms) - trigger signals early
}
```

### localStorage Contract

**Key Pattern**: `sc.v1.{timer-name}`

**Example**: `sc.v1.countdown`

```json
{
  "version": 1,
  "running": true,
  "remainingMs": 180000,
  "durationMs": 300000,
  "endAt": 1729450823456,
  "signal": {
    "sound": true,
    "flash": true
  },
  "warnAt": 60000
}
```

### State Transitions

1. **Start**: `running: true`, `endAt: Date.now() + remainingMs`
2. **Pause**: `running: false`, `remainingMs: endAt - Date.now()`, `endAt: null`
3. **Reset**: `running: false`, `remainingMs: durationMs`, `endAt: null`
4. **Complete**: Trigger signals, then auto-reset (or auto-restart for Cycle Timer)

### Persistence Strategy

- **Write Trigger**: Debounced 150ms after any state change
- **Read Trigger**: Component mount
- **Sync Pattern**: StorageEvent listener for cross-tab updates

### Full Contract

See [contracts/timer-state.json](./contracts/timer-state.json)

---

## 2. Stopwatch State Model

**Purpose**: Elapsed time tracking with lap times.

### TypeScript Interface

```typescript
interface StopwatchState {
  version: 1;
  running: boolean;              // Is stopwatch currently running?
  elapsedMs: number;             // Total elapsed time (ms)
  startedAt: number | null;      // Unix timestamp when last started (null if stopped)
  lapTimes: Array<{
    lapNumber: number;           // Lap sequence number (1, 2, 3...)
    lapTimeMs: number;           // Time for this lap only
    totalTimeMs: number;         // Total elapsed time at lap
    timestamp: number;           // Unix timestamp when lap was recorded
  }>;
}
```

### localStorage Contract

**Key**: `sc.v1.stopwatch`

```json
{
  "version": 1,
  "running": true,
  "elapsedMs": 125340,
  "startedAt": 1729450700000,
  "lapTimes": [
    {
      "lapNumber": 1,
      "lapTimeMs": 62450,
      "totalTimeMs": 62450,
      "timestamp": 1729450762450
    },
    {
      "lapNumber": 2,
      "lapTimeMs": 58120,
      "totalTimeMs": 120570,
      "timestamp": 1729450820570
    }
  ]
}
```

### Elapsed Time Calculation

**Pattern**: Account for time spent on other pages (fixes P1 bug)

```typescript
function calculateElapsedMs(state: StopwatchState): number {
  if (!state.running || !state.startedAt) {
    return state.elapsedMs;
  }

  // Running: add time since startedAt to previous elapsedMs
  const timeSinceStart = Date.now() - state.startedAt;
  return state.elapsedMs + timeSinceStart;
}
```

### State Transitions

1. **Start**: `running: true`, `startedAt: Date.now()`
2. **Pause**: `running: false`, `elapsedMs: calculateElapsedMs()`, `startedAt: null`
3. **Reset**: `running: false`, `elapsedMs: 0`, `startedAt: null`, `lapTimes: []`
4. **Lap**: Push new entry to `lapTimes` array

### Full Contract

See [contracts/stopwatch.json](./contracts/stopwatch.json)

---

## 3. Cycle Timer State Model

**Purpose**: Auto-restarting countdown timer with cycle tracking.

### TypeScript Interface

```typescript
interface CycleTimerState {
  version: 1;
  intervalMs: number;            // Duration of each cycle (ms)
  remainingMs: number;           // Time remaining in current cycle (ms)
  running: boolean;              // Is timer currently running?
  endAt: number | null;          // Unix timestamp when current cycle expires
  cycleCount: number;            // Number of completed cycles (increments on each restart)
  signal: {
    sound: boolean;
    flash: boolean;
  };
}
```

### localStorage Contract

**Key**: `sc.v1.cycle`

```json
{
  "version": 1,
  "intervalMs": 60000,
  "remainingMs": 42350,
  "running": true,
  "endAt": 1729450865350,
  "cycleCount": 12,
  "signal": {
    "sound": true,
    "flash": true
  }
}
```

### Auto-Restart Logic

```typescript
// When timer reaches 0:
if (remainingMs === 0) {
  // Trigger signals
  if (signal.flash) flash();
  if (signal.sound) beep();

  // Immediately restart with new cycle
  setState({
    ...state,
    remainingMs: intervalMs,
    endAt: Date.now() + intervalMs,
    cycleCount: cycleCount + 1
  });
}
```

### Full Contract

See [contracts/cycle-timer.json](./contracts/cycle-timer.json)

---

## 4. World Clock State Model

**Purpose**: Display multiple timezones simultaneously.

### TypeScript Interface

```typescript
interface TimeZoneEntry {
  id: string;                    // Unique ID (IANA timezone name)
  city: string;                  // Display name (e.g., "New York")
  zone: string;                  // IANA timezone (e.g., "America/New_York")
  country: string;               // Country name (e.g., "USA")
  utcOffset: string;             // Current UTC offset (e.g., "UTC-5") - updated for DST
}

interface WorldClockState {
  version: 1;
  selectedZones: TimeZoneEntry[]; // User-selected timezones (max 6)
}
```

### localStorage Contract

**Key**: `sc.v1.world-clock`

```json
{
  "version": 1,
  "selectedZones": [
    {
      "id": "America/New_York",
      "city": "New York",
      "zone": "America/New_York",
      "country": "USA",
      "utcOffset": "UTC-5"
    },
    {
      "id": "Europe/London",
      "city": "London",
      "zone": "Europe/London",
      "country": "UK",
      "utcOffset": "UTC+0"
    },
    {
      "id": "Asia/Tokyo",
      "city": "Tokyo",
      "zone": "Asia/Tokyo",
      "country": "Japan",
      "utcOffset": "UTC+9"
    }
  ]
}
```

### Default State

On first load, include user's local timezone:

```typescript
const defaultZone: TimeZoneEntry = {
  id: Intl.DateTimeFormat().resolvedOptions().timeZone,
  city: 'Local Time',
  zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  country: 'Your Location',
  utcOffset: getUTCOffset(Intl.DateTimeFormat().resolvedOptions().timeZone)
};
```

### Current Time Calculation

```typescript
function getCurrentTime(zone: TimeZoneEntry): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: zone.zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}
```

### Full Contract

See [contracts/world-clock.json](./contracts/world-clock.json)

---

## 5. Alarm Clock State Model

**Purpose**: Single alarm with time-of-day trigger.

### TypeScript Interface

```typescript
interface AlarmState {
  version: 1;
  active: boolean;               // Is alarm currently set?
  targetTime: {
    hour: number;                // 0-23
    minute: number;              // 0-59
  };
  nextTriggerAt: number | null;  // Unix timestamp of next alarm trigger (null if not active)
  ringing: boolean;              // Is alarm currently ringing?
  signal: {
    sound: boolean;
    flash: boolean;
  };
}
```

### localStorage Contract

**Key**: `sc.v1.alarm`

```json
{
  "version": 1,
  "active": true,
  "targetTime": {
    "hour": 9,
    "minute": 0
  },
  "nextTriggerAt": 1729501200000,
  "ringing": false,
  "signal": {
    "sound": true,
    "flash": true
  }
}
```

### Next Occurrence Calculation (FR-016)

```typescript
function calculateNextTrigger(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  // If target time has passed today, schedule for tomorrow
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}
```

### State Transitions

1. **Set Alarm**: `active: true`, `nextTriggerAt: calculateNextTrigger(hour, minute)`
2. **Trigger**: `ringing: true`, play sound/flash
3. **Stop**: `ringing: false`, `active: false`, `nextTriggerAt: null`

### Full Contract

See [contracts/alarm.json](./contracts/alarm.json)

---

## 6. Metronome State Model

**Purpose**: Precise tempo tracking with beat visualization.

### TypeScript Interface

```typescript
interface MetronomeState {
  version: 1;
  bpm: number;                   // Beats per minute (40-240)
  running: boolean;              // Is metronome currently playing?
  timeSignature: {
    beatsPerMeasure: number;     // Numerator (e.g., 4 in 4/4)
    beatValue: number;           // Denominator (e.g., 4 in 4/4)
  };
  currentBeat: number;           // Current beat in measure (1-based, 1 to beatsPerMeasure)
  accentFirstBeat: boolean;      // Play louder click on first beat?
}
```

### localStorage Contract

**Key**: `sc.v1.metronome`

```json
{
  "version": 1,
  "bpm": 120,
  "running": false,
  "timeSignature": {
    "beatsPerMeasure": 4,
    "beatValue": 4
  },
  "currentBeat": 1,
  "accentFirstBeat": true
}
```

### Beat Interval Calculation

```typescript
const intervalMs = 60000 / bpm; // e.g., 120 BPM = 500ms per beat
```

### Accent Beat Logic

```typescript
function playBeat(beatNumber: number, accentFirstBeat: boolean) {
  const frequency = (beatNumber === 1 && accentFirstBeat) ? 1000 : 880;
  const volume = (beatNumber === 1 && accentFirstBeat) ? 0.5 : 0.3;
  playClick(frequency, volume, 0.1); // Play 100ms click
}
```

### Full Contract

See [contracts/metronome.json](./contracts/metronome.json)

---

## 7. Chess Clock State Model

**Purpose**: Dual-player countdown timer with increment/delay support.

### TypeScript Interface

```typescript
interface ChessClockState {
  version: 1;
  players: {
    player1: {
      remainingMs: number;       // Time remaining for Player 1 (ms)
      moveCount: number;         // Number of moves made by Player 1
    };
    player2: {
      remainingMs: number;       // Time remaining for Player 2 (ms)
      moveCount: number;         // Number of moves made by Player 2
    };
  };
  activePlayer: 1 | 2 | null;   // Which player's clock is running (null if stopped)
  running: boolean;              // Is any clock running?
  endAt: number | null;          // Unix timestamp when active player's clock expires
  mode: {
    type: 'simple' | 'fischer' | 'bronstein';
    incrementMs: number;         // Fischer: add N ms after each move
    delayMs: number;             // Bronstein: pause N ms before decrementing
  };
  timeExpired: 1 | 2 | null;     // Which player ran out of time (null if game ongoing)
}
```

### localStorage Contract

**Key**: `sc.v1.chess-clock`

```json
{
  "version": 1,
  "players": {
    "player1": {
      "remainingMs": 600000,
      "moveCount": 12
    },
    "player2": {
      "remainingMs": 540000,
      "moveCount": 11
    }
  },
  "activePlayer": 1,
  "running": true,
  "endAt": 1729451423000,
  "mode": {
    "type": "fischer",
    "incrementMs": 10000,
    "delayMs": 0
  },
  "timeExpired": null
}
```

### Player Switch Logic (FR-031)

```typescript
function switchPlayer(currentPlayer: 1 | 2, state: ChessClockState): ChessClockState {
  const remainingMs = state.endAt ? Math.max(0, state.endAt - Date.now()) : 0;

  // Update current player's time
  const updatedPlayers = {
    ...state.players,
    [`player${currentPlayer}`]: {
      ...state.players[`player${currentPlayer}`],
      remainingMs,
      moveCount: state.players[`player${currentPlayer}`].moveCount + 1
    }
  };

  // Apply Fischer increment
  if (state.mode.type === 'fischer') {
    updatedPlayers[`player${currentPlayer}`].remainingMs += state.mode.incrementMs;
  }

  const nextPlayer = currentPlayer === 1 ? 2 : 1;

  return {
    ...state,
    players: updatedPlayers,
    activePlayer: nextPlayer,
    endAt: Date.now() + updatedPlayers[`player${nextPlayer}`].remainingMs
  };
}
```

### Full Contract

See [contracts/chess-clock.json](./contracts/chess-clock.json)

---

## 8. User Preferences Model

**Purpose**: Global settings persisted across all timer pages.

### TypeScript Interface

```typescript
interface UserPreferences {
  version: 1;
  theme: 'light' | 'dark' | 'auto';  // Theme preference
  defaultSignals: {
    sound: boolean;                   // Default sound setting for new timers
    flash: boolean;                   // Default flash setting for new timers
  };
  keyboardShortcutsEnabled: boolean;  // Global toggle for keyboard shortcuts
}
```

### localStorage Contract

**Key**: `sc.v1.preferences`

```json
{
  "version": 1,
  "theme": "auto",
  "defaultSignals": {
    "sound": true,
    "flash": true
  },
  "keyboardShortcutsEnabled": true
}
```

### Theme Application Logic

```typescript
function applyTheme(theme: 'light' | 'dark' | 'auto') {
  let effectiveTheme = theme;

  if (theme === 'auto') {
    // Detect system preference
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', effectiveTheme);
}
```

### Full Contract

See [contracts/preferences.json](./contracts/preferences.json)

---

## 9. Cross-Tab Sync Event Payload

**Purpose**: StorageEvent payload structure for real-time state synchronization.

### TypeScript Interface

```typescript
interface StorageSyncEvent {
  key: string;                   // localStorage key (e.g., "sc.v1.countdown")
  newValue: string | null;       // New JSON string value (null if deleted)
  oldValue: string | null;       // Previous JSON string value (null if new)
  url: string;                   // URL of page that made the change
  storageArea: Storage;          // Reference to localStorage
}
```

### Event Handling Pattern

```typescript
useEffect(() => {
  function handleStorageChange(event: StorageEvent) {
    // Only process events for our namespace
    if (!event.key?.startsWith('sc.v1.')) return;

    // Parse new value
    if (event.newValue) {
      const newState = JSON.parse(event.newValue);
      setState(newState); // Update local state
    }
  }

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## 10. Migration Strategy

### Version Field

All state models include `version: 1` field for future schema migrations.

### Migration Pattern

```typescript
function migrateState<T>(stored: any, currentVersion: number, migrations: Map<number, (state: any) => any>): T {
  let state = stored;
  let version = state.version || 0;

  while (version < currentVersion) {
    const migration = migrations.get(version + 1);
    if (!migration) break;
    state = migration(state);
    version++;
  }

  return state;
}

// Example migration (version 1 → 2)
const countdownMigrations = new Map([
  [2, (state) => ({
    ...state,
    version: 2,
    newField: 'default-value' // Add new field
  })]
]);
```

### Backward Compatibility

- Always provide default values for missing fields
- Never delete existing fields (deprecate instead)
- Use feature detection before accessing new fields

---

## Summary

All data models defined with:
- ✅ TypeScript interfaces for type safety
- ✅ localStorage contracts (JSON schemas)
- ✅ Version fields for migrations
- ✅ State transition logic
- ✅ Default values and validation rules
- ✅ Cross-tab sync patterns
- ✅ Calculation formulas (elapsed time, next occurrence, intervals)

**Total Models**: 8 timer states + 1 preferences + 1 sync event = 10 data models

**Total localStorage Keys**: 9 (`sc.v1.*` namespace)

**Next Step**: Create JSON schema contracts in `contracts/` directory
