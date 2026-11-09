import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { join } from "node:path";
import { etagMatches } from "./file-validators.ts";
import { staticAssetKey, staticManifestPath, type StaticAssets } from "../static-assets.ts";

type Handler = (request: Request) => Response | Promise<Response>;

/** Public, content-addressed Next files only; current requests keep Next's normal compression. */
export function withRetainedStatic(
  handler: Handler,
  manifest: StaticAssets,
  directory: string,
): Handler {
  const byHash = new Map(Object.values(manifest.assets).map((item) => [item.sha256, item]));
  const files = new Map(Object.entries(manifest.assets));
  for (const [hash, item] of byHash) files.set(`${staticManifestPath}/${hash}`, item);
  const serve = (request: Request) => {
    const url = new URL(request.url);
    const file = files.get(url.pathname)!;
    let start = 0,
      end = file.bytes - 1,
      status = 200;
    const etag = `"asset-v1-${file.sha256}"`;
    const headers = new Headers({
      "content-type": file.contentType,
      "cache-control": "public, max-age=31536000, immutable",
      "cdn-cache-control": "public, max-age=31536000, immutable",
      etag,
      "accept-ranges": "bytes",
      "x-content-type-options": "nosniff",
      vary: "Accept-Encoding",
    });
    if (
      request.headers.has("if-match") &&
      !etagMatches(request.headers.get("if-match"), etag, false)
    )
      return new Response(null, {
        status: 412,
        headers: { "cache-control": "no-store", "cdn-cache-control": "no-store" },
      });
    if (etagMatches(request.headers.get("if-none-match"), etag, true))
      return new Response(null, { status: 304, headers });
    const range =
      request.method === "GET" &&
      (!request.headers.has("if-range") || request.headers.get("if-range") === etag)
        ? request.headers.get("range")
        : null;
    const match = range?.match(/^bytes=(\d*)-(\d*)$/);
    if (match) {
      const [, first, last] = match;
      if (first) {
        start = Number(first);
        end = last ? Math.min(Number(last), end) : end;
      } else if (last) start = Math.max(0, file.bytes - Number(last));
      if (
        file.bytes === 0 ||
        (!first && !last) ||
        (!first && Number(last) === 0) ||
        start > end ||
        start >= file.bytes
      )
        return new Response(null, {
          status: 416,
          headers: {
            "content-range": `bytes */${file.bytes}`,
            "cache-control": "no-store",
            "cdn-cache-control": "no-store",
          },
        });
      status = 206;
    }
    headers.set("content-length", String(Math.max(0, end - start + 1)));
    if (status === 206) headers.set("content-range", `bytes ${start}-${end}/${file.bytes}`);
    const body =
      request.method === "HEAD" || file.bytes === 0
        ? null
        : (Readable.toWeb(
            createReadStream(join(directory, file.sha256), { start, end }),
          ) as unknown as ReadableStream<Uint8Array>);
    return new Response(body, { status, headers });
  };
  return async (request) => {
    const url = new URL(request.url);
    if (!["GET", "HEAD"].includes(request.method)) return handler(request);
    if (url.pathname === staticManifestPath)
      return new Response(request.method === "HEAD" ? null : JSON.stringify(manifest), {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
          "cdn-cache-control": "no-store",
          "x-robots-tag": "noindex",
        },
      });
    const key = staticAssetKey(url.pathname);
    const asset = manifest.assets[key];
    if (asset) {
      if (asset.current) {
        const response = await handler(request);
        if (response.status !== 404) return response;
        await response.body?.cancel();
      }
      url.pathname = key;
      return serve(new Request(url, request));
    }
    const digest = url.pathname.startsWith(`${staticManifestPath}/`)
      ? url.pathname.slice(staticManifestPath.length + 1)
      : "";
    if (byHash.has(digest)) return serve(request);
    return handler(request);
  };
}
