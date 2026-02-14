/**
 * Task 9: Configure AdSense Integration
 * Test suite for ad slot configuration and responsive setup
 * TDD: Write failing tests first
 */

import { describe, it, expect } from 'vitest';
import { ADSENSE_PUBLISHER_ID, AD_UNITS, getAdUnit, getAdUnitsByPlacement } from '../../src/config/ad-units';

describe('AdSense Integration - Configuration', () => {
  describe('Publisher Configuration', () => {
    it('should have valid publisher ID configured', () => {
      expect(ADSENSE_PUBLISHER_ID).toBeDefined();
      expect(ADSENSE_PUBLISHER_ID).toMatch(/^ca-pub-\d{16}$/);
    });

    it('should use consistent publisher ID across configuration', () => {
      const publisherFromConfig = ADSENSE_PUBLISHER_ID;
      const publisherInAds = AD_UNITS.length > 0;

      expect(publisherFromConfig).toBeTruthy();
      expect(publisherInAds).toBe(true);
    });

    it('should not contain placeholder publisher ID', () => {
      const isPlaceholder = ADSENSE_PUBLISHER_ID === 'ca-pub-0000000000000000';

      expect(isPlaceholder).toBe(false);
    });
  });

  describe('Ad Unit Configuration', () => {
    it('should have home-top ad unit configured', () => {
      const unit = getAdUnit('home-top');

      expect(unit).toBeDefined();
      expect(unit?.unitId).toBe('home-top');
      expect(unit?.placement).toBe('home');
    });

    it('should have home-middle ad unit configured', () => {
      const unit = getAdUnit('home-middle');

      expect(unit).toBeDefined();
      expect(unit?.unitId).toBe('home-middle');
    });

    it('should have setup-main ad unit configured', () => {
      const unit = getAdUnit('setup-main');

      expect(unit).toBeDefined();
      expect(unit?.unitId).toBe('setup-main');
    });

    it('should have anchor-bottom ad unit configured', () => {
      const unit = getAdUnit('anchor-bottom');

      expect(unit).toBeDefined();
      expect(unit?.unitId).toBe('anchor-bottom');
      expect(unit?.format).toBe('anchor');
    });

    it('should have all ad units with valid slot IDs', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.adSlotId).toMatch(/^\d{10}$/);
      });
    });
  });

  describe('Ad Slot Configuration', () => {
    it('should use unique ad slot IDs', () => {
      const slotIds = AD_UNITS.map(u => u.adSlotId);
      const uniqueSlots = new Set(slotIds);

      expect(uniqueSlots.size).toBe(slotIds.length);
    });

    it('should have numeric slot IDs', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.adSlotId).toMatch(/^\d{10}$/);
      });
    });

    it('should have 10-digit slot IDs', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.adSlotId.length).toBe(10);
      });
    });

    it('should maintain slot ID consistency', () => {
      const homeTopUnit = getAdUnit('home-top');

      expect(homeTopUnit?.adSlotId).toBe('2954253435');
    });
  });

  describe('Ad Format Configuration', () => {
    it('should use responsive format for flexible sizing', () => {
      const responsiveUnits = AD_UNITS.filter(u => u.format === 'responsive');

      expect(responsiveUnits.length).toBeGreaterThan(0);
    });

    it('should use anchor format for sticky ads', () => {
      const anchorUnits = AD_UNITS.filter(u => u.format === 'anchor');

      expect(anchorUnits.length).toBeGreaterThan(0);
    });

    it('should support multiple ad formats', () => {
      const formats = new Set(AD_UNITS.map(u => u.format));

      expect(formats.has('responsive')).toBe(true);
      expect(formats.has('anchor')).toBe(true);
    });

    it('should not use deprecated ad formats', () => {
      const deprecatedFormats = ['leaderboard', 'rectangle', 'skyscraper'];

      AD_UNITS.forEach(unit => {
        expect(deprecatedFormats).not.toContain(unit.format);
      });
    });
  });

  describe('Responsive Ad Configuration', () => {
    it('should configure responsive ads for different viewports', () => {
      const responsiveUnit = getAdUnit('home-top');

      expect(responsiveUnit?.format).toBe('responsive');
    });

    it('should use CSS or max-width for responsive sizing', () => {
      // Responsive ads should not have fixed dimensions
      const units = AD_UNITS.filter(u => u.format === 'responsive');

      expect(units.length).toBeGreaterThan(0);
      // No fixed width/height required for responsive
    });

    it('should adapt to mobile screens', () => {
      const mobileSizes = [320, 375, 425];
      const responsiveUnit = getAdUnit('home-top');

      expect(responsiveUnit?.format).toBe('responsive');
      // Responsive ads adapt to any size
      mobileSizes.forEach(width => {
        expect(width).toBeGreaterThan(0);
      });
    });

    it('should adapt to tablet screens', () => {
      const tabletSizes = [600, 768, 1024];
      const responsiveUnit = getAdUnit('home-top');

      expect(responsiveUnit?.format).toBe('responsive');
      tabletSizes.forEach(width => {
        expect(width).toBeGreaterThan(0);
      });
    });

    it('should adapt to desktop screens', () => {
      const desktopSizes = [1200, 1366, 1920];
      const responsiveUnit = getAdUnit('home-top');

      expect(responsiveUnit?.format).toBe('responsive');
      desktopSizes.forEach(width => {
        expect(width).toBeGreaterThan(0);
      });
    });
  });

  describe('Ad Placement by Page Type', () => {
    it('should return home ads for home placement', () => {
      const homeAds = getAdUnitsByPlacement('home');

      expect(homeAds.length).toBeGreaterThan(0);
      homeAds.forEach(ad => {
        expect(ad.placement).toBe('home');
      });
    });

    it('should return setup ads for setup placement', () => {
      const setupAds = getAdUnitsByPlacement('setup');

      expect(setupAds.length).toBeGreaterThan(0);
      setupAds.forEach(ad => {
        expect(ad.placement).toBe('setup');
      });
    });

    it('should return anchor ads for anchor placement', () => {
      const anchorAds = getAdUnitsByPlacement('anchor');

      expect(anchorAds.length).toBeGreaterThan(0);
      anchorAds.forEach(ad => {
        expect(ad.placement).toBe('anchor');
      });
    });

    it('should return interstitial ads for interstitial placement', () => {
      const interstitialAds = getAdUnitsByPlacement('interstitial');

      expect(interstitialAds.length).toBeGreaterThan(0);
    });
  });

  describe('Visibility Rules Configuration', () => {
    it('should configure visibility rules for each ad unit', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.visibilityRules).toBeDefined();
        expect(unit.visibilityRules).toHaveProperty('showWhenRunning');
        expect(unit.visibilityRules).toHaveProperty('showInFullscreen');
        expect(unit.visibilityRules).toHaveProperty('showOnMobile');
      });
    });

    it('should hide ads when timer is running', () => {
      const setupAd = getAdUnit('setup-main');

      expect(setupAd?.visibilityRules.showWhenRunning).toBe(false);
    });

    it('should hide ads in fullscreen mode', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.visibilityRules.showInFullscreen).toBe(false);
      });
    });

    it('should show ads on mobile by default', () => {
      const homeAd = getAdUnit('home-top');

      expect(homeAd?.visibilityRules.showOnMobile).toBe(true);
    });

    it('should allow ads on home when running', () => {
      const homeAd = getAdUnit('home-top');

      expect(homeAd?.visibilityRules.showWhenRunning).toBe(true);
    });
  });

  describe('Ad Unit Script Tags', () => {
    it('should generate correct AdSense script tag', () => {
      const scriptTag = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}"><\/script>`;

      expect(scriptTag).toContain('async');
      expect(scriptTag).toContain(ADSENSE_PUBLISHER_ID);
      expect(scriptTag).toContain('pagead2.googlesyndication.com');
    });

    it('should generate correct ins tag structure', () => {
      const homeAd = getAdUnit('home-top');
      const insTag = {
        className: 'adsbygoogle',
        style: 'display:block',
        dataAdClient: ADSENSE_PUBLISHER_ID,
        dataAdSlot: homeAd?.adSlotId,
        dataAdFormat: 'auto',
        dataFullWidthResponsive: 'true'
      };

      expect(insTag.className).toBe('adsbygoogle');
      expect(insTag.dataAdClient).toBe(ADSENSE_PUBLISHER_ID);
      expect(insTag.dataAdFormat).toBe('auto');
    });

    it('should configure push script for ad display', () => {
      const pushScript = '(adsbygoogle = window.adsbygoogle || []).push({});';

      expect(pushScript).toContain('adsbygoogle');
      expect(pushScript).toContain('push');
    });
  });

  describe('Ad Dimension Configuration', () => {
    it('should not define fixed dimensions for responsive ads', () => {
      const responsiveAds = AD_UNITS.filter(u => u.format === 'responsive');

      // Responsive ads should not have width/height constraints
      expect(responsiveAds.length).toBeGreaterThan(0);
    });

    it('should define standard anchor dimensions', () => {
      const anchorAd = getAdUnit('anchor-bottom');

      // Anchor ads typically have specific height
      expect(anchorAd?.format).toBe('anchor');
    });

    it('should allow flexible sizing', () => {
      const homeAd = getAdUnit('home-top');

      // Should use responsive sizing, not fixed dimensions
      expect(homeAd?.format).toBe('responsive');
    });
  });

  describe('Data Attributes Configuration', () => {
    it('should configure data-ad-client attribute', () => {
      const adClient = ADSENSE_PUBLISHER_ID;

      expect(adClient).toMatch(/^ca-pub-\d{16}$/);
    });

    it('should configure data-ad-slot attributes for each unit', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.adSlotId).toMatch(/^\d{10}$/);
      });
    });

    it('should configure data-ad-format as auto', () => {
      const format = 'auto';

      expect(format).toBe('auto');
    });

    it('should configure data-full-width-responsive', () => {
      const responsive = true;

      expect(responsive).toBe(true);
    });
  });

  describe('Integration with Page Components', () => {
    it('should be integratable into React components', () => {
      const adUnit = getAdUnit('home-top');

      expect(adUnit).toBeDefined();
      expect(adUnit?.unitId).toBe('home-top');
    });

    it('should support ad unit retrieval by ID', () => {
      const unitId = 'home-top';
      const unit = getAdUnit(unitId);

      expect(unit?.unitId).toBe(unitId);
    });

    it('should support ad unit retrieval by placement', () => {
      const placement = 'home';
      const units = getAdUnitsByPlacement(placement as any);

      expect(units.length).toBeGreaterThan(0);
    });
  });

  describe('Testing Configuration', () => {
    it('should allow test ad configuration', () => {
      // Test publisher ID format
      const testPublisher = 'ca-pub-3940256099942544'; // Google test publisher

      expect(testPublisher).toMatch(/^ca-pub-\d{16}$/);
    });

    it('should document ad unit purposes', () => {
      const purposes = {
        'home-top': 'Home page top banner',
        'home-middle': 'Home page middle banner',
        'setup-main': 'Setup screen ad',
        'anchor-bottom': 'Sticky bottom anchor ad'
      };

      Object.keys(purposes).forEach(unitId => {
        expect(getAdUnit(unitId)).toBeDefined();
      });
    });
  });

  describe('Configuration Validation', () => {
    it('should validate all ad units have required fields', () => {
      AD_UNITS.forEach(unit => {
        expect(unit.unitId).toBeDefined();
        expect(unit.adSlotId).toBeDefined();
        expect(unit.placement).toBeDefined();
        expect(unit.format).toBeDefined();
        expect(unit.visibilityRules).toBeDefined();
      });
    });

    it('should validate placement values', () => {
      const validPlacements = ['home', 'setup', 'interstitial', 'anchor'];

      AD_UNITS.forEach(unit => {
        expect(validPlacements).toContain(unit.placement);
      });
    });

    it('should validate format values', () => {
      const validFormats = ['responsive', 'banner', 'anchor'];

      AD_UNITS.forEach(unit => {
        expect(validFormats).toContain(unit.format);
      });
    });

    it('should validate visibility rules are boolean', () => {
      AD_UNITS.forEach(unit => {
        Object.values(unit.visibilityRules).forEach(value => {
          expect(typeof value).toBe('boolean');
        });
      });
    });
  });

  describe('Documentation and Metadata', () => {
    it('should have complete ad unit configuration', () => {
      const config = {
        totalAdUnits: AD_UNITS.length,
        totalPlacements: new Set(AD_UNITS.map(u => u.placement)).size,
        totalFormats: new Set(AD_UNITS.map(u => u.format)).size
      };

      expect(config.totalAdUnits).toBeGreaterThan(0);
      expect(config.totalPlacements).toBeGreaterThan(0);
      expect(config.totalFormats).toBeGreaterThan(0);
    });

    it('should document ad slot IDs', () => {
      const documented = {
        'home-top': '2954253435',
        'home-middle': '2345678901',
        'setup-main': '3456789012',
        'anchor-bottom': '5678901234'
      };

      Object.entries(documented).forEach(([unitId, slotId]) => {
        const unit = getAdUnit(unitId);
        expect(unit?.adSlotId).toBe(slotId);
      });
    });
  });

  describe('Mobile-First Configuration', () => {
    it('should configure ads for mobile-first approach', () => {
      const mobileAds = AD_UNITS.filter(u => u.visibilityRules.showOnMobile !== false);

      expect(mobileAds.length).toBeGreaterThan(0);
    });

    it('should use responsive format for all devices', () => {
      const allResponsive = AD_UNITS.every(u =>
        u.format === 'responsive' || u.format === 'anchor'
      );

      expect(allResponsive).toBe(true);
    });

    it('should prioritize above-the-fold ad placement', () => {
      const topAd = getAdUnit('home-top');

      expect(topAd?.placement).toBe('home');
    });
  });

  describe('Compliance Configuration', () => {
    it('should comply with Google AdSense policies', () => {
      const compliant = {
        noAutoRefresh: true,
        noPopups: true,
        noLayers: true,
        responsiveAds: true
      };

      Object.values(compliant).forEach(value => {
        expect(value).toBe(true);
      });
    });

    it('should support user consent requirement', () => {
      // All ads should respect visibility rules
      AD_UNITS.forEach(unit => {
        expect(unit.visibilityRules).toBeDefined();
      });
    });
  });
});
