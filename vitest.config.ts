/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Source: https://github.com/freelensapp/freelens-example-extension/blob/main/vitest.config.ts
 */

import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { standardDecorators } from "./build/vite-plugin-standard-decorators.mjs";

export default defineConfig({
  plugins: [standardDecorators(), react()],
  test: {
    environment: "node",
    globals: true,
    exclude: ["integration/**", "node_modules/**", "dist/**", ".study/**"],
    include: ["src/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
    alias: {
      // The real package reads globalThis.FreelensExtensionApi which doesn't
      // exist in a Vitest process. Redirect to the test stub instead.
      "@freelensapp/extensions": fileURLToPath(
        new URL("./test/freelens-extensions.ts", import.meta.url),
      ),
    },
  },
});
