import { test, expect } from '@playwright/test';

test.describe('Stopwatch', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and function correctly', async ({ page }) => {
    await page.goto('/#/stopwatch');

    // Wait for page to load
    await expect(page.locator('.stopwatch-wrap')).toBeVisible();

    // Check display starts at 00:00:00.00
    const display = page.locator('.stopwatch-display');
    await expect(display).toHaveText('00:00:00.00');

    // Start stopwatch
    await page.getByRole('button', { name: 'Start' }).click();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Verify time has incremented (should be around 00:00:02.xx)
    const timeText = await display.textContent();
    expect(timeText).toMatch(/00:00:0[12]\.\d{2}/);

    // Test Space key pauses
    await page.keyboard.press('Space');
    await expect(page.locator('.stopwatch-controls button.btn.primary')).toHaveText('Start');

    // Test R key resets
    await page.keyboard.press('r');
    await expect(display).toHaveText('00:00:00.00');
  });

  test('should support lap times', async ({ page }) => {
    await page.goto('/#/stopwatch');

    // Start stopwatch
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForTimeout(1000);

    // Add lap
    await page.getByRole('button', { name: 'Lap' }).click();

    // Verify lap appears
    const lapList = page.locator('.stopwatch-laps');
    await expect(lapList.locator('.lap-item')).toHaveCount(1);

    await page.waitForTimeout(500);

    // Add another lap
    await page.getByRole('button', { name: 'Lap' }).click();
    await expect(lapList.locator('.lap-item')).toHaveCount(2);
  });

  test('should persist state across navigation', async ({ page }) => {
    await page.goto('/#/stopwatch');

    // Start stopwatch
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForTimeout(1000);

    // Navigate away
    await page.goto('/#/');
    await expect(page.locator('.grid')).toBeVisible();

    // Navigate back
    await page.goto('/#/stopwatch');

    // Verify stopwatch continued running
    await expect(page.locator('.stopwatch-display')).toBeVisible();
    const timeAfterNavigation = await page.locator('.stopwatch-display').textContent();
    // Should be around 00:00:01.xx or more (1+ second passed)
    expect(timeAfterNavigation).toMatch(/00:00:0[1-9]\.\d{2}/);
  });
});
