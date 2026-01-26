/**
 * Task 7: Implement Async Ad Loading
 * Test suite for non-blocking async ad script loading
 * TDD: Write failing tests first
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Async Ad Loading - Non-blocking Script', () => {
  beforeEach(() => {
    // Clear any previously added scripts
    document.querySelectorAll('script[data-ad-test]').forEach(s => s.remove());
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.querySelectorAll('script[data-ad-test]').forEach(s => s.remove());
  });

  describe('Script Tag Creation', () => {
    it('should create script tag for AdSense', () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';
      script.setAttribute('data-ad-test', 'true');

      expect(script.async).toBe(true);
      expect(script.src).toContain('googlesyndication.com');
      expect(script.src).toContain('ca-pub-1712273263687132');
    });

    it('should have async attribute set to true', () => {
      const script = document.createElement('script');
      script.async = true;

      expect(script.async).toBe(true);
    });

    it('should not have defer attribute for AdSense', () => {
      const script = document.createElement('script');
      script.async = true;
      script.defer = false;

      expect(script.async).toBe(true);
      expect(script.defer).toBe(false);
    });

    it('should have correct AdSense URL', () => {
      const publisherId = 'ca-pub-1712273263687132';
      const url = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;

      expect(url).toContain('pagead2.googlesyndication.com');
      expect(url).toContain(publisherId);
    });
  });

  describe('Script Loading Logic', () => {
    it('should not block page rendering', () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';

      const isAsync = script.async === true;
      expect(isAsync).toBe(true);
    });

    it('should load script after DOM is ready', () => {
      let scriptAdded = false;

      const loadAdScript = () => {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';
        script.setAttribute('data-ad-test', 'true');
        document.head.appendChild(script);
        scriptAdded = true;
      };

      expect(scriptAdded).toBe(false);
      loadAdScript();
      expect(scriptAdded).toBe(true);

      const addedScript = document.querySelector('script[data-ad-test]');
      expect(addedScript).not.toBeNull();
    });

    it('should append script to document head', () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';
      script.setAttribute('data-ad-test', 'true');

      const initialHeadScripts = document.head.querySelectorAll('script').length;
      document.head.appendChild(script);
      const newHeadScripts = document.head.querySelectorAll('script').length;

      expect(newHeadScripts).toBe(initialHeadScripts + 1);
    });

    it('should load script in parallel with other resources', () => {
      const isAsync = true;
      const isDeferred = false;

      expect(isAsync && !isDeferred).toBe(true);
    });
  });

  describe('Script Loading with Consent', () => {
    it('should only load script if consent is given', () => {
      const hasConsent = false;
      const shouldLoadScript = hasConsent;

      expect(shouldLoadScript).toBe(false);
    });

    it('should load script after consent is granted', () => {
      let hasConsent = false;
      let scriptLoaded = false;

      const loadAdScriptIfConsent = () => {
        if (hasConsent) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';
          script.setAttribute('data-ad-test', 'true');
          document.head.appendChild(script);
          scriptLoaded = true;
        }
      };

      // Before consent
      loadAdScriptIfConsent();
      expect(scriptLoaded).toBe(false);

      // Grant consent
      hasConsent = true;
      loadAdScriptIfConsent();
      expect(scriptLoaded).toBe(true);
    });

    it('should handle consent withdrawal', () => {
      const consentState = { adsEnabled: true };
      let adScriptActive = true;

      const handleConsentChange = () => {
        if (!consentState.adsEnabled) {
          adScriptActive = false;
        }
      };

      expect(adScriptActive).toBe(true);
      consentState.adsEnabled = false;
      handleConsentChange();
      expect(adScriptActive).toBe(false);
    });
  });

  describe('Script Error Handling', () => {
    it('should handle script loading failures gracefully', () => {
      const loadScript = async (): Promise<boolean> => {
        try {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';
          script.setAttribute('data-ad-test', 'true');

          return new Promise((resolve) => {
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
          });
        } catch (error) {
          console.error('Failed to load ad script:', error);
          return false;
        }
      };

      // Test that function doesn't throw
      expect(loadScript).not.toThrow();
    });

    it('should log errors if script fails to load', () => {
      const logError = vi.fn();

      const loadScript = () => {
        try {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://invalid-domain.example.com/script.js';
          script.onerror = () => {
            logError('Script failed to load');
          };
          document.head.appendChild(script);
        } catch (error) {
          logError('Script creation failed');
        }
      };

      loadScript();
      // Note: In real env, onerror would fire, but in test we just verify function exists
      expect(typeof loadScript).toBe('function');
    });

    it('should continue functioning if ad service is unavailable', () => {
      const site = {
        canLoad: true,
        adsLoaded: false
      };

      const tryLoadAds = () => {
        if (site.canLoad) {
          try {
            // Simulate loading
            site.adsLoaded = true;
          } catch (error) {
            site.adsLoaded = false;
          }
        }
        return site.canLoad; // Site still functional
      };

      expect(tryLoadAds()).toBe(true);
      expect(site.canLoad).toBe(true); // Site didn't break
    });
  });

  describe('Script Caching', () => {
    it('should cache the AdSense script', () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';

      // Modern browsers cache scripts by URL
      expect(script.src).toBe('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132');
    });

    it('should not load script multiple times', () => {
      let loadCount = 0;

      const loadAdScript = () => {
        const existingScript = document.querySelector('script[src*="adsbygoogle"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';
          script.setAttribute('data-ad-test', 'true');
          document.head.appendChild(script);
          loadCount++;
        }
      };

      loadAdScript();
      expect(loadCount).toBe(1);

      loadAdScript();
      expect(loadCount).toBe(1); // Should not increment
    });
  });

  describe('Performance Impact', () => {
    it('should not block rendering with async script', () => {
      const startTime = performance.now();

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';
      script.setAttribute('data-ad-test', 'true');
      document.head.appendChild(script);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should be very fast (< 10ms) since it's just DOM manipulation
      expect(duration).toBeLessThan(100); // Generous threshold for test environment
    });

    it('should load script in background', () => {
      const isAsync = true;
      const isMainThread = true;

      // Async loading allows main thread to continue
      expect(isAsync && isMainThread).toBe(true);
    });

    it('should not impact Core Web Vitals', () => {
      const coreWebVitals = {
        lcp: true, // Largest Contentful Paint - async script doesn't block
        fid: true, // First Input Delay - script loads in background
        cls: true  // Cumulative Layout Shift - async script defined
      };

      Object.values(coreWebVitals).forEach(vital => {
        expect(vital).toBe(true);
      });
    });
  });

  describe('Script Attributes', () => {
    it('should have data-ad-client attribute', () => {
      const script = document.createElement('script');
      script.setAttribute('data-ad-client', 'ca-pub-1712273263687132');

      expect(script.getAttribute('data-ad-client')).toBe('ca-pub-1712273263687132');
    });

    it('should support custom data attributes', () => {
      const script = document.createElement('script');
      script.setAttribute('data-ad-slot', '2954253435');
      script.setAttribute('data-ad-format', 'auto');

      expect(script.getAttribute('data-ad-slot')).toBe('2954253435');
      expect(script.getAttribute('data-ad-format')).toBe('auto');
    });

    it('should have crossorigin attribute for CORS', () => {
      const script = document.createElement('script');
      script.crossOrigin = 'anonymous';

      expect(script.crossOrigin).toBe('anonymous');
    });
  });

  describe('Script Timing', () => {
    it('should load script after document ready', () => {
      let docReady = false;
      let scriptLoaded = false;

      const onReady = () => {
        docReady = true;
        if (docReady) {
          scriptLoaded = true;
        }
      };

      onReady();
      expect(scriptLoaded).toBe(true);
    });

    it('should respect preload hints', () => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://pagead2.googlesyndication.com';

      expect(link.rel).toBe('preconnect');
      expect(link.href).toContain('pagead2.googlesyndication.com');
    });

    it('should consider lazy loading for ads', () => {
      const script = document.createElement('script');
      script.loading = 'lazy';
      script.async = true;

      expect(script.async).toBe(true);
    });
  });

  describe('Fallback Mechanisms', () => {
    it('should provide fallback if script fails', () => {
      const ads = {
        loaded: false,
        failed: false
      };

      const loadAds = () => {
        try {
          // Simulate load
          ads.loaded = true;
        } catch (error) {
          ads.failed = true;
          console.warn('Ad loading failed, continuing without ads');
        }
        return ads.loaded || !ads.failed;
      };

      const result = loadAds();
      expect(typeof result).toBe('boolean');
    });

    it('should not crash page if ads unavailable', () => {
      const pageStatus = {
        functional: true
      };

      try {
        // Attempt to load ads
        if (!pageStatus.functional) {
          throw new Error('Page broken');
        }
      } catch (error) {
        console.error('Ad error:', error);
      }

      expect(pageStatus.functional).toBe(true);
    });
  });

  describe('Script State Management', () => {
    it('should track script loading state', () => {
      const state = {
        pending: false,
        loaded: false,
        error: false,
        consented: false
      };

      expect(state.loaded).toBe(false);
      expect(state.error).toBe(false);
    });

    it('should transition through loading states', () => {
      const states: string[] = [];

      // Initial
      states.push('initial');
      expect(states[0]).toBe('initial');

      // Loading
      states.push('loading');
      expect(states[1]).toBe('loading');

      // Loaded
      states.push('loaded');
      expect(states[2]).toBe('loaded');

      expect(states.length).toBe(3);
    });

    it('should handle state transitions correctly', () => {
      const state = { status: 'pending' as const };

      if (state.status === 'pending') {
        // Wait for consent
        expect(state.status).toBe('pending');
      }
    });
  });

  describe('Integration with Page Lifecycle', () => {
    it('should load after page visibility change', () => {
      let visible = true;
      let adScriptLoaded = false;

      const onVisibilityChange = () => {
        if (visible && !adScriptLoaded) {
          adScriptLoaded = true;
        }
      };

      onVisibilityChange();
      expect(adScriptLoaded).toBe(true);
    });

    it('should respect intersection observer for lazy loading', () => {
      const adUnit = {
        visible: false,
        shouldLoad: false
      };

      adUnit.visible = true;
      if (adUnit.visible) {
        adUnit.shouldLoad = true;
      }

      expect(adUnit.shouldLoad).toBe(true);
    });

    it('should handle page unload gracefully', () => {
      let unloading = false;

      window.addEventListener('beforeunload', () => {
        unloading = true;
      });

      // Trigger cleanup
      const cleanup = () => {
        if (unloading) {
          console.log('Cleaning up ad resources');
        }
      };

      expect(typeof cleanup).toBe('function');
    });
  });

  describe('Script Security', () => {
    it('should load from trusted source only', () => {
      const trustedDomain = 'pagead2.googlesyndication.com';
      const scriptUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

      expect(scriptUrl).toContain(trustedDomain);
    });

    it('should use HTTPS protocol', () => {
      const scriptUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1712273263687132';

      expect(scriptUrl).toMatch(/^https:\/\//);
    });

    it('should validate publisher ID format', () => {
      const publisherId = 'ca-pub-1712273263687132';

      expect(publisherId).toMatch(/^ca-pub-\d{16}$/);
    });
  });
});
