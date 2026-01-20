import { test, expect } from '@playwright/test';

test('homepage has title and critical elements', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ProphetBase/);

    // Check for main heading
    await expect(page.locator('h1')).toBeVisible();

    // Check for market list
    await expect(page.getByText('Active Markets')).toBeVisible();

    // Check for search input
    await expect(page.getByPlaceholderText(/Search markets/i)).toBeVisible();

    // Check for sort dropdown
    await expect(page.getByText('Sort by:')).toBeVisible();
});

test('mobile view responsive checks', async ({ page, isMobile }) => {
    if (isMobile) {
        await page.goto('/');
        // Check if hamburger menu or mobile specific elements are visible if any
        // For now just check that main content fits
        await expect(page.locator('body')).toBeVisible();
    }
});
