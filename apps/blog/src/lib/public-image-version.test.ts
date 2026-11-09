import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { versionPublicImage } from "./public-image-version";
import { publicImageVersions } from "../../scripts/public-image-versions";

test("image inventory versions exact bytes, encodes paths, skips links and non-images", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "blog-media-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await mkdir(join(dir, "post"));
  await writeFile(join(dir, "post", "hero art.svg"), "<svg>original</svg>");
  await writeFile(join(dir, "post", "other.txt"), "not an image");
  await symlink(join(dir, "post", "hero art.svg"), join(dir, "link.svg"));
  const inventory = await publicImageVersions(dir);
  assert.deepEqual(Object.keys(inventory), ["/blog/post/hero%20art.svg"]);
  assert.equal(
    inventory["/blog/post/hero%20art.svg"],
    createHash("sha256").update("<svg>original</svg>").digest("hex"),
  );
  const src = versionPublicImage("/blog/post/hero%20art.svg?download=1#art", inventory);
  const url = new URL(src, "https://blog.test");
  assert.equal(url.searchParams.get("download"), "1");
  assert.equal(url.hash, "#art");
  assert.equal(url.searchParams.get("__asset"), inventory[url.pathname]);
  assert.equal(versionPublicImage(src, inventory), src, "versioning is idempotent");
  await writeFile(join(dir, "post", "hero art.svg"), "<svg>modified</svg>");
  const updated = await publicImageVersions(dir);
  assert.notEqual(updated[url.pathname], inventory[url.pathname]);
  assert.notEqual(versionPublicImage(src, updated), src, "edited image bytes get a new URL");
});

test("raw and encoded reserved filename characters share the inventory's version", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "blog-media-reserved-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const name = "cover@2x+wide,blue.svg";
  await writeFile(join(dir, name), "<svg>reserved filename</svg>");
  const inventory = await publicImageVersions(dir);
  const digest = inventory[`/blog/${encodeURIComponent(name)}`];
  assert.ok(digest);
  for (const path of [name, encodeURIComponent(name)]) {
    const src = `/blog/${path}?download=1#art`;
    const versioned = versionPublicImage(src, inventory);
    const url = new URL(versioned, "https://blog.test");
    assert.equal(url.searchParams.get("__asset"), digest);
    assert.equal(url.searchParams.get("download"), "1");
    assert.equal(url.hash, "#art");
    assert.equal(versionPublicImage(versioned, inventory), versioned);
  }
});

test("external, missing, traversal and non-image paths never get invented versions", () => {
  const inventory = { "/blog/known.svg": "digest" };
  for (const src of [
    "https://example.test/hero.svg",
    "//example.test/hero.svg",
    "data:image/svg+xml,example",
    "/_next/static/media/hero.svg",
    "/blog/missing.png",
    "/blog/link.png",
    "/blog/%2e%2e%2fprivate.png",
    "/blog/%zz.png",
    "/blog/api/search",
    "/blog/robots.txt",
  ])
    assert.equal(versionPublicImage(src, inventory), src, src);
});
