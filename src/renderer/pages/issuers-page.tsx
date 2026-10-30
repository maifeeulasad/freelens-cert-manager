/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { load } from "js-yaml";
import { useState } from "react";
import { Issuer, type IssuerApi, type IssuerStore } from "../../common/api";
import { getIssuerType, isIssuerReady } from "../../common/api/accessors";
import { YamlEditorDialog } from "../components/yaml-editor-dialog";
import { NotInstalled } from "./not-installed";

const ISSUER_TEMPLATE = `apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: my-issuer
  namespace: default
spec:
  selfSigned: {}
`;

export function IssuersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [createYaml, setCreateYaml] = useState(ISSUER_TEMPLATE);

  let store: ReturnType<typeof Issuer.getStore<Issuer>>;
  try {
    store = Issuer.getStore<Issuer>();
  } catch {
    return <NotInstalled resource="Issuer" />;
  }

  async function handleCreate(yamlStr: string) {
    const data = load(yamlStr) as Record<string, unknown>;
    const meta = data.metadata as Record<string, unknown>;
    const api = (store as unknown as IssuerStore).api;
    await api.create(
      { name: String(meta?.name ?? ""), namespace: String(meta?.namespace ?? "default") },
      data as Parameters<typeof api.create>[1],
    );
    setCreateOpen(false);
  }

  return (
    <>
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
        addRemoveButtons={{
          onAdd: () => {
            setCreateYaml(ISSUER_TEMPLATE);
            setCreateOpen(true);
          },
          addTooltip: "Create Issuer",
        }}
      />
      <YamlEditorDialog
        isOpen={createOpen}
        title="Create Issuer"
        value={createYaml}
        onChange={setCreateYaml}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
    </>
  );
}
