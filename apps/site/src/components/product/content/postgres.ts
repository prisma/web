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
//    any other Postgres?". The hero tour is that answer: a database per
//    preview, Studio and Query Insights are the three things a bare managed
//    Postgres doesn't give you, so they lead rather than sitting in feature
//    cards further down.
//
// Deviation (2026-10-08): the preview and pricing lines say what the docs
// state. With deploy on push, each pushed branch's preview gets a new database
// and production data is not copied (docs compute/deploy-on-push.mdx); pricing
// is per operation with a hard spend limit on paid plans (/pricing). The FAQ
// says "in one project" with the Starter base, as /compute's FAQ does.
const CONSOLE = "https://console.prisma.io/sign-up";
const PRICING = "/pricing";

export const postgresContent: ProductPageContent = {
  name: "Prisma Postgres",
  accent: "postgres",
  hero: {
    headline: "Production-ready Postgres, already wired to your stack",
    headlineEmphasis: "already",
    // History: added 2026-09-30 as part of the entity freeze, when the same
    // positioning sentence ran, verbatim, on the homepage, /compute and the
    // docs Compute index.
    //
    // Deliberate divergence (2026-10-08, VP-approved): the /postgres SEO pass
    // leads with Postgres rather than Compute, since that is the product this
    // page sells. The homepage (SITE_HOME_DESCRIPTION), /compute hero and the
    // docs Compute index are intentionally left on the original sentence. Keep
    // this subtitle on /postgres only; do not sync it back.
    // Check the CTA still clears the fold at 1440x800 when the copy changes.
    subheadline:
      "Managed Postgres for TypeScript and AI apps, with Prisma Compute to host your app (Node.js, Bun or Next.js) next to it in one project. Any Postgres client works; Prisma ORM is optional. Start on the free plan, no credit card.",
    benefits: [
      "Free preview databases per feature branch, for the ones you declare",
      "Billed per operation, with a hard spend limit on paid plans",
      "Predictable pricing with spend limits, no surprise bills",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "See pricing", href: PRICING },
    microline: "Free tier with a hard cap. No credit card.",
    tour: [
      {
        label: "Database",
        caption:
          "A production Postgres in seconds, and, with deploy on push, new databases for each feature branch's preview (the ones your Composer module declares); production data is not copied.",
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
      "When your database and your hosting come from separate vendors, the things that should be automatic (a database for every preview, end-to-end test setups, single-config deploys) turn into work you have to do.",
    ],
    outcomes: [
      { icon: "gitBranch", label: "A preview database per feature branch" },
      { icon: "shield", label: "Predictable pricing with spend limits" },
      { icon: "swap", label: "Per-operation billing with spend limits" },
      { icon: "database", label: "Standard Postgres, no lock-in" },
    ],
  },
  features: {
    headline: "Previews, deploys and config that come with the app",
    bridge:
      "Prisma Postgres runs on the same platform as Compute, so the features below come from one platform doing what two vendors can't.",
    items: [
      // Descriptions are cut to roughly one sentence each. The review asked
      // for the visuals to carry more of the explaining, and the card
      // illustrations already show the specifics the trimmed clauses spelled
      // out (branch names, the config file, the spend cap, the compliance
      // list, the pg_dump path).
      {
        name: "A database per preview",
        description:
          "With deploy on push, every feature branch (any branch except the default) gets a preview with its own services and, for databases declared in the Composer module, its own new database. Production data is not copied.",
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
        // 2026-10-08: compliance claims rewritten to match pricing and the
        // page's own FAQ, which pin each certification to the plan it starts
        // from. Daily backups are paid-plan only (Free has none).
        // 2026-10-14: HIPAA (with signed BAA) moved to Business only; the
        // deep link points at /postgres/hipaa, which the card renders through
        // `renderInlineMarkup` (see product-features.tsx).
        description:
          "Daily backups on paid plans, encryption at rest and in transit, full tenant isolation. GDPR on every plan. [HIPAA](/postgres/hipaa), SOC 2 Type II and ISO 27001 on Business.",
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
  // a visible FAQ in the words people ask answer engines.
  //
  // Replaced 2026-10-08 with the VP-approved 9-item FAQ v2 (faq-v2.json): same
  // plain-string shape, with a tiny inline syntax the FAQ section parses:
  // `[text](/path)` for a link and backticks for inline code. The same strings
  // feed the FAQPage JSON-LD on this page (see app/postgres/page.tsx) with the
  // markup stripped back to plain text, so visible and structured copy cannot
  // drift. Every claim is checked against the docs or pricing page named in
  // the PR that added it; keep the answers in step with those pages.
  compare: {
    intro:
      "How Prisma Postgres and Prisma Compute compare with Neon, Supabase and other places to run a TypeScript app and its database, including where another pick is better.",
  },
  faq: [
    {
      question: "Is Prisma Postgres free to use?",
      answer:
        "Yes. The [Free plan](/pricing) costs $0, needs no credit card and includes 200,000 operations a month across up to 50 databases in a workspace. An operation is one query, read or write, and usage resets at the start of each calendar month. On the Free plan, idle databases cost nothing and you never wake one by hand: the next query does it. Backups and spend limits start on the Starter plan at $10 a month.",
    },
    {
      question: "What happens when I reach the Free plan limit?",
      answer:
        "Your workspace's databases stop accepting queries until the allowance resets at the start of the next month, or until you upgrade, which usually restores access within a minute. If you need time to export your data first, you can [lift the limit for 24 hours](/docs/postgres/faq#what-happens-if-i-exceed-the-included-queries-on-the-free-tier) from the Console, once per workspace. Paid plans bill operations beyond the included amount at your plan's rate, with a spend limit that is on by default.",
    },
    {
      question: "Can I create a database without signing up?",
      answer:
        "Yes. Run [`npx create-db`](/docs/postgres/npx-create-db) and you get a Postgres database and its connection string in seconds, with no account and no credit card. Add `--json` when a coding agent needs machine-readable output. The database is deleted after 24 hours unless you claim it: open the claim link from the output and sign in, and it moves into your workspace under that plan's limits.",
    },
    {
      question: "Can I manage my databases from Claude Code, Cursor or Codex?",
      answer:
        "Yes, through Prisma's [hosted MCP server](/docs/ai/tools/mcp-server) at https://mcp.prisma.io/mcp, which you connect with your Prisma sign-in. In Claude Code, run `claude mcp add --transport http prisma https://mcp.prisma.io/mcp`. Cursor adds it from its MCP settings or a one-click link, and Codex through the Prisma plugin. An agent can then create databases, inspect the schema, run SQL, apply schema changes and, on paid plans, restore a backup into a new database. For scripts, there is also a REST API that uses a workspace service token. To keep test writes away from customer data, see [hosting a TypeScript test app with a separate database](/postgres/typescript-test-environment).",
    },
    {
      question: "Where do I find my connection string?",
      answer:
        "In the Prisma Console: open your project, select Connect to your database, then Generate new connection string. You get [two connection strings](/docs/postgres/database/connecting-to-your-database). Use the pooled one as `DATABASE_URL` for your app and serverless functions, and the direct one for migrations, Prisma Studio and `pg_dump`. SSL is required, so keep `sslmode=require` in the URL. `npx create-db` also prints a connection string. Once connected, the [query-monitoring guide](/postgres/managed-postgres-query-monitoring) explains how to inspect slow SQL and existing indexes.",
    },
    {
      question: "Does Prisma Postgres support pgvector?",
      answer:
        "Yes, on every plan, including Free. Enable it with `CREATE EXTENSION IF NOT EXISTS vector;` from any Postgres client or a migration, then store embeddings in vector columns and run similarity search with pgvector's distance operators. Prisma ORM works with vector columns through raw SQL or TypedSQL, and Prisma Studio can't open tables that contain them yet. See the full list of [supported extensions](/docs/postgres/database/postgres-extensions).",
    },
    {
      question: "Are backups included?",
      answer:
        "Yes, every paid plan includes daily [automatic backups](/docs/postgres/database/backups). Starter and Pro keep them for 7 days and Business keeps them for 30; the Free plan has none. You restore a backup from the database's Backups tab in the Console, or ask an agent to restore one into a new database through the MCP server. Point-in-time restore is coming in November 2026. To keep your own copy, run `pg_dump` against the direct connection string, on any plan with available usage.",
    },
    {
      question: "Which regions can I choose?",
      answer:
        "Six: San Francisco (us-west-1), North Virginia (us-east-1), Paris (eu-west-3), Frankfurt (eu-central-1), Tokyo (ap-northeast-1) and Singapore (ap-southeast-1). You pick the region for each database when you create it in the Console, through MCP or with `npx create-db --region`. Without the flag, `npx create-db` picks the region closest to you. For deployed apps, see [choosing app and database regions](/postgres/nodejs-database-regions).",
    },
    {
      question: "Is Prisma Postgres HIPAA compliant?",
      answer:
        "Yes, on the Business plan at $129 a month, with a signed Business Associate Agreement (BAA). HIPAA is not available on the Free, Starter or Pro plans. For comparison, Supabase only offers HIPAA from its Team plan at $599 a month, plus a paid HIPAA add-on. Business also includes SOC 2 Type II and ISO 27001, and GDPR applies on every plan, including Free. See [HIPAA on the Business plan](/postgres/hipaa) for the BAA and scope. Audit reports and control details are in the [Prisma Trust Center](https://trust.prisma.io).",
    },
  ],
  cta: {
    headline: "Postgres that ships with the rest of your stack",
    body: "Prisma Postgres is the data half of a TypeScript platform. Use it on its own with any ORM and any host, or pair it with Compute and your app and database become one deploy and one config, with a preview and its own declared databases for each feature branch.",
    benefits: [
      "Free preview databases that come with your app's previews",
      "Predictable pricing with spend limits",
      "Standard Postgres underneath, no lock-in",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "See pricing", href: PRICING },
  },
};
