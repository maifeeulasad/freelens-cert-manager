/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { CertificateRequest, type CertificateRequestApi } from "../../common/api";
import {
  getCertReqSpec,
  isCertReqApproved,
  isCertReqDenied,
  isCertReqReady,
} from "../../common/api/accessors";
import { NotInstalled } from "./not-installed";

export function CertificateRequestsPage() {
  let store: ReturnType<typeof CertificateRequest.getStore<CertificateRequest>>;
  try {
    store = CertificateRequest.getStore<CertificateRequest>();
  } catch {
    return <NotInstalled resource="CertificateRequest" />;
  }

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
      renderTableContents={(cr) => {
        const issuerRef = getCertReqSpec(cr).issuerRef;
        return [
          cr.getName(),
          cr.getNs(),
          isCertReqReady(cr) ? "✓" : "✗",
          isCertReqApproved(cr) ? "✓" : isCertReqDenied(cr) ? "Denied" : "-",
          issuerRef ? `${issuerRef.kind}/${issuerRef.name}` : "-",
        ];
      }}
    />
  );
}
