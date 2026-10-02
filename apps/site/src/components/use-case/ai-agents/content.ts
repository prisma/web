import type { ProductIconName } from "@/components/product/icons";
import type { ProductPageContent } from "@/components/product/types";

// The "AI & Agents" use-case page, at /use-cases/ai-agents.
//
// Copy is André's "USE CASE — AI & AGENTS" doc, transcribed verbatim — no line
// added, removed, tightened or reworded (André, 2026-08-25). This copy carries
// a different section set from the /use-cases/template shape (it has no
// three-step Define/Deploy/Iterate, no D4 differentiators and no FAQs; it adds
// "What Prisma is for AI agents", "When to use", "Is it the right fit", "The
// stack", "Where can I deploy", "How it compares" and "What agents can build"),
// so it gets its own composition (ai-agents-page.tsx) that reuses the template's
// components and idioms rather than being forced into the template's slots.
//
// Two copy-placement calls, both preserving every word:
//  - The doc's top label "USE CASE — AI & AGENTS" is the page-type marker, the
//    same role the RoleKicker already plays; the eyebrow carries the use-case
//    name "AI & Agents" (sentence-cased per the RoleKicker rule — the dot is
//    the accent, the label is never all-caps).
//  - The doc's hero has no visual and no stats microline, so neither is
//    invented: the hero visual is filled with the existing Console illustration
//    (see ai-agents-page.tsx) and the microline is left off.
const CONSOLE = "https://console.prisma.io";
const CONTACT = "/contact";

type Cta = { label: string; href: string };
/** Icon + heading + body — the "When to use" and "The stack" grids. */
type IconItem = { icon: ProductIconName; title: string; body: string };
/** Heading + body, no icon — the "What agents can build" cards (no icons in copy). */
type TextItem = { title: string; body: string };

export type AgentUseCaseContent = {
  /** Route segment: /use-cases/<slug>. */
  slug: string;
  meta: { title: string; description: string };
  /** Hero eyebrow — the use-case name, rendered as the site's RoleKicker. */
  eyebrow: string;
  /** Runs through the shared ProductHero; subheadline is the two hero paragraphs. */
  hero: ProductPageContent["hero"];
  /** "What Prisma is for AI agents" — a lede and two narrative paragraphs. */
  intro: { headline: string; lede: string; body: string[] };
  /** "When to use Prisma for agent-driven apps" — intro + four icon cards. */
  when: { headline: string; intro: string; items: IconItem[] };
  /** "Is Prisma the right fit for AI and agents?" — the suited line and the honest caveat. */
  fit: { headline: string; suited: string; caveat: string };
  /** "A stack built for agents to drive end to end" — intro + four layers. */
  stack: { headline: string; intro: string; items: IconItem[] };
  /** "Where can I deploy my agent-built TypeScript app?" — intro, the terminal animation, the loop line. */
  deploy: { headline: string; intro: string; animationLabel: string; body: string };
  /** "How Prisma compares to stitched-together stacks" — the two prose columns. */
  compare: { headline: string; before: string; after: string };
  /** "What agents can build with Prisma" — three build types. */
  builds: { headline: string; items: TextItem[] };
  /** The testimonials section heading, carried by the shared TestimonialsReveal. */
  testimonialsHeading: string;
  /** Closing CTA. */
  cta: { headline: string; body: string; benefits: string[]; primaryCta: Cta; secondaryCta: Cta };
};

export const aiAgentsUseCase: AgentUseCaseContent = {
  slug: "ai-agents",
  meta: {
    title: "AI & Agents",
    description: "The infrastructure layer for agent-driven TypeScript apps.",
  },
  eyebrow: "AI & Agents",
  hero: {
    headline: "The infrastructure layer for agent-driven TypeScript apps",
    headlineEmphasis: "infrastructure",
    subheadline: [
      "Prisma is integrated TypeScript infrastructure for AI coding agents. It gives agents a readable data model, managed Postgres, app hosting, migrations, logs, and deploy workflows they can operate through Prisma’s CLIs and Management API.",
      "Prisma is best for teams building TypeScript apps with agents like Claude Code, Cursor, Codex, Windsurf, v0, or Bolt, especially when the app needs a real database, a deployable backend, and a workflow the agent can keep moving through after it writes the first version of the code.",
    ],
    benefits: [
      "A machine-readable Prisma schema your agent can inspect, update, and migrate",
      "Prisma Postgres and Prisma Compute in one connected TypeScript stack",
      "CLIs and Management API for provisioning, deployment, logs, and redeployment",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
  intro: {
    headline: "What Prisma is for AI agents",
    lede: "Prisma is the infrastructure layer for agent-driven TypeScript apps.",
    body: [
      "It connects the parts an agent needs to ship a working application: the data model, database, ORM, migrations, hosting, logs, and deployment workflow. The agent gets one connected Prisma toolchain instead of separate database, ORM, and hosting contexts to reason through.",
      "For AI-assisted development, that matters because the agent can keep working through the backend loop: update the schema, provision the database, run migrations, deploy the app, inspect logs, fix issues, and redeploy.",
    ],
  },
  when: {
    headline: "When to use Prisma for agent-driven apps",
    intro:
      "Use Prisma when you want an AI coding agent to help ship a TypeScript app that needs more than generated code.",
    items: [
      {
        icon: "code",
        title: "Use Prisma when your agent needs a clear data model",
        body: "Prisma schema gives the agent a readable view of your data model, relationships, and migrations, so it can make changes with shared context.",
      },
      {
        icon: "database",
        title: "Use Prisma when your agent needs a database it can provision",
        body: "Prisma Postgres gives the agent a managed Postgres database it can create and connect as part of the same Prisma workflow.",
      },
      {
        icon: "rocket",
        title: "Use Prisma when your agent needs to deploy the app",
        body: "Prisma Compute gives the agent a place to deploy the TypeScript app in the same Prisma project, alongside its Prisma Postgres database.",
      },
      {
        icon: "repeat",
        title: "Use Prisma when your agent needs to debug and redeploy",
        body: "Prisma’s CLIs and Management API expose the workflow programmatically, so an agent can deploy, inspect logs, diagnose issues, apply fixes, and redeploy.",
      },
    ],
  },
  fit: {
    headline: "Is Prisma the right fit for AI and agents?",
    suited:
      "Prisma is best suited for TypeScript applications and agent-driven TypeScript workflows.",
    caveat:
      "Prisma may not be the right fit if your app is primarily outside the TypeScript ecosystem, if you need a fully bundled backend platform with built-in auth, or if you only need a standalone database without the ORM, schema, migration, and deployment workflow around it.",
  },
  stack: {
    headline: "A stack built for agents to drive end to end",
    intro: "Prisma gives agents one connected TypeScript stack to operate across.",
    items: [
      {
        icon: "code",
        title: "Schema",
        body: "The Prisma schema gives the agent a structured source of context for the data model.",
      },
      {
        icon: "database",
        title: "Database",
        body: "Prisma Postgres gives the agent a managed Postgres database to provision and connect.",
      },
      {
        icon: "server",
        title: "Hosting",
        body: "Prisma Compute gives the agent a deployment target for the TypeScript app.",
      },
      {
        icon: "console",
        title: "CLI and Management API",
        body: "Prisma’s CLIs and Management API give the agent structured interfaces for provisioning, deployment, logs, and redeployment.",
      },
    ],
  },
  deploy: {
    headline: "Where can I deploy my agent-built TypeScript app?",
    intro:
      "Prisma is a strong fit for deploying agent-built TypeScript apps when the app needs a database, migrations, hosting, and a repeatable deploy/debug/redeploy workflow.",
    animationLabel:
      "Terminal animation: agent runs the full build → deploy → debug → redeploy loop",
    body: "An agent can use Prisma to move from prompt to deploy in one loop: update the schema, migrate the database, deploy the app, inspect the logs, fix what broke, and redeploy through Prisma’s toolchain.",
  },
  compare: {
    headline: "How Prisma compares to stitched-together stacks",
    before:
      "In a stitched-together stack, the agent has to reason across separate tools for the database, ORM, hosting, logs, and deployment.",
    after:
      "With Prisma, those pieces live in one TypeScript infrastructure layer. The agent can work from the Prisma schema, provision Prisma Postgres, deploy to Prisma Compute, and continue through logs and redeploys using Prisma’s CLIs and Management API.",
  },
  builds: {
    headline: "What agents can build with Prisma",
    items: [
      {
        title: "Internal tools",
        body: "Generate a data model, connect a database, deploy the app, and keep iterating as requirements change.",
      },
      {
        title: "AI products",
        body: "Build TypeScript apps that need a real database, server-side logic, and a deployable TypeScript backend.",
      },
      {
        title: "SaaS prototypes",
        body: "Move from an idea to a working app without spending the first day wiring infrastructure together.",
      },
    ],
  },
  testimonialsHeading: "Trusted by more than 500K monthly active developers globally",
  cta: {
    headline: "Give your agent infrastructure it can keep working through",
    body: "Prisma gives AI coding agents the connected TypeScript infrastructure to build, deploy, debug, and iterate on real apps.",
    benefits: [
      "Free to start, no credit card required",
      "One integrated TypeScript stack",
      "Built around Prisma schema, Prisma Postgres, Prisma Compute, CLIs, and Management API",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
};
