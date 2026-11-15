/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Fetches the cert-manager managed TLS Secret and parses the X.509 certificate
 * using @peculiar/x509 (browser-compatible). Shows Subject, SANs, Issuer,
 * Serial Number, Key algorithm, and SHA-256 fingerprint.
 */

import { Renderer } from "@freelensapp/extensions";
import { X509Certificate } from "@peculiar/x509";
import { useEffect, useState } from "react";

interface X509Info {
  subject: string;
  issuerDN: string;
  serialNumber: string;
  sans: string[];
  keyAlgorithm: string;
  fingerprint: string;
}

async function parseSecret(secretName: string, namespace: string): Promise<X509Info | null> {
  try {
    const store = Renderer.K8sApi.secretsStore;
    // Find from cached store first; fall back to API fetch
    let secret = store.items.find((s) => s.getName() === secretName && s.getNs() === namespace);
    if (!secret) {
      await store.loadAll({ namespaces: [namespace] });
      secret = store.items.find((s) => s.getName() === secretName && s.getNs() === namespace);
    }
    if (!secret) return null;

    const rawData = (secret as unknown as { data?: Record<string, string> }).data;
    const tlsCrt = rawData?.["tls.crt"];
    if (!tlsCrt) return null;

    // tls.crt is base64(PEM) — decode once to get the PEM text, then parse.
    // Do NOT re-wrap in PEM headers: that would double-encode the data.
    const pem = atob(tlsCrt);
    const cert = new X509Certificate(pem);

    // Key algorithm string
    const alg = cert.publicKey.algorithm;
    let keyAlgorithm = alg.name;
    if ("namedCurve" in alg) keyAlgorithm = `${alg.name} (${(alg as EcKeyAlgorithm).namedCurve})`;
    else if ("modulusLength" in alg)
      keyAlgorithm = `${alg.name}-${(alg as RsaKeyAlgorithm).modulusLength}`;

    // SANs
    const sanExt = cert.getExtension("2.5.29.17");
    const sans: string[] = [];
    if (sanExt) {
      const sanStr = sanExt.toString();
      // Parse "DNS:example.com, IP:1.2.3.4" style
      for (const part of sanStr.split(",")) {
        const trimmed = part.trim();
        if (trimmed) sans.push(trimmed);
      }
    }

    // SHA-256 fingerprint — cert.rawData is the DER-encoded certificate bytes
    const hashBuf = await crypto.subtle.digest("SHA-256", cert.rawData);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    const fingerprint = hashArr
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(":")
      .toUpperCase();

    return {
      subject: cert.subject,
      issuerDN: cert.issuer,
      serialNumber: cert.serialNumber,
      sans,
      keyAlgorithm,
      fingerprint,
    };
  } catch {
    return null;
  }
}

interface Props {
  secretName: string | undefined;
  namespace: string | undefined;
}

export function X509Details({ secretName, namespace }: Props) {
  const [info, setInfo] = useState<X509Info | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!secretName || !namespace) return;
    setLoading(true);
    parseSecret(secretName, namespace)
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [secretName, namespace]);

  if (!secretName) return null;
  if (loading) {
    return (
      <Renderer.Component.DrawerItem name="X.509 Details">Loading…</Renderer.Component.DrawerItem>
    );
  }
  if (!info) return null;

  return (
    <Renderer.Component.DrawerItem name="X.509 Details" labelsOnly>
      {info.subject && (
        <Renderer.Component.DrawerItem name="Subject">{info.subject}</Renderer.Component.DrawerItem>
      )}

      {info.issuerDN && (
        <Renderer.Component.DrawerItem name="Issuer DN">
          {info.issuerDN}
        </Renderer.Component.DrawerItem>
      )}

      {info.sans.length > 0 && (
        <Renderer.Component.DrawerItem name="SANs">
          {info.sans.join(", ")}
        </Renderer.Component.DrawerItem>
      )}

      <Renderer.Component.DrawerItem name="Serial Number">
        {info.serialNumber}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Key Algorithm">
        {info.keyAlgorithm}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="SHA-256 Fingerprint">
        <span style={{ fontFamily: "monospace", fontSize: "0.8em", wordBreak: "break-all" }}>
          {info.fingerprint}
        </span>
      </Renderer.Component.DrawerItem>
    </Renderer.Component.DrawerItem>
  );
}
