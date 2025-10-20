# Implementation Plan: Design Token System & UI/UX Improvements

**Branch**: `003-design-token-system` | **Date**: 2025-10-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-design-token-system/spec.md`

## Summary

This feature implements a centralized CSS design token system and comprehensive UI/UX improvements across all timer components, including enhanced CTAs, accessible input controls, warning systems, and WCAG AA compliance. The implementation focuses on consistency, accessibility, and mobile usability without requiring backend changes or additional dependencies.

## Technical Context

**Language/Version**: TypeScript 5.6.3, React 18.3.1
**Primary Dependencies**: Vite 5.4.10 (build tool), Playwright 1.48.0 (E2E testing)  
**Storage**: localStorage (client-side persistence only, per constitution)  
**Testing**: Playwright E2E tests (existing framework)  
**Target Platform**: Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+), PWA-capable
**Project Type**: Single-page web application (existing React SPA)  
**Performance Goals**: ≥50 FPS analog rendering, <180 kB gzipped JS bundle, <1s timer drift/hour
**Constraints**: Offline-capable (PWA), zero-backend, privacy-first, vendor lock-in prevention
**Scale/Scope**: 8 timer tools UI enhancement, ~200 LOC CSS tokens, ~500 LOC component updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate 1: Privacy-First Design ✅ PASS

**Requirement**: No data collection without consent, all state local-only

**Compliance**: 
- Design token system is purely CSS - no data collection
- UI improvements operate on existing localStorage state model
- No new tracking, analytics, or third-party services introduced
- Flash warning settings persist to localStorage with user consent

**Verdict**: ✅ No privacy violations

### Gate 2: Zero-Backend Architecture ✅ PASS

**Requirement**: Fully static, no server-side components

**Compliance**:
- All changes are client-side CSS and React component updates
- No API calls required
- Design tokens implemented as CSS custom properties
- State management remains localStorage-based

**Verdict**: ✅ No backend dependencies introduced

### Gate 3: Offline-Capable PWA ✅ PASS

**Requirement**: Full functionality offline after first load

**Compliance**:
- CSS tokens cached by existing Service Worker
- All UI improvements work offline (no network dependencies)
- No degradation of offline functionality

**Verdict**: ✅ Offline capability maintained

### Gate 4: Vendor Lock-In Prevention ✅ PASS

**Requirement**: No proprietary platform code, standard Web APIs only

**Compliance**:
- Uses standard CSS custom properties (Web API)
- Standard HTML5 input types (wheel pickers are native browser UI)
- Web Audio API (existing, standard)
- No vendor-specific tokens or frameworks

**Verdict**: ✅ Platform-agnostic implementation

### Gate 5: Complete Implementations Only ⚠️ REQUIRES ATTENTION

**Requirement**: No placeholders, 100% functional before release

**Compliance Strategy**:
- P0 items (Design Tokens, Countdown Input, Accessibility) MUST be 100% complete
- P1 items (CTAs, Warnings, Chess Clock) MUST be fully functional (no partial implementations)
- P2/P3 items may be deferred to future releases if time-constrained
- Release criteria: All P0/P1 features complete + E2E tests passing

**Verdict**: ⚠️ Must ensure no half-implemented features ship

### Gate 6: Accessibility & Performance Standards ✅ PASS

**Requirement**: WCAG AA, <180 kB JS, ≥50 FPS

**Compliance**:
- FR-029 to FR-034 explicitly require WCAG AA compliance
- Design token system adds minimal overhead (<5 kB)
- Performance improvements via CSS transforms (GPU-accelerated)
- Success criteria SC-007 mandates zero accessibility violations

**Verdict**: ✅ Standards met by design

---

**OVERALL GATE STATUS**: ✅ PASS with attention to complete implementations only

**Action Items**:
1. Prioritize P0/P1 features for MVP
2. Defer P2/P3 to subsequent releases if needed
3. Ensure E2E tests cover all shipped features 100%

## Project Structure

### Documentation (this feature)

```
specs/003-design-token-system/
├── plan.md              # This file
├── research.md          # Phase 0: Design system patterns, accessibility best practices
├── data-model.md        # Phase 1: Design token schema, user preference schema
├── quickstart.md        # Phase 1: Developer guide for using design tokens
├── contracts/           # Phase 1: CSS token definitions, component prop interfaces
└── tasks.md             # Phase 2: (created by /speckit.tasks command)
└── checklists/          # Quality gates
    └── requirements.md  # Already created ✅
```

### Source Code (repository root)

```
src/
├── styles.css           # EXISTING - will be enhanced with design tokens
├── components/          # EXISTING - React timer components
│   ├── ThemeToggle.tsx       # EXISTING (from Phase 2 of 002-timer-audit)
│   └── UpdateNotification.tsx # EXISTING (from Phase 2 of 002-timer-audit)
├── pages/               # EXISTING - Timer pages to be enhanced
│   ├── Countdown.tsx         # MODIFY: Wheel pickers, enhanced CTAs, warnings
│   ├── Stopwatch.tsx         # MODIFY: Enhanced CTAs
│   ├── AnalogCountdown.tsx   # MODIFY: Preset buttons, responsive layout
│   ├── ChessClock.tsx        # MODIFY: Active state visuals, touch behavior
│   └── WorldClock.tsx        # FUTURE: Analog+digital display (if implementing)
├── hooks/               # EXISTING
│   ├── useTheme.ts           # EXISTING (from 002-timer-audit)
│   └── useKeyboardShortcuts.ts # EXISTING (from 002-timer-audit)
└── types/               # EXISTING
    └── timer-types.ts        # EXISTING - may add AccessibilityPreferences type

tests/
└── e2e/                 # EXISTING - Playwright E2E tests
    ├── 02-countdown.spec.ts  # MODIFY: Add input validation, warning system tests
    ├── 04-stopwatch.spec.ts  # MODIFY: Add CTA accessibility tests
    ├── 07-chess.spec.ts      # MODIFY: Add active state, touch behavior tests
    └── accessibility.spec.ts # NEW: WCAG AA compliance tests
```

**Structure Decision**: Single-page web application. All changes are enhancements to existing components. No new directories required - leverages existing React/TypeScript/Vite structure.

## Complexity Tracking

*No constitution violations requiring justification*

---

## Phase 0: Research & Design Decisions

### Research Topics

1. **CSS Design Token Best Practices**
   - Decision needed: Naming convention (--component-property vs --semantic-name)
   - Decision needed: Token organization (flat vs nested custom properties)
   - Research: Industry standards (Material Design tokens, Tailwind, Chakra UI)

2. **Mobile Wheel Picker Implementation**
   - Decision needed: Native HTML5 input types vs custom JavaScript picker
   - Research: Browser support for `input[type="time"]` and `input[type="number"]` mobile UX
   - Research: Fallback strategies for browsers without native wheel pickers

3. **WCAG AA Compliance Validation**
   - Decision needed: Automated testing tools (axe-core, Lighthouse, pa11y)
   - Research: ARIA live region best practices for timer announcements
   - Research: Color contrast calculation methods

4. **CSS Animation Performance**
   - Decision needed: CSS transitions vs CSS animations vs requestAnimationFrame
   - Research: GPU acceleration techniques (will-change, transform3d)
   - Research: prefers-reduced-motion implementation patterns

5. **Flash Warning Accessibility**
   - Decision needed: Overlay implementation (fixed position div vs CSS backdrop)
   - Research: Photosensitive epilepsy guidelines (WCAG 2.3.1, Trace Center)
   - Research: Warning message content and placement

### Expected Outputs (research.md)

- **Decision 1**: Token naming → Semantic naming (`--stopwatch-start` not `--green-500`)
- **Decision 2**: Wheel picker → Native HTML5 `input[type="time"]` with feature detection
- **Decision 3**: WCAG testing → axe-core + manual Lighthouse audits
- **Decision 4**: Animations → CSS transitions for UI, requestAnimationFrame for timers
- **Decision 5**: Flash overlay → Fixed position div with rgba background, 250ms max visibility

---

## Phase 1: Design & Contracts

### 1.1 Data Model (data-model.md)

**Entity**: Design Token
- **Attributes**: 
  - `name` (string): CSS custom property name (e.g., `--stopwatch-start`)
  - `value` (string): CSS value (e.g., `#28a745`, `56px`, `0 0 0 4px rgba(0,123,255,0.15)`)
  - `category` (enum): `color | spacing | effect | typography`
  - `description` (string): Purpose and usage context
- **Relationships**: Referenced by component stylesheets via `var(--name)`
- **Validation**: All tokens MUST be defined in `:root` scope

**Entity**: User Accessibility Preferences
- **Attributes**:
  - `motionPreference` (enum): `full | reduced` (default: `full`)
  - `audioWarnings` (boolean): Enable audio for countdown warnings (default: `true`)
  - `flashWarnings` (boolean): Enable visual flash warnings (default: `false` - opt-in for safety)
  - `screenReaderVerbosity` (enum): `high | low` (default: `low`)
- **Storage**: `localStorage` key `sc.v1.accessibility`
- **Relationships**: Consumed by Countdown, Metronome components

**Entity**: CTA Button Configuration
- **Attributes**:
  - `actionType` (enum): `start | stop | reset | pause`
  - `sizeVariant` (enum): `primary | secondary`
  - `colorToken` (string): Reference to design token (e.g., `--stopwatch-start`)
  - `iconLabel` (string): Accessible label for screen readers
- **Validation**: Primary CTAs MUST be ≥56×56px, Secondary ≥36×36px

### 1.2 API Contracts (contracts/)

**File**: `contracts/design-tokens.css`

```css
/**
 * Design Tokens Contract
 * 
 * All color values MUST be referenced via these tokens.
 * Direct hex/rgb values in components are FORBIDDEN (enforced by linter).
 */

:root {
  /* Action Colors */
  --stopwatch-start: #28a745;  /* Green - go/start actions */
  --stopwatch-stop:  #dc3545;  /* Red - stop/danger actions */
  --countdown-accent: #17a2b8; /* Teal - countdown specific */
  
  /* Chess Clock */
  --chess-white: #ffffff;      /* Player 1 background */
  --chess-black: #000000;      /* Player 2 background */
  
  /* Surface Colors */
  --surface-1: #f8f9fa;        /* Primary background */
  --surface-2: #e9ecef;        /* Secondary background */
  
  /* Text Colors */
  --text-primary: #212529;     /* Main text */
  --text-secondary: #6c757d;   /* Muted text */
  
  /* Interaction States */
  --focus-glow: 0 0 0 4px rgba(0, 123, 255, 0.15); /* Focus outline */
  --hover-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);   /* Hover elevation */
  
  /* Warning Flash Overlay */
  --warning-flash: rgba(220, 53, 69, 0.18);        /* Semi-transparent red */
}
```

**File**: `contracts/component-props.ts`

```typescript
/**
 * Component Props Contract
 * 
 * Standardized prop interfaces for enhanced components
 */

export interface CTAButtonProps {
  actionType: 'start' | 'stop' | 'reset' | 'pause';
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: string; // Icon character or emoji
  label: string; // Accessible label
}

export interface AccessibilityPreferences {
  motionPreference: 'full' | 'reduced';
  audioWarnings: boolean;
  flashWarnings: boolean;
  screenReaderVerbosity: 'high' | 'low';
}

export interface WarningSystemProps {
  remainingMs: number;
  warnAt: number; // Milliseconds threshold (e.g., 10000 for 10 seconds)
  preferences: AccessibilityPreferences;
  onWarning?: () => void; // Callback when warning triggers
}
```

### 1.3 Quickstart Guide (quickstart.md)

**Content**: Developer guide covering:
1. **Using Design Tokens**: How to reference tokens in component styles
2. **Adding New Tokens**: Process for proposing and adding new tokens
3. **CTA Button Pattern**: How to use standardized CTAButton component
4. **Accessibility Testing**: Running axe-core and Lighthouse audits
5. **Mobile Testing**: Testing wheel pickers and touch targets on real devices

### 1.4 Agent Context Update

Run: `cd /home/dyai/Dokumente/DYAI_home/Web/stoppclock-page && stoppclock_speckit/.specify/scripts/bash/update-agent-context.sh claude`

**Expected Update**: Add to agent context:
- CSS design tokens (custom properties)
- WCAG AA compliance requirements
- Mobile wheel picker patterns
- Flash warning implementation

---

## Next Steps

**After Phase 1 Completion**:
1. Run `/speckit.tasks` to generate dependency-ordered task breakdown
2. Begin implementation starting with P0 features (Design Tokens, Countdown Input, Accessibility)
3. Update E2E tests incrementally as features are implemented
4. Re-validate Constitution Check after Phase 1 design (confirm no violations introduced)

**Release Criteria**:
- ✅ All P0/P1 features 100% complete
- ✅ Zero WCAG AA violations (Lighthouse/axe audits)
- ✅ All enhanced components have E2E test coverage
- ✅ Bundle size remains <180 kB gzipped
- ✅ No hardcoded color values in component files

**Deployment**:
- Standard GitHub Pages deployment (existing CI/CD pipeline)
- No special deployment requirements (static assets only)
