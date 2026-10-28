/**
 * Author: Maifee Ul Asad <maifeeulasad@gmail.com>
 * Co-Author: Claude Sonnet 4.6 <noreply@anthropic.com>
 */

import { describe, expect, it } from "vitest";
import { CertManagerPreferencesStore } from "./preferences-store";

function makeStore(): CertManagerPreferencesStore {
  return new CertManagerPreferencesStore();
}

describe("CertManagerPreferencesStore", () => {
  describe("defaults", () => {
    it("showExpiredCerts defaults to false (positive)", () => {
      expect(makeStore().showExpiredCerts).toBe(false);
    });
  });

  describe("fromStore", () => {
    it("sets showExpiredCerts from model (positive)", () => {
      const store = makeStore();
      store.fromStore({ showExpiredCerts: true });
      expect(store.showExpiredCerts).toBe(true);
    });

    it("can set showExpiredCerts back to false (positive)", () => {
      const store = makeStore();
      store.fromStore({ showExpiredCerts: true });
      store.fromStore({ showExpiredCerts: false });
      expect(store.showExpiredCerts).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("serialises default state (positive)", () => {
      expect(makeStore().toJSON()).toEqual({ showExpiredCerts: false });
    });

    it("serialises updated state (positive)", () => {
      const store = makeStore();
      store.fromStore({ showExpiredCerts: true });
      expect(store.toJSON()).toEqual({ showExpiredCerts: true });
    });
  });
});
