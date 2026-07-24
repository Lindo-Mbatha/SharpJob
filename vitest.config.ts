import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      include: [
        "src/features/app/hooks/useAlerts.ts",
        "src/features/app/hooks/useApplyFlow.ts",
        "src/features/app/hooks/useJobActions.ts",
        "src/features/**/selectors.ts"
      ],
      thresholds: {
        statements: 45,
        branches: 45,
        functions: 45,
        lines: 45
      }
    }
  }
});
