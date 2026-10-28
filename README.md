# freelens-cert-manager

> Author: Maifee Ul Asad <maifeeulasad@gmail.com>
> Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>

A [Freelens](https://github.com/freelensapp/freelens) v2 extension for managing [cert-manager](https://cert-manager.io/) resources directly from your Kubernetes dashboard.

---

## Status

**Phase:** Foundation / Documentation  
**Branch:** `main` (no branching until first release)

---

## Tracking

### Foundation

- [x] Repository initialized
- [x] `.gitignore` configured (includes `.study/`)
- [x] Freelens repo cloned for study (`.study/freelens`)
- [x] `docs/understanding-cert-manager.md` — cert-manager kubectl/cmctl reference
- [x] `docs/extension-development-guide.md` — Freelens v2 extension API guide

### Extension Scaffold

- [ ] `package.json` with correct engines, type:module, devDependencies
- [ ] `tsconfig.json` (base + per-process configs)
- [ ] `vite.config.mjs` (two-mode build: renderer + main)
- [ ] `src/main/index.ts` — `Main.LensExtension` subclass
- [ ] `src/renderer/index.tsx` — `Renderer.LensExtension` subclass
- [ ] `src/common/store/` — shared MobX preferences store
- [ ] Biome lint config

### cert-manager Custom Resources

- [ ] `Certificate` KubeObject (v1)
- [ ] `Issuer` KubeObject (v1)
- [ ] `ClusterIssuer` KubeObject (v1)
- [ ] `CertificateRequest` KubeObject (v1)
- [ ] Register all in `customResources`

### UI — Pages

- [ ] Certificates list page
- [ ] Issuers list page
- [ ] ClusterIssuers list page
- [ ] Sidebar navigation entries
- [ ] Extension preference page

### UI — Details Panels

- [ ] Certificate details (spec + status, expiry, secret name)
- [ ] Issuer details
- [ ] ClusterIssuer details
- [ ] CertificateRequest details

### UI — Context Menu Items

- [ ] "Force Renew" menu item on Certificate
- [ ] "Delete" with cascade option on Certificate

### Testing

- [ ] Unit tests — cert-manager KubeObject models (Vitest)
- [ ] Unit tests — MobX store (Vitest)
- [ ] Positive: certificate shows as ready
- [ ] Negative: expired/not-ready certificate shows correct status
- [ ] E2E setup — minikube (2 CPU, 6 GB RAM)
- [ ] E2E: install cert-manager on minikube
- [ ] E2E: create self-signed issuer + certificate
- [ ] E2E: verify extension renders the certificate list
- [ ] E2E: verify details panel shows correct expiry

### CI / Release

- [ ] GitHub Actions — lint + type-check + unit tests
- [ ] GitHub Actions — E2E on minikube
- [ ] Pack as `.tgz` and attach to release
- [ ] Publish to npm under `@freelensapp` scope (or personal scope)

---

## Known Issues / Limitations

*(none yet)*

---

## Architecture Decisions

| Decision | Rationale |
| --- | --- |
| Freelens v2 extension API | Current stable host version |
| Vite two-mode build | Required by Freelens v2 (renderer ESM-only, main Node) |
| MobX 7 standard decorators | Host ships MobX 7; legacy decorators break silently |
| React 19 | Host-provided singleton; must not be bundled |
| pnpm | Matches Freelens example extension toolchain |
| Biome | Linter/formatter used by freelensapp org |

---

## Documentation

| File | Purpose |
| --- | --- |
| [`docs/understanding-cert-manager.md`](docs/understanding-cert-manager.md) | kubectl + cmctl command reference for cert-manager |
| [`docs/extension-development-guide.md`](docs/extension-development-guide.md) | Freelens v2 extension API — structure, contracts, build, testing |

---

## Development Setup

```sh
# Requires Node >= 24, pnpm 12
pnpm install

# Build (both entries)
pnpm build

# Watch mode
pnpm dev

# Tests
pnpm test:unit
pnpm test:integration

# Lint
pnpm lint:check
```

### minikube for E2E

```sh
minikube start --cpus=2 --memory=6144
```

---

## Sources

- [Freelens GitHub](https://github.com/freelensapp/freelens)
- [Freelens Example Extension](https://github.com/freelensapp/freelens-example-extension)
- [Extension API Contracts](https://github.com/freelensapp/freelens/blob/main/docs/extensions/api.md)
- [Migration Guide v1→v2](https://github.com/freelensapp/freelens/blob/main/docs/extensions/migrating-from-v1.md)
- [cert-manager Docs](https://cert-manager.io/docs/)
- [Extension API v2 spec issue](https://github.com/freelensapp/freelens/issues/2304)
