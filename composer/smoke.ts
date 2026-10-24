import assert from "node:assert/strict";
import { dev, type DevSession } from "@prisma/composer/control";
import config from "../prisma.config.ts";
import { setTimeout as delay } from "node:timers/promises";
import { existsSync, readFileSync, createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

let session: DevSession | undefined;
let origin: string | undefined = process.argv[2];
if (!origin) {
  const gateway = new URL("../dist/composer/gateway/", import.meta.url);
  assert.equal(existsSync(new URL("routing.json", gateway)), false, "no precompiled routing plan");
  for (const name of ["site", "docs"])
    assert.equal(
      readFileSync(new URL(`sites/${name}/vercel.json`, gateway), "utf8"),
      readFileSync(new URL(`../apps/${name}/vercel.json`, import.meta.url), "utf8"),
      `${name}: gateway must ship original Vercel config`,
    );
  for (const name of ["site"])
    assert.equal(
      readFileSync(new URL(`sites/${name}/routes-manifest.json`, gateway), "utf8"),
      readFileSync(new URL(`../apps/${name}/.next/routes-manifest.json`, import.meta.url), "utf8"),
      `${name}: gateway must ship original Next manifest`,
    );
  const result = await dev({
    entry: "module.ts",
    config: { value: config.composer!, file: "prisma.config.ts" },
  });
  if (!result.ok) throw new Error(`${result.failure.code}: ${result.failure.message}`);
  session = result.value;
  origin = session.endpoints.find((endpoint) => endpoint.address === "gateway")?.url;
  assert.ok(origin, "Composer must report the gateway endpoint");
}

// Deployment can finish before Compute routes a newly promoted service.
// Initial landing-page probes also wait for transient 404s, for at most two
// minutes. Other requests retain strict 404 checks; application 500s still fail.
async function get(url: URL, init?: RequestInit, startup = false): Promise<Response> {
  const deadline = Date.now() + (startup ? 120_000 : 60_000);
  for (;;) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: init?.signal ?? AbortSignal.timeout(10_000),
      });
      const pending = [502, 503].includes(response.status) || (startup && response.status === 404);
      if (!pending || Date.now() >= deadline) return response;
      await response.body?.cancel();
    } catch (error) {
      if (Date.now() >= deadline) throw error;
    }
    await delay(startup ? 1000 : 200);
  }
}

try {
  let documentVary: string | null = null;
  let docsImage: URL | undefined;
  for (const path of ["/", "/docs/composer", "/blog", "/handbook", "/eclipse"]) {
    const response: Response = await get(
      new URL(path, origin),
      { headers: { accept: "text/html" } },
      true,
    );
    assert.equal(response.status, 200, `${path}: expected a working page`);
    assert.equal(
      new URL(response.url).origin,
      new URL(origin).origin,
      `${path}: escaped the local stack`,
    );
    const html = await response.text();
    if (path === "/docs/composer") {
      documentVary = response.headers.get("vary");
      const image = html.match(/src="([^"]*\/docs\/_next\/image\?[^"]+)"/);
      assert.ok(image, "docs: expected the rendered background image");
      docsImage = new URL(image[1].replaceAll("&amp;", "&"), origin);
      assert.equal(docsImage.searchParams.get("url"), "/docs/img/brand/texture.jpg");
      docsImage.searchParams.set("w", "640");
    }
    assert.match(html, /<html/);
    if (["/", "/blog", "/docs/composer"].includes(path)) {
      assert.equal(
        response.headers.get("cdn-cache-control"),
        "public, max-age=60, stale-while-revalidate=300",
        path,
      );
      assert.equal(response.headers.get("cache-control"), "public, max-age=0", path);
    }
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
  // Compute's application directory is read-only: optimized images must use
  // the bounded memory handler, and a CDN must honor their Accept variants.
  const optimizedImage = new URL("/_next/image?url=%2Fbrand%2Ftexture.jpg&w=640&q=75", origin);
  for (const image of [optimizedImage, docsImage!])
    for (const format of ["webp", "jpeg"]) {
      let hit = false;
      let previous: string | undefined;
      for (let attempt = 0; attempt < 3; attempt++) {
        const response = await get(image, { headers: { accept: `image/${format}` } });
        assert.equal(response.status, 200);
        assert.equal(response.headers.get("content-type"), `image/${format}`);
        const digest = createHash("sha256")
          .update(Buffer.from(await response.arrayBuffer()))
          .digest("hex");
        if (previous) assert.equal(digest, previous, "image bytes changed between cache reads");
        previous = digest;
        hit ||=
          response.headers.get("x-nextjs-cache") === "HIT" ||
          response.headers.get("cf-cache-status") === "HIT";
      }
      assert.ok(hit, `${image.pathname}: optimized ${format} never became a cache hit`);
    }
  console.log("PASS optimized images: origin cache reuse and separate WebP/JPEG variants");
  // Exercise original public files served by Next, including the largest file.
  // Select representatives from the checkout, without a runtime media catalog.
  const publicDir = fileURLToPath(new URL("../apps/blog/public/", import.meta.url));
  const files = await Promise.all(
    (await readdir(publicDir, { recursive: true, withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const source = path.join(entry.parentPath, entry.name);
        return { source, path: path.relative(publicDir, source), bytes: (await stat(source)).size };
      }),
  );
  files.sort((a, b) => a.bytes - b.bytes || a.path.localeCompare(b.path));
  const media = new Set(
    [".svg", ".png", ".jpg", ".gif", ".webp", ".mp4"]
      .map((ext) => files.find((file) => file.bytes > 32 && path.extname(file.path) === ext))
      .filter((file) => file !== undefined),
  );
  assert.ok(files.length > 0, "expected original public blog files");
  media.add(files.at(-1)!);
  for (const file of media) {
    const url = new URL(
      `/blog/${file.path.split(path.sep).map(encodeURIComponent).join("/")}`,
      origin,
    );
    const headers = { "accept-encoding": "identity" };
    // Full public files can take longer than a page from a distant client.
    const response = await get(url, { headers, signal: AbortSignal.timeout(120_000) });
    assert.equal(response.status, 200, file.path);
    assert.equal(
      response.headers.get("content-length"),
      String(file.bytes),
      `${file.path}: streamed GET length`,
    );
    assert.match(
      response.headers.get("cdn-cache-control") ?? "",
      /^public, max-age=60, stale-while-revalidate=300(?:, no-transform)?$/,
      file.path,
    );
    const bytes = Buffer.from(await response.arrayBuffer());
    const hash = createHash("sha256");
    for await (const chunk of createReadStream(file.source)) hash.update(chunk);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), hash.digest("hex"), file.path);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff", file.path);
    assert.ok(response.headers.get("content-security-policy"), file.path);
    const partial = await get(url, { headers: { ...headers, range: "bytes=0-15" } });
    assert.equal(partial.status, 206, file.path);
    assert.deepEqual(Buffer.from(await partial.arrayBuffer()), bytes.subarray(0, 16), file.path);
    const head = await get(url, { method: "HEAD", headers });
    assert.equal(head.status, 200, file.path);
    assert.equal(head.headers.get("content-length"), String(file.bytes), file.path);
    const cached = await get(url, {
      // Node fetch otherwise adds a forced-reload no-cache header when an ETag
      // is supplied; Next correctly returns 200 for that request instead of 304.
      cache: "no-cache",
      headers: { ...headers, "if-none-match": response.headers.get("etag")! },
    });
    assert.equal(cached.status, 304, file.path);
    console.log(`PASS ${file.path} original media, headers, ranges, HEAD and cache validation`);
  }
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
    if (pathname === "/docs/composer") assert.equal(response.headers.get("vary"), documentVary);
  }
  console.log("PASS site/docs/blog Markdown negotiation through Next middleware");
  const navigation = await get(new URL("/docs/composer", origin), {
    headers: { rsc: "1", accept: "text/x-component" },
    redirect: "manual",
  });
  assert.ok(documentVary, "docs HTML must declare negotiation inputs");
  assert.equal(navigation.headers.get("vary"), documentVary);
  assert.equal(navigation.headers.get("cdn-cache-control"), "no-store");
  await navigation.arrayBuffer();
  console.log("PASS one Vary schema for HTML, Markdown and uncached navigation");

  // Include content from different docs trees, rather than only a landing page.
  for (const pathname of [
    "/blog/prisma-orm-8-nestjs",
    "/docs/composer/getting-started",
    "/docs/composer/porting-an-app",
    "/docs/orm/v7/reference/prisma-schema-reference",
    "/docs/orm/v6/reference/prisma-client-reference",
  ]) {
    const response = await get(new URL(pathname, origin), { headers: { accept: "text/html" } });
    assert.equal(response.status, 200, pathname);
    assert.equal(
      new URL(response.url).origin,
      new URL(origin).origin,
      `${pathname}: escaped the local stack`,
    );
    assert.match(await response.text(), /<html/);
    assert.equal(
      response.headers.get("cdn-cache-control"),
      "public, max-age=60, stale-while-revalidate=300",
      pathname,
    );
  }
  console.log("PASS blog and current/legacy docs articles");

  if (session && (process.platform === "linux" || process.platform === "darwin")) {
    // The pinned SDK's isolated emulator records child PIDs here. These are the Bun
    // website processes, not the larger developer-side build/assembly process.
    const state: {
      instances: Record<string, { labels: Record<string, string>; pid: number; status: string }>;
    } = JSON.parse(
      readFileSync(
        path.join(process.env.PRISMA_COMPOSER_EMULATORS_DIR!, "compute/instances.json"),
        "utf8",
      ),
    );
    const services = Object.values(state.instances).filter(
      (service) =>
        service.status === "running" &&
        service.labels["composer.app"] === "web" &&
        service.labels["composer.directory"] === process.cwd(),
    );
    assert.equal(services.length, 6, "expected all six local service processes");
    for (const service of services) {
      const name = service.labels["composer.address"];
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
