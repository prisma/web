/**
 * Plain data for the /mcp page and its agents section.
 *
 * Kept React-free (types are imported with `import type`, so nothing from the
 * component files survives compilation) so both the page and its Markdown
 * rendition (`@/lib/markdown/mcp`) can read the same copy without a route
 * handler pulling components in.
 */

import type { McpAgent } from "./_components/mcp-agents-section";
import type { McpCapability } from "./_components/mcp-capabilities-section";
import type { McpHeroFeature } from "./_components/mcp-hero-section";

export const PAGE_TITLE = "Prisma MCP Server | Manage Databases and Compute with AI";
export const PAGE_DESCRIPTION =
  "Manage Prisma Postgres databases, Prisma Compute deployments, and Object Storage from your AI tools with the Prisma MCP server.";

export const DOCS_MCP = "https://www.prisma.io/docs/ai/tools/mcp-server";

export const heroFeatures: McpHeroFeature[] = [
  { text: "Prisma Postgres and Compute" },
  { text: "Object Storage" },
  { text: "Composer topology" },
  { text: "Sign in with your Prisma account" },
];

export const agents: McpAgent[] = [
  {
    name: "Cursor",
    logo: "/mcp/logos/cursor.svg",
    alt: "Add to Cursor",
    href: "cursor://anysphere.cursor-deeplink/mcp/install?name=Prisma&config=eyJ1cmwiOiJodHRwczovL21jcC5wcmlzbWEuaW8vbWNwIn0%3D",
  },
  {
    name: "VS Code",
    logo: "/mcp/logos/vscode.svg",
    alt: "Install in VS Code",
    href: "vscode:mcp/install?%7B%22name%22%3A%22Prisma%22%2C%22gallery%22%3Atrue%2C%22url%22%3A%22https%3A%2F%2Fmcp.prisma.io%2Fmcp%22%7D",
  },
  {
    name: "Warp",
    logo: "/mcp/logos/warp.svg",
    alt: "Copy JSON configuration",
    copyText: JSON.stringify(
      {
        mcpServers: {
          Prisma: {
            url: "https://mcp.prisma.io/mcp",
          },
        },
      },
      null,
      2,
    ),
  },
  {
    name: "ChatGPT",
    logo: "/mcp/logos/chatgpt.svg",
    alt: "See how to add the Prisma MCP server to ChatGPT",
    href: "https://pris.ly/gpt-prisma-mcp",
  },
  {
    name: "Claude Code",
    logo: "/mcp/logos/claude-code.svg",
    alt: "Copy command to add to Claude Code",
    copyText: "claude mcp add --transport http prisma https://mcp.prisma.io/mcp",
  },
  {
    name: "Windsurf",
    logo: "/mcp/logos/windsurf.svg",
    alt: "Add via Plugin Store",
    href: "https://pris.ly/windsurf-mcp",
  },
  {
    name: "Gemini CLI",
    logo: "/mcp/logos/gemini.svg",
    alt: "Copy command to add to Gemini CLI",
    copyText: "gemini mcp add --transport http Prisma https://mcp.prisma.io/mcp --scope user",
  },
  {
    name: "Any AI agent",
    logo: null,
    alt: "Any AI agent",
    href: DOCS_MCP,
  },
];

export const capabilities: McpCapability[] = [
  {
    icon: "database",
    title: "Database management",
    description: "Create databases, manage connection strings, and restore automated backups",
    prompt: "Create a Prisma Postgres database in US East",
  },
  {
    icon: "settings",
    title: "Compute deployments",
    description: "Read app logs, manage existing deployments, and set environment variables",
    prompt: "List my Compute apps and show the latest failed builds",
  },
  {
    icon: "table",
    title: "Schemas and queries",
    description: "Inspect database tables and relationships, run SQL queries, and analyze results",
    prompt: "Introspect my product database and summarize the user tables",
  },
  {
    icon: "search",
    title: "Composer topology",
    description:
      "See how your services connect, with links to the project and apps in Prisma Console",
    prompt: "Show how this project's Composer services connect and give me the Console links",
  },
  {
    icon: "repeat",
    title: "Object Storage",
    description: "Create and list buckets, and manage their access keys",
    prompt: "List the Object Storage buckets in this project",
  },
];

export const TALLY_HREF = "https://tally.so/r/wA1R1N";

export const MANUAL_CONFIG = JSON.stringify(
  {
    mcpServers: {
      Prisma: {
        url: "https://mcp.prisma.io/mcp",
      },
    },
  },
  null,
  2,
);
