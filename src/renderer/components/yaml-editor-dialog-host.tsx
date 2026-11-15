/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Page-level host that renders the YAML editor dialog driven by
 * yamlEditorStore. Each resource page includes one of these so the
 * dialog stays mounted even after the context-menu MenuItem unmounts.
 */

import { observer } from "mobx-react";
import { yamlEditorStore } from "../stores/yaml-editor-store";
import { YamlEditorDialog } from "./yaml-editor-dialog";

export const YamlEditorDialogHost = observer(function YamlEditorDialogHost() {
  return (
    <YamlEditorDialog
      isOpen={yamlEditorStore.isOpen}
      title={yamlEditorStore.title}
      value={yamlEditorStore.yaml}
      onChange={(v) => yamlEditorStore.setYaml(v)}
      onClose={() => yamlEditorStore.close()}
      onSave={async (yaml) => {
        await yamlEditorStore._onSave?.(yaml);
        yamlEditorStore.close();
      }}
    />
  );
});
