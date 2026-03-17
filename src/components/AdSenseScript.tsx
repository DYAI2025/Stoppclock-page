import { useEffect } from 'react';
import { loadConsent } from '../utils/consent';
import { ADSENSE_PUBLISHER_ID } from '../config/ad-units';

/**
 * AdSenseScript — Consent-Bridge für Google AdSense
 *
 * Diese Komponente:
 * - Lädt das AdSense-Script dynamisch NUR wenn Consent vorhanden ist (DSGVO)
 * - Verhindert doppeltes Laden
 * - Initialisiert das adsbygoogle Array
 * - Horcht auf Consent-Änderungen und reagiert per Page-Reload
 */
export function AdSenseScript() {
  useEffect(() => {
    const consent = loadConsent();
    if (!consent.adsEnabled) return;

    // 1. Prüfen ob Script bereits geladen wurde
    const existingScript = document.querySelector(
      `script[src*="pagead2.googlesyndication.com"]`
    );
    if (existingScript) {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      return;
    }

    // 2. Script dynamisch injizieren
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
    script.crossOrigin = 'anonymous';
    
    script.onerror = () => {
      console.error('[AdSense] Failed to load AdSense script');
    };

    document.head.appendChild(script);

    // 3. Initialisiere adsbygoogle Array
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
  }, []);

  // Listen for consent changes (e.g. user accepts banner in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sc.consent') {
        window.location.reload();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return null;
}
