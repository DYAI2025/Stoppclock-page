import { useEffect } from "react";
import { ADSENSE_PUBLISHER_ID, HOME_TOP_SLOT_ID } from "../../config/ad-units";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

const ResponsiveAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[AdSense] Unable to request ad slot", error);
      }
    }
  }, []);

  return (
    <div className="ad-container" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={HOME_TOP_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default ResponsiveAd;
