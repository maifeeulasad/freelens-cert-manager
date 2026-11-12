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
import { CertHealthSummaryObserver } from "../components/cert-health-summary";
import { CertificateWizardDialog } from "../components/certificate-wizard-dialog";
import { ValidityBar } from "../components/validity-bar";
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

export function CertificatesPage() {
  const [wizardOpen, setWizardOpen] = useState(false);

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
    setWizardOpen(false);
  }

  return (
    <>
      <CertHealthSummaryObserver store={store as unknown as CertificateStore} />
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
          { title: "Validity", className: "expiry" },
        ]}
        renderTableContents={(cert) => {
          const spec = certSpec(cert);
          const status = certStatus(cert);
          return [
            cert.getName(),
            cert.getNs(),
            certIsReady(cert) ? "✓" : "✗",
            spec.secretName ?? "-",
            <ValidityBar key="validity" notBefore={status.notBefore} notAfter={status.notAfter} />,
          ];
        }}
        addRemoveButtons={{
          onAdd: () => setWizardOpen(true),
          addTooltip: "Create Certificate",
        }}
      />
      <CertificateWizardDialog
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  );
}
