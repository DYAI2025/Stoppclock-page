# Cooking Timer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Cycle Timer with a multi-timer Cooking Timer page that supports up to 10 simultaneous timers with presets, colors, and smart alarm behavior.

**Architecture:** React component with multiple independent countdown timers, auto-rotation color palette, localStorage persistence, dynamic sorting by remaining time, 60-second alarm with visual pulsing fallback, and preset quick-start buttons.

**Tech Stack:** React 18, TypeScript, Web Audio API, localStorage, CSS variables for soft color palette

---

## Design Specifications

### Timer Presets (with default times)
- **Stove:** 20 minutes (orange/warm)
- **Oven:** 25 minutes (red/hot)
- **Pasta:** 10 minutes (yellow)
- **Rice:** 15 minutes (green)
- **Eggs:** 7 minutes (light blue)
- **Tea:** 3 minutes (purple)
- **Custom:** User-defined

### Color Palette (10 soft colors for auto-rotation)
```css
--cooking-color-1: #FFB3BA; /* Soft Pink */
--cooking-color-2: #FFDFBA; /* Soft Peach */
--cooking-color-3: #FFFFBA; /* Soft Yellow */
--cooking-color-4: #BAFFC9; /* Soft Mint */
--cooking-color-5: #BAE1FF; /* Soft Blue */
--cooking-color-6: #E0BBE4; /* Soft Lavender */
--cooking-color-7: #FFD6A5; /* Soft Orange */
--cooking-color-8: #CAFFBF; /* Soft Lime */
--cooking-color-9: #A0C4FF; /* Soft Periwinkle */
--cooking-color-10: #FFC6FF; /* Soft Magenta */
```

### Alarm Behavior
- **Phase 1 (0-60s):** Continuous audio tone (Web Audio API)
- **Phase 2 (60s+):** Silent, visual pulsing (CSS animation)
- **Extension:** +1, +2, +5 min buttons → stops alarm, restarts timer
- **Manual Stop:** Required to dismiss

---

## Task 1: Define TypeScript Types

**Files:**
- Modify: `src/types/timer-types.ts` (append to end)

**Step 1: Add Cooking Timer state interface**

Add these interfaces at the end of `src/types/timer-types.ts`:

```typescript
export type CookingPreset = 'stove' | 'oven' | 'pasta' | 'rice' | 'eggs' | 'tea' | 'custom';

export interface CookingTimer {
  id: string;
  name: string;
  preset: CookingPreset;
  color: string; // CSS color from palette
  durationMs: number; // Original duration
  remainingMs: number;
  running: boolean;
  startedAt: number | null;
  alarmActive: boolean; // True when time reaches 0
  alarmStartedAt: number | null; // When alarm started (for 60s audio limit)
}

export interface CookingTimerState {
  version: 1;
  timers: CookingTimer[];
  nextColorIndex: number; // 0-9 for auto-rotation
}
```

**Step 2: Verify TypeScript compilation**

Run: `npm run build`
Expected: Build succeeds with no type errors

**Step 3: Commit types**

```bash
git add src/types/timer-types.ts
git commit -m "feat(cooking): add TypeScript types for Cooking Timer state"
```

---

## Task 2: Create Preset Configuration

**Files:**
- Create: `src/config/cooking-presets.ts`

**Step 1: Write preset configuration**

Create `src/config/cooking-presets.ts`:

```typescript
import type { CookingPreset } from '../types/timer-types';

export interface PresetConfig {
  id: CookingPreset;
  label: string;
  defaultMinutes: number;
  emoji: string;
}

export const COOKING_PRESETS: PresetConfig[] = [
  { id: 'stove', label: 'Stove', defaultMinutes: 20, emoji: '🔥' },
  { id: 'oven', label: 'Oven', defaultMinutes: 25, emoji: '♨️' },
  { id: 'pasta', label: 'Pasta', defaultMinutes: 10, emoji: '🍝' },
  { id: 'rice', label: 'Rice', defaultMinutes: 15, emoji: '🍚' },
  { id: 'eggs', label: 'Eggs', defaultMinutes: 7, emoji: '🥚' },
  { id: 'tea', label: 'Tea', defaultMinutes: 3, emoji: '🍵' },
];

export const SOFT_COLORS = [
  '#FFB3BA', // Soft Pink
  '#FFDFBA', // Soft Peach
  '#FFFFBA', // Soft Yellow
  '#BAFFC9', // Soft Mint
  '#BAE1FF', // Soft Blue
  '#E0BBE4', // Soft Lavender
  '#FFD6A5', // Soft Orange
  '#CAFFBF', // Soft Lime
  '#A0C4FF', // Soft Periwinkle
  '#FFC6FF', // Soft Magenta
];

export function getNextColor(currentIndex: number): { color: string; nextIndex: number } {
  const color = SOFT_COLORS[currentIndex % SOFT_COLORS.length];
  const nextIndex = (currentIndex + 1) % SOFT_COLORS.length;
  return { color, nextIndex };
}

export function getPresetDefaults(preset: CookingPreset): { label: string; minutes: number } {
  const config = COOKING_PRESETS.find(p => p.id === preset);
  return {
    label: config?.label ?? 'Custom',
    minutes: config?.defaultMinutes ?? 10
  };
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit preset config**

```bash
git add src/config/cooking-presets.ts
git commit -m "feat(cooking): add cooking timer presets and color palette"
```

---

## Task 3: Create Cooking Timer Page Component

**Files:**
- Create: `src/pages/CookingTimer.tsx`
- Modify: `src/pages/CycleTimer.tsx` → Rename/replace

**Step 1: Rename CycleTimer to CookingTimer**

```bash
git mv src/pages/CycleTimer.tsx src/pages/CookingTimer.tsx
```

**Step 2: Write the Cooking Timer component**

Replace contents of `src/pages/CookingTimer.tsx`:

```typescript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HomeButton } from '../components/HomeButton';
import type { CookingTimer, CookingTimerState, CookingPreset } from '../types/timer-types';
import { COOKING_PRESETS, getNextColor, getPresetDefaults } from '../config/cooking-presets';

const LS_KEY = 'sc.v1.cooking';
const MAX_TIMERS = 10;

function load(): CookingTimerState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error('No saved state');
    const p = JSON.parse(raw) as CookingTimerState;
    return {
      version: 1,
      timers: Array.isArray(p.timers) ? p.timers.map(t => ({
        ...t,
        running: false, // Always start paused after reload
        startedAt: null,
        alarmActive: false,
        alarmStartedAt: null
      })) : [],
      nextColorIndex: p.nextColorIndex ?? 0
    };
  } catch {
    return {
      version: 1,
      timers: [],
      nextColorIndex: 0
    };
  }
}

function save(p: CookingTimerState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    // Silently fail
  }
}

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

function fmt(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function CookingTimer() {
  const [st, setSt] = useState<CookingTimerState>(load);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const hasRunningTimer = st.timers.some(t => t.running);

  const sync = useCallback(() => {
    const now = Date.now();
    let updated = false;

    const newTimers = st.timers.map(timer => {
      if (!timer.running || !timer.startedAt) return timer;

      const elapsed = now - timer.startedAt;
      const remaining = Math.max(0, timer.remainingMs - elapsed);

      if (remaining === 0 && !timer.alarmActive) {
        // Timer just finished
        updated = true;
        return {
          ...timer,
          remainingMs: 0,
          running: false,
          startedAt: null,
          alarmActive: true,
          alarmStartedAt: now
        };
      }

      return timer;
    });

    if (updated) {
      setSt(s => ({ ...s, timers: newTimers }));
    } else {
      forceUpdate();
    }
  }, [st.timers]);

  useRaf(hasRunningTimer, sync);

  useEffect(() => {
    const t = setTimeout(() => save(st), 150);
    return () => clearTimeout(t);
  }, [st]);

  // Alarm audio management
  useEffect(() => {
    const activeAlarms = st.timers.filter(t => t.alarmActive && t.alarmStartedAt);
    const now = Date.now();
    const audioAlarms = activeAlarms.filter(t => (now - t.alarmStartedAt!) < 60000); // 60s limit

    if (audioAlarms.length > 0 && !oscillatorRef.current) {
      // Start alarm sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();

        audioContextRef.current = audioContext;
        oscillatorRef.current = oscillator;
      } catch (error) {
        console.warn('Web Audio API not available:', error);
      }
    } else if (audioAlarms.length === 0 && oscillatorRef.current) {
      // Stop alarm sound
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      audioContextRef.current?.close();
      oscillatorRef.current = null;
      audioContextRef.current = null;
    }

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [st.timers.map(t => `${t.id}-${t.alarmActive}-${t.alarmStartedAt}`).join(',')]);

  const addTimer = useCallback((preset: CookingPreset) => {
    if (st.timers.length >= MAX_TIMERS) return;

    const { color, nextIndex } = getNextColor(st.nextColorIndex);
    const { label, minutes } = getPresetDefaults(preset);
    const durationMs = minutes * 60 * 1000;

    const newTimer: CookingTimer = {
      id: `timer-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: label,
      preset,
      color,
      durationMs,
      remainingMs: durationMs,
      running: false,
      startedAt: null,
      alarmActive: false,
      alarmStartedAt: null
    };

    setSt(s => ({
      ...s,
      timers: [...s.timers, newTimer],
      nextColorIndex: nextIndex
    }));
  }, [st.timers.length, st.nextColorIndex]);

  const deleteTimer = useCallback((id: string) => {
    setSt(s => ({
      ...s,
      timers: s.timers.filter(t => t.id !== id)
    }));
  }, []);

  const startTimer = useCallback((id: string) => {
    setSt(s => ({
      ...s,
      timers: s.timers.map(t =>
        t.id === id
          ? { ...t, running: true, startedAt: Date.now(), alarmActive: false, alarmStartedAt: null }
          : t
      )
    }));
  }, []);

  const pauseTimer = useCallback((id: string) => {
    setSt(s => ({
      ...s,
      timers: s.timers.map(t => {
        if (t.id !== id || !t.startedAt) return t;
        const elapsed = Date.now() - t.startedAt;
        const remaining = Math.max(0, t.remainingMs - elapsed);
        return { ...t, running: false, startedAt: null, remainingMs: remaining };
      })
    }));
  }, []);

  const resetTimer = useCallback((id: string) => {
    setSt(s => ({
      ...s,
      timers: s.timers.map(t =>
        t.id === id
          ? { ...t, remainingMs: t.durationMs, running: false, startedAt: null, alarmActive: false, alarmStartedAt: null }
          : t
      )
    }));
  }, []);

  const extendTimer = useCallback((id: string, minutes: number) => {
    setSt(s => ({
      ...s,
      timers: s.timers.map(t => {
        if (t.id !== id) return t;
        const additionalMs = minutes * 60 * 1000;
        return {
          ...t,
          remainingMs: additionalMs,
          durationMs: additionalMs,
          running: true,
          startedAt: Date.now(),
          alarmActive: false,
          alarmStartedAt: null
        };
      })
    }));
  }, []);

  const stopAlarm = useCallback((id: string) => {
    setSt(s => ({
      ...s,
      timers: s.timers.map(t =>
        t.id === id
          ? { ...t, alarmActive: false, alarmStartedAt: null }
          : t
      )
    }));
  }, []);

  // Sort timers: running timers by remaining time (ascending), then stopped timers
  const sortedTimers = [...st.timers].sort((a, b) => {
    if (a.alarmActive && !b.alarmActive) return -1;
    if (!a.alarmActive && b.alarmActive) return 1;
    if (a.running && !b.running) return -1;
    if (!a.running && b.running) return 1;
    if (a.running && b.running) {
      const aRemaining = a.startedAt ? Math.max(0, a.remainingMs - (Date.now() - a.startedAt)) : a.remainingMs;
      const bRemaining = b.startedAt ? Math.max(0, b.remainingMs - (Date.now() - b.startedAt)) : b.remainingMs;
      return aRemaining - bRemaining;
    }
    return 0;
  });

  return (
    <div className="cooking-timer-page">
      {/* Header */}
      <header className="cooking-header">
        <h1 className="cooking-title">Cooking Timers</h1>
        <HomeButton />
      </header>

      {/* Preset Buttons */}
      <div className="cooking-presets">
        {COOKING_PRESETS.map(preset => (
          <button
            key={preset.id}
            type="button"
            className="cooking-preset-btn"
            onClick={() => addTimer(preset.id)}
            disabled={st.timers.length >= MAX_TIMERS}
          >
            <span className="preset-emoji">{preset.emoji}</span>
            <span className="preset-label">{preset.label}</span>
          </button>
        ))}
        <button
          type="button"
          className="cooking-preset-btn custom"
          onClick={() => addTimer('custom')}
          disabled={st.timers.length >= MAX_TIMERS}
        >
          <span className="preset-emoji">⏱️</span>
          <span className="preset-label">Custom</span>
        </button>
      </div>

      {/* Timer Counter */}
      <div className="cooking-counter">
        {st.timers.length} / {MAX_TIMERS} Timers
      </div>

      {/* Active Timers */}
      <div className="cooking-timers-list">
        {sortedTimers.map(timer => {
          const currentRemaining = timer.running && timer.startedAt
            ? Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt))
            : timer.remainingMs;
          const progress = (currentRemaining / timer.durationMs) * 100;
          const isAlarming = timer.alarmActive && timer.alarmStartedAt && (Date.now() - timer.alarmStartedAt) < 60000;

          return (
            <div
              key={timer.id}
              className={`cooking-timer-card ${timer.alarmActive ? 'alarming' : ''} ${isAlarming ? 'audio-alarm' : ''}`}
              style={{ borderLeftColor: timer.color, borderLeftWidth: '8px', borderLeftStyle: 'solid' }}
            >
              <div className="timer-card-header" style={{ backgroundColor: `${timer.color}40` }}>
                <h3 className="timer-name">{timer.name}</h3>
                <button
                  type="button"
                  className="timer-delete-btn"
                  onClick={() => deleteTimer(timer.id)}
                  title="Delete timer"
                >
                  ✕
                </button>
              </div>

              <div className="timer-card-body">
                <div className="timer-display">{fmt(currentRemaining)}</div>
                <div className="timer-progress-container">
                  <div
                    className="timer-progress-bar"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: timer.color
                    }}
                  />
                </div>

                <div className="timer-controls">
                  {!timer.alarmActive ? (
                    <>
                      {!timer.running ? (
                        <button type="button" className="timer-btn primary" onClick={() => startTimer(timer.id)}>
                          Start
                        </button>
                      ) : (
                        <button type="button" className="timer-btn primary" onClick={() => pauseTimer(timer.id)}>
                          Pause
                        </button>
                      )}
                      <button type="button" className="timer-btn secondary" onClick={() => resetTimer(timer.id)}>
                        Reset
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="timer-btn alarm-stop" onClick={() => stopAlarm(timer.id)}>
                        Stop Alarm
                      </button>
                      <button type="button" className="timer-btn extend" onClick={() => extendTimer(timer.id, 1)}>
                        +1 min
                      </button>
                      <button type="button" className="timer-btn extend" onClick={() => extendTimer(timer.id, 2)}>
                        +2 min
                      </button>
                      <button type="button" className="timer-btn extend" onClick={() => extendTimer(timer.id, 5)}>
                        +5 min
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {st.timers.length === 0 && (
          <div className="cooking-empty-state">
            <p>No timers yet. Click a preset above to start!</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit Cooking Timer page**

```bash
git add src/pages/CookingTimer.tsx
git commit -m "feat(cooking): replace Cycle Timer with Cooking Timer page"
```

---

## Task 4: Create Cooking Timer Styles

**Files:**
- Create: `src/styles/cooking-swiss.css`
- Modify: `src/styles.css` (update import)

**Step 1: Write the CSS styles**

Create `src/styles/cooking-swiss.css`:

```css
/* ============================================
 * COOKING TIMER - Multi-Timer Kitchen Page
 * Soft colors, card layout, visual alarms
 * ============================================ */

.cooking-timer-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8) var(--space-4);
  background: linear-gradient(135deg,
    var(--ocean-deep) 0%,
    var(--ocean-dark) 100%);
}

/* Header */
.cooking-header {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.cooking-title {
  font-size: var(--type-2xl);
  font-weight: var(--font-bold);
  letter-spacing: 0.05em;
  color: var(--neutral-white);
}

/* Preset Buttons */
.cooking-presets {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
  max-width: 900px;
  margin-bottom: var(--space-6);
}

.cooking-preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: var(--neutral-white);
  cursor: pointer;
  transition: all 0.3s ease;
}

.cooking-preset-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.cooking-preset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preset-emoji {
  font-size: var(--type-2xl);
}

.preset-label {
  font-size: var(--type-sm);
  font-weight: var(--font-semibold);
}

/* Timer Counter */
.cooking-counter {
  font-size: var(--type-base);
  color: var(--ocean-bright);
  margin-bottom: var(--space-6);
  font-weight: var(--font-semibold);
}

/* Timers List */
.cooking-timers-list {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Timer Card */
.cooking-timer-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cooking-timer-card.alarming {
  animation: pulse 1s ease-in-out infinite;
}

.cooking-timer-card.audio-alarm {
  box-shadow: 0 8px 32px rgba(255, 0, 0, 0.4);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(255, 0, 0, 0.4);
  }
}

/* Card Header */
.timer-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
}

.timer-name {
  font-size: var(--type-lg);
  font-weight: var(--font-bold);
  color: var(--ocean-deep);
  margin: 0;
}

.timer-delete-btn {
  background: transparent;
  border: none;
  color: var(--ocean-deep);
  font-size: var(--type-xl);
  cursor: pointer;
  padding: var(--space-1);
  line-height: 1;
  transition: all 0.2s ease;
}

.timer-delete-btn:hover {
  color: #EF4444;
  transform: scale(1.2);
}

/* Card Body */
.timer-card-body {
  padding: var(--space-6) var(--space-4);
  background: rgba(255, 255, 255, 0.02);
}

.timer-display {
  font-size: var(--type-5xl);
  font-weight: var(--font-bold);
  font-family: 'Courier New', monospace;
  color: var(--neutral-white);
  text-align: center;
  margin-bottom: var(--space-4);
}

/* Progress Bar */
.timer-progress-container {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: var(--space-6);
}

.timer-progress-bar {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 6px;
}

/* Controls */
.timer-controls {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
}

.timer-btn {
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: 8px;
  font-size: var(--type-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timer-btn.primary {
  background: rgba(255, 255, 255, 0.9);
  color: var(--ocean-deep);
  padding: var(--space-4) var(--space-8);
}

.timer-btn.primary:hover {
  background: var(--neutral-white);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.timer-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: var(--neutral-white);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.timer-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

.timer-btn.alarm-stop {
  background: #EF4444;
  color: var(--neutral-white);
  font-size: var(--type-lg);
  padding: var(--space-4) var(--space-8);
}

.timer-btn.alarm-stop:hover {
  background: #DC2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.timer-btn.extend {
  background: var(--aurora-cyan);
  color: var(--ocean-deep);
  font-weight: var(--font-bold);
}

.timer-btn.extend:hover {
  background: #00C9EF;
  transform: translateY(-2px);
}

/* Empty State */
.cooking-empty-state {
  text-align: center;
  padding: var(--space-12);
  color: var(--ocean-bright);
  font-size: var(--type-lg);
}

/* Responsive */
@media (max-width: 640px) {
  .cooking-timer-page {
    padding: var(--space-4) var(--space-3);
  }

  .cooking-presets {
    gap: var(--space-2);
  }

  .cooking-preset-btn {
    padding: var(--space-2) var(--space-3);
  }

  .preset-emoji {
    font-size: var(--type-xl);
  }

  .timer-display {
    font-size: var(--type-3xl);
  }

  .timer-controls {
    flex-direction: column;
    width: 100%;
  }

  .timer-btn {
    width: 100%;
  }
}
```

**Step 2: Update styles.css import**

In `src/styles.css`, find the line with `@import './styles/cycle-swiss.css';` (if it exists) and replace it with:

```css
@import './styles/cooking-swiss.css';
```

If no cycle-swiss.css import exists, add this line after the other Swiss imports.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit styles**

```bash
git add src/styles/cooking-swiss.css src/styles.css
git commit -m "feat(cooking): add CSS styling for cooking timer cards and presets"
```

---

## Task 5: Update Routing

**Files:**
- Modify: `src/main.tsx`

**Step 1: Update CycleTimer import to CookingTimer**

Find this line:
```typescript
import CycleTimer from "./pages/CycleTimer";
```

Replace with:
```typescript
import CookingTimer from "./pages/CookingTimer";
```

**Step 2: Update timer grid entry**

Find the `timers` array entry for Cycle Timer:
```typescript
{ route: "#/cycle", label: "Cycle Timer", color: "#10B981", colorRgb: "16, 185, 129" },
```

Replace with:
```typescript
{ route: "#/cycle", label: "Cooking", color: "#FFB3BA", colorRgb: "255, 179, 186" },
```

**Step 3: Update route condition**

Find this line:
```typescript
{route === "/cycle" && <CycleTimer />}
```

Replace with:
```typescript
{route === "/cycle" && <CookingTimer />}
```

**Step 4: Update icon**

Find the "Cycle Timer" icon in the `TimerIcon` component and replace with:

```typescript
"Cooking": (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11h18M3 15h18"/>
    <circle cx="12" cy="12" r="9"/>
    <path d="M8 8h8v8H8z"/>
  </svg>
),
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 6: Commit routing changes**

```bash
git add src/main.tsx
git commit -m "feat(cooking): replace Cycle Timer route with Cooking Timer"
```

---

## Task 6: Update Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update routing section**

Find the line:
```markdown
- `#/cycle` → Cycle Timer
```

Replace with:
```markdown
- `#/cycle` → Cooking Timer (multi-timer kitchen page)
```

**Step 2: Update timer types section**

Find the line mentioning CycleTimerState (if it exists) and replace with:
```markdown
- `CookingTimerState` → Cooking Timer (includes multiple simultaneous timers with presets)
```

**Step 3: Commit documentation**

```bash
git add CLAUDE.md
git commit -m "docs: update routing and types to reflect Cooking Timer"
```

---

## Task 7: Final Build and Verification

**Files:**
- None (verification only)

**Step 1: Clean build**

Run: `npm run build`
Expected: Build succeeds with no warnings or errors

**Step 2: Verify bundle sizes**

Check console output:
- CSS bundle should be < 65KB
- JS bundle should be < 220KB

**Step 3: Test in browser**

Run: `npm run dev`
Navigate to: `http://localhost:5173/#/cycle`

**Verify:**
1. Preset buttons create timers with correct default times
2. Colors auto-rotate across new timers
3. Timer countdown works when started
4. Progress bar animates
5. Alarm triggers at 0:00 with audio for 60s
6. Extension buttons (+1, +2, +5) stop alarm and restart timer
7. Stop Alarm button dismisses alarm
8. Timers sort by remaining time (soonest first)
9. Page refresh preserves stopped timers

**Step 4: Final commit if needed**

If fixes were needed:
```bash
git add .
git commit -m "fix(cooking): final verification fixes"
```

---

## Complete Implementation Checklist

- [ ] Task 1: TypeScript types defined
- [ ] Task 2: Preset configuration created
- [ ] Task 3: Cooking Timer page component
- [ ] Task 4: CSS styling
- [ ] Task 5: Routing updated
- [ ] Task 6: Documentation updated
- [ ] Task 7: Production build verified

---

## Notes for Engineer

**Color Auto-Rotation:**
- `nextColorIndex` tracks which color to use next (0-9)
- Wraps around using modulo for infinite rotation
- User could manually override colors in future enhancement

**Alarm Design:**
- 60-second audio limit prevents annoyance
- Visual pulsing continues indefinitely until dismissed
- Extension immediately stops alarm and starts new countdown

**Sorting Logic:**
- Alarming timers always first (most urgent)
- Running timers next, sorted by soonest completion
- Stopped timers last, maintain original order

**State Management:**
- `startedAt` tracks when timer was started
- Calculate current remaining: `remainingMs - (now - startedAt)`
- On pause: update `remainingMs` to current remaining, clear `startedAt`

**Performance:**
- Only one requestAnimationFrame loop for all running timers
- Audio context shared across all alarming timers
- No excessive re-renders (useCallback, stable state updates)

**Future Enhancements (Not in MVP):**
- Custom time input for "Custom" preset
- Color picker for manual color override
- Timer templates/favorites
- Sound selection
- Notification API integration
