import { getMarkdownUrlPath } from "@/lib/agent-markdown";
import { markdownPageList, renderMarkdownDocument } from "@/lib/markdown-pages";
import { getBaseUrl } from "@/lib/url";
import { getAnswerEntries, renderAnswerMarkdown } from "@/lib/answer-page-content";
import { answerProducts } from "@/lib/answer-products";

type LlmsPage = {
  path: string;
  title: string;
  description: string;
};

/**
 * Pages listed in /llms.txt that have no Markdown rendition of their own.
 *
 * Those that do come from `markdownPageList`, so their titles, descriptions
 * and bodies are the same objects the pages and the `.md` URLs render from.
 * /changelog is the exception that already had a machine-readable form
 * (/changelog.md, built by app/changelog.md/route.ts from the release notes).
 */
const additionalPages: LlmsPage[] = [
  ...Object.values(answerProducts).map((product) => ({
    path: product.guidesPath,
    title: product.guidesTitle,
    description: product.description,
  })),
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
  {
    path: "/extensions",
    title: "Prisma 8 Extensions | Vector search, geospatial, caching, and more",
    description:
      "Directory of extensions and middleware for Prisma ORM 8, by Prisma and the community, with install commands and a submission form.",
  },
];

/**
 * Key Pages served by the blog and docs apps rather than this one.
 *
 * Both apps serve a Markdown rendition at the page's `.md` URL and honour
 * `Accept: text/markdown`, so these entries carry a [Markdown] link like the
 * site's own Key Pages. Titles are the pages' metaTitle frontmatter
 * (apps/blog/content/blog/host-a-test-version-without-replacing-production/index.mdx
 * and apps/docs/content/docs/compute/deploy-on-push.mdx); llms-content.test.ts
 * fails if they drift.
 */
export const crossAppKeyPages: LlmsPage[] = [
  {
    path: "/blog/host-a-test-version-without-replacing-production",
    title: "Host a test version without replacing production: previews and staging (2026)",
    description:
      "Deploy the new version from a Git branch to a preview or staging environment with its own URL and test database; only the main branch deploys production. Covers Fly.io, Netlify, Prisma Compute, Railway, Render and Vercel.",
  },
  {
    path: "/docs/compute/deploy-on-push",
    title: "Preview and staging environments per Git branch | Prisma Compute",
    description:
      "Set up deploy on push for Prisma Compute: every branch you push other than the default one gets a preview environment with its own URL, its own services and, for databases declared in the Composer module, its own new database; production data is not copied. If the app reads DATABASE_URL, a preview is only as separate as that value. The default branch deploys production, and a branch you keep, such as staging, works as a staging environment.",
  },
];

/** Resolve a root-relative page path against the requested website origin. */
function toAbsoluteUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString();
}

/** Build the website's llms index, including every guide and its Markdown URL. */
export function buildLlmsIndexContent(baseUrl = getBaseUrl()) {
  const answersList = getAnswerEntries()
    .map(
      (page) =>
        `- [${page.data.title}](${toAbsoluteUrl(baseUrl, page.url)}): ${page.data.description} [Markdown](${toAbsoluteUrl(baseUrl, `${page.url}.md`)})`,
    )
    .join("\n");
  // Each rendition-backed page advertises its .md URL next to the HTML one, so
  // an agent reading llms.txt does not have to guess the suffix or make a
  // second request to discover it.
  const pagesList = [...markdownPageList, ...crossAppKeyPages]
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

> Every page below marked [Markdown] has a Markdown rendition at its \`.md\` URL, served as \`text/plain\` so every assistant's URL fetcher accepts it. Key Pages and Product guides also serve Markdown at their normal URL when the request sends \`Accept: text/markdown\`. Documentation and blog pages have renditions too: append \`.md\` to any ${toAbsoluteUrl(baseUrl, "/docs")} or ${toAbsoluteUrl(baseUrl, "/blog")} URL.

## Key Pages

${pagesList}

## Product guides

${answersList}

## Other Pages

${otherList}

## Options

- [Full website content](${toAbsoluteUrl(baseUrl, "/llms-full.txt")})
- [Changelog (machine-readable)](${toAbsoluteUrl(baseUrl, "/changelog.md")})
`;
}

/** Combine marketing-page and guide renditions into the full website Markdown export. */
export function buildLlmsFullContent(baseUrl = getBaseUrl()) {
  const answerSections = getAnswerEntries()
    .map(
      (page) =>
        `URL: ${toAbsoluteUrl(baseUrl, page.url)}\nMarkdown: ${toAbsoluteUrl(baseUrl, `${page.url}.md`)}\n\n${renderAnswerMarkdown(page)}`,
    )
    .join("\n\n---\n\n");
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
  const keyPageIndex = [
    ...markdownPageList,
    ...additionalPages,
    ...getAnswerEntries().map((page) => ({ title: page.data.title, path: page.url })),
  ]
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

${answerSections}

---

## Other pages

${otherPages}

## Key page index

${keyPageIndex}
`;
}
