# freelens-cert-manager

A [Freelens](https://github.com/freelensapp/freelens) v2 extension for managing [cert-manager](https://cert-manager.io/) resources directly from your Kubernetes dashboard.

[![Latest release](https://img.shields.io/github/v/release/maifeeulasad/freelens-cert-manager)](https://github.com/maifeeulasad/freelens-cert-manager/releases/latest)

---

## Features

### Six cert-manager resource kinds

All six cert-manager resource types are registered and listed in the sidebar under **Cert Manager**:

| Resource           | Group                   | Sidebar icon        |
| ------------------ | ----------------------- | ------------------- |
| Certificate        | cert-manager.io/v1      | Green shield        |
| CertificateRequest | cert-manager.io/v1      | Blue document       |
| Issuer             | cert-manager.io/v1      | Amber columns       |
| ClusterIssuer      | cert-manager.io/v1      | Purple globe        |
| Order              | acme.cert-manager.io/v1 | Teal circular arrow |
| Challenge          | acme.cert-manager.io/v1 | Red lightning bolt  |

Each resource has a list page, a detail drawer, and context menu actions.

---

### Certificate list page

- **Validity bar** — a color-coded progress bar in every row showing how much of the certificate lifetime has elapsed, with a days-remaining label (green > 30 d, amber 7–30 d, red < 7 d / expired).
- **Health summary bar** — live tile row above the list showing Total / Ready / Not-Ready / Expiring / Expired counts.
- **Guided creation wizard** — clicking **+** opens a two-step form wizard: fill in name, namespace, DNS names, issuer, duration → review and optionally edit the generated YAML → create.

### Certificate detail drawer

- Spec fields: Secret name, Common Name, DNS Names, Issuer, Duration, Renew Before.
- Validity bar (larger variant) with start and end dates.
- **X.509 details** — fetches the managed TLS Secret and parses the certificate using `@peculiar/x509`: Subject DN, Issuer DN, Subject Alternative Names, Serial Number, Key Algorithm, SHA-256 fingerprint.
- **Owned CertificateRequests** — clickable links to each CR that owns this certificate.
- **Used by Ingresses** — lists Ingresses in the same namespace whose `spec.tls[].secretName` references this certificate's Secret.

### Certificate context menu

| Action           | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Force Renew      | Patches `cert-manager.io/trigger-renew` annotation (shows confirmation dialog with namespace) |
| Delete (cascade) | Deletes the Certificate and its managed Secret                                                |
| Edit YAML        | Opens the resource in an inline YAML editor                                                   |

---

### CertificateRequest detail drawer

- Issuer, Duration, Is CA, Usages, approval/denial status, failure time.
- **Parent Certificate link** — click to open the owning Certificate in the drawer.
- **Owned Orders** — clickable links to Orders issued for this CR.

### CertificateRequest context menu

| Action    | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| Approve   | Calls `PUT .../approval` with an Approved condition (hidden once decided) |
| Deny      | Calls `PUT .../approval` with a Denied condition (hidden once decided)    |
| Edit YAML | Opens the resource in an inline YAML editor                               |

---

### Order detail drawer

- State (ACME state machine), Issuer, DNS Names, IP Addresses, Common Name, Duration, ACME URL, failure info, authorizations.
- **Parent CertificateRequest link** — click to open the owning CR in the drawer.
- **Owned Challenges** — clickable links to each Challenge for this Order.

### Order context menu

| Action         | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| Delete (stuck) | Deletes a non-valid Order so cert-manager retries from scratch |
| Edit YAML      | Opens the resource in an inline YAML editor                    |

---

### Challenge detail drawer

- State, Domain (with wildcard indicator), Challenge type, Issuer, presented/processing flags, token, authorization URL.

### Challenge context menu

| Action         | Description                                               |
| -------------- | --------------------------------------------------------- |
| Delete (stuck) | Deletes a non-valid Challenge so the parent Order retries |
| Edit YAML      | Opens the resource in an inline YAML editor               |

---

### Issuer / ClusterIssuer

- Detail drawers show type (ACME, CA, SelfSigned, Vault, Venafi), ready status, and message.
- Edit YAML context menu item.

---

## Installation

Download the latest `.tgz` from [Releases](https://github.com/maifeeulasad/freelens-cert-manager/releases/latest) and install it in Freelens:

1. Open Freelens → **Extensions** (top-right menu or ⌘E / Ctrl+E).
2. Drag the `.tgz` file onto the Extensions panel, or click **Install from file** and select it.
3. Enable the extension.

The extension is also published to npm as `freelens-cert-manager`:

```sh
# Freelens will resolve npm packages automatically when you enter the package name
freelens-cert-manager
```

---

## Requirements

- [Freelens](https://github.com/freelensapp/freelens) v2.x
- [cert-manager](https://cert-manager.io/) installed in the target cluster (v1.x CRDs)

---

## Architecture decisions

| Decision                   | Rationale                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Freelens v2 extension API  | Current stable host version                                                                                                                                                          |
| Vite two-mode build        | Required by Freelens v2 (renderer ESM-only, main Node)                                                                                                                               |
| MobX 7 standard decorators | Host ships MobX 7; legacy decorators break silently                                                                                                                                  |
| React 19                   | Host-provided singleton; must not be bundled                                                                                                                                         |
| pnpm                       | Matches Freelens example extension toolchain                                                                                                                                         |
| Biome                      | Linter/formatter used by freelensapp org                                                                                                                                             |
| @peculiar/x509             | Browser-compatible X.509 parser (Node crypto blocked in renderer)                                                                                                                    |
| Raw-data accessors         | Freelens creates KubeObject instances from its own base class, not our subclasses — prototype getters are unreachable at runtime, so spec/status are read via direct property access |

---

## Development setup

```sh
# Requires Node >= 24, pnpm 12
pnpm install

# Build (both renderer and main entries)
pnpm build

# Watch mode
pnpm dev

# Unit tests
pnpm test:unit

# Lint
pnpm lint:check

# Type check
pnpm type:check

# Pack as .tgz for local install
pnpm pack
```

---

## Documentation

| File                                                                         | Purpose                                                          |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`docs/understanding-cert-manager.md`](docs/understanding-cert-manager.md)   | kubectl + cmctl command reference for cert-manager               |
| [`docs/extension-development-guide.md`](docs/extension-development-guide.md) | Freelens v2 extension API — structure, contracts, build, testing |

---

## Contributors

| Role      | Name                                                                   | Contact                   |
| --------- | ---------------------------------------------------------------------- | ------------------------- |
| Author    | Maifee Ul Asad                                                         | maifeeulasad@gmail.com    |
| Co-Author | Claude Sonnet 4.6                                                      | noreply@anthropic.com     |
| Reviewer  | Roberto Bandini ([@robertobandini](https://github.com/robertobandini)) | bandini.roberto@gmail.com |

The feature roadmap (Tiers 1–4) was shaped by Roberto's review in [issue #1](https://github.com/maifeeulasad/freelens-cert-manager/issues/1).

---

## Sources

- [Freelens GitHub](https://github.com/freelensapp/freelens)
- [Freelens Example Extension](https://github.com/freelensapp/freelens-example-extension)
- [cert-manager Docs](https://cert-manager.io/docs/)
- [cert-manager API Reference](https://cert-manager.io/docs/reference/api-docs/)
