import type { ProductPageContent } from "../types";

// /compute copy, verbatim from the approved V4 of the Notion card "Product Page
// Batch One (3-5) - Copy". Nothing here is paraphrased, reordered or padded.
//
// Three things V4 deliberately does on this page:
//  - No testimonial section. /orm and /postgres carry one; Compute does not,
//    which is why this page composes its sections directly.
//  - No "in public beta" callout. V3 had one and V4 removed it — don't
//    reintroduce it from the homepage, which still labels Compute as beta.
//  - Four features, so they render as two rows of two.
const CONSOLE = "https://console.prisma.io";
const DOCS = "/docs";

export const computeContent: ProductPageContent = {
  name: "Prisma Compute",
  accent: "compute",
  hero: {
    headline: "One platform for your app and its database",
    headlineEmphasis: "One platform",
    subheadline:
      "Prisma Compute is the easiest way to host TypeScript apps built for the agentic era, with Postgres and the rest of your infrastructure built in. Every deploy can come with its own branched database, and your agent can drive the full loop end-to-end.",
    benefits: [
      "Every PR gets a dedicated app and database, branched together",
      "Microsecond app-to-database latency, no cross-vendor network hop",
      "Long-running, streaming workloads built for hosting agents, not just apps",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Read the docs", href: DOCS },
    illustration: "deployments",
  },
  problem: {
    headline: "One platform can ship features two never could",
    body: [
      "When your hosting provider and your database provider are separate companies, the things that depend on them being aware of each other (branching, preview environments, low-latency queries, end-to-end test data) don't exist. You wire them together yourself, or you do without.",
      "Prisma Compute exists to change that.",
    ],
    outcomes: [
      { icon: "gitBranch", label: "Branch your stack per PR" },
      { icon: "rocket", label: "Skip the cross-vendor network hop" },
      { icon: "bot", label: "Host streaming agents natively" },
      { icon: "settings", label: "One config for app and database" },
    ],
  },
  features: {
    headline: "What one platform unlocks",
    bridge:
      "Compute and Prisma Postgres run as a single platform. The features below are only possible because of that.",
    items: [
      {
        name: "Built for hosting AI agents",
        description:
          "Agents need long-lived processes, streaming responses, and durable memory. Compute supports all three in one place. Run your own agents alongside your app, on the same platform that runs your data.",
        illustration: "agentHosting",
      },
      {
        name: "Branch your stack per PR",
        description:
          "Every preview environment gets a dedicated database, branched from production and tied to that deploy. No shared test DBs that pass tests production fails, no spinning up an external DB host for each environment.",
        illustration: "branchedStack",
      },
      {
        name: "Microsecond queries, no code changes",
        description:
          "ORMs make many small queries, and on most stacks each one pays a network round trip between two vendors. Compute runs on the same machine as Prisma Postgres, so that round trip disappears. App-to-database latency drops to microseconds, with no code changes.",
        illustration: "coLocated",
      },
      {
        name: "Cron and background jobs as a first-class concept",
        description:
          "Scheduled execution and background jobs are declared in prisma.config.ts, alongside the rest of your app. No external schedulers, no separate sidecar service.",
        illustration: "configJobs",
      },
    ],
  },
  platform: {
    body: "Prisma Compute is where the stack comes together: your app, your database, and your data model on one platform.",
    integrations: [
      {
        icon: "database",
        product: "Prisma Postgres",
        benefit: "branched together, deployed together, microsecond query latency",
      },
      {
        icon: "code",
        product: "Prisma ORM",
        benefit: "deploy an app already wired to your schema and migrations",
      },
      {
        icon: "bot",
        product: "any coding agent",
        benefit: "a CLI and Management API your agent can drive, with full parity between them",
      },
    ],
  },
  cta: {
    headline: "One platform. Both layers. Features only possible because of it.",
    body: "Compute is part of a TypeScript stack where hosting and the database travel as a unit. Branch them together, deploy them together, debug them together.",
    benefits: [
      "Built to host the agents you're building, not just the apps",
      "Per-PR branching across app and database",
      "Co-located queries with no cross-vendor latency",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Read the docs", href: DOCS },
  },
};
