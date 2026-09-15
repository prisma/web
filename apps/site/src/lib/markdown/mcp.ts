import {
  agents,
  capabilities,
  DOCS_MCP,
  heroFeatures,
  MANUAL_CONFIG,
  TALLY_HREF,
} from "@/app/mcp/mcp-content";
import { bulletList, ctaList, heading, joinBlocks, link, paragraphs } from "./blocks";

export const MCP_H1 = "Your database workflow, powered by AI";
export const MCP_SUBHEADLINE =
  "Manage your databases with natural language via MCP in Claude, Codex, Cursor, Warp, ChatGPT, and other AI agents. Works great with Prisma Postgres.";

/**
 * One agent tile. A tile either deep-links an install flow — kept as a real
 * link so an agent can follow it — or copies a snippet, which is inlined.
 * Warp's snippet is the multi-line JSON that this section already prints in
 * full under "Or add the server to any MCP client", so it is not repeated.
 */
function renderAgent(agent: (typeof agents)[number]): string {
  if (agent.href) {
    // The catch-all tile's label repeats its name, so it links the name itself.
    return agent.alt === agent.name
      ? `**${link({ label: agent.name, href: agent.href })}**`
      : `**${agent.name}** — ${link({ label: agent.alt, href: agent.href })}`;
  }

  const copyText = agent.copyText ?? "";
  return copyText.includes("\n")
    ? `**${agent.name}** — ${agent.alt}`
    : `**${agent.name}** — ${agent.alt}: \`${copyText}\``;
}

/** Markdown rendition of /mcp (src/app/mcp/page.tsx and its _components). */
export function renderMcpMarkdown(): string {
  return joinBlocks([
    // Hero. The H1, the subheadline and the "Prisma MCP server" role kicker
    // come from the caller; this starts at the hero CTA and its feature row.
    ctaList([{ label: "Add MCP server", href: DOCS_MCP }]),
    bulletList(heroFeatures.map((feature) => feature.text)),

    // McpVideoSection is a bare YouTube iframe with no copy around it, so it
    // contributes nothing here.

    heading(2, "Works with your AI agent"),
    paragraphs(
      "Works with any AI agent, whether you prefer to use a remote or a local server, we've got you.",
    ),
    bulletList(agents.map(renderAgent)),

    paragraphs("Or add the server to any MCP client"),
    ["```json", MANUAL_CONFIG, "```"].join("\n"),

    paragraphs("Want to see your tool listed?"),
    ctaList([{ label: "Tell us about it", href: TALLY_HREF }]),

    heading(2, "What can I do with MCP?"),
    ...capabilities.flatMap((capability) => [
      heading(3, capability.title),
      paragraphs(capability.description),
      // Labelled after the card's "Copy example prompt" affordance.
      `Example prompt: \`${capability.prompt}\``,
    ]),

    heading(2, "Start building with AI"),
    paragraphs(
      "Join thousands of developers, and agents, already using Prisma MCP for faster, more intuitive database workflows.",
    ),
    // readDocsHref is a literal prop in page.tsx rather than a hoisted const.
    ctaList([
      { label: "Add MCP server", href: DOCS_MCP },
      { label: "Read the docs", href: "https://www.prisma.io/docs/ai" },
    ]),
    paragraphs("2-minute setup. Works with all MCP tools."),
  ]);
}
