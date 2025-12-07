# Custom Sessions - Product Goals & KPIs

**Date:** 2025-12-04
**Task:** T0.3 - Produktziele & KPIs für Custom Sessions konkretisieren
**Status:** ✅ Complete

## Executive Summary

This document defines measurable success criteria (SC-1 to SC-5) and Key Performance Indicators (KPIs) for the Custom Sessions feature. All metrics are actionable, measurable, and aligned with stoppclock.com's constitution principles (Privacy-First, Performance, Classroom-Optimized).

---

## Success Criteria Overview

Derived from the implementation plan:

| ID | Category | Goal | Target | Measurement Method |
|----|----------|------|--------|-------------------|
| **SC-1** | Usability | Session creation time | <3 minutes | User testing + analytics |
| **SC-2** | Readability | Focus text legibility | >90% satisfied users | User survey + A/B testing |
| **SC-3** | Reliability | Error-free sessions | ≥95% success rate | Error tracking + logs |
| **SC-4** | Adoption | Feature usage | ≥50% of active users | Analytics + cohort analysis |
| **SC-5** | Stability | No error rate increase | <baseline error rate | Error monitoring |

---

## SC-1: Usability - Session Creation Time

### Goal
Users can create a custom session with ≥4 elements in **under 3 minutes**.

### Rationale
- Benchmark: Existing Couples Timer setup takes ~30 seconds (select profile + preset)
- Custom sessions are more complex, but should remain fast
- 3 minutes allows for thoughtful configuration without friction

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Median Time-to-Create** | <3 minutes | Track from "New Session" click to "Start Session" click |
| **90th Percentile** | <5 minutes | Worst-case scenario for slower users |
| **Abandonment Rate** | <20% | % of users who start but don't finish session creation |
| **Form Field Errors** | <2 per session | Average number of validation errors per attempt |

### Measurement Method

**Analytics Events (Client-Side):**

```typescript
// Event 1: Session builder opened
gtag('event', 'session_builder_open', {
  event_category: 'Custom_Sessions',
  event_label: 'builder_opened',
  value: Date.now()
});

// Event 2: Element added
gtag('event', 'element_added', {
  event_category: 'Custom_Sessions',
  element_type: 'SPEAK',  // SPEAK, TRANSITION, COOLDOWN
  element_count: 3,
  timestamp: Date.now()
});

// Event 3: Session saved/started
gtag('event', 'session_created', {
  event_category: 'Custom_Sessions',
  event_label: 'session_started',
  element_count: 5,
  total_duration_ms: 1800000,  // 30 minutes
  time_to_create_ms: 142000,   // 2:22 minutes
  timestamp: Date.now()
});

// Event 4: Session abandoned
gtag('event', 'session_abandoned', {
  event_category: 'Custom_Sessions',
  element_count: 2,
  time_spent_ms: 95000,  // 1:35 minutes
  timestamp: Date.now()
});
```

**Privacy Compliance:**
- Only fire events if user consented to analytics (check `ConsentPreferences`)
- No personally identifiable information (PII) in events
- Aggregate data only, no individual tracking

**Analysis:**
- GA4 dashboard: Custom "Session Creation Funnel"
- Calculate median, 90th percentile via BigQuery export
- Track weekly trends

### Success Indicators

✅ **Pass:** Median time <3 min, 90th percentile <5 min, abandonment <20%
⚠️ **Warning:** Median 3-4 min, abandonment 20-30%
❌ **Fail:** Median >4 min, abandonment >30%

### Usability Testing (Manual)

**Protocol:**
- N=10 users (5 experienced, 5 new to stoppclock.com)
- Task: "Create a custom session with 4 elements: 2 speaking phases, 1 transition, 1 cooldown"
- Measure: Time from start to completion, error count, subjective satisfaction (1-5)
- Record: Screen recordings + think-aloud protocol

**Timing:** Before launch (MVP validation) + 4 weeks post-launch (iteration)

---

## SC-2: Readability - Focus Text Legibility

### Goal
Focus text in live sessions is easily readable from **5 meters distance** on a projector.
Users rate readability as ≥4/5 (satisfied or very satisfied).

### Rationale
- Primary use case: Classroom/seminar projection
- Current Couples Timer uses 1.2rem font (too small for projection)
- Plan specifies 4rem (64px) for projector mode (see platform-and-screen-targets.md)

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **User Satisfaction** | ≥90% rate ≥4/5 | Post-session survey |
| **Minimum Font Size (Projector)** | 4rem (64px) | Code review + visual test |
| **Contrast Ratio** | ≥18:1 (AAA) | WebAIM Contrast Checker |
| **Auto-Scaling Works** | 100% of sessions | Test with 50-500 char focus text |

### Measurement Method

**In-App Survey (Post-Session):**

After completing a custom session, show optional survey:

```
┌────────────────────────────────────────┐
│  How readable was the focus text?     │
│                                        │
│  [1] ⭐ Very Hard to Read              │
│  [2] ⭐⭐ Hard to Read                  │
│  [3] ⭐⭐⭐ Okay                         │
│  [4] ⭐⭐⭐⭐ Easy to Read               │
│  [5] ⭐⭐⭐⭐⭐ Very Easy to Read         │
│                                        │
│  [Skip] [Submit]                       │
└────────────────────────────────────────┘
```

**Analytics Event:**

```typescript
gtag('event', 'readability_feedback', {
  event_category: 'Custom_Sessions',
  rating: 4,  // 1-5
  device_type: 'desktop',  // desktop, mobile, tablet
  fullscreen_mode: true,
  focus_text_length: 85,
  timestamp: Date.now()
});
```

**Privacy:** Only if user consented to analytics.

**A/B Testing (Post-Launch):**
- Variant A: 4rem font size (plan recommendation)
- Variant B: 3.5rem font size (control)
- Variant C: Dynamic scaling based on text length
- Measure: User ratings, bounce rate, session completion rate

### Manual Testing

**Protocol:**
- Set up projector (1920×1080, 100" screen)
- Test readability at 5m, 7m, 10m distances
- Test cases: 50-char, 150-char, 300-char focus text
- Test in fullscreen mode + normal mode
- Test all 4 breakpoints (mobile, tablet, desktop, projector)

**Acceptance Criteria:**
- ✅ 50-char text readable at 10m
- ✅ 150-char text readable at 7m
- ✅ 300-char text readable at 5m (with auto-scaling)

### Success Indicators

✅ **Pass:** ≥90% users rate ≥4/5, all manual tests pass
⚠️ **Warning:** 80-89% rate ≥4/5, some manual tests borderline
❌ **Fail:** <80% rate ≥4/5, manual tests fail

---

## SC-3: Reliability - Error-Free Sessions

### Goal
≥95% of custom sessions complete without errors (crashes, timer drift, phase skips).

### Rationale
- Classroom/seminar use requires 100% reliability (no interruptions)
- 95% allows for edge cases (browser crashes, network issues)
- Higher than typical web app standards (~90%) due to use case criticality

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Session Success Rate** | ≥95% | % of sessions reaching COMPLETED phase |
| **Timer Drift** | <1 second per 30 min | Measure actual vs. expected completion time |
| **Phase Skip Errors** | 0% | No unintended phase transitions |
| **Client-Side Errors** | <0.5% error rate | JavaScript errors per pageview |
| **State Loss on Reload** | <1% | Sessions that lose state after page reload |

### Measurement Method

**Session Lifecycle Tracking:**

```typescript
// Event 1: Session started
gtag('event', 'session_started', {
  event_category: 'Custom_Sessions',
  session_id: 'abc123',  // Unique, non-PII identifier
  element_count: 5,
  total_duration_ms: 1800000,
  timestamp: Date.now()
});

// Event 2: Phase transition (logged for each phase)
gtag('event', 'phase_transition', {
  event_category: 'Custom_Sessions',
  session_id: 'abc123',
  from_phase: 'SPEAK',
  to_phase: 'TRANSITION',
  expected_duration_ms: 60000,
  actual_elapsed_ms: 60150,  // +150ms drift
  timestamp: Date.now()
});

// Event 3: Session completed successfully
gtag('event', 'session_completed', {
  event_category: 'Custom_Sessions',
  session_id: 'abc123',
  total_duration_ms: 1800000,
  actual_duration_ms: 1800450,  // +450ms drift
  phases_completed: 5,
  timestamp: Date.now()
});

// Event 4: Session error
gtag('event', 'session_error', {
  event_category: 'Custom_Sessions',
  session_id: 'abc123',
  error_type: 'timer_drift_exceeded',  // or 'state_loss', 'phase_skip'
  error_message: 'Drift >2s detected',
  timestamp: Date.now()
});
```

**Error Tracking (Sentry or Similar):**

```typescript
// Global error boundary
window.addEventListener('error', (event) => {
  if (event.filename.includes('CouplesTimer') || event.filename.includes('CustomSession')) {
    // Log to error tracking service
    Sentry.captureException(event.error, {
      tags: { feature: 'custom_sessions' },
      extra: { session_id: currentSessionId }
    });
  }
});
```

**Timer Drift Measurement:**

```typescript
// In timer sync callback
const expectedCompletionTime = state.startedAt + state.durationMs;
const actualCompletionTime = Date.now();
const drift = actualCompletionTime - expectedCompletionTime;

if (Math.abs(drift) > 2000) {  // >2s drift
  console.warn('Timer drift exceeded threshold:', drift);
  gtag('event', 'timer_drift', {
    event_category: 'Custom_Sessions',
    drift_ms: drift,
    session_duration_ms: state.durationMs
  });
}
```

**State Persistence Validation:**

```typescript
// On page load
function validateStateIntegrity(state: CustomSessionState): boolean {
  const checks = [
    state.version === 1,
    state.elements.length > 0,
    state.currentElementIndex < state.elements.length,
    state.remainingMs >= 0
  ];

  const isValid = checks.every(check => check);

  if (!isValid) {
    gtag('event', 'state_validation_failed', {
      event_category: 'Custom_Sessions',
      failed_checks: checks.map((c, i) => c ? null : i).filter(Boolean)
    });
  }

  return isValid;
}
```

### Manual Testing

**Protocol:**
- Run 20 test sessions (mix of durations: 10min, 30min, 60min)
- Measure timer drift with stopwatch
- Test page reload mid-session (state should persist)
- Test browser sleep/wake (timer should adjust)
- Test rapid pause/resume/next clicks (no race conditions)

**Acceptance Criteria:**
- ✅ 19/20 sessions complete without errors (95%)
- ✅ Drift <1s per 30min session
- ✅ State persists across reloads
- ✅ No phase skips or timer freezes

### Success Indicators

✅ **Pass:** ≥95% success rate, drift <1s/30min, manual tests pass
⚠️ **Warning:** 90-94% success rate, drift 1-2s/30min
❌ **Fail:** <90% success rate, drift >2s/30min, manual tests fail

---

## SC-4: Adoption - Feature Usage

### Goal
≥50% of **active users** (users who visit stoppclock.com ≥2 times/month) try the Custom Sessions feature within **8 weeks** of launch.

### Rationale
- Existing Couples Timer has low visibility (not on home page)
- Custom Sessions should be more prominent (home page promotion)
- 50% adoption is ambitious but achievable with good onboarding

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Adoption Rate (8 weeks)** | ≥50% | % of active users who created ≥1 custom session |
| **Weekly Active Users (WAU)** | Track baseline → +20% | Users who use Custom Sessions ≥1/week |
| **Retention (4 weeks)** | ≥30% | % of users who return to use Custom Sessions |
| **Feature Discovery** | ≥70% | % of users who view Custom Sessions page |
| **Conversion (View → Create)** | ≥60% | % of viewers who create a session |

### Measurement Method

**User Cohort Tracking:**

```typescript
// Event 1: User visits Custom Sessions page
gtag('event', 'page_view', {
  page_title: 'Custom Sessions Builder',
  page_location: window.location.href,
  user_type: 'returning_user'  // or 'new_user'
});

// Event 2: User creates first custom session
gtag('event', 'feature_adopted', {
  event_category: 'Custom_Sessions',
  event_label: 'first_session_created',
  days_since_feature_launch: 12,
  timestamp: Date.now()
});

// Event 3: User returns to Custom Sessions (retention)
gtag('event', 'feature_retention', {
  event_category: 'Custom_Sessions',
  event_label: 'return_visit',
  days_since_first_use: 7,
  timestamp: Date.now()
});
```

**Cohort Analysis (GA4 Dashboard):**

Create custom segments:
- **Active Users:** ≥2 pageviews in last 30 days
- **Custom Sessions Users:** Created ≥1 custom session
- **Retained Users:** Used Custom Sessions ≥2 times with 7+ days gap

Track weekly:
- Week 1: X% adoption
- Week 2: Y% adoption
- ...
- Week 8: ≥50% adoption (target)

**Privacy:** Aggregate cohort data only, no individual tracking beyond session IDs.

### Success Indicators

✅ **Pass:** ≥50% adoption at week 8, ≥30% retention at week 4
⚠️ **Warning:** 40-49% adoption, 20-29% retention
❌ **Fail:** <40% adoption, <20% retention

### Promotion Strategy (To Ensure SC-4)

1. **Home Page Banner:**
   - "New: Custom Sessions - Build Your Own Timers" (first 4 weeks)
   - Click → Custom Sessions Builder

2. **In-App Onboarding:**
   - First-time visitors see tooltip/tour of Custom Sessions
   - "Try creating your first session" prompt

3. **Couples Timer Upgrade Path:**
   - Show "Upgrade to Custom Sessions" prompt after completing a Couples Timer session
   - "Want more flexibility? Try Custom Sessions"

4. **Email Campaign (if applicable):**
   - Announce Custom Sessions to existing users (opt-in email list)

---

## SC-5: Stability - No Error Rate Increase

### Goal
Overall error rate on stoppclock.com does **not increase** after Custom Sessions launch.
Error rate stays below baseline ± 10%.

### Rationale
- New features can introduce regressions in existing code
- Must ensure Custom Sessions doesn't destabilize the platform
- Constitution requirement: Maintain high reliability

### Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Global Error Rate** | ≤baseline + 10% | JavaScript errors per pageview across all pages |
| **Custom Sessions Error Rate** | <0.5% | Errors specifically in Custom Sessions code |
| **Performance (LCP)** | <2.5s | Largest Contentful Paint (Core Web Vitals) |
| **Lighthouse Score** | ≥90 | Overall performance score (constitution requirement) |
| **Memory Leaks** | 0 detected | Chrome DevTools memory profiling |

### Baseline Measurement

**Pre-Launch (2 weeks before):**
- Run daily: `npm run test:e2e` (all tests must pass)
- Track: GA4 error events (7-day average)
- Track: Lighthouse scores for all timer pages
- Track: Chrome DevTools memory usage over 60min session

**Example Baseline:**
- Error rate: 0.3% (3 errors per 1000 pageviews)
- LCP: 1.8s (median)
- Lighthouse: 94 (median)
- Memory: Stable at ~50MB after 60min

### Post-Launch Monitoring

**Daily (first 2 weeks):**
- Compare error rate: current vs. baseline
- Alert if error rate >baseline + 20% for 2 consecutive days
- Check Lighthouse scores weekly

**Weekly (weeks 3-8):**
- Weekly report: error rate, performance, user feedback
- Adjust if error rate exceeds target

### Measurement Method

**Global Error Tracking:**

```typescript
// Existing error handler (stoppclock.com)
window.addEventListener('error', (event) => {
  gtag('event', 'exception', {
    description: event.message,
    fatal: false,
    source_file: event.filename,
    line_number: event.lineno
  });
});

// Additional tracking for Custom Sessions
if (window.location.hash === '#/custom-sessions') {
  // Custom Sessions-specific error tracking
  gtag('event', 'exception', {
    description: event.message,
    fatal: false,
    feature: 'custom_sessions'
  });
}
```

**Performance Monitoring:**

```typescript
// Core Web Vitals (built into GA4)
import { onLCP, onFID, onCLS } from 'web-vitals';

onLCP((metric) => {
  gtag('event', 'web_vitals', {
    event_category: 'Web Vitals',
    event_label: 'LCP',
    value: Math.round(metric.value),
    page_path: window.location.pathname
  });
});
```

**Lighthouse CI (Automated):**

Add to `.github/workflows/lighthouse.yml`:

```yaml
- name: Run Lighthouse
  run: |
    npm run build
    npm run preview &
    npx @lhci/cli autorun --config=lighthouserc.json
```

Configure `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173/#/custom-sessions"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "performance": ["error", { "minScore": 0.9 }],
        "accessibility": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Success Indicators

✅ **Pass:** Error rate ≤baseline + 10%, LCP <2.5s, Lighthouse ≥90
⚠️ **Warning:** Error rate baseline + 10-20%, LCP 2.5-3.0s, Lighthouse 85-89
❌ **Fail:** Error rate >baseline + 20%, LCP >3.0s, Lighthouse <85

---

## KPI Dashboard (Summary)

### Real-Time Monitoring (GA4 + Sentry)

| KPI | Target | Current | Status | Alert Threshold |
|-----|--------|---------|--------|-----------------|
| **SC-1: Median Creation Time** | <3 min | — | 🟢 | >4 min |
| **SC-2: Readability Rating** | ≥4/5 avg | — | 🟢 | <3.5/5 |
| **SC-3: Success Rate** | ≥95% | — | 🟢 | <90% |
| **SC-4: Adoption Rate (Week 8)** | ≥50% | — | 🟡 | <40% at week 8 |
| **SC-5: Error Rate** | ≤baseline+10% | — | 🟢 | >baseline+20% |

**Update Frequency:**
- SC-1, SC-3, SC-5: Daily (first 2 weeks), then weekly
- SC-2: Weekly (survey responses)
- SC-4: Weekly (cohort analysis)

---

## Privacy & GDPR Compliance

### Data Collection Principles

1. **Consent-Based:**
   - All analytics events require user consent (check `ConsentPreferences`)
   - Show consent banner on first visit (existing stoppclock.com pattern)

2. **No PII:**
   - Session IDs are random UUIDs (not tied to user identity)
   - No names, emails, IP addresses in analytics
   - Focus text content **not logged** (privacy-sensitive)

3. **Data Minimization:**
   - Only log necessary metrics (time, counts, ratings)
   - Aggregate data as soon as possible
   - Delete raw event data after 90 days

4. **User Rights:**
   - Users can opt-out of analytics anytime (settings page)
   - Data deletion on request (GDPR Article 17)

### Implementation

```typescript
// Check consent before firing events
import { hasAnalyticsConsent } from '../utils/consent';

function trackEvent(eventName: string, params: object) {
  if (!hasAnalyticsConsent()) {
    console.log('Analytics not consented, skipping event:', eventName);
    return;
  }
  gtag('event', eventName, params);
}
```

---

## Testing Plan (T4.1, T4.2)

### Unit Tests (T4.1)

- Timer engine accuracy (drift measurement)
- State machine transitions (all phases)
- localStorage persistence (save/load/reload)
- Validation logic (duration 30s-30min)

**Coverage Target:** ≥80% line coverage for Custom Sessions code

### Integration Tests (T4.1)

- End-to-end session flow (create → start → complete)
- Cross-tab sync (open 2 tabs, edit in one)
- Page reload mid-session (state persists)
- Fullscreen mode (enter/exit)

**Coverage:** All user flows from T1.1 (User Journeys)

### Usability Tests (T4.2)

- N=10 users (5 experienced, 5 new)
- Task: Create 4-element session in <3 min
- Measure: Time, errors, satisfaction (1-5)
- Repeat at week 4 post-launch (iteration feedback)

### Performance Tests (T4.3)

- Long sessions (60 min, 20+ elements)
- Measure: Timer drift, UI lag, memory usage
- Acceptance: Drift <1s/30min, UI <200ms, no memory leaks

---

## Rollout Plan (T5.1)

### Staged Rollout

| Stage | Audience | Duration | Criteria to Advance |
|-------|----------|----------|---------------------|
| **1. Internal** | Team only (feature flag) | 1 week | No critical bugs, manual tests pass |
| **2. Beta** | 10% of users (A/B test) | 2 weeks | SC-3 (≥90% success rate), SC-5 (error rate ≤baseline) |
| **3. General Availability** | 100% of users | Ongoing | SC-1, SC-2, SC-4 on track |

**Rollback Plan:**
- If SC-3 <85% or SC-5 error rate >baseline + 30% → immediate rollback
- Feature flag allows disabling Custom Sessions without code deploy

---

## Budget & Resources (Estimate)

### Development Time

| Phase | Estimated Time | Notes |
|-------|----------------|-------|
| Phase 0 (Discovery) | ✅ 3 days | Complete |
| Phase 1 (Product/UX Spec) | 5 days | T1.1-T1.4 |
| Phase 2 (Technical Architecture) | 3 days | T2.1-T2.3 |
| Phase 3 (Implementation) | 10 days | T3.1-T3.5 |
| Phase 4 (Testing) | 5 days | T4.1-T4.3 |
| Phase 5 (Rollout) | 2 days | T5.1-T5.3 |
| **Total** | **28 days** | ~6 weeks (1 developer) |

### Tools & Services

| Tool | Cost | Purpose |
|------|------|---------|
| **Google Analytics 4** | Free | Event tracking, cohort analysis |
| **Sentry** | Free tier | Error tracking (optional, can use console) |
| **Lighthouse CI** | Free | Automated performance testing |
| **Browser Testing** | Free | Chrome DevTools, Firefox DevTools |

**Total Cost:** $0 (all free tools)

---

## Next Steps (Task T1.1)

1. ✅ **Completed:** Product goals & KPIs defined
2. ⏭️ **Next:** Define user journeys and flows (T1.1)
3. ⏭️ **After:** Create user stories with acceptance criteria (T1.2)

---

**End of Document**
