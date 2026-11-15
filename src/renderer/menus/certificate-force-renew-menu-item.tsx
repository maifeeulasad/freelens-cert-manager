/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
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
import { Certificate } from "../../common/api";

import type { CertificateStore } from "../../common/api";

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
          const api = (Certificate.getStore() as CertificateStore).api;
          // biome-ignore lint/suspicious/noExplicitAny: Freelens internal KubeApi methods not in public types
          const baseUrl = (api as any).formatUrlForNotListing({ name, namespace: ns });

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

          // biome-ignore lint/suspicious/noExplicitAny: Freelens internal API — status subresource PUT
          await (api as any).put(`${baseUrl}/status`, { data: body });
        } catch (err) {
          console.error(`[cert-manager] force renew failed for ${ns}/${name}:`, err);
        }
      },
    });
  }

  return (
    <Renderer.Component.MenuItem onClick={handleForceRenew}>
      Force Renew
    </Renderer.Component.MenuItem>
  );
}
