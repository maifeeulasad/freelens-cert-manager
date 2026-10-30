/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * "Delete (cascade)" context menu item for Certificate resources.
 *
 * Deletes the Certificate object and, if spec.secretName is set, deletes that
 * Secret too. cert-manager does NOT garbage-collect the Secret on Certificate
 * deletion unless --enable-certificate-owner-ref is set on the controller.
 *
 * Ref: https://cert-manager.io/docs/usage/certificate/#cleaning-up-after-a-deleted-certificate
 */

import { Renderer } from "@freelensapp/extensions";
import { Certificate, CertificateStore } from "../../common/api";

interface Props {
  object: Certificate;
}

export function CertificateDeleteCascadeMenuItem({ object: cert }: Props) {
  function handleDeleteCascade() {
    const ns = cert.getNs();
    const name = cert.getName();
    const secretName = cert.secretName;

    Renderer.Component.ConfirmDialog.open({
      message: secretName
        ? `Delete Certificate "${name}" and its managed Secret "${secretName}"?`
        : `Delete Certificate "${name}"?`,
      labelOk: "Delete",
      ok: async () => {
        try {
          const certApi = (Certificate.getStore() as CertificateStore).api;
          await certApi.delete({ name, namespace: ns });

          if (secretName) {
            const secretApi = Renderer.K8sApi.apiManager.getApiByKind(
              "Secret",
              "v1",
            ) as unknown as Renderer.K8sApi.KubeApi<Renderer.K8sApi.KubeObject>;
            if (secretApi) {
              await secretApi.delete({ name: secretName, namespace: ns });
            }
          }
        } catch (err) {
          console.error(`[cert-manager] cascade delete failed for ${ns}/${name}:`, err);
        }
      },
    });
  }

  return (
    <Renderer.Component.MenuItem onClick={handleDeleteCascade}>
      Delete (cascade)
    </Renderer.Component.MenuItem>
  );
}
