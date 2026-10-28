/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { Main } from "@freelensapp/extensions";
import { CertManagerPreferencesStore } from "../common/store";

export default class CertManagerMain extends Main.LensExtension {
  async onActivate() {
    await CertManagerPreferencesStore.getInstanceOrCreate().loadExtension(this);
  }
}
