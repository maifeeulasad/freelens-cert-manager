/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 * Co-Author: GitHub Copilot <copilot@github.com>
 *
 * "Force Renew" context menu item for Certificate resources.
 *
 * Mirrors what `cmctl renew` does: PUT the status subresource with an
 * "Issuing" condition (status=True, reason=ManuallyTriggered). This signals
 * cert-manager's trigger controller to begin re-issuance immediately.
 *
 * Ref: cert-manager pkg/ctl/renew.go — UpdateStatus path
 */

import { Renderer } from "@freelensapp/extensions";

import type { Certificate } from "../../common/api";

interface Props {
  object: Certificate;
}

export function CertificateForceRenewMenuItem({ object: cert }: Props) {
  function handleForceRenew() {
    const ns = cert.getNs();
    const name = cert.getName();

    Renderer.Component.ConfirmDialog.open({
      message: `Force-renew Certificate "${name}" in namespace "${ns}"?\n\ncert-manager will immediately begin issuing a replacement certificate.`,
      labelOk: "Force Renew",
      ok: async () => {
        try {
          const cluster = Renderer.Catalog.getActiveCluster();
          if (!cluster) throw new Error("No active cluster");
          const api = Renderer.K8sApi.KubeJsonApi.forCluster(cluster.id);

          // biome-ignore lint/suspicious/noExplicitAny: raw KubeObject property access
          const rawCert = cert as any;
          const existingConditions = (
            (rawCert.status?.conditions ?? []) as Array<{ type: string }>
          ).filter((c: { type: string }) => c.type !== "Issuing");

          const body = {
            apiVersion: "cert-manager.io/v1",
            kind: "Certificate",
            metadata: rawCert.metadata,
            status: {
              ...rawCert.status,
              conditions: [
                ...existingConditions,
                {
                  type: "Issuing",
                  status: "True",
                  reason: "ManuallyTriggered",
                  message: `Certificate "${name}" re-issuance manually triggered.`,
                  lastTransitionTime: new Date().toISOString(),
                  observedGeneration: rawCert.metadata?.generation ?? 0,
                },
              ],
            },
          };

          await api.put(`/apis/cert-manager.io/v1/namespaces/${ns}/certificates/${name}/status`, {
            data: body,
          });
        } catch (err) {
          Renderer.Component.Notifications.error(
            `Failed to force-renew Certificate "${ns}/${name}": ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      },
    });
  }

  return (
    <Renderer.Component.MenuItem icon="autorenew" onClick={handleForceRenew}>
      Force Renew
    </Renderer.Component.MenuItem>
  );
}
