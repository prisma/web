import { siteConfig } from "@/lib/config";
import { bulletList, ctaList, definitionList, heading, joinBlocks, paragraphs } from "./blocks";
import { renderTestimonialsMarkdown } from "./testimonials";

/**
 * Markdown rendition of the homepage (src/app/page.tsx).
 *
 * Mirrors, in render order: HeroHome (checks, CTAs, proof line), LogoCloud,
 * Comparison, HowItWorks, StackBento, AgentLoop, PricingScale,
 * TestimonialsReveal, Faq and CtaBurst — all in src/components/sections/.
 *
 * The H1 and the subheadline directly under it are exported separately
 * (`HOME_H1` / `HOME_SUBHEADLINE`) because the caller emits the page title and
 * intro itself; `renderHomeMarkdown()` picks up at the rest of the hero body.
 *
 * What is deliberately left out, per the "skip pure decoration" rule: the
 * hero's ConsoleIllustration / HeroBackdrop / prism monument, the Before and
 * After deploy mock cards in Comparison, the step illustrations in
 * HowItWorks, the product illustrations in StackBento, AgentLoop's
 * `aria-hidden` LoopDiagram (the Build/Deploy/Debug/Fix/Redeploy ring chips
 * and the "Your agent — one CLI + API" panel are UI illustration, not copy),
 * the CtaBurst cloud <video>, and the `aria-hidden` duplicate marquee tracks
 * in LogoCloud and TestimonialsReveal.
 */

/** The <h1> in hero-home.tsx, with the <GlassGlide> emphasis span flattened. */
export const HOME_H1 = "Your TypeScript app, from prompt to production";

/** The paragraph directly under the <h1>. */
export const HOME_SUBHEADLINE =
  "Give your coding agent a type-safe ORM, managed Postgres, and app hosting that work " +
  "together natively. One shared context across your stack is all your agent needs to build, " +
  "deploy, and iterate without coordinating between vendors.";

// hero-home.tsx renders the proof line from siteConfig.proof ("Trusted by
// <stat> <label>" for the first entry, then the rest joined by a middot), so
// it is derived here too rather than copied — the star count dates fast.
const proofLine = siteConfig.proof
  .map(({ stat, label }, i) => `${i === 0 ? "Trusted by " : ""}${stat} ${label}`)
  .join(" · ");

// logo-cloud.tsx — the marquee is rendered twice (the second track is
// aria-hidden); the names are deduped to one list here.
const LOGO_CLOUD_COMPANIES = [
  "Cursor",
  "Reddit",
  "Okta",
  "Lush",
  "ClickHouse",
  "Cal.com",
  "Accenture",
  "Dub",
  "Rapha",
  "Gamma",
  "Kapa.ai",
  "Documenso",
  "Elsevier",
  "Grover",
  "Formbricks",
  "Papermark",
  "Inbox Zero",
];

export function renderHomeMarkdown(): string {
  return joinBlocks([
    // ---- HeroHome (hero-home.tsx), everything after the h1 + subheadline ----
    // The checked benefits sit above the buttons in the DOM, so they are kept
    // in that order here.
    bulletList([
      "One platform, one stack, one bill",
      "A CLI and API your agent drives natively",
      "The ORM is free, always",
    ]),
    ctaList([
      { label: "Get started free", href: "https://console.prisma.io/sign-up" },
      { label: "See pricing", href: "/pricing" },
    ]),
    paragraphs(proofLine),

    // ---- LogoCloud (logo-cloud.tsx) ----
    // In the HTML the lead-in is a styled <p>, not an <h2>; promoted to a
    // heading here so the logo strip has a section of its own in the outline.
    heading(2, "Trusted by leading companies"),
    paragraphs(LOGO_CLOUD_COMPANIES.join(", ")),

    // ---- Comparison (comparison.tsx) ----
    heading(2, "The stack your agent has been waiting for"),
    heading(3, "Before"),
    bulletList([
      "A database from Neon, an ORM from Drizzle, hosting from Vercel",
      "Your agent writes the code, you wire it up",
      "Per-branch databases that don't connect to your hosting previews",
      "Bandwidth bills that scale faster than your traffic",
      "Context-switching between a database dashboard, ORM CLI, hosting console, and data browser",
    ]),
    heading(3, "After"),
    bulletList([
      "Your agent runs the full loop: build, deploy, debug, fix, redeploy",
      "One platform: hosting, database, and ORM built to work together natively",
      "Per-branch databases wired to your hosting previews automatically",
      "App and database co-located on the same host, at latency no two-vendor setup can match",
      "Spend limits on every paid tier, so your bill stops where you tell it to",
    ]),

    // ---- HowItWorks (how-it-works.tsx) ----
    heading(2, "Ship a production TypeScript app in three steps"),
    heading(3, "1. Define"),
    paragraphs(
      "Write your data model once in `contract.prisma`, or have your agent write it for you. " +
        "It's the shared contract your ORM, migrations, and data layer are all built around.",
    ),
    heading(3, "2. Deploy"),
    paragraphs(
      "Add Prisma Postgres and Compute when you're ready to ship. Your app and database deploy " +
        "together on the same host, co-located by default.",
    ),
    heading(3, "3. Iterate"),
    paragraphs(
      "Your agent reads logs, fixes what broke, and redeploys through one CLI. The loop runs " +
        "for as long as you need it to.",
    ),
    ctaList([{ label: "Get started free", href: "https://console.prisma.io/sign-up" }]),

    // ---- StackBento (stack-bento.tsx) ----
    // The <LearnMore> links render "Learn more" plus a screen-reader-only
    // " about <product>"; the full accessible name is used as the link label.
    // Each product row is led by a <RoleKicker> label; it is kept as an italic
    // line just under the product heading (above it, it would read as part of
    // the previous section).
    heading(2, "The TypeScript stack, integrated by design"),
    paragraphs(
      "ORM, database, and hosting designed to work together, so your agent can build, deploy, " +
        "and iterate without coordinating between vendors.",
    ),
    heading(3, "Prisma ORM"),
    paragraphs("*Type-safe data layer*"),
    paragraphs(
      "A declarative, type-safe schema rebuilt in native TypeScript, the shared contract your " +
        "whole stack and your agent are built around.",
    ),
    bulletList([
      "Schema-as-LLM-context: small, dense, machine-readable",
      "Errors structured for agent consumption, not just human-readable",
      "Rebuilt in native TypeScript for the fastest type-checking at scale",
      "Free, open-source, the foundation 500K+ developers already trust",
    ]),
    ctaList([{ label: "Learn more about Prisma ORM", href: "/orm" }]),
    // <ConnectorStrip> between the product rows: the file that ties the
    // neighbouring products together, plus its caption.
    paragraphs("`contract.prisma` — The shared contract across your stack"),
    heading(3, "Prisma Postgres"),
    paragraphs("*Managed database*"),
    paragraphs(
      "Managed Postgres already wired to your schema and co-located with your app hosting, on " +
        "infrastructure built for single-digit ms boot times.",
    ),
    bulletList([
      "Unikernel microVMs on bare metal, single-digit ms boot",
      "Operation-based pricing with spend limits, no bill shock",
      "Free per-branch databases, integrated with hosting previews",
      "Works with any ORM if you're not using Prisma's",
      "Query Insights built in: spot slow queries and get an agent-ready prompt to fix them",
    ]),
    ctaList([{ label: "Learn more about Prisma Postgres", href: "/postgres" }]),
    paragraphs("`prisma.config.ts` — One config, both products"),
    heading(3, "Prisma Compute"),
    paragraphs("*App hosting*"),
    paragraphs(
      "TypeScript app hosting that runs on the same host as your database, so your agent can " +
        "deploy, debug, and redeploy end-to-end.",
    ),
    bulletList([
      "Bun runtime on bare metal",
      "Co-located with Prisma Postgres, single-digit ms query latency",
      "Long-running workloads: WebSockets, cron, background jobs (coming soon)",
      "Versioned deployments with preview URLs, deploy by git push or CLI",
    ]),
    ctaList([{ label: "Learn more about Prisma Compute", href: "/compute" }]),
    // "Working across the stack" is an <h3> whose two tools are <h4>s; the
    // block helpers stop at level 3, so the tools are flattened to bold
    // lead-ins with their own paragraph and link below.
    heading(3, "Working across the stack"),
    paragraphs("**Prisma Studio** — to inspect your data"),
    paragraphs(
      "Visual data browser and editor built into the Console. See what your agent did to your " +
        "database, collaborate with teammates without SQL, embeddable in your own apps.",
    ),
    ctaList([{ label: "Learn more about Prisma Studio", href: "/postgres" }]),
    paragraphs("**CLI + Management API** — to stay in the loop"),
    paragraphs(
      "The agent interface for the full platform. Structured output and `--json` modes " +
        "everywhere, with full parity between CLI and API so anything your agent can run, it " +
        "can also call programmatically.",
    ),
    ctaList([{ label: "Learn more about the CLI and Management API", href: "/docs" }]),

    // ---- AgentLoop (agent-loop.tsx) ----
    heading(2, "What changes when your stack is built to work together"),
    definitionList([
      {
        name: "Your agent handles the full loop",
        description: "Build, deploy, debug, redeploy. No vendor coordination.",
      },
      {
        name: "One platform, not five glued together",
        description:
          "Get your app live without wiring together a database, a host, and an ORM from " +
          "separate vendors.",
      },
      {
        name: "Deploy your app, the database is already there",
        description: "App and Postgres co-located on the same host.",
      },
    ]),

    // ---- PricingScale (pricing-scale.tsx) ----
    heading(2, "Pricing that scales with you"),
    paragraphs(
      "Start free with the ORM, which will always be free. Prisma Postgres has a free tier with " +
        "a hard cap, so you can build without a credit card. When you outgrow it, you're on " +
        "operation-based pricing with spend limits, and data transfer is always included.",
    ),
    ctaList([{ label: "See pricing", href: "/pricing" }]),
    bulletList([
      "**Free Postgres tier** with a hard cap, no credit card required",
      "**Spend limits on every paid tier**, so your bill never surprises you",
      "**Unlimited data transfer included**, no bandwidth bill-shock",
      "**Prisma ORM is free, always**",
      "**Per-branch databases included**, no surcharge",
      "**SOC2, HIPAA, ISO 27001, and GDPR** at the Business tier",
    ]),
    // All three carousel scenarios are included: only one slide is visible at
    // a time in the HTML, and Markdown has no interaction.
    heading(3, "Side project (~5K MAU)"),
    paragraphs("Typical stack (Neon + Vercel): $19-39 per month"),
    bulletList([
      "Separate database + hosting bills",
      "Data transfer billed per GB",
      "Credit card required up front",
    ]),
    paragraphs("Prisma: $0 per month"),
    bulletList([
      "No credit card required",
      "Data transfer included",
      "Hard free-tier cap, no surprises",
    ]),
    heading(3, "Growing SaaS (~50K MAU)"),
    paragraphs("Typical stack (Neon + Vercel): $385-450 per month"),
    bulletList([
      "Separate database + hosting bills",
      "Data transfer billed per GB",
      "Spend limits not standard",
    ]),
    paragraphs("Prisma: $70-90 per month"),
    bulletList(["One bill, one platform", "Data transfer included", "Spend limits on by default"]),
    heading(3, "At scale (~500K MAU)"),
    paragraphs("Typical stack (Neon + Vercel): $2,800-3,400 per month"),
    bulletList([
      "Committed-use contracts across vendors",
      "Data transfer billed per GB",
      "Spend limits not standard",
    ]),
    paragraphs("Prisma: $640-780 per month"),
    bulletList(["One bill, one platform", "Data transfer included", "Spend limits on by default"]),

    // ---- TestimonialsReveal (testimonials-reveal.tsx) ----
    // Shared renderer: the section is reused on other pages, and it already
    // dedupes the two marquee rows and their aria-hidden half-tracks down to
    // one entry per quote. "Real teams, real builds" is the homepage heading,
    // which is also the component's default.
    renderTestimonialsMarkdown(),

    // ---- Faq (faq.tsx) ----
    // Only the first accordion item is open by default; every answer is
    // included because the Markdown has no interaction.
    heading(2, "FAQ"),
    heading(3, "Do I have to use all three products?"),
    paragraphs(
      "No. Prisma Postgres works with any ORM. Prisma Compute works with any TypeScript app. " +
        "The ORM is free and works with any database. Use whichever pieces solve your problem, " +
        "and add the rest when you're ready.",
    ),
    heading(3, "What if I'm not using an AI coding agent?"),
    paragraphs(
      "Everything works without one. The CLI and Management API are built so agents can drive " +
        "them, but they're also just well-designed developer tools. Use Prisma the way you've " +
        "always used Prisma.",
    ),
    heading(3, "Is my schema locked in?"),
    paragraphs(
      "No. `contract.prisma` is yours, your data sits in standard Postgres, and you can migrate " +
        "away whenever you want. Migration paths from Prisma to other tools are documented.",
    ),
    heading(3, "How do I know what an operation will cost me?"),
    paragraphs(
      "Every paid tier includes spend limits, so your bill stops at the cap you set. The " +
        "pricing calculator on the pricing page gives you a usage estimate, and full operation " +
        "definitions are in the docs.",
    ),
    heading(3, "Should I run production on Prisma Compute?"),
    paragraphs(
      "Compute is generally available: pricing is live, and every paid plan includes spend " +
        "limits. The ORM and Prisma Postgres are production-ready and used by teams from solo " +
        "developers to companies like Lush, Rapha, and Elsevier.",
    ),
    heading(3, "What about Prisma 7 / Prisma ORM users today?"),
    paragraphs(
      "Prisma 7 isn't going anywhere and remains fully supported. Prisma 8, now the current " +
        "release, is a separate, opinionated product built for agentic workflows, not a forced " +
        "upgrade. When you are ready to move, the Prisma 8 docs include an upgrade guide from " +
        "Prisma 7.",
    ),

    // ---- CtaBurst (cta-burst.tsx), rendered with its default props ----
    heading(2, "Ready to let your agent run the full loop?"),
    paragraphs(
      "The TypeScript stack 500K+ developers trust. Start with the free ORM, and add the rest " +
        "of the platform when you need it.",
    ),
    bulletList([
      "Built for how your agent ships now",
      "Postgres and hosting when you need them",
      "Type-safe ORM, free and always will be",
    ]),
    ctaList([
      { label: "Get started free", href: "https://console.prisma.io/sign-up" },
      { label: "See pricing", href: "/pricing" },
    ]),
  ]);
}
