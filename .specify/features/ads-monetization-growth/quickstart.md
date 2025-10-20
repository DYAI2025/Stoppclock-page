# Quickstart & Testing Guide

**Feature**: Google Ads Monetization & Traffic Growth
**Date**: 2025-10-20

## Quick Start for Developers

### Initial Setup

```bash
# 1. Checkout feature branch
git checkout feature/ads-monetization-growth

# 2. Install new dependencies
npm install

# 3. Create .env file (for local testing only)
cat > .env <<EOF
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ADSENSE_PUBLISHER_ID=ca-pub-1712273263687132
EOF

# 4. Start dev server
npm run dev

# 5. Open browser
open http://localhost:5173
```

### Development Workflow

```bash
# Run tests
npm test                    # Unit tests
npm run test:e2e           # E2E tests (headless)
npm run test:e2e:ui        # E2E tests (interactive)

# Build for production
npm run build

# Lighthouse performance check
npx lighthouse http://localhost:5173 --view

# Type checking
npx tsc --noEmit
```

---

## Manual Testing Scenarios

### Scenario 1: First-Time User with Consent

**Goal**: Verify consent banner works and persists choice

**Steps**:
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. **Expected**: Consent banner appears at top/bottom
4. Click "Enable Ads & Analytics"
5. **Expected**: Banner disappears, ads load
6. Open DevTools → Application → localStorage
7. **Expected**: Key `sc.consent` exists with `adsEnabled: true`
8. Reload page
9. **Expected**: No banner, ads immediately visible

**Acceptance**: ✅ Banner shows once, choice persists, ads load

---

### Scenario 2: User Declines Consent

**Goal**: Verify site works without ads/analytics

**Steps**:
1. Clear localStorage
2. Reload page
3. Click "Keep Off" on consent banner
4. **Expected**: Banner disappears, NO ads visible
5. Check DevTools Network tab
6. **Expected**: No requests to `googlesyndication.com` or `google-analytics.com`
7. Use timers normally
8. **Expected**: All timers work perfectly
9. Reload page
10. **Expected**: No banner, no ads, timers still work

**Acceptance**: ✅ No tracking without consent, full functionality preserved

---

### Scenario 3: Ad Visibility Rules

**Goal**: Verify ads hide when timer running or fullscreen

**Steps**:
1. Accept consent (ads enabled)
2. Go to Countdown timer page
3. **Expected**: Ad visible in setup screen
4. Set time to 1 minute
5. Click "Start"
6. **Expected**: Ads disappear immediately
7. Wait for timer to complete (or click "Pause")
8. **Expected**: Ads reappear
9. Click "Fullscreen" button
10. **Expected**: Ads disappear in fullscreen
11. Exit fullscreen
12. **Expected**: Ads reappear

**Acceptance**: ✅ Ads respect visibility rules (hide when running/fullscreen)

---

### Scenario 4: Custom Branding Upload

**Goal**: Verify logo upload and display on timers

**Steps**:
1. Navigate to Settings or Branding section
2. **Expected**: See "Custom Branding" panel
3. Enter custom text: "Math 101 Exam"
4. Click "Upload Logo" button
5. Select a PNG file (<500KB)
6. **Expected**: Logo preview appears
7. Check "Apply to: Countdown" checkbox
8. Toggle "Enable Branding" ON
9. Navigate to Countdown timer
10. **Expected**: "Math 101 Exam" text and logo overlay visible (top/bottom/corner)
11. Start timer
12. **Expected**: Branding stays visible during countdown
13. Reload page
14. **Expected**: Branding persists

**Acceptance**: ✅ Upload works, branding displays, persists

---

### Scenario 5: Blog Navigation (English)

**Goal**: Verify blog loads and renders correctly

**Steps**:
1. Go to home page
2. Click "Blog" or "Resources" link (if added to nav)
3. **Expected**: Navigate to `#/blog/en/`
4. **Expected**: See list of 4-6 blog post cards
5. Each card shows: title, excerpt, date, reading time
6. Click on "90-Minute Exam Timer" post
7. **Expected**: Navigate to `#/blog/en/90-minute-exam-timer`
8. **Expected**: Post renders with markdown formatting
9. **Expected**: Ads visible in sidebar and in-content
10. Scroll to bottom
11. **Expected**: See "Related Posts" section with 2-3 suggestions
12. Click related post
13. **Expected**: Navigate to new post

**Acceptance**: ✅ Blog loads, posts render, navigation works

---

### Scenario 6: Blog Language Switching

**Goal**: Verify bilingual blog works

**Steps**:
1. Go to `#/blog/en/90-minute-exam-timer`
2. **Expected**: See language switcher (EN/DE toggle)
3. Click "DE" button
4. **Expected**: Navigate to `#/blog/de/90-minuten-prufungstimer`
5. **Expected**: Page content now in German
6. Check `<head>` for hreflang tags (DevTools → Elements)
7. **Expected**: See `<link rel="alternate" hreflang="en" href="...">` and `hreflang="de"`
8. Go back to home page
9. **Expected**: Language preference persists (or resets to EN/DE based on browser)

**Acceptance**: ✅ Translation pairs work, hreflang tags present

---

### Scenario 7: Analytics Event Tracking

**Goal**: Verify GA4 events fire correctly

**Steps**:
1. Open DevTools → Network tab
2. Filter by "collect" (GA4 endpoint)
3. Accept consent (analytics enabled)
4. Go to Countdown timer
5. Set time to 10 seconds
6. Click "Start"
7. **Expected**: Network request to `/g/collect?...&en=timer_started`
8. Check request payload (Preview tab)
9. **Expected**: See `event_name: timer_started`, `timer_type: countdown`, `timer_duration: 10000`
10. Wait for timer to complete (10 seconds)
11. **Expected**: Another request with `en=timer_completed`
12. Check payload
13. **Expected**: See `completion_rate: 1.0`

**Acceptance**: ✅ Events tracked with correct parameters

---

### Scenario 8: Social Sharing

**Goal**: Verify share buttons work and generate UTM links

**Steps**:
1. Go to Countdown timer page
2. **Expected**: See "Share" button or icon
3. Click "Share"
4. **Expected**: Share panel opens with Twitter, Facebook, LinkedIn, Copy Link options
5. Click "Copy Link"
6. **Expected**: Toast/notification "Link copied!"
7. Paste link into text editor
8. **Expected**: URL like `https://www.stoppclock.com/#/countdown?utm_source=copy&utm_medium=social&utm_campaign=timer_share&utm_content=countdown`
9. Click Twitter button
10. **Expected**: Opens Twitter intent URL with pre-filled tweet text
11. Check DevTools Network for GA4 event
12. **Expected**: See `en=share` event with `platform: twitter`, `timer_type: countdown`

**Acceptance**: ✅ UTM parameters correct, tracking works

---

### Scenario 9: Performance with Ads

**Goal**: Verify Lighthouse score remains >90

**Steps**:
1. Build for production: `npm run build`
2. Serve production build: `npx serve dist`
3. Open `http://localhost:3000` in Chrome Incognito (no extensions)
4. Accept consent (load ads)
5. Open DevTools → Lighthouse tab
6. Select: Performance, Desktop, Clear storage
7. Click "Analyze page load"
8. **Expected**: Performance score ≥90
9. Check Core Web Vitals:
   - LCP (Largest Contentful Paint) <2.5s
   - FID (First Input Delay) <100ms (or TBT <300ms)
   - CLS (Cumulative Layout Shift) <0.1
10. Repeat for mobile
11. **Expected**: Mobile score ≥85 (slightly lower acceptable for ads)

**Acceptance**: ✅ Performance targets met

---

### Scenario 10: Offline Functionality

**Goal**: Verify PWA works offline with ads gracefully degraded

**Steps**:
1. Accept consent (ads enabled)
2. Visit several timer pages to cache them
3. Open DevTools → Application → Service Workers
4. Check "Offline" box
5. Reload page
6. **Expected**: Page loads from cache
7. **Expected**: Timers work normally
8. **Expected**: Ads gracefully hidden (no broken placeholders)
9. Try to navigate to blog
10. **Expected**: Blog may not load (network required for markdown fetch)
11. Uncheck "Offline"
12. Reload page
13. **Expected**: Ads reappear, blog loads

**Acceptance**: ✅ Core timer functionality works offline

---

## Automated Test Scenarios

### Unit Test Example (useConsent hook)

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useConsent } from '../useConsent';

describe('useConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initial state has no consent', () => {
    const { result } = renderHook(() => useConsent());
    expect(result.current.hasConsent).toBe(false);
    expect(result.current.showBanner).toBe(true);
  });

  test('granting consent updates state and localStorage', () => {
    const { result } = renderHook(() => useConsent());

    act(() => {
      result.current.grantConsent(true, true);
    });

    expect(result.current.consent.adsEnabled).toBe(true);
    expect(result.current.consent.analyticsEnabled).toBe(true);
    expect(result.current.hasConsent).toBe(true);
    expect(result.current.showBanner).toBe(false);

    const stored = localStorage.getItem('sc.consent');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).adsEnabled).toBe(true);
  });

  test('revoking consent resets to default', () => {
    const { result } = renderHook(() => useConsent());

    act(() => {
      result.current.grantConsent(true, true);
    });

    act(() => {
      result.current.revokeConsent();
    });

    expect(result.current.consent.adsEnabled).toBe(false);
    expect(result.current.consent.analyticsEnabled).toBe(false);
  });
});
```

### E2E Test Example (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Consent Flow', () => {
  test('shows banner on first visit and persists choice', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    await page.goto('/');

    // Banner should be visible
    const banner = page.locator('[data-testid="consent-banner"]');
    await expect(banner).toBeVisible();

    // Accept consent
    await page.click('button:has-text("Enable Ads")');
    await expect(banner).not.toBeVisible();

    // Reload page
    await page.reload();

    // Banner should NOT reappear
    await expect(banner).not.toBeVisible();

    // Ads should be visible
    const ad = page.locator('ins.adsbygoogle');
    await expect(ad).toBeVisible();
  });

  test('hides ads when timer is running', async ({ page }) => {
    await page.goto('/#/countdown');

    // Accept consent
    await page.click('button:has-text("Enable Ads")');

    // Ad should be visible initially
    const ad = page.locator('ins.adsbygoogle');
    await expect(ad).toBeVisible();

    // Start timer
    await page.fill('input[aria-label="Minutes"]', '1');
    await page.click('button:has-text("Start")');

    // Ad should be hidden
    await expect(ad).not.toBeVisible();

    // Pause timer
    await page.click('button:has-text("Pause")');

    // Ad should reappear
    await expect(ad).toBeVisible();
  });
});
```

---

## Debugging Tips

### AdSense Not Loading?

**Check**:
1. Consent given? → DevTools → localStorage → `sc.consent`
2. Script loaded? → DevTools → Network → Filter "adsbygoogle.js"
3. Ad slots created? → DevTools → Elements → Search for `<ins class="adsbygoogle">`
4. Console errors? → DevTools → Console

**Common Issues**:
- AdBlocker installed → Disable to test
- Invalid publisher ID → Check `VITE_ADSENSE_PUBLISHER_ID`
- Ad slots not pushed → Check `(adsbygoogle = window.adsbygoogle || []).push({})`

### GA4 Not Tracking?

**Check**:
1. Consent given? → localStorage → `sc.consent`
2. gtag.js loaded? → DevTools → Network → "gtag/js"
3. Measurement ID correct? → Check `VITE_GA4_MEASUREMENT_ID`
4. Events firing? → Network → Filter "collect"

**Debug Mode**:
```typescript
// Add to GA4Script.tsx
gtag('config', measurementId, {
  debug_mode: true
});
```
Then check DevTools → Console for GA4 debug logs

### Custom Branding Not Showing?

**Check**:
1. Branding enabled? → localStorage → `sc.branding` → `enabled: true`
2. Timer type matches? → `timerTypes` array includes current timer
3. Logo uploaded? → `logoImage` is base64 data URL
4. Component rendered? → DevTools → Elements → Search for "custom-branding"

### Blog Posts Not Loading?

**Check**:
1. Route correct? → URL should be `#/blog/en/slug` or `#/blog/de/slug`
2. Post exists? → Check `src/data/blog-posts.ts`
3. Markdown file exists? → Check `src/content/blog/en/slug.md`
4. Network error? → DevTools → Network → Check markdown fetch

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install
      - run: npm run test              # Unit tests
      - run: npm run build
      - run: npx playwright install
      - run: npm run test:e2e          # E2E tests

      # Lighthouse CI
      - run: npm install -g @lhci/cli
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Lighthouse CI Config (`.lighthouserc.json`)

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run serve",
      "url": ["http://localhost:3000", "http://localhost:3000/#/countdown"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "performance": ["error", {"minScore": 0.9}],
        "accessibility": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## Monitoring Post-Launch

### Google Analytics 4 Dashboard

**Key Reports to Monitor**:
1. **Realtime** → See live users, current pages
2. **Engagement** → Pages and screens → See most visited timers
3. **Events** → See `timer_started`, `timer_completed` counts
4. **Conversions** → Mark `timer_completed` as conversion, track rate

### Google AdSense Dashboard

**Key Metrics**:
1. **Earnings** → Daily revenue
2. **RPM** (Revenue per 1000 impressions) → Target $3-8
3. **Page RPM** → Revenue per 1000 pageviews
4. **CTR** (Click-through rate) → Typical 0.5-2%
5. **Policy violations** → Watch for warnings

### Google Search Console

**Key Reports**:
1. **Performance** → See which queries drive traffic to blog
2. **Core Web Vitals** → Monitor LCP, FID, CLS
3. **Coverage** → Ensure all blog posts indexed
4. **Sitemaps** → Verify sitemap.xml submitted

---

## Troubleshooting Guide

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Consent banner shows every visit | localStorage not persisting | Check browser settings, ensure not in incognito/private mode |
| Ads not appearing | AdBlocker, consent not given, invalid publisher ID | Disable adblocker, check consent, verify publisher ID |
| Ads show when timer running | `useAdVisibility` logic error | Check timer `running` state passed correctly |
| Page slow to load | Ads blocking critical path | Ensure async loading, check network waterfall |
| Custom logo too large | File >500KB | Resize image before upload, enforce limit in code |
| Blog post 404 | Slug mismatch | Check slug in `blog-posts.ts` matches markdown filename |
| GA4 events not firing | Consent not given, gtag not loaded, measurement ID wrong | Check consent, network tab, verify ID |
| Lighthouse score <90 | Ads impacting performance | Lazy load ads, optimize images, check CLS |
| localStorage quota exceeded | Too many timer states + large logo | Clear old data, reduce logo size, warn user |

---

**Next Steps**: Run `/speckit.tasks` to generate detailed task breakdown for implementation.
