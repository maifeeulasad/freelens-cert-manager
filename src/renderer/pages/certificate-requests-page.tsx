/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { CertificateRequest, type CertificateRequestApi } from "../../common/api";

export function CertificateRequestsPage() {
  const store = CertificateRequest.getStore<CertificateRequest>();

  return (
    <Renderer.Component.KubeObjectListLayout<CertificateRequest, CertificateRequestApi>
      store={store}
      isConfigurable
      tableId="cert-manager-certificate-requests"
      className="CertificateRequestsPage"
      renderTableHeader={[
        { title: "Name", className: "name" },
        { title: "Namespace", className: "namespace" },
        { title: "Ready", className: "ready" },
        { title: "Approved", className: "approved" },
        { title: "Issuer", className: "issuer" },
      ]}
      renderTableContents={(cr) => [
        cr.getName(),
        cr.getNs(),
        cr.isReady ? "✓" : "✗",
        cr.isApproved ? "✓" : cr.isDenied ? "Denied" : "-",
        cr.issuerRef ? `${cr.issuerRef.kind}/${cr.issuerRef.name}` : "-",
      ]}
    />
  );
}
