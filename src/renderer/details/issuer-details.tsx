/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Issuer } from "../../common/api";

interface Props {
  object: Issuer;
}

export function IssuerDetails({ object: issuer }: Props) {
  return (
    <Renderer.Component.DrawerItem name="Issuer Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Type">
        {issuer.issuerType}
      </Renderer.Component.DrawerItem>

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
