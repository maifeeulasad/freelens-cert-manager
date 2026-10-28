/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Source: https://github.com/freelensapp/freelens-example-extension/blob/main/test/freelens-extensions.ts
 *
 * Minimal stub of `@freelensapp/extensions` for unit tests.
 * The real package reads globalThis.FreelensExtensionApi set by the host;
 * vitest.config.ts aliases the import to this stub instead.
 * Only the surface exercised by tests is stubbed here.
 */

import React from "react";
import { vi } from "vitest";

class LensExtensionKubeObject {
  apiVersion?: string;
  kind?: string;
  metadata?: { name?: string; namespace?: string };
  spec?: unknown;
  status?: unknown;

  constructor(data: Record<string, unknown> = {}) {
    Object.assign(this, data);
  }

  getName() {
    return this.metadata?.name ?? "";
  }

  getNs() {
    return this.metadata?.namespace || undefined;
  }

  static getStore(): never {
    throw new Error(`Store for ${this.name} is not registered.`);
  }
}

class ExtensionStore<M extends object> {
  constructor(_params: { configName: string; defaults: M }) {}
}

interface KubeObjectListLayoutProps {
  store: { items: unknown[] };
  renderTableContents: (item: unknown) => React.ReactNode[];
}

function KubeObjectListLayout({ store, renderTableContents }: KubeObjectListLayoutProps) {
  return React.createElement(
    "div",
    null,
    store.items.map((item, index) =>
      React.createElement("div", { key: index }, ...renderTableContents(item)),
    ),
  );
}

export const Renderer = {
  Component: {
    KubeObjectListLayout,
  },
  K8sApi: {
    LensExtensionKubeObject,
    KubeApi: class KubeApi {},
    KubeObjectStore: class KubeObjectStore {},
  },
};

export const Common = {
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  Store: {
    ExtensionStore,
  },
};
