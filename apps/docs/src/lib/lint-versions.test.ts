import assert from "node:assert/strict";
import test from "node:test";
import { fetchVersions, lintVersions, rewriteVersions } from "../../scripts/version-utils";

const latest = new Map([
  ["prisma", "8.0.0-rc.25"],
  ["@prisma/orm-postgres", "8.0.0-rc.19"],
  ["@prisma/orm-mongo", "8.0.0-rc.19"],
  ["@prisma/prisma7", "7.8.0"],
  ["@prisma/cli-engine", "8.0.0-rc.18"],
]);

function fix(content: string, file = "orm/quickstart.mdx") {
  return rewriteVersions(file, content, latest);
}

test("rewrites stale package pins and bare mentions to current versions", () => {
  const content = "Install `prisma@8.0.0-rc.24` and expect `8.0.0-rc.24`.\n";
  const fixed = "Install `prisma@8.0.0-rc.25` and expect `8.0.0-rc.25`.\n";
  assert.equal(fix(content), fixed);
  assert.deepEqual(lintVersions(fixed, latest), []);
  assert.equal(fix(fixed), fixed);
});

test("keeps historical mentions while rewriting the same version later on the line", () => {
  assert.equal(
    fix("Available since `8.0.0-rc.10`; install `prisma@8.0.0-rc.10`."),
    "Available since `8.0.0-rc.10`; install `prisma@8.0.0-rc.25`.",
  );
  assert.equal(fix("This worked as of `8.0.0-rc.10`."), "This worked as of `8.0.0-rc.10`.");
});

test("keeps Added in cells while rewriting other cells", () => {
  const content = [
    "| Added in | Current |",
    "| --- | --- |",
    "| `8.0.0-rc.10` | `prisma@8.0.0-rc.10` |",
  ].join("\n");
  assert.equal(fix(content), content.replace("prisma@8.0.0-rc.10", "prisma@8.0.0-rc.25"));
});

test("keeps older major pins and untracked packages", () => {
  const content = "prisma@6.19.0 prisma@7.8.0 other@8.0.0-rc.10";
  assert.equal(fix(content), content);
  assert.deepEqual(lintVersions(content, latest), []);
});

test("keeps every versioned docs tree", () => {
  const content = "Install prisma@8.0.0-rc.10; expect 8.0.0-rc.10.";
  for (const tree of ["(index)/v7", "cli/v7", "guides/v7", "orm/v6", "orm/v7"]) {
    assert.equal(fix(content, `${tree}/quickstart.mdx`), content);
  }
  assert.notEqual(fix(content, "orm/v7-example/quickstart.mdx"), content);
});

test("preserves current references, accepted library versions and line endings", () => {
  const content = "prisma@8.0.0-rc.25 and 8.0.0-rc.19\r\nprisma@8.0.0-rc.24\r\n";
  assert.equal(fix(content), content.replace("prisma@8.0.0-rc.24", "prisma@8.0.0-rc.25"));
});

test("leaves an unmatched bare version visible to the subsequent check", () => {
  const content = "Expected `9.0.0-rc.1`.";
  assert.equal(fix(content), content);
  assert.equal(lintVersions(fix(content), latest).length, 1);
});

test("reads only tracked npm manifests and uses prisma's exact cli-engine dependency", async (t) => {
  const manifests: Record<string, { version: string; dependencies?: Record<string, string> }> = {
    prisma: { version: "8.0.0-rc.25", dependencies: { "@prisma/cli-engine": "8.0.0-rc.18" } },
    "@prisma/orm-postgres": { version: "8.0.0-rc.19" },
    "@prisma/orm-mongo": { version: "8.0.0-rc.19" },
    "@prisma/prisma7": { version: "7.8.0" },
  };
  const requests: string[] = [];
  t.mock.method(globalThis, "fetch", async (url: string) => {
    requests.push(url);
    const pkg = url.replace("https://registry.npmjs.org/", "").replace(/\/latest$/, "");
    assert.ok(manifests[pkg], `Unexpected registry request: ${url}`);
    return Response.json(manifests[pkg]);
  });
  const versions = await fetchVersions();
  assert.deepEqual(versions, latest);
  assert.equal(requests.length, 4);
  assert.equal(
    rewriteVersions("cli/commands.mdx", "@prisma/cli-engine@8.0.0-rc.17", versions),
    "@prisma/cli-engine@8.0.0-rc.18",
  );
});

test("fails when npm cannot provide a manifest", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 503 }));
  await assert.rejects(fetchVersions(), /npm registry returned 503/);
});

test("rejects a non-exact cli-engine dependency", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      version: "8.0.0-rc.25",
      dependencies: { "@prisma/cli-engine": "^8.0.0-rc.18" },
    }),
  );
  await assert.rejects(fetchVersions(), /does not depend on an exact version/);
});
