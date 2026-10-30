import assert from "node:assert/strict";
import test from "node:test";
import { splitMicroline } from "./microline";

test("splitMicroline links a prefix and keeps the rest after it", () => {
  assert.deepEqual(splitMicroline("Free tier with a hard cap. No credit card.", "Free tier with a hard cap"), {
    before: "",
    link: "Free tier with a hard cap",
    after: ". No credit card.",
  });
});

test("splitMicroline keeps text before a mid-line anchor", () => {
  assert.deepEqual(splitMicroline("No credit card. Free tier with a hard cap", "Free tier with a hard cap"), {
    before: "No credit card. ",
    link: "Free tier with a hard cap",
    after: "",
  });
});

test("splitMicroline links the whole line when the anchor is missing", () => {
  assert.deepEqual(splitMicroline("Free tier with a hard cap. No credit card.", "Starter plan"), {
    before: "",
    link: "Free tier with a hard cap. No credit card.",
    after: "",
  });
});
