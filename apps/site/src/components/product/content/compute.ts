import type { ProductPageContent } from "../types";

// /compute copy, from the approved V4 of the Notion card "Product Page Batch
// One (3-5) - Copy", with the 2026-08-06 client review's changes marked inline.
//
// The review asked this page for three things, and the hero tour answers all
// three: show the deployment experience immediately (Connect → Deploy → Live),
// bring starter templates far higher, and name what actually runs here instead
// of leaving it abstract.
//
// Three things V4 deliberately does on this page:
//  - No testimonial section. /orm and /postgres carry one; Compute does not,
//    which is why this page composes its sections directly.
//  - No "in public beta" callout. V3 had one and V4 removed it — don't
//    reintroduce it from the homepage, which still labels Compute as beta.
//  - Five features (V4 shipped four; Object Store buckets, launched 2026-07-24,
//    were added after the review), rendered three-then-two with the last pair
//    centred — see product-features.tsx.
const CONSOLE = "https://console.prisma.io";
const DOCS = "/docs";

export const computeContent: ProductPageContent = {
  name: "Prisma Compute",
  accent: "compute",
  hero: {
    headline: "One platform for your app and its database",
    headlineEmphasis: "One platform",
    // V4's second sentence is dropped from the hero — it pushed the CTA down,
    // and the tour beside this copy now demonstrates both halves of it.
    subheadline:
      "Prisma Compute is the easiest way to host TypeScript apps, with Postgres and the rest of your infrastructure built in.",
    benefits: [
      "Every PR gets a dedicated app and database, branched together",
      "Microsecond app-to-database latency, no cross-vendor network hop",
      "Long-running, streaming workloads built for hosting agents, not just apps",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Read the docs", href: DOCS },
    // Deliberately not "free while in public beta" — see the note at the top
    // of this file. This says the same encouraging thing without the label.
    microline: "Deploy from GitHub or the CLI. Free tier, no credit card.",
    tour: [
      {
        label: "Connect",
        caption:
          "Point Compute at a GitHub repo, or deploy straight from your machine with one command.",
        illustration: "repoConnect",
      },
      {
        label: "Deploy",
        caption:
          "One deploy ships the app and its branched database together, migrations included.",
        illustration: "deployLog",
      },
      {
        label: "Live",
        caption:
          "Production and a per-PR preview, each with its own app and its own isolated database.",
        illustration: "deployments",
      },
      {
        label: "Templates",
        caption:
          "Start from a template — Next.js, Hono, an API, an agent — and deploy it as it is.",
        illustration: "runTemplates",
      },
    ],
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
      // Descriptions trimmed to roughly two sentences. The review asked the
      // visuals to carry more of the explaining, and each card's illustration
      // already shows the specifics the cut clauses spelled out.
      {
        name: "Built for hosting AI agents",
        description:
          "Agents need long-lived processes, streaming responses and durable memory. Compute supports all three, on the same platform that runs your data.",
        illustration: "agentHosting",
      },
      {
        name: "Branch your stack per PR",
        description:
          "Every preview environment gets a dedicated database, branched from production and tied to that deploy. No shared test DB that passes tests production fails.",
        illustration: "branchedStack",
      },
      {
        name: "Microsecond queries, no code changes",
        description:
          "ORMs make many small queries, and on most stacks each one pays a network round trip between two vendors. Compute runs on the same machine as Prisma Postgres, so that round trip disappears.",
        illustration: "coLocated",
      },
      {
        name: "Cron and background jobs as a first-class concept",
        description:
          "Scheduled execution and background jobs are declared in prisma.config.ts, alongside the rest of your app. No external schedulers, no separate sidecar service.",
        illustration: "configJobs",
      },
      {
        name: "S3-compatible file storage built in",
        description:
          "Object Store buckets live inside your project, next to its databases, managed from the same Console and API. Any S3 client works, with per-bucket keys scoped to read or read-write.",
        href: "/docs/compute/object-storage",
        illustration: "objectStore",
      },
    ],
  },
  platform: {
    body: "Prisma Compute is where the stack comes together: your app, your database, and your data model on one platform.",
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
