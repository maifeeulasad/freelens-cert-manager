/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Certificate, type CertificateApi } from "../../common/api";

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
        cert.isReady ? "✓" : "✗",
        cert.secretName ?? "-",
        cert.notAfter ?? "-",
      ]}
    />
  );
}
