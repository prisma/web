import { createReadStream, createWriteStream } from "node:fs";
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, relative, sep } from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import {
  staticManifestPath,
  blogStaleSeconds,
  staticRetentionSeconds,
  staticAssetKey,
  type StaticAsset,
  type StaticAssets,
} from "./static-assets.ts";

const sites = ["site", "docs", "blog", "handbook", "eclipse"];
export type ReadPublicAsset = (input: string | URL, init?: RequestInit) => Promise<Response>;
const types: Record<string, string> = {
  js: "application/javascript; charset=utf-8",
  mjs: "application/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json",
  wasm: "application/wasm",
  woff2: "font/woff2",
  woff: "font/woff",
  ttf: "font/ttf",
  otf: "font/otf",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  ico: "image/x-icon",
};

function validAsset(path: string, value: StaticAsset) {
  return (
    /^\/(?:site|docs|blog|handbook|eclipse)-static\/_next\/static\/.+/.test(path) &&
    staticAssetKey(path) === path &&
    /^[a-f0-9]{64}$/.test(value.sha256) &&
    Number.isSafeInteger(value.bytes) &&
    value.bytes >= 0 &&
    value.bytes <= 900_000_000 &&
    typeof value.current === "boolean" &&
    typeof value.contentType === "string" &&
    Object.values(types).includes(value.contentType) &&
    (value.current || (Number.isSafeInteger(value.expiresAt) && value.expiresAt! > 0))
  );
}

/** Retain only public Next files. Hash names deduplicate fonts shared by the five apps. */
export async function prepareRetainedAssets({
  root,
  gateway,
  previousOrigin,
  enabled = false,
  now = Date.now(),
  fetch: read = fetch,
}: {
  root: string;
  gateway: string;
  previousOrigin?: string;
  enabled?: boolean;
  now?: number;
  fetch?: ReadPublicAsset;
}): Promise<StaticAssets> {
  const directory = join(gateway, "static");
  await mkdir(directory, { recursive: true });
  const assets: Record<string, StaticAsset> = {};
  const copied = new Set<string>();
  for (const site of sites) {
    const source = join(root, "apps", site, ".next", "static");
    async function walk(dir: string) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const file = join(dir, entry.name);
        if (entry.isDirectory()) await walk(file);
        else if (entry.isFile() && !entry.name.endsWith(".map")) {
          const contentType = types[entry.name.split(".").at(-1)!.toLowerCase()];
          if (!contentType) throw new Error(`Unknown public Next asset type: ${entry.name}`);
          let bytes = 0;
          const hash = createHash("sha256");
          for await (const chunk of createReadStream(file)) {
            hash.update(chunk);
            bytes += chunk.length;
          }
          const sha256 = hash.digest("hex");
          const path = `/${site}-static/_next/static/${relative(source, file).split(sep).map(encodeURIComponent).join("/")}`;
          assets[path] = { sha256, bytes, contentType, current: true };
          if (!copied.has(sha256)) {
            await copyFile(file, join(directory, sha256));
            copied.add(sha256);
          }
        }
      }
    }
    await walk(source);
  }
  if (enabled && previousOrigin) {
    const origin = new URL(previousOrigin);
    const response = await read(new URL(staticManifestPath, origin), {
      signal: AbortSignal.timeout(30_000),
      redirect: "error",
    });
    if (response.status === 404) await response.body?.cancel();
    else {
      if (!response.ok)
        throw new Error(`Cannot read previous public static manifest: HTTP ${response.status}`);
      const previous = (await response.json()) as StaticAssets;
      if (
        previous.version !== 1 ||
        !previous.assets ||
        Object.keys(previous.assets).length > 20_000
      )
        throw new Error("Invalid previous public static manifest");
      const retained: StaticAsset[] = [];
      for (const [path, old] of Object.entries(previous.assets)) {
        if (!validAsset(path, old)) throw new Error(`Invalid retained static asset: ${path}`);
        if (assets[path]) {
          if (assets[path].sha256 !== old.sha256)
            throw new Error(`Immutable Next asset changed bytes: ${path}`);
          continue;
        }
        if (!old.current && old.expiresAt! <= now) continue;
        const item = {
          ...old,
          current: false,
          expiresAt: old.current ? now + staticRetentionSeconds * 1000 : old.expiresAt,
        };
        assets[path] = item;
        retained.push(item);
      }
      const unique = [
        ...new Map(
          retained.filter((item) => !copied.has(item.sha256)).map((item) => [item.sha256, item]),
        ).values(),
      ];
      const total = [
        ...new Map(Object.values(assets).map((item) => [item.sha256, item.bytes])).values(),
      ].reduce((a, b) => a + b, 0);
      if (total > 850_000_000)
        throw new Error(
          "Retained static files exceed the gateway budget; use object storage before extending retention",
        );
      const pending = [...unique];
      await Promise.all(
        Array.from({ length: 4 }, async () => {
          for (;;) {
            const item = pending.shift();
            if (!item) break;
            const file = await read(new URL(`${staticManifestPath}/${item.sha256}`, origin), {
              headers: { "accept-encoding": "identity" },
              signal: AbortSignal.timeout(60_000),
              redirect: "error",
            });
            if (!file.ok || !file.body)
              throw new Error(`Cannot retain public static file: HTTP ${file.status}`);
            const hash = createHash("sha256");
            let bytes = 0;
            await pipeline(
              Readable.fromWeb(file.body as unknown as import("node:stream/web").ReadableStream),
              new Transform({
                transform(chunk: Buffer, _encoding, callback) {
                  bytes += chunk.length;
                  if (bytes > item.bytes)
                    return callback(new Error("Retained file exceeds declared size"));
                  hash.update(chunk);
                  callback(null, chunk);
                },
              }),
              createWriteStream(join(directory, item.sha256)),
            );
            if (bytes !== item.bytes || hash.digest("hex") !== item.sha256)
              throw new Error("Retained static file digest/size mismatch");
          }
        }),
      );
      console.log(`Gateway: retained ${unique.length} historical public static files`);
    }
  }
  const manifest: StaticAssets = {
    version: 1,
    release: process.env.GITHUB_SHA ?? "local",
    blogStaleSeconds: enabled ? blogStaleSeconds : 300,
    assets,
  };
  await writeFile(join(gateway, "retained-assets.json"), JSON.stringify(manifest));
  console.log(
    `Gateway: ${Object.keys(assets).length} public static paths; blog stale window ${manifest.blogStaleSeconds}s`,
  );
  return manifest;
}
