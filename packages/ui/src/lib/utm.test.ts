import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's TypeScript test runner requires the explicit extension.
import { mergeUtmAttribution, syncUtmAttribution, syncUtmParams } from "./utm.ts";

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
