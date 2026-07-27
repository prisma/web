import { createPageMetadata } from "@/lib/page-metadata";
import {
  createCollectionPageStructuredData,
  createSoftwareApplicationStructuredData,
} from "@/lib/structured-data";
import { Button, Card } from "@prisma/eclipse";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import type { ReactNode } from "react";
import { CopyCommand } from "./copy-command";
import { HeroVisual } from "./hero-visual";
import { highlightJourney } from "./journey/highlight";
import { JourneyPlayer } from "./journey/journey-player";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { StackPyramid } from "./stack-pyramid";
import {
  agentPoints,
  dataOutcomes,
  runtimeOutcomes,
  stackLayers,
  swapLayers,
  type Outcome,
} from "./stack-data";
import styles from "./stack.module.css";

const title = "Prisma Stack: the connected TypeScript stack";
const description =
  "Build and ship TypeScript applications on one connected stack: Prisma Compute for hosting, Bun as the runtime, Prisma ORM for type-safe data access, and Prisma Postgres as the database.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/stack",
  ogImage: "/og/og-stack.png",
});

const SCAFFOLD_COMMAND = "npm create prisma@next";

const stackStructuredData = [
  createSoftwareApplicationStructuredData({
    path: "/stack",
    name: "Prisma Stack",
    description,
  }),
  createCollectionPageStructuredData({
    path: "/stack",
    name: "Prisma Stack products",
    description:
      "The connected layers of the Prisma Stack: Prisma Compute, Bun, Prisma ORM, and Prisma Postgres.",
    items: stackLayers.map((layer) => ({
      name: layer.name,
      url: layer.link.href,
      description: layer.description,
    })),
  }),
];

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      {eyebrow ? <span className="type-title-sm text-foreground-ppg">{eyebrow}</span> : null}
      <h2 className="type-title-4xl m-0 text-balance text-foreground-neutral">{title}</h2>
      {children ? <p className="m-0 text-lg text-foreground-neutral-weak">{children}</p> : null}
    </Reveal>
  );
}

const chipTone = {
  ok: "border-stroke-ppg/40 bg-background-ppg text-foreground-ppg-strong [&>i]:text-foreground-ppg",
  bad: "border-stroke-error/40 bg-background-error text-foreground-error [&>i]:text-foreground-error",
  neutral:
    "border-stroke-neutral bg-background-neutral-weaker text-foreground-neutral-weak [&>i]:text-foreground-ppg",
};

/**
 * One claim, one card, one destination. The icon sits on its own row so the
 * title and body share a left edge, and the whole card is a link with a
 * visible CTA naming where it goes.
 */
function OutcomeCard({ icon, title, body, visual, link }: Outcome) {
  return (
    <a href={link.href} className="group block h-full no-underline">
      <Card className="h-full gap-3 bg-[linear-gradient(180deg,var(--color-background-default)_0%,var(--color-background-ppg)_262.5%)] p-6 transition-colors group-hover:border-stroke-ppg/50">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-square border border-stroke-ppg/40 bg-background-ppg text-foreground-ppg"
          aria-hidden
        >
          <i className={icon} />
        </span>
        <h3 className="type-title-lg m-0 text-foreground-neutral">{title}</h3>
        <p className="m-0 text-sm text-foreground-neutral-weak">{body}</p>
        {visual ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {visual.map((chip) => (
              <li
                key={chip.label}
                className={`flex items-center gap-2 rounded-square border px-2.5 py-1.5 font-mono text-xs ${chipTone[chip.tone ?? "neutral"]}`}
              >
                <i className={chip.icon} aria-hidden />
                {chip.label}
              </li>
            ))}
          </ul>
        ) : null}
        <span className="mt-auto inline-flex w-fit items-center gap-2 pt-1 text-sm font-medium text-foreground-ppg group-hover:underline">
          {link.label}
          <i
            className="fa-regular fa-arrow-right transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Card>
    </a>
  );
}

export default async function StackPage() {
  const journeyCodes = await highlightJourney();

  return (
    <main className={`${styles.page} flex-1 bg-background-default text-foreground-neutral`}>
      <JsonLd id="stack-structured-data" data={stackStructuredData} />

      {/* ===== 1. HERO ===== */}
      <div className="hero relative -mt-24 px-4 pt-40">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(180deg,var(--color-foreground-ppg)_0%,var(--color-background-default)_100%)] opacity-20" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/illustrations/homepage/footer_grid.svg')] opacity-60" />
        <div className="relative z-2 mx-auto grid w-full max-w-296 items-center gap-12 pb-8 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <span className="type-title-sm flex items-center gap-2 text-foreground-ppg-weak">
              <i className="fa-regular fa-layer-group" aria-hidden />
              Prisma Stack
            </span>
            <h1
              className={`${styles["hero-title"]} stretch-display m-0 font-sans-display text-4xl text-foreground-neutral sm:text-5xl md:text-6xl`}
            >
              <span>The connected</span> <span>TypeScript stack</span>
            </h1>
            <p className="m-0 max-w-xl text-lg text-foreground-neutral-weak">
              An application runtime, a Postgres database, and a type-safe data layer that arrive
              already connected. Fewer dependencies, less configuration, one command to start.
            </p>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <CopyCommand command={SCAFFOLD_COMMAND} />
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="ppg" size="xl">
                  <a href="/docs/next" className="flex items-center gap-2">
                    Start building
                    <i className="fa-regular fa-arrow-right" aria-hidden />
                  </a>
                </Button>
                <Button asChild variant="default-strong" size="xl">
                  <a href="#stack" className="flex items-center gap-2">
                    Explore the stack
                    <i className="fa-regular fa-arrow-down" aria-hidden />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <HeroVisual />
        </div>
      </div>

      <div className={styles.content}>
        {/* ===== 2. INTERACTIVE STACK PYRAMID ===== */}
        <section id="stack" className="scroll-mt-24 px-4 py-14 md:py-20">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead
              eyebrow="The stack, simplified"
              title="Prisma plus your framework is the whole stack"
            >
              Hosting, runtime, data access, and database ship as one connected platform, so the
              only decision left open is your framework. The alternative is stitching those layers
              together from four vendors, where every seam adds configuration and something new to
              break.
            </SectionHead>
            <Reveal>
              <StackPyramid />
            </Reveal>
          </div>
        </section>

        {/* ===== 3. HOW IT WORKS ===== */}
        <section id="how-it-works" className="scroll-mt-24 px-4 py-14 md:py-20">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
            <SectionHead eyebrow="How it works" title="From empty folder to production">
              One command scaffolds the app, the database, the typed client, and the deploy target.
              Step through what happens next.
            </SectionHead>
            <Reveal>
              <JourneyPlayer codes={journeyCodes} />
            </Reveal>
          </div>
        </section>

        {/* ===== 4. OPINIONATED, REPLACEABLE ===== */}
        <section className="px-4 py-14 md:py-20">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead
              eyebrow="Your stack, your call"
              title="Opinionated by default, replaceable by design"
            >
              The happy path is one command and no glue code. But every layer is a default, not a
              requirement: the stack works as a whole, and each piece works alone.
            </SectionHead>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {swapLayers.map((item) => (
                <Reveal key={item.layer}>
                  <a href={item.link.href} className="group block h-full no-underline">
                    <SpotlightCard className="flex h-full flex-col gap-3 rounded-square-high border border-stroke-neutral bg-background-default p-6 transition-colors group-hover:border-stroke-ppg/50">
                      <span className="text-xs font-semibold uppercase tracking-wider text-foreground-neutral-weaker">
                        {item.layer}
                      </span>
                      {item.logo ? (
                        <span
                          className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-square border border-stroke-neutral bg-white p-1.5"
                          aria-hidden
                        >
                          <img
                            src={item.logo}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                          />
                        </span>
                      ) : (
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-square border border-stroke-ppg/40 bg-background-ppg text-foreground-ppg"
                          aria-hidden
                        >
                          <i className={item.icon} />
                        </span>
                      )}
                      <p className="m-0 font-sans-display text-lg font-bold text-foreground-neutral">
                        {item.defaultChoice}
                      </p>
                      <p className="m-0 text-sm text-foreground-neutral-weak">
                        <span className="font-semibold text-foreground-ppg">Or swap it: </span>
                        {item.swap}
                      </p>
                      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                        {item.swapTargets.map((target) => (
                          <li
                            key={target.alt}
                            className="flex items-center gap-2 rounded-square border border-stroke-neutral px-2.5 py-1.5 text-xs text-foreground-neutral-weak"
                          >
                            <span
                              className="grid size-5 shrink-0 place-items-center overflow-hidden rounded-square-low border border-stroke-neutral bg-white p-0.5"
                              aria-hidden
                            >
                              <img
                                src={target.src}
                                alt=""
                                className={`max-h-full max-w-full object-contain ${target.invert ? "invert" : ""}`}
                              />
                            </span>
                            {target.alt}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex w-fit items-center gap-2 pt-1 text-sm font-medium text-foreground-ppg group-hover:underline">
                        {item.link.label}
                        <i
                          className="fa-regular fa-arrow-right transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </SpotlightCard>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5. DATABASE AND DATA ACCESS ===== */}
        <section className="px-4 py-14 md:py-20">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead
              eyebrow="Prisma Next + Prisma Postgres"
              title="One schema, typed all the way down"
            >
              The data layer is one piece: the database, the migrations, and the client all derive
              from the same schema.
            </SectionHead>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {dataOutcomes.map((outcome) => (
                <Reveal key={outcome.title}>
                  <OutcomeCard {...outcome} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 6. RUNTIME AND DEPLOYMENT ===== */}
        <section className="px-4 py-14 md:py-20">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead eyebrow="Prisma Compute + Bun" title="Deploy the way you develop">
              Prisma Compute runs your app on Bun in production, so the runtime you develop against
              is the runtime that serves traffic.
            </SectionHead>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {runtimeOutcomes.map((outcome) => (
                <Reveal key={outcome.title}>
                  <OutcomeCard {...outcome} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 7. DEVELOPERS AND AGENTS ===== */}
        <section className="px-4 py-14 md:py-20">
          <div className="mx-auto flex w-full max-w-296 flex-col gap-10">
            <SectionHead eyebrow="Built for developers and agents" title="A stack agents can read">
              Agent-driven development works when a project is explicit. The Prisma Stack keeps its
              structure, contracts, and workflows in plain files that an agent can read, change, and
              verify.
            </SectionHead>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {agentPoints.map((point) => (
                <Reveal key={point.title}>
                  <OutcomeCard {...point} />
                </Reveal>
              ))}
            </div>
            <Reveal className="flex justify-center">
              <a
                href="/docs/ai"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground-ppg hover:underline"
              >
                See how to build with Prisma and AI tools
                <i className="fa-regular fa-arrow-right" aria-hidden />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ===== 8. FINAL CTA ===== */}
        <div className="relative rounded-full bg-[url('/illustrations/homepage/footer_grid.svg')] bg-center before:pointer-events-none before:absolute before:inset-x-30 before:inset-y-[40%] before:-z-1 before:rounded-full before:bg-teal-400 before:blur-[100px] before:content-['']">
          <section id="start" className="scroll-mt-24 px-4 py-16 md:py-20">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <h2 className="type-title-2xl m-0 text-foreground-neutral">
                  Stop configuring. Start shipping.
                </h2>
                <p className="m-0 max-w-lg text-foreground-neutral-weak">
                  One command gives you a running application, a Prisma Postgres database, a typed
                  Prisma Next client, and a deploy target on Prisma Compute. Connected from the
                  first minute.
                </p>
              </div>
              <CopyCommand command={SCAFFOLD_COMMAND} />
              <div className="flex flex-col gap-4 md:flex-row">
                <Button asChild variant="ppg" size="2xl">
                  <a href="/docs/next" className="flex items-center gap-2">
                    Read the docs
                    <i className="fa-regular fa-book-open" aria-hidden />
                  </a>
                </Button>
                <Button asChild variant="default-strong" size="2xl">
                  <a href="https://console.prisma.io" className="flex items-center gap-2">
                    Open the Console
                    <i className="fa-regular fa-arrow-right" aria-hidden />
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
