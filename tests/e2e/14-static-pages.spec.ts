/**
 * Test Suite: Statische SEO-Landingpages
 *
 * Prüft dass alle statischen HTML-Landingpages:
 * 1. HTTP 200 zurückgeben
 * 2. Korrekte meta-Tags haben
 * 3. Canonical-URL gesetzt ist
 * 4. CTA-Link zur App funktioniert
 */

import { test, expect } from '@playwright/test';

interface StaticPage {
  url: string;
  titleContains: string;
  canonical: string;
  ctaText?: string;
}

const STATIC_PAGES: StaticPage[] = [
  {
    url: '/5-minuten-timer',
    titleContains: '5 Minuten',
    canonical: 'https://www.stoppclock.com/5-minuten-timer',
  },
  {
    url: '/10-minuten-timer',
    titleContains: '10 Minuten',
    canonical: 'https://www.stoppclock.com/10-minuten-timer',
  },
  {
    url: '/25-minuten-timer',
    titleContains: '25 Minuten',
    canonical: 'https://www.stoppclock.com/25-minuten-timer',
  },
  {
    url: '/30-minuten-timer',
    titleContains: '30 Minuten',
    canonical: 'https://www.stoppclock.com/30-minuten-timer',
  },
  {
    url: '/60-minuten-timer',
    titleContains: '60 Minuten',
    canonical: 'https://www.stoppclock.com/60-minuten-timer',
  },
  {
    url: '/stoppuhr',
    titleContains: 'Stoppuhr',
    canonical: 'https://www.stoppclock.com/stoppuhr',
  },
];

test.describe('Statische SEO-Landingpages', () => {
  for (const page_config of STATIC_PAGES) {
    test(`${page_config.url} — HTTP 200 + Meta-Tags`, async ({ page }) => {
      const response = await page.goto(page_config.url);

      // HTTP Status
      expect(
        response?.status(),
        `${page_config.url} gibt nicht HTTP 200 zurück`
      ).toBe(200);

      // Title
      const title = await page.title();
      expect(title, `Title fehlt auf ${page_config.url}`).toBeTruthy();
      expect(
        title,
        `Title enthält nicht "${page_config.titleContains}" auf ${page_config.url}`
      ).toContain(page_config.titleContains);

      // Meta Description
      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description, `Meta-Description fehlt auf ${page_config.url}`).toBeTruthy();
      expect(description!.length, 'Description zu kurz').toBeGreaterThan(60);

      // Canonical
      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical, `Canonical fehlt auf ${page_config.url}`).toBe(page_config.canonical);

      // H1
      const h1 = page.locator('h1').first();
      await expect(h1, `H1 fehlt auf ${page_config.url}`).toBeVisible();

      // CTA-Link zur App
      const appLink = page.locator('a[href*="/#/"]').first();
      const linkCount = await page.locator('a[href*="/#/"]').count();
      expect(linkCount, `Kein CTA-Link zur App auf ${page_config.url}`).toBeGreaterThan(0);

      // JSON-LD vorhanden
      const schemaScript = page.locator('script[type="application/ld+json"]');
      const schemaCount = await schemaScript.count();
      expect(schemaCount, `JSON-LD fehlt auf ${page_config.url}`).toBeGreaterThan(0);
    });
  }
});

test.describe('Statische Seiten: Keyword-Präsenz', () => {
  test('/10-minuten-timer — Keyword "10 Minuten" im Body', async ({ page }) => {
    await page.goto('/10-minuten-timer');
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('10 Minuten');
    expect(bodyText).toContain('Timer');
    // Mindest-Wortanzahl
    expect(bodyText!.split(/\s+/).length).toBeGreaterThan(200);
  });

  test('/stoppuhr — Keyword "Stoppuhr" und "Lap" im Body', async ({ page }) => {
    await page.goto('/stoppuhr');
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Stoppuhr');
    expect(bodyText).toContain('Lap');
  });

  test('/30-minuten-timer — FAQ-Schema vorhanden', async ({ page }) => {
    await page.goto('/30-minuten-timer');
    const schemas = page.locator('script[type="application/ld+json"]');

    let hasFAQ = false;
    const count = await schemas.count();
    for (let i = 0; i < count; i++) {
      const text = await schemas.nth(i).textContent();
      if (text?.includes('FAQPage')) {
        hasFAQ = true;
        break;
      }
    }

    expect(hasFAQ, 'FAQPage Schema fehlt auf /30-minuten-timer').toBe(true);
  });
});
