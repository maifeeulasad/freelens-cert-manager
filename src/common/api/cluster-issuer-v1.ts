/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager ClusterIssuer CRD — v1 (cluster-scoped)
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.ClusterIssuer
 */

import { Renderer } from "@freelensapp/extensions";

export class ClusterIssuer extends Renderer.K8sApi.KubeObject {
  static readonly apiBase = "/apis/cert-manager.io/v1/clusterissuers";
  static readonly kind = "ClusterIssuer";
  static readonly namespaced = false;
  static readonly objectConstructor = ClusterIssuer;

  static readonly crd = {
    group: "cert-manager.io",
    version: "v1",
    resource: "clusterissuers",
    title: "ClusterIssuers",
  };

  get isReady(): boolean {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.some((c) => c.type === "Ready" && c.status === "True");
  }

  get readyMessage(): string | undefined {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.find((c) => c.type === "Ready")?.message;
  }

  get issuerType(): string {
    const spec = this.spec as any;
    if (spec?.acme) return "ACME";
    if (spec?.ca) return "CA";
    if (spec?.selfSigned) return "SelfSigned";
    if (spec?.vault) return "Vault";
    if (spec?.venafi) return "Venafi";
    return "Unknown";
  }
}
