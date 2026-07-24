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

async function proxyToMcpServer(request: Request) {
  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  // MCP messages are small JSON-RPC payloads; buffering avoids the streaming
  // request-body (duplex) requirements of pass-through fetch.
  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();

  const upstream = await fetch(MCP_SERVER_URL, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

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
