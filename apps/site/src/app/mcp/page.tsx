import { createPageMetadata } from "@/lib/page-metadata";
import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";

import { type McpAgent, McpAgentsSection } from "./_components/mcp-agents-section";
import { type McpCapability, McpCapabilitiesSection } from "./_components/mcp-capabilities-section";
import { McpCtaSection } from "./_components/mcp-cta-section";
import { type McpHeroFeature, McpHeroSection } from "./_components/mcp-hero-section";
import { McpVideoSection } from "./_components/mcp-video-section";

const mcpStructuredData = createSoftwareApplicationStructuredData({
  path: "/mcp",
  name: "Prisma MCP Server",
  description:
    "AI-powered database management via Model Context Protocol. Manage databases with natural language in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents.",
});

const PAGE_TITLE = "Prisma MCP Server | Manage Databases with AI Agents";
const PAGE_DESCRIPTION =
  "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents. Works great with Prisma Postgres.";

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/mcp",
  ogKicker: "Prisma MCP Server",
});

const DOCS_MCP = "https://www.prisma.io/docs/ai/tools/mcp-server";

const heroFeatures: McpHeroFeature[] = [
  { text: "Natural language database operations" },
  { text: "Works with any AI agent" },
  { text: "Quick 2-minute setup" },
  { text: "Enterprise-grade security & OAuth" },
];

const agents: McpAgent[] = [
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

const capabilities: McpCapability[] = [
  {
    icon: "database",
    title: "Database management",
    description: "Create projects, databases, or clean them up via natural language",
    prompt: "Set up this project with a new database in us-east-1",
  },
  {
    icon: "search",
    title: "Data analysis",
    description: "Execute queries and analyze data through conversation",
    prompt: "Show me all users who signed up this week and their activity levels",
  },
  {
    icon: "table",
    title: "Schema insight",
    description: "Inspect database structure and understand relationships",
    prompt: "Introspect my product database and summarize the user tables",
  },
  {
    icon: "settings",
    title: "Database administration",
    description: "Handle backups, restores, and multi-database workflows",
    prompt: "Create a new database from the most recent backup to my product db",
  },
  {
    icon: "repeat",
    title: "Connection management",
    description: "Create, list, and revoke database connection strings",
    prompt: "Create a connection string for my staging database",
  },
];

export default function McpPage() {
  return (
    <>
      <JsonLd id="mcp-software-application" data={mcpStructuredData} />
      <McpHeroSection docsHref={DOCS_MCP} features={heroFeatures} />
      <McpVideoSection />
      <McpAgentsSection agents={agents} />
      <McpCapabilitiesSection capabilities={capabilities} />
      <McpCtaSection docsHref={DOCS_MCP} readDocsHref="https://www.prisma.io/docs/ai" />
    </>
  );
}
