// Google AdSense ad unit configurations
// Defines all ad placements and their visibility rules

import type { AdUnit } from '../types/monetization-types';

// Google AdSense Publisher ID
export const ADSENSE_PUBLISHER_ID = 'ca-pub-1712273263687132';

// Ad unit configurations
// Note: Ad slot IDs are placeholders - replace with actual IDs from AdSense dashboard
export const AD_UNITS: AdUnit[] = [
  // Home page - top responsive ad between timer cards
  {
    unitId: 'home-top',
    adSlotId: `${ADSENSE_PUBLISHER_ID}/2954253435`, // Banner01 - Automatic responsive ad
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true, // Home page doesn't have running timers
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Home page - middle responsive ad
  {
    unitId: 'home-middle',
    adSlotId: `${ADSENSE_PUBLISHER_ID}/2345678901`,
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Setup screens - sidebar/bottom responsive ad
  {
    unitId: 'setup-main',
    adSlotId: `${ADSENSE_PUBLISHER_ID}/3456789012`,
    placement: 'setup',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: false, // Hide when timer starts
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Timer completion interstitial
  {
    unitId: 'interstitial-complete',
    adSlotId: `${ADSENSE_PUBLISHER_ID}/4567890123`,
    placement: 'interstitial',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: false, // Only show when timer completes
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Anchor ad - bottom sticky
  {
    unitId: 'anchor-bottom',
    adSlotId: `${ADSENSE_PUBLISHER_ID}/5678901234`,
    placement: 'anchor',
    format: 'anchor',
    visibilityRules: {
      showWhenRunning: false, // Hide when timer running
      showInFullscreen: false, // Hide in fullscreen
      showOnMobile: true
    }
  }
];

/**
 * Get ad unit by ID
 */
export function getAdUnit(unitId: string): AdUnit | undefined {
  return AD_UNITS.find(unit => unit.unitId === unitId);
}

/**
 * Get ad units by placement
 */
export function getAdUnitsByPlacement(placement: AdUnit['placement']): AdUnit[] {
  return AD_UNITS.filter(unit => unit.placement === placement);
}

/**
 * Check if ad should be visible based on current state
 */
export function shouldShowAd(
  adUnit: AdUnit,
  state: {
    timerRunning: boolean;
    isFullscreen: boolean;
    isMobile: boolean;
    hasConsent: boolean;
  }
): boolean {
  // No consent = no ads
  if (!state.hasConsent) return false;

  // Check fullscreen
  if (state.isFullscreen && !adUnit.visibilityRules.showInFullscreen) {
    return false;
  }

  // Check timer running
  if (state.timerRunning && !adUnit.visibilityRules.showWhenRunning) {
    return false;
  }

  // Check mobile
  if (state.isMobile && !adUnit.visibilityRules.showOnMobile) {
    return false;
  }

  return true;
}
