# Couples Timer - Current State Analysis

**Date:** 2025-12-04
**Task:** T0.1 - Bestehende Couple-Timer-Implementierung analysieren
**Status:** ✅ Complete

## Executive Summary

The Couples Timer is a fully implemented feature at `#/couples` route, providing structured dialogue sessions based on Moeller's Zwiegespräch methodology. It uses a phase-based state machine with preset configurations but lacks flexibility for custom session building.

---

## Architecture Overview

### Component Structure

```
src/pages/CouplesTimer.tsx (803 lines)
├── State Management: Local useState + localStorage
├── Timer Engine: Custom RAF loop
├── Audio: Web Audio API (bell tones)
└── UI: Three views (Setup, Session, Completed)
```

### Key Files

| File | Purpose | Lines | Notes |
|------|---------|-------|-------|
| `src/pages/CouplesTimer.tsx` | Main component | 803 | Full implementation |
| `src/types/timer-types.ts` | Type definitions | 226 | Lines 169-225 for Couples |
| `src/config/couples-presets.ts` | Preset configurations | 94 | 3 presets + guidance text |
| `src/styles/couples-timer.css` | Styling | N/A | Not analyzed yet |

---

## Data Model

### CouplesTimerState Interface

```typescript
interface CouplesTimerState {
  version: 1;
  currentProfile: CoupleProfile | null;
  currentPreset: SessionPreset | null;
  phase: SessionPhase;
  currentSlotIndex: number;
  transitionDurationMs: number;
  remainingMs: number;
  running: boolean;
  startedAt: number | null;
  completedSessions: number;
  schedule: SessionSchedule | null;
}
```

**Storage Key:** `sc.v1.couples` (state), `sc.v1.couples.profiles` (profiles)

### SessionPhase Type (8 Phases)

```typescript
type SessionPhase =
  | 'SETUP'       // Initial setup
  | 'PREP'        // Preparation (3-5 min)
  | 'A_SPEAKS'    // Person A speaking slot
  | 'TRANSITION'  // Silent transition (5s-5min, configurable)
  | 'B_SPEAKS'    // Person B speaking slot
  | 'A_CLOSING'   // Person A closing (1-2 min)
  | 'B_CLOSING'   // Person B closing (1-2 min)
  | 'COOLDOWN'    // No follow-up conversation
  | 'COMPLETED';  // Session finished
```

### SessionPreset Interface

```typescript
interface SessionPreset {
  id: PresetId;                    // 'klassisch-90' | 'einsteiger-60' | 'eltern-kind-60'
  name: string;                    // Display name
  description: string;             // User-facing description
  totalDurationMs: number;         // Total session duration
  prepDurationMs: number;          // Preparation phase duration
  slotDurationMs: number;          // Duration per speaking slot
  slotsPerPerson: number;          // Number of slots per person
  transitionDurationMs: number;    // Default transition duration
  closingDurationMs: number;       // Closing phase duration per person
  cooldownDurationMs: number;      // Cooldown phase duration
}
```

### CoupleProfile Interface

```typescript
interface CoupleProfile {
  id: string;
  nameA: string;                   // Person A name (max 30 chars)
  nameB: string;                   // Person B name (max 30 chars)
  relationshipType: 'couple' | 'parent-child' | 'friends' | 'other';
  preferredPresetId: PresetId;     // Default preset
  createdAt: number;
  lastSessionAt: number | null;
}
```

---

## State Machine

### Phase Transitions

```
SETUP → PREP → A_SPEAKS → TRANSITION → B_SPEAKS → TRANSITION → ...
  → A_CLOSING → B_CLOSING → COOLDOWN → COMPLETED
```

**Key Logic:**
- Alternates A_SPEAKS ↔ B_SPEAKS for `slotsPerPerson × 2` iterations
- Each speaking slot followed by TRANSITION phase
- Transition duration configurable per session (5s - 5min)
- After all slots: A_CLOSING → B_CLOSING → COOLDOWN → COMPLETED

### State Transitions Implementation

Located in `advancePhase()` callback (lines 235-322):

| Current Phase | Next Phase | Duration | Notes |
|---------------|------------|----------|-------|
| SETUP | PREP | `preset.prepDurationMs` | Manual start |
| PREP | A_SPEAKS | `preset.slotDurationMs` | Auto-advance |
| A_SPEAKS | TRANSITION | `transitionDurationMs` | Bell tone (low) |
| TRANSITION | A_SPEAKS or B_SPEAKS | `preset.slotDurationMs` | Alternates based on slot index |
| B_SPEAKS | TRANSITION | `transitionDurationMs` | Bell tone (low) |
| (Final slot) | A_CLOSING | `preset.closingDurationMs` | After all slots |
| A_CLOSING | B_CLOSING | `preset.closingDurationMs` | Auto-advance |
| B_CLOSING | COOLDOWN | `preset.cooldownDurationMs` | Auto-advance |
| COOLDOWN | COMPLETED | 0 | `completedSessions++` |
| COMPLETED | COMPLETED | 0 | Terminal state |

---

## Timer Engine

### Implementation Details

**Technology:** `requestAnimationFrame` (RAF) loop
**Location:** `useRaf` custom hook (lines 183-199) + `sync` callback (lines 325-352)

**Characteristics:**
- Runs only when `state.running === true`
- Updates remaining time based on elapsed time since `startedAt`
- Auto-advances phase when `remainingMs <= 0`
- Persists state to localStorage with 150ms debounce (lines 214-217, 220-223)

**Timer Precision:**
- Uses `Date.now()` for elapsed time calculation (drift-resistant)
- No explicit drift correction mechanism
- Phase completion triggers `advancePhase()` in next tick via `setTimeout(() => advancePhase(), 0)`

### State Persistence Strategy

```typescript
// On state change (150ms debounce)
useEffect(() => {
  const t = setTimeout(() => saveState(state), 150);
  return () => clearTimeout(t);
}, [state]);

// On page load
function loadState(): CouplesTimerState {
  // Adjusts remainingMs based on elapsed time if previously running
  // Always starts paused after reload (safety feature)
}
```

**Key Behavior:**
- State saved to `localStorage` on every state change (debounced)
- On reload: calculates elapsed time, adjusts `remainingMs`, sets `running = false`
- Cross-tab sync: **NOT implemented** (doesn't use `useStorageSync` hook)

---

## Preset System

### Available Presets

Defined in `src/config/couples-presets.ts`:

#### 1. Klassisch 90 Minuten
- **Duration:** 90 minutes
- **Slots:** 3 per person (6 total)
- **Slot Duration:** 15 minutes
- **Use Case:** Standard Zwiegespräch

#### 2. Einsteiger 60 Minuten
- **Duration:** 60 minutes
- **Slots:** 2 per person (4 total)
- **Slot Duration:** 10 minutes
- **Use Case:** Beginners

#### 3. Eltern-Kind 60 Minuten
- **Duration:** 60 minutes
- **Slots:** 2 per person (4 total)
- **Slot Duration:** 10 minutes
- **Use Case:** Parent-child conversations

### Transition Duration

- **Configurable:** 5 seconds - 5 minutes (5s increments)
- **Default:** 60 seconds
- **UI:** Range slider + number input (lines 645-674)
- **Purpose:** Silent buffer for emotional regulation and note-taking

---

## Audio System

### Bell Tones

**Implementation:** Web Audio API via `playBellTone()` (lines 121-159)

| Tone | Frequency | Duration | Use Case |
|------|-----------|----------|----------|
| High | 660 Hz | 1.6s | Phase start, speaking begins |
| Low | 196 Hz | 1.6s | Transition start, cooldown |

**Envelope:**
- Attack: 0 → 0.22 gain in 0.15s (linear ramp)
- Release: 0.22 → 0.0001 gain over 1.45s (exponential decay)
- Type: Sine wave

**Context Management:**
- Single shared `AudioContext` instance (lazily created)
- Graceful fallback if Web Audio API unavailable

### Phase Chime Logic

Located in `playPhaseChime()` (lines 161-180):

| Transition | Tone | Rationale |
|------------|------|-----------|
| → TRANSITION | Low | Grounding, pause |
| TRANSITION → * | High | Energy, speaking begins |
| → A_SPEAKS, B_SPEAKS | High | Active speaking phase |
| → COOLDOWN, COMPLETED | Low | Closure, grounding |

---

## User Interface

### Three Main Views

#### 1. Setup View (`phase === 'SETUP'`)

**Features:**
- Profile management (create, select)
- Preset selection
- Transition duration configuration
- Timeline preview (visual session structure)
- Start button

**Key Components:**
- Profile cards (selectable)
- New profile form (nameA, nameB inputs)
- Preset cards with duration display
- Transition slider (5s - 5min)
- Timeline bar (color-coded segments)

#### 2. Active Session View (`phase !== 'SETUP' && phase !== 'COMPLETED'`)

**Features:**
- Phase indicator (title + guidance text)
- Large timer display (MM:SS format)
- Progress indicator (slot X of Y)
- Control buttons (Pause, Reset, Fullscreen)

**Guidance System:**
- Dynamic text based on current phase
- Personalized with profile names (`{nameA}`, `{nameB}` placeholders)
- Phase-specific instructions (defined in `PHASE_GUIDANCE`)

**Example:**
```
Phase: A_SPEAKS
Title: "Anna spricht"
Text: "Ben: Höre zu, ohne zu unterbrechen. Anna: Bleib bei dir.
       Sprich über dich, nicht über den anderen."
```

#### 3. Completed View (`phase === 'COMPLETED'`)

**Features:**
- Completion message
- Completed sessions counter
- "New Session" button (resets to SETUP)

---

## Controls & Interactions

### User Actions

| Action | Method | Behavior |
|--------|--------|----------|
| Create Profile | `createProfile()` | Validates names, generates ID, auto-selects |
| Select Profile | `selectProfile()` | Loads profile, loads preferred preset |
| Select Preset | `selectPreset()` | Updates `currentPreset`, preserves custom transition |
| Adjust Transition | `updateTransitionSeconds()` | Clamps 5s-5min, updates `transitionDurationMs` |
| Start Session | `startSession()` | Sets phase=PREP, starts timer, plays bell |
| Pause/Resume | `togglePause()` | Toggles `running`, adjusts `remainingMs` |
| Reset | `resetSession()` | Returns to SETUP phase |
| Fullscreen | `toggleFullscreen()` | Native Fullscreen API on wrapper div |

### Keyboard Shortcuts

**Not implemented** for Couples Timer (other timers use `useKeyboardShortcuts` hook)

---

## Timeline Preview

Located in Setup View (lines 677-707)

**Features:**
- Visual timeline bar showing all session phases
- Color-coded segments:
  - Blue: Preparation
  - Green: Person A speaks
  - Purple: Person B speaks
  - Orange: Transition
  - Pink: Closing
  - Gray: Cooldown
- Segment labels + durations
- Total duration display
- Legend

**Calculation:**
- Dynamically computes segments based on `slotsPerPerson` and `transitionDurationMs`
- Proportional widths based on duration

---

## Key Observations

### ✅ Strengths

1. **Solid State Machine:** Well-defined phase transitions with clear logic
2. **Preset System:** Three ready-to-use configurations
3. **Audio Feedback:** Subtle, non-intrusive bell tones
4. **Timeline Preview:** Excellent UX for understanding session structure
5. **Persistence:** State survives page reloads
6. **Fullscreen Support:** Good for presentation mode

### ⚠️ Limitations (Gaps vs. Implementation Plan)

1. **No Custom Session Builder:**
   - Cannot create sessions with arbitrary phases
   - Limited to 3 fixed presets
   - Cannot add custom focus text per phase

2. **No Session Templates:**
   - Can save profiles but not custom sessions
   - No "Save as Template" functionality
   - No session library/gallery

3. **No Cross-Tab Sync:**
   - Uses raw `localStorage`, not `useStorageSync` hook
   - Changes don't propagate to other tabs

4. **No Preview/Test Mode:**
   - Cannot test sessions without running full timer
   - No "quick preview" to verify layout/text

5. **Limited Focus View Customization:**
   - Guidance text is preset-specific, not customizable per session
   - No typography/font size configuration

6. **No Keyboard Shortcuts:**
   - Other timers use `useKeyboardShortcuts` hook
   - Couples Timer doesn't implement Space/R/F shortcuts

7. **Fixed Phase Structure:**
   - Phases are hard-coded (PREP, SPEAK, TRANSITION, CLOSING, COOLDOWN)
   - Cannot add arbitrary phase types (e.g., "REFLECTION", "JOURNALING")

8. **Transition Duration Only:**
   - Can customize transition duration but not other phase durations
   - Slot/closing/cooldown durations locked to preset values

---

## Data Flow Diagram

```
[User Input] → [Component State] → [localStorage (150ms debounce)]
                      ↓
              [RAF Timer Loop (60 FPS)]
                      ↓
              [Phase Completion] → [advancePhase()]
                      ↓
              [Audio Chime] + [UI Update]
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Timer Precision | Date.now() based | Drift-resistant |
| UI Updates | 60 FPS (RAF) | Only when running |
| Storage Debounce | 150ms | Reduces localStorage writes |
| State Size | ~500 bytes | Per session (approx) |
| Profiles Storage | Separate key | `sc.v1.couples.profiles` |

---

## Edge Cases & Error Handling

### Handled

1. **Page Reload During Session:**
   - Adjusts `remainingMs` based on elapsed time
   - Always pauses timer (safety feature)

2. **Missing Preset:**
   - `getPresetById()` returns `undefined`
   - UI disables start button if `!currentPreset`

3. **Audio Context Failure:**
   - Silently fails if Web Audio API unavailable
   - Timer continues without audio

4. **localStorage Quota:**
   - Try/catch blocks around all localStorage operations
   - Silently fails if quota exceeded

### Not Handled

1. **Browser Sleep/Background Tab:**
   - No explicit handling of long-duration background execution
   - Date.now() calculation should handle this, but not tested

2. **Concurrent Tab Editing:**
   - No cross-tab sync
   - Last write wins

3. **Invalid Profile Names:**
   - maxLength=30 enforced in UI
   - No backend validation (client-side only)

---

## Dependencies

### Internal

- **Timer Hooks:** Custom `useRaf` (inline implementation)
- **Storage:** Direct `localStorage` access (no `useStorageSync`)
- **Routing:** Hash-based routing from `main.tsx` (`#/couples`)

### External

- React 18+ (useState, useEffect, useCallback, useMemo, useRef)
- Web Audio API (optional, graceful fallback)
- Fullscreen API (optional, feature detection)

### NOT Using

- `useStorageSync` hook (available but not used)
- `useKeyboardShortcuts` hook (available but not used)
- `useTheme` hook (styling is static)

---

## Testing Considerations

### Current Test Coverage

**Unknown** - No test files analyzed yet.

### Recommended Test Cases (Based on FR/SC from Plan)

1. **State Machine Tests:**
   - All phase transitions (SETUP → PREP → ... → COMPLETED)
   - Slot alternation (A → B → A → B)
   - Transition to closing after final slot

2. **Timer Precision Tests:**
   - Measure drift over 60-minute session
   - Verify phase completion at exact remainingMs=0

3. **Persistence Tests:**
   - Save state, reload page, verify state restored
   - Verify running=false after reload

4. **Audio Tests:**
   - Verify correct tones for each transition
   - Verify graceful fallback if Web Audio API unavailable

5. **UI Tests:**
   - Profile creation flow
   - Preset selection
   - Transition duration adjustment
   - Timeline preview accuracy

6. **Edge Cases:**
   - Empty profile names
   - Negative/zero durations
   - Browser sleep during session

---

## Comparison to Implementation Plan

### Alignment with Plan Requirements

| Requirement | Current State | Gap |
|-------------|---------------|-----|
| **FR-1:** Custom sessions with element list | ❌ Fixed presets only | Need session builder |
| **FR-2:** Type/Duration/Text per element | ⚠️ Partial (duration only for transitions) | Need per-phase customization |
| **FR-3:** Duration 30s-30min validation | ❌ No validation (preset durations fixed) | Need input validation |
| **FR-4:** Timer engine runs session | ✅ Implemented | Good |
| **FR-5:** Large focus text, color highlight | ⚠️ Partial (guidance text exists) | Need larger typography |
| **FR-6:** Pause/Resume/Next | ⚠️ Partial (no "Next") | Need manual phase skip |
| **FR-7:** Persistent storage & overview | ⚠️ Partial (profiles only) | Need session templates |
| **FR-8:** Preview/test mode | ❌ Not implemented | Need preview feature |
| **FR-9:** Preset templates | ✅ 3 presets exist | Need more + custom |

### Architecture Reusability

**Can Reuse:**
- ✅ Timer engine logic (`useRaf` + `sync`)
- ✅ Audio system (`playBellTone`)
- ✅ Fullscreen controls
- ✅ State persistence pattern (with upgrade to `useStorageSync`)
- ✅ Timeline preview concept

**Need to Build:**
- ❌ Session builder UI (drag-drop, element CRUD)
- ❌ Custom session element types (beyond fixed phases)
- ❌ Session template storage/management
- ❌ Preview mode (fast-forward or shortened timer)
- ❌ Enhanced focus view (larger text, better typography)
- ❌ Keyboard shortcuts integration

---

## Recommendations for Implementation Plan

### Phase 2: Technical Architecture

1. **Extend Type System:**
   ```typescript
   interface SessionElement {
     id: string;
     type: 'SPEAK' | 'TRANSITION' | 'COOLDOWN' | 'CUSTOM';
     durationMs: number;         // 30s - 30min
     focusText: string;          // User-defined text
     speaker?: 'A' | 'B';        // For SPEAK type
   }

   interface CustomSession {
     id: string;
     name: string;
     elements: SessionElement[];
     createdAt: number;
     isTemplate: boolean;
   }
   ```

2. **Refactor State Machine:**
   - Replace `SessionPhase` enum with dynamic `SessionElement` array
   - Replace `currentSlotIndex` with `currentElementIndex`
   - Keep same timer engine logic but iterate over `elements` array

3. **Add Cross-Tab Sync:**
   - Replace `useState` + `localStorage` with `useStorageSync` hook
   - Storage key: `sc.v1.custom-sessions`

4. **Integrate Keyboard Shortcuts:**
   ```typescript
   useKeyboardShortcuts({
     onSpace: togglePause,
     onReset: resetSession,
     onFullscreen: toggleFullscreen
   });
   ```

### Phase 3: Implementation

1. **Session Builder Component:**
   - Reuse timeline preview visual style
   - Add drag-drop (library: `react-beautiful-dnd` or native HTML5)
   - Add element CRUD controls (Add, Edit, Delete, Reorder)

2. **Enhanced Focus View:**
   - Increase font size for `focusText` (currently 1.2rem)
   - Add auto-scaling based on text length (use `useAutoFitText` hook?)
   - Color-code by element type (green=SPEAK, orange=TRANSITION, etc.)

3. **Preview Mode:**
   - Option 1: "Fast Preview" (10× speed, 60s becomes 6s)
   - Option 2: "Quick Browse" (click through elements without timer)
   - Recommended: Option 2 for simplicity

---

## Appendix: Code References

### Key Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `loadState()` | 21-53 | Load state from localStorage, adjust for elapsed time |
| `saveState()` | 67-73 | Save state to localStorage |
| `advancePhase()` | 235-322 | State machine transition logic |
| `sync()` | 325-352 | RAF timer loop, auto-advance on completion |
| `playBellTone()` | 121-159 | Web Audio API bell synthesis |
| `playPhaseChime()` | 161-180 | Phase-specific audio cues |
| `useRaf()` | 183-199 | Custom RAF hook |

### Storage Keys

- `sc.v1.couples` - CouplesTimerState
- `sc.v1.couples.profiles` - CoupleProfile[]

### Constants

- `MIN_TRANSITION_SECONDS` = 5
- `MAX_TRANSITION_SECONDS` = 300 (5 minutes)
- `DEFAULT_TRANSITION_MS` = 60000 (1 minute)

---

## Next Steps (Task T0.2)

1. ✅ **Completed:** Current state documentation
2. ⏭️ **Next:** Define target platforms & screen requirements
3. ⏭️ **After:** Establish KPIs for Custom Sessions feature

---

**End of Document**
