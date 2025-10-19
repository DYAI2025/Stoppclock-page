import { test, expect } from '@playwright/test';

test.describe('World Clock', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and display multiple timezones', async ({ page }) => {
    await page.goto('/#/world');

    // Wait for page to load
    await expect(page.locator('.world-wrap')).toBeVisible();

    // Check that at least one timezone is displayed
    const timezoneList = page.locator('.timezone-list');
    await expect(timezoneList).toBeVisible();

    // Should have default timezones (UTC, New York, London, Tokyo)
    const timezones = page.locator('.timezone-item');
    await expect(timezones).toHaveCount(4);
  });

  test('should add and remove timezones', async ({ page }) => {
    await page.goto('/#/world');

    // Check add timezone button exists
    const addButton = page.getByRole('button', { name: 'Add Timezone' });
    await expect(addButton).toBeVisible();

    // Click add timezone
    await addButton.click();

    // Select a timezone from dropdown
    const select = page.locator('select');
    await select.selectOption('America/Los_Angeles');

    // Confirm add
    await page.getByRole('button', { name: 'Add' }).click();

    // Verify new timezone was added
    const timezones = page.locator('.timezone-item');
    await expect(timezones).toHaveCount(5);

    // Test remove timezone
    const removeButton = page.locator('.timezone-item').first().locator('button');
    await removeButton.click();

    // Verify timezone was removed
    await expect(timezones).toHaveCount(4);
  });
});
