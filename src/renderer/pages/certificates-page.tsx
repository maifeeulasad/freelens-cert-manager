/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import {
  Certificate,
  type CertificateApi,
  type CertificateSpec,
  type CertificateStatus,
} from "../../common/api";

function certSpec(obj: Renderer.K8sApi.KubeObject): CertificateSpec {
  return (obj as unknown as { spec: CertificateSpec }).spec ?? {};
}

function certStatus(obj: Renderer.K8sApi.KubeObject): CertificateStatus {
  return (obj as unknown as { status: CertificateStatus }).status ?? {};
}

function certIsReady(obj: Renderer.K8sApi.KubeObject): boolean {
  return (certStatus(obj).conditions ?? []).some((c) => c.type === "Ready" && c.status === "True");
}

export function CertificatesPage() {
  const store = Certificate.getStore<Certificate>();

  return (
    <Renderer.Component.KubeObjectListLayout<Certificate, CertificateApi>
      store={store}
      isConfigurable
      tableId="cert-manager-certificates"
      className="CertificatesPage"
      renderTableHeader={[
        { title: "Name", className: "name" },
        { title: "Namespace", className: "namespace" },
        { title: "Ready", className: "ready" },
        { title: "Secret", className: "secret" },
        { title: "Expires", className: "expiry" },
      ]}
      renderTableContents={(cert) => [
        cert.getName(),
        cert.getNs(),
        certIsReady(cert) ? "✓" : "✗",
        certSpec(cert).secretName ?? "-",
        certStatus(cert).notAfter ?? "-",
      ]}
    />
  );
}
