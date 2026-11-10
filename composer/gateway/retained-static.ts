import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { join } from "node:path";
import { etagMatches } from "./file-validators.ts";
import { staticAssetKey, staticManifestPath, type StaticAssets } from "../static-assets.ts";
import { byteRange } from "./ranges.ts";

type Handler = (request: Request) => Response | Promise<Response>;

function acceptsBrotli(request: Request) {
  return (request.headers.get("accept-encoding") ?? "").split(",").some((token) => {
    const [coding, ...parameters] = token.trim().toLowerCase().split(";");
    if (coding.trim() !== "br") return false;
    const quality = parameters.find((value) => value.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    return q > 0 && q <= 1;
  });
}

/** Public content-addressed files, precompressed at build time without runtime buffering. */
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
    const brotli =
      file.brotliBytes !== undefined && !request.headers.has("range") && acceptsBrotli(request);
    const length = brotli ? file.brotliBytes! : file.bytes;
    let start = 0,
      end = length - 1,
      status = 200;
    const etag = `${brotli ? "W/" : ""}"asset-v1-${file.sha256}"`;
    const headers = new Headers({
      "content-type": file.contentType,
      "cache-control": "public, max-age=31536000, immutable",
      "cdn-cache-control": "public, max-age=31536000, immutable",
      etag,
      "accept-ranges": "bytes",
      "x-content-type-options": "nosniff",
      vary: "Accept-Encoding",
    });
    if (brotli) headers.set("content-encoding", "br");
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
    const selected = byteRange(range, file.bytes);
    if (selected) {
      if (selected === "unsatisfiable")
        return new Response(null, {
          status: 416,
          headers: {
            "content-range": `bytes */${file.bytes}`,
            "cache-control": "no-store",
            "cdn-cache-control": "no-store",
          },
        });
      ({ start, end } = selected);
      status = 206;
    }
    headers.set("content-length", String(Math.max(0, end - start + 1)));
    if (status === 206) headers.set("content-range", `bytes ${start}-${end}/${file.bytes}`);
    const body =
      request.method === "HEAD" || length === 0
        ? null
        : (Readable.toWeb(
            createReadStream(join(directory, `${file.sha256}${brotli ? ".br" : ""}`), {
              start,
              end,
            }),
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
      const br = asset.brotliBytes !== undefined && acceptsBrotli(request);
      if (asset.current && !br) {
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
    if (/^\/(?:site|docs|blog|handbook|eclipse)-static\/_next\/static\//.test(key))
      return new Response(request.method === "HEAD" ? null : "Not found\n", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "public, max-age=0",
          "cdn-cache-control": "public, max-age=15",
          "x-content-type-options": "nosniff",
        },
      });
    return handler(request);
  };
}
