import { test, expect } from '@playwright/test';

test.describe('Metronome', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and display BPM controls', async ({ page }) => {
    await page.goto('/#/metronome');
    await expect(page.locator('.metronome-wrap')).toBeVisible();

    // Check BPM display
    const bpmDisplay = page.locator('.bpm-display');
    await expect(bpmDisplay).toBeVisible();

    // Check start button
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('should adjust BPM', async ({ page }) => {
    await page.goto('/#/metronome');

    // Increase BPM
    await page.locator('button').filter({ hasText: '+' }).click();

    // Decrease BPM
    await page.locator('button').filter({ hasText: '−' }).click();

    // Start metronome
    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible();

    // Stop metronome
    await page.getByRole('button', { name: 'Stop' }).click();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });
});
