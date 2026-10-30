/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import {
  getCertReqSpec,
  getCertReqStatus,
  isCertReqApproved,
  isCertReqDenied,
  isCertReqReady,
} from "../../common/api/accessors";

import type { CertificateRequest } from "../../common/api";

interface Props {
  object: CertificateRequest;
}

export function CertificateRequestDetails({ object: cr }: Props) {
  const spec = getCertReqSpec(cr);
  const status = getCertReqStatus(cr);
  const usages = spec.usages ?? [];
  const readyMessage = (status.conditions ?? []).find((c) => c.type === "Ready")?.message;

  return (
    <Renderer.Component.DrawerItem name="CertificateRequest Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Issuer">
        {spec.issuerRef ? `${spec.issuerRef.kind}/${spec.issuerRef.name}` : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Duration">
        {spec.duration ?? "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Is CA">
        {spec.isCA ? "Yes" : "No"}
      </Renderer.Component.DrawerItem>

      {usages.length > 0 && (
        <Renderer.Component.DrawerItem name="Usages">
          {usages.join(", ")}
        </Renderer.Component.DrawerItem>
      )}

      <Renderer.Component.DrawerItem name="Status">
        {isCertReqReady(cr) ? "✓ Ready" : isCertReqDenied(cr) ? "✗ Denied" : "⏳ Pending"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Approved">
        {isCertReqApproved(cr) ? "Yes" : "No"}
      </Renderer.Component.DrawerItem>

      {status.failureTime && (
        <Renderer.Component.DrawerItem name="Failed At">
          {status.failureTime}
        </Renderer.Component.DrawerItem>
      )}

      {readyMessage && (
        <Renderer.Component.DrawerItem name="Message">{readyMessage}</Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
