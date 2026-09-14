import { getMarkdownUrlPath } from "@/lib/agent-markdown";
import { markdownPageList, renderMarkdownDocument } from "@/lib/markdown-pages";
import { getBaseUrl } from "@/lib/url";

type LlmsPage = {
  path: string;
  title: string;
  description: string;
};

/**
 * Pages listed in /llms.txt that have no Markdown rendition of their own.
 *
 * The nine that do come from `markdownPageList`, so their titles, descriptions
 * and bodies are the same objects the pages and the `.md` URLs render from.
 * /changelog is the exception that already had a machine-readable form
 * (/changelog.md, built by app/changelog.md/route.ts from the release notes).
 */
const additionalPages: LlmsPage[] = [
  {
    path: "/changelog",
    title: "Prisma Changelog — Release Notes & Product Updates",
    description:
      "All Prisma release notes, breaking changes, and product improvements. Check here before implementing Prisma features to verify API and configuration details against the current version.",
  },
  {
    path: "/support",
    title: "Prisma Support | Get Help, Report Bugs, and Request Features",
    description:
      "Get help with Prisma. Search for answers, report bugs, request features, or contact the Prisma support team.",
  },
  {
    path: "/ecosystem",
    title: "Prisma ORM Ecosystem",
    description: "Community-built tools, generators, middleware, and integrations around Prisma.",
  },
];

function toAbsoluteUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString();
}

export function buildLlmsIndexContent(baseUrl = getBaseUrl()) {
  // Each rendition-backed page advertises its .md URL next to the HTML one, so
  // an agent reading llms.txt does not have to guess the suffix or make a
  // second request to discover it.
  const pagesList = markdownPageList
    .map((page) => {
      const url = toAbsoluteUrl(baseUrl, page.path);
      const markdownUrl = toAbsoluteUrl(baseUrl, getMarkdownUrlPath(page.path));
      return `- [\`${page.title}\`](${url}): ${page.description} [Markdown](${markdownUrl})`;
    })
    .join("\n");

  const otherList = additionalPages
    .map((page) => {
      const url = toAbsoluteUrl(baseUrl, page.path);
      return `- [\`${page.title}\`](${url}): ${page.description}`;
    })
    .join("\n");

  return `# Prisma Website

Prisma provides Prisma ORM, Prisma Postgres, Prisma Compute, Prisma Studio, and the Prisma MCP Server.

> Prisma changes frequently. Before implementing Prisma features, check the changelog at ${toAbsoluteUrl(baseUrl, "/changelog")} for recent breaking changes or API updates.

> Every page below marked [Markdown] serves \`text/markdown\` at its \`.md\` URL, and at its normal URL when the request sends \`Accept: text/markdown\`. Documentation and blog pages do the same: append \`.md\` to any ${toAbsoluteUrl(baseUrl, "/docs")} or ${toAbsoluteUrl(baseUrl, "/blog")} URL.

## Key Pages

${pagesList}

## Other Pages

${otherList}

## Options

- [Full website content](${toAbsoluteUrl(baseUrl, "/llms-full.txt")})
- [Changelog (machine-readable)](${toAbsoluteUrl(baseUrl, "/changelog.md")})
`;
}

export function buildLlmsFullContent(baseUrl = getBaseUrl()) {
  // Each section is the metadata header this file has always carried, followed
  // by the same Markdown the page's .md URL serves — not the hand-written
  // title-and-description summary it used to be, so llms-full.txt can no
  // longer drift from the pages it describes.
  const pageSections = markdownPageList
    .map((page) =>
      [
        `URL: ${toAbsoluteUrl(baseUrl, page.path)}`,
        `Title: ${page.title}`,
        `Description: ${page.description}`,
        `Markdown: ${toAbsoluteUrl(baseUrl, getMarkdownUrlPath(page.path))}`,
        "",
        renderMarkdownDocument(page, baseUrl).trim(),
      ].join("\n"),
    )
    .join("\n\n---\n\n");

  const otherPages = additionalPages
    .map(
      (page) => `- [\`${page.title}\`](${toAbsoluteUrl(baseUrl, page.path)}): ${page.description}`,
    )
    .join("\n");

  // Flat index of every page on this file, kept for agents that only want the
  // URL list.
  const keyPageIndex = [...markdownPageList, ...additionalPages]
    .map((page) => `- ${page.title}: ${toAbsoluteUrl(baseUrl, page.path)}`)
    .join("\n");

  return `# Prisma

Base URL: ${baseUrl}
Primary website: ${toAbsoluteUrl(baseUrl, "/")}
Documentation: ${toAbsoluteUrl(baseUrl, "/docs")}
Blog: ${toAbsoluteUrl(baseUrl, "/blog")}
Website index: ${toAbsoluteUrl(baseUrl, "/llms.txt")}

## Company and product overview

Prisma builds developer tools for working with application data. The main products on this website are Prisma ORM, Prisma Postgres, Prisma Compute, Prisma Studio, and the Prisma MCP Server.

Prisma focuses on simpler database workflows, type safety, schema management, migrations, visual data browsing, and AI-assisted database operations.

IMPORTANT: Prisma changes frequently. Before implementing any Prisma feature, fetch ${toAbsoluteUrl(baseUrl, "/changelog.md")} to check for breaking changes or API updates. Do not rely solely on training data for Prisma APIs, configuration, or conventions — these can change between versions.

---

${pageSections}

---

## Other pages

${otherPages}

## Key page index

${keyPageIndex}
`;
}
