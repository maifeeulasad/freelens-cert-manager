/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * "Delete (stuck)" menu item for ACME Orders.
 * Orders can get stuck in a non-valid state when ACME challenge validation
 * fails or times out. Deleting a stuck Order causes cert-manager to retry
 * the issuance from scratch.
 */

import { Renderer } from "@freelensapp/extensions";
import { Order } from "../../common/api";
import { acmeStateLabel, getOrderStatus } from "../../common/api/accessors";

import type { OrderStore } from "../../common/api";

interface Props {
  object: Order;
}

export function OrderDeleteStuckMenuItem({ object: order }: Props) {
  const state = getOrderStatus(order).state;
  const isStuck = state && state !== "valid" && state !== "ready";

  if (!isStuck) return null;

  function handleDelete() {
    const ns = order.getNs();
    const name = order.getName();

    Renderer.Component.ConfirmDialog.open({
      message: `Delete stuck Order "${name}" in namespace "${ns}" (state: ${acmeStateLabel(state)})?\n\ncert-manager will retry issuance from scratch.`,
      labelOk: "Delete",
      ok: async () => {
        try {
          const api = (Order.getStore() as OrderStore).api;
          await api.delete({ name, namespace: ns });
        } catch (err) {
          console.error(`[cert-manager] delete Order failed for ${ns}/${name}:`, err);
        }
      },
    });
  }

  return (
    <Renderer.Component.MenuItem onClick={handleDelete}>Delete (stuck)</Renderer.Component.MenuItem>
  );
}
