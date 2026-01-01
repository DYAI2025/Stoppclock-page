# Focus View - UX Concept & Specifications

**Date:** 2025-12-04
**Task:** T1.4 - UX-Konzept Fokus-View (Live-Ansicht)
**Status:** ✅ Complete

## Executive Summary

This document provides detailed UX specifications for the **Focus View** (live session interface for Custom Sessions). Optimized for projection, classrooms, and presentation scenarios with large, readable typography and minimal distractions.

**Key Design Principles:**
1. **Maximum Readability:** Focus text readable from 5-10 meters (projector mode)
2. **Minimal Distraction:** Clean layout, no unnecessary UI chrome
3. **Prominence:** Timer and focus text dominate the screen
4. **Context Awareness:** Clear phase indicators, progress feedback
5. **Quick Controls:** Essential controls accessible but unobtrusive

**Target Use Cases:**
- Workshop facilitation (desktop + projector)
- Classroom instruction (teacher's display)
- Couples therapy (tablet propped up)
- Personal focus sessions (mobile)

---

## Table of Contents

1. [Page Layout & Structure](#page-layout--structure)
2. [Component Specifications](#component-specifications)
3. [Phase Transitions & Animations](#phase-transitions--animations)
4. [Responsive Behavior](#responsive-behavior)
5. [Fullscreen Mode](#fullscreen-mode)
6. [Accessibility](#accessibility)
7. [Visual Design](#visual-design)

---

## Page Layout & Structure

### Desktop/Projector Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  Header (minimal, collapsible)                                  │
│  Element 2 of 5 - Transition                        [Exit]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                    ╔═════════════════════════╗                  │
│                    ║                         ║                  │
│                    ║  FOCUS TEXT (LARGE)     ║                  │
│                    ║                         ║                  │
│                    ║  Pause and reflect on   ║                  │
│                    ║  what you just heard.   ║                  │
│                    ║  Take deep breaths.     ║                  │
│                    ║                         ║                  │
│                    ╚═════════════════════════╝                  │
│                                                                 │
│                           08:32                                 │
│                    (huge timer display)                         │
│                                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Controls (bottom, semi-transparent on hover)                   │
│  [⏸ Pause] [⏭ Next] [🔄 Reset] [⛶ Fullscreen]                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Areas:**
- **Header (10% height):** Minimal context (phase title, element count, exit button)
- **Focus Zone (70% height):** Large focus text + timer (vertically centered)
- **Controls (10% height):** Action buttons (auto-hide in fullscreen, show on hover)

**Vertical Distribution:**
- Header: 10% viewport height
- Top spacer: 5vh
- Focus text: 40-50vh (flexible based on content)
- Timer: 15-20vh
- Bottom spacer: 5vh
- Controls: 10vh

### Tablet Layout (768-1023px)

```
┌─────────────────────────────┐
│  Header                     │
│  Element 2 of 5             │
├─────────────────────────────┤
│                             │
│  ╔═══════════════════════╗  │
│  ║                       ║  │
│  ║  FOCUS TEXT           ║  │
│  ║                       ║  │
│  ║  Pause and reflect... ║  │
│  ║                       ║  │
│  ╚═══════════════════════╝  │
│                             │
│         08:32               │
│     (large timer)           │
│                             │
├─────────────────────────────┤
│  Controls                   │
│  [⏸ Pause] [⏭ Next]         │
│  [🔄 Reset] [⛶ Full]        │
└─────────────────────────────┘
```

**Key Changes from Desktop:**
- Slightly smaller focus text (2rem vs 3rem)
- Controls in 2×2 grid (larger touch targets)
- Header always visible (no auto-hide)

### Mobile Layout (<768px)

```
┌─────────────────┐
│  Header         │
│  Element 2/5    │
├─────────────────┤
│                 │
│  ╔═══════════╗  │
│  ║           ║  │
│  ║  FOCUS    ║  │
│  ║  TEXT     ║  │
│  ║           ║  │
│  ║  Pause    ║  │
│  ║  and      ║  │
│  ║  reflect  ║  │
│  ║           ║  │
│  ╚═══════════╝  │
│                 │
│      08:32      │
│   (medium)      │
│                 │
├─────────────────┤
│  [⏸] [⏭]       │
│  [🔄] [⛶]      │
│  (icons only)   │
└─────────────────┘
```

**Key Changes from Tablet:**
- Even smaller focus text (1.5rem)
- Icons-only controls (no text labels)
- Compact header ("Element 2/5" instead of full text)

---

## Component Specifications

### 1. Phase Header

**Purpose:** Provide context about current session phase without distracting from focus text

#### Desktop Header (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  Element 2 of 5 - Transition                        [← Exit]    │
│  ●●○○○                                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**

- **Phase Title:**
  - Text: "Element X of Y - [Type]" (e.g., "Element 2 of 5 - Transition")
  - Font: 1.5rem (24px) on desktop, 2.5rem (40px) on projector
  - Color: White (#FFFFFF) with 80% opacity
  - Position: Top-left
  - Auto-hide: Fades to 20% opacity after 3 seconds (mouseover restores)

- **Progress Dots:**
  - Visual: 5 dots (●●○○○) representing element progress
  - Filled dots (#00D9FF): Completed elements
  - Empty dots (#708090): Upcoming elements
  - Position: Below phase title, left-aligned
  - Size: 12px diameter on desktop, 16px on projector

- **Exit Button:**
  - Icon: ← (left arrow) or "X"
  - Text: "Exit" (on hover)
  - Action: Pause session, show confirmation: "Exit session? Progress will be saved."
  - Position: Top-right
  - Color: White with 60% opacity, 100% on hover
  - Keyboard: Esc key (with confirmation)

**Auto-Hide Behavior (Desktop/Projector):**
- After 3 seconds of inactivity: Header fades to 20% opacity
- On mouse movement or hover: Header fades back to 100% opacity
- In fullscreen mode: Header hidden by default, shows on hover at top edge

#### Mobile Header (<768px)

```
┌─────────────────┐
│  ← Element 2/5  │
│  ●●○○○          │
└─────────────────┘
```

**Key Changes:**
- Compact text: "Element 2/5" (no type name)
- Smaller font: 1.25rem (20px)
- Always visible (no auto-hide)

---

### 2. Focus Text Display

**Purpose:** Display user-defined focus text prominently, readable from distance

#### Desktop Focus Text (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ╔═════════════════════════╗                  │
│                    ║                         ║                  │
│                    ║  Pause and reflect on   ║                  │
│                    ║  what you just heard.   ║                  │
│                    ║                         ║                  │
│                    ║  Take deep breaths and  ║                  │
│                    ║  prepare for the next   ║                  │
│                    ║  phase.                 ║                  │
│                    ║                         ║                  │
│                    ╚═════════════════════════╝                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Typography:**

| Platform | Font Size | Line Height | Max Width | Notes |
|----------|-----------|-------------|-----------|-------|
| **Projector (≥1280px)** | 4rem (64px) | 1.3 | 80% viewport | Readable from 5-10m |
| **Desktop (1024-1279px)** | 3rem (48px) | 1.3 | 75% viewport | Standard desktop |
| **Tablet (768-1023px)** | 2rem (32px) | 1.4 | 90% viewport | Propped-up tablet |
| **Mobile (<768px)** | 1.5rem (24px) | 1.5 | 95% viewport | Handheld |

**Auto-Scaling (Dynamic Font Size):**

```typescript
// Pseudocode for auto-scaling
const baseSize = 4; // rem (projector)
const textLength = focusText.length;

let fontSize = baseSize;
if (textLength > 100) fontSize = baseSize * 0.9;  // -10%
if (textLength > 200) fontSize = baseSize * 0.8;  // -20%
if (textLength > 300) fontSize = baseSize * 0.7;  // -30%
if (textLength > 400) fontSize = baseSize * 0.6;  // -40%

// Max reduction: 40% (prevents text from becoming too small)
```

**Visual Design:**

- **Font Family:** Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif
- **Font Weight:** Semi-bold (600) - easier to read from distance
- **Color:** White (#FFFFFF)
- **Background:** Charcoal (#0b1220)
- **Contrast Ratio:** 18.5:1 (WCAG AAA)
- **Text Alignment:** Center (both horizontal and vertical)
- **Padding:** 5% viewport on all sides (breathing room)
- **Shadow:** 0 2px 8px rgba(0,0,0,0.5) - improves readability on light projector backgrounds

**Content Overflow Handling:**

- **Preferred:** Auto-scale font size down (see above)
- **Fallback:** Show scrollable area (rare, only if text >500 chars despite limit)
- **Visual indicator:** Subtle gradient fade at bottom if content is scrollable

**Color Coding by Element Type (Optional):**

| Element Type | Border Color (Left) | Purpose |
|--------------|---------------------|---------|
| Speaking Phase | Green (#4CAF50) | Active speaking time |
| Transition | Orange (#FF9800) | Pause/reflection |
| Cooldown | Gray (#9E9E9E) | Winding down |
| Custom | Blue (#2196F3) | User-defined |

**Example with Color Border:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ┃                                                               │
│  ┃ (green)  Pause and reflect on what you just heard.           │
│  ┃                                                               │
└─────────────────────────────────────────────────────────────────┘
   ↑ 8px wide border
```

---

### 3. Timer Display

**Purpose:** Show remaining time for current element prominently

#### Desktop Timer (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                           08:32                                 │
│                    (huge, centered)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Typography:**

| Platform | Font Size | Font Weight | Notes |
|----------|-----------|-------------|-------|
| **Projector (≥1280px)** | 8rem (128px) | Bold (700) | Maximum readability |
| **Desktop (1024-1279px)** | 6rem (96px) | Bold (700) | Standard desktop |
| **Tablet (768-1023px)** | 4rem (64px) | Bold (700) | Propped-up tablet |
| **Mobile (<768px)** | 3rem (48px) | Bold (700) | Handheld |

**Visual Design:**

- **Font Family:** Segoe UI, -apple-system (monospace digits via `font-variant-numeric: tabular-nums`)
- **Color:** White (#FFFFFF)
- **Format:** MM:SS (e.g., "08:32", "00:05")
- **Leading Zeros:** Always present (08:32, not 8:32)
- **Text Alignment:** Center
- **Shadow:** 0 4px 12px rgba(0,0,0,0.6) - strong shadow for legibility

**Color Changes (Urgency Indicators):**

| Time Remaining | Color | Hex | Purpose |
|----------------|-------|-----|---------|
| >60 seconds | White | #FFFFFF | Normal state |
| 11-60 seconds | Yellow | #FFC107 | Approaching end |
| 1-10 seconds | Red | #DC143C | Urgent, about to finish |
| 0 seconds (completion) | Green | #4CAF50 | Completed (flash then advance) |

**Animation:**

- **Default:** Static (no animation, readability priority)
- **Last 10 seconds:** Pulsing scale animation (100% → 105% → 100%, duration: 1s)
- **Completion (0:00):** Flash green (200ms), then auto-advance to next element

**Progress Ring (Optional Enhancement):**

```
┌─────────────────────────────────────────────────────────────────┐
│                        ╭───────╮                                │
│                       ╱  08:32  ╲  ← Circular progress ring     │
│                      │           │                              │
│                       ╲         ╱                               │
│                        ╰───────╯                                │
└─────────────────────────────────────────────────────────────────┘
```

- **Type:** SVG circular progress ring around timer
- **Color:** Blue (#00D9FF)
- **Behavior:** Ring depletes clockwise as time counts down
- **Thickness:** 8px stroke
- **Radius:** 150px (desktop), 100px (mobile)

---

### 4. Control Buttons

**Purpose:** Provide essential session controls without cluttering the view

#### Desktop Controls (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  [⏸ Pause] [⏭ Next] [🔄 Reset] [⛶ Fullscreen]                  │
└─────────────────────────────────────────────────────────────────┘
```

**Button Specifications:**

| Button | Icon | Text | Keyboard | Action |
|--------|------|------|----------|--------|
| **Pause/Resume** | ⏸/▶ | Pause / Resume | Space | Toggle timer running state |
| **Next Element** | ⏭ | Next | N | Skip to next element (with confirmation if >10s) |
| **Reset Session** | 🔄 | Reset | R | Restart from Element 1 (with confirmation) |
| **Fullscreen** | ⛶ | Fullscreen | F | Toggle fullscreen mode |

**Button Style:**

- **Size:** 48×48px (mobile), 56×56px (desktop), 64×64px (projector)
- **Background:** Semi-transparent (#1a2332 with 80% opacity)
- **Border:** 2px solid #708090 (gray)
- **Text Color:** White (#FFFFFF)
- **Hover:** Background opacity increases to 100%, scale up 5%
- **Active (Pressed):** Scale down 95%
- **Font:** 1rem (16px) text + icon

**Layout:**

- **Desktop:** Horizontal row, center-aligned, 16px gap between buttons
- **Tablet:** 2×2 grid (Pause+Next top, Reset+Fullscreen bottom)
- **Mobile:** 2×2 grid, icons only (no text labels)

**Auto-Hide Behavior (Fullscreen):**

- **Default:** Controls hidden
- **On mouse movement:** Fade in controls at bottom edge (200ms)
- **After 2 seconds of no movement:** Fade out controls (500ms)
- **Persistent visibility:** Controls stay visible if hovered

**Disabled States:**

- **Next Button (on last element):** Disabled (gray, cursor: not-allowed)
- **Fullscreen (not supported):** Hidden (feature detection)

#### Mobile Controls (<768px)

```
┌─────────────────┐
│  [⏸] [⏭]       │
│  [🔄] [⛶]      │
│  (icons only)   │
└─────────────────┘
```

**Key Changes:**
- Icons only, no text labels
- Larger touch targets (56×56px)
- Always visible (no auto-hide)
- Positioned at bottom (sticky)

---

### 5. Phase Transition Overlay

**Purpose:** Provide visual/audio feedback when transitioning between elements

#### Transition Animation

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                    ╔═════════════════════════╗                  │
│                    ║                         ║                  │
│                    ║   Element 2 Complete!   ║                  │
│                    ║                         ║                  │
│                    ║   Next: Element 3       ║                  │
│                    ║   Transition (1:00)     ║                  │
│                    ║                         ║                  │
│                    ╚═════════════════════════╝                  │
│                                                                 │
│                    [Skip Transition →]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Sequence:**

1. **Element Completion (Timer reaches 0:00):**
   - Play audio chime (see Audio Cues section)
   - Timer flashes green (200ms)
   - Show "Element X Complete!" message (1 second)

2. **Transition Overlay (1 second):**
   - Fade out current focus text (300ms)
   - Show transition message:
     - "Next: Element Y"
     - Element type and duration
   - Optional: Show [Skip Transition →] button

3. **Load Next Element (auto, after 1 second):**
   - Fade in new focus text (300ms)
   - Reset timer to new element's duration
   - Start countdown automatically

**Visual Design:**

- **Background:** Semi-transparent overlay (#0b1220 with 90% opacity)
- **Text Color:** White (#FFFFFF)
- **Font:** 2rem (32px) for "Complete!", 1.5rem (24px) for "Next: ..."
- **Animation:** Fade in (300ms) → Hold (1s) → Fade out (300ms)

**Skip Transition Button:**

- **Label:** "Skip Transition →"
- **Action:** Immediately load next element (skip 1-second transition)
- **Keyboard:** Enter key
- **Style:** Secondary button (white border, transparent background)

---

### 6. Completion Screen

**Purpose:** Celebrate session completion, offer next actions

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                    ╔═════════════════════════╗                  │
│                    ║                         ║                  │
│                    ║  ✅ Session Complete!   ║                  │
│                    ║                         ║                  │
│                    ║  You completed a 13-    ║                  │
│                    ║  minute session with    ║                  │
│                    ║  5 elements.            ║                  │
│                    ║                         ║                  │
│                    ╚═════════════════════════╝                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Total Time: 13:05 (actual)                             │   │
│  │  Elements Completed: 5/5                                │   │
│  │  Sessions Today: 3                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [🔄 Restart Session]  [📝 New Session]  [🏠 Home]             │
│                                                                 │
│  Rate this session (optional):  ⭐⭐⭐⭐⭐                        │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**

- **Completion Message:**
  - Icon: ✅ (checkmark)
  - Text: "Session Complete!"
  - Font: 2.5rem (40px), bold
  - Color: Green (#4CAF50)

- **Summary Stats:**
  - Total time (planned vs. actual)
  - Elements completed
  - Session count today (or total)
  - Style: Card with light background (#1a2332), 1rem text

- **Action Buttons:**
  - **Restart Session:** Rerun same session from Element 1
  - **New Session:** Return to Session Builder
  - **Home:** Return to Custom Sessions landing page
  - Style: Primary buttons, 48px height

- **Feedback Survey (Optional, SC-2):**
  - Prompt: "Rate this session (optional):"
  - Input: 5-star rating (⭐⭐⭐⭐⭐)
  - Action: Submit to analytics (only if user consented)
  - Additional question: "How readable was the focus text?" (1-5 stars)

**Auto-Exit Fullscreen:**

- When session completes, exit fullscreen mode automatically
- Show completion screen in normal (non-fullscreen) mode
- Allows user to access navigation/browser controls easily

---

## Phase Transitions & Animations

### Audio Cues

**Purpose:** Provide non-visual feedback for phase transitions (accessibility + classroom use)

| Transition | Tone | Frequency | Duration | Use Case |
|------------|------|-----------|----------|----------|
| **Element Start (Speaking)** | High | 660 Hz | 1.6s | Energy, speaking begins |
| **Element Start (Transition)** | Low | 196 Hz | 1.6s | Grounding, pause begins |
| **Element Complete** | High | 660 Hz | 1.6s | Completion, move to next |
| **Session Complete** | Low | 196 Hz | 2.5s | Final, grounding closure |

**Implementation:** Web Audio API (see existing Couples Timer `playBellTone()` function)

**User Settings:**
- ☐ Play audio cues (default: OFF, user can enable in settings)
- Volume control: 0-100% (default: 70%)

### Visual Animations

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| **Focus text fade-in** | 300ms | ease-in | Element starts |
| **Focus text fade-out** | 300ms | ease-out | Element ends |
| **Timer color change** | 200ms | ease-in-out | <60s, <10s remaining |
| **Completion flash** | 200ms | ease-in-out | Timer reaches 0:00 |
| **Transition overlay** | 300ms + 1000ms + 300ms | ease-in-out | Between elements |
| **Control button hover** | 150ms | ease-in-out | Mouse hover |

**Performance Considerations:**

- Use CSS transitions for simple animations (color, opacity, scale)
- Use `will-change` property for frequently animated elements (timer text)
- Avoid layout thrashing (batch DOM updates)
- Target 60 FPS (consistent frame rate)

---

## Responsive Behavior

### Breakpoint-Specific Adjustments

| Breakpoint | Focus Text | Timer | Controls | Header | Notes |
|------------|------------|-------|----------|--------|-------|
| **xs (<640px)** | 1.5rem | 3rem | 2×2 grid, icons only | Compact | Mobile portrait |
| **sm (≥640px)** | 1.75rem | 3.5rem | 2×2 grid, small text | Compact | Mobile landscape |
| **md (≥768px)** | 2rem | 4rem | Horizontal row | Full text | Tablet |
| **lg (≥1024px)** | 3rem | 6rem | Horizontal row | Full text + auto-hide | Desktop |
| **xl (≥1280px)** | 4rem | 8rem | Horizontal row, larger | Full text + auto-hide | Projector |

### Orientation Handling (Mobile)

**Portrait Mode (default):**
- Vertical layout: Header → Focus Text → Timer → Controls
- Focus text: Up to 60% viewport height

**Landscape Mode:**
- Horizontal layout: Focus Text (left 60%) | Timer + Controls (right 40%)
- Focus text: Larger font (2rem vs 1.5rem)
- Controls: Vertical stack (4 buttons)

**Detection:**

```typescript
const isLandscape = window.innerWidth > window.innerHeight;
```

---

## Fullscreen Mode

### Desktop Fullscreen

**Trigger:**
- Click "Fullscreen" button
- Press F key
- Keyboard shortcut: Ctrl+F (custom, in addition to browser's F11)

**Behavior:**

1. **Enter Fullscreen:**
   - Hide browser chrome (address bar, tabs) via Fullscreen API
   - Hide app header (phase title fades to 20% opacity)
   - Hide controls (auto-hide on, show on hover)
   - Increase font sizes by 20%:
     - Focus text: 3rem → 3.6rem (4rem → 4.8rem on projector)
     - Timer: 6rem → 7.2rem (8rem → 9.6rem on projector)

2. **In Fullscreen:**
   - Mouse at top edge → Show header (phase title, exit button)
   - Mouse at bottom edge → Show controls (Pause, Next, Reset, Exit Fullscreen)
   - No mouse movement for 2 seconds → Hide header + controls
   - Keyboard shortcuts remain active (Space, R, F, N, Esc)

3. **Exit Fullscreen:**
   - Click "Exit Fullscreen" button
   - Press Esc or F key
   - Browser's F11 key
   - Action: Restore normal layout, font sizes, always-visible controls

**Projector Optimization:**

- Detect display resolution ≥1920×1080 → Assume projector mode
- Auto-increase font sizes to maximum (4rem focus text, 8rem timer)
- Auto-hide controls more aggressively (3 seconds idle instead of 2)
- Show "Projector Mode" indicator in header (first 5 seconds)

### Mobile Fullscreen

**Behavior:**

- Mobile browsers have limited Fullscreen API support
- Instead: Hide app header, maximize content area
- Controls remain visible (sticky at bottom)
- No auto-hide (touch interface needs persistent controls)

**iOS Safari Quirk:**

- Safari on iOS does not support true fullscreen
- Fallback: Use `<meta name="apple-mobile-web-app-capable" content="yes">` for standalone mode
- Prompt user to "Add to Home Screen" for best fullscreen experience

---

## Accessibility

### Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| **Space** | Pause/Resume | Timer running or paused |
| **R** | Reset | Show confirmation dialog |
| **F** | Fullscreen | Toggle fullscreen mode |
| **N** | Next element | Skip to next (with confirmation if >10s) |
| **Esc** | Exit | Pause + show exit confirmation |
| **Tab** | Navigate controls | Focus moves through buttons |
| **Enter** | Activate button | When control is focused |

**Focus Management:**

- On phase transition: Focus returns to "Pause" button (default control)
- On completion: Focus moves to "Restart Session" button
- In fullscreen: Focus indicator is highly visible (3px blue outline)

### Screen Reader Support

#### Live Regions

```html
<!-- Timer Countdown (announce every minute, not every second) -->
<div role="timer" aria-live="polite" aria-atomic="true">
  <span id="timer-value">8 minutes 32 seconds remaining</span>
</div>

<!-- Phase Transition Announcement -->
<div role="status" aria-live="assertive" aria-atomic="true">
  Element 2 complete. Starting Element 3: Transition, 1 minute.
</div>

<!-- Completion Announcement -->
<div role="status" aria-live="assertive">
  Session complete! You finished 5 elements in 13 minutes.
</div>
```

**Update Frequency:**

- **Timer:** Announce every 1 minute (not every second, to avoid spam)
- **Last 10 seconds:** Announce every 5 seconds ("5 seconds", "4 seconds", ...)
- **Phase Transition:** Announce immediately (assertive)
- **Completion:** Announce immediately (assertive)

#### ARIA Labels

```html
<!-- Control Buttons -->
<button aria-label="Pause session" aria-pressed="false">
  ⏸ Pause
</button>

<button aria-label="Skip to next element">
  ⏭ Next
</button>

<button aria-label="Reset session to beginning">
  🔄 Reset
</button>

<button aria-label="Toggle fullscreen mode" aria-pressed="false">
  ⛶ Fullscreen
</button>

<!-- Phase Header -->
<header role="banner">
  <h1 aria-label="Element 2 of 5: Transition phase">
    Element 2 of 5 - Transition
  </h1>
</header>

<!-- Focus Text -->
<div role="article" aria-label="Focus text for current phase">
  <p>Pause and reflect on what you just heard.</p>
</div>
```

### Visual Accessibility

**High Contrast Mode:**

- Detect Windows High Contrast Mode via CSS media query
- Increase border thickness (2px → 4px)
- Use solid colors (no gradients or transparency)
- Ensure text has 21:1 contrast ratio (beyond WCAG AAA)

**Color Blindness Support:**

- Timer color changes (white → yellow → red) also include:
  - Border change: none → 2px dashed → 4px solid
  - Icon change: ⏱️ → ⚠️ (last 10 seconds)
- Focus text color coding (optional) uses patterns in addition to colors

**Reduced Motion:**

- Detect `prefers-reduced-motion: reduce` media query
- Disable animations: fades, scales, transitions
- Use instant state changes instead (no easing)
- Keep essential feedback (color changes, audio cues)

---

## Visual Design

### Color Palette

| Element | Color (Hex) | Use |
|---------|-------------|-----|
| **Background** | #0b1220 | Page background (charcoal) |
| **Focus Text** | #FFFFFF | Primary text, high contrast |
| **Timer (Normal)** | #FFFFFF | Default timer color |
| **Timer (Warning)** | #FFC107 | 11-60 seconds remaining |
| **Timer (Urgent)** | #DC143C | 1-10 seconds remaining |
| **Timer (Complete)** | #4CAF50 | Flash on completion |
| **Header Text** | #FFFFFF @ 80% | Phase title (semi-transparent) |
| **Controls BG** | #1a2332 @ 80% | Button backgrounds |
| **Controls Border** | #708090 | Button outlines |
| **Completion Green** | #4CAF50 | Success messages |

### Typography

**Font Family:** Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif

| Element | Desktop | Projector | Mobile | Weight |
|---------|---------|-----------|--------|--------|
| **Focus Text** | 3rem (48px) | 4rem (64px) | 1.5rem (24px) | Semi-bold (600) |
| **Timer** | 6rem (96px) | 8rem (128px) | 3rem (48px) | Bold (700) |
| **Phase Title** | 1.5rem (24px) | 2.5rem (40px) | 1.25rem (20px) | Semi-bold (600) |
| **Button Text** | 1rem (16px) | 1.25rem (20px) | 0.875rem (14px) | Regular (400) |

**Line Height:**

- Focus text: 1.3 (tight, for readability)
- Timer: 1.0 (monospace, no extra spacing)
- Phase title: 1.2 (compact header)

### Spacing & Layout

**Golden Ratio Spacing (φ = 1.618):**

- **Vertical padding (focus zone):** 5vh (top and bottom)
- **Horizontal padding (focus text):** 10% viewport width
- **Control button gap:** 16px (1rem)
- **Section gaps:** 24px (1.5rem)

**Vertical Distribution (Desktop):**

```
┌─────────────────────────────────┐
│  Header (10vh)                  │ ← Phase title, progress
├─────────────────────────────────┤
│  Top spacer (5vh)               │ ← Breathing room
├─────────────────────────────────┤
│  Focus Text (40vh)              │ ← Main content
├─────────────────────────────────┤
│  Timer (20vh)                   │ ← Countdown display
├─────────────────────────────────┤
│  Bottom spacer (15vh)           │ ← Breathing room
├─────────────────────────────────┤
│  Controls (10vh)                │ ← Action buttons
└─────────────────────────────────┘
   Total: 100vh
```

### Shadows & Depth

| Element | Shadow | Use |
|---------|--------|-----|
| **Focus Text** | 0 2px 8px rgba(0,0,0,0.5) | Improves readability on light backgrounds |
| **Timer** | 0 4px 12px rgba(0,0,0,0.6) | Strong shadow for prominence |
| **Control Buttons** | 0 2px 4px rgba(0,0,0,0.3) | Subtle elevation |
| **Control Buttons (Hover)** | 0 4px 8px rgba(0,0,0,0.5) | Lifted on hover |

### Animations & Transitions

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| **Text fade in/out** | 300ms | ease-in-out | Phase transition |
| **Timer color change** | 200ms | ease-in-out | Warning/urgent state |
| **Control button hover** | 150ms | ease-in-out | Mouse hover |
| **Timer pulse (last 10s)** | 1000ms (loop) | ease-in-out | Countdown urgency |
| **Completion flash** | 200ms | ease-in | Timer reaches 0:00 |
| **Header fade (auto-hide)** | 500ms | ease-out | Inactivity timer |

---

## Edge Cases & Error States

### Network/Power Loss

**Scenario:** Browser crashes or computer loses power mid-session

**Behavior:**

1. On page reload:
   - Load session state from localStorage
   - Calculate elapsed time: `elapsed = Date.now() - startedAt`
   - Adjust remaining time: `remainingMs = savedRemainingMs - elapsed`
   - Set running = false (paused state, safety feature)
   - Show toast: "Session restored. Press Space to resume."

2. If elapsed time > remaining time:
   - Auto-advance to next element (or completion if last element)
   - Show toast: "Skipped to Element X (time elapsed while paused)"

### Timer Drift (Long Sessions)

**Scenario:** Browser tab in background for extended period (OS sleep, low power mode)

**Detection:**

```typescript
// Detect drift on each RAF update
const now = Date.now();
const expectedElapsed = now - startedAt;
const actualElapsed = savedElapsed + (now - lastUpdateTime);
const drift = Math.abs(expectedElapsed - actualElapsed);

if (drift > 2000) {  // >2 seconds drift
  console.warn('Timer drift detected:', drift, 'ms');
  // Adjust remainingMs based on Date.now()
  remainingMs = durationMs - (now - startedAt);
}
```

**Mitigation:**

- Use `Date.now()` for elapsed time (not cumulative RAF time)
- Adjust remaining time on every update (drift-resistant)
- Log drift events to analytics (SC-3 measurement)

### Audio Context Blocked (Mobile Safari)

**Scenario:** Mobile browsers block Web Audio API until user interaction

**Behavior:**

1. On first "Start Session" click:
   - Initialize AudioContext
   - Play silent tone (0 volume) to "unlock" audio
   - Log if audio context creation fails

2. If audio fails:
   - Disable audio cues (silent mode)
   - Show toast: "Audio cues disabled (browser restriction)"
   - Visual-only feedback for phase transitions

### Fullscreen API Not Supported

**Scenario:** Older browsers or mobile Safari (limited support)

**Detection:**

```typescript
const fullscreenSupported = document.fullscreenEnabled ||
                           document.webkitFullscreenEnabled;
```

**Behavior:**

- If not supported: Hide "Fullscreen" button
- Fallback: Maximize content area, hide app header
- Show tooltip: "True fullscreen not available on this browser"

### Long Focus Text (>500 characters)

**Scenario:** User enters maximum 500-character focus text

**Behavior:**

1. **Auto-scale font size:**
   - 500 chars → 60% of base size (e.g., 4rem → 2.4rem)
   - Still readable, prevents overflow

2. **Scrollable area (fallback):**
   - If text still overflows (very long words), enable scroll
   - Show visual indicator: Gradient fade at bottom
   - User can scroll with mouse/touch

3. **Line breaks:**
   - Preserve user's line breaks (from textarea)
   - Use `white-space: pre-wrap` CSS

---

## Implementation Notes

### Component Structure (React)

```
FocusView/
├── FocusViewContainer.tsx     (Main container, timer logic)
├── PhaseHeader.tsx            (Element count, progress dots)
├── FocusText.tsx              (Large focus text display)
├── TimerDisplay.tsx           (Countdown timer, color changes)
├── ControlBar.tsx             (Pause, Next, Reset, Fullscreen buttons)
├── TransitionOverlay.tsx      (Between-element transition)
├── CompletionScreen.tsx       (Session complete screen)
└── index.tsx                  (Route handler)
```

### State Management

```typescript
interface FocusViewState {
  sessionId: string;
  currentElementIndex: number;
  remainingMs: number;
  running: boolean;
  startedAt: number | null;
  phase: 'RUNNING' | 'PAUSED' | 'TRANSITION' | 'COMPLETED';
  fullscreen: boolean;
  audioEnabled: boolean;
}
```

### Timer Engine Integration

**Reuse existing timer logic from Couples Timer:**

```typescript
// RAF loop (60 FPS)
const sync = useCallback(() => {
  if (!state.running || !state.startedAt) return;

  const now = Date.now();
  const elapsed = now - state.startedAt;
  const remaining = state.remainingMs - elapsed;

  if (remaining <= 0) {
    // Element complete, advance to next
    advanceToNextElement();
  } else {
    // Update timer display
    forceUpdate();
  }
}, [state, advanceToNextElement]);

useRaf(state.running, sync);
```

**New logic for Custom Sessions:**

```typescript
function advanceToNextElement() {
  const nextIndex = state.currentElementIndex + 1;

  if (nextIndex >= session.elements.length) {
    // Session complete
    setState(prev => ({ ...prev, phase: 'COMPLETED', running: false }));
    playAudioChime('completion');
    return;
  }

  // Load next element
  const nextElement = session.elements[nextIndex];
  setState(prev => ({
    ...prev,
    currentElementIndex: nextIndex,
    remainingMs: nextElement.durationMs,
    running: true,
    startedAt: Date.now(),
    phase: 'TRANSITION'
  }));

  playAudioChime('transition');

  // Auto-resume after 1-second transition
  setTimeout(() => {
    setState(prev => ({ ...prev, phase: 'RUNNING' }));
  }, 1000);
}
```

---

## Testing Checklist

### Manual Tests (SC-2 Readability)

| Test | Pass Criteria | Notes |
|------|---------------|-------|
| **Projector @ 5m** | 50-char text readable | Standard classroom distance |
| **Projector @ 7m** | 150-char text readable | Back of medium classroom |
| **Projector @ 10m** | 300-char text readable | Large auditorium |
| **Mobile @ 30cm** | All text readable | Handheld mobile |
| **Tablet @ 1m** | All text readable | Propped up on desk |

### Automated Tests (SC-3 Reliability)

```typescript
// Timer drift test
test('Timer drift <1s over 30 minutes', () => {
  const session = createTestSession([
    { type: 'SPEAK', durationMs: 30 * 60 * 1000, focusText: 'Test' }
  ]);

  const startTime = Date.now();
  runSession(session);

  // Fast-forward 30 minutes
  jest.advanceTimersByTime(30 * 60 * 1000);

  const endTime = Date.now();
  const actualDuration = endTime - startTime;
  const expectedDuration = 30 * 60 * 1000;
  const drift = Math.abs(actualDuration - expectedDuration);

  expect(drift).toBeLessThan(1000); // <1 second drift
});

// Phase transition test
test('All elements complete without errors', () => {
  const session = createTestSession([
    { type: 'SPEAK', durationMs: 5000, focusText: 'Element 1' },
    { type: 'TRANSITION', durationMs: 1000, focusText: 'Element 2' },
    { type: 'SPEAK', durationMs: 5000, focusText: 'Element 3' }
  ]);

  const { result } = renderHook(() => useFocusView(session));

  // Fast-forward through all elements
  act(() => jest.advanceTimersByTime(11000)); // 5s + 1s + 5s

  expect(result.current.phase).toBe('COMPLETED');
  expect(result.current.currentElementIndex).toBe(2); // Last element
  expect(result.current.errors).toHaveLength(0);
});
```

---

## Next Steps (Task T2.1)

1. ✅ **Completed:** Focus View UX Concept (comprehensive text-based spec)
2. ⏭️ **Next:** Define Domain & Data Models (T2.1) - Phase 2 begins!
3. ⏭️ **After:** Specify API/Service Interfaces (T2.2), Design Extended Timer Engine (T2.3)

---

**Phase 1: Product & UX Specification - COMPLETE ✅**

All UX specifications are now documented:
- ✅ T1.1: User Journeys & Flows (6 flows)
- ✅ T1.2: User Stories (22 stories)
- ✅ T1.3: Session Builder UX (configuration interface)
- ✅ T1.4: Focus View UX (live session interface)

**Proceeding to Phase 2: Technical Architecture & Data Model**

---

**End of Document**
