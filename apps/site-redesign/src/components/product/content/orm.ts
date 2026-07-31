import type { ProductIconName } from "../icons";
import type { ProductPageContent } from "../types";

// /orm copy, verbatim from the approved V4 of the Notion card "Product Page
// Batch One (3-5) - Copy". Nothing here is paraphrased, reordered or padded.
//
// Two notes on what V4 deliberately does NOT do:
//  - There is no signup CTA. The open-source ORM leads with GitHub and the
//    docs; "free to start" framing was ruled out for this page.
//  - The features and integrations carry no "Learn more" destinations, so none
//    are rendered rather than invented.

const GITHUB = "https://github.com/prisma/prisma";
const DOCS = "/docs";

export const ormContent: ProductPageContent = {
  name: "Prisma ORM",
  accent: "orm",
  hero: {
    headline: "Give your agent database access it can't get wrong",
    headlineEmphasis: "can't get wrong",
    subheadline:
      "Prisma ORM lets your agent work with your database through a typed schema it can read, edit, and verify against, so it ships data changes fast without the fear of breaking production. You define your data model once; every query, migration, and type is checked against it.",
    benefits: [
      "Let your agent verify its own work before it ships",
      "Safe migrations your agent can run without risking your data",
      "Free, open source, trusted by 500K+ developers",
    ],
    primaryCta: { label: "View on GitHub", href: GITHUB },
    secondaryCta: { label: "Read the docs", href: DOCS },
    illustration: "schemaFile",
  },
  problem: {
    headline: "Without a typed schema, your agent is working blind",
    body: [
      "When your schema lives across loosely-typed files, type mismatches surface at runtime and your agent can't reliably reason about the data layer. Worse, an agent making changes to an untyped database has no way to check its own work before it runs — and the biggest fear with agentic development is an agent that alters or deletes data it can't get back.",
      "Prisma ORM exists to change that.",
    ],
    outcomes: [
      { icon: "checkCircle", label: "Let your agent verify before it ships" },
      { icon: "code", label: "Give your agent a schema it can read" },
      { icon: "shield", label: "Run migrations without risking your data" },
      { icon: "rocket", label: "Type-check fast, even at scale" },
    ],
  },
  features: {
    headline: "A schema your whole stack reads",
    bridge:
      "Your data model is written once and read everywhere: by you, by your agent, and by every other Prisma product.",
    items: [
      {
        name: "Declarative schema",
        description:
          "Define your data model in one dense, machine-readable file. Easy for you to scan, easy for your agent to parse and edit reliably.",
        illustration: "denseSchema",
      },
      {
        name: "Type-safe client",
        description:
          "A fully typed query client generated from your schema. Autocomplete everywhere, and mistakes caught before they ship instead of in production.",
        illustration: "typedClient",
      },
      {
        name: "Built for agents, not just humans",
        description:
          "Errors carry stable codes, structured details, and remediation hints. Your agent reads what went wrong and fixes it, through a clean CLI and Management API.",
        illustration: "agentErrors",
      },
    ],
  },
  platform: {
    body: "The schema you write for the ORM is the same schema your database and hosting read. Adopt the ORM and you've already laid the foundation for the rest of the stack, with no rework when you're ready to expand.",
    integrations: [
      {
        icon: "database",
        product: "Prisma Postgres",
        benefit: "your schema provisions a production database that already understands it",
      },
      {
        icon: "server",
        product: "Prisma Compute",
        benefit: "deploy an app that's already wired to your schema and database",
      },
      {
        icon: "layoutGrid",
        product: "your favorite databases and frameworks",
        benefit: "Postgres, MySQL, SQLite, MongoDB, and tools like Next.js, Bun, and BetterAuth",
      },
    ],
  },
  cta: {
    headline: "Start with the ORM. Keep everything else within reach.",
    body: "Prisma ORM is part of a TypeScript stack built to work together end-to-end. Adopt the ORM today and the rest of the platform clicks in when you're ready, with no schema rework.",
    benefits: [
      "Free and open source, your schema is yours forever",
      "Add a database and hosting when you're ready, with no rework",
      "The TypeScript stack 500K+ developers already trust",
    ],
    primaryCta: { label: "View on GitHub", href: GITHUB },
    secondaryCta: { label: "Read the docs", href: DOCS },
  },
};

// The two top-level sections V4 adds on /orm that the standard template has no
// slot for. Copy is verbatim; see product-narrative.tsx and
// product-detail-blocks.tsx for the shapes they render in.
export const ormMigrations = {
  headline: "Migrations your agent can run without breaking production",
  paragraphs: [
    "Migrations are where agentic development gets dangerous — it's the moment an agent can alter or delete data irrecoverably. Prisma makes them safe to delegate.",
    "Change your models and Prisma generates the migration in TypeScript you can read and edit, not SQL you have to decipher. Every step is verified before and after it runs, and the result must match your schema to be applied.",
    'Because life is rarely a straight line, migrations are tracked as a graph, like git: roll back, branch, and named refs point at multiple environments. Your agent drives the whole lifecycle through a predictable CLI — plan, apply, inspect — without ever hand-writing SQL, and never "drop the database and start over."',
  ],
};

export const ormFeedback = {
  headline: "Fast feedback makes your agent faster, and more reliable",
  bridge:
    "Prisma ORM is built to give your agent feedback at every step so it can iterate to success without human intervention. The more feedback it gets from its environment, and the sooner it gets it, the fewer attempts it takes to reach correct, verified code.",
  // Icons are ours, not the copy's — the four sources are mirrored in the
  // sidebar of the section's illustration, so the glyphs match there.
  blocks: [
    {
      icon: "bot",
      name: "Expert from the first prompt",
      description:
        "Setting up a project installs the Prisma skills for your coding agent, so it knows the right patterns before it writes a line.",
    },
    {
      icon: "checkCircle",
      name: "The type system catches mistakes instantly",
      description:
        "Every query is checked against your schema before it ships. Wrong column, wrong type, missing relation — your agent finds out instantly, not in production.",
    },
    {
      icon: "console",
      name: "Errors built to be read by agents",
      description:
        "When something fails at runtime, the error carries a stable code, structured details, and remediation hints. Your agent reads what went wrong and fixes it.",
    },
    {
      icon: "shield",
      name: "Guardrails before anything touches your data",
      description:
        "Queries and migrations are verified against your schema before execution. A drifted schema or an invalid plan is rejected up front, with an error that says why.",
    },
  ] satisfies { icon: ProductIconName; name: string; description: string }[],
};
