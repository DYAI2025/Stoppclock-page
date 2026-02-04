import React, { useState, useEffect } from 'react';

/**
 * Service Worker update notification component
 * Implements FR-055 to FR-057: Update detection and notification
 */
export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration;

    async function setup() {
      try {
        registration = await navigator.serviceWorker.register('/sw.js');

        // Check for updates every 30 seconds (SC-010 requirement)
        const interval = setInterval(() => {
          registration.update();
        }, 30000);

        // Listen for new service worker waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker installed, show update prompt
              setUpdateAvailable(true);
            }
          });
        });

        return () => clearInterval(interval);
      } catch (err) {
        console.error('Service worker registration failed:', err);
      }
    }

    setup();
  }, []);

  function handleUpdate() {
    // Send message to service worker to skip waiting
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });

    // Reload page to use new service worker
    window.location.reload();
  }

  function handleLater() {
    setUpdateAvailable(false);
  }

  if (!updateAvailable) return null;

  return (
    <div className="update-notification">
      <div className="update-content">
        <p>🎉 New version available!</p>
        <div className="update-buttons">
          <button type="button" className="btn primary" onClick={handleUpdate}>
            Reload
          </button>
          <button type="button" className="btn" onClick={handleLater}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
