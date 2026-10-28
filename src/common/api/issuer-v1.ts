/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager Issuer CRD — v1 (namespace-scoped)
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.Issuer
 */

import { Renderer } from "@freelensapp/extensions";

export class Issuer extends Renderer.K8sApi.KubeObject {
  static readonly apiBase = "/apis/cert-manager.io/v1/issuers";
  static readonly kind = "Issuer";
  static readonly namespaced = true;
  static readonly objectConstructor = Issuer;

  static readonly crd = {
    group: "cert-manager.io",
    version: "v1",
    resource: "issuers",
    title: "Issuers",
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
