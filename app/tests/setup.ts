import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import React from "react";
import { afterEach, expect } from "vitest";

expect.extend(toHaveNoViolations);
afterEach(() => {
  cleanup();
});
