import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import test from "node:test";

/**
 * Every /docs/rest-api/endpoints/** page renders fumadocs-openapi's security
 * scheme picker: a `role="combobox"` trigger that the library gave no
 * accessible name and exposes no option for. `patches/fumadocs-openapi@11.4.1.patch`
 * passes `aria-label` at its three `SelectTabTrigger` call sites.
 *
 * pnpm fails the install outright if the patch stops applying, so what these
 * tests guard is the quieter failure: a version bump that re-generates the
 * patch, moves a call site, or stops forwarding the prop, leaving the pages
 * unlabelled again with everything still green.
 */
const require = createRequire(import.meta.url);

function read(packageName: string, file: string) {
  const packageJson = require.resolve(`${packageName}/package.json`);
  return readFileSync(join(dirname(packageJson), file), "utf8");
}

test("the fumadocs-openapi patch labels every select trigger it renders", () => {
  const source = read("fumadocs-openapi", "dist/ui/operation/index.js");

  for (const label of [
    "Authorization scheme",
    "Request body content type",
    "Response content type",
  ]) {
    assert.ok(
      source.includes(`"aria-label": "${label}"`),
      `the installed fumadocs-openapi does not pass aria-label "${label}" — is patches/fumadocs-openapi@11.4.1.patch still applied?`,
    );
  }

  const triggers = source.match(/jsx\(SelectTabTrigger,/g) ?? [];
  assert.equal(
    triggers.length,
    3,
    "fumadocs-openapi gained or lost a SelectTabTrigger call site; the patch needs revisiting",
  );
});

test("SelectTabTrigger still forwards its props onto the combobox trigger", () => {
  // `@fumadocs/api-docs` is what actually renders the trigger; the patch only
  // works because SelectTabTrigger spreads its extra props onto SelectTrigger.
  const requireFromOpenApi = createRequire(require.resolve("fumadocs-openapi/package.json"));
  const source = readFileSync(
    requireFromOpenApi.resolve("@fumadocs/api-docs/components/select-tab"),
    "utf8",
  );

  assert.match(
    source,
    /jsx\(SelectTrigger, \{[\s\S]{0,200}?\.\.\.props/,
    "SelectTabTrigger no longer spreads its props onto SelectTrigger",
  );
});
