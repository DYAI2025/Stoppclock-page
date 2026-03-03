import { useEffect, useRef, useState, useId } from 'react';
import { loadConsent } from '../../utils/consent';
import { ADSENSE_PUBLISHER_ID, isSlotConfigured, getBestAdUnitForPage } from '../../config/ad-units';

/**
 * AdSlot — Robustes, zentrales Ad-Placement-Component (neue Architektur)
 *
 * VERWENDUNG:
 * ```tsx
 * // Auf einer Timer-Seite:
 * <AdSlot placement="timer-page" />
 *
 * // Auf der Home-Page:
 * <AdSlot placement="home-top" />
 *
 * // Im Blog:
 * <AdSlot placement="blog-incontent" minHeight={280} />
 * ```
 *
 * FEATURES:
 * - Consent-Check (DSGVO) — rendert nichts ohne Zustimmung
 * - Slot-Konfigurationscheck — kein Request wenn Slot leer
 * - CLS-Prevention durch explizite min-height
 * - Sichtbares "Anzeige"-Label
 * - Fallback auf 'home-top' wenn primärer Slot nicht konfiguriert
 * - Debug-Logging in DEV
 * - Kein Double-Mount durch initializedRef
 */

interface AdSlotProps {
  /** Unit ID aus ad-units.ts, z.B. 'home-top', 'timer-page', 'blog-incontent' */
  placement: string;
  /** Minimalhöhe des Containers (verhindert CLS). Standard: 100px */
  minHeight?: number;
  /** CSS-Klasse für zusätzliches Styling */
  className?: string;
  /** Zeigt "Anzeige"-Label. Standard: true */
  showLabel?: boolean;
}

export function AdSlot({
  placement,
  minHeight = 100,
  className = '',
  showLabel = true,
}: AdSlotProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);
  const instanceId = useId(); // Eindeutige ID pro Instanz (React 18)

  // Consent laden
  useEffect(() => {
    const consent = loadConsent();
    setHasConsent(consent.adsEnabled);
    setIsReady(true);
  }, []);

  // Ad initialisieren
  useEffect(() => {
    if (!isReady || !hasConsent) return;
    if (initializedRef.current) return;
    if (!adRef.current) return;

    const adUnit = getBestAdUnitForPage(placement);

    if (!adUnit) {
      if (import.meta.env.DEV) {
        console.warn(`[AdSlot] Kein Ad-Unit für placement "${placement}" gefunden.`);
      }
      return;
    }

    if (!isSlotConfigured(adUnit.adSlotId)) {
      if (import.meta.env.DEV) {
        console.info(
          `[AdSlot] Slot "${adUnit.unitId}" nicht konfiguriert. ` +
          `Im AdSense Dashboard erstellen: stoppclock_${placement.replace('-', '_')}`
        );
      }
      return;
    }

    // Slot-ID auf das <ins>-Element setzen (dynamisch, da getBestAdUnit Fallback nutzen kann)
    adRef.current.setAttribute('data-ad-slot', adUnit.adSlotId);

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      initializedRef.current = true;

      if (import.meta.env.DEV) {
        console.debug(`[AdSlot] Initialized: ${adUnit.unitId} (slot: ${adUnit.adSlotId})`);
      }
    } catch (error) {
      console.error('[AdSlot] Failed to push ad:', error);
    }
  }, [isReady, hasConsent, placement]);

  // Nicht rendern wenn nicht bereit oder kein Consent
  if (!isReady) {
    // Placeholder mit fixer Höhe verhindert CLS beim Laden
    return (
      <div
        className={`ad-slot ad-slot--loading ${className}`}
        style={{ minHeight: `${minHeight}px` }}
        aria-hidden="true"
        data-placement={placement}
      />
    );
  }

  if (!hasConsent) return null;

  // Prüfen ob Slot überhaupt konfiguriert (verhindert leeren Container)
  const adUnit = getBestAdUnitForPage(placement);
  if (!adUnit || !isSlotConfigured(adUnit.adSlotId)) return null;

  return (
    <div
      className={`ad-slot ad-slot--active ${className}`}
      style={{ minHeight: `${minHeight}px` }}
      data-placement={placement}
      data-instance-id={instanceId}
      role="complementary"
      aria-label="Werbung"
    >
      {showLabel && (
        <p className="ad-slot__label" aria-hidden="true">
          Anzeige
        </p>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: `${Math.max(minHeight - 24, 50)}px` }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot="" /* wird im useEffect dynamisch gesetzt */
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * AnchorAdSlot — Sticky Bottom Banner
 * Verwendet automatisch den 'anchor-bottom' Slot.
 * Zeigt sich NUR wenn Consent vorhanden und Timer nicht läuft.
 */
interface AnchorAdSlotProps {
  isTimerRunning?: boolean;
  isFullscreen?: boolean;
}

export function AnchorAdSlot({ isTimerRunning = false, isFullscreen = false }: AnchorAdSlotProps) {
  if (isTimerRunning || isFullscreen) return null;

  return (
    <div className="ad-anchor-wrapper" aria-label="Werbung">
      <AdSlot
        placement="anchor-bottom"
        minHeight={90}
        showLabel={false}
        className="ad-anchor-inner"
      />
    </div>
  );
}
