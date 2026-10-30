import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSiteRef,
  getClickIdParams,
  getUtmParams,
  mergeUtmAttribution,
  readStoredUtmAttribution,
  syncConsoleHandoff,
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

test("stamps the page ref on an untagged Console link", () => {
  const url = new URL("https://console.prisma.io/sign-up");

  assert.equal(syncConsoleHandoff(url, { pageRef: "prisma.io/pricing" }), true);
  assert.equal(url.toString(), "https://console.prisma.io/sign-up?ref=prisma.io%2Fpricing");
});

test("leaves the link alone when the app passes no page ref and the visitor has no attribution", () => {
  const url = new URL("https://console.prisma.io/sign-up?utm_source=docs&utm_medium=content");
  const before = url.toString();

  assert.equal(syncConsoleHandoff(url, {}), false);
  assert.equal(url.toString(), before);
});

// Docs writes `utm_source=docs&utm_medium=content&utm_content=<section>` into
// its Console links at build time (remark-console-utm), and a few blog posts
// hard-code a campaign. Those tags describe the link, so an untagged visitor
// still gets the page as `ref`, and the tags stay exactly as written. So do an
// ad click ID or a first-touch key written into the link: only `ref` is set.
test("adds the page ref next to attribution written into the Console link", () => {
  for (const [authored, page] of [
    [
      "https://console.prisma.io/sign-up?utm_source=docs&utm_medium=content&utm_content=postgres",
      "/docs/postgres/import-from-existing-database",
    ],
    [
      "https://console.prisma.io/sign-up?utm_source=prisma_blog&utm_medium=organic&utm_campaign=launch",
      "/blog/some-post",
    ],
    ["https://console.prisma.io/sign-up?gclid=abc", "/pricing"],
    ["https://console.prisma.io/sign-up?first_utm_source=x", "/pricing"],
  ] as const) {
    const url = new URL(authored);

    assert.equal(syncConsoleHandoff(url, { pageRef: buildSiteRef(page) }), true, authored);
    assert.equal(url.searchParams.get("ref"), `prisma.io${page}`, authored);
    url.searchParams.delete("ref");
    assert.equal(url.toString(), authored, authored);
  }
});

// The page ref is added for tagged visitors too. Everything else on the link is
// what `syncUtmAttribution` produced before: the visitor's `utm_*` replace the
// tags written into a docs link, and `first_utm_*` and click IDs are forwarded.
test("forwards a tagged visitor's attribution as before and adds the page ref", () => {
  const docsLink =
    "https://console.prisma.io/sign-up?utm_source=docs&utm_medium=content&utm_content=postgres";
  const tagged = {
    first: { utm_source: "chatgpt.com" },
    last: { utm_source: "chatgpt.com" },
  };
  const url = new URL(docsLink);

  assert.equal(
    syncConsoleHandoff(url, {
      attribution: tagged,
      pageRef: "prisma.io/docs/postgres/import-from-existing-database",
    }),
    true,
  );
  assert.equal(
    url.toString(),
    "https://console.prisma.io/sign-up?utm_source=chatgpt.com&first_utm_source=chatgpt.com" +
      "&ref=prisma.io%2Fdocs%2Fpostgres%2Fimport-from-existing-database",
  );

  for (const [link, attribution] of [
    [docsLink, tagged],
    [
      "https://console.prisma.io/sign-up",
      {
        first: { utm_source: "x", utm_campaign: "launch" },
        last: { utm_source: "newsletter", utm_medium: "email" },
      },
    ],
    [
      "https://console.prisma.io/login?utm_source=docs&utm_medium=login",
      { first: { gclid: "first-click" }, last: { utm_source: "google", gclid: "last-click" } },
    ],
  ] as const) {
    const before = new URL(link);
    syncUtmAttribution(before, attribution, { includeFirstTouch: true });
    const after = new URL(link);

    assert.equal(syncConsoleHandoff(after, { attribution, pageRef: "prisma.io/pricing" }), true);
    assert.equal(after.searchParams.get("ref"), "prisma.io/pricing", link);
    after.searchParams.delete("ref");
    assert.equal(after.toString(), before.toString(), link);
  }
});

test("never replaces a ref the visitor brought or the link carries", () => {
  // Untagged visitor, link written with its own `ref`: left as it is.
  for (const authored of [
    "https://console.prisma.io/sign-up?ref=producthunt",
    "https://console.prisma.io/sign-up?utm_source=docs&utm_medium=content&ref=partner",
  ]) {
    const url = new URL(authored);

    assert.equal(syncConsoleHandoff(url, { pageRef: "prisma.io" }), false, authored);
    assert.equal(url.toString(), authored, authored);
  }

  // Tagged visitors: the link is exactly what `syncUtmAttribution` gives, with
  // no page ref. A visitor's own `ref` is forwarded; a `ref` written into the
  // link is dropped for a tagged visitor as before, and the page does not take
  // its place.
  for (const [link, attribution] of [
    [
      "https://console.prisma.io/sign-up",
      { first: { ref: "producthunt" }, last: { ref: "producthunt" } },
    ],
    [
      "https://console.prisma.io/sign-up?utm_source=docs&utm_medium=content",
      { first: { utm_source: "x" }, last: { utm_source: "x", ref: "laconsole.dev" } },
    ],
    [
      "https://console.prisma.io/sign-up?ref=partner",
      { first: { utm_source: "newsletter" }, last: { utm_source: "newsletter" } },
    ],
  ] as const) {
    const expected = new URL(link);
    syncUtmAttribution(expected, attribution, { includeFirstTouch: true });
    const url = new URL(link);

    syncConsoleHandoff(url, { attribution, pageRef: "prisma.io/pricing" });
    assert.equal(url.toString(), expected.toString(), link);
    assert.notEqual(url.searchParams.get("ref"), "prisma.io/pricing", link);
  }
});

// The docs header opens the Console in a new tab and stays mounted across
// client-side navigation, so its href still carries the ref from the page where
// it was first clicked.
test("replaces the page ref it stamped on an earlier page but never an authored one", () => {
  const header = "https://console.prisma.io/login?utm_source=docs&utm_medium=login";
  const url = new URL(`${header}&ref=prisma.io%2Fdocs%2Fa`);

  assert.equal(
    syncConsoleHandoff(url, { pageRef: "prisma.io/docs/b", stampedRef: "prisma.io/docs/a" }),
    true,
  );
  assert.equal(url.toString(), `${header}&ref=prisma.io%2Fdocs%2Fb`);

  // A second click on the same page changes nothing.
  assert.equal(
    syncConsoleHandoff(url, { pageRef: "prisma.io/docs/b", stampedRef: "prisma.io/docs/b" }),
    false,
  );

  const authored = new URL(`${header}&ref=producthunt`);
  assert.equal(
    syncConsoleHandoff(authored, { pageRef: "prisma.io/docs/b", stampedRef: "prisma.io/docs/a" }),
    false,
  );
  assert.equal(authored.searchParams.get("ref"), "producthunt");

  // Same for a tagged visitor: the old page gives way to the current one.
  const tagged = new URL("https://console.prisma.io/login?utm_source=x&ref=prisma.io%2Fdocs%2Fa");
  syncConsoleHandoff(tagged, {
    attribution: { first: { utm_source: "x" }, last: { utm_source: "x" } },
    pageRef: "prisma.io/docs/b",
    stampedRef: "prisma.io/docs/a",
  });
  assert.equal(
    tagged.toString(),
    "https://console.prisma.io/login?utm_source=x&first_utm_source=x&ref=prisma.io%2Fdocs%2Fb",
  );
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
