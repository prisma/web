import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";

// Use the encoder already pinned by Next in this workspace. Outputs are checked
// in, so normal builds and runtimes do not need a separate image build step.
const require = createRequire(import.meta.resolve("next/package.json"));
const sharp = require("sharp");
const root = new URL("../../../", import.meta.url);
const output = new URL("../src/assets/brand/", import.meta.url);
await mkdir(output, { recursive: true });
const profiles = [
  ["texture.jpg", "texture.avif", 1000, "avif", 25],
  ["texture.jpg", "texture.jpg", 1000, "jpeg", 35],
  ...["cpu-3d", "cards-3d", "database-3d", "robot"].map((name) => [
    `${name}.png`,
    `${name}.webp`,
    640,
    "webp",
    85,
  ]),
  ...["feature-compute", "feature-postgres", "feature-orm", "agent-loop"].map((name) => [
    `${name}.jpg`,
    `${name}.webp`,
    1200,
    "webp",
    75,
  ]),
];
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const assets = [];
for (const [source, name, width, format, quality] of profiles) {
  const input = await readFile(new URL(`apps/site/public/brand/${source}`, root));
  const encoded = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    [format]({ quality, effort: format === "avif" ? 4 : 6 })
    .toBuffer();
  await writeFile(new URL(name, output), encoded);
  assets.push({
    source,
    name,
    width,
    format,
    quality,
    sourceSha256: digest(input),
    sha256: digest(encoded),
    bytes: encoded.length,
  });
  console.log(`${name}: ${input.length} -> ${encoded.length} bytes`);
}
await writeFile(
  new URL("manifest.json", output),
  JSON.stringify({ sharp: sharp.versions.sharp, assets }, null, 2) + "\n",
);
