# Implementation Plan: UI/UX Redesign - Timer Interface Consistency
**Feature**: Unified Navigation, Layout Standards, and Enhanced Timer Features
**Target**: Professional, consistent user interface across all timer types
**Audience**: Engineer with zero codebase context implementing this plan

---

## Executive Summary

This plan implements a comprehensive UI/UX redesign to create visual consistency, improve navigation, and add critical missing features. The redesign follows strict layout principles while enhancing functionality.

**Core Principles**:
1. **Navigation Consistency**: Home button ALWAYS top-left, identical design/size
2. **Layout Hierarchy**: Action buttons grouped logically, configuration elements centered
3. **Color Coding**: Distinct colors for action vs configuration buttons
4. **Feature Completeness**: Add missing features (cycle limits, pause intervals, current time display)

**Estimated Effort**: 12-16 hours
**Risk Level**: Medium (requires TypeScript changes + CSS refactoring)

---

## Context & Current State

### Current Problems Identified

**Problem 1: Inconsistent Home Button Placement**
- Analog Countdown: Home button in `analog-topbar`, left side
- Chess Clock: Home button in `chess-controls`, center area
- Other timers: Various placements
- **Impact**: Users must hunt for navigation on each page

**Problem 2: Action Button Grouping**
- Analog Countdown: Buttons spread across topbar (not grouped right)
- No clear visual separation between actions and configurations

**Problem 3: Chess Clock Layout**
- Horizontal player separation makes Home button placement awkward
- Controls centered between players (not neutral space)

**Problem 4: Missing Features**
- Cycle Timer: No cycle count limit (runs forever)
- Cycle Timer: No pause between cycles configuration
- Alarm: No current time display (users don't know what time it is)

**Problem 5: Color Schema**
- Configuration buttons use same colors as action buttons
- No visual distinction between "settings" and "actions"

---

## Requirements

### Functional Requirements (FR)

**FR-1: Unified Home Button**
- Home button appears on ALL timer pages
- Position: **Top-left corner** (consistent across all timers)
- Size: **Identical dimensions** (56px min-height)
- Design: **Same visual style** (blue primary color, home icon)
- Function: Navigate to `#/` (home page)

**FR-2: Analog Countdown - Repositioned Controls**
- Action buttons grouped **top-right** of screen
- Buttons included: Start/Pause, Reset, +1m, -1m, Fullscreen
- Time display (HMS) remains **center-top**
- Configuration elements (presets, warn at, sound/flash) remain **bottom**

**FR-3: Chess Clock - Vertical Layout**
- Players separated **vertically** (Player 1 top, Player 2 bottom)
- Neutral control area between players (Home, Reset buttons)
- Home button: **Top-left** (above Player 1 area)
- Each player area: Full-width clickable zone

**FR-4: Alarm - Current Time Display**
- Current time shown **top-center** or **top-right**
- Updates every second
- Format: HH:MM:SS (24-hour) or HH:MM AM/PM (user preference?)
- Clearly labeled "Current Time:" or similar

**FR-5: Cycle Timer - Cycle Limit Configuration**
- New input field: "Total Cycles" (1-99)
- Default: Infinite (0 or unchecked "unlimited" checkbox)
- When limit reached, timer **stops** (not restart)
- Display: "Cycle X of Y" during running

**FR-6: Cycle Timer - Pause Between Cycles**
- New input field: "Pause Between Cycles" (0-600 seconds)
- Default: **1 second**
- Minimum: **0 seconds** (seamless transition)
- Applied after cycle completion, before next cycle starts

**FR-7: Color-Coded Button System**
- **Action buttons** (Start/Pause/Stop): Success green (#3fb950) or Danger red (#f85149)
- **Configuration buttons** (Presets, Settings): Muted gray (#9aa4b2 background, transparent)
- **Navigation buttons** (Home): Primary blue (#58a6ff)
- **Reset buttons**: Neutral gray (border only, no background)

### Non-Functional Requirements (NFR)

**NFR-1: Visual Consistency**
- All Home buttons use `.btn-home` class
- All action buttons use `.btn.primary` or `.btn.danger`
- All config buttons use new `.btn-config` class
- CSS variables used for all colors (no hardcoded values)

**NFR-2: Responsive Behavior**
- Layout adapts to mobile (320px) without breaking
- Home button remains visible in fullscreen mode
- Button groups stack vertically on narrow screens (<600px)

**NFR-3: Accessibility**
- Keyboard navigation works (Tab order: Home → Actions → Config)
- Focus indicators visible on all buttons
- Screen reader labels for icon-only buttons

---

## Success Criteria

### Quantitative Metrics
1. **Navigation**: Home button in top-left on 100% of timer pages
2. **Layout**: Action buttons grouped in designated area (top-right for Analog)
3. **Cycle Timer**: Stops after reaching cycle limit (testable with limit=3)
4. **Color Coding**: 100% of config buttons use muted color scheme

### Qualitative Metrics
1. **User Testing**: Users can navigate without thinking "Where's the Home button?"
2. **Visual Harmony**: Designer confirms color coding makes sense at a glance
3. **Professional Feel**: Interface feels "cohesive" and "intentional"

### Testing Scenarios

**Test 1: Navigation Consistency**
- Visit each timer page (#/analog, #/countdown, #/chess, etc.)
- Home button should be in **exact same position** (top-left) on all pages
- Click Home from each page → should return to home grid

**Test 2: Analog Countdown Layout**
- Action buttons (Start/Pause, Reset, +1m, -1m, Fullscreen) grouped **top-right**
- Time display (HH:MM:SS) visible **center-top**
- Config elements (presets, warn at, sound/flash) at **bottom**

**Test 3: Chess Clock Vertical Layout**
- Player 1 area: **Top half** of screen
- Player 2 area: **Bottom half** of screen
- Home button: **Top-left corner** (neutral, not in player area)
- Click Player 1 area → Player 1 timer runs, Player 2 pauses
- Click Player 2 area → Player 2 timer runs, Player 1 pauses

**Test 4: Alarm Current Time**
- Open Alarm timer (#/alarm)
- Current time visible at **top of page**
- Updates every second
- Time matches system clock

**Test 5: Cycle Timer Limits**
- Set "Total Cycles" to 3
- Set "Interval" to 5 seconds
- Set "Pause Between Cycles" to 2 seconds
- Click Start
- **Expected**:
  - Cycle 1: 5s countdown → beep → 2s pause
  - Cycle 2: 5s countdown → beep → 2s pause
  - Cycle 3: 5s countdown → beep → **STOP** (no restart)
  - Display shows "Cycle 1 of 3", "Cycle 2 of 3", "Cycle 3 of 3"

**Test 6: Cycle Timer Seamless Mode**
- Set "Total Cycles" to unlimited (0 or unchecked)
- Set "Pause Between Cycles" to **0 seconds**
- Click Start
- **Expected**: Cycles restart immediately with no pause (seamless)

---

## Architecture & Design

### Design System Updates

**New Color Tokens** (add to `:root` in styles.css):
```css
/* Button Role Colors */
--btn-action-success: var(--color-success);  /* #3fb950 - Start/Play */
--btn-action-danger: var(--color-danger);    /* #f85149 - Stop/Pause */
--btn-config: rgba(154, 164, 178, 0.1);      /* Muted bg for config */
--btn-config-text: var(--color-muted);       /* #9aa4b2 - Config text */
--btn-nav-primary: var(--color-primary);     /* #58a6ff - Navigation */
```

**New CSS Classes**:
```css
/* Configuration Button Style */
.btn-config {
  background: var(--btn-config);
  border: 1px solid var(--color-border);
  color: var(--btn-config-text);
  font-size: 14px;
  padding: 8px 16px;
  min-height: 40px; /* Smaller than action buttons */
}

.btn-config:hover {
  background: rgba(154, 164, 178, 0.15);
  border-color: var(--color-muted);
}

/* Unified Home Button */
.btn-home {
  position: absolute;
  top: 16px;
  left: 16px;
  min-width: 100px;
  min-height: 56px;
  background: var(--btn-nav-primary);
  color: #fff;
  font-weight: 600;
  z-index: 100; /* Above other elements */
}
```

### Layout Patterns

**Pattern 1: Standard Timer Layout**
```
┌─────────────────────────────────────────┐
│ [Home]                    [Action Btns] │ ← Top bar (fixed height: 80px)
├─────────────────────────────────────────┤
│                                         │
│          TIMER DISPLAY                  │ ← Center area (flex: 1)
│          (Large Numbers)                │
│                                         │
├─────────────────────────────────────────┤
│      [Config Elements Centered]         │ ← Bottom bar (auto height)
└─────────────────────────────────────────┘
```

**Pattern 2: Analog Countdown (Updated)**
```
┌─────────────────────────────────────────┐
│ [Home]    [HH:MM:SS]    [Start] [Reset] │
│                          [+1m] [-1m]     │ ← Buttons grouped right
│                          [Fullscreen]    │
├─────────────────────────────────────────┤
│                                         │
│        ANALOG CLOCK FACE                │
│        (Canvas)                         │
│                                         │
├─────────────────────────────────────────┤
│ [5m][10m][15m]...[4h] [Warn:1m▼]       │
│ [☑Sound] [☑Flash]                      │
└─────────────────────────────────────────┘
```

**Pattern 3: Chess Clock (Vertical Layout)**
```
┌─────────────────────────────────────────┐
│ [Home]                                  │ ← Home button top-left
├─────────────────────────────────────────┤
│                                         │
│  ♔ Player 1                             │
│  05:00 (ACTIVE - glowing)               │ ← Click to start P1 timer
│                                         │
├─────────────────────────────────────────┤
│     [Reset]  [Settings]                 │ ← Neutral control zone
├─────────────────────────────────────────┤
│                                         │
│  ♚ Player 2                             │
│  05:00 (inactive)                       │ ← Click to start P2 timer
│                                         │
└─────────────────────────────────────────┘
```

**Pattern 4: Alarm (With Current Time)**
```
┌─────────────────────────────────────────┐
│ [Home]          Current Time: 14:32:15  │ ← Current time top-right
├─────────────────────────────────────────┤
│                                         │
│      Alarm Time: 06:30 AM               │
│      [Set Alarm]                        │
│                                         │
│      Active Alarms:                     │
│      • 06:30 AM (Daily) [×]             │
│      • 14:00 (Today) [×]                │
│                                         │
└─────────────────────────────────────────┘
```

---

## Implementation Tasks

### Task 1: Create Unified Home Button Component
**Files**:
- `src/components/HomeButton.tsx` (NEW)
- `src/styles.css` (update `.btn-home` class)

**Actions**:
1. Create reusable `HomeButton` component
2. Add to all timer pages (replace inline `<a href="#/">`)
3. Update CSS for consistent positioning (absolute top-left)

**New Component Code**:
```tsx
// src/components/HomeButton.tsx
import React from 'react';

interface HomeButtonProps {
  className?: string;
}

export function HomeButton({ className = '' }: HomeButtonProps) {
  return (
    <a href="#/" className={`btn-home ${className}`}>
      <span className="home-icon">⌂</span>
      <span className="home-text">Home</span>
    </a>
  );
}
```

**CSS Updates**:
```css
/* Unified Home Button - Always top-left */
.btn-home {
  position: fixed; /* Changed from absolute for consistency */
  top: var(--spacing-lg); /* 16px */
  left: var(--spacing-lg);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm); /* 8px between icon and text */
  min-width: 100px;
  min-height: 56px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--btn-nav-primary);
  color: #fff;
  font-weight: var(--font-weight-semibold);
  border-radius: 12px;
  text-decoration: none;
  z-index: 1000; /* Above other content */
  transition: all 0.2s ease;
}

.btn-home:hover {
  background: #4a8edb; /* Slightly darker blue */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 166, 255, 0.3);
}

.home-icon {
  font-size: 24px;
  line-height: 1;
}

.home-text {
  font-size: 16px;
}

/* Responsive: Icon only on narrow screens */
@media (max-width: 500px) {
  .btn-home {
    min-width: 56px;
    padding: var(--spacing-md);
  }

  .home-text {
    display: none; /* Hide text, show only icon */
  }
}
```

**Verification**:
```bash
# Check all timer files use HomeButton component
grep -r "<HomeButton" src/pages/*.tsx | wc -l
# Should equal number of timer pages (9)

# Visual test: Navigate to each timer, Home button in top-left
```

---

### Task 2: Redesign Analog Countdown Layout
**File**: `src/pages/AnalogCountdown.tsx`

**Current Structure** (lines 340-353):
```tsx
<div className="analog-topbar">
  <a href="#/" className="btn-home">Home</a>
  <div className="hms">{fmt(st.remainingMs)}</div>
  <div className="controls">
    <button>Start/Pause</button>
    <button>Reset</button>
    <button>+1m</button>
    <button>-1m</button>
    <button>Fullscreen</button>
  </div>
</div>
```

**Target Structure**:
```tsx
{/* Home button - fixed top-left */}
<HomeButton />

<div className="analog-wrap">
  {/* Top bar with time and action buttons */}
  <div className="analog-topbar">
    <div className="analog-time-display">{fmt(st.remainingMs)}</div>

    <div className="analog-actions">
      <button onClick={() => st.running ? pause() : start()}
              className={st.running ? "btn btn-danger" : "btn btn-success"}>
        {st.running ? "Pause" : "Start"}
      </button>
      <button onClick={reset} className="btn">Reset</button>
      <button onClick={() => plus(60_000)} className="btn">+1m</button>
      <button onClick={() => plus(-60_000)} className="btn">−1m</button>
      <button onClick={full} className="btn">Fullscreen</button>
    </div>
  </div>

  {/* Canvas remains unchanged */}
  <div className="analog-canvas"><canvas ref={cnvRef}/></div>

  {/* Config elements at bottom */}
  <div className="analog-config">
    {/* Presets */}
    <div className="preset-buttons">
      {presets.map(min => (
        <button key={min} className="btn-config" onClick={() => setDur(min * 60_000)}>
          {min >= 60 ? `${min/60}h` : `${min}m`}
        </button>
      ))}
    </div>

    {/* Settings row */}
    <div className="config-row">
      <label className="config-item">
        Warn at:
        <select className="config-select" value={String(st.warnAtMs ?? 0)}
                onChange={(e) => setSt(s => ({...s, warnAtMs: Number(e.target.value) || null}))}>
          <option value="0">off</option>
          <option value="60000">1m</option>
          <option value="300000">5m</option>
          <option value="600000">10m</option>
        </select>
      </label>

      <label className="config-item">
        <input type="checkbox" checked={st.signal.sound}
               onChange={e => setSt(s => ({...s, signal: {...s.signal, sound: e.target.checked}}))}/>
        Sound
      </label>

      <label className="config-item">
        <input type="checkbox" checked={st.signal.flash}
               onChange={e => setSt(s => ({...s, signal: {...s.signal, flash: e.target.checked}}))}/>
        Flash
      </label>
    </div>
  </div>
</div>
```

**CSS Updates** (add to styles.css):
```css
/* Analog Countdown - Updated Layout */
.analog-wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 88px; /* Space for fixed home button */
}

.analog-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-bottom: 1px solid var(--color-border);
}

.analog-time-display {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: var(--font-weight-semibold);
  color: var(--color-fg);
  font-variant-numeric: tabular-nums; /* Monospace digits */
}

.analog-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.analog-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analog-config {
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-top: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.02);
}

.preset-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.config-row {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.config-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--btn-config-text);
  font-size: 14px;
}

.config-select {
  background: var(--btn-config);
  border: 1px solid var(--color-border);
  color: var(--color-fg);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
}

/* Success/Danger button states */
.btn-success {
  background: var(--btn-action-success);
  border-color: var(--btn-action-success);
  color: #fff;
}

.btn-danger {
  background: var(--btn-action-danger);
  border-color: var(--btn-action-danger);
  color: #fff;
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .analog-topbar {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .analog-actions {
    justify-content: center;
  }
}
```

**Verification**:
- Open http://localhost:5173/#/analog
- Home button: Top-left ✓
- Time display: Center-top ✓
- Action buttons: Right side (stacked on mobile) ✓
- Config elements: Bottom, centered ✓

---

### Task 3: Redesign Chess Clock - Vertical Layout
**File**: `src/pages/ChessClock.tsx`

**Current Structure** (horizontal players):
```tsx
<div className="chess-wrap">
  <div className="player player-1">...</div> {/* Left side */}
  <div className="chess-controls">...</div>   {/* Center */}
  <div className="player player-2">...</div> {/* Right side */}
</div>
```

**Target Structure** (vertical players):
```tsx
<div className="chess-wrap">
  {/* Home button - fixed top-left */}
  <HomeButton />

  {/* Player 1 - Top half */}
  <div className={`chess-player chess-player-1 ${st.activePlayer === 1 ? 'active' : ''}`}
       onClick={() => switchToPlayer(1)}>
    <div className="chess-piece">♔</div>
    <div className="player-label">Player 1</div>
    <div className="player-time">{fmt(currentP1Time)}</div>
  </div>

  {/* Neutral control zone */}
  <div className="chess-controls">
    <button className="btn" onClick={reset}>Reset</button>
    <button className="btn-config" onClick={() => setShowSettings(!showSettings)}>
      Settings
    </button>
  </div>

  {/* Player 2 - Bottom half */}
  <div className={`chess-player chess-player-2 ${st.activePlayer === 2 ? 'active' : ''}`}
       onClick={() => switchToPlayer(2)}>
    <div className="chess-piece">♚</div>
    <div className="player-label">Player 2</div>
    <div className="player-time">{fmt(currentP2Time)}</div>
  </div>
</div>
```

**CSS Updates** (replace chess clock styles):
```css
/* Chess Clock - Vertical Layout */
.chess-wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chess-player {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  user-select: none;
}

/* Player 1 - Top (White) */
.chess-player-1 {
  background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
  color: #000;
  border-bottom: 4px solid var(--color-border);
}

.chess-player-1.active {
  background: linear-gradient(180deg, #ffffff 0%, #f0f8ff 100%);
  border-bottom-color: var(--color-primary);
  box-shadow: inset 0 0 40px rgba(88, 166, 255, 0.2);
}

/* Player 2 - Bottom (Black) */
.chess-player-2 {
  background: linear-gradient(180deg, #2a2a2a 0%, #000000 100%);
  color: #fff;
  border-top: 4px solid var(--color-border);

  /* Rotate content for opposite player */
  transform: rotate(180deg);
}

.chess-player-2.active {
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a2e 100%);
  border-top-color: var(--color-primary);
  box-shadow: inset 0 0 40px rgba(88, 166, 255, 0.2);
}

/* Undo rotation for player 2 content */
.chess-player-2 > * {
  transform: rotate(180deg);
}

.chess-piece {
  font-size: clamp(64px, 12vw, 120px);
  line-height: 1;
}

.player-label {
  font-size: clamp(18px, 3vw, 24px);
  font-weight: var(--font-weight-semibold);
  opacity: 0.7;
}

.player-time {
  font-size: clamp(48px, 10vw, 96px);
  font-weight: var(--font-weight-bold);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

/* Neutral control zone between players */
.chess-controls {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* Inactive state - dimmed */
.chess-player:not(.active) {
  opacity: 0.6;
}

/* Hover effect (only when not active) */
.chess-player:not(.active):hover {
  opacity: 0.8;
  transform: scale(1.01);
}

/* Mobile: Reduce font sizes */
@media (max-width: 600px) {
  .chess-controls {
    flex-direction: column;
  }
}
```

**TypeScript Updates** (ChessClock.tsx):
```tsx
// Add showSettings state
const [showSettings, setShowSettings] = useState(false);

// Ensure switchToPlayer function exists
const switchToPlayer = (player: 1 | 2) => {
  if (st.activePlayer === player) return; // Already active

  const now = Date.now();

  setSt(s => {
    // Calculate remaining time for current player
    const currentRemaining = s.activePlayer === 1 ? currentP1Time : currentP2Time;

    return {
      ...s,
      activePlayer: player,
      p1Remaining: player === 1 ? currentRemaining : s.p1Remaining,
      p2Remaining: player === 2 ? currentRemaining : s.p2Remaining,
      lastSwitch: now
    };
  });
};
```

**Verification**:
- Open http://localhost:5173/#/chess
- Home button: Top-left, above Player 1 ✓
- Player 1: Top half, white background ✓
- Player 2: Bottom half, black background, rotated 180° ✓
- Controls: Centered between players ✓
- Click Player 1 area → P1 timer runs ✓
- Click Player 2 area → P2 timer runs ✓

---

### Task 4: Add Current Time to Alarm Timer
**File**: `src/pages/Alarm.tsx`

**Actions**:
1. Add `currentTime` state that updates every second
2. Display current time top-right of page
3. Format as HH:MM:SS (24-hour clock)

**TypeScript Updates**:
```tsx
// Add currentTime state
const [currentTime, setCurrentTime] = useState(new Date());

// Update current time every second
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);

// Format current time
const formatCurrentTime = (date: Date): string => {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};
```

**JSX Updates** (add to render):
```tsx
<div className="alarm-wrap">
  <HomeButton />

  {/* Current time display */}
  <div className="alarm-header">
    <div className="current-time">
      <span className="current-time-label">Current Time:</span>
      <span className="current-time-value">{formatCurrentTime(currentTime)}</span>
    </div>
  </div>

  {/* Rest of alarm UI */}
  <div className="alarm-content">
    {/* Existing alarm settings */}
  </div>
</div>
```

**CSS Updates**:
```css
/* Alarm - Current Time Display */
.alarm-wrap {
  padding-top: 88px; /* Space for home button */
}

.alarm-header {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-bottom: 1px solid var(--color-border);
}

.current-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.current-time-label {
  font-size: 13px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.current-time-value {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: var(--font-weight-bold);
  font-variant-numeric: tabular-nums;
  color: var(--color-primary);
}

/* Mobile: Center current time */
@media (max-width: 600px) {
  .alarm-header {
    justify-content: center;
  }

  .current-time {
    align-items: center;
  }
}
```

**Verification**:
- Open http://localhost:5173/#/alarm
- Current time visible top-right ✓
- Updates every second ✓
- Matches system clock ✓

---

### Task 5: Add Cycle Limit to Cycle Timer
**File**: `src/pages/CycleTimer.tsx`

**Current State**:
- Cycles run infinitely
- `cycleCount` increments but never stops timer

**Target State**:
- User sets `maxCycles` (1-99, or 0/unchecked for unlimited)
- When `cycleCount >= maxCycles`, timer stops (doesn't restart)
- Display shows "Cycle X of Y" during running

**TypeScript Updates**:

**1. Update Persist type** (add `maxCycles` and `pauseBetweenCyclesMs`):
```tsx
type Persist = {
  version: 1;
  intervalMs: number;
  remainingMs: number;
  running: boolean;
  endAt: number | null;
  cycleCount: number;
  maxCycles: number; // NEW: 0 = unlimited, 1-99 = limit
  pauseBetweenCyclesMs: number; // NEW: pause duration (0-600000ms)
  signal: { sound: boolean; flash: boolean };
};
```

**2. Update load() function**:
```tsx
function load(): Persist {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) throw new Error("No saved state");
    const p = JSON.parse(raw) as Persist;
    return {
      version: 1,
      intervalMs: clamp(p.intervalMs ?? 60_000, 1000, MAX),
      remainingMs: clamp(p.remainingMs ?? 60_000, 0, MAX),
      running: !!p.running,
      endAt: p.endAt ?? null,
      cycleCount: p.cycleCount ?? 0,
      maxCycles: clamp(p.maxCycles ?? 0, 0, 99), // NEW
      pauseBetweenCyclesMs: clamp(p.pauseBetweenCyclesMs ?? 1000, 0, 600_000), // NEW: default 1s
      signal: { sound: !!p.signal?.sound, flash: !!p.signal?.flash }
    };
  } catch {
    return {
      version: 1,
      intervalMs: 60_000,
      remainingMs: 60_000,
      running: false,
      endAt: null,
      cycleCount: 0,
      maxCycles: 0, // NEW: unlimited by default
      pauseBetweenCyclesMs: 1000, // NEW: 1 second default
      signal: { sound: true, flash: true }
    };
  }
}
```

**3. Update sync() function** (add pause + limit logic):
```tsx
const sync = useCallback(() => {
  if (!st.running || !st.endAt) return;
  const now = Date.now();
  const rem = Math.max(0, st.endAt - now);

  if (rem === 0) {
    // Cycle completed
    if (st.signal.flash) flash(wrapRef.current, 400);
    if (st.signal.sound) beep(200, 880);

    const nextCycleCount = st.cycleCount + 1;
    const hasReachedLimit = st.maxCycles > 0 && nextCycleCount >= st.maxCycles;

    if (hasReachedLimit) {
      // STOP: Reached cycle limit
      setSt(s => ({
        ...s,
        running: false,
        endAt: null,
        remainingMs: 0,
        cycleCount: nextCycleCount
      }));
    } else if (st.pauseBetweenCyclesMs > 0) {
      // PAUSE: Apply pause between cycles
      setSt(s => ({
        ...s,
        running: false, // Temporarily pause
        endAt: null,
        remainingMs: s.intervalMs,
        cycleCount: nextCycleCount
      }));

      // Auto-resume after pause
      setTimeout(() => {
        setSt(s => ({
          ...s,
          running: true,
          endAt: Date.now() + s.intervalMs,
          remainingMs: s.intervalMs
        }));
      }, st.pauseBetweenCyclesMs);
    } else {
      // SEAMLESS: Restart immediately (no pause)
      setSt(s => ({
        ...s,
        remainingMs: s.intervalMs,
        endAt: Date.now() + s.intervalMs,
        cycleCount: nextCycleCount
      }));
    }
  } else {
    setSt(s => ({...s, remainingMs: rem}));
  }
}, [st.running, st.endAt, st.remainingMs, st.signal, st.maxCycles, st.pauseBetweenCyclesMs, st.cycleCount, st.intervalMs]);
```

**4. Add UI controls** (JSX):
```tsx
{/* Configuration section */}
<div className="cycle-config">
  {/* Existing interval input */}
  <div className="config-group">
    <label>Interval Duration:</label>
    <input type="time" step="1" ... />
  </div>

  {/* NEW: Max cycles input */}
  <div className="config-group">
    <label>Total Cycles:</label>
    <input
      type="number"
      min="0"
      max="99"
      value={st.maxCycles}
      onChange={(e) => setSt(s => ({...s, maxCycles: clamp(Number(e.target.value) || 0, 0, 99)}))}
      className="config-input"
    />
    <span className="config-hint">(0 = unlimited)</span>
  </div>

  {/* NEW: Pause between cycles */}
  <div className="config-group">
    <label>Pause Between Cycles:</label>
    <input
      type="number"
      min="0"
      max="600"
      step="1"
      value={st.pauseBetweenCyclesMs / 1000}
      onChange={(e) => setSt(s => ({
        ...s,
        pauseBetweenCyclesMs: clamp(Number(e.target.value) || 0, 0, 600) * 1000
      }))}
      className="config-input"
    />
    <span className="config-unit">seconds</span>
  </div>
</div>

{/* Display cycle progress */}
<div className="cycle-info">
  {st.maxCycles > 0 ? (
    <span>Cycle {st.cycleCount} of {st.maxCycles}</span>
  ) : (
    <span>Cycle {st.cycleCount}</span>
  )}
</div>
```

**CSS Updates**:
```css
/* Cycle Timer - Configuration */
.cycle-config {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.config-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.config-group label {
  flex: 0 0 180px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-fg);
}

.config-input {
  flex: 1;
  max-width: 120px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--btn-config);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-fg);
  font-size: 16px;
  text-align: center;
}

.config-hint {
  color: var(--color-muted);
  font-size: 13px;
}

.config-unit {
  color: var(--color-muted);
  font-size: 14px;
}

.cycle-info {
  text-align: center;
  padding: var(--spacing-lg);
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}
```

**Verification Test**:
```javascript
// Test scenario 1: Limited cycles with pause
// - Set maxCycles: 3
// - Set interval: 5 seconds
// - Set pause: 2 seconds
// Expected: 5s → beep → 2s pause → 5s → beep → 2s pause → 5s → beep → STOP

// Test scenario 2: Unlimited seamless
// - Set maxCycles: 0
// - Set interval: 10 seconds
// - Set pause: 0 seconds
// Expected: 10s → beep → 10s → beep → ... (continues forever)
```

---

### Task 6: Apply Color-Coded Button System
**Files**: All timer pages, `src/styles.css`

**Actions**:
1. Replace all action button classes with semantic colors
2. Add `.btn-config` class to configuration buttons
3. Ensure consistency across all timers

**Button Classification**:

| Button Type | Example | Class | Color |
|-------------|---------|-------|-------|
| **Start/Play** | "Start" | `.btn-success` | Green #3fb950 |
| **Pause** | "Pause" | `.btn-danger` | Red #f85149 |
| **Stop** | "Stop" | `.btn-danger` | Red #f85149 |
| **Reset** | "Reset" | `.btn` | Gray border only |
| **Navigation** | "Home" | `.btn-home` | Blue #58a6ff |
| **Config Presets** | "5m", "10m" | `.btn-config` | Muted gray |
| **Settings** | "Warn at", Sound/Flash | `.config-item` | Muted text |

**CSS Classes** (add to styles.css):
```css
/* Action Button Colors */
.btn-success {
  background: var(--btn-action-success);
  border-color: var(--btn-action-success);
  color: #fff;
  font-weight: var(--font-weight-semibold);
}

.btn-success:hover {
  background: #35a347; /* Slightly darker */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(63, 185, 80, 0.3);
}

.btn-danger {
  background: var(--btn-action-danger);
  border-color: var(--btn-action-danger);
  color: #fff;
  font-weight: var(--font-weight-semibold);
}

.btn-danger:hover {
  background: #e64545; /* Slightly darker */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(248, 81, 73, 0.3);
}

/* Configuration Button */
.btn-config {
  background: var(--btn-config);
  border: 1px solid var(--color-border);
  color: var(--btn-config-text);
  font-size: 14px;
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 40px;
  border-radius: 8px;
  font-weight: var(--font-weight-normal);
  transition: all 0.2s ease;
}

.btn-config:hover {
  background: rgba(154, 164, 178, 0.15);
  border-color: var(--color-muted);
  color: var(--color-fg);
}

.btn-config.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
```

**Component Updates**:

**Countdown.tsx**:
```tsx
{/* Start/Pause - context-aware color */}
<button
  onClick={() => st.running ? pause() : start()}
  className={st.running ? "btn btn-danger" : "btn btn-success"}>
  {st.running ? "Pause" : "Start"}
</button>

{/* Reset - neutral */}
<button onClick={reset} className="btn">Reset</button>

{/* Presets - config style */}
{presets.map(min => (
  <button key={min} className="btn-config" onClick={() => setDur(min * 60_000)}>
    {min}m
  </button>
))}
```

**Stopwatch.tsx**:
```tsx
<button className={st.running ? "btn btn-danger" : "btn btn-success"} onClick={toggle}>
  {st.running ? "Pause" : "Start"}
</button>
```

**Apply to ALL timer pages**:
- AnalogCountdown.tsx
- Countdown.tsx
- Stopwatch.tsx
- CycleTimer.tsx
- Metronome.tsx
- Alarm.tsx
- ChessClock.tsx
- WorldClock.tsx

**Verification**:
```bash
# Check all Start buttons use btn-success
grep -r 'btn-success' src/pages/*.tsx | wc -l
# Should be >= 6 (one per timer with Start button)

# Check presets use btn-config
grep -r 'btn-config' src/pages/*.tsx | wc -l
# Should be >= 3 (timers with preset buttons)
```

---

### Task 7: Global CSS Cleanup & Design Tokens
**File**: `src/styles.css`

**Actions**:
1. Add new color design tokens
2. Remove duplicate/redundant button styles
3. Ensure consistency in spacing values

**Add to `:root`** (after existing tokens):
```css
/* ============================================
 * DESIGN TOKENS - Button Role Colors
 * ============================================ */
--btn-action-success: #3fb950;              /* Start/Play actions */
--btn-action-danger: #f85149;               /* Stop/Pause actions */
--btn-config: rgba(154, 164, 178, 0.1);     /* Configuration button bg */
--btn-config-text: #9aa4b2;                 /* Configuration text color */
--btn-nav-primary: #58a6ff;                 /* Navigation (Home) button */

/* ============================================
 * DESIGN TOKENS - Spacing Scale
 * ============================================ */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
```

**Consolidate Button Styles** (replace scattered `.btn` rules):
```css
/* ============================================
 * BUTTONS - Base & Variants
 * ============================================ */

/* Base button */
.btn {
  padding: var(--spacing-md) var(--spacing-lg);
  min-width: 80px;
  min-height: 56px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: transparent;
  color: var(--color-fg);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-muted);
}

.btn:focus-visible {
  outline: none;
  box-shadow: var(--focus-glow);
}

/* Success button (Start/Play) */
.btn-success {
  background: var(--btn-action-success);
  border-color: var(--btn-action-success);
  color: #fff;
}

.btn-success:hover {
  background: #35a347;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(63, 185, 80, 0.3);
}

/* Danger button (Pause/Stop) */
.btn-danger {
  background: var(--btn-action-danger);
  border-color: var(--btn-action-danger);
  color: #fff;
}

.btn-danger:hover {
  background: #e64545;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(248, 81, 73, 0.3);
}

/* Config button (Presets/Settings) */
.btn-config {
  background: var(--btn-config);
  border: 1px solid var(--color-border);
  color: var(--btn-config-text);
  font-size: 14px;
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 40px;
  font-weight: var(--font-weight-normal);
}

.btn-config:hover {
  background: rgba(154, 164, 178, 0.15);
  border-color: var(--color-muted);
  color: var(--color-fg);
}

/* Home button (Navigation) */
.btn-home {
  position: fixed;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 100px;
  min-height: 56px;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--btn-nav-primary);
  color: #fff;
  font-weight: var(--font-weight-semibold);
  border-radius: 12px;
  text-decoration: none;
  z-index: 1000;
  transition: all 0.2s ease;
}

.btn-home:hover {
  background: #4a8edb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 166, 255, 0.3);
}
```

**Remove Old `.btn.primary` Class** (deprecated):
```bash
# Find and replace in all files
# OLD: className="btn primary"
# NEW: className="btn btn-success" (for Start buttons)
```

---

## Testing & Validation

### Manual Testing Checklist

**Navigation Consistency**:
- [ ] Home button appears in top-left on ALL timer pages
- [ ] Home button has identical size/style on all pages
- [ ] Clicking Home from any page returns to home grid
- [ ] Home button visible in fullscreen mode (if applicable)

**Analog Countdown Layout**:
- [ ] Time display centered at top
- [ ] Action buttons grouped on right (desktop) or below time (mobile)
- [ ] Start button green, Pause button red
- [ ] Config elements (presets, settings) at bottom
- [ ] Preset buttons use muted gray style (btn-config)

**Chess Clock Vertical Layout**:
- [ ] Player 1 occupies top half of screen
- [ ] Player 2 occupies bottom half, rotated 180°
- [ ] Clicking Player 1 area starts P1 timer, pauses P2
- [ ] Clicking Player 2 area starts P2 timer, pauses P1
- [ ] Reset/Settings buttons centered between players
- [ ] Home button in top-left, not overlapping player areas

**Alarm Current Time**:
- [ ] Current time visible at top of page
- [ ] Time updates every second
- [ ] Time matches system clock
- [ ] Labeled clearly ("Current Time:")

**Cycle Timer - Cycle Limits**:
- [ ] "Total Cycles" input field visible (accepts 0-99)
- [ ] Setting to 0 = unlimited cycles (runs forever)
- [ ] Setting to 3: timer stops after 3rd cycle completes
- [ ] Display shows "Cycle X of Y" when limit set
- [ ] Display shows "Cycle X" when unlimited

**Cycle Timer - Pause Between Cycles**:
- [ ] "Pause Between Cycles" input field visible (accepts 0-600)
- [ ] Default value: 1 second
- [ ] Setting to 0: cycles transition seamlessly (no pause)
- [ ] Setting to 5: 5-second pause between each cycle
- [ ] Pause applies AFTER cycle completes, BEFORE next starts

**Color Coding Consistency**:
- [ ] All Start buttons green (#3fb950)
- [ ] All Pause/Stop buttons red (#f85149)
- [ ] All Reset buttons gray border (transparent bg)
- [ ] All preset/config buttons muted gray
- [ ] Home button blue (#58a6ff)

### Automated Tests (Browser Console)

**Test 1: Button Color Audit**
```javascript
// Run on each timer page
const buttons = document.querySelectorAll('.btn, .btn-success, .btn-danger, .btn-config, .btn-home');
const colorMap = new Map();

buttons.forEach(btn => {
  const bg = getComputedStyle(btn).backgroundColor;
  const classList = Array.from(btn.classList).join(' ');
  colorMap.set(classList, bg);
});

console.table(Array.from(colorMap.entries()).map(([cls, bg]) => ({class: cls, background: bg})));

// Verify:
// - btn-success → rgb(63, 185, 80) green
// - btn-danger → rgb(248, 81, 73) red
// - btn-home → rgb(88, 166, 255) blue
```

**Test 2: Home Button Position**
```javascript
// Run on each timer page
const homeBtn = document.querySelector('.btn-home');
if (!homeBtn) {
  console.error('❌ Home button missing!');
} else {
  const rect = homeBtn.getBoundingClientRect();
  console.log('Home button position:', {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  });

  // Verify: top ≈ 16px, left ≈ 16px
  if (rect.top > 20 || rect.left > 20) {
    console.warn('⚠️  Home button not in top-left corner');
  } else {
    console.log('✅ Home button correctly positioned');
  }
}
```

**Test 3: Cycle Timer Limit Logic**
```javascript
// Automated test for cycle limit
async function testCycleLimit() {
  // Navigate to cycle timer
  location.hash = '#/cycle';

  // Wait for page load
  await new Promise(r => setTimeout(r, 500));

  // Set test parameters
  const maxCyclesInput = document.querySelector('input[type="number"]'); // Assuming first number input is maxCycles
  maxCyclesInput.value = 3;
  maxCyclesInput.dispatchEvent(new Event('change'));

  // Set short interval for testing
  // (Manual step: set interval to 2 seconds via UI)

  // Click Start
  const startBtn = document.querySelector('.btn-success');
  startBtn.click();

  // Monitor cycle count
  const checkCycles = setInterval(() => {
    const cycleInfo = document.querySelector('.cycle-info');
    if (cycleInfo) {
      console.log('Cycle status:', cycleInfo.textContent);

      // Check if stopped at cycle 3
      if (cycleInfo.textContent.includes('Cycle 3 of 3')) {
        setTimeout(() => {
          const isRunning = document.querySelector('.btn-danger'); // Pause button
          if (!isRunning) {
            console.log('✅ Timer correctly stopped at cycle limit');
            clearInterval(checkCycles);
          } else {
            console.error('❌ Timer did not stop at cycle limit');
          }
        }, 3000); // Wait 3s to ensure it stopped
      }
    }
  }, 1000);
}

testCycleLimit();
```

---

## Edge Cases & Gotchas

### Edge Case 1: Home Button in Fullscreen Mode
**Problem**: Fullscreen mode might hide navigation
**Solution**: Ensure Home button has `position: fixed` and high `z-index`
**Test**: Enter fullscreen on Analog Countdown, Home button still visible

### Edge Case 2: Chess Clock Player Switch During Active Timer
**Problem**: Clicking active player's area might reset timer
**Solution**: `switchToPlayer()` should check if player is already active (no-op)
**Code**:
```tsx
const switchToPlayer = (player: 1 | 2) => {
  if (st.activePlayer === player) return; // Already active, ignore
  // ... rest of logic
};
```

### Edge Case 3: Cycle Timer Pause Duration Longer Than Interval
**Problem**: User sets 10-second pause with 5-second interval → confusing UX
**Solution**: Show warning if pause > interval
**UI**:
```tsx
{st.pauseBetweenCyclesMs > st.intervalMs && (
  <div className="config-warning">
    ⚠️ Pause is longer than interval duration
  </div>
)}
```

### Edge Case 4: Alarm Current Time in Different Timezones
**Problem**: Current time shows browser timezone, not user's preferred timezone
**Solution**: For v1, use browser timezone. Add timezone selector in future
**Note**: Document this limitation

### Edge Case 5: Mobile Keyboard Overlap
**Problem**: On mobile, keyboard input for cycle settings might hide buttons
**Solution**: Ensure inputs scroll into view when focused
**CSS**:
```css
.config-input:focus {
  scroll-margin-top: 100px; /* Ensure visible above keyboard */
}
```

### Edge Case 6: Cycle Timer Resume After Pause
**Problem**: setTimeout() for pause might break if user manually pauses during pause interval
**Solution**: Clear setTimeout on manual pause
**Code**:
```tsx
const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

// When cycle completes and pause starts
pauseTimerRef.current = setTimeout(() => { ... }, pauseDuration);

// On manual pause
const pause = () => {
  if (pauseTimerRef.current) {
    clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = null;
  }
  setSt(s => ({...s, running: false, endAt: null}));
};
```

---

## Rollback Plan

### Pre-Implementation Backup
```bash
# Create feature branch
git checkout -b ui-ux-redesign-backup
git add .
git commit -m "Backup before UI/UX redesign"

# Return to main branch for implementation
git checkout main
git checkout -b feature/ui-ux-redesign
```

### Rollback Steps
```bash
# If implementation fails, restore backup
git checkout main
git merge ui-ux-redesign-backup
git branch -D feature/ui-ux-redesign
```

### Partial Rollback
If specific tasks fail:
1. **Revert Task 3 (Chess Clock)**: `git checkout HEAD~ src/pages/ChessClock.tsx`
2. **Revert Task 5 (Cycle Timer)**: `git checkout HEAD~ src/pages/CycleTimer.tsx`
3. Keep successful tasks (Task 1, 2, 4, 6)

---

## Timeline & Milestones

### Week 1: Foundation & Navigation (Tasks 1-2)
- **Day 1**: Task 1 - Unified Home Button component
- **Day 2**: Task 2 - Analog Countdown layout redesign
- **Day 3**: Testing + CSS refinements

**Milestone 1**: Home button consistent, Analog layout improved ✓

### Week 2: Layout Redesigns (Tasks 3-4)
- **Day 4**: Task 3 - Chess Clock vertical layout
- **Day 5**: Task 4 - Alarm current time display
- **Day 6**: Testing + mobile responsiveness

**Milestone 2**: Chess Clock works vertically, Alarm shows time ✓

### Week 3: Feature Enhancements (Tasks 5-6)
- **Day 7**: Task 5 - Cycle Timer limits & pause
- **Day 8**: Task 6 - Color-coded button system
- **Day 9**: Task 7 - CSS cleanup & tokens

**Milestone 3**: All timers have consistent colors, Cycle Timer feature-complete ✓

### Week 4: Testing & Deployment
- **Day 10**: Comprehensive testing (all scenarios)
- **Day 11**: Bug fixes + edge case handling
- **Day 12**: Production build + staging deployment
- **Day 13**: User testing + feedback collection

**Milestone 4**: Production-ready, all tests passing ✓

---

## Open Questions & Decisions Needed

### Question 1: Alarm Time Format Preference
**Decision Needed**: 12-hour (AM/PM) or 24-hour clock for current time display?

**Options**:
- **A**: 24-hour (14:32:15) - clearer, no AM/PM ambiguity
- **B**: 12-hour (2:32:15 PM) - more familiar for some users
- **C**: User preference setting (future feature)

**Recommendation**: Option A (24-hour) for consistency with developer tools, can add preference later.

---

### Question 2: Chess Clock Settings Modal
**Decision Needed**: Where should time adjustment controls go in new vertical layout?

**Current**: Horizontal layout has space for settings in center controls
**Challenge**: Vertical layout has limited control space between players

**Options**:
- **A**: Settings modal (popup overlay when "Settings" clicked)
- **B**: Dedicated settings page (#/chess/settings)
- **C**: Collapsible settings drawer from top

**Recommendation**: Option A (modal) - keeps UI clean, accessible when needed.

---

### Question 3: Cycle Timer Pause Display
**Decision Needed**: How to visually indicate "pausing between cycles"?

**Options**:
- **A**: Show countdown of pause time ("Pause: 3s remaining")
- **B**: Show static message ("Pausing... next cycle in 2s")
- **C**: Dim display with "⏸ Pausing" indicator

**Recommendation**: Option A - shows progress, clearer UX.

---

### Question 4: Mobile Home Button Size
**Decision Needed**: Should Home button shrink on mobile or stay full size?

**Current Plan**: Icon-only on mobile (56px square)
**Alternative**: Full-size button always (may crowd small screens)

**Recommendation**: Stick with icon-only on mobile (<500px width) to save space.

---

## Summary & Next Steps

This plan provides a complete roadmap to redesign the Stoppclock UI/UX with:

1. **Consistent navigation** (Home button top-left, always)
2. **Logical layout hierarchy** (actions grouped, configs centered)
3. **Color-coded buttons** (green=start, red=pause, gray=config, blue=nav)
4. **Enhanced features** (cycle limits, pause intervals, current time display)

**Estimated completion**: 13 days (spread across 4 weeks for testing/feedback)
**Risk level**: Medium (TypeScript logic changes + CSS refactoring)
**Impact**: High (professional UI, improved UX, feature completeness)

**Immediate next step**: Begin Task 1 (Unified Home Button) to establish navigation consistency foundation.

**Success looks like**:
- Users never hunt for Home button (always top-left)
- Analog Countdown feels organized (buttons right, config bottom)
- Chess Clock works intuitively (vertical tap-to-switch)
- Alarm shows current time (no need to check phone)
- Cycle Timer can run limited cycles with configurable pauses
- Button colors instantly communicate purpose (green=go, red=stop, gray=config)

---

*Plan created by: Claude Code (Sonnet 4.5)*
*Date: 2025-10-20*
*Version: 1.0*
*Based on user requirements from brainstorming session*
