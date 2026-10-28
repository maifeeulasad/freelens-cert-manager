Author:
- Maifee Ul Asad
- Qwen 3.7 Plus

To work with **cert-manager** in Kubernetes, it is important to understand that cert-manager is a Kubernetes controller/operator. It does not have its own standalone database; instead, it extends the Kubernetes API using **Custom Resource Definitions (CRDs)**.

Therefore, you will use two primary tools to interact with it:
1. **`kubectl`**: For standard **CRUD** (Create, Read, Update, Delete) operations on cert-manager resources.
2. **`cmctl`**: The official **cert-manager CLI** for specialized tasks like debugging, manual renewals, and inspecting certificates.

Here is the comprehensive documentation for all commands, arguments, and flags.

---

# PART 1: `kubectl` (CRUD Operations)

Cert-manager introduces several Custom Resources (CRs). The most common ones you will interact with are:
-   `issuer` / `clusterissuer`: Defines _who_ can issue certificates (e.g., Let's Encrypt, Vault, SelfSigned).
-   `certificate`: Defines _what_ certificate you want (domain names, secret name to store it in).
-   `certificaterequest`: The actual request sent to the Issuer (usually created automatically by the `certificate` controller).

### 1. CREATE (Applying Configurations)

Because cert-manager resources are complex, they are almost always created via YAML manifests.

```bash
# Apply a YAML file to create an Issuer, ClusterIssuer, or Certificate
kubectl apply -f <filename.yaml>

# Apply all YAML files in a directory
kubectl apply -f ./cert-manager-configs/

# Apply from a URL (e.g., installing cert-manager itself)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
```

### 2. READ (Viewing Resources)

```bash
# List all certificates in the current namespace
kubectl get certificates
# Alias: kubectl get cert

# List all certificates across ALL namespaces
kubectl get certificates --all-namespaces
# Alias: kubectl get cert -A

# List issuers and clusterissuers
kubectl get issuers
kubectl get clusterissuers

# Get detailed information about a specific certificate (Crucial for debugging)
kubectl describe certificate <cert-name>

# View the actual certificate request and its status
kubectl get certificaterequest
kubectl describe certificaterequest <request-name>

# View the underlying ACME orders and challenges (if using Let's Encrypt)
kubectl get orders
kubectl get challenges
```

#### Highly Useful `kubectl` Arguments/Flags for Cert-Manager:

-   `-o wide` or `--output=wide`: **Essential for certificates.** Shows the `READY` status, `SECRET NAME`, and `EXPIRATION DATE` in the list view.
    -   _Example:_ `kubectl get cert -o wide`
-   `-o yaml` or `--output=yaml`: Outputs the full resource definition. Great for seeing the exact state and conditions.
-   `-o jsonpath='{.status.conditions[0].message}'`: Extracts specific error messages from a failing certificate.
-   `-w` or `--watch`: Watches the resource in real-time. Great for watching a `challenge` or `certificaterequest` complete.
-   `-n <namespace>` or `--namespace=<namespace>`: Targets a specific namespace. (Note: `ClusterIssuer` is cluster-wide and ignores this flag).

### 3. UPDATE (Modifying Resources)

```bash
# Open the resource in your default terminal editor (vi/nano) to update it
kubectl edit certificate <cert-name>

# Patch a specific field without opening the whole YAML
# Example: Force a certificate to renew by adding an annotation
kubectl patch certificate <cert-name> --type merge -p '{"metadata":{"annotations":{"cert-manager.io/issue-temporary-certificate":"true"}}}'

# Add labels to a certificate
kubectl label certificate <cert-name> environment=production
```

### 4. DELETE (Removing Resources)

```bash
# Delete a specific certificate (This will NOT delete the underlying Kubernetes Secret by default)
kubectl delete certificate <cert-name>

# Delete an issuer
kubectl delete issuer <issuer-name>

# Delete a certificate AND the secret it created (using finalizers/cascading)
kubectl delete certificate <cert-name> --cascade=orphan 
# Note: To delete the secret too, you must delete the secret manually:
kubectl delete secret <secret-name>
```

---

# PART 2: `cmctl` (The Cert-Manager CLI)

`cmctl` is the official command-line tool for cert-manager. It is used for tasks that `kubectl` cannot do easily, like inspecting TLS secrets, forcing renewals, and checking API health.

_(If you don't have it installed, install it via Homebrew: `brew install cmctl`, or download the binary from the cert-manager GitHub releases)._

### 1. Health and Status Checks

```bash
# Check if the cert-manager API is ready and functioning
cmctl check api

# Check API with a specific timeout and wait interval
cmctl check api --wait=2m

# Get the detailed status of a specific certificate (Shows the full chain of events)
cmctl status certificate <cert-name>

# Get status in a specific namespace
cmctl status certificate <cert-name> -n <namespace>
```

### 2. Certificate Management (Renewals & Creation)

```bash
# Manually force a certificate to renew immediately (bypasses the renewal window)
cmctl renew <cert-name>

# Create a Certificate resource via CLI (Generates the YAML and applies it)
cmctl create certificate <cert-name> \
  --issuer-name <issuer-name> \
  --issuer-kind <ClusterIssuer|Issuer> \
  --dns-name example.com \
  --dns-name www.example.com \
  --secret-name example-tls \
  --namespace default

# Create a CertificateRequest resource via CLI
cmctl create certificaterequest <request-name> \
  --issuer-name <issuer-name> \
  --issuer-kind ClusterIssuer \
  --duration 2160h \
  --is-ca=false
```

### 3. Inspection and Debugging

```bash
# Inspect a Kubernetes Secret that contains a TLS certificate
# This parses the x509 cert and shows issuer, expiry, SANs, etc.
cmctl inspect secret <secret-name>

# Inspect a secret in a specific namespace
cmctl inspect secret <secret-name> -n <namespace>

# Convert old cert-manager resources to the latest API version (v1)
# Useful if you are upgrading from very old versions (v0.10 or older)
cmctl convert <filename.yaml>
```

#### `cmctl` Global Arguments/Flags:

These flags can be appended to almost any `cmctl` command:
-   `-n <namespace>` or `--namespace=<namespace>`: Specify the namespace.
-   `--context=<context>`: Use a specific kubeconfig context (if you have multiple clusters).
-   `--kubeconfig=<path>`: Path to a specific kubeconfig file.
-   `-v` or `--verbose`: Enable verbose logging for debugging.
-   `-h` or `--help`: Show help for any command.

---

# PART 3: "Any Other Thing" (Troubleshooting & Deep Dive)

When cert-manager fails, it is usually due to DNS challenges, RBAC issues, or webhook failures. Here are the commands to troubleshoot those specific scenarios.

### 1. Checking Controller Logs

If a certificate is stuck in `Ready: False`, you need to see what the cert-manager controller is thinking.

```bash
# Find the cert-manager controller pod
kubectl get pods -n cert-manager

# Tail the logs of the controller
kubectl logs -n cert-manager deployment/cert-manager -f

# Tail the logs of the webhook (crucial if you get "x509: certificate signed by unknown authority" errors when applying YAML)
kubectl logs -n cert-manager deployment/cert-manager-webhook -f

# Tail the logs of the cainjector (crucial if webhooks or API conversions are failing)
kubectl logs -n cert-manager deployment/cert-manager-cainjector -f
```

### 2. Checking Kubernetes Events

Cert-manager posts events to the Kubernetes event stream when it encounters errors (like failing an HTTP-01 or DNS-01 challenge).

```bash
# View events for a specific certificate
kubectl get events --field-selector involvedObject.name=<cert-name> --sort-by='.metadata.creationTimestamp'

# View all cert-manager related events in the namespace
kubectl get events | grep cert-manager
```

### 3. Debugging ACME Challenges (Let's Encrypt)

If Let's Encrypt is failing to verify your domain, you need to look at the `Challenge` resource.

```bash
# List all challenges
kubectl get challenges

# Describe a specific challenge to see the exact error from Let's Encrypt
kubectl describe challenge <challenge-name>

# Look at the "Status" -> "Reason" and "State" fields in the describe output.
# Common errors: "Timeout" (DNS not propagating), "Unauthorized" (wrong file served on HTTP-01).
```

### 4. Verifying RBAC and Service Accounts

Sometimes cert-manager fails because it doesn't have permission to create secrets or read ingress resources.

```bash
# Check the clusterroles assigned to cert-manager
kubectl get clusterrole | grep cert-manager

# Check the rolebindings in a specific namespace
kubectl get rolebindings -n <namespace> | grep cert-manager
```

---

### Summary Cheat Sheet for Daily Use

| Task                                 | Command                                                       |
| :----------------------------------- | :------------------------------------------------------------ |
| **Check if cert-manager is healthy** | `cmctl check api`                                             |
| **List all certs with expiry dates** | `kubectl get cert -A -o wide`                                 |
| **Debug a failing cert**             | `kubectl describe cert <name>`                                |
| **Force a cert to renew now**        | `cmctl renew <name>`                                          |
| **Check why Let's Encrypt failed**   | `kubectl describe challenge <name>`                           |
| **Inspect a TLS secret**             | `cmctl inspect secret <secret-name>`                          |
| **View controller errors**           | `kubectl logs -n cert-manager deploy/cert-manager --tail=100` |
