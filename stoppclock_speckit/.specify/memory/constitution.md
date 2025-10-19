# Stoppclock Project Constitution

## Core Principles

### I. Privacy-First Design

**Principle**: User privacy is paramount. No data collection without explicit, informed consent.

**Implementation Requirements**:
- Ads MUST be disabled by default on first visit
- Consent banner MUST provide clear "Enable Ads" and "Keep Off" options
- NO tracking, analytics, or third-party scripts load without user consent
- User preference MUST persist in localStorage across sessions
- NO user accounts, NO authentication, NO cloud sync (all state local-only)

**Rationale**: Users trust tools that respect their privacy. Privacy-first design differentiates Stoppclock from ad-heavy competitors and builds long-term user trust.

---

### II. Zero-Backend Architecture

**Principle**: Stoppclock is a fully static site with no server-side components.

**Implementation Requirements**:
- ALL application logic runs client-side (JavaScript/TypeScript)
- ALL state persistence uses localStorage (no databases)
- ALL hosting via GitHub Pages (static file serving only)
- NO API calls except optional third-party services (AdSense with consent)
- NO user accounts or authentication systems

**Rationale**: Zero-backend architecture ensures infinite scalability (CDN-served static files), zero operational costs (no servers to maintain), maximum reliability (no backend can fail), and complete user privacy (no data leaves device).

---

### III. Offline-Capable PWA (NON-NEGOTIABLE)

**Principle**: Users must be able to access full functionality without internet connection.

**Implementation Requirements**:
- Service Worker MUST cache app shell for offline use
- ALL timer tools MUST function fully offline after first load
- PWA manifest MUST enable standalone installation
- NO network requests required for core functionality (timers, clocks)
- Graceful degradation if Service Worker registration fails

**Rationale**: Classroom and seminar environments often have poor connectivity. Offline capability ensures reliability when users need it most.

---

### IV. Vendor Lock-In Prevention

**Principle**: Stoppclock code must remain platform-agnostic and transferable.

**Implementation Requirements**:
- NO proprietary platform-specific code or APIs
- NO vendor-specific tokens in codebase (lovable, dev-agent, tagger, "Loading app")
- Doctor guard script MUST block forbidden tokens in CI/CD pipeline
- Use standard Web APIs only (Canvas, Audio, Service Worker, localStorage)
- GitHub Pages used for convenience, but code deployable to any static host

**Rationale**: Platform independence ensures long-term project sustainability and prevents dependency on any single vendor.

---

### V. Complete Implementations Only

**Principle**: No MVPs with placeholders, mockups, or demos. Only production-ready code.

**Implementation Requirements**:
- ALL 8 timer tools MUST be fully functional before release
- NO placeholder components or "Coming Soon" pages in production
- NO demo data or mock implementations
- E2E tests MUST achieve 100% coverage (8/8 tests passing)
- Release criteria: ALL tools working, ALL tests passing, deployed live

**Rationale**: An MVP is only valuable if it provides real user value. Placeholders and demos provide zero value and waste user time. AI agents can build complete implementations efficiently, eliminating the need for incremental MVPs.

---

### VI. Accessibility & Performance Standards

**Principle**: Stoppclock must be fast, accessible, and usable by everyone.

**Performance Requirements**:
- Color contrast ratio MUST meet WCAG AA (≥4.5:1)
- Keyboard navigation MUST work for all interactive elements
- Visual flash animations MUST respect prefers-reduced-motion
- Homepage cold load MUST stay under 180 kB gzipped JS
- Analog countdown MUST render at ≥50 FPS
- Timer drift MUST remain under 1 second per hour

**Rationale**: Performance and accessibility are not optional. Fast, accessible tools serve more users and provide better experiences for everyone.

---

## Quality Gates

### Automated Enforcement

**Doctor Guard Script**: Blocks forbidden vendor tokens in CI/CD pipeline
- Checks: lovable, dev-agent, tagger, "Loading app"
- Skips: .git, node_modules, dist, specs, SSoT docs
- Fails build on violation (exit code 2)

**E2E Testing**: Playwright tests verify functional requirements
- Target: 8/8 tests passing (one per timer tool)
- Browsers: Chromium, Firefox (webkit disabled)
- Test scenarios: User stories from spec.md
- Consent banner dismissed via localStorage in beforeEach

**GitHub Actions Pipeline**:
1. Doctor guard (forbidden tokens check)
2. Build (Vite production bundle)
3. E2E tests (Playwright on preview server)
4. Deploy to GitHub Pages
5. Post-deployment smoke tests (/, /manifest.webmanifest, /sw.js)

---

## Development Workflow

### Test-Driven Development (TDD)

**Process**: Red → Green → Refactor
1. Write E2E test for new timer tool (fails initially)
2. Implement minimum code to pass test
3. Refactor for quality while keeping tests green
4. Commit only when ALL tests pass

**Test Requirements**:
- Each timer tool MUST have dedicated E2E test file
- Tests MUST cover primary user story acceptance scenarios
- Tests MUST verify state persistence across navigation
- Tests MUST verify keyboard shortcuts where applicable

---

## Governance

**Constitution Authority**: This constitution supersedes all other development practices and guidelines. Any code violating these principles MUST be rejected, regardless of functionality.

**Amendment Process**: This constitution may be amended only when:
1. Amendment addresses new technical capabilities not available at creation
2. Amendment enhances user privacy, performance, or accessibility
3. Amendment does NOT weaken existing principles
4. Amendment has explicit user approval

**Compliance Verification**: All implementations must be checked against constitution before merge. CI/CD pipeline enforces automated quality gates.

---

**Version**: 1.0.0 | **Ratified**: 2025-10-18 | **Last Amended**: 2025-10-18
