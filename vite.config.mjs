/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Source: https://github.com/freelensapp/freelens-example-extension/blob/main/vite.config.mjs
 *
 * Two-mode build:
 *   vite build              → renderer (browser, ESM)
 *   vite build --mode main  → main (Node, ESM or CJS)
 */

import { builtinModules, isBuiltin } from "node:module";
import react from "@vitejs/plugin-react";
import { defaultServerConditions, defaultServerMainFields, defineConfig } from "vite";
import { hostModules } from "./build/vite-plugin-host-modules.mjs";
import { standardDecorators } from "./build/vite-plugin-standard-decorators.mjs";

const entryPoints = {
  renderer: {
    entry: "src/renderer/index.tsx",
    emptyOutDir: true,
    external: [],
    platform: /** @type {const} */ ("browser"),
  },
  main: {
    entry: "src/main/index.ts",
    emptyOutDir: false,
    external: ["electron", /^electron\//, /^node:/, ...builtinModules],
    platform: /** @type {const} */ ("node"),
  },
};

/** @type {import("vite").Plugin} */
const noNodeInRenderer = {
  name: "no-node-in-renderer",
  enforce: "pre",
  resolveId(source, importer) {
    if (isBuiltin(source) || source === "electron" || source.startsWith("electron/")) {
      this.error(`"${source}" is imported by ${importer}, but renderer code gets no Node or Electron`);
    }
    return null;
  },
};

export default defineConfig(({ mode }) => {
  const name = mode === "main" ? "main" : "renderer";
  const entryPoint = entryPoints[name];

  return {
    plugins: [
      standardDecorators(),
      hostModules(name),
      react(),
      ...(name === "renderer" ? [noNodeInRenderer] : []),
    ],
    ...(name === "renderer"
      ? {
          define: { "process.env.NODE_ENV": JSON.stringify("production") },
        }
      : {
          resolve: { conditions: [...defaultServerConditions], mainFields: [...defaultServerMainFields] },
          define: { __dirname: "import.meta.dirname", __filename: "import.meta.filename" },
        }),
    build: {
      target: "esnext",
      minify: false,
      sourcemap: true,
      emptyOutDir: entryPoint.emptyOutDir,
      lib: {
        entry: entryPoint.entry,
        formats: ["es"],
        fileName: () => `${name}.js`,
        cssFileName: name,
      },
      rolldownOptions: {
        external: entryPoint.external,
        platform: entryPoint.platform,
      },
    },
  };
});
