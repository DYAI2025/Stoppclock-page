# Stoppclock: Project Documentation & Status Report

**Last Updated:** 2025-12-09
**Current Status:** Iteration 4 Completed (Pomodoro & World Clock)

---

## 1. Project Vision

**"Time, held lightly."**
Stoppclock is a web-based, projector-friendly timer suite designed for classrooms, workshops, and exams. It avoids the stressful, gamified, and alarm-heavy nature of typical productivity tools. Instead, it offers a calm, aesthetic, and professional "time assembly" for groups and individuals.

### Core Values

- **Calm & Supportive:** No jarring alarms, no "failure" states.
- **Projector-First:** High-contrast, large typography, readable from 3-5m.
- **Aesthetic Quality:** "Flagship" designs that look premium (Soft Focus, Air Traffic Control, Deep Ocean themes).

---

## 2. Features & Modules

### 2.1. Pomodoro Timer ("Soft Focus")

*Status: Implemented (Iteration 4)*

A rhythm-based focus tool designed to reduce stress rather than maximize output pressure.

- **Presets:**
  - **Classic:** 25m Focus / 5m Break / 15m Long Break.
  - **Soft Focus:** 45m Focus / 10m Break / 20m Long Break (gentler rhythm).
  - **Deep Work:** 90m Focus / 15m Break (Ultradian rhythm).
- **Key Features:**
  - Visual "Phase" indicator (Focus, Short Break, Long Break).
  - Cycle tracking (dots indicating progress).
  - Custom intent label ("What are you working on?").
  - **Aesthetic:** Teal/Amber/Violet theme on dark background.

### 2.2. World Clock ("Time Assembly")

*Status: Implemented (Iteration 4)*

A professional, tabular overview of global time, inspired by airport flight boards or UN conference tables.

- **Key Features:**
  - **Searchable City Database:** Uses `Intl` API to find and add cities (e.g., "London", "Tokyo").
  - **Tabular View:** Displays City, Local Time (Digital), Day Period (Morning/Night), and Offset relative to user.
  - **Reference Mode:** Calculates offsets based on the user's local time.
  - **Aesthetic:** "Air Traffic Control" style – clean, monospace numbers, high readability.

### 2.3. Time Lab (Meta-Time)

*Status: Initial Implementation (Iteration 3)*

A "museum" of time perception, showing time flowing from/to significant events.

- **Since Then:** Displays time elapsed since historic events (e.g., Big Bang, Moon Landing).
- **Until Then:** Countdowns to future milestones (e.g., New Year, Solstices).
- **Aesthetic:** "Ocean Depths" – deep blue gradients, particle effects, floating UI cards.

### 2.4. Standard Timers

*Status: Existing / Foundation*

- **Analog/Digital Countdown:** Classic visual timers.
- **Stopwatch:** Precise counting up.

---

## 3. Technical Architecture

### 3.1. Stack

* **Frontend:** React 18, TypeScript, Vite.
- **Routing:** Custom Hash-Router (`src/main.tsx`) allowing simple static hosting/local file usage.
- **Styling:** Vanilla CSS Modules / Variables. No Tailwind (unless requested).
  - Themes are scoped to specific CSS files (e.g., `pomodoro.css`, `world-clock.css`).
- **State Management:**
  - React `useState` / `useReducer` for UI state.
  - **Persistence:** `localStorage` for saving timer states (e.g., active Pomodoro session, World Clock cities) to survive reloads.

### 3.2. Domain Logic (`src/domain/`)

Business logic is separated from UI components to ensure testability and robustness.
- `pomodoro/`: `usePomodoroLogic` hook, types, and preset definitions.
- `world-clock/`: `Intl` helpers for timezone offsets and day-period calculation.
- `time-lab/`: Calculators for "since" and "until" durations.

---

## 4. Implementation History

### Iteration 4 (Current)

* **Focus:** "Flagship Timers" (Pomodoro & World Clock).
- **Delivered:**
  - Full Pomodoro logic and UI with "Soft Focus" theme.
  - Full World Clock with city search and "Time Assembly" grid.
  - Robust state hydration fixes (solving `NaN` bugs).

### Iteration 3

* **Focus:** Time Lab & Meta-Time.
- **Delivered:** "Since Then" and "Until Then" views, "Ocean" theme.

---

## 5. Roadmap & Future Plans

### 5.1. Immediate Next Steps

* **UX Refinement:** Gather feedback on the "Soft Focus" feel.
- **World Clock Expansion:** Add "Time Travel" slider (Meeting Planner) to check future times across zones.

### 5.2. Future Concepts

* **Film Sync:** A playful calculator to sync movies with real-time events (e.g., "Start Star Wars at XX:XX so the Death Star explodes at midnight").
- **Soundscapes:** Ambient background noise options for timers (Rain, Library, Cafe).
- **Remote Sync:** (Long-term) Allowing multiple users to watch the exact same timer state via WebSockets/P2P.

---

## 6. Known Issues / Risks

* **Browser Throttling:** Timers may drift slightly in background tabs (mitigated by timestamp-diff logic, but worth monitoring).
- **Timezone Data:** Relies on browser `Intl` support, which is generally good but depends on the user's OS/Browser updates for DST rules.
