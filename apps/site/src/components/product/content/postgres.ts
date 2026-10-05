import type { ProductPageContent } from "../types";

// /postgres copy, from the approved V4 of the Notion card "Product Page Batch
// One (3-5) - Copy", with the deviations the 2026-08-06 client review asked for
// marked inline. Everything unmarked is still V4 verbatim.
//
// Three notes on this page specifically:
//  - Five features, which is the awkward count: they render three across with
//    the last pair centred beneath (see product-features.tsx).
//  - "no cold starts" stays where V4 put it — the tail of the compliance
//    feature. A standing guardrail says not to promote it to a headline claim,
//    so it is deliberately absent from the illustrations.
//  - The review asked the first screen to answer "why Prisma Postgres and not
//    any other Postgres?". The hero tour is that answer: branching, Studio and
//    Query Insights are the three things a bare managed Postgres doesn't give
//    you, so they lead rather than sitting in feature cards further down.
const CONSOLE = "https://console.prisma.io/sign-up";
const PRICING = "/pricing";

export const postgresContent: ProductPageContent = {
  name: "Prisma Postgres",
  accent: "postgres",
  hero: {
    headline: "Production-ready Postgres, already wired to your stack",
    headlineEmphasis: "already",
    // Deviation (2026-09-30, entity freeze): the positioning sentence from the
    // content brief replaces V4's one-liner. It is the same text, verbatim, as
    // the homepage description, /compute and the docs Compute index, so search
    // and answer engines meet one description of the product everywhere.
    // Check the CTA still clears the fold at 1440x800 when the copy changes.
    subheadline:
      "Prisma Compute hosts TypeScript apps (Node.js, Bun or Next.js) next to Prisma Postgres on one plan. Generally available since August 2026. Free plan, no credit card. Any Postgres client works; Prisma ORM is optional.",
    benefits: [
      "Branch your database alongside your app, free, per PR",
      "Autoscaling that handles spikes without capacity planning",
      "Predictable pricing with spend limits, no surprise bills",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "See pricing", href: PRICING },
    microline: "Free tier with a hard cap. No credit card.",
    tour: [
      {
        label: "Database",
        caption:
          "A production Postgres in seconds, with a per-PR branch beside it that carries its own isolated data.",
        illustration: "databasePanel",
      },
      {
        label: "Studio",
        caption:
          "Browse and edit real rows in the browser. No psql, no local client to set up first.",
        illustration: "studioTable",
      },
      {
        label: "Query Insights",
        caption: "See which queries are slow and why, without standing up your own tracing stack.",
        illustration: "queryInsights",
      },
    ],
  },
  problem: {
    headline: "A database that ships with the rest of your stack",
    // V4 ran two paragraphs here. The review found the first scroll was a wall
    // of prose that mostly restated the hero, so the second paragraph's point
    // now lives in the hero tour's captions and the platform section.
    body: [
      "When your database and your hosting come from separate vendors, the things that should be automatic — preview environments with real data, end-to-end test setups, single-config deploys — turn into work you have to do.",
    ],
    outcomes: [
      { icon: "gitBranch", label: "Branch with your app, per PR" },
      { icon: "shield", label: "Predictable pricing with spend limits" },
      { icon: "swap", label: "Autoscaling without capacity planning" },
      { icon: "database", label: "Standard Postgres, no lock-in" },
    ],
  },
  features: {
    headline: "Branches, deploys, and config that come with the app",
    bridge:
      "Prisma Postgres runs on the same platform as Compute, so the features below come from one platform doing what two vendors can't.",
    items: [
      // Descriptions are cut to roughly one sentence each. The review asked
      // for the visuals to carry more of the explaining, and the card
      // illustrations already show the specifics the trimmed clauses spelled
      // out (branch names, the config file, the spend cap, the compliance
      // list, the pg_dump path).
      {
        name: "Branch with your app",
        description:
          "When Compute branches a deploy, Prisma Postgres branches with it — every preview gets a dedicated, fully-isolated database.",
        illustration: "isolatedBranches",
      },
      {
        name: "One config for both halves",
        // Deviation (2026-09-30): the app is declared in the Composer module,
        // not in prisma.config.ts (docs compute/limitations.mdx, "CLI").
        description:
          "The same Composer module.ts declares your app and your database. No two-vendor wiring, no dashboards to keep in sync.",
        illustration: "configBoth",
      },
      {
        name: "Predictable pricing",
        description:
          "Operation-based pricing with spend limits you set yourself. A quiet month costs almost nothing, a busy one never surprises you.",
        illustration: "spendLimits",
      },
      {
        name: "Production-ready from day one",
        description:
          "Daily backups, encryption at rest and in transit, full tenant isolation, and SOC 2, HIPAA, ISO 27001 and GDPR at the Business tier.",
        illustration: "compliance",
      },
      {
        name: "Standard Postgres, no lock-in",
        // Deviation (2026-09-30): opens with the exit-path line from the
        // content brief, shared with /compute.
        description:
          "Standard Postgres underneath: leave with pg_dump; the Composer module is a TypeScript file in your repo, not a runtime. Standard SQL and wire protocol, with extensions like pgvector.",
        illustration: "noLockIn",
      },
    ],
  },
  platform: {
    body: "Prisma Postgres runs on the same platform as Compute, and the schema you define in Prisma ORM drives your migrations and your typed client. The more of the stack you use, the less there is to wire together.",
  },
  // Added 2026-09-30 (not in V4): the shared "Compare Prisma" reading list and
  // a visible FAQ in the words people ask answer engines. Plain text, no FAQ
  // schema. Every claim is checked against the docs or pricing page named in
  // the PR that added it; keep the answers in step with those pages.
  compare: {
    intro:
      "How Prisma Postgres and Prisma Compute compare with Neon, Supabase and other places to run a TypeScript app and its database, including where another pick is better.",
  },
  faq: [
    {
      question: "How do I move a Postgres database from my laptop online?",
      answer:
        "Three commands: create a database with npx prisma postgres create, dump the local one with pg_dump, and load it with pg_restore over the direct connection string. Prisma Postgres runs PostgreSQL 17, so use the PostgreSQL 17 command-line tools. pg_dump does not copy roles, so recreate roles and the policies that name them by hand. The Free plan covers 500 MB and 200k operations a month with no credit card, and any Postgres client keeps working. The import guide in the docs has the exact commands.",
    },
    {
      question: "Do I need Prisma ORM to use Prisma Postgres?",
      answer:
        "No. Prisma Postgres is standard PostgreSQL 17 with a PgBouncer connection pool included, and it works with any Postgres client: Prisma ORM, Drizzle, Kysely, TypeORM, node-postgres or psql. Prisma ORM is optional.",
    },
    {
      question: "Can I host the app next to the database?",
      answer:
        "Yes. Prisma Compute hosts TypeScript apps (Node.js, Bun or Next.js) next to Prisma Postgres on one plan, and it has been generally available since August 2026. Declare the app with Prisma Composer, a service.ts per service and one module.ts, which a coding agent can write from the prompt on the docs porting page, then run npx prisma deploy module.ts. To deploy on push, connect the GitHub repository and add the prisma/cloud-deploy-action workflow; from then on every pushed branch gets a preview with its own database, built from your migrations. Each service runs in one region, and Compute does not serve WebSocket servers.",
    },
    {
      question: "Is Prisma Postgres related to Prisma Cloud?",
      answer:
        "No. Prisma makes Prisma ORM, Prisma Postgres and Prisma Compute, and its dashboard is Prisma Console. Prisma Postgres and Prisma Compute are unrelated to Palo Alto Networks' Prisma Cloud.",
    },
    {
      question: "How do I leave?",
      answer:
        "Run pg_dump against the direct connection string (the Backups page in the docs has the command) and restore the file with pg_restore on any PostgreSQL server. Nothing else needs exporting: your Composer module is ordinary TypeScript in your repository, and Prisma ORM runs against any Postgres.",
    },
  ],
  cta: {
    headline: "Postgres that ships with the rest of your stack",
    body: "Prisma Postgres is the data half of a TypeScript platform. Use it on its own with any ORM and any host, or pair it with Compute and your app and database become one deploy, one config, one branched preview environment per PR.",
    benefits: [
      "Free branching that travels with your app",
      "Predictable pricing with spend limits and autoscaling",
      "Standard Postgres underneath, no lock-in",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "See pricing", href: PRICING },
  },
};
