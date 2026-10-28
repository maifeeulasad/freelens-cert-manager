/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * E2E tests for cert-manager Certificate resources.
 * Requires: minikube running with cert-manager installed.
 * Run: pnpm test:e2e
 * Setup: bash scripts/e2e-setup.sh
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  applyManifest,
  deleteResource,
  getResource,
  kubectl,
  resourceExists,
  waitFor,
} from "./helpers";

const NS = "cert-manager-e2e";

// ── Manifests ───────────────────────────────────────────────────────────────

const NAMESPACE_YAML = `
apiVersion: v1
kind: Namespace
metadata:
  name: ${NS}
`;

const SELF_SIGNED_ISSUER_YAML = `
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: e2e-selfsigned
spec:
  selfSigned: {}
`;

const CERTIFICATE_YAML = `
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: e2e-cert
  namespace: ${NS}
spec:
  secretName: e2e-cert-tls
  commonName: e2e.example.com
  dnsNames:
    - e2e.example.com
  issuerRef:
    name: e2e-selfsigned
    kind: ClusterIssuer
  duration: 2160h
  renewBefore: 360h
`;

// ── Lifecycle ────────────────────────────────────────────────────────────────

beforeAll(() => {
  applyManifest(NAMESPACE_YAML);
  applyManifest(SELF_SIGNED_ISSUER_YAML);
  applyManifest(CERTIFICATE_YAML);
}, 30_000);

afterAll(() => {
  deleteResource("certificate", "e2e-cert", NS);
  deleteResource("secret", "e2e-cert-tls", NS);
  deleteResource("clusterissuer", "e2e-selfsigned");
  deleteResource("namespace", NS);
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("ClusterIssuer (self-signed)", () => {
  it("positive: ClusterIssuer exists and is Ready", async () => {
    await waitFor(() => {
      const obj = getResource("clusterissuer", "e2e-selfsigned");
      const conditions: any[] = (obj?.status as any)?.conditions ?? [];
      return conditions.some((c) => c.type === "Ready" && c.status === "True");
    }, 60_000);
    const obj = getResource("clusterissuer", "e2e-selfsigned")!;
    const conditions: any[] = (obj.status as any).conditions;
    expect(conditions.find((c: any) => c.type === "Ready")?.status).toBe("True");
  });
});

describe("Certificate lifecycle", () => {
  it("positive: Certificate is created in the namespace", () => {
    expect(resourceExists("certificate", "e2e-cert", NS)).toBe(true);
  });

  it("positive: Certificate becomes Ready within 60s", async () => {
    await waitFor(() => {
      const obj = getResource("certificate", "e2e-cert", NS);
      const conditions: any[] = (obj?.status as any)?.conditions ?? [];
      return conditions.some((c) => c.type === "Ready" && c.status === "True");
    }, 60_000);
    const obj = getResource("certificate", "e2e-cert", NS)!;
    const conditions: any[] = (obj.status as any).conditions;
    expect(conditions.find((c: any) => c.type === "Ready")?.status).toBe("True");
  });

  it("positive: cert-manager creates the managed Secret", async () => {
    await waitFor(() => resourceExists("secret", "e2e-cert-tls", NS), 60_000);
    const secret = getResource("secret", "e2e-cert-tls", NS)!;
    expect(secret.type).toBe("kubernetes.io/tls");
    const data = secret.data as Record<string, string>;
    expect(data).toHaveProperty("tls.crt");
    expect(data).toHaveProperty("tls.key");
  });

  it("positive: Certificate spec matches what we applied", () => {
    const obj = getResource("certificate", "e2e-cert", NS)!;
    const spec = obj.spec as any;
    expect(spec.secretName).toBe("e2e-cert-tls");
    expect(spec.commonName).toBe("e2e.example.com");
    expect(spec.dnsNames).toContain("e2e.example.com");
    expect(spec.issuerRef.kind).toBe("ClusterIssuer");
    expect(spec.issuerRef.name).toBe("e2e-selfsigned");
  });

  it("positive: Certificate has notAfter set in status", () => {
    const obj = getResource("certificate", "e2e-cert", NS)!;
    const status = obj.status as any;
    expect(status.notAfter).toBeTruthy();
    expect(new Date(status.notAfter).getTime()).toBeGreaterThan(Date.now());
  });
});

describe("Delete cascade", () => {
  const certName = "e2e-cascade-cert";
  const secretName = "e2e-cascade-tls";

  beforeAll(() => {
    applyManifest(`
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ${certName}
  namespace: ${NS}
spec:
  secretName: ${secretName}
  commonName: cascade.example.com
  issuerRef:
    name: e2e-selfsigned
    kind: ClusterIssuer
`);
  }, 20_000);

  it("positive: cascade cert becomes Ready", async () => {
    await waitFor(() => {
      const obj = getResource("certificate", certName, NS);
      const conditions: any[] = (obj?.status as any)?.conditions ?? [];
      return conditions.some((c) => c.type === "Ready" && c.status === "True");
    }, 60_000);
  });

  it("positive: cascade Secret is created", async () => {
    await waitFor(() => resourceExists("secret", secretName, NS), 60_000);
    expect(resourceExists("secret", secretName, NS)).toBe(true);
  });

  it("positive: deleting Certificate + Secret removes both", () => {
    deleteResource("certificate", certName, NS);
    deleteResource("secret", secretName, NS);

    expect(resourceExists("certificate", certName, NS)).toBe(false);
    expect(resourceExists("secret", secretName, NS)).toBe(false);
  });

  it("negative: re-deleting already-absent resources is safe (--ignore-not-found)", () => {
    // should not throw
    expect(() => {
      deleteResource("certificate", certName, NS);
      deleteResource("secret", secretName, NS);
    }).not.toThrow();
  });
});

describe("Issuer (namespace-scoped)", () => {
  const issuerName = "e2e-ns-selfsigned";

  beforeAll(() => {
    applyManifest(`
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: ${issuerName}
  namespace: ${NS}
spec:
  selfSigned: {}
`);
  }, 15_000);

  afterAll(() => {
    deleteResource("issuer", issuerName, NS);
  });

  it("positive: Issuer exists in namespace", () => {
    expect(resourceExists("issuer", issuerName, NS)).toBe(true);
  });

  it("positive: Issuer is Ready", async () => {
    await waitFor(() => {
      const obj = getResource("issuer", issuerName, NS);
      const conditions: any[] = (obj?.status as any)?.conditions ?? [];
      return conditions.some((c) => c.type === "Ready" && c.status === "True");
    }, 30_000);
  });

  it("negative: non-existent Issuer returns null", () => {
    expect(getResource("issuer", "does-not-exist", NS)).toBeNull();
  });
});
