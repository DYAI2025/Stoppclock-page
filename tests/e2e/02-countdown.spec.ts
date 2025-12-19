import { test, expect } from "@playwright/test";

test.describe("Digital Countdown with Ring Visualization", () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss consent banner by setting localStorage
    await page.addInitScript(() => {
      localStorage.setItem("sc.adsConsent", "no");
    });
  });

  test("should load with ring visualization", async ({ page }) => {
    await page.goto("/#/countdown");

    // Wait for page to load
    await expect(page.locator(".countdown-page")).toBeVisible();

    // Check ring visualization is present
    const ringContainer = page.locator(".countdown-ring-container");
    await expect(ringContainer).toBeVisible();

    const ringSvg = page.locator(".countdown-ring-svg");
    await expect(ringSvg).toBeVisible();

    // Check time display within ring - default 5 minutes
    const timeDisplay = page.locator(".countdown-ring-time");
    await expect(timeDisplay).toBeVisible();
    await expect(timeDisplay).toContainText("00:05:00");

    // Verify 60 ticks are rendered
    const tickCount = await page.locator(".countdown-tick").count();
    expect(tickCount).toBe(60);
  });

  test("should start, pause and reset countdown", async ({ page }) => {
    await page.goto("/#/countdown");

    const timeDisplay = page.locator(".countdown-ring-time");

    // Click Start button
    await page.getByRole("button", { name: "Start" }).click();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Verify time has decremented (should be around 00:04:58 or 00:04:57)
    const timeText = await timeDisplay.textContent();
    expect(timeText).toMatch(/00:04:5[78]/);

    // Test Space key pauses
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();

    // Test R key resets
    await page.keyboard.press("r");
    await expect(timeDisplay).toContainText("00:05:00");
  });

  test("should support keyboard shortcuts", async ({ page }) => {
    await page.goto("/#/countdown");

    const timeDisplay = page.locator(".countdown-ring-time");

    // Default should be 5 minutes
    await expect(timeDisplay).toContainText("00:05:00");

    // Blur any focused element to ensure keyboard shortcuts work
    await page.locator(".countdown-page").click();

    // Use preset buttons to set time
    await page.getByRole("button", { name: "+1m" }).click();
    await expect(timeDisplay).toContainText("00:06:00");

    // Start the timer
    await page.keyboard.press("Space");

    // Arrow keys should not work while running
    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(100);
    const runningTime = await timeDisplay.textContent();
    expect(runningTime).toMatch(/00:05:5[89]/);

    // Pause with Space
    await page.keyboard.press("Space");

    // Reset with R
    await page.keyboard.press("r");
    await expect(timeDisplay).toContainText("00:06:00");
  });

  test("should persist state across navigation", async ({ page }) => {
    await page.goto("/#/countdown");

    const timeDisplay = page.locator(".countdown-ring-time");

    // Set to 1 minute using preset
    await page.getByRole("button", { name: "-1m" }).click();
    await page.getByRole("button", { name: "-1m" }).click();
    await page.getByRole("button", { name: "-1m" }).click();
    await page.getByRole("button", { name: "-1m" }).click();

    await expect(timeDisplay).toContainText("00:01:00");

    // Start countdown
    await page.getByRole("button", { name: "Start" }).click();
    await page.waitForTimeout(2000);

    // Navigate away
    await page.goto("/#/");
    await expect(page.locator(".home-grid, .home-page")).toBeVisible();

    // Navigate back
    await page.goto("/#/countdown");

    // State should be persisted (time should have continued)
    await expect(timeDisplay).toBeVisible();
    const timeAfter = await timeDisplay.textContent();
    // Should be less than 00:01:00 (countdown continued)
    expect(timeAfter).toMatch(/00:00:5[0-8]/);
  });

  test("should toggle signal checkboxes", async ({ page }) => {
    await page.goto("/#/countdown");

    // Find sound checkbox
    const soundCheckbox = page.locator('input[type="checkbox"]').first();
    const flashCheckbox = page.locator('input[type="checkbox"]').last();

    // Toggle sound
    const soundInitial = await soundCheckbox.isChecked();
    await soundCheckbox.click();
    const soundAfter = await soundCheckbox.isChecked();
    expect(soundAfter).toBe(!soundInitial);

    // Toggle flash
    const flashInitial = await flashCheckbox.isChecked();
    await flashCheckbox.click();
    const flashAfter = await flashCheckbox.isChecked();
    expect(flashAfter).toBe(!flashInitial);
  });
});

test.describe("Countdown Ring States", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("sc.adsConsent", "no");
    });
  });

  test("should show danger state at 20 seconds or less", async ({ page }) => {
    await page.goto("/#/countdown?duration=25");

    const ringContainer = page.locator(".countdown-ring-container");
    await expect(ringContainer).toBeVisible();

    // Start countdown
    await page.getByRole("button", { name: "Start" }).click();

    // Wait for 6 seconds (should be at ~19s, in danger zone)
    await page.waitForTimeout(6000);

    // Check for danger class
    await expect(ringContainer).toHaveClass(/danger/);
  });

  test("should show critical state at 2 seconds or less", async ({ page }) => {
    await page.goto("/#/countdown?duration=4");

    const ringContainer = page.locator(".countdown-ring-container");
    await expect(ringContainer).toBeVisible();

    // Start countdown
    await page.getByRole("button", { name: "Start" }).click();

    // Wait for 3 seconds (should be at ~1s, in critical zone)
    await page.waitForTimeout(3000);

    // Check for critical class
    await expect(ringContainer).toHaveClass(/critical/);
  });

  test("ring ticks should represent seconds in current minute", async ({
    page,
  }) => {
    // Set to 65 seconds (1m 5s)
    await page.goto("/#/countdown?duration=65");

    await expect(page.locator(".countdown-page")).toBeVisible();

    // Count active ticks (should be 5 for 5 seconds in minute)
    const activeTicksBefore = await page
      .locator(".countdown-tick.active")
      .count();
    expect(activeTicksBefore).toBe(5);

    // Start countdown
    await page.getByRole("button", { name: "Start" }).click();

    // Wait 7 seconds (should transition from 65s → ~58s)
    await page.waitForTimeout(7000);

    // Check time display shows proper minute transition
    const timeDisplay = await page
      .locator(".countdown-ring-time")
      .textContent();
    expect(timeDisplay).toMatch(/00:00:5[78]/);

    // Active ticks should now be around 57-58
    const activeTicksAfter = await page
      .locator(".countdown-tick.active")
      .count();
    expect(activeTicksAfter).toBeGreaterThanOrEqual(55);
    expect(activeTicksAfter).toBeLessThanOrEqual(60);
  });

  test("progress ring should be visible", async ({ page }) => {
    await page.goto("/#/countdown?duration=10");

    // Verify progress ring exists
    const progressRing = page.locator(".countdown-progress-ring");
    await expect(progressRing).toBeVisible();

    // Verify it has stroke-dashoffset attribute
    const hasOffset = await progressRing.getAttribute("stroke-dashoffset");
    expect(hasOffset).not.toBeNull();
  });

  test("should show expired state when countdown reaches zero", async ({
    page,
  }) => {
    await page.goto("/#/countdown?duration=2");

    const ringContainer = page.locator(".countdown-ring-container");

    // Start countdown
    await page.getByRole("button", { name: "Start" }).click();

    // Wait for countdown to complete
    await page.waitForTimeout(3000);

    // Check for expired class
    await expect(ringContainer).toHaveClass(/expired/);

    // Time should show 00:00:00
    const timeDisplay = page.locator(".countdown-ring-time");
    await expect(timeDisplay).toContainText("00:00:00");
  });
});
