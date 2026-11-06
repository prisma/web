export const VERCEL_PATH = "/compare/vercel";

export const VERCEL_TITLE = "Prisma vs Vercel: app hosting with or without the database?";

export const VERCEL_DESCRIPTION =
  "Both host TypeScript apps. Pick Prisma Compute when the app should run next to Prisma Postgres and Prisma ORM on one first-party platform. Pick Vercel when you want mature frontend hosting and a Marketplace database. Checked October 2026.";

export const CHECKED = "October 2026";

/** The three-provider stack page. Do not overwrite /compare/vercel-neon-drizzle. */
export const VERCEL_NEON_DRIZZLE_COMPARE_PATH = "/compare/vercel-neon-drizzle";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const VERCEL_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const VERCEL_PUBLISHED = { iso: "2026-10-19", label: "October 2026" } as const;
export const VERCEL_UPDATED = { iso: "2026-10-19", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want the app hosted next to [Prisma Postgres](/docs/postgres) in the same project, without a cross-vendor network hop.",
  "You want a [preview branch](/docs/compute/branching) that can own its app services and its database.",
  "You want [Prisma ORM](/docs/orm), Prisma Postgres, and [Prisma Compute](/docs/compute) as one first-party platform.",
  "You want one Prisma workflow across the data model, the database, and deploys.",
];

export const CHOOSE_VERCEL = [
  "You want mature frontend hosting, a global CDN, and established preview deployments.",
  "You want deep Next.js integration and broad framework support.",
  "You want to connect a Marketplace database such as Neon, Supabase, or Prisma Postgres.",
  "You want hosting first, and to pick the database and ORM separately.",
];

export type CompareRow = {
  feature: string;
  vercel: string;
  prisma: string;
  sources: { vercel: string; prisma: string };
};

/** Columns run Feature, Vercel, Prisma. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "TypeScript app hosting",
    vercel:
      "Application hosting for frontend and full-stack apps, including Next.js and other frameworks.",
    prisma:
      "[Prisma Compute](/docs/compute) hosts TypeScript apps (Node.js, Bun, or Next.js) as HTTP services.",
    sources: {
      vercel: "https://vercel.com/docs/frameworks/nextjs",
      prisma: "https://www.prisma.io/docs/compute",
    },
  },
  {
    feature: "First-party managed Postgres",
    vercel:
      "Database providers through the Vercel Marketplace, including Neon, Supabase, and Prisma Postgres.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is first-party managed PostgreSQL in the same project as the app.",
    sources: {
      vercel: "https://vercel.com/marketplace",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
  {
    feature: "First-party type-safe ORM",
    vercel: "Bring your own. Vercel does not ship a first-party ORM.",
    prisma:
      "[Prisma ORM](/docs/orm) is a first-party type-safe ORM on the same platform. It is optional and free to use.",
    sources: {
      vercel: "https://vercel.com/docs",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "App and database placement",
    vercel: "Database placement depends on the Marketplace provider and the deployment region.",
    prisma:
      "Prisma Compute hosts the app next to Prisma Postgres in the same project, so the app and database do not need a cross-vendor network hop.",
    sources: {
      vercel: "https://vercel.com/marketplace",
      prisma: "https://www.prisma.io/docs/compute",
    },
  },
  {
    feature: "Preview environments",
    vercel:
      "Preview deployments for every Git push. A preview database depends on the Marketplace provider.",
    prisma:
      "A Prisma [preview branch](/docs/compute/branching) can own its Compute services and its Prisma Postgres database. Production data is not copied into that database.",
    sources: {
      vercel: "https://vercel.com/docs/deployments/environments",
      prisma: "https://www.prisma.io/docs/compute/branching",
    },
  },
  {
    feature: "Preview deployments",
    vercel: "Preview deployments for every Git push on Hobby and Pro.",
    prisma:
      "After deploy-on-push is set up, every pushed branch gets an isolated environment with its own services and, optionally, its own database.",
    sources: {
      vercel: "https://vercel.com/docs/deployments/environments",
      prisma: "https://www.prisma.io/docs/compute",
    },
  },
  {
    feature: "One first-party workflow",
    vercel:
      "Hosting is first-party. Database and data-layer tools come through Marketplace integrations or separate products.",
    prisma:
      "Prisma ORM, Prisma Postgres, and Prisma Compute sit in one first-party workflow, with one CLI and one [REST API](/docs/rest-api).",
    sources: {
      vercel: "https://vercel.com/marketplace",
      prisma: "https://www.prisma.io/docs/compute",
    },
  },
  {
    feature: "Mature frontend hosting and CDN",
    vercel: "Global CDN, Image Optimization, and a mature frontend hosting ecosystem.",
    prisma:
      "Prisma Compute focuses on TypeScript HTTP services next to Prisma Postgres. It is not a general CDN platform. WebSocket servers are not supported. Compute has no built-in cron scheduler.",
    sources: {
      vercel: "https://vercel.com/docs/cdn",
      prisma: "https://www.prisma.io/docs/compute/limitations",
    },
  },
];

export const VERCEL_FITS = [
  "Mature hosting for frontend and full-stack applications, with a global CDN.",
  "Deep Next.js integration and broad framework support.",
  "Established preview deployments for every Git push.",
  "A Marketplace of database and infrastructure integrations, including Prisma Postgres.",
];

export const PRISMA_FITS = [
  "Prisma Compute and Prisma Postgres run as one first-party platform.",
  "A preview branch can own its app services and its database.",
  "The app can sit next to Prisma Postgres in the same project, without a cross-vendor network hop.",
  "Prisma ORM connects the typed data layer to the same workflow. It is optional and free to use.",
];

export const APART = [
  {
    id: "hosting-and-database",
    title: "Hosting and database built together",
    body: "Prisma Compute and Prisma Postgres are designed and operated as one platform. Vercel connects application hosting to databases from Marketplace providers.",
  },
  {
    id: "co-located",
    title: "App and database next to each other",
    body: "Prisma Compute hosts the app next to Prisma Postgres in the same project, so the path does not cross vendors. On Vercel, database placement depends on the provider and the integration.",
  },
  {
    id: "one-workflow",
    title: "One integrated workflow",
    body: "The app, the database, the data model, and preview branches work through the same Prisma platform. On Vercel, application hosting is first-party; the database and the data layer come through separate products or integrations.",
  },
  {
    id: "type-safe-data-layer",
    title: "A first-party type-safe data layer",
    body: "Prisma ORM is part of the same platform. It is free to use, and free and open source, and always will be. On Vercel, the ORM and data-access tooling are chosen separately.",
  },
];

export const PRICING: readonly {
  label: string;
  vercel: string;
  prisma: string;
  sources: { vercel: string; prisma: string };
}[] = [
  {
    label: "Free plan",
    vercel:
      "Hobby is $0 a month for personal, non-commercial use. Included usage is capped; extra usage cannot be purchased.",
    prisma:
      "Free is $0. No credit card required. Prisma Compute includes 1M requests, 360 GB-hours of memory, 4 active vCPU-hours, and 10 GB outbound bandwidth a month. Prisma Postgres includes 200,000 operations, 2 GB of storage, and 50 databases.",
    sources: {
      vercel: "https://vercel.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Paid plans",
    vercel:
      "Pro is $20 a month for one deploying seat plus usage, and includes $20 in monthly credit. Extra deploying seats are $20 a month each. Usage beyond the credit is billed on demand.",
    prisma:
      "Starter $10, Pro $49, Business $129 a month for Prisma Postgres and Prisma Compute, with spend limits on paid plans.",
    sources: {
      vercel: "https://vercel.com/docs/plans/pro-plan",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Database",
    vercel: "Database pricing depends on the Marketplace provider you connect.",
    prisma:
      "Prisma Postgres sits on the same plans. Free includes 200,000 operations a month, 2 GB of storage, and 50 databases.",
    sources: {
      vercel: "https://vercel.com/marketplace",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "ORM",
    vercel: "Bring your own. Vercel does not ship a first-party ORM, so there is no ORM bill.",
    prisma: "Prisma ORM is free and open source, and always will be.",
    sources: {
      vercel: "https://vercel.com/docs",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    label: "Spend controls",
    vercel:
      "Spend Management on Pro, with a default $200 on-demand usage budget and optional hard limits that can pause projects.",
    prisma: "Hard spend limits on paid plans. The Free plan has no usage billing.",
    sources: {
      vercel: "https://vercel.com/docs/plans/pro-plan",
      prisma: "https://www.prisma.io/pricing",
    },
  },
];

export const WRONG_CHOICE = [
  "You want a mature frontend CDN, Image Optimization, and the Vercel hosting ecosystem. Prisma Compute hosts TypeScript HTTP services next to Prisma Postgres. It is not a general CDN platform.",
  "You want hosting and the database managed from the Vercel dashboard. Prisma Postgres works with an app on Vercel, but it is managed from the Prisma Console.",
  "You want to pick the database and ORM separately and connect them yourself. See [Prisma vs Vercel + Neon + Drizzle](/compare/vercel-neon-drizzle) when that stack is the alternative.",
  "You need WebSocket servers or a built-in cron scheduler. Prisma Compute does not support those today. See [Compute limitations](/docs/compute/limitations).",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Can I keep Vercel and use Prisma Postgres?",
    answer:
      "Yes. Prisma Postgres works with any Postgres client, including an app you host on Vercel. Prisma Compute is optional app hosting in the same Prisma project. Source: [Prisma Postgres](/docs/postgres) and [Prisma Compute](/docs/compute), October 2026.",
  },
  {
    question: "Do I need Prisma ORM to use Prisma Compute?",
    answer:
      "No. Prisma Compute runs TypeScript apps that do not use Prisma ORM. Prisma Postgres also works with any PostgreSQL client, so Prisma ORM is optional on both products. Source: [Prisma Compute](/docs/compute), October 2026.",
  },
  {
    question: "How do Prisma and Vercel price hosting?",
    answer:
      "Vercel Hobby is $0 for personal, non-commercial use. Pro is $20 a month for one deploying seat plus usage, and includes $20 in monthly credit. Extra deploying seats are $20 a month each. Prisma Free is $0 with no credit card: Prisma Compute includes 1M requests, 360 GB-hours of memory, 4 active vCPU-hours, and 10 GB outbound bandwidth a month; Prisma Postgres includes 200,000 operations, 2 GB of storage, and 50 databases. Paid Prisma plans are Starter $10, Pro $49, and Business $129 a month, with spend limits. Prisma ORM is free and open source, and always will be. Source: [Vercel pricing](https://vercel.com/pricing) and [Prisma pricing](/pricing), October 2026.",
  },
  {
    question: "Does Prisma Compute include a CDN like Vercel?",
    answer:
      "No. Prisma Compute hosts TypeScript HTTP services next to Prisma Postgres. It is not a general CDN platform. Vercel includes a global CDN and Image Optimization. Source: [Compute limitations](/docs/compute/limitations) and [Vercel CDN](https://vercel.com/docs/cdn), October 2026.",
  },
  {
    question: "How is this different from Prisma vs Vercel + Neon + Drizzle?",
    answer:
      "This page compares Prisma Compute, Prisma Postgres, and Prisma ORM with Vercel as a host. The [Vercel + Neon + Drizzle](/compare/vercel-neon-drizzle) page compares the same Prisma platform with a three-provider stack: Vercel for hosting, Neon for Postgres, and Drizzle for the ORM. Source: this page and [Prisma vs Vercel + Neon + Drizzle](/compare/vercel-neon-drizzle), October 2026.",
  },
];

/** Vercel is a hosted service, so it carries no license or code repository. */
export const TOOLS = {
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
