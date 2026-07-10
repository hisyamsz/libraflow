import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    // Timeout lebih panjang untuk integration test yang melibatkan HTTP
    testTimeout: 10000,
  },
});
