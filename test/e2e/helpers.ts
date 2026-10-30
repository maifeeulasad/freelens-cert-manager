/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * kubectl helpers for E2E tests.
 * All operations use the current kubeconfig context (set by e2e-setup.sh).
 */

import { spawnSync } from "node:child_process";

/** Run a kubectl command and return stdout. Throws on non-zero exit. */
export function kubectl(args: string[]): string {
  const result = spawnSync("kubectl", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`kubectl ${args.join(" ")} failed (exit ${result.status}):\n${result.stderr}`);
  }
  return result.stdout.trim();
}

/** Apply a YAML manifest from a string. */
export function applyManifest(yaml: string): void {
  const result = spawnSync("kubectl", ["apply", "-f", "-"], {
    input: yaml,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`kubectl apply failed:\n${result.stderr}\nManifest:\n${yaml}`);
  }
}

/** Delete a resource; ignore 404 (already gone). */
export function deleteResource(kind: string, name: string, namespace?: string): void {
  const args = ["delete", kind, name, "--ignore-not-found=true"];
  if (namespace) args.push("-n", namespace);
  spawnSync("kubectl", args, { encoding: "utf8" });
}

/** Poll until a condition is met, up to timeoutMs. */
export async function waitFor(
  check: () => boolean,
  timeoutMs: number,
  intervalMs = 2000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (check()) return;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Timed out after ${timeoutMs}ms`);
}

/** Return the JSON object for a Kubernetes resource, or null if not found. */
export function getResource(
  kind: string,
  name: string,
  namespace?: string,
): Record<string, unknown> | null {
  const args = ["get", kind, name, "-o", "json"];
  if (namespace) args.push("-n", namespace);
  args.push("--ignore-not-found");
  const result = spawnSync("kubectl", args, { encoding: "utf8" });
  if (result.status !== 0 || !result.stdout.trim()) return null;
  return JSON.parse(result.stdout) as Record<string, unknown>;
}

/** Return true if a resource exists. */
export function resourceExists(kind: string, name: string, namespace?: string): boolean {
  return getResource(kind, name, namespace) !== null;
}
