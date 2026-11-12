/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Challenge, type ChallengeStore } from "../../common/api";
import { ResourceEditYamlMenuItem } from "./resource-edit-yaml-menu-item";

import type { Renderer } from "@freelensapp/extensions";

interface Props {
  object: Challenge;
}

export function ChallengeEditMenuItem({ object }: Props) {
  const api = (Challenge.getStore() as ChallengeStore)
    .api as unknown as Renderer.K8sApi.KubeApi<Renderer.K8sApi.KubeObject>;
  return <ResourceEditYamlMenuItem object={object} api={api} />;
}
