/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Order, type OrderApi } from "../../common/api";
import { acmeStateLabel, getOrderSpec, getOrderStatus } from "../../common/api/accessors";
import { NotInstalled } from "./not-installed";

export function OrdersPage() {
  let store: ReturnType<typeof Order.getStore<Order>>;
  try {
    store = Order.getStore<Order>();
  } catch {
    return <NotInstalled resource="Order" />;
  }

  return (
    <Renderer.Component.KubeObjectListLayout<Order, OrderApi>
      store={store}
      isConfigurable
      tableId="cert-manager-orders"
      className="OrdersPage"
      renderTableHeader={[
        { title: "Name", className: "name" },
        { title: "Namespace", className: "namespace" },
        { title: "State", className: "state" },
        { title: "Issuer", className: "issuer" },
        { title: "DNS Names", className: "dns" },
      ]}
      renderTableContents={(order) => {
        const spec = getOrderSpec(order);
        const status = getOrderStatus(order);
        const issuerRef = spec.issuerRef;
        const dnsNames = spec.dnsNames ?? [];
        return [
          order.getName(),
          order.getNs(),
          acmeStateLabel(status.state),
          issuerRef ? `${issuerRef.kind}/${issuerRef.name}` : "-",
          dnsNames.length > 0 ? dnsNames.join(", ") : "-",
        ];
      }}
    />
  );
}
