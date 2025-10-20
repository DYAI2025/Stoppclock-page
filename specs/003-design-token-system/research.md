# Research & Design Decisions: Design Token System & UI/UX Improvements

**Feature**: Design Token System & UI/UX Improvements
**Branch**: `003-design-token-system`
**Date**: 2025-10-20
**Purpose**: Document technical research and design decisions made during Phase 0

---

## 1. CSS Design Token Best Practices

### Research Question
- What naming convention should we use for design tokens?
- How should tokens be organized (flat vs nested)?
- What industry standards exist?

### Research Findings

**Industry Standards Reviewed**:
- Material Design Tokens (Google)
- Tailwind CSS utility-first approach
- Chakra UI semantic tokens
- GitHub Primer design system

**Key Patterns Identified**:
1. **Semantic Naming** (`--stopwatch-start`) preferred over generic (`--color-1` or `--green-500`)
2. **Context-Specific Tokens** easier to maintain than color-only tokens
3. **Flat Structure** (single level of custom properties) performs better than nested
4. **Component-Scoped Tokens** reduce naming conflicts

### Decision 1: Token Naming Convention

**Chosen Approach**: Semantic naming with component context

**Format**: `--{component}-{property}` or `--{semantic-role}`

**Examples**:
- `--stopwatch-start` (not `--green-primary` or `--color-success`)
- `--chess-white` (not `--player-1-bg`)
- `--focus-glow` (not `--outline-blue`)

**Rationale**:
- Easier to understand intent ("stopwatch start button" vs "green color 500")
- Refactoring-safe (changing green to blue doesn't require renaming variable)
- Aligns with spec.md requirement for no hardcoded colors

### Decision 2: Token Organization

**Chosen Approach**: Flat structure with category comments

**Implementation**:
```css
:root {
  /* Action Colors */
  --stopwatch-start: #28a745;
  --stopwatch-stop: #dc3545;

  /* Chess Clock */
  --chess-white: #ffffff;
  --chess-black: #000000;

  /* Surface Colors */
  --surface-1: #f8f9fa;
  --surface-2: #e9ecef;
}
```

**Rationale**:
- Single `:root` selector simplifies inheritance
- No JavaScript parsing required (pure CSS)
- Categories via comments for readability without complexity

---

## 2. Mobile Wheel Picker Implementation

### Research Question
- Native HTML5 vs custom JavaScript picker?
- Browser support status?
- Fallback strategies?

### Research Findings

**Native HTML5 Input Types**:
- `input[type="time"]` - Shows time wheel picker on iOS/Android
- `input[type="number"]` with `min`/`max` - Shows number wheel on mobile
- Browser support: Chrome 80+, Safari 13+, Firefox 75+ (all modern browsers)

**Custom JavaScript Pickers**:
- Libraries: react-datepicker, react-mobile-picker
- Bundle size impact: +15-30 kB
- Styling complexity: High
- Accessibility: Requires ARIA implementation

### Decision 3: Native HTML5 Input Types

**Chosen Approach**: Use `input[type="number"]` with `min`/`max` attributes

**Implementation Strategy**:
```tsx
<input
  type="number"
  min="0"
  max="59"
  value={minutes}
  onChange={handleChange}
  aria-label="Minutes"
/>
```

**Feature Detection**: No detection needed - all target browsers support it

**Rationale**:
- Zero dependencies (meets constitution's vendor lock-in prevention)
- Native accessibility (built-in ARIA support)
- Mobile browsers automatically show wheel UI
- Desktop browsers show steppers (acceptable fallback)
- Minimal bundle size impact

---

## 3. WCAG AA Compliance Validation

### Research Question
- Which automated testing tools should we use?
- How to implement ARIA live regions for timers?
- Color contrast calculation methods?

### Research Findings

**Automated Testing Tools Evaluated**:
- **axe-core**: DevTools integration, comprehensive rules, Playwright plugin available
- **Lighthouse**: Built into Chrome DevTools, full accessibility audit
- **pa11y**: CLI-based, good for CI/CD but redundant with axe

**ARIA Live Regions Best Practices**:
- `aria-live="polite"` for timer announcements (not aggressive/assertive)
- `aria-atomic="true"` for complete time readouts
- Optional feature (can be distracting for some users)

**Color Contrast Tools**:
- WebAIM Contrast Checker (manual verification)
- Chrome DevTools Accessibility Panel (real-time)
- axe-core automated checks (part of E2E tests)

### Decision 4: WCAG Testing Strategy

**Chosen Approach**: axe-core + manual Lighthouse audits

**Implementation**:
1. **E2E Tests**: Integrate `@axe-core/playwright` in `tests/e2e/accessibility.spec.ts`
2. **Manual Audits**: Run Lighthouse before each release
3. **Contrast Validation**: Use WebAIM Contrast Checker during design

**ARIA Live Regions**: Optional, controlled by `screenReaderVerbosity` setting

**Rationale**:
- axe-core catches 80-90% of accessibility issues automatically
- Lighthouse provides comprehensive scoring for tracking
- Manual checks catch context-dependent issues (color meaning, etc.)

---

## 4. CSS Animation Performance

### Research Question
- CSS transitions vs CSS animations vs requestAnimationFrame?
- GPU acceleration techniques?
- prefers-reduced-motion implementation?

### Research Findings

**Performance Comparison**:
- **CSS Transitions**: Best for simple property changes (color, transform)
- **CSS Animations**: Good for keyframe-based sequences
- **requestAnimationFrame**: Required for timer ticks (high precision needed)

**GPU Acceleration**:
- Use `transform` and `opacity` for best performance
- `will-change: transform` hints to browser (use sparingly)
- Avoid `position`, `width`, `height` animations (trigger reflow)

**Reduced Motion**:
- `@media (prefers-reduced-motion: reduce)` disables animations
- CSS-only (no JavaScript detection needed)
- User preference in OS settings

### Decision 5: Animation Strategy

**Chosen Approach**: CSS transitions for UI, requestAnimationFrame for timers

**Implementation**:
- **Button hover/focus**: CSS transitions (120-240ms duration)
- **Chess Clock active state**: CSS transition with `transform: scale(1.03)`
- **Timer countdowns**: Existing requestAnimationFrame loops (already implemented)
- **Flash warnings**: CSS animation with `@media (prefers-reduced-motion)` fallback

**Example**:
```css
.btn {
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
```

**Rationale**:
- CSS transitions handled by compositor thread (smooth 60fps)
- Minimal JavaScript overhead
- Automatic reduced-motion support
- Already using requestAnimationFrame for timers (no change needed)

---

## 5. Flash Warning Accessibility

### Research Question
- Overlay implementation technique?
- Photosensitive epilepsy guidelines?
- Warning message content and placement?

### Research Findings

**WCAG 2.3.1 (Three Flashes or Below Threshold)**:
- No more than 3 flashes per second
- Flash must be below general flash and red flash thresholds
- Large flashes (>25% of viewport) require extra caution

**Trace Center Photosensitive Epilepsy Guidelines**:
- Avoid stroboscopic effects (rapid on/off cycles)
- Use gradual fades (min 150ms transition)
- Provide clear opt-out with warning
- Default to OFF (opt-in for safety)

**Implementation Techniques**:
- Fixed position `<div>` overlay: Simple, performant
- CSS `::backdrop` pseudo-element: Limited browser support
- Canvas-based: Overkill for simple flash effect

### Decision 6: Flash Warning Implementation

**Chosen Approach**: Fixed position div with CSS animation, default OFF

**Implementation**:
```css
.flash {
  position: fixed;
  inset: 0;
  background: rgba(220, 53, 69, 0.18);
  animation: flashFade 250ms ease-in-out;
  pointer-events: none;
}

@keyframes flashFade {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
```

**Warning Text** (in Countdown settings):
```
⚠️ Warning: Flash effects may trigger photosensitive reactions.
Only enable if you are not sensitive to flashing lights.
```

**Safety Features**:
- Default: `flashWarnings: false` (opt-in)
- Maximum: 1 flash per second (meets WCAG 2.3.1)
- Duration: 250ms (gradual fade, not stroboscopic)
- Transparency: 18% opacity (low intensity)
- Disable via `prefers-reduced-motion`

**Rationale**:
- Meets WCAG 2.3.1 requirements (≤1 flash/second)
- Clear warning reduces liability
- Opt-in model prioritizes safety
- Low opacity reduces seizure risk

---

## Implementation Summary

### Finalized Decisions

| Decision | Chosen Approach | Key Benefit |
|----------|----------------|-------------|
| Token Naming | Semantic (`--stopwatch-start`) | Intent clarity |
| Token Structure | Flat `:root` | Performance |
| Wheel Picker | Native HTML5 `input[type="number"]` | Zero dependencies |
| WCAG Testing | axe-core + Lighthouse | Automated + manual coverage |
| Animations | CSS transitions (UI) + RAF (timers) | GPU-accelerated |
| Flash Warning | Fixed div, opt-in, ≤1/sec | WCAG 2.3.1 compliant |

### Next Steps

1. ✅ **Phase 0 Complete** - All design decisions documented
2. ⏭️ **Phase 1**: Create data-model.md and contracts/ (T002-T006)
3. ⏭️ **Phase 2**: Implement design tokens in src/styles.css (T007-T010)

---

## References

- WCAG 2.3.1: [https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold](https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold)
- Material Design Tokens: [https://m3.material.io/foundations/design-tokens](https://m3.material.io/foundations/design-tokens)
- CSS Containment: [https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment)
- WebAIM Contrast Checker: [https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/)
