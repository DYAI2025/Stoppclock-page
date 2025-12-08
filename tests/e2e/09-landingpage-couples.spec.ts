import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('sc.adsConsent', 'no');
            // Clear any existing pinned timers
            localStorage.removeItem('sc.v2.pinnedTimerIds');
            localStorage.removeItem('sc.v1.pinnedTimers');
        });
    });

    test('LP-01 – should load and display timer grid', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.landing-page')).toBeVisible();
        await expect(page.locator('.lp-hero-title')).toContainText('Time, held lightly');

        // Check that timer cards are visible
        const timerCards = page.locator('.lp-icon-card');
        await expect(timerCards).toHaveCount(12); // 12 timers
    });

    test('LP-02 – should pin timer from grid card', async ({ page }) => {
        await page.goto('/');

        // Find the Couples Timer card pin button
        const couplesCard = page.locator('.lp-icon-card').filter({ hasText: 'Couples Timer' });
        await expect(couplesCard).toBeVisible();

        // Click the pin button
        const pinBtn = couplesCard.locator('.lp-icon-card-pin');
        await pinBtn.click();

        // Verify pinned bar shows the timer
        const pinnedBar = page.locator('.lp-pinned-cards');
        await expect(pinnedBar.locator('.lp-pinned-card')).toHaveCount(1);

        // Verify localStorage updated
        const stored = await page.evaluate(() => localStorage.getItem('sc.v2.pinnedTimerIds'));
        expect(stored).toContain('couples');
    });

    test('LP-03 – should unpin timer via X button', async ({ page }) => {
        // Pre-pin a timer via localStorage
        await page.addInitScript(() => {
            localStorage.setItem('sc.v2.pinnedTimerIds', JSON.stringify(['countdown']));
        });

        await page.goto('/');

        // Verify pinned card exists
        const pinnedCard = page.locator('.lp-pinned-card');
        await expect(pinnedCard).toHaveCount(1);

        // Click unpin button
        await pinnedCard.locator('.lp-pinned-unpin').click();

        // Verify pinned card is removed
        await expect(pinnedCard).toHaveCount(0);
    });

    test('LP-04 – should navigate to timer when clicking pinned card', async ({ page }) => {
        // Pre-pin a timer
        await page.addInitScript(() => {
            localStorage.setItem('sc.v2.pinnedTimerIds', JSON.stringify(['chess']));
        });

        await page.goto('/');

        // Click the pinned card link
        const pinnedCardLink = page.locator('.lp-pinned-card-link');
        await pinnedCardLink.click();

        // Verify navigation to chess timer
        await expect(page).toHaveURL(/.*#\/chess/);
        await expect(page.locator('.chess-wrap')).toBeVisible();
    });

    test('LP-05 – should respect maximum 3 pins limit', async ({ page }) => {
        // Pre-pin 3 timers
        await page.addInitScript(() => {
            localStorage.setItem('sc.v2.pinnedTimerIds', JSON.stringify(['countdown', 'stopwatch', 'pomodoro']));
        });

        await page.goto('/');

        // Verify 3 pinned cards
        await expect(page.locator('.lp-pinned-card')).toHaveCount(3);

        // Try to pin another via dropdown - button should be disabled
        const pinDropdownBtn = page.locator('.lp-pin-timer-btn').first();
        await expect(pinDropdownBtn).toBeDisabled();
    });
});

test.describe('Couples Timer', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('sc.adsConsent', 'no');
            localStorage.removeItem('sc.v1.couples');
            localStorage.removeItem('sc.v1.couples.profiles');
        });
    });

    test('CT-01 – should load couples timer world page', async ({ page }) => {
        await page.goto('/#/couples');
        // Should show the World view first
        await expect(page.locator('.couples-timer-page')).toBeVisible();
        // Should have "Start couple timer" button
        await expect(page.locator('text=Start couple timer').first()).toBeVisible();
    });

    test('CT-02 – should navigate from world to player', async ({ page }) => {
        await page.goto('/#/couples');

        // Click start button to go to player
        await page.locator('text=Start couple timer').first().click();

        // Verify player view loaded
        await expect(page.locator('.couples-title')).toContainText('Couples Timer');
        await expect(page.locator('.couples-setup')).toBeVisible();
    });

    test('CT-03 – should create profile in player', async ({ page }) => {
        await page.goto('/#/couples');

        // Navigate to player
        await page.locator('text=Start couple timer').first().click();

        // Fill in profile form
        const nameAInput = page.locator('.profile-input').first();
        const nameBInput = page.locator('.profile-input').nth(1);

        await nameAInput.fill('Alice');
        await nameBInput.fill('Bob');

        // Create profile
        await page.locator('.create-profile-btn').click();

        // Verify preset selection appears
        await expect(page.locator('.preset-list')).toBeVisible();
    });

    test('CT-04 – should pause and resume running session', async ({ page }) => {
        // Pre-populate running session that auto-opens player
        await page.addInitScript(() => {
            const state = {
                version: 1,
                currentProfile: { id: 'test', nameA: 'A', nameB: 'B', relationshipType: 'couple', preferredPresetId: 'einsteiger-60', createdAt: Date.now(), lastSessionAt: null },
                currentPreset: { id: 'einsteiger-60', name: 'Test', description: '', prepDurationMs: 60000, slotDurationMs: 60000, slotsPerPerson: 1, transitionDurationMs: 30000, closingDurationMs: 30000, cooldownDurationMs: 30000 },
                phase: 'PREP',
                currentSlotIndex: 0,
                transitionDurationMs: 30000,
                remainingMs: 55000,
                running: true,
                startedAt: Date.now(),
                completedSessions: 0,
                schedule: null
            };
            localStorage.setItem('sc.v1.couples', JSON.stringify(state));
        });

        await page.goto('/#/couples');

        // Session should auto-open to player view because running=true
        await expect(page.locator('.couples-session')).toBeVisible();

        // Click pause
        const pauseBtn = page.locator('.control-btn.pause');
        await expect(pauseBtn).toBeVisible();
        await pauseBtn.click();

        // Verify paused - button should now say resume
        await expect(page.locator('.control-btn.resume')).toBeVisible();

        // Resume
        await page.locator('.control-btn.resume').click();
        await expect(page.locator('.control-btn.pause')).toBeVisible();
    });
});
