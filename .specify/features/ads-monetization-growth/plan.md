# Implementation Plan: Google Ads Monetization & Traffic Growth

**Created**: 2025-10-20
**Based on**: [spec.md](./spec.md)
**Branch**: `feature/ads-monetization-growth`

## Tech Stack

### Languages & Frameworks
- **TypeScript 5.6.3**: Existing, for type safety
- **React 18.3.1**: Existing, for UI components
- **Vite 5.4.10**: Existing, for build tooling

### Libraries & Tools

#### New Dependencies
- `react-markdown ^9.0.0`: Render blog post markdown
- `remark-gfm ^4.0.0`: GitHub Flavored Markdown support
- `react-syntax-highlighter ^15.5.0`: Code syntax highlighting in blog posts
- `@types/react-syntax-highlighter ^15.5.0`: TypeScript types

#### External Services
- **Google AdSense**: Ad serving (Publisher ID: ca-pub-1712273263687132)
- **Google Analytics 4**: User tracking and analytics (new property needed)
- **Google Search Console**: SEO monitoring (existing/link to GA4)

### Infrastructure
- **Vite**: Development server and production bundler
- **Playwright**: E2E testing (existing)
- **GitHub Actions**: CI/CD (existing, will add Lighthouse CI)
- **Static Hosting**: Current hosting solution (unchanged)

---

## Architecture Overview

### Component Structure

```
src/
├── components/
│   ├── ads/
│   │   ├── AdUnit.tsx               # Generic ad slot component
│   │   ├── AnchorAd.tsx             # Bottom sticky ad
│   │   ├── ConsentBanner.tsx        # GDPR consent banner
│   │   └── AdSenseScript.tsx        # Script loader component
│   ├── blog/
│   │   ├── BlogIndex.tsx            # Blog listing page
│   │   ├── BlogPost.tsx             # Single post view
│   │   ├── BlogCard.tsx             # Post preview card
│   │   ├── LanguageSwitcher.tsx    # EN/DE toggle
│   │   └── RelatedPosts.tsx         # Related articles
│   ├── branding/
│   │   ├── CustomBranding.tsx       # Branding display overlay
│   │   ├── BrandingSettings.tsx    # Settings panel for branding
│   │   └── LogoUpload.tsx           # File upload component
│   ├── analytics/
│   │   └── GA4Script.tsx            # GA4 initialization
│   └── social/
│       └── ShareButtons.tsx         # Social sharing UI
│
├── hooks/
│   ├── useConsent.ts                # Consent management
│   ├── useBranding.ts               # Branding state
│   ├── useAnalytics.ts              # GA4 event tracking
│   ├── useAdVisibility.ts           # Ad display logic
│   ├── useBlogPosts.ts              # Blog data loading
│   └── useShareUrl.ts               # UTM link generation
│
├── utils/
│   ├── consent.ts                   # Consent helpers
│   ├── branding.ts                  # Branding helpers
│   ├── analytics.ts                 # GA4 helpers
│   └── seo.ts                       # Meta tag helpers
│
├── types/
│   └── monetization-types.ts        # All type definitions
│
├── config/
│   ├── ad-units.ts                  # AdSense unit configs
│   └── blog-config.ts               # Blog settings
│
├── data/
│   ├── blog-posts.ts                # Blog post metadata
│   └── i18n/
│       ├── en.json                  # English translations
│       └── de.json                  # German translations
│
└── content/
    └── blog/
        ├── en/
        │   ├── 90-minute-exam-timer.md
        │   ├── classroom-time-management.md
        │   └── ...
        └── de/
            ├── 90-minuten-prufungstimer.md
            ├── klassenzimmer-zeitmanagement.md
            └── ...
```

### Data Flow

```
User Visit
    ↓
ConsentBanner (if first visit)
    ↓ (consent granted)
    ├─> AdSense Script Loads (async)
    ├─> GA4 Script Loads (async)
    └─> localStorage.setItem('sc.consent')
    ↓
App Renders with Ads
    ↓
useAdVisibility Hook
    ├─> checks consent
    ├─> checks timer state (running/stopped)
    ├─> checks fullscreen
    └─> returns shouldShowAd
    ↓
AdUnit Component
    ├─> renders <ins> tag (AdSense slot)
    └─> AdSense fills with ad
    ↓
User Interacts with Timer
    ↓
useAnalytics Hook
    └─> gtag('event', 'timer_started', {...})
```

### Integration Points

1. **Existing Timer Pages**: Add `<CustomBranding>` and `<AdUnit>` components
2. **Home Page** (`main.tsx`): Insert ads between timer cards
3. **Consent Banner**: Replace existing simple banner in `index.html` with React component
4. **Service Worker** (`public/sw.js`): Ensure ad scripts not cached
5. **Router** (`main.tsx`): Add blog routes (`#/blog/en/:slug`, `#/blog/de/:slug`)

---

## File Structure

### New Files to Create

```
src/components/ads/
├── AdUnit.tsx               [NEW] Generic ad component
├── AnchorAd.tsx             [NEW] Sticky bottom ad
├── ConsentBanner.tsx        [NEW] GDPR banner (replaces index.html version)
└── AdSenseScript.tsx        [NEW] Script loader

src/components/blog/
├── BlogIndex.tsx            [NEW] Blog listing
├── BlogPost.tsx             [NEW] Post viewer
├── BlogCard.tsx             [NEW] Post card
├── LanguageSwitcher.tsx     [NEW] EN/DE toggle
└── RelatedPosts.tsx         [NEW] Related articles

src/components/branding/
├── CustomBranding.tsx       [NEW] Display overlay
├── BrandingSettings.tsx     [NEW] Settings UI
└── LogoUpload.tsx           [NEW] File upload

src/components/analytics/
└── GA4Script.tsx            [NEW] GA4 loader

src/components/social/
└── ShareButtons.tsx         [NEW] Share UI

src/hooks/
├── useConsent.ts            [NEW]
├── useBranding.ts           [NEW]
├── useAnalytics.ts          [NEW]
├── useAdVisibility.ts       [NEW]
├── useBlogPosts.ts          [NEW]
└── useShareUrl.ts           [NEW]

src/utils/
├── consent.ts               [NEW]
├── branding.ts              [NEW]
├── analytics.ts             [NEW]
└── seo.ts                   [NEW]

src/types/
└── monetization-types.ts    [NEW]

src/config/
├── ad-units.ts              [NEW]
└── blog-config.ts           [NEW]

src/data/
├── blog-posts.ts            [NEW]
└── i18n/
    ├── en.json              [NEW]
    └── de.json              [NEW]

src/content/blog/
├── en/
│   ├── 90-minute-exam-timer.md            [NEW]
│   ├── classroom-time-management.md       [NEW]
│   ├── online-stopwatch-for-teaching.md   [NEW]
│   └── chess-clock-for-debates.md         [NEW]
└── de/
    ├── 90-minuten-prufungstimer.md        [NEW]
    ├── klassenzimmer-zeitmanagement.md    [NEW]
    ├── online-stoppuhr-fur-unterricht.md  [NEW]
    └── schachuhr-fur-debatten.md          [NEW]

public/
└── blog/
    └── images/
        ├── exam-timer-og.jpg              [NEW]
        ├── classroom-management-og.jpg    [NEW]
        └── ...
```

### Existing Files to Modify

```
src/main.tsx                 [MODIFY] Add blog routes, consent banner
src/pages/Countdown.tsx      [MODIFY] Add branding, ads, analytics
src/pages/AnalogCountdown.tsx[MODIFY] Add setup screen with ads
src/pages/Stopwatch.tsx      [MODIFY] Add analytics tracking
src/pages/DigitalClock.tsx   [MODIFY] Add branding display
src/pages/WorldClock.tsx     [MODIFY] Add branding display
src/pages/Alarm.tsx          [MODIFY] Add setup screen with ads
src/pages/ChessClock.tsx     [MODIFY] Add setup screen with ads
src/pages/CycleTimer.tsx     [MODIFY] Add setup screen with ads
src/pages/Metronome.tsx      [MODIFY] Add analytics tracking
src/styles.css               [MODIFY] Add blog styles, ad styles
index.html                   [MODIFY] Remove old consent banner, add GA4 meta
public/sw.js                 [MODIFY] Exclude ad scripts from cache
package.json                 [MODIFY] Add new dependencies
vite.config.ts               [MODIFY] Add blog markdown loading
.gitignore                   [MODIFY] Ignore .env for GA4 keys (if needed)
```

---

## Implementation Phases

### Phase 0: Research & Setup (COMPLETED)

✅ Research technical decisions
✅ Design data model
✅ Define API contracts

---

### Phase 1: Foundation (Week 1)

**Goal**: Set up type definitions, utility functions, and core hooks

#### Tasks:
1. **Install Dependencies**
   ```bash
   npm install react-markdown remark-gfm react-syntax-highlighter
   npm install --save-dev @types/react-syntax-highlighter
   ```

2. **Create Type Definitions** (`src/types/monetization-types.ts`)
   - ConsentPreference, AdUnit, CustomBranding, BlogPost, AnalyticsEvent, SocialShare

3. **Implement Consent System**
   - `src/utils/consent.ts`: Load/save/migrate functions
   - `src/hooks/useConsent.ts`: React hook with state management
   - Unit tests for consent logic

4. **Implement Branding System**
   - `src/utils/branding.ts`: File upload, base64 encoding, quota tracking
   - `src/hooks/useBranding.ts`: React hook with file handling
   - Unit tests for branding logic

5. **Implement Analytics System**
   - `src/utils/analytics.ts`: GA4 gtag wrappers
   - `src/hooks/useAnalytics.ts`: Event tracking hooks
   - Unit tests for analytics helpers

6. **Create Ad Configuration**
   - `src/config/ad-units.ts`: Define all AdSense placements

---

### Phase 2: Core Components (Week 2)

**Goal**: Build reusable UI components for ads, consent, and branding

#### Tasks:
1. **Consent Banner Component** (`src/components/ads/ConsentBanner.tsx`)
   - Show on first visit
   - "Enable Ads & Analytics" vs "Keep Off" buttons
   - Explain what data is collected
   - Persist choice and hide banner

2. **AdSense Script Loader** (`src/components/ads/AdSenseScript.tsx`)
   - Load AdSense script only if consent given
   - Async loading after critical render
   - Handle script load errors gracefully

3. **Generic Ad Unit** (`src/components/ads/AdUnit.tsx`)
   - Render AdSense `<ins>` tag
   - Accept AdUnit config as prop
   - Handle visibility rules
   - Responsive sizing

4. **Anchor Ad Component** (`src/components/ads/AnchorAd.tsx`)
   - Bottom sticky positioning
   - Auto-hide when timer running or fullscreen
   - Manual close button
   - Session persistence for closed state

5. **GA4 Script Loader** (`src/components/analytics/GA4Script.tsx`)
   - Load GA4 gtag.js only if consent given
   - Initialize with measurement ID
   - Set up consent mode v2

6. **Custom Branding Display** (`src/components/branding/CustomBranding.tsx`)
   - Overlay component for timers
   - Show custom text + logo
   - Configurable position (top/bottom/corner)
   - Fade-in animation

7. **Branding Settings Panel** (`src/components/branding/BrandingSettings.tsx`)
   - Text input field
   - Logo upload button
   - Preview
   - Timer type checkboxes
   - Clear/reset button

---

### Phase 3: Timer Integration (Week 3)

**Goal**: Add ads, branding, and analytics to existing timer pages

#### Tasks:
1. **Home Page Ads** (`src/main.tsx`)
   - Insert 2 responsive ad units between timer cards
   - Maintain grid layout (3→2→1 columns)
   - Load ads after grid renders

2. **Setup Screens for Timers**
   - Analog Countdown: Add preset selection screen with sidebar ad
   - Digital Countdown: Add time input screen with ad
   - Alarm: Add alarm creation screen with ad
   - Chess Clock: Add player setup screen with ad
   - Cycle Timer: Add interval config screen with ad

3. **Timer Completion Interstitials**
   - Countdown: Show ad when timer reaches 0
   - Alarm: Show ad when alarm triggers
   - Add "Continue" / "New Timer" buttons
   - 5-second skip timer

4. **Anchor Ads on Timer Pages**
   - Add `<AnchorAd>` component to all timer pages
   - Wire up visibility logic (hide when running/fullscreen)

5. **Custom Branding Integration**
   - Add `<CustomBranding>` overlay to all timer pages
   - Read from useBranding hook
   - Only show if enabled and timer type matches

6. **Analytics Event Tracking**
   - Countdown: Track start, complete, stop events
   - Stopwatch: Track start, lap, stop events
   - All timers: Track duration on start
   - Track fullscreen enter/exit
   - Track branding enable/disable

---

### Phase 4: Blog System (Week 4)

**Goal**: Implement bilingual blog with SEO optimization

#### Tasks:
1. **Blog Data Structure** (`src/data/blog-posts.ts`)
   - Define array of BlogPost objects
   - Include EN and DE versions
   - Link translation pairs

2. **Blog Hook** (`src/hooks/useBlogPosts.ts`)
   - Load posts filtered by language
   - `getPostBySlug` function
   - `getRelatedPosts` function

3. **Blog Index Page** (`src/components/blog/BlogIndex.tsx`)
   - List all posts for selected language
   - Show title, excerpt, date, reading time
   - Filter/sort options
   - Sidebar ads

4. **Blog Post Page** (`src/components/blog/BlogPost.tsx`)
   - Fetch markdown content
   - Render with react-markdown
   - Show title, date, author, reading time
   - Add hreflang links to translation
   - In-content ad units
   - Related posts section

5. **Language Switcher** (`src/components/blog/LanguageSwitcher.tsx`)
   - EN/DE toggle button
   - Persist preference
   - Switch between translation pairs

6. **Blog Routing** (`src/main.tsx`)
   - Add routes: `#/blog`, `#/blog/en/:slug`, `#/blog/de/:slug`
   - Redirect `/blog` to `/blog/en` or `/blog/de` based on preference

7. **Write Initial Blog Posts** (4-6 per language)
   - EN: 90-minute exam timer, classroom time management, online stopwatch for teaching, chess clock for debates
   - DE: Translations or German-specific content

8. **SEO Optimization**
   - Update meta descriptions for all pages
   - Add JSON-LD structured data for blog posts
   - Generate XML sitemap including blog URLs
   - Add hreflang tags for bilingual SEO

---

### Phase 5: Social & SEO Features (Week 5)

**Goal**: Add sharing, SEO enhancements, and performance optimization

#### Tasks:
1. **Share Buttons Component** (`src/components/social/ShareButtons.tsx`)
   - Twitter, Facebook, LinkedIn, Copy Link buttons
   - Generate UTM parameters
   - Track share events in GA4

2. **Share URL Hook** (`src/hooks/useShareUrl.ts`)
   - Generate URLs with UTM params
   - Copy to clipboard functionality
   - Pre-written share text

3. **SEO Utility** (`src/utils/seo.ts`)
   - Dynamic meta tag updates
   - Open Graph tags
   - Twitter Card tags
   - Schema.org JSON-LD generation

4. **Sitemap Generation** (extend existing script)
   - Add blog posts to sitemap.xml
   - Include hreflang annotations
   - Priority and changefreq values

5. **robots.txt Update**
   - Ensure blog paths crawlable
   - Sitemap reference

6. **Performance Optimization**
   - Add `dns-prefetch` for Google domains
   - Lazy load ads below fold
   - Code splitting for blog components
   - Image optimization for blog OG images

---

### Phase 6: Testing & Polish (Week 6)

**Goal**: Comprehensive testing, bug fixes, and performance validation

#### Tasks:
1. **Unit Tests**
   - All hooks (useConsent, useBranding, useAnalytics, etc.)
   - Utility functions
   - Component logic (not UI)

2. **E2E Tests** (Playwright)
   - Consent banner flow (accept/decline)
   - Ad visibility rules (running timer hides ads)
   - Custom branding upload and display
   - Blog navigation and rendering
   - Social sharing
   - Analytics event firing (mock gtag)

3. **Performance Testing**
   - Run Lighthouse on all pages
   - Ensure score >90 with ads loaded
   - Measure Core Web Vitals (LCP, FID, CLS)
   - Test on slow 3G network

4. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)

5. **Accessibility Audit**
   - Keyboard navigation for all new components
   - Screen reader compatibility
   - Color contrast validation
   - Focus management

6. **Bug Fixes & Polish**
   - Fix any issues found in testing
   - Smooth animations
   - Error state handling
   - Loading states

---

### Phase 7: Deployment & Monitoring (Week 7)

**Goal**: Deploy to production and set up monitoring

#### Tasks:
1. **Google AdSense Setup**
   - Create new ad units in AdSense dashboard
   - Get actual ad slot IDs (replace placeholders)
   - Test ad serving

2. **Google Analytics 4 Setup**
   - Create new GA4 property
   - Get measurement ID (G-XXXXXXXXXX)
   - Link to Google Search Console
   - Set up custom events in GA4 dashboard

3. **Environment Variables**
   - Store GA4 measurement ID
   - Store AdSense publisher ID

4. **CI/CD Updates**
   - Add Lighthouse CI to GitHub Actions
   - Fail builds if Lighthouse score <90
   - Add bundle size checks

5. **Deploy to Production**
   - Merge feature branch to main
   - Deploy to hosting
   - Verify ads loading correctly
   - Verify analytics tracking

6. **Post-Launch Monitoring**
   - Monitor GA4 for events
   - Check AdSense earnings dashboard
   - Watch Core Web Vitals in Search Console
   - Monitor error logs

---

## Dependencies

### External Dependencies

1. **Google AdSense Account** (existing)
   - Status: Active
   - Action: Create new ad units for placements

2. **Google Analytics 4** (needs creation)
   - Action: Create new GA4 property
   - Action: Link to Search Console

3. **Content Assets**
   - 8-12 blog post images (1200x630 for OG)
   - Blog post content (markdown)
   - Translations (EN ↔ DE)

### Internal Dependencies

1. **Existing Codebase**
   - React 18 (already using)
   - TypeScript (already using)
   - Hash router (keeping)
   - Design tokens (extending)

2. **localStorage API**
   - Consent storage
   - Branding storage
   - Must respect 5-10MB quota

3. **Service Worker**
   - Must NOT cache ad scripts
   - Must cache blog images/content

---

## Constitution Compliance Check

### ✅ Privacy First
- [x] No tracking without explicit opt-in consent → `useConsent` hook enforces this
- [x] All analytics require user approval → GA4 only loads with consent
- [x] Local-first data storage → All data in localStorage, no server
- [x] GDPR compliance → Consent banner meets Article 7 requirements
- [x] Clear communication → Consent banner explains data collection

### ✅ Performance & Speed
- [x] Lighthouse score >90 → Phase 6 testing enforces this
- [x] Initial page load under 2 seconds → Ads load async after critical path
- [x] No blocking third-party scripts → async/defer attributes used
- [x] Async loading for non-essential → AdSense and GA4 load async
- [x] Service worker strategy → Ad scripts excluded from cache

### ✅ Classroom Optimized
- [x] Fullscreen/projector mode without ads → `useAdVisibility` hides ads when fullscreen
- [x] Keyboard-only navigation → All new components support keyboard
- [x] Large, readable fonts → Inherits existing design tokens
- [x] Works offline → PWA functionality preserved, ads gracefully hidden
- [x] No interruptions during timer usage → Ads hidden when timer running

### ✅ Progressive Enhancement
- [x] Timers function without ads → Ads are overlay, don't affect timer logic
- [x] Graceful degradation → Ad components check consent, fail silently
- [x] No breaking changes → All timer functionality preserved
- [x] Offline-first maintained → Service worker still caches timer assets

### ✅ Accessibility
- [x] High contrast themes → Uses existing design tokens
- [x] respects prefers-reduced-motion → Animations disabled if user prefers
- [x] Keyboard navigation → All components support Tab/Enter/Escape
- [x] Screen reader support → Semantic HTML, ARIA labels
- [x] Mobile-responsive → Responsive ad units, mobile-first CSS

### ✅ Code Quality
- [x] TypeScript strict mode → All new files use strict TypeScript
- [x] Comprehensive tests → Phase 6 includes unit and E2E tests
- [x] No console errors → Errors caught and handled gracefully
- [x] Follow existing patterns → Uses same patterns as timer pages
- [x] Document breaking changes → Changelog maintained

### ⚠️ Monetization Guidelines Compliance

**Acceptable Practices**:
- [x] Opt-in Google AdSense with consent banner
- [x] Non-intrusive ad placement (home, setup screens, legal pages)
- ~~[ ] Ad-free mode option~~ **REMOVED** per user clarification
- [x] Honest value proposition ("Support free timers")

**Unacceptable Practices** (all avoided):
- [x] NOT forced ads without consent
- [x] NOT ads during active timer usage
- [x] NOT tracking without consent
- [x] NOT pop-ups or interstitials that block timer access
- [x] NOT auto-playing video/audio ads

---

## Risk Assessment

### High Risks

1. **AdSense Policy Violation**
   - Risk: New ad placements could violate AdSense policies
   - Probability: Low (following best practices)
   - Impact: High (account suspension)
   - Mitigation: Review policies, test in staging, avoid accidental clicks

2. **Performance Degradation**
   - Risk: Ads slow down page load below Lighthouse 90
   - Probability: Medium
   - Impact: High (violates constitution)
   - Mitigation: Lighthouse CI enforced, async loading, performance budget

3. **localStorage Quota Exceeded**
   - Risk: Large logos cause quota issues
   - Probability: Low (500KB limit enforced)
   - Impact: Medium (branding feature breaks)
   - Mitigation: File size validation, quota monitoring, user warnings

### Medium Risks

4. **Translation Quality**
   - Risk: Poor German translations hurt credibility
   - Probability: Medium
   - Impact: Medium (German audience distrust)
   - Mitigation: Professional translation or human review of AI translations

5. **GDPR Non-Compliance**
   - Risk: Consent implementation doesn't meet legal requirements
   - Probability: Low (following best practices)
   - Impact: High (legal issues)
   - Mitigation: Legal review recommended, use Google Consent Mode v2

6. **Ad Blocker Compatibility**
   - Risk: 25-40% of users have ad blockers
   - Probability: High
   - Impact: Low (expected, no workaround)
   - Mitigation: Polite message asking to whitelist (optional)

### Low Risks

7. **Blog Content Maintenance**
   - Risk: Not enough time to write 4-8 posts per month
   - Probability: Medium
   - Impact: Low (slower traffic growth)
   - Mitigation: Outsource content creation, reduce frequency

8. **GA4 Event Tracking Errors**
   - Risk: Events not tracked correctly
   - Probability: Low
   - Impact: Low (monitoring issue only)
   - Mitigation: Test events in GA4 debug mode

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Coverage Targets**: >80% for utils and hooks

**Test Files**:
```
src/utils/__tests__/
├── consent.test.ts
├── branding.test.ts
├── analytics.test.ts
└── seo.test.ts

src/hooks/__tests__/
├── useConsent.test.ts
├── useBranding.test.ts
├── useAnalytics.test.ts
├── useAdVisibility.test.ts
├── useBlogPosts.test.ts
└── useShareUrl.test.ts
```

**Key Test Scenarios**:
- Consent: Grant, revoke, persistence, migration
- Branding: Upload, validation, quota tracking, clear
- Analytics: Event tracking, consent gating, error handling
- Ad visibility: Timer running, fullscreen, consent checking

### E2E Tests (Playwright)

**Test Files**:
```
tests/e2e/
├── 09-consent-flow.spec.ts
├── 10-ad-visibility.spec.ts
├── 11-custom-branding.spec.ts
├── 12-blog-navigation.spec.ts
└── 13-social-sharing.spec.ts
```

**Key Test Scenarios**:
- User accepts consent → ads appear
- User declines consent → no ads, no analytics
- Timer running → ads hidden
- Timer stopped → ads visible
- Upload logo → appears on timer
- Navigate blog → posts load correctly
- Click share button → URL copied with UTM params

### Performance Tests

**Tools**: Lighthouse CI, WebPageTest

**Metrics to Monitor**:
- Lighthouse Performance score >90
- First Contentful Paint (FCP) <1.8s
- Largest Contentful Paint (LCP) <2.5s
- Total Blocking Time (TBT) <300ms
- Cumulative Layout Shift (CLS) <0.1

**Test Pages**:
- Home page (with ads)
- Countdown timer (with ads and branding)
- Blog index
- Blog post

---

## Rollout Plan

### Soft Launch (Week 7)

1. Deploy to production
2. Enable feature for 10% of users (or use feature flag)
3. Monitor for 48 hours:
   - Lighthouse scores
   - Error rates in console
   - AdSense policy warnings
   - GA4 event tracking
4. If stable, increase to 50%

### Full Rollout (Week 8)

1. Enable for 100% of users
2. Announce blog in social media (if applicable)
3. Submit sitemap to Google Search Console
4. Monitor for 1 week:
   - Traffic trends in GA4
   - Ad RPM in AdSense
   - Core Web Vitals in Search Console
   - User feedback (if any)

### Post-Launch Optimization (Ongoing)

1. **Week 9-10**: Analyze GA4 data
   - Which timers are most used?
   - What timer durations are popular?
   - Which blog posts get traffic?
2. **Week 11-12**: Optimize based on data
   - A/B test ad placements (manual)
   - Write more posts on popular topics
   - Improve low-performing pages
3. **Month 3-6**: Scale traffic growth
   - Publish 2-4 posts per month
   - Monitor keyword rankings
   - Adjust SEO strategy based on Search Console data

---

## Success Metrics (from spec.md)

**Target Date**: 3-6 months post-launch

1. ✅ **Ad RPM**: $3-8 per 1000 pageviews
2. ✅ **User Consent**: >40% opt-in rate
3. ✅ **Traffic Growth**: 10k-30k monthly visitors (from 1k-10k)
4. ✅ **Performance**: Lighthouse score >90
5. ✅ **Engagement**: +20% session duration
6. ✅ **SEO**: 5+ blog posts ranking on page 1
7. ✅ **Ad Viewability**: >70% viewability rate
8. ✅ **User Retention**: -10% bounce rate
9. ✅ **Social Traction**: 50+ shares per month
10. ✅ **Blog Conversion**: 30%+ of blog visitors use timers

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Run `/speckit.tasks`** to generate detailed task breakdown
3. **Create GitHub issues** for each phase
4. **Begin Phase 1**: Foundation implementation
5. **Set up project board** to track progress

---

**Plan Status**: Ready for task generation
**Estimated Total Effort**: 7 weeks (1 developer, full-time equivalent)
**Constitution Compliance**: ✅ All principles validated
