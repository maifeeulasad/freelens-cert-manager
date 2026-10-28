/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager Issuer CRD — v1 (namespace-scoped)
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.Issuer
 */

import { Renderer } from "@freelensapp/extensions";

export interface IssuerSpec {
  acme?: unknown;
  ca?: unknown;
  selfSigned?: unknown;
  vault?: unknown;
  venafi?: unknown;
}

export interface IssuerStatus {
  conditions?: Array<{ type: string; status: string; message?: string }>;
}

export class Issuer extends Renderer.K8sApi.LensExtensionKubeObject<
  Renderer.K8sApi.KubeObjectMetadata,
  IssuerStatus,
  IssuerSpec
> {
  declare kind: "Issuer";
  declare apiVersion: "cert-manager.io/v1";

  static readonly kind = "Issuer";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/cert-manager.io/v1/issuers";

  static readonly crd: Renderer.K8sApi.LensExtensionKubeObjectCRD & { title: string } = {
    apiVersions: ["cert-manager.io/v1"],
    plural: "issuers",
    singular: "issuer",
    shortNames: [],
    title: "Issuers",
  };

  get isReady(): boolean {
    return (this.status?.conditions ?? []).some((c) => c.type === "Ready" && c.status === "True");
  }

  get readyMessage(): string | undefined {
    return (this.status?.conditions ?? []).find((c) => c.type === "Ready")?.message;
  }

  get issuerType(): string {
    if (this.spec.acme) return "ACME";
    if (this.spec.ca) return "CA";
    if (this.spec.selfSigned) return "SelfSigned";
    if (this.spec.vault) return "Vault";
    if (this.spec.venafi) return "Venafi";
    return "Unknown";
  }
}

export class IssuerApi extends Renderer.K8sApi.KubeApi<Issuer> {}
export class IssuerStore extends Renderer.K8sApi.KubeObjectStore<Issuer, IssuerApi> {}
