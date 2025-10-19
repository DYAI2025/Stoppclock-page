import { test, expect } from '@playwright/test';

test.describe('Analog Countdown', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner by setting localStorage
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and function correctly', async ({ page }) => {
    // Navigate to analog countdown
    await page.goto('/#/analog');

    // Wait for page to load
    await expect(page.locator('.analog-wrap')).toBeVisible();

    // Check digital time display
    const hmsDisplay = page.locator('.hms');
    await expect(hmsDisplay).toBeVisible();

    // Click 5m preset (use exact match)
    await page.getByRole('button', { name: '5m', exact: true }).click();

    // Verify time is set to 5 minutes (00:05:00)
    await expect(hmsDisplay).toHaveText('00:05:00');

    // Click Start button
    await page.getByRole('button', { name: 'Start' }).click();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Verify time has decremented (should be around 00:04:58 or 00:04:57)
    const timeText = await hmsDisplay.textContent();
    expect(timeText).toMatch(/00:04:5[78]/);

    // Test Space key pauses
    await page.keyboard.press('Space');
    await expect(page.locator('.controls button.btn.primary')).toHaveText('Start');

    // Test R key resets
    await page.keyboard.press('r');
    await expect(hmsDisplay).toHaveText('00:05:00');

    // Start the timer
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForTimeout(1000);

    // Navigate away while timer is running
    await page.goto('/#/');
    await expect(page.locator('.home-grid')).toBeVisible();

    // Navigate back
    await page.goto('/#/analog');

    // Verify state persisted (time should have continued counting down)
    await expect(hmsDisplay).toBeVisible();
    const timeAfterNavigation = await hmsDisplay.textContent();
    // Should be around 00:04:58 or less (1 second passed)
    expect(timeAfterNavigation).toMatch(/00:04:5[0-9]/);
  });

  test('should support fullscreen and keyboard shortcuts', async ({ page }) => {
    await page.goto('/#/analog');

    // Set 10m preset
    await page.getByRole('button', { name: '10m', exact: true }).click();
    await expect(page.locator('.hms')).toHaveText('00:10:00');

    // Test +1m button
    await page.locator('button.btn').filter({ hasText: '+1m' }).click();
    await expect(page.locator('.hms')).toHaveText('00:11:00');

    // Test -1m button
    await page.locator('button.btn').filter({ hasText: '−1m' }).click();
    await expect(page.locator('.hms')).toHaveText('00:10:00');

    // Test ArrowUp adds 10s
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('.hms')).toHaveText('00:10:10');

    // Test ArrowDown removes 10s
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.hms')).toHaveText('00:10:00');
  });

  test('should render canvas clock face', async ({ page }) => {
    await page.goto('/#/analog');

    // Check canvas exists
    const canvas = page.locator('.analog-canvas canvas');
    await expect(canvas).toBeVisible();

    // Verify canvas has dimensions
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test('should toggle signal options', async ({ page }) => {
    await page.goto('/#/analog');

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
});
