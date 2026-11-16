import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

/**
 * global.css lifts dark-mode code comments from github-dark's #6a737d to
 * #8b949e by naming the generated Shiki token classes that carry it. Those
 * class names are hashes of the colour pair, so regenerating
 * packages/ui/src/styles/shiki-tokens.css could change them and silently drop
 * the AA fix. This keeps the two lists in step.
 */
const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

test("dark comment override covers every #6a737d dark token class", () => {
  const tokens = read("../../../../packages/ui/src/styles/shiki-tokens.css");
  const generated = [...tokens.matchAll(/^\.(skc\w+)\{--shiki-dark:#6a737d;/gim)]
    .map((match) => match[1])
    .sort();

  const css = read("../app/global.css");
  const block = css.match(/\.dark\s*:is\(([^)]*)\)\s*\{\s*--shiki-dark:\s*#8b949e;/);
  assert.ok(block, "global.css has the dark comment override");
  const overridden = [...block[1].matchAll(/\.(skc\w+)/g)].map((match) => match[1]).sort();

  assert.ok(generated.length > 0, "shiki-tokens.css still has #6a737d dark tokens");
  assert.deepEqual(overridden, generated);
});
