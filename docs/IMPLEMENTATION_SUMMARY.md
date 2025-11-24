# Implementation Summary (Current)

This document captures the actual code that exists in the repository today.

## Scope delivered
- Hash-based single page app that routes to 10 timer tools and multiple informational/legal pages (see README for route list).
- Shared theming (dark/light) and language toggles on the home grid plus per-page Home navigation.
- Timer behaviors share keyboard shortcuts, optional fullscreen, and persisted localStorage state per tool.
- Minimal PWA setup with `manifest.webmanifest` and a versioned service worker that caches the shell and manifest while keeping assets network-first.
- Playwright E2E coverage for the core timers (8 specs in `tests/e2e/`).

## Architecture highlights
- Entry/root: `src/main.tsx` wires consent/ad loading, providers, service worker registration, and the hash router.
- UI composition: Timer pages in `src/pages/` reuse shared components (`HomeButton`, `TimerIcon`, `TimerQuickInfo`, consent/ads, toggles).
- State/persistence: Per-timer `localStorage` keys (e.g., `sc.v1.countdown`, `sc.v1.analog`) and `requestAnimationFrame` sync loops for running timers.
- Styling: Global tokens in `src/design-tokens.css` with supporting layout and utility styles in `src/styles.css`.

## Outstanding considerations
- Deployments need a 200 fallback for hash routing and to serve `index.html` for deep links.
- Service worker intentionally uses network-first asset loading; offline support is limited to cached shell/manifest.
- Additional timers or content pages should mirror the shared shortcut + persistence patterns to stay consistent.
