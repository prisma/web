import type { OgAccent } from "@prisma-docs/ui/components/og-image";
import type { ProductAccentName, ProductIconName } from "@/components/product/icons";
import type { ProductTourStop } from "@/components/product/types";

// Copy for the ChatGPT ads landing pages under /lp. One object per ad message,
// rendered by the shared components in this folder, so a new campaign is a
// new entry here plus a three-line page.tsx.
//
// Every product sentence here has a line in apps/docs or on /pricing behind
// it, the same rule the product pages follow (see product/content/compute.ts).
// The pricing figures are checked against the live prisma.io/pricing and
// vercel.com/pricing pages; the date of the last check is in price-compare.tsx.
//
// Copy follows the Prisma marketing strategy page (Notion, "Prisma: Marketing
// Strategy", 2026-10): start from the developer's problem in their own words,
// then benefit, proof and one next step. Each hero is headline, supporting
// line, offer (the real free-plan terms), then the demonstration; the section
// headings carry the argument on their own for a reader who only scans.
//
// Conversion rules the pages are built around:
//  - One CTA, one wording, one destination: "Get started for free" to the
//    Console sign-up. UtmPersistence stamps the campaign params and the ad
//    click id on it at click time, so nothing here touches the URL.
//  - The headline repeats the ad's promise, in the ad's words. The words are
//    the ones that performed in the first ChatGPT campaign (Ads Manager,
//    "Prisma Compute: deploy for less", Oct 9 to 13): "1M free requests every
//    month with Prisma Compute" took most of the impressions and every
//    conversion; "Host your app and Postgres database in one place" had the
//    best click-through rate and the lowest cost per click; "free monthly
//    usage allowances and pay as you grow" was the winning ad's supporting
//    line. "Deploy for less than Vercel" converted nobody, so the price
//    comparison is proof further down, not the promise.
//  - No navigation, no outbound links in the body. The FAQ answers in words
//    what a docs link would otherwise carry.

export const CONSOLE_SIGNUP_URL = "https://console.prisma.io/sign-up";
export const CTA_LABEL = "Get started for free";

export type LandingSlug = "compute" | "postgres" | "free";

export type LandingContent = {
  slug: LandingSlug;
  /** The page's path, also its canonical URL. */
  path: string;
  /** The `utm_campaign` value the matching ad campaign should send. */
  campaign: string;
  meta: {
    title: string;
    description: string;
    ogKicker: string;
    ogAccent: OgAccent;
  };
  /** Product role kicker above the headline and its dot colour. */
  kicker: string;
  accent: ProductAccentName;
  hero: {
    /** The ad's promise, 4 to 8 words. */
    headline: string;
    /** Substring of the headline that gets the glass-light glide. */
    headlineEmphasis?: string;
    /** One or two sentences: what it is, what it does for you. */
    subheadline: string;
    /** The offer under the CTA: the real free-plan terms. */
    microline: string;
    /** The product tour beside the copy; pages without one pass a visual. */
    tour?: ProductTourStop[];
  };
  flow: {
    headline: string;
    body: string;
  };
  benefits: {
    headline: string;
    bridge: string;
    items: { icon: ProductIconName; name: string; description: string }[];
  };
  faq: { question: string; answer: string }[];
  cta: {
    headline: string;
    body: string;
    checks: [string, string, string];
  };
};

// Stops shared between the tours: the same deploy and the same result, so the
// Postgres page ends where the Compute page's ad promise begins.
const DEPLOY_STOP: ProductTourStop = {
  label: "Deploy",
  caption:
    "One command, npx prisma deploy module.ts, provisions the app and its Prisma Postgres database and applies your migrations.",
  illustration: "deployLog",
};

const LIVE_STOP: ProductTourStop = {
  label: "Live",
  caption:
    "Production, plus a preview per feature branch with its own app and its own database once deploy on push is set up.",
  illustration: "deployments",
};

export const computeLanding: LandingContent = {
  slug: "compute",
  path: "/lp/compute",
  campaign: "compute-app-and-database",
  meta: {
    title: "1M free requests every month with Prisma Compute",
    description:
      "Deploy your TypeScript apps with free monthly usage allowances and pay as you grow. Prisma Compute hosts your app and its Prisma Postgres database in one place. No credit card, no time limit.",
    ogKicker: "Prisma Compute",
    ogAccent: "red",
  },
  kicker: "Prisma Compute",
  accent: "compute",
  hero: {
    headline: "1M free requests every month with Prisma Compute",
    headlineEmphasis: "1M free requests",
    subheadline:
      "Deploy your TypeScript apps with free monthly usage allowances and pay as you grow. Prisma Compute hosts your app and its Postgres database in one place, created together in one deploy, with no wiring between two vendors.",
    microline:
      "Free every month: 1M requests, 360 GB-hours of memory and a Postgres database. No credit card, no time limit.",
    tour: [
      DEPLOY_STOP,
      LIVE_STOP,
      {
        label: "Connect",
        caption:
          "Deploy from your machine, or connect the GitHub repo and add the deploy workflow so every push deploys.",
        illustration: "repoConnect",
      },
      {
        label: "Apps",
        caption:
          "Bring a Next.js, Hono or Bun app, or an agent: add a short Composer declaration around the server code you already have, then deploy.",
        illustration: "runApps",
      },
    ],
  },
  flow: {
    headline: "Two vendors means glue code. One platform means one deploy.",
    body: "Prisma ORM 8 types your queries, Prisma Postgres stores the data, Prisma Compute runs the app next to it. Use all three and nothing needs wiring. Use one and it still works: any Postgres client connects, and the ORM is optional.",
  },
  benefits: {
    headline: "What you stop doing",
    bridge: "Each of these is work that two vendors leave to you.",
    items: [
      {
        icon: "server",
        name: "No connection strings to copy between dashboards",
        description:
          "Declare the app and its database in one TypeScript module. Deploy creates both, connects them, and prints the live URL.",
      },
      {
        icon: "gitBranch",
        name: "No shared test database",
        description:
          "Set up deploy on push and every feature branch gets its own app and its own new database, deleted with the branch. Tests run on data that looks like production, not on data another branch just changed.",
      },
      {
        icon: "database",
        name: "No query crossing a vendor boundary",
        description:
          "Your app runs in the same project and region as Prisma Postgres, with connection pooling included. It is standard Postgres, so any client works.",
      },
      {
        icon: "shield",
        name: "No bill that grows with headcount",
        description:
          "Pay for requests, memory and active CPU. No seat fees, nothing for deploys or previews, a spend limit you set, and an idle app scales to zero.",
      },
    ],
  },
  faq: [
    {
      question: "Can I deploy an app I already have?",
      answer:
        "Yes, if it is a TypeScript service built for Node.js, Bun or Next.js. You add a short Composer declaration (a service.ts and a module.ts) around the server code you already have, run your build, and deploy with npx prisma deploy module.ts. The docs include a prompt your coding agent can write the declaration from.",
    },
    {
      question: "What does it cost?",
      answer:
        "The Free plan includes 1M requests, 360 GB-hours of memory, 4 active vCPU-hours and 10 GB of bandwidth a month for Compute, plus 200k operations, 2 GB and 50 databases for Prisma Postgres, with no credit card and no usage billing. Starter is $10 a month with 5M requests included, then memory at $0.006 per GB-hour and active vCPU at $0.064 per hour, with a spend limit you set.",
    },
    {
      question: "Do I have to use Prisma ORM?",
      answer:
        "No. Your app reaches Prisma Postgres through a standard connection string, so any Postgres client works. Prisma ORM 8 is optional; it adds a typed client, safe migrations and migrations applied for you on deploy.",
    },
    {
      question: "Is Prisma Compute related to Prisma Cloud?",
      answer:
        "No. Prisma Compute is unrelated to Palo Alto Networks' Prisma Cloud. Prisma makes Prisma ORM, Prisma Postgres and Prisma Compute, and the dashboard is Prisma Console.",
    },
  ],
  cta: {
    headline: "Start with 1M free requests every month",
    body: "Sign up, run one deploy, and get a live URL with a Prisma Postgres database behind it. The free monthly allowances have no time limit and need no credit card, and paid plans start at $10 a month with a spend limit you set.",
    checks: [
      "1M free requests every month",
      "No credit card required",
      "Pay as you grow, with a spend limit",
    ],
  },
};

export const postgresLanding: LandingContent = {
  slug: "postgres",
  path: "/lp/postgres",
  campaign: "postgres-managed-database",
  meta: {
    title: "A production Postgres database, free every month | Prisma Postgres",
    description:
      "Managed Postgres with free monthly usage allowances: 200k operations, 2 GB of storage and 50 databases. Create it in seconds, connect any Postgres client, and host your app next to it in one place with Prisma Compute. No credit card.",
    ogKicker: "Prisma Postgres",
    ogAccent: "yellow",
  },
  kicker: "Prisma Postgres",
  accent: "postgres",
  hero: {
    headline: "A production Postgres database, free every month",
    headlineEmphasis: "free every month",
    subheadline:
      "Get a managed Postgres database with free monthly usage allowances and pay as you grow. Create it in seconds from the Console, a terminal or your coding agent, with pooling, backups and a spend limit built in, then host your app next to it in one place with Prisma Compute.",
    microline:
      "Free every month: 200k operations, 2 GB of storage and 50 databases. No credit card, no time limit.",
    tour: [
      {
        label: "Database",
        caption:
          "A production Postgres in seconds, with pooled and direct connection strings and SSL on by default. Any Postgres client works.",
        illustration: "databasePanel",
      },
      {
        label: "Studio",
        caption:
          "Browse and edit real rows in the browser. No psql, no local client to set up first.",
        illustration: "studioTable",
      },
      {
        label: "Insights",
        caption: "See which queries are slow and why, without standing up your own tracing stack.",
        illustration: "queryInsights",
      },
      DEPLOY_STOP,
    ],
  },
  flow: {
    headline: "The database now, the rest of the stack when you want it",
    body: "Prisma Postgres works on its own with any ORM and any host. Add Prisma ORM 8 for typed queries and safe migrations, and Prisma Compute to run the app next to the database, and the wiring between them disappears.",
  },
  benefits: {
    headline: "Why this Postgres",
    bridge:
      "A bare managed Postgres hands you a connection string. These are the things you would otherwise build around it.",
    items: [
      {
        icon: "database",
        name: "Ready in seconds",
        description:
          "Create a database from the Console, with npx create-db from a terminal, or through the MCP server from Claude Code, Cursor or Codex. You get pooled and direct connection strings, with SSL required.",
      },
      {
        icon: "gitBranch",
        name: "A database per preview",
        description:
          "Pair it with Prisma Compute and every feature branch gets a preview with its own new database, torn down with the branch. Production data is never copied into a preview.",
      },
      {
        icon: "shield",
        name: "A bill you can cap",
        description:
          "Billed per operation, one query read or write, with a spend limit you set on paid plans. A quiet month costs almost nothing, and a busy one never surprises you.",
      },
      {
        icon: "swap",
        name: "Standard Postgres, no lock-in",
        description:
          "Standard SQL and wire protocol, extensions like pgvector on every plan, Studio to browse rows and Query Insights to find slow queries. Leave any time with pg_dump.",
      },
    ],
  },
  faq: [
    {
      question: "Is Prisma Postgres free to use?",
      answer:
        "Yes. The Free plan costs $0, needs no credit card and includes 200,000 operations a month across up to 50 databases. An operation is one query, read or write, and usage resets at the start of each calendar month. Idle databases cost nothing, and the next query wakes one. Backups and spend limits start on the Starter plan at $10 a month.",
    },
    {
      question: "What happens when I reach the Free plan limit?",
      answer:
        "Nothing is charged. Your databases stop accepting queries until the allowance resets next month or you upgrade, which usually restores access within a minute. If you need time to export your data first, you can lift the limit for 24 hours from the Console, once per workspace.",
    },
    {
      question: "Do I need Prisma ORM?",
      answer:
        "No. Prisma Postgres is standard Postgres, so any ORM, query builder or raw SQL client connects with the connection string. Prisma ORM 8 is optional; with it, your schema drives a typed client and migrations that are applied for you when you deploy on Prisma Compute.",
    },
    {
      question: "Which regions can I choose?",
      answer:
        "Six: San Francisco, North Virginia, Paris, Frankfurt, Tokyo and Singapore. You pick the region for each database when you create it. Hosting the app on Prisma Compute in the same region keeps queries local.",
    },
  ],
  cta: {
    headline: "Start with a free Postgres database today",
    body: "Create a database now and host the app next to it when you are ready. The free monthly allowances have no time limit and need no credit card, and it is standard Postgres underneath, so you can leave at any time.",
    checks: [
      "200k operations and 2 GB free every month",
      "No credit card required",
      "Standard Postgres, leave any time",
    ],
  },
};

export const freeLanding: LandingContent = {
  slug: "free",
  path: "/lp/free",
  campaign: "free-plan",
  meta: {
    title: "1M free requests and a Postgres database every month | Prisma",
    description:
      "Prisma's Free plan: 1M Compute requests, 200k database operations, 2 GB of storage and 50 databases every month, with no credit card and no time limit. Host your app and Postgres database in one place and pay as you grow.",
    ogKicker: "Free plan",
    ogAccent: "yellow",
  },
  kicker: "Free plan",
  accent: "postgres",
  hero: {
    headline: "1M free requests and a Postgres database, every month",
    headlineEmphasis: "every month",
    subheadline:
      "Build and launch a real TypeScript app on free monthly usage allowances and pay as you grow. Your app and its Postgres database run in one place, with no credit card, no expiry and no usage billing until you choose a paid plan.",
    microline: "$0 a month. No credit card, no expiry, no usage billing.",
  },
  flow: {
    headline: "Everything the app needs, on the Free plan",
    body: "Prisma ORM 8 is free and open source. The Free plan adds a hosted Prisma Postgres database and Prisma Compute deploys, so the whole path from first query to live URL costs nothing.",
  },
  benefits: {
    headline: "What the Free plan is enough for",
    bridge: "The allowances are sized for real apps with real users, not for a demo that expires.",
    items: [
      {
        icon: "rocket",
        name: "A side project with real users",
        description:
          "1M requests a month is about 23 requests a minute, all month long. Enough for a launch, a waitlist, a newsletter signup page or a small SaaS beta.",
      },
      {
        icon: "bot",
        name: "An AI agent or bot",
        description:
          "Compute streams responses, bills memory and active CPU separately, and scales to zero between tasks, so an agent that mostly waits on a model API uses little of the allowance.",
      },
      {
        icon: "database",
        name: "Up to 50 databases",
        description:
          "One per prototype, per branch or per customer. Each is standard Postgres, provisioned in seconds, with 2 GB of storage included on the plan.",
      },
      {
        icon: "shield",
        name: "No surprise bill",
        description:
          "The Free plan has no usage billing at all. When your app needs more than the allowance, you choose to upgrade; you are never charged for going over.",
      },
    ],
  },
  faq: [
    {
      question: "Is there a time limit on the Free plan?",
      answer: "No. The Free plan is free forever, not a trial. The allowances reset every month.",
    },
    {
      question: "Do I need a credit card?",
      answer:
        "No. You sign up, create a database and deploy an app without entering a card. A card is only needed when you upgrade to a paid plan.",
    },
    {
      question: "What happens when I reach a limit?",
      answer:
        "Nothing is charged. The Free plan has no usage billing: a database that reaches its operations allowance stops accepting queries until the allowance resets next month or you upgrade. Starter is $10 a month, includes 5M Compute requests and 1M database operations, meters usage beyond that, and lets you set a spend limit.",
    },
    {
      question: "What exactly is included?",
      answer:
        "Prisma Postgres: 200k operations a month, 2 GB of storage and 50 databases. Prisma Compute: 1M requests, 360 GB-hours of memory, 4 active vCPU-hours and 10 GB of outbound bandwidth a month, with scale to zero. Prisma ORM 8 is free and open source regardless of plan.",
    },
  ],
  cta: {
    headline: "Start building for free today",
    body: "Sign up, create a database, deploy an app. The Free plan has no time limit and no credit card, and the ORM is free whatever plan you are on.",
    checks: [
      "No credit card required",
      "Free forever, not a trial",
      "Standard Postgres, leave any time",
    ],
  },
};

export const landingPages: Record<LandingSlug, LandingContent> = {
  compute: computeLanding,
  postgres: postgresLanding,
  free: freeLanding,
};
