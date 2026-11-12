/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { acmeStateLabel, getChallengeSpec, getChallengeStatus } from "../../common/api/accessors";

import type { Challenge } from "../../common/api";

interface Props {
  object: Challenge;
}

export function ChallengeDetails({ object: challenge }: Props) {
  const spec = getChallengeSpec(challenge);
  const status = getChallengeStatus(challenge);

  return (
    <Renderer.Component.DrawerItem name="Challenge Details" labelsOnly>
      <Renderer.Component.DrawerItem name="State">
        {acmeStateLabel(status.state)}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Domain">
        {spec.dnsName ?? "-"}
        {spec.wildcard ? " (wildcard)" : ""}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Type">{spec.type ?? "-"}</Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Issuer">
        {spec.issuerRef ? `${spec.issuerRef.kind}/${spec.issuerRef.name}` : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Presented">
        {status.presented === true ? "Yes" : status.presented === false ? "No" : "-"}
      </Renderer.Component.DrawerItem>

      <Renderer.Component.DrawerItem name="Processing">
        {status.processing === true ? "Yes" : status.processing === false ? "No" : "-"}
      </Renderer.Component.DrawerItem>

      {spec.token && (
        <Renderer.Component.DrawerItem name="Token">{spec.token}</Renderer.Component.DrawerItem>
      )}

      {spec.authorizationURL && (
        <Renderer.Component.DrawerItem name="Authorization URL">
          {spec.authorizationURL}
        </Renderer.Component.DrawerItem>
      )}

      {status.reason && (
        <Renderer.Component.DrawerItem name="Reason">{status.reason}</Renderer.Component.DrawerItem>
      )}
    </Renderer.Component.DrawerItem>
  );
}
