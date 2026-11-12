/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Inline SVG icons for sidebar navigation — one per cert-manager resource type.
 * Sized 16×16 so they fit Freelens' sidebar icon slots.
 */

const SIZE = 16;

function icon(content: React.ReactNode, viewBox = "0 0 16 16") {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}

/** 🔐 Lock — root "Cert Manager" group */
export function IconCertManager() {
  return icon(
    <>
      <rect x="3" y="7" width="10" height="8" rx="1.5" fill="#64b5f6" />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        stroke="#64b5f6"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="1.2" fill="#fff" />
    </>,
  );
}

/** 📜 Certificate — shield with a tick */
export function IconCertificate() {
  return icon(
    <>
      <path
        d="M8 1 L14 3.5 V8 C14 11.5 11 13.8 8 15 C5 13.8 2 11.5 2 8 V3.5 Z"
        fill="#66bb6a"
        opacity="0.85"
      />
      <polyline
        points="5,8 7,10.5 11,6"
        stroke="#fff"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  );
}

/** 🏛️ Issuer — building columns */
export function IconIssuer() {
  return icon(
    <>
      <rect x="1" y="13" width="14" height="2" rx="0.5" fill="#ffa726" />
      <rect x="2" y="6" width="2" height="7" rx="0.5" fill="#ffa726" />
      <rect x="5.5" y="6" width="2" height="7" rx="0.5" fill="#ffa726" />
      <rect x="9" y="6" width="2" height="7" rx="0.5" fill="#ffa726" />
      <rect x="12.5" y="6" width="2" height="7" rx="0.5" fill="#ffa726" />
      <path d="M1 6 L8 1.5 L15 6 Z" fill="#ffa726" />
    </>,
  );
}

/** 🌐 ClusterIssuer — globe */
export function IconClusterIssuer() {
  return icon(
    <>
      <circle cx="8" cy="8" r="6.5" stroke="#ab47bc" strokeWidth="1.5" fill="none" />
      <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="#ab47bc" strokeWidth="1.2" fill="none" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="#ab47bc" strokeWidth="1.2" />
      <line x1="2.5" y1="5" x2="13.5" y2="5" stroke="#ab47bc" strokeWidth="1" />
      <line x1="2.5" y1="11" x2="13.5" y2="11" stroke="#ab47bc" strokeWidth="1" />
    </>,
  );
}

/** 📋 CertificateRequest — document with arrow */
export function IconCertificateRequest() {
  return icon(
    <>
      <rect x="2" y="1" width="9" height="12" rx="1" fill="#42a5f5" opacity="0.9" />
      <line x1="4.5" y1="4.5" x2="8.5" y2="4.5" stroke="#fff" strokeWidth="1.2" />
      <line x1="4.5" y1="7" x2="8.5" y2="7" stroke="#fff" strokeWidth="1.2" />
      <line x1="4.5" y1="9.5" x2="6.5" y2="9.5" stroke="#fff" strokeWidth="1.2" />
      <path
        d="M11 9 L14.5 9 M13 7 L14.5 9 L13 11"
        stroke="#42a5f5"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  );
}

/** 🔄 Order — circular arrow */
export function IconOrder() {
  return icon(
    <>
      <path
        d="M13 8 A5 5 0 1 1 10.5 3.5"
        stroke="#26a69a"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <polyline
        points="10,1 11,4 14,3"
        stroke="#26a69a"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  );
}

/** ⚡ Challenge — lightning bolt */
export function IconChallenge() {
  return icon(
    <>
      <polygon points="9,1 4,9 8.5,9 7,15 12,7 7.5,7" fill="#ef5350" />
    </>,
  );
}
