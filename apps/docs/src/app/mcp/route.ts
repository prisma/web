/**
 * MCP endpoint at /docs/mcp.
 *
 * Agent-readiness audits probe the conventional `<origin>/mcp` endpoints with
 * an MCP initialize request to decide whether an MCP server is discoverable
 * (the `.well-known/mcp` discovery documents alone are not enough). The real
 * Prisma MCP server lives at https://mcp.prisma.io/mcp behind OAuth, so this
 * route proxies MCP protocol traffic (POST messages, GET SSE streams, DELETE
 * session teardown) to it and preserves the `WWW-Authenticate` challenge that
 * tells clients how to authenticate. Plain browser GETs are sent to the /mcp
 * marketing page instead.
 *
 * The equivalent endpoint on the site root (www.prisma.io/mcp) is handled by
 * header-matched rewrites in apps/site/next.config.mjs, because /mcp there is
 * already a marketing page.
 */
export const dynamic = "force-dynamic";

const MCP_SERVER_URL = "https://mcp.prisma.io/mcp";

const FORWARD_REQUEST_HEADERS = [
  "accept",
  "authorization",
  "content-type",
  "last-event-id",
  "mcp-protocol-version",
  "mcp-session-id",
];

const FORWARD_RESPONSE_HEADERS = [
  "content-type",
  "mcp-protocol-version",
  "mcp-session-id",
  "www-authenticate",
];

// MCP messages are small JSON-RPC payloads; this is a public endpoint, so cap
// what gets buffered into memory.
const MAX_BODY_BYTES = 1_048_576;

// Bound on establishing the upstream connection and receiving headers. The
// timer is cleared once headers arrive so long-lived SSE bodies keep streaming.
const UPSTREAM_HEADER_TIMEOUT_MS = 30_000;

/**
 * Reads the request body, rejecting once it exceeds MAX_BODY_BYTES. The
 * declared Content-Length short-circuits, but the stream is counted too so
 * chunked requests without a length are equally bounded.
 */
async function readBoundedBody(request: Request) {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;

  if (!request.body) return new ArrayBuffer(0);

  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = request.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body.buffer;
}

async function proxyToMcpServer(request: Request) {
  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  // Buffering (instead of streaming pass-through) avoids fetch's duplex
  // request-body requirements; readBoundedBody keeps it memory-safe.
  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const bounded = await readBoundedBody(request);
    if (bounded === null) {
      return new Response("Request body exceeds the 1 MiB limit for MCP messages.", {
        status: 413,
        headers: { "Cache-Control": "no-store" },
      });
    }
    body = bounded;
  }

  const abort = new AbortController();
  const headerTimer = setTimeout(() => abort.abort(), UPSTREAM_HEADER_TIMEOUT_MS);
  let upstream: Response;
  try {
    upstream = await fetch(MCP_SERVER_URL, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
      signal: abort.signal,
    });
  } catch (error) {
    if (abort.signal.aborted) {
      return new Response("Upstream MCP server timed out.", {
        status: 504,
        headers: { "Cache-Control": "no-store" },
      });
    }
    throw error;
  } finally {
    clearTimeout(headerTimer);
  }

  const responseHeaders = new Headers({ "Cache-Control": "no-store" });
  for (const name of FORWARD_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(request: Request) {
  const accept = request.headers.get("accept") ?? "";
  // MCP Streamable HTTP clients open the server event stream with
  // `Accept: text/event-stream`; anything else is a human with a browser.
  if (!accept.includes("text/event-stream")) {
    return Response.redirect("https://www.prisma.io/mcp", 307);
  }
  return proxyToMcpServer(request);
}

export function POST(request: Request) {
  return proxyToMcpServer(request);
}

export function DELETE(request: Request) {
  return proxyToMcpServer(request);
}
