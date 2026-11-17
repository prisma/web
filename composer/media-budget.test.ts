import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
test("baked brand assets match their originals and remain within transfer budgets", () => {
  const directory = new URL("packages/ui/src/assets/brand/", root);
  const { assets } = JSON.parse(readFileSync(new URL("manifest.json", directory), "utf8"));
  for (const asset of assets) {
    assert.equal(
      hash(readFileSync(new URL(`apps/site/public/brand/${asset.source}`, root))),
      asset.sourceSha256,
      `${asset.source}: regenerate the derivatives`,
    );
    const bytes = readFileSync(new URL(asset.name, directory));
    assert.equal(hash(bytes), asset.sha256, asset.name);
    assert.equal(bytes.length, asset.bytes, asset.name);
    assert.ok(
      bytes.length <=
        (asset.format === "jpeg" ? 150_000 : asset.format === "avif" ? 60_000 : 100_000),
      asset.name,
    );
  }
});

test("vendored font subsets match the coverage-validated generation and original fonts", () => {
  const fonts = new URL("packages/eclipse/src/static/fonts/", root);
  const entries = JSON.parse(readFileSync(new URL("subsets/manifest.json", fonts), "utf8"));
  assert.equal(entries.length, 10);
  for (const entry of entries) {
    assert.equal(
      hash(readFileSync(new URL(entry.source, fonts))),
      entry.sourceSha256,
      `${entry.source}: regenerate the subsets`,
    );
    const bytes = readFileSync(new URL(`subsets/${entry.file}`, fonts));
    assert.equal(hash(bytes), entry.sha256, entry.file);
    assert.ok(entry.points > 0);
    assert.ok(bytes.length < 180_000, entry.file);
  }
});

test("the URL-safe code font alias retains the original font binary", () => {
  const fonts = new URL("packages/eclipse/src/static/fonts/", root);
  assert.equal(
    hash(readFileSync(new URL("MonaSansMonoVF.woff2", fonts))),
    hash(readFileSync(new URL("MonaSansMonoVF[wght].woff2", fonts))),
  );
});
