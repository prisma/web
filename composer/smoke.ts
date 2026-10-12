import assert from "node:assert/strict";
import { dev, type DevSession } from "@prisma/composer/control";
import config from "../prisma.config.ts";
import { setTimeout as delay } from "node:timers/promises";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

let session: DevSession | undefined;
let origin: string | undefined = process.argv[2];
if (!origin) {
  const result = await dev({
    entry: "module.ts",
    config: { value: config.composer!, file: "prisma.config.ts" },
  });
  if (!result.ok) throw new Error(`${result.failure.code}: ${result.failure.message}`);
  session = result.value;
  origin = session.endpoints.find((endpoint) => endpoint.address === "gateway")?.url;
  assert.ok(origin, "Composer must report the gateway endpoint");
}

// Composer reports process startup before every HTTP listener is ready.
// Retry transport errors during that window; application 500s still fail.
async function get(url: URL, init?: RequestInit): Promise<Response> {
  const deadline = Date.now() + 60_000;
  for (;;) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) });
      if (![502, 503].includes(response.status) || Date.now() >= deadline) return response;
      await response.body?.cancel();
    } catch (error) {
      if (Date.now() >= deadline) throw error;
    }
    await delay(200);
  }
}

try {
  for (const path of [
    "/",
    "/docs/composer",
    "/blog",
    "/blog/prisma-orm-8-nestjs",
    "/handbook",
    "/eclipse",
  ]) {
    const response: Response = await get(new URL(path, origin));
    assert.equal(response.status, 200, `${path}: expected a working page`);
    assert.equal(
      new URL(response.url).origin,
      new URL(origin).origin,
      `${path}: escaped the local stack`,
    );
    const html = await response.text();
    assert.match(html, /<html/);
    if (["/", "/docs/composer", "/blog"].includes(path)) {
      assert.ok(response.headers.get("content-security-policy"), `${path}: missing CSP`);
      assert.equal(response.headers.get("x-content-type-options"), "nosniff", path);
    }
    const asset = html.match(/(?:src|href)="([^"]*\/_next\/static\/[^"]+)"/);
    assert.ok(asset, `${path}: expected a Next.js asset`);
    const assetResponse: Response = await get(new URL(asset[1].replaceAll("&amp;", "&"), origin));
    assert.equal(assetResponse.status, 200, `${path}: static asset failed`);
    assert.ok((await assetResponse.arrayBuffer()).byteLength > 0);
    console.log(`PASS ${path} + static asset`);
  }
  const markdown = await get(new URL("/docs/composer.md", origin));
  assert.equal(markdown.status, 200);
  assert.match(markdown.headers.get("content-type") ?? "", /text\//);
  console.log("PASS docs Markdown");
  for (const [source, destination] of [
    ["/accelerate", "/docs/accelerate"],
    ["/docs/showcase", "/customers"],
    ["/docs/about/prisma", "/company"],
    ["/docs//showcase", "/docs/showcase"],
  ]) {
    const legacy = await get(new URL(`${source}?ref=a&ref=b&value=a%2Fb`, origin), {
      redirect: "manual",
    });
    assert.equal(legacy.status, 308, source);
    const location = new URL(legacy.headers.get("location")!, origin);
    assert.equal(location.pathname, destination, source);
    assert.equal(location.origin, new URL(origin).origin, source);
    assert.deepEqual(location.searchParams.getAll("ref"), ["a", "b"], source);
    assert.equal(location.searchParams.get("value"), "a/b", source);
  }
  console.log("PASS Vercel redirects, repeated query values, and URL normalization");

  const siteRedirect = await get(new URL("/docs/1.0/example?ref=a&ref=b", origin), {
    redirect: "manual",
  });
  assert.equal(siteRedirect.status, 308);
  const siteLocation = new URL(siteRedirect.headers.get("location")!, origin);
  assert.equal(siteLocation.origin, "https://v1.prisma.io");
  assert.equal(siteLocation.pathname, "/docs/1.0/example");
  assert.deepEqual(siteLocation.searchParams.getAll("ref"), ["a", "b"]);
  console.log("PASS site Next redirect before docs dispatch");

  const blogRedirect = await get(new URL("/blog?tag=orm&page=2&ref=a&ref=b", origin), {
    redirect: "manual",
  });
  assert.equal(blogRedirect.status, 308);
  const blogLocation = new URL(blogRedirect.headers.get("location")!, origin);
  assert.equal(blogLocation.pathname, "/blog/tag/orm/page/2");
  assert.deepEqual(blogLocation.searchParams.getAll("ref"), ["a", "b"]);
  console.log("PASS blog query-conditional Next redirect");

  for (const pathname of ["/orm", "/docs/composer", "/blog/prisma-orm-8-nestjs"]) {
    const response = await get(new URL(pathname, origin), { headers: { accept: "text/markdown" } });
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /text\/(markdown|plain)/, pathname);
    assert.ok((await response.text()).length > 0, pathname);
  }
  console.log("PASS site/docs/blog Markdown negotiation through Next middleware");

  // Include content from different docs trees, rather than only a landing page.
  for (const pathname of [
    "/docs/composer/getting-started",
    "/docs/composer/porting-an-app",
    "/docs/orm/v7/reference/prisma-schema-reference",
    "/docs/orm/v6/reference/prisma-client-reference",
  ]) {
    const response = await get(new URL(pathname, origin));
    assert.equal(response.status, 200, pathname);
    assert.equal(
      new URL(response.url).origin,
      new URL(origin).origin,
      `${pathname}: escaped the local stack`,
    );
    await response.arrayBuffer();
  }
  console.log("PASS current and legacy docs articles");

  if (session && (process.platform === "linux" || process.platform === "darwin")) {
    // SDK 0.29.1's isolated emulator records child PIDs here. These are the Bun
    // website processes, not the larger developer-side build/assembly process.
    const state = JSON.parse(
      readFileSync(
        path.join(process.env.PRISMA_COMPOSER_EMULATORS_DIR!, "compute/apps.json"),
        "utf8",
      ),
    );
    for (const [name, service] of Object.entries(state.prismaweb.services) as [
      string,
      { pid: number },
    ][]) {
      const rss =
        Number(
          execFileSync("ps", ["-o", "rss=", "-p", String(service.pid)], {
            encoding: "utf8",
          }).trim(),
        ) * 1024;
      console.log(`${name}: ${(rss / 1_000_000).toFixed(1)} MB RSS after smoke requests`);
      assert.ok(rss > 0 && rss < 900_000_000, `${name} exceeds the 900 MB runtime memory budget`);
    }
  }
} finally {
  await session?.stop();
}
