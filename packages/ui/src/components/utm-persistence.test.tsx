import assert from "node:assert/strict";
import test from "node:test";
import { getActiveAttribution } from "./utm-persistence";

// Exercise browser capture with real storage serialization and consent reads.
test("captures the current click when consent arrives, preserves its time, and strips it on revocation", (t) => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const storage = new Map<string, string>();
  let granted = false;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { search: "?gclid=landing-click&utm_source=google" },
      getCkyConsent: () => ({ isUserActionCompleted: true, categories: { analytics: granted } }),
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    },
  });
  Object.defineProperty(globalThis, "document", { configurable: true, value: new EventTarget() });
  t.after(() => {
    for (const [key, descriptor] of [
      ["window", originalWindow],
      ["document", originalDocument],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  assert.equal(getActiveAttribution("test")?.last.gclid, undefined);
  assert.doesNotMatch(storage.get("test")!, /landing-click/);
  granted = true;
  const captured = getActiveAttribution("test");
  assert.equal(captured?.last.gclid, "landing-click");
  assert.deepEqual(getActiveAttribution("test"), captured);
  granted = false;
  assert.equal(getActiveAttribution("test")?.last.gclid, undefined);
  assert.doesNotMatch(storage.get("test")!, /landing-click/);
});
