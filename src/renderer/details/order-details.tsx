/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Challenge } from "../../common/api";
import { acmeStateLabel, getOrderSpec, getOrderStatus } from "../../common/api/accessors";
import {
  certReqSelfLink,
  challengeSelfLink,
  getOwnerRef,
  ResourceLink,
} from "../components/resource-link";

import type { ChallengeStore, Order } from "../../common/api";

interface Props {
  object: Order;
}

function getOwnedChallenges(order: Order) {
  try {
    const store = Challenge.getStore() as ChallengeStore;
    return store.items.filter((ch) => {
      const raw = ch as unknown as {
        metadata?: { ownerReferences?: Array<{ kind: string; name: string }> };
      };
      return (raw.metadata?.ownerReferences ?? []).some(
        (r) => r.kind === "Order" && r.name === order.getName(),
      );
    });
  } catch {
    return [];
  }
}

export function OrderDetails({ object: order }: Props) {
  const spec = getOrderSpec(order);
  const status = getOrderStatus(order);
  const dnsNames = spec.dnsNames ?? [];
  const ipAddresses = spec.ipAddresses ?? [];
  const parentCR = getOwnerRef(order, "CertificateRequest");
  const ownedChallenges = getOwnedChallenges(order);

  return (
    <Renderer.Component.DrawerItem name="Order Details" labelsOnly>
      <Renderer.Component.DrawerItem name="State">
        {acmeStateLabel(status.state)}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Issuer">
        {spec.issuerRef ? `${spec.issuerRef.kind}/${spec.issuerRef.name}` : "-"}
      </Renderer.Component.DrawerItem>

      {dnsNames.length > 0 && (
        <Renderer.Component.DrawerItem name="DNS Names">
          {dnsNames.join(", ")}
        </Renderer.Component.DrawerItem>
      )}

      {ipAddresses.length > 0 && (
        <Renderer.Component.DrawerItem name="IP Addresses">
          {ipAddresses.join(", ")}
        </Renderer.Component.DrawerItem>
      )}

      {spec.commonName && (
        <Renderer.Component.DrawerItem name="Common Name">
          {spec.commonName}
        </Renderer.Component.DrawerItem>
      )}

      {spec.duration && (
        <Renderer.Component.DrawerItem name="Duration">
          {spec.duration}
        </Renderer.Component.DrawerItem>
      )}

      {status.url && (
        <Renderer.Component.DrawerItem name="ACME URL">{status.url}</Renderer.Component.DrawerItem>
      )}

      {status.reason && (
        <Renderer.Component.DrawerItem name="Reason">{status.reason}</Renderer.Component.DrawerItem>
      )}

      {status.failureTime && (
        <Renderer.Component.DrawerItem name="Failed At">
          {status.failureTime}
        </Renderer.Component.DrawerItem>
      )}

      {status.authorizations && status.authorizations.length > 0 && (
        <Renderer.Component.DrawerItem name="Authorizations">
          {status.authorizations.map((a) => a.identifier).join(", ")}
        </Renderer.Component.DrawerItem>
      )}

      {parentCR && (
        <Renderer.Component.DrawerItem name="Certificate Request">
          <ResourceLink
            label={parentCR.name}
            selfLink={certReqSelfLink(order.getNs() ?? "", parentCR.name)}
          />
        </Renderer.Component.DrawerItem>
      )}

      {ownedChallenges.length > 0 && (
        <Renderer.Component.DrawerItem name="Challenges">
          {ownedChallenges.map((ch) => (
            <ResourceLink
              key={ch.getName()}
              label={ch.getName()}
              selfLink={challengeSelfLink(ch.getNs() ?? "", ch.getName())}
            />
          ))}
        </Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
