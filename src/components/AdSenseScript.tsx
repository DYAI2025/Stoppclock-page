import { useEffect } from 'react';

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
    // AdSense script is loaded in index.html <head> for crawler visibility.
    // Consent Mode v2 (also in index.html) defaults to 'denied',
    // so no personalized ads until user grants consent.
    // We only need to initialize the adsbygoogle array here.
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
