export const PLANETSCALE_PATH = "/compare/planetscale";

export const PLANETSCALE_TITLE =
  "Prisma Postgres vs PlanetScale: TypeScript app hosting or database-first Postgres?";

export const PLANETSCALE_DESCRIPTION =
  "Both are managed PostgreSQL. Pick Prisma Postgres for optional Prisma ORM, Prisma Compute, and a $0 free plan. Pick PlanetScale for database-first SKUs, Metal, and Neki. Checked October 2026.";

export const CHECKED = "October 2026";

/** The blog's author page and photo; `/blog` is rewritten to the blog app. */
export const PLANETSCALE_AUTHOR = {
  name: "Martin Janse van Rensburg",
  path: "/blog/author/martin-janse-van-rensburg",
  image: "/blog/authors/martin-janse-van-rensburg.png",
} as const;

export const PLANETSCALE_PUBLISHED = { iso: "2026-10-19", label: "October 2026" } as const;
export const PLANETSCALE_UPDATED = { iso: "2026-10-19", label: "October 2026" } as const;

export const CHOOSE_PRISMA = [
  "You want [Prisma ORM](/docs/orm) available on the same platform as the database. Prisma ORM is optional; any Postgres client works.",
  "You want [Prisma Compute](/docs/compute) to host the TypeScript app as HTTP services next to [Prisma Postgres](/docs/postgres).",
  "You want a [preview branch](/docs/compute/branching) that can own its app services and database.",
  "You want a [$0 free plan](/postgres/free-postgresql-hosting) with no credit card, then operation-based pricing with spend limits on paid plans.",
];

export const CHOOSE_PLANETSCALE = [
  "You want a database-first Postgres SKU, with application hosting on another provider.",
  "You want high-availability Postgres with one primary and two replicas across three availability zones, or Metal with local NVMe.",
  "You want PlanetScale database branches as isolated database deployments, billed as their own clusters.",
  "You want horizontally sharded Postgres with Neki, currently in platform preview, and you accept that PlanetScale says not to run production on it during the preview.",
];

export type CompareRow = {
  feature: string;
  planetscale: string;
  prisma: string;
  sources: { planetscale: string; prisma: string };
};

/** Columns run Feature, PlanetScale, Prisma Postgres: alphabetical by product. */
export const COMPARE_ROWS: readonly CompareRow[] = [
  {
    feature: "Database",
    planetscale:
      "Managed PostgreSQL with branching and connection pooling. Single-node instances start at $5 a month. HA is one primary and two replicas. Metal uses local NVMe.",
    prisma:
      "[Prisma Postgres](/docs/postgres) is managed PostgreSQL that autoscales, with no instance to size or upgrade. Any Postgres client works with it, so Prisma ORM is optional.",
    sources: {
      planetscale: "https://planetscale.com/pricing",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
  {
    feature: "ORM on the same platform",
    planetscale: "No first-party ORM. Teams pick an external ORM or SQL client.",
    prisma:
      "[Prisma ORM](/docs/orm) is a first-party type-safe ORM on the same platform. It is optional.",
    sources: {
      planetscale: "https://planetscale.com/docs/postgres/branching",
      prisma: "https://www.prisma.io/docs/orm",
    },
  },
  {
    feature: "App hosting",
    planetscale: "Application hosting stays with another provider. PlanetScale is the database.",
    prisma:
      "[Prisma Compute](/docs/compute) hosts the TypeScript app as HTTP services. It is separate from Prisma Postgres. Compute has no built-in cron scheduler. WebSocket servers are not supported.",
    sources: {
      planetscale: "https://planetscale.com/pricing",
      prisma: "https://www.prisma.io/docs/compute/limitations",
    },
  },
  {
    feature: "Branches and previews",
    planetscale:
      "A PlanetScale Postgres branch is an isolated database deployment. There is no data replication between branches. Branches created from the Branches page start as PS-DEV at $5 a month and do not copy schema or data. Restore from a backup to include schema and data.",
    prisma:
      "A Prisma [preview branch](/docs/compute/branching) can own its Compute services and databases. Production data is not copied into that database.",
    sources: {
      planetscale: "https://planetscale.com/docs/postgres/branching",
      prisma: "https://www.prisma.io/docs/compute/branching",
    },
  },
  {
    feature: "Free plan",
    planetscale: "No $0 Postgres plan. Single-node Postgres instances start at $5 a month.",
    prisma:
      "Prisma Postgres Free is $0. No credit card required. 200,000 operations a month, 2 GB of storage, and 50 databases.",
    sources: {
      planetscale: "https://planetscale.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    feature: "Database pricing model",
    planetscale:
      "Resource-based SKUs: cluster size, storage, backups, and network usage. Prices on the pricing page are AWS us-east-1 and vary by region.",
    prisma:
      "Operations plus storage, with spend limits on paid plans. Starter is $10 a month with 1 million operations and 10 GB included.",
    sources: {
      planetscale: "https://planetscale.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    feature: "Horizontal Postgres sharding",
    planetscale:
      "Neki is horizontally sharded Postgres, in platform preview as of September 2026. PlanetScale says not to run production workloads on Neki during the preview. Neki has no single-node configuration.",
    prisma: "Standard PostgreSQL. No first-party horizontal sharding product.",
    sources: {
      planetscale: "https://planetscale.com/blog/introducing-neki",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
];

export const PLANETSCALE_FITS = [
  "The database should be a PlanetScale Postgres SKU, with the app on another host.",
  "High availability should be one primary and two replicas, or Metal with local NVMe from $50 a month.",
  "Database branches should be isolated clusters, billed separately, without copying production data by default.",
  "Horizontally sharded Postgres with Neki is acceptable as a platform preview, not production.",
];

export const PRISMA_FITS = [
  "The database should be PostgreSQL, with SQL and the Postgres ecosystem.",
  "Prisma ORM should be available, and optional, on that database.",
  "The TypeScript app should deploy as HTTP services on Prisma Compute, in the same Prisma project as the database.",
  "The database should have a $0 free plan, then operations and storage with spend limits on paid plans.",
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
    id: "free-tier",
    title: "A $0 free plan",
    body: "Prisma Postgres Free is $0, with no credit card. PlanetScale Postgres single-node instances start at $5 a month. There is no $0 PlanetScale Postgres SKU on the pricing page checked October 2026.",
  },
];

export const PRICING: readonly {
  label: string;
  planetscale: string;
  prisma: string;
  sources: { planetscale: string; prisma: string };
}[] = [
  {
    label: "Lowest listed Postgres price",
    planetscale: "Single-node PS-5 is $5 a month on AWS us-east-1. There is no $0 Postgres plan.",
    prisma:
      "Prisma Postgres Free is $0. No credit card required. 200,000 operations a month, 2 GB of storage, and 50 databases.",
    sources: {
      planetscale: "https://planetscale.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "High availability",
    planetscale:
      "HA Postgres is one primary and two replicas. PS-5 HA is $15 a month on AWS us-east-1.",
    prisma: "Starter $10, Pro $49, Business $129 a month for Prisma Postgres and Prisma Compute.",
    sources: {
      planetscale: "https://planetscale.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Metal",
    planetscale:
      "Postgres Metal starts at $50 a month for M-10 arm64 with 10 GiB included NVMe on AWS us-east-1. Storage is in the SKU rate.",
    prisma: "No Metal SKU. Storage is billed by gigabyte on paid plans after the included amount.",
    sources: {
      planetscale: "https://planetscale.com/pricing",
      prisma: "https://www.prisma.io/pricing",
    },
  },
  {
    label: "Neki",
    planetscale:
      "Horizontally sharded Postgres in platform preview. No single-node SKU. Network-attached Neki starts at $30 a month per shard (PS-10 arm64 HA) plus routers, storage, backups, and network. PlanetScale says not to run production on it during the preview.",
    prisma: "Not offered. Prisma Postgres is standard PostgreSQL.",
    sources: {
      planetscale: "https://planetscale.com/blog/introducing-neki",
      prisma: "https://www.prisma.io/docs/postgres",
    },
  },
];

export const WRONG_CHOICE = [
  "You want database-first SKUs, Metal NVMe, or HA across three availability zones as the product. Prisma Postgres does not sell those cluster sizes. See [PlanetScale pricing](https://planetscale.com/pricing).",
  "You want horizontally sharded Postgres. Neki is PlanetScale's product for that, in platform preview. Prisma Postgres is standard PostgreSQL. PlanetScale says not to run production on Neki during the preview. See [Introducing Neki](https://planetscale.com/blog/introducing-neki).",
  "You want the database on PlanetScale and the app on another host, and a $5 cluster is acceptable because you do not need a $0 database plan.",
];

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "Does PlanetScale Postgres have a free plan?",
    answer:
      "No $0 Postgres SKU is listed. Single-node Postgres instances start at $5 a month on AWS us-east-1. Prisma Postgres Free is $0, with no credit card, 200,000 operations, and 2 GB of storage. Source: [PlanetScale pricing](https://planetscale.com/pricing) and [Prisma pricing](/pricing), October 2026.",
  },
  {
    question: "Do I need Prisma ORM to use Prisma Postgres?",
    answer:
      "No. Prisma Postgres is PostgreSQL. Any Postgres client works with it, so Prisma ORM is optional. Source: [Prisma Postgres](/docs/postgres), October 2026.",
  },
  {
    question: "Does PlanetScale host the TypeScript app?",
    answer:
      "No. PlanetScale is the database. Application hosting stays with another provider. Prisma Compute hosts TypeScript HTTP services next to Prisma Postgres. Source: [PlanetScale pricing](https://planetscale.com/pricing) and [Prisma Compute](/docs/compute), October 2026.",
  },
  {
    question: "What is Neki?",
    answer:
      "Neki is PlanetScale's horizontally sharded Postgres. It entered platform preview on 10 September 2026. PlanetScale says you should not run production workloads on Neki during the preview. Each shard is an HA Postgres cluster; there is no single-node Neki SKU. Source: [Introducing Neki](https://planetscale.com/blog/introducing-neki) and [PlanetScale pricing](https://planetscale.com/pricing), October 2026.",
  },
  {
    question: "Do PlanetScale Postgres branches copy production data?",
    answer:
      "No by default. Branches created from the Branches page start as isolated PS-DEV databases at $5 a month and do not copy schema or data. Restore from a backup to include schema and data. There is no replication between branches. Source: [PlanetScale Postgres branching](https://planetscale.com/docs/postgres/branching), October 2026.",
  },
];

export const TOOLS = {
  planetscale: {
    name: "PlanetScale",
    softwareVersion: "current",
    license: "https://planetscale.com/legal/siteterms",
    codeRepository: "https://github.com/planetscale",
    programmingLanguage: "Go",
    url: "https://planetscale.com",
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
