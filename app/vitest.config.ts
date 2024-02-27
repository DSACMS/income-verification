import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    environmentMatchGlobs: [
      ["tests/dom/**", "jsdom"],
      ["tests/components/**", "jsdom"],
      ["tests/**/*.spec.ts", "node"],
    ],
    reporters: ["html", "basic"],
    env: {
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@test": path.resolve(__dirname, "./tests"),
    },
  },
});
