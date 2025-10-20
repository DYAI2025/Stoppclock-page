# Feature Specification: Stoppclock Timer Application - Bug Fixes and Feature Enhancements

**Feature Branch**: `002-timer-audit-improvements`  
**Created**: 2025-10-20  
**Status**: Draft  
**Input**: User description: "Comprehensive audit report documenting current state of Stoppclock web application with prioritized bugs (P0-P3) and feature requests across all 8 timer tools, home page, and cross-cutting concerns"

## Executive Summary

This specification addresses the systematic improvement of the Stoppclock timer application by fixing critical bugs and implementing missing core functionality across all timer components. The audit identified multiple P0 (blocker) and P1 (critical) issues that prevent users from accessing essential timer functionality, alongside enhancement requests to improve user experience.

**Scope**: This specification covers bugs and enhancements for 8 timer tools (Stopwatch, Digital Countdown, Analog Countdown, Cycle Timer, World Clock, Alarm, Metronome, Chess Clock), home page improvements, and cross-cutting concerns (PWA, data management, UX consistency).

## Clarifications

### Session 2025-10-20

- Q: How should the system behave when a user sets an alarm for a time that has already passed today? → A: Always interpret time as next occurrence (if past today, schedule for tomorrow) without showing any indicator
- Q: How should the system handle timer state when the same timer is open and running in multiple browser tabs simultaneously? → A: Synchronize timer state across all tabs in real-time using storage events (all tabs show same time, state updates propagate instantly)
- Q: Should the system include error tracking, logging, or user feedback mechanisms to help developers diagnose issues and improve the application? → A: Basic browser console logging only

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Critical Countdown Timer Keyboard Controls (Priority: P0)

Users need to adjust countdown time quickly using keyboard shortcuts, but ArrowUp/ArrowDown keys currently only work when the timer is paused. This blocks efficient workflow for users who want to add time during active countdowns (e.g., presentations, cooking).

**Why this priority**: This is a P0 blocker - keyboard shortcuts are documented but non-functional in the primary use case (running timer), causing user frustration and requiring manual input field interaction.

**Independent Test**: Can be fully tested by starting a countdown timer and pressing ArrowUp/ArrowDown keys - should add/subtract 10 seconds regardless of timer state.

**Acceptance Scenarios**:

1. **Given** countdown timer is running, **When** user presses ArrowUp, **Then** 10 seconds are added to remaining time
2. **Given** countdown timer is paused, **When** user presses ArrowUp, **Then** 10 seconds are added to duration
3. **Given** input field is focused, **When** user presses ArrowUp, **Then** keyboard shortcut is NOT triggered (input field behavior takes precedence)
4. **Given** countdown timer is at 00:00:00, **When** user presses Space, **Then** timer starts with saved duration
5. **Given** countdown timer is running, **When** user presses 'R', **Then** timer resets to original duration and stops

---

### User Story 2 - Implement World Clock Functionality (Priority: P0)

Users need to view multiple time zones simultaneously to coordinate across global teams, schedule international meetings, or track remote family members. Currently World Clock shows only a placeholder.

**Why this priority**: P0 blocker - advertised feature is completely non-functional. Users clicking the World Clock card see no usable functionality.

**Independent Test**: Can be fully tested by navigating to World Clock, selecting 3-4 cities from different time zones, and verifying times update every second with correct UTC offsets.

**Acceptance Scenarios**:

1. **Given** user opens World Clock, **When** page loads, **Then** at least one default timezone is displayed (user's local time)
2. **Given** World Clock is displayed, **When** user searches for "New York", **Then** matching cities appear in dropdown
3. **Given** user selects "New York", **When** timezone is added, **Then** current time in New York displays with UTC offset (e.g., "UTC-5")
4. **Given** 3 timezones are displayed, **When** one second passes, **Then** all clocks update simultaneously
5. **Given** user has selected timezones, **When** user navigates away and returns, **Then** previously selected timezones are restored from storage
6. **Given** user has 6 timezones selected, **When** user tries to add a 7th, **Then** system prevents addition or removes oldest timezone

---

### User Story 3 - Implement Alarm Clock Functionality (Priority: P0)

Users need to set alarms for reminders, wake-ups, or time-sensitive tasks. Currently Alarm shows only a placeholder, preventing users from accessing this core timer functionality.

**Why this priority**: P0 blocker - core feature completely missing from advertised 8-timer suite.

**Independent Test**: Can be fully tested by setting an alarm for 1 minute in the future, waiting for alarm to trigger, and verifying sound/visual notification.

**Acceptance Scenarios**:

1. **Given** user opens Alarm, **When** page loads, **Then** time input fields (hours, minutes) are displayed
2. **Given** user sets alarm for specific time, **When** user clicks "Set Alarm", **Then** alarm is activated and countdown to alarm time begins
3. **Given** user sets alarm for 9:00 AM when current time is 2:00 PM, **When** alarm is set, **Then** alarm schedules for 9:00 AM next day (next occurrence)
4. **Given** alarm time is reached, **When** alarm triggers, **Then** sound plays and visual flash notification appears
5. **Given** alarm is ringing, **When** user clicks "Stop", **Then** alarm sound stops and visual notification clears
6. **Given** user has set an alarm, **When** user navigates away and returns, **Then** alarm state persists (active alarm continues)
7. **Given** alarm time has passed while user was away, **When** user returns to Alarm page, **Then** alarm is in triggered state (ringing or completed)

---

### User Story 4 - Implement Metronome Functionality (Priority: P0)

Musicians and fitness users need a metronome to maintain tempo during practice or workouts. Currently Metronome shows only a placeholder.

**Why this priority**: P0 blocker - specialized tool for musicians completely unavailable, limiting app usefulness for this user segment.

**Independent Test**: Can be fully tested by setting BPM to 120, starting metronome, and verifying audio click plays every 0.5 seconds (120 beats/minute) with visual beat indicator.

**Acceptance Scenarios**:

1. **Given** user opens Metronome, **When** page loads, **Then** BPM input (default 120) and Start button are displayed
2. **Given** metronome is stopped, **When** user sets BPM to 80 and clicks Start, **Then** metronome plays audio click every 0.75 seconds (80 beats/minute)
3. **Given** metronome is running at 120 BPM, **When** user changes BPM to 180, **Then** metronome immediately adjusts to new tempo (0.33s intervals)
4. **Given** metronome is running, **When** user clicks Pause, **Then** audio clicks stop
5. **Given** metronome BPM is 60, **When** user presses Space, **Then** metronome starts/pauses
6. **Given** metronome displays visual beat indicator, **When** beat plays, **Then** visual indicator flashes in sync with audio click

---

### User Story 5 - Implement Chess Clock Functionality (Priority: P0)

Chess players and gamers need a two-player timer with independent clocks that switch on button press. Currently Chess Clock shows only a placeholder.

**Why this priority**: P0 blocker - niche but essential tool for chess community, completely missing.

**Independent Test**: Can be fully tested by setting 5 minutes per player, starting Player 1 clock, switching to Player 2, and verifying clocks decrement independently.

**Acceptance Scenarios**:

1. **Given** user opens Chess Clock, **When** page loads, **Then** two timer displays (Player 1, Player 2) and time input fields are shown
2. **Given** user sets 5 minutes for both players, **When** user clicks Start on Player 1 side, **Then** Player 1 clock begins counting down
3. **Given** Player 1 clock is running, **When** user clicks Player 1 button, **Then** Player 1 clock pauses and Player 2 clock starts
4. **Given** Player 2 clock is running at 00:00:05, **When** clock reaches 00:00:00, **Then** sound alert plays and Player 2 loses (time expired)
5. **Given** game is in progress, **When** user clicks Reset, **Then** both clocks reset to initial time and pause
6. **Given** both players have active clocks, **When** user navigates away and returns, **Then** clock states persist (time continues counting in background)

---

### User Story 6 - Fix Cycle Timer Pause Functionality (Priority: P1)

Users running interval training or Pomodoro cycles need to pause between sets without losing progress. Currently Cycle Timer only has Start/Reset, forcing users to restart entire cycles if interrupted.

**Why this priority**: P1 critical - users lose workout progress or work session data when they need to pause temporarily (phone call, emergency).

**Independent Test**: Can be fully tested by starting a 1-minute cycle, pausing after 30 seconds, resuming, and verifying cycle completes at expected time.

**Acceptance Scenarios**:

1. **Given** cycle timer is running with 30 seconds remaining, **When** user clicks Pause, **Then** timer freezes at 00:00:30
2. **Given** cycle timer is paused at 00:00:30, **When** user clicks Resume, **Then** timer continues from 00:00:30
3. **Given** cycle timer is paused, **When** user navigates away and returns, **Then** paused state and remaining time are restored
4. **Given** cycle timer completes while running, **When** cycle auto-restarts, **Then** pause button remains available for new cycle
5. **Given** cycle timer is paused with cycle count at 5, **When** user resumes and cycle completes, **Then** cycle count increments to 6

---

### User Story 7 - Fix Stopwatch State Persistence (Priority: P1)

Users tracking long-duration activities (running, project time) need stopwatch to continue running when navigating between pages. Currently stopwatch loses state on page change.

**Why this priority**: P1 critical - users lose timing data for long-running activities when checking other timers, breaking core use case.

**Independent Test**: Can be fully tested by starting stopwatch, navigating to home page, waiting 10 seconds, returning to stopwatch, and verifying time shows 00:00:10+ elapsed.

**Acceptance Scenarios**:

1. **Given** stopwatch is running at 00:01:30, **When** user navigates to Home page, **Then** stopwatch continues running in background
2. **Given** stopwatch has been running in background for 10 seconds, **When** user returns to Stopwatch page, **Then** display shows 00:01:40
3. **Given** stopwatch is paused at 00:05:00, **When** user navigates away and returns, **Then** stopwatch displays 00:05:00 (still paused)
4. **Given** stopwatch is running, **When** user closes browser and reopens within 1 hour, **Then** stopwatch shows correct elapsed time (continued in background)

---

### User Story 8 - Implement Analog Countdown Visual Display (Priority: P1)

Users prefer visual analog clock for presentations and classrooms because it provides intuitive "time remaining" visualization. Currently Analog Countdown shows only placeholder text.

**Why this priority**: P1 critical - unique selling point for education/presentation use case is completely missing, degrading user experience versus competitors.

**Independent Test**: Can be fully tested by setting 10-minute countdown, starting timer, and verifying analog clock hands animate smoothly as time decrements.

**Acceptance Scenarios**:

1. **Given** user sets 10-minute countdown, **When** analog display renders, **Then** clock face shows hour/minute hands positioned at 10:00
2. **Given** analog countdown is running, **When** 1 minute passes, **Then** minute hand moves smoothly to 9:00 position
3. **Given** analog countdown reaches warning threshold (1 minute), **When** timer enters warning zone, **Then** clock face changes color (e.g., yellow to red gradient)
4. **Given** analog countdown reaches 00:00, **When** timer expires, **Then** visual flash animation plays on clock face
5. **Given** analog countdown is displayed, **When** user taps/drags minute hand, **Then** countdown time adjusts to new position

---

### User Story 9 - Fix Countdown Input Validation (Priority: P2)

Users setting countdown timers should be prevented from entering invalid values (e.g., 99 minutes, -5 seconds) to avoid confusion and unintended behavior.

**Why this priority**: P2 high - causes user frustration and potential timer miscalculation, but doesn't block core functionality.

**Independent Test**: Can be fully tested by attempting to enter 99 in minutes field and verifying system either prevents input or auto-corrects to 59.

**Acceptance Scenarios**:

1. **Given** user types "99" in minutes field, **When** user tabs away, **Then** value auto-corrects to "59" (maximum valid minutes)
2. **Given** user types "-5" in seconds field, **When** user tabs away, **Then** value auto-corrects to "0" (minimum valid seconds)
3. **Given** user types "25" in hours field, **When** user tabs away, **Then** value auto-corrects to "12" (maximum supported hours)
4. **Given** user types "abc" in any field, **When** field loses focus, **Then** value reverts to "0"
5. **Given** all fields are set to valid values (01:30:00), **When** user starts countdown, **Then** timer displays "01:30:00" and begins decrementing

---

### User Story 10 - Standardize Keyboard Shortcuts Across All Timers (Priority: P2)

Users switching between different timers expect consistent keyboard controls (Space = Start/Pause, R = Reset, F = Fullscreen) to reduce cognitive load.

**Why this priority**: P2 high - UX inconsistency frustrates power users, but doesn't block feature usage.

**Independent Test**: Can be fully tested by pressing Space key on each timer page (Stopwatch, Countdown, Cycle, etc.) and verifying all timers start/pause consistently.

**Acceptance Scenarios**:

1. **Given** user is on any timer page (Stopwatch, Countdown, Cycle, etc.), **When** user presses Space, **Then** timer starts if stopped, pauses if running
2. **Given** user is on any timer page, **When** user presses 'R', **Then** timer resets to initial state (00:00:00 or set duration)
3. **Given** user is on any timer page with fullscreen support, **When** user presses 'F', **Then** timer enters fullscreen mode
4. **Given** user is typing in input field, **When** user presses Space, **Then** space character is inserted (keyboard shortcuts disabled during input)
5. **Given** user is on Stopwatch, **When** user presses 'L', **Then** lap time is recorded (timer-specific shortcut)

---

### User Story 11 - Improve PWA Installability and Service Worker Caching (Priority: P1)

Users want to install Stoppclock as a standalone app for offline use, but aggressive service worker caching causes stale version issues requiring hard refresh.

**Why this priority**: P1 critical - PWA core feature is broken, users get outdated code and miss bug fixes.

**Independent Test**: Can be fully tested by updating app version, deploying to server, opening app in browser, and verifying new version loads without hard refresh.

**Acceptance Scenarios**:

1. **Given** new app version is deployed, **When** user opens app, **Then** service worker detects update and prompts "New version available - Reload?"
2. **Given** user clicks "Reload" on update prompt, **When** page refreshes, **Then** new version loads successfully
3. **Given** user is offline, **When** user opens installed PWA, **Then** app loads from cache and all timers function normally
4. **Given** user hasn't opened app in 24 hours, **When** user opens app while online, **Then** service worker checks for updates automatically
5. **Given** app is installed as PWA, **When** user views app icon, **Then** "Add to Home Screen" prompt appears (if not already installed)

---

### User Story 12 - Implement Dark/Light Mode Toggle (Priority: P2)

Users working in different lighting conditions need theme control to reduce eye strain (dark mode for night use, light mode for daylight).

**Why this priority**: P2 high - improves accessibility and user comfort, but doesn't block core timer functionality.

**Independent Test**: Can be fully tested by clicking theme toggle button and verifying entire UI switches between dark and light color schemes.

**Acceptance Scenarios**:

1. **Given** user opens app for first time, **When** page loads, **Then** theme matches system preference (dark if OS is dark mode)
2. **Given** app is in light mode, **When** user clicks theme toggle, **Then** all pages switch to dark mode (dark background, light text)
3. **Given** user has selected dark mode, **When** user navigates between timer pages, **Then** dark mode persists across all pages
4. **Given** user has selected light mode, **When** user closes and reopens app, **Then** light mode preference is restored from storage
5. **Given** user switches to dark mode, **When** timer warning flashes appear, **Then** flash colors are adjusted for dark background (higher contrast)

---

### Edge Cases

- What happens when user sets World Clock to 10+ timezones (exceeds recommended max of 6)?
- How does system handle localStorage quota exceeded (e.g., user has 50+ saved lap times)?
- How does Metronome handle extreme BPM values (e.g., 1 BPM or 300 BPM)?
- What happens when Chess Clock player time goes negative due to background tab throttling?
- How does Cycle Timer behave when cycle count exceeds 999?
- How does system handle timezone changes (e.g., user travels across time zones with active alarm)?
- What happens when service worker update fails due to network error?
- How does app handle browser back/forward navigation with running timers?

## Requirements *(mandatory)*

### Functional Requirements

#### Countdown Timer (P0/P1 Bugs)

- **FR-001**: System MUST allow keyboard shortcuts (ArrowUp/ArrowDown) to adjust time when timer is NOT running (paused or stopped)
- **FR-002**: System MUST ignore keyboard shortcuts when input fields are focused (preserve normal text input behavior)
- **FR-003**: System MUST validate time input fields to prevent values exceeding max limits (hours ≤ 12, minutes/seconds ≤ 59)
- **FR-004**: System MUST auto-correct invalid input values to nearest valid value (e.g., 99 minutes → 59 minutes)
- **FR-005**: System MUST trigger warning signals (sound/flash) when remaining time equals or falls below configured warn-at threshold
- **FR-006**: Warning signals MUST repeat every second while in warning zone until timer expires

#### World Clock (P0 Implementation)

- **FR-007**: System MUST display at least 1 timezone by default (user's local timezone) on initial load
- **FR-008**: System MUST provide searchable dropdown/autocomplete for selecting cities/timezones
- **FR-009**: System MUST display current time for each selected timezone, updating every second
- **FR-010**: System MUST display UTC offset for each timezone (e.g., "UTC-5", "UTC+1")
- **FR-011**: System MUST persist selected timezones in local storage for restoration on page revisit
- **FR-012**: System MUST support displaying 3-6 timezones simultaneously
- **FR-013**: System MUST handle daylight saving time transitions automatically based on timezone rules

#### Alarm Clock (P0 Implementation)

- **FR-014**: System MUST allow users to set alarm time using hour and minute inputs (24-hour or 12-hour format)
- **FR-015**: System MUST activate alarm countdown when user clicks "Set Alarm" button
- **FR-016**: System MUST automatically schedule alarm for next occurrence if set time has passed today (e.g., 9:00 AM set at 2:00 PM schedules for next day 9:00 AM)
- **FR-017**: System MUST trigger sound and visual notification when alarm time is reached
- **FR-018**: System MUST provide "Stop" button to dismiss ringing alarm
- **FR-019**: System MUST persist active alarm state across page navigation
- **FR-020**: System MUST continue alarm countdown when browser tab is in background
- **FR-021**: System MUST display time remaining until alarm triggers

#### Metronome (P0 Implementation)

- **FR-022**: System MUST accept BPM input in range 40-240 beats per minute
- **FR-023**: System MUST play audio click at precise intervals calculated from BPM (interval_ms = 60000 / BPM)
- **FR-024**: System MUST provide visual beat indicator that flashes in sync with audio clicks
- **FR-025**: System MUST allow BPM adjustment while metronome is running (apply new tempo immediately)
- **FR-026**: System MUST support time signatures (4/4, 3/4, 6/8) with accent on first beat of measure
- **FR-027**: System MUST provide tap-tempo feature: calculate BPM from user's taps on button/spacebar

#### Chess Clock (P0 Implementation)

- **FR-028**: System MUST display two independent timers (Player 1, Player 2) side-by-side
- **FR-029**: System MUST allow time configuration for both players (default: equal time per player)
- **FR-030**: System MUST start Player 1 clock when user clicks Start button
- **FR-031**: System MUST pause current player clock and start opponent clock when active player button is clicked
- **FR-032**: System MUST trigger sound alert and display "Time Expired" when either player reaches 00:00:00
- **FR-033**: System MUST support Fischer increment (add N seconds to clock after each move)
- **FR-034**: System MUST support Bronstein delay (pause clock for N seconds before decrementing)
- **FR-035**: System MUST track move count for each player

#### Cycle Timer (P1 Bug Fix)

- **FR-036**: System MUST provide Pause button in addition to existing Start/Reset buttons
- **FR-037**: System MUST freeze timer when user clicks Pause (preserve remaining time and cycle count)
- **FR-038**: System MUST persist paused state in local storage
- **FR-039**: System MUST allow resuming paused timer, continuing from frozen time
- **FR-040**: System MUST persist sound/flash signal settings across page reloads

#### Stopwatch (P1 Bug Fix)

- **FR-041**: System MUST continue incrementing stopwatch time when user navigates to different pages
- **FR-042**: System MUST restore correct elapsed time when user returns to Stopwatch page
- **FR-043**: System MUST persist stopwatch state (running/paused, elapsed time) in local storage with timestamp
- **FR-044**: System MUST calculate correct elapsed time accounting for time spent on other pages

#### Analog Countdown (P1 Implementation)

- **FR-045**: System MUST render analog clock face with hour and minute hands
- **FR-046**: System MUST position clock hands to represent remaining time (e.g., 10 minutes = hands at 10:00)
- **FR-047**: System MUST animate clock hands smoothly as time decrements (60 FPS or requestAnimationFrame)
- **FR-048**: System MUST change clock face color when entering warning zone (last 1 minute)
- **FR-049**: System MUST support touch/mouse drag interaction to set time by moving clock hands

#### Keyboard Shortcuts (P2 Standardization)

- **FR-050**: All timer pages MUST support Space key to toggle Start/Pause
- **FR-051**: All timer pages MUST support 'R' key to reset timer to initial state
- **FR-052**: Timer pages with fullscreen capability MUST support 'F' key to toggle fullscreen
- **FR-053**: System MUST disable keyboard shortcuts when user is typing in input fields
- **FR-054**: Stopwatch MUST support 'L' key to record lap time (timer-specific shortcut)

#### PWA and Service Worker (P1 Fixes)

- **FR-055**: Service worker MUST detect new app version deployments
- **FR-056**: System MUST display update notification prompt when new version is detected
- **FR-057**: System MUST reload app with new version when user clicks "Reload" on update prompt
- **FR-058**: Service worker MUST cache all essential assets for offline functionality
- **FR-059**: System MUST display "Add to Home Screen" install prompt for PWA installation
- **FR-060**: System MUST function fully offline once installed as PWA

#### Cross-Cutting (P2 UX Improvements)

- **FR-061**: System MUST provide theme toggle button to switch between dark and light modes
- **FR-062**: System MUST persist theme preference in local storage
- **FR-063**: System MUST apply theme consistently across all timer pages
- **FR-064**: System MUST detect and apply system theme preference on first visit (no saved preference)
- **FR-065**: System MUST standardize localStorage keys with consistent prefix (sc.v1.*)
- **FR-066**: System MUST handle localStorage quota exceeded errors gracefully (display warning, prevent crash)
- **FR-067**: System MUST synchronize timer state across multiple browser tabs in real-time using storage events (same timer open in multiple tabs shows identical state)
- **FR-068**: System MUST log errors and warnings to browser console for developer debugging (no external error tracking services)
- **FR-069**: System MUST NOT send any telemetry, analytics, or error reports to external servers (privacy-first, fully offline-capable)

### Key Entities

- **Timer State**: Represents current state of any timer (running, paused, stopped), remaining/elapsed time, configuration (duration, intervals), and signal preferences (sound, flash)
- **Timezone**: Represents geographic timezone with city name, UTC offset, daylight saving rules, and current local time
- **Alarm**: Represents scheduled alarm with target time (HH:MM), active status, label (optional), recurrence pattern (optional), and trigger state
- **Lap Time**: Represents recorded split time in stopwatch with timestamp and elapsed time at lap
- **Chess Clock State**: Represents dual-player timer state with Player 1 time, Player 2 time, active player, move counts, increment/delay settings
- **User Preferences**: Represents global settings like theme (dark/light), default signal options, favorite timers, last-used timer configurations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can adjust countdown time using keyboard shortcuts while timer is paused, with changes reflected in display within 100ms
- **SC-002**: World Clock displays 3 or more timezones simultaneously with accurate UTC offsets, all clocks updating synchronously every second
- **SC-003**: Alarm triggers audio and visual notification within 1 second of reaching target time, with notification persisting until user dismissal
- **SC-004**: Metronome maintains tempo accuracy within ±2% of set BPM over 5-minute duration (tested at 60, 120, 180 BPM)
- **SC-005**: Chess Clock switches between players with <50ms latency when player button is clicked
- **SC-006**: Cycle Timer pause/resume functionality preserves remaining time and cycle count with zero data loss across page navigation
- **SC-007**: Stopwatch continues running in background when user navigates away, with elapsed time accurate to within 100ms when user returns (tested over 5-minute absence)
- **SC-008**: Analog Countdown visual display updates at minimum 30 FPS for smooth clock hand animation
- **SC-009**: All timer pages respond to Space/R/F keyboard shortcuts within 100ms, with shortcuts correctly disabled during text input
- **SC-010**: Service worker detects new app version within 30 seconds of deployment going live, displaying update prompt
- **SC-011**: PWA functions fully offline (all timers operational) after initial installation
- **SC-012**: Theme toggle switches between dark/light mode across all pages within 200ms, with preference persisting across browser sessions
- **SC-013**: 95% of input validation errors are auto-corrected without user intervention (e.g., 99 minutes → 59 minutes)
- **SC-014**: Zero localStorage quota exceeded crashes occur, with graceful degradation to session-only storage if quota is full
- **SC-015**: Timer state synchronizes across multiple browser tabs within 500ms of state change (tested by starting timer in tab A and verifying tab B displays updated state)

## Assumptions

### Technical Assumptions

1. Browser supports HTML5 Web Audio API for metronome click and alarm sounds
2. Browser supports Service Worker API for PWA offline functionality
3. Browser supports localStorage with minimum 5MB quota
4. Browser supports requestAnimationFrame for smooth animations (analog clock, visual beats)
5. System clock in user's device is reasonably accurate (within 1-2 seconds of actual time)

### User Experience Assumptions

1. Users understand standard keyboard shortcuts (Space = start/pause is common convention)
2. Users primarily use timers on desktop/tablet (>600px screen width) but mobile support is required
3. Users tolerate <100ms latency for keyboard shortcut responses
4. Visual flash notifications are acceptable for accessibility (no epilepsy risk disclaimers required beyond standard)
5. Users prefer automatic theme detection from OS settings on first visit

### Data and Integration Assumptions

1. No backend server required - all data persisted in browser localStorage
2. No user authentication required - single-user per browser profile
3. Timezone data can be sourced from Intl.DateTimeFormat API or embedded IANA database
4. No external API calls required for core functionality (fully offline-capable)
5. Browser tab throttling may affect timer accuracy when tab is in background (acceptable degradation)

### Scope Boundaries

1. **In Scope**: All 8 timer tools, home page, PWA offline support, dark/light themes, localStorage persistence
2. **Out of Scope**: User accounts, cloud sync, mobile apps (native iOS/Android), accessibility beyond WCAG AA, multi-language support (Phase 4), social sharing, timer analytics/statistics
3. **Deferred to Future**: Stopwatch lap time export (FR2), multi-stage countdown timer (FR2), custom alarm sounds, alarm recurrence patterns, metronome accent beats

## Dependencies

1. **Browser Compatibility**: Modern browsers supporting ES6+, Service Workers, Web Audio API (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
2. **Deployment Platform**: GitHub Pages or equivalent static hosting with HTTPS (required for Service Workers)
3. **Timezone Data**: IANA timezone database accessible via Intl API or bundled library
4. **Audio Assets**: Click sound files for metronome, alarm sound files (can be generated via Web Audio API oscillators)
5. **Testing Infrastructure**: Playwright E2E test suite must support Service Worker testing

## Out of Scope

The following items from the original handoff report are explicitly **out of scope** for this specification and will be addressed in separate features or deferred to later phases:

### Deferred to Phase 3 (Enhancements)

- Stopwatch lap time function with CSV/JSON export (FR1, FR2)
- Countdown preset timers (5min, 10min, 25min Pomodoro) (FR1)
- Countdown multi-stage timer (Work → Break loops) (FR2)
- Countdown custom sound selection (FR3)
- Analog Countdown touch-drag time setting (initially only clock display, drag interaction deferred)
- Analog Countdown tick sounds (FR3)
- Cycle Timer max cycle count limit (FR1)
- Cycle Timer pause between cycles (FR2)
- Cycle Timer statistics dashboard (FR3)
- World Clock converter mode (FR4)
- Alarm multi-alarm support (FR1)
- Alarm recurrence (daily, weekly) (FR2)
- Alarm snooze function (FR3)
- Alarm labels (FR4)
- Metronome time signature accents (FR5) - basic time signature support only, no accent emphasis
- Chess Clock preset modes (Blitz, Rapid, Classical) (FR1) - manual time entry only initially
- Home page favorites system (FR2)
- Home page last-used timestamp (FR3)
- Home page quick-start (FR4)

### Deferred to Phase 4 (Polish)

- Export/import all timer settings (backup function)
- Offline indicator display
- Privacy-respecting analytics/telemetry
- Multi-language support (EN/DE)
- Mobile layout spacing optimization (current 4.5% gap acceptable for MVP)
- "Coming Soon" placeholder description

### Permanently Out of Scope

- Backend server infrastructure
- User authentication and accounts
- Cloud synchronization across devices
- Native mobile app versions (iOS/Android)
- Browser extensions
- Third-party integrations (Spotify, Google Calendar, etc.)
- Voice control

---

**End of Specification**

This specification is ready for clarification (`/speckit.clarify`) or planning (`/speckit.plan`) phase.
