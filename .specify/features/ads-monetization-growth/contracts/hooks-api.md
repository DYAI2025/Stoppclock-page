# React Hooks API Contracts

**Feature**: Google Ads Monetization & Traffic Growth
**Date**: 2025-10-20

## Overview

This document defines the public API contracts for custom React hooks used in the monetization feature.

---

## 1. useConsent

**Purpose**: Manage user consent preferences for ads and analytics

**Import**: `import { useConsent } from '../hooks/useConsent';`

**Signature**:
```typescript
function useConsent(): {
  consent: ConsentPreference;
  hasConsent: boolean;
  grantConsent: (ads: boolean, analytics: boolean) => void;
  revokeConsent: () => void;
  updateConsentBanner: (visible: boolean) => void;
  showBanner: boolean;
}
```

**Return Values**:
- `consent`: Current consent state
- `hasConsent`: Boolean, true if user has made a choice (not first visit)
- `grantConsent(ads, analytics)`: Function to grant consent
- `revokeConsent()`: Function to revoke all consent
- `updateConsentBanner(visible)`: Manually show/hide banner
- `showBanner`: Boolean, true if banner should be displayed

**Usage Example**:
```typescript
function App() {
  const { consent, hasConsent, grantConsent, showBanner } = useConsent();

  if (showBanner) {
    return <ConsentBanner onAccept={() => grantConsent(true, true)} />;
  }

  return (
    <div>
      {consent.adsEnabled && <AdSenseScript />}
      {consent.analyticsEnabled && <GA4Script />}
    </div>
  );
}
```

**Side Effects**:
- Reads from localStorage on mount
- Writes to localStorage when consent changes
- Triggers `storage` event for cross-tab synchronization

---

## 2. useBranding

**Purpose**: Manage custom seminar branding (text + logo)

**Import**: `import { useBranding } from '../hooks/useBranding';`

**Signature**:
```typescript
function useBranding(): {
  branding: CustomBranding;
  isEnabled: boolean;
  updateText: (text: string | null) => void;
  uploadLogo: (file: File) => Promise<void>;
  clearLogo: () => void;
  toggleEnabled: () => void;
  setTimerTypes: (types: string[]) => void;
  quotaUsed: number; // Bytes
  quotaPercent: number; // 0-100
}
```

**Return Values**:
- `branding`: Current branding state
- `isEnabled`: Boolean shorthand for `branding.enabled`
- `updateText(text)`: Update custom text
- `uploadLogo(file)`: Async function to upload and encode logo
- `clearLogo()`: Remove logo
- `toggleEnabled()`: Enable/disable branding display
- `setTimerTypes(types)`: Set which timers show branding
- `quotaUsed`: Bytes used by branding in localStorage
- `quotaPercent`: Percentage of estimated quota used

**Usage Example**:
```typescript
function BrandingSettings() {
  const { branding, uploadLogo, quotaPercent } = useBranding();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadLogo(file);
        alert('Logo uploaded successfully!');
      } catch (error) {
        alert(`Upload failed: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/png,image/jpeg" onChange={handleFileChange} />
      <p>Quota used: {quotaPercent}%</p>
    </div>
  );
}
```

**Errors Thrown**:
- `Error('File too large')`: If file >500KB
- `Error('Invalid file type')`: If not PNG/JPEG
- `Error('Storage quota exceeded')`: If localStorage full

---

## 3. useAnalytics

**Purpose**: Send custom events to Google Analytics 4

**Import**: `import { useAnalytics } from '../hooks/useAnalytics';`

**Signature**:
```typescript
function useAnalytics(): {
  trackEvent: (event: AnalyticsEvent) => void;
  trackTimerStart: (timerType: string, durationMs: number) => void;
  trackTimerComplete: (timerType: string, durationMs: number) => void;
  trackTimerStop: (timerType: string, remainingMs: number, totalMs: number) => void;
  trackPageView: (page: string) => void;
  isEnabled: boolean;
}
```

**Return Values**:
- `trackEvent(event)`: Low-level function to send custom event
- `trackTimerStart/Complete/Stop`: High-level helpers for timer events
- `trackPageView(page)`: Track page navigation
- `isEnabled`: Boolean, true if analytics consent given

**Usage Example**:
```typescript
function Countdown() {
  const { trackTimerStart, trackTimerComplete } = useAnalytics();

  const start = () => {
    setRunning(true);
    trackTimerStart('countdown', durationMs);
  };

  useEffect(() => {
    if (running && remainingMs <= 0) {
      trackTimerComplete('countdown', durationMs);
    }
  }, [running, remainingMs]);
}
```

**Behavior**:
- Automatically checks consent before sending events
- No-op if consent not granted (silent failure)
- Events queued if GA4 script not yet loaded

---

## 4. useAdVisibility

**Purpose**: Control when ads should be visible based on timer state

**Import**: `import { useAdVisibility } from '../hooks/useAdVisibility';`

**Signature**:
```typescript
function useAdVisibility(options: {
  timerRunning: boolean;
  isFullscreen: boolean;
  placement: 'home' | 'setup' | 'interstitial' | 'anchor';
}): {
  shouldShowAd: boolean;
  adUnitConfig: AdUnit | null;
}
```

**Parameters**:
- `timerRunning`: Is the timer currently running?
- `isFullscreen`: Is the page in fullscreen mode?
- `placement`: Which ad placement to check

**Return Values**:
- `shouldShowAd`: Boolean, true if ad should be displayed
- `adUnitConfig`: AdUnit configuration or null if shouldn't show

**Usage Example**:
```typescript
function CountdownPage() {
  const [running, setRunning] = useState(false);
  const isFullscreen = useFullscreen();
  const { shouldShowAd, adUnitConfig } = useAdVisibility({
    timerRunning: running,
    isFullscreen,
    placement: 'setup'
  });

  return (
    <div>
      <TimerDisplay />
      {shouldShowAd && <AdUnit config={adUnitConfig} />}
    </div>
  );
}
```

**Logic**:
```
shouldShowAd =
  consent.adsEnabled AND
  NOT (timerRunning AND placement != 'interstitial') AND
  NOT (isFullscreen) AND
  adUnitConfig.visibilityRules matches current state
```

---

## 5. useBlogPosts

**Purpose**: Load and filter blog posts

**Import**: `import { useBlogPosts } from '../hooks/useBlogPosts';`

**Signature**:
```typescript
function useBlogPosts(language?: 'en' | 'de'): {
  posts: BlogPost[];
  loading: boolean;
  error: Error | null;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  getRelatedPosts: (post: BlogPost, limit: number) => BlogPost[];
}
```

**Parameters**:
- `language`: Optional filter by language (default: all languages)

**Return Values**:
- `posts`: Array of blog posts, sorted by publish date (newest first)
- `loading`: Boolean, true while loading
- `error`: Error object if loading failed
- `getPostBySlug(slug)`: Find post by slug
- `getRelatedPosts(post, limit)`: Get related posts by tags

**Usage Example**:
```typescript
function BlogIndex() {
  const { posts, loading } = useBlogPosts('en');

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {posts.map(post => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

function BlogPost({ slug }: { slug: string }) {
  const { getPostBySlug, getRelatedPosts } = useBlogPosts();
  const post = getPostBySlug(slug);
  const related = getRelatedPosts(post, 3);

  return (
    <article>
      <h1>{post.title}</h1>
      <MarkdownRenderer content={post.content} />
      <h2>Related Posts</h2>
      {related.map(r => <BlogCard key={r.slug} post={r} />)}
    </article>
  );
}
```

---

## 6. useShareUrl

**Purpose**: Generate shareable URLs with UTM tracking

**Import**: `import { useShareUrl } from '../hooks/useShareUrl';`

**Signature**:
```typescript
function useShareUrl(timerType?: string): {
  getShareUrl: (platform: 'twitter' | 'facebook' | 'linkedin') => string;
  copyShareUrl: (platform: string) => Promise<void>;
  shareText: string;
}
```

**Parameters**:
- `timerType`: Optional timer type (e.g., 'countdown'), defaults to current page

**Return Values**:
- `getShareUrl(platform)`: Generate URL with UTM parameters
- `copyShareUrl(platform)`: Copy URL to clipboard and track event
- `shareText`: Pre-written share message

**Usage Example**:
```typescript
function ShareButton() {
  const { getShareUrl, copyShareUrl, shareText } = useShareUrl('countdown');

  return (
    <div>
      <button onClick={() => copyShareUrl('copy')}>Copy Link</button>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl('twitter'))}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
      >
        Share on Twitter
      </a>
    </div>
  );
}
```

**UTM Parameters Generated**:
```
?utm_source=twitter
&utm_medium=social
&utm_campaign=timer_share
&utm_content=countdown
```

---

## Hook Dependencies

```
useConsent
  └─> localStorage
  └─> storage event (cross-tab sync)

useBranding
  └─> localStorage
  └─> File API (for upload)

useAnalytics
  └─> useConsent (checks if enabled)
  └─> window.gtag (GA4 global function)

useAdVisibility
  └─> useConsent (checks if ads enabled)
  └─> AD_UNITS config

useBlogPosts
  └─> BLOG_POSTS data
  └─> fetch (for markdown content)

useShareUrl
  └─> useAnalytics (tracks share events)
  └─> Clipboard API
```

---

## Testing Strategy

Each hook should have unit tests covering:
1. **Initial state**: Default values on first render
2. **State updates**: Correct state changes after actions
3. **localStorage**: Persistence and retrieval
4. **Error handling**: Graceful failures
5. **Consent gating**: Features disabled without consent

**Example Test (Jest + Testing Library)**:
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useConsent } from './useConsent';

test('useConsent grants and persists consent', () => {
  const { result } = renderHook(() => useConsent());

  // Initial state
  expect(result.current.hasConsent).toBe(false);

  // Grant consent
  act(() => {
    result.current.grantConsent(true, true);
  });

  expect(result.current.consent.adsEnabled).toBe(true);
  expect(result.current.consent.analyticsEnabled).toBe(true);
  expect(localStorage.getItem('sc.consent')).toBeTruthy();
});
```
