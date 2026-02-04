# Developer Quickstart Guide: Design Token System

**Feature**: Design Token System & UI/UX Improvements
**Branch**: `003-design-token-system`
**Audience**: Developers implementing or maintaining the design token system

---

## Quick Reference

### Using Design Tokens in Components

```tsx
// ❌ DON'T: Hardcoded colors
<button style={{ background: '#28a745', color: '#fff' }}>Start</button>

// ✅ DO: Use design tokens
<button style={{ background: 'var(--stopwatch-start)', color: 'var(--text-primary)' }}>
  Start
</button>
```

### Available Design Tokens

See [contracts/design-tokens.css](./contracts/design-tokens.css) for complete list.

**Most Common**:
- `--stopwatch-start` (green) - Start/Go actions
- `--stopwatch-stop` (red) - Stop/Danger actions
- `--countdown-accent` (teal) - Countdown-specific
- `--chess-white`, `--chess-black` - Chess Clock players
- `--focus-glow` - Keyboard focus outline
- `--warning-flash` - Flash warning overlay

---

## Setup & Installation

### Prerequisites

- Node.js 18+ with npm
- Git
- Modern browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### Initial Setup

```bash
# Clone repository (if not already)
git clone <repository-url>
cd stoppclock-page

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:e2e
```

---

## Using Design Tokens

### 1. In Component Inline Styles

```tsx
function Stopwatch() {
  return (
    <button
      className="btn primary"
      style={{ background: 'var(--stopwatch-start)' }}
      onClick={handleStart}
    >
      ▶ Start
    </button>
  );
}
```

### 2. In CSS Classes

```css
/* src/styles.css */
.stopwatch-start-btn {
  background: var(--stopwatch-start);
  color: var(--text-primary);
  box-shadow: var(--hover-shadow);
}

.stopwatch-start-btn:focus-visible {
  box-shadow: var(--focus-glow);
}
```

### 3. Dynamic Token Selection

```tsx
function CTAButton({ action }: { action: 'start' | 'stop' }) {
  const tokenMap = {
    start: 'var(--stopwatch-start)',
    stop: 'var(--stopwatch-stop)'
  };

  return (
    <button style={{ background: tokenMap[action] }}>
      {action === 'start' ? '▶ Start' : '■ Stop'}
    </button>
  );
}
```

---

## Adding New Design Tokens

### Step 1: Define Token in CSS

Edit `src/styles.css` and add to `:root` section:

```css
:root {
  /* Existing tokens... */

  /* Your new token */
  --new-feature-accent: #6f42c1; /* Purple for new feature */
}
```

### Step 2: Document in Contract

Update `specs/003-design-token-system/contracts/design-tokens.css`:

```css
/**
 * New Feature Colors
 */
--new-feature-accent: #6f42c1; /* Purple - New feature highlight */
```

### Step 3: Use in Component

```tsx
<div style={{ borderColor: 'var(--new-feature-accent)' }}>
  New Feature
</div>
```

### Step 4: Verify No Hardcoded Colors

```bash
# Search for hardcoded colors (should return nothing)
grep -r '#[0-9a-fA-F]\{6\}' src/pages/*.tsx
grep -r 'rgb(' src/pages/*.tsx
```

---

## Accessibility Testing

### Running axe-core Tests

```bash
# Run full E2E test suite (includes accessibility tests)
npm run test:e2e

# Run only accessibility tests
npm run test:e2e -- --grep "accessibility"
```

### Manual Lighthouse Audit

1. Open app in Chrome: `http://localhost:4173`
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select "Accessibility" category
5. Click "Generate report"
6. **Target**: 100% accessibility score, zero violations

### Testing Keyboard Navigation

**Must work without mouse**:
- `Tab` - Navigate between elements
- `Space` / `Enter` - Activate buttons
- `Arrow Up/Down` - Adjust countdown time (when paused)
- `R` - Reset timer
- `F` - Fullscreen

**Test Checklist**:
- [ ] All buttons reachable via Tab
- [ ] Focus outline visible (`--focus-glow` applied)
- [ ] Space/Enter activate CTAs
- [ ] No keyboard traps (can Tab out of all elements)

### Testing Color Contrast

**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Requirements**:
- Text: ≥4.5:1 contrast ratio (WCAG AA)
- UI components: ≥3:1 contrast ratio

**Example Check**:
- Background: `--surface-1` (#f8f9fa)
- Text: `--text-primary` (#212529)
- **Result**: 11.48:1 ✅ PASS

### Testing Touch Targets (Mobile)

**Requirements**:
- All interactive elements: ≥44×44 pixels

**Test on Real Device**:
1. Deploy preview: `npm run build && npm run preview`
2. Access from mobile: `http://<your-ip>:4173`
3. Test tapping all buttons with finger
4. Verify no mis-taps or difficulty activating

---

## Testing Flash Warnings (Photosensitive Epilepsy)

### Safety Protocol

**⚠️ IMPORTANT**: Flash warnings are DISABLED by default (opt-in).

### Test Procedure

1. Open Countdown: `/#/countdown`
2. Enable "Flash" checkbox (you'll see epilepsy warning)
3. Set countdown to 15 seconds
4. Click Start
5. At 10 seconds remaining:
   - **Expected**: Semi-transparent red overlay fades in/out (250ms)
   - **Frequency**: 1 flash per second (not stroboscopic)
   - **Intensity**: rgba(220, 53, 69, 0.18) - 18% opacity

### Verification Checklist

- [ ] Flash starts at exactly 10 seconds remaining
- [ ] Flash duration ≤250ms per flash
- [ ] Flash frequency ≤1 per second
- [ ] Epilepsy warning displayed before enabling
- [ ] Default state: flashWarnings = false
- [ ] No flash when `prefers-reduced-motion: reduce`

### Testing Reduced Motion

**macOS**: System Preferences → Accessibility → Display → Reduce motion
**Windows**: Settings → Ease of Access → Display → Show animations

**Expected Behavior**:
- All CSS transitions/animations disabled
- Flash warnings disabled (overrides user setting)
- Timer functionality unchanged

```bash
# Verify CSS respects prefers-reduced-motion
grep -A 3 "prefers-reduced-motion" src/styles.css
```

---

## Mobile Testing

### Testing Wheel Pickers (Countdown Input)

**iOS Safari (13+)**:
1. Open Countdown on iPhone
2. Tap "Minutes" input
3. **Expected**: Native iOS picker wheel appears
4. Scroll to select 05
5. **Verify**: Display updates to 00:05:00

**Android Chrome (80+)**:
1. Open Countdown on Android
2. Tap "Minutes" input
3. **Expected**: Native Android number picker
4. Adjust with +/- buttons or type
5. **Verify**: Value clamped to 00-59

**Desktop (Fallback)**:
- Shows number input with stepper buttons
- Arrow keys adjust value
- Still enforces min/max validation

### Mobile Layout Testing

**Devices to Test**:
- iPhone SE (375px) - Smallest modern phone
- iPhone 12 Pro (390px) - Standard
- iPad (768px) - Tablet
- Desktop (1920px) - Large screen

**Test Cases**:
```bash
# Simulate in Chrome DevTools
1. F12 → Toggle Device Toolbar
2. Select device preset
3. Test all timer pages
4. Verify:
   - No horizontal scroll
   - All buttons ≥44×44px touch target
   - Text readable (no <14px font sizes)
   - CTAs visible without scrolling
```

---

## Common Development Tasks

### Adding a New Timer Component

**Example**: Adding a new "Pomodoro Timer" component

1. **Create component file**:
```tsx
// src/pages/PomodoroTimer.tsx
import React from 'react';

export default function PomodoroTimer() {
  return (
    <div className="pomodoro-wrap" style={{
      background: 'var(--surface-1)' // Use design token
    }}>
      <button style={{
        background: 'var(--stopwatch-start)'
      }}>
        ▶ Start
      </button>
    </div>
  );
}
```

2. **Add route** in `src/main.tsx`:
```tsx
if (route === "/pomodoro") return <PomodoroTimer />;
```

3. **Add styles** in `src/styles.css`:
```css
.pomodoro-wrap {
  background: var(--surface-1); /* Use token, not hardcoded */
  padding: 20px;
}
```

4. **Add E2E test**:
```typescript
// tests/e2e/09-pomodoro.spec.ts
test('should load Pomodoro timer', async ({ page }) => {
  await page.goto('/#/pomodoro');
  await expect(page.locator('.pomodoro-wrap')).toBeVisible();
});
```

### Debugging Design Token Issues

**Problem**: Token not applied (shows fallback or nothing)

**Solution Steps**:
1. Check token exists in `:root`:
```bash
grep "my-token" src/styles.css
```

2. Check syntax (must use `var()`):
```tsx
// ❌ Wrong
style={{ background: '--my-token' }}

// ✅ Correct
style={{ background: 'var(--my-token)' }}
```

3. Check DevTools:
- Inspect element
- Computed tab
- Search for CSS variable
- Check if overridden or invalid

---

## Performance Optimization

### Bundle Size Monitoring

```bash
# Build and check bundle size
npm run build

# Check dist/ folder size
du -sh dist/

# Target: <180 kB gzipped JavaScript
```

### CSS Performance

**Best Practices**:
- ✅ Use `transform` and `opacity` for animations (GPU-accelerated)
- ✅ Avoid animating `width`, `height`, `top`, `left` (triggers reflow)
- ✅ Use `will-change` sparingly (only for elements that actually animate)

**Example**:
```css
/* ❌ Slow - triggers reflow */
.btn:hover {
  width: 120px;
  height: 60px;
}

/* ✅ Fast - GPU-accelerated */
.btn:hover {
  transform: scale(1.05);
}
```

---

## Troubleshooting

### Issue: Colors not updating after token change

**Cause**: Browser cache or hot reload not detecting CSS change

**Solution**:
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)

# Or restart dev server
npm run dev
```

### Issue: Lighthouse accessibility score <100

**Diagnosis**:
1. Run Lighthouse audit
2. Check "Accessibility" section
3. Review failed items

**Common Fixes**:
- Missing `aria-label` on buttons
- Color contrast <4.5:1
- Touch targets <44×44px
- Missing `:focus-visible` styles

### Issue: E2E tests failing

**Debug**:
```bash
# Run with headed browser (see what's happening)
npx playwright test --headed

# Run specific test file
npx playwright test tests/e2e/02-countdown.spec.ts

# Debug mode (pauses on failures)
npx playwright test --debug
```

---

## Code Review Checklist

Before merging, verify:

- [ ] No hardcoded colors (`#` or `rgb()`) in component files
- [ ] All new buttons use design tokens
- [ ] All buttons ≥56×56px (primary) or ≥36×36px (secondary)
- [ ] Keyboard navigation works (Tab, Space, Enter)
- [ ] Focus outline visible (`--focus-glow`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Lighthouse accessibility score = 100
- [ ] Bundle size <180 kB gzipped
- [ ] Mobile tested on real device (iOS + Android)
- [ ] `prefers-reduced-motion` respected

---

## Resources

### Documentation
- [spec.md](./spec.md) - Feature requirements
- [plan.md](./plan.md) - Implementation plan
- [data-model.md](./data-model.md) - Entity definitions
- [contracts/](./contracts/) - API contracts

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools Extension](https://www.deque.com/axe/devtools/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Standards
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [W3C: Photosensitive Epilepsy Guidelines](https://www.w3.org/TR/WCAG21/#three-flashes-or-below-threshold)

---

## Questions?

Check existing documentation first:
1. [spec.md](./spec.md) - User requirements
2. [plan.md](./plan.md) - Technical architecture
3. [research.md](./research.md) - Design decisions
4. [data-model.md](./data-model.md) - Data structures

If still unclear, refer to the project constitution in `stoppclock_speckit/.specify/memory/constitution.md`.
