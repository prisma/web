/**
 * MCP discovery document served at /docs/.well-known/mcp and /docs/.well-known/mcp.json.
 * The remote Prisma MCP server authenticates with Prisma Console via OAuth on first use.
 * See content/docs/ai/tools/mcp-server.mdx.
 */
export const mcpDiscoveryDocument = {
  version: "1.0.0",
  transport: "http",
  url: "https://mcp.prisma.io/mcp",
  servers: [
    {
      name: "prisma",
      url: "https://mcp.prisma.io/mcp",
      transport: "http",
      authentication: "oauth",
    },
  ],
} as const;

export function mcpDiscoveryResponse() {
  return new Response(JSON.stringify(mcpDiscoveryDocument, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
