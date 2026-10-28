<!--
  Author: Maifee Ul Asad <maifeeulasad@gmail.com>
  Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>

  Sources:
  - https://github.com/freelensapp/freelens/blob/main/docs/extensions/api.md
  - https://github.com/freelensapp/freelens/blob/main/docs/extensions/migrating-from-v1.md
  - https://github.com/freelensapp/freelens-example-extension
  - https://github.com/freelensapp/freelens/issues/2304
-->

# Freelens v2 Extension Development Guide

> Normative reference: [`docs/extensions/api.md`](https://github.com/freelensapp/freelens/blob/main/docs/extensions/api.md)
> Migration guide: [`docs/extensions/migrating-from-v1.md`](https://github.com/freelensapp/freelens/blob/main/docs/extensions/migrating-from-v1.md)
> Reference template: [`freelens-example-extension`](https://github.com/freelensapp/freelens-example-extension)

---

## Overview

Freelens v2 introduces a **breaking** extension API incompatible with v1. Key facts:

- Extensions are ESM-first (renderer **must** be ESM; main can be ESM or CJS).
- A single published package: `@freelensapp/extensions` — all other `@freelensapp/*` packages are private.
- The API is exposed as a runtime global: `globalThis.FreelensExtensionApi`.
- No package manager involved at install time — extensions ship as self-contained tarballs.
- Target: React 19, MobX 7, TypeScript 7, Vite 8, Node ≥ 24.

---

## Project Structure

```
my-extension/
├── src/
│   ├── main/
│   │   └── index.ts          # Main process entry (Node + Electron)
│   ├── renderer/
│   │   └── index.tsx         # Renderer entry (browser, ESM only)
│   └── common/
│       └── store/            # Shared MobX stores (main + renderer)
├── dist/
│   ├── main.js               # Built main entry
│   └── renderer.js           # Built renderer entry
├── package.json
├── vite.config.mjs
└── tsconfig.json
```

---

## `package.json` Requirements

```json
{
  "name": "@yourscope/your-extension",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/main.js",
  "renderer": "dist/renderer.js",
  "engines": {
    "node": ">= 24.0.0",
    "freelens": "^2.0.0"
  },
  "files": ["dist/**/*"],
  "devDependencies": {
    "@freelensapp/extensions": "2.0.0",
    "electron": "44.x",
    "react": "19.x",
    "react-dom": "19.x",
    "mobx": "7.x",
    "mobx-react": "10.x",
    "typescript": "7.x",
    "vite": "8.x"
  }
}
```

**Rules:**
- `engines.freelens: "^2.0.0"` is **mandatory** — without it the host refuses the extension at discovery.
- `@freelensapp/extensions` goes in `devDependencies` only (it's a compile-time shim).
- No other `@freelensapp/*` package may be listed as a dependency.
- Host-provided libraries (`react`, `react-dom`, `mobx`, `mobx-react`, `monaco-editor`) go in `devDependencies` — they must **not** be bundled.

---

## Runtime-Global API (C2)

The host sets one global per process at startup:

```ts
// main process
globalThis.FreelensExtensionApi = { Common, Main, ...mainSingletons };

// renderer
globalThis.FreelensExtensionApi = { Common, Renderer, ...rendererSingletons };
```

`@freelensapp/extensions` re-exports this global, so imports stay unchanged:

```ts
import { Common, Main, Renderer } from "@freelensapp/extensions";
```

**Critical:** `Renderer` is `undefined` in main, and `Main` is `undefined` in the renderer. Accessing the wrong namespace throws at runtime (types won't catch this).

---

## Host-Provided Singletons (C3)

These must be marked external in your bundler and **never bundled**:

| Module id           | Global key                             | Available in |
| ------------------- | -------------------------------------- | ------------ |
| `react`             | `FreelensExtensionApi.React`           | renderer     |
| `react-dom`         | `FreelensExtensionApi.ReactDom`        | renderer     |
| `react/jsx-runtime` | `FreelensExtensionApi.ReactJsxRuntime` | renderer     |
| `mobx`              | `FreelensExtensionApi.Mobx`            | both         |
| `mobx-react`        | `FreelensExtensionApi.MobxReact`       | renderer     |
| `monaco-editor`     | `FreelensExtensionApi.MonacoEditor`    | renderer     |

Global name rule: strip scope, split on `-`/`/`/`.`, upper-case each segment.
So `react-dom` → `ReactDom` (not `ReactDOM`).

**Silent failure:** Bundling your own React causes "invalid hook call"; bundling your own MobX silently breaks reactivity.

---

## Main Entry Point

The main entry runs in **Node + Electron**. It can use `require()`, `fs`, `child_process`, etc.

```ts
// src/main/index.ts
import { Main } from "@freelensapp/extensions";
import { MyStore } from "../common/store";

export default class MyCertManagerMain extends Main.LensExtension {
  async onActivate() {
    await MyStore.getInstanceOrCreate().loadExtension(this);
  }

  async onDeactivate() {
    MyStore.getInstance()?.disposeExtension(this);
  }
}
```

---

## Renderer Entry Point

The renderer runs in a **browser page** — no `require()`, no `__dirname`, no Node/Electron.
It is loaded by URL from the `freelens-extension://` scheme. Use `LensExtension.manifestPath` to reference your own files.

```tsx
// src/renderer/index.tsx
import { Renderer } from "@freelensapp/extensions";
import { MyStore } from "../common/store";
import { MyCertPage } from "./pages/cert-page";
import { MyCertDetails } from "./details/cert-details";
import { MyCertIcon } from "./icons";

export default class MyCertManagerRenderer extends Renderer.LensExtension {
  async onActivate() {
    MyStore.getInstanceOrCreate().loadExtension(this);
  }

  // Sidebar navigation entry
  clusterPages: Renderer.LensExtension["clusterPages"] = [
    {
      id: "cert-manager",
      components: { Page: () => <MyCertPage extension={this} /> },
    },
  ];

  clusterPageMenus = [
    {
      id: "cert-manager",
      title: "Cert Manager",
      target: { pageId: "cert-manager" },
      components: { Icon: MyCertIcon },
    },
  ];

  // Register custom CRDs with the Kubernetes API
  customResources = [
    /* CertificateV1, IssuerV1, ... */
  ];
}
```

---

## Vite Build Configuration

Two builds share one config file, driven by `--mode`:

```sh
vite build              # renderer
vite build --mode main  # main
```

Key Vite settings for extensions:

- **Renderer:** `platform: "browser"`, no `external` (except host singletons via plugin), `emptyOutDir: true`
- **Main:** `platform: "node"`, `external: ["electron", /^node:/, ...builtinModules]`
- Both: `lib.formats: ["es"]`, `minify: false`, `sourcemap: true`, `target: "esnext"`
- Host modules are externalized via the `hostModules(name)` Vite plugin (ships with the example template — copy `build/vite-plugin-host-modules.mjs`).

---

## Custom Resources (CRDs)

Register cert-manager CRDs by extending `Renderer.K8sApi.KubeObject`:

```ts
import { Renderer } from "@freelensapp/extensions";

export class Certificate extends Renderer.K8sApi.KubeObject {
  static readonly apiBase = "/apis/cert-manager.io/v1/certificates";
  static readonly kind = "Certificate";
  static readonly namespaced = true;
  static readonly objectConstructor = Certificate;

  static readonly crd = {
    group: "cert-manager.io",
    version: "v1",
    resource: "certificates",
    title: "Certificates",
  };

  // Typed accessors for spec/status fields
  get commonName(): string | undefined {
    return (this.spec as any)?.commonName;
  }

  get notAfter(): string | undefined {
    return (this.status as any)?.notAfter;
  }
}
```

---

## MobX Stores (Common)

Shared stores live in `src/common/` and load in both processes:

```ts
// src/common/store/preferences-store.ts
import { Common } from "@freelensapp/extensions";
import { makeObservable, observable } from "mobx";

export class CertManagerPreferencesStore extends Common.Store.ExtensionStore<{
  showExpired: boolean;
}> {
  @observable showExpired = false;

  constructor() {
    super({ configName: "cert-manager-preferences", defaults: { showExpired: false } });
    makeObservable(this);
  }

  protected fromStore({ showExpired }: { showExpired: boolean }) {
    this.showExpired = showExpired;
  }

  toJSON() {
    return { showExpired: this.showExpired };
  }
}

export const certManagerPreferencesStore =
  CertManagerPreferencesStore.getInstance<CertManagerPreferencesStore>();
```

---

## Testing

### Unit tests (Vitest)

```ts
// src/common/store/preferences-store.test.ts
import { describe, it, expect } from "vitest";
import { CertManagerPreferencesStore } from "./preferences-store";

describe("CertManagerPreferencesStore", () => {
  it("defaults showExpired to false", () => {
    const store = new CertManagerPreferencesStore();
    expect(store.showExpired).toBe(false);
  });
});
```

Run with:
```sh
pnpm test:unit          # vitest run
pnpm test:integration   # vitest run --config vitest.integration.config.ts
```

### End-to-end tests (Playwright)

Integration tests use Playwright against a real Freelens instance with minikube:

```sh
minikube start --cpus=2 --memory=6144
```

---

## Toolchain Summary

| Tool       | Version | Purpose                         |
| ---------- | ------- | ------------------------------- |
| Node       | ≥ 24    | Runtime                         |
| pnpm       | 12.x    | Package manager                 |
| TypeScript | 7.x     | Language                        |
| Vite       | 8.x     | Bundler (two-pass build)        |
| Vitest     | 5.x     | Unit + integration tests        |
| Playwright | 1.64+   | E2E tests                       |
| Biome      | 2.6+    | Linter + formatter              |
| React      | 19.x    | UI (host-provided)              |
| MobX       | 7.x     | State (host-provided, ESM deco) |

---

## Quick Checklist for a New Extension

- [ ] `engines.freelens: "^2.0.0"` in `package.json`
- [ ] `"type": "module"` set
- [ ] `@freelensapp/extensions` in `devDependencies` only
- [ ] Host singletons in `devDependencies` (not bundled)
- [ ] Renderer entry is `.tsx`/`.ts` ESM only (no `require`, no `__dirname`)
- [ ] Main entry handles Node/Electron work
- [ ] Custom CRDs registered in `customResources`
- [ ] MobX uses standard decorators (not legacy `experimentalDecorators`)
- [ ] Vite config has two modes (`renderer` + `main`)
- [ ] Unit tests with Vitest
