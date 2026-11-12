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
      message: `Delete stuck Challenge "${name}" in namespace "${ns}" (state: ${acmeStateLabel(state)})?\n\nThe parent Order will retry issuance.`,
      labelOk: "Delete",
      ok: async () => {
        try {
          const api = (Challenge.getStore() as ChallengeStore).api;
          await api.delete({ name, namespace: ns });
        } catch (err) {
          console.error(`[cert-manager] delete Challenge failed for ${ns}/${name}:`, err);
        }
      },
    });
  }

  return (
    <Renderer.Component.MenuItem onClick={handleDelete}>Delete (stuck)</Renderer.Component.MenuItem>
  );
}
