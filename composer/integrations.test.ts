import { test } from "node:test";
import assert from "node:assert/strict";
import { secretName } from "@prisma/composer-prisma-cloud";
import { integrationCredentials } from "./integrations.ts";

test("a pages-only preview binds no external credentials", () => {
  for (const site of ["site", "docs", "blog", "handbook", "eclipse"] as const) {
    assert.deepEqual(integrationCredentials(site, ""), {});
  }
});

test("enabled integrations require only each website's own platform secrets", () => {
  const enabled = "mixedbread, brevo,extensions,linear,mixedbread,";
  const names = (site: Parameters<typeof integrationCredentials>[0]) =>
    Object.values(integrationCredentials(site, enabled)).map((source) =>
      secretName(source, "integration test"),
    );
  assert.deepEqual(names("site"), [
    "MIXEDBREAD_API_KEY",
    "BREVO_API_KEY",
    "GITHUB_EXTENSIONS_TOKEN",
  ]);
  assert.deepEqual(names("docs"), [
    "MIXEDBREAD_API_KEY",
    "BREVO_API_KEY",
    "GITHUB_WEBHOOK_SECRET",
    "BOT_TOKEN_GITHUB_PR_LINEAR_WEBHOOK",
    "LINEAR_API_KEY",
  ]);
  assert.deepEqual(names("blog"), ["MIXEDBREAD_API_KEY", "BREVO_API_KEY"]);
  assert.deepEqual(names("handbook"), []);
  assert.deepEqual(names("eclipse"), []);
  assert.deepEqual(integrationCredentials("site", "linear"), {});
});

test("a misspelled integration fails configuration instead of being skipped", () => {
  assert.throws(
    () => integrationCredentials("site", "mixedbread,brevvo"),
    /Unknown COMPOSER_INTEGRATIONS entry "brevvo"/,
  );
});
