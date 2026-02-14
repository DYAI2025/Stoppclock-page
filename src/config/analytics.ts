// Google Analytics 4 Configuration
// Replace with your actual GA4 Measurement ID from Google Analytics dashboard

/**
 * GA4 Measurement ID
 * Get this from: Google Analytics > Admin > Data Streams > Your Stream > Measurement ID
 * Format: G-XXXXXXXXXX
 *
 * Set to empty string or null to disable GA4
 */
export const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual ID

/**
 * Check if GA4 is configured
 */
export function isGA4Configured(): boolean {
  return GA4_MEASUREMENT_ID !== '' &&
         GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' &&
         GA4_MEASUREMENT_ID !== null;
}

/**
 * Event names for consistent tracking
 */
export const GA4_EVENTS = {
  // Timer events
  TIMER_STARTED: 'timer_started',
  TIMER_COMPLETED: 'timer_completed',
  TIMER_STOPPED: 'timer_stopped',
  TIMER_RESET: 'timer_reset',

  // User engagement
  PAGE_VIEW: 'page_view',
  CONSENT_GIVEN: 'consent_given',
  CONSENT_REVOKED: 'consent_revoked',

  // Feature usage
  FULLSCREEN_ENTERED: 'fullscreen_entered',
  PRESET_SELECTED: 'preset_selected',
  LAP_RECORDED: 'lap_recorded',

  // Content engagement
  BLOG_POST_VIEW: 'blog_post_view',
  SHARE_CLICKED: 'share_clicked',

  // PWA events
  PWA_INSTALLED: 'pwa_installed',
  OFFLINE_USED: 'offline_used',
} as const;

/**
 * Custom dimensions for richer analytics
 */
export const GA4_DIMENSIONS = {
  TIMER_TYPE: 'timer_type',
  DURATION_CATEGORY: 'duration_category', // short (<5min), medium (5-30min), long (>30min)
  DEVICE_TYPE: 'device_type',
  IS_FULLSCREEN: 'is_fullscreen',
  IS_PWA: 'is_pwa',
} as const;
