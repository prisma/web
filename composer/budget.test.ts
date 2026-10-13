import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, truncate, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { artifactLimit, artifactSize, checkBudget, checkUploadBudget } from "./budget.ts";
import { randomBytes } from "node:crypto";

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
