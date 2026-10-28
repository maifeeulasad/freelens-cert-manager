/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Certificate } from "../../common/api";

interface Props {
  extension: Renderer.LensExtension;
}

export function CertificatesPage(_props: Props) {
  const store = Certificate.getStore();

  return (
    <Renderer.Component.KubeObjectListLayout
      store={store}
      isConfigurable
      tableId="cert-manager-certificates"
      className="CertificatesPage"
      renderTableHeader={() => [
        <Renderer.Component.TableCell key="name" className="name">Name</Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="namespace" className="namespace">Namespace</Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="ready" className="ready">Ready</Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="secret" className="secret">Secret</Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="expiry" className="expiry">Expires</Renderer.Component.TableCell>,
      ]}
      renderTableContents={(cert: Certificate) => [
        cert.getName(),
        cert.getNs(),
        cert.isReady ? "✓" : "✗",
        cert.secretName ?? "-",
        cert.notAfter ?? "-",
      ]}
    />
  );
}
