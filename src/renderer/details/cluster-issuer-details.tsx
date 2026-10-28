/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";

import type { ClusterIssuer } from "../../common/api";

interface Props {
  object: ClusterIssuer;
}

export function ClusterIssuerDetails({ object: issuer }: Props) {
  return (
    <Renderer.Component.DrawerItem name="ClusterIssuer Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Type">{issuer.issuerType}</Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Scope">Cluster-wide</Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Status">
        {issuer.isReady ? "✓ Ready" : "✗ Not Ready"}
      </Renderer.Component.DrawerItem>

      {issuer.readyMessage && (
        <Renderer.Component.DrawerItem name="Message">
          {issuer.readyMessage}
        </Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
