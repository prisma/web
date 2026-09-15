import { computeContent } from "@/components/product/content/compute";
import { ormContent, ormFeedback, ormMigrations } from "@/components/product/content/orm";
import { postgresContent } from "@/components/product/content/postgres";
import {
  AGENT_MARKDOWN_PATHS,
  getMarkdownUrlPath,
  type AgentMarkdownPath,
} from "@/lib/agent-markdown";
import {
  ENTERPRISE_H1,
  ENTERPRISE_SUBHEADLINE,
  renderEnterpriseMarkdown,
} from "./markdown/enterprise";
import { HOME_H1, HOME_SUBHEADLINE, renderHomeMarkdown } from "./markdown/home";
import { MCP_H1, MCP_SUBHEADLINE, renderMcpMarkdown } from "./markdown/mcp";
import { PRICING_H1, PRICING_SUBHEADLINE, renderPricingMarkdown } from "./markdown/pricing";
import { productH1, productSubheadline, renderProductMarkdown } from "./markdown/product";
import { STACK_H1, STACK_SUBHEADLINE, renderStackMarkdown } from "./markdown/stack";
import { STUDIO_H1, STUDIO_SUBHEADLINE, renderStudioMarkdown } from "./markdown/studio";
import { SITE_HOME_DESCRIPTION, SITE_HOME_TITLE } from "@/lib/site-metadata";
import { getBaseUrl } from "@/lib/url";

/**
 * The marketing pages that have a Markdown rendition, and how to build it.
 *
 * `title` and `description` are the page's SEO metadata (what /llms.txt lists);
 * `h1` and `subheadline` are the page's own copy, which is what the Markdown
 * document opens with, because the audit asks for semantic parity with the
 * HTML rather than a metadata stub.
 *
 * Keep the keys in step with `AGENT_MARKDOWN_PATHS` — `agent-markdown.test.ts`
 * asserts it.
 */
export type MarkdownPage = {
  path: AgentMarkdownPath;
  title: string;
  description: string;
  /** The page's `<h1>`, verbatim. */
  h1: string;
  /** The paragraph directly under the `<h1>`. */
  subheadline: string;
  /** Everything after the subheadline. */
  renderBody: () => string;
};

export const markdownPages: Record<AgentMarkdownPath, MarkdownPage> = {
  "/": {
    path: "/",
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    h1: HOME_H1,
    subheadline: HOME_SUBHEADLINE,
    renderBody: renderHomeMarkdown,
  },
  "/orm": {
    path: "/orm",
    title: "Prisma ORM | Type-Safe ORM for TypeScript and Node.js",
    description:
      "Prisma ORM is a type-safe ORM for TypeScript and Node.js. Model your data, run migrations, and query your database, with access your agent can't get wrong.",
    h1: productH1(ormContent),
    subheadline: productSubheadline(ormContent),
    // /orm composes the template's sections itself and adds two of its own
    // between the features and the platform section — see app/orm/page.tsx.
    renderBody: () =>
      renderProductMarkdown({
        content: ormContent,
        afterFeatures: [
          {
            kind: "narrative",
            headline: ormMigrations.headline,
            paragraphs: ormMigrations.paragraphs,
          },
          {
            kind: "detail-blocks",
            headline: ormFeedback.headline,
            bridge: ormFeedback.bridge,
            blocks: ormFeedback.blocks,
          },
        ],
      }),
  },
  "/postgres": {
    path: "/postgres",
    title: "Prisma Postgres | Serverless PostgreSQL for TypeScript Apps",
    description:
      "Prisma Postgres is a production-ready serverless PostgreSQL database with instant setup, built-in connection pooling, automated backups, and usage-based pricing, already wired to your stack.",
    h1: productH1(postgresContent),
    subheadline: productSubheadline(postgresContent),
    renderBody: () => renderProductMarkdown({ content: postgresContent }),
  },
  "/compute": {
    path: "/compute",
    title: "Prisma Compute | Deploy TypeScript Apps and AI Agents on Bun",
    description:
      "Prisma Compute deploys TypeScript apps, APIs, and AI agents from your repo as long-lived Bun processes next to Prisma Postgres, with long-running requests and streaming. One platform for your app and its database.",
    h1: productH1(computeContent),
    subheadline: productSubheadline(computeContent),
    // /compute is the template minus the testimonials section.
    renderBody: () => renderProductMarkdown({ content: computeContent, testimonials: false }),
  },
  "/pricing": {
    path: "/pricing",
    title: "Prisma Pricing | Usage-Based Plans for Postgres and Compute",
    description:
      "Usage-based pricing for your whole stack — Prisma Compute app hosting and Prisma Postgres databases. Pay for the work your app does, not seats or deploys. Free tier with no time limit, hard spend limits on every paid plan.",
    h1: PRICING_H1,
    subheadline: PRICING_SUBHEADLINE,
    renderBody: renderPricingMarkdown,
  },
  "/studio": {
    path: "/studio",
    title: "Prisma Studio | Visual Database Browser and Editor",
    description:
      "Explore, edit, and understand your data with a visual database browser for Prisma, locally or in Prisma Console.",
    h1: STUDIO_H1,
    subheadline: STUDIO_SUBHEADLINE,
    renderBody: renderStudioMarkdown,
  },
  "/stack": {
    path: "/stack",
    title: "The Prisma Stack | ORM, Postgres, and Compute for TypeScript",
    description:
      "ORM, Postgres, and Compute, one platform for your app and its database, with one shared context across your stack.",
    h1: STACK_H1,
    subheadline: STACK_SUBHEADLINE,
    renderBody: renderStackMarkdown,
  },
  "/enterprise": {
    path: "/enterprise",
    title: "Prisma Enterprise | ORM Support and Database Workflows for Teams",
    description:
      "Enterprise-level support, security, and guidance for teams running Prisma in production.",
    h1: ENTERPRISE_H1,
    subheadline: ENTERPRISE_SUBHEADLINE,
    renderBody: renderEnterpriseMarkdown,
  },
  "/mcp": {
    path: "/mcp",
    title: "Prisma MCP Server — AI-Powered Database Management",
    description:
      "Manage Prisma Postgres databases with natural language in AI tools like Cursor, Claude Code, ChatGPT, and VS Code.",
    h1: MCP_H1,
    subheadline: MCP_SUBHEADLINE,
    renderBody: renderMcpMarkdown,
  },
};

/** The supported pages in the order /llms.txt should list them. */
export const markdownPageList: MarkdownPage[] = AGENT_MARKDOWN_PATHS.map(
  (path) => markdownPages[path],
);

export function getMarkdownPage(path: string): MarkdownPage | undefined {
  return (markdownPages as Record<string, MarkdownPage | undefined>)[path];
}

/**
 * The complete Markdown document for a page: the same opening shape apps/docs
 * uses (`# Title (url)`, the llms.txt pointer, then the description) followed
 * by the page's own copy.
 */
export function renderMarkdownDocument(page: MarkdownPage, baseUrl = getBaseUrl()): string {
  const llmsTxtUrl = new URL("/llms.txt", baseUrl).toString();
  const markdownPath = getMarkdownUrlPath(page.path);

  return `# ${page.h1} (${page.path})

> ${page.title}. For the complete Prisma website index, see [llms.txt](${llmsTxtUrl}). A Markdown version of any listed page is available at its \`.md\` URL — this one is \`${markdownPath}\`.

${page.description}

${page.subheadline}

${page.renderBody()}
`;
}

/** Convenience for callers that only have a pathname. */
export function renderMarkdownForPath(path: string, baseUrl = getBaseUrl()): string | undefined {
  const page = getMarkdownPage(path);
  return page ? renderMarkdownDocument(page, baseUrl) : undefined;
}
