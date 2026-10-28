/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { describe, expect, it } from "vitest";
import { Certificate } from "./certificate-v1";

function makeCert(overrides: Record<string, unknown> = {}): Certificate {
  return new Certificate({
    apiVersion: "cert-manager.io/v1",
    kind: "Certificate",
    metadata: { name: "my-cert", namespace: "default" },
    spec: {
      secretName: "my-cert-tls",
      commonName: "example.com",
      dnsNames: ["example.com", "www.example.com"],
      issuerRef: { name: "letsencrypt", kind: "ClusterIssuer" },
      duration: "2160h",
      renewBefore: "360h",
    },
    status: {
      notAfter: "2026-12-01T00:00:00Z",
      notBefore: "2026-09-01T00:00:00Z",
      renewalTime: "2026-11-01T00:00:00Z",
      conditions: [
        { type: "Ready", status: "True", message: "Certificate is up to date and has not expired" },
      ],
    },
    ...overrides,
  } as any);
}

describe("Certificate", () => {
  describe("metadata accessors", () => {
    it("returns name", () => {
      expect(makeCert().getName()).toBe("my-cert");
    });

    it("returns namespace", () => {
      expect(makeCert().getNs()).toBe("default");
    });
  });

  describe("spec accessors", () => {
    it("returns secretName", () => {
      expect(makeCert().secretName).toBe("my-cert-tls");
    });

    it("returns commonName", () => {
      expect(makeCert().commonName).toBe("example.com");
    });

    it("returns dnsNames", () => {
      expect(makeCert().dnsNames).toEqual(["example.com", "www.example.com"]);
    });

    it("returns empty array when dnsNames absent", () => {
      const cert = makeCert({ spec: { secretName: "x" } });
      expect(cert.dnsNames).toEqual([]);
    });

    it("returns issuerRef", () => {
      expect(makeCert().issuerRef).toEqual({ name: "letsencrypt", kind: "ClusterIssuer" });
    });

    it("returns duration", () => {
      expect(makeCert().duration).toBe("2160h");
    });

    it("returns renewBefore", () => {
      expect(makeCert().renewBefore).toBe("360h");
    });
  });

  describe("status accessors", () => {
    it("returns notAfter", () => {
      expect(makeCert().notAfter).toBe("2026-12-01T00:00:00Z");
    });

    it("returns notBefore", () => {
      expect(makeCert().notBefore).toBe("2026-09-01T00:00:00Z");
    });

    it("returns renewalTime", () => {
      expect(makeCert().renewalTime).toBe("2026-11-01T00:00:00Z");
    });
  });

  describe("isReady", () => {
    it("is true when Ready condition is True (positive)", () => {
      expect(makeCert().isReady).toBe(true);
    });

    it("is false when Ready condition is False (negative)", () => {
      const cert = makeCert({
        status: {
          conditions: [{ type: "Ready", status: "False", message: "Waiting for DNS" }],
        },
      });
      expect(cert.isReady).toBe(false);
    });

    it("is false when conditions array is empty (negative)", () => {
      const cert = makeCert({ status: { conditions: [] } });
      expect(cert.isReady).toBe(false);
    });

    it("is false when status is absent (negative)", () => {
      const cert = makeCert({ status: undefined });
      expect(cert.isReady).toBe(false);
    });
  });

  describe("readyMessage", () => {
    it("returns the message from the Ready condition", () => {
      expect(makeCert().readyMessage).toBe("Certificate is up to date and has not expired");
    });

    it("returns undefined when no conditions (negative)", () => {
      const cert = makeCert({ status: { conditions: [] } });
      expect(cert.readyMessage).toBeUndefined();
    });
  });
});
