/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Source: https://github.com/freelensapp/freelens-example-extension/blob/main/build/vite-plugin-host-modules.mjs
 * License: MIT — Copyright (c) Freelens Authors. Adapted for freelens-cert-manager.
 *
 * Resolves host-provided singleton modules (react, mobx, etc.) to the
 * instances on globalThis.FreelensExtensionApi, per contract C3.
 */

import { createRequire } from "node:module";
import { join } from "node:path";

const hostGlobal = "globalThis.FreelensExtensionApi";

const publishedModuleIds = {
  renderer: ["react", "react-dom", "react/jsx-runtime", "mobx", "mobx-react", "monaco-editor"],
  main: ["mobx"],
};

const allModuleIds = new Set(Object.values(publishedModuleIds).flat());
const hostPackages = new Set([...allModuleIds].map(packageName));

function globalName(moduleId) {
  return moduleId
    .replace(/^@[^/]+\//, "")
    .split(/[-/.]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function packageName(moduleId) {
  const segments = moduleId.split("/");
  return moduleId.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

const identifier = /^[A-Za-z_$][\w$]*$/;
const skippedNames = new Set(["__esModule", "default"]);

function exportNames(require, moduleId) {
  let library;
  try {
    library = require(moduleId);
  } catch (error) {
    throw new Error(
      `cannot load the installed "${moduleId}" to read its exports; the host provides it, so it must be a devDependency at the version the host runs`,
      { cause: error },
    );
  }
  return Object.keys(library).filter((name) => identifier.test(name) && !skippedNames.has(name));
}

/**
 * @param {"renderer" | "main"} processName
 * @returns {import("vite").Plugin}
 */
export function hostModules(processName) {
  const published = new Set(publishedModuleIds[processName]);
  const virtualPrefix = "\0freelens-host:";
  let require;

  return {
    name: "freelens:host-modules",
    enforce: "pre",

    configResolved(config) {
      require = createRequire(join(config.root, "package.json"));
    },

    resolveId(source) {
      if (published.has(source)) {
        return { id: `${virtualPrefix}${source}`, moduleSideEffects: false };
      }
      if (allModuleIds.has(source)) {
        this.error(
          `"${source}" is imported in the ${processName} bundle, but the host publishes it in the renderer only`,
        );
      }
      if (hostPackages.has(packageName(source))) {
        this.error(
          `"${source}" is not published by the host, and bundling it would bring in a second copy of "${packageName(source)}"`,
        );
      }
      return null;
    },

    load(id) {
      if (!id.startsWith(virtualPrefix)) {
        return null;
      }
      const moduleId = id.slice(virtualPrefix.length);
      const names = exportNames(require, moduleId);
      return [
        `const hostModule = ${hostGlobal}.${globalName(moduleId)};`,
        "export default hostModule;",
        ...names.map(
          (name) => `export const ${name} = /* @__PURE__ */ Reflect.get(hostModule, "${name}");`,
        ),
        "",
      ].join("\n");
    },
  };
}
