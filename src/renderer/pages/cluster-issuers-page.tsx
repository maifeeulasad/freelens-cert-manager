/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { ClusterIssuer, type ClusterIssuerApi } from "../../common/api";
import { getClusterIssuerType, isClusterIssuerReady } from "../../common/api/accessors";

export function ClusterIssuersPage() {
  const store = ClusterIssuer.getStore<ClusterIssuer>();

  return (
    <Renderer.Component.KubeObjectListLayout<ClusterIssuer, ClusterIssuerApi>
      store={store}
      isConfigurable
      tableId="cert-manager-cluster-issuers"
      className="ClusterIssuersPage"
      renderTableHeader={[
        { title: "Name", className: "name" },
        { title: "Ready", className: "ready" },
        { title: "Type", className: "type" },
      ]}
      renderTableContents={(issuer) => [
        issuer.getName(),
        isClusterIssuerReady(issuer) ? "✓" : "✗",
        getClusterIssuerType(issuer),
      ]}
    />
  );
}
