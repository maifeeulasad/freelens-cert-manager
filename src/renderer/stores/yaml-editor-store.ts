/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 *
 * Module-level MobX store for the shared YAML editor dialog.
 * Menu items call open() to show the dialog; the page-level
 * YamlEditorDialogHost observes this store and renders the dialog.
 * This keeps the dialog alive even after the MenuItem that triggered
 * it unmounts when the context menu closes.
 */

import { makeAutoObservable } from "mobx";

class YamlEditorDialogStore {
  isOpen = false;
  title = "";
  yaml = "";
  _onSave: ((yaml: string) => Promise<void>) | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  open(title: string, yaml: string, onSave: (yaml: string) => Promise<void>) {
    this.title = title;
    this.yaml = yaml;
    this._onSave = onSave;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  setYaml(yaml: string) {
    this.yaml = yaml;
  }
}

export const yamlEditorStore = new YamlEditorDialogStore();
