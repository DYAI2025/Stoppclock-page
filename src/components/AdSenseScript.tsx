import { useEffect } from 'react';
import { loadConsent } from '../utils/consent';

/**
 * AdSenseScript — Consent-Bridge für Google AdSense
 *
 * Das AdSense-Script wird jetzt statisch in index.html geladen
 * (für maximale Kompatibilität mit Google-Crawlern und AdSense-Review).
 *
 * Diese Komponente:
 * - Aktiviert adsbygoogle Push-Calls wenn Consent vorhanden
 * - Horcht auf Consent-Änderungen und reagiert per Page-Reload
 * - Verhindert doppeltes Laden (Script bereits in index.html)
 *
 * Slots werden durch AdUnit.tsx / AdSlot.tsx einzeln initialisiert.
 */
export function AdSenseScript() {
  useEffect(() => {
    // Script is already loaded via index.html <script async ...>
    // Just mark window.adsbygoogle as initialized array if needed
    const consent = loadConsent();
    if (consent.adsEnabled) {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
    }
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
