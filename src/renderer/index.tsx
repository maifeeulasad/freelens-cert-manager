import "reflect-metadata";

/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import {
  Certificate,
  CertificateRequest,
  Challenge,
  ClusterIssuer,
  Issuer,
  Order,
} from "../common/api";

type DetailsComponent =
  Renderer.LensExtension["kubeObjectDetailItems"][number]["components"]["Details"];
type MenuItemComponent =
  Renderer.LensExtension["kubeObjectMenuItems"][number]["components"]["MenuItem"];

import { CertManagerPreferencesStore } from "../common/store";
import { ErrorBoundary } from "./components/error-boundary";
import {
  IconCertificate,
  IconCertificateRequest,
  IconCertManager,
  IconChallenge,
  IconClusterIssuer,
  IconIssuer,
  IconOrder,
} from "./components/icons";
import { CertificateDetails } from "./details/certificate-details";
import { CertificateRequestDetails } from "./details/certificate-request-details";
import { ChallengeDetails } from "./details/challenge-details";
import { ClusterIssuerDetails } from "./details/cluster-issuer-details";
import { IssuerDetails } from "./details/issuer-details";
import { OrderDetails } from "./details/order-details";
import { CertificateDeleteCascadeMenuItem } from "./menus/certificate-delete-cascade-menu-item";
import { CertificateEditMenuItem } from "./menus/certificate-edit-menu-item";
import { CertificateForceRenewMenuItem } from "./menus/certificate-force-renew-menu-item";
import { CertificateRequestApproveMenuItem } from "./menus/certificate-request-approve-menu-item";
import { CertificateRequestDenyMenuItem } from "./menus/certificate-request-deny-menu-item";
import { CertificateRequestEditMenuItem } from "./menus/certificate-request-edit-menu-item";
import { ChallengeDeleteStuckMenuItem } from "./menus/challenge-delete-stuck-menu-item";
import { ChallengeEditMenuItem } from "./menus/challenge-edit-menu-item";
import { ClusterIssuerEditMenuItem } from "./menus/cluster-issuer-edit-menu-item";
import { IssuerEditMenuItem } from "./menus/issuer-edit-menu-item";
import { OrderDeleteStuckMenuItem } from "./menus/order-delete-stuck-menu-item";
import { OrderEditMenuItem } from "./menus/order-edit-menu-item";
import { CertificateRequestsPage } from "./pages/certificate-requests-page";
import { CertificatesPage } from "./pages/certificates-page";
import { ChallengesPage } from "./pages/challenges-page";
import { ClusterIssuersPage } from "./pages/cluster-issuers-page";
import { IssuersPage } from "./pages/issuers-page";
import { OrdersPage } from "./pages/orders-page";
import {
  CertManagerPreferenceHint,
  CertManagerPreferenceInput,
} from "./preferences/cert-manager-preference";

export default class CertManagerRenderer extends Renderer.LensExtension {
  async onActivate() {
    CertManagerPreferencesStore.getInstanceOrCreate().loadExtension(this);
  }

  customResources = [Certificate, CertificateRequest, Issuer, ClusterIssuer, Order, Challenge];

  kubeObjectDetailItems: Renderer.LensExtension["kubeObjectDetailItems"] = [
    Renderer.K8sApi.detailsFor(Certificate, {
      priority: 10,
      Details: ((p: Parameters<typeof CertificateDetails>[0]) => (
        <ErrorBoundary name="CertificateDetails">
          <CertificateDetails {...p} />
        </ErrorBoundary>
      )) as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(CertificateRequest, {
      priority: 10,
      Details: ((p: Parameters<typeof CertificateRequestDetails>[0]) => (
        <ErrorBoundary name="CertificateRequestDetails">
          <CertificateRequestDetails {...p} />
        </ErrorBoundary>
      )) as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(Issuer, {
      priority: 10,
      Details: ((p: Parameters<typeof IssuerDetails>[0]) => (
        <ErrorBoundary name="IssuerDetails">
          <IssuerDetails {...p} />
        </ErrorBoundary>
      )) as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(ClusterIssuer, {
      priority: 10,
      Details: ((p: Parameters<typeof ClusterIssuerDetails>[0]) => (
        <ErrorBoundary name="ClusterIssuerDetails">
          <ClusterIssuerDetails {...p} />
        </ErrorBoundary>
      )) as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(Order, {
      priority: 10,
      Details: ((p: Parameters<typeof OrderDetails>[0]) => (
        <ErrorBoundary name="OrderDetails">
          <OrderDetails {...p} />
        </ErrorBoundary>
      )) as unknown as DetailsComponent,
    }),
    Renderer.K8sApi.detailsFor(Challenge, {
      priority: 10,
      Details: ((p: Parameters<typeof ChallengeDetails>[0]) => (
        <ErrorBoundary name="ChallengeDetails">
          <ChallengeDetails {...p} />
        </ErrorBoundary>
      )) as unknown as DetailsComponent,
    }),
  ];

  clusterPages: Renderer.LensExtension["clusterPages"] = [
    {
      id: "cert-manager-certificates",
      components: {
        Page: () => (
          <ErrorBoundary name="CertificatesPage">
            <CertificatesPage />
          </ErrorBoundary>
        ),
      },
    },
    {
      id: "cert-manager-issuers",
      components: {
        Page: () => (
          <ErrorBoundary name="IssuersPage">
            <IssuersPage />
          </ErrorBoundary>
        ),
      },
    },
    {
      id: "cert-manager-cluster-issuers",
      components: {
        Page: () => (
          <ErrorBoundary name="ClusterIssuersPage">
            <ClusterIssuersPage />
          </ErrorBoundary>
        ),
      },
    },
    {
      id: "cert-manager-certificate-requests",
      components: {
        Page: () => (
          <ErrorBoundary name="CertificateRequestsPage">
            <CertificateRequestsPage />
          </ErrorBoundary>
        ),
      },
    },
    {
      id: "cert-manager-orders",
      components: {
        Page: () => (
          <ErrorBoundary name="OrdersPage">
            <OrdersPage />
          </ErrorBoundary>
        ),
      },
    },
    {
      id: "cert-manager-challenges",
      components: {
        Page: () => (
          <ErrorBoundary name="ChallengesPage">
            <ChallengesPage />
          </ErrorBoundary>
        ),
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
    Renderer.K8sApi.menuItemFor(Certificate, {
      MenuItem: CertificateEditMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(Issuer, {
      MenuItem: IssuerEditMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(ClusterIssuer, {
      MenuItem: ClusterIssuerEditMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(CertificateRequest, {
      MenuItem: CertificateRequestApproveMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(CertificateRequest, {
      MenuItem: CertificateRequestDenyMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(CertificateRequest, {
      MenuItem: CertificateRequestEditMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(Order, {
      MenuItem: OrderEditMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(Order, {
      MenuItem: OrderDeleteStuckMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(Challenge, {
      MenuItem: ChallengeEditMenuItem as unknown as MenuItemComponent,
    }),
    Renderer.K8sApi.menuItemFor(Challenge, {
      MenuItem: ChallengeDeleteStuckMenuItem as unknown as MenuItemComponent,
    }),
  ];

  clusterPageMenus = [
    {
      id: "cert-manager",
      title: "Cert Manager",
      components: {
        Icon: () => <IconCertManager />,
      },
    },
    {
      id: "cert-manager-certificates",
      parentId: "cert-manager",
      title: Certificate.crd.title,
      target: { pageId: "cert-manager-certificates" },
      components: {
        Icon: () => <IconCertificate />,
      },
    },
    {
      id: "cert-manager-issuers",
      parentId: "cert-manager",
      title: Issuer.crd.title,
      target: { pageId: "cert-manager-issuers" },
      components: {
        Icon: () => <IconIssuer />,
      },
    },
    {
      id: "cert-manager-cluster-issuers",
      parentId: "cert-manager",
      title: ClusterIssuer.crd.title,
      target: { pageId: "cert-manager-cluster-issuers" },
      components: {
        Icon: () => <IconClusterIssuer />,
      },
    },
    {
      id: "cert-manager-certificate-requests",
      parentId: "cert-manager",
      title: CertificateRequest.crd.title,
      target: { pageId: "cert-manager-certificate-requests" },
      components: {
        Icon: () => <IconCertificateRequest />,
      },
    },
    {
      id: "cert-manager-orders",
      parentId: "cert-manager",
      title: Order.crd.title,
      target: { pageId: "cert-manager-orders" },
      components: {
        Icon: () => <IconOrder />,
      },
    },
    {
      id: "cert-manager-challenges",
      parentId: "cert-manager",
      title: Challenge.crd.title,
      target: { pageId: "cert-manager-challenges" },
      components: {
        Icon: () => <IconChallenge />,
      },
    },
  ];
}
