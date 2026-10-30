/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Renderer } from "@freelensapp/extensions";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  title: string;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: (yaml: string) => Promise<void>;
}

export function YamlEditorDialog({ isOpen, title, value, onChange, onClose, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave(value);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Renderer.Component.Dialog isOpen={isOpen} onClose={onClose} modal pinned>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "700px",
          maxWidth: "90vw",
          gap: "12px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              opacity: 0.7,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            height: "450px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px",
          }}
        >
          <Renderer.Component.MonacoEditor
            language="yaml"
            value={value}
            onChange={(v) => onChange(v)}
            style={{ height: "100%", width: "100%" }}
          />
        </div>

        {error && (
          <div style={{ color: "#f55", fontSize: "0.85rem", padding: "4px 8px" }}>{error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px 14px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "6px 14px",
              cursor: saving ? "not-allowed" : "pointer",
              borderRadius: "4px",
              border: "none",
              background: "#0084d1",
              color: "#fff",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </Renderer.Component.Dialog>
  );
}
