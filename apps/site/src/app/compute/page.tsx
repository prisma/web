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
          Connect a GitHub repo. Prisma Compute discovers your services and deploys them in seconds.
        </p>
        <ul className="text-foreground-neutral text-sm space-y-2 m-0 pl-4 list-disc">
          <li>
            <code className="font-mono text-foreground-ppg-reverse-weak">prisma deploy</code> from
            the CLI, or push to a connected branch
          </li>
          <li>No CI/CD pipeline to configure</li>
          <li>No deployment scripts, no dashboard workflows</li>
          <li>What&apos;s in your repo is what runs in production</li>
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
          <li>No cold starts</li>
          <li>No execution timeouts</li>
          <li>No connection limits</li>
          <li>WebSockets, streaming, long-running jobs without workarounds</li>
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
          Standard TypeScript on Bun. No V8 isolate limits. No runtime constraints.
        </p>
        <ul className="text-foreground-neutral text-sm space-y-2 m-0 pl-4 list-disc">
          <li>Backend APIs and full-stack apps</li>
          <li>Background workers and data pipelines</li>
          <li>Scheduled and cron jobs</li>
          <li>Real-time / WebSocket servers</li>
          <li>AI agents, retrieval, LLM orchestration</li>
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
          Pair with Prisma Postgres; compute and database run in the same region, connected
          automatically.
        </p>
        <ul className="text-foreground-neutral text-sm space-y-2 m-0 pl-4 list-disc">
          <li>No connection strings to copy</li>
          <li>No networking to configure</li>
          <li>Built-in connection pooling for long-lived processes</li>
          <li>Works with any database — no lock-in</li>
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
      "Connect your repo and deploy. Your assets are served by your app the way they are when self-hosting Next, with cache headers under control.",
    icon: "fa-regular fa-n",
    badgeColor: "ppg" as const,
  },
  {
    title: "Running a Hono, Express, or Fastify API?",
    description:
      "Long-lived processes are the default. No workarounds for WebSockets or streaming. Sockets stay open. Streams flow uninterrupted.",
    icon: "fa-regular fa-rocket",
    badgeColor: "success" as const,
  },
  {
    title: "Running background jobs or workers?",
    description:
      "They run as long-lived processes alongside your API. Same repo, same runtime, same bill — no separate worker tier to pay for.",
    icon: "fa-regular fa-clock-rotate-left",
    badgeColor: "success" as const,
  },
  {
    title: "Building an AI agent?",
    description:
      "Per-session sandboxes, long-lived runtimes, co-located memory. See the AI workloads section above for the full take.",
    icon: "fa-regular fa-stars",
    badgeColor: "ppg" as const,
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
      "If your bill is split across compute, edge, image opt, and bandwidth, Compute collapses it into one. One service, one rate, one invoice.",
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
        From GitHub to live in seconds. No build pipelines to configure.
      </div>
    ),
    icon: "fa-regular fa-rocket",
    row: "top" as const,
  },
  {
    id: "no-cold-starts",
    title: "No cold starts",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        No timeouts, no connection limits. Long-lived processes only.
      </div>
    ),
    icon: "fa-regular fa-infinity",
    row: "top" as const,
  },
  {
    id: "any-ts-workload",
    title: "Any TS workload",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        APIs, background workers, scheduled jobs, WebSockets, AI agents, sandboxes.
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
    title: "DB connected by default",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        Co-located with Prisma Postgres for ultra-low latency. Works with any database.
      </div>
    ),
    icon: "fa-regular fa-database",
    row: "center" as const,
  },
  {
    id: "reliable",
    title: "Reliable by design",
    children: (
      <div className="px-4 pb-4 text-sm text-foreground-neutral-weak">
        Automatic scaling, automatic recovery, automatic handling of OOM conditions.
      </div>
    ),
    icon: "fa-regular fa-shield-check",
    row: "center" as const,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Prisma Compute",
    description:
      "Deploy TypeScript to production. Push code, it runs. Long-running processes, background jobs, APIs, and AI agents — no cold starts, no timeouts.",
    openGraph: {
      title: "Prisma Compute",
      description:
        "Deploy TypeScript to production. Push code, it runs. Long-running processes, background jobs, APIs, and AI agents — no cold starts, no timeouts.",
      url: "https://www.prisma.io/compute",
      type: "website",
      siteName: "Prisma",
      images: [
        {
          url: "/og/og-compute.png",
          width: 1200,
          height: 630,
          alt: "Prisma Compute",
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
            <h1 className="mb-0 text-center mt-0 type-title-6xl text-foreground-neutral max-w-4xl mx-auto">
              Deploy TypeScript
              <br /> to production
            </h1>
          </div>
          <p className="text-center text-foreground-neutral max-w-3xl mx-auto text-xl">
            <b>Push code. It runs.</b> Long-running processes, background jobs, APIs, AI agents.
          </p>
          <p className="text-2xs uppercase font-medium tracking-[1.1px] text-foreground-neutral-weak text-center mx-auto! -mt-5">
            $1 per million requests. Volume discounts apply.
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
            Built for the way TypeScript actually runs.
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
          {DOES_IT_WORK.map((item) => (
            <Card
              key={item.title}
              className={cn(
                item.badgeColor === "ppg"
                  ? "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg-strong)_262.5%)] border-stroke-ppg/40"
                  : "bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)]",
              )}
            >
              <div className="flex items-center justify-between">
                <Action color="neutral" size="lg">
                  <i className={cn(item.icon, "text-sm")} />
                </Action>
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
              </div>
              <div>
                <h3 className="text-foreground-neutral type-title-md m-0 mb-2">{item.title}</h3>
                <p className="text-foreground-neutral-weak text-sm m-0">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section className="flex flex-col items-center gap-12 py-12 px-8">
        <div className="flex flex-col gap-3 max-w-296 w-full items-start">
          <span className="font-mono text-xs text-foreground-ppg uppercase tracking-wider">
            04 / WHAT MAKES IT UNIQUE
          </span>
          <h2 className="type-title-4xl text-foreground-neutral m-0 text-left">
            Compute keeps it all together.
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-6 max-w-296 w-full">
          <div className="w-full lg:flex-1 h-auto">
            <ThemFragmentedCard />
          </div>
          <div className="w-full lg:flex-1 h-auto">
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
          <p className="text-left text-sm mt-6 text-foreground-neutral-weak">
            Already have a codebase?{" "}
            <a
              href="https://prisma.io/docs/compute"
              className="underline text-foreground-ppg-strong underline-offset-2"
            >
              Connect your GitHub repo →
            </a>
          </p>
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
                We wanted a deployment platform that felt as good as the code we were writing. Push
                a repo, get a URL, and stop thinking about infrastructure.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button asChild variant="ppg" size="2xl">
                <a href="https://pris.ly/compute-blog" className="flex gap-2 items-center">
                  <span>Read the launch post</span>
                  <i className="fa-regular h-auto fa-arrow-right" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="default-strong" size="2xl">
                <a href="https://prisma.io/docs/compute" className="flex gap-2 items-center">
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
