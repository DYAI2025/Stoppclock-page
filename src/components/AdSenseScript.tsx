import { useEffect } from 'react';
import { ADSENSE_PUBLISHER_ID } from '../config/ad-units';
import { loadConsent } from '../utils/consent';

/**
 * AdSense Script Loader
 * Loads the Google AdSense script when user has given consent
 *
 * Usage:
 * - Add once at app root level (in App.tsx)
 * - Script only loads if user has consented to ads
 * - Uses crossorigin="anonymous" for GDPR compliance
 */
export function AdSenseScript() {
  useEffect(() => {
    const consent = loadConsent();

    // Only load AdSense if user has consented
    if (!consent.adsEnabled) {
      return;
    }

    // Check if script already loaded
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"]`
    );

    if (existingScript) {
      return; // Already loaded
    }

    // Create and inject AdSense script
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onerror = () => {
      console.error('[AdSense] Failed to load AdSense script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      // Note: This won't actually stop ads from loading if they're already initialized
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []); // Run once on mount

  // Listen for consent changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sc.consent') {
        // Consent changed - reload page to apply changes
        // (AdSense can't be dynamically loaded/unloaded cleanly)
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return null; // This component doesn't render anything
}
