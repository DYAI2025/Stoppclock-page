# Design Requirements: Modern Minimalist Theme
**Version**: 2.0
**Date**: 2025-10-20
**Status**: Approved by User

---

## Color Scheme: Modern Minimalist

A clean and contemporary theme with a sophisticated grayscale palette for maximum versatility.

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Charcoal** | `#36454F` | Primary backgrounds, dark surfaces |
| **Slate Gray** | `#708090` | Secondary backgrounds, borders |
| **Light Gray** | `#D3D3D3` | Light surfaces, disabled states |
| **White** | `#FFFFFF` | Text, icons, highlights |

### Accent Colors (Exceptions)

| Element | Color | Hex Code | Rationale |
|---------|-------|----------|-----------|
| **Home Button** | Blue | `#58a6ff` (current) | Navigation consistency - KEEP AS IS |
| **Start/Stop Button** | Strong Red | `#DC143C` (Crimson) | High visibility, action clarity |

### Typography

| Element | Font Family | Weight | Usage |
|---------|-------------|--------|-------|
| **Headers** | DejaVu Sans | Bold | Timer titles, headings |
| **Body Text** | DejaVu Sans | Regular | All body text, labels, buttons |

---

## Button System

### 1. Primary Action Button (Red Start/Stop)

**Appearance**:
- **Size**: Significantly larger than other buttons (min-height: 80px, padding: 20px 40px)
- **Color**: Strong Red (`#DC143C` - Crimson)
- **Font**: DejaVu Sans Bold
- **Border**: None or minimal (2px solid darker red)
- **Border-radius**: 12px
- **Shadow**: Prominent shadow for depth (0 4px 12px rgba(220, 20, 60, 0.4))

**Behavior - Start/Stop Timers**:

| Timer Type | Inactive State | Active State |
|------------|----------------|--------------|
| **Countdown** | Label: "Start" | Label: "Stop" |
| **Stopwatch** | Label: "Start" | Label: "Stop" |
| **Analog Countdown** | Label: "Start" | Label: "Stop" |
| **Cycle Timer** | Label: "Start" | Label: "Stop" |
| **Metronome** | Label: "Start" | Label: "Stop" |

**Behavior - Other Timers**:

| Timer Type | Button Label | Function |
|------------|--------------|----------|
| **Alarm Clock** | "Add Alarm" | Opens alarm creation dialog |
| **World Clock** | "Add Timezone" | Opens timezone picker |
| **Chess Clock** | *No red button* | Uses player areas instead |

**Visual States**:
- **Inactive (Start)**: Red background, white text, "Start" label
- **Active (Stop)**: Darker red background (`#B22222`), white text, "Stop" label
- **Hover**: Lift effect (translateY(-3px)) + stronger shadow
- **Active (pressed)**: Slight scale (transform: scale(0.98))

---

### 2. Home Button (Exception - Keep Blue)

**Appearance**:
- **Position**: Fixed top-left on ALL pages
- **Color**: Blue (`#58a6ff`) - UNCHANGED
- **Size**: min-height: 56px
- **Icon**: ⌂ (House symbol)
- **Mobile**: Icon only (<500px width)

**Rationale**: Blue provides visual distinction from action buttons, consistent navigation anchor.

---

### 3. Secondary Buttons

**Appearance**:
- **Background**: Transparent or Light Gray (`#D3D3D3`)
- **Border**: 2px solid Slate Gray (`#708090`)
- **Text**: Charcoal (`#36454F`)
- **Size**: min-height: 56px
- **Examples**: Reset, +1m, -1m, Fullscreen, Settings

---

### 4. Configuration Buttons (Presets)

**Appearance**:
- **Background**: Light Gray (`#D3D3D3`) with low opacity (rgba(211, 211, 211, 0.2))
- **Border**: 1px solid Slate Gray (`#708090`)
- **Text**: White (`#FFFFFF`)
- **Size**: min-height: 40px (smaller than action buttons)
- **Examples**: 5m, 10m, 15m, 30m presets

---

## Chess Clock Special Requirements

### Layout
- **Vertical split**: Player 1 top, Player 2 bottom
- **No red Start/Stop button**
- **Full-width clickable areas** for each player

### Colors

| Element | Color | Hex Code |
|---------|-------|----------|
| **Player 1 Area** | Charcoal | `#36454F` |
| **Player 2 Area** | Slate Gray | `#708090` |
| **Chess Piece Icons** | Black & White | `#000000` / `#FFFFFF` (unchanged) |
| **Active Player Glow** | White | `rgba(255, 255, 255, 0.3)` box-shadow |

### Visual Feedback on Press

**Requirements**:
- **Visual feedback must be noticeable even without sound**
- **Feedback type**: Combination of scale, shadow, and glow

**Player Area Press States**:

1. **Inactive State**:
   - Normal background color (Charcoal or Slate Gray)
   - Subtle border: 2px solid rgba(255, 255, 255, 0.1)
   - Opacity: 0.7

2. **Active State** (player's timer is running):
   - Full brightness (opacity: 1.0)
   - Glowing border: 4px solid `#FFFFFF`
   - Box-shadow: inset 0 0 40px rgba(255, 255, 255, 0.2)
   - Pulsing animation (optional): subtle scale 1.0 → 1.01 over 2s

3. **Press Feedback** (on click):
   - Instant scale: transform: scale(0.98) (200ms transition)
   - Flash effect: Brief white overlay (opacity 0.1 → 0, 300ms)
   - Ripple effect from tap point (optional enhancement)

**Example CSS**:
```css
.chess-player.active:active {
  transform: scale(0.98);
  box-shadow: inset 0 0 60px rgba(255, 255, 255, 0.3);
}
```

---

## Global Application

### All Pages Must Follow Modern Minimalist Scheme

**Backgrounds**:
- **Main background**: Charcoal (`#36454F`)
- **Card/surface backgrounds**: Slate Gray (`#708090`) or rgba variation
- **Overlays/modals**: Charcoal with opacity

**Text**:
- **Primary text**: White (`#FFFFFF`)
- **Secondary text**: Light Gray (`#D3D3D3`)
- **Disabled text**: Slate Gray (`#708090`)

**Borders/Dividers**:
- **Standard borders**: Slate Gray (`#708090`)
- **Subtle dividers**: rgba(112, 128, 144, 0.3)

**Timer Displays** (large numbers):
- **Color**: White (`#FFFFFF`)
- **Font**: DejaVu Sans Bold (if available) or system sans-serif bold
- **Size**: clamp(80px, 18vw, 180px) for main displays

---

## Implementation Priorities

### Phase 1: Color Scheme Migration ✅ APPROVED
1. Update CSS `:root` with Modern Minimalist tokens
2. Replace all backgrounds (Charcoal, Slate Gray, Light Gray, White)
3. Update text colors (white primary, light gray secondary)

### Phase 2: Red Start/Stop Button ✅ APPROVED
1. Create `.btn-primary-action` class (large red button)
2. Apply to all start/stop timers (Countdown, Stopwatch, Analog, Cycle, Metronome)
3. Implement label toggle logic ("Start" ↔ "Stop")
4. Apply custom labels to Alarm ("Add Alarm") and World Clock ("Add Timezone")

### Phase 3: Chess Clock Redesign ✅ APPROVED
1. Update player area colors (Charcoal / Slate Gray)
2. Implement visual press feedback (scale + flash)
3. Add active state glow (white border + box-shadow)
4. Keep chess piece icons black & white

### Phase 4: Typography Update 🔄 OPTIONAL
1. Load DejaVu Sans font (if not using system fonts)
2. Apply to headers (bold) and body text (regular)
3. Update font-weight tokens

---

## Examples & Mockups

### Countdown Timer

```
┌──────────────────────────────────────┐
│ [Home (Blue)]                        │ ← Fixed top-left
├──────────────────────────────────────┤
│                                      │
│         00:05:00                     │ ← White text on Charcoal bg
│                                      │
│    ┌──────────────────────┐         │
│    │      START           │         │ ← Large red button (inactive)
│    └──────────────────────┘         │
│                                      │
│  [Reset] [+1m] [-1m] [Fullscreen]  │ ← Secondary buttons (gray)
│                                      │
├──────────────────────────────────────┤
│ [5m][10m][15m][30m][45m][1h][2h]   │ ← Config buttons (light gray)
└──────────────────────────────────────┘
```

### Chess Clock (Vertical)

```
┌──────────────────────────────────────┐
│ [Home (Blue)]                        │ ← Fixed top-left
├──────────────────────────────────────┤
│                                      │
│ ╔════════════════════════════════╗  │
│ ║  ♔  Player 1    05:00          ║  │ ← Charcoal (#36454F)
│ ║  (ACTIVE - glowing border)     ║  │   Active: white glow
│ ╚════════════════════════════════╝  │
│                                      │
│          [Reset] [Settings]          │ ← Neutral zone
│                                      │
│ ╔════════════════════════════════╗  │
│ ║  ♚  Player 2    05:00          ║  │ ← Slate Gray (#708090)
│ ║  (inactive - dimmed)           ║  │   Inactive: 70% opacity
│ ╚════════════════════════════════╝  │
└──────────────────────────────────────┘
```

---

## Font Loading (Optional Enhancement)

**DejaVu Sans** is not a system font on most devices. Options:

1. **Use system sans-serif** (recommended for performance):
   - Font stack: `system-ui, -apple-system, Segoe UI, Roboto, sans-serif`
   - Sacrifice exact font match for speed

2. **Load DejaVu Sans from CDN**:
   - Add `<link>` to Google Fonts or self-host
   - ~100KB overhead
   - Exact design match

**Recommendation**: Use system fonts initially, add DejaVu Sans if branding requires exact match.

---

## Success Criteria

### Visual Consistency
- [ ] All pages use Charcoal/Slate Gray/Light Gray/White palette
- [ ] Home button is blue on every page (top-left)
- [ ] Red Start/Stop button is prominent and consistent
- [ ] Chess Clock uses Charcoal/Slate Gray split

### User Experience
- [ ] Red button instantly recognizable as primary action
- [ ] "Start" ↔ "Stop" label changes are clear
- [ ] Chess Clock press feedback is noticeable without sound
- [ ] All text is readable (WCAG AA contrast: 4.5:1 minimum)

### Technical Quality
- [ ] Build succeeds with no errors
- [ ] CSS file size remains under 25 KB (gzipped < 6 KB)
- [ ] No hardcoded colors outside CSS variables
- [ ] Mobile responsive (320px - 2560px)

---

## Notes

- **Button PNGs**: User will replace timer button icons later (not part of this phase)
- **Sound**: Chess Clock must work well with sound disabled (visual feedback critical)
- **Accessibility**: White text on Charcoal (#36454F) = ~12:1 contrast ratio ✓ (exceeds WCAG AAA)

---

*Design spec approved by user: 2025-10-20*
*Implementation priority: Immediate (replace current Batch 2 work)*
