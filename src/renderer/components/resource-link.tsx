/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Clickable link that opens a Kubernetes resource in the Freelens detail drawer.
 */

import { Renderer } from "@freelensapp/extensions";

interface Props {
  label: string;
  selfLink: string;
}

export function ResourceLink({ label, selfLink }: Props) {
  return (
    <button
      type="button"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: "var(--colorLink, #3d90ce)",
        textDecoration: "underline",
        font: "inherit",
      }}
      onClick={() => Renderer.Navigation.showDetails(selfLink)}
    >
      {label}
    </button>
  );
}

// ── Self-link builders ────────────────────────────────────────────────────────

export function certSelfLink(ns: string, name: string): string {
  return `/apis/cert-manager.io/v1/namespaces/${ns}/certificates/${name}`;
}

export function certReqSelfLink(ns: string, name: string): string {
  return `/apis/cert-manager.io/v1/namespaces/${ns}/certificaterequests/${name}`;
}

export function orderSelfLink(ns: string, name: string): string {
  return `/apis/acme.cert-manager.io/v1/namespaces/${ns}/orders/${name}`;
}

export function challengeSelfLink(ns: string, name: string): string {
  return `/apis/acme.cert-manager.io/v1/namespaces/${ns}/challenges/${name}`;
}

// ── Owner-reference helpers ───────────────────────────────────────────────────

interface OwnerRef {
  kind: string;
  name: string;
  apiVersion?: string;
}

export function getOwnerRef(obj: unknown, kind: string): OwnerRef | undefined {
  const raw = obj as { metadata?: { ownerReferences?: OwnerRef[] } };
  return (raw.metadata?.ownerReferences ?? []).find((r) => r.kind === kind);
}
