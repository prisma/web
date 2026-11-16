import assert from "node:assert/strict";
import { test } from "node:test";
import { postModifiedDate } from "./post-dates";

test("post dates come from editorial frontmatter, never a synthetic deployment commit", () => {
  const data = { date: "2019-01-02", lastModified: new Date("2026-11-03") };
  assert.equal(postModifiedDate(data), "2019-01-02T00:00:00.000Z");
  assert.equal(postModifiedDate({ ...data, updatedAt: "2026-10-27" }), "2026-10-27T00:00:00.000Z");
  assert.equal(postModifiedDate({ date: new Date("2026-01-02") }), "2026-01-02T00:00:00.000Z");
  assert.equal(postModifiedDate({ date: "invalid" }), undefined);
});
