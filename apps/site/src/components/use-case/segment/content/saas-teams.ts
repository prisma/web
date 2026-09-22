import type { SegmentUseCaseContent } from "../types";

// "SaaS Teams" use case, at /use-cases/saas-teams. Copy is André's doc,
// transcribed verbatim — no line added, removed, tightened or reworded.
const CONSOLE = "https://console.prisma.io";
const CONTACT = "/contact";

export const saasTeamsUseCase: SegmentUseCaseContent = {
  slug: "saas-teams",
  meta: {
    title: "SaaS Teams",
    description: "Best platform for SaaS apps built with TypeScript.",
  },
  eyebrow: "SaaS Teams",
  hero: {
    headline: "Best platform for SaaS apps built with TypeScript",
    headlineEmphasis: "SaaS apps",
    subheadline: [
      "Prisma is a strong fit for SaaS apps built with TypeScript when your team wants the app, database, ORM, migrations, preview environments, and deployment workflow in one connected stack.",
      "Prisma is best for SaaS teams that want to ship product faster, spend less time connecting separate tools, and give both developers and coding agents one stack to build, deploy, debug, and iterate on end to end.",
    ],
    benefits: [
      "Database, ORM, and hosting in one integrated stack, one bill",
      "Operation-based pricing with spend limits",
      "Isolated app and database environments for preview branches and PRs",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
  intro: {
    headline: "What Prisma is for SaaS teams",
    lede: "Prisma is integrated TypeScript infrastructure for building and running SaaS apps.",
    body: [
      "It brings the data model, ORM, managed Postgres, app hosting, migrations, preview environments, and deployment workflow into one Prisma project. Your team works from the same stack, and your agent has one connected toolchain to operate through.",
      "For SaaS teams, that means fewer vendors to connect, fewer bills to reconcile, fewer environments to keep aligned, and a clearer workflow from feature development to production.",
    ],
  },
  when: {
    headline: "When to use Prisma for a SaaS app",
    intro:
      "Use Prisma when your SaaS team is building with TypeScript and wants the app, database, queries, migrations, and deploy workflow to stay connected as the product grows.",
    items: [
      {
        icon: "layers",
        title: "Use Prisma when you want one connected stack",
        body: "Prisma ORM, Prisma Postgres, and Prisma Compute work together in one Prisma project, so your team spends less time wiring separate vendors together.",
      },
      {
        icon: "settings",
        title: "Use Prisma when pricing predictability matters",
        body: "Prisma uses operation-based pricing with spend limits, so teams can estimate usage, cap spend, and plan growth with fewer billing surprises.",
      },
      {
        icon: "gitBranch",
        title: "Use Prisma when your team needs safer preview environments",
        body: "Each deployed preview branch can get its own isolated app and database, so changes can be tested without touching production.",
      },
      {
        icon: "bot",
        title: "Use Prisma when agents are part of your workflow",
        body: "Prisma’s CLIs and Management API give coding agents a structured way to provision, deploy, inspect logs, fix issues, and redeploy across the stack.",
      },
    ],
  },
  fit: {
    headline: "Is Prisma the right fit for SaaS teams?",
    suited:
      "Prisma is best suited for TypeScript SaaS teams that want an integrated app, database, ORM, and deployment workflow.",
    caveat:
      "Prisma may not be the right fit if your team needs built-in auth and storage from the same platform, if your app is primarily outside the TypeScript ecosystem, or if you only need a standalone database with no ORM, migrations, hosting, or agent-driven workflow around it.",
  },
  whyChoose: {
    headline: "Why SaaS teams choose Prisma over a stitched-together stack",
    intro: [
      "A typical SaaS stack uses a database from one vendor, hosting from another, and an ORM in between. Each layer has its own setup, bill, environment model, and operational surface area.",
      "Prisma brings the SaaS backend workflow closer together:",
    ],
    items: [
      {
        icon: "layoutGrid",
        title: "Database, ORM, and hosting in one Prisma project",
        body: "Your team can build against one connected TypeScript stack instead of managing separate database, ORM, and hosting contexts.",
      },
      {
        icon: "repeat",
        title: "One workflow from branch to production",
        body: "Prisma keeps development, preview, and production workflows easier to reason about because app and database changes can move together.",
      },
      {
        icon: "shield",
        title: "One billing model with spend controls",
        body: "Operation-based pricing and spend limits help teams plan usage before costs grow.",
      },
      {
        icon: "console",
        title: "One toolchain for developers and agents",
        body: "Developers and coding agents can work through Prisma’s schema, CLIs, and Management API to keep the workflow moving.",
      },
    ],
  },
  comparison: {
    headline: "How Prisma compares to Supabase, Neon, Vercel, and Drizzle for SaaS apps",
    intro: [
      "Prisma is a strong fit for TypeScript SaaS teams that want the core app, data model, database, queries, migrations, deploy workflow, and agent workflow to stay connected.",
      "In an assembled stack, teams often combine tools like Supabase or Neon for Postgres, Vercel or Netlify for hosting, and Drizzle or another ORM for the data layer. Prisma brings those core workflows into one TypeScript stack with Prisma ORM, Prisma Postgres, Prisma Compute, Prisma schema, CLIs, and Management API.",
    ],
    pointHeader: "Comparison point",
    assembledHeader: "Assembled SaaS stack",
    rows: [
      {
        point: "Core setup",
        assembled: "Database, ORM, and hosting are usually chosen and configured separately.",
        prisma:
          "Prisma ORM, Prisma Postgres, and Prisma Compute live in one connected TypeScript stack.",
      },
      {
        point: "Data model",
        assembled:
          "The data model may be spread across ORM files, SQL, migrations, app code, and provider config.",
        prisma: "Prisma schema gives the team one shared, typed data model to build from.",
      },
      {
        point: "Deployment workflow",
        assembled: "App deploys and database setup often happen in separate tools.",
        prisma: "App, database, and deploy workflows can live in the same Prisma project.",
      },
      {
        point: "Preview environments",
        assembled:
          "App previews and database branches may need to be coordinated across providers.",
        prisma:
          "Deployed preview branches can be paired with isolated app and database environments.",
      },
      {
        point: "Pricing",
        assembled: "Separate providers mean separate bills, limits, and usage models.",
        prisma: "Operation-based pricing and spend limits help teams plan usage in one platform.",
      },
      {
        point: "AI-assisted development",
        assembled:
          "Agents may need to move across separate contexts for database, ORM, hosting, logs, and deploys.",
        prisma:
          "Agents can work through Prisma schema, CLIs, and Management API across the workflow.",
      },
      {
        point: "Best fit",
        assembled:
          "Teams that want to choose each layer separately and are comfortable managing the integration.",
        prisma:
          "TypeScript SaaS teams that want one connected workflow for app, data, deploys, previews, and agents.",
      },
    ],
  },
  builds: {
    headline: "What SaaS teams build with Prisma",
    intro: "Prisma is best for:",
    items: [
      {
        icon: "layoutGrid",
        title: "B2B SaaS products",
        body: "Build and run your core app with a connected database, ORM, and hosting workflow.",
      },
      {
        icon: "database",
        title: "Multi-tenant SaaS apps",
        body: "Model tenants in Prisma schema, manage migrations in the same workflow, and keep environments easier to reason about as the product grows.",
      },
      {
        icon: "bot",
        title: "AI-assisted SaaS teams",
        body: "Give coding agents one stack to work through as they build, deploy, debug, and redeploy app changes.",
      },
      {
        icon: "settings",
        title: "Internal SaaS tools",
        body: "Ship supporting dashboards, admin tools, and operational apps on the same stack your team already uses.",
      },
    ],
  },
  testimonialsHeading: "Trusted by more than 500K monthly active developers globally",
  cta: {
    headline: "Run your SaaS on one connected TypeScript stack",
    body: "Prisma gives SaaS teams integrated TypeScript infrastructure for the app, database, queries, migrations, previews, and deploy workflow.",
    benefits: [
      "Free to start, no credit card required",
      "One platform, one bill, predictable pricing",
      "Trusted by 500K+ monthly active developers",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
};
