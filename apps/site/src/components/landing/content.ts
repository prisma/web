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
// Conversion rules the pages are built around:
//  - One CTA, one wording, one destination: "Get started for free" to the
//    Console sign-up. UtmPersistence stamps the campaign params and the ad
//    click id on it at click time, so nothing here touches the URL.
//  - The headline repeats the ad's promise, in the ad's words, so a visitor
//    who clicked "Your app and database, together" lands on exactly that.
//  - No navigation, no outbound links in the body. The FAQ answers in words
//    what a docs link would otherwise carry.

export const CONSOLE_SIGNUP_URL = "https://console.prisma.io/sign-up";
export const CTA_LABEL = "Get started for free";

export type LandingSlug = "compute" | "orm" | "free";

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
    /** Reassurance directly under the CTA. */
    microline: string;
    benefits: [string, string, string];
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

// Two stops shared by the Compute and ORM tours: the same deploy and the same
// result, so the ORM page ends where the Compute page's ad promise begins.
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

const SCHEMA_STOP: ProductTourStop = {
  label: "Model",
  caption:
    "Define your data model once in a Prisma schema. Prisma ORM 8 generates a typed client from it.",
  illustration: "schemaFile",
};

const QUERY_STOP: ProductTourStop = {
  label: "Query",
  caption:
    "Every query is checked against your schema in the editor, so a wrong field name fails before it ships.",
  illustration: "clientAutocomplete",
};

export const computeLanding: LandingContent = {
  slug: "compute",
  path: "/lp/compute",
  campaign: "compute-app-and-database",
  meta: {
    title: "Your app and database, together | Prisma Compute",
    description:
      "Deploy your TypeScript app and its Prisma Postgres database on one platform. Build with Prisma ORM 8, deploy with one command, start on a free plan with no credit card.",
    ogKicker: "Prisma Compute",
    ogAccent: "red",
  },
  kicker: "Prisma Compute",
  accent: "compute",
  hero: {
    headline: "Your app and database, together",
    headlineEmphasis: "together",
    subheadline:
      "Prisma Compute hosts your TypeScript app next to its Prisma Postgres database. One deploy creates both, with no second vendor to wire up.",
    microline: "Free plan, no credit card. Generally available since August 2026.",
    benefits: [
      "Deploy a Node.js, Bun or Next.js app and its Postgres database in one command",
      "A preview with its own database for every feature branch",
      "Scales to zero when idle, so you pay for the work your app does",
    ],
    tour: [{ ...SCHEMA_STOP, label: "Build" }, QUERY_STOP, DEPLOY_STOP, LIVE_STOP],
  },
  flow: {
    headline: "Build, store, deploy. Three products, one workflow.",
    body: "Prisma ORM 8 gives your app a typed data layer. Prisma Postgres stores the data. Prisma Compute runs the app next to it. Each works on its own, and together they remove the glue code between vendors.",
  },
  benefits: {
    headline: "What one platform saves you",
    bridge:
      "When hosting and the database come from one place, the things that depend on them knowing about each other stop being your job.",
    items: [
      {
        icon: "server",
        name: "One deploy, both halves",
        description:
          "Declare the app and its database in one TypeScript module. Deploy creates both, connects them, and prints the live URL. No connection strings to copy between dashboards.",
      },
      {
        icon: "gitBranch",
        name: "A preview for every branch",
        description:
          "Set up deploy on push and every feature branch gets its own app and its own database, torn down when the branch is deleted. No shared test database that passes tests production fails.",
      },
      {
        icon: "database",
        name: "Standard Postgres, next to the app",
        description:
          "Your app runs in the same project and region as Prisma Postgres, with connection pooling included. Any Postgres client works, and Prisma ORM is optional.",
      },
      {
        icon: "shield",
        name: "A bill you can cap",
        description:
          "Pay for requests, memory and active CPU, not seats or deploys. Every paid plan has a spend limit you set, and an idle app scales to zero.",
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
        "The Free plan includes 1M requests, 360 GB-hours of memory, 4 active vCPU-hours and 10 GB of bandwidth a month for Compute, plus 200k operations, 1.01 GB and 50 databases for Prisma Postgres, with no credit card and no usage billing. Starter is $10 a month with 5M requests included, then memory at $0.006 per GB-hour and active vCPU at $0.064 per hour, with a spend limit you set.",
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
    headline: "Deploy your app and database together",
    body: "Sign up, deploy a TypeScript app, and get a live URL with a Prisma Postgres database behind it. The Free plan has no time limit and no credit card.",
    checks: [
      "No credit card required",
      "Free plan with no time limit",
      "Upgrade only when you outgrow it",
    ],
  },
};

export const ormLanding: LandingContent = {
  slug: "orm",
  path: "/lp/orm",
  campaign: "orm-8-typescript",
  meta: {
    title: "Build TypeScript apps with Prisma ORM 8 | Prisma",
    description:
      "Prisma ORM 8 is the type-safe ORM for TypeScript: one schema, a generated client, migrations that refuse to destroy data. Run it on Prisma Postgres and deploy with Prisma Compute for free.",
    ogKicker: "Prisma ORM 8",
    ogAccent: "cyan",
  },
  kicker: "Prisma ORM 8",
  accent: "orm",
  hero: {
    headline: "Build TypeScript apps with Prisma ORM 8",
    headlineEmphasis: "Prisma ORM 8",
    subheadline:
      "Define your data model once. Prisma ORM 8 generates a typed client where every query, migration and type is checked against it, and the same schema runs on Prisma Postgres and Prisma Compute with no rework.",
    microline:
      "Free and open source. A Console account adds a free Prisma Postgres database and deploys.",
    benefits: [
      "Autocomplete over your own models, and mistakes caught before they ship",
      "Migrations that refuse to run when they would destroy data",
      "52% more requests per second than Prisma 7 in our benchmark",
    ],
    tour: [
      { ...SCHEMA_STOP, label: "Schema" },
      { ...QUERY_STOP, label: "Client" },
      {
        label: "Migrations",
        caption:
          "Prisma refuses a migration that would destroy data, and tells you what it would have dropped.",
        illustration: "migrationBlocked",
      },
      DEPLOY_STOP,
    ],
  },
  flow: {
    headline: "From schema to production, with nothing to wire up",
    body: "The schema you write for the ORM is the same one Prisma Postgres and Prisma Compute read. Start with the ORM for free, add a hosted database when you need one, and deploy the app next to it when you are ready to ship.",
  },
  benefits: {
    headline: "Why developers pick Prisma ORM 8",
    bridge:
      "The core ORM job, done well: a schema your editor understands, queries that cannot name a column wrong, and migrations you can trust.",
    items: [
      {
        icon: "code",
        name: "A schema your editor understands",
        description:
          "Declare models and relations in one file. The generated client gives you autocomplete over your own data, and a wrong field name fails in the editor, not in production.",
      },
      {
        icon: "shield",
        name: "Migrations without the fear",
        description:
          "Change a model and Prisma plans the migration in TypeScript you can read. Every step is verified before and after it runs, and it refuses to apply when it would destroy data.",
      },
      {
        icon: "bot",
        name: "Built for you and your coding agent",
        description:
          "Errors carry stable codes and remediation hints, and setup installs Prisma skills for Claude Code, Codex and Cursor, so an agent gets the patterns right from the first prompt.",
      },
      {
        icon: "layers",
        name: "Smaller, faster, extensible",
        description:
          "A rewrite with no Rust engine: under 150 KB gzipped, 52% more throughput than Prisma 7 in our benchmark, and every piece, from Postgres support to the query API, is an extension you can swap.",
      },
    ],
  },
  faq: [
    {
      question: "How do I start?",
      answer:
        "Run npm create prisma@latest. It scaffolds an app with a starter schema, a typed client and package scripts, and can run a local Prisma Postgres for you. Sign up for Prisma Console when you want a hosted database or a deploy.",
    },
    {
      question: "Is Prisma ORM 8 ready for production?",
      answer:
        "Prisma ORM 8 is a release candidate and the default in the docs and in npm create prisma@latest. Prisma ORM 7 remains fully supported, and the docs map every Prisma ORM 7 API to its Prisma ORM 8 form for when you want to move.",
    },
    {
      question: "Do I need Prisma Postgres or Prisma Compute?",
      answer:
        "No. The ORM is free, Apache 2.0, and works with any Postgres or MongoDB deployment. Prisma Postgres and Prisma Compute are optional; using them means the database and the deploy read the schema you already wrote, so previews get their own database and migrations run on deploy.",
    },
    {
      question: "Which databases does it support?",
      answer:
        "Postgres and MongoDB are supported today, each as an extension written by Prisma. Prisma ORM 8 knows nothing about any database by default, so community extensions can add more; one already runs it in the browser on IndexedDB.",
    },
  ],
  cta: {
    headline: "Start with the ORM. Ship the whole stack when you're ready.",
    body: "A free Prisma Console account gives the app you build with Prisma ORM 8 a hosted Prisma Postgres database and Prisma Compute deploys, with no credit card.",
    checks: [
      "The ORM is free and open source, always",
      "Free Postgres database, no credit card",
      "Deploy next to your database in one command",
    ],
  },
};

export const freeLanding: LandingContent = {
  slug: "free",
  path: "/lp/free",
  campaign: "free-plan",
  meta: {
    title: "Start building for free | Prisma",
    description:
      "A Prisma Postgres database and Prisma Compute app hosting on a Free plan with no time limit and no credit card. Build and deploy a real TypeScript app before you pay anything.",
    ogKicker: "Free plan",
    ogAccent: "yellow",
  },
  kicker: "Free plan",
  accent: "postgres",
  hero: {
    headline: "Start building for free",
    headlineEmphasis: "for free",
    subheadline:
      "A Prisma Postgres database and Prisma Compute hosting on a Free plan with no time limit. Build and deploy a real TypeScript app before you pay anything.",
    microline: "No credit card. Free forever, not a trial.",
    benefits: [
      "1M Compute requests and 200k database operations a month",
      "Up to 50 databases and 1.01 GB of storage",
      "Upgrade to Starter at $10 a month only when you outgrow it",
    ],
  },
  flow: {
    headline: "Everything you need, on one free plan",
    body: "Prisma ORM 8 is free and open source. The Free plan adds a hosted Prisma Postgres database and Prisma Compute deploys, so the whole path from first query to live URL costs nothing.",
  },
  benefits: {
    headline: "What you can build before you pay",
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
          "One per prototype, per branch or per customer. Each is standard Postgres, provisioned in seconds, with 1.01 GB of storage included on the plan.",
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
        "Nothing is charged. The Free plan has no usage billing, so the next step is yours: upgrade to Starter at $10 a month, which includes 5M Compute requests and 1M database operations, meters usage beyond that, and lets you set a spend limit.",
    },
    {
      question: "What exactly is included?",
      answer:
        "Prisma Postgres: 200k operations a month, 1.01 GB of storage and 50 databases. Prisma Compute: 1M requests, 360 GB-hours of memory, 4 active vCPU-hours and 10 GB of outbound bandwidth a month, with scale to zero. Prisma ORM 8 is free and open source regardless of plan.",
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
  orm: ormLanding,
  free: freeLanding,
};
