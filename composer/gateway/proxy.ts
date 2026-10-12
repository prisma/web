import { redirect, redirectMatcher, route, type Zone, type Redirect } from "./routes.ts";

export type Origins = Record<Zone, string>;

function endToEndHeaders(source: Headers) {
  const headers = new Headers(source);
  const connectionHeaders = (headers.get("connection") ?? "").split(",");
  for (const name of [
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    ...connectionHeaders,
  ]) {
    if (name.trim()) headers.delete(name.trim());
  }
  return headers;
}

type UpstreamFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export function createGateway(
  origins: Origins,
  upstreamFetch: UpstreamFetch = fetch,
  siteRedirects: Redirect[] = [],
) {
  const siteNextRedirect = redirectMatcher(siteRedirects);
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    // Compute terminates TLS before forwarding HTTP to the service. Keep
    // redirects on the browser's HTTPS origin in that case.
    if (request.headers.get("x-forwarded-proto") === "https") url.protocol = "https:";
    if (url.pathname === "/_composer/health") return new Response("ok");
    const legacyRedirect = redirect(url, siteNextRedirect, request.headers);
    if (legacyRedirect)
      return new Response(null, {
        status: legacyRedirect.status,
        headers: { location: legacyRedirect.location },
      });

    const selected = route(url.pathname);
    const upstream = new URL(origins[selected.zone]);
    // Assign fields instead of resolving an untrusted path as a URL: //host
    // and encoded paths cannot change which upstream receives this request.
    upstream.pathname = selected.pathname;
    upstream.search = url.search;
    const headers = endToEndHeaders(request.headers);
    const proto = headers.get("x-forwarded-proto");
    headers.set("host", url.host);
    headers.set("x-forwarded-host", url.host);
    headers.set("x-forwarded-proto", proto === "https" ? "https" : url.protocol.slice(0, -1));
    try {
      const response = await upstreamFetch(upstream, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "manual",
        signal: request.signal,
        duplex: "half",
        // Bun otherwise decompresses the stream while retaining the upstream
        // Content-Encoding/Content-Length headers, corrupting proxied assets.
        decompress: false,
      } as RequestInit);
      const outgoing = endToEndHeaders(response.headers);
      const location = outgoing.get("location");
      if (location) {
        const destination = new URL(location, upstream);
        if (
          Object.values(origins).some((origin) => new URL(origin).origin === destination.origin)
        ) {
          outgoing.set(
            "location",
            `${url.origin}${destination.pathname}${destination.search}${destination.hash}`,
          );
        }
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: outgoing,
      });
    } catch {
      if (request.signal.aborted) return new Response(null, { status: 499 });
      console.error(`Composer upstream unavailable: ${selected.zone}`);
      return new Response("Website temporarily unavailable", { status: 502 });
    }
  };
}
