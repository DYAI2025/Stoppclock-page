# Feature Specification: Stoppclock Core Application

**Feature Branch**: `001-stoppclock-core`
**Created**: 2025-10-18
**Status**: Draft
**Input**: User description: "Complete Stoppclock web application with projector-friendly timers, offline PWA, and privacy-first design"

## Clarifications

### Session 2025-10-19

- Q: When critical features fail (localStorage unavailable, AdSense script fails to load), what should the user see? → A: Log to console only (no user-visible feedback)
- Q: When the user adjusts system time while a timer is running, how should the app respond? → A: Ignore system time changes
- Q: How should PWA service worker handle updates when new version is deployed? → A: Check for updates only on manual refresh
- Q: What happens when user denies fullscreen permission? → A: Disable fullscreen button permanently
- Q: How does visual flash warning respect users with prefers-reduced-motion accessibility setting? → A: Replace flash with static color change

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Analog Countdown for Exam/Seminar Projection (Priority: P1)

A teacher or presenter needs to project a visual countdown timer during exams, presentations, or workshops. They need to quickly set a duration (e.g., 90 minutes), start the timer, enter fullscreen mode for projection, and have warning signals before time expires.

**Why this priority**: This is the core differentiator and primary use case. The analog countdown with fullscreen capability directly addresses the projector-friendly requirement that sets Stoppclock apart from generic timer apps.

**Independent Test**: Can be fully tested by opening the app, navigating to Analog Countdown, setting a duration (e.g., 30 seconds for testing), starting it, entering fullscreen, and verifying the visual countdown, warning signal, and completion signal work correctly.

**Acceptance Scenarios**:

1. **Given** user opens Analog Countdown, **When** user selects 90-minute preset and clicks Start, **Then** analog clock displays remaining time with hour/minute/second hands moving counterclockwise
2. **Given** timer is running, **When** user clicks Fullscreen button, **Then** timer enters fullscreen mode with clean, high-contrast display optimized for projection
3. **Given** timer reaches warning threshold (default 1 minute), **When** warning time is reached, **Then** visual flash and audio beep alert user
4. **Given** timer reaches zero, **When** countdown completes, **Then** timer stops, displays 00:00:00, plays completion signal (audio beep + visual flash)
5. **Given** user navigates away from Analog Countdown, **When** user returns to the page, **Then** timer state (remaining time, running status) persists exactly as left

---

### User Story 2 - Offline PWA Installation and Usage (Priority: P2)

A user in a low-connectivity venue (classroom, conference center) needs to reliably access timer tools without internet connection after initial installation. They should be able to install the app as a PWA and use all features offline.

**Why this priority**: Offline capability is critical for reliability in real-world classroom and seminar environments where connectivity is often poor or unavailable. This is a core requirement stated in the SSoT.

**Independent Test**: Can be fully tested by loading the app once with internet, installing it as PWA, disconnecting from internet, and verifying all timer tools continue to work with full functionality.

**Acceptance Scenarios**:

1. **Given** user visits Stoppclock for the first time, **When** app loads successfully, **Then** service worker registers and caches app shell for offline use
2. **Given** app is cached, **When** user installs PWA to device, **Then** app appears as installable with proper icon, name, and standalone display mode
3. **Given** PWA is installed and user is offline, **When** user opens app, **Then** app loads from cache and all timer tools function normally
4. **Given** user is offline, **When** user switches between different timer tools, **Then** navigation and state persistence work without network requests

---

### User Story 3 - Privacy-First Ad Consent Management (Priority: P2)

A privacy-conscious user visits Stoppclock and sees a consent banner. Ads are disabled by default. The user can choose to enable ads or keep them off, and this preference persists across sessions.

**Why this priority**: Privacy-first design is a stated core value in the SSoT and differentiates Stoppclock from ad-heavy competitors. This must be implemented correctly to maintain trust and comply with privacy expectations.

**Independent Test**: Can be fully tested by visiting the app in a clean browser, verifying ads are off by default, testing both "Enable Ads" and "Keep Off" options, and confirming preference persists across page reloads.

**Acceptance Scenarios**:

1. **Given** first-time visitor with no stored preferences, **When** page loads, **Then** consent banner appears with clear options: "Enable Ads" and "Keep Off"
2. **Given** consent banner is displayed, **When** user clicks "Keep Off", **Then** banner disappears, no ad scripts load, and preference is stored locally
3. **Given** consent banner is displayed, **When** user clicks "Enable Ads", **Then** banner disappears, AdSense scripts load, and preference is stored locally
4. **Given** user has set preference, **When** user returns in future session, **Then** consent banner does not reappear and previous choice is respected

---

### User Story 4 - Multi-Tool Navigation with State Persistence (Priority: P3)

A user switches between different timer tools (Stopwatch, Countdown, World Clock, etc.) within a single session. Each tool maintains its state when navigated away and restored when returned to.

**Why this priority**: State persistence across navigation is a key usability feature that prevents frustration and data loss. While not the primary use case, it significantly enhances user experience for power users who need multiple tools.

**Independent Test**: Can be fully tested by starting a stopwatch, navigating to countdown and setting a timer, returning to stopwatch, and verifying both tools retained their exact state.

**Acceptance Scenarios**:

1. **Given** user starts Stopwatch at 00:15:23, **When** user navigates to Home, **Then** stopwatch continues running in background
2. **Given** user navigates back to Stopwatch, **When** page loads, **Then** stopwatch displays current elapsed time (not reset to zero)
3. **Given** user sets Countdown to 10 minutes and navigates away, **When** user returns to Countdown, **Then** countdown shows correct remaining time
4. **Given** multiple tools have active state, **When** user closes browser and reopens app, **Then** all tool states are restored from localStorage

---

### User Story 5 - Keyboard Shortcuts for Projector Control (Priority: P3)

A presenter controlling a timer during a live presentation needs quick keyboard shortcuts to start/pause (Space), reset (R), toggle fullscreen (F), and adjust time (Arrow keys) without clicking UI elements.

**Why this priority**: Keyboard shortcuts enhance professional use cases and presenter efficiency. While secondary to core functionality, they significantly improve the experience for power users and frequent presenters.

**Independent Test**: Can be fully tested by opening any timer tool and verifying Space starts/pauses, R resets, F toggles fullscreen, and Arrow keys adjust time appropriately.

**Acceptance Scenarios**:

1. **Given** Analog Countdown is open and paused, **When** user presses Space key, **Then** timer starts
2. **Given** timer is running, **When** user presses Space key, **Then** timer pauses
3. **Given** timer is paused, **When** user presses R key, **Then** timer resets to configured duration
4. **Given** timer is displayed, **When** user presses F key, **Then** browser enters/exits fullscreen mode
5. **Given** timer is paused, **When** user presses Arrow Up, **Then** time increases by 10 seconds
6. **Given** timer has remaining time, **When** user presses Arrow Down, **Then** time decreases by 10 seconds (not below zero)

---

### User Story 6 - SEO and AI Discoverability (Priority: P3)

A user searches for "projector timer 90 minutes" or "exam countdown timer" and finds Stoppclock in search results. Search engines and AI assistants can accurately understand and recommend Stoppclock for relevant queries.

**Why this priority**: Discoverability drives user acquisition. While the app must work excellently (P1-P2), users must be able to find it. SEO/AI-SEO ensures organic traffic and reduces marketing costs.

**Independent Test**: Can be fully tested by validating JSON-LD structured data with Google Rich Results Test, checking sitemap.xml generation, verifying meta tags are present, and confirming robots.txt allows crawling.

**Acceptance Scenarios**:

1. **Given** search engine crawler visits site, **When** homepage loads, **Then** appropriate title, description, canonical URL, and Open Graph tags are present
2. **Given** AI assistant analyzes site, **When** reading structured data, **Then** JSON-LD WebApplication and FAQPage schemas are valid and complete
3. **Given** site is deployed, **When** build completes, **Then** sitemap.xml is generated with all routes and accessible at /sitemap.xml
4. **Given** user shares link, **When** link is posted on social media, **Then** Open Graph image, title, and description display correctly

---

### Edge Cases

- What happens when user sets timer to maximum duration (12 hours) and leaves tab inactive for extended period?
- How does system handle rapid navigation between tools while timers are running?
- **localStorage full or disabled**: App continues to function but state does not persist; errors logged to console only (no user notification)
- How does timer accuracy behave when device enters sleep/hibernate mode?
- **System time adjustment during timer operation**: Timer naturally reflects system time changes via Date.now(); no special handling or correction applied
- How does fullscreen mode behave across different browsers (Firefox, Safari, mobile browsers)?
- **AdSense script load failure or Publisher IDs not configured**: Ad slots remain empty; errors logged to console only (no user notification)
- **PWA service worker update deployment**: Updates are checked and applied only on manual page refresh; no automatic update prompts or background updates
- **Fullscreen permission denied**: Fullscreen button becomes permanently disabled (grayed out) for that session; user can re-enable by refreshing page
- **prefers-reduced-motion accessibility setting**: Visual flash warnings are replaced with static color change (no animation); sound alerts remain unchanged

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide Analog Countdown timer with visual clock face displaying up to 12 hours, with hour/minute/second hands
- **FR-002**: System MUST support preset durations (5, 10, 15, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720 minutes) for quick selection
- **FR-003**: System MUST allow manual time adjustment via +/- buttons (1-minute increments) and arrow keys (10-second increments)
- **FR-004**: System MUST provide Start/Pause/Reset controls accessible via buttons and keyboard shortcuts (Space, R)
- **FR-005**: System MUST enter/exit fullscreen mode via button and F key for projector-optimized display
- **FR-006**: System MUST display remaining time as HH:MM:SS digital format alongside analog clock
- **FR-007**: System MUST provide configurable warning threshold (off, 1min, 5min, 10min) with visual flash and audio beep
- **FR-008**: System MUST play distinct audio/visual signals at warning threshold and countdown completion
- **FR-009**: System MUST allow users to toggle sound and flash signals independently
- **FR-010**: System MUST persist timer state (duration, remaining time, running status) in localStorage across navigation and sessions
- **FR-011**: System MUST render analog clock at smooth 60 FPS with minimal visual jitter
- **FR-012**: System MUST calculate elapsed time using wall-clock deltas (Date.now()) to prevent drift from setInterval/setTimeout
- **FR-013**: System MUST provide Home page with navigation cards to all 8 timer tools (Stopwatch, Countdown, Analog Countdown, Digital Clock, World Clock, Alarm, Metronome, Chess Clock)
- **FR-014**: System MUST implement hash-based routing (SPA) with routes persisting in URL
- **FR-015**: System MUST register Service Worker for offline app shell caching
- **FR-016**: System MUST provide manifest.webmanifest with proper PWA metadata (name, icons, display mode, theme color)
- **FR-017**: System MUST cache critical assets (HTML, CSS, manifest) in service worker for offline access
- **FR-018**: System MUST display consent banner on first visit with ads disabled by default
- **FR-019**: System MUST store ad consent preference in localStorage and respect choice across sessions
- **FR-020**: System MUST only load AdSense scripts if user explicitly consents via "Enable Ads" button
- **FR-021**: System MUST generate sitemap.xml during build with all routes listed
- **FR-022**: System MUST include JSON-LD structured data for WebApplication and FAQPage schemas
- **FR-023**: System MUST provide appropriate meta tags (title, description, canonical, Open Graph, Twitter Card) for SEO
- **FR-024**: System MUST serve robots.txt allowing crawler access and referencing sitemap
- **FR-025**: System MUST implement 404 SPA fallback (404.html) that redirects to hash routes for GitHub Pages compatibility
- **FR-026**: System MUST enforce Content Security Policy via meta tag restricting script/style/image sources
- **FR-027**: System MUST provide keyboard accessibility (tab navigation, focus states) for all interactive controls
- **FR-028**: System MUST respect prefers-reduced-motion by replacing animated flash warnings with static color change (sound alerts remain active)
- **FR-029**: System MUST maintain color contrast ratio ≥ 4.5:1 for WCAG AA compliance
- **FR-030**: System MUST clamp timer durations between 1 second minimum and 12 hours maximum
- **FR-031**: System MUST run doctor guard script blocking forbidden tokens (lovable, dev-agent, tagger, "Loading app") in source files
- **FR-032**: System MUST generate CNAME file with custom domain during GitHub Actions build
- **FR-033**: System MUST run post-deployment smoke tests verifying 200 responses for critical routes (/, /manifest.webmanifest, /sw.js)
- **FR-034**: System MUST target browser support: last 2 versions Chrome/Edge/Firefox/Safari, iOS 15+
- **FR-035**: System MUST log critical errors (localStorage failures, AdSense load failures, Service Worker registration failures) to browser console without displaying user-visible error messages
- **FR-036**: System MUST check for Service Worker updates only on manual page refresh; no automatic update prompts, notifications, or background update checks during active sessions
- **FR-037**: System MUST disable fullscreen button permanently (for that session) when fullscreen permission is denied by user; button can be re-enabled only by page refresh

### Key Entities

- **Timer State**: Represents the persistent state of any timer tool, including duration (in milliseconds), remaining time, running status (boolean), end timestamp (for drift-free calculation), warning threshold, and signal preferences (sound/flash toggles)
- **Preset**: Represents a quick-selection duration option, defined in minutes, displayed as chip buttons (e.g., "30m", "90m", "2h")
- **Tool Route**: Represents a navigable timer/clock feature, each with unique hash route (e.g., #/analog, #/stopwatch), display name, and persistence key
- **User Preference**: Represents stored user choices including ad consent status, theme preference, and per-tool state, persisted in localStorage with sc.v1.* namespace
- **Structured Data**: Represents SEO-enhancing metadata including WebApplication schema (feature list, category), FAQPage schema (Q&A pairs), and Open Graph tags for social sharing

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can set a 90-minute exam timer and enter fullscreen mode within 10 seconds of opening the app
- **SC-002**: Analog countdown timer maintains visual smoothness at ≥50 FPS (minimum 50 frames per second) on devices from the last 3 years
- **SC-003**: Timer drift remains under 1 second per hour of continuous operation
- **SC-004**: App loads and displays homepage within 2 seconds on Desktop LCP, 3 seconds on 3G mobile
- **SC-005**: App functions fully offline after first load, with all timer tools operational without network
- **SC-006**: PWA installation success rate exceeds 80% when installation prompt appears
- **SC-007**: Homepage cold load JS payload stays under 180 kB gzipped
- **SC-008**: Sitemap.xml is generated successfully and lists all routes on every build
- **SC-009**: JSON-LD structured data passes Google Rich Results Test with zero errors
- **SC-010**: Consent banner correctly prevents AdSense loading when user selects "Keep Off"
- **SC-011**: Timer state persists across navigation for 100% of page transitions within the app
- **SC-012**: Keyboard shortcuts (Space, R, F, Arrow keys) work correctly in 100% of test scenarios
- **SC-013**: Doctor guard script blocks build when forbidden tokens are detected in any source file
- **SC-014**: Post-deployment smoke test achieves 200 status for all critical routes on both Pages URL and custom domain
- **SC-015**: Color contrast ratio meets WCAG AA standard (≥ 4.5:1) for all text and interactive elements
- **SC-016**: Users with prefers-reduced-motion setting see static color change instead of animated flash (sound alerts still function)
- **SC-017**: 90% of users successfully complete their primary timer task (set duration, start, project) on first attempt
- **SC-018**: Fullscreen mode works correctly across Chrome, Firefox, Safari desktop, and iOS Safari

## Assumptions

- Custom domain www.stoppclock.com is configured in GitHub Pages settings with Enforce HTTPS enabled
- DNS records (CNAME for www, A/AAAA for apex) are properly configured per GitHub Pages documentation
- AdSense Client ID and Publisher ID will be provided separately and replaced in index.html and public/ads.txt (currently using REPLACE_ME placeholders)
- Brand assets (favicon, icons at 192x192, 512x512, 180x180) will be provided and placed in public/icons/ directory
- Open Graph cover image (1200x630px) will be hosted at public/og/cover-1200x630.png on own domain
- Imprint and Privacy page content (DE/EN) will be provided as static HTML files
- GitHub Actions has appropriate permissions (contents: read, pages: write, id-token: write) configured in repository settings
- Node.js version 22 is used for build environment (specified in workflow)
- Default theme is dark mode with CSS variables for bg/fg/muted colors
- Audio signal generation uses Web Audio API (gracefully degrades if unavailable)
- Browser notification permission is not required (audio/visual signals only)
- Timer accuracy requirement is "visual smoothness" (60 FPS) and "minimal drift" (sub-second per hour), not microsecond precision
- localStorage availability is assumed; if unavailable, app functions but state does not persist
- Service Worker registration is optional enhancement; app works without it but lacks offline capability
- Canonical domain preference is www.stoppclock.com (apex redirects to www)
- No analytics or third-party tracking except optional AdSense with explicit consent
- Maximum concurrent timers limited only by browser performance (no artificial limit)
- Timer continues running in background tabs using wall-clock timestamps (not affected by tab throttling)

## Dependencies

- Vite (v5.4.10+) for build tooling and dev server
- React (v18.3.1+) and React DOM for UI framework
- TypeScript (v5.6.3+) for type safety
- Node.js (v22) for build scripts and CI environment
- GitHub Actions for CI/CD pipeline
- GitHub Pages for hosting and deployment
- Web APIs: Canvas 2D Context, Fullscreen API, Web Audio API, Service Worker API, LocalStorage API, ResizeObserver
- Browser support for ES2022 features and CSS custom properties

## Out of Scope

- User accounts, authentication, or cloud sync (all state is local-only)
- Real-time collaboration or multi-device timer sync
- Native mobile apps (PWA only)
- Timer export/import functionality
- Custom sound uploads (uses Web Audio API generated tones only)
- Advanced timer scheduling or recurring alarms
- Integration with external calendar systems
- Backend server or database (fully static site)
- Payment processing or premium features (100% free)
- A/B testing or analytics beyond basic AdSense
- Localization/internationalization (English only initially; Imprint/Privacy may be DE/EN)
- Accessibility features beyond WCAG AA (no screen reader optimization, but basic keyboard nav included)
