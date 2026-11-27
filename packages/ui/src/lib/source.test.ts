import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  SOURCE_VALUES,
  type Source,
  type SourceSignals,
  type SourceTouches,
  classifySource,
  mergeSourceTouches,
  parseForwardedSource,
  sourceFromParams,
} from "./source";

interface Fixture {
  version: number;
  classify: { name: string; input: SourceSignals; expected: Source }[];
  params: {
    name: string;
    query: string;
    referrer?: string;
    expected: { first: Source; last: Source };
  }[];
  merge: {
    name: string;
    existing: SourceTouches | null;
    touch: { first: Source; last: Source };
    expected: SourceTouches | null;
  }[];
}

// The Console runs the same file against its copy of the classifier.
const fixture = JSON.parse(
  readFileSync(new URL("./source.fixture.json", import.meta.url), "utf8"),
) as Fixture;

test("the fixture is v1 and only expects values from the list", () => {
  assert.equal(fixture.version, 1);
  for (const { expected } of fixture.classify) {
    assert.ok(SOURCE_VALUES.includes(expected), expected);
  }
});

for (const { name, input, expected } of fixture.classify) {
  test(`classifySource: ${name}`, () => {
    assert.equal(classifySource(input), expected);
  });
}

for (const { name, query, referrer, expected } of fixture.params) {
  test(`sourceFromParams: ${name}`, () => {
    assert.deepEqual(sourceFromParams(new URLSearchParams(query), referrer), expected);
  });
}

for (const { name, existing, touch, expected } of fixture.merge) {
  test(`mergeSourceTouches: ${name}`, () => {
    assert.deepEqual(mergeSourceTouches(existing ?? undefined, touch), expected ?? undefined);
  });
}

test("never returns unknown, and every result is a value from the list", () => {
  for (const { input } of fixture.classify) {
    const result = classifySource(input);
    assert.notEqual(result, "unknown");
    assert.ok(SOURCE_VALUES.includes(result));
  }
});

test("a referrer with a path or query comes back as the value only", () => {
  const result = classifySource({ referrer: "https://claude.ai/chat/1234?private=1" });
  assert.equal(result, "claude");
  assert.doesNotMatch(result, /chat|private|\//);
});

test("an upstream direct or unknown is never accepted as a forwarded source", () => {
  assert.equal(parseForwardedSource("direct"), undefined);
  assert.equal(parseForwardedSource("unknown"), undefined);
  assert.equal(parseForwardedSource("ChatGPT"), "chatgpt");
  assert.equal(parseForwardedSource("chatgpt.com"), undefined);
});
