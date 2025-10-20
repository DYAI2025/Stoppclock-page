// Type definitions for monetization features
// Created: 2025-10-20

/**
 * User's consent preferences for ads and analytics
 * Stored in localStorage under key 'sc.consent'
 */
export interface ConsentPreference {
  version: 1;
  adsEnabled: boolean;
  analyticsEnabled: boolean;
  timestamp: number; // Date.now()
  consentVersion: string; // e.g., "2025-10-20"
}

/**
 * Configuration for individual ad placements
 * Not persisted - defined in code
 */
export interface AdUnit {
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

/**
 * User's custom seminar/event branding
 * Stored in localStorage under key 'sc.branding'
 */
export interface CustomBranding {
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

/**
 * Blog post metadata
 * Hardcoded in blog-posts.ts
 */
export interface BlogPost {
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

/**
 * Custom analytics event sent to GA4
 * Not persisted - sent immediately
 */
export interface AnalyticsEvent {
  eventName: string; // e.g., "timer_started", "timer_completed"
  timestamp: number;
  timerType?: string; // e.g., "countdown", "stopwatch"
  timerDuration?: number; // Milliseconds
  customText?: string; // For branding tracking
  pageUrl: string;
  metadata?: Record<string, any>; // Additional custom parameters
}

/**
 * Social share interaction
 * Tracked via GA4 events
 */
export interface SocialShare {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'copy';
  timerType: string; // Which timer was shared
  timestamp: number;
  utmSource: string; // Generated UTM parameter
  url: string; // Shared URL
}

/**
 * i18n translation strings
 */
export interface I18nStrings {
  consent: {
    title: string;
    description: string;
    enableButton: string;
    declineButton: string;
  };
  branding: {
    title: string;
    customTextLabel: string;
    uploadLogoLabel: string;
    clearButton: string;
    enableLabel: string;
  };
  share: {
    title: string;
    copyButton: string;
    copiedMessage: string;
  };
  blog: {
    readMore: string;
    relatedPosts: string;
    backToIndex: string;
  };
}
