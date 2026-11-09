import assert from "node:assert/strict";
import test from "node:test";
import { CTA_CLICK_EVENT, onCtaClick, trackCTA, type CtaClickPayload } from "./analytics";

const PAYLOAD: CtaClickPayload = {
  cta_text: "Start on Starter",
  cta_location: "lp_hero",
  cta_destination: "https://console.prisma.io/sign-up",
  section: "website",
};

/** Installs a minimal browser for the test's duration. */
function installBrowser(t: test.TestContext, { dataLayer }: { dataLayer?: unknown[] } = {}) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const listeners = new Map<string, Set<(event: Event) => void>>();
  const document = {
    addEventListener: (type: string, handler: (event: Event) => void) => {
      listeners.set(type, (listeners.get(type) ?? new Set()).add(handler));
    },
    removeEventListener: (type: string, handler: (event: Event) => void) => {
      listeners.get(type)?.delete(handler);
    },
    dispatchEvent: (event: Event) => {
      for (const handler of listeners.get(event.type) ?? []) handler(event);
      return true;
    },
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: { dataLayer } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: document });
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else delete (globalThis as { window?: unknown }).window;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else delete (globalThis as { document?: unknown }).document;
  });
  return { document };
}

test("trackCTA announces the click as a DOM event even without GTM", (t) => {
  installBrowser(t);
  const seen: CtaClickPayload[] = [];
  const unsubscribe = onCtaClick((payload) => seen.push(payload));

  trackCTA(PAYLOAD);

  assert.deepEqual(seen, [PAYLOAD]);
  unsubscribe();
  trackCTA(PAYLOAD);
  assert.equal(seen.length, 1);
});

test("trackCTA still pushes cta_click to the GTM dataLayer when it exists", (t) => {
  const dataLayer: unknown[] = [];
  installBrowser(t, { dataLayer });

  trackCTA(PAYLOAD);

  assert.deepEqual(dataLayer, [{ event: "cta_click", ...PAYLOAD }]);
});

test("onCtaClick ignores events without a payload", (t) => {
  const { document } = installBrowser(t);
  const seen: CtaClickPayload[] = [];
  onCtaClick((payload) => seen.push(payload));

  document.dispatchEvent(new CustomEvent(CTA_CLICK_EVENT));

  assert.equal(seen.length, 0);
});

test("trackCTA is a no-op during SSR", () => {
  assert.doesNotThrow(() => trackCTA(PAYLOAD));
});
