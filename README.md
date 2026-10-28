# freelens-cert-manager

A [Freelens](https://github.com/freelensapp/freelens) v2 extension for managing [cert-manager](https://cert-manager.io/) resources directly from your Kubernetes dashboard.

---

## Status

**Phase:** CI green — E2E tests + release packaging pending  
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

- [x] `package.json` with correct engines, type:module, devDependencies
- [x] `tsconfig.json` (base + per-process configs)
- [x] `vite.config.mjs` (two-mode build: renderer + main)
- [x] `src/main/index.ts` — `Main.LensExtension` subclass
- [x] `src/renderer/index.tsx` — `Renderer.LensExtension` subclass
- [x] `src/common/store/` — shared MobX preferences store
- [x] Biome lint config
- [x] `build/` — vite plugins: host-modules, standard-decorators
- [x] `test/freelens-extensions.ts` — unit test stub for host API
- [x] `vitest.config.ts`

### cert-manager Custom Resources

- [x] `Certificate` KubeObject (v1)
- [x] `Issuer` KubeObject (v1)
- [x] `ClusterIssuer` KubeObject (v1)
- [x] `CertificateRequest` KubeObject (v1)
- [x] Register all four in `customResources`

### UI — Pages

- [x] Certificates list page
- [x] Issuers list page
- [x] ClusterIssuers list page
- [x] CertificateRequests list page
- [x] Sidebar navigation entries (grouped under "Cert Manager")
- [x] Extension preference page (showExpiredCerts toggle)

### UI — Details Panels

- [x] Certificate details (spec + status, expiry, secret name)
- [x] Issuer details (type, ready status, message)
- [x] ClusterIssuer details (type, scope, ready status)
- [x] CertificateRequest details (issuer, usages, approved/denied, failure time)

### UI — Context Menu Items

- [x] "Force Renew" menu item on Certificate (patches trigger-renew annotation)
- [ ] "Delete" with cascade option on Certificate

### Testing

- [x] Unit tests — cert-manager KubeObject models (Vitest)
- [x] Unit tests — MobX store (Vitest)
- [x] Positive: certificate shows as ready
- [x] Negative: expired/not-ready certificate shows correct status
- [x] Positive/negative: issuerType detection
- [x] Positive/negative: preferences store serialization
- [x] Positive/negative: CertificateRequest ready/denied/approved states
- [ ] E2E setup — minikube (2 CPU, 6 GB RAM)
- [ ] E2E: install cert-manager on minikube
- [ ] E2E: create self-signed issuer + certificate
- [ ] E2E: verify extension renders the certificate list
- [ ] E2E: verify details panel shows correct expiry

### CI / Release

- [x] GitHub Actions — lint + type-check + unit tests + build (`.github/workflows/ci.yml`)
- [ ] GitHub Actions — E2E on minikube
- [ ] Pack as `.tgz` and attach to release
- [ ] Publish to npm under `@freelensapp` scope (or personal scope)

---

## Known Issues / Limitations

_(none yet)_

---

## Architecture Decisions

| Decision                   | Rationale                                              |
| -------------------------- | ------------------------------------------------------ |
| Freelens v2 extension API  | Current stable host version                            |
| Vite two-mode build        | Required by Freelens v2 (renderer ESM-only, main Node) |
| MobX 7 standard decorators | Host ships MobX 7; legacy decorators break silently    |
| React 19                   | Host-provided singleton; must not be bundled           |
| pnpm                       | Matches Freelens example extension toolchain           |
| Biome                      | Linter/formatter used by freelensapp org               |

---

## Documentation

| File                                                                         | Purpose                                                          |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`docs/understanding-cert-manager.md`](docs/understanding-cert-manager.md)   | kubectl + cmctl command reference for cert-manager               |
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

## Contributors

| Role      | Name              | Contact                     |
| --------- | ----------------- | --------------------------- |
| Author    | Maifee Ul Asad    | maifeeulasad@gmail.com      |
| Co-Author | Claude Sonnet 4.6 | noreply@anthropic.com       |
| Co-Author | Qwen-3.7-Plus     | qwen-coder@alibabacloud.com |

---

## Sources

- [Freelens GitHub](https://github.com/freelensapp/freelens)
- [Freelens Example Extension](https://github.com/freelensapp/freelens-example-extension)
- [Extension API Contracts](https://github.com/freelensapp/freelens/blob/main/docs/extensions/api.md)
- [Migration Guide v1→v2](https://github.com/freelensapp/freelens/blob/main/docs/extensions/migrating-from-v1.md)
- [cert-manager Docs](https://cert-manager.io/docs/)
- [Extension API v2 spec issue](https://github.com/freelensapp/freelens/issues/2304)
