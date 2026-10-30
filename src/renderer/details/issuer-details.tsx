/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { getIssuerStatus, getIssuerType, isIssuerReady } from "../../common/api/accessors";

import type { Issuer } from "../../common/api";

interface Props {
  object: Issuer;
}

export function IssuerDetails({ object: issuer }: Props) {
  const status = getIssuerStatus(issuer);
  const readyMessage = (status.conditions ?? []).find((c) => c.type === "Ready")?.message;

  return (
    <Renderer.Component.DrawerItem name="Issuer Details" labelsOnly>
      <Renderer.Component.DrawerItem name="Type">
        {getIssuerType(issuer)}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Status">
        {isIssuerReady(issuer) ? "✓ Ready" : "✗ Not Ready"}
      </Renderer.Component.DrawerItem>

      {readyMessage && (
        <Renderer.Component.DrawerItem name="Message">{readyMessage}</Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
