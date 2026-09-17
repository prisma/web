import { createPageMetadata } from "@/lib/page-metadata";
import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";

import { McpAgentsSection } from "./_components/mcp-agents-section";
import { McpCapabilitiesSection } from "./_components/mcp-capabilities-section";
import { McpCtaSection } from "./_components/mcp-cta-section";
import { McpHeroSection } from "./_components/mcp-hero-section";
import { McpVideoSection } from "./_components/mcp-video-section";
import {
  agents,
  capabilities,
  DOCS_MCP,
  heroFeatures,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
} from "./mcp-content";

const mcpStructuredData = createSoftwareApplicationStructuredData({
  path: "/mcp",
  name: "Prisma MCP Server",
  description:
    "AI-powered database management via Model Context Protocol. Manage databases with natural language in Claude, Codex, Cursor, Warp, ChatGPT and other AI agents.",
});

export const metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/mcp",
  ogKicker: "Prisma MCP Server",
});

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
