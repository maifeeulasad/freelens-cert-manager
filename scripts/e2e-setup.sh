#!/usr/bin/env bash
# Author: Maifee Ul Asad <maifeeulasad@gmail.com>
# Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
#
# Bootstrap a minikube cluster with cert-manager for E2E tests.
# Safe to run multiple times; skips steps that are already done.
#
# Usage: bash scripts/e2e-setup.sh
set -euo pipefail

CERT_MANAGER_VERSION="${CERT_MANAGER_VERSION:-v1.17.0}"
MINIKUBE_CPUS="${MINIKUBE_CPUS:-2}"
MINIKUBE_MEMORY="${MINIKUBE_MEMORY:-6144}"
PROFILE="${MINIKUBE_PROFILE:-freelens-e2e}"

echo "==> Checking minikube..."
if ! minikube status -p "$PROFILE" 2>/dev/null | grep -q "Running"; then
  echo "==> Starting minikube (profile=$PROFILE, cpus=$MINIKUBE_CPUS, memory=${MINIKUBE_MEMORY}MB)..."
  minikube start \
    -p "$PROFILE" \
    --cpus "$MINIKUBE_CPUS" \
    --memory "$MINIKUBE_MEMORY" \
    --wait=all
else
  echo "==> minikube already running, skipping start."
fi

echo "==> Setting kubectl context to minikube profile..."
minikube update-context -p "$PROFILE"

echo "==> Checking cert-manager installation..."
if kubectl get namespace cert-manager &>/dev/null && \
   kubectl get deployment -n cert-manager cert-manager &>/dev/null; then
  echo "==> cert-manager already installed, skipping."
else
  echo "==> Installing cert-manager $CERT_MANAGER_VERSION..."
  kubectl apply -f \
    "https://github.com/cert-manager/cert-manager/releases/download/${CERT_MANAGER_VERSION}/cert-manager.yaml"

  echo "==> Waiting for cert-manager pods to be ready..."
  kubectl rollout status deployment/cert-manager -n cert-manager --timeout=120s
  kubectl rollout status deployment/cert-manager-webhook -n cert-manager --timeout=120s
  kubectl rollout status deployment/cert-manager-cainjector -n cert-manager --timeout=120s
fi

echo "==> cert-manager is ready."
echo "==> Run 'pnpm test:e2e' to execute the E2E test suite."
