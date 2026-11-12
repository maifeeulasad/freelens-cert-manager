/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Order } from "../../common/api";
import {
  getCertReqSpec,
  getCertReqStatus,
  isCertReqApproved,
  isCertReqDenied,
  isCertReqReady,
} from "../../common/api/accessors";
import {
  certSelfLink,
  getOwnerRef,
  orderSelfLink,
  ResourceLink,
} from "../components/resource-link";

import type { CertificateRequest, OrderStore } from "../../common/api";

interface Props {
  object: CertificateRequest;
}

function getOwnedOrders(cr: CertificateRequest) {
  try {
    const store = Order.getStore() as OrderStore;
    return store.items.filter((order) => {
      const raw = order as unknown as {
        metadata?: { ownerReferences?: Array<{ kind: string; name: string }> };
      };
      return (raw.metadata?.ownerReferences ?? []).some(
        (r) => r.kind === "CertificateRequest" && r.name === cr.getName(),
      );
    });
  } catch {
    return [];
  }
}

export function CertificateRequestDetails({ object: cr }: Props) {
  const spec = getCertReqSpec(cr);
  const status = getCertReqStatus(cr);
  const usages = spec.usages ?? [];
  const readyMessage = (status.conditions ?? []).find((c) => c.type === "Ready")?.message;
  const parentCert = getOwnerRef(cr, "Certificate");
  const ownedOrders = getOwnedOrders(cr);

  return (
    <>
      <Renderer.Component.DrawerTitle>CertificateRequest Details</Renderer.Component.DrawerTitle>
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

      {parentCert && (
        <Renderer.Component.DrawerItem name="Certificate">
          <ResourceLink
            label={parentCert.name}
            selfLink={certSelfLink(cr.getNs() ?? "", parentCert.name)}
          />
        </Renderer.Component.DrawerItem>
      )}

      {ownedOrders.length > 0 && (
        <Renderer.Component.DrawerItem name="Orders">
          {ownedOrders.map((order) => (
            <ResourceLink
              key={order.getName()}
              label={order.getName()}
              selfLink={orderSelfLink(order.getNs() ?? "", order.getName())}
            />
          ))}
        </Renderer.Component.DrawerItem>
      )}
    </>
  );
}
