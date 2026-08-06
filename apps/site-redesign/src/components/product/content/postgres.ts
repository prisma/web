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
const CONSOLE = "https://console.prisma.io";
const PRICING = "/pricing";

export const postgresContent: ProductPageContent = {
  name: "Prisma Postgres",
  accent: "postgres",
  hero: {
    headline: "Production-ready Postgres, already wired to your stack",
    headlineEmphasis: "already",
    // V4's second sentence ("Pair it with Compute and you get one platform…")
    // is dropped here and left to the Compute card in the platform section —
    // it was pushing the CTA below the fold and the section under the hero
    // already made the same point.
    subheadline:
      "Prisma Postgres is a production-ready managed database that works with any TypeScript stack.",
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
        description:
          "The same prisma.config.ts declares your app and your database. No two-vendor wiring, no dashboards to keep in sync.",
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
        description:
          "Standard SQL and wire protocol, extensions like pgvector, and migration in or out with pg_dump.",
        illustration: "noLockIn",
      },
    ],
  },
  platform: {
    body: "Prisma Postgres runs on the same platform as Compute, and the schema you define in Prisma ORM drives your migrations and your typed client. The more of the stack you use, the less there is to wire together.",
  },
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
