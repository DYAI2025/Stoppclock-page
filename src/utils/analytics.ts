// Google Analytics 4 utilities
// Handles GA4 event tracking with consent gating

import type { AnalyticsEvent } from '../types/monetization-types';
import { loadConsent } from './consent';

/**
 * Check if gtag is available
 */
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
}

/**
 * Check if analytics consent is given
 */
export function hasAnalyticsConsent(): boolean {
  const consent = loadConsent();
  return consent.analyticsEnabled;
}

/**
 * Send event to GA4
 * Automatically checks consent before sending
 */
export function trackEvent(event: AnalyticsEvent): void {
  // Check consent first
  if (!hasAnalyticsConsent()) {
    return; // Silent failure - no consent
  }

  // Check if gtag is loaded
  if (!isGtagAvailable()) {
    console.warn('[Analytics] gtag not loaded, queueing event');
    queueEvent(event);
    return;
  }

  try {
    const gtag = (window as any).gtag;

    // Send event
    gtag('event', event.eventName, {
      timer_type: event.timerType,
      timer_duration: event.timerDuration,
      custom_text: event.customText,
      page_url: event.pageUrl,
      timestamp: event.timestamp,
      ...event.metadata
    });
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
}

/**
 * Queue event for later sending (if gtag not yet loaded)
 */
const eventQueue: AnalyticsEvent[] = [];

function queueEvent(event: AnalyticsEvent): void {
  eventQueue.push(event);

  // Limit queue size to prevent memory issues
  if (eventQueue.length > 50) {
    eventQueue.shift(); // Remove oldest event
  }
}

/**
 * Flush queued events
 * Called when gtag becomes available
 */
export function flushEventQueue(): void {
  if (!isGtagAvailable()) return;

  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    if (event) {
      trackEvent(event);
    }
  }
}

/**
 * Track timer started
 */
export function trackTimerStart(timerType: string, durationMs: number): void {
  trackEvent({
    eventName: 'timer_started',
    timestamp: Date.now(),
    timerType,
    timerDuration: durationMs,
    pageUrl: window.location.href
  });
}

/**
 * Track timer completed (ran to 0)
 */
export function trackTimerComplete(timerType: string, durationMs: number): void {
  trackEvent({
    eventName: 'timer_completed',
    timestamp: Date.now(),
    timerType,
    timerDuration: durationMs,
    pageUrl: window.location.href,
    metadata: {
      completion_rate: 1.0
    }
  });
}

/**
 * Track timer stopped (paused/stopped early)
 */
export function trackTimerStop(
  timerType: string,
  remainingMs: number,
  totalMs: number
): void {
  const completionRate = totalMs > 0 ? (totalMs - remainingMs) / totalMs : 0;

  trackEvent({
    eventName: 'timer_stopped',
    timestamp: Date.now(),
    timerType,
    timerDuration: totalMs,
    pageUrl: window.location.href,
    metadata: {
      remaining_ms: remainingMs,
      completion_rate: Math.round(completionRate * 100) / 100
    }
  });
}

/**
 * Track page view
 */
export function trackPageView(page: string): void {
  if (!hasAnalyticsConsent()) return;
  if (!isGtagAvailable()) return;

  try {
    const gtag = (window as any).gtag;
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: page
    });
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
}

/**
 * Track consent given
 */
export function trackConsentGiven(ads: boolean, analytics: boolean): void {
  // Don't check consent for this event (it's the consent event itself)
  if (!isGtagAvailable()) return;

  try {
    const gtag = (window as any).gtag;
    gtag('event', 'consent_given', {
      ads_enabled: ads,
      analytics_enabled: analytics
    });
  } catch (error) {
    console.error('[Analytics] Failed to track consent:', error);
  }
}

/**
 * Track consent revoked
 */
export function trackConsentRevoked(): void {
  if (!isGtagAvailable()) return;

  try {
    const gtag = (window as any).gtag;
    gtag('event', 'consent_revoked');
  } catch (error) {
    console.error('[Analytics] Failed to track consent revocation:', error);
  }
}

/**
 * Track custom branding enabled
 */
export function trackBrandingEnabled(hasText: boolean, hasLogo: boolean): void {
  trackEvent({
    eventName: 'branding_enabled',
    timestamp: Date.now(),
    pageUrl: window.location.href,
    metadata: {
      has_text: hasText,
      has_logo: hasLogo
    }
  });
}

/**
 * Track social share
 */
export function trackShare(platform: string, timerType: string, url: string): void {
  trackEvent({
    eventName: 'share',
    timestamp: Date.now(),
    timerType,
    pageUrl: window.location.href,
    metadata: {
      platform,
      shared_url: url
    }
  });
}

/**
 * Track blog post view
 */
export function trackBlogPostView(slug: string, language: string, readingTime: number): void {
  trackEvent({
    eventName: 'blog_post_view',
    timestamp: Date.now(),
    pageUrl: window.location.href,
    metadata: {
      post_slug: slug,
      language,
      reading_time: readingTime
    }
  });
}

/**
 * Initialize GA4 with consent mode
 */
export function initializeGA4(measurementId: string): void {
  if (!isGtagAvailable()) {
    console.warn('[Analytics] gtag not available, cannot initialize');
    return;
  }

  const gtag = (window as any).gtag;

  // Set default consent (denied)
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  // Initialize GA4
  gtag('config', measurementId, {
    send_page_view: false // We'll manually track page views
  });

  // Update consent if already given
  const consent = loadConsent();
  if (consent.analyticsEnabled) {
    updateGA4Consent(true);
  }

  // Flush any queued events
  flushEventQueue();
}

/**
 * Update GA4 consent mode
 */
export function updateGA4Consent(granted: boolean): void {
  if (!isGtagAvailable()) return;

  const gtag = (window as any).gtag;

  gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied'
  });
}
