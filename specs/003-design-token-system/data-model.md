# Data Model: Design Token System & UI/UX Improvements

**Feature**: Design Token System & UI/UX Improvements
**Branch**: `003-design-token-system`
**Date**: 2025-10-20
**Purpose**: Define data structures and relationships for the design token system and accessibility features

---

## Entity 1: Design Token

A design token is a CSS custom property that centralizes design decisions (colors, spacing, effects).

### Attributes

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `name` | string | CSS custom property name | `--stopwatch-start` |
| `value` | string | CSS value (color, size, shadow) | `#28a745`, `56px`, `0 0 0 4px rgba(0,123,255,0.15)` |
| `category` | enum | Token category | `color`, `spacing`, `effect`, `typography` |
| `description` | string | Purpose and usage context | "Green color for start/go actions in Stopwatch" |

### Relationships

- **Referenced by**: Component stylesheets via `var(--name)` references
- **Defined in**: `:root` scope in `src/styles.css`
- **Scoped to**: Global (all components can reference)

### Validation Rules

- ✅ All tokens MUST be defined in `:root` scope
- ✅ Token names MUST follow semantic naming convention (`--component-property`)
- ✅ No hardcoded hex/rgb values in component files (all must use `var()`)
- ✅ Token values MUST be valid CSS values

### Storage

**Location**: `src/styles.css` - Embedded in CSS file, no database or localStorage needed

**Example**:
```css
:root {
  /* Action Colors */
  --stopwatch-start: #28a745;
  --stopwatch-stop:  #dc3545;
  --countdown-accent: #17a2b8;

  /* Chess Clock */
  --chess-white: #ffffff;
  --chess-black: #000000;

  /* Surface Colors */
  --surface-1: #f8f9fa;
  --surface-2: #e9ecef;

  /* Text Colors */
  --text-primary: #212529;
  --text-secondary: #6c757d;

  /* Interaction States */
  --focus-glow: 0 0 0 4px rgba(0, 123, 255, 0.15);
  --hover-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* Warning Flash Overlay */
  --warning-flash: rgba(220, 53, 69, 0.18);
}
```

---

## Entity 2: User Accessibility Preferences

User preferences for accessibility features (motion, audio, visual warnings, screen reader verbosity).

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `motionPreference` | enum | `'full'` | Motion animation preference: `'full'` or `'reduced'` |
| `audioWarnings` | boolean | `true` | Enable audio beeps for countdown warnings |
| `flashWarnings` | boolean | `false` | Enable visual flash warnings (opt-in for safety) |
| `screenReaderVerbosity` | enum | `'low'` | Screen reader announcement frequency: `'high'` or `'low'` |

### Relationships

- **Consumed by**: Countdown.tsx, Metronome.tsx components
- **Synced with**: OS-level `prefers-reduced-motion` media query (for `motionPreference`)

### Validation Rules

- ✅ `motionPreference` must be `'full'` or `'reduced'`
- ✅ `flashWarnings` defaults to `false` (opt-in for epilepsy safety)
- ✅ `audioWarnings` respects browser autoplay policies (requires user interaction)
- ✅ `screenReaderVerbosity` controls `aria-live` announcement frequency

### Storage

**Location**: `localStorage` with key `sc.v1.accessibility`

**Schema**:
```typescript
interface AccessibilityPreferences {
  version: 1;
  motionPreference: 'full' | 'reduced';
  audioWarnings: boolean;
  flashWarnings: boolean;
  screenReaderVerbosity: 'high' | 'low';
}
```

**Example localStorage value**:
```json
{
  "version": 1,
  "motionPreference": "full",
  "audioWarnings": true,
  "flashWarnings": false,
  "screenReaderVerbosity": "low"
}
```

### Default Initialization

```typescript
function loadAccessibilityPreferences(): AccessibilityPreferences {
  try {
    const raw = localStorage.getItem('sc.v1.accessibility');
    if (!raw) throw new Error('No saved preferences');
    return JSON.parse(raw) as AccessibilityPreferences;
  } catch {
    return {
      version: 1,
      motionPreference: 'full',
      audioWarnings: true,
      flashWarnings: false, // IMPORTANT: Opt-in for safety
      screenReaderVerbosity: 'low'
    };
  }
}
```

---

## Entity 3: Timer Preset

Predefined time increment for quick timer setup (e.g., Analog Countdown preset buttons "+1h", "+2h").

### Attributes

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `label` | string | Display text for button | `"+1h"`, `"+15min"`, `"Pomodoro 25m"` |
| `valueMs` | number | Time value in milliseconds | `3600000` (1 hour), `1500000` (25 min) |
| `colorToken` | string | Design token reference for button color | `--analog-preset-1h` |
| `timerType` | enum | Which timer component uses this preset | `'analog'`, `'countdown'`, `'cycle'` |

### Relationships

- **Rendered by**: AnalogCountdown.tsx, Countdown.tsx components
- **Styled with**: Design tokens (colorToken attribute)

### Validation Rules

- ✅ `valueMs` must be > 0 and ≤ MAX (12 hours for countdown)
- ✅ `colorToken` must reference an existing design token
- ✅ `label` should be short (≤8 characters for UI space)

### Storage

**Location**: Hardcoded in component files (not persisted to localStorage)

**Example** (AnalogCountdown.tsx):
```typescript
const presets: TimerPreset[] = [
  { label: '+1h', valueMs: 3600000, colorToken: '--analog-preset-1h', timerType: 'analog' },
  { label: '+2h', valueMs: 7200000, colorToken: '--analog-preset-2h', timerType: 'analog' },
  { label: '+3h', valueMs: 10800000, colorToken: '--analog-preset-3h', timerType: 'analog' },
  { label: '+4h', valueMs: 14400000, colorToken: '--analog-preset-4h', timerType: 'analog' }
];
```

---

## Entity 4: CTA Button Configuration

Configuration for primary Call-to-Action buttons (Start, Stop, Pause, Reset) with accessibility requirements.

### Attributes

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `actionType` | enum | Button action type | `'start'`, `'stop'`, `'reset'`, `'pause'` |
| `sizeVariant` | enum | Button size category | `'primary'` (≥56×56px), `'secondary'` (≥36×36px) |
| `colorToken` | string | Design token for button background | `--stopwatch-start`, `--stopwatch-stop` |
| `iconLabel` | string | Accessible screen reader label | "Start timer", "Stop timer" |
| `icon` | string | Visual icon (emoji or Unicode) | "▶", "■", "↻" |

### Relationships

- **Used by**: All timer components (Stopwatch, Countdown, Chess Clock, etc.)
- **Styled with**: Design tokens (colorToken attribute)

### Validation Rules

- ✅ `primary` variant MUST have min-width: 56px, min-height: 56px
- ✅ `secondary` variant MUST have min-width: 36px, min-height: 36px
- ✅ Touch targets MUST be ≥44×44px (may use padding to meet requirement)
- ✅ All buttons MUST support keyboard activation (Space, Enter keys)
- ✅ All buttons MUST show `--focus-glow` on keyboard focus

### Example Implementation

```typescript
interface CTAButtonProps {
  actionType: 'start' | 'stop' | 'reset' | 'pause';
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: string;
  label: string; // For screen readers
}

// Usage in Stopwatch.tsx
<button
  className="btn primary"
  onClick={start}
  aria-label="Start timer"
  style={{ background: 'var(--stopwatch-start)' }}
>
  ▶ Start
</button>
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     :root CSS                        │  │
│  │  Design Tokens (--stopwatch-start, --chess-white)   │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │ Referenced via var()                    │
│                   ▼                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            React Components                          │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │ Countdown.tsx│  │ Stopwatch.tsx│  ...            │  │
│  │  │              │  │              │                  │  │
│  │  │ Uses:        │  │ Uses:        │                  │  │
│  │  │ - Tokens     │  │ - Tokens     │                  │  │
│  │  │ - CTA Config │  │ - CTA Config │                  │  │
│  │  │ - AccessPrefs│  │              │                  │  │
│  │  └──────┬───────┘  └──────────────┘                 │  │
│  │         │                                            │  │
│  │         │ Reads/Writes                               │  │
│  │         ▼                                            │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │         localStorage                         │   │  │
│  │  │  sc.v1.accessibility: AccessibilityPrefs     │   │  │
│  │  │  sc.v1.countdown: Timer state                │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        OS-Level Preferences (read-only)             │  │
│  │  prefers-reduced-motion: reduce | no-preference     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Entity Relationships Summary

| Entity | Persisted? | Scope | Consumed By |
|--------|-----------|-------|-------------|
| Design Token | Yes (CSS file) | Global | All components |
| Accessibility Preferences | Yes (localStorage) | User-specific | Countdown, Metronome |
| Timer Preset | No (hardcoded) | Component-specific | AnalogCountdown |
| CTA Button Config | No (props/styles) | Component-specific | All timer components |

---

## Key Implementation Notes

1. **Design Tokens are immutable at runtime** - Changes require CSS file edits and rebuild
2. **Accessibility Preferences sync with OS** - `prefers-reduced-motion` overrides user setting
3. **No backend database** - All data persisted to localStorage or CSS files (zero-backend architecture)
4. **Type safety** - All entities have TypeScript interfaces in `src/types/timer-types.ts`
5. **Validation happens client-side** - No server-side validation needed

---

## Next Steps

- ✅ Phase 0: Research complete (research.md)
- ✅ Phase 1: Data model documented (this file)
- ⏭️ Define contracts (contracts/design-tokens.css, contracts/component-props.ts)
- ⏭️ Create developer quickstart guide (quickstart.md)
