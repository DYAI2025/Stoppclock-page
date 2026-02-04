# Tasks: Design Token System & UI/UX Improvements

**Input**: Design documents from `/specs/003-design-token-system/`
**Prerequisites**: plan.md ✅, spec.md ✅
**Branch**: `003-design-token-system`

**Tests**: E2E tests will be added incrementally as features are implemented (spec requests E2E test coverage for all features)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions
- Repository root: `/home/dyai/Dokumente/DYAI_home/Web/stoppclock-page/`
- Source: `src/` (React components, TypeScript, CSS)
- Tests: `tests/e2e/` (Playwright E2E tests)
- Design docs: `specs/003-design-token-system/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create design documentation and contracts required for implementation

- [ ] T001 [P] Create research.md in specs/003-design-token-system/research.md documenting design decisions
- [ ] T002 [P] Create data-model.md in specs/003-design-token-system/data-model.md defining Design Token, User Accessibility Preferences, CTA Button entities
- [ ] T003 [P] Create quickstart.md in specs/003-design-token-system/quickstart.md with developer guide for using design tokens
- [ ] T004 Create contracts/ directory in specs/003-design-token-system/contracts/
- [ ] T005 [P] Create design-tokens.css contract in specs/003-design-token-system/contracts/design-tokens.css
- [ ] T006 [P] Create component-props.ts contract in specs/003-design-token-system/contracts/component-props.ts

**Checkpoint**: Documentation complete - implementation can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core design token system that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Add design token CSS custom properties to src/styles.css :root section (colors, surfaces, text, interaction states per contracts/design-tokens.css)
- [ ] T008 Remove all hardcoded color values from src/styles.css and replace with var(--token-name) references
- [ ] T009 [P] Create AccessibilityPreferences type in src/types/timer-types.ts
- [ ] T010 [P] Create utility functions for loading/saving accessibility preferences to localStorage in src/utils.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Centralized Design Token System (Priority: P0) 🎯 MVP

**Goal**: Establish centralized CSS design token system with no hardcoded colors in components

**Independent Test**: Inspect any button element - all color values use CSS custom properties (e.g., `var(--stopwatch-start)`)

### Implementation for User Story 1

- [ ] T011 [P] [US1] Update Stopwatch component in src/pages/Stopwatch.tsx to use --stopwatch-start and --stopwatch-stop tokens
- [ ] T012 [P] [US1] Update Countdown component in src/pages/Countdown.tsx to use --countdown-accent and design tokens
- [ ] T013 [P] [US1] Update AnalogCountdown component in src/pages/AnalogCountdown.tsx to use design tokens
- [ ] T014 [P] [US1] Update CycleTimer component in src/pages/CycleTimer.tsx to use design tokens
- [ ] T015 [P] [US1] Update WorldClock component in src/pages/WorldClock.tsx to use design tokens
- [ ] T016 [P] [US1] Update Alarm component in src/pages/Alarm.tsx to use design tokens
- [ ] T017 [P] [US1] Update Metronome component in src/pages/Metronome.tsx to use design tokens
- [ ] T018 [P] [US1] Update ChessClock component in src/pages/ChessClock.tsx to use --chess-white and --chess-black tokens
- [ ] T019 [US1] Verify no hardcoded hex/rgb values remain in src/ directory using grep

**E2E Tests for User Story 1**:
- [ ] T020 [P] [US1] Add design token validation test in tests/e2e/design-tokens.spec.ts verifying all buttons use CSS custom properties

**Checkpoint**: All components now use design tokens exclusively - modifying a token updates all referencing elements

---

## Phase 4: User Story 2 - Enhanced Start/Stop CTAs (Priority: P1)

**Goal**: Large, clearly visible Start and Stop buttons meeting ≥56×56px requirement with proper touch targets

**Independent Test**: On Stopwatch mobile view (375px width), Start button is ≥56×56px, uses `--stopwatch-start` token, visible without scrolling

### Implementation for User Story 2

- [ ] T021 [US2] Update .btn.primary styles in src/styles.css to min-width: 56px, min-height: 56px, touch target ≥44px
- [ ] T022 [P] [US2] Enhance Stopwatch Start/Stop buttons in src/pages/Stopwatch.tsx with icon + text, proper ARIA labels
- [ ] T023 [P] [US2] Enhance Countdown Start/Pause buttons in src/pages/Countdown.tsx with icon + text, proper ARIA labels
- [ ] T024 [US2] Add CSS focus-visible styles using --focus-glow token for all primary CTAs in src/styles.css
- [ ] T025 [US2] Ensure secondary buttons (Reset, Lap) are visually smaller (36×36px) in src/styles.css

**E2E Tests for User Story 2**:
- [ ] T026 [P] [US2] Add CTA size validation test in tests/e2e/04-stopwatch.spec.ts verifying ≥56×56px buttons
- [ ] T027 [P] [US2] Add keyboard focus test in tests/e2e/04-stopwatch.spec.ts verifying Space/Enter key activation and --focus-glow outline

**Checkpoint**: Start/Stop buttons meet size requirements and work with keyboard/touch

---

## Phase 5: User Story 3 - Countdown Input Enhancement (Priority: P0)

**Goal**: Intuitive time input with wheel-style pickers on mobile and enforced digit limits

**Independent Test**: On mobile, tap minutes field - wheel picker appears (00-59); typing >2 digits is prevented

### Implementation for User Story 3

- [ ] T028 [US3] Update Countdown input fields in src/pages/Countdown.tsx to use input[type="number"] with min/max attributes
- [ ] T029 [US3] Add input validation logic to Countdown.tsx enforcing 2-digit max for minutes/seconds (00-59)
- [ ] T030 [US3] Add input validation logic to Countdown.tsx enforcing hours max value (0-12 per spec)
- [ ] T031 [US3] Implement paste event handler in Countdown.tsx to clamp pasted values to valid ranges
- [ ] T032 [US3] Add onBlur validation to Countdown.tsx inputs to correct invalid values

**E2E Tests for User Story 3**:
- [ ] T033 [P] [US3] Add input validation tests in tests/e2e/02-countdown.spec.ts verifying minutes >59 clamped to 59
- [ ] T034 [P] [US3] Add paste validation test in tests/e2e/02-countdown.spec.ts verifying "999" pasted into seconds field clamped to 59
- [ ] T035 [P] [US3] Add mobile wheel picker test (visual/manual) documented in specs/003-design-token-system/quickstart.md

**Checkpoint**: Countdown inputs validated and mobile-friendly

---

## Phase 6: User Story 4 - Last 10 Seconds Warning System (Priority: P1)

**Goal**: Visual/audio warnings in final 10 seconds with accessibility controls and epilepsy warning

**Independent Test**: Set 15-second countdown, verify warnings activate at 10 seconds with audio beep (1/second) and optional red overlay flash

### Implementation for User Story 4

- [ ] T036 [US4] Update Countdown.tsx to trigger audio beep every 1 second when remainingMs ≤ 10000 (use existing beep() function)
- [ ] T037 [US4] Update Countdown.tsx to trigger visual flash overlay (rgba(220,53,69,0.18)) every 1 second when remainingMs ≤ 10000 and flashWarnings enabled
- [ ] T038 [US4] Add flash animation CSS in src/styles.css with 150-250ms fade duration (not stroboscopic, max 1/second)
- [ ] T039 [US4] Update Countdown settings UI in src/pages/Countdown.tsx to add flashWarnings checkbox with epilepsy warning text
- [ ] T040 [US4] Implement loadAccessibilityPreferences() and saveAccessibilityPreferences() in Countdown.tsx using localStorage key sc.v1.accessibility
- [ ] T041 [US4] Add @media (prefers-reduced-motion: reduce) CSS rule to disable flash animation in src/styles.css

**E2E Tests for User Story 4**:
- [ ] T042 [P] [US4] Add warning system test in tests/e2e/02-countdown.spec.ts setting 15s countdown and verifying warnings at 10s
- [ ] T043 [P] [US4] Add flash toggle test in tests/e2e/02-countdown.spec.ts verifying epilepsy warning visible and opt-out works

**Checkpoint**: Warning system functional with accessibility controls

---

## Phase 7: User Story 5 - Chess Clock Active State & Touch Behavior (Priority: P1)

**Goal**: Clear visual indication of active player with intuitive tap behavior and debouncing

**Independent Test**: Player 1 active shows glow border and 1.03× scale; tap Player 1 area stops timer, starts Player 2, increments move count (200-300ms debounce)

### Implementation for User Story 5

- [ ] T044 [US5] Add active player state CSS in src/styles.css with box-shadow glow (0 0 0 6px rgba(0,123,255,0.12)) and transform: scale(1.03)
- [ ] T045 [US5] Update ChessClock.tsx to apply .active class to current player's div
- [ ] T046 [US5] Update ChessClock.tsx player areas to use --chess-white and --chess-black tokens (remove brown colors)
- [ ] T047 [US5] Implement tap/click handler in ChessClock.tsx to stop own timer, start opponent, increment move count
- [ ] T048 [US5] Add 200-300ms debounce to tap handler in ChessClock.tsx with immediate visual feedback
- [ ] T049 [US5] Add move counter display to ChessClock.tsx UI

**E2E Tests for User Story 5**:
- [ ] T050 [P] [US5] Add active state visual test in tests/e2e/07-chess.spec.ts verifying glow and scale on active player
- [ ] T051 [P] [US5] Add tap behavior test in tests/e2e/07-chess.spec.ts verifying turn switch and move count increment with debounce

**Checkpoint**: Chess Clock has clear active state and correct touch behavior

---

## Phase 8: User Story 6 - Accessibility & WCAG Compliance (Priority: P0)

**Goal**: All elements meet WCAG AA standards for screen readers, keyboard navigation, and color contrast

**Independent Test**: Run Lighthouse/axe audits verifying ≥4.5:1 contrast, ≥44px touch targets, zero violations

### Implementation for User Story 6

- [ ] T052 [P] [US6] Audit all text colors in src/styles.css ensuring ≥4.5:1 contrast ratio using WebAIM Contrast Checker
- [ ] T053 [P] [US6] Audit all UI component colors in src/styles.css ensuring ≥3:1 contrast ratio
- [ ] T054 [US6] Update all button styles in src/styles.css to ensure touch targets ≥44×44px (padding/min-height)
- [ ] T055 [P] [US6] Add aria-live="polite" region to Countdown.tsx for timer announcements (optional, controlled by screenReaderVerbosity setting)
- [ ] T056 [P] [US6] Add aria-live="polite" region to Stopwatch.tsx for timer announcements (optional)
- [ ] T057 [US6] Verify all timer components support full keyboard navigation (Space, Enter, Arrow keys, R for reset)
- [ ] T058 [US6] Update Countdown.tsx epilepsy warning text to include proper ARIA labels

**E2E Tests for User Story 6**:
- [ ] T059 [US6] Create accessibility test suite in tests/e2e/accessibility.spec.ts with axe-core integration
- [ ] T060 [P] [US6] Add contrast validation test in tests/e2e/accessibility.spec.ts verifying all text ≥4.5:1
- [ ] T061 [P] [US6] Add touch target test in tests/e2e/accessibility.spec.ts verifying all interactive elements ≥44px
- [ ] T062 [P] [US6] Add keyboard navigation test in tests/e2e/accessibility.spec.ts verifying all functions work without mouse
- [ ] T063 [US6] Run Lighthouse accessibility audit and document results in specs/003-design-token-system/quickstart.md

**Checkpoint**: WCAG AA compliance achieved - zero accessibility violations

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [ ] T064 [P] Update quickstart.md with mobile testing instructions for wheel pickers and touch targets
- [ ] T065 [P] Document design token usage patterns in quickstart.md with code examples
- [ ] T066 Verify bundle size remains <180 kB gzipped using npm run build
- [ ] T067 Run full E2E test suite and ensure all tests pass
- [ ] T068 [P] Update IMPLEMENTATION_GUIDE.md if needed with design token patterns
- [ ] T069 Manual cross-browser testing (Chrome, Firefox, Safari, Edge) documented in quickstart.md
- [ ] T070 Manual mobile testing on real devices (iOS Safari, Android Chrome) documented in quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Design Tokens) - FOUNDATIONAL for others but can be tested independently
  - US2 (Enhanced CTAs) - Can start after US1 complete
  - US3 (Countdown Input) - Can start after US1 complete
  - US4 (Warning System) - Can start after US1 + US3 complete
  - US5 (Chess Clock) - Can start after US1 complete
  - US6 (Accessibility) - Can start after US1 complete, validates all others
- **Polish (Phase 9)**: Depends on all P0/P1 user stories (US1, US2, US3, US4, US5, US6)

### User Story Dependencies

- **User Story 1 (P0 - Design Tokens)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1 - CTAs)**: Should start after US1 complete (needs design tokens)
- **User Story 3 (P0 - Countdown Input)**: Can start after US1 complete
- **User Story 4 (P1 - Warning System)**: Depends on US1 + US3 (needs tokens + countdown functionality)
- **User Story 5 (P1 - Chess Clock)**: Can start after US1 complete
- **User Story 6 (P0 - Accessibility)**: Can start after US1, validates all other stories

### Within Each User Story

- Implementation tasks before E2E tests (tests verify implementation)
- Tasks marked [P] within same story can run in parallel
- Complete all implementation tasks for a story before moving to next priority

### Parallel Opportunities

- **Phase 1 Setup**: All 6 tasks (T001-T006) can run in parallel
- **Phase 2 Foundational**: T009 and T010 can run in parallel after T007-T008 complete
- **US1 Implementation**: T011-T018 (all component updates) can run in parallel
- **US1 E2E**: T020 can run in parallel with implementation tasks (written first, fails until implementation)
- **US2 Implementation**: T022-T023 can run in parallel
- **US2 E2E**: T026-T027 can run in parallel
- **US3 E2E**: T033-T035 can run in parallel
- **US4 E2E**: T042-T043 can run in parallel
- **US5 E2E**: T050-T051 can run in parallel
- **US6 Implementation**: T052-T053, T055-T056 can run in parallel
- **US6 E2E**: T060-T062 can run in parallel
- **Phase 9 Polish**: T064-T065, T068 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all component updates for User Story 1 together:
Task T011: "Update Stopwatch component in src/pages/Stopwatch.tsx to use design tokens"
Task T012: "Update Countdown component in src/pages/Countdown.tsx to use design tokens"
Task T013: "Update AnalogCountdown component in src/pages/AnalogCountdown.tsx to use design tokens"
Task T014: "Update CycleTimer component in src/pages/CycleTimer.tsx to use design tokens"
Task T015: "Update WorldClock component in src/pages/WorldClock.tsx to use design tokens"
Task T016: "Update Alarm component in src/pages/Alarm.tsx to use design tokens"
Task T017: "Update Metronome component in src/pages/Metronome.tsx to use design tokens"
Task T018: "Update ChessClock component in src/pages/ChessClock.tsx to use design tokens"

# Then verify:
Task T019: "Verify no hardcoded hex/rgb values remain"
```

---

## Implementation Strategy

### MVP First (P0 User Stories Only)

1. Complete Phase 1: Setup (documentation)
2. Complete Phase 2: Foundational (design token system in CSS)
3. Complete Phase 3: User Story 1 (apply tokens to all components) - **CORE MVP**
4. Complete Phase 5: User Story 3 (countdown input validation) - **P0 requirement**
5. Complete Phase 8: User Story 6 (accessibility compliance) - **P0 requirement**
6. **STOP and VALIDATE**: Run all E2E tests, Lighthouse audit
7. Deploy MVP with P0 features

### Full P0 + P1 Delivery

1. Complete MVP (US1, US3, US6)
2. Add Phase 4: User Story 2 (enhanced CTAs) - **P1 feature**
3. Add Phase 6: User Story 4 (warning system) - **P1 feature**
4. Add Phase 7: User Story 5 (chess clock) - **P1 feature**
5. Complete Phase 9: Polish & validation
6. **Full E2E test suite passing**
7. Deploy complete feature

### Incremental Delivery Plan

1. **Release 1 (MVP)**: US1 + US3 + US6 (Design Tokens + Input Validation + Accessibility) - ~30 tasks
2. **Release 2**: Add US2 + US5 (CTAs + Chess Clock) - ~20 tasks
3. **Release 3**: Add US4 (Warning System) - ~8 tasks
4. **Release 4**: Polish and optimization - ~7 tasks

---

## Summary

**Total Tasks**: 70
- Phase 1 (Setup): 6 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (US1 - Design Tokens): 10 tasks
- Phase 4 (US2 - CTAs): 7 tasks
- Phase 5 (US3 - Input): 8 tasks
- Phase 6 (US4 - Warnings): 8 tasks
- Phase 7 (US5 - Chess): 8 tasks
- Phase 8 (US6 - Accessibility): 12 tasks
- Phase 9 (Polish): 7 tasks

**Parallel Opportunities**: 35 tasks marked [P] can run in parallel within their constraints

**MVP Scope** (P0 features only):
- Phase 1-2 (10 tasks) + US1 (10 tasks) + US3 (8 tasks) + US6 (12 tasks) = **40 tasks for MVP**

**Independent Tests**: Each user story has clear test criteria and can be validated independently

**Constitution Compliance**: All tasks respect zero-backend, privacy-first, offline-capable requirements

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- E2E tests written alongside implementation to verify functionality
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are absolute from repository root
- Design tokens must be established before component updates (Foundational phase blocking)
