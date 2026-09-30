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
// Claims pass, 2026-09-30: every product sentence on this page now has a line
// in apps/docs behind it. What went, and why:
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

// The trust line the brief puts on the homepage, /compute and /postgres. Its
// numbers are siteConfig.proof's first and last entries (developers, GitHub
// stars), the same source as the homepage hero, so the pages cannot drift
// apart. The market-share entry between them stays off this page.
const developers = siteConfig.proof[0];
const stars = siteConfig.proof[2];
const TRUST_LINE = `Trusted by ${developers.stat} ${developers.label} · ${stars.stat} ${stars.label}`;

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
  compare: {
    headline: "Compare Prisma",
    body: "How Prisma Compute and Prisma Postgres compare with the other hosting and Postgres options, and where each one fits.",
    links: [
      {
        label: "Where to host a TypeScript frontend, a Node API, and Postgres",
        href: "/blog/where-to-host-typescript-frontend-node-api-postgres",
      },
      {
        label: "Choosing hosting and Postgres after your first 100 paying users",
        href: "/blog/choosing-hosting-and-postgres-after-your-first-100-users",
      },
      {
        label: "Neon vs Prisma Postgres when you want hosting and the database in one place",
        href: "/blog/neon-vs-prisma-postgres-app-hosting-in-one-place",
      },
      // Each label is the post's title as it stands on this branch. The entity
      // PR A retitles this one "Netlify alternatives for a full-stack
      // TypeScript app with Postgres (2026)"; the label follows at the rebase.
      {
        label: "Prisma vs Netlify: where should you build your next TypeScript app?",
        href: "/blog/prisma-vs-netlify",
      },
      // No docs link here: the page links /docs/compute/faq exactly once, from
      // the "What does Prisma Compute not do?" answer below, next to the limits
      // it summarises.
    ],
  },
  // Visible text only: no FAQ schema, and every answer is a sentence the docs
  // back (the PR's "facts checked" block names the line for each).
  faq: [
    {
      question: "Can I host my existing GitHub repo with a TypeScript frontend and Node API here?",
      answer:
        "Yes, when the frontend and the API are TypeScript services built for Node.js, Bun or Next.js. Add a Composer declaration around the server code you already have (a service.ts per service and one module.ts); the porting guide has a prompt your coding agent can write it from. Deploy with npx prisma deploy module.ts. For deploy on push, connect the repository and add the prisma/cloud-deploy-action workflow; from then on every pushed branch gets a preview with its own database.",
      link: { label: "Port an existing app", href: "/docs/composer/porting-an-app" },
    },
    {
      question: "What does Prisma Compute not do?",
      answer:
        "No WebSocket servers yet. Each service runs in one of six regions. A request has 60 seconds to send its first byte, and a response that has started streaming is not cut off. No cron scheduling and no persistent filesystem. The runtime is Bun.",
      link: { label: "Compute FAQ", href: "/docs/compute/faq" },
    },
    {
      question: "Do I need Prisma ORM?",
      answer:
        "No. Your app reaches Prisma Postgres, or any other Postgres, through a connection string, so any Postgres client works. Prisma ORM is optional.",
      link: { label: "Compute docs", href: "/docs/compute" },
    },
    {
      question: "Is Prisma Compute related to Prisma Cloud?",
      answer:
        "No. Prisma Compute is unrelated to Palo Alto Networks' Prisma Cloud. Prisma makes Prisma ORM, Prisma Postgres and Prisma Compute, and the dashboard is Prisma Console.",
    },
    {
      question: "What does it cost?",
      answer:
        "The Free plan includes 1M requests, 360 GB-hours of memory, 4 active vCPU-hours and 10 GB of outbound bandwidth a month for Compute, and 200k operations, 500 MB and 50 databases for Prisma Postgres, with no credit card and no usage billing. Starter is $10 a month base plus metered compute: 5M requests and 1M operations are included, memory ($0.006 per GB-hour), active vCPU ($0.064 per hour) and bandwidth ($0.025 per GB) are metered from the first unit, and you can set a spend limit. An idle app scales to zero.",
      link: { label: "See pricing", href: "/pricing" },
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
