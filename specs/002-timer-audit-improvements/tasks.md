# Tasks: Stoppclock Timer Audit & Improvements

**Input**: Design documents from `/specs/002-timer-audit-improvements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: E2E tests using Playwright are requested and critical for this feature (spec mentions 44 existing tests, targeting 60+ after implementation).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Stories follow P0 → P1 → P2 priority order.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Single-page web app with hash-based routing
- Source files in `src/` at repository root
- E2E tests in `tests/e2e/`
- Public assets in `public/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational hooks and components needed across multiple user stories

- [ ] T001 [P] Create useStorageSync hook for cross-tab state synchronization in src/hooks/useStorageSync.ts
- [ ] T002 [P] Create useKeyboardShortcuts hook for standardized keyboard controls in src/hooks/useKeyboardShortcuts.ts
- [ ] T003 [P] Create useTheme hook for dark/light mode management in src/hooks/useTheme.ts
- [ ] T004 [P] Create shared timer TypeScript types in src/types/timer-types.ts
- [ ] T005 [P] Create ThemeToggle component in src/components/ThemeToggle.tsx
- [ ] T006 [P] Create UpdateNotification component for Service Worker updates in src/components/UpdateNotification.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Add CSS variables for dark theme in src/styles.css (--bg-dark, --text-dark, --primary-dark, etc.)
- [ ] T008 Add data-theme attribute handler in src/styles.css ([data-theme="dark"] selectors)
- [ ] T009 Update main.tsx to wrap App with theme provider context
- [ ] T010 Add ThemeToggle component to main.tsx Home page header
- [ ] T011 Add timezone utility functions to src/utils.ts (getUTCOffset, getCurrentTimeInTimezone, searchCities)
- [ ] T012 Add audio context management functions to src/utils.ts (createMetronomeClick, playAlarmSound)
- [ ] T013 Add world clock city database constant to src/utils.ts (WORLD_CLOCK_CITIES array with 50+ cities)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Fix Critical Countdown Timer Keyboard Controls (Priority: P0) 🎯 MVP

**Goal**: Enable keyboard shortcuts (ArrowUp/ArrowDown) to adjust countdown time while timer is paused, fixing P0 blocker

**Independent Test**: Start countdown timer (paused), press ArrowUp → should add 10 seconds. Start timer (running), press ArrowUp → should add 10 seconds to remaining time.

### E2E Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Add E2E test for ArrowUp/ArrowDown when timer is paused in tests/e2e/02-countdown.spec.ts
- [ ] T015 [P] [US1] Add E2E test for ArrowUp/ArrowDown when timer is running in tests/e2e/02-countdown.spec.ts
- [ ] T016 [P] [US1] Add E2E test for keyboard shortcuts disabled when input field focused in tests/e2e/02-countdown.spec.ts

### Implementation for User Story 1

- [ ] T017 [US1] Update Countdown.tsx keyboard handler to allow ArrowUp/ArrowDown when timer is running (remove paused-only check)
- [ ] T018 [US1] Add plus() function call to update both remainingMs and durationMs in Countdown.tsx
- [ ] T019 [US1] Add input field focus detection to keyboard handler in Countdown.tsx (prevent shortcuts when typing)
- [ ] T020 [US1] Verify input validation prevents values exceeding limits (hours ≤ 12, minutes/seconds ≤ 59) in Countdown.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (run E2E tests)

---

## Phase 4: User Story 2 - Implement World Clock Functionality (Priority: P0)

**Goal**: Replace placeholder with fully functional multi-timezone World Clock displaying 1-6 cities with automatic DST handling

**Independent Test**: Navigate to /#/world, verify local time displays by default, search for "Tokyo", add it, verify UTC+9 offset shown and time updates every second

### E2E Tests for User Story 2

- [ ] T021 [P] [US2] Create World Clock E2E test file tests/e2e/05-world-clock.spec.ts
- [ ] T022 [P] [US2] Add test for default local timezone on page load in tests/e2e/05-world-clock.spec.ts
- [ ] T023 [P] [US2] Add test for timezone search and selection in tests/e2e/05-world-clock.spec.ts
- [ ] T024 [P] [US2] Add test for multi-timezone display (3+ cities) in tests/e2e/05-world-clock.spec.ts
- [ ] T025 [P] [US2] Add test for timezone persistence across navigation in tests/e2e/05-world-clock.spec.ts
- [ ] T026 [P] [US2] Add test for max 6 timezone limit in tests/e2e/05-world-clock.spec.ts

### Implementation for User Story 2

- [ ] T027 [P] [US2] Implement WorldClockState type and localStorage load/save functions in src/pages/WorldClock.tsx (use sc.v1.world-clock key)
- [ ] T028 [US2] Implement timezone search/filter UI with dropdown in src/pages/WorldClock.tsx
- [ ] T029 [US2] Implement timezone selection handler (add to selectedZones, max 6) in src/pages/WorldClock.tsx
- [ ] T030 [US2] Implement multi-clock display grid (1-6 clocks) in src/pages/WorldClock.tsx
- [ ] T031 [US2] Implement clock update loop using setInterval (update every second) in src/pages/WorldClock.tsx
- [ ] T032 [US2] Add UTC offset calculation using Intl.DateTimeFormat in src/pages/WorldClock.tsx
- [ ] T033 [US2] Add timezone removal button for each clock in src/pages/WorldClock.tsx
- [ ] T034 [US2] Add cross-tab sync using useStorageSync hook in src/pages/WorldClock.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (run E2E tests)

---

## Phase 5: User Story 3 - Implement Alarm Clock Functionality (Priority: P0)

**Goal**: Replace placeholder with fully functional Alarm Clock with time-of-day trigger, sound/flash notifications, and next-occurrence scheduling

**Independent Test**: Navigate to /#/alarm, set alarm for 1 minute from now, wait for trigger, verify sound plays and visual flash appears

### E2E Tests for User Story 3

- [ ] T035 [P] [US3] Create Alarm Clock E2E test file tests/e2e/06-alarm.spec.ts
- [ ] T036 [P] [US3] Add test for alarm time input and Set Alarm button in tests/e2e/06-alarm.spec.ts
- [ ] T037 [P] [US3] Add test for alarm trigger with sound/flash in tests/e2e/06-alarm.spec.ts (use short 5-second alarm)
- [ ] T038 [P] [US3] Add test for alarm persistence across navigation in tests/e2e/06-alarm.spec.ts
- [ ] T039 [P] [US3] Add test for next-occurrence scheduling (past time → tomorrow) in tests/e2e/06-alarm.spec.ts

### Implementation for User Story 3

- [ ] T040 [P] [US3] Implement AlarmState type and localStorage load/save functions in src/pages/Alarm.tsx (use sc.v1.alarm key)
- [ ] T041 [US3] Implement alarm time input UI (hour and minute fields) in src/pages/Alarm.tsx
- [ ] T042 [US3] Implement calculateNextTrigger function (next occurrence logic) in src/pages/Alarm.tsx
- [ ] T043 [US3] Implement Set Alarm button handler (activate alarm, calculate nextTriggerAt) in src/pages/Alarm.tsx
- [ ] T044 [US3] Implement alarm monitoring loop using setInterval (check every second) in src/pages/Alarm.tsx
- [ ] T045 [US3] Implement alarm trigger logic (sound + flash when nextTriggerAt reached) in src/pages/Alarm.tsx
- [ ] T046 [US3] Implement Stop button to dismiss ringing alarm in src/pages/Alarm.tsx
- [ ] T047 [US3] Add countdown display showing time until alarm triggers in src/pages/Alarm.tsx
- [ ] T048 [US3] Add cross-tab sync using useStorageSync hook in src/pages/Alarm.tsx

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently (run E2E tests)

---

## Phase 6: User Story 4 - Implement Metronome Functionality (Priority: P0)

**Goal**: Replace placeholder with fully functional Metronome using Web Audio API for ±2% BPM accuracy with visual beat indicator

**Independent Test**: Navigate to /#/metronome, set BPM to 120, start, verify audio click plays every 500ms (±10ms) with visual flash

### E2E Tests for User Story 4

- [ ] T049 [P] [US4] Create Metronome E2E test file tests/e2e/07-metronome.spec.ts
- [ ] T050 [P] [US4] Add test for BPM input and Start/Pause buttons in tests/e2e/07-metronome.spec.ts
- [ ] T051 [P] [US4] Add test for BPM change while running in tests/e2e/07-metronome.spec.ts
- [ ] T052 [P] [US4] Add test for Space key start/pause in tests/e2e/07-metronome.spec.ts
- [ ] T053 [P] [US4] Add test for visual beat indicator flash in tests/e2e/07-metronome.spec.ts

### Implementation for User Story 4

- [ ] T054 [P] [US4] Implement MetronomeState type and localStorage load/save functions in src/pages/Metronome.tsx (use sc.v1.metronome key)
- [ ] T055 [US4] Implement Web Audio API scheduler with look-ahead pattern (100ms ahead) in src/pages/Metronome.tsx
- [ ] T056 [US4] Implement scheduleNote function using oscillator + gain envelope in src/pages/Metronome.tsx
- [ ] T057 [US4] Implement BPM input UI (40-240 range) in src/pages/Metronome.tsx
- [ ] T058 [US4] Implement Start/Pause button handlers in src/pages/Metronome.tsx
- [ ] T059 [US4] Implement time signature selector (4/4, 3/4, 6/8) in src/pages/Metronome.tsx
- [ ] T060 [US4] Implement accent beat logic (louder click on first beat) in src/pages/Metronome.tsx
- [ ] T061 [US4] Implement visual beat indicator with flash animation in src/pages/Metronome.tsx
- [ ] T062 [US4] Add keyboard shortcut support (Space to start/pause) in src/pages/Metronome.tsx

**Checkpoint**: At this point, User Stories 1-4 should all work independently (run E2E tests)

---

## Phase 7: User Story 5 - Implement Chess Clock Functionality (Priority: P0)

**Goal**: Replace placeholder with fully functional dual-player Chess Clock with independent timers and Fischer increment support

**Independent Test**: Navigate to /#/chess, set 5 minutes per player, start Player 1, switch to Player 2, verify clocks decrement independently and switch with <50ms latency

### E2E Tests for User Story 5

- [ ] T063 [P] [US5] Create Chess Clock E2E test file tests/e2e/08-chess-clock.spec.ts
- [ ] T064 [P] [US5] Add test for dual-timer display and time input in tests/e2e/08-chess-clock.spec.ts
- [ ] T065 [P] [US5] Add test for player clock switching in tests/e2e/08-chess-clock.spec.ts
- [ ] T066 [P] [US5] Add test for time expiration alert in tests/e2e/08-chess-clock.spec.ts
- [ ] T067 [P] [US5] Add test for Fischer increment in tests/e2e/08-chess-clock.spec.ts
- [ ] T068 [P] [US5] Add test for state persistence across navigation in tests/e2e/08-chess-clock.spec.ts

### Implementation for User Story 5

- [ ] T069 [P] [US5] Implement ChessClockState type and localStorage load/save functions in src/pages/ChessClock.tsx (use sc.v1.chess-clock key)
- [ ] T070 [US5] Implement dual-player timer display (Player 1 and Player 2 side-by-side) in src/pages/ChessClock.tsx
- [ ] T071 [US5] Implement time input UI for both players in src/pages/ChessClock.tsx
- [ ] T072 [US5] Implement Start button (starts Player 1 clock) in src/pages/ChessClock.tsx
- [ ] T073 [US5] Implement player switch logic with endAt timestamp update in src/pages/ChessClock.tsx
- [ ] T074 [US5] Implement Fischer increment logic (add incrementMs after each move) in src/pages/ChessClock.tsx
- [ ] T075 [US5] Implement time expiration detection and alert in src/pages/ChessClock.tsx
- [ ] T076 [US5] Implement move counter for both players in src/pages/ChessClock.tsx
- [ ] T077 [US5] Implement Reset button (reset both clocks to initial time) in src/pages/ChessClock.tsx
- [ ] T078 [US5] Add clock mode selector (simple, fischer, bronstein) in src/pages/ChessClock.tsx
- [ ] T079 [US5] Add cross-tab sync using useStorageSync hook in src/pages/ChessClock.tsx

**Checkpoint**: All P0 user stories (1-5) should now be complete and independently functional (run E2E tests)

---

## Phase 8: User Story 6 - Fix Cycle Timer Pause Functionality (Priority: P1)

**Goal**: Add Pause button to Cycle Timer to allow temporary interruption without losing cycle progress or count

**Independent Test**: Navigate to /#/cycle, start 1-minute cycle, pause after 30 seconds, resume, verify cycle completes at expected time and cycle count increments correctly

### E2E Tests for User Story 6

- [ ] T080 [P] [US6] Add test for Pause button in Cycle Timer in tests/e2e/04-cycle.spec.ts
- [ ] T081 [P] [US6] Add test for Resume from paused state in tests/e2e/04-cycle.spec.ts
- [ ] T082 [P] [US6] Add test for paused state persistence in tests/e2e/04-cycle.spec.ts

### Implementation for User Story 6

- [ ] T083 [US6] Add Pause button to Cycle Timer controls in src/pages/CycleTimer.tsx (alongside Start/Reset)
- [ ] T084 [US6] Implement pause() handler (set running: false, endAt: null) in src/pages/CycleTimer.tsx
- [ ] T085 [US6] Update start() handler to resume from paused state in src/pages/CycleTimer.tsx
- [ ] T086 [US6] Verify signal settings (sound/flash) persist across page reloads in src/pages/CycleTimer.tsx

**Checkpoint**: User Story 6 complete (run E2E tests for Cycle Timer)

---

## Phase 9: User Story 7 - Fix Stopwatch State Persistence (Priority: P1)

**Goal**: Fix stopwatch to continue running when navigating between pages, using startedAt timestamp for accurate elapsed time calculation

**Independent Test**: Navigate to /#/stopwatch, start stopwatch, navigate to home, wait 10 seconds, return to stopwatch, verify displays 00:00:10+ elapsed time

### E2E Tests for User Story 7

- [ ] T087 [P] [US7] Add test for stopwatch persistence across page navigation in tests/e2e/01-stopwatch.spec.ts
- [ ] T088 [P] [US7] Add test for elapsed time accuracy after 5-minute absence in tests/e2e/01-stopwatch.spec.ts

### Implementation for User Story 7

- [ ] T089 [US7] Update StopwatchState to use startedAt timestamp pattern in src/pages/Stopwatch.tsx
- [ ] T090 [US7] Implement calculateElapsedMs function (elapsedMs + timeSinceStart) in src/pages/Stopwatch.tsx
- [ ] T091 [US7] Update start() handler to set startedAt: Date.now() in src/pages/Stopwatch.tsx
- [ ] T092 [US7] Update pause() handler to calculate and store elapsedMs before stopping in src/pages/Stopwatch.tsx
- [ ] T093 [US7] Update display to use calculateElapsedMs() for current time in src/pages/Stopwatch.tsx

**Checkpoint**: User Story 7 complete (run E2E tests for Stopwatch)

---

## Phase 10: User Story 8 - Implement Analog Countdown Visual Display (Priority: P1)

**Goal**: Replace placeholder with SVG analog clock face showing countdown time with smooth 30+ FPS hand animation

**Independent Test**: Navigate to /#/analog, set 10-minute countdown, start, verify clock face renders with hands at 10:00 position and animate smoothly as time decrements

### E2E Tests for User Story 8

- [ ] T094 [P] [US8] Add test for analog clock face rendering in tests/e2e/03-analog.spec.ts
- [ ] T095 [P] [US8] Add test for clock hand position matching set time in tests/e2e/03-analog.spec.ts
- [ ] T096 [P] [US8] Add test for warning color change in last minute in tests/e2e/03-analog.spec.ts

### Implementation for User Story 8

- [ ] T097 [P] [US8] Create AnalogClock component with SVG clock face in src/pages/AnalogCountdown.tsx
- [ ] T098 [US8] Implement clock hand calculation (time → angle conversion) in src/pages/AnalogCountdown.tsx
- [ ] T099 [US8] Implement requestAnimationFrame loop for smooth hand updates (30+ FPS) in src/pages/AnalogCountdown.tsx
- [ ] T100 [US8] Add hour markers (12 positions) to clock face in src/pages/AnalogCountdown.tsx
- [ ] T101 [US8] Add minute and second hands with proper length/width in src/pages/AnalogCountdown.tsx
- [ ] T102 [US8] Add warning state styling (color change when remainingMs < 60000) in src/pages/AnalogCountdown.tsx
- [ ] T103 [US8] Add CSS variables for clock colors (--clock-face, --minute-hand, --second-hand) in src/styles.css

**Checkpoint**: User Story 8 complete (run E2E tests for Analog Countdown)

---

## Phase 11: User Story 9 - Fix Countdown Input Validation (Priority: P2)

**Goal**: Add auto-correction for invalid countdown time inputs (hours ≤ 12, minutes/seconds ≤ 59)

**Independent Test**: Navigate to /#/countdown, type "99" in minutes field, blur field, verify value auto-corrects to "59"

### E2E Tests for User Story 9

- [ ] T104 [P] [US9] Add test for minutes > 59 auto-correction in tests/e2e/02-countdown.spec.ts
- [ ] T105 [P] [US9] Add test for hours > 12 auto-correction in tests/e2e/02-countdown.spec.ts
- [ ] T106 [P] [US9] Add test for negative value auto-correction in tests/e2e/02-countdown.spec.ts

### Implementation for User Story 9

- [ ] T107 [US9] Add input validation to clamp hours to 0-12 in src/pages/Countdown.tsx
- [ ] T108 [US9] Add input validation to clamp minutes/seconds to 0-59 in src/pages/Countdown.tsx
- [ ] T109 [US9] Add onBlur handlers to auto-correct invalid values in src/pages/Countdown.tsx
- [ ] T110 [US9] Add input type guards to prevent non-numeric input in src/pages/Countdown.tsx

**Checkpoint**: User Story 9 complete (run E2E tests for Countdown validation)

---

## Phase 12: User Story 10 - Standardize Keyboard Shortcuts Across All Timers (Priority: P2)

**Goal**: Implement consistent keyboard shortcuts (Space, R, F, L) across all timer pages using shared useKeyboardShortcuts hook

**Independent Test**: Press Space key on each timer page (Stopwatch, Countdown, Cycle, World Clock, Alarm, Metronome, Chess Clock, Analog) and verify all timers start/pause consistently

### E2E Tests for User Story 10

- [ ] T111 [P] [US10] Add keyboard shortcut tests for Stopwatch (Space, R, L) in tests/e2e/01-stopwatch.spec.ts
- [ ] T112 [P] [US10] Add keyboard shortcut tests for Cycle Timer (Space, R) in tests/e2e/04-cycle.spec.ts
- [ ] T113 [P] [US10] Add keyboard shortcut tests for Analog Countdown (Space, R) in tests/e2e/03-analog.spec.ts
- [ ] T114 [P] [US10] Create new E2E test file tests/e2e/09-keyboard-shortcuts.spec.ts for cross-timer testing
- [ ] T115 [P] [US10] Add test for input field focus disabling shortcuts in tests/e2e/09-keyboard-shortcuts.spec.ts

### Implementation for User Story 10

- [ ] T116 [US10] Integrate useKeyboardShortcuts hook in src/pages/Stopwatch.tsx (Space, R, L keys)
- [ ] T117 [US10] Integrate useKeyboardShortcuts hook in src/pages/CycleTimer.tsx (Space, R keys)
- [ ] T118 [US10] Integrate useKeyboardShortcuts hook in src/pages/AnalogCountdown.tsx (Space, R keys)
- [ ] T119 [US10] Integrate useKeyboardShortcuts hook in src/pages/WorldClock.tsx (R for reset view)
- [ ] T120 [US10] Integrate useKeyboardShortcuts hook in src/pages/Alarm.tsx (Space to toggle, R to stop ringing)
- [ ] T121 [US10] Integrate useKeyboardShortcuts hook in src/pages/Metronome.tsx (already has Space support, verify consistency)
- [ ] T122 [US10] Integrate useKeyboardShortcuts hook in src/pages/ChessClock.tsx (Space to pause/resume, R to reset)

**Checkpoint**: User Story 10 complete (run E2E tests across all timers)

---

## Phase 13: User Story 11 - Improve PWA Installability and Service Worker Caching (Priority: P1)

**Goal**: Fix aggressive service worker caching by implementing update detection with skipWaiting() and user notification prompt

**Independent Test**: Deploy new app version, open app in browser, verify "New version available - Reload?" prompt appears within 30 seconds

### E2E Tests for User Story 11

- [ ] T123 [P] [US11] Create PWA offline functionality test file tests/e2e/10-pwa.spec.ts
- [ ] T124 [P] [US11] Add test for offline timer functionality in tests/e2e/10-pwa.spec.ts
- [ ] T125 [P] [US11] Add test for service worker update detection (mock deployment) in tests/e2e/10-pwa.spec.ts

### Implementation for User Story 11

- [ ] T126 [US11] Update service worker to increment CACHE_NAME version in public/sw.js
- [ ] T127 [US11] Add skipWaiting() call in install event handler in public/sw.js
- [ ] T128 [US11] Add clients.claim() call in activate event handler in public/sw.js
- [ ] T129 [US11] Add old cache deletion logic in activate event in public/sw.js
- [ ] T130 [US11] Add message event handler for SKIP_WAITING command in public/sw.js
- [ ] T131 [US11] Implement update detection logic in UpdateNotification component in src/components/UpdateNotification.tsx
- [ ] T132 [US11] Add 30-second update check interval in UpdateNotification component
- [ ] T133 [US11] Add update notification UI (Reload/Later buttons) in UpdateNotification component
- [ ] T134 [US11] Add UpdateNotification component to main.tsx App component

**Checkpoint**: User Story 11 complete (test service worker update flow)

---

## Phase 14: User Story 12 - Implement Dark/Light Mode Toggle (Priority: P2)

**Goal**: Add theme toggle button that switches entire UI between dark/light modes with system preference detection and localStorage persistence

**Independent Test**: Click theme toggle button, verify all timer pages switch to dark mode with adjusted colors, close browser, reopen, verify theme persists

### E2E Tests for User Story 12

- [ ] T135 [P] [US12] Create theme toggle E2E test file tests/e2e/09-theme.spec.ts
- [ ] T136 [P] [US12] Add test for theme toggle button functionality in tests/e2e/09-theme.spec.ts
- [ ] T137 [P] [US12] Add test for theme persistence across page navigation in tests/e2e/09-theme.spec.ts
- [ ] T138 [P] [US12] Add test for system preference detection on first visit in tests/e2e/09-theme.spec.ts

### Implementation for User Story 12

- [ ] T139 [US12] Implement theme detection logic (system preference) in useTheme hook in src/hooks/useTheme.ts
- [ ] T140 [US12] Implement theme toggle function in useTheme hook
- [ ] T141 [US12] Implement theme persistence using localStorage (sc.v1.preferences) in useTheme hook
- [ ] T142 [US12] Implement data-theme attribute update on document.documentElement in useTheme hook
- [ ] T143 [US12] Add dark theme CSS variables and styles to src/styles.css
- [ ] T144 [US12] Add theme-aware flash colors for timer warnings in src/styles.css
- [ ] T145 [US12] Integrate useTheme hook in ThemeToggle component (toggle button with sun/moon icon)
- [ ] T146 [US12] Add ThemeToggle to home page header in main.tsx

**Checkpoint**: All user stories (1-12) complete! Run full E2E test suite (targeting 60+ passing tests)

---

## Phase 15: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [ ] T147 [P] Add localStorage quota exceeded error handling to all timer components (graceful degradation)
- [ ] T148 [P] Add edge case handling for 10+ World Clock timezones (limit to 6, show warning)
- [ ] T149 [P] Add edge case handling for extreme Metronome BPM values (clamp to 40-240)
- [ ] T150 [P] Add edge case handling for negative Chess Clock time due to tab throttling (show 00:00:00, trigger expiration)
- [ ] T151 [P] Add console logging for state save/load errors across all timers (FR-068 requirement)
- [ ] T152 Verify bundle size is <180kB gzipped (run npm run build and check output)
- [ ] T153 Verify all performance targets met (keyboard <100ms, metronome ±2%, analog 30+ FPS, cross-tab <500ms)
- [ ] T154 Run full E2E test suite and ensure 60+ tests passing (npm run test:e2e)
- [ ] T155 Update README.md with feature documentation (if not exists)
- [ ] T156 Validate quickstart.md instructions are accurate (run through setup steps)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-14)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P0 → P1 → P2)
  - **P0 stories (US1-US5)**: Can all run in parallel after Foundational
  - **P1 stories (US6-US8, US11)**: Can all run in parallel after Foundational
  - **P2 stories (US9-US10, US12)**: Can all run in parallel after Foundational
- **Polish (Phase 15)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (Countdown Keyboard)**: Independent - only depends on Foundational
- **US2 (World Clock)**: Independent - only depends on Foundational (uses WORLD_CLOCK_CITIES from T013)
- **US3 (Alarm)**: Independent - only depends on Foundational
- **US4 (Metronome)**: Independent - only depends on Foundational (uses audio context from T012)
- **US5 (Chess Clock)**: Independent - only depends on Foundational
- **US6 (Cycle Pause)**: Independent - modifies existing CycleTimer component
- **US7 (Stopwatch Persistence)**: Independent - modifies existing Stopwatch component
- **US8 (Analog Visual)**: Independent - modifies existing AnalogCountdown component
- **US9 (Countdown Validation)**: Can integrate with US1 or run independently
- **US10 (Keyboard Standardization)**: Depends on all timer pages existing (run after US1-US8)
- **US11 (PWA/Service Worker)**: Independent - affects all timers but doesn't require them
- **US12 (Dark/Light Mode)**: Independent - depends on T007-T008 (dark theme CSS)

### Within Each User Story

- E2E tests MUST be written and FAIL before implementation
- Data models/types before component logic
- Component implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: All 6 tasks marked [P] can run in parallel
- **Foundational (Phase 2)**: T007-T008 (CSS) can run parallel with T011-T013 (utilities)
- **After Foundational**: All P0 stories (US1-US5) can run in parallel = 5 parallel tracks
- **All E2E tests** within a story marked [P] can run in parallel
- **Different user stories** can be worked on in parallel by different team members

---

## Parallel Example: User Story 2 (World Clock)

```bash
# Launch all E2E tests for User Story 2 together:
Task T021: "Create World Clock E2E test file tests/e2e/05-world-clock.spec.ts"
Task T022: "Add test for default local timezone on page load"
Task T023: "Add test for timezone search and selection"
Task T024: "Add test for multi-timezone display (3+ cities)"
Task T025: "Add test for timezone persistence"
Task T026: "Add test for max 6 timezone limit"

# After tests fail, launch parallelizable implementation tasks:
Task T027: "Implement WorldClockState type and localStorage functions" (foundation)
Then in parallel:
Task T028: "Implement timezone search/filter UI"
Task T029: "Implement timezone selection handler"
Task T030: "Implement multi-clock display grid"
Task T031: "Implement clock update loop"
Task T032: "Add UTC offset calculation"
Task T033: "Add timezone removal button"
Task T034: "Add cross-tab sync"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T013) - CRITICAL
3. Complete Phase 3: User Story 1 (T014-T020)
4. **STOP and VALIDATE**: Run E2E tests for Countdown keyboard shortcuts
5. Deploy/demo if ready

### Incremental Delivery (P0 Stories)

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Countdown) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (World Clock) → Test independently → Deploy/Demo
4. Add US3 (Alarm) → Test independently → Deploy/Demo
5. Add US4 (Metronome) → Test independently → Deploy/Demo
6. Add US5 (Chess Clock) → Test independently → Deploy/Demo
7. All P0 blockers resolved! ✅

### Full Feature Delivery (All Stories)

After P0 stories complete:
- Add US6-US8, US11 (P1 stories) → High-impact improvements
- Add US9-US10, US12 (P2 stories) → UX polish
- Complete Phase 15 (Polish) → Production-ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T013)
2. Once Foundational is done, split into parallel tracks:
   - **Developer A**: US1 (Countdown keyboard)
   - **Developer B**: US2 (World Clock)
   - **Developer C**: US3 (Alarm)
   - **Developer D**: US4 (Metronome)
   - **Developer E**: US5 (Chess Clock)
3. Each developer writes E2E tests first, then implements independently
4. Stories complete and integrate independently (no merge conflicts)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **E2E tests required**: Write tests first, ensure they FAIL before implementation
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Bundle size target: <180kB gzipped (check after Phase 15 completion)
- Test coverage target: 60+ E2E tests passing (currently 36/44 passing)
- Cross-tab sync: All timers must use useStorageSync hook for SC-015 compliance
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
