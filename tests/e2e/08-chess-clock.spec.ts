import { test, expect } from '@playwright/test';

test.describe('Chess Clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
      localStorage.removeItem('sc.v1.chessclock');
    });
  });

  test('should load World Page first', async ({ page }) => {
    await page.goto('/#/chess');
    
    // Should see the Hero section info
    await expect(page.locator('h1')).toHaveText('Chess Timer');
    await expect(page.locator('text=The Time Referee')).toBeVisible();
    
    // Should NOT see the player clocks yet
    await expect(page.locator('.player-1')).not.toBeVisible();
  });

  test('should navigate to timer and play', async ({ page }) => {
    await page.goto('/#/chess');

    // Click CTA
    await page.click('text=Open Chess Timer');

    // Now player should be visible
    await expect(page.locator('.player-1')).toBeVisible();
    
    // Start P1
    await page.locator('.player-1').click();
    await page.waitForTimeout(500);
    
    // Switch to P2
    await page.locator('.player-1').click(); 
    // (Note: in the code, clicking active player switches to opponent)
    
    // Verify P2 is active (class check or logic check)
    // The existing code toggles active class
    await expect(page.locator('.player-2')).toHaveClass(/active/);
  });

  test('should respect Smart Resume', async ({ page }) => {
    // Inject active game state
    await page.addInitScript(() => {
        const now = Date.now();
        const state = {
            version: 1,
            player1Time: 300000,
            player2Time: 300000,
            activePlayer: 1,
            startedAt: now
        };
        localStorage.setItem('sc.v1.chessclock', JSON.stringify(state));
    });

    await page.goto('/#/chess');

    // Should skip World Page and go straight to Player
    await expect(page.locator('.player-1')).toBeVisible();
    await expect(page.locator('.player-1')).toHaveClass(/active/);
  });

  test('should return to story from player', async ({ page }) => {
      await page.goto('/#/chess');
      await page.click('text=Open Chess Timer');
      
      // Click Back button
      await page.click('text=Back to Story');
      
      // Should be back at World Page
      await expect(page.locator('text=The Time Referee')).toBeVisible();
  });
});
