/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Issuer } from "../../common/api";

interface Props {
  extension: Renderer.LensExtension;
}

export function IssuersPage(_props: Props) {
  const store = Issuer.getStore();

  return (
    <Renderer.Component.KubeObjectListLayout
      store={store}
      isConfigurable
      tableId="cert-manager-issuers"
      className="IssuersPage"
      renderTableHeader={() => [
        <Renderer.Component.TableCell key="name" className="name">
          Name
        </Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="namespace" className="namespace">
          Namespace
        </Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="ready" className="ready">
          Ready
        </Renderer.Component.TableCell>,
        <Renderer.Component.TableCell key="type" className="type">
          Type
        </Renderer.Component.TableCell>,
      ]}
      renderTableContents={(issuer: Issuer) => [
        issuer.getName(),
        issuer.getNs(),
        issuer.isReady ? "✓" : "✗",
        issuer.issuerType,
      ]}
    />
  );
}
