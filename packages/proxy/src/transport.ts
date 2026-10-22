import type { ProxyFetch } from "./types.ts";

export function endToEndHeaders(source: Headers) {
  const headers = new Headers(source);
  for (const name of [
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    ...(headers.get("connection") ?? "").split(","),
  ])
    if (name.trim()) headers.delete(name.trim());
  return headers;
}
/** Bun-only raw transport. Node users should import rawFetch from ./node. */
export const bunFetch: ProxyFetch = (url, init) => {
  if (!("Bun" in globalThis)) throw new Error("Use @prisma/proxy/node rawFetch on Node.js");
  return fetch(url, { ...init, decompress: false } as RequestInit);
};
