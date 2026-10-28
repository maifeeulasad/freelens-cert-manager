/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager ClusterIssuer CRD — v1 (cluster-scoped)
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.ClusterIssuer
 */

import { Renderer } from "@freelensapp/extensions";

export interface ClusterIssuerSpec {
  acme?: unknown;
  ca?: unknown;
  selfSigned?: unknown;
  vault?: unknown;
  venafi?: unknown;
}

export interface ClusterIssuerStatus {
  conditions?: Array<{ type: string; status: string; message?: string }>;
}

export class ClusterIssuer extends Renderer.K8sApi.LensExtensionKubeObject<
  Renderer.K8sApi.KubeObjectMetadata,
  ClusterIssuerStatus,
  ClusterIssuerSpec
> {
  declare kind: "ClusterIssuer";
  declare apiVersion: "cert-manager.io/v1";

  static readonly kind = "ClusterIssuer";
  static readonly namespaced = false;
  static readonly apiBase = "/apis/cert-manager.io/v1/clusterissuers";

  static readonly crd: Renderer.K8sApi.LensExtensionKubeObjectCRD & { title: string } = {
    apiVersions: ["cert-manager.io/v1"],
    plural: "clusterissuers",
    singular: "clusterissuer",
    shortNames: [],
    title: "ClusterIssuers",
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

export class ClusterIssuerApi extends Renderer.K8sApi.KubeApi<ClusterIssuer> {}
export class ClusterIssuerStore extends Renderer.K8sApi.KubeObjectStore<ClusterIssuer, ClusterIssuerApi> {}
