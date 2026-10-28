/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager Certificate CRD — v1
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.Certificate
 */

import { Renderer } from "@freelensapp/extensions";

export class Certificate extends Renderer.K8sApi.KubeObject {
  static readonly apiBase = "/apis/cert-manager.io/v1/certificates";
  static readonly kind = "Certificate";
  static readonly namespaced = true;
  static readonly objectConstructor = Certificate;

  static readonly crd = {
    group: "cert-manager.io",
    version: "v1",
    resource: "certificates",
    title: "Certificates",
  };

  get secretName(): string | undefined {
    return (this.spec as any)?.secretName;
  }

  get commonName(): string | undefined {
    return (this.spec as any)?.commonName;
  }

  get dnsNames(): string[] {
    return (this.spec as any)?.dnsNames ?? [];
  }

  get issuerRef(): { name: string; kind: string; group?: string } | undefined {
    return (this.spec as any)?.issuerRef;
  }

  get duration(): string | undefined {
    return (this.spec as any)?.duration;
  }

  get renewBefore(): string | undefined {
    return (this.spec as any)?.renewBefore;
  }

  // Status fields
  get notAfter(): string | undefined {
    return (this.status as any)?.notAfter;
  }

  get notBefore(): string | undefined {
    return (this.status as any)?.notBefore;
  }

  get renewalTime(): string | undefined {
    return (this.status as any)?.renewalTime;
  }

  get isReady(): boolean {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.some((c) => c.type === "Ready" && c.status === "True");
  }

  get readyMessage(): string | undefined {
    const conditions: any[] = (this.status as any)?.conditions ?? [];
    return conditions.find((c) => c.type === "Ready")?.message;
  }
}
