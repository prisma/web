import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const SNIPPET_SRC = "https://analytics.ahrefs.com/analytics.js";
const SNIPPET_KEY = "aF9oT6bnZ5BtW0m9HClnWQ";

function read(relative: string) {
  return readFileSync(join(siteRoot, relative), "utf8");
}

test("the Postgres layout carries the Postgres Ahrefs snippet once", () => {
  const layout = read("src/app/postgres/layout.tsx");

  assert.equal(layout.split(SNIPPET_SRC).length - 1, 1);
  assert.ok(layout.includes(`src="${SNIPPET_SRC}"`));
  assert.ok(layout.includes(`data-key="${SNIPPET_KEY}"`));
  assert.match(layout, /\basync\b/);
});

test("the Postgres Ahrefs snippet is not on the shared layout or other products", () => {
  for (const relative of [
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/orm/page.tsx",
    "src/app/compute/page.tsx",
    "src/app/lp/postgres/page.tsx",
  ]) {
    assert.doesNotMatch(read(relative), /analytics\.ahrefs\.com/, relative);
  }
});

test("the site CSP allows the Ahrefs analytics host to load and report", () => {
  const config = read("next.config.mjs");
  const policy = config.match(/const ContentSecurityPolicy = `([\s\S]*?)`;/)?.[1];
  assert.ok(policy, "site ContentSecurityPolicy missing");

  const scriptSrc = policy.match(/script-src[\s\S]*?;/)?.[0] ?? "";
  const connectSrc = policy.match(/connect-src[\s\S]*?;/)?.[0] ?? "";

  assert.match(scriptSrc, /https:\/\/analytics\.ahrefs\.com/);
  assert.match(connectSrc, /https:\/\/analytics\.ahrefs\.com/);
});
