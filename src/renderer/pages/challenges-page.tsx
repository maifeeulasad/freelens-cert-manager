/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Challenge, type ChallengeApi } from "../../common/api";
import { acmeStateLabel, getChallengeSpec, getChallengeStatus } from "../../common/api/accessors";
import { NotInstalled } from "./not-installed";

export function ChallengesPage() {
  let store: ReturnType<typeof Challenge.getStore<Challenge>>;
  try {
    store = Challenge.getStore<Challenge>();
  } catch {
    return <NotInstalled resource="Challenge" />;
  }

  return (
    <Renderer.Component.KubeObjectListLayout<Challenge, ChallengeApi>
      store={store}
      isConfigurable
      tableId="cert-manager-challenges"
      className="ChallengesPage"
      renderTableHeader={[
        { title: "Name", className: "name" },
        { title: "Namespace", className: "namespace" },
        { title: "State", className: "state" },
        { title: "Domain", className: "domain" },
        { title: "Type", className: "type" },
        { title: "Issuer", className: "issuer" },
      ]}
      renderTableContents={(challenge) => {
        const spec = getChallengeSpec(challenge);
        const status = getChallengeStatus(challenge);
        const issuerRef = spec.issuerRef;
        const domain = spec.dnsName ? (spec.wildcard ? `*.${spec.dnsName}` : spec.dnsName) : "-";
        return [
          challenge.getName(),
          challenge.getNs(),
          acmeStateLabel(status.state),
          domain,
          spec.type ?? "-",
          issuerRef ? `${issuerRef.kind}/${issuerRef.name}` : "-",
        ];
      }}
    />
  );
}
