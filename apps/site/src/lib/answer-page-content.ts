import { getAllContent } from "./content";
import { answerPageSchema } from "./answer-page-schema";
import { answerProductIds, type AnswerProduct } from "./answer-products";

/** Read validated product guides without loading compiled MDX, for discovery and scripts. */
export function getAnswerEntries(product?: AnswerProduct) {
  return (product ? [product] : answerProductIds)
    .flatMap((productId) =>
      getAllContent(`answers/${productId}`).map((entry) => ({
        ...entry,
        data: answerPageSchema.parse(entry.frontmatter),
        product: productId,
        url: `/${productId}/${entry.slug}`,
      })),
    )
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.url.localeCompare(b.url));
}

export type AnswerEntry = ReturnType<typeof getAnswerEntries>[number];

/** Render the shared guide content as Markdown, including text equivalents of custom visuals. */
export function renderAnswerMarkdown({ data, content }: AnswerEntry) {
  return [
    `# ${data.title}`,
    data.summary,
    `By [${data.author}](${data.authorUrl}) · ${data.date} · ${data.readingTime}${data.updatedAt !== data.date ? ` · Updated ${data.updatedAt}` : ""}`,
    content
      .trim()
      .replace(
        /<EnvironmentDiagram\s*\/>/g,
        "Test: feature branch → own app and API → separate database with synthetic records.\n\nProduction: protected main → own app and API → customer database.\n\nEach app uses its own database credentials. The assistant gets access to the test environment.",
      )
      .replace(
        /<ServerlessPathsDiagram\s*\/>/g,
        "How apps reach Prisma Postgres: serverless functions and Prisma Compute apps → `pooled.db.prisma.io` (PgBouncer, transaction mode, TCP port 5432). Edge runtimes → serverless driver over HTTP and WebSockets. Migrations, Prisma Studio and `pg_dump` → `db.prisma.io` (direct connection, session state kept). All three reach one PostgreSQL database in the region you chose.",
      ),
    "## Frequently asked questions",
    ...data.faq.map(({ question, answer }) => `### ${question}\n\n${answer}`),
    `## ${data.cta.title}\n\n${data.cta.description}\n\n${data.cta.command ? `\`${data.cta.command}\`\n\n` : ""}[${data.cta.label}](${data.cta.href})`,
    "## Related guides",
    ...data.related.map(({ title, href }) => `- [${title}](${href})`),
  ].join("\n\n");
}
