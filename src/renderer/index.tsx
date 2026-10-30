/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { Certificate, CertificateRequest, ClusterIssuer, Issuer } from "../common/api";

type DetailsComponent = Renderer.LensExtension["kubeObjectDetailItems"][number]["Details"];
type MenuItemComponent = Renderer.LensExtension["kubeObjectMenuItems"][number]["MenuItem"];

import { CertManagerPreferencesStore } from "../common/store";
import { CertificateDetails } from "./details/certificate-details";
import { CertificateRequestDetails } from "./details/certificate-request-details";
import { ClusterIssuerDetails } from "./details/cluster-issuer-details";
import { IssuerDetails } from "./details/issuer-details";
import { CertificateDeleteCascadeMenuItem } from "./menus/certificate-delete-cascade-menu-item";
import { CertificateForceRenewMenuItem } from "./menus/certificate-force-renew-menu-item";
import { CertificateRequestsPage } from "./pages/certificate-requests-page";
import { CertificatesPage } from "./pages/certificates-page";
import { ClusterIssuersPage } from "./pages/cluster-issuers-page";
import { IssuersPage } from "./pages/issuers-page";
import {
  CertManagerPreferenceHint,
  CertManagerPreferenceInput,
} from "./preferences/cert-manager-preference";

export default class CertManagerRenderer extends Renderer.LensExtension {
  async onActivate() {
    CertManagerPreferencesStore.getInstanceOrCreate().loadExtension(this);
  }

  customResources = [Certificate, CertificateRequest, Issuer, ClusterIssuer];

  kubeObjectDetailItems: Renderer.LensExtension["kubeObjectDetailItems"] = [
    Renderer.K8sApi.detailsFor(Certificate, {
      priority: 10,
      Details: CertificateDetails as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(CertificateRequest, {
      priority: 10,
      Details: CertificateRequestDetails as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(Issuer, {
      priority: 10,
      Details: IssuerDetails as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(ClusterIssuer, {
      priority: 10,
      Details: ClusterIssuerDetails as unknown as DetailsComponent,
    }),
  ];

  clusterPages: Renderer.LensExtension["clusterPages"] = [
    {
      id: "cert-manager-certificates",
      components: {
        Page: () => <CertificatesPage />,
      },
    },
    {
      id: "cert-manager-issuers",
      components: {
        Page: () => <IssuersPage />,
      },
    },
    {
      id: "cert-manager-cluster-issuers",
      components: {
        Page: () => <ClusterIssuersPage />,
      },
    },
    {
      id: "cert-manager-certificate-requests",
      components: {
        Page: () => <CertificateRequestsPage />,
      },
    },
  ];

  appPreferences = [
    {
      title: "Cert Manager",
      components: {
        Input: () => <CertManagerPreferenceInput />,
        Hint: () => <CertManagerPreferenceHint />,
      },
    },
  ];

  kubeObjectMenuItems: Renderer.LensExtension["kubeObjectMenuItems"] = [
    Renderer.K8sApi.menuItemFor(Certificate, {
      MenuItem: CertificateForceRenewMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(Certificate, {
      MenuItem: CertificateDeleteCascadeMenuItem as unknown as MenuItemComponent,
    }),
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
    {
      id: "cert-manager-certificate-requests",
      parentId: "cert-manager",
      title: CertificateRequest.crd.title,
      target: { pageId: "cert-manager-certificate-requests" },
      components: {
        Icon: () => <span>📋</span>,
      },
    },
  ];
}
