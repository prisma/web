import { TESTIMONIALS } from "@/components/sections/testimonials-data";
import {
  FREE_POSTGRES_HERO_SECONDARY_CTA,
  FREE_POSTGRES_CLOSER_BENEFITS,
  FREE_POSTGRES_CLOSER_BODY,
  FREE_POSTGRES_CLOSER_HEADLINE,
  FREE_POSTGRES_COMPARE_INTRO,
  FREE_POSTGRES_COMPARE_LINKS,
  FREE_POSTGRES_FAQ,
  FREE_POSTGRES_FEATURE_ITEMS,
  FREE_POSTGRES_FEATURES_HEADLINE,
  FREE_POSTGRES_CLAUDE,
  FREE_POSTGRES_CODEX,
  FREE_POSTGRES_COPILOT,
  FREE_POSTGRES_CURSOR,
  FREE_POSTGRES_CLI_CLAIM_URL,
  FREE_POSTGRES_CLI_CONNECTION,
  FREE_POSTGRES_CONNECTION_EXAMPLE,
  FREE_POSTGRES_STEP_CLAIM,
  FREE_POSTGRES_STEP_CONNECTION,
  FREE_POSTGRES_STEP_CREATING,
  FREE_POSTGRES_TERMINAL_CLAIM,
  FREE_POSTGRES_TERMINAL_STATUS,
  FREE_POSTGRES_H1,
  FREE_POSTGRES_HERO_CHECKS,
  FREE_POSTGRES_HERO_PRIMARY_CTA,
  FREE_POSTGRES_INCLUDED_CARDS,
  FREE_POSTGRES_INCLUDED_NOTES,
  FREE_POSTGRES_INCLUDED_ROWS,
  FREE_POSTGRES_CASES,
  FREE_POSTGRES_LIMIT,
  FREE_POSTGRES_MARKDOWN_SUBHEADLINE,
  FREE_POSTGRES_PRICING_CTA,
  FREE_POSTGRES_PRIMARY_CTA,
  FREE_POSTGRES_PROBLEM_HEADLINE,
  FREE_POSTGRES_USE_HEADLINE,
  CREATE_DB_COMMAND,
  FREE_POSTGRES_TERMINAL_TABS,
} from "@/app/free-postgresql-hosting/_content";
import { bulletList, ctaList, heading, joinBlocks, paragraphs } from "./blocks";
import { COMPARE_PRISMA_HEADING } from "./compare-links";
import { PRODUCT_FAQ_HEADING, PRODUCT_TESTIMONIALS_HEADING } from "./product";

export const FREE_POSTGRES_MARKDOWN_H1 = FREE_POSTGRES_H1;
export { FREE_POSTGRES_MARKDOWN_SUBHEADLINE };

/**
 * Markdown rendition of /free-postgresql-hosting.
 *
 * Mirrors the product-page section order. Bullets use a colon, not an em dash:
 * this page's copy must not contain em or en dashes, and definitionList emits one.
 */
export function renderFreePostgresqlDatabaseMarkdown(): string {
  return joinBlocks([
    ctaList([FREE_POSTGRES_HERO_PRIMARY_CTA, FREE_POSTGRES_HERO_SECONDARY_CTA]),
    bulletList([...FREE_POSTGRES_HERO_CHECKS]),
    bulletList([...FREE_POSTGRES_TERMINAL_TABS]),
    [
      `$ ${CREATE_DB_COMMAND}`,
      FREE_POSTGRES_STEP_CREATING,
      FREE_POSTGRES_TERMINAL_STATUS,
      FREE_POSTGRES_STEP_CONNECTION,
      FREE_POSTGRES_CLI_CONNECTION,
      FREE_POSTGRES_CONNECTION_EXAMPLE,
      FREE_POSTGRES_STEP_CLAIM,
      FREE_POSTGRES_TERMINAL_CLAIM,
      FREE_POSTGRES_CLI_CLAIM_URL,
    ].join("\n"),
    [
      FREE_POSTGRES_CLAUDE.product,
      FREE_POSTGRES_CLAUDE.model,
      FREE_POSTGRES_CLAUDE.directory,
      `❯ ${CREATE_DB_COMMAND}`,
      FREE_POSTGRES_CLAUDE.tool,
      FREE_POSTGRES_CLAUDE.created,
      FREE_POSTGRES_CLAUDE.connectionLabel,
      FREE_POSTGRES_CLI_CONNECTION,
      `Region: ${FREE_POSTGRES_CLAUDE.region}`,
      FREE_POSTGRES_CLAUDE.claim,
      FREE_POSTGRES_CLI_CLAIM_URL,
    ].join("\n"),
    [
      FREE_POSTGRES_CODEX.product,
      FREE_POSTGRES_CODEX.model,
      FREE_POSTGRES_CODEX.directory,
      `› ${CREATE_DB_COMMAND}`,
      FREE_POSTGRES_CODEX.tool,
      `$ ${CREATE_DB_COMMAND}`,
      FREE_POSTGRES_CODEX.created,
      FREE_POSTGRES_CODEX.connectionLabel,
      FREE_POSTGRES_CLI_CONNECTION,
      `Region: ${FREE_POSTGRES_CODEX.region}`,
      FREE_POSTGRES_CODEX.claim,
      FREE_POSTGRES_CLI_CLAIM_URL,
    ].join("\n"),
    [
      FREE_POSTGRES_CURSOR.product,
      FREE_POSTGRES_CURSOR.mode,
      FREE_POSTGRES_CURSOR.directory,
      CREATE_DB_COMMAND,
      FREE_POSTGRES_CURSOR.tool,
      FREE_POSTGRES_CURSOR.created,
      FREE_POSTGRES_CURSOR.connectionLabel,
      FREE_POSTGRES_CLI_CONNECTION,
      `Region: ${FREE_POSTGRES_CURSOR.region}`,
      FREE_POSTGRES_CURSOR.claim,
      FREE_POSTGRES_CLI_CLAIM_URL,
    ].join("\n"),
    [
      FREE_POSTGRES_COPILOT.product,
      FREE_POSTGRES_COPILOT.mode,
      FREE_POSTGRES_COPILOT.directory,
      CREATE_DB_COMMAND,
      FREE_POSTGRES_COPILOT.tool,
      FREE_POSTGRES_COPILOT.created,
      FREE_POSTGRES_COPILOT.connectionLabel,
      FREE_POSTGRES_CLI_CONNECTION,
      `Region: ${FREE_POSTGRES_COPILOT.region}`,
      FREE_POSTGRES_COPILOT.claim,
      FREE_POSTGRES_CLI_CLAIM_URL,
    ].join("\n"),

    heading(2, FREE_POSTGRES_FEATURES_HEADLINE),
    bulletList(
      FREE_POSTGRES_INCLUDED_CARDS.map((card) =>
        card.note
          ? `**${card.title}**<sup>${card.note}</sup>. ${card.detail}`
          : `**${card.title}.** ${card.detail}`,
      ),
    ),
    [
      "| Feature | Included |",
      "| --- | --- |",
      ...FREE_POSTGRES_INCLUDED_ROWS.map((row) => `| ${row.label} | ${row.value} |`),
    ].join("\n"),
    FREE_POSTGRES_INCLUDED_NOTES.map((note) => `${note.n}. ${note.text}`).join("\n"),

    heading(2, FREE_POSTGRES_PROBLEM_HEADLINE),
    heading(3, FREE_POSTGRES_LIMIT.countsTitle),
    paragraphs(FREE_POSTGRES_LIMIT.countsLead),
    bulletList([
      `${FREE_POSTGRES_LIMIT.monthFigure} ${FREE_POSTGRES_LIMIT.monthLabel}`,
      `${FREE_POSTGRES_LIMIT.dayFigure} ${FREE_POSTGRES_LIMIT.dayLabel}`,
    ]),
    paragraphs(FREE_POSTGRES_LIMIT.idleNotBilled),
    heading(3, FREE_POSTGRES_LIMIT.idleTitle),
    paragraphs(FREE_POSTGRES_LIMIT.idleBody),
    heading(3, FREE_POSTGRES_LIMIT.capTitle),
    paragraphs(FREE_POSTGRES_LIMIT.capBody),
    heading(3, FREE_POSTGRES_LIMIT.restoreTitle),
    paragraphs(FREE_POSTGRES_LIMIT.restoreBody),
    paragraphs(FREE_POSTGRES_LIMIT.paid),
    ...FREE_POSTGRES_CASES.flatMap((item) => [
      heading(3, item.name),
      paragraphs(item.body),
      paragraphs(
        item.href
          ? `${item.count}. [${item.plan}](${item.href}).${item.linkLabel ? ` [${item.linkLabel}](${item.href}).` : ""}`
          : `${item.count}. ${item.plan}.`,
      ),
    ]),
    heading(2, FREE_POSTGRES_USE_HEADLINE),
    bulletList(FREE_POSTGRES_FEATURE_ITEMS.map((item) => `**${item.name}:** ${item.description}`)),

    heading(2, COMPARE_PRISMA_HEADING),
    paragraphs(FREE_POSTGRES_COMPARE_INTRO),
    bulletList(
      FREE_POSTGRES_COMPARE_LINKS.map(
        (item) => `[${item.label}](${item.href}): ${item.description}`,
      ),
    ),

    heading(2, PRODUCT_FAQ_HEADING),
    ...FREE_POSTGRES_FAQ.flatMap((item) => [heading(3, item.question), paragraphs(item.answer)]),

    heading(2, PRODUCT_TESTIMONIALS_HEADING),
    TESTIMONIALS.map(
      (testimonial) =>
        `- "${testimonial.quote}" (${testimonial.name}, ${testimonial.role}, ${testimonial.company})`,
    ).join("\n"),

    heading(2, FREE_POSTGRES_CLOSER_HEADLINE),
    paragraphs(FREE_POSTGRES_CLOSER_BODY),
    bulletList([...FREE_POSTGRES_CLOSER_BENEFITS]),
    ctaList([FREE_POSTGRES_PRIMARY_CTA, FREE_POSTGRES_PRICING_CTA]),
  ]);
}
