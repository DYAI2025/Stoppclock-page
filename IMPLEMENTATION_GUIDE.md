# Implementation Guide (Updated)

This guide reflects the current codebase and how to extend it safely.

## Patterns to reuse
- **Routing**: Add new routes in `src/main.tsx` by mapping hash paths to components; keep fallback handling for unknown hashes.
- **Keyboard shortcuts**: Wire timers through `useKeyboardShortcuts` for Space/`R`/`F`/`L` handling and to auto-disable shortcuts while typing.
- **Persistence**: Store per-timer state in `localStorage` under `sc.v1.<timer>` keys. Persist the full schema (duration, running flag, end timestamp, settings) and guard JSON parsing.
- **Timing loops**: Use `requestAnimationFrame` to sync running timers against `Date.now()` instead of setInterval to avoid drift.
- **Fullscreen**: Reuse the existing `full`/`toggle` helpers on timers to enter/exit fullscreen and fail silently when unsupported.
- **UI consistency**: Leverage shared pieces (`HomeButton`, `TimerIcon`, `TimerQuickInfo`, `DarkModeToggle`, `LanguageToggle`) and the global styles in `src/design-tokens.css`/`src/styles.css`.

## Adding a new timer
1. Create a page in `src/pages/` with state initialization + persistence (mirror `Countdown.tsx` or `AnalogCountdown.tsx`).
2. Register the route in `src/main.tsx` (home grid plus router switch) with a distinct hash path.
3. Add keyboard shortcuts via `useKeyboardShortcuts` and optional fullscreen handling.
4. Include any audio/flash alerts through utilities in `src/utils.ts`.
5. Write an accompanying Playwright spec in `tests/e2e/NN-new-timer.spec.ts` following existing patterns.

## Deployment & checks
- Build: `npm run build` (runs Vite + sitemap generator)
- QA: `npm run preview` for a static smoke test
- Tests: `npm run test:e2e`
- Guard: `npm run doctor` to ensure restricted tokens are absent
