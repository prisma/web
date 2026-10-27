import type { OgAccent } from "@prisma-docs/ui/components/og-image";
import type { ProductAccentName, ProductIconName } from "@/components/product/icons";
import type { ProductTourStop } from "@/components/product/types";
import type { PlanName } from "./landing-plans";

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

export type LandingSlug = "compute" | "postgres" | "free" | "1000-databases" | "providers";

export type LandingContent = {
  slug: LandingSlug;
  /** The page's path, also its canonical URL. */
  path: string;
  /** The `utm_campaign` value the matching ad campaign should send. */
  campaign: string;
  /**
   * The `utm_term` value that names this page as the landing variant on the
   * Console link, so PostHog and the warehouse can split signups by page
   * even when two variants share an ad campaign. Stamped by the redirect in
   * next.config.mjs when the ad URL does not carry it.
   */
  variant: `lp-${LandingSlug}`;
  /** The marketing hypothesis this variant tests against the other two. */
  hypothesis: string;
  meta: {
    title: string;
    description: string;
    ogKicker: string;
    ogAccent: OgAccent;
  };
  /** Product role kicker above the headline and its dot colour. */
  kicker: string;
  accent: ProductAccentName;
  /**
   * The CTA wording for this page. The default, "Get started for free", is
   * the free-plan pages' promise; the paid-plan pages name the plan instead.
   * Every CTA on a page uses the same label and the same Console URL.
   */
  ctaLabel?: string;
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
  /** The three-product flow panel. Omitted on pages that sell one plan. */
  flow?: {
    headline: string;
    body: string;
  };
  benefits?: {
    headline: string;
    bridge: string;
    items: { icon: ProductIconName; name: string; description: string }[];
  };
  /**
   * The plan ladder. The default lights the Free plan and shows all four;
   * a paid-plan page lights the plan the ad sells and can drop the rest.
   */
  plans?: {
    headline: string;
    body: string;
    highlight: PlanName;
    include?: PlanName[];
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
  variant: "lp-compute",
  hypothesis:
    "Simplicity converts: one command deploys the app and its database together, so the page leads with the deploy and shows the live URL before it mentions price.",
  meta: {
    title: "Deploy your TypeScript app with 1M free requests every month | Prisma Compute",
    description:
      "One command deploys your Next.js, Hono or Bun app next to a Prisma Postgres database. 1M requests free every month, no credit card, pay as you grow.",
    ogKicker: "Prisma Compute",
    ogAccent: "red",
  },
  kicker: "Prisma Compute",
  accent: "compute",
  hero: {
    headline: "Deploy your TypeScript app with 1M free requests every month",
    headlineEmphasis: "1M free requests",
    subheadline:
      "One command puts your Next.js, Hono or Bun app live next to a Prisma Postgres database. No connection strings to wire, no second vendor, and nothing to pay until the app outgrows the free allowance.",
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
          "Bring a Next.js, Hono or Bun app, or an agent: wrap the server code you already have in a short declaration, then deploy.",
        illustration: "runApps",
      },
    ],
  },
  flow: {
    headline: "Two vendors means glue code. One platform means one deploy.",
    body: "Prisma ORM 8 types your queries, Prisma Postgres stores the data, Prisma Compute runs the app next to it. Use all three or just one: any Postgres client connects, and the ORM is optional.",
  },
  benefits: {
    headline: "What you stop doing",
    bridge: "Each of these is work that two vendors leave to you.",
    items: [
      {
        icon: "server",
        name: "No connection strings to copy between dashboards",
        description:
          "Declare the app and its database in one TypeScript module; deploy creates both, connects them and prints the live URL.",
      },
      {
        icon: "gitBranch",
        name: "No shared test database",
        description:
          "Deploy on push and every feature branch gets its own app and its own new database, deleted with the branch.",
      },
      {
        icon: "database",
        name: "No query crossing a vendor boundary",
        description:
          "The app runs in the same project and region as its database, with pooling included. Standard Postgres, so any client works.",
      },
      {
        icon: "shield",
        name: "No bill that grows with headcount",
        description:
          "Pay for requests, memory and active CPU, with a spend limit you set. No seat fees, nothing for previews, and an idle app scales to zero.",
      },
    ],
  },
  faq: [
    {
      question: "Can I deploy an app I already have?",
      answer:
        "Yes, if it is a TypeScript service for Node.js, Bun or Next.js. Add a short declaration (a service.ts and a module.ts) around the server code you already have, then run npx prisma deploy module.ts. The docs include a prompt your coding agent can write the declaration from.",
    },
    {
      question: "What does it cost?",
      answer:
        "Nothing until you outgrow the Free plan: 1M requests, 360 GB-hours of memory, 4 active vCPU-hours and 10 GB of bandwidth a month for Compute, plus 200k operations, 2 GB and 50 databases for Prisma Postgres, with no credit card and no usage billing. Starter is $10 a month with 5M requests included, then $0.006 per GB-hour of memory and $0.064 per active vCPU-hour, under a spend limit you set.",
    },
    {
      question: "Do I have to use Prisma ORM?",
      answer:
        "No. Your app reaches Prisma Postgres through a standard connection string, so any Postgres client works. Prisma ORM 8 is optional; it adds a typed client, safe migrations and migrations applied for you on deploy.",
    },
  ],
  cta: {
    headline: "Deploy your first app in the next ten minutes",
    body: "Sign up, run one deploy, and get a live URL with a Prisma Postgres database behind it. No credit card, no time limit, and paid plans from $10 a month with a spend limit you set.",
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
  variant: "lp-postgres",
  hypothesis:
    "The database is the entry point: a developer who only needs Postgres today signs up for a free one in seconds and adds hosting later, so the page leads with the database and keeps Compute as the next step.",
  meta: {
    title: "A production Postgres database, free every month | Prisma Postgres",
    description:
      "Managed Postgres in seconds: 200k operations, 2 GB of storage and 50 databases free every month. Any Postgres client connects, and your app can run next to it on Prisma Compute. No credit card.",
    ogKicker: "Prisma Postgres",
    ogAccent: "yellow",
  },
  kicker: "Prisma Postgres",
  accent: "postgres",
  hero: {
    headline: "A production Postgres database, free every month",
    headlineEmphasis: "free every month",
    subheadline:
      "Create it in seconds from the Console, your terminal or your coding agent, with pooling and backups built in. Connect any Postgres client, and when you want, run the app next to it on Prisma Compute.",
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
    body: "Prisma Postgres works on its own with any ORM and any host. Add Prisma ORM 8 for typed queries and Prisma Compute to run the app next to the database, and the wiring between them disappears.",
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
          "From the Console, with npx create-db in a terminal, or through the MCP server from Claude Code, Cursor or Codex.",
      },
      {
        icon: "gitBranch",
        name: "A database per preview",
        description:
          "With Prisma Compute, every feature branch gets a preview with its own new database, torn down with the branch.",
      },
      {
        icon: "shield",
        name: "A bill you can cap",
        description:
          "Billed per operation, with a spend limit you set on paid plans. A quiet month costs almost nothing and a busy one never surprises you.",
      },
      {
        icon: "swap",
        name: "Standard Postgres, no lock-in",
        description:
          "Standard SQL and wire protocol, pgvector on every plan, Studio to browse rows, Query Insights to find slow queries. Leave any time with pg_dump.",
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
  ],
  cta: {
    headline: "Your Postgres database is a minute away",
    body: "Create it now and host the app next to it when you are ready. No credit card, no time limit, and standard Postgres underneath, so you can leave at any time.",
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
  variant: "lp-free",
  hypothesis:
    "Price converts: a free plan with no card and no expiry removes the reason to put it off, so the page leads with the allowances, shows them on the plan card, and proves it stays cheap after the free plan.",
  meta: {
    title: "Deploy your app and its Postgres database for free | Prisma",
    description:
      "Prisma's Free plan: 1M requests, 200k database operations, 2 GB of storage and 50 databases every month, with no credit card and no time limit. Deploy a real TypeScript app and its Postgres database in one place.",
    ogKicker: "Free plan",
    ogAccent: "yellow",
  },
  kicker: "Free plan",
  accent: "postgres",
  hero: {
    headline: "Deploy your app and its Postgres database for free",
    headlineEmphasis: "for free",
    subheadline:
      "Sign up, run one deploy, and your TypeScript app is live on Prisma Compute with a Prisma Postgres database next to it. 1M requests and 200k database operations every month, and nothing is billed until you choose a paid plan.",
    microline: "$0 a month. No credit card, no expiry, no usage billing.",
  },
  flow: {
    headline: "Everything the app needs, on the Free plan",
    body: "Prisma ORM 8 is free and open source. The Free plan adds a hosted Prisma Postgres database and Prisma Compute deploys, so the path from first query to live URL costs nothing.",
  },
  benefits: {
    headline: "What the Free plan is enough for",
    bridge: "The allowances are sized for real apps with real users, not for a demo that expires.",
    items: [
      {
        icon: "rocket",
        name: "A side project with real users",
        description:
          "1M requests a month is about 23 a minute, all month: a launch, a waitlist or a small SaaS beta.",
      },
      {
        icon: "bot",
        name: "An AI agent or bot",
        description:
          "Compute streams responses and scales to zero between tasks, so an agent that mostly waits on a model API uses little of the allowance.",
      },
      {
        icon: "database",
        name: "Up to 50 databases",
        description:
          "One per prototype, branch or customer, each standard Postgres and ready in seconds, with 2 GB of storage on the plan.",
      },
      {
        icon: "shield",
        name: "No surprise bill",
        description:
          "No usage billing at all. When the app needs more than the allowance you choose to upgrade; you are never charged for going over.",
      },
    ],
  },
  faq: [
    {
      question: "Is there a time limit on the Free plan?",
      answer:
        "No. The Free plan is free forever, not a trial. The request and operation allowances reset every month; storage and the database count are fixed limits of the plan.",
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
  ],
  cta: {
    headline: "Start building for free today",
    body: "Sign up, create a database, deploy an app. No time limit, no credit card, and the ORM is free whatever plan you are on.",
    checks: [
      "No credit card required",
      "Free forever, not a trial",
      "Standard Postgres, leave any time",
    ],
  },
};

// The two paid-plan pages for the October 2026 "Starter and Pro" campaign.
// Both campaigns (landing pages and direct to Console) share the creatives
// and the targeting; the pages exist to test whether a page between the ad
// and the Console brings users who activate and pay. Figures were read from
// the live prisma.io/pricing on 2026-10-21; the provider figures on the
// comparison page carry their own check date in provider-compare.tsx.
//
// The CTA on these pages leads to the Console sign-up, which is free; the
// plan is chosen in the Console afterwards. The Console has no public
// plan-selection entry point for a visitor without a workspace, so the label
// and the offer line say exactly that rather than promising a one-click
// subscription.

const STARTER_PRO_CAMPAIGN = "us_desktop_starter_pro_oct2026_lp";

export const starterDatabasesLanding: LandingContent = {
  slug: "1000-databases",
  path: "/lp/1000-databases",
  campaign: STARTER_PRO_CAMPAIGN,
  variant: "lp-1000-databases",
  hypothesis:
    "A paid-plan promise brings builders, not browsers: a developer whose agents and previews are starved for databases recognises the problem in the headline, and is more likely to activate and pay than a visitor sent by a free-tier promise.",
  meta: {
    title: "1,000 databases for your agents | Prisma Starter",
    description:
      "The Prisma Starter plan includes 1,000 Prisma Postgres databases, 10 GB of storage and 5M app requests a month for $10. One database per agent task, preview and experiment.",
    ogKicker: "Prisma Starter",
    ogAccent: "yellow",
  },
  kicker: "Prisma Starter",
  accent: "postgres",
  ctaLabel: "Start on Starter",
  hero: {
    headline: "1,000 databases for your agents",
    headlineEmphasis: "1,000 databases",
    subheadline:
      "Coding agents, preview branches and experiments each want a database of their own. The Starter plan includes 1,000 Prisma Postgres databases for $10 a month, so you build, test and ship without rationing them.",
    microline: "$10 a month. Sign up free, choose Starter in the Console, cancel any time.",
  },
  plans: {
    headline: "What Starter includes",
    body: "Starter is the first paid plan: $10 a month for the app and the database together, usage beyond the allowances metered at the plan's rates, and a spend limit you set. Free covers 50 databases; Pro lifts every allowance and lowers the overage rates.",
    highlight: "Starter",
    include: ["Free", "Starter", "Pro"],
  },
  benefits: {
    headline: "Why one database is never enough",
    bridge:
      "Every workflow below wants a database of its own. Share one and tests collide, data leaks between tasks, and someone eventually migrates production by mistake.",
    items: [
      {
        icon: "bot",
        name: "One database per agent task",
        description:
          "Give each agent run a fresh Postgres database, let it migrate and seed freely, and delete it when the task is done.",
      },
      {
        icon: "gitBranch",
        name: "A database for every preview",
        description:
          "Each pull request can get its own database next to its preview deployment, so reviewers test real behaviour without touching production data.",
      },
      {
        icon: "repeat",
        name: "Experiments that start in seconds",
        description:
          "Try a schema change or a new migration path on a database of its own. A database you are not querying uses no operations.",
      },
      {
        icon: "layoutGrid",
        name: "Room for every app you run",
        description:
          "Side projects, customer sandboxes, staging and production can each have their own database on one plan and one bill.",
      },
    ],
  },
  faq: [
    {
      question: "Does $10 cover all 1,000 databases?",
      answer:
        "Yes. The plan includes up to 1,000 databases. What you pay for is usage across them: 1M operations a month are included, then $8 per million, and 10 GB of storage is included, then $2 per GB. A spend limit, on by default, caps the bill.",
    },
    {
      question: "How do my agents create databases?",
      answer:
        "From the Console, with npx create-db in a terminal, through the Management API, or through the Prisma MCP server from Claude Code, Cursor or Codex. Every database is standard Postgres with a pooled connection string, ready in seconds.",
    },
    {
      question: "What happens when I reach an allowance?",
      answer:
        "Usage beyond the included operations or storage is billed at the plan's rates until your spend limit, which is on by default on every paid plan. Nothing is deleted. You can raise the limit, move to Pro for larger allowances and lower overage rates, or stay where you are.",
    },
  ],
  cta: {
    headline: "Stop rationing databases",
    body: "Sign up, choose Starter in the Console, and give every agent, preview and experiment a database of its own. $10 a month, cancel any time, with a spend limit you set.",
    checks: [
      "1,000 databases included",
      "10 GB storage and 5M app requests a month",
      "Spend limit on by default",
    ],
  },
};

export const providersLanding: LandingContent = {
  slug: "providers",
  path: "/lp/providers",
  campaign: STARTER_PRO_CAMPAIGN,
  variant: "lp-providers",
  hypothesis:
    "Price at scale converts the developer who already pays for a stack: showing what the same app costs on Prisma next to Neon + Vercel and Supabase, on list prices, brings visitors who are ready to pay rather than to try.",
  meta: {
    title: "See how Prisma compares at scale | Prisma Starter and Pro",
    description:
      "Prisma Starter ($10 a month) and Pro ($49 a month) put your app and its Postgres database on one bill, with database data transfer included and spend limits on by default. Compared with Neon + Vercel and Supabase on list prices, October 2026.",
    ogKicker: "Prisma Starter and Pro",
    ogAccent: "red",
  },
  kicker: "Prisma Starter and Pro",
  accent: "compute",
  ctaLabel: "Choose your plan",
  hero: {
    headline: "See how Prisma compares at scale",
    headlineEmphasis: "compares at scale",
    subheadline:
      "At around 50K monthly active users, Prisma Pro can cost less than half as much as a typical Neon + Vercel setup, while keeping your app and your Postgres database on one platform with one bill.",
    microline:
      "Starter is $10 a month, Pro is $49. Sign up free, pick a plan in the Console, cancel any time.",
  },
  plans: {
    headline: "Starter or Pro?",
    body: "Starter fits a first production app: 1M database operations, 10 GB of storage and 5M app requests a month. Pro fits real traffic: ten times the operations, 50 GB of storage, 20M requests and lower overage rates. Both include 1,000 databases, daily backups and a spend limit.",
    highlight: "Starter",
    include: ["Starter", "Pro"],
  },
  faq: [
    {
      question: "Where do the 50K MAU figures come from?",
      answer:
        "They are Prisma's published scenario on prisma.io/pricing: an app of about 50K monthly active users, priced on each provider's list prices. It is an estimate for one shape of app. Your usage will differ, so the table of list prices above is what to check your own numbers against.",
    },
    {
      question: "Can I keep Vercel or Neon and still use Prisma?",
      answer:
        "Yes. Prisma Postgres is standard Postgres, so an app hosted anywhere connects with the connection string, and Prisma ORM works with any Postgres. Prisma Compute is optional hosting next to the database. Moving in or out is pg_dump and pg_restore.",
    },
    {
      question: "What do spend limits cover?",
      answer:
        "On Prisma, the spend limit is a hard cap on usage across the app and the database, on by default on every paid plan. Neon sends spending notifications at 80% and 100% of a threshold. Vercel has a spend budget with an optional pause. Supabase's Spend Cap is on by default on Pro and excludes database compute.",
    },
  ],
  cta: {
    headline: "One platform, one bill, a limit you set",
    body: "Sign up, pick Starter or Pro in the Console, and run the app next to its database. No seats, no database egress bill, and a spend limit on by default.",
    checks: [
      "Database data transfer included",
      "Spend limits on by default",
      "Standard Postgres, leave any time",
    ],
  },
};

export const landingPages: Record<LandingSlug, LandingContent> = {
  compute: computeLanding,
  postgres: postgresLanding,
  free: freeLanding,
  "1000-databases": starterDatabasesLanding,
  providers: providersLanding,
};

/**
 * The CTA label for the landing page at `pathname`, for the chrome shared by
 * every page (header, sticky bar) that cannot take it from the page's content.
 */
export function landingCtaLabel(pathname: string): string {
  const page = Object.values(landingPages).find((content) => content.path === pathname);
  return page?.ctaLabel ?? CTA_LABEL;
}
