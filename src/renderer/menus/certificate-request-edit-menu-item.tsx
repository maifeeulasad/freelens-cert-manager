/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { CertificateRequest, type CertificateRequestStore } from "../../common/api";
import { ResourceEditYamlMenuItem } from "./resource-edit-yaml-menu-item";

import type { Renderer } from "@freelensapp/extensions";

interface Props {
  object: CertificateRequest;
}

export function CertificateRequestEditMenuItem({ object }: Props) {
  const api = (CertificateRequest.getStore() as CertificateRequestStore)
    .api as unknown as Renderer.K8sApi.KubeApi<Renderer.K8sApi.KubeObject>;
  return <ResourceEditYamlMenuItem object={object} api={api} />;
}
