import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, truncate, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  artifactLimit,
  artifactSize,
  checkBudget,
  checkUploadBudget,
  uploadLimit,
} from "./budget.ts";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";

test("the active Node and Bun Alchemy providers support our larger upload budget", () => {
  const source = `
    import { createRequire } from 'node:module';
    const require = createRequire(import.meta.resolve('@prisma/composer-prisma-cloud'));
    const { MAX_DEPLOYMENT_ARTIFACT_BYTES } = await import(require.resolve('alchemy/Prisma/Deployment'));
    console.log(MAX_DEPLOYMENT_ARTIFACT_BYTES);
  `;
  for (const runtime of ["node", "bun"]) {
    const child = spawnSync(
      runtime,
      [...(runtime === "node" ? ["--input-type=module"] : []), "--eval", source],
      { encoding: "utf8" },
    );
    assert.equal(child.status, 0, child.stderr);
    const cap = Number(child.stdout.trim());
    assert.equal(cap, 768 * 1024 * 1024, runtime);
    assert.ok(uploadLimit > 256 * 1024 * 1024 && uploadLimit < cap);
  }
});

test("artifact budget includes public assets and does not follow pnpm link cycles", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "composer-budget-"));
  try {
    await mkdir(path.join(dir, "public"));
    await writeFile(path.join(dir, "public", "media"), "1234567890");
    await symlink(dir, path.join(dir, "recursive"));
    assert.ok((await artifactSize(dir)) >= 10);
    await truncate(path.join(dir, "public", "media"), artifactLimit + 1);
    await assert.rejects(checkBudget(dir, "blog"), /exceeds.*artifact budget/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("upload budget counts incompressible media separately from expanded files", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "composer-upload-"));
  try {
    await writeFile(path.join(dir, "media.bin"), randomBytes(64 * 1024));
    await assert.rejects(checkUploadBudget(dir, "media", 32 * 1024), /compressed upload budget/);
    assert.ok((await checkUploadBudget(dir, "media", 128 * 1024)) > 64 * 1024);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
