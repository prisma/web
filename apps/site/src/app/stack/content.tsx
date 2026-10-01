import type { StackBentoContent } from "@/components/sections/stack-bento";
import type { BestForContent } from "./best-for";
import type { ComparisonContent } from "@/components/use-case/segment/comparison-table";
import type { SegmentUseCaseContent } from "@/components/use-case/segment/types";

// The Prisma Stack page. Every string is transcribed verbatim from the Notion
// card "Stack- Copy", toggle V1 — nothing added, tightened or reworded. Icons
// are decorative, not copy.

export const meta = {
  title: "The Prisma Stack",
  description:
    "An integrated TypeScript stack where your ORM, Postgres database, and app hosting share one workflow, so developers and coding agents can ship without coordinating between separate vendors.",
};

export const hero: SegmentUseCaseContent["hero"] = {
  headline: "One platform, from schema to production",
  subheadline:
    "An integrated TypeScript stack where your ORM, Postgres database, and app hosting share one workflow, so developers and coding agents can ship without coordinating between separate vendors.",
  benefits: [
    "One shared context across your stack",
    "Type-safe ORM, managed Postgres, and TypeScript app hosting",
    "Built for developers and coding agents shipping real applications",
  ],
  primaryCta: { label: "Get started free", href: "https://console.prisma.io" },
  secondaryCta: { label: "See pricing", href: "/pricing" },
};

export const stack: StackBentoContent = {
  orm: {
    body: "A declarative, type-safe schema that gives your app, your team, and your agent one shared contract across the stack.",
    bullets: [
      "Schema-as-LLM-context: small, dense, and machine-readable",
      "Structured errors agents can understand and act on",
      "Rebuilt in native TypeScript for faster type-checking at scale",
      "Free, open-source, and trusted by 500K+ developers",
    ],
  },
  postgres: {
    body: "Managed Postgres wired into your Prisma workflow and designed to run close to your app hosting.",
    bullets: [
      "Operation-based pricing with spend limits",
      "Free per-branch databases integrated with hosting previews",
      "Works with any ORM if you’re not using Prisma ORM",
      "Query Insights built in: spot slow queries and get an agent-ready prompt to fix them",
    ],
  },
  compute: {
    body: "TypeScript app hosting that runs close to Prisma Postgres, so your agent can deploy, debug, and redeploy from one workflow.",
    bullets: [
      "Bun runtime on bare metal",
      "Co-located with Prisma Postgres for single-digit millisecond query latency",
      "Versioned deployments with preview URLs",
      "Deploy by git push or CLI",
      "Long-running workloads: WebSockets, cron, and background jobs coming soon",
    ],
  },
  studio: {
    body: "Visual data browser and editor built into the Console. Inspect your data, see what your agent changed, and collaborate with teammates without writing SQL for every check.",
  },
  cli: {
    body: (
      <>
        The agent interface for the full platform. Structured output and{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8125em]">--json</code>{" "}
        modes help agents create, deploy, inspect, fix, and redeploy through the same Prisma
        workflow.
      </>
    ),
  },
};

export const comparison: ComparisonContent = {
  headline: "Prisma Stack vs. assembling your own backend stack",
  intro: [],
  pointHeader: "Need",
  assembledHeader: "Assembled backend stack",
  prismaHeader: "Prisma Stack",
  recommended: false,
  rows: [
    {
      point: "Data model",
      assembled: "Schema, queries, migrations, and app code can live across separate tools.",
      prisma: "Prisma schema gives the stack one shared contract.",
    },
    {
      point: "Database",
      assembled: "The database is usually configured and billed through a separate provider.",
      prisma: "Prisma Postgres is managed Postgres connected to the Prisma workflow.",
    },
    {
      point: "Hosting",
      assembled: "App hosting is usually managed separately from the database workflow.",
      prisma: "Prisma Compute runs TypeScript apps close to Prisma Postgres.",
    },
    {
      point: "Preview environments",
      assembled: "App previews and database branches often need separate setup.",
      prisma:
        "Prisma can connect preview deployments with isolated app and database environments.",
    },
    {
      point: "Agent workflow",
      assembled: "Agents may need to move across separate vendors, docs, CLIs, and APIs.",
      prisma: "Agents can work through Prisma schema, CLI, and Management API.",
    },
    {
      point: "Billing",
      assembled: "Separate tools mean separate bills, limits, and pricing models.",
      prisma: "Prisma brings the core workflow into one platform and one bill.",
    },
  ],
};

export const when: SegmentUseCaseContent["when"] = {
  headline: "When to use the Prisma Stack",
  intro:
    "Use the Prisma Stack when you're building a TypeScript app and want your data model, database, queries, hosting, previews, and agent workflow to stay connected.",
  items: [
    {
      icon: "rocket",
      title: "Building a new TypeScript app",
      body: "Go from your schema to a database to a deployed app in one connected workflow.",
    },
    {
      icon: "bot",
      title: "Handing infrastructure to an AI agent",
      body: "Give an agent a readable schema, structured CLI output, and API access to operate the stack.",
    },
    {
      icon: "layers",
      title: "Growing beyond an MVP",
      body: "Start with the free ORM, then add managed Postgres and app hosting when your product needs them.",
    },
    {
      icon: "layoutGrid",
      title: "Fewer vendors to coordinate",
      body: "Stop wiring together separate tools for your ORM, database, hosting, previews, and billing.",
    },
  ],
};

// Each audience gets a Prismo image — transparent cut-outs, fitted inside the
// tinted frame. An item without `image` shows a reserved slot.
export const bestFor: BestForContent = {
  headline: "Who the Prisma Stack is best for",
  intro:
    "Prisma fits TypeScript teams of any size that want one connected backend workflow, whether a person or an agent is driving it.",
  items: [
    {
      title: "Solo founders and small teams",
      image: "/brand/prismo-solo-founders.webp",
      body: "Ship a real product without a database or ops hire, and keep building on the same stack as you grow.",
    },
    {
      title: "Startups",
      image: "/brand/prismo-startups.webp",
      // the rocket and its trail run nearly edge to edge in the source
      imageScale: 1,
      body: "Move fast with a small team on a stack that carries the product from first launch into production.",
    },
    {
      title: "SaaS teams",
      image: "/brand/prismo-saas-teams.webp",
      body: "Keep your app, database, migrations, previews, and pricing connected as your product grows.",
    },
    {
      title: "Larger engineering teams",
      image: "/brand/prismo-engineering-teams.webp",
      body: "Give every engineer one shared backend workflow from schema to production.",
    },
  ],
};

export const cta = {
  headline: "Ready to let your agent run the full loop?",
  // Two paragraphs in the copy doc, run together in the closer's single body.
  body: "The TypeScript stack 500K+ developers trust. Start with the free ORM, then add managed Postgres and app hosting when you need the rest of the platform.",
  checks: [
    { label: "Built for how developers and agents ship now", color: "text-prism-cyan-500" },
    { label: "Postgres and hosting when you need them", color: "text-prism-yellow-400" },
    { label: "Type-safe ORM, free and always will be", color: "text-prism-red-500" },
  ],
};
