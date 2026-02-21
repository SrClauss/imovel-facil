import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-End Test Configuration
 * 
 * Prerequisites:
 * 1. PostgreSQL database running on localhost:5432
 * 2. Database schema initialized (npm run db:push)
 * 3. Environment variables configured
 * 
 * To run E2E tests:
 * 1. Start database: docker compose -f docker-compose.dev.yml up -d
 * 2. Push schema: npm run db:push
 * 3. Start dev server: npm run dev (in separate terminal)
 * 4. Run tests: npm run test:e2e
 * 
 * Note: This project uses Replit authentication which requires specific environment
 * variables. For local testing, ensure all required environment variables are set.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video recording on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 
   * Optional: Configure web server to start automatically before tests
   * Uncomment this section if you want Playwright to start the server automatically
   * 
   * Note: Requires all environment variables to be properly configured
   */
  /*
  webServer: {
    command: 'DATABASE_URL="postgres://postgres:postgres@localhost:5432/imovel_facil" npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  */
});
