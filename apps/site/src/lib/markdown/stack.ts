import { bestFor, comparison, cta, hero, stack, when } from "@/app/stack/content";
import { bulletList, ctaList, heading, joinBlocks, paragraphs, table } from "./blocks";

/**
 * Markdown rendition of /stack (src/app/stack/page.tsx).
 *
 * Mirrors, in render order: ProductHero, StackBento (with the page's own
 * `stack` copy), ComparisonTable, SegmentWhen, BestFor and CtaBurst. Every
 * string the page passes those sections comes from src/app/stack/content.ts,
 * so it is read from there rather than copied; only the sections' own literal
 * JSX (StackBento's heading, intro, kickers, connector strips and links, and
 * CtaBurst's default CTAs) is repeated here, and `markdown-parity.test.ts`
 * scans those files for it.
 *
 * Left out as pure decoration: the hero's StackHeroVisual (an illustration of
 * an agent driving the stack), the bento's product illustrations, the
 * BestFor Prismo images and the CtaBurst cloud <video>.
 */

/** The <h1> ProductHero renders from `hero.headline`. */
export const STACK_H1 = hero.headline;

/** The paragraph directly under the <h1>. */
export const STACK_SUBHEADLINE = hero.subheadline;

/** StackBento's three product rows: the literal JSX around the page's copy. */
const PRODUCT_ROWS = [
  {
    kicker: "Type-safe data layer",
    name: "Prisma ORM",
    copy: stack.orm,
    href: "/orm",
    // <ConnectorStrip> after the row: the file that ties the neighbouring
    // products together, plus its caption.
    connector: "`contract.prisma` — The shared contract across your stack",
  },
  {
    kicker: "Managed database",
    name: "Prisma Postgres",
    copy: stack.postgres,
    href: "/postgres",
    connector: "`prisma.config.ts` — One config, both products",
  },
  {
    kicker: "App hosting",
    name: "Prisma Compute",
    copy: stack.compute,
    href: "/compute",
    connector: undefined,
  },
];

export function renderStackMarkdown(): string {
  return joinBlocks([
    // ---- ProductHero, everything after the h1 + subheadline ----
    ctaList([hero.primaryCta, hero.secondaryCta]),
    hero.microline,
    bulletList([...hero.benefits]),

    // ---- StackBento (stack-bento.tsx) ----
    // The <LearnMore> links render "Learn more" plus a screen-reader-only
    // " about <product>"; the full accessible name is used as the link label.
    // Each row's <RoleKicker> is kept as an italic line under the heading.
    heading(2, "The TypeScript stack, integrated by design"),
    paragraphs(
      "ORM, database, and hosting designed to work together, so your agent can build, deploy, " +
        "and iterate without coordinating between vendors.",
    ),
    ...PRODUCT_ROWS.flatMap((row) => [
      heading(3, row.name),
      paragraphs(`*${row.kicker}*`),
      paragraphs(row.copy.body),
      bulletList(row.copy.bullets),
      ctaList([{ label: `Learn more about ${row.name}`, href: row.href }]),
      row.connector && paragraphs(row.connector),
    ]),
    // "Working across the stack" is an <h3> whose two tools are <h4>s; the
    // block helpers stop at level 3, so the tools are bold lead-ins with their
    // italic sublabel, then their own paragraph and link.
    heading(3, "Working across the stack"),
    paragraphs("**Prisma Studio** — to inspect your data"),
    paragraphs(stack.studio.body),
    ctaList([{ label: "Learn more about Prisma Studio", href: "/postgres" }]),
    paragraphs("**CLI + Management API** — to stay in the loop"),
    paragraphs(stack.cli.body),
    ctaList([{ label: "Learn more about the CLI and Management API", href: "/docs" }]),

    // ---- ComparisonTable (use-case/segment/comparison-table.tsx) ----
    heading(2, comparison.headline),
    paragraphs(comparison.intro),
    table(
      [comparison.pointHeader, comparison.assembledHeader, comparison.prismaHeader ?? "Prisma"],
      comparison.rows.map((row) => [row.point, row.assembled, row.prisma]),
    ),

    // ---- SegmentWhen (use-case/segment/sections.tsx) ----
    heading(2, when.headline),
    paragraphs(when.intro),
    ...when.items.flatMap((item) => [heading(3, item.title), paragraphs(item.body)]),

    // ---- BestFor (app/stack/best-for.tsx) ----
    heading(2, bestFor.headline),
    paragraphs(bestFor.intro),
    ...bestFor.items.flatMap((item) => [heading(3, item.title), paragraphs(item.body)]),

    // ---- CtaBurst (sections/cta-burst.tsx) ----
    // The page passes the headline, body and checks; the CTAs are the
    // component's defaults.
    heading(2, cta.headline),
    paragraphs(cta.body),
    bulletList(cta.checks.map((check) => check.label)),
    ctaList([
      { label: "Get started free", href: "https://console.prisma.io/sign-up" },
      { label: "See pricing", href: "/pricing" },
    ]),
  ]);
}
