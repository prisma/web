import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Next does not publish types for its route-pattern compiler.
import pathToRegexpModule from "next/dist/compiled/path-to-regexp/index.js";
import nextConfig from "../../next.config.mjs";
import robots from "./robots";

const { pathToRegexp } = pathToRegexpModule as {
  pathToRegexp: (source: string) => RegExp;
};
const policy = robots().rules;
assert.ok(!Array.isArray(policy));
const disallow = [policy.disallow ?? []].flat();

function isDisallowed(path: string): boolean {
  return disallow.some((pattern) => {
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*");
    return new RegExp(`^${escaped}`).test(path);
  });
}

test("social card images are crawlable under the shared bot policy", () => {
  assert.equal(policy.userAgent, "*");
  for (const image of ["/blog/og/image.png", "/blog/og/composer/image.png"]) {
    assert.equal(isDisallowed(image), false, image);
  }
  assert.equal(isDisallowed("/blog/api/search"), true, "API crawling remains blocked");
});

test("only generated OG responses are excluded from search indexes", async () => {
  const config = await nextConfig("phase-production-server");
  const rules = await config.headers?.();
  assert.ok(rules);
  const noindexRules = rules.filter((rule) =>
    rule.headers.some(
      (header) => header.key.toLowerCase() === "x-robots-tag" && header.value === "noindex",
    ),
  );
  const isNoindex = (path: string) =>
    noindexRules.some((rule) => pathToRegexp(`${config.basePath ?? ""}${rule.source}`).test(path));
  assert.equal(isNoindex("/blog/og/image.png"), true);
  assert.equal(isNoindex("/blog/og/nested/image.png"), true);
  assert.equal(isNoindex("/blog"), false, "the page stays indexable");
  assert.equal(isNoindex("/blog/og.png"), false, "other public images stay indexable");
});
