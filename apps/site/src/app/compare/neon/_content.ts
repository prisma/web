export const NEON_PATH = "/compare/neon";

export const NEON_TITLE =
  "Prisma Postgres vs Neon: TypeScript app hosting or Neon backend primitives?";

export const NEON_DESCRIPTION =
  "Both are managed PostgreSQL. Pick Prisma Postgres for optional Prisma ORM and Prisma Compute in one project. Pick Neon for Functions, Auth, Object Storage, and AI Gateway. Checked November 2026.";

export const CHECKED = "November 2026";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const NEON_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const NEON_PUBLISHED = { iso: "2026-10-19", label: "October 2026" } as const;
export const NEON_UPDATED = { iso: "2026-11-24", label: "November 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want [Prisma ORM](/docs/orm) available on the same platform as the database. Prisma ORM is optional; any Postgres client works.",
  "You want [Prisma Compute](/docs/compute) to host the TypeScript app as HTTP services next to [Prisma Postgres](/docs/postgres).",
  "You want a [preview branch](/docs/compute/branching) that can own its app services and database.",
  "You deploy Next.js on Vercel and want the database from the [Vercel Marketplace](/docs/guides/postgres/vercel), connected to production, preview, and development by default, with usage billed through your Vercel account.",
  "You want no cold starts: a query after an idle period does not wait for the database to wake up. Billing is per operation, so idle time costs nothing extra.",
  "You prefer operation-based database pricing, and every paid plan includes a hard spend limit you set in the Console.",
];

export const CHOOSE_NEON = [
  "You want Neon Functions, Managed Better Auth, Object Storage, and AI Gateway next to Postgres, declared in one `neon.ts`.",
  "You want Neon Functions to run backend logic next to the database, with the UI on a separate frontend host.",
  "You want copy-on-write database branches that include parent data, and instant restore within the plan's history window.",
  "You want database compute billed in CU-hours that go to $0 while scale-to-zero has suspended the compute, and users can wait for a wake-up when a query arrives after an idle period.",
];

export type CompareRow = {
  feature: string;
  neon: string;
  prisma: string;
  sources: { neon: string; prisma: string };
};

/** Columns run Feature, Neon, Prisma Postgres: alphabetical by product. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Database",
    neon: "Managed PostgreSQL (Lakebase Postgres) with autoscaling, connection pooling, and scale-to-zero. Works with any language, framework, or ORM that supports Postgres.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is managed PostgreSQL that autoscales, with no instance to size or upgrade. Prisma Postgres has no cold starts. Any Postgres client works with it, so Prisma ORM is optional. For edge runtimes, the [serverless driver](/docs/postgres/database/serverless-driver) queries over HTTP instead of a TCP connection.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/blog/prisma-postgres-the-future-of-serverless-databases",
    },
  },
  {
    feature: "Cold starts",
    neon: "Compute scales to zero after 5 minutes of inactivity by default and reactivates on the next query, generally within a few hundred milliseconds. Paid plans can turn scale to zero off; Free cannot.",
    prisma:
      "Prisma Postgres has no cold starts: a query after an idle period does not wait for the database to wake up. Billing is per operation, so idle time costs nothing extra.",
    sources: {
      neon: "https://neon.com/docs/introduction/scale-to-zero",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
  {
    feature: "Next.js on Vercel",
    neon: "Neon's Vercel integrations can create a database branch for each preview deployment; in the Vercel-Managed integration, once Preview is selected. Preview branches start from the Neon project's default branch.",
    prisma:
      "Prisma Postgres is in the [Vercel Marketplace](/docs/guides/postgres/vercel). The integration sets pooled and direct connection strings on the environments you connect (production, preview, and development by default), and usage bills through your Vercel account. Next.js starters cover Prisma ORM, Drizzle, and Kysely. It does not create a database per preview deployment: connect a separate database to Preview to keep previews away from production data.",
    sources: {
      neon: "https://neon.com/docs/guides/vercel-overview",
      prisma: "https://www.prisma.io/docs/guides/postgres/vercel",
    },
  },
  {
    feature: "ORM on the same platform",
    neon: "No first-party ORM. Teams pick an external ORM or SQL client, such as Drizzle or Prisma ORM pointed at Neon.",
    prisma:
      "[Prisma ORM](/docs/orm) is a first-party type-safe ORM on the same platform. It is optional.",
    sources: {
      neon: "https://neon.com/docs/get-started/backend-overview",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "App hosting",
    neon: "Neon Functions run backend logic next to the database. Neon recommends hosting the UI on a separate platform such as Vercel or Netlify.",
    prisma:
      "[Prisma Compute](/docs/compute) hosts the TypeScript app as HTTP services. It runs next to Prisma Postgres in the same project, on one bill. Compute has no built-in cron scheduler today; native cron is planned for early 2027. WebSocket servers are not supported today; support is planned for early 2027.",
    sources: {
      neon: "https://neon.com/docs/get-started/full-backend-quickstart",
      prisma: "https://www.prisma.io/docs/compute/limitations",
    },
  },
  {
    feature: "Branches and previews",
    neon: "A Neon branch is a copy-on-write clone of Postgres. Object Storage, Functions, Auth, and AI Gateway can branch with the data. The Neon-managed Vercel integration can create a database branch per preview deployment.",
    prisma:
      "A Prisma [preview branch](/docs/compute/branching) can own its Compute services and databases. A `postgres()` database the Composer module declares is created new for the preview, and the deploy applies your committed migrations to it; production data is not copied, so you seed the data you test with. For a throwaway database in CI, `npx create-db` gives you a Prisma Postgres database in seconds with no sign-up; it is deleted after 24 hours unless you claim it, and claiming it (free) needs a Prisma account.",
    sources: {
      neon: "https://neon.com/docs/introduction/branching",
      prisma: "https://www.prisma.io/docs/compute/branching",
    },
  },
  {
    feature: "Database pricing model",
    neon: "Compute in CU-hours plus storage and other usage. Launch is $0.106 per CU-hour. Scale is $0.222 per CU-hour. Storage is $0.35 per GB-month on paid plans. Suspended compute is $0.",
    prisma:
      "Operations plus storage, with spend limits on paid plans. [Prisma Postgres Free](/postgres/free-postgresql-hosting) includes 200,000 operations a month and 2 GB of storage.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    feature: "Auth, object storage, and AI gateway",
    neon: "Managed Better Auth, S3-compatible Object Storage, and an AI Gateway ship as Neon backend primitives, declared in `neon.ts`.",
    prisma:
      "S3-compatible Object Store buckets live in the project, next to its databases and Compute apps; pricing and plan limits are not published yet. Use integrations with other tools for auth and an AI gateway.",
    sources: {
      neon: "https://neon.com/docs/get-started/backend-overview",
      prisma: "https://www.prisma.io/docs/storage",
    },
  },
  {
    feature: "Point-in-time restore",
    neon: "Instant restore within the project's history window on paid plans: up to 7 days on Launch, up to 30 days on Scale, billed at $0.20 per GB-month. Free lists a 6-hour history window with a 1 GB limit, and does not list instant restore as a plan feature.",
    prisma:
      "Paid Prisma Postgres plans include daily backups, taken only on days the database has activity and kept 7 days on Starter and Pro and 30 days on Business, that you restore from the Console in place, keeping the connection strings, or into a new database. Point-in-time recovery is coming in November 2026. Free has no backups.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/docs/postgres/database/backups",
    },
  },
];

export const NEON_FITS = [
  "Backend primitives such as Functions, Object Storage, Managed Better Auth, and AI Gateway should sit next to Postgres.",
  "A preview should start from a copy-on-write clone that includes parent data.",
  "Instant restore within a history window should be available today.",
  "Each Vercel preview deployment should get its own database branch, which Neon's Vercel integration can create from the Neon project's default branch.",
];

export const PRISMA_FITS = [
  "The database should be PostgreSQL, with SQL and the Postgres ecosystem.",
  "Prisma ORM should be available, and optional, on that database.",
  "The TypeScript app should deploy as HTTP services on Prisma Compute, in the same Prisma project as the database.",
  "Database usage should be billed by operations and storage, with a spend limit on paid plans.",
  "The Next.js app should run on Vercel with the database from the Vercel Marketplace, or on Prisma Compute in the same Prisma project.",
  "Users should never wait on a database wake-up: Prisma Postgres has no cold starts.",
];

export const APART = [
  {
    id: "optional-orm",
    title: "A first-party ORM, when you want one",
    body: "Prisma ORM is a type-safe data layer on the same platform as Prisma Postgres. It is optional. You can skip it and use SQL or another Postgres client.",
  },
  {
    id: "http-hosting",
    title: "Full TypeScript app hosting",
    body: "Prisma Compute hosts the TypeScript app as HTTP services next to Prisma Postgres. The current release focuses on HTTP. WebSocket servers are not supported today; support is planned for early 2027. Compute has no built-in cron scheduler today; native cron is planned for early 2027.",
  },
  {
    id: "preview-app-and-db",
    title: "App and database on a preview branch",
    body: "A Prisma preview branch can own its application services, deployments, and Prisma Postgres databases. Production data is not copied into that database. See [Compute branching](/docs/compute/branching).",
  },
  {
    id: "operation-pricing",
    title: "Operation-based database pricing",
    body: "Prisma Postgres bills database usage by operations and storage. Starter, Pro, and Business list spend limits. Neon bills database compute in CU-hours alongside storage and other usage-based meters.",
  },
];

export const PRICING: readonly {
  label: string;
  neon: string;
  prisma: string;
  sources: { neon: string; prisma: string };
}[] = [
  {
    label: "Free plan",
    neon: "$0 a month. No credit card required. 100 CU-hours per project, 1 GB of Postgres storage per project, 20 GB account total.",
    prisma:
      "Prisma Postgres Free is $0. No credit card required. 200,000 operations a month, 2 GB of storage, and 50 databases.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Paid plans",
    neon: "Launch and Scale are pay-as-you-go with no monthly minimum. Launch is $0.106 per CU-hour. Scale is $0.222 per CU-hour.",
    prisma:
      "Starter is a $10 monthly base with Compute usage metered on top; Pro ($49) and Business ($129) work the same way. Database operations and storage past each plan's included amount are billed too.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Database storage on paid plans",
    neon: "$0.35 per GB-month. Unlimited storage that grows with usage. Extra branches above the plan allowance are $1.50 per branch-month.",
    prisma:
      "Starter includes 10 GB, then $2.00 per GB. Pro includes 50 GB, then $1.50 per GB. Business includes 100 GB, then $1.00 per GB.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Spend controls",
    neon: "Spending notifications on Launch and Scale, which only alert; a compute size limit caps compute spend; per-project quotas set through the Neon API suspend compute. Invoices under $0.50 are not collected.",
    prisma: "Spend limits on Starter, Pro, and Business.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const WRONG_CHOICE = [
  "You want Neon Functions, Managed Better Auth, Object Storage, or AI Gateway as first-party primitives next to Postgres. Prisma Postgres does not include those. See [How a Neon backend fits together](https://neon.com/docs/get-started/backend-overview).",
  "You want a preview that starts from a copy-on-write clone of production data. A Prisma preview branch gets its own database; production data is not copied. See [Compute branching](/docs/compute/branching).",
  "You need instant restore to a moment inside a history window today. On paid plans, Prisma Postgres restores daily backups, taken only on days the database has activity, in place or into a new database, and point-in-time recovery is coming in November 2026. Neon documents instant restore on paid plans at [Neon pricing](https://neon.com/pricing).",
  "You want compute-time billing (CU-hours) rather than operation-based billing, for example an always-on API that runs many queries per request. Prisma Postgres bills per operation, so idle time costs nothing extra but every query counts.",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Prisma Postgres or Neon: which should I use for a Next.js app?",
    answer:
      "Both are managed PostgreSQL that work with Next.js on Vercel or elsewhere, and with Prisma ORM, Drizzle, or Kysely. Pick Prisma Postgres when users should not wait on a database wake-up (no cold starts), when you want the database from the [Vercel Marketplace](/docs/guides/postgres/vercel) or the whole app on Prisma Compute in one project, and when you want a hard spend limit you set in the Console. Pick Neon when each preview deployment needs a database branch that starts with the data of the Neon project's default branch, when you need instant restore within a history window today, or when you want Neon's Auth, Object Storage, and AI Gateway next to the database. Source: [Prisma Postgres](/docs/postgres), [Prisma Postgres on Vercel](/docs/guides/postgres/vercel) and [Neon and Vercel](https://neon.com/docs/guides/vercel-overview), November 2026.",
  },
  {
    question: "Do I need Neon's managed auth for a Next.js app?",
    answer:
      "No. Better Auth runs inside the Next.js app and stores users in Postgres. Prisma's [Better Auth with Next.js guide](/docs/guides/authentication/better-auth/nextjs) uses Prisma Postgres. Source: [Better Auth with Next.js](/docs/guides/authentication/better-auth/nextjs), November 2026.",
  },
  {
    question: "Does Prisma Postgres copy production data onto preview branches?",
    answer:
      "No. A Prisma preview branch can own its Compute services and databases, but production data is not copied into that database. A Neon branch is a copy-on-write clone that includes parent data. Source: [Compute branching](/docs/compute/branching) and [Neon branching](https://neon.com/docs/introduction/branching), October 2026.",
  },
  {
    question: "Does Neon host the frontend?",
    answer:
      "Neon Functions run backend logic next to the database. Neon's full-stack guide keeps the UI on a host such as Vercel, Netlify, or self-hosted Node. Source: [Build a full backend with Next.js and Neon](https://neon.com/docs/get-started/full-backend-quickstart), October 2026.",
  },
  {
    question: "Do I need Prisma ORM to use Prisma Postgres?",
    answer:
      "No. Prisma Postgres is PostgreSQL. Any Postgres client works with it, so Prisma ORM is optional. Source: [Prisma Postgres](/docs/postgres), October 2026.",
  },
  {
    question: "How do Neon and Prisma Postgres bill for the database?",
    answer:
      "Neon bills database compute in CU-hours ($0.106 on Launch, $0.222 on Scale) plus $0.35 per GB-month of storage on paid plans. Prisma Postgres bills operations and storage, with spend limits on paid plans. Prisma Postgres Free includes 200,000 operations and 2 GB of storage, with no credit card. Source: [Neon pricing](https://neon.com/pricing) and [Prisma pricing](/pricing), October 2026.",
  },
  {
    question: "Does Prisma Postgres have point-in-time recovery?",
    answer:
      "On paid plans, Prisma Postgres restores from daily backups today, and point-in-time recovery is coming in November 2026. Backups are taken only on days the database has activity and kept 7 days on Starter and Pro and 30 days on Business, and you restore one from the database's Backups tab in the Console, in place, keeping the connection strings, or into a new database. Neon paid plans list instant restore within a history window of up to 7 days on Launch and 30 days on Scale. Source: [Prisma Postgres backups](/docs/postgres/database/backups), [Prisma pricing](/pricing) and [Neon pricing](https://neon.com/pricing), October 2026.",
  },
];

export const TOOLS = {
  neon: {
    name: "Neon",
    softwareVersion: "current",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    codeRepository: "https://github.com/neondatabase/neon",
    programmingLanguage: "Rust",
    url: "https://neon.com",
  },
  prisma: {
    name: "Prisma Postgres",
    softwareVersion: "current",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    codeRepository: "https://github.com/prisma/prisma",
    programmingLanguage: "TypeScript",
    url: "https://www.prisma.io/docs/postgres",
  },
} as const;
