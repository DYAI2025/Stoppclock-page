# Custom Sessions - User Journeys & Flows

**Date:** 2025-12-04
**Task:** T1.1 - User Journeys & Flows definieren
**Status:** ✅ Complete

## Executive Summary

This document defines 6 primary user flows for the Custom Sessions feature:
1. **Create New Session** (from scratch)
2. **Start & Run Session** (live timer)
3. **Edit Existing Session** (modify template)
4. **Delete Session** (remove template)
5. **Preview/Test Session** (validate before running)
6. **Upgrade from Couples Timer** (migration path)

Each flow includes decision points, error handling, and validation steps.

---

## User Personas

### Persona 1: Workshop Facilitator (Sarah)
- **Demographics:** 35, trainer, runs corporate workshops
- **Use Case:** Needs timers for structured exercises (3-5 min speaking, 1 min transition, 2 min reflection)
- **Tech Savvy:** High
- **Frequency:** 2-3 times/week
- **Key Need:** Quick session creation, reusable templates, projection-ready focus view

### Persona 2: Couples Therapist (Marcus)
- **Demographics:** 48, therapist, uses Zwiegespräch method
- **Use Case:** Structured couple dialogue sessions (existing Couples Timer user)
- **Tech Savvy:** Medium
- **Frequency:** Daily (5-8 sessions/day)
- **Key Need:** Upgrade from fixed presets to customizable sessions, maintain familiar flow

### Persona 3: Teacher (Lisa)
- **Demographics:** 29, high school teacher, uses timers for classroom activities
- **Use Case:** Exam timers, group work, presentation timers with focus prompts
- **Tech Savvy:** Medium
- **Frequency:** Daily (1-3 times/day)
- **Key Need:** Simple, fast session creation, readable from back of classroom

---

## Flow 1: Create New Session (From Scratch)

### Goal
User creates a custom session with ≥1 element, saves it (optionally as template), and is ready to start.

### Entry Points
1. Home page → "Custom Sessions" button
2. Header navigation → "Custom Sessions" link
3. Existing Couples Timer → "Upgrade to Custom Sessions" prompt

### Flow Diagram

```
[Entry Point]
    ↓
[Custom Sessions Landing]
    ↓ Click "New Session"
[Session Builder - Empty]
    ↓
[Add First Element] ←─────────┐
    ↓                          │
[Configure Element]            │
  • Type: SPEAK/TRANSITION/... │
  • Duration: 30s - 30min      │
  • Focus Text: User input     │
    ↓                          │
[Validate & Add] ──(Add More)─┘
    ↓
[Review Timeline Preview]
    ↓
[Optional: Save as Template]
  • Template Name
  • Description
    ↓
[Start Session] or [Save & Exit]
    ↓
[Focus View - Live Session]
```

### Detailed Steps

#### Step 1: Landing on Session Builder

**User Action:** Clicks "Custom Sessions" from home page or nav

**System Response:**
- Navigates to `#/custom-sessions`
- Checks for existing sessions in localStorage
- If no sessions: Show empty state with "Create Your First Session" CTA
- If sessions exist: Show sessions list + "New Session" button

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  Custom Sessions Builder                  │
│  ───────────────────────────────────────  │
│                                           │
│  [+ New Session]  [📁 My Templates (3)]   │
│                                           │
│  ╔═════════════════════════════════════╗  │
│  ║  No sessions yet.                   ║  │
│  ║  Click "New Session" to get started.║  │
│  ╚═════════════════════════════════════╝  │
│                                           │
│  Or try a preset:                         │
│  [Couples Dialogue]  [Workshop Timer]    │
└───────────────────────────────────────────┘
```

#### Step 2: Initialize New Session

**User Action:** Clicks "New Session"

**System Response:**
- Creates empty session object: `{ id: UUID, name: 'Untitled Session', elements: [], createdAt: now }`
- Navigates to Session Builder edit view
- Auto-focus on "Add Element" button or first input field

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  ← Back   Untitled Session                │
│  ───────────────────────────────────────  │
│                                           │
│  Session Elements (0)                     │
│  ╔═════════════════════════════════════╗  │
│  ║  No elements yet.                   ║  │
│  ║  Add your first phase below.        ║  │
│  ╚═════════════════════════════════════╝  │
│                                           │
│  [+ Add Element]                          │
│                                           │
│  Timeline Preview                         │
│  [Empty timeline bar]                     │
└───────────────────────────────────────────┘
```

#### Step 3: Add Element

**User Action:** Clicks "+ Add Element"

**System Response:**
- Expands element creation form
- Shows element type selector (radio buttons or dropdown)
- Shows duration input (minutes + seconds)
- Shows focus text textarea

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  Add Session Element                      │
│  ───────────────────────────────────────  │
│                                           │
│  Element Type:                            │
│  ○ Speaking Phase                         │
│  ○ Transition / Break                     │
│  ○ Cooldown / Reflection                  │
│  ○ Custom                                 │
│                                           │
│  Duration:                                │
│  [5] minutes [0] seconds                  │
│  (30 seconds - 30 minutes)                │
│                                           │
│  Focus Text (shown during phase):         │
│  ┌──────────────────────────────────────┐│
│  │ Enter instructions or prompt...      ││
│  │                                      ││
│  │ (max 500 characters)                 ││
│  └──────────────────────────────────────┘│
│                                           │
│  [Cancel]  [Add Element]                  │
└───────────────────────────────────────────┘
```

**Validation Rules:**
- Duration: ≥30 seconds AND ≤30 minutes
- Focus Text: ≥1 character, ≤500 characters
- Element Type: Must select one

**Error Messages:**
- Duration too short: "Minimum duration is 30 seconds"
- Duration too long: "Maximum duration is 30 minutes"
- Empty focus text: "Focus text is required"

#### Step 4: Validate & Add Element

**User Action:** Clicks "Add Element"

**System Response (Valid Input):**
- Validates all fields
- Adds element to session: `session.elements.push(newElement)`
- Closes form
- Updates timeline preview (adds new segment)
- Shows success feedback (green checkmark animation)
- Re-enables "+ Add Element" button

**System Response (Invalid Input):**
- Shows inline error messages below invalid fields
- Highlights invalid fields with red border
- Keeps form open
- Disables "Add Element" button until errors resolved

**UI Elements (Success):**
```
┌───────────────────────────────────────────┐
│  Session Elements (1)                     │
│  ─────────────────────────────────────    │
│  ✅ Element 1: Speaking Phase             │
│     Duration: 5:00                        │
│     Text: "Share your thoughts on..."     │
│     [Edit] [Delete] [↑] [↓]               │
│                                           │
│  [+ Add Element]                          │
│                                           │
│  Timeline Preview                         │
│  ┌────────────────────────────────────┐   │
│  │ ████████████████████ (5:00)        │   │
│  └────────────────────────────────────┘   │
│  Total Duration: 5:00                     │
└───────────────────────────────────────────┘
```

#### Step 5: Add More Elements (Loop)

**User Action:** Clicks "+ Add Element" again (repeat Step 3-4)

**System Response:**
- Shows element creation form again
- Pre-fills with sensible defaults:
  - Type: Same as previous element (or alternate if SPEAK)
  - Duration: Same as previous element
  - Focus Text: Empty

**Tip:** After 2+ elements, show reordering controls (drag handles or ↑↓ buttons)

#### Step 6: Review Timeline Preview

**User Action:** Scrolls to timeline preview (auto-visible, always on screen)

**System Response:**
- Shows visual timeline with all elements
- Color-coded by type:
  - Green: Speaking phases
  - Orange: Transitions
  - Gray: Cooldown
  - Blue: Custom
- Shows segment labels + durations
- Shows total session duration

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  Timeline Preview                         │
│  ─────────────────────────────────────    │
│  ┌────────────────────────────────────┐   │
│  │ ████████████ 5:00                  │   │
│  │ Speaking Phase                      │   │
│  │ ███ 1:00                            │   │
│  │ Transition                          │   │
│  │ ████████████ 5:00                  │   │
│  │ Speaking Phase                      │   │
│  │ ██████ 2:00                         │   │
│  │ Cooldown                            │   │
│  └────────────────────────────────────┘   │
│  Total Duration: 13:00                    │
│  4 elements                               │
└───────────────────────────────────────────┘
```

#### Step 7: (Optional) Save as Template

**User Action:** Clicks "Save as Template" checkbox or button

**System Response:**
- Shows template metadata form:
  - Template Name (required, max 50 chars)
  - Description (optional, max 200 chars)
- Marks session as template: `session.isTemplate = true`

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  ☑ Save as Template                       │
│  ─────────────────────────────────────    │
│  Template Name:                           │
│  [Workshop Check-In (3 rounds)]           │
│                                           │
│  Description (optional):                  │
│  [Quick check-in for teams, 3 rounds...]  │
│                                           │
│  This template will appear in "My         │
│  Templates" for quick reuse.              │
└───────────────────────────────────────────┘
```

#### Step 8: Start Session or Save & Exit

**User Action:** Chooses one of:
1. Click "Start Session" → Go to Flow 2 (Run Session)
2. Click "Save & Exit" → Return to sessions list
3. Click "Preview" → Go to Flow 5 (Preview Session)

**System Response:**
- Saves session to localStorage: `sc.v1.custom-sessions`
- If template: Also saves to `sc.v1.session-templates`
- Shows confirmation toast: "Session saved!"
- Navigates to chosen destination

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  [← Back]  [Preview]  [Save & Exit]       │
│                                           │
│  [Start Session →]  (primary button)      │
└───────────────────────────────────────────┘
```

### Decision Points

| Decision | Options | Criteria |
|----------|---------|----------|
| **Save as Template?** | Yes / No | User wants to reuse this session later |
| **Add More Elements?** | Yes / Done | User needs more phases or ready to finish |
| **Start Now or Later?** | Start / Save | User ready to run session or configure later |
| **Use Preset or From Scratch?** | Preset / Custom | User has a common use case or unique needs |

### Error Scenarios

| Error | Cause | Resolution |
|-------|-------|------------|
| **Empty Session** | User clicks "Start" with 0 elements | Show error: "Add at least 1 element to start session" |
| **Invalid Duration** | Duration <30s or >30min | Show inline error, prevent adding element |
| **Empty Focus Text** | User submits blank focus text | Show error: "Focus text is required" |
| **localStorage Full** | Browser quota exceeded | Show error: "Storage full. Delete old sessions to continue." |
| **Duplicate Template Name** | User saves template with existing name | Show warning: "Template name exists. Overwrite or rename?" |

### Success Criteria (from SC-1)

✅ **User completes session creation in <3 minutes** (median time-to-create)
✅ **User successfully adds ≥1 element** (session is startable)
✅ **User understands timeline preview** (no confusion, no errors)
✅ **User can save as template** (optional, but feature is discoverable)

---

## Flow 2: Start & Run Session (Live Timer)

### Goal
User runs a custom session from start to finish, seeing focus text for each phase, with controls to pause/resume/skip/reset.

### Entry Points
1. Session Builder → "Start Session" button
2. Sessions List → Click session → "Start" button
3. Completed session → "Restart" button

### Flow Diagram

```
[Entry Point]
    ↓
[Confirm Start] (if multi-element session)
    ↓
[Focus View - Element 1]
  • Large Focus Text
  • Timer Countdown (MM:SS)
  • Phase Title
    ↓ Auto-advance when timer reaches 0:00
[Transition] (audio chime)
    ↓
[Focus View - Element 2]
    ↓ User can:
    • [Pause/Resume] - Toggle timer
    • [Next] - Skip to next element
    • [Reset] - Restart from Element 1
    • [Fullscreen] - Toggle fullscreen
    ↓ (repeat for all elements)
[Focus View - Final Element]
    ↓ Timer reaches 0:00
[Completion Screen]
  • "Session Complete!" message
  • Session stats (duration, elements completed)
  • [New Session] [Restart] [Home]
```

### Detailed Steps

#### Step 1: Confirm Start (Optional)

**User Action:** Clicks "Start Session"

**System Response:**
- If session duration >30 minutes: Show confirmation dialog
  - "This session will take 45 minutes. Start now?"
  - [Cancel] [Start]
- If session duration ≤30 minutes: Start immediately (skip to Step 2)

**Rationale:** Prevent accidental long session starts (classroom interruptions)

#### Step 2: Initialize Session State

**System Action (Auto):**
- Sets session state:
  ```typescript
  {
    sessionId: 'abc123',
    currentElementIndex: 0,
    remainingMs: elements[0].durationMs,
    running: true,
    startedAt: Date.now(),
    phase: 'RUNNING'
  }
  ```
- Saves state to localStorage
- Navigates to Focus View (`#/custom-sessions/run/{sessionId}`)
- Starts timer engine (RAF loop)

#### Step 3: Display Focus View - Element 1

**System Action (Auto):**
- Renders Focus View with:
  - **Phase Title** (top): "Element 1 of 4" or custom element name
  - **Focus Text** (center, large): User's custom text from element
  - **Timer** (large, below text): Countdown in MM:SS format
  - **Controls** (bottom): [Pause] [Next] [Reset] [Fullscreen]

**UI Elements (Desktop/Projector):**
```
┌───────────────────────────────────────────┐
│         Element 1 of 4 - Speaking         │
│                                           │
│                                           │
│   ╔══════════════════════════════════╗    │
│   ║                                  ║    │
│   ║    Share your thoughts on the    ║    │
│   ║    project goals and challenges  ║    │
│   ║                                  ║    │
│   ╚══════════════════════════════════╝    │
│                                           │
│              05:00                        │
│          (large timer display)            │
│                                           │
│  [⏸ Pause] [⏭ Next] [🔄 Reset] [⛶ Full]  │
└───────────────────────────────────────────┘
```

**Typography (from platform-and-screen-targets.md):**
- Focus Text: 4rem (64px) on projector, 2rem (32px) on mobile
- Timer: 8rem (128px) on projector, 3rem (48px) on mobile
- Phase Title: 2.5rem (40px) on projector, 1.25rem (20px) on mobile

#### Step 4: Timer Countdown

**System Action (Auto, RAF loop at 60 FPS):**
- Every frame:
  1. Calculate elapsed time: `elapsed = Date.now() - startedAt`
  2. Calculate remaining time: `remaining = remainingMs - elapsed`
  3. Update timer display: `fmt(remaining)` (MM:SS)
  4. If `remaining <= 0`: Advance to next element (Step 5)
- Persist state to localStorage (debounced 150ms)

**Visual Feedback:**
- Timer color changes in last 10 seconds: Red (#DC143C) for urgency
- Optional: Progress bar at top showing element progress

#### Step 5: Auto-Advance to Next Element

**System Action (Auto, when timer reaches 0:00):**
1. Play audio chime (high tone for phase start, low tone for transition)
2. Increment element index: `currentElementIndex++`
3. Check if more elements exist:
   - **Yes**: Load next element (repeat Step 3)
   - **No**: Go to Completion Screen (Step 9)
4. Reset timer: `remainingMs = elements[currentElementIndex].durationMs`
5. Update UI: Show new focus text, reset timer display

**Transition Animation (Optional):**
- Fade out current text (300ms)
- Fade in new text (300ms)
- Total transition: 600ms

#### Step 6: User Controls - Pause

**User Action:** Clicks "Pause" button or presses Space key

**System Response:**
- Pauses timer: `running = false`
- Saves current `remainingMs` (adjusted for elapsed time)
- Stops RAF loop
- Changes button label: "Pause" → "Resume" (▶)
- Dims timer display (visual feedback)

**UI Change:**
```
[▶ Resume] [⏭ Next] [🔄 Reset] [⛶ Full]
  (green)
```

#### Step 7: User Controls - Resume

**User Action:** Clicks "Resume" button or presses Space key again

**System Response:**
- Resumes timer: `running = true`
- Sets new `startedAt = Date.now()`
- Restarts RAF loop
- Changes button label: "Resume" → "Pause" (⏸)
- Restores normal timer display

#### Step 8: User Controls - Next (Skip)

**User Action:** Clicks "Next" button

**System Response:**
- Confirms action (optional): "Skip to next element?"
  - If <10 seconds remaining: Auto-skip (no confirmation)
  - If ≥10 seconds remaining: Show confirmation dialog
- Increments element index (same as Step 5)
- Plays audio chime
- Loads next element

**Use Case:** User realizes current phase is done early, wants to move on

#### Step 9: Completion Screen

**System Action (Auto, when last element finishes):**
- Sets state: `phase = 'COMPLETED'`
- Stops timer: `running = false`
- Plays completion chime (low tone, longer duration)
- Navigates to completion view
- Increments session completion counter (analytics)

**UI Elements:**
```
┌───────────────────────────────────────────┐
│                                           │
│              ✅ Session Complete!          │
│                                           │
│  You completed a 13-minute session        │
│  with 4 elements.                         │
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │  Total Time: 13:05 (actual)        │  │
│  │  Elements: 4/4 completed            │  │
│  │  Completed Sessions: 12             │  │
│  └─────────────────────────────────────┘  │
│                                           │
│  [🔄 Restart Session]                     │
│  [📝 New Session]                         │
│  [🏠 Home]                                │
│                                           │
│  Rate this session (optional):            │
│  ⭐⭐⭐⭐⭐                                  │
└───────────────────────────────────────────┘
```

**Optional Survey (SC-2 Readability Feedback):**
- Show 1-5 star rating: "How readable was the focus text?"
- Only if user consented to analytics

### User Controls Reference

| Control | Desktop | Mobile | Keyboard | Action |
|---------|---------|--------|----------|--------|
| **Pause/Resume** | Button | Button | Space | Toggle timer |
| **Next Element** | Button | Button | N | Skip to next phase (with confirmation) |
| **Reset Session** | Button | Button | R | Restart from Element 1 (with confirmation) |
| **Fullscreen** | Button | Button | F | Toggle fullscreen mode |
| **Exit** | Button | Button | Esc | Pause timer, show "Exit session?" dialog |

### Decision Points

| Decision | Options | Criteria |
|----------|---------|----------|
| **Pause or Continue?** | Pause / Continue | User needs break or wants to proceed |
| **Skip Element?** | Skip / Wait | Element finished early or unexpected interruption |
| **Reset or Continue?** | Reset / Continue | User made mistake or wants to restart |
| **Restart or New?** | Restart / New | User wants same session again or new configuration |

### Error Scenarios

| Error | Cause | Resolution |
|-------|-------|------------|
| **Timer Drift >2s** | Browser sleep, background tab | Adjust `remainingMs` based on `Date.now()` |
| **State Loss on Reload** | Browser crash, manual reload | Restore state from localStorage, set `running = false` |
| **Audio Chime Fails** | No Web Audio API support | Silently fail, visual feedback only |
| **Fullscreen Blocked** | Browser permissions | Show tooltip: "Fullscreen not available" |

### Success Criteria (from SC-2, SC-3)

✅ **Focus text easily readable** (≥90% users rate ≥4/5)
✅ **Session completes without errors** (≥95% success rate)
✅ **Timer drift <1s per 30 min** (NFR-2)
✅ **UI latency <200ms** (NFR-3)

---

## Flow 3: Edit Existing Session

### Goal
User modifies a saved session (add/edit/delete elements, reorder, change metadata).

### Entry Points
1. Sessions List → Click session → "Edit" button
2. Running session → Pause → "Edit Session" button (edge case)

### Flow Diagram

```
[Sessions List]
    ↓ Click "Edit" on session
[Session Builder - Loaded State]
  • Existing elements displayed
  • Timeline preview shows current state
    ↓
[Modify Elements]
  • Edit element (inline or modal)
  • Delete element (with confirmation)
  • Reorder elements (drag or buttons)
  • Add new elements
    ↓
[Save Changes]
  • Auto-save (150ms debounce)
  • Or explicit "Save" button
    ↓
[Sessions List] (return)
```

### Detailed Steps

#### Step 1: Load Session for Editing

**User Action:** Clicks "Edit" button on session card

**System Response:**
- Loads session from localStorage: `sessions[sessionId]`
- Navigates to Session Builder: `#/custom-sessions/edit/{sessionId}`
- Renders existing elements in editable list
- Shows timeline preview
- Enables edit controls (Edit, Delete, Reorder buttons)

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  ← Back   Workshop Check-In (3 rounds)    │
│  ───────────────────────────────────────  │
│                                           │
│  Session Elements (4)                     │
│  ─────────────────────────────────────    │
│  1. Speaking Phase                        │
│     Duration: 5:00                        │
│     Text: "Share your thoughts..."        │
│     [✏ Edit] [🗑 Delete] [↑] [↓]          │
│                                           │
│  2. Transition                            │
│     Duration: 1:00                        │
│     Text: "Pause and reflect"             │
│     [✏ Edit] [🗑 Delete] [↑] [↓]          │
│  ...                                      │
│                                           │
│  [+ Add Element]                          │
│                                           │
│  [Save Changes]  [Discard]  [Start]       │
└───────────────────────────────────────────┘
```

#### Step 2: Edit Element (Inline or Modal)

**User Action:** Clicks "Edit" button on element

**System Response:**
- Opens edit form (inline or modal, depending on screen size)
- Pre-fills form with existing values
- Shows validation errors if any
- Enables "Save" button

**UI Elements (Modal):**
```
┌───────────────────────────────────────────┐
│  Edit Element 1                           │
│  ───────────────────────────────────────  │
│                                           │
│  Element Type: ● Speaking Phase           │
│                                           │
│  Duration: [5] minutes [0] seconds        │
│                                           │
│  Focus Text:                              │
│  ┌──────────────────────────────────────┐│
│  │ Share your thoughts on the project   ││
│  │ goals and challenges                 ││
│  └──────────────────────────────────────┘│
│                                           │
│  [Cancel]  [Save Changes]                 │
└───────────────────────────────────────────┘
```

**Validation:** Same rules as Flow 1, Step 4

#### Step 3: Delete Element

**User Action:** Clicks "Delete" button on element

**System Response:**
- Shows confirmation dialog (prevent accidental deletion):
  - "Delete this element? This cannot be undone."
  - [Cancel] [Delete]
- If confirmed:
  - Removes element from array: `elements.splice(index, 1)`
  - Updates timeline preview
  - Shows undo toast (optional, 5 seconds): "Element deleted. [Undo]"
- Auto-saves after 150ms debounce

**UI Change:**
- Element fades out (300ms animation)
- Subsequent elements shift up

#### Step 4: Reorder Elements

**User Action (Desktop):** Drags element to new position (drag handle)

**User Action (Mobile/Tablet):** Clicks ↑ or ↓ buttons

**System Response:**
- Reorders array: `elements.splice(newIndex, 0, elements.splice(oldIndex, 1)[0])`
- Updates element numbers (1 → 2, 2 → 3, etc.)
- Updates timeline preview
- Auto-saves after 150ms debounce

**Visual Feedback:**
- Dragged element: Lifted shadow, semi-transparent
- Drop target: Blue highlight bar

#### Step 5: Add New Element

**Same as Flow 1, Step 3-4** (Add Element form)

#### Step 6: Save Changes

**User Action:** Clicks "Save Changes" button (or auto-save after 150ms idle)

**System Response:**
- Validates all elements (duration, focus text)
- Saves to localStorage: `sessions[sessionId] = updatedSession`
- Shows success toast: "Session saved!"
- Enables "Start Session" button

**If Validation Fails:**
- Highlights invalid elements with red border
- Shows error summary: "2 elements have errors. Fix them to save."
- Disables "Save" button until errors resolved

### Decision Points

| Decision | Options | Criteria |
|----------|---------|----------|
| **Inline or Modal Edit?** | Inline / Modal | Screen size (inline on desktop, modal on mobile) |
| **Confirm Delete?** | Yes / Skip | Element count (always confirm if ≥2 elements) |
| **Auto-Save or Manual?** | Auto / Manual | User preference (default: auto-save with 150ms debounce) |

### Error Scenarios

| Error | Cause | Resolution |
|-------|-------|------------|
| **Session Not Found** | Deleted or corrupted | Show error: "Session not found. Return to list?" |
| **Invalid Element After Edit** | User broke validation | Highlight error, prevent save |
| **Conflicting Edits (Multi-Tab)** | User edited in 2 tabs | Show warning: "Session was modified in another tab. Reload?" |

### Success Criteria

✅ **User can edit session in <2 minutes** (median edit time)
✅ **User can reorder elements intuitively** (drag or buttons work)
✅ **User can delete elements without errors** (confirmation prevents accidents)

---

## Flow 4: Delete Session

### Goal
User permanently removes a saved session from their list.

### Entry Points
1. Sessions List → Click session → "Delete" button
2. Session Builder → "Delete Session" option in menu

### Flow Diagram

```
[Sessions List]
    ↓ Click "Delete" on session
[Confirmation Dialog]
  • "Delete this session?"
  • Show session name + element count
  • [Cancel] [Delete]
    ↓ User confirms
[Delete from Storage]
  • Remove from localStorage
  • Show undo toast (5 seconds)
    ↓
[Sessions List Updated]
  • Session removed from list
  • Show empty state if no sessions left
```

### Detailed Steps

#### Step 1: Initiate Delete

**User Action:** Clicks "Delete" button (trash icon) on session card

**System Response:**
- Shows confirmation dialog (prevent accidental deletion)
- Highlights session to be deleted (visual feedback)

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  Delete Session?                          │
│  ───────────────────────────────────────  │
│                                           │
│  "Workshop Check-In (3 rounds)"           │
│  4 elements, 13 minutes total             │
│                                           │
│  This action cannot be undone.            │
│                                           │
│  [Cancel]  [Delete Session]               │
│                (red, danger)              │
└───────────────────────────────────────────┘
```

#### Step 2: Confirm Delete

**User Action:** Clicks "Delete Session" button

**System Response:**
- Removes session from localStorage:
  ```typescript
  const sessions = loadSessions();
  delete sessions[sessionId];
  saveSessions(sessions);
  ```
- Closes dialog
- Shows undo toast (5 seconds): "Session deleted. [Undo]"
- Removes session card from list (fade-out animation)

**Undo Mechanism (Optional):**
- If user clicks "Undo" within 5 seconds: Restore session
- Store deleted session in temporary variable: `recentlyDeleted`
- After 5 seconds: Clear `recentlyDeleted`

#### Step 3: Update Sessions List

**System Action (Auto):**
- Refreshes sessions list
- If no sessions left: Show empty state
  - "No sessions yet. Create your first session!"
  - [+ New Session] button

### Error Scenarios

| Error | Cause | Resolution |
|-------|-------|------------|
| **Session In Use** | User tries to delete while session is running | Show error: "Cannot delete active session. Stop it first." |
| **localStorage Error** | Write failed (quota, permissions) | Show error: "Failed to delete. Try again or clear browser data." |

### Success Criteria

✅ **User can delete session in <5 seconds** (including confirmation)
✅ **User can undo deletion within 5 seconds** (safety net)
✅ **User sees confirmation before permanent deletion** (prevent accidents)

---

## Flow 5: Preview/Test Session

### Goal
User validates session configuration (layout, timing, focus text) without running full timer.

### Entry Points
1. Session Builder → "Preview" button
2. Edit Session → "Preview" button

### Flow Diagram

```
[Session Builder]
    ↓ Click "Preview"
[Preview Mode]
  • Fast-forward through elements (3s each)
  • Or manual click-through (user clicks "Next")
    ↓
[Element 1 Preview]
  • Shows focus text + timer (frozen or fast)
  • Shows layout
    ↓ Auto-advance (3s) or manual "Next"
[Element 2 Preview]
    ↓ (repeat for all elements)
[Preview Complete]
  • "Preview complete. Start session or edit?"
  • [Start Session] [Edit] [Close]
```

### Detailed Steps

#### Step 1: Enter Preview Mode

**User Action:** Clicks "Preview" button in Session Builder

**System Response:**
- Validates session (≥1 element)
- If valid: Navigates to Preview View (`#/custom-sessions/preview/{sessionId}`)
- If invalid: Shows error: "Add at least 1 element to preview"
- Shows preview mode indicator (banner at top)

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  ⚡ Preview Mode (not running actual timer)│
│  ───────────────────────────────────────  │
│         Element 1 of 4 - Speaking         │
│                                           │
│   ╔══════════════════════════════════╗    │
│   ║  Share your thoughts on the      ║    │
│   ║  project goals and challenges    ║    │
│   ╚══════════════════════════════════╝    │
│                                           │
│              05:00                        │
│          (static, not counting down)      │
│                                           │
│  [⏭ Next Element] (3/3 seconds)           │
│  [❌ Exit Preview]                        │
└───────────────────────────────────────────┘
```

#### Step 2: Auto-Advance or Manual Navigation

**Option A: Auto-Advance (Recommended)**
- System shows each element for 3 seconds
- Auto-advances to next element
- User can skip ahead by clicking "Next"

**Option B: Manual Click-Through**
- System waits for user to click "Next"
- User controls pace of preview

**Recommendation:** Auto-advance with manual skip option (best of both worlds)

#### Step 3: Preview Each Element

**System Action (Auto):**
- Renders element with same layout as live session
- Shows static timer (not counting down)
- Shows focus text in correct typography
- Shows phase title

**User Can Check:**
- ✅ Focus text fits on screen (no overflow)
- ✅ Typography is readable
- ✅ Timer display is clear
- ✅ Element order makes sense

#### Step 4: Preview Complete

**System Action (Auto, after last element):**
- Shows completion screen
- Offers actions: Start Session, Edit, Close

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  ✅ Preview Complete                       │
│  ───────────────────────────────────────  │
│                                           │
│  You previewed a 13-minute session        │
│  with 4 elements.                         │
│                                           │
│  Ready to start the actual session?       │
│                                           │
│  [▶ Start Session]  (primary)             │
│  [✏ Edit Session]                         │
│  [❌ Close Preview]                        │
└───────────────────────────────────────────┘
```

### Decision Points

| Decision | Options | Criteria |
|----------|---------|----------|
| **Auto or Manual Preview?** | Auto (3s) / Manual | User preference (default: auto) |
| **Start or Edit?** | Start / Edit | Preview revealed issues or looks good |

### Success Criteria (from SC-1)

✅ **User can preview session in <30 seconds** (fast validation)
✅ **User can identify layout issues before running** (prevents mid-session surprises)
✅ **User understands preview vs. live mode** (clear labeling)

---

## Flow 6: Upgrade from Couples Timer

### Goal
Existing Couples Timer users discover and migrate to Custom Sessions for more flexibility.

### Entry Points
1. Couples Timer completion screen → "Try Custom Sessions" prompt
2. Couples Timer setup → "Want more flexibility? Try Custom Sessions" link
3. Home page → "Custom Sessions" banner (if user has used Couples Timer ≥2 times)

### Flow Diagram

```
[Couples Timer Completed]
    ↓
[Upgrade Prompt]
  • "Want to customize your dialogue sessions?"
  • "Try Custom Sessions for flexible timers."
  • [Learn More] [Try It Now]
    ↓ User clicks "Try It Now"
[Migration Assistant]
  • Convert current Couples Timer preset to Custom Session
  • Show side-by-side comparison
  • "This is your current session as a custom session"
    ↓
[Custom Session Builder (Pre-filled)]
  • All elements from Couples Timer preset
  • User can now edit/add/remove
    ↓
[Save & Start] or [Return to Couples Timer]
```

### Detailed Steps

#### Step 1: Show Upgrade Prompt

**Trigger:** User completes a Couples Timer session

**System Response:**
- Shows upgrade prompt (modal or banner)
- Highlights Custom Sessions benefits:
  - ✅ Customize durations for each phase
  - ✅ Add custom focus text per phase
  - ✅ Create unlimited session templates
  - ✅ Reorder or skip phases

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  ✨ Upgrade to Custom Sessions             │
│  ───────────────────────────────────────  │
│                                           │
│  Want more control over your dialogue     │
│  sessions? Custom Sessions lets you:      │
│                                           │
│  ✅ Set custom durations per phase         │
│  ✅ Write your own focus prompts           │
│  ✅ Create unlimited templates             │
│  ✅ Reorder phases on the fly              │
│                                           │
│  [Maybe Later]  [Try Custom Sessions →]   │
└───────────────────────────────────────────┘
```

#### Step 2: Migration Assistant

**User Action:** Clicks "Try Custom Sessions"

**System Response:**
- Creates new Custom Session from current Couples Timer preset
- Converts preset structure:
  ```typescript
  // Couples Timer preset
  {
    prepDurationMs: 5 * 60 * 1000,
    slotDurationMs: 10 * 60 * 1000,
    slotsPerPerson: 2,
    transitionDurationMs: 60 * 1000,
    closingDurationMs: 1 * 60 * 1000,
    cooldownDurationMs: 20 * 60 * 1000
  }

  // → Custom Session elements
  [
    { type: 'PREP', durationMs: 300000, focusText: 'Preparation: Find a quiet space...' },
    { type: 'SPEAK', durationMs: 600000, focusText: 'Person A speaks' },
    { type: 'TRANSITION', durationMs: 60000, focusText: 'Transition: Pause and reflect' },
    { type: 'SPEAK', durationMs: 600000, focusText: 'Person B speaks' },
    // ... (repeat for all slots)
    { type: 'CLOSING', durationMs: 60000, focusText: 'Person A closing' },
    { type: 'CLOSING', durationMs: 60000, focusText: 'Person B closing' },
    { type: 'COOLDOWN', durationMs: 1200000, focusText: 'Cooldown: No follow-up conversation' }
  ]
  ```
- Navigates to Custom Session Builder with pre-filled elements
- Shows guidance banner: "This is your Couples Timer preset as a Custom Session. Edit as needed!"

#### Step 3: User Edits or Accepts

**User Action:** Either:
1. **Accept as-is:** Click "Save & Start"
2. **Customize:** Edit durations, focus text, add/remove elements

**System Response:**
- If accepted: Go to Flow 2 (Start Session)
- If customized: Follow Flow 3 (Edit Session)

#### Step 4: Save Migration

**System Response:**
- Saves new Custom Session to localStorage
- Optionally prompts: "Save this as a template for future use?"
- Does NOT delete Couples Timer profile (users can still use both)

**UI Elements:**
```
┌───────────────────────────────────────────┐
│  ✅ Custom Session Created!                │
│  ───────────────────────────────────────  │
│                                           │
│  Your Couples Timer preset is now a       │
│  Custom Session. You can edit it anytime. │
│                                           │
│  💡 Tip: You can still use the Couples    │
│  Timer for quick presets, or Custom       │
│  Sessions for full control.               │
│                                           │
│  [Got It]                                 │
└───────────────────────────────────────────┘
```

### Decision Points

| Decision | Options | Criteria |
|----------|---------|----------|
| **Upgrade Now or Later?** | Now / Later | User wants flexibility or happy with presets |
| **Customize or Use As-Is?** | Customize / Accept | User has specific needs or migrated preset is fine |
| **Keep Both or Replace?** | Both / Replace | User wants both options or only Custom Sessions |

### Success Criteria (from SC-4)

✅ **≥30% of Couples Timer users try Custom Sessions** (within 4 weeks of prompt)
✅ **≥50% of users who try it adopt it** (create ≥2 custom sessions)
✅ **User understands migration** (no confusion, no data loss)

---

## Flow Summary Table

| Flow | Entry Point | Primary Goal | Success Metric |
|------|-------------|--------------|----------------|
| **1. Create New Session** | Home page, nav | Build custom session from scratch | <3 min creation time (SC-1) |
| **2. Start & Run Session** | Builder, sessions list | Execute session, see focus text | ≥95% success rate (SC-3) |
| **3. Edit Existing Session** | Sessions list | Modify saved session | <2 min edit time |
| **4. Delete Session** | Sessions list | Remove unwanted session | <5 sec deletion time |
| **5. Preview/Test Session** | Builder | Validate before running | <30 sec preview time |
| **6. Upgrade from Couples Timer** | Couples Timer | Migrate to Custom Sessions | ≥30% adoption (SC-4) |

---

## Cross-Flow Interactions

### Navigation Between Flows

```
[Home Page]
    ↓
[Custom Sessions Landing]
    ↓
[Sessions List] ←──────────────────┐
    ↓ Create                       │
[Flow 1: Create New] ──(Save)──────┤
    ↓ Start                        │
[Flow 2: Run Session] ─────────────┤
    ↓ Edit (mid-session)           │
[Flow 3: Edit Session] ─(Save)─────┤
    ↓ Preview                      │
[Flow 5: Preview] ──(Edit/Start)───┤
    ↓ Delete                       │
[Flow 4: Delete] ───────────────────┘
```

### State Preservation

| Scenario | State Behavior | Implementation |
|----------|----------------|----------------|
| **Page Reload** | Preserve session state (if running) | localStorage + state restoration on load |
| **Tab Close** | Preserve sessions list | localStorage persistence |
| **Browser Crash** | Preserve all sessions, pause running session | State saved every 150ms (debounced) |
| **Cross-Tab Editing** | Sync changes (with conflict warning) | `useStorageSync` hook + StorageEvent |

---

## Error Handling Summary

### Global Error Patterns

| Error Type | Detection | User Feedback | Recovery |
|------------|-----------|---------------|----------|
| **Validation Error** | Client-side (inline) | Inline error message + red border | User fixes input, error clears |
| **Storage Error** | Try/catch around localStorage | Toast: "Failed to save. Try again." | Retry on next state change |
| **Network Error** | N/A (offline-first) | N/A | N/A (no network required) |
| **Timer Drift** | Compare `Date.now()` vs. expected | Log warning (analytics) | Auto-adjust `remainingMs` |
| **State Corruption** | Validate on load | Show error + reset button | User can reset to empty state |

---

## Accessibility Considerations

### Keyboard Navigation

| Flow | Key Shortcuts | Notes |
|------|---------------|-------|
| **Create Session** | Tab (navigate), Enter (submit), Esc (cancel) | Standard form navigation |
| **Run Session** | Space (pause/resume), R (reset), F (fullscreen), N (next) | Consistent with other timers |
| **Edit Session** | Tab (navigate), Enter (save), Del (delete element) | Standard editing shortcuts |

### Screen Reader Support

- Semantic HTML: Use `<button>`, `<input>`, `<label>`, `<nav>`, etc.
- ARIA labels: Icon-only buttons get `aria-label`
- Live regions: Timer countdown announced every minute (not every second, to avoid spam)
- Focus management: After adding element, focus returns to "Add Element" button

---

## Next Steps (Task T1.2)

1. ✅ **Completed:** User journeys & flows (6 flows documented)
2. ⏭️ **Next:** Create user stories with acceptance criteria (T1.2)
3. ⏭️ **After:** Design Session Builder UX concept (T1.3)

---

**End of Document**
