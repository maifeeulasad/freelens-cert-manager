/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager CertificateRequest CRD — v1
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.CertificateRequest
 */

import { Renderer } from "@freelensapp/extensions";

export class CertificateRequest extends Renderer.K8sApi.KubeObject {
  static readonly apiBase = "/apis/cert-manager.io/v1/certificaterequests";
  static readonly kind = "CertificateRequest";
  static readonly namespaced = true;
  static readonly objectConstructor = CertificateRequest;

  static readonly crd = {
    group: "cert-manager.io",
    version: "v1",
    resource: "certificaterequests",
    title: "CertificateRequests",
  };

  get issuerRef(): { name: string; kind: string; group?: string } | undefined {
    return (this.spec as any)?.issuerRef;
  }

  get duration(): string | undefined {
    return (this.spec as any)?.duration;
  }

  get isCA(): boolean {
    return (this.spec as any)?.isCA === true;
  }

  get usages(): string[] {
    return (this.spec as any)?.usages ?? [];
  }

  // Status fields
  get isReady(): boolean {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.some((c) => c.type === "Ready" && c.status === "True");
  }

  get isDenied(): boolean {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.some((c) => c.type === "Denied" && c.status === "True");
  }

  get isApproved(): boolean {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.some((c) => c.type === "Approved" && c.status === "True");
  }

  get failureTime(): string | undefined {
    return (this.status as any)?.failureTime;
  }

  get readyMessage(): string | undefined {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.find((c) => c.type === "Ready")?.message;
  }
}
