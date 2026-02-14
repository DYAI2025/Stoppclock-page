# Repository Guidelines

## Project Structure & Module Organization
- `src/` (React + TypeScript): `pages/` route pages (PascalCase), `components/` shared UI, `hooks/` custom hooks (`use*`), `utils/` helpers, `styles/` global CSS, `config/` presets.
- `public/` static assets, PWA files: `manifest.webmanifest`, `sw.js`.
- `tests/e2e/` Playwright specs named `NN-*.spec.ts` (e.g., `04-digital-clock.spec.ts`).
- `scripts/` utilities: `doctor.mjs`, `gen-sitemap.mjs`.
- `dist/` build output (generated).

## Build, Test, and Development Commands
- `npm run dev` — start Vite dev server.
- `npm run build` — build and generate sitemap.
- `npm run preview` — serve production build at `http://localhost:4173`.
- `npm run test:e2e` — run Playwright tests (auto-starts preview).
- `npm run test:e2e:ui` — run tests in UI mode.
- `npm run doctor` — scan for forbidden tokens in the repo.
- Optional: `trunk check` / `trunk fmt` — lint/format via Trunk (Prettier, markdownlint, etc.).

## Coding Style & Naming Conventions
- TypeScript strict; React function components and hooks.
- Format with Prettier (2-space indent) via Trunk; no manual style bikeshedding.
- Filenames: pages/components PascalCase (`AnalogCountdown.tsx`); hooks camelCase prefixed `use` (`useTheme.ts`); utils kebab/camel case (`singing-bowl.ts`, `analytics.ts`).
- Keep side effects isolated; prefer pure helpers in `src/utils/`.

## Testing Guidelines
- Framework: Playwright. Specs live under `tests/e2e/` and follow `NN-feature.spec.ts`.
- Run: `npm run test:e2e`. View report at `playwright-report/index.html`.
- Tests assume preview at `:4173` (see `playwright.config.ts`); update if port changes.

## Commit & Pull Request Guidelines
- Conventional Commits: `feat:`, `fix:`, `docs:`, optional scopes (e.g., `feat(pomodoro): ...`).
- PRs include: clear description, linked issues, UI screenshots/GIFs, test updates, and passing checks (`npm run doctor`, `trunk check`).

## Security & Configuration Tips
- Do not commit secrets. Ads/analytics are opt-in via consent.
- Relevant files: `src/components/AdSenseScript.tsx`, `src/utils/consent.ts`, `public/manifest.webmanifest`, `public/sw.js`.

## Agent-Specific Instructions
- Keep changes minimal and localized; match existing patterns.
- Do not rename/move files unless required by the task.
- Respect this AGENTS.md for all paths you modify.

