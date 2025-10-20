# Data Model

**Feature**: Google Ads Monetization & Traffic Growth
**Date**: 2025-10-20

## Entity Definitions

### 1. ConsentPreference

**Purpose**: Store user's privacy consent choices

**Storage**: localStorage key `sc.consent`

**TypeScript Interface**:
```typescript
interface ConsentPreference {
  version: 1;
  adsEnabled: boolean;
  analyticsEnabled: boolean;
  timestamp: number; // Date.now()
  consentVersion: string; // e.g., "2025-10-20"
}
```

**Default State**:
```typescript
{
  version: 1,
  adsEnabled: false,
  analyticsEnabled: false,
  timestamp: 0,
  consentVersion: "2025-10-20"
}
```

**Operations**:
- `loadConsent()`: Read from localStorage, return default if not found
- `saveConsent(consent)`: Write to localStorage
- `hasConsent()`: Boolean check if user has made choice
- `revokeConsent()`: Reset to default, remove GA/AdSense scripts

---

### 2. AdUnit

**Purpose**: Configuration for individual ad placements

**Storage**: Code-defined constants (not persisted)

**TypeScript Interface**:
```typescript
interface AdUnit {
  unitId: string; // e.g., "home-top", "setup-sidebar"
  adSlotId: string; // Google AdSense slot ID (ca-pub-XXXX/XXXXXX)
  placement: 'home' | 'setup' | 'interstitial' | 'anchor';
  format: 'responsive' | 'banner' | 'anchor';
  visibilityRules: {
    showWhenRunning?: boolean; // Default: false
    showInFullscreen?: boolean; // Default: false
    showOnMobile?: boolean; // Default: true
  };
}
```

**Example Ad Units**:
```typescript
const AD_UNITS: AdUnit[] = [
  {
    unitId: 'home-top',
    adSlotId: 'ca-pub-1712273263687132/123456', // Placeholder
    placement: 'home',
    format: 'responsive',
    visibilityRules: { showOnMobile: true }
  },
  {
    unitId: 'setup-sidebar',
    adSlotId: 'ca-pub-1712273263687132/234567',
    placement: 'setup',
    format: 'responsive',
    visibilityRules: { showWhenRunning: false }
  },
  {
    unitId: 'anchor-bottom',
    adSlotId: 'ca-pub-1712273263687132/345678',
    placement: 'anchor',
    format: 'anchor',
    visibilityRules: { showWhenRunning: false, showInFullscreen: false }
  }
];
```

---

### 3. CustomBranding

**Purpose**: User's custom seminar/event branding

**Storage**: localStorage key `sc.branding`

**TypeScript Interface**:
```typescript
interface CustomBranding {
  version: 1;
  enabled: boolean;
  customText: string | null; // e.g., "Math 101 Exam"
  logoImage: string | null; // Base64-encoded data URL
  logoImageSize: number | null; // Bytes (for quota tracking)
  timerTypes: string[]; // e.g., ["countdown", "analog", "stopwatch"]
  position: 'top' | 'bottom' | 'corner'; // Where to display
  createdAt: number;
  updatedAt: number;
}
```

**Default State**:
```typescript
{
  version: 1,
  enabled: false,
  customText: null,
  logoImage: null,
  logoImageSize: null,
  timerTypes: [], // Empty = show on all timers
  position: 'top',
  createdAt: Date.now(),
  updatedAt: Date.now()
}
```

**Constraints**:
- `logoImageSize` max: 665600 bytes (~500KB original → 665KB base64)
- `customText` max length: 100 characters
- `logoImage` must be data URL: `data:image/png;base64,...` or `data:image/jpeg;base64,...`

**Operations**:
- `loadBranding()`: Read from localStorage
- `saveBranding(branding)`: Write to localStorage
- `uploadLogo(file)`: Convert File → base64, validate size, save
- `clearBranding()`: Reset to default

---

### 4. BlogPost

**Purpose**: Metadata for blog articles

**Storage**: Hardcoded in code or JSON file (not user-editable)

**TypeScript Interface**:
```typescript
interface BlogPost {
  slug: string; // URL-friendly: "90-minute-exam-timer"
  language: 'en' | 'de';
  title: string;
  description: string; // Meta description for SEO
  author: string;
  publishDate: string; // ISO 8601: "2025-10-20"
  tags: string[]; // e.g., ["classroom", "exam", "countdown"]
  targetKeywords: string[]; // SEO keywords
  content: string; // Markdown file path or inline content
  ogImage: string; // Open Graph image URL
  translationOf?: string; // Slug of translation pair
  readingTime: number; // Estimated minutes
}
```

**Example**:
```typescript
{
  slug: "90-minute-exam-timer",
  language: "en",
  title: "How to Run a Perfect 90-Minute Exam with a Countdown Timer",
  description: "Step-by-step guide for teachers to manage exam timing effectively.",
  author: "Stoppclock Team",
  publishDate: "2025-10-20",
  tags: ["classroom", "exam", "countdown", "teaching"],
  targetKeywords: ["90 minute timer", "exam countdown", "classroom timer"],
  content: "/blog/posts/en/90-minute-exam-timer.md",
  ogImage: "/blog/images/exam-timer-og.jpg",
  translationOf: "90-minuten-prufungstimer",
  readingTime: 5
}
```

---

### 5. AnalyticsEvent

**Purpose**: Custom events sent to Google Analytics 4

**Storage**: Not persisted (sent to GA4 immediately)

**TypeScript Interface**:
```typescript
interface AnalyticsEvent {
  eventName: string; // e.g., "timer_started", "timer_completed"
  timestamp: number;
  timerType?: string; // e.g., "countdown", "stopwatch"
  timerDuration?: number; // Milliseconds
  customText?: string; // For branding tracking
  pageUrl: string;
  sessionId?: string; // GA4 handles this automatically
  metadata?: Record<string, any>; // Additional custom parameters
}
```

**Predefined Events**:
```typescript
// User starts a timer
{
  eventName: 'timer_started',
  timerType: 'countdown',
  timerDuration: 5400000, // 90 minutes in ms
  pageUrl: '#/countdown'
}

// User completes a timer (runs to 0)
{
  eventName: 'timer_completed',
  timerType: 'countdown',
  timerDuration: 5400000,
  metadata: { completionRate: 1.0 }
}

// User pauses/stops timer early
{
  eventName: 'timer_stopped',
  timerType: 'countdown',
  metadata: { remainingMs: 1200000, completionRate: 0.78 }
}

// User gives consent
{
  eventName: 'consent_given',
  metadata: { adsEnabled: true, analyticsEnabled: true }
}

// User revokes consent
{
  eventName: 'consent_revoked'
}

// User enables custom branding
{
  eventName: 'branding_enabled',
  customText: 'Math 101',
  metadata: { hasLogo: true }
}
```

---

### 6. SocialShare

**Purpose**: Track social sharing interactions

**Storage**: Not persisted (sent to GA4 as events)

**TypeScript Interface**:
```typescript
interface SocialShare {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'copy';
  timerType: string; // Which timer was shared
  timestamp: number;
  utmSource: string; // Generated UTM parameter
  url: string; // Shared URL
}
```

**UTM Parameter Generation**:
```typescript
function generateShareUrl(timerType: string, platform: string): string {
  const base = `https://www.stoppclock.com/#/${timerType}`;
  const params = new URLSearchParams({
    utm_source: platform,
    utm_medium: 'social',
    utm_campaign: 'timer_share',
    utm_content: timerType
  });
  return `${base}?${params.toString()}`;
}
```

---

## Relationships

```
ConsentPreference (1) ──> (N) AnalyticsEvent
                     └──> (N) AdUnit visibility

CustomBranding (1) ──> (N) Timer Pages

BlogPost (EN) <──> (DE) BlogPost (translation pair)

SocialShare ──> BlogPost or Timer Page
```

---

## Storage Budget

**localStorage Limits**: ~5-10MB per domain (varies by browser)

**Current Usage**:
- Timers: ~1KB per timer × 9 timers = ~9KB
- Theme: ~100 bytes
- Consent: ~200 bytes
- **Custom Branding**: Up to 665KB (largest contributor)

**Total Estimated**: ~675KB (well within limits)

**Quota Monitoring**:
```typescript
function estimateLocalStorageUsage(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total * 2; // UTF-16 = 2 bytes per char
}
```

---

## Migration Strategy

**Version Field**: All entities have `version: 1` field for future schema changes

**Migration Example**:
```typescript
function migrateConsent(stored: any): ConsentPreference {
  if (stored.version === 1) return stored;

  // Future migration from v1 to v2
  if (!stored.version) {
    return {
      version: 1,
      adsEnabled: stored.adsConsent === 'yes',
      analyticsEnabled: false, // New field
      timestamp: Date.now(),
      consentVersion: "2025-10-20"
    };
  }

  return getDefaultConsent();
}
```

---

## File Locations

**Type Definitions**: `/src/types/monetization-types.ts`
**Consent Logic**: `/src/utils/consent.ts`
**Branding Logic**: `/src/utils/branding.ts`
**Analytics**: `/src/utils/analytics.ts`
**Blog Data**: `/src/data/blog-posts.ts`
**Ad Units Config**: `/src/config/ad-units.ts`
