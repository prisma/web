type Handler = (request: Request) => Response | Promise<Response>;

const PRIVATE_REQUEST_HEADERS = [
  "authorization",
  "cookie",
  "rsc",
  "next-router-state-tree",
  "next-router-prefetch",
  "next-router-segment-prefetch",
  "next-url",
  "next-action",
  "x-prerender-revalidate",
];

/** CDN policy for Composer's public HTML; Vercel owns its own cache invalidation. */
export function withOriginCache(handler: Handler): Handler {
  return async (request) => {
    const response = await handler(request);
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const prerendered = /(?:^|,)\s*1\s*(?:,|$)/.test(
      response.headers.get("x-nextjs-prerender") ?? "",
    );
    // Preserve framework/public-file cache policy, streaming and byte ranges.
    // A conditional HTML response can omit Content-Type, but must retain its
    // freshness cap when the CDN merges the 304 headers into its cached copy.
    if (!/^text\/html(?:;|$)/.test(contentType) && !(response.status === 304 && prerendered))
      return response;
    // An explicit app-owned CDN policy is authoritative.
    if (
      response.headers.has("cdn-cache-control") ||
      response.headers.has("cloudflare-cdn-cache-control")
    )
      return response;

    const headers = new Headers(response.headers);
    const control = headers.get("cache-control")?.toLowerCase() ?? "";
    const sharedAge = Number(control.match(/(?:^|,)\s*s-maxage\s*=\s*(\d+)\s*(?:,|$)/)?.[1] ?? 0);
    const accept = request.headers.get("accept")?.toLowerCase() ?? "";
    const publicHtml =
      ["GET", "HEAD"].includes(request.method) &&
      [200, 304].includes(response.status) &&
      prerendered &&
      sharedAge > 0 &&
      !/(?:^|,)\s*(?:private|no-store|no-cache)\b/.test(control) &&
      !headers.has("set-cookie") &&
      !PRIVATE_REQUEST_HEADERS.some((name) => request.headers.has(name)) &&
      new URL(request.url).search === "" &&
      accept.includes("text/html") &&
      !accept.includes("text/markdown") &&
      !accept.includes("text/x-component");

    // A short freshness window bounds staleness without deployment-time purge
    // credentials. Browsers revalidate; CDNs can reuse public HTML for a minute.
    headers.set(
      "cdn-cache-control",
      publicHtml ? `public, max-age=${Math.min(sharedAge, 60)}` : "no-store",
    );
    if (publicHtml) headers.set("cache-control", "public, max-age=0, must-revalidate");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
