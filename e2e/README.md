# End-to-End Tests

This directory contains end-to-end (E2E) tests for the Imóvel Fácil application using Playwright.

## Test Files

- `home.spec.ts` - Home page and navigation tests
- `property-search.spec.ts` - Property search and filtering functionality
- `property-details.spec.ts` - Property details page tests
- `contact-form.spec.ts` - Contact form submission and validation
- `authentication.spec.ts` - Login, logout, and authentication flows
- `property-management.spec.ts` - Property CRUD operations (requires authentication)
- `responsive-navigation.spec.ts` - Responsive design and navigation tests

## Running Tests

### Prerequisites

1. **Start Database**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2. **Initialize Database Schema**
   ```bash
   npm run db:push
   ```

3. **Start Development Server** (in a separate terminal)
   ```bash
   npm run dev
   ```

4. **Install Playwright Browsers** (first time only)
   ```bash
   npx playwright install
   ```

### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test e2e/home.spec.ts

# Run tests in UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run tests in a specific browser
npm run test:e2e:chrome  # Chromium only
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage

### User Flows Tested

1. **Home Page & Navigation**
   - Page loads successfully
   - Property listings display
   - Navigation between pages works
   - Footer and header are visible

2. **Property Search & Filtering**
   - Filter by property type (sale/rent)
   - Filter by category (house/apartment/land/commercial)
   - Filter by neighborhood
   - Search functionality
   - Clear filters

3. **Property Details**
   - Display property information correctly
   - Show property images
   - Display characteristics (bedrooms, bathrooms, area)
   - Contact information available
   - Handle invalid property IDs gracefully

4. **Contact Form**
   - Form displays correctly
   - Submit with valid data
   - Email format validation
   - Required field validation
   - Success/error messages

5. **Authentication**
   - Login page access
   - Login with credentials
   - Logout functionality
   - Protected routes
   - User menu display

6. **Property Management (CRUD)**
   - Create new property
   - List properties in dashboard
   - Edit existing property
   - Delete property with confirmation
   - Form validation

7. **Responsive Design**
   - Mobile viewport (375px)
   - Tablet viewport (768px)
   - Desktop viewport (1920px)
   - Mobile menu functionality
   - Browser navigation (back/forward)
   - Keyboard navigation
   - 404 page handling

## Debugging Tests

### View Test Report

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

### Use Playwright Inspector

Debug tests step by step:

```bash
npm run test:e2e:debug
```

### Use UI Mode

Interactive test runner with time travel debugging:

```bash
npm run test:e2e:ui
```

### View Screenshots and Videos

On test failure, Playwright automatically captures:
- Screenshots: `test-results/*/test-failed-*.png`
- Videos: `test-results/*/video.webm`
- Traces: `test-results/*/trace.zip`

## Writing New Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/some-page');
    
    // Act
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic selectors**
   - Prefer `getByRole`, `getByLabel`, `getByText`
   - Use `data-testid` for dynamic content
   - Avoid CSS selectors that depend on implementation

2. **Wait for elements properly**
   - Use `waitForLoadState('networkidle')` after navigation
   - Use `await element.waitFor()` for dynamic elements
   - Set appropriate timeouts for slow operations

3. **Make tests independent**
   - Each test should be able to run in isolation
   - Don't rely on state from previous tests
   - Clean up test data after tests

4. **Handle flakiness**
   - Use retry logic for network-dependent operations
   - Wait for animations to complete
   - Use `toBeVisible()` instead of `toExist()` for UI elements

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: imovel_facil
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run db:push
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests Fail with "Connection Refused"

Make sure the development server is running:
```bash
npm run dev
```

### Tests Fail with "Database Error"

Ensure PostgreSQL is running and schema is initialized:
```bash
docker compose -f docker-compose.dev.yml up -d
npm run db:push
```

### Browsers Not Installed

Install Playwright browsers:
```bash
npx playwright install
```

### Tests are Flaky

- Increase timeouts in `playwright.config.ts`
- Add explicit waits for dynamic content
- Check for race conditions in the application

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles)
