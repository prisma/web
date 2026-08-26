import type { ProductIconName } from "../icons";
import type { ProductPageContent } from "../types";

// /orm copy, from the approved V4 of the Notion card "Product Page Batch One
// (3-5) - Copy", with the 2026-08-06 client review's changes marked inline.
//
// The review's headline note on this page: "The redesign leans heavily into
// AI/agents immediately. I'd first establish the core ORM value (schema →
// generated client → type-safe queries) since that's still what most users
// come for." V4's hero led with the agent, so the hero has been rewritten to
// lead with the schema and the typed client. The agent argument is not
// removed — it keeps the migrations narrative and the whole feedback-loop
// section below, it just no longer arrives before the ORM has been explained.
//
// Two notes on what V4 deliberately does NOT do, both still honoured:
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
    // Rewritten from V4's "Give your agent database access it can't get wrong"
    // — see the note at the top of this file.
    headline: "One schema. Every query type-safe.",
    headlineEmphasis: "type-safe",
    subheadline:
      "Define your data model once, and Prisma ORM generates a typed client where every query, migration and type is checked against it.",
    benefits: [
      "Autocomplete over your own models, and mistakes caught before they ship",
      "Migrations that refuse to run when they would destroy data",
      "Free, open source, trusted by 500K+ developers",
    ],
    primaryCta: { label: "View on GitHub", href: GITHUB },
    secondaryCta: { label: "Read the docs", href: DOCS },
    // Keeps the review's "works across many databases" note visible in the
    // first screen, not just in the tour's last tab.
    microline: "Works with Postgres, MySQL, SQLite, MongoDB and more.",
    tour: [
      {
        label: "Schema",
        caption:
          "One file your whole stack reads: models, field types and relations declared in one place.",
        illustration: "schemaFile",
      },
      {
        label: "Client",
        caption:
          "A typed client generated from that schema, so a wrong field name fails in your editor, not in production.",
        illustration: "clientAutocomplete",
      },
      {
        label: "Migrations",
        caption:
          "Prisma refuses a migration that would destroy data, and tells you what it would have dropped.",
        illustration: "migrationBlocked",
      },
      {
        label: "Any database",
        caption:
          "The same schema and the same generated client over Postgres, MySQL, SQLite, MongoDB and more.",
        illustration: "anyDatabase",
      },
    ],
  },
  problem: {
    // Reframed from V4's agent-first "Without a typed schema, your agent is
    // working blind". Same argument, but the developer's problem leads and the
    // agent arrives as the second beat rather than the premise.
    headline: "Without a typed schema, your data layer is guesswork",
    body: [
      "When your data model lives across loosely-typed files and hand-written SQL, mismatches surface at runtime instead of in your editor, and nothing can check a change against the schema before it runs. That is true when you write the change, and it is far more dangerous when an agent does.",
      "Prisma ORM exists to change that.",
    ],
    outcomes: [
      { icon: "code", label: "One schema your whole stack reads" },
      { icon: "checkCircle", label: "Every query checked before it ships" },
      { icon: "shield", label: "Migrations that refuse to destroy data" },
      { icon: "layoutGrid", label: "The same client over any database" },
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
