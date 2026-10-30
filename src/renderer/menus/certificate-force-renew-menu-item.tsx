/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * "Force Renew" context menu item for Certificate resources.
 *
 * cert-manager does not have a direct API call for forced renewal; the
 * canonical approach is to delete the managed Secret so cert-manager reissues
 * it, OR to add/toggle the annotation
 * `cert-manager.io/issuer-name` on the Certificate — but the most reliable
 * in-cluster trigger is bumping the `cert-manager.io/trigger-renew` annotation
 * with a timestamp, which the controller watches.
 *
 * Ref: https://cert-manager.io/docs/usage/certificate/#triggering-certificate-renewal-manually
 */

import { Renderer } from "@freelensapp/extensions";
import { Certificate } from "../../common/api";

import type { CertificateStore } from "../../common/api";

interface Props {
  object: Certificate;
}

export function CertificateForceRenewMenuItem({ object: cert }: Props) {
  async function handleForceRenew() {
    const api = (Certificate.getStore() as CertificateStore).api;
    const ns = cert.getNs();
    const name = cert.getName();

    try {
      await api.patch(
        { name, namespace: ns },
        {
          metadata: {
            annotations: {
              "cert-manager.io/trigger-renew": new Date().toISOString(),
            },
          },
        },
        "merge",
      );
    } catch (err) {
      console.error(`[cert-manager] force renew failed for ${ns}/${name}:`, err);
    }
  }

  return (
    <Renderer.Component.MenuItem onClick={handleForceRenew}>
      Force Renew
    </Renderer.Component.MenuItem>
  );
}
