import { useEffect, useRef, useState } from 'react';
import { loadConsent } from '../utils/consent';
import { ADSENSE_PUBLISHER_ID, isSlotConfigured } from '../config/ad-units';
import type { AdUnit as AdUnitType } from '../types/monetization-types';

interface AdUnitProps {
  adUnit: AdUnitType;
  className?: string;
  /** Zeigt "Anzeige"-Label über dem Ad an (Standard: true) */
  showLabel?: boolean;
}

/**
 * AdUnit — Google AdSense Ad-Unit Component
 *
 * Features:
 * - Rendert NICHT wenn kein Consent vorhanden (DSGVO)
 * - Rendert NICHT wenn Slot-ID nicht konfiguriert (verhindert invalid requests)
 * - Zeigt diskretes "Anzeige"-Label für Nutzervertrauen
 * - CLS-Prevention durch min-height auf Container
 * - Cleanup bei Unmount
 *
 * Usage:
 * ```tsx
 * import { getAdUnit } from '../config/ad-units';
 * const adUnit = getAdUnit('home-top');
 * if (adUnit) <AdUnit adUnit={adUnit} />
 * ```
 */
export function AdUnit({ adUnit, className = '', showLabel = true }: AdUnitProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);

  // Consent beim Mount prüfen
  useEffect(() => {
    const consent = loadConsent();
    setHasConsent(consent.adsEnabled);
  }, []);

  // adsbygoogle initialisieren wenn Consent und Element vorhanden
  useEffect(() => {
    if (!hasConsent) return;
    if (initializedRef.current) return;
    if (!adRef.current) return;

    // Slot muss konfiguriert sein (verhindert leere ad-requests)
    if (!isSlotConfigured(adUnit.adSlotId)) {
      if (import.meta.env.DEV) {
        console.warn(`[AdUnit] Slot "${adUnit.unitId}" ist nicht konfiguriert. Slot-ID im AdSense Dashboard erstellen.`);
      }
      return;
    }

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      initializedRef.current = true;
    } catch (error) {
      console.error('[AdUnit] Failed to initialize ad:', error);
    }
  }, [hasConsent, adUnit.adSlotId, adUnit.unitId]);

  // Kein Consent → nichts rendern
  if (!hasConsent) return null;

  // Slot nicht konfiguriert → nichts rendern (kein invalid request)
  if (!isSlotConfigured(adUnit.adSlotId)) return null;

  return (
    <div
      className={`ad-unit-wrapper ${className}`}
      data-unit-id={adUnit.unitId}
      role="complementary"
      aria-label="Werbung"
      style={{ minHeight: '100px' }}
    >
      {showLabel && (
        <span className="ad-unit-label" aria-hidden="true">Anzeige</span>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={adUnit.adSlotId}
        data-ad-format={adUnit.format === 'anchor' ? 'auto' : adUnit.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
