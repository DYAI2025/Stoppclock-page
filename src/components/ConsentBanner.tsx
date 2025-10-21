import { useEffect, useState } from 'react';
import { hasConsent, grantConsent, loadConsent } from '../utils/consent';

/**
 * GDPR Consent Banner
 *
 * Shows a consent banner on first visit asking user to opt-in to ads and analytics.
 * Complies with GDPR by requiring explicit consent before loading any tracking.
 *
 * Features:
 * - Only shows if user hasn't made a choice
 * - Allows granular consent (ads + analytics separately)
 * - Privacy-first approach (no tracking without consent)
 * - Persistent across sessions
 *
 * Usage:
 * ```tsx
 * <ConsentBanner />
 * ```
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [adsChecked, setAdsChecked] = useState(true);
  const [analyticsChecked, setAnalyticsChecked] = useState(true);

  useEffect(() => {
    // Show banner if user hasn't made a choice
    setVisible(!hasConsent());
  }, []);

  const handleAccept = () => {
    grantConsent(adsChecked, analyticsChecked);
    setVisible(false);

    // Reload to apply consent changes (load AdSense script)
    window.location.reload();
  };

  const handleDecline = () => {
    grantConsent(false, false);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="consent-banner">
      <div className="consent-content">
        <h3>Cookie & Privacy Notice</h3>
        <p>
          We use cookies and similar technologies to improve your experience, show
          relevant ads, and analyze site usage. You can choose which features to enable:
        </p>

        <div className="consent-options">
          <label className="consent-option">
            <input
              type="checkbox"
              checked={adsChecked}
              onChange={(e) => setAdsChecked(e.target.checked)}
            />
            <div>
              <strong>Advertising</strong>
              <span>Show relevant ads to support this free service</span>
            </div>
          </label>

          <label className="consent-option">
            <input
              type="checkbox"
              checked={analyticsChecked}
              onChange={(e) => setAnalyticsChecked(e.target.checked)}
            />
            <div>
              <strong>Analytics</strong>
              <span>Help us understand how you use the site to improve it</span>
            </div>
          </label>
        </div>

        <p className="consent-note">
          We respect your privacy. Your timer data stays on your device and is never sent to our servers.
          <a href="#/privacy" className="privacy-link">Learn more</a>
        </p>

        <div className="consent-actions">
          <button onClick={handleDecline} className="btn consent-decline">
            Decline All
          </button>
          <button onClick={handleAccept} className="btn primary consent-accept">
            {adsChecked || analyticsChecked ? 'Accept Selected' : 'Accept None'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Consent Settings Component
 *
 * Shows current consent status and allows user to change preferences.
 * Can be placed in a settings page or modal.
 */
export function ConsentSettings() {
  const [consent, setConsent] = useState(() => loadConsent());

  const handleToggleAds = (enabled: boolean) => {
    const updated = grantConsent(enabled, consent.analyticsEnabled);
    setConsent(updated);
  };

  const handleToggleAnalytics = (enabled: boolean) => {
    const updated = grantConsent(consent.adsEnabled, enabled);
    setConsent(updated);
  };

  return (
    <div className="consent-settings">
      <h3>Privacy Preferences</h3>

      <label className="consent-setting">
        <div>
          <strong>Advertising</strong>
          <span>Show ads to support this free service</span>
        </div>
        <input
          type="checkbox"
          checked={consent.adsEnabled}
          onChange={(e) => handleToggleAds(e.target.checked)}
        />
      </label>

      <label className="consent-setting">
        <div>
          <strong>Analytics</strong>
          <span>Help us improve with anonymous usage data</span>
        </div>
        <input
          type="checkbox"
          checked={consent.analyticsEnabled}
          onChange={(e) => handleToggleAnalytics(e.target.checked)}
        />
      </label>

      <p className="consent-info">
        Last updated: {consent.timestamp > 0 ? new Date(consent.timestamp).toLocaleDateString() : 'Never'}
      </p>

      {(consent.adsEnabled || consent.analyticsEnabled) && (
        <p className="consent-reload-note">
          Note: Changing these settings will reload the page to apply changes.
        </p>
      )}
    </div>
  );
}
