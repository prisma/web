import { getPageTitleText } from "./page-title";
import { withDocsBasePath } from "./urls";

type LLMsLink = {
  title: string;
  href: string;
  description: string;
};

type LLMsPage = {
  data: {
    title: string;
    description?: string;
  };
  url: string;
};

type LLMsFullPage = {
  data: {
    title: string;
  };
};

export type LLMsSection = {
  slug: string;
  title: string;
  description: string;
  prefixes: string[];
  excludePrefixes?: string[];
};

type LLMsExcludedProduct = {
  prefixes: string[];
  urlPatterns?: RegExp[];
  titlePatterns?: RegExp[];
  descriptionPatterns?: RegExp[];
};

const excludedLLMsProducts: LLMsExcludedProduct[] = [
  {
    prefixes: ["/accelerate"],
    urlPatterns: [/(^|\/)accelerate($|[/-])/i],
    titlePatterns: [/\bAccelerate\b/i],
    descriptionPatterns: [/\bAccelerate\b/i],
  },
  {
    prefixes: ["/optimize"],
    titlePatterns: [/\bPrisma Optimize\b/i],
    descriptionPatterns: [/\bPrisma Optimize\b/i],
  },
];

export const commonQueries: LLMsLink[] = [
  {
    title: "Check the Prisma changelog for recent changes",
    href: "https://www.prisma.io/changelog.md",
    description:
      "Prisma changes frequently. Fetch this machine-readable changelog before implementing any Prisma feature to check for breaking changes, API updates, or new conventions.",
  },
  {
    title: "Start a new Prisma ORM project",
    href: "/prisma-orm/quickstart/prisma-postgres",
    description: "Set up Prisma ORM, Prisma Client, and Prisma Postgres in a new TypeScript app.",
  },
  {
    title: "Try Prisma 8 (Early Access)",
    href: "/next/getting-started",
    description:
      "Choose a Prisma 8 quickstart for a new project or add Prisma 8 to an existing app.",
  },
  {
    title: "Connect to Prisma Postgres",
    href: "/postgres/database/connecting-to-your-database",
    description:
      "Choose the right connection string for Prisma ORM, PostgreSQL tools, and serverless runtimes.",
  },
  {
    title: "Run Prisma Postgres locally",
    href: "/postgres/database/local-development",
    description:
      "Use local Prisma Postgres during development and switch to a hosted database for production.",
  },
  {
    title: "Manage database connections",
    href: "/orm/prisma-client/setup-and-configuration/databases-connections",
    description:
      "Configure Prisma Client connection management for long-running and serverless apps.",
  },
  {
    title: "Create and apply migrations",
    href: "/orm/prisma-migrate/getting-started",
    description: "Use Prisma Migrate to evolve your database schema in development.",
  },
  {
    title: "Deploy migrations safely",
    href: "/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate",
    description: "Apply schema changes in production with Prisma Migrate.",
  },
  {
    title: "Use Query Insights",
    href: "/query-insights",
    description: "Inspect slow queries, connect Prisma calls to SQL, and apply focused fixes.",
  },
  {
    title: "Set up the Prisma MCP server",
    href: "/ai/tools/mcp-server",
    description:
      "Connect AI agents to Prisma Postgres workflows with the local or remote MCP server.",
  },
  {
    title: "Use the Prisma Client API",
    href: "/orm/reference/prisma-client-reference",
    description: "Look up Prisma Client query APIs, options, and generated types.",
  },
  {
    title: "Use the Prisma CLI",
    href: "/orm/reference/prisma-cli-reference",
    description:
      "Look up Prisma CLI commands for init, generate, migrate, db, and studio workflows.",
  },
  {
    title: "Troubleshoot Prisma ORM errors",
    href: "/orm/reference/errors",
    description: "Find common Prisma ORM errors and links to deeper troubleshooting pages.",
  },
  {
    title: "Troubleshoot Prisma Postgres",
    href: "/postgres/troubleshooting",
    description: "Resolve common Prisma Postgres issues.",
  },
  {
    title: "Review pricing",
    href: "https://www.prisma.io/pricing",
    description:
      "Compare Prisma plans and pricing for Prisma Postgres and Prisma platform features.",
  },
  {
    title: "Use Prisma Postgres with Next.js",
    href: "/guides/frameworks/nextjs",
    description: "Set up Prisma ORM and Prisma Postgres in a Next.js app with App Router.",
  },
  {
    title: "Use Prisma Postgres with SvelteKit",
    href: "/guides/frameworks/sveltekit",
    description: "Set up Prisma ORM and Prisma Postgres in a SvelteKit application.",
  },
  {
    title: "Use Prisma Postgres with Nuxt",
    href: "/guides/frameworks/nuxt",
    description: "Set up Prisma ORM and Prisma Postgres in a Nuxt application.",
  },
  {
    title: "Use Prisma Postgres with Hono on Cloudflare Workers",
    href: "/guides/frameworks/hono",
    description:
      "Set up Prisma ORM and Prisma Postgres in a Hono app deployed to Cloudflare Workers.",
  },
];

export const llmsSections: LLMsSection[] = [
  {
    slug: "orm",
    title: "Prisma ORM",
    description:
      "Current Prisma ORM docs: setup, schema modeling, Prisma Client, migrations, and references (excludes legacy v6 and Prisma 8).",
    prefixes: ["/orm", "/prisma-orm"],
    excludePrefixes: ["/orm/v6", "/orm/next"],
  },
  {
    slug: "orm-v6",
    title: "Prisma ORM v6 (legacy)",
    description:
      "Legacy Prisma ORM v6 documentation, maintained for backwards compatibility only. Prefer the current Prisma ORM section for new work.",
    prefixes: ["/orm/v6"],
  },
  {
    slug: "next",
    title: "Prisma 8 (Early Access)",
    description:
      "Prisma 8, the next major version of Prisma ORM, available in Early Access. A ground-up TypeScript rewrite that keeps the schema-first workflow while making it extensible, composable, and AI-agent friendly. Covers setup, ORM, guides, and CLI docs for Prisma 8.",
    prefixes: ["/next", "/orm/next", "/guides/next", "/cli/next"],
  },
  {
    slug: "postgres",
    title: "Prisma Postgres",
    description:
      "Prisma Postgres setup, connection strings, local development, operations, and guides.",
    prefixes: ["/postgres", "/prisma-postgres"],
  },
  {
    slug: "guides",
    title: "Guides",
    description:
      "End-to-end guides for using Prisma ORM and Prisma Postgres with popular frameworks and runtimes (Prisma 8 guides live in the Prisma 8 section).",
    prefixes: ["/guides"],
    excludePrefixes: ["/guides/next"],
  },
  {
    slug: "ai",
    title: "Prisma & AI",
    description:
      "Using Prisma with AI tools and agents: MCP server, editor integrations, prompts, and tutorials.",
    prefixes: ["/ai"],
  },
  {
    slug: "cli",
    title: "Prisma CLI",
    description:
      "Prisma CLI command reference for init, generate, migrate, db, studio, and more (Prisma 8 CLI docs live in the Prisma 8 section).",
    prefixes: ["/cli"],
    excludePrefixes: ["/cli/next"],
  },
  {
    slug: "platform",
    title: "Prisma Platform",
    description:
      "Prisma Console and the Management API for managing projects, environments, and deployments.",
    prefixes: ["/console", "/management-api"],
  },
  {
    slug: "compute",
    title: "Prisma Compute",
    description:
      "Prisma Compute (Public Beta): TypeScript app hosting that runs alongside Prisma Postgres, with database branches, isolated branch previews, and a CLI-first deploy workflow.",
    prefixes: ["/compute"],
  },
  {
    slug: "studio",
    title: "Prisma Studio",
    description: "Prisma Studio for browsing and editing data in your Prisma Postgres database.",
    prefixes: ["/studio"],
  },
  {
    slug: "query-insights",
    title: "Query Insights",
    description: "Query performance analysis, slow query inspection, and Prisma SQL comment setup.",
    prefixes: [
      "/query-insights",
      "/postgres/database/query-insights",
      "/orm/prisma-client/queries/advanced/query-optimization-performance",
    ],
  },
  {
    slug: "mcp",
    title: "Prisma MCP",
    description: "MCP server setup for Prisma Postgres and Prisma CLI workflows.",
    prefixes: ["/ai/tools/mcp-server", "/cli/mcp"],
  },
];

function resolveLLMsHref(href: string, baseUrl: string) {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(href)) return href;
  return `${baseUrl}${withDocsBasePath(href)}`;
}

function normalizeInternalHref(href: string) {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(href)) return undefined;

  const pathname = href.split(/[?#]/, 1)[0];
  if (pathname === "/docs") return "/";
  if (pathname.startsWith("/docs/")) return pathname.slice("/docs".length);
  return pathname;
}

function hasPageForHref(href: string, pages: LLMsPage[]) {
  const pathname = normalizeInternalHref(href);
  if (!pathname) return true;
  return pages.some((page) => page.url === pathname);
}

function matchesLLMsPagePrefix(page: LLMsPage, prefixes: string[]) {
  return prefixes.some((prefix) => page.url === prefix || page.url.startsWith(`${prefix}/`));
}

function matchesAnyPattern(value: string, patterns: RegExp[] | undefined) {
  return patterns?.some((pattern) => pattern.test(value)) ?? false;
}

function isExcludedLLMsPage(page: LLMsPage) {
  return excludedLLMsProducts.some(
    (product) =>
      matchesLLMsPagePrefix(page, product.prefixes) ||
      matchesAnyPattern(page.url, product.urlPatterns) ||
      matchesAnyPattern(getPageTitleText(page.data.title, page.url), product.titlePatterns) ||
      matchesAnyPattern(page.data.description ?? "", product.descriptionPatterns),
  );
}

export function filterPagesForLLMsIndex<T extends LLMsPage>(pages: T[]) {
  return pages.filter((page) => !isExcludedLLMsPage(page));
}

export function formatLLMsLink(link: LLMsLink, baseUrl: string) {
  return `- [\`${link.title}\`](${resolveLLMsHref(link.href, baseUrl)}): ${link.description}`;
}

export function filterAvailableLLMsLinks(links: LLMsLink[], pages: LLMsPage[]) {
  return links.filter((link) => hasPageForHref(link.href, pages));
}

export function formatLLMsPageLink(page: LLMsPage, baseUrl: string) {
  const title = getPageTitleText(page.data.title, page.url);
  const description = page.data.description || "";
  const path = `${baseUrl}${withDocsBasePath(page.url)}`;

  return `- [\`${title}\`](${path}): ${description}`;
}

export function formatLLMsSectionLink(section: LLMsSection, baseUrl: string) {
  const href = `${baseUrl}${withDocsBasePath(`/llms/${section.slug}.txt`)}`;

  return `- [\`${section.title}\`](${href}): ${section.description}`;
}

function matchesPrefixList(url: string, prefixes: string[]) {
  return prefixes.some((prefix) => url === prefix || url.startsWith(`${prefix}/`));
}

function pageBelongsToSection(url: string, section: LLMsSection) {
  if (!matchesPrefixList(url, section.prefixes)) return false;
  if (section.excludePrefixes && matchesPrefixList(url, section.excludePrefixes)) return false;
  return true;
}

export function filterPagesForLLMsSection<T extends { url: string }>(
  pages: T[],
  section: LLMsSection,
) {
  return pages.filter((page) => pageBelongsToSection(page.url, section));
}

/**
 * Returns pages that are not covered by any of the provided sections. Used to
 * guarantee full coverage in the root llms.txt: every non-excluded page must be
 * reachable either directly in the root file or via a section file.
 */
export function getUnmatchedLLMsPages<T extends { url: string }>(
  pages: T[],
  sections: LLMsSection[],
) {
  return pages.filter(
    (page) => !sections.some((section) => pageBelongsToSection(page.url, section)),
  );
}

export function filterAvailableLLMsSections(sections: LLMsSection[], pages: LLMsPage[]) {
  return sections.filter((section) => filterPagesForLLMsSection(pages, section).length > 0);
}

export function getLLMsSection(slug: string, pages?: LLMsPage[]) {
  const sections = pages ? filterAvailableLLMsSections(llmsSections, pages) : llmsSections;
  return sections.find((section) => section.slug === slug);
}

function sortPagesByTitle<T extends LLMsPage>(pages: T[]) {
  return [...pages].sort((a, b) =>
    getPageTitleText(a.data.title, a.url).localeCompare(getPageTitleText(b.data.title, b.url)),
  );
}

/**
 * Builds the full body of the root `llms.txt` file. Shared by the route handler
 * (`app/llms.txt/route.ts`) and the agent-readiness guard so the guard measures
 * exactly what the route serves. Accepts the raw source pages; filtering and
 * sorting happen here.
 */
export function buildLLMsIndexContent(pages: LLMsPage[], baseUrl: string): string {
  const latestPages = sortPagesByTitle(filterPagesForLLMsIndex(pages));

  const availableSections = filterAvailableLLMsSections(llmsSections, latestPages);

  const commonQueriesList = filterAvailableLLMsLinks(commonQueries, latestPages)
    .map((link) => formatLLMsLink(link, baseUrl))
    .join("\n");
  const subIndexList = availableSections
    .map((section) => formatLLMsSectionLink(section, baseUrl))
    .join("\n");
  const otherPages = getUnmatchedLLMsPages(latestPages, availableSections);
  const otherPagesList = otherPages.map((page) => formatLLMsPageLink(page, baseUrl)).join("\n");
  const otherPagesSection = otherPagesList
    ? `

## Other pages

${otherPagesList}`
    : "";

  return `# Prisma Documentation

> **Prisma changes frequently — verify against the changelog and current docs before implementing.**
> Do not rely on training data for Prisma features. APIs, configuration, and conventions can change between versions.
>
> First, fetch https://www.prisma.io/changelog.md to check for recent or relevant breaking changes,
> then look up the relevant topic in the documentation below.

> This index links to per-area indexes below. Each area index lists its pages with descriptions.
> Append \`.md\` to any docs page URL to fetch its Markdown. Legacy Prisma ORM v6 pages are listed under
> the "Prisma ORM v6 (legacy)" area and are maintained for backwards compatibility only.

## Common Queries

${commonQueriesList}

## Product Area Indexes

${subIndexList}${otherPagesSection}

## Options

- [Full documentation with content](${baseUrl}${withDocsBasePath("/llms-full.txt")})
`;
}

/**
 * Builds the full body of a per-area `llms/<slug>.txt` file. Shared by the route
 * handler (`app/llms/[...slug]/route.ts`) and the agent-readiness guard. Accepts
 * the index-filtered pages (`filterPagesForLLMsIndex(source.getPages())`);
 * section filtering and sorting happen here.
 */
export function buildLLMsSectionContent(
  section: LLMsSection,
  pages: LLMsPage[],
  baseUrl: string,
): string {
  const sectionPages = sortPagesByTitle(filterPagesForLLMsSection(pages, section));
  const docsList =
    sectionPages.map((page) => formatLLMsPageLink(page, baseUrl)).join("\n") ||
    "_No pages currently match this section._";

  return `# Prisma Documentation - ${section.title}

> ${section.description}

${docsList}
`;
}

/**
 * Pages included in `llms-full.txt`: the index-filtered set (excluded products
 * removed) minus legacy Prisma ORM v6 pages. Shared by the route handler and the
 * guard so the exclusion rules cannot drift between them.
 */
export function getLLMsFullPages<T extends LLMsPage>(pages: T[]): T[] {
  return filterPagesForLLMsIndex(pages).filter(
    (page) => page.url !== "/orm/v6" && !page.url.startsWith("/orm/v6/"),
  );
}

export function createLLMsFullResponse<TPage extends LLMsFullPage>(
  description: string,
  pages: TPage[],
  renderPage: (page: TPage) => Promise<string>,
) {
  const encoder = new TextEncoder();
  let pageIndex = -1;
  const stream = new ReadableStream({
    async pull(controller) {
      if (pageIndex === -1) {
        pageIndex = 0;
        controller.enqueue(encoder.encode(description));
        return;
      }

      const page = pages[pageIndex];
      pageIndex += 1;

      if (!page) {
        controller.close();
        return;
      }

      try {
        controller.enqueue(encoder.encode(`${await renderPage(page)}\n\n`));
      } catch (error) {
        console.error("docs:llms_full_page_render_error", {
          title: getPageTitleText(page.data.title, "Unknown page"),
          error,
        });
        controller.enqueue(
          encoder.encode(
            `# ${getPageTitleText(page.data.title, "Unknown page")}\n\nThis page could not be rendered for the full documentation feed.\n\nAn internal error occurred while rendering this page.\n\n`,
          ),
        );
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
