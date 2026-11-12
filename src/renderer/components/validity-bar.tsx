/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Visual validity bar for TLS certificates.
 * Shows a colored progress bar representing how much of the cert's lifetime
 * remains (full = healthy, empty = expiring/expired), plus a days-remaining label.
 *
 * Color thresholds (days remaining):
 *   > 30 days  → green   (#66bb6a)
 *   7–30 days  → amber   (#ffa726)
 *   < 7 days   → red     (#ef5350)
 *   expired    → red
 */

interface Props {
  notBefore?: string;
  notAfter?: string;
}

function daysRemaining(notAfter: string): number {
  return Math.floor((new Date(notAfter).getTime() - Date.now()) / 86_400_000);
}

function pctRemaining(notBefore: string | undefined, notAfter: string): number {
  const end = new Date(notAfter).getTime();
  const start = notBefore ? new Date(notBefore).getTime() : end - 90 * 86_400_000;
  const total = end - start;
  if (total <= 0) return 0;
  const remaining = end - Date.now();
  return Math.min(100, Math.max(0, (remaining / total) * 100));
}

function barColor(days: number): string {
  if (days < 7) return "#ef5350";
  if (days < 30) return "#ffa726";
  return "#66bb6a";
}

function expiryLabel(days: number): string {
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return "Expires today";
  return `${days}d left`;
}

export function ValidityBar({ notBefore, notAfter }: Props) {
  if (!notAfter) return <span>-</span>;

  const days = daysRemaining(notAfter);
  const pct = pctRemaining(notBefore, notAfter);
  const color = barColor(days);
  const label = expiryLabel(days);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "110px" }}>
      <div
        style={{
          height: "4px",
          background: "rgba(128,128,128,0.2)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "2px",
          }}
        />
      </div>
      <span style={{ fontSize: "0.78em", color, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

/** Larger variant for the detail drawer — shows bar + both dates. */
export function ValidityBarDetail({ notBefore, notAfter }: Props) {
  if (!notAfter) return <span>-</span>;

  const days = daysRemaining(notAfter);
  const pct = pctRemaining(notBefore, notAfter);
  const color = barColor(days);
  const label = expiryLabel(days);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        width: "100%",
        maxWidth: "280px",
      }}
    >
      <div
        style={{
          height: "6px",
          background: "rgba(128,128,128,0.2)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "3px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.8em",
          opacity: 0.85,
        }}
      >
        <span>{notBefore ? new Date(notBefore).toLocaleDateString() : "—"}</span>
        <span style={{ color, fontWeight: 600 }}>{label}</span>
        <span>{new Date(notAfter).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
