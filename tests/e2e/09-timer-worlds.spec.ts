import { test, expect } from '@playwright/test';

test.describe('Timer Worlds', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sc.adsConsent', 'no');
    });
  });

  test('should load Pomodoro world with all sections', async ({ page }) => {
    await page.goto('/#/wissen/pomodoro');
    
    // Check breadcrumb navigation
    await expect(page.locator('.breadcrumb')).toBeVisible();
    await expect(page.locator('.breadcrumb-link').first()).toHaveText('Home');
    await expect(page.locator('.breadcrumb-current')).toContainText('Pomodoro');
    
    // Check hero section
    await expect(page.locator('.world-title')).toContainText('Pomodoro');
    await expect(page.locator('.world-tagline')).toBeVisible();
    await expect(page.locator('.world-character')).toBeVisible();
    await expect(page.locator('.open-timer-button')).toBeVisible();
    
    // Check Table of Contents
    await expect(page.locator('.table-of-contents')).toBeVisible();
    await expect(page.locator('.toc-link')).toHaveCount(3); // Rituals, Effects, Facts
    
    // Check sections are present
    await expect(page.locator('#rituals')).toBeVisible();
    await expect(page.locator('#effects')).toBeVisible();
    await expect(page.locator('#facts')).toBeVisible();
    
    // Check content items
    await expect(page.locator('.ritual-card')).toHaveCount(3);
    await expect(page.locator('.effect-item')).toHaveCount(3);
    await expect(page.locator('.fact-plaque')).toHaveCount(3);
  });

  test('should navigate to Countdown world', async ({ page }) => {
    await page.goto('/#/wissen/countdown');
    
    await expect(page.locator('.world-title')).toContainText('Countdown');
    await expect(page.locator('.world-tagline')).toContainText('Time is running out');
    
    // Verify countdown-specific content
    await expect(page.locator('.ritual-card')).toHaveCount(3);
    await expect(page.locator('.effect-item')).toHaveCount(3);
    await expect(page.locator('.fact-plaque')).toHaveCount(3);
  });

  test('should navigate to Stopwatch world', async ({ page }) => {
    await page.goto('/#/wissen/stopwatch');
    
    await expect(page.locator('.world-title')).toContainText('Stopwatch');
    await expect(page.locator('.world-tagline')).toContainText('Infinite Witness');
    
    // Verify stopwatch-specific content
    await expect(page.locator('.ritual-card')).toHaveCount(3);
    await expect(page.locator('.effect-item')).toHaveCount(3);
    await expect(page.locator('.fact-plaque')).toHaveCount(3);
  });

  test('should navigate to Chess world', async ({ page }) => {
    await page.goto('/#/wissen/chess');
    
    await expect(page.locator('.world-title')).toContainText('Chess Clock');
    await expect(page.locator('.world-tagline')).toContainText('Time Referee');
    
    // Chess has 2 rituals
    await expect(page.locator('.ritual-card')).toHaveCount(2);
    await expect(page.locator('.effect-item')).toHaveCount(3);
    await expect(page.locator('.fact-plaque')).toHaveCount(3);
  });

  test('should navigate via breadcrumb', async ({ page }) => {
    await page.goto('/#/wissen/pomodoro');
    
    // Click Home in breadcrumb
    await page.locator('.breadcrumb-link').first().click();
    await expect(page).toHaveURL(/\/#\/$/);
    
    // Go back to a world
    await page.goto('/#/wissen/countdown');
    
    // Click Wissen in breadcrumb
    await page.locator('.breadcrumb-link').nth(1).click();
    // Should stay on page since #/wissen base route doesn't exist
    await expect(page.locator('.world-title')).toBeVisible();
  });

  test('should navigate via Table of Contents', async ({ page }) => {
    await page.goto('/#/wissen/pomodoro');
    
    // Click on Facts in ToC
    await page.locator('.toc-link').filter({ hasText: 'Facts' }).click();
    
    // Wait for smooth scroll
    await page.waitForTimeout(500);
    
    // Check that Facts section is in viewport
    const factsSection = page.locator('#facts');
    await expect(factsSection).toBeInViewport();
  });

  test('should show scroll reveal animations', async ({ page }) => {
    await page.goto('/#/wissen/countdown');
    
    // Elements should start with scroll-reveal class
    const ritualCards = page.locator('.ritual-card').first();
    await expect(ritualCards.locator('..')).toHaveClass(/scroll-reveal/);
    
    // After scrolling into view, should have 'revealed' class
    await ritualCards.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await expect(ritualCards.locator('..')).toHaveClass(/revealed/);
  });

  test('should navigate to timer via CTA button', async ({ page }) => {
    await page.goto('/#/wissen/pomodoro');
    
    await page.locator('.open-timer-button').click();
    await expect(page).toHaveURL(/\/#\/pomodoro$/);
  });

  test('should show fallback for missing timer world', async ({ page }) => {
    await page.goto('/#/wissen/nonexistent');
    
    // Should show fallback message
    await expect(page.locator('text=A World in Preparation')).toBeVisible();
    await expect(page.locator('text=Back to Overview')).toBeVisible();
    
    // Click back to overview
    await page.locator('text=Back to Overview').click();
    await expect(page).toHaveURL(/\/#\/$/);
  });

  test('should have sources in fact plaques', async ({ page }) => {
    await page.goto('/#/wissen/countdown');
    
    // Check that facts contain source links
    const factContent = page.locator('.fact-plaque').first();
    await expect(factContent).toContainText('Source:');
    
    // Verify markdown links are rendered
    const sourceLink = factContent.locator('a').first();
    await expect(sourceLink).toBeVisible();
  });

  test('should apply accent colors per timer', async ({ page }) => {
    // Test Countdown (purple)
    await page.goto('/#/wissen/countdown');
    const countdownButton = page.locator('.open-timer-button');
    await expect(countdownButton).toBeVisible();
    
    // Test Stopwatch (cyan)
    await page.goto('/#/wissen/stopwatch');
    const stopwatchButton = page.locator('.open-timer-button');
    await expect(stopwatchButton).toBeVisible();
    
    // Buttons should have different colors (visual regression would be ideal)
    // For now, just verify they exist and are styled
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/wissen/pomodoro');
    
    // Check that content is visible
    await expect(page.locator('.world-title')).toBeVisible();
    await expect(page.locator('.table-of-contents')).toBeVisible();
    
    // Ritual cards should stack on mobile
    const ritualsGrid = page.locator('.rituals-grid');
    await expect(ritualsGrid).toBeVisible();
  });
});