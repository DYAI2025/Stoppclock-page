# Custom Sessions - Core Architecture (Quick Reference)

**Date:** 2025-12-04
**Purpose:** Minimum architecture decisions needed to start implementation
**Status:** Implementation-ready blueprint

---

## 1. Data Model (TypeScript Interfaces)

### SessionElement (Core Building Block)

```typescript
interface SessionElement {
  id: string;                    // UUID v4
  type: ElementType;             // 'SPEAK' | 'TRANSITION' | 'COOLDOWN' | 'CUSTOM'
  durationMs: number;            // 30000 - 1800000 (30s - 30min)
  focusText: string;             // 1-500 characters
  createdAt: number;             // timestamp
}

type ElementType = 'SPEAK' | 'TRANSITION' | 'COOLDOWN' | 'CUSTOM';
```

### CustomSession (Session Container)

```typescript
interface CustomSession {
  id: string;                    // UUID v4
  name: string;                  // 1-50 characters
  elements: SessionElement[];    // Array of session elements
  isTemplate: boolean;           // Can be reused
  createdAt: number;             // timestamp
  updatedAt: number;             // timestamp
  version: 1;                    // For future migrations
}
```

### SessionRuntimeState (Live Session)

```typescript
interface SessionRuntimeState {
  sessionId: string;             // Reference to CustomSession
  currentElementIndex: number;   // Current element being run (0-based)
  remainingMs: number;           // Time left in current element
  running: boolean;              // Timer active
  startedAt: number | null;      // When current element started
  phase: SessionPhase;           // 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED'
  completedElements: number;     // Count of finished elements
}

type SessionPhase = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
```

---

## 2. Storage Strategy

### localStorage Keys

```typescript
const STORAGE_KEYS = {
  SESSIONS: 'sc.v1.custom-sessions',           // Record<string, CustomSession>
  RUNTIME: 'sc.v1.custom-session-runtime',     // SessionRuntimeState | null
  TEMPLATES: 'sc.v1.session-templates',        // string[] (sessionIds that are templates)
} as const;
```

### Cross-Tab Sync

**Use existing `useStorageSync` hook** from `src/hooks/useStorageSync.ts`

```typescript
// In components:
const [sessions, setSessions] = useStorageSync<Record<string, CustomSession>>(
  STORAGE_KEYS.SESSIONS,
  {}
);
```

---

## 3. Component Architecture

### File Structure

```
src/
├── pages/
│   ├── CustomSessions.tsx          # Landing page (sessions list)
│   ├── SessionBuilder.tsx          # Create/edit sessions
│   └── SessionRunner.tsx           # Focus View (live timer)
├── components/custom-sessions/
│   ├── ElementCard.tsx             # Individual element display
│   ├── AddElementForm.tsx          # Modal form for adding elements
│   ├── TimelinePreview.tsx         # Visual timeline
│   ├── FocusDisplay.tsx            # Large focus text + timer
│   └── SessionControls.tsx         # Pause/Next/Reset buttons
├── hooks/
│   ├── useSessionTimer.ts          # Timer engine logic (RAF loop)
│   └── useSessionStorage.ts        # CRUD operations for sessions
├── types/
│   └── custom-session-types.ts     # All TypeScript interfaces
└── utils/
    └── session-helpers.ts          # Validation, formatting utilities
```

### Component Hierarchy

```
CustomSessions (Landing)
├── SessionsList
│   └── SessionCard[] (for each session)
└── PresetsGallery

SessionBuilder (Create/Edit)
├── SessionHeader
├── ElementList
│   ├── ElementCard[]
│   └── AddElementForm (modal)
├── TimelinePreview
└── Footer (Start/Save/Discard)

SessionRunner (Focus View)
├── PhaseHeader (auto-hide)
├── FocusDisplay
│   ├── FocusText (large)
│   └── TimerDisplay (huge)
└── SessionControls (Pause/Next/Reset/Fullscreen)
```

---

## 4. Timer Engine (Reuse + Extend)

### Reuse from CouplesTimer

```typescript
// Existing pattern from CouplesTimer.tsx
function useRaf(on: boolean, cb: () => void) {
  const raf = useRef<number | undefined>();
  useEffect(() => {
    if (!on) return;
    let live = true;
    const loop = () => {
      if (!live) return;
      cb();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      live = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [on, cb]);
}
```

### New: Session Element Iterator

```typescript
function useSessionTimer(session: CustomSession) {
  const [state, setState] = useState<SessionRuntimeState>(initialState);

  const advanceToNext = useCallback(() => {
    const nextIndex = state.currentElementIndex + 1;

    if (nextIndex >= session.elements.length) {
      // Session complete
      setState(prev => ({ ...prev, phase: 'COMPLETED', running: false }));
      return;
    }

    // Load next element
    const nextElement = session.elements[nextIndex];
    setState(prev => ({
      ...prev,
      currentElementIndex: nextIndex,
      remainingMs: nextElement.durationMs,
      running: true,
      startedAt: Date.now(),
    }));
  }, [state.currentElementIndex, session.elements]);

  const sync = useCallback(() => {
    if (!state.running || !state.startedAt) return;

    const elapsed = Date.now() - state.startedAt;
    const remaining = state.remainingMs - elapsed;

    if (remaining <= 0) {
      advanceToNext();
    }
  }, [state, advanceToNext]);

  useRaf(state.running, sync);

  return { state, advanceToNext, /* ...controls */ };
}
```

---

## 5. Routing Integration

### Hash Routes (Extend existing `main.tsx`)

```typescript
// Add to existing routes in main.tsx:
{route === "/custom-sessions" && <CustomSessions />}
{route === "/custom-sessions/builder" && <SessionBuilder />}
{route === "/custom-sessions/builder/:id" && <SessionBuilder />}
{route === "/custom-sessions/run/:id" && <SessionRunner />}
```

### Navigation Pattern

```typescript
// Navigate to builder (new session):
window.location.hash = '#/custom-sessions/builder';

// Navigate to builder (edit session):
window.location.hash = `#/custom-sessions/builder/${sessionId}`;

// Navigate to runner (start session):
window.location.hash = `#/custom-sessions/run/${sessionId}`;
```

---

## 6. Validation Logic

### Element Validation

```typescript
function validateElement(element: Partial<SessionElement>): string[] {
  const errors: string[] = [];

  if (!element.type) {
    errors.push('Element type is required');
  }

  if (!element.durationMs || element.durationMs < 30000) {
    errors.push('Minimum duration is 30 seconds');
  }

  if (element.durationMs && element.durationMs > 1800000) {
    errors.push('Maximum duration is 30 minutes');
  }

  if (!element.focusText || element.focusText.trim().length === 0) {
    errors.push('Focus text is required');
  }

  if (element.focusText && element.focusText.length > 500) {
    errors.push('Focus text cannot exceed 500 characters');
  }

  return errors;
}
```

### Session Validation

```typescript
function validateSession(session: Partial<CustomSession>): string[] {
  const errors: string[] = [];

  if (!session.name || session.name.trim().length === 0) {
    errors.push('Session name is required');
  }

  if (!session.elements || session.elements.length === 0) {
    errors.push('Session must have at least 1 element');
  }

  return errors;
}
```

---

## 7. Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **State Management** | `useState` + `useStorageSync` | Lightweight, no Redux needed |
| **Timer Engine** | `requestAnimationFrame` (RAF) | 60 FPS, existing pattern works |
| **Time Tracking** | `Date.now()` drift-resistant | Prevents timer drift on sleep |
| **Storage** | `localStorage` only | Offline-first, no backend needed |
| **Cross-Tab Sync** | `StorageEvent` via `useStorageSync` | <500ms sync, existing hook |
| **Routing** | Hash-based (`#/custom-sessions/...`) | Existing pattern, SPA-friendly |
| **Audio** | Web Audio API (reuse from Couples) | Existing `playBellTone()` function |
| **Keyboard** | `useKeyboardShortcuts` hook | Existing pattern, reuse |
| **Fullscreen** | Native Fullscreen API | Existing pattern from timers |

---

## 8. Implementation Phases (Quick)

### Phase A: Data Layer (30 min)
1. Create `custom-session-types.ts` (interfaces)
2. Create `session-helpers.ts` (validation, UUID, formatting)
3. Create `useSessionStorage.ts` (CRUD hooks)

### Phase B: Session Builder (2-3 hours)
1. Create `SessionBuilder.tsx` (main component)
2. Create `ElementCard.tsx` (display element)
3. Create `AddElementForm.tsx` (modal form)
4. Create `TimelinePreview.tsx` (visual timeline)

### Phase C: Focus View (2-3 hours)
1. Create `SessionRunner.tsx` (main component)
2. Create `FocusDisplay.tsx` (focus text + timer)
3. Create `SessionControls.tsx` (Pause/Next/Reset)
4. Integrate `useSessionTimer.ts` (timer engine)

### Phase D: Integration (1 hour)
1. Add routes to `main.tsx`
2. Add "Custom Sessions" link to home page
3. Add navigation from Couples Timer

**Total Estimated Time:** 6-8 hours for MVP

---

## 9. Dependencies (Reuse Existing)

### Hooks (Already Exist)
- ✅ `useStorageSync` → Cross-tab sync
- ✅ `useKeyboardShortcuts` → Space, R, F shortcuts
- ✅ `useTheme` → Dark mode support
- ❌ `useSessionTimer` → **NEW** (to be created)

### Components (Already Exist)
- ✅ `HomeButton` → Reuse for navigation
- ❌ Session-specific components → **NEW**

### Utilities (Already Exist)
- ✅ Web Audio API (from Couples Timer)
- ✅ Fullscreen API (from existing timers)
- ❌ Session validation → **NEW**

---

## 10. Testing Strategy (Post-Implementation)

### Unit Tests
```typescript
// Example: Element validation
test('validateElement rejects duration <30s', () => {
  const element = {
    type: 'SPEAK',
    durationMs: 20000,
    focusText: 'Test'
  };
  const errors = validateElement(element);
  expect(errors).toContain('Minimum duration is 30 seconds');
});
```

### Integration Tests
```typescript
// Example: Session flow
test('Session completes all elements without errors', () => {
  const session = createTestSession([
    { type: 'SPEAK', durationMs: 5000, focusText: 'Element 1' },
    { type: 'TRANSITION', durationMs: 1000, focusText: 'Element 2' },
  ]);

  const { result } = renderHook(() => useSessionTimer(session));

  act(() => jest.advanceTimersByTime(6000)); // 5s + 1s

  expect(result.current.state.phase).toBe('COMPLETED');
});
```

---

## Ready to Implement! 🚀

Architecture is defined. Starting implementation now with:
1. Data types
2. Storage utilities
3. Session Builder component
4. Focus View component
5. Router integration

---

**End of Document**
