/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 * Co-Author: GitHub Copilot <copilot@github.com>
 *
 * "Deny" menu item for CertificateRequests.
 * PUTs the status subresource with a "Denied" condition (status=True).
 * Only shown when the CR has not yet been approved or denied.
 *
 * Ref: cert-manager API — CertificateRequest approval via status subresource
 */

import { Renderer } from "@freelensapp/extensions";
import { isCertReqApproved, isCertReqDenied } from "../../common/api/accessors";

import type { CertificateRequest } from "../../common/api";

interface Props {
  object: CertificateRequest;
}

export function CertificateRequestDenyMenuItem({ object: cr }: Props) {
  const alreadyDecided = isCertReqApproved(cr) || isCertReqDenied(cr);

  if (alreadyDecided) return null;

  function handleDeny() {
    const ns = cr.getNs();
    const name = cr.getName();

    Renderer.Component.ConfirmDialog.open({
      message: `Deny CertificateRequest "${name}" in namespace "${ns}"?\n\nThis will prevent cert-manager from issuing the certificate.`,
      labelOk: "Deny",
      ok: async () => {
        try {
          const cluster = Renderer.Catalog.getActiveCluster();
          if (!cluster) throw new Error("No active cluster");
          const api = Renderer.K8sApi.KubeJsonApi.forCluster(cluster.id);

          // biome-ignore lint/suspicious/noExplicitAny: raw KubeObject property access
          const rawCr = cr as any;
          const existingConditions = (
            (rawCr.status?.conditions ?? []) as Array<{ type: string }>
          ).filter((c: { type: string }) => c.type !== "Approved" && c.type !== "Denied");

          const body = {
            apiVersion: "cert-manager.io/v1",
            kind: "CertificateRequest",
            metadata: rawCr.metadata,
            spec: rawCr.spec,
            status: {
              ...rawCr.status,
              conditions: [
                ...existingConditions,
                {
                  type: "Denied",
                  status: "True",
                  reason: "DeniedByUser",
                  message: `Certificate request "${name}" denied.`,
                  lastTransitionTime: new Date().toISOString(),
                },
              ],
            },
          };

          await api.put(
            `/apis/cert-manager.io/v1/namespaces/${ns}/certificaterequests/${name}/status`,
            { data: body },
          );
        } catch (err) {
          Renderer.Component.Notifications.error(
            `Failed to deny CertificateRequest "${ns}/${name}": ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      },
    });
  }

  return (
    <Renderer.Component.MenuItem icon="cancel" onClick={handleDeny}>
      Deny
    </Renderer.Component.MenuItem>
  );
}
