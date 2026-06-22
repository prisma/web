/**
 * Single source of truth for blog series metadata.
 *
 * To add a new series:
 *   1. Add a key/value entry below.
 *   2. In each post in the series, set `series: <key>` and `seriesIndex: N`
 *      in the frontmatter.
 *
 * Set `featured: true` to surface the series on the blog home shelf and
 * style its card with the brand accent. Keep this list short — featured
 * cards take prime real estate.
 */
export const seriesRegistry = {
  "agentic-software-development": {
    title: "Agentic software development at Prisma",
    description:
      "How Prisma builds software with AI agents: introducing the practice, the process and documentation layer that make cross-repo agent work possible, the Drive process and the Maker role, and how the approach keeps evolving as models and harnesses improve.",
    featured: false,
    relatedSeries: ["prisma-next", "prisma-compute"],
  },
  "prisma-compute": {
    title: "Prisma Compute",
    description:
      "The story of Prisma Compute: TypeScript app hosting that runs on the same infrastructure as your database. From the public beta launch to the runtime engineering underneath.",
    featured: true,
    docsUrl: "https://docs.prisma.io/docs/prisma-compute",
    docsLabel: "Read the Prisma Compute docs",
    relatedSeries: ["agentic-software-development", "prisma-next"],
  },
  "prisma-next": {
    title: "Prisma Next",
    description:
      "Follow the journey of Prisma Next, the next evolution of Prisma ORM. From the announcement and roadmap to TypeScript migrations, the extension API, and Early Access.",
    featured: true,
    relatedSeries: ["agentic-software-development", "prisma-compute"],
  },
  "rust-to-typescript-migration-journey": {
    title: "Prisma ORM: The Complete Rust-to-TypeScript Migration Journey",
    description:
      "How Prisma ORM moved off the Rust query engine to a leaner TypeScript/WASM core, covering the rewrite, benchmarks, and the road to a Rust-free production release.",
  },
  "improving-query-performance-using-indexes": {
    title: "Improving query performance with indexes using Prisma",
    description:
      "A practical series on using database indexes with Prisma, from the fundamentals to specific index types and how to apply them to real queries.",
  },
  "fullstack-nextjs-graphql-prisma": {
    title: "Building a fullstack app using TypeScript, PostgreSQL, Next.js, GraphQL and Prisma",
    description:
      "Build a production-ready fullstack app step by step with Next.js, GraphQL, PostgreSQL and Prisma.",
  },
  "fullstack-remix-prisma-mongodb": {
    title: "Build A Fullstack App with Remix, Prisma & MongoDB",
    description:
      "A multi-part walkthrough of building a fullstack application with Remix, Prisma, and MongoDB.",
  },
  "e2e-type-safety-graphql-react": {
    title: "Build a Fully Type-Safe Application with GraphQL, Prisma & React",
    description:
      "Achieve end-to-end type safety across the stack using GraphQL, Prisma, and React.",
  },
  "backend-prisma-typescript-orm-with-postgresql": {
    title: "Building a modern backend with TypeScript, PostgreSQL and Prisma",
    description:
      "Build a modern backend from data modeling and validation all the way to deployment using TypeScript, PostgreSQL, and Prisma.",
  },
  "nestjs-prisma-rest-api": {
    title: "Building a REST API with NestJS, PostgreSQL, Swagger and Prisma",
    description:
      "Build a complete REST API with NestJS and Prisma, covering validation, relational data, error handling, and authentication.",
  },
  "testing-with-prisma": {
    title: "The Ultimate Guide to Testing with Prisma",
    description:
      "An end-to-end testing playbook for Prisma apps: unit, integration, and end-to-end tests, plus mocking patterns and CI workflows.",
  },
  "graphql-nexus": {
    title: "Code-first GraphQL server development with Nexus",
    description:
      "Build code-first GraphQL servers with Nexus, from the problems of schema-first to using Nexus with a database.",
  },
  "postgres-features": {
    title: "Postgres features you can reach for instead of more infrastructure",
    description:
      "A short series on Postgres features that quietly replace pieces of your stack. Pub/Sub via LISTEN and NOTIFY, the bloom index for wide tables, and more.",
  },
} as const satisfies Record<
  string,
  {
    title: string;
    description?: string;
    featured?: boolean;
    docsUrl?: string;
    docsLabel?: string;
    relatedSeries?: readonly string[];
  }
>;

export type SeriesKey = keyof typeof seriesRegistry;

export type SeriesMetadata = {
  title: string;
  description?: string;
  featured?: boolean;
  docsUrl?: string;
  docsLabel?: string;
  relatedSeries?: readonly string[];
};

function hasSeriesKey(key: string): key is SeriesKey {
  return Object.prototype.hasOwnProperty.call(seriesRegistry, key);
}

/**
 * Resolves series metadata for a given key. Falls back to a synthetic entry
 * using the key as the title if it isn't in the registry, so missing keys
 * never break the page — they just look unstyled until added to the registry.
 */
export function getSeriesMetadata(key: string): SeriesMetadata {
  if (hasSeriesKey(key)) {
    const entry = seriesRegistry[key] as SeriesMetadata;
    return entry;
  }
  return { title: key };
}

export function isKnownSeriesKey(key: string): key is SeriesKey {
  return hasSeriesKey(key);
}
