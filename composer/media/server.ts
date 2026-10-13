import { readFile } from "node:fs/promises";
import { blogMedia } from "./services.ts";
import { mediaPath, type MediaFile } from "./catalog.ts";

export async function mediaHandler(root: URL) {
  const files: MediaFile[] = JSON.parse(await readFile(new URL("files.json", root), "utf8"));
  const resources = new Map(files.map((file) => [mediaPath(file.path), file]));
  return (request: Request): Response => {
    const file = resources.get(new URL(request.url).pathname);
    if (!file) return new Response("Not found", { status: 404 });
    if (!["GET", "HEAD"].includes(request.method))
      return new Response(null, { status: 405, headers: { allow: "GET, HEAD" } });
    const body = Bun.file(
      new URL(`public/${file.path.split("/").map(encodeURIComponent).join("/")}`, root),
    );
    const etag = `"${file.sha256}"`;
    const headers = new Headers({
      "content-type": body.type,
      "content-length": String(file.bytes),
      "cache-control": "public, max-age=0",
      "accept-ranges": "bytes",
      etag: etag,
      "last-modified": new Date(file.modified).toUTCString(),
    });
    const match = request.headers.get("if-none-match");
    const modified = request.headers.get("if-modified-since");
    if (
      match
        ?.split(",")
        .some((value) => value.trim().replace(/^W\//, "") === etag || value.trim() === "*") ||
      (!match &&
        modified &&
        Math.floor(file.modified / 1000) <= Math.floor(Date.parse(modified) / 1000))
    ) {
      headers.delete("content-length");
      return new Response(null, { status: 304, headers });
    }
    const range = request.headers.get("range");
    const ifRange = request.headers.get("if-range");
    if (
      range &&
      !range.includes(",") &&
      request.method === "GET" &&
      (!ifRange ||
        ifRange === etag ||
        Date.parse(ifRange) >= Math.floor(file.modified / 1000) * 1000)
    ) {
      const parts = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = parts?.[1] ? Number(parts[1]) : file.bytes - Number(parts?.[2]);
      const end = parts?.[1] && parts?.[2] ? Number(parts[2]) : file.bytes - 1;
      start = Math.max(0, start);
      if (
        !parts ||
        (!parts[1] && !parts[2]) ||
        !Number.isSafeInteger(start) ||
        !Number.isSafeInteger(end) ||
        start >= file.bytes ||
        end < start
      ) {
        headers.set("content-range", `bytes */${file.bytes}`);
        headers.set("content-length", "0");
        return new Response(null, { status: 416, headers });
      }
      const last = Math.min(end, file.bytes - 1);
      headers.set("content-range", `bytes ${start}-${last}/${file.bytes}`);
      headers.set("content-length", String(last - start + 1));
      return new Response(body.slice(start, last + 1), { status: 206, headers });
    }
    return new Response(request.method === "HEAD" ? null : body, { headers });
  };
}

export async function startMediaServer(index: number) {
  Bun.serve({
    port: blogMedia[index].port(),
    hostname: "0.0.0.0",
    fetch: await mediaHandler(new URL("./", import.meta.url)),
  });
}
