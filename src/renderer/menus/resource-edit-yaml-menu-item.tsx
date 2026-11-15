/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { dump, load } from "js-yaml";
import { yamlEditorStore } from "../stores/yaml-editor-store";

interface Props {
  object: Renderer.K8sApi.KubeObject;
  api: Renderer.K8sApi.KubeApi<Renderer.K8sApi.KubeObject>;
}

function toEditYaml(obj: Renderer.K8sApi.KubeObject): string {
  const raw = obj as unknown as Record<string, unknown>;
  const metadata = { ...(raw.metadata as Record<string, unknown>) };
  delete metadata.managedFields;
  return dump(
    {
      apiVersion: raw.apiVersion,
      kind: raw.kind,
      metadata,
      spec: raw.spec,
    },
    { lineWidth: -1 },
  );
}

export function ResourceEditYamlMenuItem({ object, api }: Props) {
  function open() {
    yamlEditorStore.open(`Edit ${object.getName()}`, toEditYaml(object), async (yamlStr) => {
      const data = load(yamlStr) as Record<string, unknown>;
      await api.update(
        { name: object.getName(), namespace: object.getNs() ?? "" },
        data as Parameters<typeof api.update>[1],
      );
    });
  }

  return (
    <Renderer.Component.MenuItem icon="edit" onClick={open}>
      Edit YAML
    </Renderer.Component.MenuItem>
  );
}
