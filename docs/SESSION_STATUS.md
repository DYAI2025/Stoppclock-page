# Session Status (Current)

- **Branch**: `main`
- **HEAD**: `ae913c3` (local workspace)
- **Live deployment**: not verified in this session; repo is configured for static hosting via Vite build output.
- **Recent focus**: aligning documentation with the implemented hash-routed timers, consent flow, and PWA shell.

## Health checks to run
- `npm run doctor` – forbidden token check
- `npm run build` – production bundle and sitemap
- `npm run test:e2e` – Playwright coverage for core timers
- `npm run preview` (optional) – smoke-test the built app locally

## Known constraints
- Hash-based routing requires a 200 fallback to `index.html` from the host.
- Service worker uses network-first assets; full offline use is limited to previously cached shell and manifest.
