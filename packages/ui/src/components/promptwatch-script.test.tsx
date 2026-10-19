import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PROMPTWATCH_PROJECT_ID, PROMPTWATCH_SCRIPT_SRC } from "../lib/promptwatch";
import { PromptwatchScript } from "./promptwatch-script";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../../..");

const appLayouts = [
  "apps/site/src/app/layout.tsx",
  "apps/blog/src/app/layout.tsx",
  "apps/docs/src/app/layout.tsx",
];

test("the snippet is a native script with Prisma's project id and errors off", () => {
  const html = renderToStaticMarkup(<PromptwatchScript />);

  assert.match(html, /<script\b/);
  assert.ok(html.includes(`src="${PROMPTWATCH_SCRIPT_SRC}"`));
  assert.ok(html.includes(`data-project-id="${PROMPTWATCH_PROJECT_ID}"`));
  assert.ok(html.includes('data-track-errors="false"'));
  assert.ok(!html.includes('type="text/plain"'));
  assert.ok(!html.toLowerCase().includes("cookieyes"));
});

test("site, blog, and docs mount the shared snippet instead of an inline gated tag", () => {
  for (const relative of appLayouts) {
    const source = readFileSync(join(repoRoot, relative), "utf8");
    assert.match(
      source,
      /import \{ PromptwatchScript \} from "@prisma-docs\/ui\/components\/promptwatch-script"/,
      `${relative} should import PromptwatchScript`,
    );
    assert.equal(
      source.split("<PromptwatchScript />").length - 1,
      1,
      `${relative} should render PromptwatchScript once`,
    );
    assert.doesNotMatch(
      source,
      /ingest\.promptwatch\.com/,
      `${relative} should use the shared component, not an inline Promptwatch tag`,
    );
  }
});
