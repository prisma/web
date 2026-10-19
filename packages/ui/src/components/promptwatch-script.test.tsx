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
  assert.match(html, new RegExp(`src="${PROMPTWATCH_SCRIPT_SRC.replace(/\./g, "\\.")}"`));
  assert.match(html, new RegExp(`data-project-id="${PROMPTWATCH_PROJECT_ID}"`));
  assert.match(html, /data-track-errors="false"/);
  assert.doesNotMatch(html, /type="text\/plain"/);
  assert.doesNotMatch(html, /cookieyes/i);
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
