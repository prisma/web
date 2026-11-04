import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
// @ts-expect-error Next does not publish types for its route-pattern compiler.
import pathToRegexpModule from "next/dist/compiled/path-to-regexp/index.js";
import nextConfig from "../../next.config.mjs";

const { pathToRegexp } = pathToRegexpModule as {
  pathToRegexp: (source: string) => RegExp;
};

/**
 * Screenshots hosted at https://www.prisma.io/listings/<name>.png for software
 * directories (Toolradar, G2, and similar). They must stay static public files:
 * no page route, redirect, rewrite, or robots rule may claim `/listings/*`.
 */
const LISTING_SCREENSHOTS = [
  "homepage.png",
  "orm.png",
  "postgres.png",
  "compute.png",
  "console-usage.png",
  "console-workspace.png",
] as const;

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const siteRoot = fileURLToPath(new URL("../..", import.meta.url));
const listingsDir = join(siteRoot, "public/listings");
const listingPaths = LISTING_SCREENSHOTS.map((name) => `/listings/${name}`);

function matchesSource(source: string, pathname: string) {
  return pathToRegexp(source).test(pathname);
}

function appliesOnWww(rule: { has?: { type: string }[] }) {
  return !(rule.has ?? []).some((condition) => condition.type === "host");
}

test("the six listing screenshots are unchanged PNGs in public/listings", () => {
  const names = readdirSync(listingsDir).sort();
  assert.deepEqual(names, [...LISTING_SCREENSHOTS].sort());

  for (const name of LISTING_SCREENSHOTS) {
    const bytes = readFileSync(join(listingsDir, name));
    assert.ok(bytes.subarray(0, 8).equals(PNG_SIGNATURE), `${name} must stay a PNG`);
    assert.ok(bytes.byteLength > 1_000_000, `${name} should be the original screenshot`);
  }
});

test("no App Router page lives at /listings", () => {
  const listingsApp = join(siteRoot, "src/app/listings");
  assert.equal(existsSync(listingsApp), false);
});

test("site redirects and rewrites leave /listings/*.png alone on www", async () => {
  const redirects = (await nextConfig.redirects?.()) ?? [];
  const rewrites = await nextConfig.rewrites?.();
  const rewriteRules = rewrites
    ? Array.isArray(rewrites)
      ? rewrites
      : [
          ...(rewrites.beforeFiles ?? []),
          ...(rewrites.afterFiles ?? []),
          ...(rewrites.fallback ?? []),
        ]
    : [];

  for (const pathname of listingPaths) {
    for (const rule of redirects) {
      if (!appliesOnWww(rule)) continue;
      assert.equal(
        matchesSource(rule.source, pathname),
        false,
        `redirect ${rule.source} -> ${rule.destination} would claim ${pathname}`,
      );
    }

    for (const rule of rewriteRules) {
      if (!appliesOnWww(rule)) continue;
      assert.equal(
        matchesSource(rule.source, pathname),
        false,
        `rewrite ${rule.source} -> ${rule.destination} would claim ${pathname}`,
      );
    }
  }
});

test("apps/site/vercel.json does not redirect /listings/*.png", () => {
  const vercel = JSON.parse(readFileSync(join(siteRoot, "vercel.json"), "utf8")) as {
    redirects?: { source: string; destination: string }[];
  };

  for (const pathname of listingPaths) {
    for (const rule of vercel.redirects ?? []) {
      assert.equal(
        matchesSource(rule.source, pathname),
        false,
        `vercel redirect ${rule.source} -> ${rule.destination} would claim ${pathname}`,
      );
    }
  }
});
