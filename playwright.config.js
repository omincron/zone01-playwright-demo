const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000,
  expect: { timeout: 5000 },
  outputDir: process.env.BROKEN_SELECTOR ? 'test-results-broken' : 'test-results',
  reporter: [['list'], ['html', {
    outputFolder: process.env.BROKEN_SELECTOR ? 'playwright-report-broken' : 'playwright-report',
    open: 'never'
  }]],
  use: {
    baseURL: 'https://demo.playwright.dev/todomvc/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
