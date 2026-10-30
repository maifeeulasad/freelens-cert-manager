/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { load } from "js-yaml";
import { useState } from "react";
import { ClusterIssuer, type ClusterIssuerApi, type ClusterIssuerStore } from "../../common/api";
import { getClusterIssuerType, isClusterIssuerReady } from "../../common/api/accessors";
import { YamlEditorDialog } from "../components/yaml-editor-dialog";
import { NotInstalled } from "./not-installed";

const CLUSTER_ISSUER_TEMPLATE = `apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: my-cluster-issuer
spec:
  selfSigned: {}
`;

export function ClusterIssuersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [createYaml, setCreateYaml] = useState(CLUSTER_ISSUER_TEMPLATE);

  let store: ReturnType<typeof ClusterIssuer.getStore<ClusterIssuer>>;
  try {
    store = ClusterIssuer.getStore<ClusterIssuer>();
  } catch {
    return <NotInstalled resource="ClusterIssuer" />;
  }

  async function handleCreate(yamlStr: string) {
    const data = load(yamlStr) as Record<string, unknown>;
    const meta = data.metadata as Record<string, unknown>;
    const api = (store as unknown as ClusterIssuerStore).api;
    await api.create({ name: String(meta?.name ?? "") }, data as Parameters<typeof api.create>[1]);
    setCreateOpen(false);
  }

  return (
    <>
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
        addRemoveButtons={{
          onAdd: () => {
            setCreateYaml(CLUSTER_ISSUER_TEMPLATE);
            setCreateOpen(true);
          },
          addTooltip: "Create ClusterIssuer",
        }}
      />
      <YamlEditorDialog
        isOpen={createOpen}
        title="Create ClusterIssuer"
        value={createYaml}
        onChange={setCreateYaml}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
    </>
  );
}
