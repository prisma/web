export const NEON_PATH = "/compare/neon";

export const NEON_TITLE =
  "Prisma Postgres vs Neon: TypeScript app hosting or Neon backend primitives?";

export const NEON_DESCRIPTION =
  "Both are managed PostgreSQL. Pick Prisma Postgres for optional Prisma ORM and Prisma Compute in one project. Pick Neon for Functions, Auth, Object Storage, and AI Gateway. Checked October 2026.";

export const CHECKED = "October 2026";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const NEON_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const NEON_PUBLISHED = { iso: "2026-10-19", label: "October 2026" } as const;
export const NEON_UPDATED = { iso: "2026-10-19", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want [Prisma ORM](/docs/orm) available on the same platform as the database. Prisma ORM is optional; any Postgres client works.",
  "You want [Prisma Compute](/docs/compute) to host the TypeScript app as HTTP services next to [Prisma Postgres](/docs/postgres).",
  "You want a [preview branch](/docs/compute/branching) that can own its app services and database.",
  "You prefer operation-based database pricing with spend limits on paid plans.",
];

export const CHOOSE_NEON = [
  "You want Neon Functions, Managed Better Auth, Object Storage, and AI Gateway next to Postgres, declared in one `neon.ts`.",
  "You want the UI on a host such as Vercel or Netlify, with Neon running the backend next to the database.",
  "You want copy-on-write database branches that include parent data, and instant restore within the plan's history window.",
  "You want database compute billed in CU-hours that go to $0 while scale-to-zero has suspended the compute.",
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
      "[Prisma Postgres](/docs/postgres) is managed PostgreSQL. Any Postgres client works with it, so Prisma ORM is optional.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/docs/postgres",
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
      "[Prisma Compute](/docs/compute) hosts the TypeScript app as HTTP services. It is separate from Prisma Postgres. Compute has no built-in cron scheduler. WebSocket servers are not supported.",
    sources: {
      neon: "https://neon.com/docs/get-started/full-backend-quickstart",
      prisma: "https://www.prisma.io/docs/compute/limitations",
    },
  },
  {
    feature: "Branches and previews",
    neon: "A Neon branch is a copy-on-write clone of Postgres. Object Storage, Functions, Auth, and AI Gateway can branch with the data. The Neon-managed Vercel integration can create a database branch per preview deployment.",
    prisma:
      "A Prisma [preview branch](/docs/compute/branching) can own its Compute services and databases. Production data is not copied into that database.",
    sources: {
      neon: "https://neon.com/docs/introduction/branching",
      prisma: "https://www.prisma.io/docs/compute/branching",
    },
  },
  {
    feature: "Database pricing model",
    neon: "Compute in CU-hours plus storage and other usage. Launch is $0.106 per CU-hour. Scale is $0.222 per CU-hour. Storage is $0.35 per GB-month on paid plans. Suspended compute is $0.",
    prisma:
      "Operations plus storage, with spend limits on paid plans. Prisma Postgres Free includes 200,000 operations a month and 2 GB of storage.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    feature: "Auth, object storage, and AI gateway",
    neon: "Managed Better Auth, S3-compatible Object Storage, and an AI Gateway ship as Neon backend primitives, declared in `neon.ts`.",
    prisma: "Not included. Use integrations with other tools.",
    sources: {
      neon: "https://neon.com/docs/get-started/backend-overview",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
  {
    feature: "Point-in-time restore",
    neon: "Instant restore within the project's history window on paid plans: up to 7 days on Launch, up to 30 days on Scale, billed at $0.20 per GB-month. Free lists a 6-hour history window with a 1 GB limit, and does not list instant restore as a plan feature.",
    prisma:
      "No point-in-time recovery yet; it is coming in November 2026. Paid Prisma Postgres plans include daily backups (7 days on Starter and Pro, 30 days on Business). Free has no backups.",
    sources: {
      neon: "https://neon.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const NEON_FITS = [
  "Backend primitives such as Functions, Object Storage, Managed Better Auth, and AI Gateway should sit next to Postgres.",
  "A preview should start from a copy-on-write clone that includes parent data.",
  "Instant restore within a history window should be available today.",
  "The UI should stay on a frontend host such as Vercel, with Neon creating a database branch per preview deployment.",
];

export const PRISMA_FITS = [
  "The database should be PostgreSQL, with SQL and the Postgres ecosystem.",
  "Prisma ORM should be available, and optional, on that database.",
  "The TypeScript app should deploy as HTTP services on Prisma Compute, in the same Prisma project as the database.",
  "Database usage should be billed by operations and storage, with a spend limit on paid plans.",
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
    body: "Prisma Compute hosts the TypeScript app as HTTP services next to Prisma Postgres. The current release focuses on HTTP. WebSocket servers are not supported. Compute has no built-in cron scheduler.",
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
    prisma: "Starter $10, Pro $49, Business $129 a month for Prisma Postgres and Prisma Compute.",
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
    neon: "Spending notifications on Launch and Scale. Invoices under $0.50 are not collected.",
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
  "You need instant restore to a moment inside a history window today. Prisma Postgres has no point-in-time recovery yet (it is coming in November 2026). Paid plans include daily backups. Neon documents instant restore on paid plans at [Neon pricing](https://neon.com/pricing).",
  "You want database compute that bills $0 while the instance is suspended, rather than operation-based pricing. Neon CU-hours stop while scale-to-zero has suspended compute; storage still bills.",
];

export const FAQ: readonly { question: string; answer: string }[] = [
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
      "Not yet: point-in-time recovery is coming to Prisma Postgres in November 2026. Until then, paid plans include daily backups (7 days on Starter and Pro, 30 days on Business). Neon paid plans list instant restore within a history window of up to 7 days on Launch and 30 days on Scale. Source: [Prisma pricing](/pricing) and [Neon pricing](https://neon.com/pricing), October 2026.",
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
