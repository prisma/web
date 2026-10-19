export const VERCEL_NEON_DRIZZLE_PATH = "/compare/vercel-neon-drizzle";

export const VERCEL_NEON_DRIZZLE_TITLE =
  "Prisma vs Vercel + Neon + Drizzle: two ways to build a TypeScript backend";

export const VERCEL_NEON_DRIZZLE_DESCRIPTION =
  "Compare Prisma ORM, Prisma Postgres, and Prisma Compute with the Vercel, Neon, and Drizzle setup: one TypeScript platform, or a host, a database, and an ORM from three providers. Checked October 2026.";

export const CHECKED = "October 2026";

/** The existing Prisma ORM vs Drizzle page. Do not invent /compare/drizzle. */
export const DRIZZLE_ORM_COMPARE_PATH = "/docs/orm/v7/more/comparisons/prisma-and-drizzle";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const VERCEL_NEON_DRIZZLE_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const VERCEL_NEON_DRIZZLE_PUBLISHED = { iso: "2026-10-19", label: "October 2026" } as const;
export const VERCEL_NEON_DRIZZLE_UPDATED = { iso: "2026-10-19", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want fewer integrations to manage. The ORM, the database, and the hosting come from one platform.",
  "You want each preview and staging environment to own its app services and its database.",
  "You use coding agents throughout development. They work from one Prisma schema, one CLI, and one API.",
  "You want one stack from early development onward. Start with [Prisma ORM](/docs/orm) and add [Prisma Postgres](/docs/postgres) and [Prisma Compute](/docs/compute) as your needs grow.",
];

export const CHOOSE_COMBO = [
  "You want to pick the tool you prefer for each layer and connect them yourself.",
  "You already deploy on Vercel and want Neon Postgres installed from the Vercel Marketplace.",
  "You prefer Drizzle's SQL-first, query-builder style.",
  "You want preview databases that start as copy-on-write clones of production data.",
];

export type CompareRow = {
  feature: string;
  combo: string;
  prisma: string;
  sources: { combo: string; prisma: string };
};

/** Columns run Feature, Vercel + Neon + Drizzle, Prisma. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Core setup",
    combo: "Choose and wire Drizzle, Neon, and Vercel across three providers.",
    prisma:
      "[Prisma ORM](/docs/orm), [Prisma Postgres](/docs/postgres), and [Prisma Compute](/docs/compute) in one platform.",
    sources: {
      combo: "https://orm.drizzle.team/docs/get-started/neon-new",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
  {
    feature: "Data model",
    combo: "Drizzle schema in your app code, connected to a Neon database.",
    prisma: "One Prisma schema that the ORM, migrations, and the CLI all read.",
    sources: {
      combo: "https://orm.drizzle.team/docs/sql-schema-declaration",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "Environments",
    combo:
      "A Neon branch per Vercel preview deployment through the Neon integration for Vercel, cloned from production data.",
    prisma:
      "A Prisma [preview branch](/docs/compute/branching) owns its app services and its own database, which starts empty.",
    sources: {
      combo: "https://neon.com/docs/guides/vercel-native-integration",
      prisma: "https://www.prisma.io/docs/compute/branching",
    },
  },
  {
    feature: "Agent workflow",
    combo: "The agent moves across three vendors' tools and docs.",
    prisma: "The agent works through the Prisma schema, CLI, and [REST API](/docs/rest-api).",
    sources: {
      combo: "https://orm.drizzle.team/docs/get-started/neon-new",
      prisma: "https://www.prisma.io/docs/rest-api",
    },
  },
  {
    feature: "Billing",
    combo:
      "Neon bills compute in CU-hours plus storage. Vercel bills a Pro seat plus usage. Drizzle is free. Neon installed from the Vercel Marketplace is billed through Vercel.",
    prisma:
      "Prisma Postgres and Prisma Compute share one set of plans, billed by operations and storage, with spend limits on paid plans.",
    sources: {
      combo: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const COMBO_FITS = [
  "You want to pick the tool you prefer for each layer and connect them yourself.",
  "You already deploy on Vercel and want Neon Postgres installed from the Vercel Marketplace.",
  "You prefer Drizzle's SQL-first, query-builder style.",
  "You want preview databases that start as copy-on-write clones of production data.",
];

export const PRISMA_FITS = [
  "You want fewer integrations to manage. The ORM, the database, and the hosting come from one platform.",
  "You use coding agents throughout development. They work from one Prisma schema, one CLI, and one API.",
  "You want each preview and staging environment to own its app services and its database.",
  "You want one stack from early development onward. Start with Prisma ORM and add Prisma Postgres and Prisma Compute as your needs grow.",
];

export const APART = [
  {
    id: "integration",
    title: "Integration across the stack",
    body: "Prisma ORM, Prisma Postgres, and Prisma Compute are parts of one platform. Vercel, Neon, and Drizzle are three products from three vendors that you connect and keep in step yourself.",
  },
  {
    id: "agent-context",
    title: "Developer and agent context",
    body: "One Prisma schema, one CLI, and one [REST API](/docs/rest-api) cover the data model, the database, and deploys. With Vercel + Neon + Drizzle, that context is spread across three tools and three sets of docs.",
  },
  {
    id: "preview-environments",
    title: "Preview environments",
    body: "A Prisma [preview branch](/docs/compute/branching) owns both its app services and its database. With Vercel and Neon, a preview deployment and its database branch are linked through the Neon integration for Vercel, which you install and configure separately.",
  },
  {
    id: "spend",
    title: "Spend managed in one place",
    body: "Prisma Postgres and Prisma Compute share one set of plans, with spend limits on paid plans. Neon and Vercel each have their own pricing model and their own spend controls.",
  },
];

export const PRICING: readonly {
  label: string;
  combo: string;
  prisma: string;
  sources: { combo: string; prisma: string };
}[] = [
  {
    label: "ORM",
    combo: "Drizzle is free and open source.",
    prisma: "Prisma ORM is free and open source, and always will be.",
    sources: {
      combo: "https://orm.drizzle.team",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    label: "Database",
    combo:
      "Neon Free is $0, with 100 CU-hours and 1 GB of storage per project. Launch compute is $0.106 per CU-hour. Scale is $0.222 per CU-hour. Storage on paid plans is $0.35 per GB-month.",
    prisma:
      "Prisma Postgres Free is $0. No credit card required. 200,000 operations a month, 2 GB of storage, and 50 databases. Paid plans bill operations and storage, with spend limits.",
    sources: {
      combo: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Hosting",
    combo:
      "Vercel Hobby is free for personal, non-commercial use. Pro is $20 a month for one deploying seat plus usage, and includes $20 in monthly credit. Extra deploying seats are $20 a month each.",
    prisma:
      "Prisma Compute sits on the same Prisma plans as Prisma Postgres: Free $0, Starter $10, Pro $49, Business $129 a month.",
    sources: {
      combo: "https://vercel.com/docs/plans/pro-plan",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "How you pay",
    combo:
      "Neon and Vercel each bill on their own pricing model, or Neon bills through Vercel when installed from the Vercel Marketplace. Drizzle adds no bill.",
    prisma:
      "One set of plans for Prisma Postgres and Prisma Compute, with spend limits on paid plans.",
    sources: {
      combo: "https://neon.com/docs/guides/vercel-native-integration",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const WRONG_CHOICE = [
  "You want to pick the tool you prefer for each layer and connect Drizzle, Neon, and Vercel yourself. Prisma puts the ORM, database, and hosting on one platform.",
  "You want hosting and the database managed from the Vercel dashboard. Prisma Postgres works with an app on Vercel, but it is managed from the Prisma Console.",
  "You want preview databases seeded with production data. A Neon branch is a copy-on-write clone of production; a Prisma preview database starts empty.",
  "You prefer Drizzle's SQL-first, query-builder style. Prisma ORM uses a declarative Prisma schema. See [how Prisma ORM compares to Drizzle](/docs/orm/v7/more/comparisons/prisma-and-drizzle).",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "How does Prisma ORM compare to Drizzle?",
    answer:
      "Drizzle is a SQL-first TypeScript query builder. Prisma ORM uses a declarative Prisma schema and a generated client. This page compares the whole Vercel + Neon + Drizzle setup with the Prisma platform. The ORM-only comparison is [Prisma ORM vs Drizzle](/docs/orm/v7/more/comparisons/prisma-and-drizzle). Source: Prisma docs, October 2026.",
  },
  {
    question: "How do Vercel, Neon, and Prisma bill this stack?",
    answer:
      "Drizzle is free and open source. Neon Free is $0; Launch compute is $0.106 per CU-hour and Scale is $0.222 per CU-hour. Vercel Hobby is free for personal use; Pro is $20 a month for one deploying seat plus usage. Neon installed from the Vercel Marketplace is billed through Vercel. Prisma ORM is free and open source, and always will be. Prisma Postgres Free is $0 with no credit card, 200,000 operations, 2 GB of storage, and 50 databases. Paid Prisma plans are Starter $10, Pro $49, and Business $129 a month, with spend limits. Source: [Neon pricing](https://neon.com/pricing), [Vercel pricing](https://vercel.com/pricing), and [Prisma pricing](/pricing), October 2026.",
  },
  {
    question: "Do I need Prisma ORM to use Prisma Postgres?",
    answer:
      "No. Prisma Postgres is PostgreSQL. Any Postgres client works with it, so Prisma ORM is optional. This page is about using Prisma ORM, Prisma Postgres, and Prisma Compute together. Source: [Prisma Postgres](/docs/postgres), October 2026.",
  },
  {
    question: "Can I keep Vercel and use Prisma Postgres?",
    answer:
      "Yes. Prisma Postgres works with any Postgres client, including an app you host on Vercel. Prisma Compute is optional app hosting in the same Prisma project. Source: [Prisma Postgres](/docs/postgres) and [Prisma Compute](/docs/compute), October 2026.",
  },
  {
    question: "Do Prisma preview environments include the app and the database?",
    answer:
      "A Prisma preview branch can own both its Compute services and its Prisma Postgres database. Production data is not copied into that database. With Vercel and Neon, the Neon integration for Vercel can create a copy-on-write Neon branch for each preview deployment. Source: [Compute branching](/docs/compute/branching) and [Neon + Vercel](https://neon.com/docs/guides/vercel-native-integration), October 2026.",
  },
];

/** Vercel is a hosted service, so it carries no license or code repository. */
export const TOOLS = {
  drizzle: {
    name: "Drizzle",
    softwareVersion: "current",
    license: "https://github.com/drizzle-team/drizzle-orm/blob/main/LICENSE",
    codeRepository: "https://github.com/drizzle-team/drizzle-orm",
    programmingLanguage: "TypeScript",
    url: "https://orm.drizzle.team",
  },
  neon: {
    name: "Neon",
    softwareVersion: "current",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    codeRepository: "https://github.com/neondatabase/neon",
    programmingLanguage: "Rust",
    url: "https://neon.com",
  },
  vercel: {
    name: "Vercel",
    softwareVersion: "current",
    url: "https://vercel.com",
  },
  prisma: {
    name: "Prisma",
    softwareVersion: "current",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    codeRepository: "https://github.com/prisma/prisma",
    programmingLanguage: "TypeScript",
    url: "https://www.prisma.io",
  },
} as const;
