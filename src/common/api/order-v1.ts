/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager ACME Order CRD — v1
 * Ref: https://cert-manager.io/docs/reference/api-docs/#acme.cert-manager.io/v1.Order
 */

import { Renderer } from "@freelensapp/extensions";

export type AcmeState =
  | "valid"
  | "ready"
  | "pending"
  | "processing"
  | "invalid"
  | "expired"
  | "errored";

export interface OrderSpec {
  request?: string;
  issuerRef?: { name: string; kind: string; group?: string };
  dnsNames?: string[];
  ipAddresses?: string[];
  duration?: string;
  commonName?: string;
}

export interface OrderAuthorization {
  url: string;
  identifier: string;
  wildcard?: boolean;
  initialState?: AcmeState;
  challenges?: unknown[];
}

export interface OrderStatus {
  state?: AcmeState;
  url?: string;
  finalizeURL?: string;
  certificate?: string;
  failureTime?: string;
  reason?: string;
  authorizations?: OrderAuthorization[];
}

export class Order extends Renderer.K8sApi.LensExtensionKubeObject<
  Renderer.K8sApi.KubeObjectMetadata,
  OrderStatus,
  OrderSpec
> {
  declare kind: "Order";
  declare apiVersion: "acme.cert-manager.io/v1";

  static readonly kind = "Order";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/acme.cert-manager.io/v1/orders";

  static readonly crd: Renderer.K8sApi.LensExtensionKubeObjectCRD & { title: string } = {
    apiVersions: ["acme.cert-manager.io/v1"],
    plural: "orders",
    singular: "order",
    shortNames: [],
    title: "Orders",
  };
}

export class OrderApi extends Renderer.K8sApi.KubeApi<Order> {}
export class OrderStore extends Renderer.K8sApi.KubeObjectStore<Order, OrderApi> {}
