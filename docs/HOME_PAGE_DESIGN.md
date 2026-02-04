# Home Page Design System

## Overview

The Stoppclock home page features a professional Swiss/Bauhaus-inspired design system with a dark/light mode toggle, golden ratio proportions, and semantic color palette.

## Design Philosophy

**Modern Minimalist with Golden Ratio**
- Clean, professional appearance (not "Schulprojekt")
- Mathematically proportioned spacing using φ = 1.618
- Semantic color system (Sage Green for nature/growth, Charcoal for stability)
- Accessibility-first approach (WCAG 2.1 AA compliant)

## Color System

### Primary Palette
| Color | Hex | Usage | Notes |
|-------|-----|-------|-------|
| Sage Green | #9CAF88 | Primary accent, hover states | Natural, professional |
| Charcoal | #2C3E50 | Dark backgrounds, text | Stable, high contrast |
| Off-White | #F8F9FA | Light backgrounds | Soft, easier on eyes |
| Warm Gray | #7A8A99 | Secondary text, borders | Neutral, readable |
| Light Border | #E5E9EF | Subtle dividers | Low emphasis |

### Theme Colors

**Dark Mode (Default)**
```css
--dark-bg: #0f1419;           /* Very dark background */
--dark-surface: #1a1f2e;      /* Card/surface dark */
--dark-text: #e8eaed;         /* Light text on dark */
--dark-border: #2a3142;       /* Borders on dark */
```

**Light Mode**
```css
--light-bg: #f8f9fa;          /* Light background */
--light-text: #1a1f2e;        /* Dark text on light */
--light-border: #e5e9ef;      /* Subtle borders */
```

## Typography

**Font Stack**: Segoe UI, Roboto, sans-serif
**Weights Used**: 400 (regular), 600 (medium), 700 (bold)

### Typography Scale
| Element | Size | Weight | Letter-Spacing | Notes |
|---------|------|--------|-----------------|-------|
| H1 (STOPPCLOCK) | 56-96px | 700 | 0.02em | Dynamic based on viewport |
| H2 (Section titles) | 1.5-2rem | 700 | 0.02em | About the Timers, Explore Further |
| Body text | 1rem | 400 | normal | Description text |
| Small text | 0.875rem | 400 | normal | Footer, metadata |

## Layout System

### Golden Ratio Spacing
```css
--container-max: 1618px;    /* 1000 × φ */
--space-4: 29.4px;          /* Base unit */
--space-8: 47.4px;          /* space-4 × φ */
--space-12: 78.4px;         /* space-8 × φ */
```

### Grid Layout
- **Type**: CSS Grid, 3 columns
- **Gap**: clamp(24px, 3vw, 36px)
- **Card Height**: 180px (uniform)
- **Card Width**: Responsive, fills column
- **Centering**: margin: 0 auto, place-items: center

## Dark/Light Mode Implementation

### How It Works

1. **State Management**
   - Component: `src/components/DarkModeToggle.tsx`
   - State: `isDark` boolean with useState
   - Persistence: localStorage key `sc.theme-mode`

2. **DOM Attribute**
   - Sets `html[data-theme]` to "dark" or "light"
   - CSS selectors target this attribute
   - Works across all pages

3. **Styling Strategy**
   - Dark mode: Inline styles on .home-page element
   - Light mode: CSS selectors (`html[data-theme="light"] .home-page`)
   - Both have equal specificity (!important flags used where needed)

### CSS Selector Pattern

```css
/* Dark mode (default) */
.home-page {
  background: linear-gradient(180deg, #1a2332 0%, #0f1419 100%) !important;
}

/* Light mode override */
html[data-theme="light"] .home-page {
  background: linear-gradient(180deg, #f8f9fa 0%, #f0f1f5 100%) !important;
  color: #1a1f2e;
}
```

### Toggle Button

**Position**: Fixed, top-right (16px from top, 80px from right)
**Size**: 40px × 40px
**Icon**: SVG moon (dark mode) or sun (light mode)
**Interaction**:
- Click to toggle theme
- Hover: Background changes to Sage Green
- Smooth 0.2s transition

## Component Structure

### Home Page Sections

```
<div className="home-page">
  <div className="home-title-container">
    <!-- STOPPCLOCK hero section -->
  </div>

  <div className="home-section home-section-timers">
    <!-- Timer grid (Countdown, Stopwatch, etc.) with inline microcopy -->
  </div>

  <div className="home-section">
    <h2 className="section-title">About the Timers</h2>
    <!-- Dedicated descriptions (single source, reused inside cards) -->
  </div>

  <div className="home-section">
    <h2 className="section-title">Explore Further</h2>
    <!-- Pillar content (Space for Time) -->
  </div>
</div>
```

### Combined timer tiles + descriptions (Redesign direction)
- **Single source of truth**: Keep the existing "About the Timers" text blocks as canonical content and surface a condensed version inside each card (title + one-liner + shortcut chip).
- **Progressive disclosure**: Default card state shows label + icon + a 1–2 lines value prop. Hover/focus reveals an expanded state with shortcuts (`Space = Start/Pause`, `R = Reset`) and the primary use case. On touch devices, expansion is triggered on first tap without shifting surrounding cards.
- **Grid consistency**: Cards stay uniform in height; expansion overlays within the card to avoid layout shifts. Reuse the existing golden-ratio spacing tokens for internal padding and gap.
- **Content parity**: When descriptions change in the About section, cards consume the same strings via shared data to avoid drift between sections.

### Files Involved

| File | Purpose |
|------|---------|
| `src/styles/home-swiss.css` | Home page design system (745 lines) |
| `src/components/DarkModeToggle.tsx` | Theme toggle component |
| `src/main.tsx` | Home page layout and routing |

## Responsive Behavior

### Desktop (1200px+)
- 3-column grid layout
- Full width layout with max-width constraint
- Normal spacing and typography

### Tablet (768px - 1199px)
- 2-column grid layout
- Adjusted spacing
- Responsive typography scale

### Mobile (< 768px)
- Single column or 2-column layout
- Adjusted padding and spacing
- Touch-friendly tap targets (44px minimum)

## Card Styling

### Timer Cards
```css
.home-timer-card {
  height: 180px;
  background: linear-gradient(135deg, #2a3f52 0%, #1f2f42 100%);
  border: 1px solid rgba(156, 175, 136, 0.25);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.home-timer-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  border-color: var(--sage-primary);
}

.home-timer-card:hover .timer-icon-container svg {
  color: var(--sage-primary);
  filter: drop-shadow(0 0 12px rgba(156, 175, 136, 0.6));
  transform: scale(1.12);
}
```

## Accessibility Considerations

1. **Color Contrast**
   - Dark text on light background: WCAG AAA compliant
   - Light text on dark background: WCAG AAA compliant

2. **Focus States**
   - All interactive elements have visible focus states
   - Keyboard navigation fully supported
   - Tab order is logical and predictable

3. **Motion & Animation**
   - Respects `prefers-reduced-motion` (future enhancement)
   - Smooth transitions (0.2s - 0.3s)
   - No auto-playing animations

4. **Typography**
   - Minimum 16px font size for readability
   - Proper heading hierarchy
   - Sufficient line-height for readability

## Performance Optimizations

1. **CSS-based Theming**
   - No JavaScript reflows for theme changes
   - Hardware acceleration via transform and will-change
   - Minimal paint operations

2. **Rendering**
   - Single background gradient per section
   - Efficient box-shadow usage
   - CSS Grid layout (optimized by browser)

3. **Bundle Size**
   - home-swiss.css: ~7KB (minified)
   - DarkModeToggle.tsx: ~1KB (minified)
   - Total impact: < 10KB

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Fallbacks for CSS Grid and flexbox

## Testing

### Manual Testing
- Dark mode toggle works bidirectionally
- localStorage persists preference
- Page reload maintains theme
- All interactive elements respond to hover/focus
- Layout is responsive across breakpoints

### Automated Testing
```bash
npm run test:e2e  # Playwright tests including theme toggle
```

## Future Enhancements

1. **System Preference Detection**
   - Respect OS dark mode preference on first visit
   - Currently defaults to dark mode

2. **Animation Preferences**
   - Reduce animations based on prefers-reduced-motion
   - Currently no detection implemented

3. **Additional Themes**
   - High contrast mode for accessibility
   - Additional color schemes
   - Custom user branding system

4. **Mobile Optimization**
   - Further refinement of mobile layout
   - Touch gesture support
   - Mobile-specific card layouts

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project overview and architecture
- [CHANGELOG.md](../CHANGELOG.md) - Version history and changes
- [README.md](../README.md) - General project documentation

---

Last Updated: 2025-11-04
Design System Version: 1.0.0
