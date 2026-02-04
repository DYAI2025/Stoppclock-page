# Swiss/Bauhaus Design System

**Stoppclock visual design language**

## Philosophy

**Function follows form.** Clean geometric layouts, asymmetric balance, limited visual elements, typography-driven hierarchy.

Inspired by Swiss/Bauhaus minimalism:
- Geometric grids
- Monochrome palette (with selective color)
- Modular scale spacing
- Strong typographic hierarchy
- Minimal ornamentation

---

## Design Tokens

All design tokens defined in `src/design-tokens.css`.

### Typography Scale (Modular: 1.5x ratio)

| Token | Size | Usage |
|-------|------|-------|
| `--type-xs` | 12px | Small labels, captions |
| `--type-sm` | 14px | Secondary text, preset buttons |
| `--type-base` | 16px | Body text, buttons |
| `--type-lg` | 24px | Large labels |
| `--type-xl` | 32px | Page titles (H1) |
| `--type-2xl` | 48px | Hero displays |
| `--type-3xl` | 64px | Large displays |
| `--type-4xl` | 96px | Timer displays (mobile) |
| `--type-5xl` | 128px | Timer displays (desktop) |

**Font stack:**
- Sans-serif: `-apple-system, "Helvetica Neue", "Segoe UI", Arial, sans-serif`
- Monospace: `"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace`

**Weights:** Regular (400), Medium (500), Bold (700)

### Spacing Scale (Typography-based)

| Token | Size | Usage |
|-------|------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | Small gaps |
| `--space-3` | 12px | Medium gaps |
| `--space-4` | 16px | **Base unit** - default padding |
| `--space-6` | 24px | Large gaps |
| `--space-8` | 32px | Section spacing |
| `--space-12` | 48px | Large section spacing |
| `--space-16` | 64px | Hero spacing |
| `--space-24` | 96px | Extra large spacing |

### Color Palette

#### Monochrome (Digital Timers)
- `--mono-black: #000000` - Primary buttons, text
- `--mono-gray-900: #1a1a1a` - Running state backgrounds
- `--mono-gray-800: #2d2d2d` - Button hover states
- `--mono-gray-700: #404040` - Secondary text
- `--mono-gray-600: #666666` - Muted text
- `--mono-gray-500: #808080` - Borders
- `--mono-gray-400: #999999` - Disabled states
- `--mono-gray-300: #cccccc` - Subtle borders
- `--mono-gray-200: #e0e0e0` - Secondary buttons
- `--mono-gray-100: #f5f5f5` - Light backgrounds
- `--mono-white: #ffffff` - Page backgrounds, inverted text

#### Semantic Colors (Minimal Usage)
- `--semantic-error: #d32f2f` - Error/expired states only
- `--semantic-warning: #f57c00` - Warning states only
- `--semantic-success: #388e3c` - Success/running states only

#### Analog Timer Colors (Preserved)
- `--analog-progress-start: #dc143c` (Crimson)
- `--analog-progress-mid: #f39c12` (Orange)
- `--analog-progress-end: #27ae60` (Green)
- `--analog-hand-primary: #2d2d2d` (Charcoal)
- `--analog-hand-second: #dc143c` (Red)
- `--analog-bg: #ffffff` (White clock face)
- `--analog-border: #36454f` (Charcoal border)

---

## Component Patterns

### Page Structure

All timer pages follow this structure:

```html
<div class="[timer]-page">
  <header class="[timer]-header">
    <h1 class="[timer]-title">Timer Name</h1>
    <HomeButton />
  </header>

  <div class="[timer]-display">
    <!-- Timer content -->
  </div>

  <div class="[timer]-controls">
    <!-- Buttons grid -->
  </div>

  <div class="[timer]-presets">
    <!-- Preset buttons (if applicable) -->
  </div>
</div>
```

### Button Styles

**Primary Actions** (Start/Pause):
- Background: `--mono-black`
- Text: `--mono-white`
- Hover: Lift 1px, subtle shadow
- Style: Uppercase, letter-spacing 0.05em

**Secondary Actions** (Reset, Fullscreen):
- Background: `--mono-gray-200`
- Text: `--mono-black`
- Hover: Darken to `--mono-gray-300`

**Preset Buttons**:
- Background: Transparent
- Border: 1px solid `--mono-gray-400`
- Hover: Invert (black background, white text)

### Timer Displays

**Countdown** (White background):
```css
background: var(--mono-gray-100);
font-size: var(--type-5xl);
font-family: var(--font-mono);
border: var(--border-medium) solid var(--mono-black);
```

**Stopwatch** (Inverted for distinction):
```css
background: var(--mono-black);
color: var(--mono-white);
font-size: var(--type-5xl);
font-family: var(--font-mono);
```

**Analog** (Preserves color):
```css
Canvas with white background
Colored progress arc (red→green)
Colored second hand (red)
```

---

## Design Principles

### 1. Monochrome First
Digital timers use pure black/white/grays. Color reserved for:
- Analog timer (design requirement)
- Critical semantic states (error, warning)

### 2. Typography Hierarchy
Size and weight create hierarchy, not color:
- Timer displays: 128px monospace, regular weight
- Page titles: 32px sans-serif, regular weight, uppercase
- Buttons: 16px sans-serif, medium weight, uppercase

### 3. Geometric Layouts
- Button grids: 3-4 columns, consistent gaps
- Cards: Square aspect ratios
- Spacing: Modular scale (4, 8, 16, 24, 32, 48, 64, 96px)

### 4. Minimal Ornamentation
- Borders: Solid, 1-2px thick
- Shadows: Subtle, only on hover/elevation
- Radius: 0px (sharp corners)
- Transitions: Fast (100-200ms), functional

### 5. Visual Consistency
All 3 core timers share:
- Same header structure
- Same button styles
- Same spacing system
- Same typography scale

Distinction through:
- Stopwatch: Inverted display colors
- Analog: Colored clock face
- Countdown: Light gray display background

---

## Usage Guidelines

### DO
✅ Use monochrome palette for digital timers
✅ Use modular spacing scale (4, 8, 16, 24...)
✅ Use uppercase for titles and buttons
✅ Use monospace for timer displays
✅ Use geometric grids for layouts
✅ Keep transitions subtle and fast

### DON'T
❌ Add colors to digital timers (countdown, stopwatch)
❌ Use arbitrary spacing (stick to scale)
❌ Mix font weights excessively
❌ Add shadows everywhere
❌ Use rounded corners (sharp corners only)
❌ Add decorative elements

---

## File Organization

```
src/
├── design-tokens.css          # All design tokens
├── styles.css                 # Global base styles
└── styles/
    ├── countdown-swiss.css    # Countdown timer styles
    ├── stopwatch-swiss.css    # Stopwatch timer styles
    ├── analog-swiss.css       # Analog timer styles
    └── home-swiss.css         # Home page styles
```

---

## Future Extensions

When applying this system to remaining timers:

1. **Chess Clock**: Use monochrome with semantic colors for time pressure
2. **Metronome**: Monochrome with subtle animation
3. **World Clock**: Monochrome grid of time zones
4. **Alarm**: Monochrome with semantic color for ringing state
5. **Cycle Timer**: Monochrome with progress bar

Maintain visual family while allowing functional distinction.
