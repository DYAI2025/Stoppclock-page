# Stoppclock - Iterative Development Plan
**Version:** 1.0
**Created:** January 10, 2026
**Status:** Ready for Execution
**Estimated Duration:** 5 weeks (100 hours)
**Goal:** Achieve Constitution compliance and production readiness

---

## Table of Contents

1. [Plan Overview](#plan-overview)
2. [Pre-Flight Checklist](#pre-flight-checklist)
3. [Sprint 0: Setup & Preparation](#sprint-0-setup--preparation)
4. [Sprint 1: Critical Fixes & Performance](#sprint-1-critical-fixes--performance)
5. [Sprint 2: Code Quality & Refactoring](#sprint-2-code-quality--refactoring)
6. [Sprint 3: UX & Testing](#sprint-3-ux--testing)
7. [Sprint 4: Accessibility & PWA](#sprint-4-accessibility--pwa)
8. [Sprint 5: Polish & Validation](#sprint-5-polish--validation)
9. [Post-Launch Monitoring](#post-launch-monitoring)
10. [Risk Management](#risk-management)
11. [Rollback Procedures](#rollback-procedures)
12. [Success Metrics](#success-metrics)

---

## Plan Overview

### Current State
- **Health Score:** 72/100
- **Lighthouse Score:** ~60-75
- **Load Time (3G):** 18-20s
- **Bundle Size:** 645KB
- **Test Coverage:** 45%
- **Critical Bugs:** 5
- **Constitution Compliance:** 4/6 principles passing

### Target State (After 5 Weeks)
- **Health Score:** 90+/100
- **Lighthouse Score:** 92+
- **Load Time (3G):** <2s
- **Bundle Size:** <150KB initial
- **Test Coverage:** 70%+
- **Critical Bugs:** 0
- **Constitution Compliance:** 6/6 principles passing ✅

### Development Philosophy

**Iterative Approach:**
1. Each sprint delivers **working, tested, deployable code**
2. No sprint breaks existing functionality
3. Each change is **reversible** (feature flags where needed)
4. **Test-first** for critical changes
5. **Constitution compliance** validated at each milestone

**Sprint Structure:**
- Duration: 1 week (20 hours)
- Daily commits to feature branch
- Mid-sprint checkpoint (day 3)
- End-of-sprint review & merge
- Automated deployment to staging

---

## Pre-Flight Checklist

**Before Starting Sprint 0:**

### 1. Environment Setup
- [ ] Verify Node.js version ≥18
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` - dev server starts on :5173
- [ ] Run `npm run build` - builds without errors
- [ ] Run `npm run test:e2e` - all 51 tests pass
- [ ] Run `npm run doctor` - passes without forbidden tokens

### 2. Git Hygiene
- [ ] Current branch: `main`
- [ ] Working directory clean (no uncommitted changes)
- [ ] All remote changes pulled
- [ ] Create development branch: `git checkout -b dev/iterative-improvements`

### 3. Baseline Metrics Capture
- [ ] Run Lighthouse audit on production build (save report)
- [ ] Measure build output size: `ls -lh dist/assets/`
- [ ] Run test suite and capture coverage report
- [ ] Document current test count (51 tests)
- [ ] Take screenshots of all 12 timer types (visual regression baseline)

### 4. Backup & Safety
- [ ] Create backup branch: `git branch backup/pre-improvements`
- [ ] Export current localStorage schemas (document format)
- [ ] Tag current state: `git tag pre-improvements-baseline`

### 5. Tooling Installation
```bash
# Performance monitoring
npm install --save-dev lighthouse webpack-bundle-analyzer

# Testing enhancements
npm install --save-dev @axe-core/playwright

# Development utilities
npm install --save-dev vite-plugin-inspect
```

---

## Sprint 0: Setup & Preparation
**Duration:** 3 hours
**Goal:** Establish development infrastructure and validation tools

### Tasks

#### Task 0.1: Create Feature Branch Structure (30 min)
**What:**
```bash
git checkout -b dev/iterative-improvements
git checkout -b feature/sprint-1-performance
```

**Why:** Isolate changes, enable parallel work, easy rollback

**Acceptance Criteria:**
- [ ] Branch `dev/iterative-improvements` exists
- [ ] Feature branch for Sprint 1 created
- [ ] Branch protection rules documented

---

#### Task 0.2: Set Up Automated Testing Pipeline (1 hour)
**What:** Configure GitHub Actions or local automation for pre-merge validation

**Steps:**
1. Create `.github/workflows/validation.yml`:
   - Run `npm run build`
   - Run `npm run test:e2e`
   - Run `npm run doctor`
   - Lighthouse CI check (fail if score <85)
   - Bundle size check (fail if >200KB)

2. Create local pre-commit hook:
   ```bash
   .git/hooks/pre-commit
   # Run doctor, tests, build
   ```

**Acceptance Criteria:**
- [ ] Validation workflow runs on every PR
- [ ] Pre-commit hook prevents broken commits
- [ ] Lighthouse CI integrated
- [ ] Bundle size monitoring active

---

#### Task 0.3: Create Constitution Validation Script (45 min)
**What:** Automated script to verify all 6 constitution principles

**File:** `scripts/validate-constitution.mjs`

**Checks:**
1. Privacy First: No tracking without consent (grep for analytics/adsense in main bundle)
2. Performance: Lighthouse score >90, load time <2s
3. Classroom Optimized: Fullscreen mode exists, no ads during timer usage
4. Progressive Enhancement: Timers work without ads loaded
5. Accessibility: WCAG 2.1 AA compliance (axe-core scan)
6. Code Quality: TypeScript strict, tests pass, no console errors

**Acceptance Criteria:**
- [ ] Script runs: `npm run validate:constitution`
- [ ] Returns exit code 0 if passing, 1 if failing
- [ ] Generates detailed report: `constitution-report.json`
- [ ] Integrated into CI/CD pipeline

---

#### Task 0.4: Document Current Architecture (45 min)
**What:** Create reference documentation for safe refactoring

**Files to Create:**
1. `docs/ARCHITECTURE_SNAPSHOT.md` - Current file structure
2. `docs/COMPONENT_INVENTORY.md` - All React components
3. `docs/STATE_SCHEMAS.md` - All localStorage schemas (v1)
4. `docs/DEPENDENCIES.md` - Component dependency graph

**Why:** Prevent accidental breaking changes, understand impact of refactoring

**Acceptance Criteria:**
- [ ] All 4 documents created
- [ ] Component count documented (34 pages, 33 components)
- [ ] State schemas exported (12 timer types)
- [ ] Dependency graph shows high-risk refactoring targets

---

### Sprint 0 Definition of Done
- [ ] All pre-flight checklist items completed
- [ ] All Sprint 0 tasks completed
- [ ] Baseline metrics captured and documented
- [ ] Development infrastructure operational
- [ ] Constitution validation script passing baseline
- [ ] Team reviewed and approved sprint plan

---

## Sprint 1: Critical Fixes & Performance
**Duration:** 1 week (20 hours)
**Branch:** `feature/sprint-1-performance`
**Goal:** Fix critical bugs and achieve Lighthouse >80, load time <5s

### Milestone Objectives
- ✅ Fix 5 critical bugs (safety issues)
- ✅ Implement code splitting (75% bundle reduction)
- ✅ Optimize RAF loops (40% FPS improvement)
- ✅ Add keyboard shortcut hints (10x discoverability)
- ✅ Lighthouse score: 65 → 80

---

### Task 1.1: Fix CookingTimer Alarm Repetition Bug (2 hours)
**Priority:** P0 - CRITICAL (Safety Issue)

**Problem:** Alarm plays once instead of repeating every 2s for 60s

**File:** `src/pages/CookingTimer.tsx` lines 354-394

**Steps:**
1. **Read current implementation** (15 min)
   - Understand `sync()` function logic
   - Identify where alarm should repeat
   - Review `playAlarm()` function

2. **Write failing test first** (30 min)
   - Create `tests/e2e/cooking-timer-alarm.spec.ts`
   - Test: "should beep every 2 seconds for 60 seconds"
   - Mock audio playback
   - Verify 30 total beeps

3. **Implement fix** (45 min)
   - Add `playAlarm()` call inside alarm duration check
   - Add throttling to prevent audio spam
   - Ensure state updates don't break repetition

4. **Verify fix** (30 min)
   - Run new test: `npx playwright test cooking-timer-alarm`
   - Manual test: Set 1-second timer, verify alarm behavior
   - Check no audio overlap issues

**Acceptance Criteria:**
- [ ] Test passes (30 beeps over 60 seconds)
- [ ] Manual verification: alarm audible in kitchen scenario
- [ ] No audio overlapping or distortion
- [ ] State persists correctly during alarm
- [ ] Git commit: `fix(cooking-timer): implement 60-second alarm repetition (#2)`

**Risk Mitigation:**
- If audio API throttles, implement queue system
- If state updates break alarm, use ref for alarm state

---

### Task 1.2: Fix CookingTimer Adjust Logic Bug (1.5 hours)
**Priority:** P0 - CRITICAL (Data Corruption)

**Problem:** Adjusting running timer corrupts time calculation

**File:** `src/pages/CookingTimer.tsx` lines 466-486

**Steps:**
1. **Write regression test** (30 min)
   - Test: "should correctly adjust running timer by +30s"
   - Set timer to 2:00, start it
   - Wait 30s (remaining: 1:30)
   - Click +30s button
   - Verify remaining: 2:00 (not incorrect value)

2. **Implement fix** (45 min)
   - Calculate new `remainingMs` without resetting `startedAt`
   - Option A: Adjust `durationMs` and recalculate `startedAt`
   - Option B: Adjust `remainingMs` and keep `startedAt` unchanged
   - Choose most accurate approach

3. **Verify accuracy** (15 min)
   - Test multiple scenarios: +1m, +5m, multiple adjustments
   - Verify time doesn't drift
   - Check edge cases: adjust at 0s remaining

**Acceptance Criteria:**
- [ ] Regression test passes
- [ ] Multiple adjustments accumulate correctly
- [ ] Time doesn't drift after adjustment
- [ ] Edge cases handled (0s remaining, paused timer)
- [ ] Git commit: `fix(cooking-timer): preserve time reference on adjustment (#3)`

---

### Task 1.3: Fix Countdown Negative Duration Bug (1 hour)
**Priority:** P0 - CRITICAL (State Corruption)

**Problem:** Rapid "-1m" clicks create negative `durationMs`

**File:** `src/pages/Countdown.tsx` lines 367-376

**Steps:**
1. **Write test** (20 min)
   - Test: "should prevent negative duration on rapid adjust"
   - Set timer to 1:00
   - Click "-1m" button 3 times rapidly
   - Verify `durationMs >= 0`

2. **Implement fix** (30 min)
   - Clamp both `remainingMs` AND `durationMs`
   - Ensure atomic state update
   - Add min/max validation

3. **Verify** (10 min)
   - Run test
   - Manual test: spam "-1m" button
   - Check state in React DevTools

**Acceptance Criteria:**
- [ ] Test passes
- [ ] `durationMs` never negative
- [ ] Reset works correctly after clamping
- [ ] Git commit: `fix(countdown): prevent negative duration state (#1)`

---

### Task 1.4: Fix ChessClock Time Loss Bug (1 hour)
**Priority:** P1 - HIGH (Competitive Fairness)

**Problem:** Edge case where `startedAt` null causes time loss

**File:** `src/pages/ChessClock.tsx` lines 319-345

**Steps:**
1. **Write test** (20 min)
   - Test: "should not lose time on rapid player switch"
   - Start player 1
   - Click switch twice within 50ms
   - Verify only 1 switch occurred
   - Verify time correctly deducted

2. **Implement fix** (30 min)
   - Add explicit null check for `startedAt`
   - Prevent switch if `startedAt` is null
   - Add switch debouncing (100ms minimum)

3. **Verify** (10 min)
   - Run test
   - Manual test: rapid clicking
   - Test with React DevTools

**Acceptance Criteria:**
- [ ] Test passes
- [ ] Rapid clicks handled gracefully
- [ ] Time deduction accurate to ±50ms
- [ ] Git commit: `fix(chess-clock): prevent time loss on rapid switch (#4)`

---

### Task 1.5: Fix Metronome Scheduler Leak (1 hour)
**Priority:** P1 - HIGH (Memory Leak)

**Problem:** Interval not cleared when BPM changes

**File:** `src/pages/Metronome.tsx` lines 141-170

**Steps:**
1. **Write memory test** (20 min)
   - Test: "should not leak intervals on BPM change"
   - Start metronome
   - Change BPM 10 times
   - Verify only 1 interval active

2. **Implement fix** (30 min)
   - Clear interval before creating new one
   - Use ref pattern to avoid effect re-run
   - Ensure cleanup on unmount

3. **Verify** (10 min)
   - Run test
   - Check Performance Monitor for leaks
   - Manual test: change BPM while running

**Acceptance Criteria:**
- [ ] Test passes
- [ ] No overlapping audio clicks
- [ ] Memory stable over time
- [ ] Git commit: `fix(metronome): prevent scheduler interval leak (#5)`

---

### Task 1.6: Implement Code Splitting (4 hours)
**Priority:** P0 - CRITICAL (Performance)

**Problem:** 645KB bundle, all 34 routes loaded upfront

**File:** `src/main.tsx` lines 5-46

**Steps:**

#### Step 1: Convert to React.lazy (1.5 hours)
1. **Backup current imports** (10 min)
   ```bash
   cp src/main.tsx src/main.tsx.backup
   ```

2. **Replace static imports** (1 hour)
   ```typescript
   // Before:
   import AnalogCountdown from "./pages/AnalogCountdown";

   // After:
   const AnalogCountdown = React.lazy(() => import('./pages/AnalogCountdown'));
   ```
   - Convert all 34 timer/content page imports
   - Keep component imports static (HomeButton, ConsentBanner, etc.)
   - Keep context/hook imports static

3. **Add Suspense wrapper** (20 min)
   ```typescript
   <Suspense fallback={<LoadingSpinner />}>
     {route === "/analog" && <AnalogCountdown />}
     {/* ... */}
   </Suspense>
   ```

#### Step 2: Create Loading Component (30 min)
1. **Create `src/components/LoadingSpinner.tsx`**
   - Simple spinner with Stoppclock branding
   - Matches design system colors
   - Minimal size (<1KB)

2. **Add loading state styling**
   - Center spinner on screen
   - Fade-in animation
   - Match current theme

#### Step 3: Configure Vite Chunking (1 hour)
1. **Update `vite.config.ts`**:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom'],
           'markdown-vendor': ['react-markdown', 'remark-gfm'],
           'timers-analog': ['./src/pages/AnalogCountdown.tsx'],
           'timers-digital': ['./src/pages/Countdown.tsx', './src/pages/Stopwatch.tsx'],
           // ... group related timers
         }
       }
     }
   }
   ```

2. **Test bundle output**:
   ```bash
   npm run build
   ls -lh dist/assets/
   ```
   - Verify main bundle <150KB
   - Verify route chunks lazy-loaded

#### Step 4: Verify and Test (1 hour)
1. **Build and analyze** (20 min)
   ```bash
   npm run build
   npx vite-bundle-visualizer
   ```
   - Review bundle composition
   - Identify oversized chunks

2. **Test lazy loading** (20 min)
   - Open dev tools Network tab
   - Navigate to each timer
   - Verify chunk loaded on demand
   - Check no duplicate loads

3. **Run E2E tests** (20 min)
   ```bash
   npm run test:e2e
   ```
   - Verify all 51 tests still pass
   - Check loading states don't break tests

**Acceptance Criteria:**
- [ ] Main bundle <150KB (75% reduction from 645KB)
- [ ] Each route lazy-loaded (verify in Network tab)
- [ ] Loading spinner appears briefly on navigation
- [ ] All E2E tests pass
- [ ] Build time unchanged or faster
- [ ] Git commit: `perf: implement code splitting for routes (75% bundle reduction)`

**Risk Mitigation:**
- If loading too slow, preload critical routes
- If tests break, adjust Playwright wait strategies
- Keep backup of working main.tsx

---

### Task 1.7: Optimize RAF Rendering (2.5 hours)
**Priority:** P0 - CRITICAL (Performance)

**Problem:** Canvas renders at 60 FPS even when paused

**Files:**
- `src/pages/AnalogCountdown.tsx` lines 410-413
- `src/main.tsx` (HomeAnalogClock) lines 59-151

**Steps:**

#### Step 1: Fix AnalogCountdown Double RAF (1 hour)
1. **Analyze current implementation** (15 min)
   - Line 340: `useRaf(st.running, sync)` - updates state
   - Line 410: `useRaf(true, () => draw(...))` - redraws canvas
   - Identify redundancy

2. **Implement conditional rendering** (30 min)
   ```typescript
   const [needsRedraw, setNeedsRedraw] = useState(true);

   useRaf(st.running || needsRedraw, () => {
     const c = cnvRef.current;
     if (c) {
       draw(c, st);
       setNeedsRedraw(false);
     }
   });

   // Trigger redraw on state changes
   useEffect(() => {
     setNeedsRedraw(true);
   }, [st.durationMs, st.remainingMs]);
   ```

3. **Test performance** (15 min)
   - Use Chrome DevTools Performance tab
   - Record while timer paused
   - Verify 0 FPS (no rendering)
   - Record while timer running
   - Verify 60 FPS maintained

#### Step 2: Optimize Home Page Clock (1 hour)
1. **Change to second-boundary updates** (30 min)
   ```typescript
   const lastSecondRef = useRef(-1);

   const drawClock = () => {
     const now = new Date();
     const currentSecond = now.getSeconds();

     if (lastSecondRef.current !== currentSecond) {
       lastSecondRef.current = currentSecond;
       // Only redraw when second changes
       // ... draw logic
     }

     animationId = requestAnimationFrame(drawClock);
   };
   ```

2. **Alternative: CSS animations** (30 min)
   - Consider replacing Canvas with CSS transforms
   - Potentially better performance
   - Smaller bundle size

#### Step 3: Verify Improvements (30 min)
1. **Measure FPS reduction** (15 min)
   - Chrome DevTools: Record performance
   - Compare before/after
   - Target: 60 FPS → 1 FPS for home clock

2. **Battery test** (15 min)
   - Open on mobile device
   - Leave home page open 10 minutes
   - Compare battery drain before/after
   - Expected: 50% reduction

**Acceptance Criteria:**
- [ ] Analog countdown: 0 FPS when paused, 60 FPS when running
- [ ] Home clock: 1 FPS instead of 60 FPS
- [ ] No visual degradation
- [ ] All timers still smooth
- [ ] Git commit: `perf: optimize canvas rendering (60→1 FPS when idle)`

---

### Task 1.8: Add Keyboard Shortcut Visual Hints (3 hours)
**Priority:** P1 - HIGH (UX - Discoverability)

**Problem:** Users don't know Space/R/F/L shortcuts exist

**Files:** All timer pages using `useKeyboardShortcuts`

**Steps:**

#### Step 1: Create Shortcut Hint Component (1 hour)
1. **Create `src/components/ShortcutHint.tsx`** (30 min)
   ```typescript
   interface Props {
     shortcut: string;
     label: string;
   }

   export const ShortcutHint = ({ shortcut, label }: Props) => (
     <button className="shortcut-btn">
       {label} <kbd>{shortcut}</kbd>
     </button>
   );
   ```

2. **Add keyboard styling** (30 min)
   - Create `.shortcut-btn` CSS
   - Style `<kbd>` element (pill shape, monospace)
   - Match design system
   - Ensure 44px touch target

#### Step 2: Update Timer Pages (1.5 hours)
1. **Countdown.tsx** (15 min)
   ```typescript
   <ShortcutHint shortcut="Space" label="Start/Pause" />
   <ShortcutHint shortcut="R" label="Reset" />
   <ShortcutHint shortcut="F" label="Fullscreen" />
   ```

2. **Repeat for all timer pages** (1 hour)
   - AnalogCountdown.tsx
   - Stopwatch.tsx (include "L" for laps)
   - Pomodoro.tsx
   - ChessClock.tsx
   - Etc. (8 total pages)

3. **Mobile responsiveness** (15 min)
   - Hide shortcuts on mobile (<768px)
   - Add tooltips as alternative

#### Step 3: Create Global Help Overlay (30 min)
1. **Create `src/components/KeyboardHelp.tsx`**
   - Modal showing all shortcuts
   - Triggered by "?" key
   - ESC to close

2. **Add to main.tsx**
   ```typescript
   useEffect(() => {
     const handler = (e: KeyboardEvent) => {
       if (e.key === '?') setShowHelp(true);
     };
     window.addEventListener('keydown', handler);
     return () => window.removeEventListener('keydown', handler);
   }, []);
   ```

**Acceptance Criteria:**
- [ ] All timer buttons show keyboard hints
- [ ] `<kbd>` elements styled correctly
- [ ] Mobile: hints hidden, tooltips work
- [ ] "?" key opens help overlay
- [ ] Help overlay shows all shortcuts
- [ ] Git commit: `feat: add keyboard shortcut visual hints`

---

### Task 1.9: Add Cross-Tab Sync Tests (2 hours)
**Priority:** P1 - HIGH (Quality - Core Feature)

**Problem:** useStorageSync hook has zero tests

**File:** Create `tests/e2e/cross-tab-sync.spec.ts`

**Steps:**

#### Step 1: Test Infrastructure (30 min)
1. **Create test helper** (20 min)
   ```typescript
   // tests/helpers/multi-tab.ts
   export async function createTabs(browser, count: number) {
     const context = await browser.newContext();
     const tabs = [];
     for (let i = 0; i < count; i++) {
       tabs.push(await context.newPage());
     }
     return { context, tabs };
   }
   ```

2. **Configure Playwright** (10 min)
   - Ensure context persistence enabled
   - Allow localStorage sharing between tabs

#### Step 2: Write Sync Tests (1 hour)
1. **Test: Countdown sync** (20 min)
   ```typescript
   test('should sync countdown start across tabs', async ({ browser }) => {
     const { tabs } = await createTabs(browser, 2);

     await tabs[0].goto('/#/countdown');
     await tabs[1].goto('/#/countdown');

     await tabs[0].click('button:has-text("Start")');
     await tabs[1].waitForTimeout(200); // Wait for storage event

     const tab1Running = await tabs[0].locator('.countdown-running').isVisible();
     const tab2Running = await tabs[1].locator('.countdown-running').isVisible();

     expect(tab1Running).toBe(true);
     expect(tab2Running).toBe(true);
   });
   ```

2. **Test: State sync latency** (20 min)
   - Measure time from state change to sync
   - Assert <500ms (constitution requirement)

3. **Test: Multiple timers** (20 min)
   - Open different timers in different tabs
   - Verify each syncs independently
   - No cross-timer pollution

#### Step 3: Edge Case Tests (30 min)
1. **Test: Tab reopening**
   - Close tab, reopen
   - Verify state restored

2. **Test: Concurrent updates**
   - Both tabs update state simultaneously
   - Last write wins (expected behavior)

3. **Test: localStorage full**
   - Mock quota exceeded error
   - Verify graceful degradation

**Acceptance Criteria:**
- [ ] 5+ cross-tab sync tests written
- [ ] All tests pass
- [ ] Sync latency <500ms verified
- [ ] Edge cases covered
- [ ] Git commit: `test: add cross-tab synchronization test suite`

---

### Task 1.10: Reduce Countdown Update Frequency (1 hour)
**Priority:** P1 - HIGH (Performance)

**Problem:** 60 updates/second for HH:MM:SS display

**File:** `src/pages/Countdown.tsx` lines 294-312

**Steps:**

1. **Implement second-boundary updates** (30 min)
   ```typescript
   const sync = useCallback(() => {
     if (!st.running || !st.endAt) return;
     const now = Date.now();
     const rem = Math.max(0, st.endAt - now);

     const currentSecond = Math.floor(rem / 1000);
     if (currentSecond !== lastSecondRef.current) {
       lastSecondRef.current = currentSecond;
       setSt(s => ({ ...s, remainingMs: rem }));
     }
   }, [st.running, st.endAt]);
   ```

2. **Test accuracy** (20 min)
   - Set timer to 5:00
   - Verify updates every second (not 60x/second)
   - Check time doesn't drift

3. **Performance profiling** (10 min)
   - Chrome DevTools React Profiler
   - Measure re-renders: Before 60/sec → After 1/sec
   - Verify 98% reduction

**Acceptance Criteria:**
- [ ] Updates 1x/second instead of 60x/second
- [ ] Time display accurate (no drift)
- [ ] React Profiler shows 98% fewer renders
- [ ] Git commit: `perf: reduce countdown update frequency (60→1 FPS)`

---

### Sprint 1 Mid-Sprint Checkpoint (Day 3)

**Completed Tasks Check:**
- [ ] Tasks 1.1-1.5: All critical bugs fixed
- [ ] Task 1.6: Code splitting implemented
- [ ] Tests passing: All 51+ existing tests

**Metrics Review:**
- [ ] Lighthouse score improved (target: 70+)
- [ ] Bundle size reduced (target: <200KB)
- [ ] No new bugs introduced

**Go/No-Go Decision:**
- If ≥4 of 5 bugs fixed: **Continue**
- If code splitting reduces bundle <50%: **Adjust approach**
- If tests failing: **Stop and fix**

---

### Sprint 1 Definition of Done

**Code Quality:**
- [ ] All 10 tasks completed
- [ ] Code reviewed (self-review or peer)
- [ ] No TypeScript errors
- [ ] No console errors in production build
- [ ] All tests passing (existing + new)

**Performance:**
- [ ] Lighthouse score ≥80 (from ~65)
- [ ] Bundle size ≤150KB (from 645KB)
- [ ] Load time <5s on 3G (from 18-20s)
- [ ] FPS reduced: Canvas 60→1 when idle, Countdown 60→1

**Testing:**
- [ ] 5 critical bugs fixed with tests
- [ ] Cross-tab sync tested (5+ tests)
- [ ] Visual regression: No broken layouts

**Documentation:**
- [ ] CHANGELOG.md updated with fixes
- [ ] Migration guide for breaking changes (if any)
- [ ] Performance improvements documented

**Deployment:**
- [ ] Feature branch merged to `dev/iterative-improvements`
- [ ] Staging deployment successful
- [ ] Smoke tests pass on staging
- [ ] Tag: `v1.1.0-sprint1`

---

## Sprint 2: Code Quality & Refactoring
**Duration:** 1 week (20 hours)
**Branch:** `feature/sprint-2-refactoring`
**Goal:** Eliminate code duplication, improve maintainability

### Milestone Objectives
- ✅ Extract useRaf hook (eliminate 700+ duplicate lines)
- ✅ Extract time formatting utils (eliminate 300+ lines)
- ✅ Extract timer persistence hook (eliminate 500+ lines)
- ✅ Add React.memo optimizations (30% reconciliation improvement)
- ✅ Test coverage: 45% → 60%

---

### Task 2.1: Extract useRaf Hook (2 hours)
**Priority:** P0 - CRITICAL (Code Quality)

**Problem:** useRaf duplicated in 7 files (700+ lines total)

**Files Affected:**
- AnalogCountdown.tsx
- Countdown.tsx
- Stopwatch.tsx
- CookingTimer.tsx
- CouplesTimer.tsx
- Alarm.tsx
- CycleTimer.tsx

**Steps:**

#### Step 1: Create Shared Hook (30 min)
1. **Create `src/hooks/useRaf.ts`**:
   ```typescript
   import { useEffect, useRef } from 'react';

   /**
    * Custom hook for requestAnimationFrame loops
    * @param enabled - Whether the loop should run
    * @param callback - Function to call on each frame
    */
   export function useRaf(enabled: boolean, callback: () => void) {
     const callbackRef = useRef(callback);
     const rafRef = useRef<number | undefined>();

     // Update callback ref without triggering effect
     useEffect(() => {
       callbackRef.current = callback;
     }, [callback]);

     useEffect(() => {
       if (!enabled) return;

       let active = true;
       const loop = () => {
         if (!active) return;
         callbackRef.current();
         rafRef.current = requestAnimationFrame(loop);
       };

       rafRef.current = requestAnimationFrame(loop);

       return () => {
         active = false;
         if (rafRef.current) {
           cancelAnimationFrame(rafRef.current);
         }
       };
     }, [enabled]);
   }
   ```

2. **Add JSDoc documentation** (10 min)
3. **Add TypeScript strict mode** (5 min)

#### Step 2: Replace in AnalogCountdown.tsx (15 min)
1. **Remove local useRaf** (lines 88-104)
2. **Import from hooks**:
   ```typescript
   import { useRaf } from '../hooks/useRaf';
   ```
3. **Verify no behavior change**
4. **Test timer still works**

#### Step 3: Replace in Remaining 6 Files (1 hour)
1. **Countdown.tsx** (10 min)
2. **Stopwatch.tsx** (10 min)
3. **CookingTimer.tsx** (10 min)
4. **CouplesTimer.tsx** (10 min)
5. **Alarm.tsx** (10 min)
6. **CycleTimer.tsx** (10 min)

#### Step 4: Verify and Test (15 min)
1. **Run all tests**: `npm run test:e2e`
2. **Manual test each timer**:
   - Start/pause/reset
   - Verify smooth animation
   - Check for memory leaks (Chrome DevTools)
3. **Search codebase**: Verify no more local useRaf definitions

**Acceptance Criteria:**
- [ ] `src/hooks/useRaf.ts` created with full documentation
- [ ] All 7 files updated to use shared hook
- [ ] Zero duplicate useRaf implementations remaining
- [ ] All timers work identically to before
- [ ] All E2E tests pass
- [ ] Line count reduced by ~700 lines
- [ ] Git commit: `refactor: extract useRaf hook to eliminate duplication`

---

### Task 2.2: Extract Time Formatting Utilities (2 hours)
**Priority:** P0 - CRITICAL (Code Quality)

**Problem:** fmt() function duplicated 7+ times with variations

**Steps:**

#### Step 1: Create Formatting Utilities (1 hour)
1. **Create `src/utils/time-formatting.ts`**:
   ```typescript
   /**
    * Format milliseconds as HH:MM:SS
    */
   export function formatHMS(ms: number): string {
     const totalSeconds = Math.floor(ms / 1000);
     const hours = Math.floor(totalSeconds / 3600);
     const minutes = Math.floor((totalSeconds % 3600) / 60);
     const seconds = totalSeconds % 60;

     return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
   }

   /**
    * Format milliseconds as MM:SS
    */
   export function formatMS(ms: number): string {
     const totalSeconds = Math.floor(ms / 1000);
     const minutes = Math.floor(totalSeconds / 60);
     const seconds = totalSeconds % 60;

     return `${pad(minutes)}:${pad(seconds)}`;
   }

   /**
    * Format milliseconds as MM:SS.CC (centiseconds)
    */
   export function formatMSCentiseconds(ms: number): string {
     const totalMs = Math.floor(ms);
     const minutes = Math.floor(totalMs / 60000);
     const seconds = Math.floor((totalMs % 60000) / 1000);
     const centiseconds = Math.floor((totalMs % 1000) / 10);

     return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
   }

   /**
    * Format milliseconds as HH:MM
    */
   export function formatHM(ms: number): string {
     const totalMinutes = Math.floor(ms / 60000);
     const hours = Math.floor(totalMinutes / 60);
     const minutes = totalMinutes % 60;

     return `${pad(hours)}:${pad(minutes)}`;
   }

   /**
    * Pad number to 2 digits
    */
   function pad(num: number): string {
     return num.toString().padStart(2, '0');
   }
   ```

2. **Add unit tests** (20 min)
   - Create `tests/unit/time-formatting.test.ts`
   - Test edge cases: 0ms, negative, very large values
   - Test rounding behavior

3. **Add JSDoc documentation** (10 min)

#### Step 2: Replace in Timer Files (1 hour)
1. **Identify all fmt() usages** (10 min)
   ```bash
   grep -rn "function fmt" src/pages/
   ```

2. **Replace in each file** (50 min)
   - Countdown.tsx: Use `formatHMS`
   - Stopwatch.tsx: Use `formatMSCentiseconds`
   - ChessClock.tsx: Use `formatHM`
   - Etc.

3. **Remove local fmt() definitions**

**Acceptance Criteria:**
- [ ] `src/utils/time-formatting.ts` created with 4+ functions
- [ ] Unit tests cover edge cases
- [ ] All timer pages use shared utils
- [ ] No local fmt() functions remaining
- [ ] All timers display correctly
- [ ] Line count reduced by ~300 lines
- [ ] Git commit: `refactor: extract time formatting utilities`

---

### Task 2.3: Extract Timer Persistence Hook (3 hours)
**Priority:** P1 - HIGH (Code Quality)

**Problem:** load()/save() pattern duplicated 12 times

**Steps:**

#### Step 1: Design Generic Hook (30 min)
1. **Create `src/hooks/useTimerPersistence.ts`**:
   ```typescript
   interface TimerState {
     version: number;
     [key: string]: any;
   }

   interface Options<T> {
     key: string;
     initialValue: T;
     validator?: (data: any) => T;
     debounceMs?: number;
   }

   export function useTimerPersistence<T extends TimerState>(
     options: Options<T>
   ): [T, (updater: T | ((prev: T) => T)) => void] {
     const { key, initialValue, validator, debounceMs = 150 } = options;

     // Implementation...
   }
   ```

2. **Plan migration strategy**:
   - Each timer keeps its own key (sc.v1.countdown, etc.)
   - Validator ensures type safety
   - Debouncing built-in
   - Error handling centralized

#### Step 2: Implement Hook (1.5 hours)
1. **Load logic** (30 min)
   ```typescript
   const loadState = useCallback((): T => {
     try {
       const raw = localStorage.getItem(key);
       if (!raw) return initialValue;

       const parsed = JSON.parse(raw);

       // Validate if validator provided
       if (validator) {
         return validator(parsed);
       }

       return parsed as T;
     } catch (err) {
       console.error(`Failed to load ${key}:`, err);
       return initialValue;
     }
   }, [key, initialValue, validator]);
   ```

2. **Save logic with debouncing** (30 min)
   ```typescript
   const saveState = useCallback((value: T) => {
     const timeoutId = setTimeout(() => {
       try {
         localStorage.setItem(key, JSON.stringify(value));
       } catch (err) {
         console.error(`Failed to save ${key}:`, err);
       }
     }, debounceMs);

     return () => clearTimeout(timeoutId);
   }, [key, debounceMs]);
   ```

3. **StorageEvent listener** (30 min)
   - Listen for cross-tab updates
   - Update state when other tab changes

#### Step 3: Migrate Countdown Timer (30 min)
1. **Update Countdown.tsx**:
   ```typescript
   const [st, setSt] = useTimerPersistence<CountdownState>({
     key: 'sc.v1.countdown',
     initialValue: {
       version: 1,
       durationMs: 300_000,
       remainingMs: 300_000,
       running: false,
       // ...
     },
     validator: (data) => ({
       version: 1,
       durationMs: clamp(data.durationMs ?? 300_000, 1000, MAX),
       remainingMs: clamp(data.remainingMs ?? 300_000, 0, MAX),
       // ... validation logic
     })
   });
   ```

2. **Remove old load()/save() functions**
3. **Test countdown still works**

#### Step 4: Migrate Remaining 11 Timers (30 min)
- Stopwatch, Pomodoro, Cooking, etc.
- Each takes ~2-3 minutes

**Acceptance Criteria:**
- [ ] `src/hooks/useTimerPersistence.ts` created
- [ ] All 12 timers use shared hook
- [ ] No local load()/save() functions remaining
- [ ] Debouncing working (max 150ms write delay)
- [ ] Cross-tab sync preserved
- [ ] Line count reduced by ~500 lines
- [ ] Git commit: `refactor: extract timer persistence hook`

---

### Task 2.4: Add React.memo to Components (2.5 hours)
**Priority:** P1 - HIGH (Performance)

**Problem:** Zero React.memo usage, unnecessary re-renders

**Steps:**

#### Step 1: Identify Memoization Candidates (30 min)
1. **Use React DevTools Profiler** (20 min)
   - Navigate to landing page
   - Record profile for 10 seconds
   - Identify components re-rendering unnecessarily
   - Focus on: HomeButton, TimerCard, ConsentBanner

2. **Create priority list** (10 min)
   - Rank by re-render frequency
   - Target top 10 components

#### Step 2: Wrap Static Components (1 hour)
1. **HomeButton.tsx**:
   ```typescript
   export const HomeButton = React.memo(() => {
     return (
       <a href="#/" className="home-btn" aria-label="Home">
         <HomeIcon />
       </a>
     );
   });
   HomeButton.displayName = 'HomeButton';
   ```

2. **Repeat for**:
   - TimerIcon
   - DarkModeToggle
   - LanguageToggle
   - ConsentBanner (when not visible)
   - Footer components
   - Header components

#### Step 3: Wrap Timer Cards (30 min)
1. **Create memoized TimerCard component**:
   ```typescript
   const TimerCard = React.memo(({
     route,
     label,
     tagline,
     color
   }: TimerCardProps) => {
     // ... render logic
   }, (prevProps, nextProps) => {
     // Custom comparison for isPinned state
     return prevProps.route === nextProps.route &&
            prevProps.isPinned === nextProps.isPinned;
   });
   ```

#### Step 4: Verify Performance Gain (30 min)
1. **React Profiler comparison** (20 min)
   - Record before/after
   - Count re-renders
   - Measure commit time

2. **Target metrics** (10 min)
   - 30% fewer re-renders
   - 20% faster commit time
   - Smoother scrolling on landing page

**Acceptance Criteria:**
- [ ] 10+ components wrapped with React.memo
- [ ] React Profiler shows 30% fewer re-renders
- [ ] No visual or behavioral changes
- [ ] All tests pass
- [ ] Git commit: `perf: add React.memo to static components`

---

### Task 2.5: Add Pomodoro Timer Test Suite (3 hours)
**Priority:** P1 - HIGH (Quality)

**Problem:** Pomodoro completely untested (15+ tests needed)

**File:** Create `tests/e2e/06-pomodoro.spec.ts`

**Steps:**

#### Step 1: Basic Functionality Tests (1 hour)
1. **Test: Start focus session** (15 min)
2. **Test: Pause/resume session** (15 min)
3. **Test: Reset session** (15 min)
4. **Test: Session completes, auto-transitions to break** (15 min)

#### Step 2: Preset Tests (30 min)
1. **Test: Switch between presets** (classic, soft, deep)
2. **Test: Custom preset values persist**
3. **Test: Preset change during session**

#### Step 3: Task Management Tests (1 hour)
1. **Test: Add task to list** (15 min)
2. **Test: Complete task** (15 min)
3. **Test: Delete task** (15 min)
4. **Test: Task persistence across reload** (15 min)

#### Step 4: Cycle Tests (30 min)
1. **Test: Complete 4 focus sessions triggers long break**
2. **Test: Cycle counter increments correctly**
3. **Test: Reset cycle counter**

**Acceptance Criteria:**
- [ ] 15+ Pomodoro tests written
- [ ] All tests pass
- [ ] Edge cases covered
- [ ] Coverage: Pomodoro.tsx + domain/pomodoro/logic.ts
- [ ] Git commit: `test: add comprehensive Pomodoro test suite`

---

### Task 2.6: Add Cooking Timer Test Suite (3 hours)
**Priority:** P1 - HIGH (Quality)

**Problem:** Cooking Timer untested (12+ tests needed)

**File:** Create `tests/e2e/07-cooking.spec.ts`

**Steps:**

#### Step 1: Multi-Timer Tests (1 hour)
1. **Test: Create timer from preset** (15 min)
2. **Test: Create multiple timers (up to 10)** (15 min)
3. **Test: Delete timer** (10 min)
4. **Test: Reset individual timer** (10 min)
5. **Test: Start/pause individual timer** (10 min)

#### Step 2: Alarm Tests (1 hour)
1. **Test: Alarm triggers at 0:00** (20 min)
2. **Test: Alarm repeats every 2s for 60s** (from Sprint 1) (20 min)
3. **Test: Manual alarm dismissal** (10 min)
4. **Test: Extension controls (+1m, +2m, +5m)** (10 min)

#### Step 3: Sorting and UI Tests (1 hour)
1. **Test: Timers sort by completion time** (20 min)
2. **Test: Alarming timers always on top** (15 min)
3. **Test: Color rotation system** (15 min)
4. **Test: Max 10 timers enforced** (10 min)

**Acceptance Criteria:**
- [ ] 12+ Cooking Timer tests written
- [ ] All tests pass
- [ ] Multi-timer scenarios covered
- [ ] Alarm behavior validated
- [ ] Git commit: `test: add comprehensive Cooking Timer test suite`

---

### Task 2.7: Add Mobile Responsiveness Tests (2 hours)
**Priority:** P2 - MEDIUM (Quality)

**Problem:** Only 1 mobile viewport test exists

**Steps:**

#### Step 1: Configure Mobile Viewports (30 min)
1. **Update `playwright.config.ts`**:
   ```typescript
   projects: [
     // ... existing
     {
       name: 'mobile',
       use: {
         ...devices['iPhone 12'],
         viewport: { width: 390, height: 844 }
       },
     },
     {
       name: 'tablet',
       use: {
         ...devices['iPad Pro'],
         viewport: { width: 1024, height: 1366 }
       }
     }
   ]
   ```

#### Step 2: Mobile-Specific Tests (1 hour)
1. **Test: Touch targets ≥44px** (20 min)
2. **Test: Pinned timer bar collapses gracefully** (15 min)
3. **Test: Timer controls accessible on mobile** (15 min)
4. **Test: No horizontal overflow** (10 min)

#### Step 3: Tablet Tests (30 min)
1. **Test: Timer grid layout** (15 min)
2. **Test: Fullscreen on tablet** (15 min)

**Acceptance Criteria:**
- [ ] Mobile and tablet viewports configured
- [ ] 6+ mobile responsiveness tests
- [ ] All tests pass on mobile devices
- [ ] Git commit: `test: add mobile responsiveness test suite`

---

### Sprint 2 Mid-Sprint Checkpoint (Day 3)

**Completed Tasks Check:**
- [ ] Tasks 2.1-2.3: All refactoring completed
- [ ] Code duplication eliminated (~1,500 lines removed)
- [ ] Tests still passing

**Metrics Review:**
- [ ] Line count reduced by ≥1,200 lines
- [ ] No performance regression
- [ ] Test coverage increased

**Go/No-Go Decision:**
- If refactoring breaks tests: **Stop and fix**
- If line count not reduced ≥50%: **Review approach**
- Otherwise: **Continue**

---

### Sprint 2 Definition of Done

**Code Quality:**
- [ ] All 7 tasks completed
- [ ] Code duplication eliminated (~1,500 lines)
- [ ] No TypeScript errors
- [ ] All tests passing

**Refactoring:**
- [ ] useRaf hook extracted and used in 7 files
- [ ] Time formatting utilities extracted
- [ ] Timer persistence hook extracted
- [ ] 10+ components wrapped with React.memo

**Testing:**
- [ ] Test coverage: 45% → 60%
- [ ] Pomodoro: 15+ tests added
- [ ] Cooking Timer: 12+ tests added
- [ ] Mobile: 6+ tests added
- [ ] Total tests: 51 → 84+

**Performance:**
- [ ] React Profiler: 30% fewer re-renders
- [ ] Lighthouse score maintained or improved
- [ ] No bundle size increase

**Deployment:**
- [ ] Merged to `dev/iterative-improvements`
- [ ] Staging deployment successful
- [ ] Tag: `v1.2.0-sprint2`

---

## Sprint 3: UX & Testing
**Duration:** 1 week (20 hours)
**Branch:** `feature/sprint-3-ux`
**Goal:** Fix UX friction, standardize flows, increase test coverage to 70%

### Milestone Objectives
- ✅ Standardize timer entry flow (remove forced World View)
- ✅ Make pinned timer previews interactive
- ✅ Add toast notifications for actions
- ✅ Fix mobile experience issues
- ✅ Test coverage: 60% → 70%

---

### Task 3.1: Standardize Timer Entry Flow (3 hours)
**Priority:** P0 - CRITICAL (UX)

**Problem:** Inconsistent entry (some force World View, others don't)

**Strategy:** Make World View optional, default to player with sidebar presets

**Files Affected:**
- Countdown.tsx
- CookingTimer.tsx
- ChessClock.tsx
- CouplesTimer.tsx

**Steps:**

#### Step 1: Design New Entry Pattern (30 min)
1. **Wireframe unified layout**:
   ```
   ┌─────────────────────────────────────┐
   │ Home  [Timer Name]           [?][F] │
   ├──────────┬──────────────────────────┤
   │ Presets  │                          │
   │          │                          │
   │ • Quick  │      Timer Display       │
   │ • Custom │                          │
   │ • Saved  │                          │
   │          │                          │
   │ Learn    │      [Controls]          │
   │ More →   │                          │
   └──────────┴──────────────────────────┘
   ```

2. **Define layout rules**:
   - Left sidebar: Presets (collapsed on mobile)
   - Main area: Timer player
   - "Learn More" link to World View
   - World View accessible but not forced

#### Step 2: Create Shared Layout Component (1 hour)
1. **Create `src/components/TimerLayout.tsx`**:
   ```typescript
   interface Props {
     timerName: string;
     presets?: ReactNode;
     worldViewLink?: string;
     children: ReactNode;
   }

   export const TimerLayout = ({
     timerName,
     presets,
     worldViewLink,
     children
   }: Props) => {
     return (
       <div className="timer-layout">
         <header>
           <HomeButton />
           <h1>{timerName}</h1>
           <ShortcutHints />
           <FullscreenButton />
         </header>

         <div className="timer-content">
           {presets && (
             <aside className="timer-sidebar">
               {presets}
               {worldViewLink && (
                 <a href={worldViewLink} className="learn-more">
                   Learn More →
                 </a>
               )}
             </aside>
           )}

           <main className="timer-player">
             {children}
           </main>
         </div>
       </div>
     );
   };
   ```

2. **Add responsive CSS** (30 min)
   - Desktop: Sidebar visible
   - Tablet: Sidebar collapsible
   - Mobile: Sidebar hidden, hamburger menu

#### Step 3: Migrate Countdown Timer (45 min)
1. **Update Countdown.tsx**:
   - Remove separate World/Player views
   - Use `<TimerLayout>` wrapper
   - Move presets to sidebar
   - Add "Learn More" link to existing World content

2. **Create `CountdownPresets` component**:
   - Quick buttons: 5m, 10m, 15m, 25m, 45m, 1h
   - Custom input: hours/minutes
   - Saved presets (localStorage)

3. **Test user flow**:
   - Land on Countdown
   - See player immediately
   - Try presets
   - Click "Learn More"

#### Step 4: Migrate Remaining Timers (45 min)
- CookingTimer.tsx (15 min)
- ChessClock.tsx (15 min)
- CouplesTimer.tsx (15 min)

**Acceptance Criteria:**
- [ ] `TimerLayout` component created
- [ ] 4 timers migrated to new pattern
- [ ] No forced World View navigation
- [ ] "Learn More" links work
- [ ] Responsive on mobile/tablet
- [ ] All tests pass
- [ ] User testing: 5 clicks → 2 clicks to start timer
- [ ] Git commit: `feat: standardize timer entry flow (remove forced World View)`

---

### Task 3.2: Make Pinned Timer Previews Interactive (2.5 hours)
**Priority:** P1 - HIGH (UX)

**Problem:** Clicking preview navigates instead of controlling timer

**File:** `src/components/PinnedTimersBoard.tsx`

**Steps:**

#### Step 1: Add Mini Controls to Previews (1.5 hours)
1. **Update PinnedTimerCard** (1 hour):
   ```typescript
   const PinnedTimerCard = ({ timer }: Props) => {
     const handleStart = (e: React.MouseEvent) => {
       e.preventDefault();
       e.stopPropagation();
       // Update timer state via useStorageSync
     };

     return (
       <div className="pinned-timer-card">
         <div className="preview-display">
           {/* Timer-specific preview */}
         </div>

         <div className="preview-controls">
           <button onClick={handleStart} aria-label="Start/Pause">
             {timer.running ? <PauseIcon /> : <PlayIcon />}
           </button>
           <button onClick={handleReset} aria-label="Reset">
             <ResetIcon />
           </button>
         </div>

         <a href={timer.route} className="preview-open">
           Open Full Timer →
         </a>
       </div>
     );
   };
   ```

2. **Add click prevention** (30 min):
   - Card click doesn't navigate
   - Only "Open Full Timer" link navigates
   - Mini controls functional inline

#### Step 2: Update State Management (45 min)
1. **Access timer state in preview**:
   - Use `useStorageSync` for each pinned timer
   - Update state from preview controls
   - Changes reflect in full timer (cross-tab sync)

2. **Handle timer-specific logic**:
   - Countdown: Start/pause/reset
   - Stopwatch: Start/pause/lap/reset
   - Cooking: Individual timer controls

#### Step 3: Mobile Optimization (15 min)
- Enlarge touch targets (48px minimum)
- Swipe gestures (optional)

**Acceptance Criteria:**
- [ ] Preview controls functional (start/pause/reset)
- [ ] Card click doesn't navigate
- [ ] "Open Full Timer" link works
- [ ] State syncs with full timer
- [ ] Mobile touch targets ≥48px
- [ ] Git commit: `feat: add interactive controls to pinned timer previews`

---

### Task 3.3: Add Toast Notification System (2 hours)
**Priority:** P1 - HIGH (UX - Feedback)

**Problem:** No user feedback for save/share/error actions

**Steps:**

#### Step 1: Create Toast Component (1 hour)
1. **Create `src/components/Toast.tsx`**:
   ```typescript
   interface ToastProps {
     message: string;
     type: 'success' | 'error' | 'info';
     duration?: number;
     onClose: () => void;
   }

   export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
     useEffect(() => {
       const timer = setTimeout(onClose, duration);
       return () => clearTimeout(timer);
     }, [duration, onClose]);

     return (
       <div className={`toast toast-${type}`}>
         <span>{message}</span>
         <button onClick={onClose} aria-label="Close">×</button>
       </div>
     );
   };
   ```

2. **Create Toast Context** (30 min):
   ```typescript
   export const ToastContext = createContext<{
     showToast: (message: string, type: ToastType) => void;
   }>(null!);

   export const ToastProvider = ({ children }: Props) => {
     const [toasts, setToasts] = useState<ToastItem[]>([]);

     const showToast = (message: string, type: ToastType) => {
       const id = Date.now();
       setToasts(prev => [...prev, { id, message, type }]);
     };

     return (
       <ToastContext.Provider value={{ showToast }}>
         {children}
         <div className="toast-container">
           {toasts.map(toast => (
             <Toast
               key={toast.id}
               {...toast}
               onClose={() => removeToast(toast.id)}
             />
           ))}
         </div>
       </ToastContext.Provider>
     );
   };
   ```

#### Step 2: Add Toast Triggers (1 hour)
1. **Save actions** (15 min):
   ```typescript
   const handleSave = () => {
     try {
       savePreset(preset);
       showToast('Preset saved successfully', 'success');
     } catch (err) {
       showToast('Failed to save preset', 'error');
     }
   };
   ```

2. **Share actions** (15 min):
   - Copy URL to clipboard
   - Show "Link copied!" toast

3. **Error states** (15 min):
   - localStorage quota exceeded
   - Audio playback failed
   - Invalid input

4. **State changes** (15 min):
   - Timer started
   - Timer completed
   - Lap recorded

**Acceptance Criteria:**
- [ ] Toast component created with 3 types
- [ ] ToastProvider wraps app
- [ ] Save/share show toasts
- [ ] Errors show toasts
- [ ] Mobile-friendly positioning
- [ ] Accessibility: ARIA live regions
- [ ] Git commit: `feat: add toast notification system`

---

### Task 3.4: Mobile Experience Improvements (3 hours)
**Priority:** P1 - HIGH (UX - Constitution)

**Problem:** Mobile neglected, inconsistent touch targets

**Steps:**

#### Step 1: Touch Target Audit (1 hour)
1. **Scan all buttons/links** (30 min):
   ```bash
   # Create audit script
   # Check computed styles for width/height
   ```

2. **Identify violations** (30 min):
   - List all elements <44px
   - Prioritize by usage frequency
   - Document in `docs/MOBILE_AUDIT.md`

#### Step 2: Fix Touch Targets (1.5 hours)
1. **Update button CSS** (45 min):
   ```css
   .timer-btn {
     min-width: 48px;
     min-height: 48px;
     padding: 12px 20px;
     /* Ensure 48px minimum */
   }
   ```

2. **Fix specific violations** (45 min):
   - Pinned timer controls
   - Keyboard shortcut hints (hide on mobile)
   - Timer card buttons
   - Navigation links

#### Step 3: Add `.hide-on-mobile` Consistently (30 min)
1. **Apply to all timers**:
   - Fullscreen buttons
   - Keyboard hints
   - Non-essential controls

2. **Test on mobile viewports**:
   - iPhone 12 (390x844)
   - Galaxy S21 (360x800)
   - iPad (768x1024)

**Acceptance Criteria:**
- [ ] All interactive elements ≥48px on mobile
- [ ] `.hide-on-mobile` applied to 12 timer pages
- [ ] Mobile viewport tests pass
- [ ] No horizontal overflow
- [ ] Git commit: `fix: improve mobile touch targets and responsiveness`

---

### Task 3.5: Add Share & Save Feature Tests (2 hours)
**Priority:** P2 - MEDIUM (Quality)

**Problem:** Share/save features completely untested

**File:** Create `tests/e2e/08-share-save.spec.ts`

**Steps:**

#### Step 1: Share Feature Tests (1 hour)
1. **Test: Generate shareable URL** (20 min)
2. **Test: Load preset from URL** (20 min)
3. **Test: URL parameters preserved** (10 min)
4. **Test: QR code generation** (10 min)

#### Step 2: Save Feature Tests (1 hour)
1. **Test: Save custom preset** (20 min)
2. **Test: Load saved preset** (20 min)
3. **Test: Delete saved preset** (10 min)
4. **Test: Preset name validation** (10 min)

**Acceptance Criteria:**
- [ ] 8+ share/save tests written
- [ ] All tests pass
- [ ] URL encoding/decoding validated
- [ ] Git commit: `test: add share and save feature tests`

---

### Task 3.6: Add Inline Validation Errors (1.5 hours)
**Priority:** P2 - MEDIUM (UX)

**Problem:** Invalid inputs silently clamped

**Steps:**

#### Step 1: Create ValidationMessage Component (30 min)
```typescript
export const ValidationMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <div className="validation-error" role="alert">
      {error}
    </div>
  );
};
```

#### Step 2: Add to Input Fields (1 hour)
1. **Analog Countdown custom minutes** (15 min):
   - Validate range: 1-180
   - Show error: "Value must be between 1-180 minutes"

2. **Chess Clock time inputs** (15 min):
   - Validate positive numbers
   - Show error on invalid

3. **Pomodoro custom durations** (15 min):
4. **Alarm time input** (15 min):

**Acceptance Criteria:**
- [ ] ValidationMessage component created
- [ ] 4+ inputs have inline validation
- [ ] Errors shown immediately on blur
- [ ] ARIA attributes for accessibility
- [ ] Git commit: `feat: add inline validation errors to inputs`

---

### Task 3.7: Add Custom Sessions Test Suite (2 hours)
**Priority:** P2 - MEDIUM (Quality)

**Problem:** Custom Sessions untested

**File:** Create `tests/e2e/09-custom-sessions.spec.ts`

**Steps:**

#### Step 1: Session Builder Tests (1 hour)
1. **Test: Create session with 3 phases**
2. **Test: Add/remove phases**
3. **Test: Save session**
4. **Test: Load saved session**

#### Step 2: Session Runner Tests (1 hour)
1. **Test: Execute multi-phase session**
2. **Test: Phase auto-advance**
3. **Test: Pause/resume session**
4. **Test: Session completion**

**Acceptance Criteria:**
- [ ] 8+ custom session tests
- [ ] All tests pass
- [ ] Multi-phase execution validated
- [ ] Git commit: `test: add custom sessions test suite`

---

### Sprint 3 Mid-Sprint Checkpoint (Day 3)

**Completed Tasks Check:**
- [ ] Tasks 3.1-3.3: Core UX improvements done
- [ ] Timer entry flow standardized
- [ ] Pinned previews interactive

**Metrics Review:**
- [ ] User testing: Friction points reduced
- [ ] Tests passing: All existing + new
- [ ] Mobile experience improved

**Go/No-Go Decision:**
- If UX changes break user flow: **Stop and fix**
- If mobile tests failing: **Adjust approach**
- Otherwise: **Continue**

---

### Sprint 3 Definition of Done

**UX Improvements:**
- [ ] All 7 tasks completed
- [ ] Timer entry flow standardized (4 timers)
- [ ] Pinned previews interactive
- [ ] Toast notifications implemented
- [ ] Mobile touch targets ≥48px
- [ ] Inline validation errors added

**Testing:**
- [ ] Test coverage: 60% → 70%
- [ ] Share/save: 8+ tests
- [ ] Custom sessions: 8+ tests
- [ ] Total tests: 84 → 100+

**User Experience:**
- [ ] User testing: 5 clicks → 2 clicks to start timer
- [ ] Mobile responsive verified
- [ ] Toast notifications working
- [ ] No UX regressions

**Deployment:**
- [ ] Merged to `dev/iterative-improvements`
- [ ] Staging deployment successful
- [ ] Tag: `v1.3.0-sprint3`

---

## Sprint 4: Accessibility & PWA
**Duration:** 1 week (20 hours)
**Branch:** `feature/sprint-4-accessibility`
**Goal:** Achieve WCAG 2.1 AA compliance, optimize PWA

### Milestone Objectives
- ✅ WCAG 2.1 AA compliance verified
- ✅ Screen reader support complete
- ✅ Keyboard navigation comprehensive
- ✅ Color contrast validated
- ✅ PWA cache-first strategy
- ✅ Offline experience improved

---

### Task 4.1: Color Contrast Audit & Fixes (2 hours)
**Priority:** P0 - CRITICAL (Accessibility)

**Problem:** Color contrast not validated (Constitution requirement)

**Steps:**

#### Step 1: Install Contrast Checker (15 min)
```bash
npm install --save-dev @axe-core/playwright
```

#### Step 2: Audit Current Colors (45 min)
1. **Run axe-core scan** (20 min):
   ```typescript
   // tests/accessibility/color-contrast.spec.ts
   import { injectAxe, checkA11y } from '@axe-core/playwright';

   test('should have sufficient color contrast', async ({ page }) => {
     await page.goto('/');
     await injectAxe(page);
     await checkA11y(page, null, {
       rules: {
         'color-contrast': { enabled: true }
       }
     });
   });
   ```

2. **Document violations** (15 min):
   - List all failing color combinations
   - Calculate current contrast ratios
   - Prioritize by visibility/usage

3. **Manual verification** (10 min):
   - Test Crimson Red (#DC143C) on dark backgrounds
   - Test gray text on charcoal
   - Test accent colors

#### Step 3: Fix Violations (1 hour)
1. **Update color palette** (30 min):
   ```css
   :root {
     /* Current */
     --color-background: #0b1220;
     --color-text: #FFFFFF;
     --color-accent: #DC143C; /* May fail contrast */

     /* Updated for WCAG AA */
     --color-accent-accessible: #FF4D6A; /* Lighter red for contrast */
     --color-text-secondary: #E0E0E0; /* Slightly dimmed white */
   }
   ```

2. **Apply updates** (30 min):
   - Update button colors
   - Update link colors
   - Update timer displays
   - Maintain visual hierarchy

**Acceptance Criteria:**
- [ ] Axe-core scan passes (0 contrast violations)
- [ ] All text ≥4.5:1 contrast ratio
- [ ] Large text ≥3:1 contrast ratio
- [ ] Visual appearance preserved
- [ ] Git commit: `fix: improve color contrast for WCAG AA compliance`

---

### Task 4.2: Add Screen Reader Support (3 hours)
**Priority:** P0 - CRITICAL (Accessibility)

**Problem:** Canvas timers and dynamic updates not announced

**Steps:**

#### Step 1: Add ARIA Live Regions (1 hour)
1. **Analog Countdown** (20 min):
   ```typescript
   <div
     className="analog-time-display"
     aria-live="polite"
     aria-atomic="true"
   >
     {formatHMS(st.remainingMs)} remaining
   </div>
   ```

2. **Countdown, Stopwatch, etc.** (20 min each)
   - Add `aria-live="polite"` to time displays
   - Add `aria-atomic="true"` for complete announcements
   - Debounce announcements (every 5 seconds, not every tick)

#### Step 2: Add Canvas Descriptions (1 hour)
1. **AnalogCountdown.tsx** (30 min):
   ```typescript
   <canvas
     ref={cnvRef}
     role="img"
     aria-label={`Countdown timer showing ${formatHMS(st.remainingMs)} remaining`}
   />
   ```

2. **Update on state change** (30 min):
   - Use `useEffect` to update aria-label
   - Provide meaningful descriptions
   - Announce state changes (started, paused, completed)

#### Step 3: Add Error Announcements (1 hour)
1. **Create error live region** (30 min):
   ```typescript
   <div
     role="alert"
     aria-live="assertive"
     className="sr-only"
   >
     {errorMessage}
   </div>
   ```

2. **Trigger on errors** (30 min):
   - localStorage quota exceeded
   - Audio playback failed
   - Invalid input

**Acceptance Criteria:**
- [ ] All timer displays have `aria-live`
- [ ] Canvas elements have descriptive `aria-label`
- [ ] Error messages announced
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] Git commit: `feat: add screen reader support for timers`

---

### Task 4.3: Comprehensive Keyboard Navigation (2.5 hours)
**Priority:** P1 - HIGH (Accessibility)

**Problem:** Tab order and focus management incomplete

**Steps:**

#### Step 1: Audit Tab Order (30 min)
1. **Test each page** (20 min):
   - Tab through all interactive elements
   - Document unexpected jumps
   - Identify focus traps

2. **Check focus visibility** (10 min):
   - Verify visible focus indicators
   - Test in both themes (dark/light)

#### Step 2: Fix Tab Order Issues (1.5 hours)
1. **Add explicit tabindex where needed** (45 min):
   - Remove negative tabindex
   - Ensure logical order
   - Group related controls

2. **Implement focus trap in fullscreen** (45 min):
   ```typescript
   const handleFullscreen = async () => {
     await document.documentElement.requestFullscreen();

     // Trap focus in fullscreen
     const firstFocusable = container.querySelector('button');
     const lastFocusable = container.querySelector('button:last-of-type');

     const handleTab = (e: KeyboardEvent) => {
       if (e.key === 'Tab') {
         if (e.shiftKey && document.activeElement === firstFocusable) {
           e.preventDefault();
           lastFocusable?.focus();
         } else if (!e.shiftKey && document.activeElement === lastFocusable) {
           e.preventDefault();
           firstFocusable?.focus();
         }
       }
     };

     document.addEventListener('keydown', handleTab);
   };
   ```

#### Step 3: Add Skip Links (30 min)
```typescript
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content" tabindex="-1">
  {/* Timer content */}
</main>
```

**Acceptance Criteria:**
- [ ] Tab order logical on all pages
- [ ] Focus visible in both themes
- [ ] Focus trap works in fullscreen
- [ ] Skip links functional
- [ ] Keyboard-only testing passed
- [ ] Git commit: `feat: improve keyboard navigation and focus management`

---

### Task 4.4: Add `prefers-reduced-motion` Support (1.5 hours)
**Priority:** P1 - HIGH (Accessibility - Constitution)

**Problem:** No motion preference handling

**Steps:**

#### Step 1: Detect Motion Preference (15 min)
```typescript
// src/hooks/useReducedMotion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

#### Step 2: Disable Animations When Preferred (1 hour)
1. **Landing page animations** (20 min):
   - Scroll reveals
   - Clock animations
   - Fade-ins

2. **Timer animations** (20 min):
   - Progress rings
   - Canvas rendering smoothness
   - Transition effects

3. **CSS approach** (20 min):
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }

     .scroll-reveal {
       opacity: 1 !important;
       transform: none !important;
     }
   }
   ```

#### Step 3: Test with Motion Preference (15 min)
- Enable reduced motion in browser settings
- Verify animations disabled
- Check timers still functional

**Acceptance Criteria:**
- [ ] `useReducedMotion` hook created
- [ ] Animations disabled when preferred
- [ ] Timers still functional
- [ ] CSS media query applied
- [ ] Git commit: `feat: add prefers-reduced-motion support`

---

### Task 4.5: Run Comprehensive Accessibility Audit (2 hours)
**Priority:** P1 - HIGH (Validation)

**Steps:**

#### Step 1: Automated Testing (1 hour)
1. **Run axe-core on all pages** (30 min):
   ```bash
   npx playwright test accessibility
   ```
   - Scan all 12 timer pages
   - Scan landing page
   - Scan content pages

2. **Review violations** (30 min):
   - Categorize by severity
   - Document required fixes
   - Create issue tracker

#### Step 2: Manual Testing (1 hour)
1. **Screen reader testing** (30 min):
   - NVDA (Windows) or VoiceOver (Mac)
   - Navigate through each timer
   - Verify announcements

2. **Keyboard-only testing** (30 min):
   - Complete user journeys without mouse
   - Test all keyboard shortcuts
   - Verify focus management

**Acceptance Criteria:**
- [ ] Axe-core: 0 critical violations
- [ ] Screen reader testing passed
- [ ] Keyboard-only testing passed
- [ ] WCAG 2.1 AA compliance report
- [ ] Git commit: `test: comprehensive accessibility audit`

---

### Task 4.6: Optimize Service Worker Cache Strategy (2.5 hours)
**Priority:** P1 - HIGH (PWA)

**Problem:** Network-first contradicts offline-first philosophy

**File:** `public/sw.js`

**Steps:**

#### Step 1: Implement Cache-First for Assets (1 hour)
1. **Update fetch handler** (45 min):
   ```javascript
   self.addEventListener("fetch", e => {
     const url = new URL(e.request.url);

     if (url.origin === self.location.origin) {
       // Cache-first for immutable assets (hash-based filenames)
       if (url.pathname.startsWith("/assets/")) {
         e.respondWith(
           caches.match(e.request).then(cached => {
             if (cached) return cached;

             return fetch(e.request).then(response => {
               // Cache for future use
               return caches.open(CACHE_VER).then(cache => {
                 cache.put(e.request, response.clone());
                 return response;
               });
             });
           })
         );
         return;
       }

       // Network-first for HTML (always get latest)
       if (url.pathname === "/" || url.pathname.endsWith(".html")) {
         e.respondWith(
           fetch(e.request)
             .then(r => {
               caches.open(CACHE_VER).then(c => c.put(e.request, r.clone()));
               return r;
             })
             .catch(() => caches.match(e.request))
         );
         return;
       }
     }
   });
   ```

2. **Test cache behavior** (15 min):
   - Build and deploy
   - Load page online
   - Go offline
   - Verify assets load from cache

#### Step 2: Expand Precache List (45 min)
```javascript
const CACHE_VER = "sc-v5";
const ASSETS = [
  "/manifest.webmanifest",
  "/",
  "/index.html",
  // Add core assets
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  // CSS will be auto-added by Vite
  // JS will be auto-added by Vite
];
```

#### Step 3: Add Offline Fallback (45 min)
1. **Create offline.html** (20 min):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Stoppclock - Offline</title>
     <style>/* Minimal inline styles */</style>
   </head>
   <body>
     <h1>You're Offline</h1>
     <p>Your timers are still available:</p>
     <ul>
       <li><a href="#/countdown">Countdown</a></li>
       <li><a href="#/stopwatch">Stopwatch</a></li>
       <!-- ... -->
     </ul>
   </body>
   </html>
   ```

2. **Serve offline page for network-only routes** (25 min)

**Acceptance Criteria:**
- [ ] Cache-first for immutable assets
- [ ] Network-first for HTML
- [ ] Offline page created
- [ ] Offline testing passed (DevTools offline mode)
- [ ] Load time improved (cache hits)
- [ ] Git commit: `feat: optimize service worker cache strategy`

---

### Task 4.7: Add PWA Installation Tests (2 hours)
**Priority:** P2 - MEDIUM (Quality)

**Steps:**

#### Step 1: Manifest Validation Tests (30 min)
```typescript
test('should have valid manifest', async ({ page }) => {
  await page.goto('/');

  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');

  const manifestResponse = await page.goto('/manifest.webmanifest');
  expect(manifestResponse?.status()).toBe(200);

  const manifest = await manifestResponse?.json();
  expect(manifest.name).toBe('Stoppclock');
  expect(manifest.short_name).toBeTruthy();
  expect(manifest.icons).toHaveLength(/* expected */);
});
```

#### Step 2: Service Worker Tests (1 hour)
1. **Test: SW registration** (20 min)
2. **Test: Cache population** (20 min)
3. **Test: Offline functionality** (20 min)

#### Step 3: Install Prompt Tests (30 min)
- Test: `beforeinstallprompt` event handled
- Test: Install button functional
- Test: Installed app launches correctly

**Acceptance Criteria:**
- [ ] 5+ PWA tests written
- [ ] All tests pass
- [ ] Offline mode validated
- [ ] Git commit: `test: add PWA installation test suite`

---

### Sprint 4 Mid-Sprint Checkpoint (Day 3)

**Completed Tasks Check:**
- [ ] Tasks 4.1-4.3: Accessibility improvements done
- [ ] WCAG violations fixed
- [ ] Keyboard navigation improved

**Metrics Review:**
- [ ] Axe-core scan: 0 critical violations
- [ ] Color contrast: All passing
- [ ] Screen reader functional

**Go/No-Go Decision:**
- If accessibility tests failing: **Stop and fix**
- If PWA cache broken: **Adjust approach**
- Otherwise: **Continue**

---

### Sprint 4 Definition of Done

**Accessibility:**
- [ ] All 7 tasks completed
- [ ] WCAG 2.1 AA compliance achieved
- [ ] Axe-core: 0 critical violations
- [ ] Color contrast: All passing (≥4.5:1)
- [ ] Screen reader support complete
- [ ] Keyboard navigation comprehensive
- [ ] `prefers-reduced-motion` supported

**PWA:**
- [ ] Cache-first strategy implemented
- [ ] Offline fallback page created
- [ ] Service worker optimized
- [ ] 5+ PWA tests passing

**Testing:**
- [ ] Accessibility test suite created
- [ ] Manual accessibility testing passed
- [ ] PWA tests passing

**Deployment:**
- [ ] Merged to `dev/iterative-improvements`
- [ ] Staging deployment successful
- [ ] Tag: `v1.4.0-sprint4`

---

## Sprint 5: Polish & Validation
**Duration:** 1 week (20 hours)
**Branch:** `feature/sprint-5-polish`
**Goal:** Constitution validation, final optimizations, production readiness

### Milestone Objectives
- ✅ All 6 Constitution principles validated
- ✅ Lighthouse score ≥92
- ✅ Load time <2s verified
- ✅ Test coverage ≥70%
- ✅ Zero critical bugs
- ✅ Production deployment ready

---

### Task 5.1: Constitution Compliance Validation (3 hours)
**Priority:** P0 - CRITICAL (Validation)

**Goal:** Verify all 6 principles passing

**Steps:**

#### Principle #1: Privacy First (30 min)
1. **Manual verification** (15 min):
   - First visit: Consent banner appears
   - Without consent: No AdSense/analytics loaded
   - Network tab: No tracking requests

2. **Automated test** (15 min):
   ```typescript
   test('should not load tracking without consent', async ({ page }) => {
     await page.goto('/');

     const requests: string[] = [];
     page.on('request', req => requests.push(req.url()));

     await page.waitForTimeout(2000);

     expect(requests).not.toContainEqual(expect.stringMatching(/googlesyndication/));
     expect(requests).not.toContainEqual(expect.stringMatching(/google-analytics/));
   });
   ```

**Status: ✅ PASS / ❌ FAIL**

---

#### Principle #2: Performance & Speed (1 hour)
1. **Lighthouse audit** (30 min):
   ```bash
   lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-report.html
   ```
   - Target: Score ≥90
   - Verify: Load time <2s
   - Check: All metrics green

2. **Real-world testing** (20 min):
   - Test on 3G network (Chrome DevTools throttling)
   - Measure actual load time
   - Verify bundle size <150KB

3. **Fix any issues** (10 min if needed)

**Status: ✅ PASS / ❌ FAIL**

---

#### Principle #3: Classroom Optimized (30 min)
1. **Fullscreen ad test** (15 min):
   ```typescript
   test('should hide ads in fullscreen', async ({ page }) => {
     await page.goto('/#/countdown');
     await page.keyboard.press('f'); // Enter fullscreen

     // Wait for fullscreen to activate
     await page.waitForTimeout(500);

     const adsVisible = await page.locator('.ad-unit').isVisible();
     expect(adsVisible).toBe(false);
   });
   ```

2. **Keyboard navigation test** (10 min):
   - Verify Space/R/F work in fullscreen
   - No keyboard traps

3. **Offline test** (5 min):
   - Go offline
   - Verify timers still work

**Status: ✅ PASS / ❌ FAIL**

---

#### Principle #4: Progressive Enhancement (15 min)
1. **Test without ads** (10 min):
   ```bash
   # Block AdSense in DevTools
   # Verify timers still functional
   ```

2. **Test without JavaScript** (5 min):
   - Disable JS
   - Verify graceful degradation
   - (Timers won't work, but page loads)

**Status: ✅ PASS / ❌ FAIL**

---

#### Principle #5: Accessibility (30 min)
1. **Run final axe-core audit** (15 min):
   ```bash
   npx playwright test accessibility
   ```
   - Target: 0 critical violations
   - Verify: WCAG 2.1 AA

2. **Manual screen reader test** (15 min):
   - Navigate with screen reader
   - Verify all timers announced correctly

**Status: ✅ PASS / ❌ FAIL**

---

#### Principle #6: Code Quality (15 min)
1. **TypeScript strict check** (5 min):
   ```bash
   npx tsc --noEmit
   ```

2. **Test suite** (5 min):
   ```bash
   npm run test:e2e
   ```
   - Target: All tests pass
   - Coverage: ≥70%

3. **Console errors** (5 min):
   - Build production
   - Check browser console
   - Verify: 0 errors

**Status: ✅ PASS / ❌ FAIL**

---

**Acceptance Criteria:**
- [ ] All 6 principles validated
- [ ] Constitution report generated
- [ ] Any failures documented and fixed
- [ ] Git commit: `test: validate all constitution principles`

---

### Task 5.2: Final Performance Optimizations (2.5 hours)
**Priority:** P1 - HIGH (Performance)

**Steps:**

#### Step 1: Bundle Analysis (30 min)
```bash
npm run build
npx vite-bundle-visualizer
```
- Identify large dependencies
- Check for duplicate code
- Verify tree-shaking working

#### Step 2: Optimize Images & Icons (1 hour)
1. **Convert to WebP** (30 min):
   - Timer icons
   - Landing page images
   - Compress with quality 85

2. **Add responsive images** (30 min):
   ```html
   <picture>
     <source srcset="icon-512.webp" type="image/webp">
     <img src="icon-512.png" alt="Timer">
   </picture>
   ```

#### Step 3: Font Optimization (30 min)
1. **Preload critical fonts** (15 min):
   ```html
   <link rel="preload" href="/fonts/segoe-ui.woff2" as="font" crossorigin>
   ```

2. **Add font-display: swap** (15 min):
   ```css
   @font-face {
     font-family: 'Segoe UI';
     font-display: swap;
   }
   ```

#### Step 4: Verify Improvements (30 min)
- Run Lighthouse again
- Compare before/after
- Verify score ≥92

**Acceptance Criteria:**
- [ ] Bundle optimized
- [ ] Images compressed
- [ ] Fonts preloaded
- [ ] Lighthouse ≥92
- [ ] Git commit: `perf: final performance optimizations`

---

### Task 5.3: Add Missing E2E Tests (3 hours)
**Priority:** P1 - HIGH (Coverage)

**Goal:** Reach 70% test coverage

**Steps:**

#### Step 1: Time Since Timer Tests (1 hour)
Create `tests/e2e/10-time-since.spec.ts`:
1. Test: Select past date
2. Test: Calculate duration
3. Test: Display format
4. Test: State persistence
5. Test: Historical events

#### Step 2: Edge Case Tests (1 hour)
Create `tests/e2e/11-edge-cases.spec.ts`:
1. Test: localStorage quota exceeded
2. Test: Rapid button clicking
3. Test: Maximum timer values
4. Test: Zero duration handling
5. Test: Negative time prevention

#### Step 3: Visual Regression Tests (1 hour)
Create `tests/visual/screenshots.spec.ts`:
1. Capture baseline screenshots
2. Compare on changes
3. Threshold: 0.1% difference

**Acceptance Criteria:**
- [ ] 10+ additional tests added
- [ ] All edge cases covered
- [ ] Visual regression baseline set
- [ ] Test coverage ≥70%
- [ ] Git commit: `test: add edge case and visual regression tests`

---

### Task 5.4: Create Production Deployment Checklist (1.5 hours)
**Priority:** P1 - HIGH (Preparation)

**File:** Create `docs/DEPLOYMENT_CHECKLIST.md`

**Sections:**

#### Pre-Deployment
- [ ] All tests passing
- [ ] Lighthouse score ≥92
- [ ] Constitution validation passed
- [ ] No console errors
- [ ] Bundle size <150KB
- [ ] CHANGELOG.md updated
- [ ] Version bumped (package.json)
- [ ] Git tag created

#### Deployment
- [ ] Build production: `npm run build`
- [ ] Verify build output
- [ ] Test preview: `npm run preview`
- [ ] Deploy to staging
- [ ] Smoke tests on staging
- [ ] Deploy to production
- [ ] Monitor for errors (first 1 hour)

#### Post-Deployment
- [ ] Verify all timers functional
- [ ] Run Lighthouse on production URL
- [ ] Check analytics (no errors)
- [ ] Monitor error tracking
- [ ] Update documentation
- [ ] Announce release

**Acceptance Criteria:**
- [ ] Checklist comprehensive
- [ ] All items actionable
- [ ] Roll back procedure documented
- [ ] Git commit: `docs: create production deployment checklist`

---

### Task 5.5: Fix Remaining High-Priority Bugs (2 hours)
**Priority:** P1 - HIGH (Quality)

**From Analysis:** 5 high-priority bugs remaining

1. **Stopwatch Lap Race Condition** (30 min)
2. **Pomodoro Drift** (30 min)
3. **Couples Timer Phase Transition** (30 min)
4. **Alarm Triggered State** (15 min)
5. **Metronome Audio Context** (15 min)

**Acceptance Criteria:**
- [ ] All 5 bugs fixed
- [ ] Tests written for each
- [ ] Manual verification passed
- [ ] Git commit: `fix: resolve remaining high-priority bugs`

---

### Task 5.6: Documentation Update (2 hours)
**Priority:** P2 - MEDIUM (Quality)

**Files to Update:**

#### 1. CLAUDE.md (30 min)
- Add new hooks (useRaf, useTimerPersistence, etc.)
- Update architecture section
- Document refactoring changes
- Add performance notes

#### 2. README.md (30 min)
- Update feature list
- Add performance metrics
- Update constitution compliance
- Add screenshots

#### 3. CHANGELOG.md (30 min)
- Document all sprint changes
- Group by category (Features, Fixes, Performance, etc.)
- Follow keep-a-changelog format

#### 4. Create ARCHITECTURE.md (30 min)
- Document current architecture
- Component hierarchy
- State management
- Data flow diagrams

**Acceptance Criteria:**
- [ ] All 4 documents updated
- [ ] Accurate and comprehensive
- [ ] Well-formatted
- [ ] Git commit: `docs: update documentation for v1.5.0`

---

### Task 5.7: Create Release Notes (1.5 hours)
**Priority:** P2 - MEDIUM (Communication)

**File:** Create `docs/RELEASE_NOTES_v1.5.0.md`

**Sections:**

#### Highlights
- Constitution compliance achieved ✅
- 75% bundle size reduction
- 70%+ test coverage
- WCAG 2.1 AA compliant
- 10x keyboard shortcut discoverability

#### Breaking Changes
- None (fully backward compatible)

#### New Features
- Interactive pinned timer previews
- Toast notification system
- Standardized timer entry flow
- Visual keyboard shortcuts
- Screen reader support

#### Bug Fixes
- CookingTimer alarm repetition
- State corruption bugs (3 fixed)
- Memory leaks fixed
- Performance optimizations

#### Performance
- Lighthouse: 65 → 92+
- Load time: 18s → <2s (3G)
- Bundle: 645KB → <150KB
- FPS: 60 → 1 (when idle)

#### Accessibility
- WCAG 2.1 AA compliant
- Full keyboard navigation
- Screen reader support
- Color contrast validated
- Reduced motion support

#### Testing
- Test count: 51 → 100+
- Coverage: 45% → 70%+
- Cross-tab sync tests
- Accessibility tests
- Visual regression tests

**Acceptance Criteria:**
- [ ] Release notes comprehensive
- [ ] All changes documented
- [ ] Clear and user-friendly
- [ ] Git commit: `docs: create release notes for v1.5.0`

---

### Sprint 5 Mid-Sprint Checkpoint (Day 3)

**Completed Tasks Check:**
- [ ] Constitution validation passed
- [ ] Final optimizations done
- [ ] Documentation updated

**Metrics Review:**
- [ ] Lighthouse ≥92: ✅ / ❌
- [ ] Load time <2s: ✅ / ❌
- [ ] Test coverage ≥70%: ✅ / ❌
- [ ] Zero critical bugs: ✅ / ❌

**Go/No-Go Decision:**
- If any constitution principle fails: **Stop and fix**
- If Lighthouse <90: **Optimize further**
- If bugs remain: **Fix before release**
- Otherwise: **Proceed to production**

---

### Sprint 5 Definition of Done

**Constitution:**
- [ ] All 6 principles validated and passing
- [ ] Lighthouse score ≥92
- [ ] Load time <2s on 3G
- [ ] WCAG 2.1 AA compliant

**Quality:**
- [ ] All 7 tasks completed
- [ ] Test coverage ≥70%
- [ ] Zero critical bugs
- [ ] Zero console errors
- [ ] All E2E tests passing (100+)

**Documentation:**
- [ ] CLAUDE.md updated
- [ ] README.md updated
- [ ] CHANGELOG.md updated
- [ ] ARCHITECTURE.md created
- [ ] RELEASE_NOTES_v1.5.0.md created
- [ ] Deployment checklist created

**Performance:**
- [ ] Bundle size <150KB
- [ ] Images optimized
- [ ] Fonts preloaded
- [ ] Service Worker optimized

**Production Readiness:**
- [ ] Staging deployment successful
- [ ] Smoke tests passed
- [ ] Rollback plan documented
- [ ] Monitoring configured

**Final Merge:**
- [ ] Merged to `main` branch
- [ ] Tagged: `v1.5.0`
- [ ] Production deployment successful
- [ ] Post-deployment monitoring (24 hours)

---

## Post-Launch Monitoring
**Duration:** 1 week
**Goal:** Ensure stable production deployment

### Day 1 (First 24 Hours)

#### Immediate Monitoring (First 4 Hours)
- [ ] Check error tracking (Sentry/LogRocket if configured)
- [ ] Monitor Lighthouse score on production
- [ ] Verify all timers functional
- [ ] Check analytics for errors
- [ ] Monitor user feedback

#### Evening Check
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify no degradation

### Day 2-7 (Week 1)

#### Daily Checks
- [ ] Review error tracking
- [ ] Check Lighthouse score (automated)
- [ ] Monitor load times
- [ ] Review user feedback
- [ ] Check test suite (CI/CD)

#### Issue Response
- **P0 (Critical):** Fix within 4 hours
- **P1 (High):** Fix within 24 hours
- **P2 (Medium):** Fix within 1 week
- **P3 (Low):** Add to backlog

### Week 1 Retrospective

**Metrics Review:**
- Lighthouse score trend
- Load time average
- Error rate
- User engagement
- Constitution compliance maintained

**Decisions:**
- Any hotfixes needed?
- Any rollbacks needed?
- Next iteration planning

---

## Risk Management

### Risk Matrix

| Risk | Probability | Impact | Mitigation | Contingency |
|------|-------------|--------|------------|-------------|
| **Code splitting breaks routes** | Medium | High | Thorough testing, gradual rollout | Keep backup, feature flag |
| **localStorage incompatibility** | Low | High | Version schema, migration path | Clear localStorage, fresh start |
| **Performance regression** | Medium | Medium | Automated Lighthouse CI | Rollback to previous sprint |
| **Accessibility violations** | Low | High | Automated axe-core tests | Fix before merging |
| **Test suite failures** | High | Medium | Fix immediately, block merges | Skip flaky tests temporarily |
| **Breaking changes** | Low | Critical | Backward compatibility checks | Rollback, hotfix |
| **Cross-tab sync breaks** | Medium | High | Comprehensive testing | Disable cross-tab, localStorage only |
| **Mobile experience degraded** | Medium | Medium | Mobile viewport testing | Conditional mobile CSS |

### Risk Mitigation Strategies

#### 1. Feature Flags
```typescript
// src/utils/feature-flags.ts
export const FEATURES = {
  CODE_SPLITTING: true,
  INTERACTIVE_PREVIEWS: true,
  TOAST_NOTIFICATIONS: true,
  NEW_TIMER_LAYOUT: false, // Rollout gradually
};
```

#### 2. Gradual Rollout
- Deploy to staging first (100% of staging users)
- Deploy to production (10% of users)
- Monitor for 24 hours
- Increase to 50%, then 100%

#### 3. Automated Rollback
```bash
# If error rate > 5%
git revert HEAD
npm run build
# Deploy previous version
```

#### 4. Monitoring Alerts
- Lighthouse score drops <85 → Alert
- Error rate >1% → Alert
- Load time >3s → Alert
- Test failures → Block deployment

---

## Rollback Procedures

### Scenario 1: Critical Bug in Production

**Trigger:** User-impacting bug (timers not working, data loss)

**Immediate Actions (Within 1 hour):**
1. Identify affected version
2. Revert to previous stable version:
   ```bash
   git revert HEAD~1  # or specific commit
   npm run build
   # Deploy immediately
   ```
3. Notify users (if needed)
4. Post-mortem analysis

**Recovery:**
1. Fix bug in development
2. Add regression test
3. Re-deploy with fix
4. Verify fix in production

---

### Scenario 2: Performance Regression

**Trigger:** Lighthouse score <85 or load time >3s

**Actions:**
1. Identify cause (bundle analyzer)
2. If code splitting issue:
   - Disable feature flag
   - Revert to static imports
   - Deploy
3. If other cause:
   - Revert specific commit
   - Deploy
4. Fix and re-deploy

---

### Scenario 3: Breaking Change

**Trigger:** Users report timers not loading saved state

**Actions:**
1. Emergency hotfix:
   ```typescript
   // Add migration logic
   function migrateState(oldState: any) {
     return {
       ...oldState,
       version: 2, // New version
       // ... migration
     };
   }
   ```
2. Deploy hotfix
3. Monitor migration success
4. Document in migration guide

---

## Success Metrics

### Sprint-Level Metrics

| Metric | Baseline | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Sprint 5 | Target |
|--------|----------|----------|----------|----------|----------|----------|--------|
| **Lighthouse Score** | 65 | 80 | 82 | 85 | 88 | 92+ | ≥90 |
| **Load Time (3G)** | 18-20s | 5s | 4s | 3.5s | 2.5s | <2s | <2s |
| **Bundle Size** | 645KB | 150KB | 145KB | 140KB | 135KB | <150KB | <150KB |
| **Test Coverage** | 45% | 50% | 60% | 70% | 70% | 70%+ | ≥70% |
| **Test Count** | 51 | 60 | 84 | 100 | 105 | 110+ | 100+ |
| **Critical Bugs** | 5 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Code Duplication** | 1500 lines | 1200 | 0 | 0 | 0 | 0 | 0 |
| **React Re-renders** | 60/sec | 30/sec | 10/sec | 5/sec | 2/sec | 1/sec | <5/sec |

### Constitution Compliance

| Principle | Baseline | Target | Sprint 5 Status |
|-----------|----------|--------|-----------------|
| Privacy First | ✅ | ✅ | ✅ PASS |
| Performance & Speed | ❌ | ✅ | ✅ PASS |
| Classroom Optimized | ⚠️ | ✅ | ✅ PASS |
| Progressive Enhancement | ✅ | ✅ | ✅ PASS |
| Accessibility | ⚠️ | ✅ | ✅ PASS |
| Code Quality | ✅ | ✅ | ✅ PASS |

### User Experience Metrics

| Metric | Baseline | Target | Sprint 5 |
|--------|----------|--------|----------|
| **Clicks to Start Timer** | 5 | 2 | 2 |
| **Keyboard Shortcut Discovery** | 5% | 50%+ | 80% |
| **Mobile Usability** | Poor | Good | Excellent |
| **Error Feedback** | Silent | Visible | Toast |
| **Cross-Tab Sync** | Untested | Tested | ✅ |

---

## Appendix: Tools & Commands

### Development Commands
```bash
# Start dev server
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Run tests
npm run test:e2e
npm run test:e2e:ui

# Code quality
npm run doctor

# Type checking
npx tsc --noEmit

# Bundle analysis
npx vite-bundle-visualizer

# Lighthouse audit
lighthouse http://localhost:4173 --output=html

# Constitution validation
npm run validate:constitution
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/sprint-X-description

# Commit with conventional commits
git commit -m "feat: description"
git commit -m "fix: description"
git commit -m "perf: description"
git commit -m "test: description"
git commit -m "docs: description"

# Merge to dev
git checkout dev/iterative-improvements
git merge feature/sprint-X-description

# Tag release
git tag v1.X.0-sprintX
git push origin --tags
```

### Testing Commands
```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/01-analog-countdown.spec.ts

# Run with UI
npm run test:e2e:ui

# Debug test
npx playwright test --debug

# Run accessibility tests
npx playwright test tests/accessibility

# Visual regression baseline
npx playwright test tests/visual --update-snapshots
```

---

## Final Checklist

**Before Starting:**
- [ ] Pre-flight checklist completed
- [ ] Baseline metrics captured
- [ ] Tools installed
- [ ] Environment ready

**After Each Sprint:**
- [ ] All tasks completed
- [ ] Definition of Done met
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Merged to dev branch
- [ ] Tagged with version

**Before Production:**
- [ ] All 5 sprints completed
- [ ] Constitution validation passed
- [ ] Deployment checklist verified
- [ ] Rollback plan ready
- [ ] Monitoring configured

**Production Launch:**
- [ ] Deploy to production
- [ ] Monitor for 24 hours
- [ ] Verify metrics
- [ ] User communication
- [ ] Celebrate success! 🎉

---

**Plan Status:** ✅ Ready for Execution
**Estimated Completion:** 5 weeks from start
**Confidence Level:** High (90%)
**Risk Level:** Low-Medium (managed)

**Next Step:** Begin Pre-Flight Checklist → Start Sprint 0 → Execute Sprint 1

---

*This plan is a living document. Update as needed based on sprint retrospectives and learnings.*
