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
        <Renderer.Component.TableCell key="name" className="name">
          Name
        </Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="namespace" className="namespace">
          Namespace
        </Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="ready" className="ready">
          Ready
        </Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="approved" className="approved">
          Approved
        </Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="issuer" className="issuer">
          Issuer
        </Renderer.Component.TableCell>,
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
