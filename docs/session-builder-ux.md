# Session Builder - UX Concept & Specifications

**Date:** 2025-12-04
**Task:** T1.3 - UX-Konzept Session-Builder (Konfiguration)
**Status:** ✅ Complete

## Executive Summary

This document provides detailed UX specifications for the **Session Builder** (configuration interface for Custom Sessions). Includes layout, component specs, interactions, validation feedback, and responsive behavior for desktop, tablet, and mobile.

**Key Design Principles:**
1. **Progressive Disclosure:** Show complexity only when needed
2. **Inline Feedback:** Validate as user types, not just on submit
3. **Visual Timeline:** Always-visible preview of session structure
4. **Reusability:** Easy template creation and session copying
5. **Accessibility:** Keyboard-navigable, screen-reader friendly

---

## Table of Contents

1. [Page Layout & Structure](#page-layout--structure)
2. [Component Specifications](#component-specifications)
3. [User Interactions & Flows](#user-interactions--flows)
4. [Validation & Error Handling](#validation--error-handling)
5. [Responsive Behavior](#responsive-behavior)
6. [Accessibility](#accessibility)
7. [Visual Design](#visual-design)

---

## Page Layout & Structure

### Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  Header                                                         │
│  ┌───────────┬───────────────────────────────────────────────┐ │
│  │ ← Back    │  Untitled Session        [Preview] [Save]     │ │
│  └───────────┴───────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Main Content Area                                              │
│  ┌──────────────────┬────────────────────────────────────────┐ │
│  │  Sidebar (30%)   │  Element List (70%)                    │ │
│  │  ──────────────  │  ────────────────────────────────────  │ │
│  │                  │                                        │ │
│  │  📋 Templates    │  Session Elements (3)                  │ │
│  │  [List...]       │  ┌──────────────────────────────────┐ │ │
│  │                  │  │ 1. Speaking Phase         [Edit] │ │ │
│  │  ⚙️ Settings     │  │    5:00 | "Share thoughts..."    │ │ │
│  │  [Options...]    │  │    [Delete] [↑] [↓]              │ │ │
│  │                  │  └──────────────────────────────────┘ │ │
│  │                  │  [+ Add Element]                      │ │
│  │                  │                                        │ │
│  │                  │  ────────────────────────────────────  │ │
│  │                  │  Timeline Preview                      │ │
│  │                  │  ┌──────────────────────────────────┐ │ │
│  │                  │  │ ████████░░░████                   │ │ │
│  │                  │  │ 5:00  1:00  5:00                  │ │ │
│  │                  │  └──────────────────────────────────┘ │ │
│  │                  │  Total: 11:00 | 3 elements           │ │
│  └──────────────────┴────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Footer                                                         │
│  [Start Session] (primary)    [Save & Exit]  [Discard]         │
└─────────────────────────────────────────────────────────────────┘
```

**Key Areas:**
- **Header:** Navigation, session name (editable), quick actions
- **Sidebar (30%):** Templates list, settings, optional preset selector
- **Main Content (70%):** Element list (CRUD operations), timeline preview
- **Footer:** Primary actions (Start, Save, Discard)

### Mobile Layout (<768px)

```
┌───────────────────────────┐
│  Header                   │
│  ← Back   Session Name    │
├───────────────────────────┤
│  Session Elements (3)     │
│  ────────────────────────  │
│  ┌─────────────────────┐  │
│  │ 1. Speaking         │  │
│  │    5:00             │  │
│  │    "Share..."       │  │
│  │    [Edit] [Delete]  │  │
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │ 2. Transition       │  │
│  │    1:00             │  │
│  │    [Edit] [Delete]  │  │
│  └─────────────────────┘  │
│                           │
│  [+ Add Element]          │
│  (collapsible form)       │
│                           │
│  ────────────────────────  │
│  Timeline Preview         │
│  (horizontal scroll)      │
│  ┌─────────────────────┐  │
│  │ ████░░████          │  │
│  └─────────────────────┘  │
│  Total: 11:00             │
├───────────────────────────┤
│  Actions (sticky)         │
│  [Start] [Save] [Discard] │
└───────────────────────────┘
```

**Key Changes from Desktop:**
- **No sidebar:** Templates/settings moved to menu or separate screens
- **Stacked layout:** Elements in vertical list
- **Collapsible forms:** Add Element form starts collapsed
- **Sticky footer:** Actions always visible at bottom
- **Horizontal timeline:** Timeline scrolls horizontally on narrow screens

---

## Component Specifications

### 1. Session Header

**Purpose:** Display session name, navigation, and quick actions

#### Desktop Header (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Sessions    Untitled Session (editable)              │
│                        [Preview] [Save Changes] [⋮ More]         │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- **Back Button:**
  - Icon: ← (left arrow)
  - Text: "Back to Sessions" (on hover, show full text; compact shows just icon)
  - Action: Navigate to sessions list with unsaved changes warning if applicable

- **Session Name (Editable):**
  - Default: "Untitled Session"
  - Type: Inline editable text (click to edit)
  - Max length: 50 characters
  - Validation: Non-empty (auto-revert to "Untitled Session" if empty)
  - Font: 1.5rem (24px), bold
  - Placeholder: "Click to edit session name"

- **Quick Actions:**
  - **Preview Button:**
    - Icon: ⚡ (lightning bolt)
    - Text: "Preview"
    - Action: Navigate to Preview Mode (Flow 5)
    - Disabled if: 0 elements
    - Tooltip: "Test your session without starting the timer"

  - **Save Changes Button:**
    - Icon: 💾 (floppy disk)
    - Text: "Save Changes"
    - Action: Explicitly save session (also auto-saves with 150ms debounce)
    - Visual feedback: Checkmark animation on save
    - Disabled if: No changes detected

  - **More Menu (⋮):**
    - Dropdown options:
      - "Delete Session" (red, destructive)
      - "Duplicate Session"
      - "Export as JSON" (future feature)

#### Mobile Header (<768px)

```
┌───────────────────────────┐
│  ← Back   Session Name    │
│  [⋮ More]                 │
└───────────────────────────┘
```

**Components:**
- Simpler layout: Back button + session name (1 line)
- More menu (⋮) on second line with all actions (Preview, Save, Delete)

---

### 2. Sidebar (Desktop Only)

**Purpose:** Quick access to templates, presets, and settings

```
┌──────────────────┐
│  📋 My Templates │
│  ──────────────  │
│  [List of 3-5]   │
│  • Workshop      │
│    Check-In      │
│    (20 min)      │
│  • Couples       │
│    Dialogue      │
│    (60 min)      │
│  [View All →]    │
│                  │
│  ──────────────  │
│  ⚙️ Settings     │
│  ──────────────  │
│  ☑ Auto-save     │
│  ☐ Confirm skip  │
│  ☐ Sound on      │
└──────────────────┘
```

**Templates Section:**
- **Header:** "📋 My Templates" (icon + text)
- **List:** Show 3-5 most recent templates
  - Template name (bold, 1rem)
  - Total duration (gray, 0.875rem)
  - Hover: Highlight + show "Use Template" button
- **View All:** Link to full templates library

**Settings Section:**
- **Header:** "⚙️ Settings"
- **Options:**
  - ☑ Auto-save changes (150ms debounce) [default: ON]
  - ☐ Confirm element skip (show confirmation) [default: OFF]
  - ☐ Play sound effects (bell tones) [default: OFF]
- **Type:** Checkboxes, toggle immediately on click

**Mobile Behavior:**
- Sidebar hidden on mobile
- Access via hamburger menu (☰) or bottom sheet

---

### 3. Element List

**Purpose:** Display, edit, reorder, and delete session elements

#### Element Card (Individual)

```
┌──────────────────────────────────────────────────────────────┐
│  1. Speaking Phase                      [Edit] [Delete]      │
│     Duration: 5:00                      [↑] [↓]              │
│     Text: "Share your thoughts on the project goals..."      │
│     ──────────────────────────────────────────────────────   │
│     Speaking | Green | Added 2 min ago                       │
└──────────────────────────────────────────────────────────────┘
```

**Components:**

- **Number Badge:**
  - Text: "1." (element index)
  - Position: Top-left
  - Font: 1rem, bold
  - Color: Charcoal (#0b1220) on white background

- **Element Type:**
  - Text: "Speaking Phase" (or Transition, Cooldown, Custom)
  - Font: 1.125rem (18px), semi-bold
  - Color: White (#FFFFFF)
  - Icon: 🗣️ (speaking), ⏸ (transition), 🧘 (cooldown), ⚙️ (custom)

- **Duration Display:**
  - Text: "Duration: 5:00" (MM:SS format)
  - Font: 1rem, regular
  - Color: Gray (#708090)
  - Position: Below element type

- **Focus Text Preview:**
  - Text: First 60 characters of focus text + "..." if longer
  - Font: 0.875rem (14px), italic
  - Color: Light gray (#A0A0A0)
  - Position: Below duration

- **Metadata Row:**
  - Type badge: "Speaking" (green), "Transition" (orange), etc.
  - Color dot: Matches timeline preview color
  - Timestamp: "Added 2 min ago" (relative time)
  - Font: 0.75rem (12px), gray

- **Action Buttons (Right Side):**
  - **Edit Button:**
    - Icon: ✏️ (pencil) or text "Edit"
    - Action: Open edit modal/inline form
    - Hover: Blue (#00D9FF)

  - **Delete Button:**
    - Icon: 🗑️ (trash) or text "Delete"
    - Action: Show confirmation dialog, then delete
    - Hover: Red (#DC143C)

  - **Reorder Buttons (↑ ↓):**
    - Icons: ↑ (up arrow), ↓ (down arrow)
    - Action: Move element up/down in list
    - Disabled: ↑ on first element, ↓ on last element
    - Hover: Gray (#708090)

**States:**

- **Default:** White background, subtle shadow
- **Hover:** Light blue background (#E6F7FF), shadow increases
- **Selected (during edit):** Blue border (2px solid #00D9FF)
- **Dragging (desktop):** Semi-transparent (80% opacity), lifted shadow
- **Error (validation failed):** Red border (2px solid #DC143C)

**Responsive Behavior:**

- **Desktop:** Full card with all buttons visible
- **Mobile:** Stacked layout, buttons on second row, smaller font sizes

---

### 4. Add Element Form

**Purpose:** Create new session elements

#### Desktop Form (Modal or Inline)

```
┌────────────────────────────────────────────────────────────────┐
│  Add Session Element                                  [X Close] │
│  ──────────────────────────────────────────────────────────── │
│                                                                │
│  Element Type *                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ○ Speaking Phase    ○ Transition / Break                 │ │
│  │ ○ Cooldown          ○ Custom                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Duration * (30 seconds - 30 minutes)                          │
│  ┌─────────────┬───────────────┐                              │
│  │ [5] minutes │ [0] seconds   │                              │
│  └─────────────┴───────────────┘                              │
│  Or use quick presets: [1 min] [3 min] [5 min] [10 min]       │
│                                                                │
│  Focus Text * (1-500 characters)                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Enter instructions or prompt that will be shown during    │ │
│  │ this phase...                                             │ │
│  │                                                           │ │
│  │ (0/500 characters)                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ☐ Save as template for quick reuse                           │
│                                                                │
│  [Cancel]                          [Add Element] (primary)     │
└────────────────────────────────────────────────────────────────┘
```

**Field Specifications:**

1. **Element Type (Radio Buttons)**
   - **Options:**
     - ○ Speaking Phase (icon: 🗣️)
     - ○ Transition / Break (icon: ⏸)
     - ○ Cooldown / Reflection (icon: 🧘)
     - ○ Custom (icon: ⚙️)
   - **Layout:** 2×2 grid on desktop, 1 column on mobile
   - **Validation:** Required (must select one)
   - **Default:** None selected (force user to choose)
   - **Visual:** Selected option has blue border + checkmark

2. **Duration (Number Inputs)**
   - **Inputs:**
     - Minutes: Number input (0-30), step=1
     - Seconds: Number input (0-59), step=5 or 15
   - **Validation:**
     - Total duration ≥30 seconds
     - Total duration ≤30 minutes (1800 seconds)
     - Inline error: Show red border + error message below
   - **Quick Presets:** Buttons for common durations
     - [1 min] [3 min] [5 min] [10 min] [15 min] [20 min]
     - Action: Fill in minutes field with preset value
   - **Accessibility:** Use `<input type="number">` with min/max/step

3. **Focus Text (Textarea)**
   - **Type:** Multi-line textarea, auto-expanding
   - **Placeholder:** "Enter instructions or prompt that will be shown during this phase..."
   - **Min Length:** 1 character
   - **Max Length:** 500 characters
   - **Character Counter:** "0/500 characters" (gray when valid, red when >500)
   - **Validation:**
     - Required (cannot be empty)
     - Max 500 characters (truncate or show error)
   - **Accessibility:** `aria-describedby` linked to counter

4. **Save as Template (Checkbox)**
   - **Label:** "Save as template for quick reuse"
   - **Action:** If checked, prompt for template name after adding element
   - **Default:** Unchecked

**Buttons:**

- **Cancel:**
  - Action: Close form without saving, discard inputs
  - Style: Secondary (gray border, white background)
  - Keyboard: Esc key

- **Add Element:**
  - Action: Validate inputs, add element to list, close form
  - Style: Primary (blue background, white text)
  - Disabled: If validation fails (gray, cursor: not-allowed)
  - Keyboard: Enter key (if all fields valid)

**Validation Feedback:**

- **Real-time validation:** Check as user types (debounced 300ms)
- **Error placement:** Below each invalid field
- **Error format:**
  ```
  ⚠️ Minimum duration is 30 seconds (currently: 20s)
  ```
- **Success indicator:** Green checkmark icon next to valid field

#### Mobile Form (Bottom Sheet)

```
┌─────────────────────────┐
│  Add Element         [X]│
│  ─────────────────────  │
│  Type: ○ Speak ○ Trans  │
│        ○ Cool  ○ Custom │
│                         │
│  Duration:              │
│  [5] min  [0] sec       │
│  Quick: [1m][3m][5m]    │
│                         │
│  Focus Text:            │
│  ┌─────────────────────┐│
│  │ Enter text...       ││
│  │                     ││
│  └─────────────────────┘│
│  (0/500 chars)          │
│                         │
│  [Cancel] [Add Element] │
└─────────────────────────┘
```

**Key Changes:**
- Slides up from bottom (bottom sheet pattern)
- Compact layout, stacked fields
- Larger touch targets (48×48px minimum)

---

### 5. Timeline Preview

**Purpose:** Visual representation of session structure and flow

```
┌──────────────────────────────────────────────────────────────────┐
│  Timeline Preview                                                │
│  ──────────────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ████████████████████████ (5:00) Speaking                   │  │
│  │ ██████ (1:00) Transition                                    │  │
│  │ ████████████████████████ (5:00) Speaking                   │  │
│  │ ████████████ (2:00) Cooldown                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│  Total Duration: 13:00 | 4 elements                              │
│  ──────────────────────────────────────────────────────────────  │
│  Legend:  ■ Speaking (Green)  ■ Transition (Orange)              │
│           ■ Cooldown (Gray)   ■ Custom (Blue)                    │
└──────────────────────────────────────────────────────────────────┘
```

**Visual Design:**

- **Bar Chart Style:** Horizontal bars proportional to duration
- **Color Coding:**
  - Green (#4CAF50): Speaking Phase
  - Orange (#FF9800): Transition / Break
  - Gray (#9E9E9E): Cooldown / Reflection
  - Blue (#2196F3): Custom
- **Labels:** Duration (MM:SS) + element type on each segment
- **Hover State:** Segment expands slightly, shows tooltip with full focus text
- **Total Duration:** Displayed below timeline in large text (1.25rem)
- **Element Count:** "4 elements" in smaller text (0.875rem)

**Interaction:**

- **Click on Segment:** Scroll to corresponding element in list and highlight it
- **Hover:** Show tooltip with:
  - Element name
  - Full focus text (if >60 chars)
  - Duration (MM:SS)

**Responsive Behavior:**

- **Desktop (≥1024px):** Full horizontal timeline, all segments visible
- **Tablet (768-1023px):** Horizontal timeline, segments may wrap to 2 rows
- **Mobile (<768px):** Horizontal scroll, fixed height (80px), snap to segments

**Empty State:**

```
┌──────────────────────────────────────────────────────────────────┐
│  Timeline Preview                                                │
│  ──────────────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  No elements yet. Add your first phase to see the timeline. │  │
│  └────────────────────────────────────────────────────────────┘  │
│  Total Duration: 0:00 | 0 elements                               │
└──────────────────────────────────────────────────────────────────┘
```

---

### 6. Footer Actions

**Purpose:** Primary actions for session management

#### Desktop Footer

```
┌──────────────────────────────────────────────────────────────────┐
│  [◀ Start Session] (primary, large)                              │
│                                  [Save & Exit] [Discard Changes] │
└──────────────────────────────────────────────────────────────────┘
```

**Buttons:**

1. **Start Session (Primary)**
   - **Style:** Large button, blue background (#00D9FF), white text
   - **Icon:** ▶ (play icon)
   - **Action:** Navigate to Focus View (Flow 2), start timer
   - **Disabled if:** 0 elements (show tooltip: "Add at least 1 element")
   - **Keyboard:** Ctrl+Enter

2. **Save & Exit (Secondary)**
   - **Style:** Medium button, white background, gray border
   - **Icon:** 💾 (save icon)
   - **Action:** Save session, navigate to sessions list
   - **Disabled if:** No changes (auto-save handles this)

3. **Discard Changes (Tertiary)**
   - **Style:** Small button, text-only (no background), red text
   - **Action:** Show confirmation: "Discard all changes?", then navigate to sessions list
   - **Keyboard:** Esc (with confirmation)

#### Mobile Footer (Sticky)

```
┌─────────────────────────┐
│  [Start Session] (full) │
│  [Save]  [Discard]      │
└─────────────────────────┘
```

**Key Changes:**
- Sticky positioning (always visible at bottom)
- Full-width "Start Session" button (high prominence)
- "Save" and "Discard" on second row (smaller)

---

## User Interactions & Flows

### Flow A: Add First Element (Empty State → 1 Element)

1. **User arrives at Session Builder (0 elements)**
   - Sees empty state: "No elements yet"
   - Sees disabled "Start Session" button
   - Sees prominent "[+ Add Element]" button

2. **User clicks "+ Add Element"**
   - Form expands (desktop: modal or inline; mobile: bottom sheet)
   - All fields are empty (no defaults)
   - "Add Element" button is disabled (validation not met)

3. **User selects "Speaking Phase"**
   - Radio button selects, blue checkmark appears
   - Element type error (if any) clears

4. **User enters duration: 5 minutes, 0 seconds**
   - Number inputs update
   - Duration validation checks in real-time (300ms debounce)
   - If valid (≥30s, ≤30min): Green checkmark appears
   - Total duration preview updates: "5:00"

5. **User enters focus text: "Share your thoughts on the project goals"**
   - Textarea updates, character counter shows "45/500"
   - Focus text validation checks (≥1 char, ≤500 chars)
   - If valid: Green checkmark appears

6. **User clicks "Add Element"**
   - Form validates all fields (final check)
   - If valid:
     - Element added to list (UI updates)
     - Timeline preview updates (shows green segment)
     - Form closes
     - Success toast: "Element added!"
     - "Start Session" button enables
   - If invalid:
     - Highlight invalid fields with red borders
     - Show error summary at top: "Fix 2 errors to continue"
     - Form stays open

### Flow B: Reorder Elements (Drag-and-Drop on Desktop)

1. **User has 3 elements: [1. Speaking] [2. Transition] [3. Speaking]**
   - Sees drag handles (⋮⋮) on each element card (desktop only)

2. **User hovers over Element 3**
   - Cursor changes to move cursor (cursor: grab)
   - Element card highlights slightly

3. **User drags Element 3 to position 1**
   - Element 3 becomes semi-transparent (80% opacity)
   - Drop zone indicator appears between Element 0 and Element 1 (blue line)
   - Other elements shift down to make space

4. **User releases mouse button**
   - Element 3 moves to position 1
   - Elements renumber: [1. Speaking (was #3)] [2. Speaking (was #1)] [3. Transition (was #2)]
   - Timeline preview updates immediately
   - Auto-save triggers (150ms debounce)
   - Success feedback: Element card flashes green briefly

**Mobile Alternative (Arrow Buttons):**

1. User taps "↑" button on Element 3
2. Element 3 moves up one position (swap with Element 2)
3. Timeline updates, auto-save triggers

### Flow C: Edit Existing Element

1. **User clicks "Edit" button on Element 2**
   - Edit modal opens (desktop) or bottom sheet (mobile)
   - Form pre-fills with existing values:
     - Type: "Transition" (selected)
     - Duration: 1 minute, 0 seconds
     - Focus Text: "Pause and reflect"

2. **User changes duration from 1:00 to 2:00**
   - Number input updates (minutes: 1 → 2)
   - Validation checks (still valid)
   - "Save Changes" button enables (detects change)

3. **User clicks "Save Changes"**
   - Form validates (final check)
   - If valid:
     - Element updates in list
     - Timeline preview updates (segment grows from 1:00 to 2:00)
     - Form closes
     - Success toast: "Element updated!"
     - Auto-save triggers
   - If invalid:
     - Show errors (same as Add flow)

### Flow D: Delete Element (with Confirmation)

1. **User clicks "Delete" button on Element 2**
   - Confirmation dialog appears:
     ```
     Delete this element?

     "Transition (1:00)"
     This cannot be undone.

     [Cancel] [Delete]
     ```

2. **User clicks "Delete"**
   - Element fades out (300ms animation)
   - Element removed from list
   - Elements renumber: [1. Speaking] [2. Speaking (was #3)]
   - Timeline preview updates
   - Undo toast appears: "Element deleted. [Undo]" (5 seconds)
   - Auto-save triggers

3. **(Optional) User clicks "Undo" within 5 seconds**
   - Deleted element restored to original position
   - Timeline updates
   - Success toast: "Element restored!"

---

## Validation & Error Handling

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| **Element Type** | Required | "Please select an element type" |
| **Duration (Min)** | ≥30 seconds | "Minimum duration is 30 seconds (currently: Xs)" |
| **Duration (Max)** | ≤30 minutes | "Maximum duration is 30 minutes (currently: Xm Ys)" |
| **Focus Text (Min)** | ≥1 character | "Focus text cannot be empty" |
| **Focus Text (Max)** | ≤500 characters | "Focus text too long (X/500 characters)" |
| **Session (Min Elements)** | ≥1 element to start | "Add at least 1 element to start session" |

### Error Display Patterns

#### Inline Errors (Field-Level)

```
Duration *
┌─────────────┬───────────────┐
│ [0] minutes │ [15] seconds  │ ← Red border
└─────────────┴───────────────┘
⚠️ Minimum duration is 30 seconds (currently: 15s)
    ↑ Error message below field
```

**Style:**
- Red border (2px solid #DC143C)
- Error icon (⚠️) + message below field
- Font: 0.875rem (14px), red (#DC143C)

#### Form-Level Errors (Summary)

```
┌────────────────────────────────────────────────────────────────┐
│  ⚠️ Please fix 2 errors before adding element:                 │
│  • Duration is below minimum (30s)                             │
│  • Focus text is empty                                         │
└────────────────────────────────────────────────────────────────┘
```

**Style:**
- Red background (#FFE6E6), dark red text (#CC0000)
- Positioned at top of form
- Dismissible (X button) but reappears on validation

#### Success Feedback

```
┌────────────────────────────────────────────────────────────────┐
│  ✅ Element added successfully!                                │
└────────────────────────────────────────────────────────────────┘
```

**Style:**
- Green background (#E8F5E9), dark green text (#2E7D32)
- Toast notification (auto-dismiss after 3 seconds)
- Slide in from top

---

## Responsive Behavior

### Breakpoint-Specific Layouts

| Breakpoint | Width | Layout | Sidebar | Footer |
|------------|-------|--------|---------|--------|
| **xs (Mobile)** | <640px | Single column, stacked | Hidden (menu) | Sticky, full-width buttons |
| **sm (Large Phone)** | ≥640px | Single column, more spacing | Hidden (menu) | Sticky, wider buttons |
| **md (Tablet)** | ≥768px | 1-2 column hybrid | Collapsible | Standard footer |
| **lg (Desktop)** | ≥1024px | Sidebar (30%) + Main (70%) | Always visible | Standard footer |
| **xl (Large Desktop)** | ≥1280px | Sidebar (25%) + Main (75%) | Always visible | Standard footer |

### Element Card Responsive Behavior

**Desktop (≥1024px):**
```
┌──────────────────────────────────────────────────────────┐
│  1. Speaking Phase               [Edit] [Delete] [↑] [↓] │
│     Duration: 5:00                                       │
│     Text: "Share your thoughts on the project goals..."  │
└──────────────────────────────────────────────────────────┘
```

**Tablet (768-1023px):**
```
┌────────────────────────────────────────────────┐
│  1. Speaking Phase        [Edit] [Del] [↑] [↓] │
│     5:00 | "Share your thoughts..."            │
└────────────────────────────────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────────────────┐
│  1. Speaking Phase      │
│     5:00                │
│     "Share..."          │
│  [Edit] [Delete]        │
│  [↑] [↓]                │
└─────────────────────────┘
```

### Timeline Preview Responsive Behavior

**Desktop:** Full horizontal timeline, all segments visible
**Tablet:** Horizontal timeline, may wrap to 2 rows if many elements
**Mobile:** Horizontal scroll, fixed height (80px), snap to segments

---

## Accessibility

### Keyboard Navigation

| Action | Keyboard Shortcut | Notes |
|--------|-------------------|-------|
| **Navigate fields** | Tab / Shift+Tab | Sequential focus |
| **Open Add Element form** | A (when on element list) | Quick access |
| **Submit form** | Enter (in form) | Only if validation passes |
| **Cancel form** | Esc | Confirm if changes made |
| **Delete element** | Del (when focused on element card) | Show confirmation |
| **Reorder up** | Ctrl+↑ (on element card) | Move element up |
| **Reorder down** | Ctrl+↓ (on element card) | Move element down |
| **Start session** | Ctrl+Enter (anywhere) | If ≥1 element |

### Screen Reader Support

#### ARIA Labels

```html
<!-- Add Element Button -->
<button aria-label="Add new session element" aria-describedby="add-element-help">
  + Add Element
</button>
<span id="add-element-help" class="sr-only">
  Opens a form to create a new phase in your session
</span>

<!-- Element Card -->
<article aria-label="Element 1: Speaking Phase, 5 minutes">
  <h3>1. Speaking Phase</h3>
  <p>Duration: 5:00</p>
  <p>Text: "Share your thoughts..."</p>
  <div role="group" aria-label="Element actions">
    <button aria-label="Edit Speaking Phase">Edit</button>
    <button aria-label="Delete Speaking Phase">Delete</button>
    <button aria-label="Move up" disabled>↑</button>
    <button aria-label="Move down">↓</button>
  </div>
</article>

<!-- Duration Inputs -->
<label for="duration-minutes">Duration (minutes)</label>
<input id="duration-minutes" type="number"
       aria-describedby="duration-help duration-error"
       aria-invalid="false" />
<span id="duration-help">Enter duration between 0-30 minutes</span>
<span id="duration-error" role="alert" aria-live="polite">
  <!-- Error message appears here -->
</span>
```

#### Live Regions

```html
<!-- Success/Error Toast -->
<div role="status" aria-live="polite" aria-atomic="true">
  Element added successfully!
</div>

<!-- Character Counter -->
<div aria-live="polite" aria-atomic="true">
  <span id="char-count">0/500 characters</span>
</div>
```

### Focus Management

1. **After adding element:** Focus returns to "+ Add Element" button
2. **After editing element:** Focus returns to edited element card
3. **After deleting element:** Focus moves to next element (or "+ Add Element" if last)
4. **On modal open:** Focus moves to first form field
5. **On modal close:** Focus returns to trigger element (e.g., "Edit" button)

### Color Blindness Support

- **Color coding + patterns:** Timeline segments use both color AND pattern (stripes, dots)
- **Icon + text labels:** Never rely on color alone (e.g., "Speaking Phase" text + green color)
- **High contrast mode:** Test with Windows High Contrast Mode and browser plugins

---

## Visual Design

### Color Palette

| Element Type | Color (Hex) | RGB | Use |
|--------------|-------------|-----|-----|
| **Speaking Phase** | #4CAF50 | 76, 175, 80 | Element cards, timeline segments |
| **Transition** | #FF9800 | 255, 152, 0 | Element cards, timeline segments |
| **Cooldown** | #9E9E9E | 158, 158, 158 | Element cards, timeline segments |
| **Custom** | #2196F3 | 33, 150, 243 | Element cards, timeline segments |
| **Primary Action** | #00D9FF | 0, 217, 255 | "Start Session" button |
| **Destructive Action** | #DC143C | 220, 20, 60 | "Delete" button, errors |
| **Background** | #0b1220 | 11, 18, 32 | Page background (charcoal) |
| **Card Background** | #1a2332 | 26, 35, 50 | Element cards, modals |
| **Text Primary** | #FFFFFF | 255, 255, 255 | Main text |
| **Text Secondary** | #708090 | 112, 128, 144 | Labels, metadata |

### Typography

**Font Family:** Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif

| Element | Font Size | Weight | Line Height |
|---------|-----------|--------|-------------|
| **Page Title** | 2rem (32px) | Bold (700) | 1.2 |
| **Section Heading** | 1.5rem (24px) | Semi-bold (600) | 1.3 |
| **Element Type** | 1.125rem (18px) | Semi-bold (600) | 1.4 |
| **Body Text** | 1rem (16px) | Regular (400) | 1.5 |
| **Small Text** | 0.875rem (14px) | Regular (400) | 1.5 |
| **Tiny Text (Metadata)** | 0.75rem (12px) | Regular (400) | 1.5 |

### Spacing & Layout

**Golden Ratio Spacing (φ = 1.618):**
- Base unit: 8px
- Small: 8px
- Medium: 16px (8 × 2)
- Large: 24px (8 × 3)
- X-Large: 40px (24 × φ ≈ 39)
- XX-Large: 64px (40 × φ ≈ 65)

**Component Spacing:**
- Element cards: 16px margin-bottom
- Form fields: 24px margin-bottom
- Section gaps: 40px margin-top
- Timeline preview: 24px padding

### Shadows & Elevation

| Component | Shadow | Use |
|-----------|--------|-----|
| **Element Card** | 0 2px 4px rgba(0,0,0,0.1) | Default state |
| **Element Card (Hover)** | 0 4px 8px rgba(0,0,0,0.2) | Hover state |
| **Modal** | 0 8px 16px rgba(0,0,0,0.3) | Add/Edit form modal |
| **Button (Primary)** | 0 2px 4px rgba(0,0,0,0.2) | "Start Session" button |

### Animations & Transitions

| Interaction | Duration | Easing | Effect |
|-------------|----------|--------|--------|
| **Element card hover** | 200ms | ease-in-out | Shadow + background |
| **Element add/delete** | 300ms | ease-out | Fade in/out |
| **Form open/close** | 250ms | ease-in-out | Slide or fade |
| **Timeline update** | 400ms | ease-in-out | Segment width change |
| **Button click** | 100ms | ease-in | Scale down (95%) |

---

## Edge Cases & Error States

### Empty States

1. **No Sessions Yet:**
   ```
   ┌────────────────────────────────────────────┐
   │  📋 No sessions yet.                       │
   │  Click "+ New Session" to get started!     │
   │  ─────────────────────────────────────     │
   │  Or try a preset:                          │
   │  [Workshop Check-In] [Couples Dialogue]    │
   └────────────────────────────────────────────┘
   ```

2. **No Elements in Session:**
   ```
   ┌────────────────────────────────────────────┐
   │  Session Elements (0)                      │
   │  ─────────────────────────────────────     │
   │  No elements yet. Add your first phase!    │
   │  [+ Add Element]                           │
   └────────────────────────────────────────────┘
   ```

### Loading States

1. **Saving Session:**
   - Show spinner on "Save" button
   - Disable button during save
   - Text: "Save Changes" → "Saving..." → "Saved!"

2. **Loading Sessions List:**
   - Show skeleton cards (3 placeholders with animated gradient)
   - Replace with actual content when loaded (<200ms)

### Error States

1. **localStorage Full:**
   ```
   ⚠️ Storage Full

   Your browser storage is full. Delete old sessions
   to continue, or export your data and clear storage.

   [Delete Old Sessions] [Export Data] [Cancel]
   ```

2. **Session Load Failed:**
   ```
   ❌ Failed to Load Session

   This session may be corrupted or deleted.

   [Return to Sessions List] [Retry]
   ```

3. **Validation Failed on Start:**
   ```
   ⚠️ Cannot Start Session

   Please fix the following errors:
   • Element 2: Duration is below minimum (20s)
   • Element 4: Focus text is empty

   [Review Elements] [Cancel]
   ```

---

## Implementation Notes

### Component Structure (React)

```
SessionBuilder/
├── SessionHeader.tsx          (Session name, navigation, actions)
├── Sidebar/
│   ├── TemplatesList.tsx      (My Templates section)
│   └── SettingsPanel.tsx      (Auto-save, sound, etc.)
├── ElementList/
│   ├── ElementCard.tsx        (Individual element display)
│   ├── AddElementForm.tsx     (Modal/inline form)
│   └── EmptyState.tsx         (No elements yet)
├── TimelinePreview.tsx        (Visual timeline)
├── Footer.tsx                 (Primary actions)
└── index.tsx                  (Main container)
```

### State Management

```typescript
interface SessionBuilderState {
  sessionId: string;
  sessionName: string;
  elements: SessionElement[];
  isEditMode: boolean;
  editingElementIndex: number | null;
  showAddElementForm: boolean;
  validationErrors: ValidationError[];
  isDirty: boolean; // Has unsaved changes
  autoSaveEnabled: boolean;
}
```

### Auto-Save Implementation

```typescript
// Debounced auto-save (150ms)
useEffect(() => {
  if (!state.autoSaveEnabled || !state.isDirty) return;

  const timer = setTimeout(() => {
    saveSession(state.sessionId, state);
    setState(prev => ({ ...prev, isDirty: false }));
    showToast('Changes saved', 'success');
  }, 150);

  return () => clearTimeout(timer);
}, [state.elements, state.sessionName, state.autoSaveEnabled]);
```

---

## Next Steps (Task T1.4)

1. ✅ **Completed:** Session Builder UX Concept (comprehensive text-based spec)
2. ⏭️ **Next:** Design Focus View UX Concept (T1.4)
3. ⏭️ **After:** Define Domain & Data Models (T2.1)

---

**End of Document**
