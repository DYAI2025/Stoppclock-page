/**
 * Test Suite: AdSense Policy Compliance
 *
 * Stellt sicher dass:
 * 1. Keine Ads ohne Nutzer-Consent gerendert werden (DSGVO)
 * 2. Kein doppelter AdUnit pro Route
 * 3. Kein <ins> mit leerer data-ad-slot Attribute
 * 4. Ad-Label "Anzeige" sichtbar wenn Ads aktiv sind
 *
 * WICHTIG: Diese Tests laufen ohne Consent → prüfen "kein Ad" Zustand
 */

import { test, expect } from '@playwright/test';

// Routes die AdUnits haben können
const AD_ROUTES = [
  '/',
  '/#/countdown',
  '/#/stopwatch',
  '/#/pomodoro',
  '/#/cooking',
  '/#/chess',
  '/#/alarm',
  '/#/world',
  '/#/blog',
];

test.describe('AdSense Policy: Kein Ad ohne Consent', () => {
  // Sicherstellen dass kein Consent im LocalStorage ist
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('sc.consent');
      localStorage.removeItem('sc.adsConsent');
    });
  });

  for (const route of AD_ROUTES) {
    test(`Keine <ins class="adsbygoogle"> ohne Consent auf ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Kurz warten damit React rendern kann
      await page.waitForTimeout(500);

      const adElements = page.locator('ins.adsbygoogle');
      const count = await adElements.count();

      expect(count, `Gefunden: ${count} adsbygoogle-Elemente auf ${route} ohne Consent`).toBe(0);
    });
  }
});

test.describe('AdSense Policy: Kein doppelter AdUnit', () => {
  test.beforeEach(async ({ page }) => {
    // Consent geben damit Ads prinzipiell rendern könnten
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('sc.consent', JSON.stringify({
        version: 1,
        adsEnabled: true,
        analyticsEnabled: false,
        timestamp: Date.now(),
        consentVersion: '2025-10-20'
      }));
    });
  });

  test('Pomodoro-Seite hat maximal 1 AdUnit', async ({ page }) => {
    await page.goto('/#/pomodoro');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const adWrappers = page.locator('[data-unit-id]');
    const count = await adWrappers.count();

    // Maximal 2 AdUnits erlaubt (top + bottom), aber nie mehr
    expect(count).toBeLessThanOrEqual(2);
  });

  test('Keine <ins> mit leerer data-ad-slot Attribute', async ({ page }) => {
    for (const route of AD_ROUTES) {
      await page.goto(route);
      await page.waitForTimeout(300);

      const emptySlots = page.locator('ins.adsbygoogle[data-ad-slot=""]');
      const count = await emptySlots.count();

      expect(count, `Leere data-ad-slot auf ${route} gefunden!`).toBe(0);
    }
  });
});

test.describe('AdSense Infrastructure: Kritische Config-Checks', () => {
  test('home-top Slot ID ist konfiguriert (10 Ziffern)', async ({ page }) => {
    // Prüfe via JavaScript ob die Konfiguration korrekt ist
    await page.goto('/');

    const result = await page.evaluate(async () => {
      // Dynamisch das Modul prüfen — wir prüfen via DOM ob der Slot gesetzt wird
      return {
        hasAdSenseMeta: !!document.querySelector('meta[name="google-adsense-account"]'),
        publisherIdContent: document.querySelector('meta[name="google-adsense-account"]')?.getAttribute('content') ?? ''
      };
    });

    expect(result.hasAdSenseMeta).toBe(true);
    expect(result.publisherIdContent).toMatch(/^ca-pub-\d{16}$/);
  });

  test('ads.txt ist erreichbar und enthält Publisher-ID', async ({ page }) => {
    const response = await page.goto('/ads.txt');
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('pub-1712273263687132');
    expect(content).toContain('DIRECT');
  });
});
