import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { buildMcpServerCard, buildMcpServerCards } from "./agent-skills";

const siteRoot = new URL("../..", import.meta.url).pathname;

// The icons point at Next.js metadata files in src/app (app/icon.svg is served
// at /icon.svg, app/apple-icon.png at /apple-icon.png). If either file is
// renamed, moved, or resized, the card would advertise a broken or mislabelled
// icon, so pin the card to what is actually on disk.
test("server card icons and website URL resolve against the given base URL", () => {
  const card = buildMcpServerCard("https://preview.example.com");
  assert.equal(card.websiteUrl, "https://preview.example.com");
  assert.deepEqual(
    card.icons.map((icon) => icon.src),
    ["https://preview.example.com/icon.svg", "https://preview.example.com/apple-icon.png"],
  );
});

test("server card has a display title distinct from its technical name", () => {
  const card = buildMcpServerCard("https://example.com");
  assert.equal(card.title, "Prisma");
  assert.equal(card.name, "Prisma MCP");
});

test("every server card icon is an existing app metadata file", () => {
  const card = buildMcpServerCard("https://example.com");
  assert.ok(card.icons.length > 0, "the card should advertise at least one icon");
  for (const icon of card.icons) {
    const pathname = new URL(icon.src).pathname;
    assert.ok(
      existsSync(join(siteRoot, "src/app", pathname)),
      `${icon.src} does not map to a file in src/app`,
    );
  }
});

test("server card icons carry a valid MIME type and sizes", () => {
  // Shape from the MCP server.json schema: mimeType is one of a fixed set and
  // each size is "WxH" or "any".
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
  for (const icon of buildMcpServerCard("https://example.com").icons) {
    assert.ok(
      allowedMimeTypes.includes(icon.mimeType),
      `${icon.mimeType} is not an allowed icon MIME type`,
    );
    assert.ok(icon.sizes.length > 0, `${icon.src} should declare at least one size`);
    for (const size of icon.sizes) {
      assert.match(size, /^(\d+x\d+|any)$/, `${icon.src} has an invalid size ${size}`);
    }
  }
});

test("the PNG icon's declared size matches the file", () => {
  const card = buildMcpServerCard("https://example.com");
  const png = card.icons.find((icon) => icon.mimeType === "image/png");
  assert.ok(png, "expected a PNG icon for clients that do not render SVG");
  const bytes = readFileSync(join(siteRoot, "src/app", new URL(png.src).pathname));
  // PNG: 8-byte signature, then the IHDR chunk whose data starts at byte 16
  // with width and height as big-endian uint32s.
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  assert.deepEqual(png.sizes, [`${width}x${height}`]);
});

test("the server cards collection carries the same icons", () => {
  const [card] = buildMcpServerCards();
  assert.deepEqual(card.icons, buildMcpServerCard().icons);
});
