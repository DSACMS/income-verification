import { cleanup } from '@testing-library/react';
import {expect, afterEach} from 'vitest';
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";
import React from 'react';
expect.extend(toHaveNoViolations);
afterEach(() => {
  cleanup();
});
