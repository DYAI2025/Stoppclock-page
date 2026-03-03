/**
 * Test Suite: SEO Meta Tags
 *
 * Stellt sicher dass:
 * 1. Jede Route hat einen einzigartigen, relevanten Titel
 * 2. Meta-Description ist vorhanden und nicht zu kurz
 * 3. Canonical-URL gesetzt und korrekt
 * 4. Open Graph Tags vollständig
 * 5. Blog-Posts haben BlogPosting JSON-LD Schema
 * 6. robots meta-Tag korrekt (noindex für rechtliche Seiten)
 */

import { test, expect } from '@playwright/test';

interface SEOExpected {
  route: string;
  titleContains: string;
  descriptionMinLength: number;
  canonical: string;
  noindex?: boolean;
  hasSchema?: boolean;
}

const SEO_EXPECTATIONS: SEOExpected[] = [
  {
    route: '/',
    titleContains: 'Stoppclock',
    descriptionMinLength: 80,
    canonical: 'https://www.stoppclock.com/',
  },
  {
    route: '/#/countdown',
    titleContains: 'Countdown',
    descriptionMinLength: 80,
    canonical: 'https://www.stoppclock.com/countdown',
  },
  {
    route: '/#/stopwatch',
    titleContains: 'Stoppuhr',
    descriptionMinLength: 80,
    canonical: 'https://www.stoppclock.com/stopwatch',
  },
  {
    route: '/#/pomodoro',
    titleContains: 'Pomodoro',
    descriptionMinLength: 80,
    canonical: 'https://www.stoppclock.com/pomodoro',
  },
  {
    route: '/#/alarm',
    titleContains: 'Wecker',
    descriptionMinLength: 80,
    canonical: 'https://www.stoppclock.com/alarm',
  },
  {
    route: '/#/blog/pomodoro-timer-online',
    titleContains: 'Pomodoro',
    descriptionMinLength: 100,
    canonical: 'https://www.stoppclock.com/blog/pomodoro-timer-online',
    hasSchema: true,
  },
  {
    route: '/#/blog/stoppuhr-online-guide',
    titleContains: 'Stoppuhr',
    descriptionMinLength: 80,
    canonical: 'https://www.stoppclock.com/blog/stoppuhr-online-guide',
    hasSchema: true,
  },
  {
    route: '/#/impressum',
    titleContains: 'Impressum',
    descriptionMinLength: 20,
    canonical: 'https://www.stoppclock.com/impressum',
    noindex: true,
  },
];

test.describe('SEO: Meta-Tags pro Route', () => {
  for (const expected of SEO_EXPECTATIONS) {
    test(`SEO korrekt: ${expected.route}`, async ({ page }) => {
      await page.goto(expected.route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400); // JS SEO-Hook Zeit lassen

      // ── Title ───────────────────────────────────────────────────────────
      const title = await page.title();
      expect(title, `Title auf ${expected.route} fehlt oder zu kurz`).toBeTruthy();
      expect(title.length, `Title zu kurz: "${title}"`).toBeGreaterThan(15);
      expect(title.length, `Title zu lang: "${title}" (${title.length} Zeichen)`).toBeLessThanOrEqual(70);
      expect(title, `Title enthält nicht "${expected.titleContains}"`).toContain(expected.titleContains);

      // ── Meta Description ────────────────────────────────────────────────
      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description, `Meta-Description auf ${expected.route} fehlt`).toBeTruthy();
      expect(
        description!.length,
        `Description zu kurz: "${description}" (${description?.length} Zeichen)`
      ).toBeGreaterThan(expected.descriptionMinLength);
      expect(description!.length, 'Description zu lang (> 165 Zeichen)').toBeLessThanOrEqual(165);

      // ── Canonical ────────────────────────────────────────────────────────
      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical, `Canonical-Tag fehlt auf ${expected.route}`).toBeTruthy();
      expect(canonical, `Canonical stimmt nicht: erwartet "${expected.canonical}", bekommen "${canonical}"`).toBe(expected.canonical);

      // ── Open Graph ────────────────────────────────────────────────────────
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle, `og:title fehlt auf ${expected.route}`).toBeTruthy();

      const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
      expect(ogDescription, `og:description fehlt auf ${expected.route}`).toBeTruthy();

      const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
      expect(ogImage, `og:image fehlt auf ${expected.route}`).toBeTruthy();
      expect(ogImage, 'og:image muss absolute URL sein').toMatch(/^https?:\/\//);

      // ── Robots ────────────────────────────────────────────────────────────
      const robots = await page.getAttribute('meta[name="robots"]', 'content');
      if (expected.noindex) {
        expect(robots, `noindex fehlt auf ${expected.route}`).toContain('noindex');
      } else if (robots) {
        expect(robots, `Unerwartetes noindex auf ${expected.route}`).not.toContain('noindex');
      }

      // ── JSON-LD Schema für Blog-Posts ────────────────────────────────────
      if (expected.hasSchema) {
        const schemaScript = page.locator('script[type="application/ld+json"]').last();
        const schemaText = await schemaScript.textContent();
        expect(schemaText, 'JSON-LD Script fehlt').toBeTruthy();

        const schema = JSON.parse(schemaText!);
        const hasBlogPosting = JSON.stringify(schema).includes('BlogPosting');
        expect(hasBlogPosting, `BlogPosting Schema fehlt auf ${expected.route}`).toBe(true);
      }
    });
  }
});

test.describe('SEO: Sitemap erreichbar', () => {
  test('sitemap.xml liefert 200 und ist valide XML', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toContain('xml');

    const content = await page.content();
    expect(content).toContain('<urlset');
    expect(content).toContain('https://www.stoppclock.com/');
    expect(content).toContain('https://www.stoppclock.com/countdown');
    expect(content).toContain('https://www.stoppclock.com/blog/pomodoro-timer-online');
    // Neue Blog-Posts
    expect(content).toContain('https://www.stoppclock.com/blog/stoppuhr-online-guide');
    expect(content).toContain('https://www.stoppclock.com/blog/intervalltimer-hiit');
  });

  test('robots.txt ist korrekt konfiguriert', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('User-agent');
    expect(content).toContain('Sitemap:');
    expect(content).toContain('stoppclock.com/sitemap.xml');
  });
});

test.describe('SEO: Titel-Einzigartigkeit', () => {
  test('Verschiedene Routen haben verschiedene Titel', async ({ page }) => {
    const titles: string[] = [];

    for (const expected of SEO_EXPECTATIONS.slice(0, 5)) {
      await page.goto(expected.route);
      await page.waitForTimeout(300);
      titles.push(await page.title());
    }

    // Alle Titel müssen einzigartig sein
    const uniqueTitles = new Set(titles);
    expect(
      uniqueTitles.size,
      `Duplikat-Titel gefunden: ${JSON.stringify(titles)}`
    ).toBe(titles.length);
  });
});
