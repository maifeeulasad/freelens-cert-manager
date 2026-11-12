/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Health summary bar for the Certificates list page.
 * Shows total / ready / expiring-soon / expired counts at a glance.
 */

import { observer } from "mobx-react";
import { getCertStatus, isCertReady } from "../../common/api/accessors";

import type { Certificate, CertificateStore } from "../../common/api";

function daysRemaining(notAfter: string | undefined): number | null {
  if (!notAfter) return null;
  return Math.floor((new Date(notAfter).getTime() - Date.now()) / 86_400_000);
}

interface Counts {
  total: number;
  ready: number;
  expiringSoon: number;
  expired: number;
}

function computeCounts(certs: Certificate[]): Counts {
  let ready = 0;
  let expiringSoon = 0;
  let expired = 0;

  for (const cert of certs) {
    if (isCertReady(cert)) ready++;
    const days = daysRemaining(getCertStatus(cert).notAfter);
    if (days !== null) {
      if (days < 0) expired++;
      else if (days < 30) expiringSoon++;
    }
  }

  return { total: certs.length, ready, expiringSoon, expired };
}

interface TileProps {
  value: number;
  label: string;
  color: string;
}

function Tile({ value, label, color }: TileProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6px 16px",
        borderRadius: "6px",
        background: "rgba(128,128,128,0.08)",
        minWidth: "72px",
        gap: "2px",
      }}
    >
      <span style={{ fontSize: "1.4em", fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: "0.72em", opacity: 0.7, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

interface Props {
  store: CertificateStore;
}

export function CertHealthSummary({ store }: Props) {
  const certs = store.items as Certificate[];
  if (certs.length === 0) return null;

  const { total, ready, expiringSoon, expired } = computeCounts(certs);
  const notReady = total - ready;

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px 0 4px",
        flexWrap: "wrap",
      }}
    >
      <Tile value={total} label="Total" color="var(--colorTextPrimary, #fff)" />
      <Tile value={ready} label="Ready" color="#66bb6a" />
      {notReady > 0 && <Tile value={notReady} label="Not Ready" color="#ef5350" />}
      {expiringSoon > 0 && <Tile value={expiringSoon} label="Expiring" color="#ffa726" />}
      {expired > 0 && <Tile value={expired} label="Expired" color="#ef5350" />}
    </div>
  );
}

export const CertHealthSummaryObserver = observer(CertHealthSummary);
