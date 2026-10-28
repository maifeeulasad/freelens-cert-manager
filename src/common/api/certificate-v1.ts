/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager Certificate CRD — v1
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.Certificate
 */

import { Renderer } from "@freelensapp/extensions";

export interface CertificateSpec {
  secretName?: string;
  commonName?: string;
  dnsNames?: string[];
  issuerRef?: { name: string; kind: string; group?: string };
  duration?: string;
  renewBefore?: string;
}

export interface CertificateStatus {
  notAfter?: string;
  notBefore?: string;
  renewalTime?: string;
  conditions?: Array<{ type: string; status: string; message?: string }>;
}

export class Certificate extends Renderer.K8sApi.LensExtensionKubeObject<
  Renderer.K8sApi.KubeObjectMetadata,
  CertificateStatus,
  CertificateSpec
> {
  declare kind: "Certificate";
  declare apiVersion: "cert-manager.io/v1";

  static readonly kind = "Certificate";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/cert-manager.io/v1/certificates";

  static readonly crd: Renderer.K8sApi.LensExtensionKubeObjectCRD & { title: string } = {
    apiVersions: ["cert-manager.io/v1"],
    plural: "certificates",
    singular: "certificate",
    shortNames: ["cert"],
    title: "Certificates",
  };

  get secretName(): string | undefined {
    return this.spec.secretName;
  }

  get commonName(): string | undefined {
    return this.spec.commonName;
  }

  get dnsNames(): string[] {
    return this.spec.dnsNames ?? [];
  }

  get issuerRef(): { name: string; kind: string; group?: string } | undefined {
    return this.spec.issuerRef;
  }

  get duration(): string | undefined {
    return this.spec.duration;
  }

  get renewBefore(): string | undefined {
    return this.spec.renewBefore;
  }

  get notAfter(): string | undefined {
    return this.status?.notAfter;
  }

  get notBefore(): string | undefined {
    return this.status?.notBefore;
  }

  get renewalTime(): string | undefined {
    return this.status?.renewalTime;
  }

  get isReady(): boolean {
    return (this.status?.conditions ?? []).some((c) => c.type === "Ready" && c.status === "True");
  }

  get readyMessage(): string | undefined {
    return (this.status?.conditions ?? []).find((c) => c.type === "Ready")?.message;
  }
}

export class CertificateApi extends Renderer.K8sApi.KubeApi<Certificate> {}
export class CertificateStore extends Renderer.K8sApi.KubeObjectStore<Certificate, CertificateApi> {}
