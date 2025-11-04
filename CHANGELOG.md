# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/en/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Dark/Light Mode Toggle** - Professional theme switching on home page
  - New `DarkModeToggle.tsx` component with moon/sun icons
  - Persistent theme preference via localStorage (`sc.theme-mode`)
  - CSS-based theme system using `html[data-theme]` attribute
  - Default to dark mode with option to switch to light mode

### Changed
- **Home Page Design System** - Professional Swiss/Bauhaus design
  - Color palette: Sage Green (#9CAF88) + Charcoal (#2C3E50)
  - Golden ratio spacing and typography
  - Minimalist 1px borders with subtle shadows
  - Uniform timer card sizing (180px height)
  - Clear visual separation between Timer and Pillar sections
  - Improved grid alignment and centering

### Fixed
- **Dark Mode Toggle Bug** (commit b925181)
  - Toggle button now properly switches between dark and light modes
  - Fixed state initialization conflict with localStorage
  - Fixed useEffect dependency tracking
  - Proper CSS selector application for theme changes
  - localStorage persistence working correctly across page reloads

---

## Home Page Redesign Details

### Phase 1: Design System (commit ff0434b)
- Created comprehensive `src/styles/home-swiss.css` (745 lines)
- Defined Sage Green + Charcoal color system with CSS custom properties
- Implemented minimalist design principles
- Applied to blog pages initially

### Phase 2: Home Page Only Focus (commit a9a7b4e)
- User feedback: "die hauptseite nur. landingpage"
- Narrowed scope to home page only (not all 5 blog pages)
- Created `home-swiss.css` for home page specific styling
- Overrode conflicting styles from global `styles.css` with !important flags

### Phase 3: Dark Mode & Layout Fixes (commit 808fade)
- Changed background to dark gradient (#1a2332 → #0f1419)
- Made all timer cards exactly 180px height (uniform sizing)
- Created `DarkModeToggle.tsx` component
- Added localStorage persistence for theme preference
- Fixed default theme to dark mode

### Phase 4: Section Separation & Fixes (commit fa4fb21)
- Fixed bidirectional dark/light mode toggle
- Split timers into two arrays (timers and pillars)
- Added "Explore Further" section with Space for Time pillar
- Renamed "Raum für Zeit" to "Space for Time" (internationalization)
- Added html[data-theme="light"] CSS selectors for light mode overrides

### Phase 5: Grid Alignment Fix (commit ff0581c)
- Fixed misaligned timer cards
- Added proper centering: `margin: 0 auto` on .home-grid
- Added `place-items: center` for grid item alignment
- Updated .home-section with flexbox layout
- Added padding and spacing fixes

### Phase 6: Dark Mode Toggle Fix (commit b925181) - CURRENT
- Fixed state initialization using lazy initializer
- Wrapped applyTheme in useCallback for proper memoization
- Fixed circular dependency in useEffect
- Verified toggle works bidirectionally
- Confirmed localStorage persistence
- CSS selectors properly applied for both themes

---

## Current State

✅ **Home Page Redesign Complete**
- Professional appearance (no longer looks like "Schulprojekt")
- Dark and light mode fully functional
- Proper spacing and alignment
- Clear section separation
- localStorage persistence
- Responsive and modern design

📋 **Next Steps (Deferred)**
- Monetization implementation (Google Ads)
- Blog page redesign (other 5 pages)
- SEO content machine (articles, FAQ)
- Traffic growth strategy

---

## Git Commits Summary

| Commit | Description |
|--------|-------------|
| `b925181` | fix: Dark mode toggle now properly switches between light and dark modes |
| `ff0581c` | fix: Correct grid alignment and card centering on home page |
| `fa4fb21` | feat: Add section separation, rename "Raum für Zeit" to "Space for Time" |
| `808fade` | feat: Dark mode toggle and uniform card sizing |
| `a9a7b4e` | fix: Override timer card gradients, fix dark background |
| `ff0434b` | feat: Create professional design system (blog-swiss.css) |

---

## Testing

All dark/light mode toggle functionality has been tested:

```bash
# Automated verification test
Test 1: Initial load - should default to dark mode ✓
Test 2: Toggle to light mode ✓
Test 3: Toggle back to dark mode ✓
Test 4: Verify localStorage persistence ✓
Test 5: Reload page - should maintain preference ✓
```

---

## Files Modified

### New Files
- `src/components/DarkModeToggle.tsx` - Theme toggle component
- `src/styles/home-swiss.css` - Home page professional design

### Modified Files
- `src/main.tsx` - Added DarkModeToggle import and placement
- `README.md` - Updated with design system info
- `CHANGELOG.md` - This file

---

## Color System

### Dark Mode (Default)
- Background: `linear-gradient(180deg, #1a2332 0%, #0f1419 100%)`
- Text: `#e8eaed` (light gray)
- Card Background: `linear-gradient(135deg, #2a3f52 0%, #1f2f42 100%)`
- Border: `rgba(156, 175, 136, 0.25)` (sage with transparency)
- Primary Accent: `#9CAF88` (sage green)

### Light Mode
- Background: `linear-gradient(180deg, #f8f9fa 0%, #f0f1f5 100%)`
- Text: `#1a1f2e` (dark charcoal)
- Card Background: Same dark gradient (for contrast)
- Border: `rgba(156, 175, 136, 0.2)`
- Primary Accent: `#9CAF88` (sage green)

---

## localStorage Keys

- `sc.theme-mode` - User's theme preference ('dark' or 'light')

---

Generated with [Claude Code](https://claude.com/claude-code)
