type Handler = (request: Request) => Response | Promise<Response>;
import { assetKey, withFileValidators, type PublicFile } from "./file-validators.ts";

const PRIVATE_REQUEST_HEADERS = [
  "authorization",
  "rsc",
  "next-router-state-tree",
  "next-router-prefetch",
  "next-router-segment-prefetch",
  "next-url",
  "next-action",
  "x-prerender-revalidate",
];
const SUPPORTED_VARY = new Set([
  "accept",
  "accept-encoding",
  "user-agent",
  ...PRIVATE_REQUEST_HEADERS,
]);

/** CDN policy for Composer's public files/HTML; Vercel keeps its own caching. */
export function withOriginCache(
  handler: Handler,
  publicAssets: ReadonlyMap<string, PublicFile> = new Map(),
  options: { blogStaleSeconds?: number; release?: string } = {},
): Handler {
  const blogStaleSeconds = options.blogStaleSeconds ?? 300;
  if (![300, 86_400].includes(blogStaleSeconds)) throw new Error("Unsupported blog stale window");
  const read = withFileValidators(handler, publicAssets);
  return async (request) => {
    const url = new URL(request.url);
    const file = publicAssets.get(assetKey(url.pathname));
    const versions = url.searchParams.getAll("__asset");
    if (
      file &&
      versions.length &&
      ["GET", "HEAD"].includes(request.method) &&
      (versions.length !== 1 || versions[0] !== file.sha256)
    ) {
      // An old page can refer to media changed by a newer deploy. Redirect to
      // the current content version; never cache new bytes under an old hash.
      url.searchParams.set("__asset", file.sha256);
      return new Response(null, {
        status: 307,
        headers: {
          location: `${url.pathname}${url.search}`,
          "cache-control": "no-store",
          "cdn-cache-control": "no-store",
        },
      });
    }
    const versionedAsset = Boolean(file && versions.length === 1 && versions[0] === file.sha256);
    let response = await read(request);
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const prerendered = /(?:^|,)\s*1\s*(?:,|$)/.test(
      response.headers.get("x-nextjs-prerender") ?? "",
    );
    const asset = publicAssets.has(assetKey(url.pathname));
    const publicDocument = !asset && response.headers.get("x-composer-public-document") === "1";
    const navigation =
      PRIVATE_REQUEST_HEADERS.some(
        (name) => name !== "authorization" && request.headers.has(name),
      ) ||
      url.searchParams.has("_rsc") ||
      /^text\/x-component(?:;|$)/.test(contentType);
    const negotiatedText =
      /^text\/plain(?:;|$)/.test(contentType) &&
      /(?:^|,)\s*(?:accept|user-agent)\s*(?:,|$)/i.test(response.headers.get("vary") ?? "");
    if (
      !asset &&
      (/^text\/(?:html|markdown)(?:;|$)/.test(contentType) ||
        negotiatedText ||
        navigation ||
        (response.status === 304 && (prerendered || publicDocument)))
    ) {
      // Keep the same Vary schema across every representation of a document,
      // including uncached navigation/redirects. Different schemas made the
      // generic Cloudflare rule miss warm HTML when Markdown/RSC was read.
      // Next overwrites the apps' Accept Vary header; restore negotiation and
      // bypass inputs here so the edge configuration stays hostname-only.
      const headers = new Headers(response.headers);
      const vary = new Set(
        (headers.get("vary") ?? "")
          .split(",")
          .map((name) => name.trim().toLowerCase())
          .filter(Boolean),
      );
      for (const name of ["accept", "accept-encoding", "user-agent", ...PRIVATE_REQUEST_HEADERS])
        vary.add(name);
      headers.set("vary", [...vary].sort().join(", "));
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    if (
      !asset &&
      !response.headers.has("cdn-cache-control") &&
      !response.headers.has("cloudflare-cdn-cache-control") &&
      (PRIVATE_REQUEST_HEADERS.some((name) => request.headers.has(name)) ||
        url.searchParams.has("_rsc") ||
        /^text\/x-component(?:;|$)/.test(contentType))
    ) {
      // The hostname-wide edge rule knows nothing about Next. Keep navigation
      // uncached here until deployment-aware RSC caching/invalidation exists;
      // its default one-year s-maxage is unsafe on an independent CDN.
      const headers = new Headers(response.headers);
      headers.set("cdn-cache-control", "no-store");
      headers.delete("x-composer-public-document");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    // Preserve framework cache policy, streaming and byte ranges.
    // A conditional HTML response can omit Content-Type, but must retain its
    // freshness cap when the CDN merges the 304 headers into its cached copy.
    if (
      !asset &&
      !/^text\/html(?:;|$)/.test(contentType) &&
      !(response.status === 304 && (prerendered || publicDocument))
    )
      return response;
    // An explicit app-owned CDN policy is authoritative.
    if (
      response.headers.has("cdn-cache-control") ||
      response.headers.has("cloudflare-cdn-cache-control")
    )
      return response;

    const headers = new Headers(response.headers);
    headers.delete("x-composer-public-document");
    const control = headers.get("cache-control")?.toLowerCase() ?? "";
    const sharedAge = Number(control.match(/(?:^|,)\s*s-maxage\s*=\s*(\d+)\s*(?:,|$)/)?.[1] ?? 0);
    const publicFile = asset && /(?:^|,)\s*public\s*(?:,|$)/.test(control);
    // An app's positive public-file lifetime already enables edge reuse.
    if (
      publicFile &&
      !versionedAsset &&
      /(?:^|,)\s*(?:s-maxage\s*=\s*\d+|max-age\s*=\s*[1-9]\d*)\s*(?:,|$)/.test(control)
    )
      return response;
    const accept = request.headers.get("accept")?.toLowerCase() ?? "";
    const cacheable =
      ["GET", "HEAD"].includes(request.method) &&
      [200, 206, 304].includes(response.status) &&
      (publicDocument || !/(?:^|,)\s*(?:private|no-store|no-cache)\b/.test(control)) &&
      !headers.has("set-cookie") &&
      !(headers.get("vary") ?? "")
        .split(",")
        .some((name) => name.trim() && !SUPPORTED_VARY.has(name.trim().toLowerCase())) &&
      !PRIVATE_REQUEST_HEADERS.some((name) => request.headers.has(name)) &&
      !url.searchParams.has("_rsc");
    const publicHtml =
      cacheable &&
      !asset &&
      response.status !== 206 &&
      (publicDocument || (prerendered && sharedAge > 0)) &&
      accept.includes("text/html") &&
      !accept.includes("text/markdown") &&
      !accept.includes("text/x-component");
    // Prerendered and explicitly opted-in public documents are independent of
    // cookies/query parameters. Other SSR pages remain private.
    // Dynamic pages, APIs and Next navigation never qualify. The edge retains
    // the full query string in its cache key; no parameters are discarded.
    const publicAsset = cacheable && publicFile;

    // Already-compressed media should retain Content-Length and byte ranges
    // through a CDN. Leave text/SVG compression enabled.
    const noTransform =
      publicAsset &&
      (/^(?:image\/(?!svg\+xml)|audio\/|video\/|font\/)/.test(contentType) ||
        // Next removes Content-Type on a conditional 304. Retain no-transform
        // when the CDN merges these headers into its previous complete response.
        (response.status === 304 &&
          /\.(?:png|jpe?g|gif|webp|avif|ico|mp4|webm|mp3|ogg|wav|woff2?|ttf|otf|eot)$/i.test(
            url.pathname,
          )));

    // A short freshness window bounds staleness without deployment-time purge
    // credentials. Browsers revalidate; CDNs can reuse public HTML for a minute.
    headers.set(
      "cdn-cache-control",
      publicAsset && versionedAsset
        ? `public, max-age=31536000, immutable${noTransform ? ", no-transform" : ""}`
        : publicHtml || publicAsset
          ? `public, max-age=${publicHtml && sharedAge > 0 ? Math.min(sharedAge, 60) : 60}, stale-while-revalidate=${publicHtml && (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) ? blogStaleSeconds : 300}${noTransform ? ", no-transform" : ""}`
          : "no-store",
    );
    if (publicHtml && options.release) headers.set("x-composer-release", options.release);
    if (publicAsset && versionedAsset)
      headers.set(
        "cache-control",
        `public, max-age=31536000, immutable${noTransform ? ", no-transform" : ""}`,
      );
    else if (publicHtml) headers.set("cache-control", "public, max-age=0");
    else if (noTransform) headers.set("cache-control", `${control}, no-transform`);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
