# Testing Guide

This guide explains the testing infrastructure and how to write and run tests for the Imóvel Fácil application.

## Overview

The project uses **Vitest** as the testing framework for both backend and frontend code.

### Test Statistics

- **Backend Tests**: 17 tests (storage + routes)
- **Frontend Tests**: 23 tests (React components)
- **Total**: 40 tests
- **Coverage**: Unit tests for critical business logic

## Running Tests

### All Tests

```bash
npm test
```

This runs all backend and frontend tests sequentially.

### Backend Tests Only

```bash
npm run test:server
```

Tests server-side code including:
- Database operations (storage layer)
- API endpoints (routes)
- Business logic

### Frontend Tests Only

```bash
npm run test:client
```

Tests React components including:
- Component rendering
- User interactions
- Props and state management

### Watch Mode

```bash
npm run test:watch
```

Runs tests in watch mode, re-running on file changes. Useful during development.

### Test UI

```bash
npm run test:ui
```

Opens Vitest's browser-based UI for interactive testing and debugging.

### Coverage Report

```bash
npm run test:coverage
```

Generates code coverage report in multiple formats (text, JSON, HTML).

## Backend Testing

### Test Structure

Backend tests are located in the `server/` directory with `.test.ts` suffix:
- `server/storage.test.ts` - Database operations
- `server/routes.test.ts` - API endpoints

### Configuration

Backend tests use `vitest.config.server.ts`:

```typescript
{
  test: {
    environment: "node",
    include: ["server/**/*.test.ts"],
  }
}
```

### Example: Testing Database Operations

```typescript
import { describe, it, expect, vi } from "vitest";
import { DatabaseStorage } from "./storage";

describe("DatabaseStorage", () => {
  it("should get properties", async () => {
    const storage = new DatabaseStorage();
    const properties = await storage.getProperties();
    expect(Array.isArray(properties)).toBe(true);
  });
});
```

### Example: Testing API Endpoints

```typescript
import request from "supertest";
import { app } from "./index";

describe("API Routes", () => {
  it("should return properties list", async () => {
    const response = await request(app).get("/api/properties");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### Mocking

Backend tests use Vitest's mocking capabilities:

```typescript
// Mock database module
vi.mock("./db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

// Mock storage module
vi.mock("./storage", () => ({
  storage: {
    getProperties: vi.fn(),
  },
}));
```

## Frontend Testing

### Test Structure

Frontend tests are located alongside components with `.test.tsx` suffix:
- `client/src/components/PropertyCard.test.tsx`
- `client/src/components/Navbar.test.tsx`
- `client/src/components/Footer.test.tsx`

### Configuration

Frontend tests use `vitest.config.client.ts`:

```typescript
{
  test: {
    environment: "jsdom",
    include: ["client/**/*.test.{ts,tsx}"],
    setupFiles: ["./client/src/test/setup.ts"],
  }
}
```

### Testing Library

Frontend tests use **React Testing Library** with these utilities:
- `render()` - Render React components
- `screen` - Query rendered elements
- `fireEvent` - Simulate user interactions
- `waitFor` - Wait for async updates

### Example: Testing a Component

```tsx
import { render, screen } from "@testing-library/react";
import { PropertyCard } from "./PropertyCard";

describe("PropertyCard", () => {
  const mockProperty = {
    id: 1,
    title: "Test Property",
    price: "100000",
    // ... other fields
  };

  it("should render property title", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("should render price", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/R\$ 100\.000/)).toBeInTheDocument();
  });
});
```

### User Interactions

```tsx
import { render, screen, fireEvent } from "@testing-library/react";

it("should handle button click", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole("button");
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalled();
});
```

### Mocking Dependencies

```tsx
// Mock router
vi.mock("wouter", () => ({
  Link: ({ children, href }) => <a href={href}>{children}</a>,
  useLocation: () => ["/", vi.fn()],
}));

// Mock custom hooks
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: null }),
}));
```

## Writing Tests

### Best Practices

1. **Test behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state or methods

2. **Use descriptive test names**
   ```typescript
   it("should display error message when form is invalid")
   ```

3. **Arrange-Act-Assert pattern**
   ```typescript
   it("should create property", async () => {
     // Arrange
     const newProperty = { title: "Test" };
     
     // Act
     const result = await createProperty(newProperty);
     
     // Assert
     expect(result.id).toBeDefined();
   });
   ```

4. **Mock external dependencies**
   - Database calls
   - API requests
   - Third-party libraries

5. **Test edge cases**
   - Empty arrays
   - Null/undefined values
   - Error conditions

### Test Organization

```typescript
describe("Component/Module Name", () => {
  describe("specific feature", () => {
    it("should do something", () => {
      // test code
    });
  });
});
```

### Assertions

Common assertions using Vitest/Jest matchers:

```typescript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(10);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain("item");

// Objects
expect(obj).toHaveProperty("key");
expect(obj).toMatchObject({ key: "value" });

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain("substring");

// DOM (with jest-dom)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent("text");
```

## Continuous Integration

Tests should run in CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
```

## Debugging Tests

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:watch"],
  "console": "integratedTerminal"
}
```

### Browser DevTools

For frontend tests, use Vitest UI:
```bash
npm run test:ui
```

### Console Logs

```typescript
it("should debug value", () => {
  const value = calculateSomething();
  console.log("Debug:", value);
  expect(value).toBe(expected);
});
```

## Coverage Goals

Aim for these coverage targets:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

Priority areas for testing:
1. Business logic (storage, calculations)
2. API endpoints
3. Critical UI components
4. User authentication flows

## End-to-End (E2E) Testing

The project now includes comprehensive end-to-end tests using **Playwright** to test complete user workflows and interactions.

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# Run tests in specific browser
npm run test:e2e:chrome

# View test report
npm run test:e2e:report

# Run all tests (unit + E2E)
npm run test:all
```

### E2E Test Structure

E2E tests are located in the `e2e/` directory:
- `e2e/home.spec.ts` - Home page and navigation tests
- `e2e/property-search.spec.ts` - Property search and filtering tests
- `e2e/property-details.spec.ts` - Property details page tests
- `e2e/contact-form.spec.ts` - Contact form submission tests
- `e2e/authentication.spec.ts` - Login/logout flow tests
- `e2e/property-management.spec.ts` - Property CRUD operations tests
- `e2e/responsive-navigation.spec.ts` - Responsive design and navigation tests

### E2E Test Coverage

The E2E tests cover the following critical user journeys:

#### 1. Home Page & Navigation
- Page loads successfully
- Property listings display
- Navigation between pages
- Footer and header visibility

#### 2. Property Search & Filtering
- Filter by property type (sale/rent)
- Filter by category (house/apartment/land/commercial)
- Filter by neighborhood
- Search functionality
- Clear filters

#### 3. Property Details
- Display property information
- Show property images
- Display characteristics (bedrooms, bathrooms, area)
- Contact information
- Handle invalid property IDs

#### 4. Contact Form
- Form field validation
- Submit contact form
- Email format validation
- Required field validation
- Success/error messages

#### 5. Authentication Flow
- Login page access
- Login with credentials
- Logout functionality
- Protected routes
- User menu display

#### 6. Property Management (CRUD)
- Create new property
- List properties in dashboard
- Edit existing property
- Delete property with confirmation
- Form validation

#### 7. Responsive Design
- Mobile viewport (375px)
- Tablet viewport (768px)
- Desktop viewport (1920px)
- Mobile menu functionality
- Browser navigation (back/forward)
- Keyboard navigation
- 404 page handling

### E2E Configuration

E2E tests are configured in `playwright.config.ts`:

```typescript
{
  testDir: './e2e',
  baseURL: 'http://localhost:5000',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
    { name: 'Mobile Chrome' },
    { name: 'Mobile Safari' },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
  }
}
```

### Writing E2E Tests

#### Example: Testing a User Journey

```typescript
import { test, expect } from '@playwright/test';

test.describe('Property Search Flow', () => {
  test('user can search and view property details', async ({ page }) => {
    // 1. Navigate to home page
    await page.goto('/');
    
    // 2. Search for properties
    await page.getByRole('searchbox').fill('casa');
    await page.getByRole('button', { name: 'Buscar' }).click();
    
    // 3. Verify results
    await expect(page.getByTestId('property-card')).toBeVisible();
    
    // 4. Click on first property
    await page.getByTestId('property-card').first().click();
    
    // 5. Verify details page
    await expect(page).toHaveURL(/\/imovel\/\d+/);
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

#### Best Practices for E2E Tests

1. **Test real user workflows**
   - Simulate actual user behavior
   - Test complete journeys, not isolated features

2. **Use proper selectors**
   - Prefer role-based selectors: `getByRole('button')`
   - Use test IDs for dynamic content: `data-testid="property-card"`
   - Avoid brittle selectors like classes or IDs

3. **Wait for elements properly**
   - Use `waitForLoadState('networkidle')`
   - Wait for specific elements: `await element.waitFor()`
   - Use appropriate timeouts

4. **Handle async operations**
   - Wait for navigation to complete
   - Wait for API responses
   - Handle dynamic content loading

5. **Clean up test data**
   - Use test-specific data
   - Clean up after tests
   - Isolate test environments

6. **Make tests resilient**
   - Handle different page states
   - Account for timing variations
   - Use retries for flaky tests

### Debugging E2E Tests

#### Using Playwright Inspector

```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector where you can:
- Step through tests
- Inspect selectors
- View screenshots and traces
- See network activity

#### Using UI Mode

```bash
npm run test:e2e:ui
```

Interactive mode with:
- Visual test runner
- Time travel debugging
- Watch mode
- Detailed error messages

#### Viewing Test Reports

```bash
npm run test:e2e:report
```

Opens HTML report with:
- Test results and timing
- Screenshots on failure
- Videos of test runs
- Trace files

### CI/CD Integration

E2E tests are configured to run in CI environments:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### E2E Test Artifacts

Playwright generates several artifacts:
- **test-results/** - Test execution results
- **playwright-report/** - HTML report with screenshots and videos
- **playwright/.cache/** - Browser binaries cache

These are automatically ignored in `.gitignore`.

## Future Improvements

1. **Integration Tests**
   - Test full user workflows
   - Use real database in test environment

2. **Visual Regression Tests**
   - Detect unintended UI changes
   - Use tools like Percy or Chromatic

3. **Performance Tests**
   - API response times
   - Component render times

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
