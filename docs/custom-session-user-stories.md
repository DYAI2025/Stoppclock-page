# Custom Sessions - User Stories & Acceptance Criteria

**Date:** 2025-12-04
**Task:** T1.2 - User Stories & Akzeptanzkriterien formulieren
**Status:** ✅ Complete

## Executive Summary

This document contains **18 user stories** covering all Functional Requirements (FR-1 through FR-9) and Success Criteria (SC-1 through SC-5) from the implementation plan. Each story includes 3-7 testable acceptance criteria in Given-When-Then format.

**Coverage Matrix:**
- FR-1 (Custom Sessions): Stories 1-3
- FR-2 (Element Configuration): Stories 4-5
- FR-3 (Duration Validation): Story 6
- FR-4 (Timer Engine): Stories 7-8
- FR-5 (Focus View): Stories 9-10
- FR-6 (Session Controls): Stories 11-13
- FR-7 (Persistence): Stories 14-15
- FR-8 (Preview Mode): Story 16
- FR-9 (Presets): Story 17
- Cross-cutting: Story 18 (Cross-tab sync)

---

## User Story Format

Each story follows this structure:

```
**Story ID:** US-XXX
**Epic:** [Feature Group]
**Priority:** [Critical / High / Medium / Low]
**Estimation:** [Story Points: 1, 2, 3, 5, 8, 13]

**As a** [role]
**I want** [function]
**So that** [benefit]

**Acceptance Criteria:**
1. **Given** [context], **When** [action], **Then** [outcome]
2. ...
```

---

## Epic 1: Session Creation & Management

### US-001: Create Custom Session from Scratch

**Story ID:** US-001
**Epic:** Session Creation
**Priority:** 🔴 Critical
**FR Coverage:** FR-1, FR-7
**Estimation:** 5 story points

**As a** workshop facilitator
**I want** to create a custom session with multiple elements from scratch
**So that** I can structure my workshop with specific phases and timing

**Acceptance Criteria:**

1. **Given** I am on the Custom Sessions landing page
   **When** I click "New Session"
   **Then** I am navigated to an empty Session Builder view with an "Add Element" button

2. **Given** I am in the Session Builder
   **When** I click "Add Element"
   **Then** a form appears with fields for Element Type, Duration, and Focus Text

3. **Given** I have filled in valid element details (type: Speaking, duration: 5 min, text: "Share your thoughts")
   **When** I click "Add Element"
   **Then** the element is added to the session list and the timeline preview updates

4. **Given** I have added at least 1 element
   **When** I click "Save & Exit"
   **Then** the session is saved to localStorage and I am returned to the sessions list

5. **Given** I have added multiple elements
   **When** I view the timeline preview
   **Then** I see a color-coded visual timeline showing all elements with their durations

6. **Given** I create a session with 4 elements (2 speaking, 1 transition, 1 cooldown)
   **When** I complete the creation process
   **Then** the median creation time is less than 3 minutes (SC-1)

7. **Given** I try to save a session with 0 elements
   **When** I click "Save & Exit"
   **Then** I see an error message: "Add at least 1 element to save session"

---

### US-002: Edit Existing Session

**Story ID:** US-002
**Epic:** Session Management
**Priority:** 🟡 High
**FR Coverage:** FR-1, FR-7
**Estimation:** 3 story points

**As a** couples therapist
**I want** to edit a previously saved session
**So that** I can adjust timings or add new phases without starting over

**Acceptance Criteria:**

1. **Given** I have saved sessions in my list
   **When** I click "Edit" on a session card
   **Then** the Session Builder loads with all existing elements displayed

2. **Given** I am editing a session
   **When** I click "Edit" on an element
   **Then** a modal/form opens pre-filled with the element's current values

3. **Given** I have modified an element's duration from 5 min to 8 min
   **When** I click "Save Changes"
   **Then** the element is updated, the timeline preview refreshes, and changes are persisted to localStorage

4. **Given** I am editing a session
   **When** I click "Delete" on an element
   **Then** a confirmation dialog appears: "Delete this element? This cannot be undone."

5. **Given** I confirm deletion of an element
   **When** the deletion completes
   **Then** the element is removed from the list and an "Undo" toast appears for 5 seconds

6. **Given** I have edited a session with changes
   **When** I leave the page without explicitly saving (auto-save enabled)
   **Then** changes are saved automatically with 150ms debounce

---

### US-003: Delete Session

**Story ID:** US-003
**Epic:** Session Management
**Priority:** 🟢 Medium
**FR Coverage:** FR-7
**Estimation:** 2 story points

**As a** teacher
**I want** to delete old or unused sessions
**So that** my sessions list stays organized and relevant

**Acceptance Criteria:**

1. **Given** I am viewing my sessions list
   **When** I click the "Delete" button (trash icon) on a session
   **Then** a confirmation dialog appears showing the session name and element count

2. **Given** the confirmation dialog is open
   **When** I click "Delete Session"
   **Then** the session is removed from localStorage and the list updates immediately

3. **Given** I just deleted a session
   **When** the deletion completes
   **Then** an "Undo" toast appears for 5 seconds allowing me to restore the session

4. **Given** I deleted a session and wait >5 seconds
   **When** the undo timer expires
   **Then** the session is permanently deleted and cannot be recovered

5. **Given** I try to delete a session that is currently running
   **When** I click "Delete"
   **Then** I see an error: "Cannot delete active session. Stop it first."

---

## Epic 2: Element Configuration & Validation

### US-004: Configure Element Type, Duration, and Focus Text

**Story ID:** US-004
**Epic:** Element Configuration
**Priority:** 🔴 Critical
**FR Coverage:** FR-2
**Estimation:** 5 story points

**As a** workshop facilitator
**I want** to configure each element's type, duration, and focus text
**So that** each phase has clear instructions and appropriate timing

**Acceptance Criteria:**

1. **Given** I am adding a new element
   **When** I select "Speaking Phase" as the element type
   **Then** the type is stored and displayed in the element card

2. **Given** I am adding a new element
   **When** I set the duration to 5 minutes and 30 seconds
   **Then** the duration is stored as 330000 milliseconds (5:30)

3. **Given** I am adding a new element
   **When** I enter focus text: "Share your thoughts on the project goals"
   **Then** the text is stored and will be displayed during the live session

4. **Given** I am configuring an element
   **When** I select different element types (Speaking, Transition, Cooldown, Custom)
   **Then** each type is visually distinguished in the timeline preview (different colors)

5. **Given** I add multiple elements with different types
   **When** I view the session
   **Then** I can identify each element type by its color coding:
   - Green: Speaking Phase
   - Orange: Transition
   - Gray: Cooldown
   - Blue: Custom

---

### US-005: Reorder Session Elements

**Story ID:** US-005
**Epic:** Element Configuration
**Priority:** 🟡 High
**FR Coverage:** FR-1, FR-2
**Estimation:** 3 story points

**As a** workshop facilitator
**I want** to reorder session elements via drag-and-drop or arrow buttons
**So that** I can adjust the session flow without recreating elements

**Acceptance Criteria:**

1. **Given** I have a session with 3+ elements (on desktop)
   **When** I drag Element 2 to the position of Element 1
   **Then** the elements swap positions and the timeline preview updates

2. **Given** I have a session with 3+ elements (on mobile)
   **When** I click the "↑" button on Element 3
   **Then** Element 3 moves up one position and becomes Element 2

3. **Given** I reorder elements
   **When** the reordering completes
   **Then** changes are auto-saved to localStorage with 150ms debounce

4. **Given** I try to move Element 1 up
   **When** I click the "↑" button
   **Then** the button is disabled (cannot move first element higher)

5. **Given** I try to move the last element down
   **When** I click the "↓" button
   **Then** the button is disabled (cannot move last element lower)

---

### US-006: Validate Duration Constraints (30 seconds - 30 minutes)

**Story ID:** US-006
**Epic:** Element Configuration
**Priority:** 🔴 Critical
**FR Coverage:** FR-3
**Estimation:** 3 story points

**As a** system administrator
**I want** to enforce duration limits (30 seconds minimum, 30 minutes maximum)
**So that** sessions remain practical and prevent user errors

**Acceptance Criteria:**

1. **Given** I am adding a new element
   **When** I set the duration to 20 seconds
   **Then** I see an inline error: "Minimum duration is 30 seconds" and the "Add Element" button is disabled

2. **Given** I am adding a new element
   **When** I set the duration to 31 minutes
   **Then** I see an inline error: "Maximum duration is 30 minutes" and the "Add Element" button is disabled

3. **Given** I am adding a new element
   **When** I set the duration to exactly 30 seconds
   **Then** the input is valid (green border) and the "Add Element" button is enabled

4. **Given** I am adding a new element
   **When** I set the duration to exactly 30 minutes
   **Then** the input is valid (green border) and the "Add Element" button is enabled

5. **Given** I try to save a session with an invalid element duration
   **When** I click "Save & Exit"
   **Then** the invalid element is highlighted with a red border and I see an error summary

6. **Given** I load a corrupted session from localStorage with invalid duration (<30s)
   **When** the session loads
   **Then** the system auto-corrects the duration to 30 seconds and logs a warning

---

## Epic 3: Timer Engine & Live Session

### US-007: Run Custom Session with Timer Countdown

**Story ID:** US-007
**Epic:** Timer Engine
**Priority:** 🔴 Critical
**FR Coverage:** FR-4, SC-3
**Estimation:** 8 story points

**As a** couples therapist
**I want** to start a custom session and have the timer count down for each element
**So that** the session progresses automatically without manual intervention

**Acceptance Criteria:**

1. **Given** I have a session with 3 elements (5 min, 1 min, 2 min)
   **When** I click "Start Session"
   **Then** the Focus View loads and the timer starts counting down from 5:00

2. **Given** the timer is running for Element 1
   **When** the timer reaches 0:00
   **Then** an audio chime plays and the session auto-advances to Element 2

3. **Given** the session is running
   **When** I observe the timer for 30 minutes
   **Then** the timer drift is less than 1 second (SC-3, NFR-2)

4. **Given** a session with 4 elements runs to completion
   **When** all elements finish
   **Then** the success rate is ≥95% (no errors, crashes, or phase skips) (SC-3)

5. **Given** the timer is running
   **When** I reload the page mid-session
   **Then** the session state is restored with adjusted remaining time based on elapsed time

6. **Given** the timer is running and I reload the page
   **When** the page loads
   **Then** the timer is paused (running = false) as a safety feature

7. **Given** the timer is counting down
   **When** I observe the UI update frequency
   **Then** the timer updates at 60 FPS (requestAnimationFrame) with no visible lag

---

### US-008: Display Focus Text in Live Session

**Story ID:** US-008
**Epic:** Focus View
**Priority:** 🔴 Critical
**FR Coverage:** FR-5, SC-2
**Estimation:** 5 story points

**As a** teacher
**I want** to see large, prominent focus text during each session element
**So that** students can easily read instructions from across the classroom

**Acceptance Criteria:**

1. **Given** I am running a session on a projector (≥1280px width)
   **When** Element 1 starts with focus text: "Share your thoughts on the project goals"
   **Then** the text is displayed at 4rem (64px) font size in white (#FFFFFF) on charcoal background (#0b1220)

2. **Given** I am running a session on mobile (375px width)
   **When** an element starts
   **Then** the focus text is displayed at 1.5rem (24px) font size (responsive scaling)

3. **Given** I am running a session with focus text visible
   **When** I measure the contrast ratio
   **Then** the contrast ratio is ≥18:1 (WCAG AAA compliance)

4. **Given** I run a session and complete it
   **When** I submit the post-session readability survey
   **Then** ≥90% of users rate readability ≥4/5 stars (SC-2)

5. **Given** I add focus text with 300 characters
   **When** the element runs in Focus View
   **Then** the text auto-scales down by 20% to fit on screen without overflow

6. **Given** I am viewing focus text on a projector
   **When** I stand 5 meters away
   **Then** the text is easily readable (manual test requirement from SC-2)

---

### US-009: Large Timer Display in Focus View

**Story ID:** US-009
**Epic:** Focus View
**Priority:** 🟡 High
**FR Coverage:** FR-5
**Estimation:** 3 story points

**As a** workshop facilitator
**I want** a large, clear timer display in the Focus View
**So that** participants can easily see the remaining time

**Acceptance Criteria:**

1. **Given** I am running a session with 8 minutes remaining
   **When** I view the Focus View on desktop
   **Then** the timer displays "08:00" in 6rem (96px) font size (or 8rem/128px on projector)

2. **Given** the timer is counting down
   **When** I observe the timer format
   **Then** it displays in MM:SS format with leading zeros (e.g., "05:32", "00:08")

3. **Given** the timer reaches the last 10 seconds
   **When** I observe the timer color
   **Then** the timer text changes to red (#DC143C) for visual urgency

4. **Given** I am viewing the timer on mobile
   **When** the screen width is <640px
   **Then** the timer displays at 3rem (48px) font size (responsive scaling)

5. **Given** I am viewing the timer
   **When** I check the font styling
   **Then** the timer uses tabular-nums (monospace digits) for alignment stability

---

### US-010: Phase Title and Guidance in Focus View

**Story ID:** US-010
**Epic:** Focus View
**Priority:** 🟢 Medium
**FR Coverage:** FR-5
**Estimation:** 2 story points

**As a** couples therapist
**I want** to see a phase title and optional guidance text in the Focus View
**So that** participants understand which phase they are in

**Acceptance Criteria:**

1. **Given** I am running Element 2 of 5 (type: Transition)
   **When** I view the Focus View
   **Then** the phase title displays "Element 2 of 5 - Transition" at the top

2. **Given** an element has a custom name set (e.g., "Opening Check-In")
   **When** the element runs
   **Then** the phase title displays "Opening Check-In" instead of "Element X of Y"

3. **Given** I am in the Focus View
   **When** I view the layout
   **Then** the phase title is at the top (2.5rem on projector, 1.25rem on mobile)

4. **Given** the session transitions from Element 1 to Element 2
   **When** the transition occurs
   **Then** the phase title updates smoothly with a 600ms fade transition

---

## Epic 4: Session Controls & Interaction

### US-011: Pause and Resume Session

**Story ID:** US-011
**Epic:** Session Controls
**Priority:** 🔴 Critical
**FR Coverage:** FR-6
**Estimation:** 3 story points

**As a** workshop facilitator
**I want** to pause and resume a running session
**So that** I can handle interruptions or allow extra discussion time

**Acceptance Criteria:**

1. **Given** a session is running with 8:32 remaining
   **When** I click the "Pause" button (or press Space key)
   **Then** the timer stops counting down and the button label changes to "Resume"

2. **Given** a session is paused with 8:32 remaining
   **When** I wait 2 minutes and observe the timer
   **Then** the timer still displays 8:32 (not counting down while paused)

3. **Given** a session is paused
   **When** I click "Resume" (or press Space key)
   **Then** the timer resumes counting down from the paused time (e.g., 8:32 → 8:31 → ...)

4. **Given** I pause and resume multiple times
   **When** the element completes
   **Then** the total elapsed time matches the element's configured duration ±1 second

5. **Given** a session is paused
   **When** I reload the page
   **Then** the session loads in paused state with the correct remaining time

---

### US-012: Skip to Next Element

**Story ID:** US-012
**Epic:** Session Controls
**Priority:** 🟡 High
**FR Coverage:** FR-6
**Estimation:** 2 story points

**As a** workshop facilitator
**I want** to manually skip to the next element before the timer finishes
**So that** I can adapt to the session pace (e.g., element finished early)

**Acceptance Criteria:**

1. **Given** Element 1 is running with 3:45 remaining (≥10 seconds)
   **When** I click the "Next" button
   **Then** a confirmation dialog appears: "Skip to next element?"

2. **Given** the confirmation dialog is open
   **When** I click "Skip"
   **Then** the session immediately advances to Element 2, plays a chime, and starts the new timer

3. **Given** Element 1 is running with 8 seconds remaining (<10 seconds)
   **When** I click "Next"
   **Then** the session skips immediately without confirmation (fast-track for near-completion)

4. **Given** I am on the last element of a session
   **When** I click "Next"
   **Then** the session goes to the Completion Screen (not an error)

5. **Given** I skip an element mid-session
   **When** I view the session analytics
   **Then** the skip event is logged (for future analysis of session pacing)

---

### US-013: Reset Session to Beginning

**Story ID:** US-013
**Epic:** Session Controls
**Priority:** 🟡 High
**FR Coverage:** FR-6
**Estimation:** 2 story points

**As a** teacher
**I want** to reset a running session back to the first element
**So that** I can restart if something went wrong or if I want to run the session again

**Acceptance Criteria:**

1. **Given** I am on Element 3 of 5 with 2:15 remaining
   **When** I click the "Reset" button (or press R key)
   **Then** a confirmation dialog appears: "Reset session to the beginning?"

2. **Given** the reset confirmation dialog is open
   **When** I click "Reset"
   **Then** the session returns to Element 1, timer resets to Element 1's duration, and timer is paused

3. **Given** I reset a session
   **When** I observe the state
   **Then** the currentElementIndex = 0, remainingMs = elements[0].durationMs, running = false

4. **Given** I reset a session mid-run
   **When** I view the completion stats later
   **Then** the reset event is logged but does not count as a "completed session"

---

### US-014: Toggle Fullscreen Mode

**Story ID:** US-014
**Epic:** Session Controls
**Priority:** 🟡 High
**FR Coverage:** FR-6
**Estimation:** 2 story points

**As a** workshop facilitator
**I want** to toggle fullscreen mode during a session
**So that** I can maximize screen real estate for projection

**Acceptance Criteria:**

1. **Given** I am in the Focus View (not fullscreen)
   **When** I click the "Fullscreen" button (or press F key)
   **Then** the browser enters fullscreen mode hiding the address bar and app header

2. **Given** I am in fullscreen mode
   **When** I press Escape or click "Exit Fullscreen"
   **Then** the browser exits fullscreen and restores the normal layout

3. **Given** I enter fullscreen mode
   **When** I observe the typography
   **Then** the focus text font size increases by 20% (e.g., 4rem → 4.8rem on projector)

4. **Given** I am in fullscreen mode
   **When** the browser does not support Fullscreen API
   **Then** the "Fullscreen" button is disabled and shows a tooltip: "Fullscreen not available"

5. **Given** I am in fullscreen mode
   **When** the session completes
   **Then** fullscreen mode is maintained (does not auto-exit)

---

## Epic 5: Persistence & Templates

### US-015: Save and Load Custom Sessions

**Story ID:** US-015
**Epic:** Persistence
**Priority:** 🔴 Critical
**FR Coverage:** FR-7, NFR-4
**Estimation:** 3 story points

**As a** workshop facilitator
**I want** my custom sessions to persist across browser sessions
**So that** I can reuse them later without recreating

**Acceptance Criteria:**

1. **Given** I create a session with 4 elements
   **When** I save the session
   **Then** the session is written to localStorage with key `sc.v1.custom-sessions`

2. **Given** I have saved sessions in localStorage
   **When** I close the browser and reopen stoppclock.com
   **Then** my saved sessions appear in the sessions list

3. **Given** I save a session and reload the page
   **When** the page loads
   **Then** the session loads within 200ms (NFR-4)

4. **Given** I have 10 saved sessions
   **When** I check localStorage usage
   **Then** the total usage is <500KB (5% of 10MB browser limit)

5. **Given** localStorage is full (quota exceeded)
   **When** I try to save a new session
   **Then** I see an error: "Storage full. Delete old sessions to continue."

6. **Given** I edit a session and close the browser tab mid-edit
   **When** I reopen the session later
   **Then** the auto-saved changes are preserved (150ms debounce)

---

### US-016: Save Session as Reusable Template

**Story ID:** US-016
**Epic:** Persistence
**Priority:** 🟡 High
**FR Coverage:** FR-7, FR-9
**Estimation:** 3 story points

**As a** couples therapist
**I want** to save a session as a reusable template
**So that** I can quickly create new sessions based on proven structures

**Acceptance Criteria:**

1. **Given** I am creating/editing a session
   **When** I check the "Save as Template" checkbox
   **Then** additional fields appear: "Template Name" (required) and "Description" (optional)

2. **Given** I enter a template name "Workshop Check-In (3 rounds)"
   **When** I save the session
   **Then** the session is marked as a template (`isTemplate: true`) and appears in "My Templates" list

3. **Given** I have saved templates in my list
   **When** I click "New Session from Template"
   **Then** I see a list of my templates with name, description, and element count

4. **Given** I select a template
   **When** I click "Use Template"
   **Then** a new session is created as a copy of the template (independent, not linked)

5. **Given** I edit a session created from a template
   **When** I modify elements
   **Then** the original template remains unchanged (copy, not reference)

6. **Given** I try to save a template with a duplicate name
   **When** I click "Save"
   **Then** I see a warning: "Template name exists. Overwrite or rename?"

---

### US-017: Browse Sessions List with Metadata

**Story ID:** US-017
**Epic:** Persistence
**Priority:** 🟢 Medium
**FR Coverage:** FR-7
**Estimation:** 2 story points

**As a** teacher
**I want** to browse my saved sessions with metadata (name, duration, element count)
**So that** I can quickly find and select the right session

**Acceptance Criteria:**

1. **Given** I have 5 saved sessions
   **When** I navigate to the Custom Sessions page
   **Then** I see a list of session cards showing name, total duration, and element count

2. **Given** I am viewing the sessions list
   **When** I observe each session card
   **Then** each card shows:
   - Session name (user-defined or "Untitled Session")
   - Total duration (e.g., "13 minutes")
   - Element count (e.g., "4 elements")
   - Last modified date (e.g., "2 days ago")
   - Action buttons: [Edit] [Start] [Delete]

3. **Given** I have 0 saved sessions
   **When** I navigate to Custom Sessions
   **Then** I see an empty state: "No sessions yet. Create your first session!" with a [+ New Session] button

4. **Given** I have 10+ sessions
   **When** I view the list
   **Then** sessions are sorted by "Last Modified" (most recent first)

5. **Given** I am viewing a session card
   **When** I click the session name or card background
   **Then** I am taken to the Session Builder to edit the session

---

## Epic 6: Preview & Testing

### US-018: Preview Session Before Running

**Story ID:** US-018
**Epic:** Preview Mode
**Priority:** 🟡 High
**FR Coverage:** FR-8, SC-1
**Estimation:** 5 story points

**As a** workshop facilitator
**I want** to preview a session quickly without running the full timer
**So that** I can validate the layout, text, and flow before using it live

**Acceptance Criteria:**

1. **Given** I am in the Session Builder with ≥1 element
   **When** I click "Preview"
   **Then** the Preview View loads showing a banner: "⚡ Preview Mode (not running actual timer)"

2. **Given** I am in Preview Mode
   **When** the preview starts
   **Then** Element 1 is displayed for 3 seconds, then auto-advances to Element 2

3. **Given** I am in Preview Mode viewing Element 2
   **When** I click "Next Element"
   **Then** the preview immediately advances to Element 3 (manual skip)

4. **Given** I preview a session with 4 elements
   **When** the preview completes
   **Then** I see a completion screen: "Preview complete. Start session or edit?" with [Start] [Edit] [Close] buttons

5. **Given** I am in Preview Mode
   **When** the preview runs through all elements
   **Then** the session state is NOT modified (preview does not count as "run")

6. **Given** I preview a session
   **When** I check the focus text layout
   **Then** I can verify that text fits on screen without overflow (manual validation)

7. **Given** I preview a session with 5 elements
   **When** the preview completes
   **Then** the total preview time is <30 seconds (3s per element + transitions)

---

## Epic 7: Preset Sessions

### US-019: Browse and Use Preset Sessions

**Story ID:** US-019
**Epic:** Presets
**Priority:** 🟢 Medium
**FR Coverage:** FR-9, SC-4
**Estimation:** 3 story points

**As a** new user
**I want** to browse preset sessions (e.g., "Workshop Check-In", "Couples Dialogue")
**So that** I can get started quickly without creating from scratch

**Acceptance Criteria:**

1. **Given** I am on the Custom Sessions landing page
   **When** I view the page
   **Then** I see a "Preset Templates" section with 1-3 predefined sessions

2. **Given** I view a preset session card
   **When** I read the card
   **Then** I see:
   - Preset name (e.g., "Workshop Check-In (3 rounds)")
   - Description (e.g., "Quick check-in for teams, 3 rounds of 5 min each")
   - Total duration (e.g., "20 minutes")
   - Element count (e.g., "4 elements")
   - [Preview] [Use This Template] buttons

3. **Given** I click "Use This Template" on a preset
   **When** the action completes
   **Then** a new session is created as a copy of the preset and I am taken to the Session Builder

4. **Given** I create a session from a preset
   **When** I modify elements
   **Then** the original preset remains unchanged (copy, not reference)

5. **Given** I preview a preset session
   **When** the preview runs
   **Then** I see the preset elements in Focus View format without starting a full session

---

## Epic 8: Cross-Tab Synchronization

### US-020: Sync Session Edits Across Browser Tabs

**Story ID:** US-020
**Epic:** Persistence
**Priority:** 🟢 Medium
**FR Coverage:** NFR-4 (implied from plan)
**Estimation:** 3 story points

**As a** workshop facilitator
**I want** my session edits to sync across multiple browser tabs
**So that** I can work in multiple tabs without conflicts

**Acceptance Criteria:**

1. **Given** I have 2 browser tabs open on Custom Sessions
   **When** I create a new session in Tab 1
   **Then** the new session appears in Tab 2's sessions list within 500ms

2. **Given** I am editing a session in Tab 1
   **When** I add an element and save
   **Then** Tab 2 reflects the updated session within 500ms (cross-tab sync via StorageEvent)

3. **Given** I am editing the same session in both Tab 1 and Tab 2 simultaneously
   **When** I save changes in Tab 1
   **Then** Tab 2 shows a warning: "Session was modified in another tab. Reload to see changes?"

4. **Given** I delete a session in Tab 1
   **When** the deletion completes
   **Then** Tab 2's sessions list updates within 500ms and the deleted session disappears

5. **Given** I am running a session in Tab 1
   **When** I open Tab 2 and view the same session
   **Then** Tab 2 shows the session as "Currently Running" with a disabled "Start" button

---

## Cross-Cutting User Stories

### US-021: Keyboard Shortcuts for Session Controls

**Story ID:** US-021
**Epic:** Accessibility
**Priority:** 🟡 High
**FR Coverage:** Cross-cutting (FR-6)
**Estimation:** 2 story points

**As a** power user
**I want** to use keyboard shortcuts to control sessions
**So that** I can operate the timer efficiently without using the mouse

**Acceptance Criteria:**

1. **Given** I am in the Focus View with a running session
   **When** I press Space key
   **Then** the session pauses (or resumes if already paused)

2. **Given** I am in the Focus View
   **When** I press R key
   **Then** a reset confirmation dialog appears

3. **Given** I am in the Focus View
   **When** I press F key
   **Then** the browser toggles fullscreen mode

4. **Given** I am in the Focus View
   **When** I press N key
   **Then** the session skips to the next element (with confirmation if >10s remaining)

5. **Given** I am typing in an input field (Session Builder)
   **When** I press Space or R key
   **Then** the shortcut does NOT trigger (shortcuts disabled in input fields)

6. **Given** I press a keyboard shortcut
   **When** the action completes
   **Then** visual feedback is provided (button highlight or toast)

---

### US-022: Accessibility - Screen Reader Support

**Story ID:** US-022
**Epic:** Accessibility
**Priority:** 🟢 Medium
**FR Coverage:** NFR-5
**Estimation:** 3 story points

**As a** visually impaired user using a screen reader
**I want** the Custom Sessions feature to be accessible
**So that** I can create and run sessions independently

**Acceptance Criteria:**

1. **Given** I am using a screen reader (NVDA, VoiceOver)
   **When** I navigate the Session Builder
   **Then** all buttons, inputs, and interactive elements are announced with clear labels

2. **Given** I am in the Focus View with a running timer
   **When** the timer counts down
   **Then** the screen reader announces time remaining every 1 minute (not every second)

3. **Given** I am navigating the sessions list
   **When** I use Tab key
   **Then** focus moves sequentially through session cards and action buttons with visible focus indicators

4. **Given** I am in the Session Builder
   **When** I use keyboard navigation
   **Then** I can add, edit, delete, and reorder elements using only keyboard (Tab, Enter, Arrow keys)

5. **Given** I submit the Add Element form
   **When** validation errors occur
   **Then** error messages are announced by screen reader and linked to invalid fields (aria-describedby)

---

## Coverage Matrix: User Stories → Functional Requirements

| FR | Description | Covered by Stories |
|----|-------------|--------------------|
| **FR-1** | Custom sessions with element list | US-001, US-002, US-005 |
| **FR-2** | Type/Duration/Text per element | US-004, US-005 |
| **FR-3** | Duration validation (30s-30min) | US-006 |
| **FR-4** | Timer engine runs session | US-007 |
| **FR-5** | Large focus text, color highlight | US-008, US-009, US-010 |
| **FR-6** | Pause/Resume/Next/Reset/Fullscreen | US-011, US-012, US-013, US-014 |
| **FR-7** | Persistent storage & overview | US-015, US-016, US-017 |
| **FR-8** | Preview/test mode | US-018 |
| **FR-9** | Preset templates | US-019 |
| **NFR-4** | Cross-tab sync | US-020 |
| **NFR-5** | Accessibility | US-021, US-022 |

**Total:** 22 user stories covering all 9 FRs + 2 NFRs

---

## Story Points Summary

| Epic | Stories | Total Story Points |
|------|---------|-------------------|
| **Session Creation & Management** | 3 | 10 |
| **Element Configuration** | 3 | 11 |
| **Timer Engine & Live Session** | 4 | 18 |
| **Session Controls** | 4 | 9 |
| **Persistence & Templates** | 3 | 8 |
| **Preview & Testing** | 1 | 5 |
| **Preset Sessions** | 1 | 3 |
| **Cross-Tab Sync** | 1 | 3 |
| **Accessibility** | 2 | 5 |
| **TOTAL** | **22** | **72 story points** |

**Estimation Assumptions:**
- 1 story point ≈ 2-4 hours
- 72 story points ≈ 144-288 hours ≈ 18-36 days (1 developer)
- Original estimate: 28 days (falls within range)

---

## Prioritization for MVP

### Must-Have (MVP - 48 story points)
- ✅ US-001, US-002: Session creation & editing
- ✅ US-004, US-006: Element configuration & validation
- ✅ US-007, US-008, US-009: Timer engine & Focus View
- ✅ US-011, US-012, US-013: Session controls (Pause/Next/Reset)
- ✅ US-015: Persistence

### Should-Have (Post-MVP - 16 story points)
- 🟡 US-005: Reorder elements
- 🟡 US-010: Phase title/guidance
- 🟡 US-014: Fullscreen mode
- 🟡 US-016, US-017: Templates & sessions list
- 🟡 US-018: Preview mode

### Nice-to-Have (Future - 8 story points)
- 🟢 US-003: Delete sessions (can reuse Edit → clear all elements)
- 🟢 US-019: Preset sessions
- 🟢 US-020: Cross-tab sync
- 🟢 US-021, US-022: Accessibility enhancements

---

## Testing Strategy (Maps to T4.1, T4.2)

### Automated Tests (T4.1)
- Unit tests for:
  - Duration validation (US-006): 30s-30min boundary tests
  - Timer engine (US-007): Drift measurement, state transitions
  - Storage (US-015): Save/load/reload scenarios
- Integration tests for:
  - End-to-end flows: US-001 → US-007 (Create → Run session)
  - Cross-tab sync (US-020): Multi-tab editing

### Manual Tests (T4.2)
- Usability tests (SC-1):
  - N=10 users attempt US-001 (Create session in <3 min)
- Readability tests (SC-2):
  - Projector tests at 5m, 7m, 10m for US-008
- Performance tests:
  - 60-minute session (US-007) for timer drift measurement

---

## Next Steps (Task T1.3)

1. ✅ **Completed:** User Stories with Acceptance Criteria (22 stories)
2. ⏭️ **Next:** Design Session Builder UX concept (T1.3)
3. ⏭️ **After:** Design Focus View UX concept (T1.4)

---

**End of Document**
