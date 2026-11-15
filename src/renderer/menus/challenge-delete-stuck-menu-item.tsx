/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * "Delete (stuck)" menu item for ACME Challenges.
 * Challenges can get stuck when the ACME solver cannot present the challenge
 * token (DNS propagation failure, ingress misconfiguration, etc.).
 * Deleting a stuck Challenge causes the parent Order to retry.
 */

import { Renderer } from "@freelensapp/extensions";
import { Challenge } from "../../common/api";
import { acmeStateLabel, getChallengeStatus } from "../../common/api/accessors";

import type { ChallengeStore } from "../../common/api";

interface Props {
  object: Challenge;
}

export function ChallengeDeleteStuckMenuItem({ object: challenge }: Props) {
  const state = getChallengeStatus(challenge).state;
  const isStuck = state && state !== "valid";

  if (!isStuck) return null;

  function handleDelete() {
    const ns = challenge.getNs();
    const name = challenge.getName();

    Renderer.Component.ConfirmDialog.open({
      message:
        `Delete stuck Challenge "${name}" in namespace "${ns}" (state: ${acmeStateLabel(state)})?\n\n` +
        `The parent Order will retry issuance.\n\n` +
        `⚠ If the ACME solver pod is still running, the Challenge may get stuck in Terminating ` +
        `because cert-manager cannot remove its finalizer. ` +
        `Check the cert-manager controller logs if deletion does not complete within a minute.`,
      labelOk: "Delete",
      ok: async () => {
        try {
          const api = (Challenge.getStore() as ChallengeStore).api;
          await api.delete({ name, namespace: ns });
        } catch (err) {
          Renderer.Component.Notifications.error(
            `Failed to delete Challenge "${ns}/${name}": ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      },
    });
  }

  return (
    <Renderer.Component.MenuItem icon="delete_forever" onClick={handleDelete}>
      Delete (stuck)
    </Renderer.Component.MenuItem>
  );
}
