import { expect, test } from '@playwright/test';

/**
 * Visual Regression Tests for ProphetBase
 * 
 * These tests capture screenshots of key pages and components,
 * comparing them against baseline images to detect visual regressions.
 */

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for dynamic content to load
    await page.waitForSelector('[data-testid="market-list"]', { timeout: 10000 });
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
    });
  });

  test('Market list displays correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const marketList = page.locator('[data-testid="market-list"]');
    await expect(marketList).toBeVisible();
    
    await expect(marketList).toHaveScreenshot('market-list.png');
  });

  test('Market card renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const firstMarketCard = page.locator('[data-testid="market-card"]').first();
    await expect(firstMarketCard).toBeVisible();
    
    await expect(firstMarketCard).toHaveScreenshot('market-card.png');
  });

  test('Dark mode renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    });
  });

  test('Mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });

  test('Command palette renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open command palette (Ctrl+K)
    await page.keyboard.press('Control+k');
    
    const commandPalette = page.locator('[data-testid="command-palette"]');
    await expect(commandPalette).toBeVisible();
    
    await expect(commandPalette).toHaveScreenshot('command-palette.png');
  });

  test('Theme customizer renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open theme customizer
    const themeButton = page.locator('[data-testid="theme-button"]');
    if (await themeButton.isVisible()) {
      await themeButton.click();
      
      const themeCustomizer = page.locator('[data-testid="theme-customizer"]');
      await expect(themeCustomizer).toBeVisible();
      
      await expect(themeCustomizer).toHaveScreenshot('theme-customizer.png');
    }
  });

  test('Workspace manager renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open workspace manager
    const workspaceButton = page.locator('[data-testid="workspace-button"]');
    if (await workspaceButton.isVisible()) {
      await workspaceButton.click();
      
      const workspaceManager = page.locator('[data-testid="workspace-manager"]');
      await expect(workspaceManager).toBeVisible();
      
      await expect(workspaceManager).toHaveScreenshot('workspace-manager.png');
    }
  });

  test('Stats dashboard renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const statsDashboard = page.locator('[data-testid="stats-dashboard"]');
    if (await statsDashboard.isVisible()) {
      await expect(statsDashboard).toHaveScreenshot('stats-dashboard.png');
    }
  });

  test('Loading states render correctly', async ({ page }) => {
    await page.goto('/');
    
    // Capture loading state
    const loadingIndicator = page.locator('[data-testid="loading"]');
    if (await loadingIndicator.isVisible({ timeout: 1000 })) {
      await expect(loadingIndicator).toHaveScreenshot('loading-state.png');
    }
  });
});
