import { useEffect } from "react";
import { ADSENSE_PUBLISHER_ID } from "../../config/ad-units";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface ResponsiveAdProps {
  slotId: string;
  className?: string;
}

/**
 * ResponsiveAd — Einfaches responsives AdSense-Ad
 *
 * WICHTIG: Für neue Ad-Placements bitte AdSlot.tsx verwenden.
 * Diese Komponente bleibt als Legacy-Wrapper für ältere Verwendungen.
 *
 * @param slotId  - Dein AdSense Slot-ID (10-stellige Zahl als String)
 */
const ResponsiveAd = ({ slotId, className = "" }: ResponsiveAdProps) => {
  useEffect(() => {
    if (!slotId || slotId.length < 10) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[AdSense] Unable to request ad slot", error);
      }
    }
  }, [slotId]);

  if (!slotId || slotId.length < 10) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default ResponsiveAd;
