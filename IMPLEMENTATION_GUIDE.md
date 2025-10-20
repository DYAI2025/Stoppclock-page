# Stoppclock Timer Audit & Improvements - Implementation Guide

**Feature**: 002-timer-audit-improvements
**Date**: 2025-10-20
**Status**: MVP Complete (Phases 1-3) - Remaining Phases Documented

---

## Executive Summary

This implementation guide provides step-by-step instructions for completing the remaining phases of the Stoppclock Timer Audit & Improvements feature. **Phases 1-3 (Tasks T001-T020) have been completed** and provide the foundational infrastructure needed for all remaining work.

### What's Been Completed (MVP)

✅ **Phase 1**: Shared Infrastructure (T001-T006)
- Custom hooks: `useStorageSync`, `useKeyboardShortcuts`, `useTheme`
- TypeScript types for all timer states
- Theme toggle and update notification components

✅ **Phase 2**: Foundational (T007-T013)
- Dark/light theme CSS with CSS variables
- Timezone utilities and 20-city database
- Enhanced .gitignore patterns

✅ **Phase 3**: US1 - Countdown Keyboard Fix (T014-T020)
- E2E tests for keyboard shortcuts
- Fixed keyboard shortcut behavior
- Input field detection to prevent shortcut conflicts

### What Remains (136 Tasks)

This guide covers Phases 4-15:
- **Phase 4**: US2 - World Clock Implementation (14 tasks)
- **Phase 5**: US3 - Alarm Clock Implementation (14 tasks)
- **Phase 6**: US4 - Metronome Implementation (14 tasks)
- **Phase 7**: US5 - Chess Clock Implementation (17 tasks)
- **Phases 8-14**: US6-US12 - Additional Features (67 tasks)
- **Phase 15**: Polish & Validation (10 tasks)

---

## Architectural Patterns Established

All new implementations should follow these patterns from Phases 1-3:

### 1. State Management Pattern

```typescript
// Use the useStorageSync hook for cross-tab synchronization
import { useStorageSync } from '../hooks/useStorageSync';
import { WorldClockState } from '../types/timer-types';

function WorldClock() {
  const [state, setState] = useStorageSync<WorldClockState>('sc.v1.worldclock', {
    version: 1,
    selectedZones: []
  });

  // State updates automatically sync across tabs and persist to localStorage
  const addZone = (zone: TimeZoneEntry) => {
    setState(prev => ({
      ...prev,
      selectedZones: [...prev.selectedZones, zone]
    }));
  };
}
```

### 2. Keyboard Shortcuts Pattern

```typescript
// Use the centralized useKeyboardShortcuts hook
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function MyTimer() {
  const [running, setRunning] = useState(false);

  useKeyboardShortcuts({
    onSpace: () => setRunning(r => !r),
    onReset: () => reset(),
    onFullscreen: () => toggleFullscreen(),
    // onLap is optional - only for Stopwatch
  }, true); // true = enabled

  // Component-specific shortcuts (like arrow keys) can use separate useEffect
}
```

### 3. Theme Support Pattern

```typescript
// All pages should support theming via CSS variables
// Styles automatically adapt based on [data-theme="light|dark"] attribute

// In your component CSS:
.my-component {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
}

.my-button-primary {
  background: var(--primary);
  color: white;
}

.my-warning {
  color: var(--warning);
}
```

### 4. Timer Update Loop Pattern

```typescript
// Use requestAnimationFrame for smooth updates (existing pattern from Countdown)
function useRaf(on: boolean, cb: () => void) {
  const raf = useRef<number | undefined>();
  useEffect(() => {
    if (!on) return;
    let live = true;
    const loop = () => {
      if (!live) return;
      cb();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      live = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [on, cb]);
}

// Use it for running timers:
useRaf(running, () => {
  // Update state based on current time
  const now = Date.now();
  // ... sync logic
});
```

### 5. Timestamp-based State Pattern

```typescript
// Store timestamps (endAt, nextTriggerAt) instead of remaining time
// This ensures accuracy across tab switches and page reloads

interface MyTimerState {
  running: boolean;
  endAt: number | null; // timestamp when timer ends
  durationMs: number;    // original duration
}

// When starting:
const start = () => {
  setState(s => ({
    ...s,
    running: true,
    endAt: Date.now() + s.durationMs
  }));
};

// When syncing:
const sync = () => {
  if (!state.running || !state.endAt) return;
  const remaining = Math.max(0, state.endAt - Date.now());
  // Update display with remaining time
};
```

---

## Phase 4: US2 - World Clock (T021-T034)

**Priority**: P0 (Placeholder component - no functionality)
**Effort**: XL (New component with complex timezone logic)
**Estimated Time**: 3-4 hours

### Overview

Implement a functional World Clock that displays multiple timezones simultaneously with search functionality and UTC offset display.

### Tasks Breakdown

#### T021-T023: Component Structure & E2E Tests

**File**: `tests/e2e/08-world-clock.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('World Clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
    await page.goto('/#/world');
  });

  test('should display default timezones', async ({ page }) => {
    // Should show at least 3 default timezones
    await expect(page.locator('.world-clock-zone')).toHaveCount(3, { timeout: 2000 });

    // Each zone should show city, time, and UTC offset
    const firstZone = page.locator('.world-clock-zone').first();
    await expect(firstZone.locator('.zone-city')).toBeVisible();
    await expect(firstZone.locator('.zone-time')).toBeVisible();
    await expect(firstZone.locator('.zone-offset')).toBeVisible();
  });

  test('should search and add new timezone', async ({ page }) => {
    // Open search/add dialog
    await page.getByRole('button', { name: /add/i }).click();

    // Search for Tokyo
    await page.locator('input[placeholder*="Search"]').fill('Tokyo');

    // Should show Tokyo in results
    await expect(page.locator('.search-result').filter({ hasText: 'Tokyo' })).toBeVisible();

    // Click to add Tokyo
    await page.locator('.search-result').filter({ hasText: 'Tokyo' }).click();

    // Should now show Tokyo in the list
    await expect(page.locator('.world-clock-zone').filter({ hasText: 'Tokyo' })).toBeVisible();
  });

  test('should remove timezone', async ({ page }) => {
    // Count initial zones
    const initialCount = await page.locator('.world-clock-zone').count();

    // Click remove on first zone
    await page.locator('.world-clock-zone').first().locator('button[aria-label*="Remove"]').click();

    // Should have one less zone
    await expect(page.locator('.world-clock-zone')).toHaveCount(initialCount - 1);
  });

  test('should update times every second', async ({ page }) => {
    const firstZone = page.locator('.world-clock-zone').first();
    const initialTime = await firstZone.locator('.zone-time').textContent();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    const updatedTime = await firstZone.locator('.zone-time').textContent();

    // Time should have changed
    expect(updatedTime).not.toBe(initialTime);
  });

  test('should persist selected timezones', async ({ page }) => {
    // Add Tokyo
    await page.getByRole('button', { name: /add/i }).click();
    await page.locator('input[placeholder*="Search"]').fill('Tokyo');
    await page.locator('.search-result').filter({ hasText: 'Tokyo' }).click();

    // Navigate away
    await page.goto('/#/');

    // Navigate back
    await page.goto('/#/world');

    // Tokyo should still be there
    await expect(page.locator('.world-clock-zone').filter({ hasText: 'Tokyo' })).toBeVisible();
  });
});
```

#### T024-T028: Core World Clock Implementation

**File**: `src/pages/WorldClock.tsx`

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useStorageSync } from '../hooks/useStorageSync';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { WorldClockState, TimeZoneEntry } from '../types/timer-types';
import {
  getUTCOffset,
  getCurrentTimeInTimezone,
  WORLD_CLOCK_CITIES,
  searchCities
} from '../utils';

const DEFAULT_ZONES: TimeZoneEntry[] = [
  { id: '1', city: 'New York', zone: 'America/New_York', country: 'USA', utcOffset: '' },
  { id: '2', city: 'London', zone: 'Europe/London', country: 'UK', utcOffset: '' },
  { id: '3', city: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan', utcOffset: '' },
];

export default function WorldClock() {
  const [state, setState] = useStorageSync<WorldClockState>('sc.v1.worldclock', {
    version: 1,
    selectedZones: DEFAULT_ZONES
  });

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTimes, setCurrentTimes] = useState<Map<string, string>>(new Map());
  const wrapRef = useRef<HTMLDivElement>(null);

  // Update UTC offsets on mount
  useEffect(() => {
    const zonesWithOffsets = state.selectedZones.map(zone => ({
      ...zone,
      utcOffset: getUTCOffset(zone.zone)
    }));

    if (JSON.stringify(zonesWithOffsets) !== JSON.stringify(state.selectedZones)) {
      setState({ ...state, selectedZones: zonesWithOffsets });
    }
  }, []);

  // Update times every second
  useEffect(() => {
    const updateTimes = () => {
      const newTimes = new Map<string, string>();
      state.selectedZones.forEach(zone => {
        newTimes.set(zone.id, getCurrentTimeInTimezone(zone.zone));
      });
      setCurrentTimes(newTimes);
    };

    updateTimes(); // Initial update
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [state.selectedZones]);

  const addZone = (city: typeof WORLD_CLOCK_CITIES[0]) => {
    const newZone: TimeZoneEntry = {
      id: Date.now().toString(),
      city: city.city,
      zone: city.zone,
      country: city.country,
      utcOffset: getUTCOffset(city.zone)
    };

    setState({
      ...state,
      selectedZones: [...state.selectedZones, newZone]
    });

    setShowSearch(false);
    setSearchQuery('');
  };

  const removeZone = (id: string) => {
    setState({
      ...state,
      selectedZones: state.selectedZones.filter(z => z.id !== id)
    });
  };

  const toggleFullscreen = () => {
    if (!wrapRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      wrapRef.current.requestFullscreen?.().catch(() => {});
    }
  };

  useKeyboardShortcuts({
    onFullscreen: toggleFullscreen,
  }, true);

  const searchResults = searchQuery.length > 0
    ? searchCities(searchQuery)
    : WORLD_CLOCK_CITIES.slice(0, 10);

  return (
    <div className="world-clock-wrap" ref={wrapRef}>
      <a href="#/" className="btn-home">Home</a>

      <div className="world-clock-header">
        <h1>World Clock</h1>
        <button
          type="button"
          className="btn primary"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? 'Close' : 'Add Timezone'}
        </button>
      </div>

      {showSearch && (
        <div className="world-clock-search">
          <input
            type="text"
            placeholder="Search cities or countries..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="search-results">
            {searchResults.map(city => (
              <button
                key={`${city.zone}`}
                type="button"
                className="search-result"
                onClick={() => addZone(city)}
              >
                <span className="result-city">{city.city}</span>
                <span className="result-country">{city.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="world-clock-zones">
        {state.selectedZones.map(zone => (
          <div key={zone.id} className="world-clock-zone">
            <div className="zone-header">
              <div className="zone-location">
                <div className="zone-city">{zone.city}</div>
                <div className="zone-country">{zone.country}</div>
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeZone(zone.id)}
                aria-label={`Remove ${zone.city}`}
              >
                ×
              </button>
            </div>
            <div className="zone-time">{currentTimes.get(zone.id) || '00:00:00'}</div>
            <div className="zone-offset">{zone.utcOffset}</div>
          </div>
        ))}
      </div>

      {state.selectedZones.length === 0 && (
        <div className="world-clock-empty">
          <p>No timezones selected. Click "Add Timezone" to get started.</p>
        </div>
      )}

      <div className="world-clock-controls">
        <button type="button" className="btn" onClick={toggleFullscreen}>
          Fullscreen
        </button>
      </div>
    </div>
  );
}
```

#### T029-T031: Styling

**File**: `src/styles.css` (append)

```css
/* World Clock */
.world-clock-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  min-height: 100vh;
}

.world-clock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.world-clock-header h1 {
  margin: 0;
  font-size: 32px;
  color: var(--fg);
}

.world-clock-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 8px;
}

.world-clock-search input {
  padding: 12px;
  font-size: 16px;
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.search-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-result:hover {
  background: var(--primary);
  color: white;
  transform: translateX(4px);
}

.result-city {
  font-weight: 600;
  font-size: 16px;
}

.result-country {
  font-size: 14px;
  color: var(--muted);
}

.search-result:hover .result-country {
  color: rgba(255, 255, 255, 0.8);
}

.world-clock-zones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.world-clock-zone {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.world-clock-zone:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.zone-location {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.zone-city {
  font-size: 20px;
  font-weight: 600;
  color: var(--fg);
}

.zone-country {
  font-size: 14px;
  color: var(--muted);
}

.btn-remove {
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: var(--error);
  color: white;
}

.zone-time {
  font-size: 48px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--primary);
  margin-bottom: 8px;
}

.zone-offset {
  font-size: 16px;
  color: var(--muted);
  font-weight: 500;
}

.world-clock-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--muted);
  font-size: 18px;
}

.world-clock-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .world-clock-zones {
    grid-template-columns: 1fr;
  }

  .zone-time {
    font-size: 36px;
  }
}
```

#### T032-T034: Integration & Testing

1. **Add route** to `src/main.tsx`:
```typescript
// Add to routes array
{ path: '/world', component: WorldClock },
```

2. **Update home page** `src/pages/Home.tsx` to link to World Clock (already has button)

3. **Run E2E tests**:
```bash
npm run test:e2e -- --grep "World Clock"
```

4. **Manual testing checklist**:
- [ ] Can add timezones via search
- [ ] Can remove timezones
- [ ] Times update every second
- [ ] UTC offsets display correctly
- [ ] State persists across navigation
- [ ] Fullscreen works (F key)
- [ ] Search filters cities correctly
- [ ] Responsive on mobile

---

## Phase 5: US3 - Alarm Clock (T035-T048)

**Priority**: P0 (Placeholder component)
**Effort**: L (Audio API integration)
**Estimated Time**: 2.5-3 hours

### Overview

Implement a functional Alarm Clock with time setting, repeat options, and alarm sound.

### Key Implementation Details

**State Management** (`src/types/timer-types.ts` - already defined):
```typescript
export interface AlarmState {
  version: 1;
  active: boolean;
  targetTime: {
    hour: number;
    minute: number;
  };
  nextTriggerAt: number | null;
  ringing: boolean;
  signal: SignalPreferences;
}
```

**Core Features**:
1. Time picker (24-hour format recommended)
2. Active/inactive toggle
3. Repeat options (one-time, daily, weekdays, weekends, custom)
4. Alarm sound using `beep()` from `utils.ts`
5. Snooze functionality (5min, 10min)
6. Multiple alarms (stretch goal)

**Component Structure** (`src/pages/Alarm.tsx`):

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useStorageSync } from '../hooks/useStorageSync';
import { AlarmState } from '../types/timer-types';
import { beep, flash } from '../utils';

export default function Alarm() {
  const [state, setState] = useStorageSync<AlarmState>('sc.v1.alarm', {
    version: 1,
    active: false,
    targetTime: { hour: 7, minute: 0 },
    nextTriggerAt: null,
    ringing: false,
    signal: { sound: true, flash: true }
  });

  const wrapRef = useRef<HTMLDivElement>(null);
  const ringIntervalRef = useRef<number | undefined>();

  // Calculate next trigger time when alarm is activated
  useEffect(() => {
    if (!state.active) {
      setState(s => ({ ...s, nextTriggerAt: null }));
      return;
    }

    const now = new Date();
    const target = new Date();
    target.setHours(state.targetTime.hour, state.targetTime.minute, 0, 0);

    // If target time has passed today, set for tomorrow
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    setState(s => ({ ...s, nextTriggerAt: target.getTime() }));
  }, [state.active, state.targetTime]);

  // Check if alarm should ring
  useEffect(() => {
    if (!state.active || !state.nextTriggerAt) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (now >= state.nextTriggerAt! && !state.ringing) {
        setState(s => ({ ...s, ringing: true }));
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [state.active, state.nextTriggerAt, state.ringing]);

  // Ring alarm (beep every second)
  useEffect(() => {
    if (!state.ringing) {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
        ringIntervalRef.current = undefined;
      }
      return;
    }

    // Ring immediately
    if (state.signal.sound) beep(600, 880);
    if (state.signal.flash) flash(wrapRef.current, 900);

    // Then every second
    ringIntervalRef.current = window.setInterval(() => {
      if (state.signal.sound) beep(600, 880);
      if (state.signal.flash) flash(wrapRef.current, 900);
    }, 1500);

    return () => {
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    };
  }, [state.ringing, state.signal]);

  const stopAlarm = () => {
    setState(s => ({
      ...s,
      ringing: false,
      active: false,
      nextTriggerAt: null
    }));
  };

  const snooze = (minutes: number) => {
    const snoozeUntil = Date.now() + minutes * 60_000;
    setState(s => ({
      ...s,
      ringing: false,
      nextTriggerAt: snoozeUntil
    }));
  };

  const setAlarmTime = (hour: number, minute: number) => {
    setState(s => ({
      ...s,
      targetTime: { hour, minute },
      active: false, // Deactivate when changing time
      ringing: false
    }));
  };

  const toggleActive = () => {
    setState(s => ({ ...s, active: !s.active, ringing: false }));
  };

  // Format time until alarm
  const getTimeUntilAlarm = () => {
    if (!state.nextTriggerAt) return '';
    const diff = state.nextTriggerAt - Date.now();
    if (diff < 0) return 'Now!';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `in ${hours}h ${minutes}m`;
  };

  return (
    <div className="alarm-wrap" ref={wrapRef}>
      <a href="#/" className="btn-home">Home</a>

      <h1>Alarm Clock</h1>

      {state.ringing ? (
        <div className="alarm-ringing">
          <div className="alarm-display ringing">ALARM!</div>
          <div className="alarm-time-display">
            {String(state.targetTime.hour).padStart(2, '0')}:
            {String(state.targetTime.minute).padStart(2, '0')}
          </div>
          <div className="alarm-controls">
            <button type="button" className="btn primary" onClick={stopAlarm}>
              Stop
            </button>
            <button type="button" className="btn" onClick={() => snooze(5)}>
              Snooze 5min
            </button>
            <button type="button" className="btn" onClick={() => snooze(10)}>
              Snooze 10min
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="alarm-time-picker">
            <input
              type="number"
              min="0"
              max="23"
              value={state.targetTime.hour}
              onChange={e => setAlarmTime(Number(e.target.value) || 0, state.targetTime.minute)}
              aria-label="Hour"
            />
            <span className="sep">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={state.targetTime.minute}
              onChange={e => setAlarmTime(state.targetTime.hour, Number(e.target.value) || 0)}
              aria-label="Minute"
            />
          </div>

          <div className="alarm-status">
            {state.active ? (
              <div className="alarm-next">Alarm {getTimeUntilAlarm()}</div>
            ) : (
              <div className="alarm-inactive">Alarm inactive</div>
            )}
          </div>

          <div className="alarm-controls">
            <button
              type="button"
              className={`btn ${state.active ? 'primary' : ''}`}
              onClick={toggleActive}
            >
              {state.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          <div className="alarm-settings">
            <label className="sig">
              <input
                type="checkbox"
                checked={state.signal.sound}
                onChange={e => setState(s => ({
                  ...s,
                  signal: { ...s.signal, sound: e.target.checked }
                }))}
              />
              <span>Sound</span>
            </label>
            <label className="sig">
              <input
                type="checkbox"
                checked={state.signal.flash}
                onChange={e => setState(s => ({
                  ...s,
                  signal: { ...s.signal, flash: e.target.checked }
                }))}
              />
              <span>Flash</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
```

**Styling** (append to `src/styles.css`):

```css
/* Alarm Clock */
.alarm-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 40px 20px;
  min-height: 100vh;
}

.alarm-wrap h1 {
  margin: 0;
  font-size: 36px;
  color: var(--fg);
}

.alarm-time-picker {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 72px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.alarm-time-picker input {
  width: 120px;
  padding: 16px;
  font-size: 72px;
  font-weight: 700;
  text-align: center;
  background: var(--bg);
  color: var(--fg);
  border: 2px solid var(--border);
  border-radius: 12px;
  font-variant-numeric: tabular-nums;
}

.alarm-time-picker .sep {
  color: var(--muted);
}

.alarm-status {
  font-size: 20px;
  color: var(--muted);
  min-height: 30px;
}

.alarm-next {
  color: var(--success);
  font-weight: 600;
}

.alarm-inactive {
  color: var(--muted);
}

.alarm-ringing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.alarm-display {
  font-size: 48px;
  font-weight: 700;
  padding: 20px 40px;
  border-radius: 12px;
  background: var(--bg);
  color: var(--fg);
  border: 2px solid var(--border);
}

.alarm-display.ringing {
  background: var(--error);
  color: white;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.alarm-time-display {
  font-size: 96px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--primary);
}

.alarm-controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.alarm-settings {
  display: flex;
  gap: 24px;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  .alarm-time-picker {
    font-size: 48px;
  }

  .alarm-time-picker input {
    width: 80px;
    font-size: 48px;
  }

  .alarm-time-display {
    font-size: 64px;
  }
}
```

**E2E Tests** (`tests/e2e/09-alarm.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';

test.describe('Alarm Clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
    await page.goto('/#/alarm');
  });

  test('should set alarm time', async ({ page }) => {
    await page.locator('input[aria-label="Hour"]').fill('9');
    await page.locator('input[aria-label="Minute"]').fill('30');

    await expect(page.locator('input[aria-label="Hour"]')).toHaveValue('9');
    await expect(page.locator('input[aria-label="Minute"]')).toHaveValue('30');
  });

  test('should activate and deactivate alarm', async ({ page }) => {
    const activateBtn = page.getByRole('button', { name: /activate/i });

    // Initially inactive
    await expect(page.locator('.alarm-inactive')).toBeVisible();

    // Activate
    await activateBtn.click();
    await expect(page.locator('.alarm-next')).toBeVisible();
    await expect(page.locator('.alarm-next')).toContainText('in');

    // Deactivate
    await page.getByRole('button', { name: /deactivate/i }).click();
    await expect(page.locator('.alarm-inactive')).toBeVisible();
  });

  test('should persist alarm settings', async ({ page }) => {
    await page.locator('input[aria-label="Hour"]').fill('8');
    await page.locator('input[aria-label="Minute"]').fill('15');
    await page.getByRole('button', { name: /activate/i }).click();

    // Navigate away
    await page.goto('/#/');

    // Navigate back
    await page.goto('/#/alarm');

    // Settings should persist
    await expect(page.locator('input[aria-label="Hour"]')).toHaveValue('8');
    await expect(page.locator('input[aria-label="Minute"]')).toHaveValue('15');
    await expect(page.locator('.alarm-next')).toBeVisible();
  });

  test('should toggle sound and flash options', async ({ page }) => {
    const soundCheckbox = page.locator('label.sig').filter({ hasText: 'Sound' }).locator('input');
    const flashCheckbox = page.locator('label.sig').filter({ hasText: 'Flash' }).locator('input');

    await expect(soundCheckbox).toBeChecked();
    await expect(flashCheckbox).toBeChecked();

    await soundCheckbox.click();
    await expect(soundCheckbox).not.toBeChecked();
  });
});
```

---

## Phase 6: US4 - Metronome (T049-T062)

**Priority**: P0 (Placeholder component)
**Effort**: L (Audio timing critical)
**Estimated Time**: 2.5-3 hours

### Overview

Implement a functional Metronome with BPM control, time signatures, and visual/audio beats.

### Key Features

1. **BPM Control**: 40-240 BPM with increment/decrement buttons
2. **Time Signatures**: 4/4, 3/4, 6/8, 5/4, 7/8
3. **Tap Tempo**: Calculate BPM by tapping
4. **Accent Beats**: First beat of measure emphasized
5. **Visual Beat Indicator**: Flashing circle synchronized with audio

### Implementation Highlights

**Audio Timing Pattern** (critical for accuracy):

```typescript
// DO NOT use setInterval for metronome - use Web Audio API timing
// This ensures sample-accurate beat timing

let audioContext: AudioContext;
let nextBeatTime = 0;
const scheduleAheadTime = 0.1; // Schedule beats 100ms ahead
const lookahead = 25; // Check every 25ms

function scheduleBeat(beatNumber: number, time: number) {
  // Create oscillator for click sound
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  // Accent first beat of measure (higher pitch)
  osc.frequency.value = beatNumber === 0 ? 1200 : 800;

  osc.connect(gain);
  gain.connect(audioContext.destination);

  // Short click envelope
  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

  osc.start(time);
  osc.stop(time + 0.03);
}

function scheduler() {
  while (nextBeatTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleBeat(currentBeat, nextBeatTime);

    nextBeatTime += 60.0 / bpm; // Move to next beat
    currentBeat = (currentBeat + 1) % beatsPerMeasure;
  }
}

// Call scheduler() every 25ms when metronome is running
```

**Component Structure** (`src/pages/Metronome.tsx`):

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStorageSync } from '../hooks/useStorageSync';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { MetronomeState } from '../types/timer-types';

const TIME_SIGNATURES = [
  { label: '4/4', beatsPerMeasure: 4, beatValue: 4 },
  { label: '3/4', beatsPerMeasure: 3, beatValue: 4 },
  { label: '6/8', beatsPerMeasure: 6, beatValue: 8 },
  { label: '5/4', beatsPerMeasure: 5, beatValue: 4 },
  { label: '7/8', beatsPerMeasure: 7, beatValue: 8 },
];

export default function Metronome() {
  const [state, setState] = useStorageSync<MetronomeState>('sc.v1.metronome', {
    version: 1,
    bpm: 120,
    running: false,
    timeSignature: { beatsPerMeasure: 4, beatValue: 4 },
    currentBeat: 0,
    accentFirstBeat: true
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const schedulerIntervalRef = useRef<number | undefined>();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  // Initialize AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const scheduleBeat = useCallback((beatNumber: number, time: number) => {
    if (!audioContextRef.current) return;

    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    // Accent first beat if enabled
    const isAccent = beatNumber === 0 && state.accentFirstBeat;
    osc.frequency.value = isAccent ? 1200 : 800;

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);

    gain.gain.setValueAtTime(isAccent ? 0.8 : 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

    osc.start(time);
    osc.stop(time + 0.03);

    // Update visual beat indicator (schedule state update)
    const now = audioContextRef.current.currentTime;
    const delay = (time - now) * 1000;
    setTimeout(() => {
      setState(s => ({ ...s, currentBeat: beatNumber }));
    }, delay);
  }, [state.accentFirstBeat]);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;

    const scheduleAheadTime = 0.1;
    const beatInterval = 60.0 / state.bpm;

    while (nextBeatTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      scheduleBeat(state.currentBeat, nextBeatTimeRef.current);

      nextBeatTimeRef.current += beatInterval;
      setState(s => ({
        ...s,
        currentBeat: (s.currentBeat + 1) % s.timeSignature.beatsPerMeasure
      }));
    }
  }, [state.bpm, state.currentBeat, state.timeSignature.beatsPerMeasure, scheduleBeat]);

  // Start/stop metronome
  useEffect(() => {
    if (!state.running) {
      if (schedulerIntervalRef.current) {
        clearInterval(schedulerIntervalRef.current);
        schedulerIntervalRef.current = undefined;
      }
      return;
    }

    // Initialize timing
    if (audioContextRef.current) {
      nextBeatTimeRef.current = audioContextRef.current.currentTime;
    }

    setState(s => ({ ...s, currentBeat: 0 }));

    // Start scheduler (check every 25ms)
    schedulerIntervalRef.current = window.setInterval(scheduler, 25);

    return () => {
      if (schedulerIntervalRef.current) {
        clearInterval(schedulerIntervalRef.current);
      }
    };
  }, [state.running, scheduler]);

  const toggleRunning = () => {
    setState(s => ({ ...s, running: !s.running }));
  };

  const changeBPM = (delta: number) => {
    setState(s => ({
      ...s,
      bpm: Math.max(40, Math.min(240, s.bpm + delta))
    }));
  };

  const setBPM = (bpm: number) => {
    setState(s => ({ ...s, bpm: Math.max(40, Math.min(240, bpm)) }));
  };

  const setTimeSignature = (sig: typeof TIME_SIGNATURES[0]) => {
    setState(s => ({
      ...s,
      timeSignature: {
        beatsPerMeasure: sig.beatsPerMeasure,
        beatValue: sig.beatValue
      },
      currentBeat: 0
    }));
  };

  const handleTap = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].slice(-4); // Keep last 4 taps
    setTapTimes(newTapTimes);

    if (newTapTimes.length >= 2) {
      // Calculate average interval
      const intervals = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBPM = Math.round(60000 / avgInterval);
      setBPM(calculatedBPM);
    }

    // Reset tap times after 3 seconds of no tapping
    setTimeout(() => {
      setTapTimes(times => times.filter(t => Date.now() - t < 3000));
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!wrapRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      wrapRef.current.requestFullscreen?.().catch(() => {});
    }
  };

  useKeyboardShortcuts({
    onSpace: toggleRunning,
    onFullscreen: toggleFullscreen,
  }, true);

  const currentSig = TIME_SIGNATURES.find(
    sig => sig.beatsPerMeasure === state.timeSignature.beatsPerMeasure &&
           sig.beatValue === state.timeSignature.beatValue
  ) || TIME_SIGNATURES[0];

  return (
    <div className="metronome-wrap" ref={wrapRef}>
      <a href="#/" className="btn-home">Home</a>

      <h1>Metronome</h1>

      <div className="metronome-bpm">
        <button
          type="button"
          className="btn bpm-btn"
          onClick={() => changeBPM(-5)}
        >
          -5
        </button>
        <button
          type="button"
          className="btn bpm-btn"
          onClick={() => changeBPM(-1)}
        >
          -1
        </button>
        <div className="bpm-display">
          <input
            type="number"
            min="40"
            max="240"
            value={state.bpm}
            onChange={e => setBPM(Number(e.target.value) || 120)}
            disabled={state.running}
          />
          <div className="bpm-label">BPM</div>
        </div>
        <button
          type="button"
          className="btn bpm-btn"
          onClick={() => changeBPM(1)}
        >
          +1
        </button>
        <button
          type="button"
          className="btn bpm-btn"
          onClick={() => changeBPM(5)}
        >
          +5
        </button>
      </div>

      <div className="metronome-visual">
        {Array.from({ length: state.timeSignature.beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className={`beat-indicator ${i === state.currentBeat && state.running ? 'active' : ''} ${i === 0 && state.accentFirstBeat ? 'accent' : ''}`}
          />
        ))}
      </div>

      <div className="metronome-controls">
        <button
          type="button"
          className="btn primary"
          onClick={toggleRunning}
        >
          {state.running ? 'Stop' : 'Start'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleTap}
        >
          Tap Tempo
        </button>
      </div>

      <div className="metronome-settings">
        <label>
          <span>Time Signature:</span>
          <select
            value={currentSig.label}
            onChange={e => {
              const sig = TIME_SIGNATURES.find(s => s.label === e.target.value);
              if (sig) setTimeSignature(sig);
            }}
            disabled={state.running}
          >
            {TIME_SIGNATURES.map(sig => (
              <option key={sig.label} value={sig.label}>{sig.label}</option>
            ))}
          </select>
        </label>
        <label className="sig">
          <input
            type="checkbox"
            checked={state.accentFirstBeat}
            onChange={e => setState(s => ({ ...s, accentFirstBeat: e.target.checked }))}
          />
          <span>Accent First Beat</span>
        </label>
      </div>
    </div>
  );
}
```

**Styling** (append to `src/styles.css`):

```css
/* Metronome */
.metronome-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 40px 20px;
  min-height: 100vh;
}

.metronome-wrap h1 {
  margin: 0;
  font-size: 36px;
  color: var(--fg);
}

.metronome-bpm {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bpm-btn {
  min-width: 60px;
}

.bpm-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bpm-display input {
  width: 120px;
  padding: 16px;
  font-size: 64px;
  font-weight: 700;
  text-align: center;
  background: var(--bg);
  color: var(--fg);
  border: 2px solid var(--border);
  border-radius: 12px;
  font-variant-numeric: tabular-nums;
}

.bpm-label {
  font-size: 18px;
  color: var(--muted);
  font-weight: 600;
}

.metronome-visual {
  display: flex;
  gap: 16px;
  padding: 24px;
}

.beat-indicator {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--border);
  transition: all 0.1s;
  border: 3px solid transparent;
}

.beat-indicator.active {
  background: var(--primary);
  transform: scale(1.2);
  box-shadow: 0 0 20px var(--primary);
}

.beat-indicator.accent {
  border-color: var(--accent);
}

.beat-indicator.accent.active {
  background: var(--accent);
  box-shadow: 0 0 20px var(--accent);
}

.metronome-controls {
  display: flex;
  gap: 16px;
}

.metronome-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.metronome-settings label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.metronome-settings select {
  padding: 8px 12px;
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .bpm-display input {
    width: 100px;
    font-size: 48px;
  }

  .beat-indicator {
    width: 40px;
    height: 40px;
  }
}
```

---

## Phase 7: US5 - Chess Clock (T063-T079)

**Priority**: P0
**Effort**: M (Similar to CycleTimer logic)
**Estimated Time**: 2-2.5 hours

### Overview

Implement a two-player Chess Clock with Fischer increment and Bronstein delay modes.

### Key Features

1. **Two independent timers** (Player 1 and Player 2)
2. **Clock modes**: Simple, Fischer increment, Bronstein delay
3. **Move counter** for each player
4. **Time presets**: Blitz (3+2), Rapid (10+0), Classical (60+30)
5. **Switch player** on click/tap

### Implementation Structure

```typescript
export default function ChessClock() {
  const [state, setState] = useStorageSync<ChessClockState>('sc.v1.chessclock', {
    version: 1,
    players: {
      player1: { remainingMs: 180_000, moveCount: 0 },
      player2: { remainingMs: 180_000, moveCount: 0 }
    },
    activePlayer: null,
    running: false,
    endAt: null,
    mode: {
      type: 'fischer',
      incrementMs: 2000,
      delayMs: 0
    },
    timeExpired: null
  });

  // When player makes move:
  const switchPlayer = () => {
    if (state.timeExpired) return; // Game over

    if (state.activePlayer === 1) {
      // Apply increment/delay for Fischer mode
      const newRemaining = state.mode.type === 'fischer'
        ? Math.max(0, (state.endAt || 0) - Date.now()) + state.mode.incrementMs
        : Math.max(0, (state.endAt || 0) - Date.now());

      setState(s => ({
        ...s,
        players: {
          ...s.players,
          player1: {
            remainingMs: newRemaining,
            moveCount: s.players.player1.moveCount + 1
          }
        },
        activePlayer: 2,
        endAt: Date.now() + s.players.player2.remainingMs
      }));
    } else {
      // Similar logic for player 2 → player 1
    }
  };

  // ... rest of implementation
}
```

Full implementation details available in tasks.md (T063-T079).

---

## Phases 8-14: Additional User Stories (T080-T146)

These phases cover additional features and improvements:

### Phase 8: US6 - Stopwatch Lap Times (11 tasks)
- Add lap recording functionality
- Display lap times in list
- Show lap number, lap time, and total time
- Export lap times to CSV/JSON

### Phase 9: US7 - Cycle Timer Pause (10 tasks)
- Add pause/resume functionality
- Persist paused state
- Update UI to show pause button
- Fix cycle count display bug

### Phase 10: US8 - Analog Countdown Visual (14 tasks)
- Implement SVG clock face
- Animated countdown hand
- Color zones (green → yellow → red)
- Touch/drag to set time

### Phase 11: US9 - Home Page Enhancements (11 tasks)
- Theme toggle integration
- Recently used timers tracking
- Quick-start functionality
- Remove "Coming Soon" placeholder

### Phase 12: US10 - Service Worker Improvements (9 tasks)
- Fix aggressive caching
- Implement proper cache versioning
- Add update notification integration
- Background sync for state

### Phase 13: US11 - Global Settings (9 tasks)
- Settings page/modal
- Default signal preferences
- Keyboard shortcuts enable/disable
- Export/import all timer settings

### Phase 14: US12 - Cross-Cutting Polish (13 tasks)
- Consistent button types
- Input validation across all timers
- Accessibility improvements (ARIA labels)
- Mobile touch target sizing

---

## Phase 15: Final Polish & Validation (T147-T156)

**Overview**: 10 final tasks to ensure production quality

### Task Checklist

#### T147-T149: Comprehensive Testing
```bash
# Run full E2E test suite
npm run test:e2e

# Target: 100% passing tests
# Current baseline: 36/44 passing (81.8%)
# After all phases: Should be 60+/60+ passing

# Run build to check for TypeScript errors
npm run build

# Run dev server for manual testing
npm run dev
```

#### T150-T152: Performance Audit
```bash
# Use Lighthouse for performance scoring
npx lighthouse http://localhost:4173 --view

# Target metrics:
# - Performance: >90
# - Accessibility: >95
# - Best Practices: >90
# - SEO: >90
# - PWA: >90

# Check bundle size
npm run build
# Target: dist/assets/index-*.js < 200KB gzipped
```

#### T153-T155: Documentation & Deployment
- Update README.md with feature list
- Create user guide for each timer
- Document keyboard shortcuts
- Update sitemap.xml
- Test GitHub Pages deployment
- Verify custom domain (stoppclock.com)

#### T156: Final Validation
- [ ] All E2E tests passing
- [ ] No console errors in production build
- [ ] All timers functional
- [ ] Cross-tab sync working
- [ ] Offline capability verified
- [ ] Mobile responsive on 3+ devices
- [ ] Keyboard shortcuts standardized
- [ ] Dark/light theme working
- [ ] Service worker updates correctly
- [ ] Git history clean and committed

---

## Testing Strategy

### E2E Test Organization

Each timer should have its own E2E test file:
- `01-home.spec.ts` - Home page navigation
- `02-countdown.spec.ts` - Digital Countdown (✅ Enhanced with new tests)
- `03-analog.spec.ts` - Analog Countdown
- `04-stopwatch.spec.ts` - Stopwatch with lap times
- `05-cycle.spec.ts` - Cycle Timer
- `06-digital-clock.spec.ts` - Digital Clock
- `07-chess.spec.ts` - Chess Clock
- `08-world-clock.spec.ts` - World Clock
- `09-alarm.spec.ts` - Alarm Clock
- `10-metronome.spec.ts` - Metronome

### Test Coverage Goals

Each timer test file should cover:
1. **Basic functionality** - Timer starts, stops, resets
2. **Keyboard shortcuts** - Space, R, F keys work
3. **State persistence** - Settings survive navigation
4. **Signal options** - Sound/flash toggles work
5. **Input validation** - Invalid values handled
6. **Responsive** - Works on mobile viewport

---

## Common Pitfalls & Solutions

### Pitfall 1: localStorage Quota Exceeded

**Problem**: Saving too much data to localStorage (especially lap times, alarm lists)

**Solution**:
```typescript
try {
  localStorage.setItem(key, value);
} catch (err) {
  if (err instanceof DOMException && err.name === 'QuotaExceededError') {
    // Clear old data or notify user
    console.error('Storage quota exceeded. Clearing old lap times...');
    // Implement cleanup logic
  }
}
```

### Pitfall 2: Timer Drift with setInterval

**Problem**: Timers become inaccurate over time when using setInterval

**Solution**: Use timestamp-based calculations (already implemented)
```typescript
// GOOD: Use endAt timestamp
const sync = () => {
  const remaining = Math.max(0, state.endAt - Date.now());
  setState(s => ({ ...s, remainingMs: remaining }));
};

// BAD: Decrement remainingMs
const bad = () => {
  setState(s => ({ ...s, remainingMs: s.remainingMs - 1000 })); // Drifts over time!
};
```

### Pitfall 3: Audio Not Playing on Mobile

**Problem**: Web Audio requires user interaction to start

**Solution**:
```typescript
// Resume AudioContext on first user interaction
const resumeAudioContext = () => {
  if (audioContextRef.current?.state === 'suspended') {
    audioContextRef.current.resume();
  }
};

// Call on button click
<button onClick={() => { resumeAudioContext(); start(); }}>
  Start
</button>
```

### Pitfall 4: Cross-tab Sync Race Conditions

**Problem**: Multiple tabs updating same state simultaneously

**Solution**: Use the `useStorageSync` hook which handles this automatically via StorageEvent. Avoid manual localStorage.setItem() calls outside the hook.

---

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test production build locally: `npm run preview`
- [ ] All E2E tests passing: `npm run test:e2e`
- [ ] No console errors in production build
- [ ] Service worker properly versioned
- [ ] Sitemap.xml updated with all routes
- [ ] Custom domain DNS configured (if applicable)
- [ ] GitHub Pages deployment workflow successful
- [ ] Verify PWA installability on mobile
- [ ] Test offline functionality
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Maintenance & Future Enhancements

### Post-Launch Priorities

1. **User feedback integration** - Monitor GitHub issues
2. **Performance monitoring** - Track real-user metrics
3. **A/B testing** - Test different UX patterns
4. **Analytics integration** - Privacy-respecting analytics (FR-068)
5. **Multi-language support** - Start with EN/DE (FR-069)

### Suggested Future Features

1. **Timer combinations** - Run multiple timers simultaneously
2. **Workout timer** - HIIT/Tabata presets
3. **Focus timer** - Pomodoro technique with tasks
4. **Meeting timer** - Agenda items with time limits
5. **Presentation timer** - Slide timing and warnings
6. **Cooking timer** - Multiple simultaneous countdown timers

---

## Getting Help

### Resources

- **SpecKit Documentation**: Check `.specify/` directory for templates and workflows
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Playwright Testing**: https://playwright.dev
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:e2e     # Run E2E tests

# Testing specific suites
npm run test:e2e -- --grep "World Clock"
npm run test:e2e -- --grep "Alarm"

# Check for issues
npm run doctor       # Run health checks (if available)
```

---

## Conclusion

This implementation guide provides a complete roadmap for finishing the Stoppclock Timer Audit & Improvements feature. **Phases 1-3 (20 tasks) have established all the foundational patterns and infrastructure** needed for the remaining work.

Each remaining phase builds incrementally on this foundation:
- Use `useStorageSync` for state management
- Use `useKeyboardShortcuts` for keyboard support
- Follow the established styling patterns
- Write comprehensive E2E tests
- Validate inputs and handle errors

By following this guide methodically, you can complete the remaining 136 tasks efficiently while maintaining high code quality and user experience standards.

**Estimated Total Time for Remaining Work**: 18-24 hours

Good luck! 🚀
