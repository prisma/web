import assert from "node:assert/strict";
import { test } from "node:test";
import { buildOpenAiPixelLoader, measureOpenAiEvent, setOpenAiPixelConsent } from "./openai-pixel";

/** Runs the inline loader against a fake window/document and returns the queued oaiq calls. */
function runLoader(loader: string, cookie: string) {
  const script: Record<string, unknown> = { setAttribute() {} };
  const fakeWindow: Record<string, unknown> = {};
  const fakeDocument = {
    cookie,
    createElement: () => script,
    getElementsByTagName: () => [{ parentNode: { insertBefore: () => {} } }],
    querySelector: () => null,
  };
  // oaiq is referenced as a bare global by the snippet, like on a real page.
  new Function("window", "document", `var oaiq; ${loader.replace(/oaiq\(/g, "window.oaiq(")}`)(
    fakeWindow,
    fakeDocument,
  );
  const queue = (fakeWindow.oaiq as { q: IArguments[] }).q;
  return { calls: queue.map((args) => Array.from(args)), src: script.src };
}

test("the loader inserts the SDK only for a stored advertising grant and denies consent otherwise", () => {
  const loader = buildOpenAiPixelLoader("pixel-1");

  const fresh = runLoader(loader, "");
  assert.equal(fresh.src, undefined, "no SDK request without consent");
  assert.deepEqual(fresh.calls, [
    ["consent", false],
    ["init", { pixelId: "pixel-1" }],
  ]);

  const granted = runLoader(
    loader,
    "other=1; cookieyes-consent=consentid:abc,consent:yes,action:yes,necessary:yes,analytics:yes,advertisement:yes",
  );
  assert.equal(granted.src, "https://bzrcdn.openai.com/sdk/oaiq.min.js");
  assert.deepEqual(granted.calls, [["init", { pixelId: "pixel-1" }]]);

  const denied = runLoader(
    loader,
    "cookieyes-consent=consentid:abc,consent:yes,action:yes,analytics:yes,advertisement:no",
  );
  assert.equal(denied.src, undefined);
  assert.deepEqual(denied.calls, [
    ["consent", false],
    ["init", { pixelId: "pixel-1" }],
  ]);

  const undecided = runLoader(
    loader,
    "cookieyes-consent=consentid:abc,consent:no,action:no,analytics:no,advertisement:yes",
  );
  assert.equal(undecided.src, undefined);
  assert.deepEqual(undecided.calls[0], ["consent", false]);
});

test("measure and consent are no-ops without the loader", () => {
  assert.equal(measureOpenAiEvent("page_viewed", { type: "contents" }), false);
  assert.equal(setOpenAiPixelConsent(true), false);
});

test("measure forwards to the queue with and without options", () => {
  const calls: unknown[][] = [];
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { oaiq: (...args: unknown[]) => calls.push(args) },
  });
  try {
    assert.equal(measureOpenAiEvent("page_viewed", { type: "contents" }), true);
    assert.equal(
      measureOpenAiEvent("registration_completed", { type: "customer_action" }, { event_id: "e1" }),
      true,
    );
    assert.equal(setOpenAiPixelConsent(false), true);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
  assert.deepEqual(calls, [
    ["measure", "page_viewed", { type: "contents" }],
    ["measure", "registration_completed", { type: "customer_action" }, { event_id: "e1" }],
    ["consent", false],
  ]);
});
