/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Certificate, ClusterIssuer, Issuer } from "../common/api";
import { CertManagerPreferencesStore } from "../common/store";
import { CertificatesPage } from "./pages/certificates-page";
import { ClusterIssuersPage } from "./pages/cluster-issuers-page";
import { IssuersPage } from "./pages/issuers-page";

export default class CertManagerRenderer extends Renderer.LensExtension {
  async onActivate() {
    CertManagerPreferencesStore.getInstanceOrCreate().loadExtension(this);
  }

  async onDeactivate() {
    CertManagerPreferencesStore.getInstance()?.disposeExtension(this);
  }

  customResources = [Certificate, Issuer, ClusterIssuer];

  clusterPages: Renderer.LensExtension["clusterPages"] = [
    {
      id: "cert-manager-certificates",
      components: {
        Page: () => <CertificatesPage extension={this} />,
      },
    },
    {
      id: "cert-manager-issuers",
      components: {
        Page: () => <IssuersPage extension={this} />,
      },
    },
    {
      id: "cert-manager-cluster-issuers",
      components: {
        Page: () => <ClusterIssuersPage extension={this} />,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: "cert-manager",
      title: "Cert Manager",
      components: {
        Icon: () => <span>🔐</span>,
      },
    },
    {
      id: "cert-manager-certificates",
      parentId: "cert-manager",
      title: Certificate.crd.title,
      target: { pageId: "cert-manager-certificates" },
      components: {
        Icon: () => <span>📜</span>,
      },
    },
    {
      id: "cert-manager-issuers",
      parentId: "cert-manager",
      title: Issuer.crd.title,
      target: { pageId: "cert-manager-issuers" },
      components: {
        Icon: () => <span>🏛️</span>,
      },
    },
    {
      id: "cert-manager-cluster-issuers",
      parentId: "cert-manager",
      title: ClusterIssuer.crd.title,
      target: { pageId: "cert-manager-cluster-issuers" },
      components: {
        Icon: () => <span>🌐</span>,
      },
    },
  ];
}
