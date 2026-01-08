# Stoppclock 🕐

Projector-friendly timers and clocks built with React + TypeScript. The SPA ships multiple specialized timers, lightweight blog/pillar pages, and a privacy-first ad/consent setup.

## What ships today
- **Timer tools (hash routes)**: Analog countdown (`#/analog`), digital countdown (`#/countdown`), stopwatch with laps (`#/stopwatch`), pomodoro (`#/pomodoro`), cooking timer (`#/cooking`), couples timer (`#/couples`), digital clock (`#/digital`), world clock (`#/world`), alarm manager (`#/alarm`), metronome (`#/metronome`), and chess clock (`#/chess`).
- **Content pages**: Time philosophy pillar (`#/time-philosophy`), timer guides (`#/timer-for-students`, `#/timer-for-productivity`, `#/timer-for-fitness`), blog posts (`#/blog/pomodoro-timer-online`, `#/blog/pomodoro-vs-countdown`), knowledge/about/imprint/privacy/contact routes.
- **Controls & persistence**: Shared keyboard shortcuts (Space start/pause, R reset, F fullscreen, L laps for stopwatch), per-tool localStorage state, and fullscreen toggles.
- **PWA shell**: Manifest + lightweight service worker that caches the app shell/manifest and keeps assets network-first.
- **Theming & accessibility**: Dark/light toggle with preference persistence, high-contrast layout, and hash-based routing that keeps pages keyboard navigable.

## Architecture
```mermaid
flowchart TD
  A[index.html] --> B[src/main.tsx]
  B --> C[App with hash-based router]
  C --> D[Timer pages]\n(#/analog ... #/chess)
  C --> E[Content pages]\n(#/time-philosophy ...)
  B --> F[Contexts]\n(PinnedTimers)
  B --> G[Shared components]\n(DarkModeToggle, Consent, Ads)
  D --> H[Hooks & utils]
  H --> H1[useKeyboardShortcuts]
  H --> H2[useAutoFitText]
  H --> H3[beep/flash]
  B --> I[Styles]\n(design-tokens.css, styles.css)
  B --> J[Service worker]\n(public/sw.js)
```

- **Entry & routing**: `src/main.tsx` registers the service worker, sets up the PinnedTimers provider, and switches content based on `window.location.hash` without React Router.
- **Pages**: Timer pages live in `src/pages/` and embed shared controls (Home button, keyboard shortcuts, fullscreen helpers). Content/SEO pages use the same hash router.
- **State & persistence**: Timers store state in `localStorage` with schema keys like `sc.v1.countdown` to survive reloads; runtime updates rely on `requestAnimationFrame` loops.
- **Styling**: Global tokens in `src/design-tokens.css` and `src/styles.css`; per-page styles live alongside components.
- **Ads & consent**: `ConsentBanner` gates `AdSenseScript` so ad code only loads after explicit consent.

## Design direction (home page)
- **Unify timer grid + descriptions**: The next redesign aims to merge the home timer tiles with the "About the Timers" blurbs. Each tile should surface its microcopy (what it does, ideal use case, key shortcut) directly inside the card, reducing the scroll between the hero grid and the descriptive section.
- **Progressive detail**: Default view shows icon + label + one-liner; hover/focus expands to a short checklist (e.g., "Space = Start/Pause, R = Reset") without shifting layout on touch devices.
- **Content reuse**: Descriptions are sourced from the existing "About the Timers" content so cards and the dedicated section stay in sync while the redesign is phased in.

## Key behaviors
- **Keyboard shortcuts**: Centralized in `src/hooks/useKeyboardShortcuts.ts` (Space start/pause, `R` reset, `F` fullscreen, `L` laps on stopwatch) and auto-disabled when typing in inputs.
- **Timer UX**: Countdown/analog timers cap durations (digital up to 12h, analog up to 4h) and emit optional beep/flash warnings. Stopwatch records laps; pomodoro persists custom durations; metronome drives audio ticks; chess clock swaps active player.
- **PWA**: `public/manifest.webmanifest` defines install metadata; `public/sw.js` keeps a cache versioned shell and cleans old caches. Assets stay network-first so deploys stay fresh.

## Routes at a glance
| Route | Purpose |
| --- | --- |
| `#/` | Home grid with timer shortcuts, design toggles, footer links |
| `#/analog` | Analog countdown with canvas dial |
| `#/countdown` | Digital HH:MM:SS countdown with warnings |
| `#/stopwatch` | Stopwatch with lap capture |
| `#/pomodoro` | Work/break cycles with persistence |
| `#/cooking` | Cooking timer presets |
| `#/couples` | Paired/couples timer |
| `#/digital` | Always-on digital clock |
| `#/world` | Multi-timezone world clock |
| `#/alarm` | Multiple alarms management |
| `#/metronome` | Adjustable BPM metronome |
| `#/chess` | Dual-player chess clock |
| `#/time-philosophy` & content routes | Editorial/SEO content and legal pages |

## Development
1. Install Node.js 18+ and npm.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Build for production: `npm run build`
5. Preview the production build: `npm run preview`

## Testing
Playwright specs live in `tests/e2e/` and cover the main timers (analog countdown, countdown, stopwatch, digital clock, world clock, alarm, metronome, chess clock).

Run all E2E tests locally:
```bash
npm run test:e2e
```

## Contributing & support
- Please run `npm run doctor` before opening a PR to catch forbidden tokens and common issues.
- For questions or issues, open a GitHub issue with browser/OS details and repro steps.

## License
MIT
