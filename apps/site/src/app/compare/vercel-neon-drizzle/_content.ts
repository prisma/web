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
  "You want fewer integrations to manage. Keep the core workflow within one Prisma platform.",
  "You want app and database environments to move together as changes move toward production.",
  "You use coding agents throughout development. Give agents a shared Prisma schema plus a structured CLI and API. Prisma ORM compares to Drizzle [here](/docs/orm/v7/more/comparisons/prisma-and-drizzle).",
  "You want one stack from early development onward. Start with [Prisma ORM](/docs/orm) and add [Prisma Postgres](/docs/postgres) and [Prisma Compute](/docs/compute) as your needs grow.",
];

export const CHOOSE_COMBO = [
  "You want to pick a best-in-class tool for each layer and are happy to connect them.",
  "You are already deployed on Vercel and want Postgres alongside it.",
  "You prefer Drizzle's SQL-first, query-builder style.",
  "You are happy to manage three accounts, three pricing models, and three bills.",
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
    prisma: "Prisma schema, shared across the stack.",
    sources: {
      combo: "https://orm.drizzle.team/docs/sql-schema-declaration",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "Environments",
    combo: "Neon database branches and Vercel previews wired together.",
    prisma:
      "A Prisma [preview branch](/docs/compute/branching) can own both its app services and its database.",
    sources: {
      combo: "https://neon.com/docs/guides/vercel-native-integration",
      prisma: "https://www.prisma.io/docs/compute/branching",
    },
  },
  {
    feature: "Agent workflow",
    combo: "The agent moves across three vendors' tools and docs.",
    prisma: "The agent works through the Prisma schema, CLI, and Management API.",
    sources: {
      combo: "https://orm.drizzle.team/docs/get-started/neon-new",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "Billing",
    combo: "Three providers, three pricing models, three bills.",
    prisma: "Priced through one Prisma platform, with spend limits on paid plans.",
    sources: {
      combo: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const COMBO_FITS = [
  "You want to pick a best-in-class tool for each layer and are happy to connect them.",
  "You are already deployed on Vercel and want Postgres alongside it.",
  "You prefer Drizzle's SQL-first, query-builder style.",
];

export const PRISMA_FITS = [
  "You want fewer integrations to manage. Keep the core workflow within one Prisma platform.",
  "You use coding agents throughout development. Give agents shared schema context plus a structured CLI and API.",
  "You want app and database environments to move together as changes move toward production.",
  "You want one stack from early development onward. Start with Prisma ORM and add Prisma Postgres and Prisma Compute as your needs grow.",
];

export const APART = [
  {
    id: "integration",
    title: "Integration across the stack",
    body: "Prisma ORM, Prisma Postgres, and Prisma Compute are parts of one platform. Vercel, Neon, and Drizzle are three providers you connect and maintain yourself.",
  },
  {
    id: "agent-context",
    title: "Developer and agent context",
    body: "The Prisma schema, CLI, and Management API give context and control across the workflow. On the other side, context is spread across Drizzle, Neon, and Vercel tooling.",
  },
  {
    id: "preview-environments",
    title: "Preview environments",
    body: "A Prisma [preview branch](/docs/compute/branching) can own both its app services and its database. Neon branches and Vercel previews are wired together separately.",
  },
  {
    id: "spend",
    title: "Spend managed in one place",
    body: "Prisma prices the stack through one platform, with spend limits on paid plans. Vercel, Neon, and Drizzle keep three separate bills, pricing models, and spend controls.",
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
      "Neon Free is $0. Paid Launch compute is $0.106 per CU-hour. Scale is $0.222 per CU-hour. Storage on paid plans is $0.35 per GB-month.",
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
      "Vercel Hobby is free. Pro is $20 a month plus usage. Pro includes $20 in monthly credit.",
    prisma:
      "Prisma Compute sits on the same Prisma plans as Prisma Postgres: Free $0, Starter $10, Pro $49, Business $129 a month.",
    sources: {
      combo: "https://vercel.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "How you pay",
    combo:
      "Three separate bills and spend controls: Drizzle has none; Neon and Vercel each bill on their own.",
    prisma: "Priced through one Prisma platform, with spend limits on paid plans.",
    sources: {
      combo: "https://vercel.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const WRONG_CHOICE = [
  "You want to pick a best-in-class tool for each layer and connect Drizzle, Neon, and Vercel yourself. Prisma puts the ORM, database, and hosting on one platform.",
  "You are already deployed on Vercel and want Neon Postgres next to that host. Prisma Compute is the Prisma host; Vercel stays a separate provider.",
  "You prefer Drizzle's SQL-first, query-builder style. Prisma ORM uses a declarative Prisma schema. See [how Prisma ORM compares to Drizzle](/docs/orm/v7/more/comparisons/prisma-and-drizzle).",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "How does Prisma ORM compare to Drizzle?",
    answer:
      "Drizzle is a SQL-first TypeScript query builder. Prisma ORM uses a declarative Prisma schema and a generated client. This page compares the Vercel + Neon + Drizzle combo with the Prisma platform. The ORM-only comparison is [Prisma ORM vs Drizzle](/docs/orm/v7/more/comparisons/prisma-and-drizzle). Source: that docs page, October 2026.",
  },
  {
    question: "How do Vercel, Neon, and Prisma bill this stack?",
    answer:
      "Drizzle is free and open source. Neon Free is $0; Launch compute is $0.106 per CU-hour and Scale is $0.222 per CU-hour. Vercel Hobby is free; Pro is $20 a month plus usage. Prisma ORM is free and open source, and always will be. Prisma Postgres Free is $0 with no credit card, 200,000 operations, 2 GB of storage, and 50 databases. Paid Prisma plans are Starter $10, Pro $49, and Business $129 a month, with spend limits. Source: [Neon pricing](https://neon.com/pricing), [Vercel pricing](https://vercel.com/pricing), and [Prisma pricing](/pricing), October 2026.",
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
      "A Prisma preview branch can own both its Compute services and its Prisma Postgres database. Production data is not copied into that database. Neon branches and Vercel previews are wired together as a Neon–Vercel integration. Source: [Compute branching](/docs/compute/branching) and [Neon + Vercel](https://neon.com/docs/guides/vercel-native-integration), October 2026.",
  },
];

export const TOOLS = {
  combo: {
    name: "Vercel + Neon + Drizzle",
    softwareVersion: "current",
    license: "https://orm.drizzle.team",
    codeRepository: "https://github.com/drizzle-team/drizzle-orm",
    programmingLanguage: "TypeScript",
    url: "https://orm.drizzle.team",
  },
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
    license: "https://vercel.com/legal/terms",
    codeRepository: "https://github.com/vercel",
    programmingLanguage: "TypeScript",
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
