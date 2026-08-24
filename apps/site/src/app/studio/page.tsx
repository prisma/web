import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@prisma-docs/ui/components/json-ld";
import { Youtube } from "@prisma-docs/ui/components/youtube";
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";
import { ArrowRight } from "@/components/icons/forma";
import { createSoftwareApplicationStructuredData } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import { CopyCommand } from "./_components/copy-command";

// Rebuilt in the 2026 redesign language: wrapped-panel hero, paper surfaces,
// hairline borders, one accent (yellow: Studio ships with Prisma Postgres).
// The product mockups are dark assets from the old site, so they sit in ink
// frames; copy and links carry over from the previous page.

const CONSOLE_URL = "https://console.prisma.io/login";
const STUDIO_DOCS_URL = "https://www.prisma.io/docs/studio";
const TRY_STUDIO_COMMAND = `npx try-prisma@latest --template orm/starter \\
&& cd hello-prisma \\
&& npx prisma studio`;

const FEATURE_CARDS = [
  {
    title: "Quick access to your database",
    description:
      "Connect to your Prisma Postgres database or bring your own. Prisma Studio now lives right in the Prisma Console.",
    accent: "bg-prism-yellow-200",
  },
  {
    title: "No setup required",
    description:
      "Skip installation and go straight to your data. Your whole team can access and collaborate in one place.",
    accent: "bg-prism-yellow-300",
  },
  {
    title: "Real-time collaboration",
    description:
      "Work together on the same database in real time, with no local setup or configuration.",
    accent: "bg-prism-yellow-400",
  },
] as const;

const FEATURE_ROWS = [
  {
    eyebrow: "Runs anywhere",
    title: "Local or collaborative",
    description:
      "Access your database anywhere. Work locally for fast development or use the Console for team collaboration. Move between solo and team workflows.",
    imageSrc: "/illustrations/studio/laptop.svg",
    imageAlt: "Prisma Studio interface showing local and collaborative workflows",
    imageWidth: 522,
    imageHeight: 295,
  },
  {
    eyebrow: "Data exploration",
    title: "Understand your data",
    description:
      "Browse your database visually with filters and search. Spot patterns and find what you need for debugging or schema changes, no SQL required.",
    imageSrc: "/illustrations/studio/explore.svg",
    imageAlt: "Prisma Studio data exploration interface with highlighted filters",
    imageWidth: 570,
    imageHeight: 275,
  },
  {
    eyebrow: "Advanced filtering",
    title: "Navigate complex relationships",
    description:
      "Explore data relationships with clickable, model-aware navigation. See how your records connect so your team can understand the database structure.",
    imageSrc: "/illustrations/studio/filter.svg",
    imageAlt: "Prisma Studio advanced filtering interface",
    imageWidth: 598,
    imageHeight: 235,
  },
  {
    eyebrow: "Multiple tabs",
    title: "Switch contexts instantly",
    description:
      "Find exactly what you need with precise filtering. Combine filters and operators to surface records from complex data.",
    imageSrc: "/illustrations/studio/tabs.svg",
    imageAlt: "Prisma Studio with multiple tabs open",
    imageWidth: 561,
    imageHeight: 215,
  },
  {
    eyebrow: "Embedded data editing",
    title: "Embed in your own apps",
    description:
      "When using Prisma Postgres, you can integrate Studio directly into your own applications to give your users a data editing experience.",
    imageSrc: "/illustrations/studio/embed.svg",
    imageAlt: "Embedded Prisma Studio experience inside an app",
    imageWidth: 582,
    imageHeight: 224,
  },
] as const;

const studioStructuredData = createSoftwareApplicationStructuredData({
  path: "/studio",
  name: "Prisma Studio",
  description:
    "Visual database browser and editor for Prisma. Explore and edit your data with a model-aware interface, locally or in the Prisma Console.",
});

export const metadata: Metadata = {
  title: "Prisma Studio",
  description:
    "Explore, edit, and understand your data with a visual database browser for Prisma, locally or in Prisma Console.",
};

export default function StudioPage() {
  return (
    <>
      <JsonLd id="studio-software-application" data={studioStructuredData} />

      {/* Hero: wrapped-panel title band, yellow wash only (one accent per page) */}
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[24rem] overflow-hidden"
          >
            <div
              className="absolute -bottom-1/2 left-1/2 h-full w-[140%] -translate-x-1/2"
              style={{
                background: [
                  "radial-gradient(50% 62% at 30% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 18%, transparent), transparent 70%)",
                  "radial-gradient(44% 54% at 56% 100%, color-mix(in srgb, var(--color-prism-yellow-100) 30%, transparent), transparent 68%)",
                  "radial-gradient(40% 48% at 78% 100%, color-mix(in srgb, var(--color-prism-yellow-400) 14%, transparent), transparent 70%)",
                ].join(","),
              }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-transparent to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />

          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-14 pt-32 text-center md:pb-16 md:pt-44">
              <RoleKicker color="bg-prism-yellow-300" className="justify-center">
                Prisma Studio
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[20ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                Explore and understand your data
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                A visual browser and editor for the data in your Prisma project. Work locally or
                team up inside the Prisma Console.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <PrismButton href={CONSOLE_URL} size="lg">
                  Explore Studio in Prisma Console
                </PrismButton>
                <PrismButtonOutline href={STUDIO_DOCS_URL} size="lg">
                  Try locally
                </PrismButtonOutline>
              </div>

              {/* dark product mockup in an ink frame */}
              <div className="mt-14 w-full max-w-5xl rounded-2xl bg-[#151515] p-2 shadow-[0_16px_40px_-20px_rgba(21,21,21,0.35)] sm:p-3">
                <Image
                  src="/illustrations/studio/hero.svg"
                  alt="Prisma Studio interface showing a filterable table view of database records"
                  width={966}
                  height={270}
                  className="h-auto w-full rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three ways in: card grid with accent top bars */}
      <section className="bg-white px-4 pt-14 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(21,21,21,0.04)] sm:p-7"
            >
              <span aria-hidden className={`absolute left-0 top-0 h-1 w-full ${card.accent}`} />
              <h2 className="text-lg leading-snug">{card.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature tour: alternating two-column rows, mockups in ink frames */}
      <section className="bg-white px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-site flex-col gap-16 sm:gap-20">
          {FEATURE_ROWS.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
                index % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="max-w-[52ch]">
                <RoleKicker color="bg-prism-yellow-300">{feature.eyebrow}</RoleKicker>
                <h2 className="mt-3 text-balance text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
                  {feature.title}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <div className="rounded-2xl bg-[#151515] p-2 shadow-[0_12px_32px_-18px_rgba(21,21,21,0.3)] sm:p-3">
                <Image
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  width={feature.imageWidth}
                  height={feature.imageHeight}
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video walkthrough */}
      <section className="bg-white px-4 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[44ch]">
              <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">
                See how Studio works
              </h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                Access Prisma Studio on your local machine during development, or in the Prisma
                Console to collaborate on data with your team.
              </p>
            </div>
            <a
              href={CONSOLE_URL}
              className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-prism-yellow-700"
            >
              Explore Studio in Console
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[#151515] shadow-[0_12px_32px_-18px_rgba(21,21,21,0.3)] [&>iframe]:block [&>iframe]:w-full">
            <Youtube videoId="s3NS9KBRMcQ" width="100%" title="See how Prisma Studio works" />
          </div>
        </div>
      </section>

      {/* Try it out: ink terminal card */}
      <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <div>
            <h2 className="text-[clamp(1.5rem,2.25vw,2rem)] leading-[1.15]">Try it out</h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Take Studio for a spin with a local pre-seeded database and example project.
            </p>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl bg-[#151515] p-6 text-left shadow-[0_16px_40px_-20px_rgba(21,21,21,0.4)] sm:p-7">
            <span aria-hidden className="absolute left-0 top-0 h-1 w-full bg-prism-yellow-300" />
            <CopyCommand text={TRY_STUDIO_COMMAND} />
            <pre className="overflow-x-auto pr-12 font-mono text-sm leading-7 text-[#f9faf5]">
              <code>{TRY_STUDIO_COMMAND}</code>
            </pre>
          </div>
        </div>
      </section>
    </>
  );
}
