import type { SegmentUseCaseContent } from "../types";

// "Engineering Teams" use case, at /use-cases/engineering-teams. Copy is
// André's doc, transcribed verbatim — no line added, removed, or reworded.
const CONSOLE = "https://console.prisma.io";
const CONTACT = "/contact";

export const engineeringTeamsUseCase: SegmentUseCaseContent = {
  slug: "engineering-teams",
  meta: {
    title: "Engineering Teams",
    description: "Best backend workflow for TypeScript engineering teams.",
  },
  eyebrow: "Engineering Teams",
  hero: {
    headline: "Best backend workflow for TypeScript engineering teams",
    headlineEmphasis: "backend workflow",
    subheadline: [
      "Prisma is an integrated TypeScript stack for engineering teams that need one shared workflow across schema, queries, migrations, preview environments, and production.",
      "Prisma is best for teams that want to keep engineers, environments, and coding agents aligned as the backend grows more complex.",
    ],
    benefits: [
      "One schema as the shared contract across your team",
      "Type-safe queries that catch mistakes before they ship",
      "A production-like database for every branch and PR",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
  intro: {
    headline: "Why engineering teams use Prisma",
    lede: "As engineering teams grow, backend workflows can start to drift. Data models change, migrations get harder to review, preview environments fall out of sync, and different engineers may handle queries, database changes, and deploys in different ways.",
    body: [
      "Prisma gives teams one connected TypeScript workflow for the parts of the backend that need to stay aligned: schema, queries, migrations, database environments, and deployment workflows.",
      "The result is a backend workflow that is easier to review, easier to share across the team, and easier for agents to reason about.",
    ],
  },
  when: {
    headline: "When Prisma is a good fit for engineering teams",
    intro:
      "Use Prisma when your team is building with TypeScript and needs a shared backend workflow that stays consistent from local development to production.",
    items: [
      {
        icon: "code",
        title: "Your team needs one shared data model",
        body: "Prisma schema gives engineers one readable source of context for the data model, relationships, and migrations.",
      },
      {
        icon: "shield",
        title: "You want safer query changes",
        body: "Prisma Client gives your team fully typed queries, so mismatches can be caught during development before they become production issues.",
      },
      {
        icon: "swap",
        title: "Migrations need to be easier to review",
        body: "Prisma Migrate generates reviewable migrations from the schema, so database changes are easier to inspect before they reach production.",
      },
      {
        icon: "gitBranch",
        title: "Preview environments need real databases",
        body: "Each deployed preview branch can get its own isolated app and database environment, so teams can test changes without touching production.",
      },
    ],
  },
  fit: {
    headline: "Is Prisma the right fit for engineering teams?",
    suited:
      "Prisma is best suited for TypeScript engineering teams that want a shared workflow across the data model, queries, migrations, database environments, and deploy process.",
    caveat:
      "Prisma may not be the right fit if your team is primarily outside the TypeScript ecosystem, if you only need a standalone database, or if your team wants to manage the ORM, database, hosting, migrations, and preview environments as separate tools.",
  },
  comparison: {
    headline: "Prisma vs. a fragmented backend workflow",
    intro: [
      "Engineering teams often start with an ORM, a database provider, a hosting platform, and a migration workflow that were chosen separately. That can work early on, but as the team grows, the seams between those tools become harder to manage.",
      "Prisma brings the core backend workflow into one TypeScript stack, so engineers and agents work from the same schema, query layer, migration workflow, and project context.",
    ],
    pointHeader: "Engineering need",
    assembledHeader: "Fragmented backend workflow",
    rows: [
      {
        point: "Shared data model",
        assembled:
          "The data model may be spread across ORM files, SQL, migrations, and application code.",
        prisma: "Prisma schema gives the team one shared, readable contract for the data model.",
      },
      {
        point: "Query safety",
        assembled: "Query mistakes may show up during review, testing, or production.",
        prisma: "Prisma Client catches type mismatches during development.",
      },
      {
        point: "Migration review",
        assembled:
          "Database changes can be hard to understand when schema, SQL, and application code drift.",
        prisma: "Prisma Migrate creates reviewable migrations from the schema.",
      },
      {
        point: "Preview environments",
        assembled: "App previews and database changes may need to be coordinated across providers.",
        prisma:
          "Deployed preview branches can be paired with isolated app and database environments.",
      },
      {
        point: "Team onboarding",
        assembled: "New engineers have to learn conventions spread across tools and people.",
        prisma: "New engineers can start from the schema and shared Prisma workflow.",
      },
      {
        point: "Agent-assisted development",
        assembled: "Agents may need to infer backend context across separate tools and files.",
        prisma:
          "Agents can reason from Prisma schema and work through Prisma’s CLIs and Management API.",
      },
    ],
  },
  builds: {
    headline: "Who Prisma is best for",
    items: [
      {
        icon: "layers",
        title: "Growing TypeScript teams",
        body: "Keep engineers aligned around one schema, one typed client, and one migration workflow.",
      },
      {
        icon: "swap",
        title: "Teams with frequent schema changes",
        body: "Make database changes easier to review before they reach production.",
      },
      {
        icon: "gitBranch",
        title: "Teams using preview environments",
        body: "Test app and database changes together before merging.",
      },
      {
        icon: "bot",
        title: "Teams using coding agents",
        body: "Give agents a clearer backend context and a structured workflow for schema changes, deploys, logs, fixes, and redeploys.",
      },
    ],
  },
  testimonialsHeading: "Trusted by more than 500K monthly active developers globally",
  cta: {
    headline: "Keep your engineering team aligned from schema to production",
    body: "Prisma gives engineering teams one connected TypeScript workflow for schema, queries, migrations, preview environments, and production.",
    benefits: [
      "Free to start, no credit card required",
      "One shared stack across your whole team",
      "Built for TypeScript teams and agent-assisted development",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
};
