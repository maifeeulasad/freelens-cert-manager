/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";

import type { Certificate } from "../../common/api";

interface Props {
  object: Certificate;
}

export function CertificateDetails({ object: cert }: Props) {
  return (
    <Renderer.Component.DrawerItem name="Certificate Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Secret Name">
        {cert.secretName ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Common Name">
        {cert.commonName ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="DNS Names">
        {cert.dnsNames.length > 0 ? cert.dnsNames.join(", ") : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Issuer">
        {cert.issuerRef ? `${cert.issuerRef.kind}/${cert.issuerRef.name}` : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Duration">
        {cert.duration ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Renew Before">
        {cert.renewBefore ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Not Before">
        {cert.notBefore ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Not After (Expires)">
        {cert.notAfter ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Renewal Time">
        {cert.renewalTime ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Status">
        {cert.isReady ? "✓ Ready" : "✗ Not Ready"}
      </Renderer.Component.DrawerItem>

      {cert.readyMessage && (
        <Renderer.Component.DrawerItem name="Message">
          {cert.readyMessage}
        </Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
