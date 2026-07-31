import type { ProductPageContent } from "../types";

// /postgres copy, verbatim from the approved V4 of the Notion card "Product Page
// Batch One (3-5) - Copy". Nothing here is paraphrased, reordered or padded.
//
// Two notes on this page specifically:
//  - Five features, which is the awkward count: they render three across with
//    the last pair centred beneath (see product-features.tsx).
//  - "no cold starts" stays where V4 put it — the tail of the compliance
//    feature. A standing guardrail says not to promote it to a headline claim,
//    so it is deliberately absent from the illustrations.
const CONSOLE = "https://console.prisma.io";
const PRICING = "/pricing";

export const postgresContent: ProductPageContent = {
  name: "Prisma Postgres",
  accent: "postgres",
  hero: {
    headline: "Production-ready Postgres, already wired to your stack",
    headlineEmphasis: "already",
    subheadline:
      "Prisma Postgres is a production-ready managed database that works with any TypeScript stack. Pair it with Compute and you get one platform for your app and its data, branched and deployed as a unit.",
    benefits: [
      "Branch your database alongside your app, free, per PR",
      "Autoscaling that handles spikes without capacity planning",
      "Predictable pricing with spend limits, no surprise bills",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "See pricing", href: PRICING },
    illustration: "databasePanel",
  },
  problem: {
    headline: "A database that ships with the rest of your stack",
    body: [
      "When your database and your hosting come from separate vendors, the things that should be automatic (preview environments with real data, end-to-end test setups, single-config deploys) turn into work you have to do.",
      "Prisma Postgres works with any TypeScript stack out of the box. And when you host on Compute, it stops being a separate vendor you connect and becomes the data half of the platform you're already deploying to.",
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
      {
        name: "Branch with your app",
        description:
          "When Compute branches a deploy, Prisma Postgres branches with it. Every preview environment gets a dedicated, fully-isolated database, not a shared test DB that lies about how production behaves.",
        illustration: "isolatedBranches",
      },
      {
        name: "One config for both halves",
        description:
          "The same prisma.config.ts declares your app and your database. No two-vendor wiring, no separate dashboards to keep in sync.",
        illustration: "configBoth",
      },
      {
        name: "Predictable pricing",
        description:
          "Operation-based pricing with spend limits you set yourself. A quiet month costs almost nothing, a busy one never surprises you. Free tier with a hard cap, no credit card.",
        illustration: "spendLimits",
      },
      {
        name: "Production-ready from day one",
        description:
          "Automated daily backups, SOC 2, HIPAA, ISO 27001, and GDPR at the Business tier, encryption at rest and in transit, full tenant isolation, no cold starts.",
        illustration: "compliance",
      },
      {
        name: "Standard Postgres, no lock-in",
        description:
          "Standard SQL and wire protocol, extensions like pgvector, migrate in or out with pg_dump. Connect any ORM (Drizzle, Kysely, or raw SQL) and any auth (BetterAuth, Clerk, NextAuth).",
        illustration: "noLockIn",
      },
    ],
  },
  platform: {
    body: "Prisma Postgres runs on the same platform as Compute, and the schema you define in Prisma ORM drives your migrations and your typed client. The more of the stack you use, the less there is to wire together.",
    integrations: [
      {
        icon: "server",
        product: "Prisma Compute",
        benefit: "branched together, deployed together, microsecond query latency",
      },
      {
        icon: "code",
        product: "any ORM",
        benefit:
          "Prisma ORM drives your migrations and typed client from your schema, or bring raw SQL, Kysely, TypeORM, or Drizzle",
      },
      {
        icon: "checkCircle",
        product: "any auth",
        benefit: "use any auth provider, including BetterAuth, Clerk, or NextAuth",
      },
    ],
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
