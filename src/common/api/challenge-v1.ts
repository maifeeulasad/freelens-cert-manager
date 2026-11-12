/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * cert-manager ACME Challenge CRD — v1
 * Ref: https://cert-manager.io/docs/reference/api-docs/#acme.cert-manager.io/v1.Challenge
 */

import { Renderer } from "@freelensapp/extensions";

import type { AcmeState } from "./order-v1";

export type ChallengeType = "http-01" | "dns-01" | "tls-alpn-01";

export interface ChallengeSpec {
  url?: string;
  authorizationURL?: string;
  dnsName?: string;
  wildcard?: boolean;
  type?: ChallengeType;
  token?: string;
  key?: string;
  issuerRef?: { name: string; kind: string; group?: string };
  solver?: unknown;
}

export interface ChallengeStatus {
  state?: AcmeState;
  reason?: string;
  presented?: boolean;
  processing?: boolean;
}

export class Challenge extends Renderer.K8sApi.LensExtensionKubeObject<
  Renderer.K8sApi.KubeObjectMetadata,
  ChallengeStatus,
  ChallengeSpec
> {
  declare kind: "Challenge";
  declare apiVersion: "acme.cert-manager.io/v1";

  static readonly kind = "Challenge";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/acme.cert-manager.io/v1/challenges";

  static readonly crd: Renderer.K8sApi.LensExtensionKubeObjectCRD & { title: string } = {
    apiVersions: ["acme.cert-manager.io/v1"],
    plural: "challenges",
    singular: "challenge",
    shortNames: [],
    title: "Challenges",
  };
}

export class ChallengeApi extends Renderer.K8sApi.KubeApi<Challenge> {}
export class ChallengeStore extends Renderer.K8sApi.KubeObjectStore<Challenge, ChallengeApi> {}
