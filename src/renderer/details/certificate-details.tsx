/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { CertificateRequest } from "../../common/api";
import { getCertSpec, getCertStatus, isCertReady } from "../../common/api/accessors";
import { certReqSelfLink, ResourceLink } from "../components/resource-link";
import { ValidityBarDetail } from "../components/validity-bar";

import type { Certificate, CertificateRequestStore } from "../../common/api";

interface Props {
  object: Certificate;
}

function getIngressUsers(secretName: string | undefined, ns: string | undefined) {
  if (!secretName) return [];
  try {
    const store = Renderer.K8sApi.ingressStore;
    return store.items.filter((ing) => {
      const raw = ing as unknown as {
        spec?: { tls?: Array<{ secretName?: string }> };
        metadata?: { namespace?: string };
      };
      if (raw.metadata?.namespace !== ns) return false;
      return (raw.spec?.tls ?? []).some((t) => t.secretName === secretName);
    });
  } catch {
    return [];
  }
}

function getOwnedCertReqs(cert: Certificate) {
  try {
    const store = CertificateRequest.getStore() as CertificateRequestStore;
    return store.items.filter((cr) => {
      const raw = cr as unknown as {
        metadata?: { ownerReferences?: Array<{ kind: string; name: string }> };
      };
      return (raw.metadata?.ownerReferences ?? []).some(
        (r) => r.kind === "Certificate" && r.name === cert.getName(),
      );
    });
  } catch {
    return [];
  }
}

export function CertificateDetails({ object: cert }: Props) {
  const spec = getCertSpec(cert);
  const status = getCertStatus(cert);
  const ready = isCertReady(cert);
  const readyMessage = (status.conditions ?? []).find((c) => c.type === "Ready")?.message;
  const dnsNames = spec.dnsNames ?? [];
  const ownedCRs = getOwnedCertReqs(cert);
  const ingressUsers = getIngressUsers(spec.secretName, cert.getNs());

  return (
    <Renderer.Component.DrawerItem name="Certificate Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Secret Name">
        {spec.secretName ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Common Name">
        {spec.commonName ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="DNS Names">
        {dnsNames.length > 0 ? dnsNames.join(", ") : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Issuer">
        {spec.issuerRef ? `${spec.issuerRef.kind}/${spec.issuerRef.name}` : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Duration">
        {spec.duration ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Renew Before">
        {spec.renewBefore ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Validity">
        <ValidityBarDetail notBefore={status.notBefore} notAfter={status.notAfter} />
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Not Before">
        {status.notBefore ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Not After (Expires)">
        {status.notAfter ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Renewal Time">
        {status.renewalTime ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Status">
        {ready ? "✓ Ready" : "✗ Not Ready"}
      </Renderer.Component.DrawerItem>

      {readyMessage && (
        <Renderer.Component.DrawerItem name="Message">{readyMessage}</Renderer.Component.DrawerItem>
      )}

      {ownedCRs.length > 0 && (
        <Renderer.Component.DrawerItem name="Certificate Requests">
          {ownedCRs.map((cr) => (
            <ResourceLink
              key={cr.getName()}
              label={cr.getName()}
              selfLink={certReqSelfLink(cr.getNs() ?? "", cr.getName())}
            />
          ))}
        </Renderer.Component.DrawerItem>
      )}

      {ingressUsers.length > 0 && (
        <Renderer.Component.DrawerItem name="Used by Ingresses">
          {ingressUsers.map((ing) => ing.getName()).join(", ")}
        </Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
