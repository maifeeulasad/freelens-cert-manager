/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager CertificateRequest CRD — v1
 * Ref: https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.CertificateRequest
 */

import { Renderer } from "@freelensapp/extensions";

export interface CertificateRequestSpec {
  issuerRef?: { name: string; kind: string; group?: string };
  duration?: string;
  isCA?: boolean;
  usages?: string[];
  request?: string;
}

export interface CertificateRequestStatus {
  failureTime?: string;
  conditions?: Array<{ type: string; status: string; message?: string }>;
}

export class CertificateRequest extends Renderer.K8sApi.LensExtensionKubeObject<
  Renderer.K8sApi.KubeObjectMetadata,
  CertificateRequestStatus,
  CertificateRequestSpec
> {
  declare kind: "CertificateRequest";
  declare apiVersion: "cert-manager.io/v1";

  static readonly kind = "CertificateRequest";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/cert-manager.io/v1/certificaterequests";

  static readonly crd: Renderer.K8sApi.LensExtensionKubeObjectCRD & { title: string } = {
    apiVersions: ["cert-manager.io/v1"],
    plural: "certificaterequests",
    singular: "certificaterequest",
    shortNames: ["cr"],
    title: "CertificateRequests",
  };

  get issuerRef(): { name: string; kind: string; group?: string } | undefined {
    return this.spec.issuerRef;
  }

  get duration(): string | undefined {
    return this.spec.duration;
  }

  get isCA(): boolean {
    return this.spec.isCA === true;
  }

  get usages(): string[] {
    return this.spec.usages ?? [];
  }

  get isReady(): boolean {
    return (this.status?.conditions ?? []).some((c) => c.type === "Ready" && c.status === "True");
  }

  get isDenied(): boolean {
    return (this.status?.conditions ?? []).some((c) => c.type === "Denied" && c.status === "True");
  }

  get isApproved(): boolean {
    return (this.status?.conditions ?? []).some(
      (c) => c.type === "Approved" && c.status === "True",
    );
  }

  get failureTime(): string | undefined {
    return this.status?.failureTime;
  }

  get readyMessage(): string | undefined {
    return (this.status?.conditions ?? []).find((c) => c.type === "Ready")?.message;
  }
}

export class CertificateRequestApi extends Renderer.K8sApi.KubeApi<CertificateRequest> {}
export class CertificateRequestStore extends Renderer.K8sApi.KubeObjectStore<
  CertificateRequest,
  CertificateRequestApi
> {}
