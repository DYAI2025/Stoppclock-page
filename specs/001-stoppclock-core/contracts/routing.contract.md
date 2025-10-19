# Routing Contract

**Version**: 1.0.0
**Date**: 2025-10-18
**Purpose**: Define hash-based SPA routing behavior for Stoppclock

## Overview

Stoppclock uses **hash-based routing** (e.g., `#/analog`, `#/stopwatch`) instead of History API routing. This enables GitHub Pages deployment without server-side rewrite rules and provides SPA navigation with browser back/forward support.

---

## Route Specification

### Route Format

All routes MUST follow the pattern: `#/<route-name>`

**Examples**:
- Home: `#/` or `/` (no hash)
- Analog Countdown: `#/analog`
- Stopwatch: `#/stopwatch`

### Route Table

| Hash | Component | Label | Implemented | Priority |
|------|-----------|-------|-------------|----------|
| `#/` or `/` | `Home` | Homepage (tool grid) | ✅ Yes | P1 |
| `#/analog` | `AnalogCountdown` | Analog Countdown | ✅ Yes | P1 |
| `#/stopwatch` | `Placeholder` | Stopwatch | ❌ No | P3 |
| `#/countdown` | `Placeholder` | Countdown | ❌ No | P3 |
| `#/digital` | `Placeholder` | Digital Clock | ❌ No | P3 |
| `#/world` | `Placeholder` | World Clock | ❌ No | P3 |
| `#/alarm` | `Placeholder` | Alarm | ❌ No | P3 |
| `#/metronome` | `Placeholder` | Metronome | ❌ No | P3 |
| `#/chess` | `Placeholder` | Chess Clock | ❌ No | P3 |
| (any other) | `NotFound` | 404 Not Found | ✅ Yes | - |

---

## Routing Behavior

### Hash Change Detection

React hook MUST listen to `hashchange` event and trigger re-render:

```typescript
function useHashRoute(): string {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const handleHashChange = () => forceUpdate();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (location.hash || '#/').replace(/^#/, '');
}
```

**Return value**: Route string WITHOUT leading `#` (e.g., `/analog`, `/stopwatch`, `/`)

### Route Matching

```typescript
function App() {
  const route = useHashRoute();

  // Home page
  if (route === '/') {
    return <Home />;
  }

  // Analog Countdown (implemented)
  if (route === '/analog') {
    return <AnalogCountdown />;
  }

  // Placeholders (not yet implemented)
  const placeholders: Record<string, string> = {
    '/stopwatch': 'Stopwatch',
    '/countdown': 'Countdown',
    '/digital': 'Digital Clock',
    '/world': 'World Clock',
    '/alarm': 'Alarm',
    '/metronome': 'Metronome',
    '/chess': 'Chess Clock',
  };

  if (placeholders[route]) {
    return <Placeholder title={placeholders[route]} />;
  }

  // 404 Not Found
  return <NotFound />;
}
```

---

## Navigation API

### Declarative Navigation (Links)

Use standard `<a href="#/route">` links:

```tsx
<a href="#/analog" className="card">
  Analog Countdown
</a>
```

**Behavior**:
- Clicking link changes `location.hash`
- `hashchange` event fires
- React re-renders with new route
- No page reload

### Programmatic Navigation

```typescript
function navigateTo(route: string) {
  location.hash = route; // e.g., "/analog"
}

// Example: Navigate to analog countdown
navigateTo('/analog');
```

### Browser Back/Forward

- **Back button**: Restores previous hash from browser history
- **Forward button**: Re-applies next hash from browser history
- **React**: Automatically re-renders on `hashchange` event

---

## GitHub Pages Integration

### 404 Fallback

GitHub Pages serves `404.html` for any non-existent path. For SPA routing, `404.html` MUST redirect to hash route:

```html
<!-- public/404.html -->
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Stoppclock</title>
  <script>
    (function() {
      const l = window.location;
      // Convert path to hash route
      if (l.pathname !== '/') {
        l.replace('/#' + l.pathname + l.search + l.hash);
      }
    })();
  </script>
  <meta http-equiv="refresh" content="0;url=/">
</head>
<body></body>
</html>
```

**Example**:
- User visits `www.stoppclock.com/analog` (no hash)
- GitHub Pages serves `404.html`
- Script redirects to `www.stoppclock.com/#/analog`
- React app renders Analog Countdown component

### Direct Link Handling

**Shareable links MUST use hash format**:
- ✅ Correct: `https://www.stoppclock.com/#/analog`
- ❌ Incorrect: `https://www.stoppclock.com/analog` (requires 404 fallback redirect)

**Social media/bookmarks**: Always generate hash-based URLs for sharing.

---

## State Persistence Across Routes

### Timer State Preservation

- Each tool MUST persist its state to localStorage when navigated away
- State MUST be restored when navigating back
- Timers MUST continue running in background (based on wall-clock timestamps)

**Example**:
1. User starts analog countdown (90 minutes)
2. User navigates to Home (`#/`)
3. Timer continues counting (based on `endAt` timestamp)
4. User navigates back to `#/analog`
5. Component loads persisted state, syncs remaining time from `endAt`

### Implementation

```typescript
// In AnalogCountdown component
const STORAGE_KEY = 'sc.v1.analog';

// Load state on mount
const [state, setState] = useState<TimerState>(() => {
  return loadTimerState(STORAGE_KEY) || DEFAULT_STATE;
});

// Save state on change (debounced)
useEffect(() => {
  const timer = setTimeout(() => {
    saveTimerState(STORAGE_KEY, state);
  }, 150);
  return () => clearTimeout(timer);
}, [state]);

// Sync time on mount and RAF loop (if running)
useEffect(() => {
  if (state.running && state.endAt) {
    const remaining = Math.max(0, state.endAt - Date.now());
    if (remaining !== state.remainingMs) {
      setState((s) => ({ ...s, remainingMs: remaining }));
    }
  }
}, [state.running, state.endAt]);
```

---

## Route Guards

### No Authentication Required

All routes are publicly accessible (no login/auth gates).

### Invalid Routes

- Unrecognized hashes MUST render `<NotFound />` component
- `<NotFound />` SHOULD provide link back to Home

```tsx
function NotFound() {
  return (
    <div className="page">
      <h1>Not Found</h1>
      <p>The requested page does not exist.</p>
      <a href="#/">Return to Home</a>
    </div>
  );
}
```

---

## SEO Considerations

### Canonical URLs

- All pages MUST have canonical URL in `<head>`
- Canonical MUST be `https://www.stoppclock.com/` (not hash-based)
  - Search engines don't index hash fragments well
  - Canonical points to homepage for all routes

```html
<link rel="canonical" href="https://www.stoppclock.com/" />
```

### Hash Fragment Limitations

- **Search engines**: Do NOT index hash fragments (pre-2015 behavior)
- **Social media**: Hash fragments may be stripped from shared links
- **Workaround**: Not needed - homepage is primary SEO target, tools are sub-features

### Future Enhancement

If per-tool SEO becomes important:
- Use History API routing (`/analog` instead of `#/analog`)
- Add server-side rendering or pre-rendering
- Requires moving off GitHub Pages or adding build-time rendering

**Current decision**: Hash routing is acceptable tradeoff for simplicity.

---

## Performance

### Route Change Performance

- **Hash change**: 0ms delay (synchronous)
- **React re-render**: <16ms (single frame at 60 FPS)
- **Component mount**: <50ms for simple components (Placeholder)
- **Component mount**: <100ms for complex components (AnalogCountdown with Canvas)

**No code splitting**: All components bundled in single JS file (small app, no async imports needed).

---

## Testing

### Manual Test Cases

1. **Direct navigation**: Visit `#/analog`, verify Analog Countdown renders
2. **Link navigation**: Click Home card, verify route changes
3. **Browser back**: Navigate forward then back, verify history works
4. **404 fallback**: Visit `/invalid-path`, verify redirect to `/#/invalid-path`, then NotFound component
5. **State persistence**: Start timer, navigate away, navigate back, verify timer resumed
6. **Deep link**: Open `#/analog` in new tab, verify component loads directly

### Automated Tests

Not in initial scope (manual testing sufficient for routing logic).

---

## Implementation Checklist

- [x] Implement `useHashRoute` hook with `hashchange` listener
- [x] Define route table (8 tools + Home + 404)
- [x] Implement `Home` component with navigation cards
- [x] Implement `AnalogCountdown` component (P1)
- [x] Implement `Placeholder` component for unimplemented tools
- [x] Implement `NotFound` component
- [x] Create `404.html` for GitHub Pages SPA fallback
- [x] Test browser back/forward navigation
- [x] Test state persistence across route changes
- [x] Verify 404 fallback redirect works on GitHub Pages

---

## References

- Hash-based routing: https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event
- GitHub Pages SPA: https://github.com/rafgraph/spa-github-pages
- React Router (alternative): Not used - hand-rolled routing is simpler for this app
