import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { expectedVersions, lintFile, type Manifest } from "./lint-versions";

const manifests = new Map<string, Manifest>([
  ["prisma", { version: "8.0.0-rc.15", dependencies: { "@prisma/cli-engine": "0.4.0" } }],
  ["@prisma/orm-postgres", { version: "8.0.0-rc.11" }],
  ["@prisma/orm-mongo", { version: "8.0.0-rc.11" }],
  ["@prisma/prisma7", { version: "7.10.0" }],
]);
const expected = expectedVersions(manifests);

function lint(markdown: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lint-versions-"));
  const file = path.join(dir, "page.mdx");
  fs.writeFileSync(file, markdown);
  try {
    return lintFile(file, expected).map(({ line, found, expected }) => ({ line, found, expected }));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
}

test("@prisma/cli-engine is expected at the version prisma@latest depends on", () => {
  assert.equal(expected.get("@prisma/cli-engine"), "0.4.0");
  assert.equal(expected.get("prisma"), "8.0.0-rc.15");
  assert.throws(
    () => expectedVersions(new Map([["prisma", { version: "8.0.0-rc.15" }]])),
    /does not declare @prisma\/cli-engine/,
  );
});

test("a pin that is not the expected version is a violation", () => {
  assert.deepEqual(
    lint(
      [
        "npm install -D prisma@latest @prisma/cli-engine@0.3.0",
        "This guide targets `@prisma/orm-postgres@8.0.0-rc.10`.",
        "Expected result: `8.0.0-rc.14` (or newer).",
        "npm install -D @prisma/prisma7@7.10.0-dev.58",
      ].join("\n"),
    ),
    [
      { line: 1, found: "@prisma/cli-engine@0.3.0", expected: "0.4.0" },
      { line: 2, found: "@prisma/orm-postgres@8.0.0-rc.10", expected: "8.0.0-rc.11" },
      { line: 3, found: "8.0.0-rc.14", expected: "8.0.0-rc.15 or 8.0.0-rc.11" },
      { line: 4, found: "@prisma/prisma7@7.10.0-dev.58", expected: "7.10.0" },
    ],
  );
});

test("current pins, untracked packages, and older major lines pass", () => {
  assert.deepEqual(
    lint(
      [
        "✔ pnpm add -D @prisma/cli-engine@0.4.0",
        "`@prisma/orm-mongo@8.0.0-rc.11` and `prisma@8.0.0-rc.15`",
        "npm install prisma@6.19.3 @prisma/client@6.19.3",
        "npm install some-other-package@1.2.3",
      ].join("\n"),
    ),
    [],
  );
});

test("a version named as history may be older", () => {
  assert.deepEqual(
    lint(
      [
        "A contract emitted before `8.0.0-rc.10` has no `Models` export.",
        "Since `@prisma/orm-postgres@8.0.0-rc.9`, contract emit reports it.",
        "If it prints a version below `8.0.0-rc.9`, update it.",
        "| Variable | Since |",
        "| :--- | :--- |",
        "| `PRISMA_DEBUG` | 8.0.0-rc.1 |",
        "",
        "| Flag | Version |",
        "| --- | --- |",
        "| `--yes` | 8.0.0-rc.1 |",
      ].join("\n"),
    ),
    [{ line: 10, found: "8.0.0-rc.1", expected: "8.0.0-rc.15 or 8.0.0-rc.11" }],
  );
});
