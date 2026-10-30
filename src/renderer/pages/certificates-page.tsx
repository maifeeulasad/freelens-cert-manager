/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { load } from "js-yaml";
import { useState } from "react";
import {
  Certificate,
  type CertificateApi,
  type CertificateSpec,
  type CertificateStatus,
  type CertificateStore,
} from "../../common/api";
import { YamlEditorDialog } from "../components/yaml-editor-dialog";
import { NotInstalled } from "./not-installed";

function certSpec(obj: Renderer.K8sApi.KubeObject): CertificateSpec {
  return (obj as unknown as { spec: CertificateSpec }).spec ?? {};
}

function certStatus(obj: Renderer.K8sApi.KubeObject): CertificateStatus {
  return (obj as unknown as { status: CertificateStatus }).status ?? {};
}

function certIsReady(obj: Renderer.K8sApi.KubeObject): boolean {
  return (certStatus(obj).conditions ?? []).some((c) => c.type === "Ready" && c.status === "True");
}

const CERT_TEMPLATE = `apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-certificate
  namespace: default
spec:
  secretName: my-certificate-tls
  issuerRef:
    name: selfsigned-issuer
    kind: Issuer
  dnsNames:
    - example.com
`;

export function CertificatesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [createYaml, setCreateYaml] = useState(CERT_TEMPLATE);

  let store: ReturnType<typeof Certificate.getStore<Certificate>>;
  try {
    store = Certificate.getStore<Certificate>();
  } catch {
    return <NotInstalled resource="Certificate" />;
  }

  async function handleCreate(yamlStr: string) {
    const data = load(yamlStr) as Record<string, unknown>;
    const meta = data.metadata as Record<string, unknown>;
    const api = (store as unknown as CertificateStore).api;
    await api.create(
      { name: String(meta?.name ?? ""), namespace: String(meta?.namespace ?? "default") },
      data as Parameters<typeof api.create>[1],
    );
    setCreateOpen(false);
  }

  return (
    <>
      <Renderer.Component.KubeObjectListLayout<Certificate, CertificateApi>
        store={store}
        isConfigurable
        tableId="cert-manager-certificates"
        className="CertificatesPage"
        renderTableHeader={[
          { title: "Name", className: "name" },
          { title: "Namespace", className: "namespace" },
          { title: "Ready", className: "ready" },
          { title: "Secret", className: "secret" },
          { title: "Expires", className: "expiry" },
        ]}
        renderTableContents={(cert) => [
          cert.getName(),
          cert.getNs(),
          certIsReady(cert) ? "✓" : "✗",
          certSpec(cert).secretName ?? "-",
          certStatus(cert).notAfter ?? "-",
        ]}
        addRemoveButtons={{
          onAdd: () => {
            setCreateYaml(CERT_TEMPLATE);
            setCreateOpen(true);
          },
          addTooltip: "Create Certificate",
        }}
      />
      <YamlEditorDialog
        isOpen={createOpen}
        title="Create Certificate"
        value={createYaml}
        onChange={setCreateYaml}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
    </>
  );
}
