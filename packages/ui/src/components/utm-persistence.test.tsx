import assert from "node:assert/strict";
import test from "node:test";
import { getActiveAttribution, resetSessionClickIds } from "./utm-persistence";

// Exercise browser capture with real storage serialization and consent reads.
/** Installs a browser-like `window` and `document` for the test's duration. */
function installBrowser(t: test.TestContext, search: string) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const storage = new Map<string, string>();
  const consent = { granted: false };
  const location = { search };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location,
      getCkyConsent: () => ({
        isUserActionCompleted: true,
        categories: { analytics: true, advertisement: consent.granted },
      }),
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    },
  });
  Object.defineProperty(globalThis, "document", { configurable: true, value: new EventTarget() });
  resetSessionClickIds();
  t.after(() => {
    resetSessionClickIds();
    for (const [key, descriptor] of [
      ["window", originalWindow],
      ["document", originalDocument],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  return { storage, consent, location };
}

test("stores the current click only with consent, preserves its time, and purges it on revocation", (t) => {
  const { storage, consent } = installBrowser(t, "?gclid=landing-click&utm_source=google");
  getActiveAttribution("test");
  assert.doesNotMatch(storage.get("test")!, /landing-click/);
  consent.granted = true;
  const captured = getActiveAttribution("test");
  assert.equal(captured?.last.gclid, "landing-click");
  assert.match(storage.get("test")!, /landing-click/);
  assert.deepEqual(getActiveAttribution("test"), captured);
  consent.granted = false;
  getActiveAttribution("test");
  assert.doesNotMatch(storage.get("test")!, /landing-click/);
});

// A ChatGPT ad visitor usually clicks through to the Console before the cookie
// banner has even loaded. The click id must reach the Console anyway; the
// Console gates what it reports to OpenAI on the consent it sees at sign-up.
test("forwards the click id on the hand-off before consent without storing it", (t) => {
  const { storage, location } = installBrowser(
    t,
    "?oppref=chatgpt-click&utm_source=chatgpt&utm_medium=paid",
  );
  const attribution = getActiveAttribution("test");
  assert.equal(attribution?.last.oppref, "chatgpt-click");
  assert.equal(attribution?.last.utm_source, "chatgpt");
  assert.equal(attribution?.first.oppref, undefined);
  assert.doesNotMatch(storage.get("test")!, /chatgpt-click/);

  // The click id survives a soft navigation that drops the query string.
  location.search = "";
  assert.equal(getActiveAttribution("test")?.last.oppref, "chatgpt-click");
  assert.doesNotMatch(storage.get("test")!, /chatgpt-click/);
});

test("drops the earlier click id when a new tagged touch replaces the last touch", (t) => {
  const { location } = installBrowser(t, "?oppref=chatgpt-click&utm_source=chatgpt");
  assert.equal(getActiveAttribution("test")?.last.oppref, "chatgpt-click");
  location.search = "?utm_source=newsletter";
  const next = getActiveAttribution("test");
  assert.equal(next?.last.utm_source, "newsletter");
  assert.equal(next?.last.oppref, undefined);
  location.search = "";
  assert.equal(getActiveAttribution("test")?.last.oppref, undefined);
  location.search = "?gclid=google-click&utm_source=google";
  assert.deepEqual(getActiveAttribution("test")?.last, {
    utm_source: "google",
    gclid: "google-click",
  });
});

test("forwards a click id that arrived without campaign tags", (t) => {
  const { storage } = installBrowser(t, "?oppref=chatgpt-click");
  assert.deepEqual(getActiveAttribution("test"), { first: {}, last: { oppref: "chatgpt-click" } });
  assert.equal(storage.get("test"), undefined);
});
