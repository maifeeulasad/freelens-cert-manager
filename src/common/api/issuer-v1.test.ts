/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { describe, expect, it } from "vitest";
import { Issuer } from "./issuer-v1";

function makeIssuer(spec: Record<string, unknown> = {}, statusConditions: any[] = []): Issuer {
  return new Issuer({
    apiVersion: "cert-manager.io/v1",
    kind: "Issuer",
    metadata: { name: "my-issuer", namespace: "default" },
    spec,
    status: { conditions: statusConditions },
  } as any);
}

const readyCondition = { type: "Ready", status: "True", message: "Signing CA verified" };
const notReadyCondition = { type: "Ready", status: "False", message: "Error initializing issuer" };

describe("Issuer", () => {
  describe("isReady", () => {
    it("is true when Ready=True (positive)", () => {
      expect(makeIssuer({}, [readyCondition]).isReady).toBe(true);
    });

    it("is false when Ready=False (negative)", () => {
      expect(makeIssuer({}, [notReadyCondition]).isReady).toBe(false);
    });

    it("is false when no conditions (negative)", () => {
      expect(makeIssuer().isReady).toBe(false);
    });
  });

  describe("issuerType", () => {
    it("detects ACME", () => {
      expect(makeIssuer({ acme: {} }).issuerType).toBe("ACME");
    });

    it("detects CA", () => {
      expect(makeIssuer({ ca: {} }).issuerType).toBe("CA");
    });

    it("detects SelfSigned", () => {
      expect(makeIssuer({ selfSigned: {} }).issuerType).toBe("SelfSigned");
    });

    it("detects Vault", () => {
      expect(makeIssuer({ vault: {} }).issuerType).toBe("Vault");
    });

    it("detects Venafi", () => {
      expect(makeIssuer({ venafi: {} }).issuerType).toBe("Venafi");
    });

    it("returns Unknown for unrecognised spec (negative)", () => {
      expect(makeIssuer({}).issuerType).toBe("Unknown");
    });
  });
});
