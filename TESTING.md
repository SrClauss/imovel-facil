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

## Future Improvements

1. **Integration Tests**
   - Test full user workflows
   - Use real database in test environment

2. **E2E Tests**
   - Add Playwright for end-to-end testing
   - Test complete user journeys

3. **Visual Regression Tests**
   - Detect unintended UI changes
   - Use tools like Percy or Chromatic

4. **Performance Tests**
   - API response times
   - Component render times

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
