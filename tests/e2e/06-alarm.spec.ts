import { test, expect } from '@playwright/test';

test.describe('Alarm', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and display alarm list', async ({ page }) => {
    await page.goto('/#/alarm');
    await expect(page.locator('.alarm-wrap')).toBeVisible();

    // Check add alarm button
    const addButton = page.getByRole('button', { name: 'Add Alarm' });
    await expect(addButton).toBeVisible();
  });

  test('should add and remove alarms', async ({ page }) => {
    await page.goto('/#/alarm');

    // Add alarm
    await page.getByRole('button', { name: 'Add Alarm' }).click();

    // Set time
    await page.locator('input[type="time"]').fill('14:30');

    // Save
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify alarm appears
    const alarmList = page.locator('.alarm-list');
    await expect(alarmList.locator('.alarm-item')).toHaveCount(1);

    // Remove alarm
    await page.locator('.alarm-item button').click();
    await expect(alarmList.locator('.alarm-item')).toHaveCount(0);
  });
});
