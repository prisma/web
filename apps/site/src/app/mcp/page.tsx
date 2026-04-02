import { JsonLd } from "@/components/json-ld";
import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Prisma MCP Server — AI-Powered Database Management",
  description:
    "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents. Works great with Prisma Postgres.",
  alternates: {
    canonical: "https://www.prisma.io/mcp",
  },
  openGraph: {
    title: "Prisma MCP Server — AI-Powered Database Management",
    description:
      "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents. Works great with Prisma Postgres.",
    url: "https://www.prisma.io/mcp",
    siteName: "Prisma",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/og-mcp.png",
        width: 1200,
        height: 630,
        alt: "Prisma MCP Server Web Page Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prisma",
    creator: "@prisma",
    title: "Prisma MCP Server — AI-Powered Database Management",
    description:
      "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents. Works great with Prisma Postgres.",
    images: ["/og/og-mcp.png"],
  },
};
const DOCS_MCP = "https://www.prisma.io/docs/postgres/integrations/mcp-server";

const heroFeatures: McpHeroFeature[] = [
  {
    icon: "fa-light fa-message-smile",
    line1: "Natural language",
    line2: "database operations",
    mobileText: (
      <>
        Natural language
        <br />
        db operations
      </>
    ),
  },
  {
    icon: "fa-light fa-rocket-launch",
    line1: "Works with any",
    line2: "AI agent",
  },
  { icon: "fa-light fa-bolt", line1: "Super quick", line2: "2-minute setup" },
  {
    icon: "fa-light fa-lock",
    line1: "Enterprise-grade",
    line2: "security & OAuth",
  },
];

const agents: McpAgent[] = [
  {
    logo: "/mcp/logos/cursor.svg",
    alt: "Add to Cursor",
    href:
      "cursor://anysphere.cursor-deeplink/mcp/install?name=Prisma-Remote&config=eyJjb21tYW5kIjoibnB4IC15IG1jcC1yZW1vdGUgaHR0cHM6Ly9tY3AucHJpc21hLmlvL21jcCJ9",
  },
  {
    logo: "/mcp/logos/vscode.svg",
    alt: "Install in VS Code",
    href:
      "vscode:mcp/install?%7B%22name%22%3A%22prisma-postgres%22%2C%22gallery%22%3Atrue%2C%22url%22%3A%22https%3A%2F%2Fmcp.prisma.io%2Fmcp%22%7D",
  },
  {
    logo: "/mcp/logos/warp.svg",
    alt: "Copy JSON configuration",
    copyText: JSON.stringify(
      {
        "Prisma-Postgres": {
          command: "npx",
          args: ["-y", "mcp-remote", "https://mcp.prisma.io/mcp"],
          env: {},
          working_directory: null,
          start_on_launch: true,
        },
      },
      null,
      2,
    ),
  },
  {
    logo: "/mcp/logos/chatgpt.svg",
    alt: "See how to add the remote Prisma MCP server to ChatGPT",
    href: "https://pris.ly/gpt-prisma-mcp",
  },
  {
    logo: "/mcp/logos/claude-code.svg",
    alt: "Copy command to add to Claude Code",
    copyText: "claude mcp add --transport http prisma https://mcp.prisma.io/mcp",
  },
  {
    logo: "/mcp/logos/windsurf.svg",
    alt: "Add via Plugin Store",
    href: "https://pris.ly/windsurf-mcp",
  },
  {
    logo: "/mcp/logos/gemini.svg",
    alt: "Copy command to add to Gemini CLI",
    copyText:
      "gemini mcp add Prisma-Remote npx --args -y mcp-remote https://mcp.prisma.io/mcp --scope user",
  },
  {
    logo: null,
    alt: "Any AI agent",
    href: DOCS_MCP,
  },
];

const capabilities: McpCapability[] = [
  {
    icon: "fa-light fa-database",
    title: "Database Management",
    description: "Create projects, databases, or clean them up via natural language",
    prompt: "Set up this project with a new database in us-east-1",
    mobileTall: false,
  },
  {
    icon: "fa-light fa-magnifying-glass-arrow-right",
    title: "Data Analysis",
    description: "Execute queries and analyze data through conversation",
    prompt: "Show me all users who signed up this week and their activity levels",
    mobileTall: true,
  },
  {
    icon: "fa-light fa-code-compare",
    title: "Schema Operations",
    description: "Manage migrations and database structure changes",
    prompt: "Check my migration status and create a new user preferences table",
    mobileTall: false,
  },
  {
    icon: "fa-light fa-folder-gear",
    title: "Database Administration",
    description: "Handle backups, connection strings, and multi-database workflows",
    prompt: "Create a new database from the most recent backup to my product db",
    mobileTall: false,
  },
  {
    icon: "fa-light fa-arrow-progress",
    title: "Development Workflow",
    description: "Integrate database operations seamlessly into coding workflow",
    prompt: "Open Prisma Studio and show me the data in my users table",
    mobileTall: false,
  },
];

export default function McpPage() {
  return (
    <main className="relative flex-1 w-full -mt-24 flex flex-col overflow-x-hidden bg-[linear-gradient(0deg,var(--color-background-default)_95%,var(--color-background-ppg)_100%)] text-foreground-neutral">
      <JsonLd id="mcp-software-application" data={mcpStructuredData} />
      <div className="relative z-1 flex flex-col">
        <McpHeroSection docsHref={DOCS_MCP} features={heroFeatures} />
        <McpVideoSection />
        <McpAgentsSection docsHref={DOCS_MCP} agents={agents} />
        <McpCapabilitiesSection capabilities={capabilities} />
        <McpCtaSection docsHref={DOCS_MCP} readDocsHref="https://www.prisma.io/docs/ai" />
      </div>
    </main>
  );
}
