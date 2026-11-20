import { createPageMetadata } from "@/lib/page-metadata";
import Image from "next/image";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { PrismButtonOutline } from "@/components/brand/prism-button";
import { ProductHero } from "@/components/product/product-hero";
import { ArrowRight, CheckBold } from "@/components/icons/forma";
import { Faq } from "@/components/sections/faq";
import {
  createFaqStructuredData,
  createSoftwareApplicationStructuredData,
} from "@/lib/structured-data";
import { CompareTable } from "@/app/compare/compare-table";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { BrowserFrame } from "./_components/browser-frame";
import { CommandBox } from "./_components/command-box";
import { StudioTour } from "./_components/studio-tour";
import {
  OPEN_STUDIO_COMMAND,
  QUICK_ACCESS,
  STUDIO_COMPARISON,
  STUDIO_EMBED,
  STUDIO_FAQ,
  STUDIO_HERO,
  STUDIO_TOUR,
  TRY_STUDIO_STEPS,
} from "./studio-content";

// Rebuilt in the 2026 redesign language: the shared ProductHero, paper surfaces,
// hairline borders, one accent (yellow: Studio ships with Prisma Postgres).
// Every screenshot is captured from one local instance of the latest Studio
// and shown in the same light browser frame: hero, feature tour and embed. The
// released CLI (`prisma@prev`) can trail that build by a version, so small UI
// details, such as the logo, may differ from what a visitor's command opens.

const studioStructuredData = createSoftwareApplicationStructuredData({
  path: "/studio",
  name: "Prisma Studio",
  description:
    "Prisma Studio is a free visual editor for PostgreSQL, MySQL and SQLite. Browse, edit and query your data, with or without Prisma ORM, locally or in Prisma Console.",
});

const studioFaqStructuredData = createFaqStructuredData(
  "/studio",
  [...STUDIO_FAQ],
  "Prisma Studio FAQ",
);

export const metadata = createPageMetadata({
  title: "Prisma Studio | Free Postgres GUI to View and Edit Data",
  description:
    "Prisma Studio is a free visual editor for PostgreSQL, MySQL and SQLite. Browse and edit rows, run SQL and map your schema, locally or in Prisma Console.",
  path: "/studio",
  ogKicker: "Prisma Studio",
});

export default function StudioPage() {
  return (
    <>
      <JsonLd id="studio-software-application" data={studioStructuredData} />
      <JsonLd id="studio-faq" data={studioFaqStructuredData} />

      {/* Hero: the shared product-page hero (copy left, Studio right) */}
      <ProductHero
        name="Database GUI"
        accent="postgres"
        hero={STUDIO_HERO}
        visualAspect={false}
        // The product carries this page, so the screenshot gets the larger
        // share of the split from xl up. At lg (1024–1279) an even split keeps
        // the copy wide enough (~430px) for both buttons on one line; below
        // lg the hero stacks.
        columns="lg:grid-cols-2 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
        // No custom actions: the shared hero's two buttons, like the other
        // product pages. "Get started" jumps to the launch commands below;
        // "Open Prisma Console" is the shortcut for people who already have a
        // Prisma Postgres database. VS Code and the docs live in Quick access
        // and the site header.
        visual={
          <div className="flex w-full animate-hero-rise-late [contain:inline-size] motion-reduce:animate-none lg:h-full lg:items-center">
            {/* The same frame and capture size as the tour below, so every
                screenshot on the page reads as the same Studio. */}
            <figure className="w-full">
              <BrowserFrame>
                <Image
                  src="/illustrations/studio/hero.png"
                  alt="Prisma Studio at localhost:5555 showing the team_members table: names, on-call status, skills and job titles across 400 rows, with one title cell open for editing"
                  width={1040}
                  height={643}
                  sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 50vw, 100vw"
                  className="h-auto w-full"
                  // The LCP image. Next 16 deprecates `priority`; eager plus
                  // high fetch priority is its recommended replacement.
                  loading="eager"
                  fetchPriority="high"
                />
              </BrowserFrame>
            </figure>
          </div>
        }
      />

      {/* Quick access: the two ways to open Studio, side by side. The local
          path carries the launch commands; the Console path its benefits. */}
      <section aria-labelledby="quick-access" className="bg-white px-4 pt-20 sm:px-8 sm:pt-24">
        <div className="mx-auto max-w-site">
          <h2
            id="quick-access"
            className="scroll-mt-28 text-balance text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]"
          >
            {QUICK_ACCESS.title}
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            {QUICK_ACCESS.intro}
          </p>
          <div className="mt-10 grid gap-12 border-t border-black/[0.08] pt-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col items-start">
              <h3 className="text-lg leading-snug">{QUICK_ACCESS.local.title}</h3>
              <p className="mt-2 max-w-[46ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                {renderFaqAnswer(QUICK_ACCESS.local.description)}
              </p>
              <CommandBox
                className="mt-6"
                tabs={[
                  { label: "New example", steps: TRY_STUDIO_STEPS },
                  { label: "Any database", steps: [OPEN_STUDIO_COMMAND] },
                ]}
              />
              <p className="mt-3 max-w-[46ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                {QUICK_ACCESS.local.note}
              </p>
            </div>
            <div className="flex flex-col items-start lg:border-l lg:border-black/[0.08] lg:pl-16">
              <h3 className="text-lg leading-snug">{QUICK_ACCESS.console.title}</h3>
              <p className="mt-2 max-w-[46ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                {renderFaqAnswer(QUICK_ACCESS.console.description)}
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {QUICK_ACCESS.console.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-[0.9375rem] font-medium text-foreground"
                  >
                    <CheckBold
                      className="mt-0.5 size-4 shrink-0 text-prism-yellow-500"
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
              {/* The button, then the editor route as a quiet arrow link in
                  the hero links' style. */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <PrismButtonOutline href={QUICK_ACCESS.console.cta.href}>
                  {QUICK_ACCESS.console.cta.label}
                </PrismButtonOutline>
                <a
                  href={QUICK_ACCESS.console.secondaryCta.href}
                  className="group inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-prism-yellow-700"
                >
                  {QUICK_ACCESS.console.secondaryCta.label}
                  <ArrowRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature tour: heading and feature list on the left, one large
          screenshot on the right (lg+); a plain stack below that. */}
      <section aria-labelledby="studio-tour" className="bg-white px-4 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-site">
          <StudioTour
            heading={STUDIO_TOUR.title}
            headingId="studio-tour"
            stops={STUDIO_TOUR.stops}
          />
        </div>
      </section>

      {/* Embed: Studio as a React component in your own app. Copy, use cases
          and links on the left, Studio inside an example host app on the
          right (lg+); a stack below that. Sits before the comparison, whose last row is
          embedding. */}
      <section aria-labelledby="studio-embed" className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto grid max-w-site items-center gap-12 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:gap-16 xl:gap-20">
          <div className="flex flex-col items-start">
            <h2
              id="studio-embed"
              className="text-balance text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]"
            >
              {STUDIO_EMBED.title}
            </h2>
            <p className="mt-4 max-w-[52ch] text-pretty leading-relaxed text-muted-foreground">
              {renderFaqAnswer(STUDIO_EMBED.intro)}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {STUDIO_EMBED.useCases.map((useCase) => (
                <li
                  key={useCase}
                  className="flex items-start gap-2.5 text-[0.9375rem] font-medium text-foreground"
                >
                  <CheckBold className="mt-0.5 size-4 shrink-0 text-prism-yellow-500" aria-hidden />
                  {useCase}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[52ch] text-pretty text-sm leading-relaxed text-muted-foreground">
              {STUDIO_EMBED.facts}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PrismButtonOutline href={STUDIO_EMBED.cta.href}>
                {STUDIO_EMBED.cta.label}
              </PrismButtonOutline>
              <a
                href={STUDIO_EMBED.demo.href}
                className="group inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-prism-yellow-700"
              >
                {STUDIO_EMBED.demo.label}
                <ArrowRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden
                />
              </a>
            </div>
          </div>
          <div className="min-w-0">
            <BrowserFrame address={STUDIO_EMBED.address}>
              <Image
                src={STUDIO_EMBED.imageSrc}
                alt={STUDIO_EMBED.imageAlt}
                width={1040}
                height={643}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="h-auto w-full"
              />
            </BrowserFrame>
          </div>
        </div>
      </section>

      {/* Comparison: Studio next to the database GUIs people search it
          against. Every cell is a checked fact (see STUDIO_COMPARISON). The
          answer-prose wrapper only lends the table its cell padding and the
          card stacking below 640px, same as the /compare pages. */}
      <section aria-labelledby="studio-compare" className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-site">
          <h2
            id="studio-compare"
            className="text-balance text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]"
          >
            {STUDIO_COMPARISON.title}
          </h2>
          <p className="mt-4 max-w-[60ch] text-pretty leading-relaxed text-muted-foreground">
            {STUDIO_COMPARISON.intro}
          </p>
          <div className="answer-prose mt-10">
            <CompareTable
              labelledBy="studio-compare"
              corner={STUDIO_COMPARISON.corner}
              columns={STUDIO_COMPARISON.columns}
              // Monochrome so five brand colours don't fight the page's one
              // accent; the names beside them carry the meaning.
              columnIcons={STUDIO_COMPARISON.columnLogos.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 shrink-0 object-contain opacity-85"
                />
              ))}
              rows={STUDIO_COMPARISON.rows}
              minWidth="60rem"
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {STUDIO_COMPARISON.note} Sources:{" "}
            {STUDIO_COMPARISON.sources.map((source, i) => (
              <span key={source.href}>
                {i > 0 ? ", " : null}
                <a
                  href={source.href}
                  className="underline decoration-black/25 underline-offset-4 transition-colors hover:text-foreground hover:decoration-black/50"
                >
                  {source.label}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      <div className="bg-white">
        <Faq heading="Prisma Studio FAQ" items={STUDIO_FAQ} id="faq" />
      </div>
    </>
  );
}
