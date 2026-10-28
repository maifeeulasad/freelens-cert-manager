/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Source: https://github.com/freelensapp/freelens-example-extension/blob/main/build/vite-plugin-standard-decorators.mjs
 * License: MIT — Copyright (c) Freelens Authors. Adapted for freelens-cert-manager.
 *
 * Lowers TC39 Stage 3 standard decorators before Oxc, which only handles
 * legacy decorators. MobX 7 uses standard decorators exclusively.
 */

import { transform } from "esbuild";

const typeScriptModule = /\.[cm]?tsx?$/;
const decoratorAtLineStart = /^\s*@[A-Za-z_$]/m;

/** @returns {import("vite").Plugin} */
export function standardDecorators() {
  return {
    name: "freelens:standard-decorators",
    enforce: "pre",
    async transform(code, id) {
      const path = id.split("?", 1)[0];

      if (
        !typeScriptModule.test(path) ||
        path.includes("/node_modules/") ||
        !decoratorAtLineStart.test(code)
      ) {
        return null;
      }

      const result = await transform(code, {
        loader: path.endsWith("x") ? "tsx" : "ts",
        jsx: "preserve",
        target: "esnext",
        supported: { decorators: false },
        sourcefile: path,
        sourcemap: "external",
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: false,
            useDefineForClassFields: true,
            verbatimModuleSyntax: false,
          },
        },
      });

      return { code: result.code, map: result.map };
    },
  };
}
