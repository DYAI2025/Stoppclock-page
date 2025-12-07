// Consent management utilities
// Handles GDPR-compliant user consent for ads and analytics

import type { ConsentPreference } from '../types/monetization-types';

const LS_KEY = 'sc.consent';
const CONSENT_VERSION = '2025-10-20';

/**
 * Get default consent state (no consent given)
 */
export function getDefaultConsent(): ConsentPreference {
  return {
    version: 1,
    adsEnabled: false,
    analyticsEnabled: false,
    timestamp: 0,
    consentVersion: CONSENT_VERSION
  };
}

/**
 * Load consent from localStorage
 * Returns default if not found or invalid
 */
export function loadConsent(): ConsentPreference {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const legacy = localStorage.getItem('sc.adsConsent');
      if (legacy === 'yes' || legacy === 'no') {
        return {
          version: 1,
          adsEnabled: legacy === 'yes',
          analyticsEnabled: false,
          timestamp: Date.now(),
          consentVersion: CONSENT_VERSION
        };
      }
      return getDefaultConsent();
    }

    const stored = JSON.parse(raw);

    // Validate structure
    if (typeof stored !== 'object' || stored === null) {
      return getDefaultConsent();
    }

    // Migrate if needed (future-proofing)
    return migrateConsent(stored);
  } catch (error) {
    console.warn('[Consent] Failed to load consent:', error);
    return getDefaultConsent();
  }
}

/**
 * Save consent to localStorage
 */
export function saveConsent(consent: ConsentPreference): void {
  try {
    const toSave: ConsentPreference = {
      ...consent,
      timestamp: Date.now(),
      consentVersion: CONSENT_VERSION
    };
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('[Consent] Failed to save consent:', error);
  }
}

/**
 * Check if user has made a consent choice
 */
export function hasConsent(): boolean {
  const consent = loadConsent();
  return consent.timestamp > 0;
}

/**
 * Grant consent for ads and/or analytics
 */
export function grantConsent(ads: boolean, analytics: boolean): ConsentPreference {
  const consent: ConsentPreference = {
    version: 1,
    adsEnabled: ads,
    analyticsEnabled: analytics,
    timestamp: Date.now(),
    consentVersion: CONSENT_VERSION
  };
  saveConsent(consent);
  return consent;
}

/**
 * Revoke all consent
 */
export function revokeConsent(): ConsentPreference {
  const consent = getDefaultConsent();
  saveConsent(consent);

  // Clear any tracking cookies or data
  clearTrackingData();

  return consent;
}

/**
 * Migrate consent from older versions
 * Future-proofing for schema changes
 */
function migrateConsent(stored: any): ConsentPreference {
  // Current version - no migration needed
  if (stored.version === 1) {
    return {
      version: 1,
      adsEnabled: Boolean(stored.adsEnabled),
      analyticsEnabled: Boolean(stored.analyticsEnabled),
      timestamp: Number(stored.timestamp) || 0,
      consentVersion: stored.consentVersion || CONSENT_VERSION
    };
  }

  // Legacy format (from old adsConsent system)
  if (stored.adsConsent === 'yes') {
    return {
      version: 1,
      adsEnabled: true,
      analyticsEnabled: false, // Analytics is new
      timestamp: Date.now(),
      consentVersion: CONSENT_VERSION
    };
  }

  // Unknown format
  return getDefaultConsent();
}

/**
 * Clear tracking-related data
 * Called when user revokes consent
 */
function clearTrackingData(): void {
  try {
    // Remove old AdSense consent key if it exists
    localStorage.removeItem('sc.adsConsent');

    // Note: We can't delete GA4 cookies directly due to domain restrictions
    // GA4 will respect consent mode and stop tracking
  } catch (error) {
    console.warn('[Consent] Failed to clear tracking data:', error);
  }
}

/**
 * Update consent for specific feature
 */
export function updateConsentFeature(
  feature: 'ads' | 'analytics',
  enabled: boolean
): ConsentPreference {
  const current = loadConsent();
  const updated: ConsentPreference = {
    ...current,
    [feature === 'ads' ? 'adsEnabled' : 'analyticsEnabled']: enabled,
    timestamp: Date.now()
  };
  saveConsent(updated);
  return updated;
}
