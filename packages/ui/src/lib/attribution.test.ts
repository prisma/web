import { test } from "node:test";
import assert from "node:assert/strict";
import { getPaidPersonProperties } from "./attribution";
import { getUtmParams, mergeUtmAttribution, syncUtmAttribution } from "./utm";

function paidProperties(attribution: Parameters<typeof getPaidPersonProperties>[0]) {
  const properties = getPaidPersonProperties(attribution);
  assert.ok(properties);
  return properties;
}

const firstTime = "2026-09-01T10:00:00.000Z";
const lastTime = "2026-09-14T10:00:00.000Z";

test("captures a Google click without UTMs and can exclude identifiers", () => {
  const query = new URLSearchParams("gclid=click-1&utm_source=google");
  assert.equal(getUtmParams(query).gclid, "click-1");
  assert.deepEqual(getUtmParams(query, { includeClickIds: false }), { utm_source: "google" });
});
test("replays the original paid timestamp after organic navigation", () => {
  const paid = mergeUtmAttribution(undefined, { gclid: "click-1" }, firstTime);
  const later = mergeUtmAttribution(paid, {}, lastTime);
  assert.deepEqual(paidProperties(later), paidProperties(paid));
  assert.equal(paidProperties(later).set.last_paid_at, firstTime);
});
test("does not invent timestamps for legacy storage", () => {
  const legacy = { first: { gclid: "old" }, last: { gclid: "old" } };
  const properties = paidProperties(legacy);
  assert.equal("first_paid_at" in properties.setOnce, false);
  assert.equal("last_paid_at" in properties.set, false);
  const next = mergeUtmAttribution(legacy, { gclid: "new" }, lastTime);
  assert.equal(paidProperties(next).setOnce.first_paid_at, undefined);
  assert.equal(paidProperties(next).set.last_paid_at, lastTime);
});
test("handles an organic first touch followed by a paid touch", () => {
  const organic = mergeUtmAttribution(undefined, { utm_source: "newsletter" }, firstTime);
  const paid = mergeUtmAttribution(organic, { gclid: "paid" }, lastTime);
  assert.equal(paidProperties(paid).setOnce.first_paid_click_id, "paid");
  assert.equal(paidProperties(paid).setOnce.first_paid_at, lastTime);
});
test("does not overwrite the last paid touch with an organic campaign", () => {
  const paid = mergeUtmAttribution(undefined, { gclid: "paid" }, firstTime);
  const organic = mergeUtmAttribution(paid, { utm_source: "newsletter" }, lastTime);
  assert.deepEqual(paidProperties(organic).set, {});
  assert.equal(paidProperties(organic).setOnce.first_paid_at, firstTime);
});
test("organic visitors do not receive paid properties", () => {
  assert.equal(
    getPaidPersonProperties(
      mergeUtmAttribution(undefined, { utm_source: "newsletter" }, firstTime),
    ),
    undefined,
  );
});
test("forwards click IDs to Console and removes stale attribution there", () => {
  const attribution = mergeUtmAttribution(undefined, { gclid: "current" }, firstTime);
  assert.ok(attribution);
  const internal = new URL("https://www.prisma.io/docs");
  syncUtmAttribution(internal, attribution);
  assert.equal(internal.searchParams.has("gclid"), false);
  const consoleUrl = new URL("https://console.prisma.io/?msclkid=old&first_msclkid=old");
  syncUtmAttribution(consoleUrl, attribution, { includeFirstTouch: true });
  assert.equal(consoleUrl.searchParams.get("gclid"), "current");
  assert.equal(consoleUrl.searchParams.get("first_gclid"), "current");
  assert.equal(consoleUrl.searchParams.has("msclkid"), false);
  assert.equal(consoleUrl.searchParams.has("first_msclkid"), false);
});
