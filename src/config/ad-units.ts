/**
 * Google AdSense Ad Unit Configuration
 *
 * HOW TO CONFIGURE:
 * 1. Go to Google AdSense Dashboard (https://www.google.com/adsense)
 * 2. Navigate to: Ads > By ad unit > Display ads
 * 3. Create a new ad unit for each placement below
 * 4. Copy the Slot ID (10-digit number) and replace the placeholder
 *
 * SLOT NAMING CONVENTION in AdSense:
 * - stoppclock_home_top
 * - stoppclock_home_middle
 * - stoppclock_setup_sidebar
 * - stoppclock_timer_complete
 * - stoppclock_anchor_bottom
 */

import type { AdUnit } from '../types/monetization-types';

// =============================================================================
// ADSENSE CONFIGURATION - EDIT THESE VALUES
// =============================================================================

/**
 * Google AdSense Publisher ID
 * Found in AdSense: Account > Account information > Publisher ID
 */
export const ADSENSE_PUBLISHER_ID = 'ca-pub-1712273263687132';

/**
 * Ad Slot IDs - Replace with your actual AdSense slot IDs
 *
 * To get a slot ID:
 * 1. Create an ad unit in AdSense dashboard
 * 2. Get the code, look for: data-ad-slot="XXXXXXXXXX"
 * 3. Copy that 10-digit number here
 */
const AD_SLOT_IDS = {
  // ✅ CONFIGURED - Banner01 responsive ad
  HOME_TOP: '2954253435',

  // ⚠️ PLACEHOLDER - Create these in AdSense dashboard:
  HOME_MIDDLE: '', // Create: Display ad, responsive, name: "stoppclock_home_middle"
  SETUP_SIDEBAR: '', // Create: Display ad, responsive, name: "stoppclock_setup"
  TIMER_COMPLETE: '', // Create: Display ad, responsive, name: "stoppclock_complete"
  ANCHOR_BOTTOM: '', // Create: Anchor ad (auto ads), or Display ad for manual
} as const;

/**
 * Export individual slot IDs for direct usage
 * (Used by ResponsiveAd component)
 */
export const HOME_TOP_SLOT_ID = AD_SLOT_IDS.HOME_TOP;

// =============================================================================
// AD UNIT DEFINITIONS - DO NOT EDIT BELOW UNLESS ADDING NEW PLACEMENTS
// =============================================================================

export const AD_UNITS: AdUnit[] = [
  // Home page - top responsive ad (between hero and timer grid)
  {
    unitId: 'home-top',
    adSlotId: AD_SLOT_IDS.HOME_TOP,
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Home page - middle responsive ad (after timer grid)
  {
    unitId: 'home-middle',
    adSlotId: AD_SLOT_IDS.HOME_MIDDLE,
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Timer setup screens - sidebar/bottom ad
  {
    unitId: 'setup-main',
    adSlotId: AD_SLOT_IDS.SETUP_SIDEBAR,
    placement: 'setup',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: false, // Hide when timer is active
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Timer completion - shown after timer finishes
  {
    unitId: 'interstitial-complete',
    adSlotId: AD_SLOT_IDS.TIMER_COMPLETE,
    placement: 'interstitial',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: false,
      showInFullscreen: false,
      showOnMobile: true
    }
  },

  // Anchor ad - bottom sticky (non-intrusive)
  {
    unitId: 'anchor-bottom',
    adSlotId: AD_SLOT_IDS.ANCHOR_BOTTOM,
    placement: 'anchor',
    format: 'anchor',
    visibilityRules: {
      showWhenRunning: false, // Never show during active timer
      showInFullscreen: false, // Never show in fullscreen
      showOnMobile: true
    }
  }
];

/**
 * Check if an ad slot is properly configured (has a real ID)
 */
export function isSlotConfigured(slotId: string): boolean {
  return slotId !== '' && slotId.length >= 10 && /^\d+$/.test(slotId);
}

/**
 * Get only configured ad units (skip placeholders)
 */
export function getConfiguredAdUnits(): AdUnit[] {
  return AD_UNITS.filter(unit => isSlotConfigured(unit.adSlotId));
}

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
