# Feature Specification: Design Token System & UI/UX Improvements

**Feature Branch**: `003-design-token-system`
**Created**: 2025-10-20
**Status**: Draft
**Input**: User description: "Design-Änderungen — kompakt, explizit & handlungsbereit - Comprehensive UI/UX improvements including centralized design tokens, enhanced CTAs, accessibility improvements, and component-specific enhancements"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Centralized Design Token System (Priority: P0)

As a designer or developer, I need a centralized design token system so that all colors, spacing, and visual elements remain consistent across the entire timer application.

**Why this priority**: Foundation for all other UI improvements - must be implemented first.

**Independent Test**: Verify all UI components use CSS variables instead of hardcoded values.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** I inspect any button, **Then** all color values use CSS custom properties (e.g., `var(--stopwatch-start)`)
2. **Given** I modify a token value, **When** I reload, **Then** all components using that token reflect the new value
3. **Given** I search the codebase, **When** looking for hardcoded colors, **Then** no component files contain direct hex/rgb values

---

### User Story 2 - Enhanced Start/Stop CTAs (Priority: P1)

As a timer user, I need large, clearly visible Start and Stop buttons so that I can quickly control timers without precision tapping.

**Why this priority**: Core user interaction - directly impacts usability.

**Independent Test**: Verify buttons meet size requirements (≥56×56px) and work with keyboard/touch.

**Acceptance Scenarios**:

1. **Given** I am on Stopwatch, **When** I view on mobile (375px width), **Then** Start button is ≥56×56px, uses `--stopwatch-start` token, visible without scrolling
2. **Given** timer is running, **When** I view Stop button, **Then** it uses `--stopwatch-stop` token, has ≥44px touch target
3. **Given** I press Space key, **When** on any timer, **Then** primary CTA activates and shows `--focus-glow` outline

---

### User Story 3 - Countdown Input Enhancement (Priority: P0)

As a countdown user on mobile, I need an intuitive time input method (wheel picker) so that I can quickly set time without typing errors.

**Why this priority**: Critical usability blocker for Countdown on mobile.

**Independent Test**: Verify mobile shows wheel picker and enforces digit limits.

**Acceptance Scenarios**:

1. **Given** I tap minutes on mobile, **When** input focused, **Then** wheel-style picker appears (00-59)
2. **Given** I type time values, **When** entering >2 digits, **Then** input limited to 2 characters
3. **Given** I paste "999", **When** into seconds field, **Then** value clamped to 59

---

### User Story 4 - Last 10 Seconds Warning System (Priority: P1)

As a countdown user, I need visual/audio warnings in final 10 seconds so that I can prepare for timer's end.

**Why this priority**: Significant UX enhancement with accessibility considerations.

**Independent Test**: Set 15-second countdown, verify warnings activate at 10 seconds.

**Acceptance Scenarios**:

1. **Given** 10 seconds remaining, **When** timer ticks, **Then** audio beep plays (1/second)
2. **Given** flash enabled, **When** in final 10 seconds, **Then** red overlay (rgba(220,53,69,0.18)) fades over 150-250ms/second
3. **Given** settings accessed, **When** viewing flash option, **Then** epilepsy warning visible with opt-out toggle

---

### User Story 5 - Chess Clock Active State & Touch Behavior (Priority: P1)

As a chess player, I need clear visual indication of whose turn it is with intuitive tap behavior.

**Why this priority**: Core Chess Clock functionality.

**Independent Test**: Verify active player shows glow/scale, tap switches turns.

**Acceptance Scenarios**:

1. **Given** Player 1 active, **When** viewing, **Then** see glow border and 1.03× scale
2. **Given** Player 1 turn, **When** I tap Player 1 area, **Then** timer stops, Player 2 starts, move count increments (200-300ms debounce)
3. **Given** interface displayed, **When** examining areas, **Then** Player 1 uses `--chess-white`, Player 2 uses `--chess-black`

---

### User Story 6 - Accessibility & WCAG Compliance (Priority: P0)

As a user with disabilities, I need all elements to meet WCAG AA standards for screen readers, keyboard navigation, and color contrast.

**Why this priority**: Critical for legal compliance and inclusive design.

**Independent Test**: Run Lighthouse/axe audits, verify ≥4.5:1 contrast, ≥44px targets.

**Acceptance Scenarios**:

1. **Given** any text, **When** measuring contrast, **Then** ≥4.5:1 for text, ≥3:1 for UI components
2. **Given** touch device, **When** interacting, **Then** all targets ≥44×44 pixels
3. **Given** countdown running, **When** using screen reader, **Then** hear time announcements via `aria-live="polite"`
4. **Given** keyboard navigation, **When** accessing pages, **Then** all functions work without mouse

---

### Edge Cases

- `prefers-reduced-motion` enabled conflicts with animation toggles (respect OS preference)
- Very long timezone names (truncate with ellipsis, show full on hover)
- Countdown time exceeding max (clamp and show validation)
- Rapid tapping Chess Clock (debounce with visual feedback)
- Autoplay blocked audio (show prompt for user interaction)
- Token migration for existing components (phased rollout with regression tests)

## Requirements *(mandatory)*

### Functional Requirements

**Design Token System (P0)**
- **FR-001**: System MUST define all colors as CSS custom properties in root stylesheet
- **FR-002**: System MUST use semantic token names (`--stopwatch-start`, not `--color-1`)
- **FR-003**: System MUST include tokens for: colors, surface backgrounds, text, focus states
- **FR-004**: System MUST eliminate all hardcoded hex/rgb values from components
- **FR-005**: System MUST provide `--focus-glow` token for consistent focus indication

**Enhanced CTAs (P1)**
- **FR-006**: Start buttons MUST be ≥56×56px with touch targets ≥44×44px
- **FR-007**: Start buttons MUST use `--stopwatch-start`, Stop buttons `--stopwatch-stop`
- **FR-008**: Primary actions MUST be visually prominent vs secondary actions
- **FR-009**: All primary CTAs MUST be visible without scrolling
- **FR-010**: CTAs MUST support keyboard (Space, Enter) and touch/click

**Countdown Input (P0)**
- **FR-011**: Mobile MUST display wheel-style pickers for time input
- **FR-012**: Desktop MUST display number inputs with steppers
- **FR-013**: Minutes/seconds MUST enforce 2-digit max (00-59)
- **FR-014**: Hours MUST enforce max value (default 0-99)
- **FR-015**: System MUST validate/clamp pasted values
- **FR-016**: System MUST prevent >allowed digits per field

**Last 10 Seconds Warning (P1)**
- **FR-017**: System MUST trigger warnings at 10 seconds remaining
- **FR-018**: Audio MUST play 1 beep/second if enabled
- **FR-019**: Visual MUST show rgba(220,53,69,0.18) overlay, 150-250ms fade
- **FR-020**: Flash MUST NOT be stroboscopic (max 1/second, ≤250ms visible)
- **FR-021**: Settings MUST provide separate toggles for audio/flash
- **FR-022**: System MUST display epilepsy warning for flash features
- **FR-023**: System MUST respect autoplay policies, prompt for interaction

**Chess Clock (P1)**
- **FR-024**: Active player MUST show glow (`box-shadow: 0 0 0 6px rgba(0,123,255,0.12)`) and 1.03× scale
- **FR-025**: Players MUST use `--chess-white` and `--chess-black` (no brown)
- **FR-026**: Tap own area MUST stop timer, start opponent, increment moves
- **FR-027**: System MUST debounce taps (200-300ms)
- **FR-028**: Visual feedback MUST appear immediately during debounce

**Accessibility (P0)**
- **FR-029**: Text MUST meet WCAG AA (≥4.5:1 contrast)
- **FR-030**: UI components MUST meet WCAG AA (≥3:1 contrast)
- **FR-031**: All touch targets MUST be ≥44×44px
- **FR-032**: Timers MAY provide `aria-live` announcements (opt-in/out)
- **FR-033**: Flash warnings MUST include epilepsy warning and opt-out
- **FR-034**: All functions MUST work via keyboard only

### Key Entities

- **Design Token**: CSS custom property (name, value, category, description)
- **Timer Preset**: Predefined time increment (label, value ms, color token, timer type)
- **User Accessibility Preferences**: Settings (motion, audio, flash, screen reader verbosity)
- **CTA Button**: Primary action (type, size variant, token reference, icon/label)

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Design Consistency**
- **SC-001**: 100% of colors use CSS custom properties (zero hardcoded values)
- **SC-002**: Changing token value updates all referencing elements instantly

**Usability**
- **SC-003**: 90% success rate activating timer controls on first tap
- **SC-004**: Mobile countdown input completion improves 60% vs standard input
- **SC-005**: Chess Clock turn-switch <350ms (including 200-300ms debounce)
- **SC-006**: 95% accuracy identifying active Chess Clock player without reading values

**Accessibility**
- **SC-007**: Zero Lighthouse/axe accessibility violations (WCAG AA)
- **SC-008**: 100% of interactive elements have ≥44×44px touch targets
- **SC-009**: Screen reader users complete tasks with ≥85% success rate
- **SC-010**: `prefers-reduced-motion` users experience zero motion animations

**Warnings**
- **SC-011**: Users notice 10-second warnings in 95% of sessions
- **SC-012**: Flash opt-out rate <30%

**Cross-Device**
- **SC-013**: Visual consistency across Chrome, Firefox, Safari, Edge
- **SC-014**: Functions correctly 320px-2560px viewport without horizontal scrolling
