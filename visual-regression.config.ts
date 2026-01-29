import { defineConfig, devices } from '@playwright/test';

/**
 * Visual Regression Testing Configuration
 * 
 * This configuration sets up Playwright for visual regression testing,
 * capturing screenshots and comparing them against baseline images.
 */
export default defineConfig({
  testDir: './frontend/__tests__/visual',
  
  // Timeout for each test
  timeout: 30 * 1000,
  
  // Test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'visual-regression-report' }],
    ['json', { outputFile: 'visual-regression-results.json' }],
    ['list'],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Screenshot configuration
    screenshot: 'only-on-failure',
    
    // Video configuration
    video: 'retain-on-failure',
    
    // Trace configuration
    trace: 'on-first-retry',
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
  },
  
  // Configure projects for different browsers and viewports
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],
  
  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  // Visual comparison settings
  expect: {
    toHaveScreenshot: {
      // Maximum pixel difference threshold
      maxDiffPixels: 100,
      
      // Maximum pixel ratio difference
      maxDiffPixelRatio: 0.01,
      
      // Threshold for pixel comparison (0-1)
      threshold: 0.2,
      
      // Animation handling
      animations: 'disabled',
      
      // CSS media type
      caret: 'hide',
    },
  },
});
