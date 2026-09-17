import assert from "node:assert/strict";

export function assertSearchScope(
  results: { url: string }[],
  source: "website" | "docs" | "blog" | "all",
) {
  assert.ok(results.length, `${source}: no results`);
  for (const result of results) {
    const path = new URL(result.url, "https://www.prisma.io").pathname;
    assert.ok(!/\/eclipse(?:\/|$)/.test(path), `Eclipse result returned: ${path}`);
    const actual = /^\/docs(?:\/|$)/.test(path)
      ? "docs"
      : /^\/blog(?:\/|$)/.test(path)
        ? "blog"
        : "website";
    if (source !== "all") assert.equal(actual, source, `${source}: unexpected result ${path}`);
  }
}
