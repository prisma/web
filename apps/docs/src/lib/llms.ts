import { withDocsBasePath } from "./urls";

type LLMsLink = {
  title: string;
  href: string;
  description: string;
};

type LLMsFullPage = {
  data: {
    title: string;
  };
};

type LLMsSection = {
  slug: string;
  title: string;
  description: string;
  prefixes: string[];
};

export const commonQueries: LLMsLink[] = [
  {
    title: "Start a new Prisma ORM project",
    href: "/prisma-orm/quickstart/prisma-postgres",
    description: "Set up Prisma ORM, Prisma Client, and Prisma Postgres in a new TypeScript app.",
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
];

export const llmsSections: LLMsSection[] = [
  {
    slug: "orm",
    title: "Prisma ORM",
    description: "Prisma ORM setup, schema modeling, Prisma Client, migrations, and references.",
    prefixes: ["/orm", "/prisma-orm"],
  },
  {
    slug: "postgres",
    title: "Prisma Postgres",
    description:
      "Prisma Postgres setup, connection strings, local development, operations, and guides.",
    prefixes: ["/postgres", "/prisma-postgres"],
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

export function formatLLMsLink(link: LLMsLink, baseUrl: string) {
  return `- [\`${link.title}\`](${resolveLLMsHref(link.href, baseUrl)}): ${link.description}`;
}

export function formatLLMsPageLink(
  page: { data: { title: string; description?: string }; url: string },
  baseUrl: string,
) {
  const title = page.data.title;
  const description = page.data.description || "";
  const path = `${baseUrl}${withDocsBasePath(page.url)}`;

  return `- [\`${title}\`](${path}): ${description}`;
}

export function formatLLMsSectionLink(section: LLMsSection, baseUrl: string) {
  const href = `${baseUrl}${withDocsBasePath(`/llms/${section.slug}.txt`)}`;

  return `- [\`${section.title}\`](${href}): ${section.description}`;
}

export function getLLMsSection(slug: string) {
  return llmsSections.find((section) => section.slug === slug);
}

export function filterPagesForLLMsSection<T extends { url: string }>(
  pages: T[],
  section: LLMsSection,
) {
  return pages.filter((page) =>
    section.prefixes.some((prefix) => page.url === prefix || page.url.startsWith(`${prefix}/`)),
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
        const message = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue(
          encoder.encode(
            `# ${page.data.title}\n\nThis page could not be rendered for the full documentation feed.\n\n${message}\n\n`,
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
