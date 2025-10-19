import { test, expect } from '@playwright/test';

test.describe('Chess Clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load and display two clocks', async ({ page }) => {
    await page.goto('/#/chess');
    await expect(page.locator('.chess-wrap')).toBeVisible();

    // Check both player clocks exist
    const player1 = page.locator('.player-1');
    const player2 = page.locator('.player-2');
    await expect(player1).toBeVisible();
    await expect(player2).toBeVisible();

    // Check initial time
    await expect(player1.locator('.player-time')).toHaveText('05:00');
    await expect(player2.locator('.player-time')).toHaveText('05:00');
  });

  test('should switch between players', async ({ page }) => {
    await page.goto('/#/chess');

    // Start player 1
    await page.locator('.player-1').click();

    // Wait briefly
    await page.waitForTimeout(1000);

    // Switch to player 2
    await page.locator('.player-2').click();

    // Verify player 1 time decreased
    const p1Time = await page.locator('.player-1 .player-time').textContent();
    expect(p1Time).toMatch(/04:5[0-9]/);

    // Reset
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.locator('.player-1 .player-time')).toHaveText('05:00');
  });
});
