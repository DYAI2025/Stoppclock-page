# Navigation & Pinned Timers Architecture

## Current State (Baseline - Day 0)

### Build Status ✅
- **npm run doctor**: ✅ Passes (warnings in worktree docs only)
- **npm run build**: ✅ Successful (1.74s, 373KB main bundle)
- **npm run test:e2e**: ⚠️ Requires `npx playwright install` (browsers not installed)

### Timer Pages (10 Total)
Located in `src/pages/`:
1. **Countdown** (`#/countdown`) - Digital HH:MM:SS countdown
2. **Stopwatch** (`#/stopwatch`) - Stopwatch with lap times
3. **Analog Clock** (`#/analog`) - Canvas-based analog countdown
4. **Cooking Timer** (`#/cooking`) - Kitchen timer with presets
5. **Couples Timer** (`#/couples`) - Paired timer for two people
6. **Chess Clock** (`#/chess`) - Dual-player turn timer
7. **Metronome** (`#/metronome`) - BPM-based rhythm tool
8. **World Clock** (`#/world`) - Multi-timezone display
9. **Alarm** (`#/alarm`) - Multiple alarms manager
10. **Pomodoro** (`#/pomodoro`) - Work/break cycle timer

### Routing System
**File**: `src/main.tsx`
- **Custom hash-based routing** using `useHashRoute()` hook
- No React Router dependency
- Routes format: `#/timer-name`
- Switch statement in `<App>` component renders pages

```tsx
function useHashRoute() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const f = () => force();
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return (location.hash || "#/").replace(/^#/, "");
}
```

### State Management

#### PinnedTimersContext ✅ (Exists)
**File**: `src/contexts/PinnedTimersContext.tsx`

**Current Implementation**:
```tsx
type PinnedTimer = {
  id: string;
  type: string;
  name: string;
};

type PinnedTimersContextType = {
  pinnedTimers: PinnedTimer[];
  addTimer: (timer: PinnedTimer) => void;
  removeTimer: (id: string) => void;
};
```

**Features**:
- ✅ Max 3 pins enforced
- ✅ Duplicate prevention
- ❌ **Missing**: localStorage persistence
- ❌ **Missing**: `isPinned(id)` helper
- ❌ **Missing**: UI integration

**Provider Wrap**: All pages wrapped in `<PinnedTimersProvider>` in main.tsx

### Shared Components

#### Existing Components ✅
- **TimerIcon** (`src/components/TimerIcon.tsx`) - SVG icons for all timer types
- **DarkModeToggle** (`src/components/DarkModeToggle.tsx`) - Theme switcher
- **LanguageToggle** (`src/components/LanguageToggle.tsx`) - DE/EN switcher
- **ConsentBanner** - GDPR consent UI
- **AdSenseScript** - Ad integration

#### Missing Components ❌
- **AppShell** - Global layout wrapper
- **HomeButton** - Persistent navigation to home
- **LiveAnnouncer** - ARIA-live region for timer events
- **PinnedTimersBar** - Display pinned timers on home
- **PinButton** - Toggle pin state

### Home Page Design
**File**: `src/main.tsx` (Home component)

**Current Features**:
- Premium glass-morphism timer cards
- Unique color per timer (Deep Ocean Aurora theme)
- Animated analog clock between "Stopp" and "Clock"
- ClockFactsBoard component
- 3-column grid (responsive: 3→2→2 columns)

**Card Structure**:
```tsx
<a href={route} className="home-timer-card" style={{...}}>
  <div className="timer-card-inner">
    <div className="timer-icon-container">
      <TimerIcon type={label} />
    </div>
    <span className="timer-label">{label}</span>
  </div>
</a>
```

**Missing**:
- Pinned timers bar above grid
- Pin/unpin buttons on cards
- Skip-to-content link

### Accessibility Current State

#### ✅ Present
- Semantic HTML structure
- Color contrast (Deep Ocean Aurora theme)
- Keyboard shortcuts (Space, R, F, L)

#### ❌ Missing
- Skip-to-content link
- Consistent focus indicators (`:focus-visible`)
- ARIA-live announcements for timer events
- `role="banner"` on headers
- `<main id="main">` landmark

### Styling System
**Files**:
- `src/design-tokens.css` - Deep Ocean Aurora color palette, typography scale
- `src/styles.css` - Global styles
- `src/styles/home-swiss.css` - Home page glass-morphism

**Design Tokens**:
- Colors: `--aurora-cyan`, `--aurora-purple`, `--aurora-lavender`, etc.
- Spacing: `--space-1` through `--space-24`
- Typography: `--type-xs` through `--type-5xl`

---

## Implementation Plan Summary

### Phase 1: Navigation Foundation (Days 1-2)
**Goal**: Consistent navigation and accessibility baseline

**Tasks**:
1. Create lightweight AppShell component (timer pages only)
2. Add persistent HomeButton to all timer pages
3. Implement skip-to-content link
4. Add `:focus-visible` styles globally

**Files to Create**:
- `src/components/layout/AppShell.tsx`
- `src/components/HomeButton.tsx`

**Files to Modify**:
- All timer pages (wrap in AppShell)
- `src/styles.css` (focus indicators)

### Phase 2: Active Timer Indicators (Day 3)
**Goal**: Show timer state in browser UI

**Tasks**:
1. Create `useActiveTimerTitle` hook
2. Integrate with Countdown, Stopwatch, Pomodoro

**Files to Create**:
- `src/hooks/useActiveTimerTitle.ts`

**Files to Modify**:
- `src/pages/Countdown.tsx`
- `src/pages/Stopwatch.tsx`
- `src/pages/Pomodoro.tsx`

### Phase 3: Pinned Timers (Days 4-5)
**Goal**: Persistent pinned timers with UI

**Tasks**:
1. Add localStorage persistence to PinnedTimersContext
2. Create PinnedTimersBar component
3. Add pin buttons to home cards
4. Add pin buttons to timer pages

**Files to Create**:
- `src/components/PinnedTimersBar.tsx`
- `src/components/PinButton.tsx`

**Files to Modify**:
- `src/contexts/PinnedTimersContext.tsx` (add persistence)
- `src/main.tsx` (add PinnedTimersBar to Home)
- All timer pages (add PinButton)

### Phase 4: Accessibility (Day 6)
**Goal**: ARIA-live announcements and audit

**Tasks**:
1. Create LiveAnnouncer component
2. Integrate with timer events
3. Conduct keyboard-only and screen reader testing
4. Document findings

**Files to Create**:
- `src/components/accessibility/LiveAnnouncer.tsx`
- `src/hooks/useLiveAnnouncer.ts`
- `docs/accessibility-check.md`

---

## Dependencies

### Runtime
- React 18.3.1
- TypeScript 5.6.3
- lucide-react 0.552.0 (icons)

### Build
- Vite 5.4.10
- @vitejs/plugin-react-swc 3.7.0

### Testing
- @playwright/test 1.48.0 (browsers need install)

---

## Notes

1. **No AppShell on Home**: Home page has custom design that shouldn't be wrapped
2. **Favicon Deferred**: Complex cross-timer coordination, low ROI
3. **Dual-Zone Cards Skipped**: Current UX is clean, unclear value
4. **Playwright**: Run `npx playwright install` before E2E tests
5. **localStorage Key**: Use `sc.v1.pinnedTimers` for persistence

---

**Last Updated**: Day 0 - Baseline established
**Next**: Day 1 - Start with HomeButton component (quick win)