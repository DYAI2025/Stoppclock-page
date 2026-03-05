/**
 * Google AdSense Ad Unit Configuration — Single Source of Truth
 *
 * ============================================================
 * HOW TO ADD A NEW AD SLOT:
 * 1. Go to: https://www.google.com/adsense → Ads > By ad unit > Display ads
 * 2. Create ad unit with naming convention: stoppclock_<placement>_<position>
 * 3. Copy the 10-digit Slot ID
 * 4. Add to AD_SLOT_IDS below and create an entry in AD_UNITS
 * ============================================================
 *
 * NAMING CONVENTION for AdSense Dashboard:
 *   stoppclock_home_top          → HOME_TOP
 *   stoppclock_blog_incontent    → BLOG_INCONTENT
 *   stoppclock_timer_page        → TIMER_PAGE
 *   stoppclock_content_sidebar   → CONTENT_SIDEBAR
 *   stoppclock_anchor_bottom     → ANCHOR_BOTTOM
 */

import type { AdUnit } from '../types/monetization-types';

// =============================================================================
// PUBLISHER CONFIGURATION
// =============================================================================

/** Publisher ID — AdSense > Account > Account information */
export const ADSENSE_PUBLISHER_ID = 'ca-pub-1712273263687132';

// =============================================================================
// SLOT IDs — Hier echte IDs aus dem AdSense Dashboard eintragen
// Format: 10-stellige Zahl als String
// Status: ✅ LIVE | ⚠️ TODO (im AdSense Dashboard erstellen)
// =============================================================================
const AD_SLOT_IDS = {
  // ✅ LIVE — Home Banner Top (responsive, 970px max-width)
  HOME_TOP: '2954253435',

  // ✅ LIVE — stoppckl_1 — Home Middle / Timer Pages (responsive)
  HOME_MIDDLE: '8335102509',

  // ✅ LIVE — stoppckl_1 — Timer-Seiten (Countdown, Stopwatch, Alarm etc.)
  TIMER_PAGE: '8335102509',

  // ✅ LIVE — stoppckl_2 — Blog In-Content (zwischen Abschnitten)
  BLOG_INCONTENT: '7410013586',

  // ✅ LIVE — stoppckl_2 — Content / Pillar Pages (Sidebar/Bottom)
  CONTENT_SIDEBAR: '7410013586',

  // ✅ LIVE — hori2 — Horizontales Banner (responsive, volle Breite)
  // Einsatz: Unter Blog-Liste, Unter Timer-Worlds, Unter Facts, Unter About
  HORI2: '7752892424',

  // ⚠️ TODO — Im AdSense Dashboard erstellen: stoppclock_anchor_bottom
  // Typ: Anchor Ad (Sticky Banner) — benötigt separate Genehmigung
  ANCHOR_BOTTOM: '',
} as const;

// =============================================================================
// AD UNIT DEFINITIONS
// Änderungen hier immer mit isSlotConfigured() absichern!
// =============================================================================

export const AD_UNITS: AdUnit[] = [
  // ── HOME PAGE ────────────────────────────────────────────────────────────
  {
    unitId: 'home-top',
    adSlotId: AD_SLOT_IDS.HOME_TOP,
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true,
    },
  },
  {
    unitId: 'home-middle',
    adSlotId: AD_SLOT_IDS.HOME_MIDDLE,
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true,
    },
  },

  // ── TIMER PAGES ──────────────────────────────────────────────────────────
  // Alle spezifischen Timer-Seiten (Countdown, Stopwatch, Alarm, ...)
  {
    unitId: 'timer-page',
    adSlotId: AD_SLOT_IDS.TIMER_PAGE,
    placement: 'setup',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: false, // Nicht während aktiver Timer-Session
      showInFullscreen: false,
      showOnMobile: true,
    },
  },

  // ── BLOG / CONTENT PAGES ─────────────────────────────────────────────────
  {
    unitId: 'blog-incontent',
    adSlotId: AD_SLOT_IDS.BLOG_INCONTENT,
    placement: 'setup',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true,
    },
  },
  {
    unitId: 'content-sidebar',
    adSlotId: AD_SLOT_IDS.CONTENT_SIDEBAR,
    placement: 'setup',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: false, // Sidebar auf Mobile nicht sinnvoll
    },
  },

  // ── HORIZONTAL BANNER (hori2) ────────────────────────────────────────────
  // Einsatz: Unter Blog-Liste, Unter Timer-Worlds, Unter Facts, Unter About
  {
    unitId: 'hori2',
    adSlotId: AD_SLOT_IDS.HORI2,
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true,
    },
  },

  // ── ANCHOR (STICKY BOTTOM) ────────────────────────────────────────────────
  {
    unitId: 'anchor-bottom',
    adSlotId: AD_SLOT_IDS.ANCHOR_BOTTOM,
    placement: 'anchor',
    format: 'anchor',
    visibilityRules: {
      showWhenRunning: false, // Niemals während aktivem Timer
      showInFullscreen: false,
      showOnMobile: true,
    },
  },

  // BACKWARD-COMPAT: 'setup-main' alias für bestehende Verwendungen
  {
    unitId: 'setup-main',
    adSlotId: AD_SLOT_IDS.CONTENT_SIDEBAR,
    placement: 'setup',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: false,
      showInFullscreen: false,
      showOnMobile: true,
    },
  },

  // BACKWARD-COMPAT: 'home-bottom' alias
  {
    unitId: 'home-bottom',
    adSlotId: AD_SLOT_IDS.HOME_MIDDLE,
    placement: 'home',
    format: 'responsive',
    visibilityRules: {
      showWhenRunning: true,
      showInFullscreen: false,
      showOnMobile: true,
    },
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Prüft ob ein Slot korrekt konfiguriert ist (nicht leer, 10 Ziffern)
 * Immer prüfen bevor ein Ad gerendert wird!
 */
export function isSlotConfigured(slotId: string): boolean {
  return slotId !== '' && slotId.length >= 10 && /^\d+$/.test(slotId);
}

/** Gibt alle konfigurierten (live) Ad-Units zurück */
export function getConfiguredAdUnits(): AdUnit[] {
  return AD_UNITS.filter(unit => isSlotConfigured(unit.adSlotId));
}

/** Gibt Ad-Unit by ID zurück (undefined wenn nicht gefunden) */
export function getAdUnit(unitId: string): AdUnit | undefined {
  return AD_UNITS.find(unit => unit.unitId === unitId);
}

/** Gibt alle Units für eine bestimmte Placement zurück */
export function getAdUnitsByPlacement(placement: AdUnit['placement']): AdUnit[] {
  return AD_UNITS.filter(unit => unit.placement === placement);
}

/**
 * Gibt den besten verfügbaren Unit für eine Seite zurück.
 * Priorisiert: page-spezifischer Slot → home-top als Fallback
 */
export function getBestAdUnitForPage(preferredUnitId: string): AdUnit | undefined {
  const preferred = getAdUnit(preferredUnitId);
  if (preferred && isSlotConfigured(preferred.adSlotId)) return preferred;

  // Fallback auf home-top (immer konfiguriert)
  const fallback = getAdUnit('home-top');
  if (fallback && isSlotConfigured(fallback.adSlotId)) return fallback;

  return undefined;
}

/**
 * Entscheidet ob ein Ad angezeigt werden soll.
 * Alle Regeln werden hier zentralisiert geprüft.
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
  // 1. Kein Consent → keine Ads (DSGVO)
  if (!state.hasConsent) return false;

  // 2. Slot nicht konfiguriert → nicht rendern
  if (!isSlotConfigured(adUnit.adSlotId)) return false;

  // 3. Fullscreen-Regel
  if (state.isFullscreen && !adUnit.visibilityRules.showInFullscreen) return false;

  // 4. Timer-Running-Regel
  if (state.timerRunning && !adUnit.visibilityRules.showWhenRunning) return false;

  // 5. Mobile-Regel
  if (state.isMobile && !adUnit.visibilityRules.showOnMobile) return false;

  return true;
}

/**
 * Debug-Info für Entwicklung
 */
export function getAdUnitDebugInfo(): { configured: number; total: number; unconfigured: string[] } {
  const unconfigured = AD_UNITS
    .filter(u => !isSlotConfigured(u.adSlotId))
    .map(u => u.unitId);

  return {
    configured: AD_UNITS.length - unconfigured.length,
    total: AD_UNITS.length,
    unconfigured,
  };
}
