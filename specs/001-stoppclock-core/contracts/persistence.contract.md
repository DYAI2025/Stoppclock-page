# Persistence Contract

**Version**: 1.0.0
**Date**: 2025-10-18
**Purpose**: Define the interface for localStorage-based state persistence

## Overview

The Stoppclock application persists timer state to browser `localStorage` to survive navigation and browser restarts. This contract defines the API surface for loading and saving state.

---

## Storage Keys

### Namespace Convention
All localStorage keys MUST use the `sc.v1.*` namespace to avoid conflicts with other applications.

### Key Patterns

| Entity | Key Pattern | Example |
|--------|-------------|---------|
| Timer State | `sc.v1.<tool-name>` | `sc.v1.analog` |
| User Consent | `sc.adsConsent` | `sc.adsConsent` |

**Tool Names**: `analog`, `stopwatch`, `countdown`, `digital`, `world`, `alarm`, `metronome`, `chess`

---

## API Specification

### `loadTimerState(key: string): TimerState | null`

Loads timer state from localStorage.

**Parameters**:
- `key` (string): Storage key (e.g., `"sc.v1.analog"`)

**Returns**:
- `TimerState | null`: Parsed and validated state, or `null` if not found or invalid

**Behavior**:
1. Read raw string from `localStorage.getItem(key)`
2. If `null`, return `null`
3. Parse JSON string
4. Validate against `TimerState` schema
5. If valid, return parsed state
6. If invalid, return `null` (corrupted data)

**Error Handling**:
- **QuotaExceededError**: Cannot occur on read (no-op)
- **SecurityError**: Return `null` (localStorage disabled)
- **SyntaxError**: Return `null` (JSON parse failed)

**Example**:
```typescript
const state = loadTimerState('sc.v1.analog');
if (state === null) {
  // Use default state
  setState(DEFAULT_STATE);
} else {
  setState(state);
}
```

---

### `saveTimerState(key: string, state: TimerState): void`

Saves timer state to localStorage.

**Parameters**:
- `key` (string): Storage key (e.g., `"sc.v1.analog"`)
- `state` (TimerState): State object to persist

**Returns**: `void`

**Behavior**:
1. Validate `state` against schema (optional, for safety)
2. Serialize to JSON: `JSON.stringify(state)`
3. Write to localStorage: `localStorage.setItem(key, json)`

**Error Handling**:
- **QuotaExceededError**: Log warning, silently fail (app continues, state not persisted)
- **SecurityError**: Log warning, silently fail (localStorage disabled)

**Debouncing**:
- MUST NOT call `saveTimerState` on every state change (causes performance issues)
- MUST debounce writes with 150ms delay (React `useEffect` + `setTimeout`)

**Example**:
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    saveTimerState('sc.v1.analog', state);
  }, 150);
  return () => clearTimeout(timer);
}, [state]);
```

---

### `loadUserConsent(): "yes" | "no" | null`

Loads ad consent preference from localStorage.

**Parameters**: None

**Returns**:
- `"yes"` if user accepted ads
- `"no"` if user declined ads
- `null` if no preference set (first visit)

**Behavior**:
1. Read `localStorage.getItem('sc.adsConsent')`
2. Return value as-is (plain string, not JSON)

**Error Handling**:
- **SecurityError**: Return `null` (localStorage disabled)

**Example**:
```javascript
const consent = loadUserConsent();
if (consent === "yes") {
  loadAdSense();
}
```

---

### `saveUserConsent(status: "yes" | "no"): void`

Saves ad consent preference to localStorage.

**Parameters**:
- `status` (`"yes" | "no"`): User's consent choice

**Returns**: `void`

**Behavior**:
1. Write `localStorage.setItem('sc.adsConsent', status)`
2. No JSON serialization (plain string)

**Error Handling**:
- **QuotaExceededError**: Log warning, silently fail
- **SecurityError**: Log warning, silently fail

**Example**:
```javascript
function handleAccept() {
  saveUserConsent("yes");
  loadAdSense();
}
```

---

## Validation Rules

### TimerState Validation

Before persisting, state SHOULD be validated (optional safety check):

```typescript
function validateTimerState(state: TimerState): boolean {
  return (
    state.version === 1 &&
    state.durationMs >= 1000 &&
    state.durationMs <= 43200000 &&
    state.remainingMs >= 0 &&
    state.remainingMs <= state.durationMs &&
    (state.running ? state.endAt !== null && state.endAt > Date.now() : state.endAt === null) &&
    [null, 60000, 300000, 600000].includes(state.warnAtMs) &&
    typeof state.signal.sound === 'boolean' &&
    typeof state.signal.flash === 'boolean'
  );
}
```

On load, if validation fails → return `null` (use default state).

---

## Storage Quota

### Expected Usage

| Entity | Size | Count | Total |
|--------|------|-------|-------|
| TimerState | ~180 bytes | 8 | ~1.4 KB |
| UserConsent | ~15 bytes | 1 | ~15 bytes |
| **Total** | | | **~1.5 KB** |

### Quota Limits

- **Typical localStorage quota**: 5-10 MB
- **Usage percentage**: 0.015-0.03% of minimum quota
- **Risk level**: Negligible (quota exceeded extremely unlikely)

### Graceful Degradation

If localStorage is unavailable or quota exceeded:
- App MUST continue to function normally
- State MUST be maintained in-memory (React state)
- State persistence MUST silently fail (no user-facing errors)
- Tools remain fully usable, just don't survive page refresh

---

## Concurrency

### Multiple Tabs

- **localStorage is synchronous**: No race conditions within single tab
- **Cross-tab conflicts**: Possible if user opens same tool in multiple tabs
  - Each tab has independent React state
  - Last write wins (no conflict resolution)
  - Acceptable tradeoff: Multi-tab usage is rare for timer app

### Storage Events

- `storage` event fires when localStorage changes in *other* tabs
- Stoppclock does NOT listen to storage events (each tab is independent)
- Future enhancement: Sync state across tabs via storage event listener

---

## Migration Strategy

### Schema Version

`TimerState.version` field enables future schema migrations:

```typescript
function loadTimerState(key: string): TimerState | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const parsed = JSON.parse(raw);

  // Future: Handle version migrations
  if (parsed.version === 0) {
    // Migrate v0 → v1
    return migrateV0ToV1(parsed);
  }

  if (parsed.version === 1) {
    return validateTimerState(parsed) ? parsed : null;
  }

  // Unknown version → discard
  return null;
}
```

Currently, only `version: 1` exists. Future versions would add migration logic here.

---

## Implementation Checklist

- [x] Define storage key namespace (`sc.v1.*`)
- [x] Implement `loadTimerState` with error handling
- [x] Implement `saveTimerState` with debouncing
- [x] Implement `loadUserConsent` for ad preference
- [x] Implement `saveUserConsent` for ad preference
- [x] Add validation before save (optional)
- [x] Add validation after load (required)
- [x] Graceful degradation when localStorage unavailable
- [ ] Storage event listener for cross-tab sync (future enhancement)
- [ ] Migration logic for schema v2 (future, when needed)

---

## References

- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Storage events: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
- JSON Schema: [timer-state.schema.json](./timer-state.schema.json)
