import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environmentMatchGlobs: [
      // all tests in tests/dom will run in jsdom
      ["tests/dom/**", "jsdom"],
      ["tests/**/*.spec.ts", "node"],
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@test": path.resolve(__dirname, "./tests"),
    },
  },
  env: {
    NODE_ENV: "test",
  },
});
