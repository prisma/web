import type { SegmentUseCaseContent } from "../types";

// "Startups & Founders" use case, at /use-cases/startups. Copy is André's doc,
// transcribed verbatim — no line added, removed, tightened or reworded.
const CONSOLE = "https://console.prisma.io";
const CONTACT = "/contact";

export const startupsUseCase: SegmentUseCaseContent = {
  slug: "startups",
  meta: {
    title: "Startups & Founders",
    description: "Best TypeScript stack for founders building from MVP to scale.",
  },
  eyebrow: "Startups & Founders",
  hero: {
    headline: "Best TypeScript stack for founders building from MVP to scale",
    headlineEmphasis: "MVP to scale",
    subheadline: [
      "Prisma is an integrated TypeScript stack for founders who need to launch a real product quickly, then keep building on the same foundation as usage grows.",
      "It brings your app, database, ORM, migrations, and deployment workflow into one connected stack, so you can start fast without planning for a rebuild the moment you find traction.",
      "Prisma is best for technical founders, small startup teams, and AI-assisted builders who want to ship a TypeScript app with a real database, predictable pricing, and a path from first deploy to real traffic.",
    ],
    benefits: [
      "Build your MVP on the same stack you can keep using as you grow",
      "Start free, then keep costs capped as usage increases",
      "Give developers and coding agents one workflow from schema to deploy",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
  intro: {
    headline: "Why founders start with Prisma",
    lede: "Prisma gives founders one connected TypeScript stack for the parts of the product that usually slow early teams down: the data model, database, queries, migrations, and deployment workflow.",
    body: [
      "Instead of assembling those pieces across separate vendors, founders can launch the first version faster and keep building on the same foundation as usage grows.",
    ],
  },
  when: {
    headline: "When Prisma is a good fit for startups",
    intro:
      "Use Prisma when you’re building a TypeScript product and want to get from idea to deployed app without assembling your backend stack from separate vendors first.",
    items: [
      {
        icon: "rocket",
        title: "You need to launch quickly",
        body: "Define your data model, create a database, and deploy your TypeScript app from one connected Prisma workflow.",
      },
      {
        icon: "layoutGrid",
        title: "Your team is small",
        body: "A founder or small team can manage the database, migrations, and deploy workflow without dedicated infrastructure support from day one.",
      },
      {
        icon: "shield",
        title: "Pricing needs to stay predictable",
        body: "Start free with no credit card, then use operation-based pricing and spend limits as traffic grows.",
      },
      {
        icon: "layers",
        title: "You want less rework later",
        body: "Start your MVP on a stack designed for real traffic, so early infrastructure decisions hold up as the product grows.",
      },
    ],
  },
  fit: {
    headline: "Is Prisma the right fit for startups?",
    suited:
      "Prisma is best suited for TypeScript products and teams that want an integrated app, database, ORM, migration, and deployment workflow.",
    caveat:
      "Prisma may not be the right fit if your app is primarily outside the TypeScript ecosystem, if you need built-in auth and storage from the same backend platform, or if you only need a standalone database without the Prisma ORM, schema, migrations, or deployment workflow around it.",
  },
  comparison: {
    headline: "Why founders start on Prisma instead of assembling a stack",
    intro: [
      "Early-stage teams usually need to answer one question quickly: can this product get real users?",
      "Infrastructure decisions can slow that down. A typical startup stack means picking a database provider, choosing an ORM, selecting a host, setting up environments, wiring connection strings, and figuring out pricing across multiple tools.",
      "Prisma gives founders one connected TypeScript stack for the core product workflow: schema, database, queries, migrations, deploys, previews, and agents.",
    ],
    pointHeader: "Startup need",
    assembledHeader: "Assembled stack",
    rows: [
      {
        point: "First launch",
        assembled:
          "The founder chooses and wires together a database, ORM, and host before shipping.",
        prisma:
          "Prisma brings the app, database, ORM, and deploy workflow into one connected stack.",
      },
      {
        point: "MVP speed",
        assembled: "Setup decisions can take time before users ever see the product.",
        prisma: "Founders can move from data model to database to deployed app faster.",
      },
      {
        point: "Cost control",
        assembled: "Separate tools create separate bills and usage models.",
        prisma: "Prisma starts free and supports spend limits as usage grows.",
      },
      {
        point: "AI-assisted building",
        assembled: "Coding agents may need to reason across separate tools and setup steps.",
        prisma:
          "Agents can work through Prisma schema, CLIs, and Management API across the workflow.",
      },
      {
        point: "Growth path",
        assembled: "The MVP stack may become harder to manage once traffic and complexity grow.",
        prisma:
          "Prisma is designed to carry the product from first deploy to real traffic on the same platform.",
      },
    ],
  },
  builds: {
    headline: "Who Prisma is best for",
    intro: "Prisma is best for:",
    items: [
      {
        icon: "rocket",
        title: "MVPs and first launches",
        body: "Get a working TypeScript product in front of users without spending the first week assembling infrastructure.",
      },
      {
        icon: "bot",
        title: "AI-assisted products",
        body: "Build apps with a real database, durable state, server-side logic, and a deployable TypeScript backend, often with help from a coding agent.",
      },
      {
        icon: "layoutGrid",
        title: "Early SaaS products",
        body: "Start with one connected workflow for your app, database, queries, migrations, and deploys.",
      },
      {
        icon: "layers",
        title: "The company after the MVP",
        body: "Keep building on the same stack as you add users, features, and your first hires.",
      },
    ],
  },
  testimonialsHeading: "Trusted by more than 500K monthly active developers globally",
  cta: {
    headline: "Start on Prisma and keep building as you grow",
    body: "Prisma gives founders integrated TypeScript infrastructure for the first version of the product and the growth that comes after it.",
    benefits: [
      "Free to start, no credit card required",
      "One connected stack from MVP to real traffic",
      "Built for developers and coding agents building TypeScript apps",
    ],
    primaryCta: { label: "Get started free", href: CONSOLE },
    secondaryCta: { label: "Talk to us", href: CONTACT },
  },
};
