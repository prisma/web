import { siteConfig } from "@/lib/config";
import type { ProductPageContent } from "../types";

// /compute copy, from the approved V4 of the Notion card "Product Page Batch
// One (3-5) - Copy", with the 2026-08-06 client review's changes marked inline
// and the 2026-09-30 claims pass applied on top (see the second note).
//
// The review asked this page for three things, and the hero tour answers all
// three: show the deployment experience immediately (Connect → Deploy → Live),
// bring starter templates far higher, and name what actually runs here instead
// of leaving it abstract.
//
// Three things V4 deliberately does on this page:
//  - No testimonial section. /orm and /postgres carry one; Compute does not,
//    which is why this page composes its sections directly.
//  - No "in public beta" callout. V3 had one and V4 removed it. Compute has
//    been generally available since August 2026, and the microline says so.
//  - Four features, rendered two by two (see product-features.tsx). V4 shipped
//    four; Object Store buckets, launched 2026-07-24, were added after the
//    review, and the cron card left in the claims pass.
//
// Claims pass, 2026-09-30: every product sentence in this file now has a line
// in apps/docs behind it. The shared platform-stack.tsx section, which /orm,
// /postgres and /compute all render, is not part of this pass. What went, and
// why:
//  - "the easiest way to host", "microsecond", "same machine", "no code
//    changes": superlatives and latency figures nothing in the docs states.
//  - "every PR", "branched from production", "branched together": previews are
//    per pushed branch and need deploy on push set up first
//    (compute/deploy-on-push.mdx), and production data is not copied into them
//    (compute/limitations.mdx, "Databases and migrations").
//  - "deploy it as it is", "long-running", "durable memory": an existing app
//    adds a Composer declaration first (composer/porting-an-app.mdx), and the
//    keep-awake primitives are best-effort, not durable
//    (compute/keeping-instances-awake.mdx).
//  - "low-latency queries" and "skip the cross-vendor network hop": the softer
//    cousins of the latency claim. The docs say only that the app runs next
//    to Prisma Postgres (compute/index.mdx), so the page says that.
//  - The cron card: cron scheduling is not part of this release and there is
//    no committed Compute config file (compute/limitations.mdx, "Runtime" and
//    "CLI"). It returns only as a Composer scheduled-jobs card once the
//    product team confirms one; the configJobs illustration stays for that.
const CONSOLE = "https://console.prisma.io/sign-up";
const DOCS = "/docs";

// The trust line the brief puts on the homepage and /compute. It is built from
// every entry of siteConfig.proof, the way hero-home.tsx and
// lib/markdown/home.ts build the homepage's proof line, so the two pages
// cannot drift apart and nothing here depends on how many entries the list
// has.
const TRUST_LINE = siteConfig.proof
  .map(({ stat, label }, i) => `${i === 0 ? "Trusted by " : ""}${stat} ${label}`)
  .join(" · ");

export const computeContent: ProductPageContent = {
  name: "Prisma Compute",
  accent: "compute",
  hero: {
    headline: "One platform for your app and its database",
    headlineEmphasis: "One platform",
    // The first sentence of the entity wording shared with the homepage,
    // /postgres and the docs. The microline carries its second and third
    // sentences; the page's meta description (app/compute/page.tsx) carries
    // all four verbatim.
    subheadline:
      "Prisma Compute hosts TypeScript apps (Node.js, Bun or Next.js) next to Prisma Postgres on one plan.",
    benefits: [
      "Set up deploy on push, and every pushed branch gets a preview with its own database",
      "Your app runs next to Prisma Postgres, in one of six regions",
      "Streams responses and scales to zero when idle, for agents as well as apps",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Read the docs", href: DOCS },
    microline: "Generally available since August 2026. Free plan, no credit card.",
    tour: [
      {
        label: "Connect",
        caption:
          "Deploy from your machine with npx prisma deploy module.ts, or connect the GitHub repo and add the deploy workflow to deploy on every push.",
        illustration: "repoConnect",
      },
      {
        label: "Deploy",
        caption:
          "One deploy provisions the services and databases declared in module.ts, and applies the migrations of any database typed by a Prisma ORM contract.",
        illustration: "deployLog",
      },
      {
        label: "Live",
        caption:
          "Production, plus a preview per pushed branch with its own services and database once deploy on push is set up.",
        illustration: "deployments",
      },
      {
        label: "Apps",
        caption:
          "Bring a Next.js, Hono or Bun app, or an agent: add a Composer declaration (service.ts and module.ts) around the server code you already have, then deploy.",
        illustration: "runApps",
      },
    ],
  },
  problem: {
    headline: "One platform can ship features two never could",
    body: [
      "When your hosting provider and your database provider are separate companies, the things that depend on them being aware of each other (branching, preview environments, end-to-end test data) don't exist. You wire them together yourself, or you do without.",
      "Prisma Compute exists to change that.",
    ],
    outcomes: [
      { icon: "gitBranch", label: "A preview per pushed branch" },
      { icon: "rocket", label: "Ship app and database in one deploy" },
      { icon: "bot", label: "Host streaming agents natively" },
      { icon: "settings", label: "One module.ts for app and database" },
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
          "Agents stream their answers and spend most of their time waiting on a model API. Compute streams a response as your service sends it, bills memory and active CPU separately, and scales to zero between tasks.",
        illustration: "agentHosting",
      },
      {
        name: "A preview per pushed branch",
        description:
          "Once deploy on push is set up, every pushed branch gets its own services and its own database, and deleting the branch tears them down. A database typed by a Prisma ORM contract gets your migrations applied on deploy; one declared with rawPostgres() keeps your own migration step. No shared test DB that passes tests production fails.",
        illustration: "branchedStack",
      },
      {
        name: "App and database on one platform",
        description:
          "Your app runs next to Prisma Postgres, in the same project and on the same plan, with PgBouncer pooling included. Any Postgres client works, and Prisma ORM is optional.",
        illustration: "coLocated",
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
    // The second sentence is the exit line shared with /postgres, verbatim.
    body: "Prisma Compute is where the stack comes together: your app, your database, and your data model on one platform. Standard Postgres underneath: leave with pg_dump; the Composer module is a TypeScript file in your repo, not a runtime.",
  },
  // The shared "Compare Prisma" reading list (sections/compare-links.tsx), the
  // same list /postgres and /pricing show. Only the sentence above it is this
  // page's own, so it must not repeat theirs.
  compare: {
    intro:
      "How Prisma Compute and Prisma Postgres compare with the other hosting and Postgres options, and where each one fits.",
  },
  // Visible text only: no FAQ schema, and every answer is a sentence the docs
  // back (the PR's "facts checked" block names the line for each). Plain
  // strings, the shape /postgres uses, so lib/markdown/product.ts prints them
  // as they are; where an answer leans on a docs page it names the page in
  // words.
  faq: [
    {
      question: "Can I host my existing GitHub repo with a TypeScript frontend and Node API here?",
      answer:
        "Yes, when the frontend and the API are TypeScript services built for Node.js, Bun or Next.js. Add a Composer declaration around the server code you already have (a service.ts per service and one module.ts); the porting guide in the docs has a prompt your coding agent can write it from. Run your build, then deploy with npx prisma deploy module.ts. For deploy on push, connect the repository and add the prisma/cloud-deploy-action workflow; from then on every pushed branch gets a preview with its own database.",
    },
    {
      question: "What does Prisma Compute not do?",
      answer:
        "Compute does not support WebSocket servers, cron scheduling or a persistent filesystem today, and each service runs in one region, chosen from six. A request has 60 seconds to send its first byte, and a response that has started streaming is not cut off. The runtime is Bun. The Compute FAQ in the docs has the full list of trade-offs.",
    },
    {
      question: "Do I need Prisma ORM?",
      answer:
        "No. Your app reaches Prisma Postgres, or any other Postgres, through a connection string, so any Postgres client works. Prisma ORM is optional.",
    },
    {
      question: "Is Prisma Compute related to Prisma Cloud?",
      answer:
        "No. Prisma Compute is unrelated to Palo Alto Networks' Prisma Cloud. Prisma makes Prisma ORM, Prisma Postgres and Prisma Compute, and the dashboard is Prisma Console.",
    },
    {
      question: "What does it cost?",
      answer:
        "The Free plan includes 1M requests, 360 GB-hours of memory, 4 active vCPU-hours and 10 GB of outbound bandwidth a month for Compute, and 200k operations, 500 MB and 50 databases for Prisma Postgres, with no credit card and no usage billing. Starter is $10 a month base plus metered compute: 5M requests and 1M operations are included, memory ($0.006 per GB-hour), active vCPU ($0.064 per hour) and bandwidth ($0.025 per GB) are metered from the first unit, and you can set a spend limit. An idle app scales to zero. The pricing page lists every plan.",
    },
  ],
  cta: {
    headline: "One platform. Both layers. Features only possible because of it.",
    body: "Compute is part of a TypeScript stack where hosting and the database travel as a unit: preview them together, deploy them together, debug them together.",
    benefits: [
      "Built to host the agents you're building, not just the apps",
      "A preview per pushed branch, app and database together",
      "App next to its database, on one plan",
      TRUST_LINE,
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Read the docs", href: DOCS },
  },
};
