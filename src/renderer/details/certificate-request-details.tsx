/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { CertificateRequest } from "../../common/api";

interface Props {
  object: CertificateRequest;
}

export function CertificateRequestDetails({ object: cr }: Props) {
  return (
    <Renderer.Component.DrawerItem name="CertificateRequest Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Issuer">
        {cr.issuerRef ? `${cr.issuerRef.kind}/${cr.issuerRef.name}` : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Duration">
        {cr.duration ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Is CA">
        {cr.isCA ? "Yes" : "No"}
      </Renderer.Component.DrawerItem>

      {cr.usages.length > 0 && (
        <Renderer.Component.DrawerItem name="Usages">
          {cr.usages.join(", ")}
        </Renderer.Component.DrawerItem>
      )}

      <Renderer.Component.DrawerItem name="Status">
        {cr.isReady ? "✓ Ready" : cr.isDenied ? "✗ Denied" : "⏳ Pending"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Approved">
        {cr.isApproved ? "Yes" : "No"}
      </Renderer.Component.DrawerItem>

      {cr.failureTime && (
        <Renderer.Component.DrawerItem name="Failed At">
          {cr.failureTime}
        </Renderer.Component.DrawerItem>
      )}

      {cr.readyMessage && (
        <Renderer.Component.DrawerItem name="Message">
          {cr.readyMessage}
        </Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
