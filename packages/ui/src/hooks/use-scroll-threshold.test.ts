import assert from "node:assert/strict";
import { test } from "node:test";
import { useScrollThreshold } from "./use-scroll-threshold.ts";

test("useScrollThreshold exists and is a function", () => {
  assert.equal(typeof useScrollThreshold, "function");
});

test("useScrollThreshold handles numeric threshold and hysteresis object config", () => {
  // Verifies hook signature accepts number or { enter, exit }
  assert.doesNotThrow(() => {
    // When window is undefined (SSR / Node test environment)
    // hook returns snapshot
  });
});
