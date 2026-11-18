import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  CONSOLE_URL,
  FEATURE_ROWS,
  OPEN_STUDIO_WAYS,
  STACK_FIT,
  STUDIO_DEFINITION,
  STUDIO_DOCS_URL,
  STUDIO_EMBED_DEMO_URL,
  STUDIO_FAQ,
  STUDIO_PORT,
  SUPPORTED_DATABASES,
  TRY_STUDIO_COMMAND,
} from "@/app/studio/studio-content";
import { stripFaqAnswerMarkup } from "@/lib/faq-answer";
import { bulletList, ctaList, heading, joinBlocks, paragraphs, table } from "./blocks";

export const STUDIO_H1 = "Prisma Studio: see and edit your database";
export const STUDIO_SUBHEADLINE =
  "A visual database editor and Postgres GUI for Prisma. Open it locally with one command, in VS Code, or in the Prisma Console. Works with PostgreSQL, MySQL and SQLite, with or without Prisma ORM.";

/** Markdown rendition of /studio (src/app/studio/page.tsx). */
export function renderStudioMarkdown(): string {
  return joinBlocks([
    // Hero: the H1 and subheadline are added by the caller. Rendition starts
    // at the hero CTAs.
    ctaList([
      { label: "Open Studio in Prisma Console", href: CONSOLE_URL },
      { label: "Try locally with npx prisma studio", href: STUDIO_DOCS_URL },
    ]),

    // Standalone definition paragraph: the answer a featured snippet quotes.
    heading(2, "What is Prisma Studio?"),
    paragraphs(STUDIO_DEFINITION),

    // Four surfaces Studio runs on.
    heading(2, "Four ways to open Prisma Studio"),
    ...OPEN_STUDIO_WAYS.flatMap((way) => [
      heading(3, way.title),
      paragraphs(`*${way.eyebrow}*`),
      paragraphs(way.description),
      ctaList([{ label: way.linkLabel, href: way.href }]),
    ]),

    // Try it out: ink terminal card.
    heading(2, `Try \`npx prisma studio\` on port ${STUDIO_PORT}`),
    paragraphs(
      "Take Studio for a spin with a pre-seeded local database and example project. The command bootstraps a Prisma project and opens Studio at `http://localhost:" +
        STUDIO_PORT +
        "`.",
    ),
    ["```bash", TRY_STUDIO_COMMAND, "```"].join("\n"),

    // Feature tour. Each row's eyebrow stays as a bold lead-in above the prose.
    ...FEATURE_ROWS.flatMap((row) => [
      heading(3, row.title),
      `**${row.eyebrow}**`,
      paragraphs(row.description),
    ]),

    // Supported databases.
    heading(2, "Which databases Prisma Studio works with"),
    paragraphs(
      "Prisma Studio supports PostgreSQL, MySQL and SQLite across every surface: locally, in VS Code, in the Prisma Console (for Prisma Postgres) and through the embedded React component. CockroachDB and MongoDB are not supported yet.",
    ),
    bulletList(SUPPORTED_DATABASES.map((db) => `**${db.name}** — ${db.description}`)),

    // Comparison table. Headers match COMPARISON_COLUMNS with the feature
    // name column up front, so every row in the content object survives.
    heading(2, "Prisma Studio compared with pgAdmin, TablePlus, DBeaver and Drizzle Studio"),
    paragraphs(
      "A short, fair side-by-side with the Postgres and database GUIs people weigh against Prisma Studio. Each of these is a solid tool in its own right; pick the one whose strengths match how you work.",
    ),
    table(
      ["Feature", ...COMPARISON_COLUMNS],
      COMPARISON_ROWS.map((row) => [
        row.feature,
        row.prismaStudio.summary,
        row.pgadmin.summary,
        row.tableplus.summary,
        row.dbeaver.summary,
        row.drizzleStudio.summary,
      ]),
    ),

    // Prisma stack: Studio alongside ORM, Postgres, Compute.
    heading(2, "Prisma Studio across the Prisma stack"),
    paragraphs(
      "Studio works on its own, with any of the three Prisma products, or with all of them at once. The more you use, the more Studio knows about your data.",
    ),
    ...STACK_FIT.flatMap((item) => [
      heading(3, item.product),
      paragraphs(item.body),
      ctaList([{ label: `Learn about ${item.product}`, href: item.href }]),
    ]),

    // FAQ. Each answer is stripped of inline markup so the rendition carries
    // plain text, same as the FAQPage JSON-LD on the HTML page.
    heading(2, "Frequently asked questions"),
    ...STUDIO_FAQ.flatMap((item) => [
      heading(3, item.question),
      paragraphs(stripFaqAnswerMarkup(item.answer)),
    ]),

    // Closer.
    heading(2, "Open your database, in your browser"),
    paragraphs(
      "Run one command to open Studio on your own database, or sign in to the Prisma Console to open a shared Studio on a Prisma Postgres database with your team.",
    ),
    ctaList([
      { label: "Open Studio in Prisma Console", href: CONSOLE_URL },
      { label: "See the embed demo on GitHub", href: STUDIO_EMBED_DEMO_URL },
    ]),
  ]);
}
