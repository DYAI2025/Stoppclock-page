# Swiss/Bauhaus Minimalism Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign 3 core timers (Digital Countdown, Stopwatch, Analog Countdown) with Swiss/Bauhaus minimalist principles for visual consistency.

**Architecture:** Create modular scale design token system (typography-based spacing), apply minimal/monochrome palette to digital timers, preserve color distinction for analog timer, validate with E2E tests.

**Tech Stack:** TypeScript, React 18, CSS custom properties (design tokens), Playwright (E2E validation)

---

## Task 1: Create Design Token System

**Files:**
- Create: `src/design-tokens.css`
- Modify: `src/styles.css:1-100` (import tokens at top)
- Modify: `index.html` (link design tokens before main styles)

**Step 1: Create design tokens file with Swiss/Bauhaus system**

Create `src/design-tokens.css`:

```css
/* ============================================
 * SWISS/BAUHAUS DESIGN TOKENS
 * Modular scale typography-based system
 * ============================================ */

:root {
  /* ============================================
   * TYPOGRAPHY SCALE (Modular Scale: 1.5x ratio)
   * Base: 1rem (16px)
   * ============================================ */
  --type-xs: 0.75rem;      /* 12px - Small labels */
  --type-sm: 0.875rem;     /* 14px - Secondary text */
  --type-base: 1rem;       /* 16px - Body text */
  --type-lg: 1.5rem;       /* 24px - H3, large labels */
  --type-xl: 2rem;         /* 32px - H2, section headers */
  --type-2xl: 3rem;        /* 48px - H1, page titles */
  --type-3xl: 4rem;        /* 64px - Hero displays */
  --type-4xl: 6rem;        /* 96px - Timer displays */
  --type-5xl: 8rem;        /* 128px - Large timer displays */

  /* ============================================
   * SPACING SCALE (Modular: derived from type)
   * ============================================ */
  --space-1: 0.25rem;      /* 4px */
  --space-2: 0.5rem;       /* 8px */
  --space-3: 0.75rem;      /* 12px */
  --space-4: 1rem;         /* 16px - Base unit */
  --space-6: 1.5rem;       /* 24px */
  --space-8: 2rem;         /* 32px */
  --space-12: 3rem;        /* 48px */
  --space-16: 4rem;        /* 64px */
  --space-24: 6rem;        /* 96px */

  /* ============================================
   * MONOCHROME PALETTE (Minimal)
   * Pure black/white/grays for digital timers
   * ============================================ */
  --mono-black: #000000;
  --mono-gray-900: #1a1a1a;
  --mono-gray-800: #2d2d2d;
  --mono-gray-700: #404040;
  --mono-gray-600: #666666;
  --mono-gray-500: #808080;
  --mono-gray-400: #999999;
  --mono-gray-300: #cccccc;
  --mono-gray-200: #e0e0e0;
  --mono-gray-100: #f5f5f5;
  --mono-white: #ffffff;

  /* ============================================
   * SEMANTIC COLORS (Minimal usage)
   * Only for critical states
   * ============================================ */
  --semantic-error: #d32f2f;      /* Red - Error/expired state */
  --semantic-warning: #f57c00;    /* Orange - Warning state */
  --semantic-success: #388e3c;    /* Green - Success/running */

  /* ============================================
   * ANALOG TIMER ACCENT COLORS
   * Preserved for visual distinction
   * ============================================ */
  --analog-progress-start: #dc143c;   /* Crimson red (low time) */
  --analog-progress-mid: #f39c12;     /* Orange (medium time) */
  --analog-progress-end: #27ae60;     /* Green (high time) */
  --analog-hand-primary: #2d2d2d;     /* Charcoal hands */
  --analog-hand-second: #dc143c;      /* Red second hand */
  --analog-bg: #ffffff;               /* White clock face */
  --analog-border: #36454f;           /* Charcoal border */

  /* ============================================
   * TYPOGRAPHY SYSTEM
   * Helvetica-inspired (use system fonts)
   * ============================================ */
  --font-sans: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;

  /* Font weights (limited to 2-3) */
  --font-regular: 400;
  --font-medium: 500;
  --font-bold: 700;

  /* Line heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* ============================================
   * LAYOUT SYSTEM
   * Grid and spacing patterns
   * ============================================ */
  --container-max: 64rem;          /* 1024px max width */
  --container-padding: var(--space-4);

  /* Border radius (minimal) */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;

  /* Border widths */
  --border-thin: 1px;
  --border-medium: 2px;
  --border-thick: 4px;

  /* ============================================
   * SHADOWS (Subtle, geometric)
   * ============================================ */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);

  /* ============================================
   * TRANSITIONS (Subtle, functional)
   * ============================================ */
  --transition-fast: 100ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* ============================================
   * Z-INDEX SCALE
   * Layering system
   * ============================================ */
  --z-base: 0;
  --z-elevated: 10;
  --z-modal: 100;
  --z-toast: 1000;
}
```

**Step 2: Link design tokens in index.html**

Modify `index.html` to add design tokens before main styles:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/icons/icon-192.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Stoppclock</title>

  <!-- Design Tokens (Swiss/Bauhaus system) -->
  <link rel="stylesheet" href="/src/design-tokens.css" />
</head>
```

**Step 3: Import design tokens in styles.css**

Add at top of `src/styles.css`:

```css
/* ============================================
 * IMPORT DESIGN TOKENS
 * Swiss/Bauhaus modular scale system
 * ============================================ */
@import './design-tokens.css';

/* Existing Modern Minimalist theme below... */
```

**Step 4: Verify design tokens are loaded**

Run: `npm run dev`

Expected:
- Dev server starts successfully
- Open browser DevTools → Elements → :root
- Verify CSS custom properties exist (--type-base, --space-4, --mono-white, etc.)

**Step 5: Commit design token system**

```bash
git add src/design-tokens.css src/styles.css index.html
git commit -m "feat: add Swiss/Bauhaus design token system

- Modular scale typography (1.5x ratio)
- Typography-based spacing system
- Monochrome palette for digital timers
- Analog timer accent colors preserved
- Helvetica-inspired font stack
- Minimal shadows and borders

Design principle: Function follows form"
```

---

## Task 2: Redesign Digital Countdown Timer

**Files:**
- Modify: `src/pages/Countdown.tsx:84-250` (entire component JSX)
- Create: `src/styles/countdown-swiss.css`
- Modify: `src/styles.css` (import countdown styles)

**Step 1: Create Swiss/Bauhaus countdown styles**

Create `src/styles/countdown-swiss.css`:

```css
/* ============================================
 * COUNTDOWN TIMER - Swiss/Bauhaus Minimal
 * ============================================ */

.countdown-page {
  min-height: 100vh;
  background: var(--mono-white);
  color: var(--mono-black);
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8);
}

/* Header (minimal) */
.countdown-header {
  width: 100%;
  max-width: var(--container-max);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-12);
  padding-bottom: var(--space-4);
  border-bottom: var(--border-thin) solid var(--mono-gray-300);
}

.countdown-title {
  font-size: var(--type-xl);
  font-weight: var(--font-regular);
  letter-spacing: -0.02em;
  margin: 0;
  text-transform: uppercase;
}

/* Timer display (dominant element) */
.countdown-display {
  font-size: var(--type-5xl);
  font-weight: var(--font-regular);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  margin: var(--space-16) 0;
  padding: var(--space-8);
  background: var(--mono-gray-100);
  border: var(--border-medium) solid var(--mono-black);
  min-width: 600px;
  text-align: center;
  transition: background var(--transition-base);
}

.countdown-display.running {
  background: var(--mono-white);
}

.countdown-display.expired {
  background: var(--mono-black);
  color: var(--mono-white);
  border-color: var(--semantic-error);
}

/* Controls (geometric grid) */
.countdown-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  max-width: 600px;
  width: 100%;
  margin-bottom: var(--space-8);
}

.countdown-btn {
  font-family: var(--font-sans);
  font-size: var(--type-base);
  font-weight: var(--font-medium);
  padding: var(--space-4) var(--space-6);
  background: var(--mono-black);
  color: var(--mono-white);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.countdown-btn:hover {
  background: var(--mono-gray-800);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.countdown-btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.countdown-btn.secondary {
  background: var(--mono-gray-200);
  color: var(--mono-black);
}

.countdown-btn.secondary:hover {
  background: var(--mono-gray-300);
}

/* Presets (minimal buttons) */
.countdown-presets {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: var(--space-8);
}

.countdown-preset {
  font-family: var(--font-sans);
  font-size: var(--type-sm);
  font-weight: var(--font-regular);
  padding: var(--space-2) var(--space-4);
  background: transparent;
  color: var(--mono-gray-600);
  border: var(--border-thin) solid var(--mono-gray-400);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.countdown-preset:hover {
  background: var(--mono-black);
  color: var(--mono-white);
  border-color: var(--mono-black);
}

/* Settings (minimal checkboxes) */
.countdown-settings {
  display: flex;
  gap: var(--space-6);
  font-size: var(--type-sm);
  color: var(--mono-gray-700);
}

.countdown-settings label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .countdown-display {
    font-size: var(--type-4xl);
    min-width: auto;
    width: 100%;
  }

  .countdown-controls {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Import countdown styles in main CSS**

Add to `src/styles.css` after design tokens import:

```css
@import './design-tokens.css';
@import './styles/countdown-swiss.css';
```

**Step 3: Update Countdown.tsx component structure**

Replace the return JSX in `src/pages/Countdown.tsx` (starting around line 150):

```tsx
return (
  <div className="countdown-page" ref={wrapRef}>
    {/* Header */}
    <header className="countdown-header">
      <h1 className="countdown-title">Countdown</h1>
      <HomeButton />
    </header>

    {/* Timer Display */}
    <div
      className={`countdown-display ${st.running ? 'running' : ''} ${st.remainingMs === 0 ? 'expired' : ''}`}
    >
      {fmt(st.remainingMs)}
    </div>

    {/* Controls */}
    <div className="countdown-controls">
      {!st.running ? (
        <button className="countdown-btn" onClick={start}>
          Start
        </button>
      ) : (
        <button className="countdown-btn" onClick={pause}>
          Pause
        </button>
      )}
      <button className="countdown-btn secondary" onClick={reset}>
        Reset
      </button>
      <button className="countdown-btn secondary" onClick={full}>
        Fullscreen
      </button>
    </div>

    {/* Presets */}
    <div className="countdown-presets">
      <button className="countdown-preset" onClick={() => plus(60_000)}>+1m</button>
      <button className="countdown-preset" onClick={() => plus(300_000)}>+5m</button>
      <button className="countdown-preset" onClick={() => plus(600_000)}>+10m</button>
      <button className="countdown-preset" onClick={() => plus(-60_000)}>-1m</button>
    </div>

    {/* Settings */}
    <div className="countdown-settings">
      <label>
        <input
          type="checkbox"
          checked={st.signal.sound}
          onChange={(e) => setSt(s => ({ ...s, signal: { ...s.signal, sound: e.target.checked } }))}
        />
        Sound
      </label>
      <label>
        <input
          type="checkbox"
          checked={st.signal.flash}
          onChange={(e) => setSt(s => ({ ...s, signal: { ...s.signal, flash: e.target.checked } }))}
        />
        Flash
      </label>
    </div>
  </div>
);
```

**Step 4: Create countdown styles directory**

Run:
```bash
mkdir -p src/styles
mv src/styles/countdown-swiss.css src/styles/countdown-swiss.css 2>/dev/null || true
```

Expected: Directory created, file in correct location

**Step 5: Test countdown timer visually**

Run: `npm run dev`

Open: http://localhost:5173/#/countdown

Verify:
- White background, black text (monochrome)
- Large monospace timer display (128px font)
- Geometric button grid layout
- Minimal preset buttons with borders
- Clean typography hierarchy
- No golden ratio styling (replaced with modular scale)

**Step 6: Commit countdown redesign**

```bash
git add src/pages/Countdown.tsx src/styles/countdown-swiss.css src/styles.css
git commit -m "feat: redesign countdown timer with Swiss/Bauhaus minimalism

- Monochrome palette (black/white/grays)
- Modular scale typography (128px timer display)
- Geometric button grid layout
- Minimal preset buttons
- Clean sans-serif typography
- Removed golden ratio styling

Visual consistency: Step 1/3 complete"
```

---

## Task 3: Redesign Stopwatch Timer

**Files:**
- Modify: `src/pages/Stopwatch.tsx:146-250` (entire component JSX)
- Create: `src/styles/stopwatch-swiss.css`
- Modify: `src/styles.css` (import stopwatch styles)

**Step 1: Create Swiss/Bauhaus stopwatch styles**

Create `src/styles/stopwatch-swiss.css`:

```css
/* ============================================
 * STOPWATCH - Swiss/Bauhaus Minimal
 * Matches Countdown design language
 * ============================================ */

.stopwatch-page {
  min-height: 100vh;
  background: var(--mono-white);
  color: var(--mono-black);
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8);
}

/* Header (consistent with countdown) */
.stopwatch-header {
  width: 100%;
  max-width: var(--container-max);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-12);
  padding-bottom: var(--space-4);
  border-bottom: var(--border-thin) solid var(--mono-gray-300);
}

.stopwatch-title {
  font-size: var(--type-xl);
  font-weight: var(--font-regular);
  letter-spacing: -0.02em;
  margin: 0;
  text-transform: uppercase;
}

/* Timer display (inverted from countdown for distinction) */
.stopwatch-display {
  font-size: var(--type-5xl);
  font-weight: var(--font-regular);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  margin: var(--space-16) 0;
  padding: var(--space-8);
  background: var(--mono-black);
  color: var(--mono-white);
  border: var(--border-medium) solid var(--mono-black);
  min-width: 700px;
  text-align: center;
  transition: background var(--transition-base);
}

.stopwatch-display.running {
  background: var(--mono-gray-900);
}

/* Controls (geometric grid - consistent) */
.stopwatch-controls {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  max-width: 700px;
  width: 100%;
  margin-bottom: var(--space-12);
}

.stopwatch-btn {
  font-family: var(--font-sans);
  font-size: var(--type-base);
  font-weight: var(--font-medium);
  padding: var(--space-4) var(--space-6);
  background: var(--mono-black);
  color: var(--mono-white);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stopwatch-btn:hover {
  background: var(--mono-gray-800);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.stopwatch-btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.stopwatch-btn.secondary {
  background: var(--mono-gray-200);
  color: var(--mono-black);
}

.stopwatch-btn.secondary:hover {
  background: var(--mono-gray-300);
}

/* Lap times (minimal table) */
.stopwatch-laps {
  width: 100%;
  max-width: 700px;
  margin-top: var(--space-8);
}

.stopwatch-laps-title {
  font-size: var(--type-base);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
  color: var(--mono-gray-700);
}

.stopwatch-laps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stopwatch-lap-item {
  display: grid;
  grid-template-columns: 60px 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-bottom: var(--border-thin) solid var(--mono-gray-200);
  font-family: var(--font-mono);
  font-size: var(--type-sm);
}

.stopwatch-lap-item:hover {
  background: var(--mono-gray-100);
}

.stopwatch-lap-number {
  font-weight: var(--font-bold);
  color: var(--mono-gray-600);
}

.stopwatch-lap-time,
.stopwatch-lap-total {
  text-align: right;
  color: var(--mono-gray-800);
}

/* Responsive */
@media (max-width: 768px) {
  .stopwatch-display {
    font-size: var(--type-4xl);
    min-width: auto;
    width: 100%;
  }

  .stopwatch-controls {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

**Step 2: Import stopwatch styles**

Add to `src/styles.css`:

```css
@import './design-tokens.css';
@import './styles/countdown-swiss.css';
@import './styles/stopwatch-swiss.css';
```

**Step 3: Update Stopwatch.tsx component structure**

Replace the return JSX in `src/pages/Stopwatch.tsx` (starting around line 146):

```tsx
// Calculate lap differences
const lapDiffs = st.laps.map((lapTime, idx) => {
  const prevTime = idx === 0 ? 0 : st.laps[idx - 1];
  return lapTime - prevTime;
});

return (
  <div className="stopwatch-page" ref={wrapRef}>
    {/* Header */}
    <header className="stopwatch-header">
      <h1 className="stopwatch-title">Stopwatch</h1>
      <HomeButton />
    </header>

    {/* Timer Display (inverted colors) */}
    <div className={`stopwatch-display ${st.running ? 'running' : ''}`}>
      {fmt(currentTime)}
    </div>

    {/* Controls */}
    <div className="stopwatch-controls">
      {!st.running ? (
        <button className="stopwatch-btn" onClick={start}>
          Start
        </button>
      ) : (
        <button className="stopwatch-btn" onClick={pause}>
          Pause
        </button>
      )}
      <button
        className="stopwatch-btn secondary"
        onClick={addLap}
        disabled={!st.running}
      >
        Lap
      </button>
      <button className="stopwatch-btn secondary" onClick={reset}>
        Reset
      </button>
      <button className="stopwatch-btn secondary" onClick={full}>
        Fullscreen
      </button>
    </div>

    {/* Lap Times */}
    {st.laps.length > 0 && (
      <div className="stopwatch-laps">
        <h2 className="stopwatch-laps-title">Lap Times</h2>
        <ul className="stopwatch-laps-list">
          {st.laps.map((lapTime, idx) => (
            <li key={idx} className="stopwatch-lap-item">
              <span className="stopwatch-lap-number">#{idx + 1}</span>
              <span className="stopwatch-lap-time">{fmt(lapDiffs[idx])}</span>
              <span className="stopwatch-lap-total">{fmt(lapTime)}</span>
            </li>
          )).reverse()}
        </ul>
      </div>
    )}
  </div>
);
```

**Step 4: Test stopwatch timer visually**

Run: `npm run dev`

Open: http://localhost:5173/#/stopwatch

Verify:
- White background, black text
- **Inverted timer display** (black background, white text) for distinction
- Same geometric button grid as countdown
- Minimal lap times table
- Consistent typography with countdown
- Visual family resemblance while being distinct

**Step 5: Commit stopwatch redesign**

```bash
git add src/pages/Stopwatch.tsx src/styles/stopwatch-swiss.css src/styles.css
git commit -m "feat: redesign stopwatch with Swiss/Bauhaus minimalism

- Monochrome palette matching countdown
- Inverted timer display (black bg) for distinction
- Geometric button grid (4 columns)
- Minimal lap times table
- Consistent typography system
- Visual family with countdown

Visual consistency: Step 2/3 complete"
```

---

## Task 4: Refine Analog Countdown (Preserve Color Distinction)

**Files:**
- Modify: `src/pages/AnalogCountdown.tsx:200-350` (canvas drawing code)
- Create: `src/styles/analog-swiss.css`
- Modify: `src/styles.css` (import analog styles)

**Step 1: Create Swiss/Bauhaus analog styles**

Create `src/styles/analog-swiss.css`:

```css
/* ============================================
 * ANALOG COUNTDOWN - Swiss/Bauhaus
 * Preserves color for visual distinction
 * ============================================ */

.analog-page {
  min-height: 100vh;
  background: var(--mono-gray-100);
  color: var(--mono-black);
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8);
}

/* Header (consistent) */
.analog-header {
  width: 100%;
  max-width: var(--container-max);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-4);
  border-bottom: var(--border-thin) solid var(--mono-gray-300);
}

.analog-title {
  font-size: var(--type-xl);
  font-weight: var(--font-regular);
  letter-spacing: -0.02em;
  margin: 0;
  text-transform: uppercase;
}

/* Canvas container */
.analog-canvas-container {
  margin: var(--space-12) 0;
  position: relative;
}

.analog-canvas {
  display: block;
  border: var(--border-medium) solid var(--analog-border);
  background: var(--analog-bg);
  box-shadow: var(--shadow-lg);
}

/* Controls (same as countdown but centered) */
.analog-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  max-width: 600px;
  width: 100%;
  margin-bottom: var(--space-8);
}

.analog-btn {
  font-family: var(--font-sans);
  font-size: var(--type-base);
  font-weight: var(--font-medium);
  padding: var(--space-4) var(--space-6);
  background: var(--mono-black);
  color: var(--mono-white);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.analog-btn:hover {
  background: var(--mono-gray-800);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.analog-btn.secondary {
  background: var(--mono-gray-200);
  color: var(--mono-black);
}

.analog-btn.secondary:hover {
  background: var(--mono-gray-300);
}

/* Presets (minimal) */
.analog-presets {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: var(--space-8);
}

.analog-preset {
  font-family: var(--font-sans);
  font-size: var(--type-sm);
  font-weight: var(--font-regular);
  padding: var(--space-2) var(--space-4);
  background: transparent;
  color: var(--mono-gray-600);
  border: var(--border-thin) solid var(--mono-gray-400);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.analog-preset:hover {
  background: var(--mono-black);
  color: var(--mono-white);
  border-color: var(--mono-black);
}

/* Responsive */
@media (max-width: 768px) {
  .analog-canvas {
    max-width: 100%;
    height: auto;
  }

  .analog-controls {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Import analog styles**

Add to `src/styles.css`:

```css
@import './design-tokens.css';
@import './styles/countdown-swiss.css';
@import './styles/stopwatch-swiss.css';
@import './styles/analog-swiss.css';
```

**Step 3: Update AnalogCountdown.tsx JSX structure**

Find and replace the JSX return in `src/pages/AnalogCountdown.tsx` (keep canvas drawing logic intact, only update wrapper structure):

```tsx
return (
  <div className="analog-page" ref={wrapRef}>
    {/* Header */}
    <header className="analog-header">
      <h1 className="analog-title">Analog Countdown</h1>
      <HomeButton />
    </header>

    {/* Canvas (colors preserved in drawing code) */}
    <div className="analog-canvas-container">
      <canvas ref={canvasRef} className="analog-canvas" width={800} height={800} />
    </div>

    {/* Controls */}
    <div className="analog-controls">
      {!st.running ? (
        <button className="analog-btn" onClick={start}>Start</button>
      ) : (
        <button className="analog-btn" onClick={pause}>Pause</button>
      )}
      <button className="analog-btn secondary" onClick={reset}>Reset</button>
      <button className="analog-btn secondary" onClick={toggleFull}>Fullscreen</button>
    </div>

    {/* Presets */}
    <div className="analog-presets">
      <button className="analog-preset" onClick={() => setPreset(5 * 60_000)}>5m</button>
      <button className="analog-preset" onClick={() => setPreset(10 * 60_000)}>10m</button>
      <button className="analog-preset" onClick={() => setPreset(30 * 60_000)}>30m</button>
      <button className="analog-preset" onClick={() => setPreset(60 * 60_000)}>1h</button>
      <button className="analog-preset" onClick={() => setPreset(90 * 60_000)}>1h30m</button>
      <button className="analog-preset" onClick={() => setPreset(2 * 60 * 60_000)}>2h</button>
    </div>

    {/* Settings */}
    <div className="countdown-settings">
      <label>
        <input
          type="checkbox"
          checked={st.signal.sound}
          onChange={(e) => setSt(s => ({ ...s, signal: { ...s.signal, sound: e.target.checked } }))}
        />
        Sound
      </label>
      <label>
        <input
          type="checkbox"
          checked={st.signal.flash}
          onChange={(e) => setSt(s => ({ ...s, signal: { ...s.signal, flash: e.target.checked } }))}
        />
        Flash
      </label>
    </div>
  </div>
);
```

**Step 4: Verify canvas drawing uses design tokens for colors**

Review the canvas drawing code in `AnalogCountdown.tsx` (around lines 180-280). The existing colors should align with design tokens:

- Clock face background: White (`--analog-bg: #ffffff`)
- Border: Charcoal (`--analog-border: #36454f`)
- Hour/minute hands: Dark (`--analog-hand-primary: #2d2d2d`)
- Second hand: Crimson red (`--analog-hand-second: #dc143c`)
- Progress arc: Red→Green gradient (`--analog-progress-start/mid/end`)

**No code changes needed** - the canvas already uses these colors. Design tokens document the existing palette.

**Step 5: Test analog countdown visually**

Run: `npm run dev`

Open: http://localhost:5173/#/analog

Verify:
- Light gray background (not white like digital timers)
- White clock face with color preserved (hands, progress arc)
- Same button styles as countdown/stopwatch
- Visual distinction through color while maintaining family resemblance
- Consistent typography and spacing

**Step 6: Commit analog countdown refinement**

```bash
git add src/pages/AnalogCountdown.tsx src/styles/analog-swiss.css src/styles.css
git commit -m "feat: refine analog countdown with Swiss/Bauhaus structure

- Consistent header/button styles with digital timers
- Light gray page background for distinction
- Preserved color in clock face (design requirement)
- Same geometric button grid layout
- Minimal preset buttons
- Visual family while remaining distinct through color

Visual consistency: Step 3/3 complete"
```

---

## Task 5: Update Home Page for Consistency

**Files:**
- Modify: `src/pages/Home.tsx` OR `src/main.tsx:30-74` (Home component)
- Create: `src/styles/home-swiss.css`
- Modify: `src/styles.css` (import home styles)

**Step 1: Create Swiss/Bauhaus home page styles**

Create `src/styles/home-swiss.css`:

```css
/* ============================================
 * HOME PAGE - Swiss/Bauhaus Minimal
 * Entry point visual consistency
 * ============================================ */

.home-page {
  min-height: 100vh;
  background: var(--mono-white);
  color: var(--mono-black);
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8);
}

/* Title (geometric, minimal) */
.home-title-container {
  width: 100%;
  max-width: var(--container-max);
  text-align: center;
  margin-bottom: var(--space-16);
  padding: var(--space-12) 0;
  border-bottom: var(--border-medium) solid var(--mono-black);
}

.home-title {
  font-size: var(--type-3xl);
  font-weight: var(--font-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
}

/* Timer grid (geometric) */
.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  max-width: 1000px;
  width: 100%;
  margin-bottom: var(--space-12);
}

/* Timer cards (minimal) */
.home-timer-card {
  aspect-ratio: 1;
  border: var(--border-medium) solid var(--mono-black);
  background: var(--mono-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--mono-black);
  transition: all var(--transition-base);
  padding: var(--space-6);
}

.home-timer-card:hover {
  background: var(--mono-black);
  color: var(--mono-white);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.home-timer-icon {
  width: 80px;
  height: 80px;
  margin-bottom: var(--space-4);
  opacity: 0.9;
}

.home-timer-card:hover .home-timer-icon {
  opacity: 1;
  filter: invert(1);
}

.home-timer-label {
  font-size: var(--type-base);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

/* Footer (minimal) */
.home-footer {
  margin-top: auto;
  padding-top: var(--space-8);
  border-top: var(--border-thin) solid var(--mono-gray-300);
  display: flex;
  gap: var(--space-4);
  font-size: var(--type-sm);
  color: var(--mono-gray-600);
}

.home-footer a {
  color: var(--mono-gray-600);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.home-footer a:hover {
  color: var(--mono-black);
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .home-title {
    font-size: var(--type-2xl);
  }

  .home-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}
```

**Step 2: Import home styles**

Add to `src/styles.css`:

```css
@import './design-tokens.css';
@import './styles/countdown-swiss.css';
@import './styles/stopwatch-swiss.css';
@import './styles/analog-swiss.css';
@import './styles/home-swiss.css';
```

**Step 3: Update Home component in main.tsx**

Replace the Home function in `src/main.tsx` (lines 30-74):

```tsx
function Home() {
  // Timer definitions: [route, label, iconPath]
  const timers = [
    ["#/stopwatch", "Stopwatch", "/icons/STOP_WATCH_BUTTON.png"],
    ["#/countdown", "Countdown", "/icons/DIGITAL_COUNTDOWN_BUTTON.png"],
    ["#/analog", "Analog", "/icons/ANALOG_COUNTDOWN_BUTTON.png"],
    ["#/cycle", "Cycle", "/icons/CYCLE_TIME_BUTTON.png"],
    ["#/world", "World Clock", "/icons/WORLD_TIME_BUTTON.png"],
    ["#/alarm", "Alarm", "/icons/ALARM_CLOCK_BUTTON.png"],
    ["#/metronome", "Metronome", "/icons/METRONOM_BUTTON.png"],
    ["#/chess", "Chess Clock", "/icons/CHESS_CLOCK_BUTTON.png"],
  ];

  return (
    <div className="home-page">
      {/* Title */}
      <div className="home-title-container">
        <h1 className="home-title">Stoppclock</h1>
      </div>

      {/* Timer Grid */}
      <div className="home-grid">
        {timers.map(([route, label, icon]) => (
          <a key={route} href={route} className="home-timer-card">
            <img src={icon} alt={label} className="home-timer-icon" />
            <span className="home-timer-label">{label}</span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <a href="#/impressum">Impressum</a>
        <span>•</span>
        <a href="#/datenschutz">Datenschutz</a>
      </footer>
    </div>
  );
}
```

**Step 4: Test home page visually**

Run: `npm run dev`

Open: http://localhost:5173/

Verify:
- White background
- Bold uppercase title with thick underline
- Geometric timer card grid
- Minimal card hover effects (invert colors)
- Consistent typography with timers
- Clean footer

**Step 5: Commit home page update**

```bash
git add src/main.tsx src/styles/home-swiss.css src/styles.css
git commit -m "feat: redesign home page with Swiss/Bauhaus minimalism

- Geometric title treatment
- Minimal timer card grid
- Hover invert effect (white→black)
- Consistent typography system
- Clean footer design
- Visual family with all timers

Design system complete across 4 pages"
```

---

## Task 6: Run E2E Tests for Validation

**Files:**
- No modifications
- Run existing Playwright E2E tests

**Step 1: Run all E2E tests**

Run:
```bash
npm run test:e2e
```

Expected:
- All 44+ tests pass
- No functionality regressions
- Countdown timer tests pass
- Stopwatch timer tests pass
- Analog countdown tests pass
- Home page tests pass

**Step 2: If tests fail - identify failures**

If any tests fail, analyze output:

```bash
npm run test:e2e -- --reporter=list
```

Common failure patterns:
- **Selector failures**: CSS class names changed → Update test selectors
- **Visual regressions**: Expected colors/styles changed → Expected behavior
- **Timing issues**: Tests too fast for new transitions → Add waits

**Step 3: Fix any selector-based test failures**

If tests fail due to class name changes (e.g., `.countdown-wrap` → `.countdown-page`), update test files:

Example fix in `tests/countdown.spec.ts`:
```typescript
// Before
await page.locator('.countdown-wrap').waitFor();

// After
await page.locator('.countdown-page').waitFor();
```

**Step 4: Re-run tests after fixes**

Run:
```bash
npm run test:e2e
```

Expected: All tests pass

**Step 5: Commit test fixes (if any)**

```bash
git add tests/
git commit -m "test: update selectors for Swiss/Bauhaus redesign

- Update class names in E2E tests
- All 44+ tests passing
- No functionality regressions"
```

---

## Task 7: Create Design System Documentation

**Files:**
- Create: `docs/DESIGN_SYSTEM.md`

**Step 1: Document design system principles and tokens**

Create `docs/DESIGN_SYSTEM.md`:

```markdown
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
```

**Step 2: Commit design system documentation**

```bash
git add docs/DESIGN_SYSTEM.md
git commit -m "docs: add Swiss/Bauhaus design system documentation

- Complete design token reference
- Component patterns guide
- Usage guidelines (DOs and DON'Ts)
- Typography and spacing scales
- Color palette documentation
- Future extension guide

Design system: Documented and validated"
```

---

## Task 8: Final Validation & Cleanup

**Files:**
- No modifications
- Final verification

**Step 1: Visual smoke test all pages**

Run: `npm run dev`

Test each page:
- ✅ Home: http://localhost:5173/
- ✅ Countdown: http://localhost:5173/#/countdown
- ✅ Stopwatch: http://localhost:5173/#/stopwatch
- ✅ Analog: http://localhost:5173/#/analog

Verify:
- Visual consistency across all pages
- No layout breaks
- All buttons functional
- Typography hierarchy clear
- Spacing consistent

**Step 2: Run final E2E test suite**

Run:
```bash
npm run test:e2e
```

Expected: All tests pass (44+ tests)

**Step 3: Build production bundle**

Run:
```bash
npm run build
```

Expected:
- Build succeeds without errors
- Bundle size reasonable
- Sitemap generated

**Step 4: Preview production build**

Run:
```bash
npm run preview
```

Open: http://localhost:4173/

Test all 3 redesigned timers in production mode.

**Step 5: Create summary commit**

```bash
git commit --allow-empty -m "feat: complete Swiss/Bauhaus minimalism redesign

SUMMARY:
- Design token system (modular scale, monochrome palette)
- Countdown timer: Monochrome, 128px display, geometric grid
- Stopwatch timer: Inverted display, lap times table
- Analog timer: Preserved color, consistent controls
- Home page: Minimal grid, uppercase title
- Design system documentation

METRICS:
- 3/8 timers redesigned (core timers)
- 44+ E2E tests passing
- Visual consistency achieved
- Typography: Modular scale (1.5x ratio)
- Spacing: 4-96px scale
- Colors: Monochrome + selective analog color

NEXT STEPS:
- Apply system to remaining 5 timers
- Refine responsive breakpoints
- A/B test readability improvements"
```

---

## Completion Checklist

**When all tasks complete:**

- [ ] Design tokens created (`src/design-tokens.css`)
- [ ] Countdown timer redesigned (monochrome, modular scale)
- [ ] Stopwatch timer redesigned (inverted display, consistent)
- [ ] Analog timer refined (color preserved, controls updated)
- [ ] Home page updated (geometric, minimal)
- [ ] All E2E tests passing (no regressions)
- [ ] Design system documented (`docs/DESIGN_SYSTEM.md`)
- [ ] Production build succeeds
- [ ] Visual consistency achieved across 3 core timers

**Success Criteria Met:**
✅ Visual consistency across all 3 core timers
✅ Analog timer remains visually distinct (color)
✅ Design system documented in tokens file
✅ E2E tests validate functionality

---

**REQUIRED SUB-SKILL:** Use @superpowers:finishing-a-development-branch to complete this work after all tasks are verified.
