import assert from "node:assert/strict";
import test from "node:test";
import { SOURCE_STORAGE_KEY, resetSourceEntry } from "../lib/source.browser";
import { UTM_ATTRIBUTION_STORAGE_KEY, buildSiteRef } from "../lib/utm";
import {
  decorateBeforeOpenElsewhere,
  decorateConsoleAnchor,
  getActiveAttribution,
  resetSessionClickIds,
} from "./utm-persistence";

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

/**
 * Installs a page at `pageUrl` with the given entry referrer, for the Console
 * link tests. No consent decision exists, as for most visitors.
 */
function installPage(t: test.TestContext, pageUrl: string, referrer = "") {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const storage = new Map<string, string>();
  const url = new URL(pageUrl);
  const location = {
    get href() {
      return url.href;
    },
    get origin() {
      return url.origin;
    },
    get pathname() {
      return url.pathname;
    },
    get search() {
      return url.search;
    },
  };
  const page: Record<string, unknown> = {
    location,
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  };
  page.top = page;
  page.self = page;
  Object.defineProperty(globalThis, "window", { configurable: true, value: page });
  const document = Object.assign(new EventTarget(), { referrer, cookie: "" });
  Object.defineProperty(globalThis, "document", { configurable: true, value: document });
  resetSessionClickIds();
  resetSourceEntry();
  t.after(() => {
    resetSessionClickIds();
    resetSourceEntry();
    for (const [key, descriptor] of [
      ["window", originalWindow],
      ["document", originalDocument],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  return { storage, url };
}

/** A minimal anchor whose `href` resolves against the page, like the DOM's. */
function anchorTo(href: string) {
  const attributes = new Map([["href", href]]);
  const anchor = {
    target: "",
    getAttribute: (name: string) => attributes.get(name) ?? null,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    hasAttribute: (name: string) => attributes.has(name),
    get href() {
      return new URL(attributes.get("href")!, window.location.href).href;
    },
  };
  return anchor as unknown as HTMLAnchorElement;
}

const siteOptions = { storageKey: UTM_ATTRIBUTION_STORAGE_KEY, fallbackConsoleRef: buildSiteRef };

test("a ChatGPT-tagged landing puts acq_source and first_acq_source on the Sign up link", (t) => {
  installPage(t, "https://www.prisma.io/?utm_source=chatgpt.com");
  const decorated = decorateConsoleAnchor(
    anchorTo("https://console.prisma.io/sign-up"),
    siteOptions,
  );
  assert.ok(decorated);
  assert.equal(
    decorated.targetUrl.search,
    "?utm_source=chatgpt.com&first_utm_source=chatgpt.com&acq_source=chatgpt&first_acq_source=chatgpt",
  );
});

test("a middle-click on the Sign up link carries the same source", (t) => {
  installPage(t, "https://www.prisma.io/?utm_source=chatgpt.com");
  const anchor = anchorTo("https://console.prisma.io/sign-up");
  const target = { closest: () => anchor };
  for (const type of ["mousedown", "auxclick"]) {
    decorateBeforeOpenElsewhere({ type, button: 1, target } as unknown as MouseEvent, siteOptions);
  }
  assert.match(
    anchor.getAttribute("href")!,
    /[?&]acq_source=chatgpt&first_acq_source=chatgpt(&|$)/,
  );
});

test("a right-click on the link decorates it before the menu opens", (t) => {
  installPage(t, "https://www.prisma.io/postgres", "https://gemini.google.com/");
  const anchor = anchorTo("/sign-up");
  decorateBeforeOpenElsewhere(
    { type: "contextmenu", button: 2, target: { closest: () => anchor } } as unknown as MouseEvent,
    siteOptions,
  );
  assert.equal(
    anchor.getAttribute("href"),
    "/sign-up?ref=prisma.io%2Fpostgres&acq_source=gemini&first_acq_source=gemini",
  );
});

test("a primary mousedown is left to the click handler", (t) => {
  installPage(t, "https://www.prisma.io/?utm_source=chatgpt.com");
  const anchor = anchorTo("https://console.prisma.io/sign-up");
  decorateBeforeOpenElsewhere(
    { type: "mousedown", button: 0, target: { closest: () => anchor } } as unknown as MouseEvent,
    siteOptions,
  );
  assert.equal(anchor.getAttribute("href"), "https://console.prisma.io/sign-up");
});

test("a referrer-only visit keeps the ref fallback, stores no campaign and no referrer", (t) => {
  const { storage } = installPage(
    t,
    "https://www.prisma.io/orm",
    "https://claude.ai/chat/0b6f1c2e-secret?q=private",
  );
  const decorated = decorateConsoleAnchor(anchorTo("https://console.prisma.io/login"), siteOptions);
  assert.equal(
    decorated?.targetUrl.search,
    "?ref=prisma.io%2Form&acq_source=claude&first_acq_source=claude",
  );
  assert.equal(storage.get(UTM_ATTRIBUTION_STORAGE_KEY), undefined);
  const stored = JSON.parse(storage.get(SOURCE_STORAGE_KEY)!);
  assert.deepEqual(Object.keys(stored).sort(), ["first", "firstSeenAt", "last", "lastSeenAt"]);
  assert.equal(stored.first, "claude");
  for (const value of storage.values()) {
    assert.doesNotMatch(value, /claude\.ai|secret|private/);
  }
});

test("docs' built-in tags stay untouched by a referrer-only visit", (t) => {
  installPage(t, "https://www.prisma.io/docs/orm", "https://www.google.com/");
  const decorated = decorateConsoleAnchor(
    anchorTo("https://console.prisma.io/sign-up?utm_source=docs&utm_medium=content"),
    { storageKey: UTM_ATTRIBUTION_STORAGE_KEY },
  );
  assert.equal(
    decorated?.targetUrl.search,
    "?utm_source=docs&utm_medium=content&acq_source=google&first_acq_source=google",
  );
});

test("direct is never sent", (t) => {
  const { storage } = installPage(t, "https://www.prisma.io/", "https://www.prisma.io/docs");
  const decorated = decorateConsoleAnchor(
    anchorTo("https://console.prisma.io/sign-up"),
    siteOptions,
  );
  assert.equal(decorated?.targetUrl.search, "?ref=prisma.io");
  assert.equal(storage.get(SOURCE_STORAGE_KEY), undefined);
});

test("a later search visit moves the last source and keeps the first", (t) => {
  const { storage } = installPage(t, "https://www.prisma.io/", "https://www.bing.com/");
  storage.set(
    SOURCE_STORAGE_KEY,
    JSON.stringify({
      first: "chatgpt",
      last: "chatgpt",
      firstSeenAt: new Date(Date.now() - 60_000).toISOString(),
      lastSeenAt: new Date(Date.now() - 60_000).toISOString(),
    }),
  );
  const decorated = decorateConsoleAnchor(
    anchorTo("https://console.prisma.io/sign-up"),
    siteOptions,
  );
  assert.match(decorated!.targetUrl.search, /acq_source=bing&first_acq_source=chatgpt$/);
});

test("an expired source is forgotten", (t) => {
  const { storage } = installPage(t, "https://www.prisma.io/");
  const old = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString();
  storage.set(
    SOURCE_STORAGE_KEY,
    JSON.stringify({ first: "chatgpt", last: "chatgpt", firstSeenAt: old, lastSeenAt: old }),
  );
  const decorated = decorateConsoleAnchor(
    anchorTo("https://console.prisma.io/sign-up"),
    siteOptions,
  );
  assert.equal(decorated?.targetUrl.search, "?ref=prisma.io");
  assert.equal(storage.get(SOURCE_STORAGE_KEY), undefined);
});

test("a page reached from this site's own origin is not a touch", (t) => {
  const { storage } = installPage(
    t,
    "https://preview.example.dev/pricing",
    "https://preview.example.dev/",
  );
  const decorated = decorateConsoleAnchor(
    anchorTo("https://console.prisma.io/sign-up"),
    siteOptions,
  );
  assert.equal(decorated?.targetUrl.search, "?ref=prisma.io%2Fpricing");
  assert.equal(storage.get(SOURCE_STORAGE_KEY), undefined);
});

test("links to other sites are left alone", (t) => {
  installPage(t, "https://www.prisma.io/?utm_source=chatgpt.com");
  assert.equal(
    decorateConsoleAnchor(anchorTo("https://github.com/prisma/prisma"), siteOptions),
    undefined,
  );
  assert.equal(decorateConsoleAnchor(anchorTo("/docs"), siteOptions), undefined);
});
