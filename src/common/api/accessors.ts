/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Raw-data accessors for cert-manager CRD objects.
 *
 * Freelens creates KubeObject instances using the Freelens-internal base class,
 * not our subclass constructors, so prototype getters on Certificate/Issuer/etc.
 * are not reachable at runtime. These helpers read spec/status from the raw
 * object properties directly.
 */

import type { Renderer } from "@freelensapp/extensions";

import type {
  CertificateRequestSpec,
  CertificateRequestStatus,
  CertificateSpec,
  CertificateStatus,
  ClusterIssuerSpec,
  ClusterIssuerStatus,
  IssuerSpec,
  IssuerStatus,
} from ".";

type AnyObj = Renderer.K8sApi.KubeObject;
type Raw<T> = AnyObj & { spec?: T; status?: T };

function rawSpec<T>(obj: AnyObj): T {
  return ((obj as Raw<T>).spec as T) ?? ({} as T);
}

function rawStatus<T>(obj: AnyObj): T {
  return ((obj as Raw<T>).status as T) ?? ({} as T);
}

function conditionReady(conditions: Array<{ type: string; status: string }> | undefined): boolean {
  return (conditions ?? []).some((c) => c.type === "Ready" && c.status === "True");
}

// ── Certificate ─────────────────────────────────────────────────────────────

export function getCertSpec(obj: AnyObj): CertificateSpec {
  return rawSpec<CertificateSpec>(obj);
}

export function getCertStatus(obj: AnyObj): CertificateStatus {
  return rawStatus<CertificateStatus>(obj);
}

export function isCertReady(obj: AnyObj): boolean {
  return conditionReady(getCertStatus(obj).conditions);
}

// ── Issuer ───────────────────────────────────────────────────────────────────

export function getIssuerSpec(obj: AnyObj): IssuerSpec {
  return rawSpec<IssuerSpec>(obj);
}

export function getIssuerStatus(obj: AnyObj): IssuerStatus {
  return rawStatus<IssuerStatus>(obj);
}

export function isIssuerReady(obj: AnyObj): boolean {
  return conditionReady(getIssuerStatus(obj).conditions);
}

export function getIssuerType(obj: AnyObj): string {
  const spec = getIssuerSpec(obj);
  if (spec.acme) return "ACME";
  if (spec.ca) return "CA";
  if (spec.selfSigned) return "SelfSigned";
  if (spec.vault) return "Vault";
  if (spec.venafi) return "Venafi";
  return "Unknown";
}

// ── ClusterIssuer ─────────────────────────────────────────────────────────────

export function getClusterIssuerSpec(obj: AnyObj): ClusterIssuerSpec {
  return rawSpec<ClusterIssuerSpec>(obj);
}

export function getClusterIssuerStatus(obj: AnyObj): ClusterIssuerStatus {
  return rawStatus<ClusterIssuerStatus>(obj);
}

export function isClusterIssuerReady(obj: AnyObj): boolean {
  return conditionReady(getClusterIssuerStatus(obj).conditions);
}

export function getClusterIssuerType(obj: AnyObj): string {
  const spec = getClusterIssuerSpec(obj);
  if (spec.acme) return "ACME";
  if (spec.ca) return "CA";
  if (spec.selfSigned) return "SelfSigned";
  if (spec.vault) return "Vault";
  if (spec.venafi) return "Venafi";
  return "Unknown";
}

// ── CertificateRequest ────────────────────────────────────────────────────────

export function getCertReqSpec(obj: AnyObj): CertificateRequestSpec {
  return rawSpec<CertificateRequestSpec>(obj);
}

export function getCertReqStatus(obj: AnyObj): CertificateRequestStatus {
  return rawStatus<CertificateRequestStatus>(obj);
}

export function isCertReqReady(obj: AnyObj): boolean {
  return conditionReady(getCertReqStatus(obj).conditions);
}

export function isCertReqDenied(obj: AnyObj): boolean {
  return (getCertReqStatus(obj).conditions ?? []).some(
    (c) => c.type === "Denied" && c.status === "True",
  );
}

export function isCertReqApproved(obj: AnyObj): boolean {
  return (getCertReqStatus(obj).conditions ?? []).some(
    (c) => c.type === "Approved" && c.status === "True",
  );
}
