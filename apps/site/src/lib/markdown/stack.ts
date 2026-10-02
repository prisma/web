import { bulletList, ctaList, definitionList, heading, joinBlocks, paragraphs } from "./blocks";
import { renderTestimonialsMarkdown } from "./testimonials";

/**
 * Markdown rendition of /stack.
 *
 * Source of truth is src/app/stack/page.tsx and the sections it renders, in
 * order: components/sections/platform-hero.tsx, platform-compare.tsx (with the
 * platform-stack-map.tsx diagram), platform-flow.tsx, platform-products.tsx,
 * agent-loop.tsx (with the page's own heading), platform-open.tsx,
 * testimonials-reveal.tsx and cta-burst.tsx (rendered bare, so the closing
 * section is CtaBurst's DEFAULT headline, body, checks and CTAs).
 *
 * Left out, per the "skip pure decoration" rule: the hero's prism monument,
 * the animated wire in PlatformFlow, the product illustrations, AgentLoop's
 * `aria-hidden` LoopDiagram and the CtaBurst cloud <video>.
 */

export const STACK_H1 = "Build and ship your whole backend in one place";

export const STACK_SUBHEADLINE =
  "A type-safe ORM, managed Postgres, and TypeScript app hosting, built to work together " +
  "natively rather than wired together after the fact. Start with any one of them and add the " +
  "rest when you're ready to ship.";

/** The two columns of PlatformCompare: the assembled-by-hand stack against the integrated one. */
const WITHOUT = [
  "An ORM, a database, and a host picked separately, then glued together by hand",
  "Preview databases that don't line up with preview deploys",
  "Latency you can't tune away, because the app and the database sit in different clouds",
  "Three dashboards, three bills, three support queues",
];

const WITH = [
  "One ORM, one database, one host, all built against the same schema",
  "Every preview deploy gets its own database, wired automatically",
  "App and Postgres co-located on the same host, single-digit ms queries",
  "One platform, one bill, one place to look when something breaks",
];

/** PlatformFlow: build, deploy, debug as three nodes on one wire. */
const FLOW = [
  { name: "Build", description: "Model your data and write type-safe queries with Prisma ORM." },
  {
    name: "Deploy",
    description:
      "Provision a Prisma Postgres database and deploy to Prisma Compute, co-located on the " +
      "same host.",
  },
  {
    name: "Debug",
    description:
      "Read your logs, update your schema, migrate, and redeploy, without switching tools.",
  },
];

/** The three product cards of PlatformProducts. Each has a role kicker above
 *  its H3, a description, three bullets, and a "Learn more" link whose
 *  accessible name includes the sr-only product suffix. */
const PRODUCTS = [
  {
    kicker: "Type-safe data layer",
    name: "Prisma ORM",
    description:
      "One declarative schema in native TypeScript — the single config your app, your " +
      "migrations, and your agent all build against.",
    points: [
      "Free and open source, trusted by 500,000+ developers",
      "Schema small and dense enough to hand an LLM as context",
      "Errors structured for agents, not just humans",
    ],
    cta: { label: "Learn more about Prisma ORM", href: "/orm" },
  },
  {
    kicker: "Managed database",
    name: "Prisma Postgres",
    description:
      "Managed Postgres that arrives already wired to your schema, co-located with your hosting " +
      "on infrastructure built for single-digit ms boot times.",
    points: [
      "Unikernel microVMs on bare metal, single-digit ms boot",
      "Operation-based pricing with spend limits, no bill shock",
      "Free per-branch databases for every preview",
    ],
    cta: { label: "Learn more about Prisma Postgres", href: "/postgres" },
  },
  {
    kicker: "App hosting",
    name: "Prisma Compute (Public Beta)",
    description:
      "TypeScript app hosting on the same host as your database, so your agent can deploy, " +
      "debug, and redeploy without leaving the loop.",
    points: [
      "Bun runtime on bare metal",
      "Co-located with Postgres for single-digit ms queries",
      "Versioned deploys with preview URLs, by git push or CLI",
    ],
    cta: { label: "Learn more about Prisma Compute", href: "/compute" },
  },
];

/** Markdown rendition of /stack (src/app/stack/page.tsx). */
export function renderStackMarkdown(): string {
  return joinBlocks([
    // ---- PlatformHero (platform-hero.tsx): the CTAs under the subheadline ----
    ctaList([
      { label: "Get started free", href: "https://console.prisma.io" },
      { label: "See pricing", href: "/pricing" },
    ]),

    // ---- PlatformCompare (platform-compare.tsx + platform-stack-map.tsx) ----
    heading(2, "Why the three belong on one platform"),
    // The system diagram's claim, in words: one schema, three products, two of
    // them sharing a host.
    paragraphs(
      "`config.prisma` — one config. Prisma ORM (type-safe data layer), Prisma Postgres " +
        "(managed database) and Prisma Compute (app hosting) are all built against it, with " +
        "Postgres and your app on the same host — single-digit ms queries.",
    ),
    heading(3, "Without an integrated stack"),
    bulletList(WITHOUT),
    heading(3, "With Prisma"),
    bulletList(WITH),

    // ---- PlatformFlow (platform-flow.tsx) ----
    heading(2, "From building to shipping, in one flow"),
    definitionList(FLOW),

    // ---- PlatformProducts (platform-products.tsx) ----
    heading(2, "Start with one, add the rest when you need them"),
    ...PRODUCTS.flatMap((product) => [
      heading(3, product.name),
      // The role kicker above each H3, kept as the card's category label.
      paragraphs([product.kicker, product.description]),
      bulletList(product.points),
      ctaList([product.cta]),
    ]),

    // ---- AgentLoop (agent-loop.tsx), with the heading /stack passes it ----
    heading(2, "What changes when your stack works as one"),
    definitionList([
      {
        name: "Your agent handles the full loop",
        description: "Build, deploy, debug, redeploy. No vendor coordination.",
      },
      {
        name: "One platform, not five glued together",
        description:
          "Get your app live without wiring together a database, a host, and an ORM from " +
          "separate vendors.",
      },
      {
        name: "Deploy your app, the database is already there",
        description: "App and Postgres co-located on the same host.",
      },
    ]),

    // ---- PlatformOpen (platform-open.tsx) ----
    heading(2, "Integrated by default, open by design"),
    paragraphs(
      "Prisma gives you a stack that works together out of the box, with room to use the " +
        "tools you already trust.",
    ),
    bulletList([
      "Prisma Postgres is standard Postgres",
      "Prisma ORM works with other databases",
      "Each product can be adopted on its own",
    ]),
    paragraphs("Start with the piece you need today, then add more when it makes sense."),

    // ---- TestimonialsReveal (testimonials-reveal.tsx), default heading ----
    renderTestimonialsMarkdown(),

    // ---- CtaBurst with its default props — /stack renders <CtaBurst /> bare ----
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
