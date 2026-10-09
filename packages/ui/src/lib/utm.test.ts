import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSiteRef,
  getUtmParams,
  mergeUtmAttribution,
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

test("does not add first-touch parameters to ordinary internal links", () => {
  const url = new URL("https://www.prisma.io/pricing");

  syncUtmAttribution(url, {
    first: { utm_source: "x" },
    last: { utm_source: "chatgpt" },
  });

  assert.equal(url.searchParams.get("utm_source"), "chatgpt");
  assert.equal(url.searchParams.has("first_utm_source"), false);
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
