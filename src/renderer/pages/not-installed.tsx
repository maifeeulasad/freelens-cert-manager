/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

export function NotInstalled({ resource }: { resource: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: "8px",
        opacity: 0.6,
      }}
    >
      <span style={{ fontSize: "2rem" }}>⚠️</span>
      <p>
        <strong>cert-manager</strong> is not installed in this cluster.
      </p>
      <p style={{ fontSize: "0.85rem" }}>
        {resource} API is not registered. Install cert-manager to use this page.
      </p>
    </div>
  );
}
