import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSiteRef,
  getClickIdParams,
  getUtmParams,
  mergeUtmAttribution,
  readStoredUtmAttribution,
  syncFallbackRef,
  syncUtmAttribution,
  syncUtmParams,
} from "./utm";

test("preserves first touch and replaces last touch", () => {
  const firstVisit = mergeUtmAttribution(undefined, {
    utm_source: "x",
    utm_campaign: "rebrand-launch",
  });
  const laterVisit = mergeUtmAttribution(firstVisit, {
    utm_source: "chatgpt",
    utm_medium: "referral",
  });

  assert.deepEqual(laterVisit, {
    first: {
      utm_source: "x",
      utm_campaign: "rebrand-launch",
    },
    last: {
      utm_source: "chatgpt",
      utm_medium: "referral",
    },
  });
});

test("keeps attribution through an untagged page transition", () => {
  const attribution = {
    first: { utm_source: "x" },
    last: { utm_source: "chatgpt" },
  };

  assert.deepEqual(mergeUtmAttribution(attribution, {}), attribution);
});

test("adds immutable first touch and rolling last touch to Console links", () => {
  const url = new URL("https://console.prisma.io/sign-up?utm_source=website&utm_medium=pricing");

  syncUtmAttribution(
    url,
    {
      first: {
        utm_source: "x",
        utm_campaign: "rebrand-launch",
        ref: "launch-link",
      },
      last: {
        utm_source: "chatgpt",
        utm_medium: "referral",
      },
    },
    { includeFirstTouch: true },
  );

  assert.equal(url.searchParams.get("first_utm_source"), "x");
  assert.equal(url.searchParams.get("first_utm_campaign"), "rebrand-launch");
  assert.equal(url.searchParams.get("first_ref"), "launch-link");
  assert.equal(url.searchParams.get("utm_source"), "chatgpt");
  assert.equal(url.searchParams.get("utm_medium"), "referral");
  assert.equal(url.searchParams.has("utm_campaign"), false);
});

test("leaves ordinary internal links unchanged, including authored queries and anchors", () => {
  const url = new URL("https://www.prisma.io/docs/composer?tab=npm&utm_campaign=authored#start");
  const original = url.toString();

  syncUtmAttribution(url, {
    first: { utm_source: "x" },
    last: { utm_source: "chatgpt" },
  });

  assert.equal(url.toString(), original);
});

test("expires stored campaigns without refreshing or dating legacy attribution", (t) => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storage = new Map<string, string>([["unrelated", "keep"]]);
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        removeItem: (key: string) => storage.delete(key),
      },
    },
  });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  });
  const now = Date.now();
  t.mock.method(Date, "now", () => now);
  const recent = new Date(now - 1000).toISOString();
  const expired = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString();
  const future = new Date(now + 1000).toISOString();
  const campaign = { first: { utm_source: "chatgpt.com" }, last: { utm_source: "chatgpt.com" } };
  for (const times of [
    {},
    { firstSeenAt: "invalid", lastSeenAt: recent },
    { firstSeenAt: expired, lastSeenAt: recent },
    { firstSeenAt: recent, lastSeenAt: future },
    { firstSeenAt: recent, lastSeenAt: expired },
  ]) {
    storage.set("campaign", JSON.stringify({ ...campaign, ...times }));
    assert.equal(readStoredUtmAttribution("campaign"), undefined);
    assert.equal(storage.has("campaign"), false);
    assert.equal(storage.get("unrelated"), "keep");
  }
  const valid = { ...campaign, firstSeenAt: recent, lastSeenAt: recent };
  storage.set("campaign", JSON.stringify(valid));
  assert.deepEqual(readStoredUtmAttribution("campaign"), valid);
  assert.equal(storage.get("campaign"), JSON.stringify(valid));
});

test("removes stale UTM parameters when forwarding a newer touch", () => {
  const url = new URL("https://console.prisma.io/login?utm_source=website&utm_campaign=login");

  syncUtmParams(url, { utm_source: "rebrand-test" });

  assert.equal(url.searchParams.get("utm_source"), "rebrand-test");
  assert.equal(url.searchParams.has("utm_campaign"), false);
});

test("names the handing-off page as the site ref", () => {
  assert.equal(buildSiteRef("/"), "prisma.io");
  assert.equal(buildSiteRef("/postgres"), "prisma.io/postgres");
  assert.equal(buildSiteRef("/blog/some-post"), "prisma.io/blog/some-post");
});

test("stamps the fallback ref on an untagged Console link", () => {
  const url = new URL("https://console.prisma.io/sign-up");

  assert.equal(syncFallbackRef(url, "prisma.io/pricing"), true);
  assert.equal(url.searchParams.get("ref"), "prisma.io/pricing");
  assert.equal(url.searchParams.has("utm_source"), false);
});

test("never overrides a Console link that already carries attribution", () => {
  for (const tagged of [
    "https://console.prisma.io/sign-up?utm_source=docs&utm_medium=login",
    "https://console.prisma.io/sign-up?ref=producthunt",
    "https://console.prisma.io/sign-up?first_utm_source=x",
    "https://console.prisma.io/sign-up?gclid=abc",
  ]) {
    const url = new URL(tagged);
    const before = url.toString();

    assert.equal(syncFallbackRef(url, "prisma.io"), false, tagged);
    assert.equal(url.toString(), before, tagged);
  }
});

test("captures the ChatGPT ads click id like other ad click ids and forwards it to the console", () => {
  const query = new URLSearchParams("oppref=chatgpt-click&utm_source=chatgpt&utm_medium=paid");
  assert.equal(getUtmParams(query).oppref, "chatgpt-click");
  assert.equal(getUtmParams(query, { includeClickIds: false }).oppref, undefined);
  assert.deepEqual(getClickIdParams(query), { oppref: "chatgpt-click" });

  const attribution = mergeUtmAttribution(
    undefined,
    getUtmParams(query),
    "2026-10-09T10:00:00.000Z",
  );
  assert.ok(attribution);
  const internal = new URL("https://www.prisma.io/pricing");
  syncUtmParams(internal, attribution.last);
  assert.equal(internal.searchParams.get("oppref"), null);
  const console = new URL("https://console.prisma.io/sign-up");
  syncUtmAttribution(console, attribution, { includeFirstTouch: true });
  assert.equal(console.searchParams.get("oppref"), "chatgpt-click");
  assert.equal(console.searchParams.get("first_oppref"), "chatgpt-click");
  assert.equal(console.searchParams.get("first_utm_source"), "chatgpt");
});
