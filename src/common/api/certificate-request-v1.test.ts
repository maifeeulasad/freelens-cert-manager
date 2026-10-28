/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { describe, expect, it } from "vitest";
import { CertificateRequest } from "./certificate-request-v1";

function makeCR(overrides: Record<string, unknown> = {}): CertificateRequest {
  return new CertificateRequest({
    apiVersion: "cert-manager.io/v1",
    kind: "CertificateRequest",
    metadata: { name: "my-cert-abc123", namespace: "default" },
    spec: {
      issuerRef: { name: "letsencrypt", kind: "ClusterIssuer" },
      duration: "2160h",
      isCA: false,
      usages: ["digital signature", "key encipherment"],
    },
    status: {
      conditions: [{ type: "Ready", status: "True", message: "Certificate issued successfully" }],
    },
    ...overrides,
  } as any);
}

describe("CertificateRequest", () => {
  describe("spec accessors", () => {
    it("returns issuerRef (positive)", () => {
      expect(makeCR().issuerRef).toEqual({ name: "letsencrypt", kind: "ClusterIssuer" });
    });

    it("returns duration (positive)", () => {
      expect(makeCR().duration).toBe("2160h");
    });

    it("returns isCA false by default (positive)", () => {
      expect(makeCR().isCA).toBe(false);
    });

    it("returns isCA true when set (positive)", () => {
      expect(makeCR({ spec: { isCA: true, issuerRef: { name: "ca", kind: "Issuer" } } }).isCA).toBe(true);
    });

    it("returns usages (positive)", () => {
      expect(makeCR().usages).toEqual(["digital signature", "key encipherment"]);
    });

    it("returns empty usages when absent (negative)", () => {
      expect(makeCR({ spec: { issuerRef: { name: "x", kind: "Issuer" } } }).usages).toEqual([]);
    });
  });

  describe("isReady", () => {
    it("is true when Ready=True (positive)", () => {
      expect(makeCR().isReady).toBe(true);
    });

    it("is false when Ready=False (negative)", () => {
      const cr = makeCR({
        status: { conditions: [{ type: "Ready", status: "False", message: "Pending" }] },
      });
      expect(cr.isReady).toBe(false);
    });

    it("is false when no conditions (negative)", () => {
      expect(makeCR({ status: { conditions: [] } }).isReady).toBe(false);
    });
  });

  describe("isDenied / isApproved", () => {
    it("isDenied is false by default (positive)", () => {
      expect(makeCR().isDenied).toBe(false);
    });

    it("isDenied is true when Denied condition present (negative path)", () => {
      const cr = makeCR({
        status: { conditions: [{ type: "Denied", status: "True", message: "Denied by policy" }] },
      });
      expect(cr.isDenied).toBe(true);
    });

    it("isApproved is false when no Approved condition (negative)", () => {
      expect(makeCR().isApproved).toBe(false);
    });

    it("isApproved is true when Approved condition present (positive)", () => {
      const cr = makeCR({
        status: { conditions: [{ type: "Approved", status: "True", message: "Approved" }] },
      });
      expect(cr.isApproved).toBe(true);
    });
  });
});
