/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Common } from "@freelensapp/extensions";
import { observable } from "mobx";

export interface CertManagerPreferencesModel {
  showExpiredCerts: boolean;
}

export class CertManagerPreferencesStore extends Common.Store.ExtensionStore<CertManagerPreferencesModel> {
  @observable accessor showExpiredCerts = false;

  constructor() {
    super({
      configName: "cert-manager-preferences-store",
      defaults: {
        showExpiredCerts: false,
      },
    });
  }

  fromStore({ showExpiredCerts }: CertManagerPreferencesModel): void {
    this.showExpiredCerts = showExpiredCerts;
  }

  toJSON(): CertManagerPreferencesModel {
    return {
      showExpiredCerts: this.showExpiredCerts,
    };
  }
}
