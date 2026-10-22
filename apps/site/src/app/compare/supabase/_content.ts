export const SUPABASE_PATH = "/compare/supabase";

export const SUPABASE_TITLE =
  "Prisma Postgres vs Supabase: what's the difference and which should I pick?";

export const SUPABASE_DESCRIPTION =
  "Both are managed PostgreSQL. Pick Prisma Postgres for optional Prisma ORM and Prisma Compute in one project. Pick Supabase for Auth, Storage, Realtime, and Edge Functions. Checked October 2026.";

export const CHECKED = "October 2026";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const SUPABASE_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const SUPABASE_PUBLISHED = { iso: "2026-10-19", label: "October 2026" } as const;
export const SUPABASE_UPDATED = { iso: "2026-10-19", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want [Prisma ORM](/docs/orm) available on the same platform as the database. Prisma ORM is optional; any Postgres client works.",
  "You want [Prisma Compute](/docs/compute) to host the TypeScript app as HTTP services next to [Prisma Postgres](/docs/postgres).",
  "You want a [preview branch](/docs/compute/branching) that can own its app services and database.",
  "You prefer operation-based database pricing with spend limits on paid plans, and HIPAA, SOC 2, and ISO 27001 on Business at $129 a month.",
];

export const CHOOSE_SUPABASE = [
  "You want Auth, Storage, Realtime, auto-generated APIs, and Edge Functions next to Postgres, from the same vendor.",
  "You want the UI on a host such as Vercel, with Supabase running the backend next to the database.",
  "You want isolated Supabase preview environments for the backend, with frontend previews on an external host.",
  "You want a Pro plan from $25 a month plus hourly compute, and you accept that the Spend Cap does not cover database compute.",
];

export type CompareRow = {
  feature: string;
  supabase: string;
  prisma: string;
  sources: { supabase: string; prisma: string };
};

/** Columns run Feature, Supabase, Prisma Postgres: competitor first, like the Neon page. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Database",
    supabase:
      "Managed PostgreSQL. A project can be used as a standalone Postgres database with any Postgres client. Auth, Storage, Realtime, and Edge Functions are included and optional.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is managed PostgreSQL. Any Postgres client works with it, so Prisma ORM is optional.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
  {
    feature: "ORM on the same platform",
    supabase:
      "Auto-generated APIs and client libraries. Teams pick an external ORM or SQL client, such as Prisma ORM pointed at Supabase.",
    prisma:
      "[Prisma ORM](/docs/orm) is a first-party type-safe ORM on the same platform. It is optional.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "App hosting",
    supabase:
      "Edge Functions run server-side logic next to the database. Full app and frontend hosting remains on a separate platform.",
    prisma:
      "[Prisma Compute](/docs/compute) hosts the TypeScript app as HTTP services. It is separate from Prisma Postgres. Compute has no built-in cron scheduler. WebSocket servers are not supported.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/docs/compute/limitations",
    },
  },
  {
    feature: "Branches and previews",
    supabase:
      "Supabase branches are separate environments with their own instance and API credentials. New branches are data-less by default. Frontend preview hosting integrates with an external host. Branching compute is $0.01344 per branch per hour on Pro and Team.",
    prisma:
      "A Prisma [preview branch](/docs/compute/branching) can own its Compute services and databases. Production data is not copied into that database.",
    sources: {
      supabase: "https://supabase.com/docs/guides/deployment/branching",
      prisma: "https://www.prisma.io/docs/compute/branching",
    },
  },
  {
    feature: "Auth, Storage, and Realtime",
    supabase:
      "Auth, file Storage, Realtime, auto-generated APIs, and Edge Functions ship with every project.",
    prisma: "Not included. Use integrations with other tools.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
  {
    feature: "Database pricing model",
    supabase:
      "Organization plan plus compute billed separately per project. Pro is from $25 a month. Pro and Team include $10 a month in compute credits, enough for one Micro instance. Additional compute is billed hourly.",
    prisma:
      "Operations plus storage, with spend limits on paid plans. Prisma Postgres Free includes 200,000 operations a month and 2 GB of storage.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    feature: "HIPAA, SOC 2, and ISO 27001",
    supabase:
      "SOC 2 and ISO 27001 are included on Team at $599 a month. HIPAA is a paid add-on on Team and Enterprise. Not listed on Free or Pro.",
    prisma:
      "HIPAA, SOC 2 Type II, and ISO 27001 are on the Business plan at $129 a month, with a signed BAA for HIPAA. Not available on Free, Starter, or Pro. GDPR is on every plan.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/postgres/hipaa",
    },
  },
];

export const SUPABASE_FITS = [
  "Auth, Storage, Realtime, auto-generated APIs, and Edge Functions should sit next to Postgres from one vendor.",
  "The UI should stay on a frontend host, with Supabase isolating the backend on a preview branch.",
  "You want a Pro plan from $25 a month and are ready to pay compute by the hour beyond the included Micro credits.",
  "Point-in-time recovery is available as a $100 per month add-on per 7 days of retention.",
];

export const PRISMA_FITS = [
  "The database should be PostgreSQL, with SQL and the Postgres ecosystem.",
  "Prisma ORM should be available, and optional, on that database.",
  "The TypeScript app should deploy as HTTP services on Prisma Compute, in the same Prisma project as the database.",
  "Database usage should be billed by operations and storage, with a spend limit on paid plans. HIPAA, SOC 2, and ISO 27001 start on Business at $129 a month.",
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
    id: "compliance-tier",
    title: "HIPAA, SOC 2, and ISO 27001 on Business",
    body: "Prisma Postgres HIPAA, SOC 2 Type II, and ISO 27001 are on Business at $129 a month. HIPAA needs a signed BAA and is not on Free, Starter, or Pro. Supabase lists SOC 2 and ISO 27001 on Team at $599 a month, with HIPAA as a paid add-on. See [HIPAA on the Business plan](/postgres/hipaa).",
  },
];

export const PRICING: readonly {
  label: string;
  supabase: string;
  prisma: string;
  sources: { supabase: string; prisma: string };
}[] = [
  {
    label: "Free plan",
    supabase:
      "$0 a month. 500 MB database size per project, 2 active projects. Free projects pause after 1 week of inactivity.",
    prisma:
      "Prisma Postgres Free is $0. No credit card required. 200,000 operations a month, 2 GB of storage, and 50 databases.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Paid plans",
    supabase:
      "Pro from $25 a month. Team from $599 a month. Enterprise is custom. Pro and Team include $10 a month in compute credits.",
    prisma: "Starter $10, Pro $49, Business $129 a month for Prisma Postgres and Prisma Compute.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Database compute and storage",
    supabase:
      "Each project runs its own compute instance, billed hourly. Micro is $10 a month. Pro includes 8 GB disk per project, then $0.125 per GB. Branching compute is $0.01344 per branch per hour.",
    prisma:
      "Starter includes 10 GB, then $2.00 per GB. Pro includes 50 GB, then $1.50 per GB. Business includes 100 GB, then $1.00 per GB. Database usage is operations, not hourly compute.",
    sources: {
      supabase: "https://supabase.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Spend controls",
    supabase:
      "Spend Cap is on by default on Pro. It does not cover Compute, Branching Compute, Read Replica Compute, or Point-in-Time Recovery.",
    prisma: "Spend limits on Starter, Pro, and Business.",
    sources: {
      supabase: "https://supabase.com/docs/guides/platform/cost-control#spend-cap",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const WRONG_CHOICE = [
  "You want Auth, Storage, Realtime, auto-generated APIs, or Edge Functions as first-party services next to Postgres. Prisma Postgres does not include those. See [Supabase pricing](https://supabase.com/pricing).",
  "You want the frontend on a host such as Vercel, with Supabase isolating Auth, Storage, Edge Functions, and the database on a preview branch. A Prisma preview branch can own Compute services and databases; it does not include those Supabase backend products. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching).",
  "You need point-in-time recovery today. Prisma Postgres has no point-in-time recovery yet (it is coming in November 2026). Paid plans include daily backups. Supabase sells PITR as a $100 per month add-on per 7 days of retention on [Supabase pricing](https://supabase.com/pricing).",
  "You want database compute billed by the hour with a $25 Pro base, and you are fine that the Spend Cap excludes compute. Prisma Postgres bills operations and storage instead.",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Do I need Prisma ORM to use Prisma Postgres?",
    answer:
      "No. Prisma Postgres is PostgreSQL. Any Postgres client works with it, so Prisma ORM is optional. Source: [Prisma Postgres](/docs/postgres), October 2026.",
  },
  {
    question: "Does Supabase host the frontend?",
    answer:
      "Supabase Edge Functions run server-side logic next to the database. Full app and frontend hosting remains on a separate platform. Source: [Supabase pricing](https://supabase.com/pricing), October 2026.",
  },
  {
    question: "Does Prisma Postgres include Auth, Storage, or Realtime?",
    answer:
      "No. Prisma Postgres is managed PostgreSQL. Auth, Storage, and Realtime are not included; use integrations with other tools. Supabase ships those products with every project. Source: [Prisma Postgres](/docs/postgres) and [Supabase pricing](https://supabase.com/pricing), October 2026.",
  },
  {
    question: "How do Supabase and Prisma Postgres bill for the database?",
    answer:
      "Supabase charges an organization plan (Pro from $25 a month, Team from $599) plus compute billed separately per project. Pro and Team include $10 a month in compute credits. Prisma Postgres bills operations and storage, with spend limits on paid plans. Prisma Postgres Free includes 200,000 operations and 2 GB of storage, with no credit card. Source: [Supabase pricing](https://supabase.com/pricing) and [Prisma pricing](/pricing), October 2026.",
  },
  {
    question: "Which plan includes HIPAA?",
    answer:
      "Prisma Postgres HIPAA is on the Business plan at $129 a month, with a signed BAA. It is not on Free, Starter, or Pro. Supabase lists HIPAA as a paid add-on on Team ($599 a month) and Enterprise. Source: [HIPAA on the Business plan](/postgres/hipaa) and [Supabase pricing](https://supabase.com/pricing), October 2026.",
  },
];

export const TOOLS = {
  supabase: {
    name: "Supabase",
    softwareVersion: "current",
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    codeRepository: "https://github.com/supabase/supabase",
    programmingLanguage: "TypeScript",
    url: "https://supabase.com",
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
