import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { publicAssetInventory } from "./public-assets.ts";

test("public file inventory follows mounts, URL encodes segments and excludes directories", async () => {
  const root = await mkdtemp(join(tmpdir(), "web-public-assets-"));
  try {
    for (const name of ["site", "blog"]) {
      const dir = join(root, "apps", name, "public", "a space");
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, "image.png"), "image");
    }
    const inventory = await publicAssetInventory(root, ["site", "blog"]);
    assert.deepEqual(Object.keys(inventory), ["/a%20space/image.png", "/blog/a%20space/image.png"]);
    assert.equal(inventory["/blog/a%20space/image.png"].bytes, 5);
    assert.equal(
      inventory["/blog/a%20space/image.png"].sha256,
      "6105d6cc76af400325e94d588ce511be5bfdbb73b437dc51eca43917d7a43e3d",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
