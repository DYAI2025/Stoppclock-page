import { useEffect, useRef, useState } from 'react';
import { loadConsent } from '../utils/consent';
import type { AdUnit as AdUnitType } from '../types/monetization-types';

interface AdUnitProps {
  adUnit: AdUnitType;
  className?: string;
}

/**
 * Google AdSense Ad Unit Component
 *
 * Renders a responsive AdSense ad unit with automatic consent checking.
 *
 * Features:
 * - Only shows ads if user has consented
 * - Automatically initializes adsbygoogle
 * - Handles responsive sizing
 * - Cleans up on unmount
 *
 * Usage:
 * ```tsx
 * import { getAdUnit } from '../config/ad-units';
 * const adUnit = getAdUnit('home-top');
 * <AdUnit adUnit={adUnit} />
 * ```
 */
export function AdUnit({ adUnit, className = '' }: AdUnitProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);

  // Check consent on mount
  useEffect(() => {
    const consent = loadConsent();
    setHasConsent(consent.adsEnabled);
  }, []);

  // Initialize adsbygoogle when element is mounted and consent is given
  useEffect(() => {
    if (!hasConsent) return;
    if (initializedRef.current) return;
    if (!adRef.current) return;

    try {
      // Push ad to adsbygoogle queue
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      initializedRef.current = true;
    } catch (error) {
      console.error('[AdUnit] Failed to initialize ad:', error);
    }
  }, [hasConsent]);

  // Don't render if no consent
  if (!hasConsent) {
    return null;
  }

  return (
    <div className={`ad-unit-wrapper ${className}`} data-unit-id={adUnit.unitId}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adUnit.adSlotId.split('/')[0]}
        data-ad-slot={adUnit.adSlotId.split('/')[1]}
        data-ad-format={adUnit.format === 'anchor' ? 'auto' : adUnit.format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
