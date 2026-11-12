/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { acmeStateLabel, getOrderSpec, getOrderStatus } from "../../common/api/accessors";

import type { Order } from "../../common/api";

interface Props {
  object: Order;
}

export function OrderDetails({ object: order }: Props) {
  const spec = getOrderSpec(order);
  const status = getOrderStatus(order);
  const dnsNames = spec.dnsNames ?? [];
  const ipAddresses = spec.ipAddresses ?? [];

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
    </Renderer.Component.DrawerItem>
  );
}
