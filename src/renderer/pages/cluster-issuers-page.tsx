/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { ClusterIssuer } from "../../common/api";

interface Props {
  extension: Renderer.LensExtension;
}

export function ClusterIssuersPage(_props: Props) {
  const store = ClusterIssuer.getStore();

  return (
    <Renderer.Component.KubeObjectListLayout
      store={store}
      isConfigurable
      tableId="cert-manager-cluster-issuers"
      className="ClusterIssuersPage"
      renderTableHeader={() => [
        <Renderer.Component.TableCell key="name" className="name">Name</Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="ready" className="ready">Ready</Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="type" className="type">Type</Renderer.Component.TableCell>,
      ]}
      renderTableContents={(issuer: ClusterIssuer) => [
        issuer.getName(),
        issuer.isReady ? "✓" : "✗",
        issuer.issuerType,
      ]}
    />
  );
}
