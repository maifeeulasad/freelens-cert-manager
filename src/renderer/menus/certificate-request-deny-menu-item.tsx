/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * "Deny" menu item for CertificateRequests.
 * Calls the cert-manager approval subresource:
 *   PUT /apis/cert-manager.io/v1/namespaces/{ns}/certificaterequests/{name}/approval
 * with the full CR body including a "Denied" condition in status.conditions.
 * Only shown when the CR has not yet been approved or denied.
 */

import { Renderer } from "@freelensapp/extensions";
import { CertificateRequest } from "../../common/api";
import { isCertReqApproved, isCertReqDenied } from "../../common/api/accessors";

import type { CertificateRequestStore } from "../../common/api";

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
          const api = (CertificateRequest.getStore() as CertificateRequestStore).api;
          const resourceUrl = (api as any).formatUrlForNotListing({ name, namespace: ns });
          const rawCr = cr as any;
          const existingConditions = (
            (rawCr.status?.conditions ?? []) as Array<{ type: string }>
          ).filter((c) => c.type !== "Approved" && c.type !== "Denied");
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
          await (api as any).put(`${resourceUrl}/approval`, { data: body });
        } catch (err) {
          console.error(
            `[cert-manager] deny CertificateRequest failed for ${cr.getNs()}/${cr.getName()}:`,
            err,
          );
        }
      },
    });
  }

  return <Renderer.Component.MenuItem onClick={handleDeny}>Deny</Renderer.Component.MenuItem>;
}
