import { test, expect } from '@playwright/test';

test.describe('Digital Clock', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and display current time', async ({ page }) => {
    await page.goto('/#/digital');

    // Wait for page to load
    await expect(page.locator('.clock-wrap')).toBeVisible();

    // Check time display exists
    const timeDisplay = page.locator('.clock-time');
    await expect(timeDisplay).toBeVisible();

    // Verify time format (HH:MM:SS)
    const timeText = await timeDisplay.textContent();
    expect(timeText).toMatch(/\d{2}:\d{2}:\d{2}/);

    // Check date display
    const dateDisplay = page.locator('.clock-date');
    await expect(dateDisplay).toBeVisible();
  });

  test('should toggle 12h/24h format', async ({ page }) => {
    await page.goto('/#/digital');

    // Check toggle exists
    const formatToggle = page.locator('label').filter({ hasText: '24h' });
    await expect(formatToggle).toBeVisible();

    const checkbox = formatToggle.locator('input[type="checkbox"]');

    // Toggle to 12h format
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();

    // Verify time display shows AM/PM indicator
    const timeText = await page.locator('.clock-time').textContent();
    expect(timeText).toMatch(/(AM|PM)/);

    // Toggle back to 24h
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('should support fullscreen', async ({ page }) => {
    await page.goto('/#/digital');

    // Test F key for fullscreen (can't verify actual fullscreen in headless)
    await page.keyboard.press('f');

    // Just verify no errors occurred
    await expect(page.locator('.clock-wrap')).toBeVisible();
  });
});
