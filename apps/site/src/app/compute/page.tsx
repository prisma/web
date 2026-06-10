import { Metadata } from "next";
import { Button, Card, Action, Badge } from "@prisma/eclipse";
import { Card as BentoCard } from "@/components/homepage/bento";
import { cn } from "@/lib/cn";
import { CardSection } from "@/components/homepage/card-section/card-section";
import { ThemFragmentedCard, UsUnifiedCard, TemplateCards, WorkloadCards } from "./components";
// Heavy client components are dynamically imported with ssr:false.
// The dynamic() calls with ssr:false must live in a Client Component boundary;
// client-components.tsx is that boundary.
import {
  CobeGlobe,
  NetworkGlobe,
  DeployTerminal,
  StatefulExecutionCard,
  HowItWorks,
} from "./client-components";

const FEATURES = [
  {
    content: (
      <>
        <h2 className="text-foreground-neutral type-title-2xl mt-0 mb-4 text-pretty">
          Deploy from your repo
        </h2>
        <p className="text-foreground-neutral-weak text-base mb-4 text-pretty">
          Run one command and Prisma Compute builds your app and brings it live with a URL.
        </p>
        <ul className="text-foreground-neutral text-sm space-y-2 m-0 pl-4 list-disc">
          <li>
            <code className="font-mono text-foreground-ppg-strong">
              @prisma/cli@latest app deploy
            </code>{" "}
            from the CLI, then connect a GitHub branch for push-to-deploy
          </li>
          <li>No CI/CD pipeline to configure</li>
          <li>No deployment scripts, no dashboard workflows</li>
          <li>What&apos;s in your repo is what runs</li>
        </ul>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "right" as const,
    visualType: "other" as const,
    other: <DeployTerminal />,
    noShadow: true,
    visualClass: "md:flex-2! lg:flex-3! ml-0 max-w-[unset]!",
    step: "fa-brands fa-github",
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral type-title-2xl mt-0 mb-4 text-pretty">
          Stateful execution
        </h2>
        <p className="text-foreground-neutral-weak text-base mb-4 text-pretty">
          Your code runs as a long-lived process. Connections stay open. In-process caches persist
          across requests.
        </p>
        <ul className="text-foreground-neutral text-sm space-y-2 m-0 pl-4 list-disc">
          <li>Long-lived processes, not per-request functions</li>
          <li>Long-running HTTP requests and streaming responses</li>
          <li>Connections and in-process state persist across requests</li>
        </ul>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "right" as const,
    visualType: "other" as const,
    other: <StatefulExecutionCard />,
    noShadow: true,
    visualClass: "md:flex-2! lg:flex-3! ml-0 max-w-[unset]! w-full",
    step: "fa-regular fa-arrow-trend-up",
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral type-title-2xl mt-0 mb-4 text-pretty">
          Any TypeScript workload
        </h2>
        <p className="text-foreground-neutral-weak text-base mb-4 text-pretty">
          Standard TypeScript on Bun, not a constrained edge runtime. No V8 isolate limits.
        </p>
        <ul className="text-foreground-neutral text-sm space-y-2 m-0 pl-4 list-disc">
          <li>Backend APIs and full-stack apps</li>
          <li>Long-running and streaming HTTP workloads</li>
          <li>AI agents, retrieval, and LLM orchestration</li>
          <li>Coming soon: background workers, cron, and WebSocket servers</li>
        </ul>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    visualPosition: "right" as const,
    visualType: "other" as const,
    other: <WorkloadCards />,
    noShadow: true,
    visualClass: "md:flex-2! lg:flex-3! ml-0 max-w-[unset]!",
    step: "fa-regular fa-file-code",
  },
  {
    content: (
      <>
        <h2 className="text-foreground-neutral type-title-2xl mt-0 mb-4 text-pretty">
          Co-located database
        </h2>
        <p className="text-foreground-neutral-weak text-base mb-4 text-pretty">
          Auto-wires Prisma Postgres and runs in the same environment.
        </p>
        <ul className="text-foreground-neutral text-sm space-y-2 m-0 pl-4 list-disc">
          <li>Low-latency access to the co-located database</li>
          <li>Built-in connection pooling for long-lived processes</li>
          <li>Pairs with a Prisma Postgres database in one step</li>
          <li>Works with any database, no lock-in</li>
        </ul>
      </>
    ),
    imageUrl: null,
    imageAlt: null,
    mobileImageUrl: null,
    mobileImageAlt: null,
    logos: null,
    useDefaultLogos: false,
    other: <NetworkGlobe />,
    visualPosition: "right" as const,
    visualType: "other" as const,
    noShadow: true,
    visualClass: "md:flex-2! lg:flex-3! ml-0 max-w-[unset]!",
    step: "fa-regular fa-route",
  },
];

const DOES_IT_WORK = [
  {
    title: "Deploying Next.js today?",
    description:
      "Deploy with one command. Your assets are served by your app the way they are when self-hosting Next, with cache headers under control.",
    icon: "fa-regular fa-n",
    badgeColor: "ppg" as const,
  },
  {
    title: "Running a Hono, Express, or Fastify API?",
    description:
      "Long-lived processes are the default, so streaming and long-running requests work without workarounds. Connections stay open and streams run uninterrupted.",
    icon: "fa-regular fa-rocket",
    badgeColor: "success" as const,
  },
  {
    title: "Building an AI agent?",
    description:
      "Long-lived runtimes and in-process memory, on the same runtime that serves your API.",
    icon: "fa-regular fa-stars",
    badgeColor: "ppg" as const,
  },
  {
    title: "Need background jobs or workers?",
    description:
      "Coming soon. Run them as long-lived processes alongside your API, in the same repo and runtime.",
    icon: "fa-regular fa-clock-rotate-left",
    badgeColor: "neutral" as const,
    comingSoon: true,
  },
  {
    title: "Bringing your own database?",
    description:
      "Pair with Prisma Postgres for zero-config provisioning, or connect to anything else. Either way, no lock-in.",
    icon: "fa-regular fa-database",
    badgeColor: "success" as const,
  },
  {
    title: "Tired of the serverless tax?",
    description:
      "Tired of paying extra for expensive egress, image transformations, and third-party realtime services? With Prisma Compute, it all comes standard on a powerful Bun runtime.",
    icon: "fa-regular fa-receipt",
    badgeColor: "success" as const,
  },
];

const WHY_FEATURES = [
  {
    id: "push-code",
    title: "Push code, it runs",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        Deploy from the CLI, then connect a GitHub branch to ship on every push. No build pipelines to configure.
      </div>
    ),
    icon: "fa-regular fa-rocket",
    row: "top" as const,
  },
  {
    id: "long-lived-runtime",
    title: "Long-lived runtime",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        Always-on Bun processes for long-running requests and streaming.
      </div>
    ),
    icon: "fa-regular fa-infinity",
    row: "top" as const,
  },
  {
    id: "any-ts-workload",
    title: "TypeScript apps",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        APIs, full-stack apps, and AI agents. More workloads coming soon.
      </div>
    ),
    icon: "fa-regular fa-layer-group",
    row: "top" as const,
  },
  {
    id: "static-assets",
    title: "Static assets included",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        Your app serves them. No separate CDN service. No separate bill.
      </div>
    ),
    icon: "fa-regular fa-brackets-square",
    row: "center" as const,
  },
  {
    id: "db-connected",
    title: "Pairs with Prisma Postgres",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        Auto-wires Prisma Postgres and runs in the same environment. Also works with
        any database.
      </div>
    ),
    icon: "fa-regular fa-database",
    row: "center" as const,
  },
  {
    id: "reliable",
    title: "Recovers on its own",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        Health checks and automatic restarts keep your app running.
      </div>
    ),
    icon: "fa-regular fa-shield-check",
    row: "center" as const,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Prisma Compute: Deploy TypeScript apps on Bun",
    description:
      "Deploy TypeScript apps from your repo. APIs and AI agents run as long-lived Bun processes next to Prisma Postgres, with long-running requests and streaming.",
    openGraph: {
      title: "Prisma Compute: Deploy TypeScript apps on Bun",
      description:
        "Deploy TypeScript apps from your repo. APIs and AI agents run as long-lived Bun processes next to Prisma Postgres, with long-running requests and streaming.",
      url: "https://www.prisma.io/compute",
      type: "website",
      siteName: "Prisma",
      images: [
        {
          url: "/og/og-compute.png",
          width: 1200,
          height: 630,
          alt: "Prisma Compute: Deploy TypeScript apps on Bun",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@prisma",
      creator: "@prisma",
    },
  };
}

export default async function Page() {
  return (
    <main className="bg-background-default">
      <div className="hero -mt-24 pt-40 flex items-end justify-center px-4 relative mb-24">
        <div className="absolute z-0 inset-0 hero-background max-sm:overflow-hidden max-sm:flex max-sm:items-center">
          <div className="relative max-w-[1800px] mx-auto w-full md:-mt-[10vw] lg:-mt-[30vw] opacity-10">
            <CobeGlobe />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
          <div className="absolute inset-0 pointer-events-none z-1 bg-[url('/illustrations/homepage/footer_grid.svg')]" />
        </div>
        <div className="content relative z-2 flex flex-col gap-8 max-w-308 w-full">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="flex items-center gap-2 text-foreground-ppg type-title-sm">
              <i className="fa-solid fa-microchip" aria-hidden="true"></i>
              <span>Prisma Compute</span>
            </div>
            <h1
              className="mb-0 text-center mt-0 type-title-6xl text-foreground-neutral max-w-4xl mx-auto text-balance"
              style={{ fontSize: "clamp(2.25rem, 9vw, 3.75rem)" }}
            >
              Deploy TypeScript apps <span className="md:block">on Prisma Compute</span>
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-3xl mx-auto text-xl">
            <b>Push code, it runs.</b> Your app runs as a long-lived TypeScript process on Bun, next
            to your database. A good fit for APIs and AI agents that hold state, stream responses,
            and keep connections open.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button asChild variant="ppg" size="2xl">
              <a
                href="https://pris.ly/pdp?utm_source=site&utm_campaign=compute&utm_term=devrel"
                className="flex items-center gap-2"
              >
                <span>Try Prisma Compute</span>
                <i className="flex items-center fa-regular fa-arrow-up-right" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <section className=" relative z-2 flex flex-col items-center gap-12 py-12 px-8">
        <div className="flex flex-col gap-3 max-w-296 w-full items-start">
          <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider">
            01 / WHY-PRISMA-COMPUTE
          </span>
          <h2 className="type-title-4xl text-foreground-neutral m-0">
            Built for the way TypeScript runs.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-296 w-full">
          {WHY_FEATURES.map((card) => (
            <BentoCard key={card.id} card={card} className={cn("h-auto! gap-0! compute-box")} />
          ))}
        </div>
      </section>
      <section className="my-12 py-12 px-8">
        <div className="pt-12 relative gap-8 flex flex-col max-w-296 w-full mx-auto">
          <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider mb-12">
            02 / FEATURES
          </span>
          <CardSection
            cardSection={FEATURES}
            className="max-w-full w-full -mt-5 md:-mt-10 lg:-mt-20"
          />
        </div>
      </section>
      <section className="flex flex-col items-center gap-12 py-12 px-8">
        <div className="flex flex-col gap-3 max-w-296 w-full items-start">
          <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider">
            03 / WHY USE COMPUTE
          </span>
          <h2 className="type-title-4xl text-foreground-neutral m-0 text-left">
            Does it work for me?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-296 w-full">
          {DOES_IT_WORK.map((item) => {
            const comingSoon = "comingSoon" in item && item.comingSoon;
            return (
              <Card
                key={item.title}
                className={cn(
                  comingSoon
                    ? "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] border-dashed border-stroke-ppg/50"
                    : item.badgeColor === "ppg"
                      ? "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg-strong)_262.5%)] border-stroke-ppg/40"
                      : "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]",
                )}
              >
                <div className="flex items-center justify-between">
                  <Action color={comingSoon ? "ppg" : "neutral"} size="lg">
                    <i className={cn(item.icon, "text-sm")} />
                  </Action>
                  {comingSoon ? (
                    <Badge
                      color="ppg"
                      size="md"
                      label={
                        <span className="flex items-center gap-1.5">
                          <i className="fa-regular fa-sparkles text-xs" />
                          COMING SOON
                        </span>
                      }
                    />
                  ) : (
                    <Badge
                      color={item.badgeColor}
                      className={cn(
                        item.badgeColor === "ppg" &&
                        "bg-background-ppg-reverse-strong text-foreground-neutral-reverse font-bold!",
                      )}
                      size={item.badgeColor === "ppg" ? "lg" : "md"}
                      label={
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-check text-xs" />
                          YES
                        </span>
                      }
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-foreground-neutral type-title-md m-0 mb-2">{item.title}</h3>
                  <p className="text-foreground-neutral-weak text-sm m-0">{item.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      <section className="flex flex-col items-center gap-12 py-12 px-8">
        <div className="flex flex-col gap-3 max-w-296 w-full items-start">
          <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider">
            04 / WHAT MAKES IT UNIQUE
          </span>
          <h2 className="type-title-4xl text-foreground-neutral m-0 text-left">
            One service for your app and its assets.
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row items-stretch gap-6 max-w-296 w-full">
          <div className="w-full lg:flex-1">
            <ThemFragmentedCard />
          </div>
          <div className="w-full lg:flex-1">
            <UsUnifiedCard />
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center gap-12 py-12 px-8">
        <div className="flex flex-col gap-3 max-w-296 w-full items-start">
          <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider">
            05 / STARTERS
          </span>
          <h2 className="type-title-4xl text-foreground-neutral m-0 text-center">Starter apps</h2>
        </div>
        <div className="max-w-296 w-full">
          <TemplateCards />
        </div>
      </section>
      <section className="flex flex-col items-center gap-12 py-12 px-8">
        <div className="flex flex-col gap-3 max-w-296 w-full items-start">
          <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider">
            06 / CORE TECHNICAL OVERVIEW
          </span>
          <h2 className="type-title-4xl text-foreground-neutral m-0 text-center">How it works</h2>
        </div>
        <div className="max-w-296 w-full">
          <HowItWorks />
        </div>
      </section>
      <div className="before:inset-x-20 before:inset-y-0 before:absolute relative before:content-[''] before:pointer-events-none before:-z-0 rounded-full before:bg-[radial-gradient(64.76%_75.81%_at_50%_50%,var(--color-background-ppg)_0%,var(--color-background-default)_70%)]">
        <div className="inset-x-20 inset-y-0 bg-[url('/illustrations/homepage/footer_grid.svg')] bg-contain bg-cente absolute inset-0 z-1 pointer-events-none" />
        <div className="my-12 p-12 relative z-1">
          <div className="flex flex-col mx-auto w-fit items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <h2 className="type-title-2xl text-foreground-neutral">
                Why we built Prisma Compute
              </h2>
              <p className="text-foreground-neutral-weak max-w-154">
                We wanted to ship TypeScript apps without stitching together separate build,
                hosting, and database tools. Push a repo, get a URL, and keep working in your
                codebase.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button asChild variant="ppg" size="2xl">
                <a
                  href="https://pris.ly/compute-blog-pb?utm_source=site&utm_campaign=compute&utm_term=devrel"
                  className="flex gap-2 items-center"
                >
                  <span>Read the launch post</span>
                  <i className="fa-regular h-auto fa-arrow-right" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="default-strong" size="2xl">
                <a
                  href="https://pris.ly/compute-docs?utm_source=site&utm_campaign=compute&utm_term=devrel"
                  className="flex gap-2 items-center"
                >
                  <span>Read the docs</span>
                  <i className="fa-regular h-auto fa-book-open" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <h6 className="mb-0! -mt-4 text-xs text-foreground-neutral-weaker">
              Free to get started, no credit card needed.
            </h6>
          </div>
        </div>
      </div>
    </main>
  );
}
