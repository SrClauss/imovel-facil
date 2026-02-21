import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Add jest-dom types
declare module "vitest" {
  interface Assertion
    extends matchers.TestingLibraryMatchers<any, any> {}
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});
