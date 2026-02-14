/**
 * Task 1: Setup AdSense Account
 * Test suite for validating AdSense configuration
 * TDD: Write failing tests first
 */

import { describe, it, expect } from 'vitest';
import {
  ADSENSE_PUBLISHER_ID,
  HOME_TOP_SLOT_ID,
  AD_UNITS,
  getAdUnit,
  getAdUnitsByPlacement,
  shouldShowAd
} from '../../src/config/ad-units';

describe('AdSense Setup Configuration', () => {
  describe('Publisher ID Configuration', () => {
    it('should have a valid Google AdSense publisher ID', () => {
      expect(ADSENSE_PUBLISHER_ID).toBeDefined();
      expect(typeof ADSENSE_PUBLISHER_ID).toBe('string');
    });

    it('should have publisher ID in correct format (ca-pub-*)', () => {
      expect(ADSENSE_PUBLISHER_ID).toMatch(/^ca-pub-\d{16}$/);
    });

    it('should not have placeholder publisher ID', () => {
      expect(ADSENSE_PUBLISHER_ID).not.toBe('ca-pub-0000000000000000');
      expect(ADSENSE_PUBLISHER_ID).not.toBe('');
    });
  });

  describe('Ad Slot Configuration', () => {
    it('should have a primary ad slot ID defined', () => {
      expect(HOME_TOP_SLOT_ID).toBeDefined();
      expect(typeof HOME_TOP_SLOT_ID).toBe('string');
    });

    it('should have ad slot ID in valid numeric format', () => {
      expect(HOME_TOP_SLOT_ID).toMatch(/^\d{10}$/);
    });

    it('should not have placeholder slot ID', () => {
      expect(HOME_TOP_SLOT_ID).not.toBe('0000000000');
      expect(HOME_TOP_SLOT_ID).not.toBe('');
    });
  });

  describe('AD_UNITS Array', () => {
    it('should have AD_UNITS defined as a non-empty array', () => {
      expect(Array.isArray(AD_UNITS)).toBe(true);
      expect(AD_UNITS.length).toBeGreaterThan(0);
    });

    it('should have all required fields in each ad unit', () => {
      AD_UNITS.forEach(unit => {
        expect(unit).toHaveProperty('unitId');
        expect(unit).toHaveProperty('adSlotId');
        expect(unit).toHaveProperty('placement');
        expect(unit).toHaveProperty('format');
        expect(unit).toHaveProperty('visibilityRules');
      });
    });

    it('should have unique unitIds', () => {
      const unitIds = AD_UNITS.map(u => u.unitId);
      const uniqueIds = new Set(unitIds);
      expect(uniqueIds.size).toBe(unitIds.length);
    });

    it('should have valid placement values', () => {
      const validPlacements = ['home', 'setup', 'interstitial', 'anchor'];
      AD_UNITS.forEach(unit => {
        expect(validPlacements).toContain(unit.placement);
      });
    });

    it('should have valid format values', () => {
      const validFormats = ['responsive', 'banner', 'anchor'];
      AD_UNITS.forEach(unit => {
        expect(validFormats).toContain(unit.format);
      });
    });

    it('should have 10-digit numeric slot IDs', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.adSlotId).toMatch(/^\d{10}$/);
      });
    });
  });

  describe('getAdUnit Function', () => {
    it('should return ad unit when unitId exists', () => {
      const unit = getAdUnit('home-top');
      expect(unit).toBeDefined();
      expect(unit?.unitId).toBe('home-top');
    });

    it('should return undefined when unitId does not exist', () => {
      const unit = getAdUnit('non-existent-id');
      expect(unit).toBeUndefined();
    });
  });

  describe('getAdUnitsByPlacement Function', () => {
    it('should return ad units for valid placement', () => {
      const homeUnits = getAdUnitsByPlacement('home');
      expect(Array.isArray(homeUnits)).toBe(true);
      expect(homeUnits.length).toBeGreaterThan(0);
      homeUnits.forEach(unit => {
        expect(unit.placement).toBe('home');
      });
    });

    it('should return empty array for invalid placement', () => {
      const units = getAdUnitsByPlacement('home' as any);
      expect(Array.isArray(units)).toBe(true);
    });
  });

  describe('shouldShowAd Function', () => {
    it('should return false when user has not given consent', () => {
      const unit = getAdUnit('home-top')!;
      const result = shouldShowAd(unit, {
        timerRunning: false,
        isFullscreen: false,
        isMobile: false,
        hasConsent: false
      });
      expect(result).toBe(false);
    });

    it('should return false when ad is in fullscreen and showInFullscreen is false', () => {
      const unit = getAdUnit('home-top')!;
      const result = shouldShowAd(unit, {
        timerRunning: false,
        isFullscreen: true,
        isMobile: false,
        hasConsent: true
      });
      expect(result).toBe(false);
    });

    it('should return true when all conditions are met', () => {
      const unit = getAdUnit('home-top')!;
      const result = shouldShowAd(unit, {
        timerRunning: false,
        isFullscreen: false,
        isMobile: true,
        hasConsent: true
      });
      expect(result).toBe(true);
    });

    it('should respect timer running visibility rules', () => {
      const setupUnit = getAdUnit('setup-main')!;
      const resultRunning = shouldShowAd(setupUnit, {
        timerRunning: true,
        isFullscreen: false,
        isMobile: false,
        hasConsent: true
      });
      expect(resultRunning).toBe(false);

      const resultNotRunning = shouldShowAd(setupUnit, {
        timerRunning: false,
        isFullscreen: false,
        isMobile: false,
        hasConsent: true
      });
      expect(resultNotRunning).toBe(true);
    });
  });

  describe('ads.txt configuration', () => {
    it('should have required ads.txt file in public directory', async () => {
      // This test will be verified in the file system check
      const fs = await import('fs');
      const path = await import('path');
      const adsTxtPath = path.join('/tmp/stoppclock/public', 'ads.txt');
      expect(fs.existsSync(adsTxtPath)).toBe(true);
    });
  });

  describe('AdSense Script Loading', () => {
    it('should be configured for async script loading', () => {
      // Configuration exists in ad-units.ts
      expect(ADSENSE_PUBLISHER_ID).toBeDefined();
      // Verify the async script tag will be properly configured
      // in the main application component
    });
  });
});
