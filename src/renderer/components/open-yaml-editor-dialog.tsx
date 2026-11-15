/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Imperative helper to open the YAML editor dialog in its own React root
 * appended to document.body. This keeps the dialog alive even when the
 * calling component (e.g. a context-menu MenuItem) unmounts.
 */

import { useState } from "react";
import { createRoot } from "react-dom/client";
import { YamlEditorDialog } from "./yaml-editor-dialog";

interface OpenOptions {
  title: string;
  initialValue: string;
  onSave: (yaml: string) => Promise<void>;
}

function StandaloneYamlEditor({
  title,
  initialValue,
  onSave,
  onClose,
}: OpenOptions & { onClose: () => void }) {
  const [yaml, setYaml] = useState(initialValue);
  return (
    <YamlEditorDialog
      isOpen={true}
      title={title}
      value={yaml}
      onChange={setYaml}
      onClose={onClose}
      onSave={async (v) => {
        await onSave(v);
        onClose();
      }}
    />
  );
}

export function openYamlEditorDialog(options: OpenOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function close() {
    root.unmount();
    document.body.removeChild(container);
  }

  root.render(<StandaloneYamlEditor {...options} onClose={close} />);
}
