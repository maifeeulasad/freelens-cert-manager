/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { getCertSpec, getCertStatus, isCertReady } from "../../common/api/accessors";

import type { Certificate } from "../../common/api";

interface Props {
  object: Certificate;
}

export function CertificateDetails({ object: cert }: Props) {
  const spec = getCertSpec(cert);
  const status = getCertStatus(cert);
  const ready = isCertReady(cert);
  const readyMessage = (status.conditions ?? []).find((c) => c.type === "Ready")?.message;
  const dnsNames = spec.dnsNames ?? [];

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
    </Renderer.Component.DrawerItem>
  );
}
