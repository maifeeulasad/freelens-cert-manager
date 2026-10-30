/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Issuer, type IssuerApi } from "../../common/api";
import { getIssuerType, isIssuerReady } from "../../common/api/accessors";
import { NotInstalled } from "./not-installed";

export function IssuersPage() {
  let store: ReturnType<typeof Issuer.getStore<Issuer>>;
  try {
    store = Issuer.getStore<Issuer>();
  } catch {
    return <NotInstalled resource="Issuer" />;
  }

  return (
    <Renderer.Component.KubeObjectListLayout<Issuer, IssuerApi>
      store={store}
      isConfigurable
      tableId="cert-manager-issuers"
      className="IssuersPage"
      renderTableHeader={[
        { title: "Name", className: "name" },
        { title: "Namespace", className: "namespace" },
        { title: "Ready", className: "ready" },
        { title: "Type", className: "type" },
      ]}
      renderTableContents={(issuer) => [
        issuer.getName(),
        issuer.getNs(),
        isIssuerReady(issuer) ? "✓" : "✗",
        getIssuerType(issuer),
      ]}
    />
  );
}
