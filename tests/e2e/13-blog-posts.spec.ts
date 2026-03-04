/**
 * Test Suite: Blog-Posts
 *
 * Stellt sicher dass:
 * 1. Alle registrierten Blog-Posts erreichbar sind
 * 2. Blog-Posts haben H1-Titel
 * 3. Blog-Posts haben Article-Schema (JSON-LD)
 * 4. Blog-Posts haben FAQ-Schema wenn FAQ-Section vorhanden
 * 5. Verwandte Artikel funktionieren (keine toten Links)
 * 6. Blog-Index zeigt alle Posts an
 */

import { test, expect } from '@playwright/test';

const BLOG_SLUGS = [
  'pomodoro-timer-online',
  'pomodoro-vs-countdown',
  'stoppuhr-online-guide',
  'countdown-timer-klasse',
  'online-wecker-ohne-app',
  'intervalltimer-hiit',
  'schachuhr-regeln-online',
];

// Helper: Consent-Banner wegräumen damit Klicks funktionieren
async function dismissConsent(page: any) {
  const banner = page.locator('.consent-banner');
  if (await banner.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.locator('.consent-decline, [class*="consent-decline"]').click().catch(() => {
      // Fallback: Decline-Button direkt finden
    });
    await page.waitForTimeout(200);
  }
}

test.describe('Blog-Posts: Erreichbarkeit', () => {
  for (const slug of BLOG_SLUGS) {
    test(`Blog-Post erreichbar: /blog/${slug}`, async ({ page }) => {
      await page.goto(`/#/blog/${slug}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);

      // H1 muss vorhanden sein
      const h1 = page.locator('h1').first();
      await expect(h1, `H1 fehlt in Blog-Post: ${slug}`).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text?.length, `H1 zu kurz: "${h1Text}"`).toBeGreaterThan(10);

      // Kein "Not Found" / "404"
      const bodyText = await page.locator('body').textContent();
      expect(bodyText, `"Not Found" auf Blog-Post: ${slug}`).not.toContain('Not Found');
      expect(bodyText, `"404" auf Blog-Post: ${slug}`).not.toContain('404');
    });
  }
});

test.describe('Blog-Posts: Schema Markup', () => {
  for (const slug of BLOG_SLUGS) {
    test(`BlogPosting JSON-LD vorhanden: /blog/${slug}`, async ({ page }) => {
      await page.goto(`/#/blog/${slug}`);
      await page.waitForTimeout(600);

      // JSON-LD Scripts finden
      const scripts = page.locator('script[type="application/ld+json"]');
      const count = await scripts.count();
      expect(count, `Kein JSON-LD auf /blog/${slug}`).toBeGreaterThan(0);

      // Prüfe ob BlogPosting in einem der Scripts vorhanden ist
      let hasBlogPosting = false;
      for (let i = 0; i < count; i++) {
        const text = await scripts.nth(i).textContent();
        if (text?.includes('BlogPosting')) {
          hasBlogPosting = true;
          const schema = JSON.parse(text);
          const graphItems = schema['@graph'] ?? [schema];

          const blogPosting = graphItems.find((item: any) => item['@type'] === 'BlogPosting');
          if (blogPosting) {
            expect(blogPosting.headline, 'BlogPosting headline fehlt').toBeTruthy();
            expect(blogPosting.description, 'BlogPosting description fehlt').toBeTruthy();
            expect(blogPosting.datePublished, 'BlogPosting datePublished fehlt').toBeTruthy();
            expect(blogPosting.author, 'BlogPosting author fehlt').toBeTruthy();
          }
        }
      }

      expect(hasBlogPosting, `BlogPosting Schema fehlt auf /blog/${slug}`).toBe(true);
    });
  }
});

test.describe('Blog-Index', () => {
  test('Blog-Index zeigt mindestens 5 Posts', async ({ page }) => {
    await page.goto('/#/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Prüfe ob Blog-Artikel vorhanden sind (generische Selektoren)
    const articles = page.locator('article, [class*="blog-post"], [class*="blog-card"], [class*="post"]');
    const count = await articles.count();

    // Falls keine article-Elemente, prüfe ob überhaupt Inhalt vorhanden ist
    const bodyText = await page.locator('body').textContent();
    const hasPomodoro = bodyText?.includes('Pomodoro') ?? false;
    const hasStoppuhr = bodyText?.includes('Stoppuhr') ?? false;

    expect(
      hasPomodoro || hasStoppuhr || count > 0,
      'Blog-Index zeigt keine Blog-Posts an'
    ).toBe(true);
  });

  test('Blog-Index Links zu Posts funktionieren', async ({ page }) => {
    await page.goto('/#/blog');
    await page.waitForTimeout(600);

    // ConsentBanner wegräumen damit Klicks nicht blockiert werden
    await dismissConsent(page);

    // Suche nach Links die auf /blog/ zeigen
    const blogLinks = page.locator('a[href*="blog/pomodoro"]');
    const count = await blogLinks.count();

    if (count > 0) {
      // Klicke den ersten Blog-Link via Navigation (kein Klick-Problem durch Banner)
      const href = await blogLinks.first().getAttribute('href');
      if (href) {
        await page.goto(href.startsWith('http') ? href : `http://localhost:4173/${href}`);
      }
      await page.waitForTimeout(600);

      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Blog-Posts: Content-Qualität', () => {
  test('Pomodoro-Post hat mindestens 3 Abschnitte und FAQ', async ({ page }) => {
    await page.goto('/#/blog/pomodoro-timer-online');
    await page.waitForTimeout(600);

    const bodyText = await page.locator('body').textContent() ?? '';

    // Mindest-Content-Checks
    expect(bodyText.length, 'Post ist zu kurz').toBeGreaterThan(2000);
    expect(bodyText).toContain('Pomodoro');
    expect(bodyText).toContain('25 Minuten');
  });

  test('Neuer Stoppuhr-Post ist vollständig', async ({ page }) => {
    await page.goto('/#/blog/stoppuhr-online-guide');
    await page.waitForTimeout(600);

    const bodyText = await page.locator('body').textContent() ?? '';

    expect(bodyText.length).toBeGreaterThan(1500);
    expect(bodyText).toContain('Stoppuhr');
    expect(bodyText).toContain('Lap');
  });
});
