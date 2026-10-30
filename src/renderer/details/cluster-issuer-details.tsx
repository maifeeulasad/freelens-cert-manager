/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import {
  getClusterIssuerStatus,
  getClusterIssuerType,
  isClusterIssuerReady,
} from "../../common/api/accessors";

import type { ClusterIssuer } from "../../common/api";

interface Props {
  object: ClusterIssuer;
}

export function ClusterIssuerDetails({ object: issuer }: Props) {
  const status = getClusterIssuerStatus(issuer);
  const readyMessage = (status.conditions ?? []).find((c) => c.type === "Ready")?.message;

  return (
    <Renderer.Component.DrawerItem name="ClusterIssuer Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Type">
        {getClusterIssuerType(issuer)}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Scope">Cluster-wide</Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Status">
        {isClusterIssuerReady(issuer) ? "✓ Ready" : "✗ Not Ready"}
      </Renderer.Component.DrawerItem>

      {readyMessage && (
        <Renderer.Component.DrawerItem name="Message">{readyMessage}</Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
