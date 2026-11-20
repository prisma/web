import { securityHeaders } from "../../packages/ui/security-headers.mjs";

type Handler = (request: Request) => Response | Promise<Response>;

/** The external Data Guide rewrite must have the root site's response policy. */
export function withExternalDocuments(handler: Handler): Handler {
  return async (request) => {
    const response = await handler(request);
    if (!/^\/dataguide(?:\/|$)/.test(new URL(request.url).pathname)) return response;
    const headers = new Headers(response.headers);
    for (const { key, value } of securityHeaders) headers.set(key, value);
    const policy = headers.get("cache-control") ?? "";
    const vary = (headers.get("vary") ?? "")
      .toLowerCase()
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    const publicDocument =
      !/(?:^|,)\s*(?:private|no-store|no-cache)\b/i.test(policy) &&
      vary.every((name) => ["accept", "accept-encoding"].includes(name)) &&
      response.status === 200 &&
      /^(?:text\/(?:html|markdown|plain))(?:;|$)/i.test(headers.get("content-type") ?? "") &&
      /(?:^|,)\s*public\s*(?:,|$)/i.test(policy) &&
      ["GET", "HEAD"].includes(request.method) &&
      !headers.has("set-cookie") &&
      ![
        "authorization",
        "cookie",
        "rsc",
        "next-action",
        "next-router-state-tree",
        "next-router-prefetch",
        "next-router-segment-prefetch",
        "next-url",
        "x-prerender-revalidate",
        "x-prerender-revalidate-if-generated",
      ].some((name) => request.headers.has(name)) &&
      !new URL(request.url).searchParams.has("_rsc");
    if (publicDocument) {
      // These are public editorial documents, not an API or session response.
      headers.set("cdn-cache-control", "public, max-age=60, stale-while-revalidate=300");
      headers.set("cache-control", "public, max-age=0");
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
