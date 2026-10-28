/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { observer } from "mobx-react";
import { CertManagerPreferencesStore } from "../../common/store";

export const CertManagerPreferenceInput = observer(function CertManagerPreferenceInput() {
  const store = CertManagerPreferencesStore.getInstanceOrCreate();

  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={store.showExpiredCerts}
        onChange={(e) => {
          store.fromStore({ showExpiredCerts: e.target.checked });
        }}
      />
      Show expired certificates
    </label>
  );
});

export function CertManagerPreferenceHint() {
  return (
    <small>
      When enabled, expired certificates remain visible in the list instead of being filtered out.
    </small>
  );
}
