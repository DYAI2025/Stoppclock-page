import { test, expect } from '@playwright/test';

test.describe('Digital Countdown', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner by setting localStorage
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and function correctly', async ({ page }) => {
    // Navigate to countdown
    await page.goto('/#/countdown');

    // Wait for page to load
    await expect(page.locator('.countdown-wrap')).toBeVisible();

    // Check digital time display
    const display = page.locator('.countdown-display');
    await expect(display).toBeVisible();

    // Set time: 10 minutes 30 seconds
    await page.locator('input[aria-label="Hours"]').fill('0');
    await page.locator('input[aria-label="Minutes"]').fill('10');
    await page.locator('input[aria-label="Seconds"]').fill('30');

    // Verify display shows 00:10:30
    await expect(display).toHaveText('00:10:30');

    // Click Start button
    await page.getByRole('button', { name: 'Start' }).click();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Verify time has decremented (should be around 00:10:28 or 00:10:27)
    const timeText = await display.textContent();
    expect(timeText).toMatch(/00:10:2[78]/);

    // Test Space key pauses
    await page.keyboard.press('Space');
    await expect(page.locator('.countdown-controls button.btn.primary')).toHaveText('Start');

    // Test R key resets
    await page.keyboard.press('r');
    await expect(display).toHaveText('00:10:30');
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    await page.goto('/#/countdown');

    // Set 5 minutes
    await page.locator('input[aria-label="Minutes"]').fill('5');
    await expect(page.locator('.countdown-display')).toHaveText('00:05:00');

    // Blur input field to allow arrow keys to work
    await page.locator('.countdown-wrap').click();

    // Test ArrowUp adds 10s
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('.countdown-display')).toHaveText('00:05:10');

    // Test ArrowDown removes 10s
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.countdown-display')).toHaveText('00:05:00');
  });

  test('should toggle signal options', async ({ page }) => {
    await page.goto('/#/countdown');

    // Check sound checkbox
    const soundCheckbox = page.locator('label.sig').filter({ hasText: 'Sound' }).locator('input[type="checkbox"]');
    await expect(soundCheckbox).toBeChecked();

    // Uncheck sound
    await soundCheckbox.click();
    await expect(soundCheckbox).not.toBeChecked();

    // Check flash checkbox
    const flashCheckbox = page.locator('label.sig').filter({ hasText: 'Flash' }).locator('input[type="checkbox"]');
    await expect(flashCheckbox).toBeChecked();

    // Change warning dropdown
    const warnSelect = page.locator('label.warn select');
    await warnSelect.selectOption('300000'); // 5m
    await expect(warnSelect).toHaveValue('300000');
  });

  test('should persist state across navigation', async ({ page }) => {
    await page.goto('/#/countdown');

    // Set 3 minutes
    await page.locator('input[aria-label="Minutes"]').fill('3');

    // Start timer
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForTimeout(1000);

    // Navigate away
    await page.goto('/#/');
    await expect(page.locator('.grid')).toBeVisible();

    // Navigate back
    await page.goto('/#/countdown');

    // Verify state persisted (time should have continued counting down)
    await expect(page.locator('.countdown-display')).toBeVisible();
    const timeAfterNavigation = await page.locator('.countdown-display').textContent();
    // Should be around 00:02:58 or 00:02:59 (1 second passed)
    expect(timeAfterNavigation).toMatch(/00:02:5[89]/);
  });
});
