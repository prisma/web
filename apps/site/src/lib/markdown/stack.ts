import { bulletList, ctaList, definitionList, heading, joinBlocks, paragraphs } from "./blocks";

/**
 * Markdown rendition of /stack.
 *
 * Source of truth is src/app/stack/page.tsx (hero) plus the two sections it
 * renders: components/sections/stack-bento.tsx and components/sections/
 * cta-burst.tsx. /stack renders <CtaBurst /> with no props, so the closing
 * section below is CtaBurst's DEFAULT headline, body, checks and CTAs.
 */

export const STACK_H1 = "One platform, from schema to production";

export const STACK_SUBHEADLINE =
  "ORM, Postgres, and Compute work together natively, one shared context across your stack, " +
  "one bill, and nothing to glue together.";

/** The three product rows of StackBento. Each has a role kicker above its H3,
 *  a lede, a bullet list, and a "Learn more" link whose accessible name
 *  includes the sr-only product suffix. */
const PRODUCTS = [
  {
    kicker: "Type-safe data layer",
    name: "Prisma ORM",
    lede:
      "A declarative, type-safe schema rebuilt in native TypeScript, the shared contract your " +
      "whole stack and your agent are built around.",
    bullets: [
      "Schema-as-LLM-context: small, dense, machine-readable",
      "Errors structured for agent consumption, not just human-readable",
      "Rebuilt in native TypeScript for the fastest type-checking at scale",
      "Free, open-source, the foundation 500K+ developers already trust",
    ],
    cta: { label: "Learn more about Prisma ORM", href: "/orm" },
    // ConnectorStrip rendered after this row: file chip + caption.
    connector: "`contract.prisma` — The shared contract across your stack",
  },
  {
    kicker: "Managed database",
    name: "Prisma Postgres",
    lede:
      "Managed Postgres already wired to your schema and co-located with your app hosting, on " +
      "infrastructure built for single-digit ms boot times.",
    bullets: [
      "Unikernel microVMs on bare metal, single-digit ms boot",
      "Operation-based pricing with spend limits, no bill shock",
      "Free per-branch databases, integrated with hosting previews",
      "Works with any ORM if you're not using Prisma's",
      "Query Insights built in: spot slow queries and get an agent-ready prompt to fix them",
    ],
    cta: { label: "Learn more about Prisma Postgres", href: "/postgres" },
    connector: "`prisma.config.ts` — One config, both products",
  },
  {
    kicker: "App hosting",
    name: "Prisma Compute",
    lede:
      "TypeScript app hosting that runs on the same host as your database, so your agent can " +
      "deploy, debug, and redeploy end-to-end.",
    bullets: [
      "Bun runtime on bare metal",
      "Co-located with Prisma Postgres, single-digit ms query latency",
      "Long-running workloads: WebSockets, cron, background jobs (coming soon)",
      "Versioned deployments with preview URLs, deploy by git push or CLI",
    ],
    cta: { label: "Learn more about Prisma Compute", href: "/compute" },
    connector: undefined,
  },
];

// The two cross-stack tools are H4s in the HTML, each with an italic sublabel
// under the title; blocks.ts caps heading() at level 3, so they render as a
// definition list with the sublabel kept in front of the description.
const CROSS_STACK_TOOLS = [
  {
    name: "Prisma Studio",
    description:
      "to inspect your data. Visual data browser and editor built into the Console. See what " +
      "your agent did to your database, collaborate with teammates without SQL, embeddable in " +
      "your own apps.",
  },
  {
    name: "CLI + Management API",
    description:
      "to stay in the loop. The agent interface for the full platform. Structured output and " +
      "`--json` modes everywhere, with full parity between CLI and API so anything your agent " +
      "can run, it can also call programmatically.",
  },
];

/** Markdown rendition of /stack (src/app/stack/page.tsx). */
export function renderStackMarkdown(): string {
  return joinBlocks([
    // The hero has no CTAs; the page's first body block is StackBento.
    heading(2, "The TypeScript stack, integrated by design"),
    paragraphs(
      "ORM, database, and hosting designed to work together, so your agent can build, deploy, " +
        "and iterate without coordinating between vendors.",
    ),

    ...PRODUCTS.flatMap((product) => [
      heading(3, product.name),
      // The role kicker above each H3, kept as the card's category label.
      paragraphs([product.kicker, product.lede]),
      bulletList(product.bullets),
      ctaList([product.cta]),
      product.connector && paragraphs(product.connector),
    ]),

    heading(3, "Working across the stack"),
    definitionList(CROSS_STACK_TOOLS),
    ctaList([
      { label: "Learn more about Prisma Studio", href: "/postgres" },
      { label: "Learn more about the CLI and Management API", href: "/docs" },
    ]),

    // CtaBurst with its default props — /stack renders <CtaBurst /> bare.
    heading(2, "Ready to let your agent run the full loop?"),
    paragraphs(
      "The TypeScript stack 500K+ developers trust. Start with the free ORM, and add the rest " +
        "of the platform when you need it.",
    ),
    bulletList([
      "Built for how your agent ships now",
      "Postgres and hosting when you need them",
      "Type-safe ORM, free and always will be",
    ]),
    ctaList([
      { label: "Get started free", href: "https://console.prisma.io/sign-up" },
      { label: "See pricing", href: "/pricing" },
    ]),
  ]);
}
