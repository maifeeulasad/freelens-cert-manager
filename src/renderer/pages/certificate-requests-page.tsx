/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { load } from "js-yaml";
import { useState } from "react";
import {
  CertificateRequest,
  type CertificateRequestApi,
  type CertificateRequestStore,
} from "../../common/api";
import {
  getCertReqSpec,
  isCertReqApproved,
  isCertReqDenied,
  isCertReqReady,
} from "../../common/api/accessors";
import { YamlEditorDialog } from "../components/yaml-editor-dialog";
import { NotInstalled } from "./not-installed";

const CERT_REQUEST_TEMPLATE = `apiVersion: cert-manager.io/v1
kind: CertificateRequest
metadata:
  name: my-certificate-request
  namespace: default
spec:
  issuerRef:
    name: my-issuer
    kind: Issuer
  # request: <base64-encoded PEM CSR>
  duration: 2160h
`;

export function CertificateRequestsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [createYaml, setCreateYaml] = useState(CERT_REQUEST_TEMPLATE);

  let store: ReturnType<typeof CertificateRequest.getStore<CertificateRequest>>;
  try {
    store = CertificateRequest.getStore<CertificateRequest>();
  } catch {
    return <NotInstalled resource="CertificateRequest" />;
  }

  async function handleCreate(yamlStr: string) {
    const data = load(yamlStr) as Record<string, unknown>;
    const meta = data.metadata as Record<string, unknown>;
    const api = (store as unknown as CertificateRequestStore).api;
    await api.create(
      { name: String(meta?.name ?? ""), namespace: String(meta?.namespace ?? "default") },
      data as Parameters<typeof api.create>[1],
    );
    setCreateOpen(false);
  }

  return (
    <>
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
        addRemoveButtons={{
          onAdd: () => {
            setCreateYaml(CERT_REQUEST_TEMPLATE);
            setCreateOpen(true);
          },
          addTooltip: "Create CertificateRequest",
        }}
      />
      <YamlEditorDialog
        isOpen={createOpen}
        title="Create CertificateRequest"
        value={createYaml}
        onChange={setCreateYaml}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
    </>
  );
}
