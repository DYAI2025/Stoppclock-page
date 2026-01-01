# Platform & Screen Targets - Custom Sessions Feature

**Date:** 2025-12-04
**Task:** T0.2 - Zielplattformen & Screens definieren
**Status:** ✅ Complete

## Executive Summary

Custom Sessions feature will target 3 primary platforms (Desktop, Mobile Web, Tablet) with specific focus on presentation/projection scenarios. Typography and layout will be optimized for readability at distance (classrooms, seminars, couples sessions).

---

## Target Platforms

### Primary Platforms (Must Support)

| Platform | Priority | Use Cases | Notes |
|----------|----------|-----------|-------|
| **Desktop Browser** | 🔴 Critical | Presentation, workshop facilitation, personal use | Primary development target |
| **Mobile Web** | 🟡 High | Personal sessions, on-the-go timer | Responsive design |
| **Tablet** | 🟡 High | Presentation (propped up), personal use | iPad, Android tablets |

### Secondary Platforms (Nice-to-Have)

| Platform | Priority | Use Cases | Notes |
|----------|----------|-----------|-------|
| **Beamer/Projector** | 🟢 Medium | Classroom, seminar, conference | Via desktop browser in fullscreen |
| **Smart TV** | 🟢 Low | Home couples sessions | Browser-based, not dedicated app |

### Out of Scope

- ❌ Native mobile apps (iOS, Android)
- ❌ Desktop apps (Electron)
- ❌ Smart watch integration
- ❌ Voice assistants (Alexa, Google Home)

---

## Browser Support

### Minimum Requirements

Based on stoppclock.com's existing tech stack (React 18 + Vite):

| Browser | Version | Notes |
|---------|---------|-------|
| **Chrome** | ≥90 | Primary test browser |
| **Firefox** | ≥88 | Secondary test browser |
| **Safari** | ≥14 | iOS/macOS support |
| **Edge** | ≥90 | Chromium-based |

**Required APIs:**
- ✅ localStorage (all modern browsers)
- ✅ Web Audio API (bell tones, graceful fallback)
- ✅ Fullscreen API (presentation mode)
- ✅ StorageEvent (cross-tab sync via `useStorageSync`)

---

## Screen Resolutions & Breakpoints

### Desktop

| Resolution | Breakpoint | Layout | Priority |
|------------|------------|--------|----------|
| **1920×1080 (Full HD)** | ≥1280px | 2-column grid, large text | 🔴 Critical |
| **1280×720 (HD)** | ≥1024px | 2-column grid, medium text | 🔴 Critical |
| **1024×768 (XGA)** | ≥768px | 1-column grid, medium text | 🟡 High |

**Primary Target:** 1920×1080 (most common desktop + projector resolution)

### Mobile

| Device | Resolution | Breakpoint | Layout | Priority |
|--------|------------|------------|--------|----------|
| **iPhone 14/15** | 390×844 | ≥375px | Single column, stacked | 🟡 High |
| **Android (medium)** | 360×800 | ≥360px | Single column, stacked | 🟡 High |
| **iPhone SE** | 375×667 | ≥320px | Single column, compact | 🟢 Medium |

### Tablet

| Device | Resolution | Breakpoint | Layout | Priority |
|--------|------------|------------|--------|----------|
| **iPad (10.2")** | 810×1080 | ≥768px | 1-2 column hybrid | 🟡 High |
| **iPad Pro (11")** | 834×1194 | ≥834px | 2-column grid | 🟢 Medium |

### Projector/Beamer

| Resolution | Aspect Ratio | Notes | Priority |
|------------|--------------|-------|----------|
| **1920×1080** | 16:9 | Standard HD projector | 🔴 Critical |
| **1280×720** | 16:9 | Budget projectors | 🟡 High |
| **1024×768** | 4:3 | Legacy projectors | 🟢 Medium |

**Key Requirement:** Text must be readable from 5-10 meters distance.

---

## Responsive Breakpoints (Final)

Based on Tailwind CSS convention + stoppclock.com's existing styles:

```css
/* Mobile-first approach */
@media (min-width: 640px)  { /* sm: Large phones, small tablets */ }
@media (min-width: 768px)  { /* md: Tablets, small laptops */ }
@media (min-width: 1024px) { /* lg: Laptops, desktops */ }
@media (min-width: 1280px) { /* xl: Large desktops */ }
@media (min-width: 1536px) { /* 2xl: Very large screens */ }
```

**Recommended Breakpoints for Custom Sessions:**

| Breakpoint | Width | Target Devices | Layout Changes |
|------------|-------|----------------|----------------|
| `xs` (default) | <640px | Mobile phones | Single column, compact spacing |
| `sm` | ≥640px | Large phones | Single column, increased spacing |
| `md` | ≥768px | Tablets | 1-2 column hybrid, larger text |
| `lg` | ≥1024px | Laptops | 2-column grid, optimal spacing |
| `xl` | ≥1280px | Desktops | 2-column grid, maximum text size |

---

## Typography & Readability

### Font Families

**Current Stack:** Segoe UI (primary), system font fallback

```css
font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto',
             'Helvetica Neue', Arial, sans-serif;
```

**Recommendation:** Keep existing font stack (good cross-platform support).

### Font Sizes - Session Builder (Configuration View)

| Element | Mobile (xs) | Tablet (md) | Desktop (lg+) | Notes |
|---------|-------------|-------------|---------------|-------|
| **Page Title** | 1.5rem (24px) | 2rem (32px) | 2.5rem (40px) | "Custom Session Builder" |
| **Section Headings** | 1.125rem (18px) | 1.25rem (20px) | 1.5rem (24px) | "Add Elements", "Preview" |
| **Body Text** | 0.875rem (14px) | 1rem (16px) | 1rem (16px) | Instructions, labels |
| **Input Fields** | 1rem (16px) | 1rem (16px) | 1.125rem (18px) | Duration, focus text inputs |
| **Button Text** | 0.875rem (14px) | 1rem (16px) | 1rem (16px) | "Add Element", "Save" |
| **Timeline Labels** | 0.75rem (12px) | 0.875rem (14px) | 1rem (16px) | Phase names in preview |

### Font Sizes - Focus View (Live Session)

**Critical Requirement:** Text must be readable from 5-10 meters distance.

| Element | Mobile (xs) | Tablet (md) | Desktop (lg) | Projector (xl+) | Notes |
|---------|-------------|-------------|--------------|-----------------|-------|
| **Focus Text (Primary)** | 1.5rem (24px) | 2rem (32px) | 3rem (48px) | **4rem (64px)** | User-defined text, **most important** |
| **Timer Display** | 3rem (48px) | 4rem (64px) | 6rem (96px) | **8rem (128px)** | MM:SS countdown |
| **Phase Title** | 1.25rem (20px) | 1.5rem (24px) | 2rem (32px) | 2.5rem (40px) | "Person A Speaks", "Transition" |
| **Guidance Text** | 0.875rem (14px) | 1rem (16px) | 1.25rem (20px) | 1.5rem (24px) | Secondary instructions |
| **Control Buttons** | 1rem (16px) | 1.125rem (18px) | 1.25rem (20px) | 1.5rem (24px) | Pause, Next, Reset |

**Key Rules:**
- Focus Text: **Auto-scale based on length** (if >100 chars, reduce by 20%)
- Timer Display: **Monospace font** for alignment (`font-variant-numeric: tabular-nums`)
- High Contrast: White text on dark background (#FFFFFF on #0b1220)

### Line Height & Spacing

| Context | Line Height | Letter Spacing | Notes |
|---------|-------------|----------------|-------|
| **Focus Text (Live)** | 1.3 | 0.01em | Tight for readability |
| **Body Text (Builder)** | 1.5 | normal | Standard reading |
| **Timer Display** | 1.0 | 0.05em | Wide for clarity |
| **Headings** | 1.2 | -0.02em | Tight, bold |

---

## Color Contrast Requirements

### WCAG 2.1 AA Compliance

| Use Case | Foreground | Background | Contrast Ratio | Pass? |
|----------|------------|------------|----------------|-------|
| **Focus Text (Live)** | #FFFFFF | #0b1220 | 18.5:1 | ✅ AAA |
| **Timer Display** | #FFFFFF | #0b1220 | 18.5:1 | ✅ AAA |
| **Body Text** | #FFFFFF | #1a2332 | 14.2:1 | ✅ AAA |
| **Button Text** | #FFFFFF | #DC143C | 4.8:1 | ✅ AA |
| **Input Labels** | #FFFFFF | #0b1220 | 18.5:1 | ✅ AAA |

**Tool:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Minimum Requirement:** WCAG AA (4.5:1 for normal text, 3:1 for large text)

---

## Layout Requirements

### Session Builder (Configuration View)

**Desktop (≥1024px):**
```
┌─────────────────────────────────────────┐
│  Header: "Custom Session Builder"      │
├─────────────┬───────────────────────────┤
│  Sidebar    │  Main Content Area        │
│  - Presets  │  - Session Elements List  │
│  - Templates│  - Add Element Form       │
│  - Settings │  - Timeline Preview       │
│  (30% width)│  (70% width)              │
└─────────────┴───────────────────────────┘
│  Footer: Save, Start Session buttons   │
└─────────────────────────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────────┐
│  Header         │
├─────────────────┤
│  Session List   │
│  (stacked)      │
├─────────────────┤
│  Add Element    │
│  (collapsed)    │
├─────────────────┤
│  Timeline       │
│  (horizontal    │
│   scroll)       │
├─────────────────┤
│  Actions        │
│  (sticky bottom)│
└─────────────────┘
```

### Focus View (Live Session)

**All Platforms:**
```
┌─────────────────────────────────────────┐
│         Phase Title (centered)          │
│      "Person A Speaks" / "Transition"   │
├─────────────────────────────────────────┤
│                                         │
│     ╔═════════════════════════╗         │
│     ║   FOCUS TEXT (LARGE)    ║         │
│     ║   User-defined content  ║         │
│     ║   Vertically centered   ║         │
│     ╚═════════════════════════╝         │
│                                         │
├─────────────────────────────────────────┤
│         Timer Display (MM:SS)           │
│            08:32 (huge font)            │
├─────────────────────────────────────────┤
│  [Pause]  [Next]  [Reset]  [Fullscreen]│
│       (icon + text buttons)             │
└─────────────────────────────────────────┘
```

**Key Principles:**
- **Maximum content area** for focus text (60-70% of viewport height)
- **Vertical centering** of focus text
- **Minimal distractions** (no sidebars, minimal UI chrome)
- **High contrast** colors
- **Sticky controls** at bottom (desktop) or hidden until hover/tap (mobile)

---

## Fullscreen Mode

### Trigger Mechanisms

| Platform | Trigger | Notes |
|----------|---------|-------|
| **Desktop** | F key or button | Keyboard shortcut + on-screen button |
| **Mobile** | Button only | No F key, tap button |
| **Tablet** | Button only | Touch-optimized button |

### Fullscreen Behavior

1. **Enter Fullscreen:**
   - Hide browser chrome (address bar, tabs)
   - Hide app header/navigation
   - Show only Focus View content + controls
   - Increase font sizes by 20% (desktop/projector)

2. **Exit Fullscreen:**
   - Restore normal layout
   - Show header/navigation
   - Restore default font sizes

**Implementation:** Native Fullscreen API (already used in existing timers)

---

## Touch Targets & Interaction

### Minimum Touch Target Sizes (Mobile)

Per [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/) and [Material Design](https://material.io/design/usability/accessibility.html#layout-and-typography):

| Element | Minimum Size | Recommended Size | Notes |
|---------|--------------|------------------|-------|
| **Buttons** | 44×44 px | 48×48 px | Primary actions |
| **Icon Buttons** | 44×44 px | 56×56 px | Pause, play, reset |
| **Input Fields** | 44px height | 48px height | Touch-friendly |
| **Checkboxes** | 24×24 px | 32×32 px | With 44px touch area |
| **Slider Handles** | 44×44 px | 48×48 px | Drag targets |

### Spacing

- **Minimum gap between touch targets:** 8px (prevents mis-taps)
- **Recommended gap:** 12-16px

---

## Performance Targets

### Load Time

| Metric | Target | Measurement | Notes |
|--------|--------|-------------|-------|
| **First Contentful Paint (FCP)** | <1.5s | Lighthouse | Initial content visible |
| **Time to Interactive (TTI)** | <3.0s | Lighthouse | App fully interactive |
| **Largest Contentful Paint (LCP)** | <2.5s | Core Web Vitals | Main content loaded |

### Runtime Performance

| Metric | Target | Notes |
|--------|--------|-------|
| **Timer Update Frequency** | 60 FPS | Use RAF loop (existing implementation) |
| **UI Latency** | <200ms | Button clicks, phase transitions |
| **Storage Write Debounce** | 150ms | Existing pattern, maintain |

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

| Guideline | Requirement | Implementation |
|-----------|-------------|----------------|
| **1.4.3 Contrast (Minimum)** | 4.5:1 normal, 3:1 large | White on charcoal (#0b1220) = 18.5:1 ✅ |
| **1.4.4 Resize Text** | Up to 200% zoom | Relative units (rem, em), test at 200% |
| **1.4.10 Reflow** | No 2D scroll at 320px | Responsive design, no horizontal scroll |
| **2.1.1 Keyboard** | All functions keyboard-accessible | Space, R, F, Tab navigation |
| **2.4.7 Focus Visible** | Visible focus indicators | Outline on buttons, inputs |
| **3.2.4 Consistent Identification** | Consistent UI patterns | Reuse stoppclock.com's button styles |

### Screen Reader Support

**Key Requirements:**
- Semantic HTML (headings, buttons, landmarks)
- ARIA labels for icon-only buttons
- Live region announcements for timer/phase changes
- Skip navigation links

**Test Tools:**
- NVDA (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

---

## Testing Matrix

### Devices & Browsers (Minimum Coverage)

| Platform | Device | Browser | Resolution | Priority |
|----------|--------|---------|------------|----------|
| **Desktop** | Windows 11 | Chrome 120+ | 1920×1080 | 🔴 Critical |
| **Desktop** | macOS 14 | Safari 17+ | 2560×1440 | 🟡 High |
| **Mobile** | iPhone 14 | Safari iOS 17+ | 390×844 | 🟡 High |
| **Mobile** | Samsung Galaxy S23 | Chrome Android | 360×800 | 🟡 High |
| **Tablet** | iPad (10.2") | Safari iOS 17+ | 810×1080 | 🟢 Medium |
| **Projector** | Windows 11 | Chrome (fullscreen) | 1920×1080 | 🔴 Critical |

### Test Scenarios

1. **Session Builder:**
   - Add/edit/delete elements on all breakpoints
   - Drag-drop reordering (desktop only)
   - Timeline preview accuracy
   - Save session as template

2. **Focus View:**
   - Readability at 5m distance (projector)
   - Timer accuracy (60min session)
   - Phase transitions (audio + visual)
   - Keyboard shortcuts (Space, R, F)

3. **Fullscreen Mode:**
   - Enter/exit on all platforms
   - Font size scaling
   - Control visibility

4. **Cross-Platform:**
   - State persistence across page reloads
   - Cross-tab sync (open 2 tabs, edit in one)
   - Portrait/landscape orientation (mobile)

---

## Design Mockups (To Be Created in T1.3, T1.4)

### Required Mockups

1. **Session Builder (Desktop):** T1.3
   - Main layout (sidebar + content area)
   - Add element form
   - Timeline preview

2. **Session Builder (Mobile):** T1.3
   - Stacked layout
   - Collapsed forms

3. **Focus View (Desktop):** T1.4
   - Large focus text + timer
   - Control layout

4. **Focus View (Projector):** T1.4
   - Maximum font sizes
   - High contrast

5. **Focus View (Mobile):** T1.4
   - Vertical layout
   - Touch-optimized controls

---

## Constraints & Trade-offs

### Constraints

1. **No Native Apps:** Web-only, must work in browser
2. **Offline-First:** PWA requirement (existing stoppclock.com pattern)
3. **Performance Budget:** Lighthouse score >90 (constitution requirement)
4. **No External Fonts:** Use system fonts only (performance)

### Trade-offs

| Decision | Trade-off | Rationale |
|----------|-----------|-----------|
| **Desktop-First Design** | Mobile UX slightly compromised | Primary use case is presentation/facilitation |
| **System Fonts Only** | Less design control | Performance + offline-first requirement |
| **No Drag-Drop on Mobile** | Desktop-only feature | Touch drag-drop is complex, use buttons instead |
| **Single-Column Mobile** | More scrolling | Better readability, avoids horizontal scroll |

---

## Implementation Priorities

### Phase 1 (MVP)

- ✅ Desktop (≥1024px) - Session Builder + Focus View
- ✅ Projector (≥1280px) - Focus View only
- ✅ Keyboard shortcuts (Space, R, F)

### Phase 2 (Post-MVP)

- ⏭️ Tablet (768-1023px) - Hybrid layout
- ⏭️ Mobile (320-767px) - Stacked layout
- ⏭️ Touch-optimized controls

### Phase 3 (Future)

- 🔮 Landscape mobile optimization
- 🔮 iPad Pro-specific layout (large tablets)
- 🔮 Smart TV browser support

---

## Next Steps (Task T0.3)

1. ✅ **Completed:** Platform & screen targets
2. ⏭️ **Next:** Establish KPIs for Custom Sessions feature
3. ⏭️ **After:** Define user journeys and flows (T1.1)

---

**End of Document**
