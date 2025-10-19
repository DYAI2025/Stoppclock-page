# Technical Research: Stoppclock Core Application

**Branch**: `001-stoppclock-core` | **Date**: 2025-10-18
**Phase**: 0 - Research & Technology Decisions

## Purpose

This document resolves technical unknowns identified in the implementation plan before proceeding to detailed design. Each section documents a specific technology decision with rationale and alternatives considered.

---

## 1. Canvas 60 FPS Best Practices

### Decision
Use `requestAnimationFrame` (RAF) loop with conditional rendering based on state changes, combined with high-DPI canvas scaling.

### Rationale
- RAF automatically syncs with browser's repaint cycle (~60 Hz on most displays)
- Prevents over-rendering (unlike `setInterval` which can cause jank)
- Browser optimizes RAF when tab is inactive (saves CPU)
- High-DPI scaling (devicePixelRatio) ensures crisp rendering on Retina displays without performance penalty

### Implementation Pattern

```typescript
function useRaf(active: boolean, callback: () => void) {
  const rafId = useRef<number>();

  useEffect(() => {
    if (!active) return;

    let isRunning = true;
    const loop = () => {
      if (!isRunning) return;
      callback();
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [active, callback]);
}

// Canvas DPI handling
function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1); // Cap at 2x
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
}
```

### Alternatives Considered

- **setInterval**: Rejected - not synced to display refresh, causes jank, runs when tab inactive
- **setTimeout recursive**: Rejected - same issues as setInterval, more complex
- **CSS animations**: Rejected - can't represent arbitrary time values (need dynamic hands position)
- **SVG with SMIL**: Rejected - SMIL deprecated, less control over rendering performance

### Performance Optimizations

1. **Minimize redraw area**: Clear and redraw only changed regions (not implemented initially - full clear is simpler)
2. **Separate static/dynamic layers**: Cache clock face on separate canvas (future optimization if needed)
3. **Throttle updates when not visible**: RAF automatically pauses when tab inactive
4. **Cap DPR at 2x**: Prevents excessive memory usage on 3x/4x displays without visible quality loss

### References

- MDN: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
- High-DPI Canvas: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas

---

## 2. Timer Drift Mitigation Strategies

### Decision
Use **wall-clock delta approach**: Store target end timestamp, calculate remaining time as `endTime - Date.now()` on each frame.

### Rationale
- Eliminates drift from `setTimeout`/`setInterval` inaccuracy (JavaScript timers are not precise)
- System clock is the source of truth (matches real-world clocks)
- Simple calculation: `remainingMs = Math.max(0, endTimestamp - Date.now())`
- Survives tab throttling, sleep/wake, time zone changes

### Implementation Pattern

```typescript
interface TimerState {
  durationMs: number;
  remainingMs: number;
  running: boolean;
  endAt: number | null; // Unix timestamp in ms
}

// On start
function start(state: TimerState): TimerState {
  const now = Date.now();
  return {
    ...state,
    running: true,
    endAt: now + state.remainingMs,
  };
}

// On each RAF tick
function sync(state: TimerState): TimerState {
  if (!state.running || !state.endAt) return state;

  const now = Date.now();
  const remaining = Math.max(0, state.endAt - now);

  if (remaining === 0 && state.remainingMs > 0) {
    // Timer completed
    return { ...state, running: false, remainingMs: 0, endAt: null };
  }

  return { ...state, remainingMs: remaining };
}
```

### Alternatives Considered

- **setInterval with correction**: Accumulate delta, adjust interval dynamically
  - Rejected: Complex logic, still subject to throttling in background tabs
  - Doesn't survive sleep/wake cycles
- **Web Workers with precise timer**: Offload timer to worker thread
  - Rejected: Overkill for this use case, workers also subject to throttling
  - Adds complexity for minimal gain
- **Performance.now() for microsecond precision**: High-resolution timer
  - Rejected: Date.now() sufficient for 1s precision requirement
  - Performance.now() doesn't reflect system clock changes

### Edge Case Handling

1. **Tab inactive**: RAF pauses, but calculation still correct when tab reactivates (based on wall clock)
2. **System sleep**: Timer "catches up" on wake based on current time
3. **System time adjustment**: Timer reflects new time (could finish early/late - acceptable tradeoff)
4. **Maximum duration (12 hours)**: No overflow risk (JavaScript number supports up to 2^53 ms = ~285 million years)

### Drift Expectations

- **Theoretical drift**: 0ms (wall clock is source of truth)
- **Visual drift**: 1 frame (16.67ms at 60 FPS) due to RAF sampling
- **Practical drift**: <100ms over 12 hours (limited by RAF precision and browser timer resolution)

### References

- JavaScript Timers: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays
- Date.now() precision: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now

---

## 3. Service Worker Cache Strategy

### Decision
**App Shell pattern** with runtime network-first fallback for Vite-hashed assets.

### Rationale
- App shell (HTML, manifest, SW itself) must be available offline
- Vite assets have content-hash filenames (e.g., `main.a3f2b1c.js`) - cache on fetch
- Cache version = deployment SHA (bust old cache on new deployment)
- Network-first for hashed assets ensures fresh content when online, falls back to cache offline

### Implementation Pattern

```javascript
// public/sw.js
const CACHE_VER = 'sc-v1'; // Update on each deployment
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/src/styles.css'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VER).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VER).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // Take control immediately
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return; // Don't cache external resources

  // App shell: Cache-first
  if (APP_SHELL.includes(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
    return;
  }

  // Vite assets (/assets/*): Network-first with cache fallback
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VER).then((cache) => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
});
```

### Cache Invalidation Strategy

1. **On deployment**: CACHE_VER changes (manually or via commit SHA injection in build)
2. **Activate event**: Deletes old cache versions
3. **skipWaiting + claim**: New SW takes control immediately (no reload required)

### Alternatives Considered

- **Network-only**: Rejected - defeats offline capability requirement
- **Cache-only**: Rejected - app never updates after first install
- **Stale-while-revalidate**: Considered for assets, rejected to keep SW simple
  - Network-first achieves similar result (fresh content when online)
- **Workbox**: Rejected - adds 50kB+ to SW, manual implementation is <2kB and sufficient

### Update Flow

1. User visits site with old SW cached
2. New SW registers (CACHE_VER changed)
3. Install event: New cache created
4. Activate event: Old cache deleted
5. New SW claims clients immediately
6. Next navigation: New HTML/assets served

### Offline Limitations

- **First visit**: Must be online to cache app shell
- **New deployment**: User must be online once to update cache
- **localStorage**: Persists across SW updates (no migration needed)

### References

- Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Cache API: https://developer.mozilla.org/en-US/docs/Web/API/Cache
- App Shell pattern: https://web.dev/app-shell/

---

## 4. localStorage Quota Handling

### Decision
**Graceful degradation**: Wrap localStorage calls in try-catch, fall back to in-memory state if unavailable.

### Rationale
- localStorage quota: ~5-10MB (browser-dependent)
- Stoppclock usage: <10KB per tool (JSON state), <50KB total for all 8 tools
- Quota exceeded unlikely, but localStorage can be disabled (private mode, security settings)
- App should function without persistence (tools work, state just doesn't survive refresh)

### Implementation Pattern

```typescript
// Persistence utility
function loadState<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[localStorage] Failed to load ${key}:`, error);
    return defaultValue;
  }
}

function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[localStorage] Failed to save ${key}:`, error);
    // Silently fail - app continues to work, just won't persist
  }
}

// Usage in component
const [state, setState] = useState(() => loadState('sc.v1.analog', DEFAULT_STATE));

useEffect(() => {
  const timer = setTimeout(() => saveState('sc.v1.analog', state), 150);
  return () => clearTimeout(timer);
}, [state]);
```

### Error Scenarios

1. **QuotaExceededError**: Extremely unlikely (50KB << 5MB), silent fallback
2. **SecurityError**: Private browsing mode - silent fallback, app works in-memory
3. **localStorage disabled**: Feature detection, silent fallback
4. **JSON parse error**: Corrupted data - return default state

### Monitoring

- Console warnings logged (visible in DevTools, not user-facing)
- No user-facing error messages (persistence failure is non-critical)

### Alternatives Considered

- **IndexedDB**: Rejected - overkill for simple key-value storage, async API adds complexity
- **User notification on failure**: Rejected - persistence failure is not critical, would annoy users
- **Quota detection**: Rejected - no reliable cross-browser API, try-catch is simpler

### Storage Budget

Per-tool estimate:
```json
{
  "version": 1,
  "durationMs": 5400000,
  "remainingMs": 3200000,
  "running": true,
  "endAt": 1729258392847,
  "warnAtMs": 60000,
  "signal": {"sound": true, "flash": true}
}
```
= ~150 bytes JSON

Total for 8 tools: ~1.2 KB
Ad consent: ~20 bytes
Total app storage: <2 KB (well under any quota)

### References

- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Storage quotas: https://web.dev/storage-for-the-web/

---

## 5. Fullscreen API Cross-Browser Compatibility

### Decision
Use **standard Fullscreen API** with no vendor prefixes (dropped in 2021+), feature detection for unsupported browsers.

### Rationale
- Modern browsers (Chrome 71+, Firefox 64+, Safari 16.4+) support unprefixed API
- Target browsers (last 2 versions, iOS 15+) all support standard API
- Safari 16.4+ (2023) added full support, iOS 15 partial (works for video elements)

### Implementation Pattern

```typescript
function toggleFullscreen(element: HTMLElement) {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch((err) => {
      console.warn('[Fullscreen] Exit failed:', err);
    });
  } else {
    element.requestFullscreen?.().catch((err) => {
      console.warn('[Fullscreen] Enter failed:', err);
    });
  }
}

// Keyboard shortcut
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'f' && !e.repeat) {
      const container = containerRef.current;
      if (container) toggleFullscreen(container);
    }
  };

  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, []);
```

### Browser-Specific Behavior

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 71+ | ✅ Full | Standard API, no prefix |
| Firefox 64+ | ✅ Full | Standard API, no prefix |
| Safari 16.4+ | ✅ Full | Added full support in 2023 |
| Safari 15-16.3 | ⚠️ Partial | Only `<video>` elements, not `<div>` |
| iOS Safari 15+ | ⚠️ Partial | Requires user gesture, video only |
| Edge 79+ | ✅ Full | Chromium-based, same as Chrome |

### iOS Safari Limitation

- **Issue**: iOS Safari only allows fullscreen on `<video>` elements, not arbitrary `<div>`
- **Workaround**: Not applicable (analog clock is Canvas, not video)
- **Fallback**: On iOS, fullscreen button is hidden or shows "not supported" message
- **Rationale**: Acceptable tradeoff - iOS users can still use timer in portrait/landscape mode

### Permission Model

- **Desktop**: No permission required (user gesture via button/keyboard triggers API)
- **Mobile**: Requires user gesture (button click qualifies, programmatic call from setTimeout does not)

### Alternatives Considered

- **Vendor prefixes**: Rejected - no longer needed in target browsers
- **Polyfill library**: Rejected - adds complexity for edge case (iOS limitation unfixable anyway)
- **iframe workaround for iOS**: Rejected - complex, unreliable, breaks PWA standalone mode

### Feature Detection

```typescript
const supportsFullscreen = !!document.documentElement.requestFullscreen;

// Conditionally render fullscreen button
{supportsFullscreen && (
  <button onClick={() => toggleFullscreen(containerRef.current!)}>
    Fullscreen
  </button>
)}
```

### References

- Fullscreen API: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
- Can I Use: https://caniuse.com/fullscreen
- Safari support: https://webkit.org/blog/13966/webkit-features-in-safari-16-4/

---

## 6. Web Audio API Beep Generation

### Decision
Use **OscillatorNode** for programmatic beep generation with GainNode for volume envelope.

### Rationale
- No audio files needed (saves bandwidth, simpler deployment)
- Short beeps (140-600ms) don't require complex waveforms
- Sine wave is pleasant and non-jarring for timer alerts
- Graceful degradation if Web Audio unavailable (try-catch, silent failure)

### Implementation Pattern

```typescript
function beep(durationMs = 300, frequency = 880) {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.frequency.value = frequency; // A5 = 880 Hz (pleasant tone)
    oscillator.type = 'sine';

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    // Volume envelope: Quick attack, exponential decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.02); // 20ms attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000); // Decay

    oscillator.start(now);
    oscillator.stop(now + durationMs / 1000 + 0.05); // Extra 50ms to finish decay

    // Clean up context after playback
    setTimeout(() => ctx.close(), durationMs + 100);
  } catch (error) {
    console.warn('[Audio] Beep failed:', error);
    // Silent failure - visual flash still works
  }
}

// Usage
beep(140, 1200); // Warning beep: 140ms, 1200Hz (higher pitch)
beep(600, 660);  // Completion beep: 600ms, 660Hz (lower pitch, longer)
```

### Sound Design

- **Warning beep**: 140ms, 1200Hz (E6) - short, high-pitched, attention-grabbing
- **Completion beep**: 600ms, 660Hz (E5) - longer, lower-pitched, conclusive
- **Volume**: 50% max (0.5 gain) - audible but not jarring
- **Envelope**: Quick attack (20ms) + exponential decay - avoids "pop" artifacts

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 34+ | ✅ | Full support |
| Firefox 25+ | ✅ | Full support |
| Safari 14.1+ | ✅ | Requires user gesture on iOS |
| Edge 79+ | ✅ | Chromium-based |

### iOS Autoplay Policy

- **Issue**: iOS requires user gesture to create AudioContext
- **Workaround**: First beep after user clicks Start button (gesture) initializes context
- **Subsequent beeps**: Work without additional gestures once context created

### Alternatives Considered

- **HTML5 Audio element**: `<audio src="beep.mp3">`
  - Rejected: Requires audio files, HTTP requests, larger payload
- **Web MIDI**: Synthetic MIDI notes
  - Rejected: Overkill, not widely supported
- **SpeechSynthesis API**: Spoken alerts
  - Rejected: Jarring, language-dependent, slower

### Accessibility

- **User control**: Sound can be toggled off (respects user preference)
- **Visual flash**: Always accompanies sound (redundant signal for hearing-impaired users)
- **No reliance on audio**: Timer is fully functional with sound disabled

### References

- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- OscillatorNode: https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
- iOS Autoplay Policy: https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/

---

## 7. GitHub Pages Custom Domain HTTPS

### Decision
Use **GitHub-managed HTTPS** with DNS configuration: CNAME for www, A/AAAA records for apex.

### Rationale
- GitHub provides free SSL certificates via Let's Encrypt
- Automatic renewal (no manual cert management)
- CNAME for www is standard and simple (single record)
- Apex domain requires A/AAAA records (GitHub IPs may change, but rarely)

### DNS Configuration

#### For www.stoppclock.com (recommended primary domain):
```
Type: CNAME
Host: www
Value: <username>.github.io.
TTL: 3600 (1 hour)
```

#### For apex stoppclock.com (redirects to www):
```
Type: A
Host: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

Type: AAAA
Host: @
Value: 2606:50c0:8000::153
Value: 2606:50c0:8001::153
Value: 2606:50c0:8002::153
Value: 2606:50c0:8003::153
```

**Note**: IP addresses current as of 2025-10-18. Verify at: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain

### GitHub Pages Settings

1. **Repository → Settings → Pages**
2. **Source**: GitHub Actions (not "Deploy from branch")
3. **Custom domain**: www.stoppclock.com
4. **Enforce HTTPS**: ✅ Enabled (wait 10-60 min after DNS propagation)

### CNAME File Generation

In GitHub Actions workflow:
```yaml
- name: Add CNAME & .nojekyll
  run: |
    mkdir -p dist
    echo "www.stoppclock.com" > dist/CNAME
    touch dist/.nojekyll
```

### Redirect Strategy

- **Canonical**: www.stoppclock.com (primary)
- **Apex**: stoppclock.com → redirects to www (configured in Pages settings)
- **index.html**: `<link rel="canonical" href="https://www.stoppclock.com/" />`

### HTTPS Certificate Provisioning

1. DNS records configured
2. CNAME file in repo
3. GitHub Pages setting saved
4. Wait 10-60 minutes for:
   - DNS propagation
   - Let's Encrypt verification (GitHub checks DNS)
   - Certificate issuance and deployment
5. "Enforce HTTPS" becomes available (enable it)

### Troubleshooting

- **"DNS check unsuccessful"**: Wait for DNS propagation (up to 24 hours, usually <1 hour)
- **Certificate not provisioning**: Ensure CNAME file is in dist root, not subdirectory
- **404 on custom domain**: Verify Pages source is "GitHub Actions", check workflow uploaded artifact correctly

### Alternatives Considered

- **Cloudflare Pages**: Rejected - requires moving hosting, adds dependency
- **Manual SSL cert**: Rejected - GitHub Pages doesn't support custom certs
- **Subdomain only (timers.example.com)**: Rejected - spec requires apex domain

### Security

- **TLS 1.2+**: GitHub Pages enforces modern TLS
- **HSTS**: Not configurable on Pages (would be ideal, but not critical for static site)
- **CAA records**: Optional, can add for extra security:
  ```
  Type: CAA
  Host: @
  Value: 0 issue "letsencrypt.org"
  ```

### References

- GitHub Pages Custom Domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- DNS Configuration: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

---

## 8. Prefers-Reduced-Motion CSS Integration

### Decision
Use **CSS @media query** for animation control, with JavaScript detection for imperative flash logic.

### Rationale
- CSS `@media (prefers-reduced-motion: reduce)` is standard and well-supported
- Declarative CSS approach is simpler than JavaScript-only detection
- Animation duration can be set to `0.01s` (near-instant) instead of completely disabling
- Respects user's system-wide accessibility preference

### Implementation Pattern

#### CSS (in styles.css):
```css
/* Default: Flash animation */
.flash {
  animation: flash 0.9s linear 1;
}

@keyframes flash {
  0%   { background: rgba(255, 255, 255, 0.0); }
  15%  { background: rgba(255, 255, 255, 0.20); }
  100% { background: rgba(255, 255, 255, 0.0); }
}

/* Reduced motion: Disable animation */
@media (prefers-reduced-motion: reduce) {
  .flash {
    animation: none; /* No visual motion */
  }

  /* Alternative: Instant opacity change (no transition) */
  .flash-alt {
    animation: flash-instant 0.01s linear 1;
  }

  @keyframes flash-instant {
    0%   { background: rgba(255, 255, 255, 0.0); }
    50%  { background: rgba(255, 255, 255, 0.25); }
    100% { background: rgba(255, 255, 255, 0.0); }
  }
}
```

#### JavaScript (optional detection):
```typescript
function flash(element: HTMLElement | null, durationMs = 500) {
  if (!element) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Option 1: Skip flash entirely
    return;

    // Option 2: Instant background change (no animation)
    element.style.background = 'rgba(255, 255, 255, 0.25)';
    setTimeout(() => {
      element.style.background = '';
    }, 50); // Brief flash, no transition
  } else {
    // Normal animation
    element.classList.add('flash');
    setTimeout(() => {
      element.classList.remove('flash');
    }, durationMs);
  }
}
```

### User Preference Detection

**How users enable reduced motion**:
- **macOS**: System Preferences → Accessibility → Display → Reduce Motion
- **Windows**: Settings → Ease of Access → Display → Show animations in Windows
- **iOS**: Settings → Accessibility → Motion → Reduce Motion
- **Android**: Settings → Accessibility → Remove animations

### Reduced Motion Policy

For Stoppclock:
1. **Analog clock hands**: Continue to move (essential to timer function, not decorative)
2. **Flash warning/completion**: Disabled or reduced to instant change
3. **Transitions**: Any future UI transitions should check preference

**Rationale**: Clock hands are functional, not decorative. Users need to see time changing. Flash is supplementary (sound provides redundant alert).

### Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 74+ | ✅ | Full support |
| Firefox 63+ | ✅ | Full support |
| Safari 10.1+ | ✅ | Full support |
| Edge 79+ | ✅ | Chromium-based |

**Coverage**: 100% of target browsers (last 2 versions requirement)

### Alternatives Considered

- **JavaScript-only detection**: Rejected - CSS approach is simpler, declarative
- **User toggle in app**: Rejected - should respect system preference, not duplicate settings
- **Always disable animations**: Rejected - most users benefit from visual feedback
- **Ignore accessibility requirement**: Rejected - WCAG compliance required (FR-028)

### Testing

Manual testing:
1. Enable reduced motion in system settings
2. Open Stoppclock
3. Start analog countdown with warning/completion
4. Verify: Flash animations don't occur (or are instant)
5. Verify: Clock hands still move (functional animation preserved)

### Compliance

- **WCAG 2.1 Level A**: 2.3.3 Animation from Interactions (Level AAA, we exceed)
- **WCAG 2.2 Level A**: 2.2.2 Pause, Stop, Hide (Level A) - user can disable flash via signal toggle

### References

- prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- WCAG 2.3.3: https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html

---

## Summary

All 8 technical unknowns have been resolved with concrete implementation decisions. Key takeaways:

1. **Performance**: requestAnimationFrame + wall-clock deltas ensure smooth 60 FPS with zero drift
2. **Offline**: App shell caching + localStorage persistence enable full offline capability
3. **Compatibility**: Modern Web APIs without vendor prefixes cover all target browsers
4. **Accessibility**: Reduced motion support + graceful degradation for unsupported features
5. **Simplicity**: No external libraries beyond React/Vite - all features use standard Web Platform APIs

**Ready for Phase 1**: Data model and contracts can now be designed with full technical clarity.
